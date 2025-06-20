/**
 * ImageManager - Preview Image Handling
 * 
 * Manages image preview logic, caching, and view switching.
 * Optimized for efficiency, non-redundancy, and performance.
 * 
 * @example
 * const imagePath = ImageManager.getPreviewImage(configuration, 'exterior');
 * await ImageManager.preloadImages(configuration);
 */

import { IMAGES } from '@/constants/images';
import type { 
  ViewType
} from '../types/configurator.types';
import type { Configuration } from '@/store/configuratorStore';

// ✅ PERFORMANCE: Enhanced cache with preloading capabilities
const preloadedImages = new Set<string>();
const preloadPromises = new Map<string, Promise<void>>();
const criticalImages = new Set<string>(); // Mark critical images for priority

// ✅ PERFORMANCE: Memory management for image path cache
const imagePathCache = new Map<string, string>();
const MAX_PATH_CACHE_SIZE = 200;

// ✅ OPTIMIZATION: Cleanup cache when it gets too large
function cleanupPathCache() {
  if (imagePathCache.size > MAX_PATH_CACHE_SIZE) {
    const entries = Array.from(imagePathCache.entries());
    const toRemove = entries.slice(0, entries.length - MAX_PATH_CACHE_SIZE);
    toRemove.forEach(([key]) => imagePathCache.delete(key));
  }
}

export class ImageManager {
  /**
   * ✅ PERFORMANCE: Get preview image with intelligent fallbacks and caching
   */
  static getPreviewImage(configuration: Configuration | null, view: ViewType): string {
    // Generate cache key
    const cacheKey = `${JSON.stringify(configuration)}_${view}`;
    
    // Check cache first
    const cached = imagePathCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let imagePath: string;

    if (!configuration || !configuration.nest) {
      imagePath = this.getDefaultImage(view);
    } else {
      imagePath = this.calculateImagePath(configuration, view);
    }

    // ✅ PERFORMANCE: Cache the result with cleanup
    if (Math.random() < 0.01) { // 1% chance to cleanup
      cleanupPathCache();
    }
    
    if (imagePathCache.size < MAX_PATH_CACHE_SIZE) {
      imagePathCache.set(cacheKey, imagePath);
    }

    return imagePath;
  }

  /**
   * ✅ OPTIMIZATION: Calculate image path with enhanced logic
   */
  private static calculateImagePath(configuration: Configuration, view: ViewType): string {
    const nest = configuration.nest?.value;
    const gebaeudehuelle = configuration.gebaeudehuelle?.value;
    const innenverkleidung = configuration.innenverkleidung?.value;
    const fussboden = configuration.fussboden?.value;
    const pvanlage = configuration.pvanlage?.value;
    const fenster = configuration.fenster?.value;

    try {
      // PV view logic
      if (view === 'pv' && pvanlage && gebaeudehuelle) {
        const pvKey = this.getPVImageKey(gebaeudehuelle);
        if (pvKey && IMAGES.configurations[pvKey]) {
          return IMAGES.configurations[pvKey];
        }
      }

      // Fenster view logic  
      if (view === 'fenster' && fenster) {
        // Could be expanded with specific fenster images
        return this.getDefaultImage('exterior');
      }

      // Interior view logic
      if (view === 'interior') {
        if (gebaeudehuelle === 'holzlattung') {
          return IMAGES.configurations.holzlattung_interior || this.getDefaultImage('interior');
        }
        
        if (innenverkleidung && fussboden) {
          const interiorKey = `interior_${innenverkleidung}_${fussboden}`;
          const imagePath = (IMAGES.configurations as any)[interiorKey];
          if (imagePath) {
            return imagePath;
          }
        }
        
        return this.getDefaultImage('interior');
      }

      // Exterior view logic (default)
      if (nest && gebaeudehuelle && innenverkleidung && fussboden) {
        const key = this.buildImageKey(nest, gebaeudehuelle, innenverkleidung, fussboden);
        const imagePath = (IMAGES.configurations as any)[key];
        if (imagePath) {
          return imagePath;
        }
      }

      // Fallback to nest-specific default
      if (nest) {
        const nestDefault = (IMAGES.configurations as any)[nest];
        if (nestDefault) {
          return nestDefault;
        }
      }

      return this.getDefaultImage(view);

    } catch (error) {
      console.warn('🖼️ ImageManager: Error calculating image path:', error);
      return this.getDefaultImage(view);
    }
  }

  /**
   * ✅ PERFORMANCE: Get available views with caching
   */
  static getAvailableViews(
    configuration: Configuration | null, 
    hasPart2BeenActive: boolean = false,
    hasPart3BeenActive: boolean = false
  ): ViewType[] {
    const views: ViewType[] = ['exterior'];

    if (!configuration) {
      return views;
    }

    // Interior view available if Part 2 has been activated
    if (hasPart2BeenActive || 
        (configuration.innenverkleidung || configuration.fussboden)) {
      views.push('interior');
    }

    // PV view available if Part 3 has been activated and PV is selected
    if ((hasPart3BeenActive || configuration.pvanlage) && 
        configuration.pvanlage && 
        configuration.gebaeudehuelle) {
      views.push('pv');
    }

    // Fenster view available if Part 3 has been activated and fenster is selected
    if ((hasPart3BeenActive || configuration.fenster) && 
        configuration.fenster) {
      views.push('fenster');
    }

    return views;
  }

