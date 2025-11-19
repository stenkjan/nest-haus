/**
 * Background Job: Redis to PostgreSQL Analytics Flush
 * 
 * Runs every 30 seconds to flush hot analytics data from Redis to PostgreSQL
 * Can be triggered manually or run as a cron job
 */

import { SessionManager } from '@/lib/redis';
import { prisma } from '@/lib/prisma';

interface AnalyticsEvent {
  eventType: string;
  category: string;
  elementId?: string;
  value?: string;
  timestamp: number;
}

/**
 * Flush analytics events from Redis to PostgreSQL
 */
export async function flushAnalytics(): Promise<{
  success: boolean;
  sessionsFlushed: number;
  eventsFlushed: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let sessionsFlushed = 0;
  let eventsFlushed = 0;

  try {
    console.log('🔄 Starting analytics flush from Redis to PostgreSQL...');

    // Get all sessions with pending analytics
    const pendingSessions = await SessionManager.getPendingAnalyticsSessions();
    console.log(`📊 Found ${pendingSessions.length} sessions with pending events`);

    for (const sessionId of pendingSessions) {
      try {
        // Get events for this session
        const events = await SessionManager.getAnalyticsEvents(sessionId) as AnalyticsEvent[];
        
        if (events.length === 0) {
          // No events to flush, just clear the pending flag
          await SessionManager.clearAnalyticsEvents(sessionId);
          continue;
        }

        console.log(`📝 Flushing ${events.length} events for session ${sessionId}`);

        // Ensure session exists in PostgreSQL
        await prisma.userSession.upsert({
          where: { sessionId },
          update: { lastActivity: new Date() },
          create: {
            sessionId,
            ipAddress: 'unknown',
            userAgent: 'unknown',
            status: 'ACTIVE'
          }
        });

        // Batch insert interaction events
        const interactionData = events.map(event => ({
          sessionId,
          eventType: event.eventType,
          category: event.category,
          elementId: event.elementId,
          selectionValue: event.value,
          timestamp: new Date(event.timestamp),
          additionalData: {
            flushedFromRedis: true,
            flushTimestamp: new Date().toISOString()
          }
        }));

        await prisma.interactionEvent.createMany({
          data: interactionData,
          skipDuplicates: true
        });

        // Clear Redis after successful flush
        await SessionManager.clearAnalyticsEvents(sessionId);

        sessionsFlushed++;
        eventsFlushed += events.length;

        console.log(`✅ Flushed ${events.length} events for session ${sessionId}`);
      } catch (sessionError) {
        const errorMsg = `Failed to flush session ${sessionId}: ${sessionError instanceof Error ? sessionError.message : 'Unknown error'}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    console.log(`🎉 Flush complete: ${sessionsFlushed} sessions, ${eventsFlushed} events`);

    return {
      success: errors.length === 0,
      sessionsFlushed,
      eventsFlushed,
      errors
    };
  } catch (error) {
    console.error('❌ Analytics flush failed:', error);
    return {
      success: false,
      sessionsFlushed,
      eventsFlushed,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Manual trigger endpoint (for testing or manual invocation)
 */
export async function manualFlush(): Promise<void> {
  console.log('🔧 Manual analytics flush triggered');
  const result = await flushAnalytics();
  console.log('Result:', result);
}

// Export for use in API routes or cron jobs
export default flushAnalytics;

