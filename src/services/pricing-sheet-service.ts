/**
 * Pricing Sheet Service
 * 
 * Parses pricing data from Google Sheets "Preistabelle Verkauf" tab
 * Single sheet with all sections, column E contains section headers and option names
 * Prices in columns F-N (Nest 80-160)
 */

import { google } from 'googleapis';

// Column mapping: F=5, G=6, H=7, I=8, J=9, K=10, L=11, M=12, N=13
const NEST_COLUMNS = {
  nest80: 5,  // F
  nest100: 7, // H
  nest120: 9, // J
  nest140: 11, // L
  nest160: 13, // N
} as const;

const NEST_VALUES = ['nest80', 'nest100', 'nest120', 'nest140', 'nest160'] as const;

type NestSize = typeof NEST_VALUES[number];

interface PricingData {
  nest: {
    [key in NestSize]: {
      price: number;
      pricePerSqm: number;
      squareMeters: number;
    };
  };
  geschossdecke: {
    basePrice: number;
    maxAmounts: {
      [key in NestSize]: number;
    };
  };
  gebaeudehuelle: {
    [key: string]: {
      [key in NestSize]: number;
    };
  };
  innenverkleidung: {
    [key: string]: {
      [key in NestSize]: number;
    };
  };
  pvanlage: {
    pricesByQuantity: {
      [key in NestSize]: {
        [quantity: number]: number;
      };
    };
    maxModules: {
      [key in NestSize]: number;
    };
  };
  bodenbelag: {
    [key: string]: {
      [key in NestSize]: number;
    };
  };
  bodenaufbau: {
    [key: string]: {
      [key in NestSize]: number;
    };
  };
  belichtungspaket: {
    [key: string]: {
      [key in NestSize]: number;
    };
  };
  fenster: {
    totalPrices: {
      [key: string]: {
        [key in NestSize]: {
          [belichtung: string]: number; // light, medium, bright - TOTAL prices from F70-N78
        };
      };
    };
  };
  optionen: {
    kaminschacht: number;
    fundament: {
      [key in NestSize]: number;
    };
  };
  planungspaket: {
    plus: {
      [key in NestSize]: number;
    };
    pro: {
      [key in NestSize]: number;
    };
  };
}

class PricingSheetService {
  private sheets: ReturnType<typeof google.sheets>;
  private spreadsheetId: string;
  private cache: PricingData | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
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