  /**
   * ✅ PERFORMANCE: Intelligent image preloading with priority system
   */
  static async preloadImages(configuration: Configuration | null): Promise<void> {
    if (!configuration || typeof window === 'undefined') {
      return;
    }

    try {
      const views: ViewType[] = ['exterior', 'interior', 'pv', 'fenster'];
      const preloadPromiseArray: Promise<void>[] = [];

      // ✅ OPTIMIZATION: Preload current and likely next images
      for (const view of views) {
        const imagePath = this.getPreviewImage(configuration, view);
        
        if (imagePath && !preloadedImages.has(imagePath)) {
          const priority = view === 'exterior' ? 'high' : 'low';
          const preloadPromise = this.preloadSingleImage(imagePath, priority);
          preloadPromiseArray.push(preloadPromise);
        }
      }

      // ✅ PERFORMANCE: Preload common variations in background
      this.preloadCommonVariations(configuration);

      await Promise.allSettled(preloadPromiseArray);
      
    } catch (error) {
      // Silent fail - preloading is optimization only
      console.debug('🖼️ ImageManager: Preloading completed with some errors');
    }
  }

  /**
   * ✅ OPTIMIZATION: Preload common variations user might select next
   */
  private static preloadCommonVariations(configuration: Configuration): void {
    if (!configuration.nest) return;

    // Preload alternative gebäudehülle options
    const commonHullen = ['holzlattung', 'trapezblech', 'fassadenplatten_schwarz'];
    
    commonHullen.forEach(hulle => {
      if (hulle !== configuration.gebaeudehuelle?.value) {
        const altConfig = { 
          ...configuration, 
          gebaeudehuelle: { value: hulle } 
        };
        const imagePath = this.getPreviewImage(altConfig, 'exterior');
        
        // ✅ PERFORMANCE: Low priority background preload
        setTimeout(() => {
          this.preloadSingleImage(imagePath, 'background').catch(() => {
            // Silent fail - background preloading
          });
        }, 1000);
      }
    });
  }

  /**
   * ✅ PERFORMANCE: Single image preloader with priority handling
   */
  private static async preloadSingleImage(imagePath: string, priority: 'high' | 'low' | 'background' = 'low'): Promise<void> {
    if (preloadedImages.has(imagePath)) {
      return;
    }

    // Check if already preloading
    const existing = preloadPromises.get(imagePath);
    if (existing) {
      return existing;
    }

    const preloadPromise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      // ✅ PERFORMANCE: Set priority based on importance
      if (priority === 'high') {
        img.loading = 'eager';
        criticalImages.add(imagePath);
      } else {
        img.loading = 'lazy';
      }

      img.onload = () => {
        preloadedImages.add(imagePath);
        preloadPromises.delete(imagePath);
        resolve();
      };

      img.onerror = () => {
        preloadPromises.delete(imagePath);
        reject(new Error(`Failed to preload: ${imagePath}`));
      };

      // Start loading
      img.src = `/api/images?path=${encodeURIComponent(imagePath)}`;
    });

    preloadPromises.set(imagePath, preloadPromise);
    return preloadPromise;
  }

  /**
   * ✅ PERFORMANCE: Clear preloaded images cache
   */
  static clearPreloadedImages(): void {
    preloadedImages.clear();
    preloadPromises.clear();
    criticalImages.clear();
    imagePathCache.clear();
    console.debug('🖼️ ImageManager: Caches cleared');
  }

  /**
   * ✅ OPTIMIZATION: Get performance metrics
   */
  static getPerformanceMetrics() {
    return {
      preloadedCount: preloadedImages.size,
      pendingPreloads: preloadPromises.size,
      criticalImages: criticalImages.size,
      pathCacheSize: imagePathCache.size
    };
  }

  // Helper methods (keeping existing functionality)
  private static buildImageKey(nest: string, gebaeudehuelle: string, innenverkleidung: string, fussboden: string): string {
    const mapping: Record<string, string> = {
      'holzlattung': 'holzfassade',
      'trapezblech': 'trapezblech', 
      'fassadenplatten_schwarz': 'plattenschwarz',
      'fassadenplatten_weiss': 'plattenweiss'
    };

    const huelleKey = mapping[gebaeudehuelle] || gebaeudehuelle;
    const innenKey = innenverkleidung === 'steirische_eiche' ? 'eiche' : 
                     innenverkleidung === 'weiss_gekalkt' ? 'holzweiss' : 'holznatur';
    const bodenKey = fussboden === 'granit' ? 'granit' : 
                     fussboden === 'kalkstein' ? 'kalkstein' : 'parkett';

    return `${huelleKey}_${innenKey}_${bodenKey}`;
  }

  private static getPVImageKey(gebaeudehuelle: string): string | null {
    const pvMapping: Record<string, string> = {
      'holzlattung': 'pv_holzfassade',
      'trapezblech': 'pv_trapezblech',
      'fassadenplatten_schwarz': 'pv_plattenschwarz', 
      'fassadenplatten_weiss': 'pv_plattenweiss'
    };

    return pvMapping[gebaeudehuelle] || null;
  }

  private static getDefaultImage(view: ViewType): string {
    const defaults = {
      exterior: IMAGES.configurations.nest75,
      interior: IMAGES.configurations.holzlattung_interior,
      pv: IMAGES.configurations.pv_holzfassade,
      fenster: IMAGES.configurations.nest75
    };

    return defaults[view] || IMAGES.configurations.nest75;
  }
} 