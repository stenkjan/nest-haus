/**
 * ImageManager - Preview Image Handling
 * 
 * Manages image preview logic, caching, and view switching.
 * OPTIMIZED: Intelligent preloading, adjacent view prediction, coordinated caching
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

// Enhanced caching system
const imagePathCache = new Map<string, string>();
const preloadProgressCache = new Map<string, Promise<void>>();
const adjacentViewsCache = new Map<string, ViewType[]>();

// Performance monitoring
let lastPreloadTimestamp = 0;
const PRELOAD_DEBOUNCE_MS = 300; // Prevent excessive preloading

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
   * ENHANCED: Intelligent preloading with adjacent view prediction and debouncing
   * Preloads current, adjacent, and predicted images for seamless user experience
   */
  static async preloadImages(
    configuration: Configuration | null,
    currentView: ViewType = 'exterior',
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<void> {
    if (!configuration || typeof window === 'undefined') return;

    // Debounce preloading to prevent excessive API calls during rapid configuration changes
    const now = Date.now();
    if (priority === 'normal' && now - lastPreloadTimestamp < PRELOAD_DEBOUNCE_MS) {
      return;
    }
    lastPreloadTimestamp = now;

    const configKey = this.createCacheKey(configuration, currentView);

    // Return existing preload promise to prevent duplicate operations
    if (preloadProgressCache.has(configKey)) {
      return preloadProgressCache.get(configKey);
    }

    const preloadPromise = this.executeIntelligentPreload(configuration, currentView, priority);
    preloadProgressCache.set(configKey, preloadPromise);

    try {
      await preloadPromise;
    } finally {
      // Clear after a delay to allow for rapid view switches
      setTimeout(() => preloadProgressCache.delete(configKey), 2000);
    }
  }

  /**
   * ENHANCED: Execute intelligent preloading strategy
   */
  private static async executeIntelligentPreload(
    configuration: Configuration,
    currentView: ViewType,
    priority: 'high' | 'normal' | 'low'
  ): Promise<void> {
    try {
      const availableViews = this.getAvailableViews(configuration, true, true);
      const imagesToPreload: { path: string; priority: number }[] = [];

      // Priority 1: Current view (highest priority)
      const currentImagePath = this.getPreviewImage(configuration, currentView);
      imagesToPreload.push({ path: currentImagePath, priority: 1 });

      // Priority 2: Adjacent views (next/previous) for seamless navigation
      const currentIndex = availableViews.indexOf(currentView);
      if (currentIndex !== -1) {
        // Next view
        const nextIndex = (currentIndex + 1) % availableViews.length;
        const nextView = availableViews[nextIndex];
        const nextImagePath = this.getPreviewImage(configuration, nextView);
        imagesToPreload.push({ path: nextImagePath, priority: 2 });

        // Previous view
        const prevIndex = currentIndex === 0 ? availableViews.length - 1 : currentIndex - 1;
        const prevView = availableViews[prevIndex];
        const prevImagePath = this.getPreviewImage(configuration, prevView);
        imagesToPreload.push({ path: prevImagePath, priority: 2 });
      }

      // Priority 3: All other available views (background preloading)
      if (priority === 'high') {
        availableViews.forEach(view => {
          if (view !== currentView) {
            const imagePath = this.getPreviewImage(configuration, view);
            if (!imagesToPreload.some(img => img.path === imagePath)) {
              imagesToPreload.push({ path: imagePath, priority: 3 });
            }
          }
        });
      }

      // Remove duplicates and sort by priority
      const uniqueImages = imagesToPreload
        .filter((img, index, arr) => arr.findIndex(i => i.path === img.path) === index)
        .sort((a, b) => a.priority - b.priority);

      // Execute preloading with staggered timing based on priority
      const preloadPromises = uniqueImages.map(async (img, index) => {
        try {
          // Stagger requests to prevent overwhelming the server
          const delay = img.priority === 1 ? 0 : img.priority === 2 ? 50 : 100 + (index * 25);

          if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }

          const encodedPath = encodeURIComponent(img.path);
          await fetch(`/api/images?path=${encodedPath}`, {
            method: 'GET',
            cache: 'force-cache',
            priority: img.priority === 1 ? 'high' : img.priority === 2 ? 'auto' : 'low'
          } as RequestInit);

          if (process.env.NODE_ENV === 'development') {
            console.debug(`🖼️ Preloaded (P${img.priority}): ${img.path.substring(img.path.lastIndexOf('/') + 1)}`);
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`🖼️ Failed to preload image: ${img.path}`, error);
          }
        }
      });

      await Promise.allSettled(preloadPromises);

      if (process.env.NODE_ENV === 'development') {
        console.debug(`🖼️ Intelligent preload completed: ${uniqueImages.length} images (current: ${currentView})`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('🖼️ Intelligent preload error:', error);
      }
    }
  }

  /**
   * ENHANCED: Get predicted next views based on user behavior patterns
   */
  static getPredictedNextViews(
    configuration: Configuration | null,
    currentView: ViewType,
    hasPart2BeenActive: boolean = false,
    hasPart3BeenActive: boolean = false
  ): ViewType[] {
    if (!configuration) return [];

    const availableViews = this.getAvailableViews(configuration, hasPart2BeenActive, hasPart3BeenActive);
    const currentIndex = availableViews.indexOf(currentView);

    if (currentIndex === -1) return [];

    // Predict likely next views based on common user patterns
    const predictions: ViewType[] = [];

    // Add adjacent views (most likely)
    const nextIndex = (currentIndex + 1) % availableViews.length;
    const prevIndex = currentIndex === 0 ? availableViews.length - 1 : currentIndex - 1;

    predictions.push(availableViews[nextIndex]);
    if (availableViews[prevIndex] !== availableViews[nextIndex]) {
      predictions.push(availableViews[prevIndex]);
    }

    return predictions;
  }

  /**
   * ENHANCED: Preload specific view with immediate priority
   */
  static async preloadSpecificView(
    configuration: Configuration | null,
    view: ViewType
  ): Promise<void> {
    if (!configuration || typeof window === 'undefined') return;

    try {
      const imagePath = this.getPreviewImage(configuration, view);
      const encodedPath = encodeURIComponent(imagePath);

      await fetch(`/api/images?path=${encodedPath}`, {
        method: 'GET',
        cache: 'force-cache',
        priority: 'high'
      } as RequestInit);

      if (process.env.NODE_ENV === 'development') {
        console.debug(`🖼️ High-priority preload: ${view} -> ${imagePath.substring(imagePath.lastIndexOf('/') + 1)}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🖼️ Failed to preload ${view}:`, error);
      }
    }
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
   * Create cache key for memoization
   * IMPROVED: Better key generation for cache efficiency
   */
  private static createCacheKey(configuration: Configuration, view: ViewType): string {
    const nest = configuration?.nest?.value || 'none';
    const gebaeudehuelle = configuration?.gebaeudehuelle?.value || 'none';
    const innenverkleidung = configuration?.innenverkleidung?.value || 'none';
    const fussboden = configuration?.fussboden?.value || 'none';
    const pvanlage = configuration?.pvanlage?.value || 'none';
    const fenster = configuration?.fenster?.value || 'none';

    return `${view}_${nest}_${gebaeudehuelle}_${innenverkleidung}_${fussboden}_${pvanlage}_${fenster}`;
  }

  /**
   * Get exterior image path with enhanced security and fallback logic
   * Uses nest size for primary image selection, gebäudehülle for material overlay
   * CLIENT-SIDE calculation for efficiency and security
   */
  static getExteriorImage(configuration: Configuration): string {
    // Use selected nest size or default to nest80
    const nestValue = configuration?.nest?.value || 'nest80';
    const gebaeudehuelle = configuration?.gebaeudehuelle?.value || 'trapezblech';

    // Primary image based on nest size
    const nestKey = NEST_SIZE_MAPPING[nestValue];
    if (!nestKey) {
      return IMAGE_FALLBACKS.exterior;
    }

    // Get gebäudehülle-specific image
    const gebaeudeMapping = GEBAEUDE_EXTERIOR_MAPPING[gebaeudehuelle];
    if (!gebaeudeMapping) {
      return IMAGE_FALLBACKS.exterior;
    }

    // Try to get specific image for this combination
    const imageKey = `${nestKey}_${gebaeudeMapping}`;
    const specificImage = IMAGES.configurations[imageKey as keyof typeof IMAGES.configurations];

    if (specificImage) {
      return specificImage;
    }

    // Fallback to nest-specific image
    const nestImage = IMAGES.configurations[nestKey as keyof typeof IMAGES.configurations];
    return nestImage || IMAGE_FALLBACKS.exterior;
  }

  /**
   * Get stirnseite (front view) image path
   * CLIENT-SIDE calculation for efficiency
   */
  static getStirnseiteImage(configuration: Configuration): string {
    // Get nest size for stirnseite view (side view depends on house size)
    const nestValue = configuration?.nest?.value || 'nest80';
    const stirnseiteKey = STIRNSEITE_MAPPING[nestValue];

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
    // Use selected gebäudehülle or default to trapezblech only if not selected
    const gebaeudehuelle = configuration?.gebaeudehuelle?.value || 'trapezblech';
    const innenverkleidung = configuration?.innenverkleidung?.value || 'kiefer';
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
    // For non-trapezblech types, use interdependent selection rules

    if (gebaeudehuelle === 'holzfassade' || gebaeudehuelle === 'putzfassade') {
      // These gebäudehülle types have specific interior logic
      let interiorImageKey = '';

      if (innenverkleidung === 'kiefer' && fussboden === 'parkett') {
        interiorImageKey = 'interior_kiefer_parkett';
      } else if (innenverkleidung === 'kiefer' && fussboden === 'vinyl') {
        interiorImageKey = 'interior_kiefer_vinyl';
      } else if (innenverkleidung === 'pappel' && fussboden === 'parkett') {
        interiorImageKey = 'interior_pappel_parkett';
      } else if (innenverkleidung === 'pappel' && fussboden === 'vinyl') {
        interiorImageKey = 'interior_pappel_vinyl';
      } else {
        // Fallback for holzfassade/putzfassade
        interiorImageKey = 'interior_kiefer_parkett';
      }

      const imagePath = IMAGES.configurations[interiorImageKey as keyof typeof IMAGES.configurations];
      if (imagePath) {
        return imagePath;
      }
    }

    // Final fallback
    return IMAGES.configurations.interior_kiefer_parkett || IMAGE_FALLBACKS.interior;
  }

  /**
   * Get PV image path with enhanced security and fallback logic
   * Uses PV type mapping for appropriate visualization
   * CLIENT-SIDE calculation for efficiency and security
   */
  static getPVImage(configuration: Configuration): string {
    if (!configuration?.pvanlage?.value) {
      return IMAGE_FALLBACKS.exterior;
    }

    const pvType = configuration.pvanlage.value;

    // Map to PV image keys
    const pvKey = PV_IMAGE_MAPPING[pvType];
    if (!pvKey) {
      return IMAGES.configurations.nest80_trapezblech_pv || IMAGE_FALLBACKS.exterior;
    }

    // Try configurations collection first
    const pvImage = IMAGES.configurations[pvKey as keyof typeof IMAGES.configurations];
    if (pvImage) {
      return pvImage;
    }

    // Fallback to solar collection
    const solarImage = IMAGES.solar?.[pvKey as keyof typeof IMAGES.solar];
    return solarImage || IMAGES.configurations.nest80_trapezblech_pv || IMAGE_FALLBACKS.exterior;
  }

  /**
   * Get fenster image path with enhanced security and fallback logic
   * Uses window type mapping for appropriate visualization
   * CLIENT-SIDE calculation for efficiency and security
   */
  static getFensterImage(configuration: Configuration): string {
    if (!configuration?.fenster?.value) {
      return IMAGE_FALLBACKS.exterior;
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

    // Add stirnseite view last (index 2) when nest or gebäudehülle is configured
    if (configuration.nest || configuration.gebaeudehuelle) {
      views.push('stirnseite');
    }

    return views;
  }

  /**
   * ENHANCED: Clear caches with performance logging
   */
  static clearImageCache(): void {
    const pathCacheSize = imagePathCache.size;
    const preloadCacheSize = preloadProgressCache.size;

    imagePathCache.clear();
    preloadProgressCache.clear();
    adjacentViewsCache.clear();

    if (process.env.NODE_ENV === 'development') {
      console.debug(`🖼️ Cache cleared: ${pathCacheSize} paths, ${preloadCacheSize} preload operations`);
    }
  }

  static getCacheInfo(): { size: number, keys: string[] } {
    return {
      size: imagePathCache.size,
      keys: Array.from(imagePathCache.keys())
    };
  }

  /**
   * Legacy compatibility methods
   */
  static clearPreloadedImages(): void {
    // Method kept for backward compatibility
    return;
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