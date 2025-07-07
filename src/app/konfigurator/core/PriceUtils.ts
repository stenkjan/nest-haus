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
   * Get adjusted nutzfläche for Nest models (original - 5m²)
   */
  static getAdjustedNutzflaeche(nestModel: string): number {
    const nutzflaecheMap: Record<string, number> = {
      'nest80': 75,   // 80 - 5
      'nest100': 95,  // 100 - 5
      'nest120': 115, // 120 - 5
      'nest140': 135, // 140 - 5
      'nest160': 155  // 160 - 5
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
   */
  static calculateOptionPricePerSquareMeter(price: number, nestModel: string): string {
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
      pricePerSqm = this.calculateOptionPricePerSquareMeter(optionPrice, nestModel);
    }

    return {
      showPricePerSqm,
      pricePerSqm,
      formattedPrice: this.formatPrice(optionPrice)
    };
  }
} 