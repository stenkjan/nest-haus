/**
 * Campaign Performance API
 * 
 * Tracks social media campaign performance with UTM parameters
 * Critical for Facebook/Instagram campaign ROI measurement
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '7d';

    // Calculate date range
    const now = new Date();
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Get all sessions within time range
    const sessions = await prisma.userSession.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        utmContent: true,
        referrer: true,
        trafficSource: true,
        createdAt: true,
        configurationData: true,
      },
    });

    // Get inquiries (conversions) within time range
    const inquiries = await prisma.customerInquiry.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        sessionId: true,
        requestType: true,
        createdAt: true,
      },
    });

    // Aggregate data by traffic source
    const sourceStats = new Map<string, {
      sessions: number;
      conversions: number;
      conversionRate: number;
      sources: Map<string, number>;
    }>();

    // Categorize sessions
    sessions.forEach(session => {
      let category = 'Direct';
      let sourceKey = 'direct';

      if (session.utmSource) {
        // UTM parameters present
        category = 'Paid Social';
        if (session.utmSource.toLowerCase().includes('facebook')) {
          sourceKey = 'facebook';
        } else if (session.utmSource.toLowerCase().includes('instagram')) {
          sourceKey = 'instagram';
        } else if (session.utmSource.toLowerCase().includes('google')) {
          sourceKey = 'google';
        } else {
          sourceKey = session.utmSource.toLowerCase();
        }
      } else if (session.trafficSource) {
        // Use traffic source field
        category = session.trafficSource;
        sourceKey = session.trafficSource.toLowerCase();
      } else if (session.referrer) {
        // Parse referrer
        try {
          const url = new URL(session.referrer);
          category = 'Referral';
          sourceKey = url.hostname.replace('www.', '');
        } catch {
          category = 'Direct';
          sourceKey = 'direct';
        }
      }

      if (!sourceStats.has(category)) {
        sourceStats.set(category, {
          sessions: 0,
          conversions: 0,
          conversionRate: 0,
          sources: new Map(),
        });
      }

      const stats = sourceStats.get(category)!;
      stats.sessions++;
      stats.sources.set(sourceKey, (stats.sources.get(sourceKey) || 0) + 1);
    });

    // Count conversions by source
    inquiries.forEach(inquiry => {
      if (inquiry.sessionId) {
        const session = sessions.find(s => s.id === inquiry.sessionId);
        if (session) {
          let category = 'Direct';
          if (session.utmSource) {
            category = 'Paid Social';
          } else if (session.trafficSource) {
            category = session.trafficSource;
          } else if (session.referrer) {
            category = 'Referral';
          }

          const stats = sourceStats.get(category);
          if (stats) {
            stats.conversions++;
          }
        }
      }
    });

    // Calculate conversion rates
    sourceStats.forEach(stats => {
      stats.conversionRate = stats.sessions > 0 
        ? (stats.conversions / stats.sessions) * 100 
        : 0;
    });

    // Convert to array and sort by sessions
    const performanceData = Array.from(sourceStats.entries())
      .map(([category, stats]) => ({
        category,
        sessions: stats.sessions,
        conversions: stats.conversions,
        conversionRate: Math.round(stats.conversionRate * 10) / 10,
        sources: Array.from(stats.sources.entries()).map(([source, count]) => ({
          source,
          count,
          percentage: Math.round((count / stats.sessions) * 100 * 10) / 10,
        })).sort((a, b) => b.count - a.count),
      }))
      .sort((a, b) => b.sessions - a.sessions);

    // Calculate totals
    const totalSessions = sessions.length;
    const totalConversions = inquiries.length;
    const overallConversionRate = totalSessions > 0 
      ? Math.round((totalConversions / totalSessions) * 100 * 10) / 10 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        timeRange,
        totalSessions,
        totalConversions,
        overallConversionRate,
        performanceBySource: performanceData,
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Campaign performance API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch campaign performance data',
      },
      { status: 500 }
    );
  }
}
