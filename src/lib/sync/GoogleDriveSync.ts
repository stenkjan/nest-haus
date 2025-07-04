/**
 * GoogleDriveSync - Efficient Google Drive to Vercel Blob Synchronization
 * 
 * Features:
 * - Smart duplicate handling (Drive title wins, number-based priority)
 * - Efficient batch operations (minimal API calls)
 * - Auto-updates images.ts constants
 * - Easy to remove/deconstruct
 * 
 * Daily sync: Drive → Blob → Update Constants
 */

import { google } from 'googleapis';
import { put, list, del } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

// Types
export interface DriveImage {
  id: string;
  name: string;
  number: number;
  title: string;
  extension: string;
  modifiedTime: string;
  webContentLink: string;
}

export interface BlobImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
  number?: number;
  title?: string;
}

export interface SyncResult {
  processed: number;
  uploaded: number;
  updated: number;
  deleted: number;
  errors: string[];
  duration: number;
  imagesUpdated: boolean;
}

export class GoogleDriveSync {
  private drive: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  private initialized = false;

  constructor() {
    this.initializeGoogleAuth();
  }

  /**
   * Initialize Google Drive API with service account
   */
  private async initializeGoogleAuth() {
    try {
      const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json');
      const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));

      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
      });

      this.drive = google.drive({ version: 'v3', auth });
      
      // Test the authentication by making a simple API call
      console.log('🔐 Testing Google Drive authentication...');
      await this.drive.about.get({ fields: 'user' });
      
      this.initialized = true;
      console.log('🔐 Google Drive authentication initialized and tested successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive auth:', error);
      if (error instanceof Error) {
        if (error.message.includes('invalid_grant')) {
          throw new Error('Google Drive authentication failed: Invalid JWT signature. Please check service account key and system clock.');
        } else if (error.message.includes('ENOENT')) {
          throw new Error('Google Drive authentication failed: service-account-key.json not found.');
        } else {
          throw new Error(`Google Drive authentication failed: ${error.message}`);
        }
      }
      throw new Error('Google Drive authentication failed with unknown error');
    }
  }

  /**
   * Main sync function - orchestrates the entire sync process
   */
  async syncImages(): Promise<SyncResult> {
    const startTime = Date.now();
    console.log('🚀 Starting Google Drive to Vercel Blob sync...');

    const result: SyncResult = {
      processed: 0,
      uploaded: 0,
      updated: 0,
      deleted: 0,
      errors: [],
      duration: 0,
      imagesUpdated: false
    };

    try {
      if (!this.initialized) {
        await this.initializeGoogleAuth();
      }

      // Step 1: Fetch images from both Google Drive folders
      console.log('📁 Fetching images from Google Drive folders...');
      const [mainImages, mobileImages] = await Promise.all([
        this.fetchDriveImages(process.env.GOOGLE_DRIVE_MAIN_FOLDER_ID!),
        this.fetchDriveImages(process.env.GOOGLE_DRIVE_MOBILE_FOLDER_ID!)
      ]);

      const allDriveImages = [...mainImages, ...mobileImages];
      result.processed = allDriveImages.length;
      console.log(`📊 Found ${allDriveImages.length} images in Google Drive`);

      // SAFETY CHECK 1: Never proceed with deletions if Google Drive returns 0 images
      if (allDriveImages.length === 0) {
        console.log('⚠️ SAFETY CHECK 1 FAILED: Google Drive returned 0 images.');
        console.log('⚠️ This might be due to authentication issues or API problems.');
        console.log('⚠️ Aborting sync to prevent accidental deletion of blob images.');
        result.errors.push('Google Drive returned 0 images - possible authentication issue');
        result.duration = Date.now() - startTime;
        return result;
      }

      // SAFETY CHECK 2: Require minimum number of images (at least 50 images expected)
      const MIN_EXPECTED_IMAGES = 50;
      if (allDriveImages.length < MIN_EXPECTED_IMAGES) {
        console.log(`⚠️ SAFETY CHECK 2 FAILED: Only ${allDriveImages.length} images found in Google Drive.`);
        console.log(`⚠️ Expected at least ${MIN_EXPECTED_IMAGES} images.`);
        console.log('⚠️ This might indicate a sync issue. Aborting to prevent accidental deletions.');
        result.errors.push(`Only ${allDriveImages.length} images found, expected at least ${MIN_EXPECTED_IMAGES}`);
        result.duration = Date.now() - startTime;
        return result;
      }

      // Step 2: Get current Vercel Blob images
      console.log('☁️ Fetching current Vercel Blob images...');
      const blobImages = await this.fetchBlobImages();
      console.log(`📊 Found ${blobImages.length} images in Vercel Blob`);

      // SAFETY CHECK 3: If we have existing blob images, ensure Drive has at least 80% of them
      if (blobImages.length > 0) {
        const minExpectedFromDrive = Math.floor(blobImages.length * 0.8);
        if (allDriveImages.length < minExpectedFromDrive) {
          console.log(`⚠️ SAFETY CHECK 3 FAILED: Drive has ${allDriveImages.length} images but blob has ${blobImages.length}.`);
          console.log(`⚠️ Expected at least ${minExpectedFromDrive} images from Drive (80% of existing blob images).`);
          console.log('⚠️ This suggests Drive sync is incomplete. Aborting to prevent data loss.');
          result.errors.push(`Drive has ${allDriveImages.length} images but blob has ${blobImages.length} - seems incomplete`);
          result.duration = Date.now() - startTime;
          return result;
        }
      }

      // Step 3: Smart sync - handle duplicates and updates
      console.log('🔄 Processing sync operations...');
      const syncOps = this.calculateSyncOperations(allDriveImages, blobImages);
      
      // SAFETY CHECK 4: Don't delete more than 25% of existing images in one sync (reduced from 50%)
      const MAX_DELETION_PERCENTAGE = 0.25;
      if (syncOps.delete.length > blobImages.length * MAX_DELETION_PERCENTAGE) {
        console.log(`⚠️ SAFETY CHECK 4 FAILED: Sync wants to delete ${syncOps.delete.length} of ${blobImages.length} images (>${MAX_DELETION_PERCENTAGE * 100}%).`);
        console.log('⚠️ This seems excessive. Aborting sync for safety.');
        result.errors.push(`Attempted to delete ${syncOps.delete.length} of ${blobImages.length} images - exceeds ${MAX_DELETION_PERCENTAGE * 100}% limit`);
        result.duration = Date.now() - startTime;
        return result;
      }

      // SAFETY CHECK 5: Don't delete more than 10 images in a single sync
      const MAX_DELETIONS_PER_SYNC = 10;
      if (syncOps.delete.length > MAX_DELETIONS_PER_SYNC) {
        console.log(`⚠️ SAFETY CHECK 5 FAILED: Sync wants to delete ${syncOps.delete.length} images.`);
        console.log(`⚠️ Maximum allowed deletions per sync: ${MAX_DELETIONS_PER_SYNC}.`);
        console.log('⚠️ This prevents accidental bulk deletions. Aborting sync.');
        result.errors.push(`Attempted to delete ${syncOps.delete.length} images - exceeds limit of ${MAX_DELETIONS_PER_SYNC} per sync`);
        result.duration = Date.now() - startTime;
        return result;
      }

      // SAFETY CHECK 6: Log what will be deleted for transparency
      if (syncOps.delete.length > 0) {
        console.log(`🚨 DELETION PREVIEW: The following ${syncOps.delete.length} images will be deleted:`);
        syncOps.delete.forEach((blob: BlobImage, index: number) => {
          console.log(`  ${index + 1}. ${blob.pathname} (Number: ${blob.number})`);
        });
        console.log('🚨 These images exist in Vercel Blob but not in Google Drive');
      }

      // All safety checks passed - proceed with sync
      console.log('✅ All safety checks passed. Proceeding with sync...');
      
      // Step 4: Execute sync operations efficiently
      const opResults = await this.executeSyncOperations(syncOps);
      result.uploaded = opResults.uploaded;
      result.updated = opResults.updated;
      result.deleted = opResults.deleted;
      result.errors = opResults.errors;

      // Step 5: Update images.ts constants if needed
      if (result.uploaded > 0 || result.updated > 0 || result.deleted > 0) {
        console.log('📝 Updating images.ts constants...');
        result.imagesUpdated = await this.updateImagesConstants();
      }

      result.duration = Date.now() - startTime;
      console.log(`✅ Sync completed in ${result.duration}ms`);
      console.log(`📊 Results: ${result.uploaded} uploaded, ${result.updated} updated, ${result.deleted} deleted`);
      
      return result;

    } catch (error) {
      console.error('❌ Sync failed:', error);
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.duration = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Fetch images from a Google Drive folder
   */
  private async fetchDriveImages(folderId: string): Promise<DriveImage[]> {
    try {
      console.log(`📁 Fetching images from folder ID: ${folderId}`);
      
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'image/')`,
        fields: 'files(id,name,modifiedTime,webContentLink)',
        pageSize: 1000 // Get all images in one request
      });

      console.log(`📊 Raw files found in folder ${folderId}:`, response.data.files?.length || 0);
      
      // Log all files found (for debugging)
      if (response.data.files && response.data.files.length > 0) {
        console.log(`📄 Files in folder ${folderId}:`);
        response.data.files.forEach((file: any, index: number) => {
          console.log(`  ${index + 1}. "${file.name}" (ID: ${file.id})`);
        });
      } else {
        console.log(`⚠️ No files found in folder ${folderId}`);
      }

      const images: DriveImage[] = [];
      
      for (const file of response.data.files || []) {
        console.log(`🔍 Parsing filename: "${file.name}"`);
        const parsed = this.parseImageName(file.name);
        if (parsed) {
          images.push({
            id: file.id,
            name: file.name,
            number: parsed.number,
            title: parsed.title,
            extension: parsed.extension,
            modifiedTime: file.modifiedTime,
            webContentLink: file.webContentLink
          });
          console.log(`✅ Successfully parsed: Number ${parsed.number}, Title: "${parsed.title}"`);
        } else {
          console.log(`❌ Could not parse filename: "${file.name}" (doesn't match pattern: NUMBER-TITLE.EXT or NUMBER-TITLE-HASH.EXT)`);
        }
      }

      console.log(`📊 Successfully parsed ${images.length} images from folder ${folderId}`);
      return images.sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error(`❌ Failed to fetch images from folder ${folderId}:`, error);
      if (error instanceof Error) {
        if (error.message.includes('invalid_grant')) {
          throw new Error(`Google Drive authentication failed for folder ${folderId}: Invalid JWT signature. Please check service account key and system clock.`);
        } else if (error.message.includes('forbidden') || error.message.includes('access')) {
          throw new Error(`Access denied to Google Drive folder ${folderId}. Please check folder permissions for the service account.`);
        } else {
          throw new Error(`Failed to fetch images from folder ${folderId}: ${error.message}`);
        }
      }
      throw new Error(`Failed to fetch images from folder ${folderId}: Unknown error`);
    }
  }

  /**
   * Parse image name to extract number, title, and extension
   * Handles both Drive format: "123-Some-Title-Name.jpg" 
   * And Vercel Blob format: "images/123-Some-Title-Name-HASH.jpg"
   */
  private parseImageName(fileName: string): { number: number; title: string; extension: string } | null {
    console.log(`🔍 Parsing filename: "${fileName}"`);
    
    // Remove path prefix if present (e.g., "images/")
    const cleanFileName = fileName.replace(/^.*\//, '');
    
    // Pattern to match: {number}-{title}[-optional-hash].{extension}
    // This handles both Drive files and Vercel blob files with hashes
    const match = cleanFileName.match(/^(\d+)-(.+?)(?:-[a-zA-Z0-9]{26,})?\.([a-zA-Z0-9]+)$/);
    
    if (!match) {
      console.log(`❌ No match for pattern ^(\\d+)-(.+?)(?:-[a-zA-Z0-9]{26,})?\\.([a-zA-Z0-9]+)$ in: "${fileName}"`);
      return null;
    }

    const [, numberStr, title, extension] = match;
    const number = parseInt(numberStr, 10);
    
    if (isNaN(number)) {
      console.log(`❌ Invalid number parsed from "${numberStr}" in filename: "${fileName}"`);
      return null;
    }

    const result = {
      number,
      title: title.trim(),
      extension: extension.toLowerCase()
    };
    
    console.log(`✅ Successfully parsed: ${JSON.stringify(result)}`);
    return result;
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
        
        console.log(`🔍 Parsing filename: "${blob.pathname}"`);
        const parsed = this.parseImageName(fileNameToParse);
        
        return {
          url: blob.url,
          pathname: blob.pathname,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
          number: parsed?.number,
          title: parsed?.title
        };
      }).filter(blob => blob.number !== undefined); // Only include parsed images
    } catch (error) {
      console.error('❌ Failed to fetch Vercel Blob images:', error);
      return [];
    }
  }

  /**
   * Calculate what sync operations need to be performed
   */
  private calculateSyncOperations(driveImages: DriveImage[], blobImages: BlobImage[]) {
    const operations = {
      upload: [] as DriveImage[],
      update: [] as { drive: DriveImage; blob: BlobImage }[],
      delete: [] as BlobImage[]
    };

    // Create maps for efficient lookups
    const blobByNumber = new Map<number, BlobImage>();
    blobImages.forEach(blob => {
      if (blob.number) blobByNumber.set(blob.number, blob);
    });

    const driveByNumber = new Map<number, DriveImage>();
    driveImages.forEach(img => driveByNumber.set(img.number, img));

    // Process drive images
    for (const driveImg of driveImages) {
      const existingBlob = blobByNumber.get(driveImg.number);
      
      if (!existingBlob) {
        // New image - upload
        operations.upload.push(driveImg);
      } else if (existingBlob.title !== driveImg.title) {
        // Title changed - update (Drive title wins)
        operations.update.push({ drive: driveImg, blob: existingBlob });
      }
    }

    // Process blob images that no longer exist in drive
    for (const blobImg of blobImages) {
      if (blobImg.number && !driveByNumber.has(blobImg.number)) {
        operations.delete.push(blobImg);
      }
    }

    console.log(`📋 Sync operations: ${operations.upload.length} upload, ${operations.update.length} update, ${operations.delete.length} delete`);
    return operations;
  }

  /**
   * Execute sync operations efficiently
   */
  private async executeSyncOperations(operations: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const result = { uploaded: 0, updated: 0, deleted: 0, errors: [] as string[] };

    // Delete old blobs first
    for (const blobToDelete of operations.delete) {
      try {
        await del(blobToDelete.url);
        result.deleted++;
        console.log(`🗑️ Deleted: ${blobToDelete.pathname}`);
      } catch (error) {
        const errorMsg = `Failed to delete ${blobToDelete.pathname}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    // Upload new images
    for (const driveImg of operations.upload) {
      try {
        await this.uploadImageToBlob(driveImg);
        result.uploaded++;
        console.log(`⬆️ Uploaded: ${driveImg.name}`);
      } catch (error) {
        const errorMsg = `Failed to upload ${driveImg.name}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    // Update existing images (delete old, upload new)
    for (const { drive: driveImg, blob: oldBlob } of operations.update) {
      try {
        // Delete old version
        await del(oldBlob.url);
        // Upload new version
        await this.uploadImageToBlob(driveImg);
        result.updated++;
        console.log(`🔄 Updated: ${driveImg.name} (was: ${oldBlob.title})`);
      } catch (error) {
        const errorMsg = `Failed to update ${driveImg.name}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    return result;
  }

  /**
   * Upload a single image from Google Drive to Vercel Blob
   */
  private async uploadImageToBlob(driveImg: DriveImage): Promise<void> {
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

      // Upload to Vercel Blob with consistent naming (matches constants format)
      // Use "images/" prefix for consistency with existing blob structure
      const fileName = `images/${driveImg.number}-${driveImg.title}.${driveImg.extension}`;
      console.log(`⬆️ Uploading to blob: ${fileName}`);
      
      await put(fileName, buffer, {
        access: 'public',
        contentType: `image/${driveImg.extension}`
      });
      
    } catch (error) {
      console.error(`❌ Upload failed for ${driveImg.name}:`, error);
      throw error;
    }
  }

  /**
   * Update images.ts constants with new paths
   */
  private async updateImagesConstants(): Promise<boolean> {
    try {
      const { ImagesConstantsUpdater } = await import('./ImagesConstantsUpdater');
      const updater = new ImagesConstantsUpdater();
      
      const result = await updater.updateConstants();
      
      if (result.errors.length > 0) {
        console.warn('⚠️ Some errors occurred during constants update:', result.errors);
      }
      
      if (result.updated) {
        console.log(`✅ Successfully updated images.ts with ${result.newMappings} new mappings`);
      }
      
      return result.updated;
    } catch (error) {
      console.error('❌ Failed to update images.ts:', error);
      return false;
    }
  }
} 