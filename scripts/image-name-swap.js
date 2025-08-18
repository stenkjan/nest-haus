/**
 * Image Name Swap Script for NEST-Haus Project
 * 
 * Swaps "steirische-eiche" and "holz-natur" in image names (134-173)
 * Updates: Google Drive, Vercel Blob Storage, and images.ts constants
 * 
 * CRITICAL: Only affects images 134-173 with the specific patterns
 */

const { google } = require('googleapis');
const { put, list, del } = require('@vercel/blob');
const fs = require('fs/promises');
const path = require('path');

/**
 * ImageSwapPair structure:
 * {
 *   image1: {driveId, driveName, blobUrl, blobPathname, number},
 *   image2: {driveId, driveName, blobUrl, blobPathname, number},
 *   swapType: 'steirische-eiche' | 'holz-natur'
 * }
 * 
 * SwapResult structure:
 * {
 *   totalPairs, googleDriveSwaps, vercelBlobSwaps, imagesFileUpdated,
 *   errors: [], swappedPairs: []
 * }
 */

class ImageNameSwapper {
  constructor() {
    this.mainFolderId = process.env.GOOGLE_DRIVE_MAIN_FOLDER_ID || '';
    this.mobileFolderId = process.env.GOOGLE_DRIVE_MOBILE_FOLDER_ID || '';
    
    if (!this.mainFolderId || !this.mobileFolderId) {
      throw new Error('Missing Google Drive folder IDs in environment variables');
    }
  }

  /**
   * Main swap function
   */
  async executeSwap() {
    const result = {
      totalPairs: 0,
      googleDriveSwaps: 0,
      vercelBlobSwaps: 0,
      imagesFileUpdated: false,
      errors: [],
      swappedPairs: []
    };

    try {
      console.log('🔄 Starting image name swap operation...');
      console.log('📋 Target: Images 134-173 with "steirische-eiche" ↔ "holz-natur"');

      // Step 1: Initialize Google Drive authentication
      await this.initializeGoogleAuth();

      // Step 2: Find all target images in Google Drive
      const driveImages = await this.findTargetImages();
      console.log(`📁 Found ${driveImages.length} target images in Google Drive`);

      // Step 3: Find corresponding images in Vercel Blob
      const blobImages = await this.findTargetBlobImages();
      console.log(`💾 Found ${blobImages.length} target images in Vercel Blob`);

      // Step 4: Create swap pairs
      const swapPairs = this.createSwapPairs(driveImages, blobImages);
      console.log(`🔗 Created ${swapPairs.length} swap pairs`);
      result.totalPairs = swapPairs.length;

      if (swapPairs.length === 0) {
        console.log('⚠️ No valid swap pairs found. Exiting.');
        return result;
      }

      // Step 5: Execute swaps
      for (const pair of swapPairs) {
        try {
          console.log(`\n🔄 Processing pair ${pair.image1.number} ↔ ${pair.image2.number}`);
          
          // Swap in Google Drive
          const driveSuccess = await this.swapGoogleDriveNames(pair);
          if (driveSuccess) result.googleDriveSwaps++;

          // Swap in Vercel Blob
          const blobSuccess = await this.swapVercelBlobNames(pair);
          if (blobSuccess) result.vercelBlobSwaps++;

          result.swappedPairs.push({
            pair,
            success: driveSuccess && blobSuccess
          });

        } catch (error) {
          const errorMsg = `Failed to swap pair ${pair.image1.number} ↔ ${pair.image2.number}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error(`❌ ${errorMsg}`);
          result.errors.push(errorMsg);
          
          result.swappedPairs.push({
            pair,
            success: false,
            error: errorMsg
          });
        }
      }

      // Step 6: Update images.ts constants
      if (result.googleDriveSwaps > 0 || result.vercelBlobSwaps > 0) {
        try {
          await this.updateImagesConstants(swapPairs);
          result.imagesFileUpdated = true;
          console.log('✅ Updated images.ts constants');
        } catch (error) {
          const errorMsg = `Failed to update images.ts: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error(`❌ ${errorMsg}`);
          result.errors.push(errorMsg);
        }
      }

      // Summary
      console.log('\n📊 Swap Operation Summary:');
      console.log(`   • Total pairs processed: ${result.totalPairs}`);
      console.log(`   • Google Drive swaps: ${result.googleDriveSwaps}/${result.totalPairs}`);
      console.log(`   • Vercel Blob swaps: ${result.vercelBlobSwaps}/${result.totalPairs}`);
      console.log(`   • Images.ts updated: ${result.imagesFileUpdated ? 'Yes' : 'No'}`);
      console.log(`   • Errors: ${result.errors.length}`);

      return result;

    } catch (error) {
      console.error('❌ Fatal error during swap operation:', error);
      result.errors.push(error instanceof Error ? error.message : 'Fatal unknown error');
      return result;
    }
  }

