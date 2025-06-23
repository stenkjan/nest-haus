/**
 * PerformanceMonitor - Performance tracking and optimization
 * 
 * Monitors configurator performance metrics including selection times,
 * image loading, error rates, and user interaction patterns.
 */

import type { ConfigurationItem } from '../types/configurator.types';

interface PerformanceMetrics {
  selectionTimes: number[];
  imageLoadTimes: number[];
  errorCount: number;
  totalSelections: number;
  sessionStartTime: number;
  lastSelectionTime: number;
}

interface PerformanceReport {
  averageSelectionTime: number;
  averageImageLoadTime: number;
  errorRate: number;
  totalInteractions: number;
  sessionDuration: number;
  performanceScore: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV !== 'test';
    this.metrics = {
      selectionTimes: [],
      imageLoadTimes: [],
      errorCount: 0,
      totalSelections: 0,
      sessionStartTime: performance.now(),
      lastSelectionTime: 0
    };
  }

  /**
   * Record the time taken for a selection to be processed
   */
  recordSelectionTime(processingTime: number): void {
    if (!this.isEnabled) return;

    this.metrics.selectionTimes.push(processingTime);
    this.metrics.totalSelections++;
    this.metrics.lastSelectionTime = performance.now();

    // Keep only last 50 measurements for memory efficiency
    if (this.metrics.selectionTimes.length > 50) {
      this.metrics.selectionTimes.shift();
    }

    // Log slow selections in development
    if (process.env.NODE_ENV === 'development' && processingTime > 100) {
      console.warn(`⚠️ Slow selection processing: ${processingTime.toFixed(2)}ms`);
    }
  }

  /**
   * Record image loading time
   */
  recordImageLoadTime(loadTime: number): void {
    if (!this.isEnabled) return;

    this.metrics.imageLoadTimes.push(loadTime);

    // Keep only last 30 measurements
    if (this.metrics.imageLoadTimes.length > 30) {
      this.metrics.imageLoadTimes.shift();
    }

    // Log slow image loads in development
    if (process.env.NODE_ENV === 'development' && loadTime > 1000) {
      console.warn(`⚠️ Slow image loading: ${loadTime.toFixed(2)}ms`);
    }
  }

  /**
   * Record an error occurrence
   */
  recordError(error: Error, selection?: ConfigurationItem): void {
    if (!this.isEnabled) return;

    this.metrics.errorCount++;

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ ConfiguratorEngine error:', {
        error: error.message,
        selection: selection?.name,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get current performance report
   */
  getPerformanceReport(): PerformanceReport {
    const averageSelectionTime = this.metrics.selectionTimes.length > 0
      ? this.metrics.selectionTimes.reduce((a, b) => a + b, 0) / this.metrics.selectionTimes.length
      : 0;

    const averageImageLoadTime = this.metrics.imageLoadTimes.length > 0
      ? this.metrics.imageLoadTimes.reduce((a, b) => a + b, 0) / this.metrics.imageLoadTimes.length
      : 0;

    const errorRate = this.metrics.totalSelections > 0
      ? this.metrics.errorCount / this.metrics.totalSelections
      : 0;

    const sessionDuration = performance.now() - this.metrics.sessionStartTime;

    // Calculate performance score (0-100)
    const performanceScore = this.calculatePerformanceScore(
      averageSelectionTime,
      averageImageLoadTime,
      errorRate
    );

    return {
      averageSelectionTime,
      averageImageLoadTime,
      errorRate,
      totalInteractions: this.metrics.totalSelections,
      sessionDuration,
      performanceScore
    };
  }

  /**
   * Calculate overall performance score
   */
  private calculatePerformanceScore(
    avgSelectionTime: number,
    avgImageLoadTime: number,
    errorRate: number
  ): number {
    let score = 100;

    // Deduct points for slow selection times
    if (avgSelectionTime > 50) score -= 20;
    else if (avgSelectionTime > 25) score -= 10;

    // Deduct points for slow image loading
    if (avgImageLoadTime > 1000) score -= 20;
    else if (avgImageLoadTime > 500) score -= 10;

    // Deduct points for errors
    score -= errorRate * 50;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get real-time metrics for debugging
   */
  getCurrentMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset all metrics (useful for testing)
   */
  reset(): void {
    this.metrics = {
      selectionTimes: [],
      imageLoadTimes: [],
      errorCount: 0,
      totalSelections: 0,
      sessionStartTime: performance.now(),
      lastSelectionTime: 0
    };
  }

  /**
   * Flush metrics to analytics service (if configured)
   */
  flush(): void {
    if (!this.isEnabled || this.metrics.totalSelections === 0) return;

    const report = this.getPerformanceReport();

    // In a real application, you would send this to an analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Performance Report:', report);
    }

    // Optional: Send to analytics service
    this.sendToAnalytics(report);
  }

  /**
   * Send performance data to analytics service
   */
  private sendToAnalytics(report: PerformanceReport): void {
    // This would be implemented to send data to your analytics service
    // For now, we'll just log it in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.debug('📈 Performance metrics would be sent to analytics:', report);
    }
  }

  /**
   * Enable or disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Check if performance monitoring is enabled
   */
  isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }
} 