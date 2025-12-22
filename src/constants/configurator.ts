/**
 * Image mapping constants for the configurator
 * Following project rules: shared constants in src/constants/
 */

// Nest size mapping for images (nest values to image sizes)
export const NEST_SIZE_MAPPING: Record<string, string> = {
  'nest80': '75',   // nest80 -> 75 in images
  'nest100': '95',  // nest100 -> 95 in images
  'nest120': '115', // nest120 -> 115 in images
  'nest140': '135', // nest140 -> 135 in images
  'nest160': '155'  // nest160 -> 155 in images
} as const;

// Gebäudehülle mapping for exterior images
export const GEBAEUDE_EXTERIOR_MAPPING: Record<string, string> = {
  'trapezblech': 'trapezblech',
  'holzlattung': 'holzlattung',
  'fassadenplatten_schwarz': 'plattenschwarz',
  'fassadenplatten_weiss': 'plattenweiss'
} as const;

// Stirnseite mapping for all nest sizes
export const STIRNSEITE_MAPPING: Record<string, string> = {
  'fassadenplatten_schwarz': 'stirnseitePlattenSchwarz',
  'fassadenplatten_weiss': 'stirnseitePlattenWeiss',
  'holzlattung': 'stirnseiteHolzfassade',
  'trapezblech': 'stirnseiteTrapezblech'
} as const;

// Gebäudehülle prefix mapping for interior images
export const GEBAEUDE_PREFIX_MAPPING: Record<string, string> = {
  'trapezblech': 'trapezblech',
  'holzlattung': 'holzlattung',
  'fassadenplatten_schwarz': 'plattenschwarz',
  'fassadenplatten_weiss': 'plattenweiss'
} as const;

// Innenverkleidung mapping
export const INNENVERKLEIDUNG_MAPPING: Record<string, string> = {
  'laerche': 'holznatur',
  'fichte': 'holzweiss',
  'steirische_eiche': 'eiche'
} as const;

// Fußboden mapping  
export const FUSSBODEN_MAPPING: Record<string, string> = {
  'parkett': 'parkett',
  'kalkstein_kanafar': 'kalkstein',
  'schiefer_massiv': 'granit' // Display as schiefer but paths use granit
} as const;

// Special mapping for holzlattung + fussboden combinations
export const FUSSBODEN_HOLZLATTUNG_MAPPING: Record<string, string> = {
  'parkett': 'parkett',
  'kalkstein_kanafar': 'kalkstein',
  'schiefer_massiv': 'schiefer' // For holzlattung, use schiefer paths
} as const;

// PV image mapping based on gebäudehülle
export const PV_IMAGE_MAPPING: Record<string, string> = {
  'holzlattung': 'pv_holzfassade',
  'trapezblech': 'pv_trapezblech',
  'fassadenplatten_schwarz': 'pv_plattenschwarz',
  'fassadenplatten_weiss': 'pv_plattenweiss'
} as const;

// Fenster image mapping
export const FENSTER_IMAGE_MAPPING: Record<string, string> = {
  'pvc_fenster': 'pvc',
  'holz': 'fichte', // Renamed from 'fichte' to 'holz', but still maps to fichte image
  'steirische_eiche': 'eiche', // Keep for backward compatibility if needed
  'aluminium_schwarz': 'aluminium', // Renamed from 'aluminium', maps to same image
  'aluminium_weiss': 'aluminium' // New option, maps to same aluminium image for now
} as const;

