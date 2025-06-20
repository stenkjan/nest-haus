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

// In-memory cache for resolved image paths to prevent redundant lookups
const imagePathCache = new Map<string, string>();
const _preloadingInProgress = new Set<string>();

export class ImageManager {
  /**
   * Get preview image path based on configuration and view type
   * Uses memoization to prevent redundant calculations
   */
  static getPreviewImage(configuration: Configuration | null, view: ViewType): string {
    if (!configuration) {
      console.debug('🖼️ ImageManager: No configuration provided, using default fallback');
      return IMAGES.configurations.nest75_holzlattung; // Default fallback
    }

    // Create cache key for memoization
    const cacheKey = this.createCacheKey(configuration, view);
    
    // Return cached result if available
    if (imagePathCache.has(cacheKey)) {
      const cachedPath = imagePathCache.get(cacheKey)!;
      console.debug('🚀 ImageManager: Using cached path', { cacheKey, cachedPath });
      return cachedPath;
    }

    // Extract current selections with safe defaults
    const nest = configuration.nest?.value || 'nest80';
    const gebaeude = configuration.gebaeudehuelle?.value || 'holzlattung'; 
    const innenverkleidung = configuration.innenverkleidung?.value || 'kiefer';
    const fussboden = configuration.fussboden?.value || 'parkett';

    console.debug('🖼️ ImageManager: Computing new preview image', {
      view,
      nest,
      gebaeude,
      innenverkleidung,
      fussboden,
      cacheKey
    });

    let imagePath: string;

    switch (view) {
      case 'exterior':
        imagePath = this.getExteriorImage(nest, gebaeude);
        break;
        
      case 'interior':
        imagePath = this.getInteriorImage(gebaeude, innenverkleidung, fussboden);
        break;
        
      case 'pv':
        // For PV view, show exterior with PV if selected, otherwise show exterior
        imagePath = configuration.pvanlage 
          ? this.getExteriorImage(nest, gebaeude) // Could add specific PV images later
          : this.getExteriorImage(nest, gebaeude);
        break;
          
      case 'fenster':
        imagePath = this.getFensterImage(gebaeude);
        break;
        
      default:
        imagePath = this.getExteriorImage(nest, gebaeude);
    }

    // Cache the result
    imagePathCache.set(cacheKey, imagePath);
    
    console.debug('✅ ImageManager: Image path computed and cached', {
      view,
      imagePath,
      cacheKey,
      cacheSize: imagePathCache.size
    });
    
    return imagePath;
  }

  /**
   * Create a unique cache key for configuration + view combination
   */
  private static createCacheKey(configuration: Configuration, view: ViewType): string {
    const keys = [
      view,
      configuration.nest?.value || 'nest80',
      configuration.gebaeudehuelle?.value || 'holzlattung',
      configuration.innenverkleidung?.value || 'kiefer',
      configuration.fussboden?.value || 'parkett',
      configuration.pvanlage?.value || 'none',
      configuration.fenster?.value || 'standard'
    ];
    
    return keys.join('|');
  }

  /**
   * Get exterior view image based on nest size and gebaeude type
   * Fixed typo and improved fallback logic
   */
  private static getExteriorImage(nest: string, gebaeude: string): string {
    console.debug('🏠 ImageManager: Getting exterior image', { nest, gebaeude });
    
    // Map nest values to image-compatible names
    const nestMap: Record<string, string> = {
      'nest80': 'nest75',   // Map to closest available size
      'nest100': 'nest95',
      'nest120': 'nest115', 
      'nest140': 'nest135',
      'nest160': 'nest155'
    };
    
    const mappedNest = nestMap[nest] || 'nest75';
    
    // Map gebaeude values to image-compatible names
    const gebaeudeMap: Record<string, string> = {
      'trapezblech': 'trapezblech',
      'holzlattung': 'holzlattung',
      'fassadenplatten_schwarz': 'plattenschwarz',
      'fassadenplatten_weiss': 'plattenweiss'
    };
    
    const mappedGebaeude = gebaeudeMap[gebaeude] || 'holzlattung';
    
    // Construct image key: nest + gebaeude (e.g., nest75_holzlattung)
    const exteriorKey = `${mappedNest}_${mappedGebaeude}` as keyof typeof IMAGES.configurations;
    
    // Improved fallback logic with multiple levels
    let imagePath = IMAGES.configurations[exteriorKey];
    
    if (imagePath) {
      console.debug('✅ Found exact match:', imagePath);
      return imagePath;
    }
    
    // Fallback 1: Try with default holzlattung for this nest size
    const fallback1Key = `${mappedNest}_holzlattung` as keyof typeof IMAGES.configurations;
    imagePath = IMAGES.configurations[fallback1Key];
    if (imagePath) {
      console.debug('⚠️ Using fallback 1 (holzlattung):', imagePath);
      return imagePath;
    }
    
    // Fallback 2: Try just the nest size (e.g., nest75)
    const fallback2Key = mappedNest as keyof typeof IMAGES.configurations;
    imagePath = IMAGES.configurations[fallback2Key];
    if (imagePath) {
      console.debug('⚠️ Using fallback 2 (nest only):', imagePath);
      return imagePath;
    }
    
    // Final fallback
    const finalFallback = IMAGES.configurations.nest75_holzlattung;
    console.debug('🚨 Using final fallback:', finalFallback);
    return finalFallback;
  }

