/**
 * Cron Job: Monthly Analytics Backup
 * 
 * Runs on the 1st of every month at 2:00 AM to create a backup of all analytics data.
 * Backup is compressed and uploaded to Vercel Blob Storage.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAnalyticsBackup, formatFileSize } from '@/services/analytics-backup-service';

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
    console.log('📅 Starting monthly analytics backup at 2:00 AM on 1st of month...');

    // Create backup
    const result = await createAnalyticsBackup();

    if (!result.success) {
      throw new Error(result.error || 'Backup failed');
    }

    const duration = Date.now() - startTime;

    console.log(`✅ Monthly backup completed in ${duration}ms`);
    console.log(`📦 Backup URL: ${result.blobUrl}`);
    console.log(`📊 Records backed up:`, result.metadata?.recordCounts);

    return NextResponse.json({
      success: true,
      message: 'Monthly analytics backup completed successfully',
      backup: {
        url: result.blobUrl,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileSizeFormatted: result.fileSize ? formatFileSize(result.fileSize) : 'Unknown',
        metadata: result.metadata
      },
      duration,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Monthly backup failed:', error);
    
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: false,
      message: 'Monthly analytics backup failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

