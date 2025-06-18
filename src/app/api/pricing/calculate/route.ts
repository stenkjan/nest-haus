import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// Define types for price calculation
interface ConfigurationSelections {
  nest: string
  gebaeudehuelle: string
  innenverkleidung: string
  fussboden: string
}

interface Configuration {
  sessionId: string
  nest?: { category: string; value: string; name: string; price: number; quantity?: number; squareMeters?: number }
  gebaeudehuelle?: { category: string; value: string; name: string; price: number }
  innenverkleidung?: { category: string; value: string; name: string; price: number }
  fussboden?: { category: string; value: string; name: string; price: number }
  pvanlage?: { category: string; value: string; name: string; price: number; quantity?: number }
  fenster?: { category: string; value: string; name: string; price: number; squareMeters?: number }
  planungspaket?: { category: string; value: string; name: string; price: number }
  grundstueckscheck?: { category: string; value: string; name: string; price: number }
  totalPrice: number
  timestamp: number
}

interface PriceBreakdown {
  basePrice: number
  options: Record<string, { name: string; price: number }>
  totalPrice: number
}

interface HouseOption {
  id: string
  category: string
  value: string
  name: string
  basePrice: number
  isActive: boolean
}

class ServerPriceCalculator {
  // Cache for house options to reduce database calls
  private static optionsCache = new Map<string, { data: HouseOption[]; timestamp: number }>()
  private static readonly CACHE_TTL = 300000 // 5 minutes

  /**
   * Get cached house options or fetch from database
   */
  private static async getCachedOptions(category?: string): Promise<HouseOption[]> {
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
    })

    if (pricingRule) {
      return pricingRule.totalPrice
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
    })

    return options.reduce((total: number, option: HouseOption) => total + option.basePrice, 0)
  }

  /**
   * Calculate total price including all options
   */
  static async calculateTotalPrice(configuration: Configuration): Promise<number> {
    let totalPrice = 0

    // Ensure we have required base configuration
    if (!configuration.nest || !configuration.gebaeudehuelle || !configuration.innenverkleidung || !configuration.fussboden) {
      return 0
    }

    // Base configuration price
    const basePrice = await this.calculateCombinationPrice({
      nest: configuration.nest.value,
      gebaeudehuelle: configuration.gebaeudehuelle.value,
      innenverkleidung: configuration.innenverkleidung.value,
      fussboden: configuration.fussboden.value
    })
    
    totalPrice += basePrice

    // Add optional components with quantities/square meters
    if (configuration.pvanlage) {
      const quantity = configuration.pvanlage.quantity || 1
      totalPrice += configuration.pvanlage.price * quantity
    }

    if (configuration.fenster) {
      const squareMeters = configuration.fenster.squareMeters || 1
      totalPrice += configuration.fenster.price * squareMeters
    }

    if (configuration.planungspaket) {
      totalPrice += configuration.planungspaket.price
    }

    if (configuration.grundstueckscheck) {
      totalPrice += configuration.grundstueckscheck.price
    }

    return totalPrice
  }

  /**
   * Get detailed price breakdown for transparency
   */
  static async getPriceBreakdown(configuration: Configuration): Promise<PriceBreakdown> {
    const breakdown: PriceBreakdown = {
      basePrice: 0,
      options: {},
      totalPrice: 0
    }

    // Ensure we have required base configuration
    if (!configuration.nest || !configuration.gebaeudehuelle || !configuration.innenverkleidung || !configuration.fussboden) {
      return breakdown
    }

    // Calculate base price
    breakdown.basePrice = await this.calculateCombinationPrice({
      nest: configuration.nest.value,
      gebaeudehuelle: configuration.gebaeudehuelle.value,
      innenverkleidung: configuration.innenverkleidung.value,
      fussboden: configuration.fussboden.value
    })

    // Add optional components
    if (configuration.pvanlage) {
      const quantity = configuration.pvanlage.quantity || 1
      breakdown.options.pvanlage = {
        name: configuration.pvanlage.name,
        price: configuration.pvanlage.price * quantity
      }
    }

    if (configuration.fenster) {
      const squareMeters = configuration.fenster.squareMeters || 1
      breakdown.options.fenster = {
        name: configuration.fenster.name,
        price: configuration.fenster.price * squareMeters
      }
    }

    if (configuration.planungspaket) {
      breakdown.options.planungspaket = {
        name: configuration.planungspaket.name,
        price: configuration.planungspaket.price
      }
    }

    if (configuration.grundstueckscheck) {
      breakdown.options.grundstueckscheck = {
        name: configuration.grundstueckscheck.name,
        price: configuration.grundstueckscheck.price
      }
    }

    // Calculate total
    breakdown.totalPrice = breakdown.basePrice + 
      Object.values(breakdown.options).reduce((sum, opt) => sum + opt.price, 0)

    return breakdown
  }
}

// Calculate total price for configuration
export async function POST(request: Request) {
  try {
    const config = await request.json()

    if (!config.nest) {
      return NextResponse.json(
        { success: false, error: 'Nest type required' },
        { status: 400 }
      )
    }

    // Use server-side PriceCalculator logic
    const totalPrice = await ServerPriceCalculator.calculateTotalPrice(config)
    
    // Get detailed price breakdown
    const priceBreakdown = await ServerPriceCalculator.getPriceBreakdown(config)

    return NextResponse.json({
      success: true,
      totalPrice,
      priceBreakdown,
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Failed to calculate price:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate price',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
} 