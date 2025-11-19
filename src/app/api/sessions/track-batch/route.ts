/**
 * Batch Analytics Tracking API
 * 
 * Accepts batched interaction events to reduce database writes
 * Processes multiple events in a single transaction
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SessionManager } from '@/lib/redis';

interface BatchedInteractionEvent {
  sessionId: string;
  eventType: string;
  category: string;
  elementId?: string;
  selectionValue?: string;
  previousValue?: string;
  timeSpent?: number;
  deviceInfo?: {
    type: string;
    width: number;
    height: number;
  };
}

interface BatchRequest {
  events: BatchedInteractionEvent[];
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchRequest = await request.json();
    const { events } = body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({
        error: 'Missing or invalid events array'
      }, { status: 400 });
    }

    console.log(`📦 Processing batch of ${events.length} events...`);
    const startTime = Date.now();

    // Group events by sessionId for efficient processing
    const eventsBySession = new Map<string, BatchedInteractionEvent[]>();
    for (const event of events) {
      if (!eventsBySession.has(event.sessionId)) {
        eventsBySession.set(event.sessionId, []);
      }
      eventsBySession.get(event.sessionId)!.push(event);
    }

    // Process each session's events
    const results = await Promise.all(
      Array.from(eventsBySession.entries()).map(async ([sessionId, sessionEvents]) => {
        try {
          // 1. Ensure session exists (upsert)
          await prisma.userSession.upsert({
            where: { sessionId },
            update: { lastActivity: new Date() },
            create: {
              sessionId,
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              referrer: request.headers.get('referer'),
              status: 'ACTIVE'
            }
          });

          // 2. Batch create interaction events in PostgreSQL
          const createdEvents = await prisma.interactionEvent.createMany({
            data: sessionEvents.map(event => ({
              sessionId,
              eventType: event.eventType,
              category: event.category,
              elementId: event.elementId,
              selectionValue: event.selectionValue,
              previousValue: event.previousValue,
              timeSpent: event.timeSpent ? BigInt(Math.round(event.timeSpent)) : null,
              deviceType: event.deviceInfo?.type,
              viewportWidth: event.deviceInfo?.width,
              viewportHeight: event.deviceInfo?.height,
              additionalData: {
                userAgent: request.headers.get('user-agent'),
                referer: request.headers.get('referer'),
                timestamp: new Date().toISOString(),
                batchProcessed: true
              }
            }))
          });

          // 3. Update Redis cache with latest event
          const latestEvent = sessionEvents[sessionEvents.length - 1];
          await SessionManager.trackClick(sessionId, {
            timestamp: Date.now(),
            category: latestEvent.category,
            selection: latestEvent.selectionValue || latestEvent.elementId || 'unknown',
            timeSpent: latestEvent.timeSpent || 0,
            eventType: latestEvent.eventType,
            elementId: latestEvent.elementId
          });

          return {
            sessionId,
            eventsProcessed: createdEvents.count,
            success: true
          };
        } catch (error) {
          console.error(`❌ Failed to process events for session ${sessionId}:`, error);
          return {
            sessionId,
            eventsProcessed: 0,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    const processingTime = Date.now() - startTime;
    const totalProcessed = results.reduce((sum, r) => sum + r.eventsProcessed, 0);
    const successCount = results.filter(r => r.success).length;

    console.log(`✅ Batch processed: ${totalProcessed}/${events.length} events in ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      message: 'Batch processed successfully',
      data: {
        totalEvents: events.length,
        eventsProcessed: totalProcessed,
        sessionsProcessed: successCount,
        failedSessions: results.length - successCount,
        processingTime,
        results
      }
    });

  } catch (error) {
    console.error('❌ Batch processing failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to process batch',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint for batch status/monitoring
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({
        error: 'Missing sessionId parameter'
      }, { status: 400 });
    }

    // Get batch-processed events count
    const batchEvents = await prisma.interactionEvent.count({
      where: {
        sessionId,
        additionalData: {
          path: ['batchProcessed'],
          equals: true
        }
      }
    });

    // Get total events
    const totalEvents = await prisma.interactionEvent.count({
      where: { sessionId }
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        totalEvents,
        batchProcessedEvents: batchEvents,
        individualEvents: totalEvents - batchEvents,
        batchingEfficiency: totalEvents > 0 ? Math.round((batchEvents / totalEvents) * 100) : 0
      }
    });

  } catch (error) {
    console.error('❌ Failed to retrieve batch status:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve batch status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

