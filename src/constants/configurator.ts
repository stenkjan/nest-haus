// Configurator Constants - Updated with EXACT Excel data
// Modular pricing system: Base price (Nest 80) + (modules × per-module cost)

export const NEST_OPTIONS = [
  {
    value: 'nest80',
    name: 'Nest. 80',
    description: '75m² Nutzfläche',
    price: 155500, // Base reference price (Trapezblech + Kiefer + Parkett)
    monthly: 816,
    modules: 0 // Base size
  },
  {
    value: 'nest100',
    name: 'Nest. 100', 
    description: '95m² Nutzfläche',
    price: 189100, // Reference price
    monthly: 993,
    modules: 1 // +1 module from base
  },
  {
    value: 'nest120',
    name: 'Nest. 120',
    description: '115m² Nutzfläche', 
    price: 222700, // Reference price
    monthly: 1169,
    modules: 2 // +2 modules from base
  },
  {
    value: 'nest140',
    name: 'Nest. 140',
    description: '135m² Nutzfläche',
    price: 256300, // Reference price
    monthly: 1346,
    modules: 3 // +3 modules from base
  },
  {
    value: 'nest160',
    name: 'Nest. 160',
    description: '155m² Nutzfläche',
    price: 289900, // Reference price
    monthly: 1522,
    modules: 4 // +4 modules from base
  }
]

export const GEBEUDE_OPTIONS = [
  {
    value: 'trapezblech',
    name: 'Trapezblech',
    description: 'RAL 9005 - 3000 x 1142 mm',
    price: 0,
    included: true
  },
  {
    value: 'holzlattung',
    name: 'Holzlattung Lärche Natur',
    description: 'PEFC-Zertifiziert 5,0 x 4,0 cm\nNatürlich. Ökologisch.',
    price: 9600, // This is calculated dynamically based on combination
    monthly: 50
  },
  {
    value: 'fassadenplatten_schwarz',
    name: 'Fassadenplatten Schwarz',
    description: 'FUNDERMAX® 268 x 130 cm\nSustainability Award 2024',
    price: 36400, // This is calculated dynamically based on combination
    monthly: 191
  },
  {
    value: 'fassadenplatten_weiss',
    name: 'Fassadenplatten Weiß',
    description: 'FUNDERMAX® 268 x 130 cm\nSustainability Award 2024',
    price: 36400, // This is calculated dynamically based on combination
    monthly: 191
  }
]

export const INNENVERKLEIDUNG_OPTIONS = [
  {
    value: 'kiefer',
    name: 'Kiefer',
    description: 'PEFC - Zertifiziert - Sicht 1,5 cm',
    price: 0,
    included: true
  },
  {
    value: 'fichte',
    name: 'Fichte',
    description: 'PEFC - Zertifiziert - Sicht 1,9 cm',
    price: 1400, // This is calculated dynamically based on combination
    monthly: 7
  },
  {
    value: 'steirische_eiche',
    name: 'Steirische Eiche',
    description: 'PEFC - Zertifiziert - Sicht 1,9 cm',
    price: 10200, // This is calculated dynamically based on combination
    monthly: 54
  }
]

export const FUSSBODEN_OPTIONS = [
  {
    value: 'parkett',
    name: 'Parkett Eiche',
    description: 'Schwimmend verlegt',
    price: 0,
    included: true
  },
  {
    value: 'kalkstein_kanafar',
    name: 'Kalkstein Kanafar',
    description: 'Schieferplatten Kalkstein\n800 x 800 x 10 cm',
    price: 4500, // This is calculated dynamically based on combination
    monthly: 24
  },
  {
    value: 'schiefer_massiv',
    name: 'Schiefer Massiv',
    description: 'Feinsteinzeug Schieferoptik\n800 x 800 x 5,5cm',
    price: 5500, // This is calculated dynamically based on combination
    monthly: 29
  }
]

export const PV_OPTIONS = [
  {
    value: 'pv_panels',
    name: 'Photovoltaik-Panels',
    description: '0,4 kWpeak pro Panel',
    price: 390,
    monthly: 2
  }
]

