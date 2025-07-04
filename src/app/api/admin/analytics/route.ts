/**
 * Admin Analytics API - Isolated Implementation
 * 
 * IMPORTANT: This API is designed to be completely isolated from configurator functionality.
 * It only READS data from the database and does NOT modify any session tracking logic.
 * 
 * Week 1 Implementation: Real analytics data for admin dashboard
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Analytics data types - isolated from configurator types
 */
interface AdminAnalytics {
  // Dashboard Overview Metrics
  activeSessions: number;
  totalSessions: number;
  totalSessionsToday: number;
  averageSessionDuration: number;
  
  // Performance Metrics
  conversionRate: number;
  completedConfigurations: number;
  abandonedSessions: number;
  
  // Time-based Metrics
  sessionsLast24h: number;
  sessionsLast7d: number;
  averageInteractionsPerSession: number;
  
  // System Performance
  averageApiResponseTime: number;
  systemHealth: 'excellent' | 'good' | 'needs_attention';
  
  // Metadata
  lastUpdated: string;
  dataRange: {
    from: string;
    to: string;
  };
}

/**
 * Database Analytics Service - Isolated Implementation
 * 
 * This service only READS from the database and never modifies session data.
 * It operates independently of the Redis session management.
 */
class IsolatedAnalyticsService {
  
