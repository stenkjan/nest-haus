/**
 * Google Sheets Pricing Sync Service
 * 
 * Syncs pricing data from Google Sheets to database
 * Each sheet represents a different configurator category
 */

import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// ===== TYPES =====

export interface SheetMapping {
  sheetName: string;
  category: string;
  columns: {
    [key: string]: number; // Column name -> column index (0-based)
  };
}

export interface PricingRow {
  category: string;
  itemKey: string;
  itemName: string;
  basePrice: number;
  priceModifier?: number;
  size?: string;
  material?: string;
  metadata?: Record<string, unknown>;
}

export interface SyncResult {
  success: boolean;
  itemsUpdated: number;
  itemsUnchanged: number;
  itemsAdded: number;
  itemsRemoved: number;
  errors: string[];
  changes: Array<{
    category: string;
    itemKey: string;
    action: 'added' | 'updated' | 'removed';
    oldPrice?: number;
    newPrice?: number;
  }>;
}

// ===== SHEET MAPPINGS =====
// Define the structure of each sheet in your Google Spreadsheet

const SHEET_MAPPINGS: SheetMapping[] = [
  {
    sheetName: 'Nest_Groesse', // "Nest wie groß" base prices
    category: 'nest_groesse',
    columns: {
      size: 0,        // Column A: Size name (Klein, Mittel, Groß)
      width: 1,       // Column B: Width in meters
      height: 2,      // Column C: Height in meters
      basePrice: 3,   // Column D: Base price in EUR
    },
  },
  {
    sheetName: 'Gebaeudehuelle', // Material prices
    category: 'gebaeudehuelle',
    columns: {
      size: 0,          // Column A: Size
      material: 1,      // Column B: Material name
      priceModifier: 2, // Column C: Price modifier (+/- EUR)
      notes: 3,         // Column D: Notes
    },
  },
  {
    sheetName: 'Fenster', // Window options
    category: 'fenster',
    columns: {
      option: 0,        // Column A: Window option name
      description: 1,   // Column B: Description
      basePrice: 2,     // Column C: Base price
    },
  },
  {
    sheetName: 'Belichtung', // Lighting packages
    category: 'belichtung',
    columns: {
      package: 0,       // Column A: Package name
      description: 1,   // Column B: Description
      basePrice: 2,     // Column C: Base price
    },
  },
  {
    sheetName: 'Innenverkleidung', // Interior cladding
    category: 'innenverkleidung',
    columns: {
      material: 0,      // Column A: Material
      pricePerSqm: 1,   // Column B: Price per m²
      basePrice: 2,     // Column C: Base price for standard size
    },
  },
  {
    sheetName: 'Fussboden', // Flooring
    category: 'fussboden',
    columns: {
      type: 0,          // Column A: Flooring type
      pricePerSqm: 1,   // Column B: Price per m²
      basePrice: 2,     // Column C: Base price for standard size
    },
  },
  {
    sheetName: 'PV_Anlage', // Solar panels
    category: 'pv_anlage',
    columns: {
      option: 0,        // Column A: PV option
      power: 1,         // Column B: Power in kWp
      basePrice: 2,     // Column C: Base price
    },
  },
  {
    sheetName: 'Planungspaket', // Planning packages
    category: 'planungspaket',
    columns: {
      package: 0,       // Column A: Package name
      description: 1,   // Column B: Description
      basePrice: 2,     // Column C: Base price
    },
  },
];

// ===== SERVICE CLASS =====

export class PricingSyncService {
  private sheets;
  private spreadsheetId: string;

  constructor() {
    // Initialize Google Sheets API
    const credentials = this.getCredentials();
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = process.env.PRICING_SPREADSHEET_ID || '';

    if (!this.spreadsheetId) {
      throw new Error('PRICING_SPREADSHEET_ID environment variable not set');
    }
  }

  /**
   * Get Google Service Account credentials from environment
   */
  private getCredentials() {
    const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
    
    if (keyFile) {
      // Load from file (development)
      // Only allow JSON files to prevent webpack from bundling other file types
      if (!keyFile.endsWith('.json')) {
        console.warn('Key file must be a JSON file, falling back to environment variables');
      } else {
        try {
          // Use fs.readFileSync to avoid webpack's dynamic require analysis
          // This prevents webpack from trying to bundle all files in the directory
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const path = require('path');
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const fs = require('fs');
          const keyFilePath = path.resolve(process.cwd(), keyFile);
          
          // Verify the file exists and is a JSON file before reading
          if (!fs.existsSync(keyFilePath)) {
            throw new Error(`Key file not found: ${keyFilePath}`);
          }
          
          const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
          return JSON.parse(keyFileContent);
        } catch (error) {
          console.warn('Could not load key file, trying environment variables:', error);
        }
      }
    }

    // Load from environment variables (production)
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!email || !key) {
      throw new Error(
        'Google Service Account credentials not configured. ' +
        'Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_KEY'
      );
    }