  /**
   * Get interior view image based on material combinations
   */
  private static getInteriorImage(gebaeude: string, innenverkleidung: string, fussboden: string): string {
    console.debug('🎨 ImageManager: Getting interior image', { gebaeude, innenverkleidung, fussboden });
    
    // Map values to image-compatible names
    const gebaeudeName = this.mapGebaeudeName(gebaeude);
    const innenName = this.mapInnenverkleidungName(innenverkleidung);
    const bodenName = this.mapFussbodenName(fussboden);
    
    // Try different combination patterns used in IMAGES.configurations
    const combinations = [
      `${gebaeudeName}_${innenName}_${bodenName}`,     // Full combination
      `${gebaeudeName}_${innenName}_granit`,            // Fallback with granit
      `${gebaeudeName}_holznatur_${bodenName}`,         // Fallback with holznatur
      `${gebaeudeName}_holznatur_kalkstein`,            // Standard fallback
      `${gebaeudeName}_interior`,                       // Gebaeude-specific interior
    ];
    
    for (const combo of combinations) {
      const imageKey = combo as keyof typeof IMAGES.configurations;
      if (IMAGES.configurations[imageKey]) {
        console.debug('✅ Found interior image:', combo, '→', IMAGES.configurations[imageKey]);
        return IMAGES.configurations[imageKey];
      }
    }
    
    // Final fallback to default interior
    const finalFallback = IMAGES.configurations.interiorDefault || 
                         IMAGES.configurations.trapezblech_holznatur_kalkstein;
    console.debug('🚨 Using interior fallback:', finalFallback);
    return finalFallback;
  }

  /**
   * Get fenster/stirnseite view image
   */
  private static getFensterImage(gebaeude: string): string {
    console.debug('🪟 ImageManager: Getting fenster image', { gebaeude });
    
    // Map to stirnseite view images
    const stirnseiteMap: Record<string, keyof typeof IMAGES.configurations> = {
      'trapezblech': 'TRAPEZBLECH',
      'holzlattung': 'HOLZFASSADE', 
      'fassadenplatten_schwarz': 'PLATTEN_SCHWARZ',
      'fassadenplatten_weiss': 'PLATTEN_WEISS'
    };
    
    const stirnseiteKey = stirnseiteMap[gebaeude];
    
    const imagePath = IMAGES.configurations[stirnseiteKey] || 
                     IMAGES.configurations.HOLZFASSADE;
    
    console.debug('✅ Fenster image:', { gebaeude, key: stirnseiteKey, path: imagePath });
    return imagePath;
  }

  /**
   * Map gebaeude values to image naming convention
   */
  private static mapGebaeudeName(gebaeude: string): string {
    const mapping: Record<string, string> = {
      'trapezblech': 'trapezblech',
      'holzlattung': 'holzlattung', 
      'fassadenplatten_schwarz': 'plattenschwarz',
      'fassadenplatten_weiss': 'plattenweiss'
    };
    return mapping[gebaeude] || 'trapezblech';
  }

  /**
   * Map innenverkleidung values to image naming convention
   */
  private static mapInnenverkleidungName(innenverkleidung: string): string {
    const mapping: Record<string, string> = {
      'kiefer': 'holznatur',
      'fichte': 'holzweiss', 
      'steirische_eiche': 'eiche'
    };
    return mapping[innenverkleidung] || 'holznatur';
  }

  /**
   * Map fussboden values to image naming convention  
   */
  private static mapFussbodenName(fussboden: string): string {
    const mapping: Record<string, string> = {
      'parkett': 'parkett',
      'kalkstein_kanafar': 'kalkstein',
      'schiefer_massiv': 'granit'
    };
    return mapping[fussboden] || 'granit';
  }

