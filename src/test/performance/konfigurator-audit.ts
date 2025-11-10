/**
 * Konfigurator Performance & Quality Audit Script
 * 
 * Comprehensive testing of:
 * - Pricing data load performance
 * - Price calculation performance
 * - Session tracking
 * - Data accuracy
 */

interface PerformanceMetrics {
  testName: string;
  duration: number;
  status: 'pass' | 'fail' | 'warn';
  target?: number;
  details?: string;
}

interface AuditReport {
  timestamp: string;
  phase: string;
  metrics: PerformanceMetrics[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

export class KonfiguratorAudit {
  private metrics: PerformanceMetrics[] = [];
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  /**
   * Phase 1.1: Test Pricing Data Loading Performance
   */
  async testPricingDataLoad(): Promise<void> {
    console.log('\n=== Phase 1.1: Pricing Data Load Performance ===\n');

    // Test 1: Initial load time
    const startInitial = performance.now();
    const response = await fetch(`${this.baseUrl}/api/pricing/data`);
    const endInitial = performance.now();
    const initialLoadTime = endInitial - startInitial;

    const data = await response.json();

    this.addMetric({
      testName: 'Initial pricing data fetch',
      duration: initialLoadTime,
      status: initialLoadTime < 500 ? 'pass' : initialLoadTime < 1000 ? 'warn' : 'fail',
      target: 500,
      details: `Fetched pricing data in ${initialLoadTime.toFixed(2)}ms`
    });

    // Verify data structure
    if (data.success && data.data) {
      this.addMetric({
        testName: 'Pricing data structure valid',
        duration: 0,
        status: 'pass',
        details: `Version: ${data.version || 'unknown'}, Synced: ${data.syncedAt || 'unknown'}`
      });
    } else {
      this.addMetric({
        testName: 'Pricing data structure valid',
        duration: 0,
        status: 'fail',
        details: 'Invalid data structure returned'
      });
    }

    // Test 2: Cached load time (within 5-minute cache window)
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    const startCached = performance.now();
    await fetch(`${this.baseUrl}/api/pricing/data`);
    const endCached = performance.now();
    const cachedLoadTime = endCached - startCached;

    this.addMetric({
      testName: 'Cached pricing data fetch (5min cache)',
      duration: cachedLoadTime,
      status: cachedLoadTime < 100 ? 'pass' : cachedLoadTime < 200 ? 'warn' : 'fail',
      target: 100,
      details: `Cache hit: ${cachedLoadTime.toFixed(2)}ms`
    });

    // Test 3: Verify required pricing data fields
    if (data.data) {
      const requiredFields = ['nest', 'geschossdecke', 'gebaeudehuelle', 'innenverkleidung', 
                              'pvanlage', 'bodenbelag', 'bodenaufbau', 'belichtungspaket', 
                              'fenster', 'optionen', 'planungspaket'];
      
      const missingFields = requiredFields.filter(field => !data.data[field]);
      
      this.addMetric({
        testName: 'All required pricing fields present',
        duration: 0,
        status: missingFields.length === 0 ? 'pass' : 'fail',
        details: missingFields.length > 0 ? `Missing: ${missingFields.join(', ')}` : 'All fields present'
      });

      // Verify Nest 80 base price
      if (data.data.nest?.nest80?.price) {
        const nest80Price = data.data.nest.nest80.price;
        this.addMetric({
          testName: 'Nest 80 price correct (189,000€)',
          duration: 0,
          status: nest80Price === 189000 ? 'pass' : 'fail',
          details: `Expected: 189000, Got: ${nest80Price}`
        });
      }

      // Verify Lärche price for Nest 80
      if (data.data.gebaeudehuelle?.holzlattung?.nest80) {
        const laerchePrice = data.data.gebaeudehuelle.holzlattung.nest80;
        this.addMetric({
          testName: 'Lärche (Holzlattung) price for Nest 80 (24,413€)',
          duration: 0,
          status: laerchePrice === 24413 ? 'pass' : 'fail',
          details: `Expected: 24413, Got: ${laerchePrice}`
        });
      }
    }
  }

  /**
   * Phase 1.2: Test Price Calculation Performance
   */
  async testPriceCalculation(): Promise<void> {
    console.log('\n=== Phase 1.2: Price Calculation Performance ===\n');

    // This requires loading the page and measuring client-side performance
    // We'll create a browser-based test for this
    this.addMetric({
      testName: 'Price calculation performance test',
      duration: 0,
      status: 'warn',
      details: 'Requires browser-based testing (see browser console)'
    });
  }

  /**
   * Phase 2.1: Test Session Initialization
   */
  async testSessionInitialization(): Promise<void> {
    console.log('\n=== Phase 2.1: Session Initialization ===\n');

    // Test session sync endpoint
    try {
      const testSessionId = `test-${Date.now()}`;
      const testConfig = {
        nest: { category: 'nest', value: 'nest80', name: 'Nest 80', price: 189000 }
      };

      const response = await fetch(`${this.baseUrl}/api/sessions/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: testSessionId,
          configurationData: testConfig,
          totalPrice: 189000
        })
      });

      const result = await response.json();

      this.addMetric({
        testName: 'Session sync API responds',
        duration: 0,
        status: response.ok ? 'pass' : 'fail',
        details: result.message || 'Session sync successful'
      });
    } catch (error) {
      this.addMetric({
        testName: 'Session sync API responds',
        duration: 0,
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Phase 2.2: Test Interaction Tracking
   */
  async testInteractionTracking(): Promise<void> {
    console.log('\n=== Phase 2.2: Interaction Tracking ===\n');

    try {
      const testSessionId = `test-${Date.now()}`;
      const testInteraction = {
        eventType: 'configurator_selection',
        category: 'nest',
        selectionValue: 'nest80'
      };

      const response = await fetch(`${this.baseUrl}/api/sessions/track-interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: testSessionId,
          interaction: testInteraction
        })
      });

      this.addMetric({
        testName: 'Interaction tracking API responds',
        duration: 0,
        status: response.ok ? 'pass' : 'fail',
        details: response.ok ? 'Interaction tracked successfully' : 'Failed to track'
      });
    } catch (error) {
      this.addMetric({
        testName: 'Interaction tracking API responds',
        duration: 0,
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Phase 3.1: Test Admin Analytics
   */
  async testAdminAnalytics(): Promise<void> {
    console.log('\n=== Phase 3.1: Admin Analytics ===\n');

    try {
      const response = await fetch(`${this.baseUrl}/api/admin/user-tracking`);
      const data = await response.json();

      this.addMetric({
        testName: 'User tracking API responds',
        duration: 0,
        status: response.ok ? 'pass' : 'fail',
        details: response.ok ? 'Analytics data available' : 'Failed to fetch'
      });

      if (response.ok && data) {
        // Verify funnel metrics
        const hasFunnel = data.funnel && typeof data.funnel.totalSessions === 'number';
        this.addMetric({
          testName: 'Funnel metrics present',
          duration: 0,
          status: hasFunnel ? 'pass' : 'fail',
          details: hasFunnel ? `Total sessions: ${data.funnel.totalSessions}` : 'Missing funnel data'
        });

        // Verify price distribution
        const hasPriceDistribution = Array.isArray(data.priceDistribution);
        this.addMetric({
          testName: 'Price distribution present',
          duration: 0,
          status: hasPriceDistribution ? 'pass' : 'fail',
          details: hasPriceDistribution ? `${data.priceDistribution.length} price ranges` : 'Missing'
        });

        // Verify configuration analytics
        const hasConfigAnalytics = data.configurationAnalytics && typeof data.configurationAnalytics === 'object';
        this.addMetric({
          testName: 'Configuration analytics present',
          duration: 0,
          status: hasConfigAnalytics ? 'pass' : 'fail',
          details: hasConfigAnalytics ? `${Object.keys(data.configurationAnalytics).length} categories` : 'Missing'
        });

        // Verify quantity analytics
        const hasQuantityAnalytics = data.quantityAnalytics && 
                                     data.quantityAnalytics.geschossdecke && 
                                     data.quantityAnalytics.pvanlage;
        this.addMetric({
          testName: 'Quantity analytics for geschossdecke & PV',
          duration: 0,
          status: hasQuantityAnalytics ? 'pass' : 'fail',
          details: hasQuantityAnalytics ? 'Both present' : 'Missing quantity data'
        });
      }
    } catch (error) {
      this.addMetric({
        testName: 'User tracking API responds',
        duration: 0,
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Phase 5.1: TypeScript & Linting
   */
  async testTypeScriptCompliance(): Promise<void> {
    console.log('\n=== Phase 5.1: TypeScript Compliance ===\n');
    
    this.addMetric({
      testName: 'TypeScript/ESLint compliance',
      duration: 0,
      status: 'warn',
      details: 'Run `npm run lint` manually to verify'
    });
  }

  /**
   * Helper: Add metric to results
   */
  private addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    const icon = metric.status === 'pass' ? '✅' : metric.status === 'warn' ? '⚠️' : '❌';
    const durationStr = metric.duration > 0 ? ` (${metric.duration.toFixed(2)}ms)` : '';
    const targetStr = metric.target ? ` [target: ${metric.target}ms]` : '';
    console.log(`${icon} ${metric.testName}${durationStr}${targetStr}`);
    if (metric.details) {
      console.log(`   ${metric.details}`);
    }
  }

  /**
   * Generate final report
   */
  generateReport(phase: string): AuditReport {
    const summary = {
      total: this.metrics.length,
      passed: this.metrics.filter(m => m.status === 'pass').length,
      failed: this.metrics.filter(m => m.status === 'fail').length,
      warnings: this.metrics.filter(m => m.status === 'warn').length
    };

    console.log('\n=== Summary ===');
    console.log(`Total Tests: ${summary.total}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⚠️ Warnings: ${summary.warnings}`);

    return {
      timestamp: new Date().toISOString(),
      phase,
      metrics: this.metrics,
      summary
    };
  }

  /**
   * Run all tests
   */
  async runAll(): Promise<AuditReport> {
    console.log('🔍 Starting Konfigurator Performance & Quality Audit...\n');

    await this.testPricingDataLoad();
    await this.testPriceCalculation();
    await this.testSessionInitialization();
    await this.testInteractionTracking();
    await this.testAdminAnalytics();
    await this.testTypeScriptCompliance();

    const report = this.generateReport('Complete Audit');
    
    console.log('\n✨ Audit Complete!\n');
    return report;
  }
}

// Export for use in tests or scripts
export default KonfiguratorAudit;

