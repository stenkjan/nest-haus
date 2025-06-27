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
      this.initialized = true;
      
      console.log('🔐 Google Drive authentication initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive auth:', error);
      throw new Error('Google Drive authentication failed');
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

      // Step 2: Get current Vercel Blob images
      console.log('☁️ Fetching current Vercel Blob images...');
      const blobImages = await this.fetchBlobImages();
      console.log(`📊 Found ${blobImages.length} images in Vercel Blob`);

      // Step 3: Smart sync - handle duplicates and updates
      console.log('🔄 Processing sync operations...');
      const syncOps = this.calculateSyncOperations(allDriveImages, blobImages);
      
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
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'image/')`,
        fields: 'files(id,name,modifiedTime,webContentLink)',
        pageSize: 1000 // Get all images in one request
      });

      const images: DriveImage[] = [];
      
      for (const file of response.data.files || []) {
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
        }
      }

      return images.sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error(`❌ Failed to fetch images from folder ${folderId}:`, error);
      return [];
    }
  }

  /**
   * Parse image name to extract number, title, and extension
   * Format: "123 - Some Title Name.jpg"
   */
  private parseImageName(fileName: string): { number: number; title: string; extension: string } | null {
    const match = fileName.match(/^(\d+)\s*-\s*(.+)\.([a-zA-Z0-9]+)$/);
    if (!match) return null;

    const [, numberStr, title, extension] = match;
    const number = parseInt(numberStr, 10);
    
    if (isNaN(number)) return null;

    return {
      number,
      title: title.trim(),
      extension: extension.toLowerCase()
    };
  }

  /**
   * Fetch current images from Vercel Blob
   */
  private async fetchBlobImages(): Promise<BlobImage[]> {
    try {
      const { blobs } = await list();
      
      return blobs.map(blob => {
        const parsed = this.parseImageName(blob.pathname);
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

      // Upload to Vercel Blob with consistent naming
      const fileName = `${driveImg.number}-${driveImg.title}.${driveImg.extension}`;
      
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