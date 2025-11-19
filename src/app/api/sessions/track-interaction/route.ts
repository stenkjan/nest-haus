/**
 * Enhanced Session Interaction Tracking API
 * 
 * Week 1 Implementation: Real-time user interaction tracking
 * Captures detailed user behavior for analytics and optimization
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SessionManager } from '@/lib/redis';
import { getLocationFromIP, parseReferrer } from '@/services/geolocation-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, interaction } = body;

    if (!sessionId || !interaction) {
      return NextResponse.json({
        error: 'Missing required fields: sessionId, interaction'
      }, { status: 400 });
    }

    const {
      eventType,
      category,
      elementId,
      selectionValue,
      previousValue,
      timeSpent,
      deviceInfo
    } = interaction;

    // Validate required fields
    if (!eventType || !category) {
      return NextResponse.json({
        error: 'Missing required interaction fields: eventType, category'
      }, { status: 400 });
    }

    const startTime = Date.now();

    // Get IP address and geolocation data
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const referrer = request.headers.get('referer');

    // Fetch geolocation data (with caching)
    const locationData = await getLocationFromIP(ipAddress);
    const trafficData = parseReferrer(referrer);

    // 1. Ensure session exists using upsert pattern (prevents foreign key constraint violations)
    await prisma.userSession.upsert({
      where: { sessionId },
      update: {
        lastActivity: new Date(),
        // Update location data if not already set
        ...(locationData && {
          country: locationData.country,
          city: locationData.city,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        }),
        ...(trafficData && {
          trafficSource: trafficData.source,
          trafficMedium: trafficData.medium,
          referralDomain: trafficData.referralDomain,
        }),
      },
      create: {
        sessionId,
        ipAddress,
        userAgent: request.headers.get('user-agent') || 'unknown',
        referrer,
        // Add geolocation data on creation
        ...(locationData && {
          country: locationData.country,
          city: locationData.city,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        }),
        ...(trafficData && {
          trafficSource: trafficData.source,
          trafficMedium: trafficData.medium,
          referralDomain: trafficData.referralDomain,
        }),
        status: 'ACTIVE'
      }
    });

    // 2. Store interaction in PostgreSQL (primary storage)
    const interactionEvent = await prisma.interactionEvent.create({
      data: {
        sessionId,
        eventType,
        category,
        elementId,
        selectionValue,
        previousValue,
        timeSpent: timeSpent ? Number(timeSpent) : null,
        deviceType: deviceInfo?.type,
        viewportWidth: deviceInfo?.width,
        viewportHeight: deviceInfo?.height,
        additionalData: {
          userAgent: request.headers.get('user-agent'),
          referer: request.headers.get('referer'),
          timestamp: new Date().toISOString()
        }
      }
    });

    // 3. Update Redis session cache (real-time data)
    const timeSpentNumber: number = timeSpent ? Number(timeSpent) : 0;
    await SessionManager.trackClick(sessionId, {
      timestamp: Date.now(),
      category,
      selection: selectionValue || elementId || 'unknown',
      timeSpent: timeSpentNumber,
      eventType,
      elementId
    });

    // Performance metric tracking removed - was creating unnecessary DB writes
    // Only track performance for critical operations (price calc, image load, page load)
    const processingTime = Date.now() - startTime;
    console.log(`🎯 Interaction tracked: ${eventType} on ${category} (${processingTime}ms)`);

    return NextResponse.json({
      success: true,
      message: 'Interaction tracked successfully',
      data: {
        interactionId: interactionEvent.id,
        sessionId,
        eventType,
        category,
        processingTime,
        timestamp: interactionEvent.timestamp
      }
    });

  } catch (error) {
    console.error('❌ Interaction tracking failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to track interaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({
        error: 'Missing sessionId parameter'
      }, { status: 400 });
    }

    // Retrieve interaction history for session
    const interactions = await prisma.interactionEvent.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
      take: 100 // Limit to last 100 interactions
    });

    // Get session performance metrics
    const performanceMetrics = await prisma.performanceMetric.findMany({
      where: {
        sessionId,
        metricName: 'interaction_tracking_time'
      },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    const averageProcessingTime = performanceMetrics.length > 0
      ? performanceMetrics.reduce((sum, metric) => sum + metric.value, 0) / performanceMetrics.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        interactionCount: interactions.length,
        interactions: interactions.map(interaction => ({
          id: interaction.id,
          eventType: interaction.eventType,
          category: interaction.category,
          elementId: interaction.elementId,
          selectionValue: interaction.selectionValue,
          timestamp: interaction.timestamp,
          timeSpent: interaction.timeSpent ? Number(interaction.timeSpent) : null
        })),
        performance: {
          averageProcessingTime: Math.round(averageProcessingTime * 100) / 100,
          trackingEfficiency: averageProcessingTime < 50 ? 'excellent' : averageProcessingTime < 100 ? 'good' : 'needs_optimization'
        }
      }
    });

  } catch (error) {
    console.error('❌ Failed to retrieve interactions:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve interactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 