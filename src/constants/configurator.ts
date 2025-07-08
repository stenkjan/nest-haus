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

// Stirnseite image mapping
export const STIRNSEITE_MAPPING: Record<string, string> = {
  'trapezblech': 'stirnseiteTrapezblech',
  'holzlattung': 'stirnseiteHolzfassade',
  'fassadenplatten_schwarz': 'stirnseitePlattenSchwarz',
  'fassadenplatten_weiss': 'stirnseitePlattenWeiss'
} as const;

// Gebäudehülle prefix mapping for interior images
export const GEBAEUDE_PREFIX_MAPPING: Record<string, string> = {
  'trapezblech': 'trapezblech',
  'holzlattung': 'holzlattung',
  'fassadenplatten_schwarz': 'plattenschwarz',
  'fassadenplatten_weiss': 'plattenweiss'
} as const;

// Innenverkleidung mapping for interior images
export const INNENVERKLEIDUNG_MAPPING: Record<string, string> = {
  'kiefer': 'holznatur',
  'fichte': 'holzweiss',
  'steirische_eiche': 'eiche'
} as const;

// Fussboden mapping for interior images
export const FUSSBODEN_MAPPING: Record<string, string> = {
  'parkett': 'parkett',
  'kalkstein_kanafar': 'kalkstein',
  'schiefer_massiv': 'granit' // Note: uses granit for most, but holzlattung uses schiefer
} as const;

// Special fussboden mapping for holzlattung (uses schiefer instead of granit)
export const FUSSBODEN_HOLZLATTUNG_MAPPING: Record<string, string> = {
  'parkett': 'parkett',
  'kalkstein_kanafar': 'kalkstein',
  'schiefer_massiv': 'schiefer'
} as const;

// PV image mapping
export const PV_IMAGE_MAPPING: Record<string, string> = {
  'trapezblech': 'pv_trapezblech',
  'holzlattung': 'pv_holzfassade',
  'fassadenplatten_schwarz': 'pv_plattenschwarz',
  'fassadenplatten_weiss': 'pv_plattenweiss'
} as const;

// Fenster image mapping
export const FENSTER_IMAGE_MAPPING: Record<string, string> = {
  // New configurator IDs (from configuratorData.ts)
  'pvc_fenster': 'fenster_pvc',
  'fichte': 'fenster_holz_fichte',
  'steirische_eiche': 'fenster_holz_eiche',
  'aluminium': 'fenster_aluminium',
  // Old configurator IDs (for compatibility)
  'kunststoffverkleidung': 'fenster_pvc',
  'eiche': 'fenster_holz_eiche'
} as const;

// Exact interior image mappings (user-defined combinations)
export const INTERIOR_EXACT_MAPPINGS: Array<[
  string, // gebaeudehuelle
  string, // innenverkleidung
  string, // fussboden
  string  // image key
]> = [
  ['fassadenplatten_weiss', 'steirische_eiche', 'kalkstein_kanafar', 'plattenweiss_eiche_kalkstein'],
  ['fassadenplatten_weiss', 'steirische_eiche', 'parkett', 'plattenweiss_eiche_parkett'],
  ['fassadenplatten_schwarz', 'steirische_eiche', 'parkett', 'plattenschwarz_eiche_parkett'],
  ['fassadenplatten_schwarz', 'kiefer', 'parkett', 'plattenschwarz_holznatur_parkett'],
  ['trapezblech', 'kiefer', 'parkett', 'trapezblech_holznatur_parkett'],
  ['trapezblech', 'kiefer', 'kalkstein_kanafar', 'trapezblech_holznatur_kalkstein'],
  ['trapezblech', 'fichte', 'parkett', 'trapezblech_holzweiss_parkett'],
  ['trapezblech', 'fichte', 'kalkstein_kanafar', 'trapezblech_holzweiss_kalkstein'],
  ['trapezblech', 'fichte', 'schiefer_massiv', 'trapezblech_holzweiss_granit'],
  ['trapezblech', 'steirische_eiche', 'parkett', 'trapezblech_eiche_parkett'],
] as const;

// Valid view types for security validation
export const VALID_VIEW_TYPES = ['exterior', 'stirnseite', 'interior', 'pv', 'fenster'] as const;
export type ValidViewType = typeof VALID_VIEW_TYPES[number];

// Fallback configurations
export const IMAGE_FALLBACKS = {
  DEFAULT_NEST: 'nest75_holzlattung',
  DEFAULT_STIRNSEITE: 'stirnseiteTrapezblech',
  DEFAULT_INTERIOR: 'trapezblech_holznatur_kalkstein',
  DEFAULT_PV: 'pv_holzfassade',
  DEFAULT_FENSTER: 'fenster_pvc'
} as const; 