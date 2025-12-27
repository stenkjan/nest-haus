/**
 * Popular Configurations API - Real Database Integration
 * 
 * Fetches actual configuration data from UserSession and InteractionEvent tables
 * to provide real insights into customer preferences and popular house configurations.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Type definition for configuration data
interface ConfigurationData {
  nestType?: string;
  gebaeudehuelle?: string;
  innenverkleidung?: string;
  fussboden?: string;
  pvanlage?: string;
  fenster?: string;
  planungspaket?: string;
}

interface PopularConfigurationData {
  topConfigurations: Array<{
    id: string;
    nestType: string;
    gebaeudehuelle: string;
    innenverkleidung: string;
    fussboden: string;
    pvanlage: string;
    fenster: string;
    planungspaket: string;
    totalPrice: number;
    selectionCount: number;
    conversionRate: number;
    lastSelected: string;
    averagePrice: number;
  }>;
  priceDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  selectionStats: {
    nestTypes: Array<{ name: string; count: number; percentage: number }>;
    gebaeudehuelle: Array<{ name: string; count: number; percentage: number }>;
    innenverkleidung: Array<{ name: string; count: number; percentage: number }>;
    fussboden: Array<{ name: string; count: number; percentage: number }>;
    pvanlage: Array<{ name: string; count: number; percentage: number }>;
  };
  trends: {
    weekly: Array<{
      week: string;
      nest80: number;
      nest100: number;
      nest120: number;
    }>;
  };
  metadata: {
    totalConfigurations: number;
    dataRange: {
      from: string;
      to: string;
    };
    lastUpdated: string;
  };
}

// Define session type for better type safety
interface SessionWithConfig {
  configurationData: unknown;
  totalPrice: number | null;
  status: string;
  startTime: Date;
  endTime?: Date | null;
}

class PopularConfigurationsService {

  /**
   * Helper function to safely parse configuration data
   */
  private static parseConfigurationData(data: unknown): ConfigurationData | null {
    try {
      if (!data || typeof data !== 'object') return null;

      const config = data as Record<string, unknown>;

      // Helper to extract value from either direct string or nested object with value property
      const extractValue = (field: unknown): string | undefined => {
        if (typeof field === 'string') return field;
        if (field && typeof field === 'object' && 'value' in field) {
          const valueField = field as { value?: unknown };
          return typeof valueField.value === 'string' ? valueField.value : undefined;
        }
        return undefined;
      };

      return {
        // Handle both 'nestType' and 'nest' field names for backward compatibility
        nestType: extractValue(config.nestType) || extractValue(config.nest),
        gebaeudehuelle: extractValue(config.gebaeudehuelle),
        innenverkleidung: extractValue(config.innenverkleidung),
        fussboden: extractValue(config.fussboden),
        pvanlage: extractValue(config.pvanlage),
        fenster: extractValue(config.fenster),
        planungspaket: extractValue(config.planungspaket),
      };
    } catch (error) {
      console.error('Failed to parse configuration data:', error);
      return null;
    }
  }

  /**
   * Get top configurations based on selection frequency and conversion rates
   */
  static async getTopConfigurations(): Promise<PopularConfigurationData['topConfigurations']> {
    try {
      // Get all sessions with completed configurations - Get all and filter after
      const sessions = await prisma.userSession.findMany({
        select: {
          configurationData: true,
          totalPrice: true,
          status: true,
          startTime: true
        },
        orderBy: {
          startTime: 'desc'
        },
        take: 1000 // Get more and filter after
      });

      // Filter sessions that have configuration data
      const sessionsWithConfig = sessions.filter((session: { configurationData: unknown }) =>
        session.configurationData &&
        typeof session.configurationData === 'object' &&
        session.configurationData !== null
      );

      if (sessionsWithConfig.length === 0) {
        console.log('No sessions with configuration data found');
        return [];
      }

      // Group configurations by key attributes
      const configurationGroups = new Map<string, {
        configurations: SessionWithConfig[];
        totalSelections: number;
        conversions: number;
        prices: number[];
        lastSelected: Date;
        config: ConfigurationData;
      }>();

      sessionsWithConfig.forEach((session: SessionWithConfig) => {
        const config = this.parseConfigurationData(session.configurationData);
        if (!config || !config.nestType) return;

        // Create a unique key for this configuration type
        const key = `${config.nestType}-${config.gebaeudehuelle || 'Unknown'}-${config.innenverkleidung || 'Unknown'}`;

        if (!configurationGroups.has(key)) {
          configurationGroups.set(key, {
            configurations: [],
            totalSelections: 0,
            conversions: 0,
            prices: [],
            lastSelected: session.startTime,
            config
          });
        }

        const group = configurationGroups.get(key)!;
        group.configurations.push(session);
        group.totalSelections++;

        if (session.status === 'COMPLETED') {
          group.conversions++;
        }

        if (session.totalPrice && session.totalPrice > 0) {
          group.prices.push(session.totalPrice);
        }

        if (session.startTime > group.lastSelected) {
          group.lastSelected = session.startTime;
        }
      });

      // Convert to result format and sort by popularity
      const results = Array.from(configurationGroups.entries())
        .map(([key, group]) => ({
          id: key,
          nestType: group.config.nestType || 'Unknown',
          gebaeudehuelle: group.config.gebaeudehuelle || 'Unknown',
          innenverkleidung: group.config.innenverkleidung || 'Unknown',
          fussboden: group.config.fussboden || 'Unknown',
          pvanlage: group.config.pvanlage || 'None',
          fenster: group.config.fenster || 'Standard',
          planungspaket: group.config.planungspaket || 'Basic',
          totalPrice: group.prices.length > 0 ? Math.round(group.prices.reduce((a: number, b: number) => a + b, 0) / group.prices.length) : 0,
          selectionCount: group.totalSelections,
          conversionRate: group.totalSelections > 0 ? Math.round((group.conversions / group.totalSelections) * 100) / 100 : 0,
          lastSelected: group.lastSelected.toISOString(),
          averagePrice: group.prices.length > 0 ? Math.round(group.prices.reduce((a: number, b: number) => a + b, 0) / group.prices.length) : 0
        }))
        .sort((a, b) => b.selectionCount - a.selectionCount)
        .slice(0, 10); // Top 10 configurations

      return results;
    } catch (error) {
      console.error('❌ Failed to get top configurations:', error);
      return [];
    }
  }

  /**
   * Get price distribution analysis
   */
  static async getPriceDistribution(): Promise<PopularConfigurationData['priceDistribution']> {
    try {
      const sessions = await prisma.userSession.findMany({
        where: {
          totalPrice: {
            not: null,
            gt: 0
          }
        },
        select: {
          totalPrice: true
        }
      });

      const priceRanges = [
        { range: '100k-150k', min: 100000, max: 150000, count: 0 },
        { range: '150k-200k', min: 150000, max: 200000, count: 0 },
        { range: '200k-250k', min: 200000, max: 250000, count: 0 },
        { range: '250k-300k', min: 250000, max: 300000, count: 0 },
        { range: '300k+', min: 300000, max: Infinity, count: 0 }
      ];

      sessions.forEach((session: { totalPrice: number | null }) => {
        if (!session.totalPrice) return;
        const price = session.totalPrice;
        const range = priceRanges.find(r => price >= r.min && price < r.max);
        if (range) {
          range.count++;
        }
      });

      const total = sessions.length;
      return priceRanges.map(range => ({
        range: range.range,
        count: range.count,
        percentage: total > 0 ? Math.round((range.count / total) * 100) : 0
      }));
    } catch (error) {
      console.error('❌ Failed to get price distribution:', error);
      return [];
    }
  }

  /**
   * Get selection statistics for each category
   */
  static async getSelectionStats(): Promise<PopularConfigurationData['selectionStats']> {
    try {
      const allSessions = await prisma.userSession.findMany({
        select: {
          configurationData: true
        }
      });

      // Filter sessions that have configuration data
      const sessions = allSessions.filter((session: { configurationData: unknown }) =>
        session.configurationData &&
        typeof session.configurationData === 'object' &&
        session.configurationData !== null
      );

      const stats = {
        nestTypes: new Map<string, number>(),
        gebaeudehuelle: new Map<string, number>(),
        innenverkleidung: new Map<string, number>(),
        fussboden: new Map<string, number>(),
        pvanlage: new Map<string, number>()
      };

      sessions.forEach((session: { configurationData: unknown }) => {
        const config = this.parseConfigurationData(session.configurationData);
        if (!config) return;

        // Count each selection type
        if (config.nestType) {
          stats.nestTypes.set(config.nestType, (stats.nestTypes.get(config.nestType) || 0) + 1);
        }
        if (config.gebaeudehuelle) {
          stats.gebaeudehuelle.set(config.gebaeudehuelle, (stats.gebaeudehuelle.get(config.gebaeudehuelle) || 0) + 1);
        }
        if (config.innenverkleidung) {
          stats.innenverkleidung.set(config.innenverkleidung, (stats.innenverkleidung.get(config.innenverkleidung) || 0) + 1);
        }
        if (config.fussboden) {
          stats.fussboden.set(config.fussboden, (stats.fussboden.get(config.fussboden) || 0) + 1);
        }
        if (config.pvanlage) {
          stats.pvanlage.set(config.pvanlage, (stats.pvanlage.get(config.pvanlage) || 0) + 1);
        }
      });

      const total = sessions.length;

      const convertToArray = (map: Map<string, number>) =>
        Array.from(map.entries())
          .map(([name, count]) => ({
            name,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count);

      return {
        nestTypes: convertToArray(stats.nestTypes),
        gebaeudehuelle: convertToArray(stats.gebaeudehuelle),
        innenverkleidung: convertToArray(stats.innenverkleidung),
        fussboden: convertToArray(stats.fussboden),
        pvanlage: convertToArray(stats.pvanlage)
      };
    } catch (error) {
      console.error('❌ Failed to get selection stats:', error);
      return {
        nestTypes: [],
        gebaeudehuelle: [],
        innenverkleidung: [],
        fussboden: [],
        pvanlage: []
      };
    }
  }

  /**
   * Get weekly trends for Hoam types
   */
  static async getWeeklyTrends(): Promise<PopularConfigurationData['trends']['weekly']> {
    try {
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      const allSessions = await prisma.userSession.findMany({
        where: {
          startTime: {
            gte: fourWeeksAgo
          }
        },
        select: {
          startTime: true,
          configurationData: true
        },
        orderBy: {
          startTime: 'asc'
        }
      });

      // Filter sessions that have configuration data
      const sessions = allSessions.filter((session: { configurationData: unknown }) =>
        session.configurationData &&
        typeof session.configurationData === 'object' &&
        session.configurationData !== null
      );

      // Group by week
      const weeklyData = new Map<string, { nest80: number; nest100: number; nest120: number; total: number }>();

      sessions.forEach((session: { startTime: Date; configurationData: unknown }) => {
        const config = this.parseConfigurationData(session.configurationData);
        if (!config?.nestType) return;

        // Get week number
        const weekStart = new Date(session.startTime);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = `KW ${Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;

        if (!weeklyData.has(weekKey)) {
          weeklyData.set(weekKey, { nest80: 0, nest100: 0, nest120: 0, total: 0 });
        }

        const week = weeklyData.get(weekKey)!;
        week.total++;

        switch (config.nestType) {
          case 'Nest80':
            week.nest80++;
            break;
          case 'Nest100':
            week.nest100++;
            break;
          case 'Nest120':
            week.nest120++;
            break;
        }
      });

      // Convert to percentage
      return Array.from(weeklyData.entries())
        .map(([week, data]) => ({
          week,
          nest80: data.total > 0 ? Math.round((data.nest80 / data.total) * 100) : 0,
          nest100: data.total > 0 ? Math.round((data.nest100 / data.total) * 100) : 0,
          nest120: data.total > 0 ? Math.round((data.nest120 / data.total) * 100) : 0
        }))
        .sort((a, b) => a.week.localeCompare(b.week))
        .slice(-4); // Last 4 weeks
    } catch (error) {
      console.error('❌ Failed to get weekly trends:', error);
      return [];
    }
  }

  /**
   * Generate complete popular configurations data
   */
  static async generatePopularConfigurationsData(): Promise<PopularConfigurationData> {
    console.log('🔍 Generating popular configurations data...');

    try {
      const [topConfigurations, priceDistribution, selectionStats, weeklyTrends] = await Promise.all([
        this.getTopConfigurations(),
        this.getPriceDistribution(),
        this.getSelectionStats(),
        this.getWeeklyTrends()
      ]);

      // Count sessions with configuration data
      const allConfigs = await prisma.userSession.findMany({
        select: {
          configurationData: true
        }
      });

      const totalConfigurations = allConfigs.filter((session: { configurationData: unknown }) =>
        session.configurationData &&
        typeof session.configurationData === 'object' &&
        session.configurationData !== null
      ).length;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return {
        topConfigurations,
        priceDistribution,
        selectionStats,
        trends: {
          weekly: weeklyTrends
        },
        metadata: {
          totalConfigurations,
          dataRange: {
            from: thirtyDaysAgo.toISOString(),
            to: new Date().toISOString()
          },
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Error generating popular configurations data:', error);
      throw error;
    }
  }
}

export async function GET() {
  const startTime = Date.now();

  try {
    console.log('📊 Fetching popular configurations data...');

    const data = await PopularConfigurationsService.generatePopularConfigurationsData();

    const processingTime = Date.now() - startTime;
    console.log(`✅ Popular configurations data generated in ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      data,
      performance: {
        processingTime,
        efficiency: processingTime < 1000 ? 'excellent' : processingTime < 3000 ? 'good' : 'needs_attention'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        dataSource: 'postgresql'
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Popular configurations API error (${processingTime}ms):`, error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch popular configurations data',
      details: error instanceof Error ? error.message : 'Unknown error',
      performance: {
        processingTime,
        efficiency: 'error'
      }
    }, { status: 500 });
  }
} 