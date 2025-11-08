/**
 * Cron Job: Sync Pricing Sheet to Database
 * 
 * Runs daily at 2:00 AM to sync pricing data from Google Sheets to database
 * This creates a shadow copy so the app doesn't depend on live Google Sheets access
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPricingSheetService } from '@/services/pricing-sheet-service';
import { savePricingSnapshot } from '@/services/pricing-db-service';

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel Cron)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const startTime = Date.now();

  try {
    console.log('🔄 Starting daily pricing sync at 2:00 AM...');

    // Fetch fresh data from Google Sheets
    const pricingService = getPricingSheetService();
    const pricingData = await pricingService.loadPricingData(true); // Force refresh

    // Save to database as shadow copy
    await savePricingSnapshot(pricingData, 'cron');

    const duration = Date.now() - startTime;

    console.log(`✅ Pricing sync completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: 'Pricing data synced successfully to database',
      duration,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Pricing sync failed:', error);
    
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