// Exact mappings for specific interior combinations
export const INTERIOR_EXACT_MAPPINGS: Record<string, string> = {
  // Trapezblech combinations
  'trapezblech_laerche_parkett': 'trapezblech_holznatur_parkett',
  'trapezblech_laerche_kalkstein_kanafar': 'trapezblech_holznatur_kalkstein',
  'trapezblech_laerche_schiefer_massiv': 'trapezblech_holznatur_schiefer',
  'trapezblech_fichte_parkett': 'trapezblech_holzweiss_parkett',
  'trapezblech_fichte_kalkstein_kanafar': 'trapezblech_holzweiss_kalkstein',
  'trapezblech_fichte_schiefer_massiv': 'trapezblech_holzweiss_schiefer',
  'trapezblech_steirische_eiche_parkett': 'trapezblech_eiche_parkett',
  'trapezblech_steirische_eiche_kalkstein_kanafar': 'trapezblech_eiche_kalkstein',
  'trapezblech_steirische_eiche_schiefer_massiv': 'trapezblech_eiche_schiefer',

  // Holzlattung combinations
  'holzlattung_laerche_parkett': 'holzlattung_holznatur_parkett',
  'holzlattung_laerche_kalkstein_kanafar': 'holzlattung_holznatur_kalkstein',
  'holzlattung_laerche_schiefer_massiv': 'holzlattung_holznatur_schiefer',
  'holzlattung_fichte_parkett': 'holzlattung_holzweiss_parkett',
  'holzlattung_fichte_kalkstein_kanafar': 'holzlattung_holzweiss_kalkstein',
  'holzlattung_fichte_schiefer_massiv': 'holzlattung_holzweiss_schiefer',
  'holzlattung_steirische_eiche_parkett': 'holzlattung_eiche_parkett',
  'holzlattung_steirische_eiche_kalkstein_kanafar': 'holzlattung_eiche_kalkstein',
  'holzlattung_steirische_eiche_schiefer_massiv': 'holzlattung_eiche_schiefer',

  // Fassadenplatten schwarz combinations
  'fassadenplatten_schwarz_laerche_parkett': 'plattenschwarz_holznatur_parkett',
  'fassadenplatten_schwarz_laerche_kalkstein_kanafar': 'plattenschwarz_holznatur_kalkstein',
  'fassadenplatten_schwarz_laerche_schiefer_massiv': 'plattenschwarz_holznatur_schiefer',
  'fassadenplatten_schwarz_fichte_parkett': 'plattenschwarz_holzweiss_parkett',
  'fassadenplatten_schwarz_fichte_kalkstein_kanafar': 'plattenschwarz_holzweiss_kalkstein',
  'fassadenplatten_schwarz_fichte_schiefer_massiv': 'plattenschwarz_holzweiss_schiefer',
  'fassadenplatten_schwarz_steirische_eiche_parkett': 'plattenschwarz_eiche_parkett',
  'fassadenplatten_schwarz_steirische_eiche_kalkstein_kanafar': 'plattenschwarz_eiche_kalkstein',
  'fassadenplatten_schwarz_steirische_eiche_schiefer_massiv': 'plattenschwarz_eiche_schiefer',

  // Fassadenplatten weiss combinations
  'fassadenplatten_weiss_laerche_parkett': 'plattenweiss_holznatur_parkett',
  'fassadenplatten_weiss_laerche_kalkstein_kanafar': 'plattenweiss_holznatur_kalkstein',
  'fassadenplatten_weiss_laerche_schiefer_massiv': 'plattenweiss_holznatur_schiefer',
  'fassadenplatten_weiss_fichte_parkett': 'plattenweiss_holzweiss_parkett',
  'fassadenplatten_weiss_fichte_kalkstein_kanafar': 'plattenweiss_holzweiss_kalkstein',
  'fassadenplatten_weiss_fichte_schiefer_massiv': 'plattenweiss_holzweiss_schiefer',
  'fassadenplatten_weiss_steirische_eiche_parkett': 'plattenweiss_eiche_parkett',
  'fassadenplatten_weiss_steirische_eiche_kalkstein_kanafar': 'plattenweiss_eiche_kalkstein',
  'fassadenplatten_weiss_steirische_eiche_schiefer_massiv': 'plattenweiss_eiche_schiefer',

  // ohne_belag combinations - use new ohne_belag interior images
  // Trapezblech ohne_belag combinations
  'trapezblech_laerche_ohne_belag': 'trapezblech_holznatur_ohne_belag',
  'trapezblech_fichte_ohne_belag': 'trapezblech_holzweiss_ohne_belag',
  'trapezblech_steirische_eiche_ohne_belag': 'trapezblech_eiche_ohne_belag',

  // Holzlattung ohne_belag combinations
  'holzlattung_laerche_ohne_belag': 'holzlattung_holznatur_ohne_belag',
  'holzlattung_fichte_ohne_belag': 'holzlattung_holzweiss_ohne_belag',
  'holzlattung_steirische_eiche_ohne_belag': 'holzlattung_eiche_ohne_belag',

  // Fassadenplatten schwarz ohne_belag combinations
  'fassadenplatten_schwarz_laerche_ohne_belag': 'plattenschwarz_holznatur_ohne_belag',
  'fassadenplatten_schwarz_fichte_ohne_belag': 'plattenschwarz_holzweiss_ohne_belag',
  'fassadenplatten_schwarz_steirische_eiche_ohne_belag': 'plattenschwarz_eiche_ohne_belag',

  // Fassadenplatten weiss ohne_belag combinations
  'fassadenplatten_weiss_laerche_ohne_belag': 'plattenweiss_holznatur_ohne_belag',
  'fassadenplatten_weiss_fichte_ohne_belag': 'plattenweiss_holzweiss_ohne_belag',
  'fassadenplatten_weiss_steirische_eiche_ohne_belag': 'plattenweiss_eiche_ohne_belag'
} as const;

