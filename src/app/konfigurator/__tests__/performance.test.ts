/**
 * Configurator Performance Tests
 * 
 * Tests the performance optimizations implemented:
 * - Price calculation caching
 * - useMemo effectiveness
 * - Render optimization
 * - Memory management
 */

import { PriceCalculator } from '../core/PriceCalculator';
import { MODULAR_PRICING } from '@/constants/configurator';

// Performance test configuration
const PERFORMANCE_THRESHOLDS = {
  SINGLE_CALCULATION_MAX_MS: 1,      // Single price calculation should be under 1ms
  CACHED_CALCULATION_MAX_MS: 0.1,     // Cached calculation should be under 0.1ms
  BATCH_CALCULATION_MAX_MS: 10,       // Batch of 100 calculations under 10ms
  CACHE_HIT_RATIO_MIN: 0.8,          // Cache should hit 80% of the time in repeated tests
  MEMORY_LEAK_THRESHOLD: 1000,       // Cache should not grow beyond 1000 entries
};

// Mock selections for consistent testing
const createMockSelections = (nestValue = 'nest120') => ({
  nest: {
    category: 'nest',
    value: nestValue,
    name: `Nest ${nestValue.replace('nest', '')}`,
    price: 0
  },
  gebaeudehuelle: {
    category: 'gebaeudehuelle',
    value: 'holzlattung',
    name: 'Holzlattung Lärche',
    price: 0
  },
  innenverkleidung: {
    category: 'innenverkleidung',
    value: 'kiefer',
    name: 'Kiefer',
    price: 0
  },
  fussboden: {
    category: 'fussboden',
    value: 'parkett',
    name: 'Parkett',
    price: 0
  }
});

