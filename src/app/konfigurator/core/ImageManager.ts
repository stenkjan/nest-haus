/**
 * ImageManager - Preview Image Handling
 * 
 * Manages image preview logic, caching, and view switching.
 * Updated to match the old configurator logic exactly.
 * 
 * @example
 * const imagePath = ImageManager.getPreviewImage(configuration, 'exterior');
 * await ImageManager.preloadImages(configuration);
 */

import { IMAGES } from '@/constants/images';
import type { 
  ViewType,
  ConfigurationItem
} from '../types/configurator.types';
import type { Configuration } from '@/store/configuratorStore';

// In-memory cache for resolved image paths to prevent redundant lookups
const imagePathCache = new Map<string, string>();

export class ImageManager {
  /**
   * Get preview image path based on configuration and view type
   * UPDATED: Matches old configurator logic exactly with security validation
   */
  static getPreviewImage(configuration: Configuration | null, view: ViewType): string {
    // Validate inputs for security
    if (!this.isValidViewType(view)) {
      console.warn(`⚠️ Invalid view type: ${view}, defaulting to exterior`);
      view = 'exterior';
    }

    // Use fallback for null configuration
    if (!configuration) {
      return IMAGES.configurations.nest75_holzlattung;
    }

    // Create cache key for memoization
    const cacheKey = this.createCacheKey(configuration, view);
    
    // Return cached result if available
    if (imagePathCache.has(cacheKey)) {
      return imagePathCache.get(cacheKey)!;
    }

    let imagePath: string;

    switch (view) {
      case 'exterior':
        imagePath = this.getExteriorImage(configuration);
        break;
        
      case 'interior':
        imagePath = this.getInteriorImage(configuration);
        break;
        
      case 'pv':
        imagePath = this.getPvImage(configuration);
        break;
          
      case 'fenster':
        imagePath = this.getFensterImage(configuration);
        break;
        
      default:
        imagePath = this.getExteriorImage(configuration);
    }

    // Cache the result
    imagePathCache.set(cacheKey, imagePath);
    
    return imagePath;
  }

  /**
   * Validate view type for security
   */
  private static isValidViewType(view: string): view is ViewType {
    const validViews: ViewType[] = ['exterior', 'interior', 'pv', 'fenster'];
    return validViews.includes(view as ViewType);
  }

  /**
   * Sanitize configuration values to prevent injection attacks
   */
  private static sanitizeConfigValue(value: string | undefined): string {
    if (!value) return '';
    
    // Remove any non-alphanumeric characters except underscore and hyphen
    return value.replace(/[^a-zA-Z0-9_-]/g, '');
  }

  /**
   * Create a unique cache key for configuration + view combination
   * SECURED: Uses sanitized values to prevent cache pollution
   */
  private static createCacheKey(configuration: Configuration, view: ViewType): string {
    const keys = [
      view,
      this.sanitizeConfigValue(configuration.nest?.value) || 'nest80',
      this.sanitizeConfigValue(configuration.gebaeudehuelle?.value) || 'trapezblech',
      this.sanitizeConfigValue(configuration.innenverkleidung?.value) || 'kiefer',
      this.sanitizeConfigValue(configuration.fussboden?.value) || 'parkett',
      this.sanitizeConfigValue(configuration.pvanlage?.value) || 'none',
      this.sanitizeConfigValue(configuration.fenster?.value) || 'none'
    ];
    
    return keys.join('|');
  }

  /**
   * Get exterior view image - Updated to match old configurator exactly with security
   */
  private static getExteriorImage(configuration: Configuration): string {
    const nest = this.sanitizeConfigValue(configuration.nest?.value) || 'nest80';
    const gebaeude = this.sanitizeConfigValue(configuration.gebaeudehuelle?.value) || 'trapezblech';
    
    // Map nest values to image sizes (matching old configurator)
    const nestSizeMap: Record<string, string> = {
      'nest80': '75',   // nest80 -> 75 in images
      'nest100': '95',  // nest100 -> 95 in images
      'nest120': '115', // nest120 -> 115 in images
      'nest140': '135', // nest140 -> 135 in images
      'nest160': '155'  // nest160 -> 155 in images
    };
    
    const imageSize = nestSizeMap[nest] || '75';
    
    // Map gebäudehülle values to image suffixes (matching old configurator)
    const gebaeudeImageMap: Record<string, string> = {
      'trapezblech': 'trapezblech',
      'holzlattung': 'holzlattung',
      'fassadenplatten_schwarz': 'plattenschwarz',
      'fassadenplatten_weiss': 'plattenweiss'
    };
    
    const gebaeudeImageName = gebaeudeImageMap[gebaeude] || 'holzlattung';
    
    // Construct the image key: nest{size}_{gebaeude}
    const imageKey = `nest${imageSize}_${gebaeudeImageName}` as keyof typeof IMAGES.configurations;
    
    // Return the image path
    const imagePath = IMAGES.configurations[imageKey];
    
    if (imagePath) {
      return imagePath;
    }
    
    // Fallback to default
    return IMAGES.configurations.nest75_holzlattung;
  }

