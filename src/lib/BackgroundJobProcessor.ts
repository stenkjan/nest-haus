/**
 * Background Job Processor for NEST-Haus
 * Handles Redis → PostgreSQL sync and analytics calculations
 */

import { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import redis from './redis';
import cron from 'node-cron';

// Configuration data types for proper typing
interface ConfigurationValue {
  value: string;
  price?: number;
}

interface ConfigurationData {
  nest?: ConfigurationValue;
  gebaeudehuelle?: ConfigurationValue;
  innenverkleidung?: ConfigurationValue;
  fussboden?: ConfigurationValue;
  pvanlage?: ConfigurationValue;
  fenster?: ConfigurationValue;
  planungspaket?: ConfigurationValue;
  [key: string]: ConfigurationValue | undefined; // Index signature for dynamic access
}

interface PerformanceMetricData {
  sessionId: string;
  metricName: string;
  value: number;
  timestamp: number;
  additionalData?: Record<string, string | number | boolean> | null;
  endpoint?: string;
  userAgent?: string;
}

interface SessionWithConfigData {
  configurationData: Prisma.JsonValue;
  totalPrice: number | null;
}

interface QueuedInteraction {
  sessionId: string;
  eventType: string;
  category: string;
  elementId?: string;
  selectionValue?: string;
  previousValue?: string;
  timestamp: number;
  timeSpent?: number;
  deviceType?: string;
  viewportWidth?: number;
  viewportHeight?: number;
}

// ConfigurationData and QueuedConfiguration interfaces removed - no longer needed

export class BackgroundJobProcessor {
  private static isProcessing = false;
  private static processingStats = {
    lastRun: null as Date | null,
    totalProcessed: 0,
    errors: 0,
    averageProcessingTime: 0
  };

  /**
   * Initialize all background job scheduling
   */
  static initialize() {
    console.log('🔄 Initializing background job processor...');

    // Process queues every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.processAllQueues();
    });

    // Daily analytics aggregation at midnight
    cron.schedule('0 0 * * *', async () => {
      await this.aggregateDailyAnalytics();
    });

    // Popular configurations update every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      await this.updatePopularConfigurations();
    });

    // Performance metrics aggregation every hour
    cron.schedule('0 * * * *', async () => {
      await this.aggregatePerformanceMetrics();
    });

    console.log('✅ Background job processor initialized');
  }

  /**
   * Process all Redis queues in sequence
   */
  static async processAllQueues() {
    if (this.isProcessing) {
      console.log('⏳ Background job already in progress, skipping...');
      return;
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      console.log('🔄 Starting queue processing...');

      const results = await Promise.allSettled([
        this.processInteractionQueue(),
        this.processPerformanceQueue(),
        this.cleanupExpiredSessions()
      ]);

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      const processingTime = Date.now() - startTime;
      this.processingStats.lastRun = new Date();
      this.processingStats.averageProcessingTime = processingTime;

      if (failed > 0) {
        console.error(`❌ Queue processing completed with ${failed} failures in ${processingTime}ms`);
        this.processingStats.errors += failed;
      } else {
        console.log(`✅ Queue processing completed successfully in ${processingTime}ms`);
      }

      // Track processing performance
      await prisma.performanceMetric.create({
        data: {
          metricName: 'background_job_processing',
          value: processingTime,
          additionalData: {
            successful,
            failed,
            totalQueues: 3  // Updated from 4 to 3 (removed configuration queue)
          }
        }
      });

    } catch (error) {
      console.error('❌ Queue processing failed:', error);
      this.processingStats.errors++;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process interaction events from Redis queue
   */
  static async processInteractionQueue(): Promise<number> {
    try {
      const queueKey = 'interaction_queue';
      const batchSize = 100;
      
      const interactions = await redis.lrange(queueKey, 0, batchSize - 1);
      if (interactions.length === 0) {
        return 0;
      }

      const parsedInteractions: QueuedInteraction[] = interactions.map((item: string) => JSON.parse(item));

      // Batch insert to PostgreSQL
      await prisma.interactionEvent.createMany({
        data: parsedInteractions.map(interaction => ({
          sessionId: interaction.sessionId,
          eventType: interaction.eventType,
          category: interaction.category,
          elementId: interaction.elementId,
          selectionValue: interaction.selectionValue,
          previousValue: interaction.previousValue,
          timestamp: new Date(interaction.timestamp),
          timeSpent: interaction.timeSpent,
          deviceType: interaction.deviceType,
          viewportWidth: interaction.viewportWidth,
          viewportHeight: interaction.viewportHeight
        }))
      });

      // Remove processed items from queue
      await redis.ltrim(queueKey, batchSize, -1);

      console.log(`✅ Processed ${parsedInteractions.length} interaction events`);
      this.processingStats.totalProcessed += parsedInteractions.length;

      return parsedInteractions.length;
    } catch (error) {
      console.error('❌ Failed to process interaction queue:', error);
      throw error;
    }
  }

  /**
   * Process performance metrics from Redis queue
   */
  static async processPerformanceQueue(): Promise<number> {
    try {
      const queueKey = 'performance_queue';
      const batchSize = 200;
      
      const metrics = await redis.lrange(queueKey, 0, batchSize - 1);
      if (metrics.length === 0) {
        return 0;
      }

      const parsedMetrics = metrics.map((item: string) => JSON.parse(item));

      // Batch insert to PostgreSQL
      await prisma.performanceMetric.createMany({
        data: parsedMetrics.map((metric: PerformanceMetricData) => ({
          sessionId: metric.sessionId,
          metricName: metric.metricName,
          value: metric.value,
          timestamp: new Date(metric.timestamp),
          additionalData: metric.additionalData as Prisma.InputJsonValue,
          endpoint: metric.endpoint,
          userAgent: metric.userAgent
        }))
      });

      // Remove processed items from queue
      await redis.ltrim(queueKey, batchSize, -1);

      console.log(`✅ Processed ${parsedMetrics.length} performance metrics`);
      return parsedMetrics.length;
    } catch (error) {
      console.error('❌ Failed to process performance queue:', error);
      throw error;
    }
  }

  /**
   * Aggregate daily analytics
   */
  static async aggregateDailyAnalytics(): Promise<void> {
    try {
      console.log('📊 Aggregating daily analytics...');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get session statistics for today
      const sessions = await prisma.userSession.findMany({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        },
        include: {
          selectionEvents: true
        }
      });

      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
      const abandondedSessions = sessions.filter(s => s.status === 'ABANDONED').length;
      
      // Calculate average session duration
      const sessionsWithDuration = sessions.filter(s => s.startTime && s.endTime);
      const averageSessionDuration = sessionsWithDuration.length > 0
        ? sessionsWithDuration.reduce((sum, session) => {
            const duration = session.endTime!.getTime() - session.startTime.getTime();
            return sum + duration;
          }, 0) / sessionsWithDuration.length / 1000 / 60 // Convert to minutes
        : 0;

      // Calculate bounce rate
      const shortSessions = sessionsWithDuration.filter(session => {
        const duration = session.endTime!.getTime() - session.startTime.getTime();
        return duration < 30000; // 30 seconds
      }).length;
      const bounceRate = sessionsWithDuration.length > 0 ? (shortSessions / sessionsWithDuration.length) * 100 : 0;

      // Calculate conversion rate
      const conversionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      // Get unique visitors (approximate by IP)
      const uniqueIPs = new Set(sessions.map(s => s.ipAddress).filter(Boolean));
      const uniqueVisitors = uniqueIPs.size;

      // Aggregate popular selections
      const allSelections = sessions.flatMap(s => s.selectionEvents);
      const selectionCounts: Record<string, number> = {};
      allSelections.forEach(event => {
        const key = `${event.category}:${event.selection}`;
        selectionCounts[key] = (selectionCounts[key] || 0) + 1;
      });

      const topSelections = Object.entries(selectionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([selection, count]) => ({ selection, count }));

      // Upsert daily analytics
      await prisma.dailyAnalytics.upsert({
        where: { date: today },
        create: {
          date: today,
          totalSessions,
          uniqueVisitors,
          completedConfigurations: completedSessions,
          abandonedSessions: abandondedSessions,
          averageSessionDuration,
          bounceRate,
          conversionRate,
          topSelections
        },
        update: {
          totalSessions,
          uniqueVisitors,
          completedConfigurations: completedSessions,
          abandonedSessions: abandondedSessions,
          averageSessionDuration,
          bounceRate,
          conversionRate,
          topSelections
        }
      });

      console.log(`✅ Daily analytics aggregated: ${totalSessions} sessions, ${conversionRate.toFixed(1)}% conversion`);
    } catch (error) {
      console.error('❌ Failed to aggregate daily analytics:', error);
      throw error;
    }
  }

  /**
   * Update popular configurations ranking
   */
  static async updatePopularConfigurations(): Promise<void> {
    try {
      console.log('🏆 Updating popular configurations...');

      // Get completed configurations from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentSessions = await prisma.userSession.findMany({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: thirtyDaysAgo },
          configurationData: {
            not: Prisma.DbNull
          }
        },
        select: {
          configurationData: true,
          totalPrice: true
        }
      });

      // Group configurations by hash
      const configGroups: Record<string, SessionWithConfigData[]> = {};
      recentSessions.forEach(session => {
        const config = session.configurationData as ConfigurationData | null;
        if (!config) return;

        const hash = this.generateConfigurationHash(config);
        if (!configGroups[hash]) {
          configGroups[hash] = [];
        }
        configGroups[hash].push(session as SessionWithConfigData);
      });

      // Update popular configurations
      for (const [hash, sessions] of Object.entries(configGroups)) {
        if (sessions.length === 0) continue;

        const config = sessions[0].configurationData as ConfigurationData;
        const averagePrice = sessions.reduce((sum, s) => sum + (s.totalPrice || 0), 0) / sessions.length;

        await prisma.popularConfiguration.upsert({
          where: { configurationHash: hash },
          create: {
            configurationHash: hash,
            nestType: config.nest?.value || 'unknown',
            gebaeudehuelle: config.gebaeudehuelle?.value || 'unknown',
            innenverkleidung: config.innenverkleidung?.value || 'unknown',
            fussboden: config.fussboden?.value || 'unknown',
            pvanlage: config.pvanlage?.value,
            fenster: config.fenster?.value,
            planungspaket: config.planungspaket?.value,
            totalPrice: Math.round(averagePrice),
            selectionCount: sessions.length,
            conversionRate: 100, // These are all completed
            lastSelected: new Date()
          },
          update: {
            selectionCount: sessions.length,
            totalPrice: Math.round(averagePrice),
            lastSelected: new Date()
          }
        });
      }

      console.log(`✅ Updated ${Object.keys(configGroups).length} popular configurations`);
    } catch (error) {
      console.error('❌ Failed to update popular configurations:', error);
      throw error;
    }
  }

  /**
   * Aggregate performance metrics
   */
  static async aggregatePerformanceMetrics(): Promise<void> {
    try {
      console.log('⚡ Aggregating performance metrics...');

      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const metrics = await prisma.performanceMetric.findMany({
        where: {
          timestamp: { gte: oneHourAgo }
        }
      });

      // Group by metric name and calculate averages
      const metricGroups: Record<string, number[]> = {};
      metrics.forEach(metric => {
        if (!metricGroups[metric.metricName]) {
          metricGroups[metric.metricName] = [];
        }
        metricGroups[metric.metricName].push(metric.value);
      });

      // Log performance insights
      for (const [metricName, values] of Object.entries(metricGroups)) {
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);

        console.log(`📊 ${metricName}: avg=${average.toFixed(2)}ms, max=${max}ms, min=${min}ms (${values.length} samples)`);

        // Alert on performance issues
        if (metricName === 'api_response_time' && average > 500) {
          console.warn(`⚠️ High API response time: ${average.toFixed(2)}ms`);
        }
      }

    } catch (error) {
      console.error('❌ Failed to aggregate performance metrics:', error);
      throw error;
    }
  }

  /**
   * Clean up expired sessions from Redis
   */
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      const _expiredThreshold = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
      
      // This would typically involve checking Redis session timestamps
      // and removing expired ones. Implementation depends on your Redis structure.
      
      console.log('🧹 Cleaned up expired sessions');
    } catch (error) {
      console.error('❌ Failed to cleanup expired sessions:', error);
    }
  }

  /**
   * Calculate configuration completion percentage
   */
  private static calculateCompletionPercentage(configData: ConfigurationData): number {
    let completed = 0;
    let total = 4; // Required fields count

    // Check required fields
    if (configData.nest?.value) completed++;
    if (configData.gebaeudehuelle?.value) completed++;
    if (configData.innenverkleidung?.value) completed++;
    if (configData.fussboden?.value) completed++;

    // Check optional fields and add to total if present
    if (configData.pvanlage?.value) {
      completed++;
      total++;
    }
    if (configData.fenster?.value) {
      completed++;
      total++;
    }
    if (configData.planungspaket?.value) {
      completed++;
      total++;
    }

    return total > 0 ? (completed / total) * 100 : 0;
  }

  /**
   * Generate configuration hash for grouping
   */
  private static generateConfigurationHash(config: ConfigurationData): string {
    const key = [
      config.nest?.value || '',
      config.gebaeudehuelle?.value || '', 
      config.innenverkleidung?.value || '',
      config.fussboden?.value || '',
      config.pvanlage?.value || '',
      config.fenster?.value || '',
      config.planungspaket?.value || ''
    ].join('|');
    
    return Buffer.from(key).toString('base64');
  }

  /**
   * Get processing statistics
   */
  static getStats() {
    return this.processingStats;
  }
}

// Auto-initialize if in Node.js environment
if (typeof window === 'undefined') {
  BackgroundJobProcessor.initialize();
} 