// Valid view types
export const VALID_VIEW_TYPES = ['exterior', 'interior', 'stirnseite', 'fenster'] as const;
export type ValidViewType = typeof VALID_VIEW_TYPES[number];

// Image fallbacks for each view type
export const IMAGE_FALLBACKS = {
  exterior: '104-NEST-Haus-Konfigurator-75-Holzfassade-Ansicht',
  interior: '167-NEST-Haus-Konfigurator-Modul-Holzfassade-Holz-Natur-Parkett-Eiche',
  stirnseite: '105-NEST-Haus-Konfigurator-75-Holzfassade-Stirnseite',
  fenster: '167-NEST-Haus-Konfigurator-Modul-Holzfassade-Holz-Natur-Parkett-Eiche'
} as const;

// Type for combination keys used in pricing and image mappings
export type CombinationKey = keyof typeof MODULAR_PRICING.combinations;
export type ImageCombinationKey = keyof typeof INTERIOR_EXACT_MAPPINGS;

/**
 * PRICING CONSTANTS
 * Following project rules: shared constants in src/constants/
 */

// Grundstückscheck price - Updated to match checkout pricing (with 50% discount: was 3000, now 1500)
export const GRUNDSTUECKSCHECK_PRICE = 1500;

// Nest options with base pricing - UPDATED TO MATCH GOOGLE SHEETS
export const NEST_OPTIONS = [
  {
    id: 'nest80',
    name: 'Hoam 80',
    description: '75m² Nutzfläche',
    price: 213032,
    monthly: 990,
    modules: 1
  },
  {
    id: 'nest100',
    name: 'Hoam 100',
    description: '95m² Nutzfläche',
    price: 254731,
    monthly: 1187,
    modules: 2
  },
  {
    id: 'nest120',
    name: 'Hoam 120',
    description: '115m² Nutzfläche',
    price: 296430,
    monthly: 1384,
    modules: 3
  },
  {
    id: 'nest140',
    name: 'Hoam 140',
    description: '135m² Nutzfläche',
    price: 338129,
    monthly: 1581,
    modules: 4
  },
  {
    id: 'nest160',
    name: 'Hoam 160',
    description: '155m² Nutzfläche',
    price: 379828,
    monthly: 1778,
    modules: 5
  }
] as const;

