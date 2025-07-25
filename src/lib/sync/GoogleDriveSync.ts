/**
 * GoogleDriveSync - Efficient Google Drive to Vercel Blob Synchronization
 * 
 * Features:
 * - Daily sync with 24-hour change detection
 * - Number-based image replacement with proper hash generation
 * - Auto-updates images.ts constants when names change
 * - Conservative safety checks to prevent data loss
 * 
 * Daily sync: Drive (24h changes) → Blob → Update Constants
 */

import { google, drive_v3 } from 'googleapis';
import { put, list, del } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { ImagesConstantsUpdater } from './ImagesConstantsUpdater';

// Types
export interface DriveImage {
  id: string;
  name: string;
  number: number;
  title: string;
  extension: string;
  modifiedTime: string;
  webContentLink: string;
  isMobile: boolean;
  isRecentlyModified: boolean; // NEW: Track if modified in last 24 hours
}

export interface BlobImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
  number?: number;
  title?: string;
  isMobile?: boolean;
}

export interface SyncResult {
  processed: number;
  uploaded: number;
  updated: number;
  deleted: number;
  errors: string[];
  duration: number;
  imagesUpdated: boolean;
  recentChangesFound: number; // NEW: Track recently changed files
}

interface SyncOperations {
  upload: DriveImage[];
  update: Array<{ drive: DriveImage; blob: BlobImage }>;
  delete: BlobImage[];
}

