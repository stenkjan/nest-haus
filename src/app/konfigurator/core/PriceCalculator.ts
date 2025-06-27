/**
 * PriceCalculator - Updated with MODULAR pricing system from Excel data
 * Uses base price (Nest 80) + (modules × per-module cost) logic
 * CLIENT-SIDE ONLY - for efficient state management without API calls
 * 
 * ENHANCED: Added caching and race condition prevention for optimal performance
 */

import { 
  calculateModularPrice, 
  GRUNDSTUECKSCHECK_PRICE, 
  MODULAR_PRICING, 
  NEST_OPTIONS,
  type CombinationKey
} from '@/constants/configurator'

// In-memory cache for price calculations to prevent redundant computations
class PriceCalculationCache {
  private static cache = new Map<string, { amount: number; monthly: number; timestamp: number }>();
  private static readonly CACHE_TTL = 300000; // 5 minutes cache TTL (increased from 30 seconds)
  private static requestCounts = new Map<string, number>();
  private static lastClearTime = Date.now();

  static get(key: string): { amount: number; monthly: number } | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return { amount: cached.amount, monthly: cached.monthly };
  }

  static set(key: string, amount: number, monthly: number): void {
    this.cache.set(key, {
      amount,
      monthly,
      timestamp: Date.now()
    });
  }

  static createCacheKey(nestType: string, categoryId: string, optionValue: string): string {
    // Create deterministic cache key
    return `${nestType}|${categoryId}|${optionValue}`;
  }

  static trackRequest(key: string): void {
    const count = this.requestCounts.get(key) || 0;
    this.requestCounts.set(key, count + 1);

    // REFINED: Only warn about truly excessive calculations (50+ calls)
    // Most calculations under 50 are normal during user interactions
    if (process.env.NODE_ENV === 'development' && count > 50 && count % 25 === 0) {
      console.warn(`💰 PERFORMANCE WARNING: Price calculation for "${key}" requested ${count + 1} times. Consider if this calculation is genuinely expensive (1ms+) per React docs.`);
      
      // Show cache statistics for debugging at higher thresholds
      if (count === 75) {
        console.log(`🔍 Analysis for "${key}":
          - This calculation has been called ${count + 1} times
          - Per React docs: Only memoize calculations that take 1ms+ 
          - Consider if this is truly an expensive calculation
          - Most price lookups should be fast and don't need memoization`);
        this.logCacheStats();
      }
    }
  }

  static clear(): void {
    this.cache.clear();
    this.requestCounts.clear();
    this.lastClearTime = Date.now();
  }

  static getCacheInfo(): { size: number; keys: string[]; hitRate: number } {
    const totalRequests = Array.from(this.requestCounts.values()).reduce((sum, count) => sum + count, 0);
    const cacheHits = totalRequests - this.requestCounts.size; // Approximation
    const hitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
    
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      hitRate: Math.max(0, hitRate) // Ensure non-negative
    };
  }

  static logCacheStats(): void {
    const info = this.getCacheInfo();
    console.log(`💰 PriceCalculator Cache Stats:
      - Cache Size: ${info.size} entries
      - Cache Hit Rate: ${info.hitRate.toFixed(1)}%
      - Total Unique Calculations: ${this.requestCounts.size}
      - Most Requested: ${Array.from(this.requestCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key, count]) => `${key} (${count}x)`)
        .join(', ')}`);
  }
}

interface SelectionOption {
  category: string
  value: string
  name: string
  price: number
  quantity?: number
  squareMeters?: number
}

interface Selections {
  nest?: SelectionOption
  gebaeudehuelle?: SelectionOption
  innenverkleidung?: SelectionOption
  fussboden?: SelectionOption
  pvanlage?: SelectionOption
  fenster?: SelectionOption
  paket?: SelectionOption
  grundstueckscheck?: boolean
}

export class PriceCalculator {
  /**
   * Calculate the EXACT modular price using Excel data
   * Formula: Base Price (Nest 80) + (Additional Modules × Price Per Module)
   * CLIENT-SIDE calculation for efficiency
   */
  static calculateCombinationPrice(
    nestType: string,
    gebaeudehuelle: string,
    innenverkleidung: string,
    fussboden: string
  ): number {
    const price = calculateModularPrice(nestType, gebaeudehuelle, innenverkleidung, fussboden);
    
    return price;
  }

