/**
 * ConfiguratorEngine - Central Business Logic Orchestrator
 * 
 * This engine handles all configurator business logic without UI dependencies.
 * It provides optimized selection processing, price calculation, and image management.
 * 
 * @example
 * const engine = new ConfiguratorEngine();
 * const result = await engine.processSelection(selection);
 */

import { PriceCalculator } from './PriceCalculator';
import { ImageManager } from './ImageManager';
import { InteractionTracker } from './InteractionTracker';
import { PerformanceMonitor } from './PerformanceMonitor';
import type { 
  ConfigurationItem, 
  ProcessedSelection, 
  ValidationResult,
  FullConfiguration,
  SelectionContext
} from '../types/configurator.types';

export class ConfiguratorEngine {
  private priceCalculator: PriceCalculator;
  private imageManager: ImageManager;
  private interactionTracker: InteractionTracker;
  private performanceMonitor: PerformanceMonitor;

  constructor() {
    this.priceCalculator = new PriceCalculator();
    this.imageManager = new ImageManager();
    this.interactionTracker = new InteractionTracker();
    this.performanceMonitor = new PerformanceMonitor();
  }

  /**
   * Process user selection with full optimization
   * This is the main method called when user makes a selection
   */
  async processSelection(
    selection: ConfigurationItem,
    context?: SelectionContext
  ): Promise<ProcessedSelection> {
    const startTime = performance.now();
    
    try {
      // 1. Validate selection
      const validation = this.validateSelection(selection);
      if (!validation.isValid) {
        throw new Error(`Invalid selection: ${validation.errors.join(', ')}`);
      }

      // 2. Calculate price impact
      const priceImpact = await this.priceCalculator.calculatePriceImpact(
        selection, 
        context?.currentConfiguration
      );
      
      // 3. Determine recommended view
      const recommendedView = this.getRecommendedView(selection);
      
      // 4. Preload relevant images (non-blocking)
      const imagePreloadPromise = this.imageManager.preloadForSelection(
        selection
      );
      
      // 5. Track interaction for analytics
      this.interactionTracker.trackSelection(selection, context);
      
      // 6. Get next suggestions
      const nextSuggestions = this.getNextSuggestions(selection, context);

      // 7. Wait for image preloading (with timeout)
      try {
        await Promise.race([
          imagePreloadPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Image preload timeout')), 2000)
          )
        ]);
      } catch (_error) {
        // Silent fail - preloading is optimization only
        console.debug('⚡ Image preloading failed/timeout - continuing normally');
      }

      const processingTime = performance.now() - startTime;
      this.performanceMonitor.recordSelectionTime(processingTime);

      return {
        selection,
        priceImpact,
        recommendedView,
        nextSuggestions,
        performance: { 
          processingTime,
          imagePreloadStatus: 'completed' 
        }
      };

    } catch (error) {
      this.handleProcessingError(error as Error, selection);
      throw error;
    }
  }

  /**
   * Generate complete configuration with all optimizations
   */
  async generateConfiguration(
    selections: ConfigurationItem[],
    userDetails?: Record<string, unknown>
  ): Promise<FullConfiguration> {
    try {
      const config = await this.priceCalculator.generateFullConfiguration(selections);
      
      // Trigger background optimizations
      this.imageManager.preloadConfigurationImages(config as any);
      this.interactionTracker.trackConfigurationComplete(config, userDetails);
      
      return config;
    } catch (error) {
      console.error('❌ Configuration generation failed:', error);
      throw error;
    }
  }

  /**
   * Validate selection according to business rules
   */
  private validateSelection(selection: ConfigurationItem): ValidationResult {
    const errors: string[] = [];

    // Basic validation
    if (!selection.category) {
      errors.push('Category is required');
    }
    if (!selection.value) {
      errors.push('Value is required');
    }
    if (!selection.name) {
      errors.push('Name is required');
    }
    if (typeof selection.price !== 'number' || selection.price < 0) {
      errors.push('Price must be a non-negative number');
    }

    // Category-specific validation
    if (selection.category === 'pvanlage' && selection.quantity && selection.quantity < 1) {
      errors.push('PV quantity must be at least 1');
    }
    if (selection.category === 'fenster' && selection.squareMeters && selection.squareMeters < 0.5) {
      errors.push('Fenster square meters must be at least 0.5');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Determine recommended view based on selection
   */
  private getRecommendedView(selection: ConfigurationItem): string {
    const viewMap: Record<string, string> = {
      'nest': 'exterior',
      'gebaeudehuelle': 'exterior',
      'innenverkleidung': 'interior',
      'fussboden': 'interior',
      'pvanlage': 'pv',
      'fenster': 'fenster',
      'planungspaket': 'exterior',
      'grundstueckscheck': 'exterior'
    };
    
    return viewMap[selection.category] || 'exterior';
  }

  /**
   * Get intelligent next suggestions based on current selection
   */
  private getNextSuggestions(
    selection: ConfigurationItem,
    _context?: SelectionContext
  ): ConfigurationItem[] {
    // This would be enhanced with ML/AI in the future
    // For now, provide basic logical suggestions
    
    const suggestions: Record<string, string[]> = {
      'nest': ['gebaeudehuelle'],
      'gebaeudehuelle': ['innenverkleidung', 'pvanlage'],
      'innenverkleidung': ['fussboden'],
      'fussboden': ['fenster', 'pvanlage'],
      'pvanlage': ['planungspaket'],
      'fenster': ['planungspaket'],
      'planungspaket': ['grundstueckscheck']
    };

    const _nextCategories = suggestions[selection.category] || [];
    
    // Return empty array for now - would be populated with actual suggestions
    // based on the configuratorData and user behavior analytics
    return [];
  }

  /**
   * Handle processing errors with proper logging and recovery
   */
  private handleProcessingError(error: Error, selection: ConfigurationItem): void {
    console.error('❌ ConfiguratorEngine processing error:', {
      error: error.message,
      selection,
      timestamp: new Date().toISOString()
    });

    // Track error for analytics
    this.interactionTracker.trackError(error, selection);
    
    // Performance monitoring
    this.performanceMonitor.recordError(error, selection);
  }

  /**
   * Clean up resources when engine is no longer needed
   */
  destroy(): void {
    this.imageManager.clearCache();
    this.performanceMonitor.flush();
  }
} 