// CORRECTED: Modular pricing structure matching Excel data
// Formula: Base Price (Nest 80) + (Additional Modules × Per-Module Price)
export const MODULAR_PRICING = {
  // Each combination has base price + per-module price
  combinations: {
    'trapezblech_laerche_ohne_belag': { base: 155500, perModule: 33600 }, // Base price matches expected minimum
    'trapezblech_laerche_parkett': { base: 155700, perModule: 34800 }, // Calculated for proper parkett scaling: nest80=+3800€, +1200€/module
    'trapezblech_laerche_kalkstein_kanafar': { base: 161200, perModule: 35000 },
    'trapezblech_laerche_schiefer_massiv': { base: 161200, perModule: 35000 },
    'trapezblech_fichte_ohne_belag': { base: 153100, perModule: 32600 }, // Base - 3800
    'trapezblech_fichte_parkett': { base: 156900, perModule: 33800 },
    'trapezblech_fichte_kalkstein_kanafar': { base: 162600, perModule: 35300 },
    'trapezblech_fichte_schiefer_massiv': { base: 162600, perModule: 35300 },
    'trapezblech_steirische_eiche_ohne_belag': { base: 161900, perModule: 34200 }, // Base - 3800
    'trapezblech_steirische_eiche_parkett': { base: 165700, perModule: 35400 },
    'trapezblech_steirische_eiche_kalkstein_kanafar': { base: 171400, perModule: 36900 },
    'trapezblech_steirische_eiche_schiefer_massiv': { base: 171400, perModule: 36900 },
    'holzlattung_laerche_ohne_belag': { base: 161300, perModule: 34400 }, // Base - 3800
    'holzlattung_laerche_parkett': { base: 165100, perModule: 35600 },
    'holzlattung_laerche_kalkstein_kanafar': { base: 170800, perModule: 37000 },
    'holzlattung_laerche_schiefer_massiv': { base: 170800, perModule: 37000 },
    'holzlattung_fichte_ohne_belag': { base: 162600, perModule: 34600 }, // Base - 3800
    'holzlattung_fichte_parkett': { base: 166400, perModule: 35800 },
    'holzlattung_fichte_kalkstein_kanafar': { base: 172100, perModule: 37300 },
    'holzlattung_fichte_schiefer_massiv': { base: 172100, perModule: 37300 },
    'holzlattung_steirische_eiche_ohne_belag': { base: 171500, perModule: 36200 }, // Base - 3800
    'holzlattung_steirische_eiche_parkett': { base: 175300, perModule: 37400 },
    'holzlattung_steirische_eiche_kalkstein_kanafar': { base: 181000, perModule: 38900 },
    'holzlattung_steirische_eiche_schiefer_massiv': { base: 181000, perModule: 38900 },
    'fassadenplatten_schwarz_laerche_ohne_belag': { base: 188100, perModule: 39100 }, // Base - 3800
    'fassadenplatten_schwarz_laerche_parkett': { base: 191900, perModule: 40300 },
    'fassadenplatten_schwarz_laerche_kalkstein_kanafar': { base: 197600, perModule: 41700 },
    'fassadenplatten_schwarz_laerche_schiefer_massiv': { base: 197600, perModule: 41700 },
    'fassadenplatten_schwarz_fichte_ohne_belag': { base: 189400, perModule: 39400 }, // Base - 3800
    'fassadenplatten_schwarz_fichte_parkett': { base: 193200, perModule: 40600 },
    'fassadenplatten_schwarz_fichte_kalkstein_kanafar': { base: 198900, perModule: 42000 },
    'fassadenplatten_schwarz_fichte_schiefer_massiv': { base: 198900, perModule: 42000 },
    'fassadenplatten_schwarz_steirische_eiche_ohne_belag': { base: 198300, perModule: 41000 }, // Base - 3800
    'fassadenplatten_schwarz_steirische_eiche_parkett': { base: 202100, perModule: 42200 },
    'fassadenplatten_schwarz_steirische_eiche_kalkstein_kanafar': { base: 207800, perModule: 43600 },
    'fassadenplatten_schwarz_steirische_eiche_schiefer_massiv': { base: 207800, perModule: 43600 },
    'fassadenplatten_weiss_laerche_ohne_belag': { base: 188100, perModule: 39100 }, // Base - 3800
    'fassadenplatten_weiss_laerche_parkett': { base: 191900, perModule: 40300 },
    'fassadenplatten_weiss_laerche_kalkstein_kanafar': { base: 197600, perModule: 41700 },
    'fassadenplatten_weiss_laerche_schiefer_massiv': { base: 197600, perModule: 41700 },
    'fassadenplatten_weiss_fichte_ohne_belag': { base: 189400, perModule: 39400 }, // Base - 3800
    'fassadenplatten_weiss_fichte_parkett': { base: 193200, perModule: 40600 },
    'fassadenplatten_weiss_fichte_kalkstein_kanafar': { base: 198900, perModule: 42000 },
    'fassadenplatten_weiss_fichte_schiefer_massiv': { base: 198900, perModule: 42000 },
    'fassadenplatten_weiss_steirische_eiche_ohne_belag': { base: 198300, perModule: 41000 }, // Base - 3800
    'fassadenplatten_weiss_steirische_eiche_parkett': { base: 202100, perModule: 42200 },
    'fassadenplatten_weiss_steirische_eiche_kalkstein_kanafar': { base: 207800, perModule: 43600 },
    'fassadenplatten_weiss_steirische_eiche_schiefer_massiv': { base: 207800, perModule: 43600 }
  }
} as const;

// Planning packages - Updated prices (Nov 2025)
export const PLANNING_PACKAGES = [
  {
    value: 'basis',
    name: 'Basis',
    description: 'Grundplanung und Einreichung\nStandard-Grundriss\nBaubegleitung Basis',
    price: 0, // inkludiert - no additional cost
    monthly: 0
  },
  {
    value: 'plus',
    name: 'Plus',
    description: 'Inkl. Planungspaket Basis\nPlus HKLS-Planung (Gebäudetechnik)',
    price: 4900, // Updated from 9600 (Nov 2025)
    monthly: 26 // Updated monthly based on 4900€ at 240 months (~20.42€/month)
  },
  {
    value: 'pro',
    name: 'Pro',
    description: 'Inkl. Planungspaket Plus\nPlus Interiorkonzept (Möblierungsvorschlag)',
    price: 9600, // Updated from 12700 (Nov 2025)
    monthly: 50 // Updated monthly based on 9600€ at 240 months (40€/month)
  }
] as const;