    return {
      client_email: email,
      private_key: key.replace(/\\n/g, '\n'), // Handle escaped newlines
    };
  }

  /**
   * Fetch data from a specific sheet
   */
  private async fetchSheet(sheetName: string): Promise<unknown[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A2:Z1000`, // Skip header row, read up to row 1000
      });

      return (response.data.values || []) as unknown[][];
    } catch (error) {
      console.error(`Error fetching sheet ${sheetName}:`, error);
      return [];
    }
  }

  /**
   * Parse rows from a sheet based on mapping configuration
   */
  private parseSheetRows(
    rows: unknown[][],
    mapping: SheetMapping
  ): PricingRow[] {
    const parsed: PricingRow[] = [];

    for (const row of rows) {
      // Skip empty rows
      if (!row || row.length === 0) continue;

      try {
        // Extract data based on column mapping
        const rowData: Record<string, unknown> = {};
        
        for (const [key, colIndex] of Object.entries(mapping.columns)) {
          rowData[key] = row[colIndex] || null;
        }

        // Parse into PricingRow
        const pricingRow = this.parsePricingRow(rowData, mapping.category);
        if (pricingRow) {
          parsed.push(pricingRow);
        }
      } catch (error) {
        console.warn(`Error parsing row in ${mapping.sheetName}:`, error);
      }
    }

    return parsed;
  }

  /**
   * Parse a single row into PricingRow format
   */
  private parsePricingRow(
    data: Record<string, unknown>,
    category: string
  ): PricingRow | null {
    // Different parsing logic based on category
    switch (category) {
      case 'nest_groesse':
        return {
          category,
          itemKey: String(data.size || '').toLowerCase().trim(),
          itemName: String(data.size || ''),
          basePrice: this.parsePrice(data.basePrice),
          metadata: {
            width: this.parseNumber(data.width),
            height: this.parseNumber(data.height),
          },
        };

      case 'gebaeudehuelle':
        return {
          category,
          itemKey: `${data.size}_${data.material}`.toLowerCase().replace(/\s+/g, '_'),
          itemName: `${data.size} - ${data.material}`,
          basePrice: 0,
          priceModifier: this.parsePrice(data.priceModifier),
          size: String(data.size || ''),
          material: String(data.material || ''),
          metadata: {
            notes: data.notes,
          },
        };

      case 'fenster':
      case 'belichtung':
      case 'planungspaket':
        return {
          category,
          itemKey: String(data.option || data.package || '').toLowerCase().replace(/\s+/g, '_'),
          itemName: String(data.option || data.package || ''),
          basePrice: this.parsePrice(data.basePrice),
          metadata: {
            description: data.description,
          },
        };

      case 'innenverkleidung':
      case 'fussboden':
        return {
          category,
          itemKey: String(data.material || data.type || '').toLowerCase().replace(/\s+/g, '_'),
          itemName: String(data.material || data.type || ''),
          basePrice: this.parsePrice(data.basePrice),
          metadata: {
            pricePerSqm: this.parseNumber(data.pricePerSqm),
          },
        };

      case 'pv_anlage':
        return {
          category,
          itemKey: String(data.option || '').toLowerCase().replace(/\s+/g, '_'),
          itemName: String(data.option || ''),
          basePrice: this.parsePrice(data.basePrice),
          metadata: {
            power: this.parseNumber(data.power),
          },
        };

      default:
        return null;
    }
  }

  /**
   * Parse price value (handles numbers, strings with currency, formulas)
   */
  private parsePrice(value: unknown): number {
    if (typeof value === 'number') return Math.round(value);
    if (typeof value === 'string') {
      // Remove currency symbols and spaces
      const cleaned = value.replace(/[€$,\s]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : Math.round(parsed);
    }
    return 0;
  }

  /**
   * Parse numeric value
   */
  private parseNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/[,\s]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  /**
   * Main sync method - fetches all sheets and updates database
   */
  async syncPricing(): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      itemsUpdated: 0,
      itemsUnchanged: 0,
      itemsAdded: 0,
      itemsRemoved: 0,
      errors: [],
      changes: [],
    };

    try {
      console.log('🔄 Starting pricing sync...');
      const allPricingData: PricingRow[] = [];

      // Fetch and parse all sheets
      for (const mapping of SHEET_MAPPINGS) {
        try {
          console.log(`📊 Fetching sheet: ${mapping.sheetName}`);
          const rows = await this.fetchSheet(mapping.sheetName);
          const parsed = this.parseSheetRows(rows, mapping);
          allPricingData.push(...parsed);
          console.log(`✓ Parsed ${parsed.length} rows from ${mapping.sheetName}`);
        } catch (error) {
          const errorMsg = `Failed to fetch ${mapping.sheetName}: ${error}`;
          console.error(errorMsg);
          result.errors.push(errorMsg);
        }
      }

      if (allPricingData.length === 0) {
        throw new Error('No pricing data found in any sheet');
      }

      // Compare with existing data and update database
      await this.updateDatabase(allPricingData, result);

      // Log sync to database
      await this.logSync(result);

      result.success = result.errors.length === 0;
      console.log('✅ Pricing sync completed:', result);

      return result;
    } catch (error) {
      const errorMsg = `Pricing sync failed: ${error}`;
      console.error(errorMsg);
      result.errors.push(errorMsg);
      result.success = false;
      return result;
    }
  }

  /**
   * Update database with new pricing data
   */
  private async updateDatabase(
    newData: PricingRow[],
    result: SyncResult
  ): Promise<void> {
    // Get existing pricing data
    const existing = await prisma.pricingData.findMany();
    const existingMap = new Map(
      existing.map(item => [`${item.category}_${item.itemKey}`, item])
    );

    // Process each new item
    for (const item of newData) {
      const key = `${item.category}_${item.itemKey}`;
      const existingItem = existingMap.get(key);

      if (!existingItem) {
        // New item - add to database
        await prisma.pricingData.create({
          data: {
            category: item.category,
            itemKey: item.itemKey,
            itemName: item.itemName,
            basePrice: item.basePrice,
            priceModifier: item.priceModifier || 0,
            metadata: (item.metadata || {}) as Prisma.InputJsonValue,
            version: 1,
          },
        });

        result.itemsAdded++;
        result.changes.push({
          category: item.category,
          itemKey: item.itemKey,
          action: 'added',
          newPrice: item.basePrice,
        });
      } else if (
        existingItem.basePrice !== item.basePrice ||
        (existingItem.priceModifier || 0) !== (item.priceModifier || 0)
      ) {
        // Price changed - update
        await prisma.pricingData.update({
          where: { id: existingItem.id },
          data: {
            basePrice: item.basePrice,
            priceModifier: item.priceModifier || 0,
            itemName: item.itemName,
            metadata: (item.metadata || {}) as Prisma.InputJsonValue,
            version: existingItem.version + 1,
          },
        });

        result.itemsUpdated++;
        result.changes.push({
          category: item.category,
          itemKey: item.itemKey,
          action: 'updated',
          oldPrice: existingItem.basePrice,
          newPrice: item.basePrice,
        });
      } else {
        // No changes
        result.itemsUnchanged++;
      }

      // Mark as processed
      existingMap.delete(key);
    }

    // Remaining items in existingMap were removed from sheets
    for (const [, item] of existingMap) {
      // Optionally: mark as inactive instead of deleting
      await prisma.pricingData.update({
        where: { id: item.id },
        data: { isActive: false },
      });

      result.itemsRemoved++;
      result.changes.push({
        category: item.category,
        itemKey: item.itemKey,
        action: 'removed',
        oldPrice: item.basePrice,
      });
    }
  }

  /**
   * Log sync result to database
   */
  private async logSync(result: SyncResult): Promise<void> {
    await prisma.pricingSyncLog.create({
      data: {
        itemsUpdated: result.itemsUpdated + result.itemsAdded,
        changes: result.changes as Prisma.InputJsonValue,
        status: result.success ? 'success' : result.errors.length > 0 ? 'partial' : 'failed',
      },
    });
  }

  /**
   * Get the last sync timestamp
   */
  async getLastSyncTime(): Promise<Date | null> {
    const lastSync = await prisma.pricingSyncLog.findFirst({
      orderBy: { syncedAt: 'desc' },
    });

    return lastSync?.syncedAt || null;
  }

  /**
   * Get pricing for a specific category and item
   */
  async getPricing(category: string, itemKey: string): Promise<number> {
    const item = await prisma.pricingData.findUnique({
      where: {
        category_itemKey: {
          category,
          itemKey,
        },
      },
    });

    return item?.basePrice || 0;
  }
}
