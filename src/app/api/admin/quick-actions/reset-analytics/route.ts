import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';

/**
 * Reset Analytics Data API
 * 
 * Deletes all session tracking, interaction events, and Redis cache
 * Admin-only endpoint with authentication check
 */
export async function POST() {
  try {
    // Authentication check
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword) {
      const cookieStore = await cookies();
      const authCookie = cookieStore.get('nest-haus-admin-auth');

      if (!authCookie || authCookie.value !== adminPassword) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const stats = {
      sessions: 0,
      interactions: 0,
      selections: 0,
      metrics: 0,
      redisKeys: 0,
    };

    // Delete all interaction events first (due to foreign key constraints)
    const deletedInteractions = await prisma.interactionEvent.deleteMany({});
    stats.interactions = deletedInteractions.count;

    // Delete all selection events
    const deletedSelections = await prisma.selectionEvent.deleteMany({});
    stats.selections = deletedSelections.count;

    // Delete all performance metrics
    const deletedMetrics = await prisma.performanceMetric.deleteMany({});
    stats.metrics = deletedMetrics.count;

    // Delete all sessions
    const deletedSessions = await prisma.userSession.deleteMany({});
    stats.sessions = deletedSessions.count;

    // Clear Redis session data
    const sessionKeys = await redis.keys('session:*');
    if (sessionKeys.length > 0) {
      await redis.del(...sessionKeys);
      stats.redisKeys += sessionKeys.length;
    }

    // Clear Redis analytics data
    const analyticsKeys = await redis.keys('analytics:*');
    if (analyticsKeys.length > 0) {
      await redis.del(...analyticsKeys);
      stats.redisKeys += analyticsKeys.length;
    }

    // Clear Redis content session data
    const contentKeys = await redis.keys('content_session:*');
    if (contentKeys.length > 0) {
      await redis.del(...contentKeys);
      stats.redisKeys += contentKeys.length;
    }

    return NextResponse.json({
      success: true,
      message: 'All analytics data reset successfully',
      stats,
    });

  } catch (error) {
    console.error('Error resetting analytics data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

