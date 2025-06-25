/**
 * PriceCalculator - Updated with MODULAR pricing system from Excel data
 * Uses base price (Nest 80) + (modules × per-module cost) logic
 * CLIENT-SIDE ONLY - for efficient state management without API calls
 */

import { 
  calculateModularPrice, 
  GRUNDSTUECKSCHECK_PRICE, 
  MODULAR_PRICING, 
  NEST_OPTIONS,
  type CombinationKey,
  type ModularPricingData
} from '@/constants/configurator'

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

      // PROGRESSIVE PRICING: Show price as soon as nest is selected
      if (selections.nest && !selections.gebaeudehuelle && !selections.innenverkleidung && !selections.fussboden) {
        // Only nest selected - show base price (Trapezblech + Kiefer + Parkett combination)
        totalPrice = this.calculateCombinationPrice(
          selections.nest.value,
          'trapezblech',
          'kiefer',
          'parkett'
        );
      } 
      else if (selections.nest && selections.gebaeudehuelle && selections.innenverkleidung && selections.fussboden) {
        // All core selections made - use modular combination pricing
        const combinationPrice = this.calculateCombinationPrice(
          selections.nest.value,
          selections.gebaeudehuelle.value,
          selections.innenverkleidung.value,
          selections.fussboden.value
        );
        
        totalPrice = combinationPrice;
      }
      else {
        // Partial selections - calculate progressive pricing
        // Start with base combination
        const basePrice = this.calculateCombinationPrice(
          selections.nest.value,
          'trapezblech',
          'kiefer',
          'parkett'
        );
        
        // Calculate upgrade costs for each selection
        let upgradePrice = 0;
        
        if (selections.gebaeudehuelle && selections.gebaeudehuelle.value !== 'trapezblech') {
          upgradePrice += this.getUpgradePrice(selections.nest.value, selections, {
            category: 'gebaeudehuelle',
            value: selections.gebaeudehuelle.value,
            name: selections.gebaeudehuelle.name,
            price: 0
          });
        }
        
        if (selections.innenverkleidung && selections.innenverkleidung.value !== 'kiefer') {
          upgradePrice += this.getUpgradePrice(selections.nest.value, selections, {
            category: 'innenverkleidung', 
            value: selections.innenverkleidung.value,
            name: selections.innenverkleidung.name,
            price: 0
          });
        }
        
        if (selections.fussboden && selections.fussboden.value !== 'parkett') {
          upgradePrice += this.getUpgradePrice(selections.nest.value, selections, {
            category: 'fussboden',
            value: selections.fussboden.value, 
            name: selections.fussboden.name,
            price: 0
          });
        }
        
        totalPrice = basePrice + upgradePrice;
      }

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
  static getValidCombinations(nestType: string): CombinationKey[] {
    return Object.keys(MODULAR_PRICING) as CombinationKey[];
  }
} 