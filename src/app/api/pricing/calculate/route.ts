import { NextResponse } from 'next/server'
import { PriceCalculator } from '../../../../configurator/core/PriceCalculator'

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

    // Use existing PriceCalculator logic
    const totalPrice = await PriceCalculator.calculateTotalPrice(config)
    
    // Get detailed price breakdown
    const priceBreakdown = await PriceCalculator.getPriceBreakdown(config)

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