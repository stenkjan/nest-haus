/**
 * Pricing Sync API Endpoint
 * 
 * Syncs pricing data from Google Sheets to database
 * Should be called manually or by cron job
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPricingSheetService } from '@/services/pricing-sheet-service';
import { savePricingSnapshot } from '@/services/pricing-db-service';

export async function POST(_request: NextRequest) {
  try {
    console.log('📊 Starting pricing data sync from Google Sheets...');
    
    // Fetch latest pricing data from Google Sheets
    const pricingService = getPricingSheetService();
    const pricingData = await pricingService.loadPricingData(true); // force refresh
    
    // Save to database
    await savePricingSnapshot(pricingData, 'manual');
    
    console.log('✅ Pricing data synced successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Pricing data synced from Google Sheets to database',
      timestamp: new Date().toISOString(),
      data: pricingData,
    });
    
  } catch (error) {
    console.error('❌ Error syncing pricing data:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to sync pricing data',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