  /**
   * Get interior view image - Updated to match old configurator logic exactly with security
   */
  private static getInteriorImage(configuration: Configuration): string {
    const gebaeude = this.sanitizeConfigValue(configuration.gebaeudehuelle?.value) || 'trapezblech';
    const innenverkleidung = this.sanitizeConfigValue(configuration.innenverkleidung?.value) || 'kiefer';
    const fussboden = this.sanitizeConfigValue(configuration.fussboden?.value) || 'parkett';
    
    // Map gebäudehülle to image prefix
    const gebaeudePrefix: Record<string, string> = {
      'trapezblech': 'trapezblech',
      'holzlattung': 'holzlattung',
      'fassadenplatten_schwarz': 'plattenschwarz',
      'fassadenplatten_weiss': 'plattenweiss'
    };
    
    const prefix = gebaeudePrefix[gebaeude] || 'trapezblech';
    
    // Map innenverkleidung to image middle part
    const innenverkleidungMap: Record<string, string> = {
      'kiefer': 'holznatur',
      'fichte': 'holzweiss',
      'steirische_eiche': 'eiche'
    };
    
    const innenPart = innenverkleidungMap[innenverkleidung] || 'holznatur';
    
    // Map fussboden to image suffix
    const fussbodenMap: Record<string, string> = {
      'parkett': 'parkett',
      'kalkstein_kanafar': 'kalkstein',
      'schiefer_massiv': 'granit'
    };
    
    const fussbodenPart = fussbodenMap[fussboden] || 'kalkstein';
    
    // Construct the full image key: {prefix}_{innen}_{fussboden}
    const imageKey = `${prefix}_${innenPart}_${fussbodenPart}` as keyof typeof IMAGES.configurations;
    
    // Try to get the specific combination
    const imagePath = IMAGES.configurations[imageKey];
    
    if (imagePath) {
      return imagePath;
    }
    
    // Try fallbacks (matching old configurator fallback logic)
    const fallbackKeys = [
      `${prefix}_${innenPart}_kalkstein`,
      `${prefix}_holznatur_kalkstein`,
      `trapezblech_holznatur_kalkstein`
    ];
    
    for (const fallbackKey of fallbackKeys) {
      const fallbackPath = IMAGES.configurations[fallbackKey as keyof typeof IMAGES.configurations];
      if (fallbackPath) {
        return fallbackPath;
      }
    }
    
    // Final fallback
    return IMAGES.configurations.trapezblech_holznatur_kalkstein;
  }

  /**
   * Get PV image - Updated to match old configurator logic with security
   */
  private static getPvImage(configuration: Configuration): string {
    const gebaeude = this.sanitizeConfigValue(configuration.gebaeudehuelle?.value) || 'trapezblech';
    
    // Map gebäudehülle to PV image keys (matching old configurator)
    const pvImageMap: Record<string, keyof typeof IMAGES.configurations> = {
      'trapezblech': 'pv_trapezblech',
      'holzlattung': 'pv_holzfassade',
      'fassadenplatten_schwarz': 'pv_plattenschwarz',
      'fassadenplatten_weiss': 'pv_plattenweiss'
    };
    
    const pvImageKey = pvImageMap[gebaeude] || 'pv_holzfassade';
    const imagePath = IMAGES.configurations[pvImageKey];
    
    if (imagePath) {
      return imagePath;
    }
    
    // Fallback to holzfassade PV
    return IMAGES.configurations.pv_holzfassade;
  }

