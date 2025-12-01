import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/bot-analysis
 * 
 * Returns comprehensive bot analysis statistics
 */
export async function GET() {
  try {
    // Total sessions
    const totalSessions = await prisma.userSession.count();

    // Bot vs human breakdown
    const botSessions = await prisma.userSession.count({
      where: { isBot: true },
    });

    const realUserSessions = await prisma.userSession.count({
      where: {
        OR: [
          { isBot: false },
          { isBot: null, qualityScore: { gte: 0.6 } }, // High quality unknowns
        ],
      },
    });

    const unknownSessions = await prisma.userSession.count({
      where: {
        isBot: null,
        OR: [
          { qualityScore: null },
          { qualityScore: { lt: 0.6 } },
        ],
      },
    });

    // USA sessions breakdown
    const usaTotalSessions = await prisma.userSession.count({
      where: {
        OR: [
          { country: 'US' },
          { country: 'USA' },
        ],
      },
    });

    const usaBots = await prisma.userSession.count({
      where: {
        OR: [
          { country: 'US' },
          { country: 'USA' },
        ],
        isBot: true,
      },
    });

    const usaRealUsers = await prisma.userSession.count({
      where: {
        OR: [
          { country: 'US' },
          { country: 'USA' },
        ],
        AND: [
          {
            OR: [
              { isBot: false },
              { isBot: null, qualityScore: { gte: 0.6 } },
            ],
          },
        ],
      },
    });

    // Get top bot user-agents
    const botDetections = await prisma.botDetection.findMany({
      select: {
        userAgent: true,
        reasons: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 100,
    });

    // Count bot types
    const botTypes: Record<string, number> = {};
    botDetections.forEach((detection) => {
      const ua = detection.userAgent?.toLowerCase() || '';
      if (ua.includes('googlebot')) botTypes.googlebot = (botTypes.googlebot || 0) + 1;
      else if (ua.includes('bingbot')) botTypes.bingbot = (botTypes.bingbot || 0) + 1;
      else if (ua.includes('vercel')) botTypes.vercel = (botTypes.vercel || 0) + 1;
      else if (ua.includes('crawler') || ua.includes('spider')) botTypes.crawler = (botTypes.crawler || 0) + 1;
      else botTypes.other = (botTypes.other || 0) + 1;
    });

    // Geographic distribution
    const countryStats = await prisma.userSession.groupBy({
      by: ['country', 'isBot'],
      _count: {
        id: true,
      },
      where: {
        country: {
          not: null,
        },
      },
    });

    const geoDistribution = countryStats.reduce((acc, stat) => {
      const country = stat.country || 'Unknown';
      if (!acc[country]) {
        acc[country] = { total: 0, bots: 0, realUsers: 0 };
      }
      acc[country].total += stat._count.id;
      if (stat.isBot === true) {
        acc[country].bots += stat._count.id;
      } else if (stat.isBot === false) {
        acc[country].realUsers += stat._count.id;
      }
      return acc;
    }, {} as Record<string, { total: number; bots: number; realUsers: number }>);

    return NextResponse.json({
      summary: {
        totalSessions,
        botSessions,
        realUserSessions,
        unknownSessions,
        botPercentage: (botSessions / totalSessions) * 100,
        realUserPercentage: (realUserSessions / totalSessions) * 100,
      },
      usaSessions: {
        total: usaTotalSessions,
        bots: usaBots,
        realUsers: usaRealUsers,
        unknown: usaTotalSessions - usaBots - usaRealUsers,
        botPercentage: (usaBots / usaTotalSessions) * 100,
      },
      botTypes,
      geoDistribution,
      ga4Comparison: {
        ga4ActiveUsers: 78,
        adminTotalSessions: totalSessions,
        adminRealUserSessions: realUserSessions,
        expectedAlignment: `Admin ${realUserSessions} ≈ GA4 78`,
        alignmentPercentage: (78 / realUserSessions) * 100,
      },
    });
  } catch (error) {
    console.error('Error fetching bot analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bot analysis' },
      { status: 500 }
    );
  }
}

