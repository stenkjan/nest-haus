/**
 * Pricing Sheet Service
 * 
 * Parses pricing data from Google Sheets "Preistabelle Verkauf" tab
 * Single sheet with all sections, column E contains section headers and option names
 * Prices in columns F-N (Nest 80-160)
 * 
 * NOTE: Columns G, I, K, M are HIDDEN in Google Sheets (between visible columns F, H, J, L, N)
 * Row numbers referenced are 1-indexed as displayed in Google Sheets (e.g., E10 = row 10 in sheets = index 9 in code)
 * 
 * GOOGLE SHEETS STRUCTURE:
 * E7:  Geschossdecke (name in E7, price in D7)
 * E10: Nest (section title)
 * E16: Gebäudehülle (section title) - E17: Trapezblech (0€), E18: Holzlattung Lärche Natur
 * E22: Innenverkleidung (section title)
 * E28: PV-Anlage (section title)
 * E49: Bodenbelag (section title)
 * E56: Bodenaufbau (section title)
 * E63: Belichtungspaket (section title)
 * E69: Fenster & Türen (section title)
 * E81: Optionen (section title)
 * E86: Die Planungspakete (section title)
 */

import { google } from 'googleapis';

// Special value indicating "Preis auf Anfrage" (price on request)
const PRICE_ON_REQUEST = -1;

