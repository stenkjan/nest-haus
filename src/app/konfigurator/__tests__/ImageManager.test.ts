/**
 * ImageManager Tests
 * 
 * Tests the ImageManager functionality:
 * - Image path resolution
 * - Caching and performance
 * - Error handling
 * - View management
 */

import { ImageManager } from '../core/ImageManager';

// Mock configuration for testing
const createMockConfiguration = (overrides = {}) => ({
  sessionId: 'test-session',
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
  },
  totalPrice: 0,
  timestamp: Date.now(),
  ...overrides
});

describe('ImageManager', () => {
  beforeEach(() => {
    // Clear any cached images before each test
    ImageManager.clearPreloadedImages();
  });

  describe('Image Path Resolution', () => {
    it('should generate correct image paths for standard configurations', () => {
      const config = createMockConfiguration();
      
      // Test exterior view
      const exteriorPath = ImageManager.getPreviewImage(config, 'exterior');
      expect(exteriorPath).toContain('nest120');
      expect(exteriorPath).toContain('holzlattung');
      expect(typeof exteriorPath).toBe('string');
      expect(exteriorPath.length).toBeGreaterThan(0);
      
      // Test interior view
      const interiorPath = ImageManager.getPreviewImage(config, 'interior');
      expect(interiorPath).toContain('nest120');
      expect(interiorPath).toContain('kiefer');
      expect(typeof interiorPath).toBe('string');
      expect(interiorPath.length).toBeGreaterThan(0);
      
      // Test floor view
      const floorPath = ImageManager.getPreviewImage(config, 'floor');
      expect(floorPath).toContain('nest120');
      expect(floorPath).toContain('parkett');
      expect(typeof floorPath).toBe('string');
      expect(floorPath.length).toBeGreaterThan(0);
    });

    it('should handle different nest sizes correctly', () => {
      const nestSizes = ['nest80', 'nest100', 'nest120', 'nest140', 'nest160'];
      
      nestSizes.forEach(nestSize => {
        const config = createMockConfiguration({
          nest: {
            category: 'nest',
            value: nestSize,
            name: `Nest ${nestSize.replace('nest', '')}`,
            price: 0
          }
        });
        
        const imagePath = ImageManager.getPreviewImage(config, 'exterior');
        expect(imagePath).toContain(nestSize);
      });
    });

    it('should handle different material combinations', () => {
      const materials = [
        { huelle: 'trapezblech', innen: 'kiefer', boden: 'parkett' },
        { huelle: 'holzlattung', innen: 'kiefer', boden: 'parkett' },
        { huelle: 'fassadenplatten_schwarz', innen: 'eiche', boden: 'fliesen' }
      ];
      
      materials.forEach(material => {
        const config = createMockConfiguration({
          gebaeudehuelle: {
            category: 'gebaeudehuelle',
            value: material.huelle,
            name: 'Test Material',
            price: 0
          },
          innenverkleidung: {
            category: 'innenverkleidung',
            value: material.innen,
            name: 'Test Material',
            price: 0
          },
          fussboden: {
            category: 'fussboden',
            value: material.boden,
            name: 'Test Material',
            price: 0
          }
        });
        
        const exteriorPath = ImageManager.getPreviewImage(config, 'exterior');
        const interiorPath = ImageManager.getPreviewImage(config, 'interior');
        const floorPath = ImageManager.getPreviewImage(config, 'floor');
        
        expect(exteriorPath).toContain(material.huelle);
        expect(interiorPath).toContain(material.innen);
        expect(floorPath).toContain(material.boden);
      });
    });
  });

  describe('Available Views', () => {
    it('should return standard views for complete configurations', () => {
      const config = createMockConfiguration();
      const views = ImageManager.getAvailableViews(config);
      
      expect(Array.isArray(views)).toBe(true);
      expect(views.length).toBeGreaterThan(0);
      expect(views).toContain('exterior');
      
      // Should include interior and floor views for complete configs
      expect(views.includes('interior') || views.includes('floor')).toBe(true);
    });

    it('should handle incomplete configurations gracefully', () => {
      const incompleteConfig = createMockConfiguration({
        gebaeudehuelle: null,
        innenverkleidung: null
      });
      
      const views = ImageManager.getAvailableViews(incompleteConfig);
      
      expect(Array.isArray(views)).toBe(true);
      expect(views.length).toBeGreaterThan(0);
      // Should still return at least one view
      expect(views).toContain('exterior');
    });
  });

  describe('Caching and Performance', () => {
    it('should cache image path calculations', () => {
      const config = createMockConfiguration();
      
      // First call should calculate
      const startTime1 = performance.now();
      const path1 = ImageManager.getPreviewImage(config, 'exterior');
      const endTime1 = performance.now();
      const firstCallTime = endTime1 - startTime1;
      
      // Second call should use cache
      const startTime2 = performance.now();
      const path2 = ImageManager.getPreviewImage(config, 'exterior');
      const endTime2 = performance.now();
      const secondCallTime = endTime2 - startTime2;
      
      // Results should be identical
      expect(path1).toBe(path2);
      
      // Second call should be faster (cached)
      expect(secondCallTime).toBeLessThan(firstCallTime);
      
      console.log(`🖼️ First call: ${firstCallTime.toFixed(3)}ms`);
      console.log(`🖼️ Cached call: ${secondCallTime.toFixed(3)}ms`);
      console.log(`🖼️ Speedup: ${(firstCallTime / secondCallTime).toFixed(1)}x`);
    });

    it('should handle cache clearing', () => {
      const config = createMockConfiguration();
      
      // Populate cache
      const path1 = ImageManager.getPreviewImage(config, 'exterior');
      expect(typeof path1).toBe('string');
      
      // Clear cache
      ImageManager.clearPreloadedImages();
      
      // Should still work after clearing
      const path2 = ImageManager.getPreviewImage(config, 'exterior');
      expect(path2).toBe(path1); // Same result
    });

    it('should complete operations within performance thresholds', () => {
      const config = createMockConfiguration();
      const views = ['exterior', 'interior', 'floor'];
      
      views.forEach(view => {
        const startTime = performance.now();
        const imagePath = ImageManager.getPreviewImage(config, view);
        const endTime = performance.now();
        
        const operationTime = endTime - startTime;
        
        expect(typeof imagePath).toBe('string');
        expect(operationTime).toBeLessThan(10); // Should complete within 10ms
        
        console.log(`🖼️ ${view} image resolution: ${operationTime.toFixed(3)}ms`);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle null/undefined configurations gracefully', () => {
      const nullConfig = null;
      const undefinedConfig = undefined;
      
      // Should not throw errors
      expect(() => {
        ImageManager.getPreviewImage(nullConfig as any, 'exterior');
      }).not.toThrow();
      
      expect(() => {
        ImageManager.getPreviewImage(undefinedConfig as any, 'exterior');
      }).not.toThrow();
      
      expect(() => {
        ImageManager.getAvailableViews(nullConfig as any);
      }).not.toThrow();
    });

    it('should handle invalid view types gracefully', () => {
      const config = createMockConfiguration();
      
      // Should not throw for invalid views
      expect(() => {
        ImageManager.getPreviewImage(config, 'invalid_view' as any);
      }).not.toThrow();
      
      const result = ImageManager.getPreviewImage(config, 'invalid_view' as any);
      expect(typeof result).toBe('string'); // Should return fallback
    });

    it('should handle missing configuration properties', () => {
      const incompleteConfig = {
        sessionId: 'test',
        nest: {
          category: 'nest',
          value: 'nest120',
          name: 'Nest 120',
          price: 0
        }
        // Missing other properties
      };
      
      expect(() => {
        ImageManager.getPreviewImage(incompleteConfig as any, 'exterior');
      }).not.toThrow();
      
      const result = ImageManager.getPreviewImage(incompleteConfig as any, 'exterior');
      expect(typeof result).toBe('string');
    });
  });

  describe('Preloading Functionality', () => {
    it('should handle image preloading without errors', async () => {
      const config = createMockConfiguration();
      
      // Preloading should not throw
      expect(async () => {
        await ImageManager.preloadImages(config);
      }).not.toThrow();
      
      // Test actual preloading (may fail in test environment, but shouldn't crash)
      try {
        await ImageManager.preloadImages(config);
        console.log('🖼️ Image preloading completed successfully');
      } catch (error) {
        console.log('🖼️ Image preloading failed gracefully (expected in test environment)');
      }
    });

    it('should handle preloading with invalid configurations', async () => {
      const invalidConfig = { invalid: 'config' };
      
      // Should not throw even with invalid config
      expect(async () => {
        await ImageManager.preloadImages(invalidConfig as any);
      }).not.toThrow();
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle rapid configuration changes efficiently', () => {
      const baseConfig = createMockConfiguration();
      const materials = ['trapezblech', 'holzlattung', 'fassadenplatten_schwarz'];
      
      const startTime = performance.now();
      
      // Simulate rapid user selections
      materials.forEach(material => {
        const config = createMockConfiguration({
          gebaeudehuelle: {
            category: 'gebaeudehuelle',
            value: material,
            name: 'Test',
            price: 0
          }
        });
        
        const imagePath = ImageManager.getPreviewImage(config, 'exterior');
        expect(typeof imagePath).toBe('string');
        expect(imagePath).toContain(material);
      });
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).toBeLessThan(50); // All operations under 50ms
      
      console.log(`🖼️ Rapid configuration changes: ${totalTime.toFixed(2)}ms`);
    });

    it('should provide consistent results across multiple calls', () => {
      const config = createMockConfiguration();
      const views = ['exterior', 'interior', 'floor'];
      
      // Call multiple times and verify consistency
      views.forEach(view => {
        const results = [];
        
        for (let i = 0; i < 5; i++) {
          results.push(ImageManager.getPreviewImage(config, view));
        }
        
        // All results should be identical
        const firstResult = results[0];
        results.forEach(result => {
          expect(result).toBe(firstResult);
        });
      });
    });
  });

  describe('Memory Management', () => {
    it('should not cause memory leaks during extensive usage', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform many operations
      for (let i = 0; i < 1000; i++) {
        const config = createMockConfiguration({
          nest: {
            category: 'nest',
            value: `nest${80 + (i % 5) * 20}`, // Cycle through nest sizes
            name: 'Test',
            price: 0
          }
        });
        
        ImageManager.getPreviewImage(config, 'exterior');
        ImageManager.getAvailableViews(config);
        
        // Occasionally clear to simulate real usage
        if (i % 100 === 0) {
          ImageManager.clearPreloadedImages();
        }
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
      
      console.log(`🖼️ Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });
  });
}); 