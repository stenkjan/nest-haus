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
  'kiefer': 'holznatur',
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
  'fichte': 'fichte',
  'eiche': 'eiche',
  'aluminium': 'aluminium'
} as const;

// Exact mappings for specific interior combinations
export const INTERIOR_EXACT_MAPPINGS: Record<string, string> = {
  'trapezblech_kiefer_parkett': 'trapezblech_holznatur_parkett',
  'trapezblech_kiefer_kalkstein_kanafar': 'trapezblech_holznatur_kalkstein',
  'trapezblech_kiefer_schiefer_massiv': 'trapezblech_holznatur_granit',
  'trapezblech_fichte_parkett': 'trapezblech_holzweiss_parkett',
  'trapezblech_fichte_kalkstein_kanafar': 'trapezblech_holzweiss_kalkstein',
  'trapezblech_fichte_schiefer_massiv': 'trapezblech_holzweiss_granit',
  'trapezblech_steirische_eiche_parkett': 'trapezblech_eiche_parkett',
  'trapezblech_steirische_eiche_kalkstein_kanafar': 'trapezblech_eiche_kalkstein',
  'trapezblech_steirische_eiche_schiefer_massiv': 'trapezblech_eiche_granit'
} as const;

// Valid view types
export const VALID_VIEW_TYPES = ['exterior', 'interior', 'stirnseite'] as const;
export type ValidViewType = typeof VALID_VIEW_TYPES[number];

// Image fallbacks for each view type
export const IMAGE_FALLBACKS = {
  exterior: '104-NEST-Haus-Konfigurator-75-Holzfassade-Ansicht',
  interior: '137-NEST-Haus-Konfigurator-Modul-Fassade-Trapezblech-Schwarz-Holz-Natur-Kalkstein',
  stirnseite: '105-NEST-Haus-Konfigurator-75-Holzfassade-Stirnseite'
} as const;

// Type for combination keys used in exact mappings
export type CombinationKey = keyof typeof INTERIOR_EXACT_MAPPINGS;

/**
 * PRICING CONSTANTS
 * Following project rules: shared constants in src/constants/
 */

// Grundstückscheck price
export const GRUNDSTUECKSCHECK_PRICE = 480;

// Nest options with base pricing
export const NEST_OPTIONS = [
  {
    id: 'nest80',
    name: 'Nest. 80',
    description: '75m² Nutzfläche',
    price: 155500,
    monthly: 816,
    modules: 1
  },
  {
    id: 'nest100',
    name: 'Nest. 100',
    description: '95m² Nutzfläche',
    price: 189100,
    monthly: 993,
    modules: 2
  },
  {
    id: 'nest120',
    name: 'Nest. 120',
    description: '115m² Nutzfläche',
    price: 222700,
    monthly: 1169,
    modules: 3
  },
  {
    id: 'nest140',
    name: 'Nest. 140',
    description: '135m² Nutzfläche',
    price: 256300,
    monthly: 1346,
    modules: 4
  },
  {
    id: 'nest160',
    name: 'Nest. 160',
    description: '155m² Nutzfläche',
    price: 289900,
    monthly: 1522,
    modules: 5
  }
] as const;

// Modular pricing structure for combinations
export const MODULAR_PRICING = {
  basePrices: {
    nest80: 155500,
    nest100: 189100,
    nest120: 222700,
    nest140: 256300,
    nest160: 289900
  },
  // Price differences between material combinations
  combinations: {
    'trapezblech_kiefer_parkett': 0, // Base combination
    'trapezblech_kiefer_kalkstein_kanafar': 4500,
    'trapezblech_kiefer_schiefer_massiv': 5500,
    'trapezblech_fichte_parkett': 1400,
    'trapezblech_fichte_kalkstein_kanafar': 5900,
    'trapezblech_fichte_schiefer_massiv': 6900,
    'trapezblech_steirische_eiche_parkett': 10200,
    'trapezblech_steirische_eiche_kalkstein_kanafar': 14700,
    'trapezblech_steirische_eiche_schiefer_massiv': 15700,
    'holzlattung_kiefer_parkett': 9600,
    'holzlattung_kiefer_kalkstein_kanafar': 14100,
    'holzlattung_kiefer_schiefer_massiv': 15100,
    'holzlattung_fichte_parkett': 11000,
    'holzlattung_fichte_kalkstein_kanafar': 15500,
    'holzlattung_fichte_schiefer_massiv': 16500,
    'holzlattung_steirische_eiche_parkett': 19800,
    'holzlattung_steirische_eiche_kalkstein_kanafar': 24300,
    'holzlattung_steirische_eiche_schiefer_massiv': 25300,
    'fassadenplatten_schwarz_kiefer_parkett': 36400,
    'fassadenplatten_schwarz_kiefer_kalkstein_kanafar': 40900,
    'fassadenplatten_schwarz_kiefer_schiefer_massiv': 41900,
    'fassadenplatten_schwarz_fichte_parkett': 37800,
    'fassadenplatten_schwarz_fichte_kalkstein_kanafar': 42300,
    'fassadenplatten_schwarz_fichte_schiefer_massiv': 43300,
    'fassadenplatten_schwarz_steirische_eiche_parkett': 46600,
    'fassadenplatten_schwarz_steirische_eiche_kalkstein_kanafar': 51100,
    'fassadenplatten_schwarz_steirische_eiche_schiefer_massiv': 52100,
    'fassadenplatten_weiss_kiefer_parkett': 36400,
    'fassadenplatten_weiss_kiefer_kalkstein_kanafar': 40900,
    'fassadenplatten_weiss_kiefer_schiefer_massiv': 41900,
    'fassadenplatten_weiss_fichte_parkett': 37800,
    'fassadenplatten_weiss_fichte_kalkstein_kanafar': 42300,
    'fassadenplatten_weiss_fichte_schiefer_massiv': 43300,
    'fassadenplatten_weiss_steirische_eiche_parkett': 46600,
    'fassadenplatten_weiss_steirische_eiche_kalkstein_kanafar': 51100,
    'fassadenplatten_weiss_steirische_eiche_schiefer_massiv': 52100
  }
} as const;

// Planning packages
export const PLANNING_PACKAGES = [
  {
    value: 'basis',
    name: 'Basis',
    description: 'Grundplanung und Einreichung\nStandard-Grundriss\nBaubegleitung Basis',
    price: 8500,
    monthly: 45
  },
  {
    value: 'komfort',
    name: 'Komfort',
    description: 'Erweiterte Planung\nHKLS-Planung\nBaubegleitung Komfort\nIndividuelle Grundrissanpassungen',
    price: 14900,
    monthly: 78
  },
  {
    value: 'premium',
    name: 'Premium',
    description: 'Vollständige Baubegleitung\nInteriorkonzept\nMöblierungsvorschläge\nGebäudetechnik-Optimierung',
    price: 24500,
    monthly: 129
  }
] as const;

/**
 * Calculate modular price based on nest type and material combinations
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
  // Get base price for nest type
  const basePrice = MODULAR_PRICING.basePrices[nestType as keyof typeof MODULAR_PRICING.basePrices] || MODULAR_PRICING.basePrices.nest80;

  // Create combination key
  const combinationKey = `${gebaeudehuelle}_${innenverkleidung}_${fussboden}`;

  // Get combination price (defaults to 0 if not found)
  const combinationPrice = MODULAR_PRICING.combinations[combinationKey as keyof typeof MODULAR_PRICING.combinations] || 0;

  return basePrice + combinationPrice;
} 