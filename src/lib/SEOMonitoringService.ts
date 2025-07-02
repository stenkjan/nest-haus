/**
 * SEO Monitoring Service for NEST-Haus
 * Tracks SEO-related metrics and provides insights
 */

interface SEOMetrics {
  pageViews: Record<string, number>;
  searchKeywords: Record<string, number>;
  configuratorSteps: Record<string, number>;
  conversionFunnel: {
    landingPage: number;
    configuratorStart: number;
    configuratorComplete: number;
    contactForm: number;
  };
}

interface SEOPerformance {
  coreWebVitals: {
    LCP: number; // Largest Contentful Paint
    FID: number; // First Input Delay
    CLS: number; // Cumulative Layout Shift
  };
  seoScore: number;
  issues: string[];
  recommendations: string[];
}

export class SEOMonitoringService {
  private static metrics: SEOMetrics = {
    pageViews: {},
    searchKeywords: {},
    configuratorSteps: {},
    conversionFunnel: {
      landingPage: 0,
      configuratorStart: 0,
      configuratorComplete: 0,
      contactForm: 0,
    },
  };

  /**
   * Track a page view for SEO analytics
   */
  static trackPageview(url: string, title: string, referrer?: string) {
    const page = url.split('?')[0]; // Remove query parameters
    this.metrics.pageViews[page] = (this.metrics.pageViews[page] || 0) + 1;

    // Track organic search keywords (simplified)
    if (referrer && referrer.includes('google.com')) {
      const keyword = this.extractSearchKeyword(referrer) || 'organic_search';
      this.metrics.searchKeywords[keyword] = (this.metrics.searchKeywords[keyword] || 0) + 1;
    }

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 SEO Tracking: ${title} (${page})`);
    }
  }

  /**
   * Track configurator interactions for conversion analysis
   */
  static trackConfiguratorStep(step: string, configuration: any) {
    this.metrics.configuratorSteps[step] = (this.metrics.configuratorSteps[step] || 0) + 1;

    // Update conversion funnel
    switch (step) {
      case 'start':
        this.metrics.conversionFunnel.configuratorStart++;
        break;
      case 'complete':
        this.metrics.conversionFunnel.configuratorComplete++;
        break;
      case 'contact':
        this.metrics.conversionFunnel.contactForm++;
        break;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔧 Configurator Step: ${step}`, {
        totalValue: configuration?.totalPrice,
        modules: configuration?.nest?.value,
      });
    }
  }

  /**
   * Track Core Web Vitals for performance monitoring
   */
  static trackCoreWebVitals(metric: { name: string; value: number; id: string }) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Core Web Vital: ${metric.name} = ${metric.value.toFixed(2)}`);
    }

    // In production, send to analytics service
    // Example: Google Analytics 4, PostHog, or custom analytics
  }

  /**
   * Generate SEO performance report
   */
  static generateSEOReport(): SEOPerformance {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let seoScore = 100;

    // Check conversion funnel performance
    const conversionRate = this.metrics.conversionFunnel.configuratorComplete / 
                          (this.metrics.conversionFunnel.landingPage || 1);
    
    if (conversionRate < 0.02) { // Less than 2% conversion
      issues.push('Low configurator conversion rate');
      recommendations.push('Optimize configurator onboarding and UX');
      seoScore -= 10;
    }

    // Check page popularity
    const topPages = Object.entries(this.metrics.pageViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    if (!topPages.find(([page]) => page.includes('/konfigurator'))) {
      issues.push('Configurator not in top 3 visited pages');
      recommendations.push('Improve internal linking to configurator');
      seoScore -= 15;
    }

    return {
      coreWebVitals: {
        LCP: 0, // Will be populated by actual measurements
        FID: 0,
        CLS: 0,
      },
      seoScore: Math.max(0, seoScore),
      issues,
      recommendations,
    };
  }

  /**
   * Get current metrics for debugging
   */
  static getMetrics(): SEOMetrics {
    return { ...this.metrics };
  }

  /**
   * Extract search keyword from referrer (simplified)
   */
  private static extractSearchKeyword(referrer: string): string | null {
    try {
      const url = new URL(referrer);
      const query = url.searchParams.get('q') || url.searchParams.get('query');
      return query ? query.toLowerCase() : null;
    } catch {
      return null;
    }
  }

  /**
   * Development helper to log current SEO status
   */
  static logSEOStatus() {
    if (process.env.NODE_ENV !== 'development') return;

    const report = this.generateSEOReport();
    console.log('🎯 SEO Status Report:');
    console.log(`📊 Score: ${report.seoScore}/100`);
    console.log(`⚠️ Issues: ${report.issues.length}`);
    report.issues.forEach(issue => console.log(`  - ${issue}`));
    console.log(`💡 Recommendations: ${report.recommendations.length}`);
    report.recommendations.forEach(rec => console.log(`  - ${rec}`));
    
    console.log('\n📈 Current Metrics:');
    console.log('Page Views:', this.metrics.pageViews);
    console.log('Search Keywords:', this.metrics.searchKeywords);
    console.log('Conversion Funnel:', this.metrics.conversionFunnel);
  }

  /**
   * Initialize SEO monitoring for a page
   */
  static initializeForPage(pageName: string) {
    // Track landing page visits
    if (pageName === 'home') {
      this.metrics.conversionFunnel.landingPage++;
    }

    // Track page view
    this.trackPageview(window.location.pathname, document.title, document.referrer);
  }
}

// Development helper - log SEO status every 30 seconds
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    setInterval(() => {
      SEOMonitoringService.logSEOStatus();
    }, 30000);
  }
} 