export const FENSTER_OPTIONS = [
  {
    value: 'pvc_fenster',
    name: 'PVC Fenster',
    description: 'RAL 9016 - Kunststoff',
    price: 280,
    monthly: 2
  },
  {
    value: 'fichte',
    name: 'Fichte',
    description: 'Holzfenster Lärche',
    price: 400,
    monthly: 3
  },
  {
    value: 'steirische_eiche',
    name: 'Steirische Eiche',
    description: 'RAL 9005 - Tiefschwarz',
    price: 550,
    monthly: 3
  },
  {
    value: 'aluminium',
    name: 'Aluminium',
    description: 'RAL 9005 - Tiefschwarz\nbis 6000 x 3200 mm',
    price: 700,
    monthly: 4
  }
]

export const PLANNING_PACKAGES = [
  {
    value: 'basis',
    name: 'Planung Basis',
    description: 'Einreichplanung (Baugenehmigung)\nFachplanung und Baustützung',
    price: 8900,
    monthly: 47
  },
  {
    value: 'plus',
    name: 'Planung Plus',
    description: 'Einreichplanung Basis\nPlus HVLS-Planung (Gebäudetechnik)',
    price: 13900,
    monthly: 73
  },
  {
    value: 'pro',
    name: 'Planung Pro',
    description: 'Inkl. Planungspaket Plus\nPlus Baustüberwachung (Modalbestandschef)',
    price: 18900,
    monthly: 99
  }
]

// Type definitions for modular pricing
export interface ModularPricingData {
  basePrice: number;
  pricePerModule: number;
}

export type CombinationKey = 
  | 'trapezblech-kiefer-parkett'
  | 'trapezblech-kiefer-kalkstein_kanafar'
  | 'trapezblech-kiefer-schiefer_massiv'
  | 'trapezblech-fichte-parkett'
  | 'trapezblech-fichte-kalkstein_kanafar'
  | 'trapezblech-fichte-schiefer_massiv'
  | 'trapezblech-steirische_eiche-parkett'
  | 'trapezblech-steirische_eiche-kalkstein_kanafar'
  | 'trapezblech-steirische_eiche-schiefer_massiv'
  | 'holzlattung-kiefer-parkett'
  | 'holzlattung-kiefer-kalkstein_kanafar'
  | 'holzlattung-kiefer-schiefer_massiv'
  | 'holzlattung-fichte-parkett'
  | 'holzlattung-fichte-kalkstein_kanafar'
  | 'holzlattung-fichte-schiefer_massiv'
  | 'holzlattung-steirische_eiche-parkett'
  | 'holzlattung-steirische_eiche-kalkstein_kanafar'
  | 'holzlattung-steirische_eiche-schiefer_massiv'
  | 'fassadenplatten_schwarz-kiefer-parkett'
  | 'fassadenplatten_schwarz-kiefer-kalkstein_kanafar'
  | 'fassadenplatten_schwarz-kiefer-schiefer_massiv'
  | 'fassadenplatten_schwarz-fichte-parkett'
  | 'fassadenplatten_schwarz-fichte-kalkstein_kanafar'
  | 'fassadenplatten_schwarz-fichte-schiefer_massiv'
  | 'fassadenplatten_schwarz-steirische_eiche-parkett'
  | 'fassadenplatten_schwarz-steirische_eiche-kalkstein_kanafar'
  | 'fassadenplatten_schwarz-steirische_eiche-schiefer_massiv'
  | 'fassadenplatten_weiss-kiefer-parkett'
  | 'fassadenplatten_weiss-kiefer-kalkstein_kanafar'
  | 'fassadenplatten_weiss-kiefer-schiefer_massiv'
  | 'fassadenplatten_weiss-fichte-parkett'
  | 'fassadenplatten_weiss-fichte-kalkstein_kanafar'
  | 'fassadenplatten_weiss-fichte-schiefer_massiv'
  | 'fassadenplatten_weiss-steirische_eiche-parkett'
  | 'fassadenplatten_weiss-steirische_eiche-kalkstein_kanafar'
  | 'fassadenplatten_weiss-steirische_eiche-schiefer_massiv';

