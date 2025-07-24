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

      // Step 4: Generate updated constants
      const updatedConstants = this.generateUpdatedConstants(currentConstants, blobMappings);
      result.newMappings = Object.keys(updatedConstants).length - Object.keys(currentConstants).length;

      // Step 5: Write updated file if changes detected
      if (this.hasChanges(currentConstants, updatedConstants)) {
        const newContent = this.generateNewFileContent(this.originalContent, updatedConstants);
        await fs.writeFile(this.imagesFilePath, newContent, 'utf8');
        result.updated = true;
        console.log(`✅ Updated images.ts with ${result.newMappings} new mappings`);
      } else {
        console.log('📄 No changes needed in images.ts');
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
          // Check if this is a mobile version
          const isMobile = blob.pathname.toLowerCase().includes('mobile');
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
            constantKey
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
   */
  private generateConstantKey(number: number, title: string, category: string, isMobile: boolean = false): string {
    const titleParts = title.toLowerCase()
      .replace(/[^a-z0-9-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .split('_');

    // For hero images, use simple naming with mobile handling
    if (category === 'hero') {
      if (number === 0) return 'homeButton';
      
      if (isMobile) {
        // Mobile hero images go into hero.mobile subcategory
        return `mobile.nestHaus${number}`;
      } else {
        // Desktop hero images go directly into hero category
        return `nestHaus${number}`;
      }
    }

    // For configurations, create descriptive keys
    if (category === 'configurations') {
      let key = '';
      
      // Extract size info (75, 95, 115, etc.)
      const sizeMatch = title.match(/(\d{2,3})/);
      if (sizeMatch) {
        key += `nest${sizeMatch[1]}_`;
      }

      // Extract material info
      if (title.includes('fassadenplatten') && title.includes('schwarz')) {
        key += 'plattenschwarz';
      } else if (title.includes('fassadenplatten') && title.includes('weiss')) {
        key += 'plattenweiss';
      } else if (title.includes('holzfassade') || title.includes('holzlattung')) {
        key += 'holzlattung';
      } else if (title.includes('trapezblech')) {
        key += 'trapezblech';
      }

      // Handle special cases
      if (title.includes('photovoltaik') || title.includes('pv')) {
        key = key.replace(/^nest\d+_/, 'pv_');
      }
      
      if (title.includes('fenster')) {
        if (title.includes('pvc') || title.includes('kunststoff')) {
          key = 'fenster_pvc';
        } else if (title.includes('aluminium')) {
          key = 'fenster_aluminium';
        } else if (title.includes('eiche')) {
          key = 'fenster_holz_eiche';
        } else if (title.includes('fichte')) {
          key = 'fenster_holz_fichte';
        }
      }

      return key || `config_${number}`;
    }

    // For other categories, use simplified naming
    const mainWords = titleParts
      .filter(word => word.length > 2 && !['nest', 'haus', 'konfigurator'].includes(word))
      .slice(0, 3);
    
    return mainWords.join('_') || `${category}_${number}`;
  }

  /**
   * Parse current constants from images.ts file
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

    // Also parse other categories (hero, function, etc.)
    const categoryMatches = content.match(/(\w+):\s*{([\s\S]*?)}/g);
    if (categoryMatches) {
      for (const categoryMatch of categoryMatches) {
        const match = categoryMatch.match(/(\w+):\s*{([\s\S]*?)}/);
        if (match) {
          const [, category, categoryContent] = match;
          if (['hero', 'function', 'gallery', 'aboutus'].includes(category)) {
            const assignments = categoryContent.match(/(\w+):\s*['"`]([^'"`]+)['"`]/g);
            if (assignments) {
              for (const assignment of assignments) {
                const assignmentMatch = assignment.match(/(\w+):\s*['"`]([^'"`]+)['"`]/);
                if (assignmentMatch) {
                  const [, key, value] = assignmentMatch;
                  constants[`${category}.${key}`] = value;
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
   * Generate updated constants by merging current with blob mappings
    * NEVER removes existing constants - only adds new ones
   */
  private generateUpdatedConstants(
    currentConstants: Record<string, string>, 
    blobMappings: ImageMapping[]
  ): Record<string, string> {
    // Start with ALL current constants - never remove any
    const updatedConstants = { ...currentConstants };

    // Only ADD new constants from blob mappings
    for (const mapping of blobMappings) {
      if (mapping.constantKey && mapping.category) {
        // Handle hero category specially - mobile images go into hero.mobile
        let fullKey: string;
        
        if (mapping.category === 'hero' && mapping.constantKey.startsWith('mobile.')) {
          // Mobile hero images: hero.mobile.nestHaus1
          fullKey = `hero.${mapping.constantKey}`;
        } else if (mapping.category === 'configurations') {
          // Configuration images: direct key
          fullKey = mapping.constantKey;
        } else {
          // Other categories: category.key
          fullKey = `${mapping.category}.${mapping.constantKey}`;
        }
        
        // Only add if it's a new key (doesn't exist in current constants)
        // This preserves all existing constants even if the blob is deleted
        if (!updatedConstants[fullKey]) {
          updatedConstants[fullKey] = mapping.blobPath;
        }
        // If key exists but value is different, update it (for renamed files)
        else if (updatedConstants[fullKey] !== mapping.blobPath) {
          console.log(`🔄 Updating constant ${fullKey}: ${updatedConstants[fullKey]} -> ${mapping.blobPath}`);
          updatedConstants[fullKey] = mapping.blobPath;
        }
      }
    }

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
   * Generate new file content with updated constants
   */
  private generateNewFileContent(
    originalContent: string, 
    updatedConstants: Record<string, string>
  ): string {
    let newContent = originalContent;

    // Group constants by category
    const constantsByCategory: Record<string, Record<string, string>> = {};
    
    for (const [fullKey, value] of Object.entries(updatedConstants)) {
      const [category, key] = fullKey.includes('.') ? fullKey.split('.') : ['configurations', fullKey];
      
      if (!constantsByCategory[category]) {
        constantsByCategory[category] = {};
      }
      constantsByCategory[category][key] = value;
    }

    // Update each category section
    for (const [category, constants] of Object.entries(constantsByCategory)) {
      if (Object.keys(constants).length === 0) continue;

      const categoryRegex = new RegExp(`(${category}:\\s*{)([\\s\\S]*?)(})`, '');
      const match = newContent.match(categoryRegex);
      
      if (match) {
        const indent = '        '; // 8 spaces for proper indentation
        const constantsText = Object.entries(constants)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => `${indent}${key}: '${value}'`)
          .join(',\n');

        newContent = newContent.replace(
          categoryRegex,
          `$1\n${constantsText}\n        $3`
        );
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