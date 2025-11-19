/**
 * Sessions Timeline API
 * 
 * Returns session counts and unique user counts by day
 * Includes comparison with previous period
 * 
 * Query params:
 * - period: 'today' | '7d' | '30d' | 'all' (default: '30d')
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d';
    
    const now = new Date();
    let daysToFetch = 30;
    let startDate = new Date(now);
    
    // Determine date range based on period
    switch (period) {
      case 'today':
        daysToFetch = 1;
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7d':
        daysToFetch = 7;
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        daysToFetch = 30;
        startDate.setDate(now.getDate() - 30);
        break;
      case 'all':
        // Fetch all sessions to determine earliest date
        const earliestSession = await prisma.userSession.findFirst({
          orderBy: { createdAt: 'asc' },
          select: { createdAt: true }
        });
        
        if (earliestSession) {
          startDate = new Date(earliestSession.createdAt);
          daysToFetch = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          daysToFetch = 30; // Default fallback
          startDate.setDate(now.getDate() - 30);
        }
        break;
      default:
        daysToFetch = 30;
        startDate.setDate(now.getDate() - 30);
    }
    
    // For comparison, fetch double the period
    const comparisonStartDate = new Date(startDate);
    comparisonStartDate.setDate(startDate.getDate() - daysToFetch);

    // Get all sessions for current and comparison periods
    const sessions = await prisma.userSession.findMany({
      where: {
        createdAt: {
          gte: comparisonStartDate
        }
      },
      select: {
        createdAt: true,
        userIdentifier: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group by date - track sessions and unique users
    const sessionsByDate = new Map<string, number>();
    const uniqueUsersByDate = new Map<string, Set<string>>();
    
    sessions.forEach(session => {
      const date = session.createdAt.toISOString().split('T')[0];
      
      // Count sessions
      sessionsByDate.set(date, (sessionsByDate.get(date) || 0) + 1);
      
      // Track unique users (by userIdentifier)
      if (!uniqueUsersByDate.has(date)) {
        uniqueUsersByDate.set(date, new Set());
      }
      if (session.userIdentifier) {
        uniqueUsersByDate.get(date)?.add(session.userIdentifier);
      }
    });

    // Generate arrays for the requested period
    const dates: string[] = [];
    const currentPeriodSessions: number[] = [];
    const currentPeriodUniqueUsers: number[] = [];
    const previousPeriodSessions: number[] = [];
    const previousPeriodUniqueUsers: number[] = [];

    for (let i = daysToFetch - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      
      dates.push(dateStr);
      currentPeriodSessions.push(sessionsByDate.get(dateStr) || 0);
      currentPeriodUniqueUsers.push(uniqueUsersByDate.get(dateStr)?.size || 0);
      
      // Get same day from previous period
      const prevDate = new Date(date);
      prevDate.setDate(date.getDate() - daysToFetch);
      const prevDateStr = prevDate.toISOString().split('T')[0];
      previousPeriodSessions.push(sessionsByDate.get(prevDateStr) || 0);
      previousPeriodUniqueUsers.push(uniqueUsersByDate.get(prevDateStr)?.size || 0);
    }

    // Calculate percent change (based on sessions)
    const currentTotal = currentPeriodSessions.reduce((sum, count) => sum + count, 0);
    const previousTotal = previousPeriodSessions.reduce((sum, count) => sum + count, 0);
    const percentChange = previousTotal > 0 
      ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
      : 0;
    
    // Calculate unique users totals
    const currentUniqueUsersTotal = currentPeriodUniqueUsers.reduce((sum, count) => sum + count, 0);
    const previousUniqueUsersTotal = previousPeriodUniqueUsers.reduce((sum, count) => sum + count, 0);

    return NextResponse.json({
      success: true,
      data: {
        dates,
        sessions: currentPeriodSessions,
        uniqueUsers: currentPeriodUniqueUsers,
        comparison: {
          previous: previousPeriodSessions,
          previousUniqueUsers: previousPeriodUniqueUsers,
          percentChange,
          currentTotal,
          previousTotal,
          currentUniqueUsersTotal,
          previousUniqueUsersTotal
        }
      },
      metadata: {
        period,
        daysShown: daysToFetch,
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

