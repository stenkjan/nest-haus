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

        // Additional safety check: ensure the new content has the same number of variables
        const originalVarCount = (this.originalContent.match(/:\s*['"`][^'"`]*['"`]/g) || []).length;
        const newVarCount = (newContent.match(/:\s*['"`][^'"`]*['"`]/g) || []).length;

        if (originalVarCount !== newVarCount) {
          console.warn('🚨 SAFETY CHECK FAILED: Variable count mismatch, aborting update');
          console.warn(`   Original: ${originalVarCount} variables, New: ${newVarCount} variables`);
          result.errors.push('Safety check failed: Variable count mismatch');
        } else {
          await fs.writeFile(this.imagesFilePath, newContent, 'utf8');
          result.updated = true;
          console.log(`✅ SAFELY updated images.ts paths (${pathChanges} path updates, ${originalVarCount} variables preserved)`);
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
          // FIXED: More precise mobile detection - only if ends with "-mobile"
          const isMobile = parsed.title.toLowerCase().endsWith('-mobile') ||
            blob.pathname.toLowerCase().includes('-mobile');
          const category = this.inferCategory(parsed.number, parsed.title);
          const constantKey = this.generateConstantKey(parsed.number, parsed.title, category, isMobile);

          // Clean the blob path for constants: remove images/ prefix, hash, and extension
          const cleanBlobPath = blob.pathname
            .replace(/^images\//, '') // Remove images/ prefix
            .replace(/-[a-zA-Z0-9]{20,}\.([a-zA-Z0-9]+)$/, '') // Remove hash and extension
            .replace(/\.([a-zA-Z0-9]+)$/, ''); // Remove extension if no hash

          mappings.push({
            number: parsed.number,
            title: parsed.title,
            blobPath: cleanBlobPath,
            category,
            constantKey,
            isMobile // Add this property to the mapping
          });
        }
      }

      return mappings.sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error('❌ Failed to get blob mappings:', error);
      return [];
    }
  }

  /**
   * Parse image name to extract number and title
   * Handles both formats:
   * - Google Drive: "123-Title-Name.ext"
   * - Vercel Blob: "images/123-Title-Name-HASH.ext"
   */
  private parseImageName(fileName: string): { number: number; title: string } | null {
    // Remove the images/ prefix if present
    const cleanFileName = fileName.replace(/^images\//, '');

    // Match either:
    // - Simple format: "123-Title-Name.ext" 
    // - With hash: "123-Title-Name-hash.ext"
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
 * Generate updated constants - SAFE MODE: Only updates path values, never variable names
 * Preserves all existing variable names and structure, only updates string paths
 */
  private generateUpdatedConstants(
    currentConstants: Record<string, string>,
    blobMappings: ImageMapping[]
  ): Record<string, string> {
    const updatedConstants = { ...currentConstants };
    let pathUpdates = 0;

    // Create a map of image numbers to their blob paths (without hash/extension)
    const numberToPathMap = new Map<number, string>();

    for (const mapping of blobMappings) {
      // Clean path: remove images/ prefix, hash, and extension
      const cleanPath = mapping.blobPath;
      numberToPathMap.set(mapping.number, cleanPath);
    }

    // Only update existing constants' path values, never change variable names
    for (const [variableName, currentPath] of Object.entries(currentConstants)) {
      // Skip fallback/placeholder paths
      if (currentPath.startsWith('/api/placeholder/')) {
        continue;
      }

      // Extract number from current path to match with blob images
      const numberMatch = currentPath.match(/^(\d+)-/);
      if (numberMatch) {
        const imageNumber = parseInt(numberMatch[1], 10);

        // FIXED: Determine if this is a mobile version based on the full variable key
        // e.g., "hero.mobile.nestHaus1" is mobile, "hero.nestHaus1" is desktop
        const isCurrentMobile = variableName.includes('.mobile.');

        // Find matching blob image with EXACT same mobile/desktop type
        const matchingMapping = blobMappings.find(mapping =>
          mapping.number === imageNumber &&
          mapping.isMobile === isCurrentMobile
        );

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

    console.log(`📄 Safe path update completed:`);
    console.log(`   • Preserved ${Object.keys(currentConstants).length} variable names`);
    console.log(`   • Updated ${pathUpdates} path values`);
    console.log(`   • Found ${blobMappings.length} blob images for reference`);

    return updatedConstants;
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
 * Generate new file content with updated constants - SAFE MODE
 * Only updates existing path values while preserving all structure, comments, and formatting
 */
  private generateNewFileContent(
    originalContent: string,
    updatedConstants: Record<string, string>
  ): string {
    let newContent = originalContent;

    // Update each constant individually using precise regex replacement
    for (const [fullKey, newValue] of Object.entries(updatedConstants)) {
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