  /**
   * Get available views based on current configuration and part activation state
   * This matches the old configurator logic exactly
   */
  static getAvailableViews(
    configuration: Configuration | null, 
    hasPart2BeenActive: boolean = false, 
    hasPart3BeenActive: boolean = false
  ): ViewType[] {
    const views: ViewType[] = ['exterior']; // Always available (index 1 in old system)
    
    if (!configuration) return views;
    
    // Interior view available only if Part 2 has been activated (index 2 in old system)
    if (hasPart2BeenActive) {
      views.push('interior');
    }
    
    // PV and Fenster views available only if Part 3 has been activated (index 3&4 in old system)
    if (hasPart3BeenActive) {
      // PV view available if PV is selected
      if (configuration.pvanlage) {
        views.push('pv');
      }
      
      // Fenster view available if fenster is selected
      if (configuration.fenster) {
        views.push('fenster');
      }
    }
    
    return views;
  }

  /**
   * Preload images for better user experience
   * Conservative preloading to avoid "unused preload" warnings
   */
  static async preloadImages(configuration: Configuration | null): Promise<void> {
    if (!configuration || typeof window === 'undefined') return;

    console.debug('⚡ ImageManager: Preloading images for configuration', configuration);

    // Only preload current view + immediately likely next view to avoid warnings
    const currentImage = this.getPreviewImage(configuration, 'exterior');
    const imagesToPreload: string[] = [currentImage];
    
    // Add interior image only if we have innenverkleidung selected (likely to be viewed soon)
    if (configuration.innenverkleidung) {
      const interiorImage = this.getPreviewImage(configuration, 'interior');
      imagesToPreload.push(interiorImage);
    }

    // Preload using browser's native preloading (conservative approach)
    const uniqueImages = [...new Set(imagesToPreload)];
    
    console.debug('⚡ Conservative preloading:', uniqueImages);
    
    // Clear any existing preload links first to avoid accumulation
    this.clearPreloadedImages();
    
    uniqueImages.forEach(imagePath => {
      if (imagePath && imagePath !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = `/api/images?path=${encodeURIComponent(imagePath)}`;
        // Add identifier for easier cleanup
        link.setAttribute('data-nest-preload', 'true');
        document.head.appendChild(link);
      }
    });
  }

  /**
   * Get predictive images based on common user journeys
   */
  private static getPredictiveImages(configuration: Configuration | null): string[] {
    if (!configuration) return [];

    const images: string[] = [];
    
    // If only nest is selected, preload common gebaeude options
    if (configuration.nest && !configuration.gebaeudehuelle) {
      const nest = configuration.nest.value;
      const commonOptions = ['holzlattung', 'trapezblech', 'fassadenplatten_schwarz'];
      
      commonOptions.forEach(gebaeude => {
        images.push(this.getExteriorImage(nest, gebaeude));
      });
    }
    
    // If gebaeude is selected, preload interior combinations
    if (configuration.gebaeudehuelle && !configuration.innenverkleidung) {
      const gebaeude = configuration.gebaeudehuelle.value;
      const commonInterior = ['holznatur_kalkstein', 'holznatur_granit', 'eiche_kalkstein'];
      
      commonInterior.forEach(combo => {
        const [innen, boden] = combo.split('_');
        images.push(this.getInteriorImage(gebaeude, innen, boden));
      });
    }
    
    return images;
  }

  /**
   * Cache image for offline/faster loading
   */
  static async cacheImage(imagePath: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const response = await fetch(`/api/images?path=${encodeURIComponent(imagePath)}`);
      if (response.ok) {
        // Image is now cached by browser
        console.debug('🎯 Cached image:', imagePath);
      }
    } catch (error) {
      console.debug('⚠️ Failed to cache image:', imagePath, error);
    }
  }

  /**
   * Get image dimensions for layout calculations
   */
  static async getImageDimensions(imagePath: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        resolve({ width: 800, height: 600 }); // Fallback dimensions
      };
      img.src = `/api/images?path=${encodeURIComponent(imagePath)}`;
    });
  }

  /**
   * Clear image preload links from document head
   */
  static clearPreloadedImages(): void {
    if (typeof document === 'undefined') return;
    
    // Remove only our preload links to avoid interfering with other components
    const preloadLinks = document.querySelectorAll('link[data-nest-preload="true"]');
    preloadLinks.forEach(link => {
      link.remove();
    });
  }

  /**
   * Clear image path cache (useful for debugging)
   */
  static clearImageCache(): void {
    const cacheSize = imagePathCache.size;
    console.debug('🗑️ ImageManager: Clearing image path cache', { 
      clearedEntries: cacheSize,
      keys: Array.from(imagePathCache.keys())
    });
    imagePathCache.clear();
  }

  /**
   * Get cache status for debugging
   */
  static getCacheInfo(): { size: number, keys: string[] } {
    return {
      size: imagePathCache.size,
      keys: Array.from(imagePathCache.keys())
    };
  }
} 