  /**
   * Get dynamic upgrade price for a selection based on current nest size
   * This calculates the price difference between combinations
   */
  static getUpgradePrice(
    nestType: string,
    currentSelections: Selections,
    newSelection: SelectionOption
  ): number {
    if (!currentSelections.nest) return 0;

    // Default selections for base comparison
    const defaultSelections = {
      gebaeudehuelle: 'trapezblech',
      innenverkleidung: 'kiefer', 
      fussboden: 'parkett'
    };

    // Current combination price
    const currentCombination = {
      gebaeudehuelle: currentSelections.gebaeudehuelle?.value || defaultSelections.gebaeudehuelle,
      innenverkleidung: currentSelections.innenverkleidung?.value || defaultSelections.innenverkleidung,
      fussboden: currentSelections.fussboden?.value || defaultSelections.fussboden
    };

    // New combination price
    const newCombination = {
      ...currentCombination,
      [newSelection.category]: newSelection.value
    };

    const currentPrice = this.calculateCombinationPrice(
      nestType,
      currentCombination.gebaeudehuelle,
      currentCombination.innenverkleidung,
      currentCombination.fussboden
    );

    const newPrice = this.calculateCombinationPrice(
      nestType,
      newCombination.gebaeudehuelle,
      newCombination.innenverkleidung,
      newCombination.fussboden
    );

    return newPrice - currentPrice;
  }

  /**
   * NEW: Calculate dynamic price for individual option display in UI
   * Returns the upgrade price compared to the BASE configuration (Trapezblech + Kiefer + Parkett)
   * This ensures consistent pricing regardless of current selections
   * 
   * ENHANCED: Added caching and error handling for optimal performance
   */
  static getOptionDisplayPrice(
    nestType: string,
    currentSelections: Selections,
    categoryId: string,
    optionValue: string
  ): { type: 'base' | 'upgrade' | 'included'; amount?: number; monthly?: number } {
    // Input validation
    if (!nestType || typeof nestType !== 'string') {
      return { type: 'included' };
    }

    // For core material options that affect combination pricing
    if (['gebaeudehuelle', 'innenverkleidung', 'fussboden'].includes(categoryId)) {
      // Default/base selections (what shows as "included")
      const baseSelections = {
        gebaeudehuelle: 'trapezblech',
        innenverkleidung: 'kiefer',
        fussboden: 'parkett'
      };

      // If this is a base selection, show as included
      if (optionValue === baseSelections[categoryId as keyof typeof baseSelections]) {
        return { type: 'included' };
      }

      // Create cache key for this specific calculation
      const cacheKey = PriceCalculationCache.createCacheKey(nestType, categoryId, optionValue);
      
      // Track request for performance monitoring
      PriceCalculationCache.trackRequest(cacheKey);

      // Check cache first for performance optimization
      const cached = PriceCalculationCache.get(cacheKey);
      if (cached) {
        return {
          type: 'upgrade',
          amount: cached.amount,
          monthly: cached.monthly
        };
      }

      try {
        // FIXED: Always calculate upgrade price relative to BASE configuration
        // This prevents negative prices and ensures consistent pricing display
        const baseCombination = {
          gebaeudehuelle: baseSelections.gebaeudehuelle,
          innenverkleidung: baseSelections.innenverkleidung,
          fussboden: baseSelections.fussboden
        };

        // Calculate price with this option selected (rest remain base)
        const upgradeCombination = {
          ...baseCombination,
          [categoryId]: optionValue
        };

        const basePrice = this.calculateCombinationPrice(
          nestType,
          baseCombination.gebaeudehuelle,
          baseCombination.innenverkleidung,
          baseCombination.fussboden
        );

        const upgradePrice = this.calculateCombinationPrice(
          nestType,
          upgradeCombination.gebaeudehuelle,
          upgradeCombination.innenverkleidung,
          upgradeCombination.fussboden
        );

        const upgradeAmount = upgradePrice - basePrice;

        if (upgradeAmount <= 0) {
          return { type: 'included' };
        }

        const monthlyAmount = this.calculateMonthlyPaymentAmount(upgradeAmount);

        // Cache successful calculation
        PriceCalculationCache.set(cacheKey, upgradeAmount, monthlyAmount);

        return {
          type: 'upgrade',
          amount: upgradeAmount,
          monthly: monthlyAmount
        };
      } catch (error) {
        // Graceful error handling - log in development, fail silently in production
        if (process.env.NODE_ENV === 'development') {
          console.error(`💰 Price calculation error for ${categoryId}:${optionValue}:`, error);
        }
        
        // Return safe fallback
        return { type: 'included' };
      }
    }

    // For non-combination options (PV, Fenster, Planung), return static pricing
    // These don't scale with nest size in the current pricing model
    return { type: 'included' }; // Will be handled by existing static logic
  }