  private getCredentials() {
    const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
    
    if (keyFile && keyFile.endsWith('.json')) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const path = require('path');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const fs = require('fs');
        const keyFilePath = path.resolve(process.cwd(), keyFile);
        
        if (fs.existsSync(keyFilePath)) {
          const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
          return JSON.parse(keyFileContent);
        }
      } catch (error) {
        console.warn('Could not load key file, trying environment variables:', error);
      }
    }

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
      private_key: key.replace(/\\n/g, '\n'),
    };
  }

  private parseNumber(value: unknown, isPrice: boolean = false): number {
    if (typeof value === 'number') {
      // If it's a price and value looks like thousands (< 1000), multiply by 1000
      const result = (isPrice && value < 1000 && value > 0) ? value * 1000 : value;
      if (isPrice && value < 1000 && value > 0) {
        console.log(`[DEBUG] Multiplying price: ${value} * 1000 = ${result}`);
      }
      return result;
    }
    if (typeof value === 'string') {
      const cleaned = value.replace(/[€$,\s]/g, '');
      const parsed = parseFloat(cleaned);
      if (isNaN(parsed)) return 0;
      // If it's a price and value looks like thousands (< 1000), multiply by 1000
      const result = (isPrice && parsed < 1000 && parsed > 0) ? parsed * 1000 : parsed;
      if (isPrice && parsed < 1000 && parsed > 0) {
        console.log(`[DEBUG] Multiplying price (string): ${parsed} * 1000 = ${result}`);
      }
      return result;
    }
    return 0;
  }

  private async fetchSheet(): Promise<unknown[][]> {
    try {
      console.log('[DEBUG] Fetching sheet:', this.spreadsheetId, 'Range: Preistabelle_Verkauf!A1:N100');
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Preistabelle_Verkauf!A1:N100',
      });

      console.log('[DEBUG] Sheet fetch successful, rows:', response.data.values?.length || 0);
      return (response.data.values || []) as unknown[][];
    } catch (error) {
      console.error('[ERROR] Error fetching pricing sheet:', error);
      if (error instanceof Error) {
        console.error('[ERROR] Error message:', error.message);
        console.error('[ERROR] Error stack:', error.stack);
      }
      throw error;
    }
  }

  private parseNestPrices(rows: unknown[][]): PricingData['nest'] {
    const nestData: Partial<PricingData['nest']> = {};

    // Row 10: Module names (F10, H10, J10, L10, N10)
    // Row 11: Prices (F11, H11, J11, L11, N11)
    // Row 12: Square meters (F12, H12, J12, L12, N12)

    const row11 = rows[10] || []; // Row 11
    const row12 = rows[11] || []; // Row 12

    NEST_VALUES.forEach((nestSize) => {
      const colIndex = NEST_COLUMNS[nestSize];
      const price = this.parseNumber(row11[colIndex], true); // Price in thousands
      const squareMeters = this.parseNumber(row12[colIndex]); // Not a price
      const pricePerSqm = squareMeters > 0 ? price / squareMeters : 0;

      nestData[nestSize] = {
        price,
        pricePerSqm,
        squareMeters,
      };
    });

    return nestData as PricingData['nest'];
  }

  private parseGeschossdecke(rows: unknown[][]): PricingData['geschossdecke'] {
    const row7 = rows[6] || []; // Row 7 (0-indexed: 6)

    const basePrice = this.parseNumber(row7[3], true); // D7 is a price in thousands
    
    const maxAmounts: Partial<PricingData['geschossdecke']['maxAmounts']> = {};
    // Fixed column mapping: F=5, H=7, J=9, L=11, N=13 (same as nest sizes)
    maxAmounts.nest80 = this.parseNumber(row7[5]); // F7 is a quantity, not a price
    maxAmounts.nest100 = this.parseNumber(row7[7]); // H7
    maxAmounts.nest120 = this.parseNumber(row7[9]); // J7
    maxAmounts.nest140 = this.parseNumber(row7[11]); // L7
    maxAmounts.nest160 = this.parseNumber(row7[13]); // N7

    return {
      basePrice,
      maxAmounts: maxAmounts as PricingData['geschossdecke']['maxAmounts'],
    };
  }

  private parseGebaeudehuelle(rows: unknown[][]): PricingData['gebaeudehuelle'] {
    // Rows 17-20 (0-indexed: 16-19), Column E has option names
    // Columns F-N have prices for each nest size
    
    const gebaeudehuelleData: PricingData['gebaeudehuelle'] = {};
    
    // Option mapping: lärche → holzlattung, trapezblech → trapezblech, 
    // platte black → fassadenplatten_schwarz, platte white → fassadenplatten_weiss
    const optionMapping: Record<string, string> = {
      'lärche': 'holzlattung',
      'trapezblech': 'trapezblech',
      'platte black': 'fassadenplatten_schwarz',
      'platte white': 'fassadenplatten_weiss',
    };

    for (let rowIndex = 16; rowIndex <= 19; rowIndex++) {
      const row = rows[rowIndex] || [];
      const optionName = String(row[4] || '').toLowerCase().trim(); // Column E (index 4)
      
      if (!optionName) continue;

      const mappedKey = optionMapping[optionName] || optionName;
      gebaeudehuelleData[mappedKey] = {} as { [key in NestSize]: number };

      NEST_VALUES.forEach((nestSize) => {
        const colIndex = NEST_COLUMNS[nestSize];
        gebaeudehuelleData[mappedKey][nestSize] = this.parseNumber(row[colIndex], true); // Prices in thousands
      });
    }

    return gebaeudehuelleData;
  }

  private parseInnenverkleidung(rows: unknown[][]): PricingData['innenverkleidung'] {
    // Rows 24-26 (0-indexed: 23-25), Column E has option names
    const innenverkleidungData: PricingData['innenverkleidung'] = {};

    const optionMapping: Record<string, string> = {
      'eiche': 'steirische_eiche',
      'fichte': 'fichte',
      'laerche': 'laerche',
    };

    for (let rowIndex = 23; rowIndex <= 25; rowIndex++) {
      const row = rows[rowIndex] || [];
      const optionName = String(row[4] || '').toLowerCase().trim();
      
      if (!optionName) continue;

      const mappedKey = optionMapping[optionName] || optionName;
      innenverkleidungData[mappedKey] = {} as { [key in NestSize]: number };

      NEST_VALUES.forEach((nestSize) => {
        const colIndex = NEST_COLUMNS[nestSize];
        innenverkleidungData[mappedKey][nestSize] = this.parseNumber(row[colIndex], true); // Prices in thousands
      });
    }

    return innenverkleidungData;
  }

  private parsePvAnlage(rows: unknown[][]): PricingData['pvanlage'] {
    // Rows 29-44 (0-indexed: 28-43) contain prices by quantity
    // Each row represents a different quantity (1-16 modules)
    // Columns F-N represent different Nest sizes
    
    const pricesByQuantity: PricingData['pvanlage']['pricesByQuantity'] = {
      nest80: {},
      nest100: {},
      nest120: {},
      nest140: {},
      nest160: {},
    };

    // Parse rows 29-44 (quantities 1-16)
    for (let i = 0; i < 16; i++) {
      const rowIndex = 28 + i; // Start at row 29 (0-indexed: 28)
      if (rowIndex >= rows.length) break;
      
      const row = rows[rowIndex] || [];
      const quantity = i + 1; // Quantity 1-16
      
      NEST_VALUES.forEach((nestSize) => {
        const colIndex = NEST_COLUMNS[nestSize];
        const price = this.parseNumber(row[colIndex], true); // Prices in thousands
        pricesByQuantity[nestSize][quantity] = price;
      });
    }

    // Hardcoded max modules per Nest size
    const maxModules: PricingData['pvanlage']['maxModules'] = {
      nest80: 8,
      nest100: 10,
      nest120: 12,
      nest140: 14,
      nest160: 16,
    };

    console.log('[DEBUG] Parsed PV-Anlage data:', JSON.stringify(pricesByQuantity, null, 2));

    return {
      pricesByQuantity,
      maxModules,
    };
  }


  private parseBodenbelag(rows: unknown[][]): PricingData['bodenbelag'] {
    // Find rows with bodenbelag options (around row 50-53)
    // Column E has option names
    const bodenbelagData: PricingData['bodenbelag'] = {};

    const optionMapping: Record<string, string> = {
      'bauherr': 'ohne_belag', // standard
      'eiche': 'parkett',
      'kalkstein': 'kalkstein_kanafar',
      'dunkler stein': 'schiefer_massiv',
    };

    // Scan rows to find bodenbelag section (look for "bodenbelag" in column E)
    let startRow = -1;
    for (let i = 0; i < rows.length; i++) {
      const cellE = String(rows[i]?.[4] || '').toLowerCase();
      if (cellE.includes('bodenbelag') || cellE.includes('boden')) {
        startRow = i + 1; // Next rows contain options
        break;
      }
    }

    if (startRow === -1) {
      console.warn('Bodenbelag section not found');
      return bodenbelagData;
    }

    // Parse next 4 rows (assuming 4 options)
    for (let rowIndex = startRow; rowIndex < startRow + 4 && rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex] || [];
      const optionName = String(row[4] || '').toLowerCase().trim();
      
      if (!optionName) continue;

      const mappedKey = optionMapping[optionName] || optionName;
      bodenbelagData[mappedKey] = {} as { [key in NestSize]: number };

      NEST_VALUES.forEach((nestSize) => {
        const colIndex = NEST_COLUMNS[nestSize];
        bodenbelagData[mappedKey][nestSize] = this.parseNumber(row[colIndex], true); // Prices in thousands
      });
    }

    return bodenbelagData;
  }

  private parseBodenaufbau(rows: unknown[][]): PricingData['bodenaufbau'] {
    // Find rows with heizung/bodenaufbau options (around row 60-62)
    const bodenaufbauData: PricingData['bodenaufbau'] = {};

    const optionMapping: Record<string, string> = {
      'ohne heizung': 'ohne_heizung',
      'elektrische fbh': 'elektrische_fussbodenheizung',
      'wassergeführte fbh': 'wassergefuehrte_fussbodenheizung',
    };

    let startRow = -1;
    for (let i = 0; i < rows.length; i++) {
      const cellE = String(rows[i]?.[4] || '').toLowerCase();
      if (cellE.includes('heizung') || cellE.includes('bodenaufbau')) {
        startRow = i + 1;
        break;
      }
    }

    if (startRow === -1) {
      console.warn('Bodenaufbau section not found');
      return bodenaufbauData;
    }

    for (let rowIndex = startRow; rowIndex < startRow + 3 && rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex] || [];
      const optionName = String(row[4] || '').toLowerCase().trim();
      
      if (!optionName) continue;

      const mappedKey = optionMapping[optionName] || optionName;
      bodenaufbauData[mappedKey] = {} as { [key in NestSize]: number };

      NEST_VALUES.forEach((nestSize) => {
        const colIndex = NEST_COLUMNS[nestSize];
        bodenaufbauData[mappedKey][nestSize] = this.parseNumber(row[colIndex], true); // Prices in thousands
      });
    }

    return bodenaufbauData;
  }

  private parseBelichtungspaket(rows: unknown[][]): PricingData['belichtungspaket'] {
    // Find belichtungspaket section (around row 65-67)
    const belichtungspaketData: PricingData['belichtungspaket'] = {};

    let startRow = -1;
    for (let i = 0; i < rows.length; i++) {
      const cellE = String(rows[i]?.[4] || '').toLowerCase();
      if (cellE.includes('belichtung')) {
        startRow = i + 1;
        break;
      }
    }

    if (startRow === -1) {
      console.warn('Belichtungspaket section not found');
      return belichtungspaketData;
    }

    const optionMapping: Record<string, string> = {
      'light': 'light',
      'medium': 'medium',
      'bright': 'bright',
    };

    for (let rowIndex = startRow; rowIndex < startRow + 3 && rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex] || [];
      const optionName = String(row[4] || '').toLowerCase().trim();
      
      if (!optionName) continue;

      const mappedKey = optionMapping[optionName] || optionName;
      belichtungspaketData[mappedKey] = {} as { [key in NestSize]: number };

      NEST_VALUES.forEach((nestSize) => {
        const colIndex = NEST_COLUMNS[nestSize];
        belichtungspaketData[mappedKey][nestSize] = this.parseNumber(row[colIndex], true); // Prices in thousands
      });
    }

    return belichtungspaketData;
  }

  private parseFenster(rows: unknown[][]): PricingData['fenster'] {
    // Rows 70-78 contain TOTAL combination prices (belichtungspaket × fenster × nest size)
    // Actual spreadsheet order: Holz (70-72), Holz-Alu (73-75), Kunststoff (76-78)
    // Store total prices directly (price/m² calculated when needed for display)
    
    const fensterData: PricingData['fenster'] = {
      totalPrices: {},
    };

    // Fenster options in spreadsheet order: holz, aluminium_schwarz (Holz-Alu), pvc_fenster (Kunststoff)
    const fensterOptions = ['holz', 'aluminium_schwarz', 'pvc_fenster'];
    const belichtungOptions = ['light', 'medium', 'bright'];

    // Parse rows 70-78 (0-indexed: 69-77)
    // Structure: each fenster option has 3 rows (one per belichtungspaket option)
    let rowIndex = 69; // Start at row 70 (0-indexed: 69)
    
    fensterOptions.forEach((fensterOption) => {
      fensterData.totalPrices[fensterOption] = {} as {
        [key in NestSize]: { [belichtung: string]: number };
      };

      belichtungOptions.forEach((belichtungOption) => {
        if (rowIndex >= rows.length) return;

        const row = rows[rowIndex] || [];
        
        NEST_VALUES.forEach((nestSize) => {
          const colIndex = NEST_COLUMNS[nestSize];
          const totalPrice = this.parseNumber(row[colIndex], true); // Total price in thousands from F70-N78

          if (!fensterData.totalPrices[fensterOption][nestSize]) {
            fensterData.totalPrices[fensterOption][nestSize] = {} as { [belichtung: string]: number };
          }
          
          // Store total price (price/m² calculated when needed)
          fensterData.totalPrices[fensterOption][nestSize][belichtungOption] = totalPrice;
        });

        rowIndex++;
      });
    });

    console.log('[DEBUG] Parsed fenster data:', JSON.stringify(fensterData, null, 2));
    return fensterData;
  }

  private parseOptionen(rows: unknown[][]): PricingData['optionen'] {
    // Kaminschachtvorbereitung: fixed price (find in rows ~80-83)
    // Fundament: F83-M83 (nest-size dependent)
    
    let kaminschachtPrice = 2000; // Default fallback
    const fundamentPrices: Partial<PricingData['optionen']['fundament']> = {};

    // Find kaminschacht price
    for (let i = 79; i < 84 && i < rows.length; i++) {
      const cellE = String(rows[i]?.[4] || '').toLowerCase();
      if (cellE.includes('kamin') || cellE.includes('kaminschacht')) {
        // Price might be in a different column, check common columns
        kaminschachtPrice = this.parseNumber(rows[i]?.[5] || rows[i]?.[6] || 2000, true);
        break;
      }
    }

    // Parse fundament prices from row 83 (0-indexed: 82)
    const row83 = rows[82] || [];
    fundamentPrices.nest80 = this.parseNumber(row83[5], true); // F83 in thousands
    fundamentPrices.nest100 = this.parseNumber(row83[7], true); // H83
    fundamentPrices.nest120 = this.parseNumber(row83[9], true); // J83
    fundamentPrices.nest140 = this.parseNumber(row83[11], true); // L83
    fundamentPrices.nest160 = this.parseNumber(row83[13], true); // N83

    return {
      kaminschacht: kaminschachtPrice,
      fundament: fundamentPrices as PricingData['optionen']['fundament'],
    };
  }
  private parsePlanungspakete(rows: unknown[][]): PricingData['planungspaket'] {
    // Rows 88-90 (0-indexed: 87-89)
    // Basis (row 88) = 0
    // Plus (row 89) = 9600
    // Pro (row 90) = 12700
    // Price is same across all nest sizes (columns F-N)
    
    const plusPrice = this.parseNumber(rows[88]?.[5], true) || 9600; // F89 (0-indexed: row 88, col 5)
    const proPrice = this.parseNumber(rows[89]?.[5], true) || 12700; // F90 (0-indexed: row 89, col 5)
    
    console.log('[DEBUG] Planungspakete prices - Plus:', plusPrice, 'Pro:', proPrice);
    
    return {
      plus: {
        nest80: plusPrice,
        nest100: plusPrice,
        nest120: plusPrice,
        nest140: plusPrice,
        nest160: plusPrice,
      },
      pro: {
        nest80: proPrice,
        nest100: proPrice,
        nest120: proPrice,
        nest140: proPrice,
        nest160: proPrice,
      },
    };
  }

  async loadPricingData(forceRefresh = false): Promise<PricingData> {
    const now = Date.now();
    
    if (!forceRefresh && this.cache && (now - this.cacheTimestamp) < this.CACHE_TTL) {
      return this.cache;
    }

    console.log('📊 Loading pricing data from Google Sheets...');
    const rows = await this.fetchSheet();

    const pricingData: PricingData = {
      nest: this.parseNestPrices(rows),
      geschossdecke: this.parseGeschossdecke(rows),
      gebaeudehuelle: this.parseGebaeudehuelle(rows),
      innenverkleidung: this.parseInnenverkleidung(rows),
      pvanlage: this.parsePvAnlage(rows),
      bodenbelag: this.parseBodenbelag(rows),
      bodenaufbau: this.parseBodenaufbau(rows),
      belichtungspaket: this.parseBelichtungspaket(rows),
      fenster: this.parseFenster(rows),
      optionen: this.parseOptionen(rows),
      planungspaket: this.parsePlanungspakete(rows),
    };

    this.cache = pricingData;
    this.cacheTimestamp = now;
    
    console.log('✅ Pricing data loaded successfully');
    return pricingData;
  }

  async getPricingData(): Promise<PricingData> {
    return this.loadPricingData();
  }

  /**
   * Sync pricing data to database (for cron job)
   */
  async syncToDatabase(): Promise<void> {
    const { savePricingSnapshot } = await import('./pricing-db-service');
    const pricingData = await this.loadPricingData(true); // Force refresh
    await savePricingSnapshot(pricingData, 'cron');
  }

  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }
}

// Singleton instance
let pricingServiceInstance: PricingSheetService | null = null;

export function getPricingSheetService(): PricingSheetService {
  if (!pricingServiceInstance) {
    pricingServiceInstance = new PricingSheetService();
  }
  return pricingServiceInstance;
}

export type { PricingData, NestSize };

