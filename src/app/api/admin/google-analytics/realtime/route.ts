/**
 * Google Analytics Real-time Users API
 * 
 * Fetches current active users in real-time
 */

import { NextResponse } from 'next/server';
import { isGAConfigured, getRealtimeUsers } from '@/lib/google-analytics';

export async function GET() {
  try {
    // Check if GA is configured
    if (!isGAConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Google Analytics is not configured',
        configured: false,
      }, { status: 503 });
    }

    // Fetch real-time data from GA4
    const activeUsers = await getRealtimeUsers();

    return NextResponse.json({
      success: true,
      data: {
        activeUsers,
      },
      configured: true,
    });
  } catch (error) {
    console.error('Google Analytics Real-time API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch real-time data',
      configured: isGAConfigured(),
    }, { status: 500 });
  }
}

