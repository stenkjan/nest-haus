/**
 * Sessions Timeline API
 * 
 * Returns session counts by day for the last 30 days
 * Includes comparison with previous 30 days
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(now.getDate() - 60);

    // Get sessions for last 60 days (for comparison)
    const sessions = await prisma.userSession.findMany({
      where: {
        createdAt: {
          gte: sixtyDaysAgo
        }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group by date
    const sessionsByDate = new Map<string, number>();
    
    sessions.forEach(session => {
      const date = session.createdAt.toISOString().split('T')[0];
      sessionsByDate.set(date, (sessionsByDate.get(date) || 0) + 1);
    });

    // Generate arrays for last 30 days
    const dates: string[] = [];
    const currentPeriodSessions: number[] = [];
    const previousPeriodSessions: number[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      dates.push(dateStr);
      currentPeriodSessions.push(sessionsByDate.get(dateStr) || 0);
      
      // Get same day from previous period
      const prevDate = new Date(date);
      prevDate.setDate(date.getDate() - 30);
      const prevDateStr = prevDate.toISOString().split('T')[0];
      previousPeriodSessions.push(sessionsByDate.get(prevDateStr) || 0);
    }

    // Calculate percent change
    const currentTotal = currentPeriodSessions.reduce((sum, count) => sum + count, 0);
    const previousTotal = previousPeriodSessions.reduce((sum, count) => sum + count, 0);
    const percentChange = previousTotal > 0 
      ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        dates,
        sessions: currentPeriodSessions,
        comparison: {
          previous: previousPeriodSessions,
          percentChange,
          currentTotal,
          previousTotal
        }
      },
      metadata: {
        period: '30 days',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Failed to fetch sessions timeline:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sessions timeline',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

