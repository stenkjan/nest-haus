/**
 * ImageManager - Preview Image Handling
 * 
 * Manages image preview logic, caching, and view switching.
 * CLEANED UP: Uses constants from configurator.ts, improved security, better error handling
 * 
 * @example
 * const imagePath = ImageManager.getPreviewImage(configuration, 'exterior');
 * await ImageManager.preloadImages(configuration);
 */

import { IMAGES } from '@/constants/images';
import {
  NEST_SIZE_MAPPING,
  GEBAEUDE_EXTERIOR_MAPPING,
  STIRNSEITE_MAPPING,
  PV_IMAGE_MAPPING,
  FENSTER_IMAGE_MAPPING,
  INTERIOR_EXACT_MAPPINGS,
  VALID_VIEW_TYPES,
  IMAGE_FALLBACKS,
  type ValidViewType
} from '@/constants/configurator';
import type { ViewType } from '../types/configurator.types';
import type { Configuration } from '@/store/configuratorStore';

// In-memory cache for resolved image paths to prevent redundant lookups
const imagePathCache = new Map<string, string>();

export class ImageManager {
  /**
   * Get preview image path based on configuration and view type
   * IMPROVED: Uses constants, better validation, fixed encoding issues
   */
  static getPreviewImage(configuration: Configuration | null, view: ViewType): string {
    // Validate inputs for security
    if (!this.isValidViewType(view)) {
      console.warn(`⚠️ Invalid view type: ${view}, defaulting to exterior`);
      view = 'exterior';
    }

    // Use fallback for null configuration
    if (!configuration) {
      return IMAGE_FALLBACKS.exterior;
    }

    // Create cache key for memoization
    const cacheKey = this.createCacheKey(configuration, view);

    // Return cached result if available
    if (imagePathCache.has(cacheKey)) {
      return imagePathCache.get(cacheKey)!;
    }

    let imagePath: string;

    try {
      switch (view) {
        case 'exterior':
          imagePath = this.getExteriorImage(configuration);
          break;
        case 'stirnseite':
          imagePath = this.getStirnseiteImage(configuration);
          break;
        case 'interior':
          imagePath = this.getInteriorImage(configuration);
          break;
        case 'pv':
          imagePath = this.getPVImage(configuration);
          break;
        case 'fenster':
          // Fenster view removed - fall back to exterior view
          imagePath = this.getExteriorImage(configuration);
          break;
        default:
          imagePath = this.getExteriorImage(configuration);
      }
    } catch (error) {
      console.error(`🖼️ Error getting ${view} image:`, error);
      imagePath = IMAGE_FALLBACKS.exterior;
    }

    // Cache the result
    imagePathCache.set(cacheKey, imagePath);

    return imagePath;
  }

  /**
   * Validate view type for security - IMPROVED: Uses constants
   */
  private static isValidViewType(view: string): view is ViewType {
    return VALID_VIEW_TYPES.includes(view as ValidViewType);
  }

  /**
   * Sanitize configuration values to prevent injection attacks
   * IMPROVED: More robust sanitization
   */
  private static sanitizeConfigValue(value: string | undefined): string {
    if (!value || typeof value !== 'string') return '';

    // Remove any non-alphanumeric characters except underscore and hyphen
    // Also preserve umlauts for German image names
    return value.replace(/[^a-zA-Z0-9_\-äöüÄÖÜß]/g, '');
  }

  /**
   * Create a unique cache key for configuration + view combination
   * IMPROVED: Better validation and encoding handling
   * FIXED: Fenster is excluded from cache key since it doesn't affect exterior/interior/stirnseite images
   */
  private static createCacheKey(configuration: Configuration, view: ViewType): string {
    const keys = [
      view,
      this.sanitizeConfigValue(configuration.nest?.value) || 'nest80',
      this.sanitizeConfigValue(configuration.gebaeudehuelle?.value) || 'holzlattung',
      this.sanitizeConfigValue(configuration.innenverkleidung?.value) || 'laerche',
      this.sanitizeConfigValue(configuration.fussboden?.value) || 'parkett',
      this.sanitizeConfigValue(configuration.pvanlage?.value) || 'none'
      // NOTE: fenster is intentionally excluded - it doesn't affect which combination picture is shown
      // Only Hoam size and gebäudehülle determine exterior view
      // Only gebäudehülle, innenverkleidung, and fussboden determine interior view
    ];

    return keys.join('|');
  }

