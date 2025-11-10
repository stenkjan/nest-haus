/**
 * Pricing Data API Endpoint
 * 
 * Fetches pricing data from database (shadow copy)
 * Used by client-side PriceCalculator
 * No longer depends on live Google Sheets access
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPricingDataFromDb, getPricingDataInfo } from '@/services/pricing-db-service';

// Cache pricing data in memory (server-side)
let cachedPricingData: Awaited<ReturnType<typeof getPricingDataFromDb>> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(_request: NextRequest) {
  try {
    const now = Date.now();
    
    // Return cached data if still valid
    if (cachedPricingData && (now - cacheTimestamp) < CACHE_TTL) {
      const info = await getPricingDataInfo();
      return NextResponse.json({
        success: true,
        data: cachedPricingData,
        cached: true,
        version: info?.version,
        syncedAt: info?.syncedAt,
        timestamp: new Date().toISOString(),
      }, {
        headers: {
          // Browser can cache for 5 minutes
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          // CDN can cache for 1 hour (pricing rarely changes)
          'CDN-Cache-Control': 'public, s-maxage=3600',
        },
      });
    }

    // Fetch from database (shadow copy)
    const pricingData = await getPricingDataFromDb();

    if (!pricingData) {
      return NextResponse.json({
        success: false,
        message: 'No pricing data available in database. Please run initial sync.',
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }

    // Update cache
    cachedPricingData = pricingData;
    cacheTimestamp = now;

    const info = await getPricingDataInfo();

    return NextResponse.json({
      success: true,
      data: pricingData,
      cached: false,
      version: info?.version,
      syncedBy: info?.syncedBy,
      syncedAt: info?.syncedAt,
      timestamp: new Date().toISOString(),
    }, {
      headers: {
        // Browser can cache for 5 minutes
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        // CDN can cache for 1 hour
        'CDN-Cache-Control': 'public, s-maxage=3600',
      },
    });

  } catch (error) {
    console.error('❌ Error fetching pricing data:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch pricing data',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

