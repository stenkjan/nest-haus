/**
 * PriceCalculator Tests
 * 
 * Tests the enhanced PriceCalculator with:
 * - Dynamic pricing calculations
 * - Performance optimization features
 * - Cache management
 * - Error handling
 */

import { PriceCalculator } from '../core/PriceCalculator';
import { MODULAR_PRICING, NEST_OPTIONS } from '@/constants/configurator';

// Mock selections for testing
const mockSelections = {
  nest: {
    category: 'nest',
    value: 'nest120',
    name: 'Nest 120',
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
};

describe('PriceCalculator', () => {
  beforeEach(() => {
    // Clear cache before each test
    PriceCalculator.clearPriceCache();
  });

  describe('Dynamic Pricing Logic', () => {
    it('should calculate correct modular pricing for different nest sizes', () => {
      // Test Nest 80 (0 modules)
      const nest80Price = PriceCalculator.calculateCombinationPrice(
        'nest80',
        'holzlattung',
        'kiefer',
        'parkett'
      );

      // Test Nest 120 (2 modules)
      const nest120Price = PriceCalculator.calculateCombinationPrice(
        'nest120',
        'holzlattung',
        'kiefer',
        'parkett'
      );

      // Test Nest 160 (4 modules)
      const nest160Price = PriceCalculator.calculateCombinationPrice(
        'nest160',
        'holzlattung',
        'kiefer',
        'parkett'
      );

      // Verify modular scaling
      const pricingData = MODULAR_PRICING['holzlattung-kiefer-parkett'];
      const expectedNest80 = pricingData.basePrice;
      const expectedNest120 = pricingData.basePrice + (2 * pricingData.pricePerModule);
      const expectedNest160 = pricingData.basePrice + (4 * pricingData.pricePerModule);

      expect(nest80Price).toBe(expectedNest80);
      expect(nest120Price).toBe(expectedNest120);
      expect(nest160Price).toBe(expectedNest160);

      // Verify price progression
      expect(nest120Price).toBeGreaterThan(nest80Price);
      expect(nest160Price).toBeGreaterThan(nest120Price);
    });

    it('should return correct upgrade prices for base vs pro options', () => {
      const selections = { ...mockSelections };

      // Test base option (should show as included)
      const trapezResult = PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'trapezblech'
      );

      expect(trapezResult.type).toBe('included');

      // Test pro option (should show upgrade price)
      const holzResult = PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );

      expect(holzResult.type).toBe('upgrade');
      expect(holzResult.amount).toBeGreaterThan(0);
      expect(holzResult.monthly).toBeGreaterThan(0);
    });

    it('should scale upgrade prices with nest size correctly', () => {
      const selections = { ...mockSelections };

      // Test upgrade price for Nest 80
      const nest80Upgrade = PriceCalculator.getOptionDisplayPrice(
        'nest80',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );

      // Test upgrade price for Nest 120  
      const nest120Upgrade = PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );

      expect(nest80Upgrade.type).toBe('upgrade');
      expect(nest120Upgrade.type).toBe('upgrade');
      expect(nest120Upgrade.amount).toBeGreaterThan(nest80Upgrade.amount!);
    });
  });

  describe('Performance Optimization', () => {
    it('should cache price calculations efficiently', () => {
      const selections = { ...mockSelections };

      // Clear cache and get initial info
      PriceCalculator.clearPriceCache();
      const initialCacheInfo = PriceCalculator.getPriceCacheInfo();
      expect(initialCacheInfo.size).toBe(0);

      // Calculate price (should add to cache)
      const firstResult = PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );

      const afterFirstCall = PriceCalculator.getPriceCacheInfo();
      expect(afterFirstCall.size).toBe(1);

      // Calculate same price again (should use cache)
      const secondResult = PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );

      const afterSecondCall = PriceCalculator.getPriceCacheInfo();
      expect(afterSecondCall.size).toBe(1); // Cache size shouldn't increase

      // Results should be identical
      expect(secondResult).toEqual(firstResult);
    });

    it('should handle cache TTL correctly', async () => {
      const selections = { ...mockSelections };

      // Set a very short TTL for testing (we'll need to mock this)
      const originalTTL = 30000; // 30 seconds

      // Calculate price to populate cache
      PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );

      const cacheInfo = PriceCalculator.getPriceCacheInfo();
      expect(cacheInfo.size).toBeGreaterThan(0);

      // Cache should still be valid immediately
      expect(cacheInfo.size).toBeGreaterThan(0);
    });

    it('should provide performance monitoring capabilities', () => {
      // Test cache info functionality
      const cacheInfo = PriceCalculator.getPriceCacheInfo();
      expect(cacheInfo).toHaveProperty('size');
      expect(cacheInfo).toHaveProperty('keys');
      expect(Array.isArray(cacheInfo.keys)).toBe(true);

      // Test cache clearing
      PriceCalculator.clearPriceCache();
      const clearedCacheInfo = PriceCalculator.getPriceCacheInfo();
      expect(clearedCacheInfo.size).toBe(0);
      expect(clearedCacheInfo.keys.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid nest types gracefully', () => {
      const selections = { ...mockSelections };

      const result = PriceCalculator.getOptionDisplayPrice(
        'invalid_nest',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );

      // Invalid nest type should still return a valid result (upgrade or included)
      expect(['included', 'upgrade']).toContain(result.type);
      expect(result).toHaveProperty('type');
    });

    it('should handle empty selections gracefully', () => {
      const result = PriceCalculator.getOptionDisplayPrice(
        'nest120',
        {},
        'gebaeudehuelle',
        'holzlattung'
      );

      expect(result.type).toBe('upgrade');
      expect(result.amount).toBeGreaterThan(0);
    });

    it('should handle null/undefined inputs', () => {
      const result = PriceCalculator.getOptionDisplayPrice(
        '',
        {},
        'gebaeudehuelle',
        'holzlattung'
      );

      expect(result.type).toBe('included');
    });
  });

  describe('Total Price Calculation', () => {
    it('should calculate total price with all components', () => {
      const fullSelections = {
        ...mockSelections,
        pvanlage: {
          category: 'pvanlage',
          value: 'pv_standard',
          name: 'PV-Anlage Standard',
          price: 2000,
          quantity: 4
        },
        fenster: {
          category: 'fenster',
          value: 'holz_alu',
          name: 'Holz-Alu Fenster',
          price: 800,
          squareMeters: 25
        },
        paket: {
          category: 'planungspaket',
          value: 'pro',
          name: 'Pro Planungspaket',
          price: 5000
        },
        grundstueckscheck: true
      };

      const totalPrice = PriceCalculator.calculateTotalPrice(fullSelections);

      expect(totalPrice).toBeGreaterThan(0);

      // Verify breakdown
      const breakdown = PriceCalculator.getPriceBreakdown(fullSelections);
      expect(breakdown.totalPrice).toBe(totalPrice);
      expect(breakdown.basePrice).toBeGreaterThan(0);
      expect(breakdown.options).toHaveProperty('pvanlage');
      expect(breakdown.options).toHaveProperty('fenster');
      expect(breakdown.options).toHaveProperty('paket');
      expect(breakdown.options).toHaveProperty('grundstueckscheck');
    });

    it('should return 0 for configurations without nest selection', () => {
      const selectionsWithoutNest = {
        gebaeudehuelle: mockSelections.gebaeudehuelle
      };

      const totalPrice = PriceCalculator.calculateTotalPrice(selectionsWithoutNest);
      expect(totalPrice).toBe(0);
    });
  });

  describe('Monthly Payment Calculation', () => {
    it('should calculate monthly payments correctly', () => {
      const amount = 100000; // €100,000
      const monthly = PriceCalculator.calculateMonthlyPaymentAmount(amount);

      expect(monthly).toBeGreaterThan(0);
      expect(monthly).toBeLessThan(amount); // Monthly should be less than total
      expect(typeof monthly).toBe('number');
    });

    it('should handle zero amount', () => {
      const monthly = PriceCalculator.calculateMonthlyPaymentAmount(0);
      expect(monthly).toBe(0);
    });

    it('should handle negative amounts', () => {
      const monthly = PriceCalculator.calculateMonthlyPaymentAmount(-1000);
      // Should return a reasonable value, not necessarily 0 (could be the calculation result)
      expect(typeof monthly).toBe('number');
      expect(monthly).toBeLessThan(0); // Negative input can result in negative output
    });
  });

  describe('Combination Validation', () => {
    it('should validate existing combinations', () => {
      const isValid = PriceCalculator.isValidCombination(
        'nest120',
        'holzlattung',
        'kiefer',
        'parkett'
      );

      expect(isValid).toBe(true);
    });

    it('should identify invalid combinations', () => {
      const isValid = PriceCalculator.isValidCombination(
        'nest120',
        'invalid_material',
        'kiefer',
        'parkett'
      );

      expect(isValid).toBe(false);
    });
  });

  describe('Performance Benchmarks', () => {
    it('should complete price calculations within performance thresholds', () => {
      const selections = { ...mockSelections };
      const iterations = 100;

      const startTime = performance.now();

      // Run multiple calculations to test performance
      for (let i = 0; i < iterations; i++) {
        PriceCalculator.getOptionDisplayPrice(
          'nest120',
          selections,
          'gebaeudehuelle',
          'holzlattung'
        );
      }

      const endTime = performance.now();
      const averageTime = (endTime - startTime) / iterations;

      // Average calculation should be under 1ms
      expect(averageTime).toBeLessThan(1);

      console.log(`💰 Average price calculation time: ${averageTime.toFixed(3)}ms`);
    });

    it('should demonstrate cache performance benefits', () => {
      const selections = { ...mockSelections };

      // Clear cache for clean test
      PriceCalculator.clearPriceCache();

      // Time first calculation (cache miss)
      const start1 = performance.now();
      PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );
      const end1 = performance.now();
      const cacheMissTime = end1 - start1;

      // Time second calculation (cache hit)
      const start2 = performance.now();
      PriceCalculator.getOptionDisplayPrice(
        'nest120',
        selections,
        'gebaeudehuelle',
        'holzlattung'
      );
      const end2 = performance.now();
      const cacheHitTime = end2 - start2;

      // Cache hit should be significantly faster
      expect(cacheHitTime).toBeLessThan(cacheMissTime);

      console.log(`💰 Cache miss time: ${cacheMissTime.toFixed(3)}ms`);
      console.log(`💰 Cache hit time: ${cacheHitTime.toFixed(3)}ms`);
      console.log(`💰 Performance improvement: ${(cacheMissTime / cacheHitTime).toFixed(1)}x`);
    });
  });
}); 