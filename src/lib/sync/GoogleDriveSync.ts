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
}

// Google Drive API response types
interface DriveFileResponse {
  id: string;
  name: string;
  modifiedTime: string;
  webContentLink: string;
}

interface SyncOperations {
  upload: DriveImage[];
  update: Array<{ drive: DriveImage; blob: BlobImage }>;
  delete: BlobImage[];
}

export class GoogleDriveSync {
  private drive: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
      await this.initializeGoogleAuth();

      // Step 1: Fetch images from both Google Drive folders
      console.log('📁 Fetching images from Google Drive folders...');
      const [mainImages, mobileImages] = await Promise.all([
        this.fetchDriveImages(process.env.GOOGLE_DRIVE_MAIN_FOLDER_ID!, false),
        this.fetchDriveImages(process.env.GOOGLE_DRIVE_MOBILE_FOLDER_ID!, true)
      ]);

      const allDriveImages = [...mainImages, ...mobileImages];
      console.log(`📊 Total Google Drive images found: ${allDriveImages.length} (${mainImages.length} main, ${mobileImages.length} mobile)`);

      // CRITICAL SAFETY CHECK: Prevent sync if Google Drive returns no images
      if (allDriveImages.length === 0) {
        console.warn('🚨 SAFETY CHECK: Google Drive returned 0 images. Aborting sync to prevent accidental deletions.');
        throw new Error('No images found in Google Drive folders - aborting sync for safety');
      }

      // NEW SAFETY CHECK: Minimum images threshold
      const MIN_IMAGES_THRESHOLD = 50; // Adjust based on your expected image count
      if (allDriveImages.length < MIN_IMAGES_THRESHOLD) {
        console.warn(`🚨 SAFETY CHECK: Only ${allDriveImages.length} images found in Google Drive (expected at least ${MIN_IMAGES_THRESHOLD}). This could indicate an API issue.`);
        throw new Error(`Insufficient images in Google Drive (${allDriveImages.length} < ${MIN_IMAGES_THRESHOLD}) - aborting sync for safety`);
      }

      // Step 2: Fetch current images from Vercel Blob
      console.log('🔍 Fetching current images from Vercel Blob...');
      const blobImages = await this.fetchBlobImages();
      console.log(`📊 Current Vercel Blob images: ${blobImages.length}`);

      // NEW SAFETY CHECK: Consistency check with existing blob images
      if (blobImages.length > 0) {
        const consistencyRatio = allDriveImages.length / blobImages.length;
        if (consistencyRatio < 0.8) { // Drive should have at least 80% of blob images
          console.warn(`🚨 SAFETY CHECK: Drive images (${allDriveImages.length}) significantly fewer than blob images (${blobImages.length}). Ratio: ${consistencyRatio.toFixed(2)}`);
          throw new Error('Drive/Blob consistency check failed - aborting sync for safety');
        }
      }

      // Step 3: Calculate sync operations
      console.log('🔄 Calculating sync operations...');
      const syncOps = this.calculateSyncOperations(allDriveImages, blobImages);
      result.processed = allDriveImages.length;

      // ENHANCED SAFETY CHECK: Limit deletion percentage
      const MAX_DELETION_PERCENTAGE = 0.25; // Never delete more than 25% of images
      if (blobImages.length > 0 && syncOps.delete.length > blobImages.length * MAX_DELETION_PERCENTAGE) {
        console.warn(`🚨 SAFETY CHECK: Attempting to delete ${syncOps.delete.length} images (${(syncOps.delete.length / blobImages.length * 100).toFixed(1)}%) which exceeds ${MAX_DELETION_PERCENTAGE * 100}% safety limit`);
        throw new Error(`Deletion percentage too high (${(syncOps.delete.length / blobImages.length * 100).toFixed(1)}%) - aborting sync for safety`);
      }