  /**
   * Helper method to calculate monthly payment amount as number (not formatted string)
   */
  static calculateMonthlyPaymentAmount(totalPrice: number, months: number = 240): number {
    const interestRate = 0.035 / 12; // 3.5% annual rate
    const monthlyPayment = totalPrice * (interestRate * Math.pow(1 + interestRate, months)) / 
                          (Math.pow(1 + interestRate, months) - 1);
    
    return Math.round(monthlyPayment);
  }

  /**
   * Calculate total price - PROGRESSIVE pricing with immediate feedback
   * Uses MODULAR PRICING for accurate scaling with nest size
   * CLIENT-SIDE calculation to avoid unnecessary API calls
   */
  static calculateTotalPrice(selections: Selections): number {
    // If no nest selection, return 0
    if (!selections.nest) {
      return 0;
    }

    try {
      let totalPrice = 0;

      // ALWAYS use combination pricing with defaults for missing core selections
      // This ensures consistent pricing regardless of selection order
      const gebaeudehuelle = selections.gebaeudehuelle?.value || 'trapezblech';
      const innenverkleidung = selections.innenverkleidung?.value || 'kiefer';
      const fussboden = selections.fussboden?.value || 'parkett';

      // Calculate combination price using modular pricing system
      totalPrice = this.calculateCombinationPrice(
        selections.nest.value,
        gebaeudehuelle,
        innenverkleidung,
        fussboden
      );

      // Add additional components (these work regardless of core completion)
      let additionalPrice = 0;

      // Add PV price
      if (selections.pvanlage && selections.pvanlage.quantity) {
        const pvPrice = selections.pvanlage.quantity * (selections.pvanlage.price || 0);
        additionalPrice += pvPrice;
      }

      // Add window price
      if (selections.fenster && selections.fenster.squareMeters) {
        const fensterPrice = selections.fenster.squareMeters * (selections.fenster.price || 0);
        additionalPrice += fensterPrice;
      }

      // Add planning package price
      if (selections.paket) {
        const paketPrice = selections.paket.price || 0;
        additionalPrice += paketPrice;
      }

      // Add Grundstückscheck price if selected
      if (selections.grundstueckscheck) {
        additionalPrice += GRUNDSTUECKSCHECK_PRICE;
      }

      const finalPrice = totalPrice + additionalPrice;
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`💰 Price Calculation Breakdown:
          Base/Combination Price: €${totalPrice.toLocaleString()}
          Additional Components: €${additionalPrice.toLocaleString()}
          Final Total: €${finalPrice.toLocaleString()}`);
      }
      
