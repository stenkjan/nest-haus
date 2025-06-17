/**
 * PriceCalculator - Core Business Logic
 * 
 * Handles all price calculations for house configurations.
 * Extracted from legacy Configurator.tsx to separate concerns.
 * 
 * @example
 * const basePrice = PriceCalculator.calculateBasePrice('nest80');
 * const totalPrice = PriceCalculator.calculateTotalPrice(configuration);
 */

import type { 
  ConfigurationSelections, 
  Configuration, 
  PriceBreakdown 
} from '../types/configurator.types';
import { prisma } from '../../lib/prisma';

interface HouseOption {
  basePrice: number;
  [key: string]: unknown;
}

export class PriceCalculator {
  // Cache for house options to reduce database calls
  private static optionsCache = new Map<string, { data: any[], timestamp: number }>()
  private static readonly CACHE_TTL = 300000 // 5 minutes

  /**
   * Get cached house options or fetch from database
   */
  private static async getCachedOptions(category?: string): Promise<any[]> {
    const cacheKey = category || 'all'
    const cached = this.optionsCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data
    }

    const options = await prisma.houseOption.findMany({
      where: category ? { category, isActive: true } : { isActive: true }
    })

    this.optionsCache.set(cacheKey, { data: options, timestamp: Date.now() })
    return options
  }

  /**
   * Calculate base price for a specific nest type (optimized with caching)
   */
  static async calculateBasePrice(nestType: string): Promise<number> {
    const options = await this.getCachedOptions('nest')
    const option = options.find(opt => opt.value === nestType)
    return option?.basePrice || 0
  }

  /**
   * Calculate price for combination of selections using database pricing rules
   */
  static async calculateCombinationPrice(selections: ConfigurationSelections): Promise<number> {
    // Try to find exact pricing rule match
    const pricingRule = await prisma.pricingRule.findFirst({
      where: {
        nestType: selections.nest,
        gebaeudehuelle: selections.gebaeudehuelle,
        innenverkleidung: selections.innenverkleidung,
        fussboden: selections.fussboden,
        isActive: true
      }
    });

    if (pricingRule) {
      return pricingRule.totalPrice;
    }

    // Fallback: calculate by individual options
    const options = await prisma.houseOption.findMany({
      where: {
        OR: [
          { category: 'nest', value: selections.nest },
          { category: 'gebaeudehuelle', value: selections.gebaeudehuelle },
          { category: 'innenverkleidung', value: selections.innenverkleidung },
          { category: 'fussboden', value: selections.fussboden }
        ],
        isActive: true
      }
    });

         return options.reduce((total: number, option: HouseOption) => total + option.basePrice, 0);
  }

  /**
   * Calculate total price including all options
   */
  static async calculateTotalPrice(configuration: Configuration): Promise<number> {
    let totalPrice = 0;

    // Base configuration price
    const basePrice = await this.calculateCombinationPrice({
      nest: configuration.nest,
      gebaeudehuelle: configuration.gebaeudehuelle,
      innenverkleidung: configuration.innenverkleidung,
      fussboden: configuration.fussboden
    });
    
    totalPrice += basePrice;

    // Add optional components
    const optionalOptions = await prisma.houseOption.findMany({
      where: {
        OR: [
          { category: 'pvanlage', value: configuration.pvanlage || 'none' },
          { category: 'fenster', value: configuration.fenster || 'standard' },
          { category: 'planungspaket', value: configuration.planungspaket || 'basic' }
        ],
        isActive: true
      }
    });

    for (const option of optionalOptions) {
      totalPrice += option.basePrice;
    }

    return totalPrice;
  }

  /**
   * Get detailed price breakdown for transparency
   */
  static async getPriceBreakdown(configuration: Configuration): Promise<PriceBreakdown> {
    const breakdown: PriceBreakdown = {
      basePrice: 0,
      options: {},
      totalPrice: 0
    };

    // Get all relevant options
    const allOptions = await prisma.houseOption.findMany({
      where: {
        OR: [
          { category: 'nest', value: configuration.nest },
          { category: 'gebaeudehuelle', value: configuration.gebaeudehuelle },
          { category: 'innenverkleidung', value: configuration.innenverkleidung },
          { category: 'fussboden', value: configuration.fussboden },
          { category: 'pvanlage', value: configuration.pvanlage || 'none' },
          { category: 'fenster', value: configuration.fenster || 'standard' },
          { category: 'planungspaket', value: configuration.planungspaket || 'basic' }
        ],
        isActive: true
      }
    });

    // Categorize prices
    for (const option of allOptions) {
      if (option.category === 'nest') {
        breakdown.basePrice = option.basePrice;
      } else {
        breakdown.options[option.category] = {
          name: option.name,
          price: option.basePrice
        };
      }
    }

    // Calculate total
    breakdown.totalPrice = breakdown.basePrice + 
      Object.values(breakdown.options).reduce((sum, opt) => sum + opt.price, 0);

    return breakdown;
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
} 