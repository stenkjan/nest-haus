/**
 * API Route: Trigger Analytics Flush
 * 
 * Manually trigger Redis-to-PostgreSQL analytics flush
 * Can also be called by a cron job (e.g., Vercel Cron)
 */

import { NextRequest, NextResponse } from 'next/server';
import { flushAnalytics } from '@/lib/analytics/flush-analytics';

export async function POST(_request: NextRequest) {
  try {
    console.log('📡 Analytics flush triggered via API');
    
    const result = await flushAnalytics();

    return NextResponse.json({
      success: result.success,
      message: `Flushed ${result.eventsFlushed} events from ${result.sessionsFlushed} sessions`,
      data: result
    });
  } catch (error) {
    console.error('❌ Flush API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to flush analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint for status check
export async function GET(_request: NextRequest) {
  try {
    // Import here to avoid issues
    const { SessionManager } = await import('@/lib/redis');
    
    const pendingSessions = await SessionManager.getPendingAnalyticsSessions();
    
    return NextResponse.json({
      success: true,
      data: {
        pendingSessions: pendingSessions.length,
        status: 'ready'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

