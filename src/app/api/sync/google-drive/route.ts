/**
 * Google Drive Sync API Route
 * 
 * Daily scheduled sync of Google Drive images to Vercel Blob storage
 * with automatic images.ts constants update.
 * 
 * Security: Protected by admin authentication
 * Usage: Called by Vercel cron or manually via admin panel
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveSync } from '@/lib/sync/GoogleDriveSync';
import { validateAdminAuth } from '@/lib/admin-auth';

/**
 * POST /api/sync/google-drive
 * Trigger Google Drive to Vercel Blob sync
 */
export async function POST(request: NextRequest) {
  console.log('🔄 Google Drive sync API called');

  try {
    // Check if required environment variables are present
    if (!process.env.GOOGLE_DRIVE_MAIN_FOLDER_ID ||
      !process.env.GOOGLE_DRIVE_MOBILE_FOLDER_ID ||
      !process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('❌ Missing required environment variables');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required environment variables',
          details: 'GOOGLE_DRIVE_MAIN_FOLDER_ID, GOOGLE_DRIVE_MOBILE_FOLDER_ID, or BLOB_READ_WRITE_TOKEN not set'
        },
        { status: 500 }
      );
    }

    // Check if this is a cron job (Vercel cron includes special headers)
    const isCronJob = request.headers.get('user-agent')?.includes('vercel-cron') ||
      request.headers.get('x-vercel-cron') === '1';

    // For manual calls, validate admin authentication via cookie
    if (!isCronJob) {
      const isAuthenticated = await validateAdminAuth(request);
      if (!isAuthenticated) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized - Admin authentication required' },
          { status: 401 }
        );
      }
    }

    console.log(`🤖 Sync triggered by: ${isCronJob ? 'Cron Job' : 'Manual Call'}`);

    // Parse sync parameters from URL or request body
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '1');
    const forceFullSync = url.searchParams.get('fullSync') === 'true';

    // Safety checks for extended sync
    if (days > 30 && !forceFullSync) {
      console.warn(`⚠️ Large date range requested: ${days} days. Consider using fullSync=true for complete sync.`);
    }

    if (forceFullSync) {
      console.log('🚨 FULL SYNC requested - will process ALL images regardless of modification date');
    } else {
      console.log(`📅 Extended sync requested: ${days} day(s) lookback`);
    }

    // Initialize and run sync with parameters
    const syncService = new GoogleDriveSync();
    const result = await syncService.syncImagesWithDateRange(days, forceFullSync);

    // Log detailed results
    console.log('📊 Sync completed:', {
      processed: result.processed,
      uploaded: result.uploaded,
      updated: result.updated,
      deleted: result.deleted,
      duration: `${result.duration}ms`,
      imagesUpdated: result.imagesUpdated,
      errors: result.errors.length
    });

    // Return success response
    return NextResponse.json({
      success: true,
      result: {
        processed: result.processed,
        uploaded: result.uploaded,
        updated: result.updated,
        deleted: result.deleted,
        duration: result.duration,
        imagesUpdated: result.imagesUpdated,
        errors: result.errors,
        triggeredBy: isCronJob ? 'cron' : 'manual',
        syncType: forceFullSync ? 'full' : `${days}-day`,
        recentChangesFound: result.recentChangesFound
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Sync API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Sync failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sync/google-drive
 * Get sync status and last run information
 */
export async function GET(_request: NextRequest) {
  try {
    // Simple health check and configuration validation
    const config = {
      googleDriveConfigured: !!(process.env.GOOGLE_DRIVE_MAIN_FOLDER_ID && process.env.GOOGLE_DRIVE_MOBILE_FOLDER_ID),
      blobConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
      serviceAccountConfigured: !!(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE)
    };

    const allConfigured = Object.values(config).every(Boolean);

    return NextResponse.json({
      status: allConfigured ? 'ready' : 'misconfigured',
      configuration: config,
      endpoint: '/api/sync/google-drive',
      methods: ['GET', 'POST'],
      authentication: 'Admin credentials required for manual sync',
      cronSchedule: 'Daily at 02:00 UTC (if configured)',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Sync status check error:', error);

    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 