// MODULAR PRICING SYSTEM - Based on Excel data
// Each combination has a base price (Nest 80) and cost per additional module
export const MODULAR_PRICING: Record<CombinationKey, ModularPricingData> = {
  // Trapezblech combinations
  'trapezblech-kiefer-parkett': {
    basePrice: 155500,
    pricePerModule: 33600
  },
  'trapezblech-kiefer-kalkstein_kanafar': {
    basePrice: 161200,
    pricePerModule: 35000
  },
  'trapezblech-kiefer-schiefer_massiv': {
    basePrice: 161200,
    pricePerModule: 35000
  },
  'trapezblech-fichte-parkett': {
    basePrice: 156900,
    pricePerModule: 33800
  },
  'trapezblech-fichte-kalkstein_kanafar': {
    basePrice: 162600,
    pricePerModule: 35300
  },
  'trapezblech-fichte-schiefer_massiv': {
    basePrice: 162600,
    pricePerModule: 35300
  },
  'trapezblech-steirische_eiche-parkett': {
    basePrice: 165700,
    pricePerModule: 35400
  },
  'trapezblech-steirische_eiche-kalkstein_kanafar': {
    basePrice: 171400,
    pricePerModule: 36900
  },
  'trapezblech-steirische_eiche-schiefer_massiv': {
    basePrice: 171400,
    pricePerModule: 36900
  },
  
  // Holzlattung Lärche combinations
  'holzlattung-kiefer-parkett': {
    basePrice: 165100,
    pricePerModule: 35600
  },
  'holzlattung-kiefer-kalkstein_kanafar': {
    basePrice: 170800,
    pricePerModule: 37000
  },
  'holzlattung-kiefer-schiefer_massiv': {
    basePrice: 170800,
    pricePerModule: 37000
  },
  'holzlattung-fichte-parkett': {
    basePrice: 166400,
    pricePerModule: 35800
  },
  'holzlattung-fichte-kalkstein_kanafar': {
    basePrice: 172100,
    pricePerModule: 37300
  },
  'holzlattung-fichte-schiefer_massiv': {
    basePrice: 172100,
    pricePerModule: 37300
  },
  'holzlattung-steirische_eiche-parkett': {
    basePrice: 175300,
    pricePerModule: 37400
  },
  'holzlattung-steirische_eiche-kalkstein_kanafar': {
    basePrice: 181000,
    pricePerModule: 38900
  },
  'holzlattung-steirische_eiche-schiefer_massiv': {
    basePrice: 181000,
    pricePerModule: 38900
  },
  
  // Fassadenplatten (Holzverbundplatten from Excel)
  'fassadenplatten_schwarz-kiefer-parkett': {
    basePrice: 191900,
    pricePerModule: 40300
  },
  'fassadenplatten_schwarz-kiefer-kalkstein_kanafar': {
    basePrice: 197600,
    pricePerModule: 41700
  },
  'fassadenplatten_schwarz-kiefer-schiefer_massiv': {
    basePrice: 197600,
    pricePerModule: 41700
  },
  'fassadenplatten_schwarz-fichte-parkett': {
    basePrice: 193200,
    pricePerModule: 40600
  },
  'fassadenplatten_schwarz-fichte-kalkstein_kanafar': {
    basePrice: 198900,
    pricePerModule: 42000
  },
  'fassadenplatten_schwarz-fichte-schiefer_massiv': {
    basePrice: 198900,
    pricePerModule: 42000
  },
  'fassadenplatten_schwarz-steirische_eiche-parkett': {
    basePrice: 202100,
    pricePerModule: 42200
  },
  'fassadenplatten_schwarz-steirische_eiche-kalkstein_kanafar': {
    basePrice: 207800,
    pricePerModule: 43600
  },
  'fassadenplatten_schwarz-steirische_eiche-schiefer_massiv': {
    basePrice: 207800,
    pricePerModule: 43600
  },
  
  // White facade plates - same pricing as black
  'fassadenplatten_weiss-kiefer-parkett': {
    basePrice: 191900,
    pricePerModule: 40300
  },
  'fassadenplatten_weiss-kiefer-kalkstein_kanafar': {
    basePrice: 197600,
    pricePerModule: 41700
  },
  'fassadenplatten_weiss-kiefer-schiefer_massiv': {
    basePrice: 197600,
    pricePerModule: 41700
  },
  'fassadenplatten_weiss-fichte-parkett': {
    basePrice: 193200,
    pricePerModule: 40600
  },
  'fassadenplatten_weiss-fichte-kalkstein_kanafar': {
    basePrice: 198900,
    pricePerModule: 42000
  },
  'fassadenplatten_weiss-fichte-schiefer_massiv': {
    basePrice: 198900,
    pricePerModule: 42000
  },
  'fassadenplatten_weiss-steirische_eiche-parkett': {
    basePrice: 202100,
    pricePerModule: 42200
  },
  'fassadenplatten_weiss-steirische_eiche-kalkstein_kanafar': {
    basePrice: 207800,
    pricePerModule: 43600
  },
  'fassadenplatten_weiss-steirische_eiche-schiefer_massiv': {
    basePrice: 207800,
    pricePerModule: 43600
  }
}

