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
    }).format(price);
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
    }).format(monthlyPayment);
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
} 