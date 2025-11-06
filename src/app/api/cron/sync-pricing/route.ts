/**
 * Scheduled Pricing Sync (Vercel Cron)
 * 
 * GET /api/cron/sync-pricing
 * Automatically triggered daily at 2 AM
 * Requires Vercel cron secret for authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { PricingSyncService } from '@/services/pricing-sync';

export const maxDuration = 60; // 1 minute timeout

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret from Vercel
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedAuth) {
      console.error('Unauthorized cron attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🕐 Running scheduled pricing sync...');
    const startTime = Date.now();

    const syncService = new PricingSyncService();
    const result = await syncService.syncPricing();
    
    const duration = Date.now() - startTime;

    // Log result
    console.log('✅ Scheduled sync completed:', {
      success: result.success,
      updated: result.itemsUpdated,
      added: result.itemsAdded,
      removed: result.itemsRemoved,
      errors: result.errors.length,
      duration: `${duration}ms`,
    });

    // Send notification if there were significant changes or errors
    if (result.itemsUpdated + result.itemsAdded > 5 || result.errors.length > 0) {
      await sendSyncNotification(result);
    }

    return NextResponse.json({
      success: true,
      result,
      duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Scheduled pricing sync failed:', error);
    
    // Send error notification
    await sendErrorNotification(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Send notification about sync results (optional)
 */
async function sendSyncNotification(result: {
  itemsUpdated: number;
  itemsAdded: number;
  itemsRemoved: number;
  errors: string[];
}): Promise<void> {
  // TODO: Implement email notification using Resend
  console.log('📧 Sync notification:', result);
  
  // Example:
  // await resend.emails.send({
  //   from: process.env.RESEND_FROM_EMAIL!,
  //   to: process.env.ADMIN_EMAIL!,
  //   subject: 'Pricing Sync Notification',
  //   text: `Pricing sync completed with ${result.itemsUpdated} updates, ${result.itemsAdded} additions, ${result.itemsRemoved} removals, and ${result.errors.length} errors.`,
  // });
}

/**
 * Send error notification
 */
async function sendErrorNotification(error: unknown): Promise<void> {
  console.error('📧 Sync error notification:', error);
  
  // TODO: Implement error notification
}
