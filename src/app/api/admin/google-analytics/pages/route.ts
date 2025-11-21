/**
 * Google Analytics Top Pages API
 * 
 * Fetches most visited pages
 */

import { NextRequest, NextResponse } from 'next/server';
import { isGAConfigured, getTopPages } from '@/lib/google-analytics';

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

    // Fetch top pages from GA4
    const pages = await getTopPages(dateRange);

    return NextResponse.json({
      success: true,
      data: pages,
      dateRange,
      configured: true,
    });
  } catch (error) {
    console.error('Google Analytics Top Pages API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch top pages',
      configured: isGAConfigured(),
    }, { status: 500 });
  }
}