  /**
   * Get active sessions count (sessions with activity in last 10 minutes)
   */
  static async getActiveSessions(): Promise<number> {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      
      const activeCount = await prisma.userSession.count({
        where: {
          status: 'ACTIVE',
          lastActivity: {
            gte: tenMinutesAgo
          }
        }
      });
      
      return activeCount;
    } catch (error) {
      console.error('❌ Failed to get active sessions:', error);
      return 0;
    }
  }
  
  /**
   * Get total sessions count
   */
  static async getTotalSessions(): Promise<number> {
    try {
      const totalCount = await prisma.userSession.count();
      return totalCount;
    } catch (error) {
      console.error('❌ Failed to get total sessions:', error);
      return 0;
    }
  }
  
  /**
   * Get sessions created today
   */
  static async getTotalSessionsToday(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayCount = await prisma.userSession.count({
        where: {
          startTime: {
            gte: today
          }
        }
      });
      
      return todayCount;
    } catch (error) {
      console.error('❌ Failed to get today sessions:', error);
      return 0;
    }
  }
  
  /**
   * Calculate average session duration
   */
  static async getAverageSessionDuration(): Promise<number> {
    try {
      const sessions = await prisma.userSession.findMany({
        where: {
          endTime: {
            not: null
          }
        },
        select: {
          startTime: true,
          endTime: true
        },
        take: 1000 // Limit to recent 1000 sessions for performance
      });
      
      if (sessions.length === 0) return 0;
      
      const totalDuration = sessions.reduce((sum: number, session: any) => {
        if (session.endTime) {
          const duration = session.endTime.getTime() - session.startTime.getTime();
          return sum + duration;
        }
        return sum;
      }, 0);
      
      return totalDuration / sessions.length; // Return in milliseconds
    } catch (error) {
      console.error('❌ Failed to calculate average session duration:', error);
      return 0;
    }
  }
  
  /**
   * Calculate conversion rate (sessions with completed configurations)
   */
  static async getConversionRate(): Promise<number> {
    try {
      const totalSessions = await this.getTotalSessions();
      if (totalSessions === 0) return 0;
      
      const completedSessions = await prisma.userSession.count({
        where: {
          status: 'COMPLETED'
        }
      });
      
      return (completedSessions / totalSessions) * 100;
    } catch (error) {
      console.error('❌ Failed to calculate conversion rate:', error);
      return 0;
    }
  }
  
  /**
   * Get sessions from last 24 hours
   */
  static async getSessionsLast24h(): Promise<number> {
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const count = await prisma.userSession.count({
        where: {
          startTime: {
            gte: yesterday
          }
        }
      });
      
      return count;
    } catch (error) {
      console.error('❌ Failed to get 24h sessions:', error);
      return 0;
    }
  }
  
  /**
   * Get sessions from last 7 days
   */
  static async getSessionsLast7d(): Promise<number> {
    try {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const count = await prisma.userSession.count({
        where: {
          startTime: {
            gte: weekAgo
          }
        }
      });
      
      return count;
    } catch (error) {
      console.error('❌ Failed to get 7d sessions:', error);
      return 0;
    }
  }
  
  /**
   * Calculate average interactions per session
   */
  static async getAverageInteractionsPerSession(): Promise<number> {
    try {
      const totalInteractions = await prisma.interactionEvent.count();
      const totalSessions = await this.getTotalSessions();
      
      if (totalSessions === 0) return 0;
      
      return totalInteractions / totalSessions;
    } catch (error) {
      console.error('❌ Failed to calculate avg interactions:', error);
      return 0;
    }
  }
  
  /**
   * Get average API response time from performance metrics
   */
  static async getAverageApiResponseTime(): Promise<number> {
    try {
      const recentMetrics = await prisma.performanceMetric.findMany({
        where: {
          metricName: {
            contains: 'response_time'
          },
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        take: 100
      });
      
      if (recentMetrics.length === 0) return 0;
      
      const avgTime = recentMetrics.reduce((sum: number, metric: any) => sum + metric.value, 0) / recentMetrics.length;
      return avgTime;
    } catch (error) {
      console.error('❌ Failed to calculate avg API response time:', error);
      return 0;
    }
  }
  
  /**
   * Determine system health based on metrics
   */
  static getSystemHealth(avgResponseTime: number, conversionRate: number): 'excellent' | 'good' | 'needs_attention' {
    if (avgResponseTime < 100 && conversionRate > 5) return 'excellent';
    if (avgResponseTime < 300 && conversionRate > 2) return 'good';
    return 'needs_attention';
  }
  
  /**
   * Generate complete analytics data
   */
  static async generateAnalytics(): Promise<AdminAnalytics> {
    const startTime = Date.now();
    
    try {
      // Execute all queries in parallel for better performance
      const [
        activeSessions,
        totalSessions,
        totalSessionsToday,
        averageSessionDuration,
        conversionRate,
        sessionsLast24h,
        sessionsLast7d,
        averageInteractionsPerSession,
        averageApiResponseTime
      ] = await Promise.all([
        this.getActiveSessions(),
        this.getTotalSessions(),
        this.getTotalSessionsToday(),
        this.getAverageSessionDuration(),
        this.getConversionRate(),
        this.getSessionsLast24h(),
        this.getSessionsLast7d(),
        this.getAverageInteractionsPerSession(),
        this.getAverageApiResponseTime()
      ]);
      
      const completedConfigurations = Math.round((totalSessions * conversionRate) / 100);
      const abandonedSessions = totalSessions - completedConfigurations;
      const systemHealth = this.getSystemHealth(averageApiResponseTime, conversionRate);
      
      const processingTime = Date.now() - startTime;
      console.log(`📊 Analytics generated in ${processingTime}ms`);
      
      return {
        activeSessions,
        totalSessions,
        totalSessionsToday,
        averageSessionDuration,
        conversionRate,
        completedConfigurations,
        abandonedSessions,
        sessionsLast24h,
        sessionsLast7d,
        averageInteractionsPerSession,
        averageApiResponseTime,
        systemHealth,
        lastUpdated: new Date().toISOString(),
        dataRange: {
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          to: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('❌ Failed to generate analytics:', error);
      
      // Return safe fallback data if database fails
      return {
        activeSessions: 0,
        totalSessions: 0,
        totalSessionsToday: 0,
        averageSessionDuration: 0,
        conversionRate: 0,
        completedConfigurations: 0,
        abandonedSessions: 0,
        sessionsLast24h: 0,
        sessionsLast7d: 0,
        averageInteractionsPerSession: 0,
        averageApiResponseTime: 0,
        systemHealth: 'needs_attention',
        lastUpdated: new Date().toISOString(),
        dataRange: {
          from: new Date().toISOString(),
          to: new Date().toISOString()
        }
      };
    }
  }
}

/**
 * GET /api/admin/analytics
 * 
 * Returns comprehensive analytics data for the admin dashboard.
 * This endpoint is completely isolated and safe to call without affecting configurator functionality.
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    console.log('📊 Admin analytics request started');
    
    // Generate analytics data using isolated service
    const analytics = await IsolatedAnalyticsService.generateAnalytics();
    
    const processingTime = Date.now() - startTime;
    
    // Log performance for monitoring
    console.log(`✅ Admin analytics completed in ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      data: analytics,
      performance: {
        processingTime,
        efficiency: processingTime < 1000 ? 'excellent' : processingTime < 3000 ? 'good' : 'slow'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        dataSource: 'postgresql'
      }
    });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('❌ Admin analytics failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate analytics',
      details: error instanceof Error ? error.message : 'Unknown error',
      performance: {
        processingTime,
        efficiency: 'failed'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        dataSource: 'postgresql'
      }
    }, { status: 500 });
  }
}

/**
 * Health check endpoint for monitoring
 * GET /api/admin/analytics?health=true
 */
export async function HEAD() {
  try {
    // Quick database connectivity test
    await prisma.userSession.count({ take: 1 });
    
    return new Response(null, {
      status: 200,
      headers: {
        'X-Analytics-Health': 'healthy',
        'X-Database-Status': 'connected',
        'X-Last-Check': new Date().toISOString()
      }
    });
  } catch {
    return new Response(null, {
      status: 503,
      headers: {
        'X-Analytics-Health': 'unhealthy',
        'X-Database-Status': 'error',
        'X-Last-Check': new Date().toISOString()
      }
    });
  }
} 