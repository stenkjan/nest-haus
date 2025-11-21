/**
 * Google Analytics Traffic Sources API
 * 
 * Fetches traffic source data (referrers, mediums)
 */

import { NextRequest, NextResponse } from 'next/server';
import { isGAConfigured, getTrafficSources } from '@/lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    // Check if GA is configured
    if (!isGAConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Google Analytics is not configured',
        configured: false,
      }, { status: 503 });
    }

    // Get date range from query params
    const searchParams = request.nextUrl.searchParams;
    const dateRange = (searchParams.get('range') as '7d' | '30d' | '90d') || '30d';

    // Fetch traffic sources from GA4
    const sources = await getTrafficSources(dateRange);

    return NextResponse.json({
      success: true,
      data: sources,
      dateRange,
      configured: true,
    });
  } catch (error) {
    console.error('Google Analytics Traffic Sources API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch traffic sources',
      configured: isGAConfigured(),
    }, { status: 500 });
  }
}

