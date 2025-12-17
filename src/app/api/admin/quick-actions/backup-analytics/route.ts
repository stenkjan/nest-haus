/**
 * Manual Analytics Backup API Route
 * 
 * Provides on-demand backup functionality for admin users.
 * Creates compressed backup and uploads to Vercel Blob Storage.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAnalyticsBackup, formatFileSize } from '@/services/analytics-backup-service';

export async function POST() {
  try {
    // Admin authentication check
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (adminPassword) {
      const cookieStore = await cookies();
      const authCookie = cookieStore.get('hoam-admin-auth');
      
      if (!authCookie || authCookie.value !== adminPassword) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    console.log('🔐 Admin authenticated, starting backup...');

    // Create backup
    const result = await createAnalyticsBackup();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Backup failed'
        },
        { status: 500 }
      );
    }

    // Return success with details
    return NextResponse.json({
      success: true,
      backup: {
        url: result.blobUrl,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileSizeFormatted: result.fileSize ? formatFileSize(result.fileSize) : 'Unknown',
        metadata: result.metadata,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Backup API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

