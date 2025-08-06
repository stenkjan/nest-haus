/**
 * Performance tests for ImageManager optimizations
 * Validates that the new intelligent preloading works as expected
 */

import { ImageManager } from '../core/ImageManager';
import type { Configuration } from '@/store/configuratorStore';

// Mock fetch for testing
global.fetch = jest.fn();

// Mock configuration for testing
const mockConfiguration: Configuration = {
    nest: {
        category: 'nest',
        value: 'nest80',
        name: 'Nest 80',
        price: 100000,
        description: 'Test nest'
    },
    gebaeudehuelle: {
        category: 'gebaeudehuelle',
        value: 'trapezblech',
        name: 'Trapezblech',
        price: 5000,
        description: 'Test gebaeudehuelle'
    },
    innenverkleidung: {
        category: 'innenverkleidung',
        value: 'kiefer',
        name: 'Kiefer',
        price: 3000,
        description: 'Test innenverkleidung'
    }
};

describe('ImageManager Performance Optimizations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ImageManager.clearImageCache();
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(new Blob())
        });
    });

    describe('Intelligent Preloading', () => {
        it('should preload current view and adjacent views with priority', async () => {
            await ImageManager.preloadImages(mockConfiguration, 'exterior', 'high');

            // Should make requests for exterior, interior, and stirnseite
            expect(fetch).toHaveBeenCalledTimes(3);

            // Verify the calls included proper caching headers
            const fetchCalls = (fetch as jest.Mock).mock.calls;
            fetchCalls.forEach(call => {
                const options = call[1];
                expect(options.cache).toBe('force-cache');
            });
        });

        it('should debounce rapid preload requests', async () => {
            // Make rapid preload requests
            const promises = [
                ImageManager.preloadImages(mockConfiguration, 'exterior', 'normal'),
                ImageManager.preloadImages(mockConfiguration, 'exterior', 'normal'),
                ImageManager.preloadImages(mockConfiguration, 'exterior', 'normal')
            ];

            await Promise.all(promises);

            // Should only make one set of requests due to debouncing
            expect(fetch).toHaveBeenCalledTimes(3); // One for each view
        });

        it('should return predicted next views correctly', () => {
            const predicted = ImageManager.getPredictedNextViews(
                mockConfiguration,
                'exterior',
                true,
                true
            );

            expect(predicted).toContain('interior');
            expect(predicted).toContain('stirnseite');
            expect(predicted.length).toBe(2);
        });

        it('should handle high priority preloading differently', async () => {
            await ImageManager.preloadImages(mockConfiguration, 'exterior', 'high');

            const fetchCalls = (fetch as jest.Mock).mock.calls;

            // High priority should preload all available views
            expect(fetchCalls.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe('Cache Performance', () => {
        it('should cache image paths to prevent recalculation', () => {
            // First call should calculate and cache
            const path1 = ImageManager.getPreviewImage(mockConfiguration, 'exterior');

            // Second call should use cache
            const path2 = ImageManager.getPreviewImage(mockConfiguration, 'exterior');

            expect(path1).toBe(path2);

            // Verify cache has entry
            const cacheInfo = ImageManager.getCacheInfo();
            expect(cacheInfo.size).toBeGreaterThan(0);
        });

        it('should clear caches properly', () => {
            // Generate some cache entries
            ImageManager.getPreviewImage(mockConfiguration, 'exterior');
            ImageManager.getPreviewImage(mockConfiguration, 'interior');

            expect(ImageManager.getCacheInfo().size).toBeGreaterThan(0);

            // Clear cache
            ImageManager.clearImageCache();

            expect(ImageManager.getCacheInfo().size).toBe(0);
        });
    });

    describe('Specific View Preloading', () => {
        it('should preload specific view with high priority', async () => {
            await ImageManager.preloadSpecificView(mockConfiguration, 'interior');

            expect(fetch).toHaveBeenCalledTimes(1);

            const fetchCall = (fetch as jest.Mock).mock.calls[0];
            const options = fetchCall[1];
            expect(options.priority).toBe('high');
        });

        it('should handle preloading errors gracefully', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            // Should not throw
            await expect(
                ImageManager.preloadSpecificView(mockConfiguration, 'exterior')
            ).resolves.toBeUndefined();
        });
    });

    describe('View Detection', () => {
        it('should detect available views correctly', () => {
            const views = ImageManager.getAvailableViews(mockConfiguration, true, true);

            expect(views).toContain('exterior');
            expect(views).toContain('interior'); // Part 2 active
            expect(views).toContain('stirnseite'); // Has nest configuration
        });

        it('should limit views when parts are not active', () => {
            const views = ImageManager.getAvailableViews(mockConfiguration, false, false);

            expect(views).toContain('exterior');
            expect(views).toContain('stirnseite'); // Has nest configuration
            expect(views).not.toContain('interior'); // Part 2 not active
        });
    });
});

describe('Performance Benchmarks', () => {
    it('should resolve image paths quickly', () => {
        const startTime = performance.now();

        // Test multiple path resolutions
        for (let i = 0; i < 100; i++) {
            ImageManager.getPreviewImage(mockConfiguration, 'exterior');
            ImageManager.getPreviewImage(mockConfiguration, 'interior');
            ImageManager.getPreviewImage(mockConfiguration, 'stirnseite');
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        // Should complete 300 path resolutions in under 100ms
        expect(duration).toBeLessThan(100);
    });

    it('should handle cache operations efficiently', () => {
        const startTime = performance.now();

        // Generate cache entries
        for (let i = 0; i < 50; i++) {
            ImageManager.getPreviewImage(mockConfiguration, 'exterior');
        }

        // Clear and check cache info
        const cacheInfo = ImageManager.getCacheInfo();
        ImageManager.clearImageCache();

        const endTime = performance.now();
        const duration = endTime - startTime;

        // Cache operations should be very fast
        expect(duration).toBeLessThan(50);
        expect(cacheInfo.size).toBeGreaterThan(0);
    });
}); 