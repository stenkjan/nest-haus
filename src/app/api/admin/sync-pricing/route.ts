/**
 * Admin Endpoint: Manual Pricing Sync
 * 
 * Allows admins to manually trigger pricing sync from Google Sheets to database
 * Useful for initial setup or manual updates outside of scheduled cron
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPricingSheetService } from '@/services/pricing-sheet-service';
import { savePricingSnapshot } from '@/services/pricing-db-service';

// Simple admin check (you may want to enhance this with proper auth)
function isAdmin(request: NextRequest): boolean {
  // Check for admin password in header or query param
  const adminPassword = request.headers.get('x-admin-password') || 
                       new URL(request.url).searchParams.get('password');
  return adminPassword === process.env.ADMIN_PASSWORD;
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const startTime = Date.now();

  try {
    console.log('[SYNC] Manual pricing sync triggered by admin...');

    // Fetch fresh data from Google Sheets
    const pricingService = getPricingSheetService();
    const pricingData = await pricingService.loadPricingData(true); // Force refresh

    // Save to database as shadow copy
    await savePricingSnapshot(pricingData, 'manual');

    const duration = Date.now() - startTime;

    console.log(`[SUCCESS] Manual pricing sync completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: 'Pricing data synced successfully to database',
      duration,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[ERROR] Manual pricing sync failed:', error);
    
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: false,
      message: 'Pricing sync failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Return sync status
  const { getPricingDataInfo } = await import('@/services/pricing-db-service');
  const info = await getPricingDataInfo();

  return NextResponse.json({
    success: true,
    hasData: !!info,
    version: info?.version,
    syncedAt: info?.syncedAt,
    syncedBy: info?.syncedBy,
    timestamp: new Date().toISOString(),
  });
}

