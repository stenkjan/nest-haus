/**
 * ImagesConstantsUpdater - Auto-update images.ts constants
 * 
 * Automatically updates image path constants when Google Drive sync
 * adds/updates/removes images from Vercel Blob storage.
 * 
 * Features:
 * - Smart mapping based on image numbers and titles
 * - Preserves existing structure and comments
 * - Safe TypeScript code generation
 * - Rollback capability
 */

import fs from 'fs/promises';
import path from 'path';
import { list } from '@vercel/blob';

export interface ImageMapping {
  number: number;
  title: string;
  blobPath: string;
  category?: string;
  constantKey?: string;
  isMobile?: boolean;
}

export class ImagesConstantsUpdater {
  private readonly imagesFilePath: string;
  private originalContent?: string;

  constructor() {
    this.imagesFilePath = path.join(process.cwd(), 'src/constants/images.ts');
  }

  /**
   * Main update function - analyzes blob storage and updates constants
   */
  async updateConstants(): Promise<{ updated: boolean; newMappings: number; errors: string[] }> {
    const result = { updated: false, newMappings: 0, errors: [] as string[] };

    try {
      console.log('📝 Starting images.ts constants update...');

      // Step 1: Backup original file
      this.originalContent = await fs.readFile(this.imagesFilePath, 'utf8');

      // Step 2: Get current blob images
      const blobMappings = await this.getBlobImageMappings();
      console.log(`📊 Found ${blobMappings.length} blob images to process`);

      // Step 3: Parse current constants
      const currentConstants = this.parseCurrentConstants(this.originalContent);
      console.log(`📊 Found ${Object.keys(currentConstants).length} existing constants`);

      // Step 4: Generate updated constants (path updates only)
      const updatedConstants = this.generateUpdatedConstants(currentConstants, blobMappings);

      // Count actual path changes, not new mappings
      let pathChanges = 0;
      for (const [key, newValue] of Object.entries(updatedConstants)) {
        if (currentConstants[key] !== newValue) {
          pathChanges++;
        }
      }
      result.newMappings = pathChanges;

      // Step 5: Write updated file if changes detected (SAFE MODE)
      if (this.hasChanges(currentConstants, updatedConstants)) {
        console.log('🔒 SAFE MODE: Only updating path values, preserving all variable names and structure');

        const newContent = this.generateNewFileContent(this.originalContent, updatedConstants);

        // Enhanced safety check: allow for new constants to be added
        const originalVarCount = (this.originalContent.match(/:\s*['"`][^'"`]*['"`]/g) || []).length;
        const newVarCount = (newContent.match(/:\s*['"`][^'"`]*['"`]/g) || []).length;
        const newConstantsAdded = Object.keys(updatedConstants).filter(key => key.startsWith('pvModule.')).length;

        if (newVarCount < originalVarCount) {
          console.warn('🚨 SAFETY CHECK FAILED: Variables were removed, aborting update');
          console.warn(`   Original: ${originalVarCount} variables, New: ${newVarCount} variables`);
          result.errors.push('Safety check failed: Variables were removed');
        } else if (newVarCount > originalVarCount + newConstantsAdded) {
          console.warn('🚨 SAFETY CHECK FAILED: Too many new variables added, aborting update');
          console.warn(`   Original: ${originalVarCount} variables, New: ${newVarCount} variables, Expected new: ${newConstantsAdded}`);
          result.errors.push('Safety check failed: Unexpected variable count increase');
        } else {
          await fs.writeFile(this.imagesFilePath, newContent, 'utf8');
          result.updated = true;
          console.log(`✅ ENHANCED update completed: ${pathChanges} path updates, ${newConstantsAdded} new constants added, ${originalVarCount} original variables preserved`);
        }
      } else {
        console.log('📄 No path changes needed in images.ts');
      }

      return result;

    } catch (error) {
      console.error('❌ Failed to update images constants:', error);
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');

      // Attempt rollback if we have original content
      if (this.originalContent) {
        try {
          await fs.writeFile(this.imagesFilePath, this.originalContent, 'utf8');
          console.log('🔄 Rolled back images.ts to original state');
        } catch (rollbackError) {
          console.error('❌ Rollback failed:', rollbackError);
          result.errors.push('Rollback failed: ' + (rollbackError instanceof Error ? rollbackError.message : 'Unknown rollback error'));
        }
      }

      return result;
    }
  }

  /**
   * Get mappings from current Vercel Blob storage
   */
  private async getBlobImageMappings(): Promise<ImageMapping[]> {
    try {
      const { blobs } = await list();
      const mappings: ImageMapping[] = [];

      for (const blob of blobs) {
        const parsed = this.parseImageName(blob.pathname);
        if (parsed) {
          // CRITICAL: Precise mobile detection based on actual blob path
          // Check for -mobile suffix in the actual blob pathname (before hash removal)
          // FIXED: More precise mobile detection to prevent false positives
          const isMobile = !!blob.pathname.toLowerCase().match(/-mobile(-[a-zA-Z0-9]{10,})?\.[a-z]+$/);

          const category = this.inferCategory(parsed.number, parsed.title);
          const constantKey = this.generateConstantKey(parsed.number, parsed.title, category, isMobile);

          // Clean the blob path for constants: remove images/ prefix, hash, and extension
          // CRITICAL: Maintain mobile/desktop distinction in the clean path
          // FIXED: More aggressive hash removal to prevent hash suffixes in images.ts
          let cleanBlobPath = blob.pathname
            .replace(/^images\//, '') // Remove images/ prefix
            .replace(/-[a-zA-Z0-9]{10,}\.([a-zA-Z0-9]+)$/, '') // Remove hash and extension (shorter pattern)
            .replace(/-[a-zA-Z0-9]{10,}$/, '') // Remove hash without extension
            .replace(/\.([a-zA-Z0-9]+)$/, ''); // Remove extension if no hash

          // EXTRA SAFETY: Remove any remaining hash-like suffixes
          cleanBlobPath = cleanBlobPath.replace(/-[A-Za-z0-9]{10,}$/, '');

          // CRITICAL FIX: Don't add -mobile suffix to desktop images!
          // The cleanBlobPath should already contain -mobile if it's a mobile image
          // We should NOT add -mobile suffix here - it should come from the original filename

          mappings.push({
            number: parsed.number,
            title: parsed.title,
            blobPath: cleanBlobPath,
            category,
            constantKey,
            isMobile
          });

          // Debug logging for mobile/desktop detection
          console.log(`📱 Detected ${isMobile ? 'mobile' : 'desktop'}: ${blob.pathname} → ${cleanBlobPath}`);
        }
      }

      return mappings.sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error('❌ Failed to get blob mappings:', error);
      return [];
    }
  }

  /**
   * Parse media file name to extract number and title
   * Handles both formats:
   * - Google Drive: "123-Title-Name.ext" or "123-Title-Name-mobile.ext" (images/videos)
   * - Vercel Blob: "images/123-Title-Name-HASH.ext" or "images/123-Title-Name-mobile-HASH.ext"
   * 
   * CRITICAL: Preserves mobile/desktop distinction in title extraction
   * Supports both images (.jpg, .png, .webp) and videos (.mp4, .mov)
   */
  private parseImageName(fileName: string): { number: number; title: string } | null {
    // Remove the images/ prefix if present
    const cleanFileName = fileName.replace(/^images\//, '');

    // Match either:
    // - Simple format: "123-Title-Name.ext" or "123-Title-Name-mobile.ext"
    // - With hash: "123-Title-Name-hash.ext" or "123-Title-Name-mobile-hash.ext"
    const match = cleanFileName.match(/^(\d+)-(.+?)(?:-[a-zA-Z0-9]{20,})?\.([a-zA-Z0-9]+)$/);
    if (!match) {
      console.log(`⚠️  Failed to parse image name: ${fileName}`);
      return null;
    }

    const [, numberStr, title] = match;
    const number = parseInt(numberStr, 10);

    if (isNaN(number)) {
      console.log(`⚠️  Invalid number in filename: ${fileName}`);
      return null;
    }

    // IMPORTANT: Return title AS-IS (with or without -mobile)
    // The mobile detection is handled separately in getBlobImageMappings()
    return { number, title };
  }

  /**
   * Infer category based on image number and title
   */
  private inferCategory(number: number, title: string): string {
    const titleLower = title.toLowerCase();

    // Landing page hero images (1-8)
    if (number >= 1 && number <= 8) {
      return 'hero';
    }

    // Function/Process images (12-39)
    if (number >= 12 && number <= 39) {
      return 'function';
    }

    // Configurator base images (100-199)
    if (number >= 100 && number <= 199) {
      return 'configurations';
    }

    // Team/About images (998-999)
    if (number >= 998) {
      return 'aboutus';
    }

    // Gallery or general images
    if (titleLower.includes('house') || titleLower.includes('gallery')) {
      return 'gallery';
    }

    // Default to configurations for unknown categorization
    return 'configurations';
  }

  /**
   * Generate constant key based on number, title, category, and mobile flag
   * DISABLED: To prevent corrupting images.ts file structure
   * The file should be manually maintained for now
   */
  private generateConstantKey(number: number, title: string, category: string, isMobile: boolean = false): string {
    // Simple fallback to prevent auto-generation that corrupts the file
    return `config_${number}${isMobile ? '_mobile' : ''}`;
  }

  /**
   * Parse current constants from images.ts file
   */
  /**
   * FIXED: Parse current constants from images.ts file
   * Now properly handles nested mobile structures like hero.mobile.{key}
   */
  private parseCurrentConstants(content: string): Record<string, string> {
    const constants: Record<string, string> = {};

    // Match all string assignments in the configurations object
    const configMatch = content.match(/configurations:\s*{([\s\S]*?)}/);
    if (configMatch) {
      const configContent = configMatch[1];
      const assignments = configContent.match(/(\w+):\s*['"`]([^'"`]+)['"`]/g);

      if (assignments) {
        for (const assignment of assignments) {
          const match = assignment.match(/(\w+):\s*['"`]([^'"`]+)['"`]/);
          if (match) {
            const [, key, value] = match;
            constants[key] = value;
          }
        }
      }
    }

    // Parse other categories with support for nested mobile structures
    const categoryMatches = content.match(/(\w+):\s*{([\s\S]*?)(?=\s*},\s*(?:\/\/|$|\w+:))/g);
    if (categoryMatches) {
      for (const categoryMatch of categoryMatches) {
        const match = categoryMatch.match(/(\w+):\s*{([\s\S]*?)$/);
        if (match) {
          const [, category, categoryContent] = match;
          if (['hero', 'function', 'gallery', 'aboutus'].includes(category)) {
            // First, parse direct assignments in this category (desktop versions)
            const directAssignments = categoryContent.match(/^\s*(\w+):\s*['"`]([^'"`]+)['"`]/gm);
            if (directAssignments) {
              for (const assignment of directAssignments) {
                const assignmentMatch = assignment.match(/(\w+):\s*['"`]([^'"`]+)['"`]/);
                if (assignmentMatch) {
                  const [, key, value] = assignmentMatch;
                  constants[`${category}.${key}`] = value;
                }
              }
            }

            // FIXED: Parse nested mobile subfolder (like hero.mobile.{key})
            const mobileMatch = categoryContent.match(/mobile:\s*{([\s\S]*?)}/);
            if (mobileMatch) {
              const mobileContent = mobileMatch[1];
              const mobileAssignments = mobileContent.match(/(\w+):\s*['"`]([^'"`]+)['"`]/g);
              if (mobileAssignments) {
                for (const assignment of mobileAssignments) {
                  const assignmentMatch = assignment.match(/(\w+):\s*['"`]([^'"`]+)['"`]/);
                  if (assignmentMatch) {
                    const [, key, value] = assignmentMatch;
                    constants[`${category}.mobile.${key}`] = value;
                  }
                }
              }
            }
          }
        }
      }
    }

    return constants;
  }

  /**
 * Generate updated constants - ENHANCED: Updates existing paths AND adds new images
 * Preserves all existing variable names and structure, updates paths, and adds new PV overlay images
 */
  private generateUpdatedConstants(
    currentConstants: Record<string, string>,
    blobMappings: ImageMapping[]
  ): Record<string, string> {
    const updatedConstants = { ...currentConstants };
    let pathUpdates = 0;
    let newImages = 0;

    // Create a map of image numbers to their blob paths (without hash/extension)
    const numberToPathMap = new Map<number, string>();
    const processedNumbers = new Set<number>();

    for (const mapping of blobMappings) {
      // Clean path: remove images/ prefix, hash, and extension
      const cleanPath = mapping.blobPath;
      numberToPathMap.set(mapping.number, cleanPath);
    }

    // Step 1: Update existing constants' path values
    for (const [variableName, currentPath] of Object.entries(currentConstants)) {
      // Skip fallback/placeholder paths
      if (currentPath.startsWith('/api/placeholder/')) {
        continue;
      }

      // Allow hero image updates - they should sync from Google Drive like other images
      // Removed the hardcoded skip to allow proper sync of hero images

      // Extract number from current path to match with blob images
      const numberMatch = currentPath.match(/^(\d+)-/);
      if (numberMatch) {
        const imageNumber = parseInt(numberMatch[1], 10);
        processedNumbers.add(imageNumber);

        // FIXED: Determine if this is a mobile version based on the full variable key
        // e.g., "hero.mobile.nestHaus1" is mobile, "hero.nestHaus1" is desktop
        const isCurrentMobile = variableName.includes('.mobile.');

        // Find matching blob image with EXACT same mobile/desktop type
        // CRITICAL: For desktop constants, prefer desktop versions even if mobile exists
        let matchingMapping = blobMappings.find(mapping =>
          mapping.number === imageNumber &&
          mapping.isMobile === isCurrentMobile
        );

        // FALLBACK: If no exact match and this is a desktop constant, 
        // don't use mobile version - keep the existing path
        if (!matchingMapping && !isCurrentMobile) {
          const mobileVersion = blobMappings.find(mapping =>
            mapping.number === imageNumber && mapping.isMobile === true
          );
          if (mobileVersion) {
            console.log(`⚠️ Skipping desktop constant ${variableName}: Only mobile version available, keeping existing path`);
            continue; // Skip this update to prevent desktop->mobile contamination
          }
        }

        if (matchingMapping && matchingMapping.blobPath !== currentPath) {
          updatedConstants[variableName] = matchingMapping.blobPath;
          pathUpdates++;
          console.log(`🔄 Updated path for ${variableName} (${isCurrentMobile ? 'mobile' : 'desktop'}): ${currentPath} → ${matchingMapping.blobPath}`);
        } else if (!matchingMapping) {
          // If no exact match found, log it but don't update
          const availableTypes = blobMappings
            .filter(m => m.number === imageNumber)
            .map(m => m.isMobile ? 'mobile' : 'desktop')
            .join(', ');

          if (availableTypes) {
            console.log(`⚠️ Skipped ${variableName}: No ${isCurrentMobile ? 'mobile' : 'desktop'} version found (available: ${availableTypes})`);
          }
        }
      }
    }

    // Step 2: Add new PV overlay images (190-220 range) that don't exist yet
    for (const mapping of blobMappings) {
      // Only add new images in the PV overlay range (190-220)
      if (mapping.number >= 190 && mapping.number <= 220 && !processedNumbers.has(mapping.number)) {
        // Generate appropriate constant key for PV overlays
        const pvConstantKey = this.generatePvOverlayConstantKey(mapping.number, mapping.isMobile);

        // FIXED: Check if constant already exists to prevent duplicates
        if (pvConstantKey && !updatedConstants[pvConstantKey] && !currentConstants[pvConstantKey]) {
          updatedConstants[pvConstantKey] = mapping.blobPath;
          newImages++;
          console.log(`🆕 Added new PV overlay: ${pvConstantKey} → ${mapping.blobPath}`);
        } else if (pvConstantKey && (updatedConstants[pvConstantKey] || currentConstants[pvConstantKey])) {
          console.log(`⏭️ Skipping duplicate PV overlay: ${pvConstantKey} (already exists)`);
        }
      }
    }

    console.log(`📄 Enhanced update completed:`);
    console.log(`   • Preserved ${Object.keys(currentConstants).length} existing variable names`);
    console.log(`   • Updated ${pathUpdates} existing path values`);
    console.log(`   • Added ${newImages} new PV overlay images`);
    console.log(`   • Found ${blobMappings.length} blob images for reference`);

    return updatedConstants;
  }

  /**
   * Generate constant key for PV overlay images (190-220 range)
   */
  private generatePvOverlayConstantKey(number: number, isMobile: boolean): string | null {
    // Only handle PV overlay range
    if (number < 190 || number > 220) return null;

    // Don't add mobile PV overlays to the main constants - they're not used
    if (isMobile) return null;

    // Map specific PV overlay numbers to their constant keys
    const pvMappings: Record<number, string> = {
      // Nest75 (nest80) overlays - updated range 191-194
      191: 'pvModule.nest75_solar_overlay_mod_1',
      192: 'pvModule.nest75_solar_overlay_mod_2',
      193: 'pvModule.nest75_solar_overlay_mod_3',
      194: 'pvModule.nest75_solar_overlay_mod_4',

      // Nest95 (nest100) overlays - 195-199
      195: 'pvModule.nest95_solar_overlay_mod_1',
      196: 'pvModule.nest95_solar_overlay_mod_2',
      197: 'pvModule.nest95_solar_overlay_mod_3',
      198: 'pvModule.nest95_solar_overlay_mod_4',
      199: 'pvModule.nest95_solar_overlay_mod_5',

      // Nest115 (nest120) overlays - 200-205
      200: 'pvModule.nest115_solar_overlay_mod_1',
      201: 'pvModule.nest115_solar_overlay_mod_2',
      202: 'pvModule.nest115_solar_overlay_mod_3',
      203: 'pvModule.nest115_solar_overlay_mod_4',
      204: 'pvModule.nest115_solar_overlay_mod_5',
      205: 'pvModule.nest115_solar_overlay_mod_6',

      // Nest135 (nest140) overlays - 206-212
      206: 'pvModule.nest135_solar_overlay_mod_1',
      207: 'pvModule.nest135_solar_overlay_mod_2',
      208: 'pvModule.nest135_solar_overlay_mod_3',
      209: 'pvModule.nest135_solar_overlay_mod_4',
      210: 'pvModule.nest135_solar_overlay_mod_5',
      211: 'pvModule.nest135_solar_overlay_mod_6',
      212: 'pvModule.nest135_solar_overlay_mod_7',

      // Nest155 (nest160) overlays - 213-220
      213: 'pvModule.nest155_solar_overlay_mod_1',
      214: 'pvModule.nest155_solar_overlay_mod_2',
      215: 'pvModule.nest155_solar_overlay_mod_3',
      216: 'pvModule.nest155_solar_overlay_mod_4',
      217: 'pvModule.nest155_solar_overlay_mod_5',
      218: 'pvModule.nest155_solar_overlay_mod_6',
      219: 'pvModule.nest155_solar_overlay_mod_7',
      220: 'pvModule.nest155_solar_overlay_mod_8'
    };

    return pvMappings[number] || null;
  }

  /**
   * Check if there are changes between current and updated constants
   */
  private hasChanges(current: Record<string, string>, updated: Record<string, string>): boolean {
    const currentKeys = Object.keys(current);
    const updatedKeys = Object.keys(updated);

    // Check if number of keys changed
    if (currentKeys.length !== updatedKeys.length) {
      return true;
    }

    // Check if any values changed
    for (const key of currentKeys) {
      if (current[key] !== updated[key]) {
        return true;
      }
    }

    return false;
  }

  /**
 * Generate new file content with updated constants - ENHANCED MODE
 * Updates existing path values AND adds new PV overlay constants while preserving structure
 */
  private generateNewFileContent(
    originalContent: string,
    updatedConstants: Record<string, string>
  ): string {
    let newContent = originalContent;

    // Step 1: Update existing constants
    for (const [fullKey, newValue] of Object.entries(updatedConstants)) {
      // Skip new PV overlay constants for now - handle them separately
      if (fullKey.startsWith('pvModule.')) {
        continue;
      }

      // Handle nested keys (like hero.mobile.nestHaus1) and flat keys
      const keyParts = fullKey.split('.');
      const searchKey = keyParts[keyParts.length - 1]; // Get the actual variable name

      // Create a regex to find and replace just the value, preserving variable name and structure
      // Matches: variableName: 'oldvalue' and replaces with: variableName: 'newvalue'
      const valueRegex = new RegExp(
        `(${searchKey}:\\s*['"\`])([^'"\`]+)(['"\`])`,
        'g'
      );

      // Only replace if the pattern is found
      if (valueRegex.test(newContent)) {
        newContent = newContent.replace(valueRegex, `$1${newValue}$3`);
      }
    }

    // Step 2: Add new PV overlay constants to the pvModule section
    const newPvOverlays = Object.entries(updatedConstants)
      .filter(([key]) => key.startsWith('pvModule.'))
      .map(([key, value]) => {
        const constantName = key.replace('pvModule.', '');
        return `        ${constantName}: '${value}',`;
      });

    if (newPvOverlays.length > 0) {
      // Find the pvModule section and add new constants before the closing brace
      const pvModuleMatch = newContent.match(/(pvModule:\s*{[\s\S]*?)(    },)/);
      if (pvModuleMatch) {
        const beforeClosing = pvModuleMatch[1];
        const closingBrace = pvModuleMatch[2];

        // Add new constants with proper indentation
        const newPvSection = beforeClosing + '\n        \n        // New PV overlay images added by sync\n' +
          newPvOverlays.join('\n') + '\n' + closingBrace;

        newContent = newContent.replace(pvModuleMatch[0], newPvSection);

        console.log(`📝 Added ${newPvOverlays.length} new PV overlay constants to images.ts`);
      } else {
        console.warn('⚠️ Could not find pvModule section to add new constants');
      }
    }

    return newContent;
  }

  /**
   * Rollback to original content
   */
  async rollback(): Promise<void> {
    if (this.originalContent) {
      await fs.writeFile(this.imagesFilePath, this.originalContent, 'utf8');
      console.log('🔄 Rolled back images.ts to original state');
    }
  }
} 