import { NextResponse } from 'next/server'
import { PriceCalculator } from '../../konfigurator/core/PriceCalculator'

// Define types for price calculation
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

// Calculate total price for configuration using unified PriceCalculator
export async function POST(request: Request) {
  try {
    const config = await request.json()

    if (!config.nest) {
      return NextResponse.json(
        { success: false, error: 'Nest type required' },
        { status: 400 }
      )
    }

    // Convert configuration to selections format for PriceCalculator
    const selections = {
      nest: config.nest,
      gebaeudehuelle: config.gebaeudehuelle,
      innenverkleidung: config.innenverkleidung,
      fussboden: config.fussboden,
      pvanlage: config.pvanlage,
      fenster: config.fenster,
      paket: config.planungspaket,
      grundstueckscheck: !!config.grundstueckscheck
    }

    // Use unified PriceCalculator for consistent pricing logic
    const totalPrice = PriceCalculator.calculateTotalPrice(selections)
    const priceBreakdown = PriceCalculator.getPriceBreakdown(selections)

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