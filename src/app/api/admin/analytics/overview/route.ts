import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';

/**
 * Admin Analytics Overview API
 * Provides comprehensive business intelligence dashboard data
 * 
 * GET /api/admin/analytics/overview?timeRange=7d|30d|90d
 */

interface AnalyticsOverview {
  summary: {
    totalSessions: number;
    completedConfigurations: number;
    conversionRate: number;
    averageOrderValue: number;
    totalRevenue: number;
    activeUsersNow: number;
  };
  trends: {
    sessionsGrowth: number;
    conversionGrowth: number;
    revenueGrowth: number;
  };
  topConfigurations: Array<{
    name: string;
    selectionCount: number;
    conversionRate: number;
    averagePrice: number;
  }>;
  userJourney: {
    averageSessionDuration: number;
    bounceRate: number;
    stepsToCompletion: number;
    commonDropOffPoints: string[];
  };
  performance: {
    averageLoadTime: number;
    apiResponseTime: number;
    errorRate: number;
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    
    // Calculate date range
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    console.log(`📊 Generating analytics overview for ${timeRange} (${days} days)`);
    
    // Parallel data fetching for performance
    const [
      sessionStats,
      configurationStats, 
      popularConfigs,
      performanceMetrics,
      _revenueData
    ] = await Promise.all([
      // Session statistics
      prisma.userSession.aggregate({
        where: {
          createdAt: { gte: startDate }
        },
        _count: { id: true },
        _avg: { totalPrice: true }
      }),
      
      // Configuration completion stats
      prisma.userSession.findMany({
        where: {
          createdAt: { gte: startDate },
          status: { in: ['COMPLETED', 'ABANDONED'] }
        },
        select: {
          status: true,
          totalPrice: true,
          startTime: true,
          endTime: true
        }
      }),
      
      // Popular configurations
      prisma.popularConfiguration.findMany({
        where: {
          lastSelected: { gte: startDate }
        },
        orderBy: { selectionCount: 'desc' },
        take: 5
      }),
      
      // Performance metrics
      prisma.performanceMetric.findMany({
        where: {
          timestamp: { gte: startDate },
          metricName: { in: ['api_response_time', 'image_load_time', 'price_calc_time'] }
        },
        select: {
          metricName: true,
          value: true
        }
      }),
      
      // Revenue data for trend calculation
      prisma.customerInquiry.findMany({
        where: {
          createdAt: { gte: startDate },
          status: { in: ['CONVERTED', 'QUOTED'] }
        },
        select: {
          totalPrice: true,
          createdAt: true
        }
      })
    ]);
    
    // Get active users from Redis
    const activeUsers = await redis.scard('active_sessions') || 0;
    
    // Calculate metrics
    const totalSessions = sessionStats._count.id;
    const completedSessions = configurationStats.filter(s => s.status === 'COMPLETED').length;
    const conversionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    
    // Calculate average order value and revenue
    const completedOrders = configurationStats.filter(s => s.status === 'COMPLETED' && s.totalPrice);
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    
    // Calculate session duration
    const sessionsWithDuration = configurationStats.filter(s => s.startTime && s.endTime);
    const averageSessionDuration = sessionsWithDuration.length > 0 
      ? sessionsWithDuration.reduce((sum, session) => {
          const duration = session.endTime!.getTime() - session.startTime.getTime();
          return sum + duration;
        }, 0) / sessionsWithDuration.length / 1000 / 60 // Convert to minutes
      : 0;
    
    // Calculate bounce rate (sessions under 30 seconds)
    const shortSessions = sessionsWithDuration.filter(session => {
      const duration = session.endTime!.getTime() - session.startTime.getTime();
      return duration < 30000; // 30 seconds
    }).length;
    const bounceRate = sessionsWithDuration.length > 0 ? (shortSessions / sessionsWithDuration.length) * 100 : 0;
    
    // Performance calculations
    const apiMetrics = performanceMetrics.filter(m => m.metricName === 'api_response_time');
    const averageApiResponseTime = apiMetrics.length > 0 
      ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length 
      : 0;
    
    // Calculate trends (compare with previous period)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days);
    
    const previousSessions = await prisma.userSession.count({
      where: {
        createdAt: { 
          gte: previousPeriodStart,
          lt: startDate
        }
      }
    });
    
    const sessionsGrowth = previousSessions > 0 
      ? ((totalSessions - previousSessions) / previousSessions) * 100 
      : totalSessions > 0 ? 100 : 0;
    
    // Build response
    const overview: AnalyticsOverview = {
      summary: {
        totalSessions,
        completedConfigurations: completedSessions,
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageOrderValue: Math.round(averageOrderValue),
        totalRevenue,
        activeUsersNow: activeUsers
      },
      trends: {
        sessionsGrowth: Math.round(sessionsGrowth * 100) / 100,
        conversionGrowth: 0, // Calculate based on historical data
        revenueGrowth: 0 // Calculate based on historical data
      },
      topConfigurations: popularConfigs.map(config => ({
        name: `${config.nestType} + ${config.gebaeudehuelle}`,
        selectionCount: config.selectionCount,
        conversionRate: Math.round(config.conversionRate * 100) / 100,
        averagePrice: config.totalPrice
      })),
      userJourney: {
        averageSessionDuration: Math.round(averageSessionDuration * 100) / 100,
        bounceRate: Math.round(bounceRate * 100) / 100,
        stepsToCompletion: 0, // Calculate from interaction events
        commonDropOffPoints: ['Preisauswahl', 'Materialauswahl', 'Kontaktformular'] // Placeholder
      },
      performance: {
        averageLoadTime: 0, // Calculate from performance metrics
        apiResponseTime: Math.round(averageApiResponseTime * 100) / 100,
        errorRate: 0 // Calculate from error tracking
      }
    };
    
    const processingTime = Date.now() - startTime;
    
    // Track this API call performance
    await prisma.performanceMetric.create({
      data: {
        metricName: 'admin_analytics_overview',
        value: processingTime,
        endpoint: '/api/admin/analytics/overview',
        additionalData: {
          timeRange,
          recordsProcessed: totalSessions,
          responseTime: processingTime
        }
      }
    });
    
    console.log(`✅ Analytics overview generated in ${processingTime}ms`);
    console.log(`📈 Summary: ${totalSessions} sessions, ${completedSessions} completed (${conversionRate.toFixed(1)}% conversion)`);
    
    return NextResponse.json({
      success: true,
      data: overview,
      metadata: {
        timeRange,
        generatedAt: new Date().toISOString(),
        processingTime,
        dataPoints: totalSessions
      }
    });
    
  } catch (error) {
    console.error('❌ Analytics overview generation failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate analytics overview',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 