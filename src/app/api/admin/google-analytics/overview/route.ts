/**
 * Google Analytics Overview Metrics API
 * 
 * Fetches overview metrics like users, sessions, pageviews, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isGAConfigured, getOverviewMetrics } from '@/lib/google-analytics';

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

    // Fetch metrics from GA4
    const metrics = await getOverviewMetrics(dateRange);

    // Return successful response even if metrics are zero
    // This is consistent with other endpoints that return empty arrays
    return NextResponse.json({
      success: true,
      data: metrics,
      dateRange,
      configured: true,
    });
  } catch (error) {
    console.error('Google Analytics API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Google Analytics data',
      configured: isGAConfigured(),
    }, { status: 500 });
  }
}

