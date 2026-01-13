/**
 * Configuration Success Analytics API
 * 
 * Analyzes which configurations lead to conversions
 * Helps identify winning combinations for optimization
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30d';

    // Calculate date range
    const now = new Date();
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Get all sessions with configurations
    const sessions = await prisma.userSession.findMany({
      where: {
        createdAt: { gte: startDate },
        configurationData: { not: Prisma.JsonNull },
      },
      select: {
        id: true,
        configurationData: true,
        totalPrice: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get conversions (inquiries)
    const conversions = await prisma.customerInquiry.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        sessionId: true,
      },
    });

    const conversionSessionIds = new Set(conversions.map(c => c.sessionId).filter(Boolean));

    // Aggregate by nest type
    const nestTypeStats = new Map<string, {
      count: number;
      conversionCount: number;
      totalPrice: number;
      totalTime: number;
    }>();

    // Aggregate by price range
    const priceRanges = [
      { range: '< €150k', min: 0, max: 150000 },
      { range: '€150k - €200k', min: 150000, max: 200000 },
      { range: '€200k - €250k', min: 200000, max: 250000 },
      { range: '> €250k', min: 250000, max: Infinity },
    ];

    const priceRangeStats = new Map(priceRanges.map(r => [r.range, { count: 0, conversionCount: 0 }]));

    // Aggregate material combinations
    const materialCombos = new Map<string, {
      gebaeudehuelle: string;
      innenverkleidung: string;
      fussboden: string;
      count: number;
      conversionCount: number;
    }>();

    sessions.forEach(session => {
      const config = session.configurationData as Record<string, unknown>;
      const isConversion = conversionSessionIds.has(session.id);

      // Extract nest type
      const nestData = config?.nest as { value?: string } | undefined;
      const nestType = nestData?.value || 'unknown';

      if (!nestTypeStats.has(nestType)) {
        nestTypeStats.set(nestType, {
          count: 0,
          conversionCount: 0,
          totalPrice: 0,
          totalTime: 0,
        });
      }

      const nestStats = nestTypeStats.get(nestType)!;
      nestStats.count++;
      if (isConversion) nestStats.conversionCount++;
      nestStats.totalPrice += session.totalPrice || 0;

      const timeSpent = session.updatedAt.getTime() - session.createdAt.getTime();
      nestStats.totalTime += timeSpent / 1000; // Convert to seconds

      // Aggregate by price range
      const price = (session.totalPrice || 0) / 100; // Convert cents to euros
      for (const range of priceRanges) {
        if (price >= range.min && price < range.max) {
          const stats = priceRangeStats.get(range.range);
          if (stats) {
            stats.count++;
            if (isConversion) stats.conversionCount++;
          }
          break;
        }
      }

      // Aggregate material combinations
      const gebaeudehuelleData = config?.gebaeudehuelle as { value?: string } | undefined;
      const innenverkleidungData = config?.innenverkleidung as { value?: string } | undefined;
      const fussbodenData = config?.fussboden as { value?: string } | undefined;

      const gebaeudehuelle = gebaeudehuelleData?.value || 'unknown';
      const innenverkleidung = innenverkleidungData?.value || 'unknown';
      const fussboden = fussbodenData?.value || 'unknown';

      const comboKey = `${gebaeudehuelle}|${innenverkleidung}|${fussboden}`;
      if (!materialCombos.has(comboKey)) {
        materialCombos.set(comboKey, {
          gebaeudehuelle,
          innenverkleidung,
          fussboden,
          count: 0,
          conversionCount: 0,
        });
      }

      const combo = materialCombos.get(comboKey)!;
      combo.count++;
      if (isConversion) combo.conversionCount++;
    });

    // Format nest type data
    const byNestType = Array.from(nestTypeStats.entries()).map(([nestType, stats]) => ({
      nestType,
      count: stats.count,
      conversionCount: stats.conversionCount,
      conversionRate: stats.count > 0 ? Math.round((stats.conversionCount / stats.count) * 100 * 10) / 10 : 0,
      avgPrice: stats.count > 0 ? Math.round(stats.totalPrice / stats.count) : 0,
      avgTimeSpent: stats.count > 0 ? Math.round(stats.totalTime / stats.count) : 0,
    })).sort((a, b) => b.conversionRate - a.conversionRate);

    // Format price range data
    const byPriceRange = Array.from(priceRangeStats.entries()).map(([range, stats]) => ({
      range,
      count: stats.count,
      conversionCount: stats.conversionCount,
      conversionRate: stats.count > 0 ? Math.round((stats.conversionCount / stats.count) * 100 * 10) / 10 : 0,
    }));

    // Format material combinations
    const topMaterialCombos = Array.from(materialCombos.values())
      .map(combo => ({
        ...combo,
        conversionRate: combo.count > 0 ? Math.round((combo.conversionCount / combo.count) * 100 * 10) / 10 : 0,
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate);

    // Calculate averages
    const totalConfigurations = sessions.length;
    const totalConversions = conversions.length;
    const totalTime = sessions.reduce((sum, s) => {
      return sum + (s.updatedAt.getTime() - s.createdAt.getTime()) / 1000;
    }, 0);
    const avgCompletionTime = totalConfigurations > 0 ? totalTime / totalConfigurations : 0;

    return NextResponse.json({
      success: true,
      data: {
        byNestType,
        byPriceRange,
        topMaterialCombos,
        totalConfigurations,
        totalConversions,
        avgCompletionTime,
      },
    });

  } catch (error) {
    console.error('Configuration success analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch configuration analytics',
      },
      { status: 500 }
    );
  }
}