      // Step 4: Preview operations before execution
      if (syncOps.upload.length > 0) {
        console.log(`⬆️ UPLOAD PREVIEW: ${syncOps.upload.length} new images will be uploaded`);
      }
      if (syncOps.update.length > 0) {
        console.log(`🔄 UPDATE PREVIEW: ${syncOps.update.length} images will be updated`);
      }
      if (syncOps.delete.length > 0) {
        console.log(`🚨 DELETION PREVIEW: The following ${syncOps.delete.length} images will be deleted:`);
        syncOps.delete.forEach((blob: BlobImage, index: number) => {
          console.log(`  ${index + 1}. ${blob.pathname} (Number: ${blob.number})`);
        });
        console.log('🚨 These images exist in Vercel Blob but not in Google Drive');
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
      if (result.uploaded > 0 || result.updated > 0 || result.deleted > 0) {
        console.log('📝 Updating images constants file...');
        result.imagesUpdated = await this.updateImagesConstants();
      }

      result.duration = Date.now() - startTime;
      console.log(`✅ Sync completed in ${result.duration}ms`);
      console.log(`📊 Summary: ${result.uploaded} uploaded, ${result.updated} updated, ${result.deleted} deleted, ${result.errors.length} errors`);

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
   * Fetch images from a Google Drive folder
   */
  private async fetchDriveImages(folderId: string, isMobile: boolean): Promise<DriveImage[]> {
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
        response.data.files.forEach((file: DriveFileResponse, index: number) => {
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
            webContentLink: file.webContentLink,
            isMobile: isMobile
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
   * Parse image name to extract number, title, extension, and mobile flag
   * Handles both Drive format: "123-Some-Title-Name.jpg" or "123-Some-Title-Name-mobile.jpg"
   * And Vercel Blob format: "images/123-Some-Title-Name-HASH.jpg"
   */
  private parseImageName(fileName: string): { number: number; title: string; extension: string; isMobile: boolean } | null {
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

    // Check if this is a mobile version
    const isMobile = title.toLowerCase().includes('mobile');
    // Remove 'mobile' suffix from title for consistency
    const cleanTitle = title.replace(/-mobile$/i, '').trim();

    const result = {
      number,
      title: cleanTitle,
      extension: extension.toLowerCase(),
      isMobile
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
   * Calculate what sync operations need to be performed
   * CONSERVATIVE APPROACH: Only delete images that are clearly outdated
   * Uses composite key (number + mobile flag) to properly handle mobile vs desktop versions
   */
  private calculateSyncOperations(driveImages: DriveImage[], blobImages: BlobImage[]): SyncOperations {
    const operations: SyncOperations = {
      upload: [],
      update: [],
      delete: []
    };

    // Create composite key: "number:mobile" or "number:desktop"
    const getCompositeKey = (number: number, isMobile: boolean): string => {
      return `${number}:${isMobile ? 'mobile' : 'desktop'}`;
    };

    // Create maps for efficient lookups using composite keys
    const blobByCompositeKey = new Map<string, BlobImage>();
    blobImages.forEach(blob => {
      if (blob.number !== undefined) {
        const key = getCompositeKey(blob.number, blob.isMobile || false);
        blobByCompositeKey.set(key, blob);
      }
    });

    const driveByCompositeKey = new Map<string, DriveImage>();
    driveImages.forEach(img => {
      const key = getCompositeKey(img.number, img.isMobile);
      driveByCompositeKey.set(key, img);
    });

    // Process drive images
    for (const driveImg of driveImages) {
      const compositeKey = getCompositeKey(driveImg.number, driveImg.isMobile);
      const existingBlob = blobByCompositeKey.get(compositeKey);
      
      if (!existingBlob) {
        // New image - upload
        operations.upload.push(driveImg);
        console.log(`📤 New image to upload: ${driveImg.number}-${driveImg.title}${driveImg.isMobile ? '-mobile' : ''}`);
      } else if (existingBlob.title !== driveImg.title) {
        // Title changed - update (Drive title wins)
        operations.update.push({ drive: driveImg, blob: existingBlob });
        console.log(`🔄 Image to update: ${driveImg.number}-${driveImg.title}${driveImg.isMobile ? '-mobile' : ''}`);
      }
    }

    // CONSERVATIVE DELETION: Only delete blobs that are clearly outdated
    // Preserve mobile images, animations, and special cases
    const protectedPatterns = [
      /mobile/i,           // Mobile versions
      /animation/i,        // Animation videos
      /intro/i,           // Intro animations
      /abschluss/i,       // End animations
      /transport/i,       // Transport animations
      /mobil/i,           // Mobile versions (German)
      /pv/i,              // Photovoltaic images
      /homebutton/i       // Home button
    ];

    for (const blobImg of blobImages) {
      if (blobImg.number !== undefined) {
        const compositeKey = getCompositeKey(blobImg.number, blobImg.isMobile || false);
        
        if (!driveByCompositeKey.has(compositeKey)) {
          const isProtected = protectedPatterns.some(pattern => 
            pattern.test(blobImg.title || '') || 
            pattern.test(blobImg.pathname || '')
          );
          
          if (!isProtected) {
            console.log(`🤔 Considering deletion of: ${blobImg.pathname}`);
            operations.delete.push(blobImg);
          } else {
            console.log(`🛡️ Protecting: ${blobImg.pathname} (matches protection pattern)`);
          }
        }
      }
    }

    console.log(`📋 Sync operations: ${operations.upload.length} upload, ${operations.update.length} update, ${operations.delete.length} delete`);
    
    // Additional safety check: prevent deletion of critical images
    if (operations.delete.length > 10) {
      console.warn(`🚨 SAFETY CHECK: ${operations.delete.length} images scheduled for deletion - this seems excessive`);
      console.warn('🚨 Clearing deletion queue to prevent accidental data loss');
      operations.delete = [];
    }

    return operations;
  }

  /**
   * Execute sync operations efficiently
   */
  private async executeSyncOperations(operations: SyncOperations) {
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
   * Upload a single image from Google Drive to Vercel Blob
   * Preserves mobile suffix and allows Vercel to add hash automatically
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
      // For mobile images, preserve the mobile suffix
      const titleWithMobile = driveImg.isMobile ? `${driveImg.title}-mobile` : driveImg.title;
      const fileName = `images/${driveImg.number}-${titleWithMobile}.${driveImg.extension}`;
      console.log(`⬆️ Uploading to blob: ${fileName} (mobile: ${driveImg.isMobile})`);

      await put(fileName, buffer, {
        access: 'public',
        contentType: `image/${driveImg.extension === 'jpg' ? 'jpeg' : driveImg.extension}`
      });

      console.log(`✅ Successfully uploaded: ${fileName}`);
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
        console.log(`✅ Successfully updated images.ts with ${result.newMappings} new mappings`);
      } else {
        console.log('📄 No changes needed in images.ts');
      }
      
      return result.updated;
    } catch (error) {
      console.error('❌ Failed to update images constants:', error);
      return false;
    }
  }
}