/**
 * Calculate modular price using CORRECT Excel formula
 * Formula: Base Price (Nest 80) + (Additional Modules × Per-Module Price)
 * @param nestType - The nest type (nest80, nest100, etc.)
 * @param gebaeudehuelle - Building exterior type
 * @param innenverkleidung - Interior cladding type
 * @param fussboden - Flooring type
 * @returns Total price for the combination
 */
export function calculateModularPrice(
  nestType: string,
  gebaeudehuelle: string,
  innenverkleidung: string,
  fussboden: string
): number {
  // Create combination key
  const combinationKey = `${gebaeudehuelle}_${innenverkleidung}_${fussboden}`;

  // Get combination pricing data
  const combinationData = MODULAR_PRICING.combinations[combinationKey as keyof typeof MODULAR_PRICING.combinations];

  if (!combinationData) {
    console.warn(`💰 No pricing data found for combination: ${combinationKey}`);
    // Fallback to base combination
    const fallbackData = MODULAR_PRICING.combinations['trapezblech_laerche_parkett'];
    return fallbackData.base;
  }

  // Get nest module count
  const nestOption = NEST_OPTIONS.find(option => option.id === nestType);
  if (!nestOption) {
    console.warn(`💰 Unknown nest type: ${nestType}, defaulting to nest80`);
    return combinationData.base; // Just base price for nest80 (1 module, 0 additional)
  }

  // Calculate additional modules (nest80 = 1 module = 0 additional modules)
  const additionalModules = nestOption.modules - 1;

  // Apply correct Excel formula: Base + (Additional Modules × Per-Module Price)
  const totalPrice = combinationData.base + (additionalModules * combinationData.perModule);

  return totalPrice;
}

/**
 * Calculate dynamic pricing for size-dependent options
 * Base pricing for nest80, scales by 25% per additional 20m² module
 */

// Base prices for nest80 (80m²) - from Google Sheets
export const SIZE_DEPENDENT_BASE_PRICES = {
  elektrische_fussbodenheizung: 10842,
  wassergefuehrte_fussbodenheizung: 13486,
  fundament: 15480,
  geschossdecke: 4115 // per unit
} as const;

/**
 * Calculate price for size-dependent options based on nest module size
 * @param nestType - The nest type (nest80, nest100, etc.)
 * @param optionType - The option type (elektrische_fussbodenheizung, etc.)
 * @param quantity - For geschossdecke, the number of units (default 1)
 * @returns Calculated price for the option
 */
export function calculateSizeDependentPrice(
  nestType: string,
  optionType: keyof typeof SIZE_DEPENDENT_BASE_PRICES,
  quantity: number = 1
): number {
  const basePrice = SIZE_DEPENDENT_BASE_PRICES[optionType];

  // Get nest module count
  const nestOption = NEST_OPTIONS.find(option => option.id === nestType);
  if (!nestOption) {
    console.warn(`💰 Unknown nest type: ${nestType}, defaulting to nest80 pricing`);
    return basePrice * quantity;
  }

  // Calculate additional modules (nest80 = 1 module = 0 additional modules)
  const additionalModules = nestOption.modules - 1;

  // Calculate price: base + (additional modules × 25% of base)
  const pricePerModule = basePrice + (additionalModules * (basePrice * 0.25));

  return pricePerModule * quantity;
}

/**
 * Get maximum geschossdecken based on nest size
 * Maximum is one less than the number of modules (modules - 1)
 * @param nestType - The nest type (nest80, nest100, etc.)
 * @returns Maximum number of geschossdecken allowed
 */
export function getMaxGeschossdecken(nestType: string): number {
  // Each nest size corresponds to number of 20m² modules
  // Maximum geschossdecke is modules - 1
  const moduleMapping: Record<string, number> = {
    nest80: 4,  // 80m² = 4 × 20m² modules
    nest100: 5, // 100m² = 5 × 20m² modules  
    nest120: 6, // 120m² = 6 × 20m² modules
    nest140: 7, // 140m² = 7 × 20m² modules
    nest160: 8  // 160m² = 8 × 20m² modules
  };

  const modules = moduleMapping[nestType] || 4; // Default to nest80
  return modules - 1; // Maximum is one less than modules
}