  /**
   * Get fallback preview image if specific image not found
   * @private
   */
  private static getFallbackPreviewImage(): string {
    // Use the exterior fallback directly since it's an image path
    return IMAGE_FALLBACKS.exterior;
  }

  /**
   * Get exterior image path for a given configuration
   * CLIENT-SIDE calculation for efficiency
   */
  static getExteriorImage(configuration: Configuration): string {
    // If no Hoam selection, use fallback
    if (!configuration?.nest?.value) {
      return IMAGE_FALLBACKS.exterior;
    }

    // Map Hoam value to image size
    const nestType = configuration.nest.value;
    // Use default gebaeudehuelle if not selected yet
    const gebaeudehuelle = configuration.gebaeudehuelle?.value || 'holzlattung';

    const nestSize = NEST_SIZE_MAPPING[nestType];
    const exteriorType = GEBAEUDE_EXTERIOR_MAPPING[gebaeudehuelle];

    if (!nestSize || !exteriorType) {
      return IMAGE_FALLBACKS.exterior;
    }

    // Construct image key: nest{size}_{exteriorType}
    const imageKey = `nest${nestSize}_${exteriorType}`;

    // Return the image path directly from configurations
    let imagePath = IMAGES.configurations[imageKey as keyof typeof IMAGES.configurations];

    if (!imagePath) {
      imagePath = IMAGE_FALLBACKS.exterior;
    }

    return imagePath;
  }

  /**
   * Get stirnseite (front view) image path
   * CLIENT-SIDE calculation for efficiency
   */
  static getStirnseiteImage(configuration: Configuration): string {
    // Use default gebaeudehuelle if not selected yet
    const gebaeudehuelle = configuration?.gebaeudehuelle?.value || 'holzlattung';
    const stirnseiteKey = STIRNSEITE_MAPPING[gebaeudehuelle];

    if (!stirnseiteKey) {
      return IMAGE_FALLBACKS.stirnseite;
    }

    const imagePath = IMAGES.configurations[stirnseiteKey as keyof typeof IMAGES.configurations];
    return imagePath || IMAGE_FALLBACKS.stirnseite;
  }

