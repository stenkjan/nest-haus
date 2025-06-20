/**
 * Performance Monitor - Track configurator performance metrics
 * 
 * Helps monitor API call frequency, cache hit rates, and component re-renders
 * to ensure we maintain optimal performance and follow project rules.
 */

interface PerformanceMetrics {
  apiCalls: {
    total: number;
    unique: number;
    duplicates: number;
    paths: Record<string, number>;
  };
  cacheStats: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  renderStats: {
    previewPanelRenders: number;
    imageComponentRenders: number;
  };
  sessionStart: number;
  warnings: string[];
}

class PerformanceMonitor {
  private static metrics: PerformanceMetrics = {
    apiCalls: {
      total: 0,
      unique: 0,
      duplicates: 0,
      paths: {}
    },
    cacheStats: {
      hits: 0,
      misses: 0,
      hitRate: 0
    },
    renderStats: {
      previewPanelRenders: 0,
      imageComponentRenders: 0
    },
    sessionStart: Date.now(),
    warnings: []
  };

  private static isEnabled = process.env.NODE_ENV === 'development';
  private static autoLoggingInterval: NodeJS.Timeout | null = null;

  /**
   * Track an API call to the images endpoint
   */
  static trackApiCall(path: string): void {
    if (!this.isEnabled) return;

    this.metrics.apiCalls.total++;
    
    if (this.metrics.apiCalls.paths[path]) {
      this.metrics.apiCalls.paths[path]++;
      this.metrics.apiCalls.duplicates++;
      
      // Track warning for excessive calls to same path
      if (this.metrics.apiCalls.paths[path] > 3) {
        const warning = `🚨 Image path "${path}" called ${this.metrics.apiCalls.paths[path]} times`;
        this.addWarning(warning);
        console.warn(warning);
      }
    } else {
      this.metrics.apiCalls.paths[path] = 1;
      this.metrics.apiCalls.unique++;
    }

    // Warn if total calls exceed reasonable limit
    if (this.metrics.apiCalls.total > 20) {
      const warning = `🚨 ${this.metrics.apiCalls.total} total API calls made - possible performance issue`;
      this.addWarning(warning);
      console.warn(warning);
    }
  }

  /**
   * Track cache hit/miss
   */
  static trackCacheHit(): void {
    if (!this.isEnabled) return;
    this.metrics.cacheStats.hits++;
    this.updateCacheHitRate();
  }

  static trackCacheMiss(): void {
    if (!this.isEnabled) return;
    this.metrics.cacheStats.misses++;
    this.updateCacheHitRate();
  }

  private static updateCacheHitRate(): void {
    const total = this.metrics.cacheStats.hits + this.metrics.cacheStats.misses;
    this.metrics.cacheStats.hitRate = total > 0 ? (this.metrics.cacheStats.hits / total) * 100 : 0;
  }

  /**
   * Track component renders
   */
  static trackPreviewPanelRender(): void {
    if (!this.isEnabled) return;
    this.metrics.renderStats.previewPanelRenders++;
    
    // Warn about excessive renders
    if (this.metrics.renderStats.previewPanelRenders > 15) {
      const warning = `🔄 PreviewPanel rendered ${this.metrics.renderStats.previewPanelRenders} times - check for render loops`;
      this.addWarning(warning);
      
      if (this.metrics.renderStats.previewPanelRenders % 5 === 0) {
        console.warn(warning);
      }
    }
  }

  static trackImageComponentRender(): void {
    if (!this.isEnabled) return;
    this.metrics.renderStats.imageComponentRenders++;
    
    // Warn about excessive renders
    if (this.metrics.renderStats.imageComponentRenders > 30) {
      const warning = `🖼️ ImageComponent rendered ${this.metrics.renderStats.imageComponentRenders} times - check dependencies`;
      this.addWarning(warning);
      
      if (this.metrics.renderStats.imageComponentRenders % 10 === 0) {
        console.warn(warning);
      }
    }
  }

  /**
   * Add a warning to the metrics
   */
  private static addWarning(warning: string): void {
    if (!this.metrics.warnings.includes(warning)) {
      this.metrics.warnings.push(warning);
    }
  }

  /**
   * Get current performance metrics
   */
  static getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Sync with external cache statistics (e.g., from ClientBlobImage)
   */
  static syncCacheStats(cacheStats: {
    cacheSize: number;
    requestCounts: Record<string, number>;
    totalRequests: number;
    duplicateRequests: number;
  }): void {
    if (!this.isEnabled) return;

    // Update API call metrics based on cache statistics
    this.metrics.apiCalls.total = cacheStats.totalRequests;
    this.metrics.apiCalls.duplicates = cacheStats.duplicateRequests;
    this.metrics.apiCalls.unique = cacheStats.totalRequests - cacheStats.duplicateRequests;
    this.metrics.apiCalls.paths = { ...cacheStats.requestCounts };

    // Track excessive requests
    Object.entries(cacheStats.requestCounts).forEach(([path, count]) => {
      if (count > 3) {
        const warning = `📸 Image "${path}" requested ${count} times via cache`;
        this.addWarning(warning);
      }
    });
  }