// Column mapping: F=5, G=6, H=7, I=8, J=9, K=10, L=11, M=12, N=13
// NOTE: Columns G, I, K, M are HIDDEN in Google Sheets
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
    // Check for "-" string to indicate "Preis auf Anfrage"
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '-') {
        return PRICE_ON_REQUEST; // Return -1 for dash prices
      }
      const cleaned = trimmed.replace(/[€$,\s]/g, '');
      const parsed = parseFloat(cleaned);
      if (isNaN(parsed)) return 0;
      // CRITICAL: Numbers >= 1000 are NEVER in thousands format!
      // Only multiply by 1000 if value < 1000 AND value looks like decimal thousands (e.g., 188.619)
      return (isPrice && parsed < 1000 && parsed > 0 && parsed < 500) ? parsed * 1000 : parsed;
    }
    if (typeof value === 'number') {
      // CRITICAL: Numbers >= 1000 are NEVER in thousands format!
      // Only multiply by 1000 if value < 1000 AND value looks like decimal thousands (e.g., 188.619)
      // Numbers like 887 should stay as 887 (not multiplied)
      return (isPrice && value < 1000 && value > 0 && value < 500) ? value * 1000 : value;
    }
    return 0;
  }

  private async fetchSheet(): Promise<unknown[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Preistabelle_Verkauf!A1:N100',
      });

      return (response.data.values || []) as unknown[][];
    } catch (error) {
      console.error('Error fetching pricing sheet:', error);
      throw error;
    }
  }

  private parseNestPrices(rows: unknown[][]): PricingData['nest'] {
    const nestData: Partial<PricingData['nest']> = {};

    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E10: Section title "Nest"
    // Row 10 (index 9): Module names in F10, H10, J10, L10, N10
    // Row 11 (index 10): Prices in F11, H11, J11, L11, N11
    // Row 12 (index 11): Square meters in F12, H12, J12, L12, N12

    const row11 = rows[10] || []; // Row 11 (0-indexed: 10)
    const row12 = rows[11] || []; // Row 12 (0-indexed: 11)

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
    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E7: Section name "Geschossdecke"
    // D7: Base price per unit
    // F7-N7: Max quantities per nest size
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
    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E16: Section title "Gebäudehülle"
    // E17: Trapezblech (0€ across all nest sizes in F17-N17) - SWITCHED TO ROW 17!
    // E18: Holzlattung Lärche Natur - SWITCHED TO ROW 18!
    // E19: Platte Black (Fassadenplatten Schwarz)
    // E20: Platte White (Fassadenplatten Weiß)
    // Columns F-N have prices for each nest size
    
    const gebaeudehuelleData: PricingData['gebaeudehuelle'] = {};
    
    // CRITICAL: Trapezblech and Holzlattung SWITCHED rows in Google Sheets
    // NEW STRUCTURE: Trapezblech is now row 17 (0€), Holzlattung is row 18
    const optionMapping: Record<string, string> = {
      'trapezblech': 'trapezblech',  // NOW ROW 17 (was row 18)
      'holzlattung lärche natur': 'holzlattung',  // NOW ROW 18 (was row 17)
      'lärche': 'holzlattung',  // Fallback for abbreviated name
      'platte black': 'fassadenplatten_schwarz',  // ROW 19
      'platte white': 'fassadenplatten_weiss',   // ROW 20
    };

    // Parse rows 17-20 (0-indexed: 16-19)
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
    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E22: Section title "Innenverkleidung"
    // E23: Ohne Innenverkleidung (baseline, 0€ for all sizes)
    // E24: Fichte
    // E25: Lärche
    // E26: Eiche
    const innenverkleidungData: PricingData['innenverkleidung'] = {};

    const optionMapping: Record<string, string> = {
      'ohne innenverkleidung': 'ohne_innenverkleidung',
      'fichte': 'fichte',
      'lärche': 'laerche',   // UTF-8 version from Google Sheets (ä = umlaut)
      'laerche': 'laerche',  // ASCII version fallback
      'eiche': 'steirische_eiche',
    };

    // Parse rows 23-26 (0-indexed: 22-25)
    for (let rowIndex = 22; rowIndex <= 25; rowIndex++) {
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
    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E28: Section title "PV-Anlage"
    // E29-E44: "1 Module", "2 Module", ... "16 Module" (quantity labels)
    // F29-N44: Prices for each quantity × nest size combination
    // Each row represents a different quantity (1-16 modules)
    // Columns F-N represent different Nest sizes
    
    const pricesByQuantity: PricingData['pvanlage']['pricesByQuantity'] = {
      nest80: {},
      nest100: {},
      nest120: {},
      nest140: {},
      nest160: {},
    };

    // Parse rows 29-44 (0-indexed: 28-43) for quantities 1-16
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

    return {
      pricesByQuantity,
      maxModules,
    };
  }


  private parseBodenbelag(rows: unknown[][]): PricingData['bodenbelag'] {
    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E49: Section title "Bodenbelag"
    // E50-E53: Option names (bauherr, eiche, kalkstein, dunkler stein)
    // F50-N53: Prices for each option × nest size
    const bodenbelagData: PricingData['bodenbelag'] = {};

    const optionMapping: Record<string, string> = {
      'bauherr': 'ohne_belag', // standard baseline
      'eiche': 'parkett',
      'kalkstein': 'kalkstein_kanafar',
      'dunkler stein': 'schiefer_massiv',
    };

    // Parse rows 50-53 (0-indexed: 49-52)
    const startRow = 49; // Row 50 in sheets (0-indexed: 49)
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
    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E56: Section title "Bodenaufbau"
    // E57: Ohne Heizung (baseline, 0€)
    // E58: Elektrische Fußbodenheizung (FULL SPELLING, not "FBH")
    // E59: Wassergeführte Fußbodenheizung (FULL SPELLING, not "FBH")
    // F57-N59: Prices for each option × nest size
    const bodenaufbauData: PricingData['bodenaufbau'] = {};

    // CRITICAL: Google Sheets now uses FULL SPELLINGS, not abbreviations
    const optionMapping: Record<string, string> = {
      'ohne heizung': 'ohne_heizung',
      'elektrische fußbodenheizung': 'elektrische_fussbodenheizung',  // FULL NAME NOW
      'elektrische fbh': 'elektrische_fussbodenheizung',  // Backwards compatibility
      'wassergeführte fußbodenheizung': 'wassergefuehrte_fussbodenheizung',  // FULL NAME NOW
      'wassergeführte fbh': 'wassergefuehrte_fussbodenheizung',  // Backwards compatibility
      'wassergef. fbh': 'wassergefuehrte_fussbodenheizung', // Backwards compatibility
    };

    // Parse rows 57-59 (0-indexed: 56-58)
    const startRow = 56; // Row 57 in sheets (0-indexed: 56)
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
    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E63: Section title "Belichtungspaket"
    // E64: Light
    // E65: Medium
    // E66: Bright
    // F64-N66: REFERENCE prices (actual prices come from Fenster & Türen F70-N78)
    const belichtungspaketData: PricingData['belichtungspaket'] = {};

    const optionMapping: Record<string, string> = {
      'light': 'light',
      'medium': 'medium',
      'bright': 'bright',
    };

    // Parse rows 64-66 (0-indexed: 63-65)
    const startRow = 63; // Row 64 in sheets (0-indexed: 63)
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
    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E69: Section title "Fenster & Türen"
    // E70-E78: Fenster combinations (9 rows: 3 materials × 3 belichtung levels)
    //   E70-E72: Holz + light/medium/bright
    //   E73-E75: Holz-Alu + light/medium/bright
    //   E76-E78: Kunststoff + light/medium/bright
    // F70-N78: TOTAL combination prices (belichtungspaket × fenster × nest size)
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
    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E81: Section title "Optionen"
    // E82: Kaminschachtvorbereitung
    // E83: Fundament
    // F82-N82: Kaminschacht prices (fixed price, same across sizes)
    // F83-N83: Fundament prices (nest-size dependent)
    
    // Parse Kaminschacht from row 82 (0-indexed: 81)
    const row82 = rows[81] || [];
    // Kaminschacht is genuinely 887€ (not in thousands format like other prices)
    // So parse as regular number, NOT as thousands format
    const kaminschachtPrice = this.parseNumber(row82[5] || 2000, false); // F82, false = NOT a thousands-format price
    
    // Parse Fundament prices from row 83 (0-indexed: 82)
    const row83 = rows[82] || [];
    const fundamentPrices: Partial<PricingData['optionen']['fundament']> = {};
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
    // GOOGLE SHEETS STRUCTURE (1-indexed as displayed in sheets):
    // E86: Section title "Die Planungspakete"
    // E87: Basis (always 0€)
    // E88: Plus
    // E89: Pro
    // F87-N89: Prices (same across all nest sizes for each package)
    // NOTE: THESE ARE THE ONLY PRICES THAT CHANGED IN THIS OVERHAUL
    
    // Parse rows 88-89 (0-indexed: 87-88) for Plus and Pro
    const plusPrice = this.parseNumber(rows[87]?.[5], true) || 9600; // F88 (0-indexed: row 87, col 5)
    const proPrice = this.parseNumber(rows[88]?.[5], true) || 12700; // F89 (0-indexed: row 88, col 5)
    
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