  /**
   * Get interior image path with enhanced security and fallback logic
   * Uses exact mappings for specific combinations, then fallback logic
   * CLIENT-SIDE calculation for efficiency and security
   * 
   * FIXED: Now respects selected gebäudehülle instead of always defaulting to trapezblech
   */
  static getInteriorImage(configuration: Configuration): string {
    // Use selected values or defaults matching new pricing structure
    const gebaeudehuelle = configuration?.gebaeudehuelle?.value || 'holzlattung';
    const innenverkleidung = configuration?.innenverkleidung?.value || 'laerche';
    const fussboden = configuration?.fussboden?.value || 'parkett';

    // Create combination key for exact matching
    const combinationKey = `${gebaeudehuelle}_${innenverkleidung}_${fussboden}`;

    // Check exact mappings first (for trapezblech combinations)
    const exactMapping = INTERIOR_EXACT_MAPPINGS[combinationKey];
    if (exactMapping) {
      const imagePath = IMAGES.configurations[exactMapping as keyof typeof IMAGES.configurations];
      if (imagePath) {
        return imagePath;
      }
    }

    // RESTORED: Interdependent logic for other gebäudehülle types
    // Build combination dynamically using individual mappings
    try {
      const gebaeudePrefixMapping = {
        'trapezblech': 'trapezblech',
        'holzlattung': 'holzlattung',
        'fassadenplatten_schwarz': 'plattenschwarz',
        'fassadenplatten_weiss': 'plattenweiss'
      };

      const innenverkleidungMapping = {
        'laerche': 'holznatur',
        'fichte': 'holzweiss',
        'steirische_eiche': 'eiche',
        'ohne_innenverkleidung': 'ohne_innenverkleidung'
      };

      const gebaeude = gebaeudePrefixMapping[gebaeudehuelle as keyof typeof gebaeudePrefixMapping];
      const innen = innenverkleidungMapping[innenverkleidung as keyof typeof innenverkleidungMapping];

      // CRITICAL: Fussboden mapping differs based on innenverkleidung
      // - ohne_innenverkleidung uses: steinplatten_hell, steinplatten_dunkel
      // - fichte/laerche/eiche use: kalkstein, schiefer
      const isOhneInnenverkleidung = innenverkleidung === 'ohne_innenverkleidung';

      const fussbodenMapping = isOhneInnenverkleidung ? {
        'parkett': 'parkett',
        'parkett_eiche': 'parkett',
        'kalkstein_kanafar': 'steinplatten_hell',
        'steinplatten_hell': 'steinplatten_hell',
        'schiefer_massiv': 'steinplatten_dunkel',
        'steinplatten_dunkel': 'steinplatten_dunkel',
        'ohne_belag': 'ohne_belag'
      } : {
        'parkett': 'parkett',
        'parkett_eiche': 'parkett',
        'kalkstein_kanafar': 'kalkstein',
        'schiefer_massiv': 'schiefer',
        'ohne_belag': 'ohne_belag'
      };

      // All gebäudehülle types now use the same fussboden mapping
      const fussBoden = fussbodenMapping[fussboden as keyof typeof fussbodenMapping];

      if (gebaeude && innen && fussBoden) {
        // Build the image key: gebaeude_innen_fussboden
        const dynamicImageKey = `${gebaeude}_${innen}_${fussBoden}`;

        const imagePath = IMAGES.configurations[dynamicImageKey as keyof typeof IMAGES.configurations];
        if (imagePath) {
          return imagePath;
        }
      }
    } catch (error) {
      console.warn(`🖼️ Error building dynamic interior combination for ${combinationKey}:`, error);
    }

    // ENHANCED: Additional security check for valid combinations
    const validExactMappings = Object.keys(INTERIOR_EXACT_MAPPINGS);
    if (!validExactMappings.includes(combinationKey)) {
      console.warn(`🔒 [ImageManager] Using fallback for combination: ${combinationKey}`);
    }

    return IMAGE_FALLBACKS.interior;
  }

  /**
   * Get PV (Photovoltaik) image path
   * CLIENT-SIDE calculation for efficiency
   */
  static getPVImage(configuration: Configuration): string {
    // Use default gebaeudehuelle if not selected yet
    const gebaeudehuelle = configuration?.gebaeudehuelle?.value || 'holzlattung';
    const pvKey = PV_IMAGE_MAPPING[gebaeudehuelle];

    if (!pvKey) {
      return IMAGES.configurations.pv_holzfassade || IMAGE_FALLBACKS.exterior;
    }

    const imagePath = IMAGES.configurations[pvKey as keyof typeof IMAGES.configurations];
    return imagePath || IMAGES.configurations.pv_holzfassade || IMAGE_FALLBACKS.exterior;
  }

