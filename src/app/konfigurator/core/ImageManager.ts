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
          imagePath = this.getFensterImage(configuration);
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
    if (!configuration?.nest?.value || !configuration?.gebaeudehuelle?.value) {
      return IMAGE_FALLBACKS.exterior;
    }

    // Map nest value to image size
    const nestType = configuration.nest.value;
    const gebaeudehuelle = configuration.gebaeudehuelle.value;

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
    if (!configuration?.gebaeudehuelle?.value) {
      return IMAGE_FALLBACKS.stirnseite;
    }

    const gebaeudehuelle = configuration.gebaeudehuelle.value;
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
   */
  static getInteriorImage(configuration: Configuration): string {
    if (!configuration?.gebaeudehuelle?.value ||
      !configuration?.innenverkleidung?.value ||
      !configuration?.fussboden?.value) {
      return IMAGE_FALLBACKS.interior;
    }

    const { gebaeudehuelle, innenverkleidung, fussboden } = configuration;

    // Create combination key for exact matching
    const combinationKey = `${gebaeudehuelle.value}_${innenverkleidung.value}_${fussboden.value}`;

    // Check exact mappings first
    const exactMapping = INTERIOR_EXACT_MAPPINGS[combinationKey];
    if (exactMapping) {
      const imagePath = IMAGES.configurations[exactMapping as keyof typeof IMAGES.configurations];
      if (imagePath) {
        return imagePath;
      }
    }

    // ENHANCED: Additional security check for valid combinations
    const validExactMappings = Object.keys(INTERIOR_EXACT_MAPPINGS);
    if (!validExactMappings.includes(combinationKey)) {
      console.warn(`🔒 [ImageManager] Invalid combination attempted: ${combinationKey}`);
      return IMAGE_FALLBACKS.interior;
    }

    return IMAGE_FALLBACKS.interior;
  }

  /**
   * Get PV (Photovoltaik) image path
   * CLIENT-SIDE calculation for efficiency
   */
  static getPVImage(configuration: Configuration): string {
    if (!configuration?.gebaeudehuelle?.value) {
      return IMAGES.configurations.pv_holzfassade || IMAGE_FALLBACKS.exterior;
    }

    const gebaeudehuelle = configuration.gebaeudehuelle.value;
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
      return IMAGES.windows.pvc || IMAGES.configurations.fenster_pvc || IMAGE_FALLBACKS.exterior;
    }

    const fensterType = configuration.fenster.value;

    // Map to windows image keys
    const fensterKey = FENSTER_IMAGE_MAPPING[fensterType];
    if (!fensterKey) {
      return IMAGES.windows.pvc || IMAGES.configurations.fenster_pvc || IMAGE_FALLBACKS.exterior;
    }

    // Try windows collection first, then configurations
    const windowImage = IMAGES.windows[fensterKey as keyof typeof IMAGES.windows];
    if (windowImage) {
      return windowImage;
    }

    const configImage = IMAGES.configurations[`fenster_${fensterKey}` as keyof typeof IMAGES.configurations];
    const stirnseitePath = configImage || IMAGES.windows.pvc;

    return stirnseitePath || IMAGES.windows.pvc || IMAGE_FALLBACKS.exterior;
  }

  /**
   * Get available views based on current configuration and part activation state
   * UNCHANGED: This logic is correct
   */
  static getAvailableViews(
    configuration: Configuration | null,
    hasPart2BeenActive: boolean = false,
    _hasPart3BeenActive: boolean = false
  ): ViewType[] {
    const views: ViewType[] = ['exterior'];

    if (!configuration) return views;

    if (configuration.nest || configuration.gebaeudehuelle) {
      views.push('stirnseite');
    }

    if (hasPart2BeenActive) {
      views.push('interior');
    }

    return views;
  }

  /**
   * Preload images for better user experience
   * IMPROVED: Better error handling and performance
   */
  static async preloadImages(configuration: Configuration | null): Promise<void> {
    if (!configuration || typeof window === 'undefined') return;

    try {
      const currentImage = this.getPreviewImage(configuration, 'exterior');
      const imagesToPreload: string[] = [currentImage];

      if (configuration.innenverkleidung) {
        const interiorImage = this.getPreviewImage(configuration, 'interior');
        imagesToPreload.push(interiorImage);
      }

      const uniqueImages = [...new Set(imagesToPreload)].filter(Boolean);

      const preloadPromises = uniqueImages.map(async (imagePath) => {
        try {
          // IMPROVED: Better URL encoding for German characters
          const encodedPath = encodeURIComponent(imagePath);
          await fetch(`/api/images?path=${encodedPath}`, {
            method: 'GET',
            cache: 'force-cache'
          });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`🖼️ Failed to preload image: ${imagePath}`, error);
          }
        }
      });

      await Promise.allSettled(preloadPromises);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('🖼️ Preload images error:', error);
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