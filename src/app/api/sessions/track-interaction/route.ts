/**
 * Enhanced Session Interaction Tracking API
 * 
 * Week 1 Implementation: Real-time user interaction tracking
 * Captures detailed user behavior for analytics and optimization
 * 
 * Week 2: Added user deduplication by IP+UserAgent to track unique users
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SessionManager } from '@/lib/redis';
import { getLocationFromIP, parseReferrer } from '@/services/geolocation-service';
import crypto from 'crypto';

/**
 * Generate userIdentifier hash from IP + UserAgent
 * This allows us to track unique users across multiple sessions
 */
function generateUserIdentifier(ipAddress: string, userAgent: string): string {
  const combined = `${ipAddress}|${userAgent}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

/**
 * Check if two dates are on the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

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
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Fetch geolocation data (with caching)
    const locationData = await getLocationFromIP(ipAddress);
    const trafficData = parseReferrer(referrer);

    // Generate userIdentifier for deduplication
    const userIdentifier = generateUserIdentifier(ipAddress, userAgent);

    // 1. Check if we have an existing session for this user TODAY
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingSessionToday = await prisma.userSession.findFirst({
      where: {
        userIdentifier,
        startTime: {
          gte: today
        }
      },
      orderBy: {
        lastVisitDate: 'desc'
      }
    });

    // 2. Ensure session exists using upsert pattern with deduplication logic
    if (existingSessionToday && isSameDay(existingSessionToday.lastVisitDate, new Date())) {
      // Same user, same day - just update activity timestamp
      // DON'T increment visitCount on every interaction - only on new sessions
      
      // Check if current sessionId is different from the existing session
      const isNewSessionId = existingSessionToday.sessionId !== sessionId;
      
      if (isNewSessionId) {
        // This is a new browser session for the same user today (e.g., opened new tab)
        // Update the existing session and also create/update the new sessionId
        // Both should share the same userIdentifier and visitCount
        
        // First, update the canonical session with latest activity
        await prisma.userSession.update({
          where: { id: existingSessionToday.id },
          data: {
            lastActivity: new Date(),
            // Update location data if not already set
            ...(locationData && !existingSessionToday.country && {
              country: locationData.country,
              city: locationData.city,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
            }),
          }
        });
        
        // Then ensure the new sessionId exists and inherits the user's visitCount
        await prisma.userSession.upsert({
          where: { sessionId },
          update: {
            lastActivity: new Date(),
            userIdentifier,
          },
          create: {
            sessionId,
            ipAddress,
            userAgent,
            referrer,
            userIdentifier,
            visitCount: existingSessionToday.visitCount, // Inherit visitCount from canonical session
            lastVisitDate: new Date(),
            ...(locationData && {
              country: locationData.country,
              city: locationData.city,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
            }),
            ...(trafficData && {
              trafficSource: trafficData.source,
              trafficMedium: trafficData.medium,
              referralDomain: trafficData.domain,
            }),
            status: 'ACTIVE'
          }
        });
      } else {
        // Same sessionId as existing - just update activity
        await prisma.userSession.update({
          where: { id: existingSessionToday.id },
          data: {
            lastActivity: new Date(),
            // Update location data if not already set
            ...(locationData && !existingSessionToday.country && {
              country: locationData.country,
              city: locationData.city,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
            }),
          }
        });
      }
    } else {
      // New session (either new user or same user on different day)
      // Increment visitCount ONLY when it's a new day for existing user
      const isNewDay = existingSessionToday && !isSameDay(existingSessionToday.lastVisitDate, new Date());
      
      // Get the current visitCount for this user if they exist
      const currentVisitCount = existingSessionToday?.visitCount || 0;
      
      await prisma.userSession.upsert({
        where: { sessionId },
        update: {
          lastActivity: new Date(),
          lastVisitDate: new Date(),
          userIdentifier,
          // Only increment visitCount if it's a new day for this user
          ...(isNewDay && {
            visitCount: {
              increment: 1
            }
          }),
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
            referralDomain: trafficData.domain,
          }),
        },
        create: {
          sessionId,
          ipAddress,
          userAgent,
          referrer,
          userIdentifier,
          visitCount: isNewDay ? currentVisitCount + 1 : 1, // Increment for returning user, 1 for new user
          lastVisitDate: new Date(),
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
            referralDomain: trafficData.domain,
          }),
          status: 'ACTIVE'
        }
      });
    }

    // 3. Store interaction in PostgreSQL (primary storage)
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

    // 4. Update Redis session cache (real-time data)
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