  /**
   * Get Fenster (Window) image path  
   * CLIENT-SIDE calculation for efficiency
   */
  static getFensterImage(configuration: Configuration): string {
    if (!configuration?.fenster?.value) {
      return IMAGE_FALLBACKS.fenster;
    }

    const fensterType = configuration.fenster.value;

    // Map to windows image keys
    const fensterKey = FENSTER_IMAGE_MAPPING[fensterType];
    if (!fensterKey) {
      return IMAGE_FALLBACKS.fenster;
    }

    // Try windows collection first, then configurations
    const windowImage = IMAGES.windows[fensterKey as keyof typeof IMAGES.windows];
    if (windowImage) {
      return windowImage;
    }

    const configImage = IMAGES.configurations[`fenster_${fensterKey}` as keyof typeof IMAGES.configurations];
    if (configImage) {
      return configImage;
    }

    return IMAGE_FALLBACKS.fenster;
  }

  /**
   * Get available views based on current configuration and part activation state
   * FIXED: Corrected order - interior at index 1, stirnseite at index 2
   */
  static getAvailableViews(
    configuration: Configuration | null,
    hasPart2BeenActive: boolean = false,
    _hasPart3BeenActive: boolean = false
  ): ViewType[] {
    const views: ViewType[] = ['exterior'];

    if (!configuration) return views;

    // Add interior view first (index 1) when part 2 has been active
    if (hasPart2BeenActive) {
      views.push('interior');
    }

    // Add stirnseite view last when Hoam or gebäudehülle is configured
    if (configuration.nest || configuration.gebaeudehuelle) {
      views.push('stirnseite');
    }

    return views;
  }

