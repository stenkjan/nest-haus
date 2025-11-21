/**
 * Google Analytics Geographic Data API
 * 
 * Fetches geographic data (countries and cities)
 */

import { NextRequest, NextResponse } from 'next/server';
import { isGAConfigured, getGeographicData } from '@/lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    // Check if GA is configured
    if (!isGAConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Google Analytics is not configured. Please set GA4_PROPERTY_ID and credentials in environment variables.',
        configured: false,
      }, { status: 503 });
    }

    // Get date range from query params
    const searchParams = request.nextUrl.searchParams;
    const dateRange = (searchParams.get('range') as '7d' | '30d' | '90d') || '30d';

    // Fetch geographic data from GA4
    const geoData = await getGeographicData(dateRange);

    return NextResponse.json({
      success: true,
      data: geoData,
      dateRange,
      configured: true,
    });
  } catch (error) {
    console.error('Google Analytics Geographic API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch geographic data',
      configured: isGAConfigured(),
    }, { status: 500 });
  }
}