  /**
   * Initialize Google Drive authentication
   */
  async initializeGoogleAuth() {
    try {
      let serviceAccountKey;

      if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
        const keyFile = await fs.readFile(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE, 'utf8');
        serviceAccountKey = JSON.parse(keyFile);
      } else {
        throw new Error('No Google service account credentials found');
      }

      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccountKey,
        scopes: ['https://www.googleapis.com/auth/drive']
      });

      this.drive = google.drive({ version: 'v3', auth });
      console.log('✅ Google Drive authentication initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive auth:', error);
      throw error;
    }
  }

  /**
   * Find target images (134-173) with steirische-eiche or holz-natur in Google Drive
   */
  async findTargetImages() {
    const images = [];
    
    // Search in both main and mobile folders
    const folderIds = [this.mainFolderId, this.mobileFolderId];
    
    for (const folderId of folderIds) {
      try {
        const response = await this.drive.files.list({
          q: `'${folderId}' in parents and trashed=false`,
          fields: 'files(id, name)',
          pageSize: 1000
        });

        if (response.data.files) {
          for (const file of response.data.files) {
            if (!file.name || !file.id) continue;

            // Check if image is in range 134-173 and contains target patterns
            const numberMatch = file.name.match(/^(\d+)-/);
            if (numberMatch) {
              const number = parseInt(numberMatch[1], 10);
              const nameLower = file.name.toLowerCase();
              
              if (number >= 134 && number <= 173 && 
                  (nameLower.includes('steirische-eiche') || nameLower.includes('holz-natur'))) {
                images.push({
                  id: file.id,
                  name: file.name,
                  number
                });
                console.log(`🎯 Found target: ${file.name}`);
              }
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error searching folder ${folderId}:`, error);
      }
    }

    return images.sort((a, b) => a.number - b.number);
  }

  /**
   * Find target images in Vercel Blob
   */
  async findTargetBlobImages() {
    try {
      const { blobs } = await list();
      const targetBlobs = [];

      for (const blob of blobs) {
        // Extract number from pathname
        const numberMatch = blob.pathname.match(/(\d+)-/);
        if (numberMatch) {
          const number = parseInt(numberMatch[1], 10);
          const pathnameLower = blob.pathname.toLowerCase();
          
          if (number >= 134 && number <= 173 && 
              (pathnameLower.includes('steirische-eiche') || pathnameLower.includes('holz-natur'))) {
            targetBlobs.push({
              url: blob.url,
              pathname: blob.pathname,
              number
            });
            console.log(`🎯 Found target blob: ${blob.pathname}`);
          }
        }
      }

      return targetBlobs.sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error('❌ Error fetching blob images:', error);
      return [];
    }
  }

  /**
   * Create swap pairs by matching corresponding images
   */
  createSwapPairs(driveImages, blobImages) {
    const pairs = [];
    const processed = new Set();

    for (const driveImage of driveImages) {
      if (processed.has(driveImage.number)) continue;

      const nameLower = driveImage.name.toLowerCase();
      let targetPattern;
      let swapType;

      if (nameLower.includes('steirische-eiche')) {
        targetPattern = driveImage.name.replace(/steirische-eiche/gi, 'holz-natur');
        swapType = 'steirische-eiche';
      } else if (nameLower.includes('holz-natur')) {
        targetPattern = driveImage.name.replace(/holz-natur/gi, 'steirische-eiche');
        swapType = 'holz-natur';
      } else {
        continue;
      }

      // Find matching pair in drive images
      const matchingDriveImage = driveImages.find(img => 
        !processed.has(img.number) && 
        img.number !== driveImage.number &&
        this.namesMatch(img.name, targetPattern)
      );

      if (matchingDriveImage) {
        // Find corresponding blob images
        const blob1 = blobImages.find(blob => blob.number === driveImage.number);
        const blob2 = blobImages.find(blob => blob.number === matchingDriveImage.number);

        pairs.push({
          image1: {
            driveId: driveImage.id,
            driveName: driveImage.name,
            blobUrl: blob1?.url,
            blobPathname: blob1?.pathname,
            number: driveImage.number
          },
          image2: {
            driveId: matchingDriveImage.id,
            driveName: matchingDriveImage.name,
            blobUrl: blob2?.url,
            blobPathname: blob2?.pathname,
            number: matchingDriveImage.number
          },
          swapType
        });

        processed.add(driveImage.number);
        processed.add(matchingDriveImage.number);

        console.log(`🔗 Paired: ${driveImage.name} ↔ ${matchingDriveImage.name}`);
      }
    }

    return pairs;
  }

  /**
   * Check if two names match for swapping (ignoring case and the specific pattern difference)
   */
  namesMatch(name1, expectedName2) {
    // Normalize both names for comparison
    const normalize = (name) => name.toLowerCase()
      .replace(/steirische-eiche/g, 'TARGET_PATTERN')
      .replace(/holz-natur/g, 'TARGET_PATTERN');
    
    return normalize(name1) === normalize(expectedName2);
  }

  /**
   * Swap names in Google Drive
   */
  async swapGoogleDriveNames(pair) {
    try {
      console.log(`🔄 Swapping Google Drive names...`);
      
      // Create temporary names to avoid conflicts
      const tempName1 = `TEMP_SWAP_${Date.now()}_1_${pair.image1.driveName}`;
      const tempName2 = `TEMP_SWAP_${Date.now()}_2_${pair.image2.driveName}`;

      // Step 1: Rename both to temporary names
      await this.drive.files.update({
        fileId: pair.image1.driveId,
        requestBody: { name: tempName1 }
      });

      await this.drive.files.update({
        fileId: pair.image2.driveId,
        requestBody: { name: tempName2 }
      });

      // Step 2: Swap the names
      const newName1 = pair.image2.driveName;
      const newName2 = pair.image1.driveName;

      await this.drive.files.update({
        fileId: pair.image1.driveId,
        requestBody: { name: newName1 }
      });

      await this.drive.files.update({
        fileId: pair.image2.driveId,
        requestBody: { name: newName2 }
      });

      console.log(`✅ Google Drive swap completed: ${pair.image1.number} ↔ ${pair.image2.number}`);
      return true;

    } catch (error) {
      console.error(`❌ Google Drive swap failed for ${pair.image1.number} ↔ ${pair.image2.number}:`, error);
      return false;
    }
  }

  /**
   * Swap names in Vercel Blob Storage
   */
  async swapVercelBlobNames(pair) {
    try {
      if (!pair.image1.blobUrl || !pair.image1.blobPathname || 
          !pair.image2.blobUrl || !pair.image2.blobPathname) {
        console.log(`⚠️ Skipping blob swap for ${pair.image1.number} ↔ ${pair.image2.number}: Missing blob data`);
        return false;
      }

      console.log(`🔄 Swapping Vercel Blob names...`);

      // Download both images
      const [response1, response2] = await Promise.all([
        fetch(pair.image1.blobUrl),
        fetch(pair.image2.blobUrl)
      ]);

      if (!response1.ok || !response2.ok) {
        throw new Error(`Failed to download images: ${response1.status}, ${response2.status}`);
      }

      const [buffer1, buffer2] = await Promise.all([
        response1.arrayBuffer(),
        response2.arrayBuffer()
      ]);

      // Create new pathnames (swapped)
      const newPathname1 = this.generateSwappedBlobPath(pair.image1.blobPathname, pair.image2.driveName);
      const newPathname2 = this.generateSwappedBlobPath(pair.image2.blobPathname, pair.image1.driveName);

      // Upload with swapped names
      const [newBlob1, newBlob2] = await Promise.all([
        put(newPathname1, buffer1, { access: 'public' }),
        put(newPathname2, buffer2, { access: 'public' })
      ]);

      // Delete original blobs
      await Promise.all([
        del(pair.image1.blobUrl),
        del(pair.image2.blobUrl)
      ]);

      console.log(`✅ Vercel Blob swap completed: ${pair.image1.number} ↔ ${pair.image2.number}`);
      return true;

    } catch (error) {
      console.error(`❌ Vercel Blob swap failed for ${pair.image1.number} ↔ ${pair.image2.number}:`, error);
      return false;
    }
  }

  /**
   * Generate new blob pathname based on swapped drive name
   */
  generateSwappedBlobPath(originalBlobPath, newDriveName) {
    // Extract the base name without extension from drive name
    const baseNameWithoutExt = newDriveName.replace(/\.[^.]+$/, '');
    
    // Keep the blob format: images/name-hash.ext
    const pathParts = originalBlobPath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const hashMatch = fileName.match(/-([a-zA-Z0-9]{20,})(\.[^.]+)$/);
    
    if (hashMatch) {
      const [, hash, extension] = hashMatch;
      return `images/${baseNameWithoutExt}-${hash}${extension}`;
    } else {
      // Fallback if no hash pattern found
      const extension = fileName.match(/(\.[^.]+)$/)?.[1] || '.jpg';
      return `images/${baseNameWithoutExt}${extension}`;
    }
  }

  /**
   * Update images.ts constants file
   */
  async updateImagesConstants(swapPairs) {
    try {
      const imagesFilePath = path.join(process.cwd(), 'src/constants/images.ts');
      let content = await fs.readFile(imagesFilePath, 'utf8');

      for (const pair of swapPairs) {
        // Create the new names based on the swap
        const newName1 = pair.image2.driveName.replace(/\.[^.]+$/, ''); // Remove extension
        const newName2 = pair.image1.driveName.replace(/\.[^.]+$/, ''); // Remove extension

        // Find and replace the image paths in the constants
        const number1Regex = new RegExp(`'${pair.image1.number}-[^']*'`, 'g');
        const number2Regex = new RegExp(`'${pair.image2.number}-[^']*'`, 'g');

        content = content.replace(number1Regex, `'${newName1}'`);
        content = content.replace(number2Regex, `'${newName2}'`);
      }

      await fs.writeFile(imagesFilePath, content, 'utf8');
      console.log('✅ Updated images.ts constants');

    } catch (error) {
      console.error('❌ Failed to update images.ts:', error);
      throw error;
    }
  }
}

// Export for use as module or direct execution
module.exports = { ImageNameSwapper };

// Direct execution when run as script
if (require.main === module) {
  const swapper = new ImageNameSwapper();
  swapper.executeSwap()
    .then(result => {
      console.log('\n🎉 Swap operation completed!');
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.errors.length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}