// Grundstückscheck price
export const GRUNDSTUECKSCHECK_PRICE = 490

/**
 * Calculate modular price based on Excel data
 * Formula: Base Price (Nest 80) + (Additional Modules × Price Per Module)
 */
export function calculateModularPrice(
  nestType: string,
  gebaeudehuelle: string,
  innenverkleidung: string,
  fussboden: string
): number {
  // Get number of additional modules for this nest size
  const nestOption = NEST_OPTIONS.find(option => option.value === nestType);
  const additionalModules = nestOption?.modules || 0;
  
  // Create combination key with type safety
  const combinationKey = `${gebaeudehuelle}-${innenverkleidung}-${fussboden}` as CombinationKey;
  
  // Get pricing data for this combination
  const pricingData = MODULAR_PRICING[combinationKey];
  
  if (!pricingData) {
    console.warn(`💰 No pricing data found for combination: ${combinationKey}`);
    // Fallback to base combination
    const fallbackData = MODULAR_PRICING['trapezblech-kiefer-parkett'];
    return fallbackData.basePrice + (additionalModules * fallbackData.pricePerModule);
  }
  
  // Calculate final price: Base (Nest 80) + (modules × per-module cost)
  const totalPrice = pricingData.basePrice + (additionalModules * pricingData.pricePerModule);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`💰 Pricing calculation:
      Combination: ${combinationKey}
      Base Price (Nest 80): €${pricingData.basePrice.toLocaleString()}
      Additional Modules: ${additionalModules}
      Price Per Module: €${pricingData.pricePerModule.toLocaleString()}
      Total Price: €${totalPrice.toLocaleString()}`);
  }
  
  return totalPrice;
}

/**
 * Get number of modules for a nest type
 */
export function getModuleSizeIndex(nestValue: string): number {
  const nestOption = NEST_OPTIONS.find(option => option.value === nestValue);
  return nestOption?.modules || 0;
}

// Legacy compatibility function - now uses modular pricing
export function calculateCombinationPrice(
  nestType: string,
  gebaeudehuelle: string,
  innenverkleidung: string,
  fussboden: string
): number {
  return calculateModularPrice(nestType, gebaeudehuelle, innenverkleidung, fussboden);
}

// Monthly payment calculation - Updated based on Excel data (3-month Euribor + rate add-on)
export function calculateMonthlyPayment(totalPrice: number, months: number = 240): string {
  // Excel shows: 3-month Euribor (1.2%) + rate add-on
  // Using conservative 3.5% total rate (1.2% + 2.3% markup) for accuracy
  const interestRate = 0.035 / 12 // 3.5% annual rate (Euribor + markup)
  const monthlyPayment = totalPrice * (interestRate * Math.pow(1 + interestRate, months)) / 
                        (Math.pow(1 + interestRate, months) - 1)
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(monthlyPayment)
} 