  /**
   * Get performance summary
   */
  static getSummary(): string {
    const sessionDuration = (Date.now() - this.metrics.sessionStart) / 1000;
    const duplicateRate = this.metrics.apiCalls.total > 0 
      ? (this.metrics.apiCalls.duplicates / this.metrics.apiCalls.total) * 100 
      : 0;

    return `
🔍 Performance Summary (${sessionDuration.toFixed(1)}s session):
📡 API Calls: ${this.metrics.apiCalls.total} total, ${this.metrics.apiCalls.unique} unique (${duplicateRate.toFixed(1)}% duplicates)
💾 Cache: ${this.metrics.cacheStats.hitRate.toFixed(1)}% hit rate (${this.metrics.cacheStats.hits} hits, ${this.metrics.cacheStats.misses} misses)
🔄 Renders: ${this.metrics.renderStats.previewPanelRenders} PreviewPanel, ${this.metrics.renderStats.imageComponentRenders} ImageComponent
⚠️  Warnings: ${this.metrics.warnings.length} total
    `.trim();
  }

  /**
   * Check if performance is within acceptable limits
   */
  static checkPerformance(): { isGood: boolean; warnings: string[] } {
    const warnings: string[] = [...this.metrics.warnings];
    
    // Check for excessive API calls
    if (this.metrics.apiCalls.duplicates > 5) {
      warnings.push(`Too many duplicate API calls: ${this.metrics.apiCalls.duplicates}`);
    }

    // Check cache efficiency
    if (this.metrics.cacheStats.hitRate < 50 && this.metrics.cacheStats.hits + this.metrics.cacheStats.misses > 10) {
      warnings.push(`Low cache hit rate: ${this.metrics.cacheStats.hitRate.toFixed(1)}%`);
    }

    // Check for excessive renders
    if (this.metrics.renderStats.previewPanelRenders > 20) {
      warnings.push(`Excessive PreviewPanel renders: ${this.metrics.renderStats.previewPanelRenders}`);
    }

    if (this.metrics.renderStats.imageComponentRenders > 40) {
      warnings.push(`Excessive ImageComponent renders: ${this.metrics.renderStats.imageComponentRenders}`);
    }

    return {
      isGood: warnings.length === 0,
      warnings
    };
  }

  /**
   * Reset metrics (useful for testing)
   */
  static reset(): void {
    this.metrics = {
      apiCalls: {
        total: 0,
        unique: 0,
        duplicates: 0,
        paths: {}
      },
      cacheStats: {
        hits: 0,
        misses: 0,
        hitRate: 0
      },
      renderStats: {
        previewPanelRenders: 0,
        imageComponentRenders: 0
      },
      sessionStart: Date.now(),
      warnings: []
    };
  }

  /**
   * Log performance metrics to console
   */
  static logMetrics(): void {
    if (!this.isEnabled) return;
    
    console.group('🔍 Configurator Performance Metrics');
    console.log(this.getSummary());
    
    const performance = this.checkPerformance();
    if (performance.isGood) {
      console.log('✅ Performance is within acceptable limits');
    } else {
      console.warn('⚠️ Performance issues detected:');
      performance.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }

    // Show top requested images
    const sortedPaths = Object.entries(this.metrics.apiCalls.paths)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    if (sortedPaths.length > 0) {
      console.log('📊 Most requested images:');
      sortedPaths.forEach(([path, count]) => {
        console.log(`  ${count}x - ${path}`);
      });
    }

    console.groupEnd();
  }

  /**
   * Start automatic performance logging every 30 seconds
   */
  static startAutoLogging(): void {
    if (!this.isEnabled || this.autoLoggingInterval) return;
    
    this.autoLoggingInterval = setInterval(() => {
      this.logMetrics();
    }, 30000); // Log every 30 seconds
    
    console.log('🔍 Performance monitoring started - logging every 30s');
  }

  /**
   * Stop automatic performance logging
   */
  static stopAutoLogging(): void {
    if (this.autoLoggingInterval) {
      clearInterval(this.autoLoggingInterval);
      this.autoLoggingInterval = null;
      console.log('🔍 Performance monitoring stopped');
    }
  }

  /**
   * Report current statistics in a compact format
   */
  static getCompactReport(): string {
    const duplicateRate = this.metrics.apiCalls.total > 0 
      ? (this.metrics.apiCalls.duplicates / this.metrics.apiCalls.total) * 100 
      : 0;
    
    return `📊 API: ${this.metrics.apiCalls.total}/${this.metrics.apiCalls.unique} (${duplicateRate.toFixed(0)}% dup) | 🖼️ Renders: ${this.metrics.renderStats.previewPanelRenders}/${this.metrics.renderStats.imageComponentRenders} | ⚠️ ${this.metrics.warnings.length}`;
  }
}

// Auto-start logging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  PerformanceMonitor.startAutoLogging();
  
  // Make available globally for debugging
  (window as typeof window & { performanceMonitor: typeof PerformanceMonitor }).performanceMonitor = PerformanceMonitor;
}

export default PerformanceMonitor; 