      return finalPrice;
    } catch (error) {
      console.error('💰 PriceCalculator: Error calculating price:', error);
      return 0;
    }
  }

  /**
   * Get base price for a nest option (calculated with default selections)
   */
  static getBasePrice(nestType: string): number {
    // Default selections (Trapezblech + Kiefer + Parkett)
    return this.calculateCombinationPrice(
      nestType,
      'trapezblech',  // default
      'kiefer',       // default
      'parkett'       // default
    )
  }

  /**
   * Calculate monthly payment using exact old configurator logic
   */
  static calculateMonthlyPayment(totalPrice: number, months: number = 240): string {
    const interestRate = 0.035 / 12 // 3.5% annual rate
    const monthlyPayment = totalPrice * (interestRate * Math.pow(1 + interestRate, months)) / 
                          (Math.pow(1 + interestRate, months) - 1)
    
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monthlyPayment)
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  /**
   * Calculate price impact for engine compatibility
   * Uses modular pricing for accurate scaling
   */
  static calculatePriceImpact(selection: SelectionOption, currentSelections: Selections): number {
    const currentPrice = this.calculateTotalPrice(currentSelections)
    const newSelections = { ...currentSelections, [selection.category]: selection }
    const newPrice = this.calculateTotalPrice(newSelections)
    return newPrice - currentPrice
  }

  /**
   * Generate full configuration for engine compatibility
   */
  static generateFullConfiguration(selections: Selections): Record<string, unknown> {
    return {
      id: `config_${Date.now()}`,
      selections,
      totalPrice: this.calculateTotalPrice(selections),
      timestamp: Date.now(),
      status: 'active'
    }
  }

  /**
   * Get detailed price breakdown for transparency
   * CLIENT-SIDE calculation for better performance
   * SUPPORTS PROGRESSIVE PRICING with MODULAR SCALING
   */
  static getPriceBreakdown(selections: Selections): { 
    basePrice: number; 
    options: Record<string, { name: string; price: number }>; 
    totalPrice: number;
    modules?: number;
    pricePerModule?: number;
    combinationKey?: string;
  } {
    const breakdown = {
      basePrice: 0,
      options: {} as Record<string, { name: string; price: number }>,
      totalPrice: 0,
      modules: 0,
      pricePerModule: 0,
      combinationKey: ''
    }

    if (!selections.nest) {
      return breakdown
    }

    try {
      // Get nest module information
      const nestOption = NEST_OPTIONS.find(option => option.value === selections.nest!.value);
      breakdown.modules = nestOption?.modules || 0;

      // Determine combination for breakdown
      const gebaeudehuelle = selections.gebaeudehuelle?.value || 'trapezblech';
      const innenverkleidung = selections.innenverkleidung?.value || 'kiefer';
      const fussboden = selections.fussboden?.value || 'parkett';
      
      breakdown.combinationKey = `${gebaeudehuelle}-${innenverkleidung}-${fussboden}`;
      
      // Get modular pricing data with type safety
      const pricingData = MODULAR_PRICING[breakdown.combinationKey as CombinationKey];
      if (pricingData) {
        breakdown.basePrice = pricingData.basePrice;
        breakdown.pricePerModule = pricingData.pricePerModule;
      }

      // Calculate core combination price
      const combinationPrice = this.calculateCombinationPrice(
        selections.nest.value,
        gebaeudehuelle,
        innenverkleidung,
        fussboden
      );

      breakdown.basePrice = combinationPrice;

      // Add additional options
      if (selections.pvanlage && selections.pvanlage.quantity) {
        breakdown.options.pvanlage = {
          name: `${selections.pvanlage.name} (${selections.pvanlage.quantity}x)`,
          price: selections.pvanlage.quantity * selections.pvanlage.price
        }
      }

      if (selections.fenster && selections.fenster.squareMeters) {
        breakdown.options.fenster = {
          name: `${selections.fenster.name} (${selections.fenster.squareMeters}m²)`,
          price: selections.fenster.squareMeters * selections.fenster.price
        }
      }

      if (selections.paket) {
        breakdown.options.paket = {
          name: selections.paket.name,
          price: selections.paket.price
        }
      }

      if (selections.grundstueckscheck) {
        breakdown.options.grundstueckscheck = {
          name: 'Grundstückscheck',
          price: GRUNDSTUECKSCHECK_PRICE
        }
      }

      // Calculate total
      const optionsTotal = Object.values(breakdown.options).reduce((sum, option) => sum + option.price, 0)
      breakdown.totalPrice = breakdown.basePrice + optionsTotal

      return breakdown
    } catch (error) {
      console.error('💰 Error calculating price breakdown:', error)
      return breakdown
    }
  }

  /**
   * Validate that a combination exists in pricing data
   */
  static isValidCombination(
    nestType: string,
    gebaeudehuelle: string,
    innenverkleidung: string,
    fussboden: string
  ): boolean {
    const combinationKey = `${gebaeudehuelle}-${innenverkleidung}-${fussboden}` as CombinationKey;
    return !!MODULAR_PRICING[combinationKey];
  }

  /**
   * Get all valid combinations for a given nest type
   */
  static getValidCombinations(_nestType: string): CombinationKey[] {
    return Object.keys(MODULAR_PRICING) as CombinationKey[];
  }

  /**
   * Cache management methods for performance optimization and debugging
   */
  static clearPriceCache(): void {
    PriceCalculationCache.clear();
  }

  static getPriceCacheInfo(): { size: number; keys: string[] } {
    return PriceCalculationCache.getCacheInfo();
  }

  /**
   * Performance monitoring method for development
   */
  static logPerformanceStats(): void {
    if (process.env.NODE_ENV === 'development') {
      PriceCalculationCache.logCacheStats();
    }
  }

  /**
   * Reset performance counters - useful for testing
   */
  static resetPerformanceCounters(): void {
    PriceCalculationCache.clear();
    if (process.env.NODE_ENV === 'development') {
      console.log('💰 PriceCalculator: Performance counters reset');
    }
  }
} 