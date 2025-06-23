/**
 * PriceCalculator - EXACT logic from old configurator
 * Uses combination pricing matrices and original constants
 * CLIENT-SIDE ONLY - for efficient state management without API calls
 */

import { calculateCombinationPrice, GRUNDSTUECKSCHECK_PRICE } from '@/constants/configurator'
import type { ConfigurationItem, PriceImpactResult, FullConfiguration } from '../types/configurator.types';

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
   * NEW: Calculate price impact for a selection (for modular architecture)
   */
  async calculatePriceImpact(selection: ConfigurationItem, _currentConfiguration?: Record<string, unknown>): Promise<PriceImpactResult> {
    // Simple implementation for now
    return {
      totalChange: selection.price || 0,
      breakdown: {
        baseChange: selection.price || 0,
        optionChanges: {}
      }
    };
  }

  /**
   * NEW: Generate full configuration (for modular architecture)
   */
  async generateFullConfiguration(selections: ConfigurationItem[]): Promise<FullConfiguration> {
    return {
      sessionId: `config_${Date.now()}`,
      selections,
      totalPrice: selections.reduce((sum, sel) => sum + (sel.price || 0), 0),
      timestamp: Date.now()
    };
  }

  /**
   * Calculate the EXACT combination price using old configurator logic
   * CLIENT-SIDE calculation for efficiency
   */
  static calculateCombinationPrice(
    nestType: string,
    gebaeudehuelle: string,
    innenverkleidung: string,
    fussboden: string
  ): number {
    const price = calculateCombinationPrice(nestType, gebaeudehuelle, innenverkleidung, fussboden);
    
    return price;
  }

  /**
   * Calculate total price - PROGRESSIVE pricing with immediate feedback
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
        // Only nest selected - show base price from nest
        totalPrice = selections.nest.price;
      } 
      else if (selections.nest && selections.gebaeudehuelle && selections.innenverkleidung && selections.fussboden) {
        // All core selections made - use combination pricing
        const combinationPrice = this.calculateCombinationPrice(
          selections.nest.value,
          selections.gebaeudehuelle.value,
          selections.innenverkleidung.value,
          selections.fussboden.value
        );
        
        totalPrice = combinationPrice;
      }
      else {
        // Partial selections - use nest base price + any completed selections
        totalPrice = selections.nest.price;
        
        // Add upgrade costs for individual selections
        if (selections.gebaeudehuelle && selections.gebaeudehuelle.value !== 'trapezblech') {
          totalPrice += selections.gebaeudehuelle.price;
        }
        
        if (selections.innenverkleidung && selections.innenverkleidung.value !== 'kiefer') {
          totalPrice += selections.innenverkleidung.price;
        }
        
        if (selections.fussboden && selections.fussboden.value !== 'parkett') {
          totalPrice += selections.fussboden.price;
        }
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
    // Default selections from old configurator
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
   * Get detailed price breakdown for transparency
   * CLIENT-SIDE calculation for better performance
   * SUPPORTS PROGRESSIVE PRICING
   */
  static getPriceBreakdown(selections: Selections): { basePrice: number; options: Record<string, { name: string; price: number }>; totalPrice: number } {
    const breakdown = {
      basePrice: 0,
      options: {} as Record<string, { name: string; price: number }>,
      totalPrice: 0
    }

    if (!selections.nest) {
      return breakdown
    }

    // PROGRESSIVE BREAKDOWN: Handle partial selections
    if (selections.nest && selections.gebaeudehuelle && selections.innenverkleidung && selections.fussboden) {
      // All core selections - use combination matrix
      breakdown.basePrice = this.calculateCombinationPrice(
        selections.nest.value,
        selections.gebaeudehuelle.value,
        selections.innenverkleidung.value,
        selections.fussboden.value
      )
    } else {
      // Partial selections - use nest base price
      breakdown.basePrice = selections.nest.price;
      
      // Add individual upgrades as options
      if (selections.gebaeudehuelle && selections.gebaeudehuelle.value !== 'trapezblech') {
        breakdown.options.gebaeudehuelle = {
          name: selections.gebaeudehuelle.name,
          price: selections.gebaeudehuelle.price
        };
      }
      
      if (selections.innenverkleidung && selections.innenverkleidung.value !== 'kiefer') {
        breakdown.options.innenverkleidung = {
          name: selections.innenverkleidung.name,
          price: selections.innenverkleidung.price
        };
      }
      
      if (selections.fussboden && selections.fussboden.value !== 'parkett') {
        breakdown.options.fussboden = {
          name: selections.fussboden.name,
          price: selections.fussboden.price
        };
      }
    }

    // Add optional components (same as before)
    if (selections.pvanlage && selections.pvanlage.quantity) {
      breakdown.options.pvanlage = {
        name: selections.pvanlage.name,
        price: selections.pvanlage.price * selections.pvanlage.quantity
      }
    }

    if (selections.fenster && selections.fenster.squareMeters) {
      breakdown.options.fenster = {
        name: selections.fenster.name,
        price: selections.fenster.price * selections.fenster.squareMeters
      }
    }

    if (selections.paket) {
      breakdown.options.planungspaket = {
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
    breakdown.totalPrice = breakdown.basePrice + 
      Object.values(breakdown.options).reduce((sum, opt) => sum + opt.price, 0)

    return breakdown
  }
} 