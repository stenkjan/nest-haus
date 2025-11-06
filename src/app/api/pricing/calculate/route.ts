import { NextResponse } from 'next/server'
// Remove PriceCalculator import to prevent bundling conflicts
// import { PriceCalculator } from '@/app/konfigurator/core/PriceCalculator'

// Define types for price calculation
interface _Configuration {
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

// Simple price calculation without PriceCalculator dependency
function calculateSimplePrice(config: _Configuration): number {
  if (!config.nest) return 0;
  
  // Use combination logic inline to avoid import conflicts
  let totalPrice = 0;
  
  // Base price from nest selection
  const nestPrices: Record<string, number> = {
    'nest80': 155500,
    'nest100': 189100,
    'nest120': 222700,
    'nest140': 256300,
    'nest160': 289900
  };
  
  totalPrice = nestPrices[config.nest.value] || 0;
  
  // Add additional components
  if (config.pvanlage && config.pvanlage.quantity) {
    totalPrice += (config.pvanlage.price || 0) * config.pvanlage.quantity;
  }
  
  if (config.fenster && config.fenster.squareMeters) {
    totalPrice += (config.fenster.price || 0) * config.fenster.squareMeters;
  }
  
  if (config.planungspaket) {
    totalPrice += config.planungspaket.price || 0;
  }
  
  if (config.grundstueckscheck) {
    totalPrice += 1500; // GRUNDSTUECKSCHECK_PRICE
  }
  
  return totalPrice;
}

// Calculate total price for configuration using simple inline calculation
export async function POST(request: Request) {
  try {
    const config = await request.json()

    if (!config.nest) {
      return NextResponse.json(
        { success: false, error: 'Nest type required' },
        { status: 400 }
      )
    }

    // Use simple inline calculation to avoid bundling conflicts
    const totalPrice = calculateSimplePrice(config);

    return NextResponse.json({
      success: true,
      totalPrice,
      priceBreakdown: {
        basePrice: totalPrice,
        options: {},
        totalPrice
      },
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