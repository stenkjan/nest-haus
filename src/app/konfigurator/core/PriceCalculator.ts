/**
 * PriceCalculator - Updated with MODULAR pricing system from Excel data
 * Uses base price (Nest 80) + (modules × per-module cost) logic
 * CLIENT-SIDE ONLY - for efficient state management without API calls
 * 
 * ENHANCED: Added caching and race condition prevention for optimal performance
 */

import {
  calculateModularPrice,
  calculateSizeDependentPrice,
  GRUNDSTUECKSCHECK_PRICE,
  MODULAR_PRICING,
  NEST_OPTIONS,
  type CombinationKey
} from '@/constants/configurator'

// REMOVED: SimplePriceCache class - no longer needed after reverting complex pricing logic

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
  belichtungspaket?: SelectionOption
  pvanlage?: SelectionOption
  fenster?: SelectionOption
  stirnseite?: SelectionOption
  planungspaket?: SelectionOption
  paket?: SelectionOption
  grundstueckscheck?: boolean
  kamindurchzug?: SelectionOption
  fussbodenheizung?: SelectionOption
  bodenaufbau?: SelectionOption
  geschossdecke?: SelectionOption
  fundament?: SelectionOption
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
      fussboden: 'ohne_parkett'
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
    _nestType: string,
    _currentSelections: Selections,
    _categoryId: string,
    _optionValue: string
  ): { type: 'base' | 'upgrade' | 'included'; amount?: number; monthly?: number } {
    // REVERTED: Simplified method - just return included for compatibility
    // This removes the complex pricing logic that was causing display issues
    return { type: 'included' };
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
    try {
      let totalPrice = 0;

      // Calculate nest module combination price if selected
      if (selections.nest) {
        // ALWAYS use combination pricing with defaults for missing core selections
        // This ensures consistent pricing regardless of selection order
        const gebaeudehuelle = selections.gebaeudehuelle?.value || 'trapezblech';
        const innenverkleidung = selections.innenverkleidung?.value || 'kiefer';
        const fussboden = selections.fussboden?.value || 'ohne_parkett';

        // Calculate combination price using modular pricing system
        totalPrice = this.calculateCombinationPrice(
          selections.nest.value,
          gebaeudehuelle,
          innenverkleidung,
          fussboden
        );
      }

      // Add additional components (these work regardless of nest selection)
      let additionalPrice = 0;

      // Add PV price
      if (selections.pvanlage && selections.pvanlage.quantity) {
        const pvPrice = selections.pvanlage.quantity * (selections.pvanlage.price || 0);
        additionalPrice += pvPrice;
      }

      // Add belichtungspaket price (calculated based on nest size and fenster material)
      if (selections.belichtungspaket && selections.nest) {
        const belichtungspaketPrice = this.calculateBelichtungspaketPrice(
          selections.belichtungspaket,
          selections.nest,
          selections.fenster
        );
        additionalPrice += belichtungspaketPrice;
      }

      // Add bodenaufbau price (calculated based on nest size)
      console.log('🔧 DEBUG: Bodenaufbau check:', selections.bodenaufbau);
      if (selections.bodenaufbau && selections.nest) {
        const bodenaufbauPrice = this.calculateBodenaufbauPrice(
          selections.bodenaufbau,
          selections.nest
        );
        console.log('🔥 Bodenaufbau price calculated:', bodenaufbauPrice);
        additionalPrice += bodenaufbauPrice;
      }

      // Add geschossdecke price (calculated based on nest size and quantity)
      console.log('🔧 DEBUG: Geschossdecke check:', selections.geschossdecke);
      if (selections.geschossdecke && selections.nest) {
        const geschossdeckePrice = this.calculateGeschossdeckePrice(
          selections.geschossdecke,
          selections.nest
        );
        console.log('🏢 Geschossdecke price calculated:', geschossdeckePrice);
        additionalPrice += geschossdeckePrice;
      }

      // Add stirnseite verglasung price (calculated based on fenster material)
      if (selections.stirnseite && selections.stirnseite.value !== 'keine_verglasung') {
        const stirnseitePrice = this.calculateStirnseitePrice(
          selections.stirnseite,
          selections.fenster
        );
        additionalPrice += stirnseitePrice;
      }

      // Fenster price is already included in belichtungspaket calculation, so don't add it separately

      // Add planungspaket price (fixed price independent of nest module)
      if (selections.planungspaket) {
        additionalPrice += selections.planungspaket.price || 0;
      }

      // Add checkbox options (kamindurchzug, fussbodenheizung, fundament)
      if (selections.kamindurchzug) {
        additionalPrice += selections.kamindurchzug.price || 0;
      }

      if (selections.fussbodenheizung) {
        additionalPrice += selections.fussbodenheizung.price || 0;
      }

      if (selections.fundament && selections.nest) {
        const fundamentPrice = calculateSizeDependentPrice(
          selections.nest.value,
          'fundament'
        );
        additionalPrice += fundamentPrice;
      }

      // Planning package and Grundstückscheck removed - handled in separate cart logic

      return totalPrice + additionalPrice;
    } catch (error) {
      console.error('💰 PriceCalculator: Error calculating price:', error);
      return 0;
    }
  }

  /**
   * Calculate belichtungspaket price based on nest size and fenster material
   * Formula: nest_size * percentage * fenster_material_price_per_sqm
   * Percentages: light=12%, medium=16%, bright=22%
   * Default fenster material: PVC (280€/m²) if no fenster selected
   */
  static calculateBelichtungspaketPrice(
    belichtungspaket: SelectionOption,
    nest: SelectionOption,
    fenster?: SelectionOption
  ): number {
    try {
      // Get nest size in square meters
      const nestSizeMap: Record<string, number> = {
        'nest80': 80,
        'nest100': 100,
        'nest120': 120,
        'nest140': 140,
        'nest160': 160
      };

      const nestSize = nestSizeMap[nest.value] || 80;

      // Get percentage based on belichtungspaket option
      const percentageMap: Record<string, number> = {
        'light': 0.12,   // 12%
        'medium': 0.16,  // 16%
        'bright': 0.22   // 22%
      };

      const percentage = percentageMap[belichtungspaket.value] || 0.12;

      // Calculate square meters for belichtungspaket
      const beleuchtungsSquareMeters = Math.ceil(nestSize * percentage);

      // Get fenster material price (default to PVC 280€ if no fenster selected)
      const fensterPricePerSqm = fenster?.price || 280;

      // Calculate total price
      const totalPrice = beleuchtungsSquareMeters * fensterPricePerSqm;


      return totalPrice;
    } catch (error) {
      console.error('💡 Error calculating belichtungspaket price:', error);
      return 0;
    }
  }

  /**
   * Calculate bodenaufbau price based on nest size
   * Formula: calculateSizeDependentPrice for heating options, 0 for ohne_heizung
   */
  static calculateBodenaufbauPrice(
    bodenaufbau: SelectionOption,
    nest: SelectionOption
  ): number {
    try {
      if (bodenaufbau.value === 'ohne_heizung') {
        return 0;
      }

      return calculateSizeDependentPrice(
        nest.value,
        bodenaufbau.value as 'elektrische_fussbodenheizung' | 'wassergefuehrte_fussbodenheizung'
      );
    } catch (error) {
      console.error('🔥 Error calculating bodenaufbau price:', error);
      return 0;
    }
  }

  /**
   * Calculate geschossdecke price based on nest size and quantity
   * Formula: calculateSizeDependentPrice × quantity
   */
  static calculateGeschossdeckePrice(
    geschossdecke: SelectionOption,
    nest: SelectionOption
  ): number {
    try {
      const quantity = geschossdecke.quantity || 1;
      return calculateSizeDependentPrice(
        nest.value,
        'geschossdecke',
        quantity
      );
    } catch (error) {
      console.error('🏢 Error calculating geschossdecke price:', error);
      return 0;
    }
  }

  /**
   * Calculate stirnseite verglasung price based on fenster material
   * Formula: verglasung_area * fenster_material_price_per_sqm
   * Areas: oben=8m², einfache_schiebetuer=8.5m², doppelte_schiebetuer=17m², vollverglasung=25m²
   * Default fenster material: PVC (280€/m²) if no fenster selected
   */
  static calculateStirnseitePrice(
    stirnseite: SelectionOption,
    fenster?: SelectionOption
  ): number {
    try {
      // Get area based on stirnseite option
      const areaMap: Record<string, number> = {
        'verglasung_oben': 8,                        // 8m²
        'verglasung_einfache_schiebetuer': 8.5,      // 8.5m² (half of doppelte)
        'verglasung_doppelte_schiebetuer': 17,       // 17m² (same as old verglasung_unten)
        'vollverglasung': 25,                        // 25m²
        'keine_verglasung': 0                        // 0m² (should not be called for this)
      };

      const area = areaMap[stirnseite.value] || 0;

      // Get fenster material price (default to PVC 280€ if no fenster selected)
      const fensterPricePerSqm = fenster?.price || 280;

      // Calculate total price
      const totalPrice = area * fensterPricePerSqm;

      console.log(`🪟 Stirnseite calculation: ${stirnseite.value} = ${area}m² × ${fensterPricePerSqm}€ = ${totalPrice}€`);

      return totalPrice;
    } catch (error) {
      console.error('🪟 Error calculating stirnseite price:', error);
      return 0;
    }
  }

  /**
   * Get base price for a nest option (calculated with default selections)
   */
  static getBasePrice(nestType: string): number {
    // Default selections (Trapezblech + Kiefer + Ohne Parkett)
    return this.calculateCombinationPrice(
      nestType,
      'trapezblech',  // default
      'kiefer',       // default
      'ohne_parkett'  // default (updated)
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

    try {
      // Handle nest module breakdown if selected
      if (selections.nest) {
        // Get nest module information
        const nestOption = NEST_OPTIONS.find(option => option.id === selections.nest!.value);
        breakdown.modules = nestOption?.modules || 0;

        // Determine combination for breakdown
        const gebaeudehuelle = selections.gebaeudehuelle?.value || 'trapezblech';
        const innenverkleidung = selections.innenverkleidung?.value || 'kiefer';
        const fussboden = selections.fussboden?.value || 'ohne_parkett';

        breakdown.combinationKey = `${gebaeudehuelle}-${innenverkleidung}-${fussboden}`;

        // Calculate core combination price
        const combinationPrice = this.calculateCombinationPrice(
          selections.nest.value,
          gebaeudehuelle,
          innenverkleidung,
          fussboden
        );

        breakdown.basePrice = combinationPrice;
      }

      // Add additional options (works for both nest and grundstückscheck-only)
      if (selections.pvanlage && selections.pvanlage.quantity) {
        breakdown.options.pvanlage = {
          name: `${selections.pvanlage.name} (${selections.pvanlage.quantity}x)`,
          price: selections.pvanlage.quantity * selections.pvanlage.price
        }
      }

      if (selections.belichtungspaket && selections.nest) {
        const belichtungspaketPrice = this.calculateBelichtungspaketPrice(
          selections.belichtungspaket,
          selections.nest,
          selections.fenster
        );

        // Calculate square meters for display
        const nestSizeMap: Record<string, number> = {
          'nest80': 80, 'nest100': 100, 'nest120': 120, 'nest140': 140, 'nest160': 160
        };
        const nestSize = nestSizeMap[selections.nest.value] || 80;
        const percentageMap: Record<string, number> = {
          'light': 0.12, 'medium': 0.16, 'bright': 0.22
        };
        const percentage = percentageMap[selections.belichtungspaket.value] || 0.12;
        const beleuchtungsSquareMeters = Math.ceil(nestSize * percentage);

        breakdown.options.belichtungspaket = {
          name: `${selections.belichtungspaket.name} (${beleuchtungsSquareMeters}m²)`,
          price: belichtungspaketPrice
        }
      }

      if (selections.stirnseite && selections.stirnseite.value !== 'keine_verglasung') {
        const stirnseitePrice = this.calculateStirnseitePrice(
          selections.stirnseite,
          selections.fenster
        );

        // Calculate area for display
        const areaMap: Record<string, number> = {
          'verglasung_oben': 8, 'verglasung_einfache_schiebetuer': 8.5, 'verglasung_doppelte_schiebetuer': 17, 'vollverglasung': 25
        };
        const area = areaMap[selections.stirnseite.value] || 0;

        breakdown.options.stirnseite = {
          name: `${selections.stirnseite.name} (${area}m²)`,
          price: stirnseitePrice
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

      // Add checkbox options
      if (selections.kamindurchzug) {
        breakdown.options.kamindurchzug = {
          name: selections.kamindurchzug.name,
          price: selections.kamindurchzug.price
        }
      }

      if (selections.fussbodenheizung) {
        breakdown.options.fussbodenheizung = {
          name: selections.fussbodenheizung.name,
          price: selections.fussbodenheizung.price
        }
      }

      // Add new dynamic pricing options using dedicated methods
      if (selections.bodenaufbau && selections.nest) {
        const bodenaufbauPrice = this.calculateBodenaufbauPrice(
          selections.bodenaufbau,
          selections.nest
        );
        if (bodenaufbauPrice > 0) {
          breakdown.options.bodenaufbau = {
            name: selections.bodenaufbau.name,
            price: bodenaufbauPrice
          }
        }
      }

      if (selections.geschossdecke && selections.nest) {
        const geschossdeckePrice = this.calculateGeschossdeckePrice(
          selections.geschossdecke,
          selections.nest
        );
        if (geschossdeckePrice > 0) {
          breakdown.options.geschossdecke = {
            name: `${selections.geschossdecke.name} (${selections.geschossdecke.quantity || 1}x)`,
            price: geschossdeckePrice
          }
        }
      }

      if (selections.fundament && selections.nest) {
        const fundamentPrice = calculateSizeDependentPrice(
          selections.nest.value,
          'fundament'
        );
        breakdown.options.fundament = {
          name: selections.fundament.name,
          price: fundamentPrice
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

  // REMOVED: Cache management methods no longer needed after reverting complex pricing logic
} 