/**
 * Traffic Sources API
 * 
 * Returns breakdown of traffic sources (direct, Google, referrals, UTM)
 * Includes trend indicators
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

    // Get sessions with traffic source data
    const currentSessions = await prisma.userSession.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        trafficSource: true,
        referralDomain: true
      }
    });

    const previousSessions = await prisma.userSession.findMany({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      },
      select: {
        trafficSource: true,
        referralDomain: true
      }
    });

    // Count by traffic source
    const countBySource = (sessions: typeof currentSessions) => {
      const counts = new Map<string, number>();
      const referrals = new Map<string, number>();

      sessions.forEach(session => {
        const source = session.trafficSource || 'direct';
        counts.set(source, (counts.get(source) || 0) + 1);

        if (source === 'referral' && session.referralDomain) {
          referrals.set(session.referralDomain, (referrals.get(session.referralDomain) || 0) + 1);
        }
      });

      return { counts, referrals };
    };

    const current = countBySource(currentSessions);
    const previous = countBySource(previousSessions);

    const totalCurrent = currentSessions.length;

    // Calculate metrics with change indicators
    const getMetrics = (source: string) => {
      const currentCount = current.counts.get(source) || 0;
      const previousCount = previous.counts.get(source) || 0;
      const change = previousCount > 0
        ? Math.round(((currentCount - previousCount) / previousCount) * 100)
        : 0;
      
      return {
        count: currentCount,
        percentage: totalCurrent > 0 ? Math.round((currentCount / totalCurrent) * 100) : 0,
        change
      };
    };

    // Top referral domains
    const topReferrals = Array.from(current.referrals.entries())
      .map(([domain, count]) => {
        const previousCount = previous.referrals.get(domain) || 0;
        const change = previousCount > 0
          ? Math.round(((count - previousCount) / previousCount) * 100)
          : 0;
        
        return { domain, count, change };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        direct: getMetrics('direct'),
        google: getMetrics('google'),
        bing: getMetrics('bing'),
        social: {
          facebook: getMetrics('facebook'),
          instagram: getMetrics('instagram'),
          linkedin: getMetrics('linkedin'),
          twitter: getMetrics('twitter')
        },
        referrals: topReferrals,
        utm: getMetrics('utm'),
        totalSessions: totalCurrent
      },
      metadata: {
        period: '30 days',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Failed to fetch traffic sources:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch traffic sources',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