  /**
   * Intelligent preloading of all likely images based on configuration
   * ENHANCED: Predictive loading with connection-aware optimization
   */
  static async preloadImages(configuration: Configuration | null): Promise<void> {
    if (!configuration || typeof window === 'undefined') return;

    try {
      // Connection-aware preloading
      const { shouldLimitPreloading, getOptimalPreloadCount, getPreloadDelay } = await import('@/utils/connectionDetection');

      if (shouldLimitPreloading()) {
        // Conservative preloading for slow connections/mobile
        const maxPreloads = getOptimalPreloadCount();
        const delay = getPreloadDelay();

        setTimeout(async () => {
          const imagesToPreload = this.getPredictiveImageList(configuration).slice(0, maxPreloads);
          if (imagesToPreload.length > 0) {
            await this.batchPreloadImages(imagesToPreload);
          }
        }, delay);

        return;
      }

      // Full preloading for fast connections
      const imagesToPreload = this.getPredictiveImageList(configuration);
      if (imagesToPreload.length === 0) return;

      // Use batch loading for better performance
      await this.batchPreloadImages(imagesToPreload);

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('🖼️ Enhanced preload error:', error);
      }
    }
  }

  /**
   * Get predictive list of images user is likely to need
   * INTELLIGENT: Based on current configuration state and user journey
   */
  private static getPredictiveImageList(configuration: Configuration): string[] {
    const images: string[] = [];

    // Always preload exterior (most common view)
    images.push(this.getPreviewImage(configuration, 'exterior'));

    // If Hoam is selected, preload stirnseite (common next view)
    if (configuration.nest) {
      images.push(this.getPreviewImage(configuration, 'stirnseite'));
    }

    // If interior materials selected, preload interior view
    if (configuration.innenverkleidung || configuration.fussboden) {
      images.push(this.getPreviewImage(configuration, 'interior'));
    }

    // If PV selected, preload PV view
    if (configuration.pvanlage) {
      images.push(this.getPreviewImage(configuration, 'pv'));
    }

    // Fenster preloading removed - no longer showing fenster view

    // PREDICTIVE: If only Hoam selected, preload likely next configurations
    if (configuration.nest && !configuration.gebaeudehuelle) {
      // Preload most common exterior materials for current nest
      const commonMaterials = ['trapezblech', 'holzverkleidung', 'putz'];
      commonMaterials.forEach(material => {
        const tempConfig = {
          ...configuration,
          gebaeudehuelle: {
            category: 'gebaeudehuelle',
            value: material,
            name: material,
            price: 0
          }
        };
        images.push(this.getPreviewImage(tempConfig, 'exterior'));
      });
    }

    // Remove duplicates and filter out empty paths
    return [...new Set(images)].filter(Boolean);
  }

  /**
 * Batch preload images using optimized batch API calls
 * PERFORMANCE: Single API call for multiple images
 */
  private static async batchPreloadImages(imagePaths: string[]): Promise<void> {
    if (imagePaths.length === 0) return;

    // Group into batches of 20 for batch API (API limit)
    const batchSize = 20;
    const batches: string[][] = [];

    for (let i = 0; i < imagePaths.length; i += batchSize) {
      batches.push(imagePaths.slice(i, i + batchSize));
    }

    // Process batches sequentially to avoid overwhelming API
    for (const batch of batches) {
      try {
        await this.preloadImageBatch(batch);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`🖼️ Batch API failed, falling back to individual requests`, error);
        }

        // Fallback to individual requests if batch API fails
        const fallbackPromises = batch.map(imagePath => this.preloadSingleImage(imagePath));
        await Promise.allSettled(fallbackPromises);
      }

      // Small delay between batches to prevent overwhelming
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  /**
   * Preload batch of images using batch API
   * OPTIMIZED: Single API call for multiple images
   */
  private static async preloadImageBatch(imagePaths: string[]): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch('/api/images/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paths: imagePaths }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Batch API HTTP ${response.status}`);
      }

      const data = await response.json();

      if (process.env.NODE_ENV === 'development') {
        const successCount = (Object.values(data.results) as Array<{ type: string }>).filter(
          (result) => result.type === 'blob' || result.type === 'cached'
        ).length;
        console.debug(`🚀 Batch preloaded: ${successCount}/${imagePaths.length} images`);
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`⏰ Batch preload timeout for ${imagePaths.length} images`);
        }
      }
      throw error; // Re-throw to trigger fallback
    }
  }

  /**
   * Preload single image with enhanced error handling
   * OPTIMIZED: Uses existing ClientBlobImage cache system
   */
  private static async preloadSingleImage(imagePath: string): Promise<void> {
    try {
      // Use a more efficient approach by triggering the ClientBlobImage cache
      // This leverages the existing ImageCache.getOrFetch mechanism
      const encodedPath = encodeURIComponent(imagePath);

      // Use fetch with abort controller for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`/api/images?path=${encodedPath}`, {
        method: 'GET',
        cache: 'force-cache',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Pre-parse the response to warm up the cache
      const data = await response.json();

      if (process.env.NODE_ENV === 'development') {
        console.debug(`🎯 Preloaded: ${imagePath} -> ${data.type}`);
      }

    } catch (error) {
      // Silently fail for preloading - don't block user experience
      if (process.env.NODE_ENV === 'development') {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn(`⏰ Preload timeout: ${imagePath}`);
        } else {
          console.warn(`🖼️ Preload failed: ${imagePath}`, error);
        }
      }
    }
  }

  /**
   * Utility methods for debugging and compatibility
   */
  static clearPreloadedImages(): void {
    // Method kept for backward compatibility
    return;
  }

  static clearImageCache(): void {
    imagePathCache.clear();
  }

  static getCacheInfo(): { size: number, keys: string[] } {
    return {
      size: imagePathCache.size,
      keys: Array.from(imagePathCache.keys())
    };
  }

  /**
   * Clear cache for specific configuration to force refresh
   */
  static clearCacheForConfiguration(configuration: Configuration): void {
    const viewTypes: ViewType[] = ['exterior', 'interior', 'stirnseite', 'pv'];

    viewTypes.forEach(view => {
      const cacheKey = this.createCacheKey(configuration, view);
      if (imagePathCache.has(cacheKey)) {
        imagePathCache.delete(cacheKey);
      }
    });
  }

  static async preloadForSelection(_selection: unknown, _context?: unknown): Promise<void> {
    return Promise.resolve();
  }

  static preloadConfigurationImages(_config: unknown): void {
    // Already handled by preloadImages
  }

  static clearCache(): void {
    this.clearImageCache();
  }
} 