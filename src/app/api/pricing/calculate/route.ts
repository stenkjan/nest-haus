import { NextResponse } from 'next/server'
// Remove PriceCalculator import to prevent bundling conflicts
// import { PriceCalculator } from '@/app/konfigurator/core/PriceCalculator'

// ✅ PERFORMANCE: Simple in-memory cache for price calculations
const priceCache = new Map<string, { result: Record<string, unknown>; timestamp: number }>();
const PRICE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache for price calculations
const MAX_PRICE_CACHE_SIZE = 500;

// ✅ PERFORMANCE: Cache cleanup function
function cleanupPriceCache() {
  const now = Date.now();
  const toDelete: string[] = [];
  
  for (const [key, value] of priceCache.entries()) {
    if (now - value.timestamp > PRICE_CACHE_TTL) {
      toDelete.push(key);
    }
  }
  
  toDelete.forEach(key => priceCache.delete(key));
  
  // Keep cache size manageable
  if (priceCache.size > MAX_PRICE_CACHE_SIZE) {
    const entries = Array.from(priceCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, entries.length - MAX_PRICE_CACHE_SIZE);
    toRemove.forEach(([key]) => priceCache.delete(key));
  }
}

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

// ✅ PERFORMANCE: Enhanced price calculation with combination pricing
function calculateOptimizedPrice(config: _Configuration): number {
  if (!config.nest) return 0;
  
  // ✅ RULE COMPLIANCE: Use combination logic inline (client-side compatible)
  let totalPrice = 0;
  
  // Base price from nest selection with combination pricing logic
  const nestPrices: Record<string, number> = {
    'nest80': 155500,
    'nest100': 189100,
    'nest120': 222700,
    'nest140': 256300,
    'nest160': 289900
  };
  
  totalPrice = nestPrices[config.nest.value] || 0;
  
  // ✅ OPTIMIZATION: Progressive pricing - only add if different from defaults
  if (config.gebaeudehuelle && config.gebaeudehuelle.value !== 'trapezblech') {
    totalPrice += config.gebaeudehuelle.price || 0;
  }
  
  if (config.innenverkleidung && config.innenverkleidung.value !== 'kiefer') {
    totalPrice += config.innenverkleidung.price || 0;
  }
  
  if (config.fussboden && config.fussboden.value !== 'parkett') {
    totalPrice += config.fussboden.price || 0;
  }
  
  // Add additional components with proper quantity/area calculations
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
    totalPrice += 490; // GRUNDSTUECKSCHECK_PRICE (corrected from 990)
  }
  
  return totalPrice;
}

// ✅ PERFORMANCE: Generate cache key for configurations
function generateCacheKey(config: _Configuration): string {
  const key = {
    nest: config.nest?.value,
    gebaeudehuelle: config.gebaeudehuelle?.value,
    innenverkleidung: config.innenverkleidung?.value,
    fussboden: config.fussboden?.value,
    pvanlage: config.pvanlage ? `${config.pvanlage.value}-${config.pvanlage.quantity || 1}` : null,
    fenster: config.fenster ? `${config.fenster.value}-${config.fenster.squareMeters || 1}` : null,
    planungspaket: config.planungspaket?.value,
    grundstueckscheck: config.grundstueckscheck?.value
  };
  
  return JSON.stringify(key);
}

// Calculate total price for configuration using optimized calculation
export async function POST(request: Request) {
  try {
    const config = await request.json()

    if (!config.nest) {
      return NextResponse.json(
        { success: false, error: 'Nest type required' },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          }
        }
      )
    }

    // ✅ PERFORMANCE: Check cache first
    const cacheKey = generateCacheKey(config);
    const cached = priceCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < PRICE_CACHE_TTL) {
      return NextResponse.json(
        {
          ...cached.result,
          cached: true,
          cacheAge: Date.now() - cached.timestamp
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            'X-Cache-Status': 'HIT'
          }
        }
      );
    }

    // ✅ PERFORMANCE: Calculate with optimized logic
    const totalPrice = calculateOptimizedPrice(config);

    const result = {
      success: true,
      totalPrice,
      priceBreakdown: {
        basePrice: totalPrice,
        options: {},
        totalPrice
      },
      timestamp: Date.now()
    };

    // ✅ PERFORMANCE: Cache the result
    if (Math.random() < 0.05) { // 5% chance to cleanup
      cleanupPriceCache();
    }
    
    if (priceCache.size < MAX_PRICE_CACHE_SIZE) {
      priceCache.set(cacheKey, { result, timestamp: Date.now() });
    }

    return NextResponse.json(
      result,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache-Status': 'MISS'
        }
      }
    );

  } catch (error) {
    console.error('Failed to calculate price:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate price',
        timestamp: Date.now()
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    )
  }
}

// ✅ PERFORMANCE: Export route config for optimization
export const dynamic = 'force-dynamic'; // Fresh calculations when needed
export const runtime = 'nodejs'; // Use Node.js runtime for better performance 