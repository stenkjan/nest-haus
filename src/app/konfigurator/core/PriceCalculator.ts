/**
 * PriceCalculator - EXACT logic from old configurator
 * Uses combination pricing matrices and original constants
 * CLIENT-SIDE ONLY - for efficient state management without API calls
 */

import { calculateCombinationPrice, GRUNDSTUECKSCHECK_PRICE } from '@/constants/configurator'

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
   * Calculate the EXACT combination price using old configurator logic
   * CLIENT-SIDE calculation for efficiency
   */
  static calculateCombinationPrice(
    nestType: string,
    gebaeudehuelle: string,
    innenverkleidung: string,
    fussboden: string
  ): number {
    console.log('🔢 PriceCalculator: calculateCombinationPrice called with:', { nestType, gebaeudehuelle, innenverkleidung, fussboden });
    
    const price = calculateCombinationPrice(nestType, gebaeudehuelle, innenverkleidung, fussboden);
    console.log('🔢 PriceCalculator: Combination price result:', price);
    
    return price;
  }

  /**
   * Calculate total price - EXACT logic from old configurator
   * CLIENT-SIDE calculation to avoid unnecessary API calls
   */
  static calculateTotalPrice(selections: Selections): number {
    console.log('💰 PriceCalculator: calculateTotalPrice called with:', selections);
    
    if (!selections.nest || !selections.gebaeudehuelle || !selections.innenverkleidung || !selections.fussboden) {
      console.log('💰 PriceCalculator: Missing required selections');
      return 0
    }

    try {
      // Calculate the combination-based total price
      const combinationPrice = this.calculateCombinationPrice(
        selections.nest.value,
        selections.gebaeudehuelle.value,
        selections.innenverkleidung.value,
        selections.fussboden.value
      )
      
      console.log('💰 PriceCalculator: Combination price:', combinationPrice);

      // Add other prices
      let additionalPrice = 0

      // Add PV price
      if (selections.pvanlage && selections.pvanlage.quantity) {
        const pvPrice = selections.pvanlage.quantity * (selections.pvanlage.price || 0);
        additionalPrice += pvPrice;
        console.log('💰 PriceCalculator: PV price added:', pvPrice);
      }

      // Add window price
      if (selections.fenster && selections.fenster.squareMeters) {
        const fensterPrice = selections.fenster.squareMeters * (selections.fenster.price || 0);
        additionalPrice += fensterPrice;
        console.log('💰 PriceCalculator: Fenster price added:', fensterPrice);
      }

      // Add planning package price
      if (selections.paket) {
        const paketPrice = selections.paket.price || 0;
        additionalPrice += paketPrice;
        console.log('💰 PriceCalculator: Paket price added:', paketPrice);
      }

      // Add Grundstückscheck price if selected
      if (selections.grundstueckscheck) {
        additionalPrice += GRUNDSTUECKSCHECK_PRICE;
        console.log('💰 PriceCalculator: Grundstückscheck price added:', GRUNDSTUECKSCHECK_PRICE);
      }

      const totalPrice = combinationPrice + additionalPrice;
      console.log('💰 PriceCalculator: Final total price:', totalPrice);
      
      return totalPrice;
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
   */
  static getPriceBreakdown(selections: Selections): { basePrice: number; options: Record<string, { name: string; price: number }>; totalPrice: number } {
    const breakdown = {
      basePrice: 0,
      options: {} as Record<string, { name: string; price: number }>,
      totalPrice: 0
    }

    if (!selections.nest || !selections.gebaeudehuelle || !selections.innenverkleidung || !selections.fussboden) {
      return breakdown
    }

    // Calculate base price from combination matrix
    breakdown.basePrice = this.calculateCombinationPrice(
      selections.nest.value,
      selections.gebaeudehuelle.value,
      selections.innenverkleidung.value,
      selections.fussboden.value
    )

    // Add optional components
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