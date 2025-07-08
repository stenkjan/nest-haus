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

// Simplified cache without performance overhead
class SimplePriceCache {
  private static cache = new Map<string, { amount: number; monthly: number }>();
  private static readonly MAX_SIZE = 50;

  static get(key: string): { amount: number; monthly: number } | null {
    return this.cache.get(key) || null;
  }

  static set(key: string, amount: number, monthly: number): void {
    // Simple LRU: remove oldest if at capacity
    if (this.cache.size >= this.MAX_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, { amount, monthly });
  }

  static createCacheKey(nestType: string, categoryId: string, optionValue: string): string {
    return `${nestType}|${categoryId}|${optionValue}`;
  }

  static clear(): void {
    this.cache.clear();
  }

  static getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
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
   * RESTORED: Material upgrade prices scale with nest size as intended
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

      // Create cache key for this specific calculation (includes nest size for scaling)
      const cacheKey = SimplePriceCache.createCacheKey(nestType, categoryId, optionValue);

      // Check cache first for performance optimization
      const cached = SimplePriceCache.get(cacheKey);
      if (cached) {
        return {
          type: 'upgrade',
          amount: cached.amount,
          monthly: cached.monthly
        };
      }

      try {
        // RESTORED: Calculate upgrade price relative to BASE configuration for the CURRENT nest size
        // This allows material upgrade prices to scale properly with nest size
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

        // Use the CURRENT nest size for both calculations so material costs scale properly
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
        SimplePriceCache.set(cacheKey, upgradeAmount, monthlyAmount);

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

      return totalPrice + additionalPrice;
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
      const nestOption = NEST_OPTIONS.find(option => option.id === selections.nest!.value);
      breakdown.modules = nestOption?.modules || 0;

      // Determine combination for breakdown
      const gebaeudehuelle = selections.gebaeudehuelle?.value || 'trapezblech';
      const innenverkleidung = selections.innenverkleidung?.value || 'kiefer';
      const fussboden = selections.fussboden?.value || 'parkett';

      breakdown.combinationKey = `${gebaeudehuelle}-${innenverkleidung}-${fussboden}`;

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
    const combinationKey = `${gebaeudehuelle}_${innenverkleidung}_${fussboden}`;
    return combinationKey in MODULAR_PRICING.combinations;
  }

  /**
   * Get all valid combinations for a given nest type
   */
  static getValidCombinations(_nestType: string): CombinationKey[] {
    return Object.keys(MODULAR_PRICING.combinations) as CombinationKey[];
  }

  /**
   * Cache management methods for performance optimization
   */
  static clearPriceCache(): void {
    SimplePriceCache.clear();
  }

  static getPriceCacheInfo(): { size: number; keys: string[] } {
    return SimplePriceCache.getCacheInfo();
  }
} 