  /**
   * Get fenster image - Updated to match old configurator logic exactly with security
   */
  private static getFensterImage(configuration: Configuration): string {
    const fensterValue = this.sanitizeConfigValue(configuration.fenster?.value);
    
    if (fensterValue) {
      // Map fenster values to image keys (matching both old and new configurator selections)
      const fensterImageMap: Record<string, keyof typeof IMAGES.configurations> = {
        // New configurator IDs (from configuratorData.ts)
        'pvc_fenster': 'fenster_pvc',
        'fichte': 'fenster_holz_fichte',
        'steirische_eiche': 'fenster_holz_eiche',
        'aluminium': 'fenster_aluminium',
        // Old configurator IDs (for compatibility)
        'kunststoffverkleidung': 'fenster_pvc',
        'eiche': 'fenster_holz_eiche'
      };
      
      const fensterImageKey = fensterImageMap[fensterValue];
      
      if (fensterImageKey && IMAGES.configurations[fensterImageKey]) {
        return IMAGES.configurations[fensterImageKey];
      }
    }
    
    // Fallback to stirnseite view based on gebäudehülle (matching old configurator)
    const gebaeude = this.sanitizeConfigValue(configuration.gebaeudehuelle?.value) || 'trapezblech';
    
    const stirnseiteMap: Record<string, keyof typeof IMAGES.configurations> = {
      'trapezblech': 'TRAPEZBLECH',
      'holzlattung': 'HOLZFASSADE', 
      'fassadenplatten_schwarz': 'PLATTEN_SCHWARZ',
      'fassadenplatten_weiss': 'PLATTEN_WEISS'
    };
    
    const stirnseiteKey = stirnseiteMap[gebaeude] || 'HOLZFASSADE';
    const stirnseitePath = IMAGES.configurations[stirnseiteKey];
    
    if (stirnseitePath) {
      return stirnseitePath;
    }
    
    // Final fallback
    return IMAGES.configurations.fenster_pvc;
  }

  /**
   * Get available views based on current configuration and part activation state
   * UPDATED: Matches the old configurator logic exactly
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
   * OPTIMIZED: Uses efficient browser APIs instead of DOM manipulation
   */
  static async preloadImages(configuration: Configuration | null): Promise<void> {
    if (!configuration || typeof window === 'undefined') return;

    // Only preload current view + immediately likely next view to avoid warnings
    const currentImage = this.getPreviewImage(configuration, 'exterior');
    const imagesToPreload: string[] = [currentImage];
    
    // Add interior image only if we have innenverkleidung selected (likely to be viewed soon)
    if (configuration.innenverkleidung) {
      const interiorImage = this.getPreviewImage(configuration, 'interior');
      imagesToPreload.push(interiorImage);
    }

    // OPTIMIZED: Use browser's fetch with cache instead of DOM manipulation
    const uniqueImages = [...new Set(imagesToPreload)];
    
    // Preload using fetch API for better performance and reliability
    const preloadPromises = uniqueImages.map(async (imagePath) => {
      if (imagePath && imagePath !== 'undefined') {
        try {
          // Use fetch with cache to preload images efficiently
          await fetch(`/api/images?path=${encodeURIComponent(imagePath)}`, {
            method: 'GET',
            cache: 'force-cache'
          });
        } catch {
          // Silently fail - preloading is optimization only
        }
      }
    });

    // Wait for all preloads to complete (or fail silently)
    await Promise.allSettled(preloadPromises);
  }

  /**
   * Clear image preload links from document head
   * DEPRECATED: No longer needed with fetch-based preloading
   */
  static clearPreloadedImages(): void {
    // Method kept for backward compatibility but no longer needed
    return;
  }

  /**
   * Clear image path cache (useful for debugging)
   */
  static clearImageCache(): void {
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

  /**
   * NEW: Preload images for selection (for modular architecture)
   */
  async preloadForSelection(selection: ConfigurationItem): Promise<void> {
    // Simple implementation for now
    console.log('🖼️ Preloading images for selection:', selection.name);
  }

  /**
   * NEW: Preload configuration images (for modular architecture) 
   */
  preloadConfigurationImages(_config: Record<string, unknown>): void {
    console.log('🖼️ Preloading configuration images');
  }

  /**
   * NEW: Clear cache (for modular architecture)
   */
  clearCache(): void {
    imagePathCache.clear();
  }
} 