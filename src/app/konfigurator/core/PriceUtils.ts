/**
 * PriceUtils - Client-Safe Price Utilities
 * 
 * Contains formatting and calculation utilities that can be used
 * on both client and server side without database dependencies.
 */

import { NEST_OPTIONS } from '@/constants/configurator';

export class PriceUtils {
  /**
   * Check if price is "Auf Anfrage" (price on request)
   */
  static isPriceOnRequest(price: number): boolean {
    return price === -1;
  }

  /**
   * Format price or return "-" for Auf Anfrage
   */
  static formatPriceOrDash(price: number): string {
    if (price === -1) return '-';
    if (price === 0) return '';
    return this.formatPrice(price);
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
   * @param nestModel - The nest model (nest80, nest100, etc.)
   * @param geschossdeckeQuantity - Optional quantity of Geschossdecke (adds 6.5m² per unit)
   */
  static getAdjustedNutzflaeche(nestModel: string, geschossdeckeQuantity?: number): number {
    const nutzflaecheMap: Record<string, number> = {
      'nest80': 75,   // 75m² Nutzfläche (adjusted)
      'nest100': 95,  // 95m² Nutzfläche (adjusted)
      'nest120': 115, // 115m² Nutzfläche (adjusted)
      'nest140': 135, // 135m² Nutzfläche (adjusted)
      'nest160': 155  // 155m² Nutzfläche (adjusted)
    };

    const baseArea = nutzflaecheMap[nestModel] || 0;
    const geschossdeckeArea = (geschossdeckeQuantity || 0) * 6.5; // 6.5m² per geschossdecke

    return baseArea + geschossdeckeArea;
  }

  /**
   * Calculate and format price per square meter
   * @param totalPrice - Total price to calculate per m²
   * @param nestModel - The nest model (nest80, nest100, etc.)
   * @param geschossdeckeQuantity - Optional quantity of Geschossdecke (adds 6.5m² per unit)
   */
  static calculatePricePerSquareMeter(totalPrice: number, nestModel: string, geschossdeckeQuantity?: number): string {
    const adjustedNutzflaeche = this.getAdjustedNutzflaeche(nestModel, geschossdeckeQuantity);
    if (adjustedNutzflaeche === 0) return '€0 /m²';

    const pricePerSqm = Math.round(totalPrice / adjustedNutzflaeche);
    return `${this.formatPrice(pricePerSqm)} /m²`;
  }

  /**
   * Get parkett price based on nest size
   * Pricing: nest80=3800€, nest100=5000€, nest120=6200€, nest140=7400€, nest160=8600€
   */
  static getParkettPrice(nestModel: string): number {
    const parkettPricing: Record<string, number> = {
      'nest80': 3800,   // 75m² → 3800€
      'nest100': 5000,  // 95m² → 5000€
      'nest120': 6200,  // 115m² → 6200€
      'nest140': 7400,  // 135m² → 7400€
      'nest160': 8600   // 155m² → 8600€
    };

    return parkettPricing[nestModel] || 3800; // Default to nest80 price
  }

  /**
   * Determine if a category should show price per m² based on overhaul requirements
   */
  static shouldShowPricePerSquareMeter(categoryId: string): boolean {
    const eligibleCategories = [
      'nest',
      'geschossdecke',
      'gebaeudehuelle',
      'innenverkleidung',
      'fussboden',
      'bodenbelag', // alias for fussboden
      'pvanlage',
      'bodenaufbau',
      'optionen', // for fundament
      'fundament', // direct category name
      'planungspaket',
      'planungspakete', // plural form
    ];
    return eligibleCategories.includes(categoryId);
  }

  /**
* Calculate and format price per m² for individual options
* For NEST modules: uses the option's own FULL price and area (not dynamic price difference)
* For other options: calculates dynamically based on current module size
* @param price - The price of the option
* @param nestModel - The nest model (nest80, nest100, etc.)
* @param categoryId - The category of the option
* @param optionId - The option ID
* @param geschossdeckeQuantity - Optional quantity of Geschossdecke (adds 7.5m² per unit)
*/
  static calculateOptionPricePerSquareMeter(price: number, nestModel: string, categoryId?: string, optionId?: string, geschossdeckeQuantity?: number): string {
    // For NEST modules themselves, ALWAYS use the full module price from constants
    if (categoryId === 'nest' && optionId) {
      // Find the specific nest option to get its full price
      const nestOption = NEST_OPTIONS.find((option: { id: string; price: number; modules: number }) => option.id === optionId);
      if (!nestOption) {
        return ''; // No pricing data available
      }

      // Use the full nest price (not the dynamic price difference)
      const fullNestPrice = nestOption.price;
      const adjustedNutzflaeche = this.getAdjustedNutzflaeche(optionId, geschossdeckeQuantity);
      if (adjustedNutzflaeche === 0) return '';

      const pricePerSqm = Math.round(fullNestPrice / adjustedNutzflaeche);
      return `${this.formatPrice(pricePerSqm)} /m²`;
    }

    // For geschossdecke: calculate price per m² based on TOTAL area (nest size + geschossdecke area)
    // When geschossdecke is selected, its m² calculation should include the total adjusted area
    if (categoryId === 'geschossdecke') {
      const adjustedNutzflaeche = this.getAdjustedNutzflaeche(nestModel, geschossdeckeQuantity);
      if (adjustedNutzflaeche === 0) return '';
      const pricePerSqm = Math.round(price / adjustedNutzflaeche);
      return `${this.formatPrice(pricePerSqm)} /m²`;
    }

    // For all other options, calculate based on current module size (unchanged)
    const adjustedNutzflaeche = this.getAdjustedNutzflaeche(nestModel, geschossdeckeQuantity);
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
   * Sort configuration entries for consistent display
   * Order: nest module first, regular items (including planungspaket after bodenaufbau) in middle, grundstueckscheck at bottom
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

    // Define the order for middle items - planungspaket now appears after belichtungspaket (last)
    const middleOrder = ['gebaeudehuelle', 'innenverkleidung', 'fussboden', 'bodenaufbau', 'geschossdecke', 'belichtungspaket', 'planungspaket', 'pvanlage', 'fenster', 'stirnseite'];

    entries.forEach(([key, value]) => {
      if (key === 'nest') {
        topItems.push([key, value]);
      } else if (key === 'grundstueckscheck') {
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

    // Bottom items now only contain grundstueckscheck (no sorting needed)

    return { topItems, middleItems, bottomItems };
  }
} 