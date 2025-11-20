/**
 * Analytics Backup Service
 * 
 * Provides comprehensive backup functionality for all analytics data:
 * - UserSession, InteractionEvent, SelectionEvent, PerformanceMetric
 * - Compression using gzip to reduce storage
 * - Upload to Vercel Blob Storage
 * - Metadata tracking (timestamp, counts, version)
 */

import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);

export interface BackupMetadata {
  backupDate: string;
  version: string;
  recordCounts: {
    sessions: number;
    interactions: number;
    selections: number;
    metrics: number;
  };
}

export interface BackupData {
  metadata: BackupMetadata;
  sessions: unknown[];
  interactions: unknown[];
  selections: unknown[];
  metrics: unknown[];
}

export interface BackupResult {
  success: boolean;
  blobUrl?: string;
  fileName?: string;
  fileSize?: number;
  metadata?: BackupMetadata;
  error?: string;
}

/**
 * Create a compressed backup of all analytics data and upload to Vercel Blob Storage
 */
export async function createAnalyticsBackup(): Promise<BackupResult> {
  try {
    console.log('📦 Starting analytics backup...');

    // Fetch all analytics data
    console.log('📊 Fetching analytics data from database...');
    
    const [sessions, interactions, selections, metrics] = await Promise.all([
      prisma.userSession.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.interactionEvent.findMany({
        orderBy: { timestamp: 'desc' }
      }),
      prisma.selectionEvent.findMany({
        orderBy: { timestamp: 'desc' }
      }),
      prisma.performanceMetric.findMany({
        orderBy: { timestamp: 'desc' }
      })
    ]);

    console.log(`✓ Fetched ${sessions.length} sessions`);
    console.log(`✓ Fetched ${interactions.length} interaction events`);
    console.log(`✓ Fetched ${selections.length} selection events`);
    console.log(`✓ Fetched ${metrics.length} performance metrics`);

    // Create backup structure with metadata
    const backupData: BackupData = {
      metadata: {
        backupDate: new Date().toISOString(),
        version: '1.0',
        recordCounts: {
          sessions: sessions.length,
          interactions: interactions.length,
          selections: selections.length,
          metrics: metrics.length
        }
      },
      sessions,
      interactions,
      selections,
      metrics
    };

    // Convert to JSON string
    console.log('🔄 Converting to JSON...');
    const jsonString = JSON.stringify(backupData, null, 2);
    const jsonBuffer = Buffer.from(jsonString, 'utf-8');

    // Compress with gzip
    console.log('🗜️  Compressing with gzip...');
    const compressedBuffer = await gzipAsync(jsonBuffer);
    const compressionRatio = ((1 - compressedBuffer.length / jsonBuffer.length) * 100).toFixed(1);
    console.log(`✓ Compressed from ${jsonBuffer.length} to ${compressedBuffer.length} bytes (${compressionRatio}% reduction)`);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const fileName = `analytics-backup-${timestamp}.json.gz`;

    // Upload to Vercel Blob Storage
    console.log('☁️  Uploading to Vercel Blob Storage...');
    const blob = await put(fileName, compressedBuffer, {
      access: 'public',
      contentType: 'application/gzip',
    });

    console.log(`✅ Backup complete! Uploaded to: ${blob.url}`);

    return {
      success: true,
      blobUrl: blob.url,
      fileName,
      fileSize: compressedBuffer.length,
      metadata: backupData.metadata
    };

  } catch (error) {
    console.error('❌ Backup failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get backup file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

