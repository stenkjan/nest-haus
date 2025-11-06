/**
 * Manual Pricing Sync API Endpoint
 * 
 * POST /api/sync/pricing
 * Triggers a manual sync from Google Sheets
 * Requires admin authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { PricingSyncService } from '@/services/pricing-sync';

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    // const session = await getServerSession();
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Verify admin password from request
    const body = await request.json();
    const { adminPassword } = body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    const startTime = Date.now();
    const syncService = new PricingSyncService();
    const result = await syncService.syncPricing();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      ...result,
      duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Pricing sync error:', error);
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
 * GET /api/sync/pricing
 * Get last sync status and timestamp
 */
export async function GET() {
  try {
    const syncService = new PricingSyncService();
    const lastSyncTime = await syncService.getLastSyncTime();

    return NextResponse.json({
      lastSync: lastSyncTime,
      nextScheduledSync: getNextScheduledSync(),
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync status' },
      { status: 500 }
    );
  }
}

/**
 * Calculate next scheduled sync time (2 AM next day)
 */
function getNextScheduledSync(): string {
  const now = new Date();
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  next.setHours(2, 0, 0, 0);
  return next.toISOString();
}
