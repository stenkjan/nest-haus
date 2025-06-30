/**
 * Enhanced Session Interaction Tracking API
 * 
 * Week 1 Implementation: Real-time user interaction tracking
 * Captures detailed user behavior for analytics and optimization
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SessionManager } from '@/lib/redis';

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

    // 1. Store interaction in PostgreSQL (primary storage)
    const interactionEvent = await prisma.interactionEvent.create({
      data: {
        sessionId,
        eventType,
        category,
        elementId,
        selectionValue,
        previousValue,
        timeSpent,
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

    // 2. Update Redis session cache (real-time data)
    await SessionManager.trackClick(sessionId, {
      timestamp: Date.now(),
      category,
      selection: selectionValue || elementId || 'unknown',
      timeSpent: timeSpent || 0,
      eventType,
      elementId
    });

    // 3. Track performance metric
    const processingTime = Date.now() - startTime;
    await prisma.performanceMetric.create({
      data: {
        sessionId,
        metricName: 'interaction_tracking_time',
        value: processingTime,
        endpoint: '/api/sessions/track-interaction',
        userAgent: request.headers.get('user-agent'),
        additionalData: {
          eventType,
          category,
          responseTime: processingTime
        }
      }
    });

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
          timeSpent: interaction.timeSpent
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