describe('Configurator Performance Tests', () => {
  beforeEach(() => {
    // Clear cache before each test for consistent results
    PriceCalculator.clearPriceCache();
  });

  describe('Price Calculation Performance', () => {
    it('should complete single price calculations within threshold', () => {
      const selections = createMockSelections();

      const startTime = performance.now();
      const result = PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );
      const endTime = performance.now();

      const calculationTime = endTime - startTime;

      expect(result).toBeDefined();
      expect(calculationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_CALCULATION_MAX_MS);

      console.log(`💰 Single calculation time: ${calculationTime.toFixed(3)}ms`);
    });

    it('should demonstrate significant cache performance improvement', () => {
      const selections = createMockSelections();

      // First calculation (cache miss)
      const start1 = performance.now();
      const result1 = PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );
      const end1 = performance.now();
      const cacheMissTime = end1 - start1;

      // Second calculation (cache hit)
      const start2 = performance.now();
      const result2 = PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );
      const end2 = performance.now();
      const cacheHitTime = end2 - start2;

      // Verify results are identical
      expect(result1).toEqual(result2);

      // Cache hit should be significantly faster
      expect(cacheHitTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CACHED_CALCULATION_MAX_MS);
      expect(cacheHitTime).toBeLessThan(cacheMissTime);

      const speedupFactor = cacheMissTime / cacheHitTime;
      expect(speedupFactor).toBeGreaterThan(2); // At least 2x faster

      console.log(`💰 Cache miss: ${cacheMissTime.toFixed(3)}ms`);
      console.log(`💰 Cache hit: ${cacheHitTime.toFixed(3)}ms`);
      console.log(`💰 Speedup: ${speedupFactor.toFixed(1)}x`);
    });

    it('should handle batch calculations efficiently', () => {
      const selections = createMockSelections();
      const batchSize = 100;

      const startTime = performance.now();

      // Perform batch calculations
      for (let i = 0; i < batchSize; i++) {
        PriceCalculator.getOptionDisplayPrice(
          'nest120',
          selections,
          'gebaeudehuelle',
          'holzlattung'
        );
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / batchSize;

      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.BATCH_CALCULATION_MAX_MS);
      expect(averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CACHED_CALCULATION_MAX_MS);

      console.log(`💰 Batch of ${batchSize} calculations: ${totalTime.toFixed(2)}ms`);
      console.log(`💰 Average per calculation: ${averageTime.toFixed(3)}ms`);
    });
  });

  describe('Cache Effectiveness', () => {
    it('should achieve high cache hit ratio in repeated scenarios', () => {
      const selections = createMockSelections();
      const iterations = 50;
      let cacheHits = 0;

      // Perform repeated calculations
      for (let i = 0; i < iterations; i++) {
        const cacheInfoBefore = PriceCalculator.getPriceCacheInfo();

        PriceCalculator.getOptionDisplayPrice(
          'nest120',
          selections,
          'gebaeudehuelle',
          'holzlattung'
        );

        const cacheInfoAfter = PriceCalculator.getPriceCacheInfo();

        // If cache size didn't increase, it was a hit
        if (cacheInfoAfter.size === cacheInfoBefore.size) {
          cacheHits++;
        }
      }

      const cacheHitRatio = cacheHits / iterations;

      expect(cacheHitRatio).toBeGreaterThan(PERFORMANCE_THRESHOLDS.CACHE_HIT_RATIO_MIN);

      console.log(`💰 Cache hit ratio: ${(cacheHitRatio * 100).toFixed(1)}%`);
    });

    it('should manage cache size to prevent memory leaks', () => {
      const baseSelections = createMockSelections();

      // Generate many different cache entries
      for (let nestSize = 80; nestSize <= 160; nestSize += 20) {
        for (let i = 0; i < 10; i++) {
          const selections = createMockSelections(`nest${nestSize}`);

          PriceCalculator.getOptionDisplayPrice(
            `nest${nestSize}`,
            selections,
            'gebaeudehuelle',
            'holzlattung'
          );

          PriceCalculator.getOptionDisplayPrice(
            `nest${nestSize}`,
            selections,
            'innenverkleidung',
            'kiefer'
          );
        }
      }

      const cacheInfo = PriceCalculator.getPriceCacheInfo();

      // Cache should not grow unbounded
      expect(cacheInfo.size).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_LEAK_THRESHOLD);

      console.log(`💰 Cache size after stress test: ${cacheInfo.size} entries`);
    });

    it('should clear cache effectively', () => {
      const selections = createMockSelections();

      // Populate cache
      PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );

      let cacheInfo = PriceCalculator.getPriceCacheInfo();
      expect(cacheInfo.size).toBeGreaterThan(0);

      // Clear cache
      PriceCalculator.clearPriceCache();

      cacheInfo = PriceCalculator.getPriceCacheInfo();
      expect(cacheInfo.size).toBe(0);
      expect(cacheInfo.keys.length).toBe(0);
    });
  });

  describe('Total Price Calculation Performance', () => {
    it('should calculate complex configurations quickly', () => {
      const complexSelections = {
        ...createMockSelections('nest160'),
        pvanlage: {
          category: 'pvanlage',
          value: 'pv_pro',
          name: 'PV Premium',
          price: 3000,
          quantity: 8
        },
        fenster: {
          category: 'fenster',
          value: 'holz_alu',
          name: 'Holz-Alu',
          price: 1200,
          squareMeters: 45
        },
        paket: {
          category: 'planungspaket',
          value: 'pro',
          name: 'Pro',
          price: 8000
        },
        grundstueckscheck: true
      };

      const startTime = performance.now();
      const totalPrice = PriceCalculator.calculateTotalPrice(complexSelections);
      const endTime = performance.now();

      const calculationTime = endTime - startTime;

      expect(totalPrice).toBeGreaterThan(0);
      expect(calculationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_CALCULATION_MAX_MS);

      console.log(`💰 Complex total calculation: ${calculationTime.toFixed(3)}ms`);
      console.log(`💰 Total price: €${totalPrice.toLocaleString()}`);
    });

    it('should handle price breakdown calculations efficiently', () => {
      const selections = createMockSelections('nest120');

      const startTime = performance.now();
      const breakdown = PriceCalculator.getPriceBreakdown(selections);
      const endTime = performance.now();

      const calculationTime = endTime - startTime;

      expect(breakdown).toBeDefined();
      expect(breakdown.totalPrice).toBeGreaterThan(0);
      expect(breakdown.basePrice).toBeGreaterThan(0);
      expect(calculationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_CALCULATION_MAX_MS);

      console.log(`💰 Price breakdown calculation: ${calculationTime.toFixed(3)}ms`);
    });
  });

  describe('Memory Performance', () => {
    it('should not leak memory during extensive operations', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform many operations
      for (let i = 0; i < 1000; i++) {
        const selections = createMockSelections();

        PriceCalculator.getOptionDisplayPrice(
          'nest120',
          selections,
          'gebaeudehuelle',
          'holzlattung'
        );

        PriceCalculator.calculateTotalPrice(selections);

        // Occasionally clear cache to simulate real usage
        if (i % 100 === 0) {
          PriceCalculator.clearPriceCache();
        }
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);

      console.log(`💰 Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });
  });

  describe('Real-World Performance Scenarios', () => {
    it('should handle rapid user interactions efficiently', async () => {
      const selections = createMockSelections();
      const interactions = 20;

      const startTime = performance.now();

      // Simulate rapid user clicks changing options
      for (let i = 0; i < interactions; i++) {
        const materials = ['trapezblech', 'holzlattung', 'fassadenplatten_schwarz'];
        const material = materials[i % materials.length];

        PriceCalculator.getOptionDisplayPrice(
          'nest120',
          selections,
          'gebaeudehuelle',
          material
        );

        // Small delay to simulate real interaction timing
        await new Promise(resolve => setTimeout(resolve, 1));
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / interactions;

      expect(averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_CALCULATION_MAX_MS);

      console.log(`🔧 ${interactions} rapid interactions: ${totalTime.toFixed(2)}ms`);
      console.log(`🔧 Average per interaction: ${averageTime.toFixed(3)}ms`);
    });

    it('should scale well with configuration complexity', () => {
      const testConfigurations = [
        // Simple configuration
        createMockSelections(),

        // Medium configuration
        {
          ...createMockSelections('nest120'),
          pvanlage: { category: 'pvanlage', value: 'pv_standard', price: 2000, quantity: 4 }
        },

        // Complex configuration
        {
          ...createMockSelections('nest160'),
          pvanlage: { category: 'pvanlage', value: 'pv_pro', price: 3000, quantity: 8 },
          fenster: { category: 'fenster', value: 'holz_alu', price: 1200, squareMeters: 45 },
          paket: { category: 'planungspaket', value: 'pro', price: 8000 },
          grundstueckscheck: true
        }
      ];

      const performanceTimes = testConfigurations.map((config, index) => {
        const startTime = performance.now();
        const totalPrice = PriceCalculator.calculateTotalPrice(config);
        const endTime = performance.now();

        const calculationTime = endTime - startTime;

        expect(totalPrice).toBeGreaterThan(0);
        expect(calculationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_CALCULATION_MAX_MS);

        console.log(`💰 Config ${index + 1} calculation: ${calculationTime.toFixed(3)}ms`);

        return calculationTime;
      });

      // Performance should not degrade significantly with complexity
      const maxTime = Math.max(...performanceTimes);
      const minTime = Math.min(...performanceTimes);
      const performanceRatio = maxTime / minTime;

      expect(performanceRatio).toBeLessThan(3); // Complex should be less than 3x slower than simple

      console.log(`💰 Performance scaling ratio: ${performanceRatio.toFixed(2)}x`);
    });
  });

  describe('Performance Regression Detection', () => {
    it('should maintain baseline performance metrics', () => {
      const selections = createMockSelections();
      const iterations = 100;
      const times: number[] = [];

      // Measure baseline performance
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        PriceCalculator.getOptionDisplayPrice(
          'nest120',
          selections,
          'gebaeudehuelle',
          'holzlattung'
        );
        const endTime = performance.now();

        times.push(endTime - startTime);
      }

      // Calculate statistics
      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);

      // Performance assertions
      expect(averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CACHED_CALCULATION_MAX_MS);
      expect(maxTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_CALCULATION_MAX_MS);

      console.log(`📊 Performance Statistics (${iterations} iterations):`);
      console.log(`   Average: ${averageTime.toFixed(4)}ms`);
      console.log(`   Min: ${minTime.toFixed(4)}ms`);
      console.log(`   Max: ${maxTime.toFixed(4)}ms`);
      console.log(`   Range: ${(maxTime - minTime).toFixed(4)}ms`);
    });
  });
}); 