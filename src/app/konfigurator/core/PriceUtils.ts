/**
 * PriceUtils - Client-Safe Price Utilities
 * 
 * Contains formatting and calculation utilities that can be used
 * on both client and server side without database dependencies.
 */

export class PriceUtils {
  /**
   * Format price for display
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace(/\s+€/, '€');
  }

  /**
   * Calculate monthly payment for financing
   */
  static calculateMonthlyPayment(totalPrice: number, months: number = 240): string {
    // Simple calculation with 3.5% interest rate
    const interestRate = 0.035 / 12; // Monthly interest rate
    const monthlyPayment = totalPrice * (interestRate * Math.pow(1 + interestRate, months)) /
      (Math.pow(1 + interestRate, months) - 1);

    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monthlyPayment).replace(/\s+€/, '€');
  }

  /**
   * Calculate percentage discount
   */
  static calculateDiscount(originalPrice: number, discountedPrice: number): number {
    if (originalPrice === 0) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }

  /**
   * Calculate price per unit (e.g., per m²)
   */
  static calculatePricePerUnit(totalPrice: number, units: number): number {
    if (units === 0) return 0;
    return totalPrice / units;
  }

  /**
   * Get adjusted nutzfläche for Nest models (matches configuratorData.ts descriptions)
   */
  static getAdjustedNutzflaeche(nestModel: string): number {
    const nutzflaecheMap: Record<string, number> = {
      'nest80': 75,   // 75m² Nutzfläche (adjusted)
      'nest100': 95,  // 95m² Nutzfläche (adjusted)
      'nest120': 115, // 115m² Nutzfläche (adjusted)
      'nest140': 135, // 135m² Nutzfläche (adjusted)
      'nest160': 155  // 155m² Nutzfläche (adjusted)
    };

    return nutzflaecheMap[nestModel] || 0;
  }

  /**
   * Calculate and format price per square meter
   */
  static calculatePricePerSquareMeter(totalPrice: number, nestModel: string): string {
    const adjustedNutzflaeche = this.getAdjustedNutzflaeche(nestModel);
    if (adjustedNutzflaeche === 0) return '€0 /m²';

    const pricePerSqm = Math.round(totalPrice / adjustedNutzflaeche);
    return `${this.formatPrice(pricePerSqm)} /m²`;
  }

  /**
   * Determine if a category should show price per m² based on overhaul requirements
   */
  static shouldShowPricePerSquareMeter(categoryId: string): boolean {
    const eligibleCategories = ['nest', 'gebaeudehuelle', 'innenverkleidung', 'fussboden', 'planungspaket'];
    return eligibleCategories.includes(categoryId);
  }

  /**
* Calculate and format price per m² for individual options
* For NEST modules: uses the option's own FULL price and area (not dynamic price difference)
* For other options: calculates dynamically based on current module size
*/
  static calculateOptionPricePerSquareMeter(price: number, nestModel: string, categoryId?: string, optionId?: string): string {
    // For NEST modules themselves, ALWAYS use the full module price from constants
    if (categoryId === 'nest' && optionId) {
      // Import constants to get the full nest price
      const { NEST_OPTIONS } = require('@/constants/configurator');

      // Find the specific nest option to get its full price
      const nestOption = NEST_OPTIONS.find((option: any) => option.id === optionId);
      if (!nestOption) {
        return ''; // No pricing data available
      }

      // Use the full nest price (not the dynamic price difference)
      const fullNestPrice = nestOption.price;
      const adjustedNutzflaeche = this.getAdjustedNutzflaeche(optionId);
      if (adjustedNutzflaeche === 0 || fullNestPrice === 0) return '';

      const pricePerSqm = Math.round(fullNestPrice / adjustedNutzflaeche);
      return `${this.formatPrice(pricePerSqm)} /m²`;
    }

    // For all other options, calculate based on current module size (unchanged)
    const adjustedNutzflaeche = this.getAdjustedNutzflaeche(nestModel);
    if (adjustedNutzflaeche === 0 || price === 0) return '';

    const pricePerSqm = Math.round(price / adjustedNutzflaeche);
    return `${this.formatPrice(pricePerSqm)} /m²`;
  }

  /**
   * Get price display info for an option based on category and current configuration
   */
  static getOptionPriceDisplay(
    categoryId: string,
    optionPrice: number,
    priceType: 'base' | 'upgrade' | 'included',
    nestModel?: string
  ): {
    showPricePerSqm: boolean;
    pricePerSqm?: string;
    formattedPrice: string;
  } {
    const showPricePerSqm = this.shouldShowPricePerSquareMeter(categoryId);

    let pricePerSqm: string | undefined;
    if (showPricePerSqm && nestModel && optionPrice > 0) {
      pricePerSqm = this.calculateOptionPricePerSquareMeter(optionPrice, nestModel, categoryId);
    }

    return {
      showPricePerSqm,
      pricePerSqm,
      formattedPrice: this.formatPrice(optionPrice)
    };
  }

  /**
   * Sort configuration entries for consistent cart display
   * Order: nest module first, regular items in middle, planungspaket/grundstueckscheck at bottom
   */
  static sortConfigurationEntries<T>(
    entries: [string, T][]
  ): {
    topItems: [string, T][],
    middleItems: [string, T][],
    bottomItems: [string, T][]
  } {
    const topItems: [string, T][] = [];
    const middleItems: [string, T][] = [];
    const bottomItems: [string, T][] = [];

    // Define the order for middle items
    const middleOrder = ['gebaeudehuelle', 'innenverkleidung', 'fussboden', 'pvanlage', 'fenster'];

    entries.forEach(([key, value]) => {
      if (key === 'nest') {
        topItems.push([key, value]);
      } else if (key === 'planungspaket' || key === 'grundstueckscheck') {
        bottomItems.push([key, value]);
      } else if (middleOrder.includes(key)) {
        middleItems.push([key, value]);
      } else {
        // For any other items, put them in the middle
        middleItems.push([key, value]);
      }
    });

    // Sort middle items according to the defined order
    middleItems.sort(([a], [b]) => {
      const aIndex = middleOrder.indexOf(a);
      const bIndex = middleOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    // Sort bottom items to ensure consistent order
    bottomItems.sort(([a], [b]) => {
      if (a === 'planungspaket' && b === 'grundstueckscheck') return -1;
      if (a === 'grundstueckscheck' && b === 'planungspaket') return 1;
      return 0;
    });

    return { topItems, middleItems, bottomItems };
  }
} 