export class GoogleDriveSync {
  private drive!: drive_v3.Drive; // Definite assignment assertion - initialized in initializeGoogleAuth
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    // Don't call async methods from constructor - this was causing race conditions
  }

  /**
   * Initialize Google Drive API with service account
   */
  private async initializeGoogleAuth(): Promise<void> {
    // Return existing promise if already initializing
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // If already initialized, return immediately
    if (this.initialized) {
      return Promise.resolve();
    }

    // Create and store initialization promise
    this.initializationPromise = this._performInitialization();

    try {
      await this.initializationPromise;
    } finally {
      // Reset promise after completion (success or failure)
      this.initializationPromise = null;
    }
  }

  private async _performInitialization(): Promise<void> {
    try {
      console.log('🔐 Initializing Google Drive authentication...');

      const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json');

      // Check if service account file exists
      try {
        await fs.access(serviceAccountPath);
      } catch {
        throw new Error('Service account key file not found. Please ensure service-account-key.json exists in the project root.');
      }

      const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));

      // Validate service account structure
      if (!serviceAccount.type || !serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
        throw new Error('Invalid service account key format. Please check the service-account-key.json file.');
      }

      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
      });

      this.drive = google.drive({ version: 'v3', auth });

      // Test the authentication by making a simple API call
      console.log('🔐 Testing Google Drive authentication...');
      const testResponse = await this.drive.about.get({ fields: 'user' });

      if (!testResponse.data.user) {
        throw new Error('Authentication test failed: No user data returned');
      }

      this.initialized = true;
      console.log('🔐 Google Drive authentication initialized and tested successfully');
      console.log(`🔐 Authenticated as: ${testResponse.data.user.emailAddress || 'Unknown'}`);

    } catch (error) {
      console.error('❌ Google Drive authentication failed:', error);
      this.initialized = false;

      if (error instanceof Error) {
        if (error.message.includes('invalid_grant') || error.message.includes('Invalid JWT signature')) {
          throw new Error('Google Drive authentication failed: Invalid JWT signature. Please check service account key and system clock. This can happen if your system time is incorrect or the service account key has expired.');
        } else if (error.message.includes('ENOENT') && error.message.includes('service-account-key.json')) {
          throw new Error('Service account key file not found. Please ensure service-account-key.json exists in the project root.');
        } else if (error.message.includes('403') || error.message.includes('forbidden')) {
          throw new Error('Access denied. Please check that the service account has the necessary permissions and that the Google Drive API is enabled.');
        } else if (error.message.includes('400') || error.message.includes('invalid_client')) {
          throw new Error('Invalid service account credentials. Please check the service-account-key.json file format and content.');
        } else {
          throw new Error(`Google Drive authentication failed: ${error.message}`);
        }
      }

      throw new Error('Google Drive authentication failed: Unknown error');
    }
  }

  /**
   * Main sync function - orchestrates the entire sync process
   * NEW: Focus on 24-hour changes only for efficient daily sync
   */
  async syncImages(): Promise<SyncResult> {
    // Use default 24-hour sync
    return this.syncImagesWithDateRange(1);
  }

  /**
   * Enhanced sync function with configurable date range
   * @param days - Number of days to look back for changes (default: 1 for 24-hour sync)
   * @param forceFullSync - If true, processes ALL images regardless of modification date
   */
  async syncImagesWithDateRange(days: number = 1, forceFullSync: boolean = false): Promise<SyncResult> {
    const startTime = Date.now();
    const syncType = forceFullSync ? 'FULL SYNC (all images)' : `${days}-day change detection`;
    console.log(`🚀 Starting Google Drive to Vercel Blob sync (${syncType})...`);

    const result: SyncResult = {
      processed: 0,
      uploaded: 0,
      updated: 0,
      deleted: 0,
      errors: [],
      duration: 0,
      imagesUpdated: false,
      recentChangesFound: 0
    };

    try {
      await this.initializeGoogleAuth();

      // Step 1: Fetch images from both Google Drive folders
      console.log(`📁 Fetching images from Google Drive folders (${syncType})...`);

      const mainFolderId = process.env.GOOGLE_DRIVE_MAIN_FOLDER_ID;
      const mobileFolderId = process.env.GOOGLE_DRIVE_MOBILE_FOLDER_ID;

      if (!mainFolderId || !mobileFolderId) {
        throw new Error(`Missing folder IDs - Main: ${!!mainFolderId}, Mobile: ${!!mobileFolderId}`);
      }

      const [mainImages, mobileImages] = await Promise.all([
        this.fetchDriveImagesWithDateRange(mainFolderId, false, days, forceFullSync),
        this.fetchDriveImagesWithDateRange(mobileFolderId, true, days, forceFullSync)
      ]);

      const allDriveImages = [...mainImages, ...mobileImages];
      const recentlyModifiedImages = forceFullSync
        ? allDriveImages
        : allDriveImages.filter(img => img.isRecentlyModified);

      console.log(`📊 Total Google Drive images: ${allDriveImages.length} (${mainImages.length} main, ${mobileImages.length} mobile)`);
      console.log(`📊 ${forceFullSync ? 'All images to process' : `Recently modified (${days}d)`}: ${recentlyModifiedImages.length} images`);

      // Debug: List all recent images found
      if (recentlyModifiedImages.length > 0) {
        console.log('🔍 Images to be processed:');
        recentlyModifiedImages.forEach(img => {
          console.log(`   • ${img.number}-${img.title}${img.isMobile ? '-mobile' : ''} (modified: ${img.modifiedTime})`);
        });
      }

      result.recentChangesFound = recentlyModifiedImages.length;

      // SAFETY CHECK: Ensure basic functionality even if no recent changes
      if (allDriveImages.length === 0) {
        console.warn('🚨 SAFETY CHECK: Google Drive returned 0 images. Aborting sync to prevent accidental deletions.');
        throw new Error('No images found in Google Drive folders - aborting sync for safety');
      }

      // OPTIMIZATION: If no recent changes, skip the heavy operations (unless forced)
      if (recentlyModifiedImages.length === 0 && !forceFullSync) {
        console.log(`✅ No recent changes found in last ${days} day(s) - sync complete`);
        result.duration = Date.now() - startTime;
        return result;
      }

      // Step 2: Fetch current images from Vercel Blob
      console.log('🔍 Fetching current images from Vercel Blob...');
      const blobImages = await this.fetchBlobImages();
      console.log(`📊 Current Vercel Blob images: ${blobImages.length}`);

      // Step 3: Calculate sync operations
      console.log(`🔄 Calculating sync operations for ${recentlyModifiedImages.length} images...`);
      const syncOps = forceFullSync
        ? this.calculateFullSyncOperations(allDriveImages, blobImages)
        : this.calculateChangeBasedSyncOperations(allDriveImages, recentlyModifiedImages, blobImages);

      result.processed = recentlyModifiedImages.length;

      // Step 4: Preview operations before execution
      if (syncOps.upload.length > 0) {
        console.log(`⬆️ UPLOAD PREVIEW: ${syncOps.upload.length} new images will be uploaded`);
        syncOps.upload.forEach(img => console.log(`  • ${img.number}-${img.title}${img.isMobile ? '-mobile' : ''}`));
      }
      if (syncOps.update.length > 0) {
        console.log(`🔄 UPDATE PREVIEW: ${syncOps.update.length} images will be updated`);
        syncOps.update.forEach(({ drive, blob }) =>
          console.log(`  • ${drive.number}: "${blob.title}" → "${drive.title}"`));
      }
      if (syncOps.delete.length > 0) {
        console.log(`🗑️ DELETION PREVIEW: ${syncOps.delete.length} old versions will be replaced`);
        syncOps.delete.forEach(blob => console.log(`  • ${blob.pathname}`));
      }

      // SAFETY CHECK: Prevent mass deletions
      if (syncOps.delete.length > Math.max(10, allDriveImages.length * 0.5)) {
        console.warn('🚨 SAFETY CHECK: Preventing mass deletion operation');
        throw new Error(`Safety check failed: ${syncOps.delete.length} deletions planned (max allowed: ${Math.max(10, Math.floor(allDriveImages.length * 0.5))})`);
      }

      // Step 5: Execute sync operations
      if (syncOps.upload.length > 0 || syncOps.update.length > 0 || syncOps.delete.length > 0) {
        console.log('🔄 Executing sync operations...');
        const operationResult = await this.executeSyncOperations(syncOps);
        result.uploaded = operationResult.uploaded;
        result.updated = operationResult.updated;
        result.deleted = operationResult.deleted;
        result.errors = operationResult.errors;
      } else {
        console.log('✅ No sync operations needed - all images are up to date');
      }

      // Step 6: Update constants file if images were modified
      if (result.uploaded > 0 || result.updated > 0) {
        console.log('📝 Updating images constants file...');
        result.imagesUpdated = await this.updateImagesConstants();
      }

      result.duration = Date.now() - startTime;
      console.log(`✅ Sync completed in ${result.duration}ms`);
      console.log(`📊 Summary: ${result.recentChangesFound} changes found, ${result.uploaded} uploaded, ${result.updated} updated, ${result.deleted} deleted, ${result.errors.length} errors`);

      return result;
    } catch (error) {
      result.duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(errorMessage);
      console.error('❌ Sync failed:', errorMessage);
      throw error;
    }
  }

  /**
   * Fetch images from a Google Drive folder with 24-hour change detection
   * NEW: Enhanced to check modification time and mark recent changes
   */
  private async fetchDriveImages(folderId: string, isMobile: boolean): Promise<DriveImage[]> {
    try {
      console.log(`📁 Fetching images from folder ID: ${folderId}`);

      // Calculate 24 hours ago timestamp
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const isoTimestamp = twentyFourHoursAgo.toISOString();

      console.log(`🕐 Looking for changes since: ${isoTimestamp}`);

      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'image/')`,
        fields: 'files(id,name,modifiedTime,webContentLink)',
        pageSize: 1000,
        orderBy: 'modifiedTime desc' // Get most recent first
      });

      console.log(`📊 Raw files found in folder ${folderId}:`, response.data.files?.length || 0);

      const images: DriveImage[] = [];
      let recentChanges = 0;

      for (const file of response.data.files || []) {
        if (!file.name || !file.modifiedTime || !file.id || !file.webContentLink) continue; // Skip files without required properties
        const parsed = this.parseImageName(file.name);
        if (parsed) {
          const modifiedTime = new Date(file.modifiedTime);
          const isRecentlyModified = modifiedTime > twentyFourHoursAgo;

          if (isRecentlyModified) {
            recentChanges++;
            console.log(`🆕 Recent change: ${file.name} (modified: ${modifiedTime.toISOString()})`);
          }

          images.push({
            id: file.id,
            name: file.name,
            number: parsed.number,
            title: parsed.title,
            extension: parsed.extension,
            modifiedTime: file.modifiedTime,
            webContentLink: file.webContentLink,
            isMobile: isMobile,
            isRecentlyModified
          });
        } else {
          console.log(`❌ Could not parse filename: "${file.name}"`);
        }
      }

      console.log(`📊 Folder ${folderId}: ${images.length} total images, ${recentChanges} recent changes`);
      return images.sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error(`❌ Failed to fetch images from folder ${folderId}:`, error);
      throw new Error(`Failed to fetch images from folder ${folderId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch images from a Google Drive folder with configurable date range
   * Enhanced with better debugging and flexible date range
   */
  private async fetchDriveImagesWithDateRange(
    folderId: string,
    isMobile: boolean,
    days: number = 1,
    forceFullSync: boolean = false
  ): Promise<DriveImage[]> {
    try {
      console.log(`📁 Fetching images from folder ID: ${folderId} (${isMobile ? 'mobile' : 'main'})`);

      // Calculate lookback timestamp
      const lookbackTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const isoTimestamp = lookbackTime.toISOString();

      if (forceFullSync) {
        console.log(`🕐 FULL SYNC: Processing ALL images (no date filter)`);
      } else {
        console.log(`🕐 Looking for changes since: ${isoTimestamp} (${days} day(s) ago)`);
        console.log(`🕐 Current time: ${new Date().toISOString()}`);
      }

      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'image/')`,
        fields: 'files(id,name,modifiedTime,webContentLink)',
        pageSize: 1000,
        orderBy: 'modifiedTime desc' // Get most recent first
      });

      console.log(`📊 Raw files found in folder ${folderId}:`, response.data.files?.length || 0);

      const images: DriveImage[] = [];
      let recentChanges = 0;

      for (const file of response.data.files || []) {
        if (!file.name || !file.modifiedTime || !file.id || !file.webContentLink) continue; // Skip files without required properties
        const parsed = this.parseImageName(file.name);
        if (parsed) {
          const modifiedTime = new Date(file.modifiedTime);
          const isRecentlyModified = forceFullSync || modifiedTime > lookbackTime;

          if (isRecentlyModified) {
            recentChanges++;
            console.log(`🆕 ${forceFullSync ? 'Processing' : 'Recent change'}: ${file.name} (modified: ${modifiedTime.toISOString()})`);
          } else {
            console.log(`⏭️ Skipping (too old): ${file.name} (modified: ${modifiedTime.toISOString()})`);
          }

          images.push({
            id: file.id,
            name: file.name,
            number: parsed.number,
            title: parsed.title,
            extension: parsed.extension,
            modifiedTime: file.modifiedTime,
            webContentLink: file.webContentLink,
            isMobile: isMobile,
            isRecentlyModified
          });
        } else {
          console.log(`❌ Could not parse filename: "${file.name}"`);
        }
      }

      console.log(`📊 Folder ${folderId}: ${images.length} total images, ${recentChanges} ${forceFullSync ? 'to process' : 'recent changes'}`);
      return images.sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error(`❌ Failed to fetch images from folder ${folderId}:`, error);
      throw new Error(`Failed to fetch images from folder ${folderId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse image name to extract number, title, extension, and mobile flag
   * Handles both Drive format: "123-Some-Title-Name.jpg" or "123-Some-Title-Name-mobile.jpg"
   * And Vercel Blob format: "images/123-Some-Title-Name-HASH.jpg"
   * 
   * CRITICAL: Ensures proper mobile/desktop distinction:
   * - Desktop images: "123-Title-Name" (no -mobile suffix)
   * - Mobile images: "123-Title-Name-mobile" (with -mobile suffix)
   */
  private parseImageName(fileName: string): { number: number; title: string; extension: string; isMobile: boolean } | null {
    // Remove path prefix if present (e.g., "images/")
    const cleanFileName = fileName.replace(/^.*\//, '');

    // Pattern to match: {number}-{title}[-optional-hash].{extension}
    // This handles both Drive files and Vercel blob files with hashes
    const match = cleanFileName.match(/^(\d+)-(.+?)(?:-[a-zA-Z0-9]{26,})?\.([a-zA-Z0-9]+)$/);

    if (!match) {
      return null;
    }

    const [, numberStr, title, extension] = match;
    const number = parseInt(numberStr, 10);

    if (isNaN(number)) {
      return null;
    }

    // FIXED: Precise mobile detection - ONLY check for exact "-mobile" suffix
    const isMobile = title.toLowerCase().endsWith('-mobile');

    // IMPORTANT: Keep the title AS-IS for desktop images, remove -mobile suffix ONLY for mobile images
    // This ensures we maintain the distinction between:
    // - Desktop: "Title-Name" → cleanTitle = "Title-Name", isMobile = false
    // - Mobile: "Title-Name-mobile" → cleanTitle = "Title-Name", isMobile = true
    const cleanTitle = isMobile ? title.replace(/-mobile$/i, '').trim() : title;

    return {
      number,
      title: cleanTitle,
      extension: extension.toLowerCase(),
      isMobile
    };
  }

  /**
   * Fetch current images from Vercel Blob
   */
  private async fetchBlobImages(): Promise<BlobImage[]> {
    try {
      const { blobs } = await list();

      return blobs.map(blob => {
        // Handle the "images/" prefix that exists in blob but not in Google Drive
        let fileNameToParse = blob.pathname;
        if (fileNameToParse.startsWith('images/')) {
          fileNameToParse = fileNameToParse.substring('images/'.length);
        }

        const parsed = this.parseImageName(fileNameToParse);

        return {
          url: blob.url,
          pathname: blob.pathname,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
          number: parsed?.number,
          title: parsed?.title,
          isMobile: parsed?.isMobile
        };
      }).filter(blob => blob.number !== undefined); // Only include parsed images
    } catch (error) {
      console.error('❌ Failed to fetch Vercel Blob images:', error);
      return [];
    }
  }

  /**
   * Calculate sync operations based on recent changes (24-hour focus)
   * NEW: More precise logic focusing on recently modified files
   */
  private calculateChangeBasedSyncOperations(
    allDriveImages: DriveImage[],
    recentlyModified: DriveImage[],
    blobImages: BlobImage[]
  ): SyncOperations {
    const operations: SyncOperations = {
      upload: [],
      update: [],
      delete: []
    };

    // Create composite key: "number:mobile" or "number:desktop"
    const getCompositeKey = (number: number, isMobile: boolean): string => {
      return `${number}:${isMobile ? 'mobile' : 'desktop'}`;
    };

    // Create maps for efficient lookups
    const blobByCompositeKey = new Map<string, BlobImage>();
    blobImages.forEach(blob => {
      if (blob.number !== undefined) {
        const key = getCompositeKey(blob.number, blob.isMobile || false);
        blobByCompositeKey.set(key, blob);
      }
    });

    // Process ONLY recently modified images
    for (const driveImg of recentlyModified) {
      const compositeKey = getCompositeKey(driveImg.number, driveImg.isMobile);
      const existingBlob = blobByCompositeKey.get(compositeKey);

      if (!existingBlob) {
        // New image - upload
        operations.upload.push(driveImg);
        console.log(`📤 New image detected: ${driveImg.number}-${driveImg.title}${driveImg.isMobile ? '-mobile' : ''}`);
      } else {
        // Existing image with recent changes - update
        operations.update.push({ drive: driveImg, blob: existingBlob });
        console.log(`🔄 Updated image detected: ${driveImg.number} (${existingBlob.title} → ${driveImg.title})`);

        // Mark old blob for deletion (it will be replaced)
        operations.delete.push(existingBlob);
      }
    }

    console.log(`📋 Change-based sync operations: ${operations.upload.length} upload, ${operations.update.length} update, ${operations.delete.length} replace`);

    return operations;
  }

  /**
   * Calculate sync operations for a full sync (all images)
   */
  private calculateFullSyncOperations(
    allDriveImages: DriveImage[],
    blobImages: BlobImage[]
  ): SyncOperations {
    const operations: SyncOperations = {
      upload: [],
      update: [],
      delete: []
    };

    // Create composite key: "number:mobile" or "number:desktop"
    const getCompositeKey = (number: number, isMobile: boolean): string => {
      return `${number}:${isMobile ? 'mobile' : 'desktop'}`;
    };

    // Create maps for efficient lookups
    const blobByCompositeKey = new Map<string, BlobImage>();
    blobImages.forEach(blob => {
      if (blob.number !== undefined) {
        const key = getCompositeKey(blob.number, blob.isMobile || false);
        blobByCompositeKey.set(key, blob);
      }
    });

    // Process ALL drive images
    for (const driveImg of allDriveImages) {
      const compositeKey = getCompositeKey(driveImg.number, driveImg.isMobile);
      const existingBlob = blobByCompositeKey.get(compositeKey);

      if (!existingBlob) {
        // New image - upload
        operations.upload.push(driveImg);
        console.log(`📤 New image detected: ${driveImg.number}-${driveImg.title}${driveImg.isMobile ? '-mobile' : ''}`);
      } else {
        // Check if title has changed (indicating update needed)
        if (existingBlob.title !== driveImg.title) {
          operations.update.push({ drive: driveImg, blob: existingBlob });
          console.log(`🔄 Title change detected: ${driveImg.number} (${existingBlob.title} → ${driveImg.title})`);
          // Mark old blob for deletion (it will be replaced)
          operations.delete.push(existingBlob);
        } else {
          console.log(`✓ No change needed: ${driveImg.number}-${driveImg.title}${driveImg.isMobile ? '-mobile' : ''}`);
        }
      }
    }

    console.log(`📋 Full sync operations: ${operations.upload.length} upload, ${operations.update.length} update, ${operations.delete.length} replace`);

    return operations;
  }

  /**
   * Execute sync operations efficiently
   */
  private async executeSyncOperations(operations: SyncOperations) {
    const result = { uploaded: 0, updated: 0, deleted: 0, errors: [] as string[] };

    // Delete old blobs first (for updates)
    for (const blobToDelete of operations.delete) {
      try {
        await del(blobToDelete.url);
        result.deleted++;
        console.log(`🗑️ Deleted old version: ${blobToDelete.pathname}`);
      } catch (error) {
        const errorMsg = `Failed to delete ${blobToDelete.pathname}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    // Upload new images
    for (const driveImg of operations.upload) {
      try {
        await this.uploadImageToBlobWithHash(driveImg);
        result.uploaded++;
        console.log(`⬆️ Uploaded: ${driveImg.name}`);
      } catch (error) {
        const errorMsg = `Failed to upload ${driveImg.name}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    // Upload updated images (delete old was already done above)
    for (const { drive: driveImg } of operations.update) {
      try {
        await this.uploadImageToBlobWithHash(driveImg);
        result.updated++;
        console.log(`🔄 Updated: ${driveImg.name}`);
      } catch (error) {
        const errorMsg = `Failed to update ${driveImg.name}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    return result;
  }

  /**
   * Upload a single image from Google Drive to Vercel Blob with proper hash generation
   * CRITICAL: Maintains mobile/desktop distinction in blob paths:
   * - Desktop: "images/123-Title-Name-HASH.ext"  
   * - Mobile: "images/123-Title-Name-mobile-HASH.ext"
   */
  private async uploadImageToBlobWithHash(driveImg: DriveImage): Promise<void> {
    try {
      // Get image data from Google Drive
      const response = await this.drive.files.get({
        fileId: driveImg.id,
        alt: 'media'
      }, { responseType: 'stream' });

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of response.data) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Generate Vercel-style hash (26 characters, alphanumeric)
      const hash = crypto.randomBytes(13).toString('base64')
        .replace(/[+/=]/g, '')
        .substring(0, 26)
        .replace(/[^a-zA-Z0-9]/g, x => String.fromCharCode(97 + (x.charCodeAt(0) % 26)));

      // CRITICAL: Proper mobile/desktop path generation
      // - Desktop: driveImg.title (already clean, no -mobile suffix)
      // - Mobile: driveImg.title + "-mobile" (since clean title had -mobile removed during parsing)
      const titleWithMobile = driveImg.isMobile ? `${driveImg.title}-mobile` : driveImg.title;
      const fileName = `images/${driveImg.number}-${titleWithMobile}-${hash}.${driveImg.extension}`;

      console.log(`⬆️ Uploading ${driveImg.isMobile ? 'mobile' : 'desktop'} version: ${fileName}`);

      await put(fileName, buffer, {
        access: 'public',
        contentType: `image/${driveImg.extension === 'jpg' ? 'jpeg' : driveImg.extension}`
      });

      console.log(`✅ Successfully uploaded with hash: ${fileName}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${driveImg.name}:`, error);
      throw error;
    }
  }

  /**
   * Update the images constants file with current state
   */
  private async updateImagesConstants(): Promise<boolean> {
    try {
      const updater = new ImagesConstantsUpdater();
      const result = await updater.updateConstants();

      if (result.errors.length > 0) {
        console.warn('⚠️ Some errors occurred during constants update:', result.errors);
      }

      if (result.updated) {
        console.log(`✅ Successfully updated images.ts with ${result.newMappings} path updates (variable names preserved)`);
      } else {
        console.log('📄 No path changes needed in images.ts');
      }

      return result.updated;
    } catch (error) {
      console.error('❌ Failed to update images constants:', error);
      return false;
    }
  }
}