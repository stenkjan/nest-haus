// Original Configurator Constants - EXACT prices from old system
// DO NOT CHANGE THESE VALUES - They are the original prices from the legacy configurator

export const NEST_OPTIONS = [
  {
    value: 'nest80',
    name: 'Nest. 80',
    description: '80m² Nutzfläche',
    price: 155500,
    monthly: 816
  },
  {
    value: 'nest100',
    name: 'Nest. 100', 
    description: '100m² Nutzfläche',
    price: 189100,
    monthly: 993
  },
  {
    value: 'nest120',
    name: 'Nest. 120',
    description: '120m² Nutzfläche', 
    price: 222700,
    monthly: 1169
  },
  {
    value: 'nest140',
    name: 'Nest. 140',
    description: '140m² Nutzfläche',
    price: 256300,
    monthly: 1346
  },
  {
    value: 'nest160',
    name: 'Nest. 160',
    description: '160m² Nutzfläche',
    price: 289900,
    monthly: 1522
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
    price: 9600,
    monthly: 50
  },
  {
    value: 'fassadenplatten_schwarz',
    name: 'Fassadenplatten Schwarz',
    description: 'FUNDERMAX® 268 x 130 cm\nSustainability Award 2024',
    price: 36400,
    monthly: 191
  },
  {
    value: 'fassadenplatten_weiss',
    name: 'Fassadenplatten Weiß',
    description: 'FUNDERMAX® 268 x 130 cm\nSustainability Award 2024',
    price: 36400,
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
    price: 1400,
    monthly: 7
  },
  {
    value: 'steirische_eiche',
    name: 'Steirische Eiche',
    description: 'PEFC - Zertifiziert - Sicht 1,9 cm',
    price: 10200,
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
    price: 4500,
    monthly: 24
  },
  {
    value: 'schiefer_massiv',
    name: 'Schiefer Massiv',
    description: 'Feinsteinzeug Schieferoptik\n800 x 800 x 5,5cm',
    price: 5500,
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
    description: 'Einreichplanung (Baumgenehmigung)\nFachplanung und Baustützung',
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

// Combination pricing - this is the key logic from the old configurator
export const COMBINATION_PRICES: Record<string, Record<string, Record<string, Record<string, number>>>> = {
  nest80: {
    trapezblech: {
      kiefer: {
        parkett: 155500,
        kalkstein_kanafar: 160000,
        schiefer_massiv: 161000
      },
      fichte: {
        parkett: 156900,
        kalkstein_kanafar: 161400,
        schiefer_massiv: 162400
      },
      steirische_eiche: {
        parkett: 165700,
        kalkstein_kanafar: 170200,
        schiefer_massiv: 171200
      }
    },
    holzlattung: {
      kiefer: {
        parkett: 165100,
        kalkstein_kanafar: 169600,
        schiefer_massiv: 170600
      },
      fichte: {
        parkett: 166500,
        kalkstein_kanafar: 171000,
        schiefer_massiv: 172000
      },
      steirische_eiche: {
        parkett: 175300,
        kalkstein_kanafar: 179800,
        schiefer_massiv: 180800
      }
    },
    fassadenplatten_schwarz: {
      kiefer: {
        parkett: 191900,
        kalkstein_kanafar: 196400,
        schiefer_massiv: 197400
      },
      fichte: {
        parkett: 193300,
        kalkstein_kanafar: 197800,
        schiefer_massiv: 198800
      },
      steirische_eiche: {
        parkett: 202100,
        kalkstein_kanafar: 206600,
        schiefer_massiv: 207600
      }
    },
    fassadenplatten_weiss: {
      kiefer: {
        parkett: 191900,
        kalkstein_kanafar: 196400,
        schiefer_massiv: 197400
      },
      fichte: {
        parkett: 193300,
        kalkstein_kanafar: 197800,
        schiefer_massiv: 198800
      },
      steirische_eiche: {
        parkett: 202100,
        kalkstein_kanafar: 206600,
        schiefer_massiv: 207600
      }
    }
  },
  nest100: {
    trapezblech: {
      kiefer: {
        parkett: 189100,
        kalkstein_kanafar: 193600,
        schiefer_massiv: 194600
      },
      fichte: {
        parkett: 190500,
        kalkstein_kanafar: 195000,
        schiefer_massiv: 196000
      },
      steirische_eiche: {
        parkett: 199300,
        kalkstein_kanafar: 203800,
        schiefer_massiv: 204800
      }
    },
    holzlattung: {
      kiefer: {
        parkett: 198700,
        kalkstein_kanafar: 203200,
        schiefer_massiv: 204200
      },
      fichte: {
        parkett: 200100,
        kalkstein_kanafar: 204600,
        schiefer_massiv: 205600
      },
      steirische_eiche: {
        parkett: 208900,
        kalkstein_kanafar: 213400,
        schiefer_massiv: 214400
      }
    },
    fassadenplatten_schwarz: {
      kiefer: {
        parkett: 225500,
        kalkstein_kanafar: 230000,
        schiefer_massiv: 231000
      },
      fichte: {
        parkett: 226900,
        kalkstein_kanafar: 231400,
        schiefer_massiv: 232400
      },
      steirische_eiche: {
        parkett: 235700,
        kalkstein_kanafar: 240200,
        schiefer_massiv: 241200
      }
    },
    fassadenplatten_weiss: {
      kiefer: {
        parkett: 225500,
        kalkstein_kanafar: 230000,
        schiefer_massiv: 231000
      },
      fichte: {
        parkett: 226900,
        kalkstein_kanafar: 231400,
        schiefer_massiv: 232400
      },
      steirische_eiche: {
        parkett: 235700,
        kalkstein_kanafar: 240200,
        schiefer_massiv: 241200
      }
    }
  },
  nest120: {
    trapezblech: {
      kiefer: {
        parkett: 222700,
        kalkstein_kanafar: 227200,
        schiefer_massiv: 228200
      },
      fichte: {
        parkett: 224100,
        kalkstein_kanafar: 228600,
        schiefer_massiv: 229600
      },
      steirische_eiche: {
        parkett: 232900,
        kalkstein_kanafar: 237400,
        schiefer_massiv: 238400
      }
    },
    holzlattung: {
      kiefer: {
        parkett: 232300,
        kalkstein_kanafar: 236800,
        schiefer_massiv: 237800
      },
      fichte: {
        parkett: 233700,
        kalkstein_kanafar: 238200,
        schiefer_massiv: 239200
      },
      steirische_eiche: {
        parkett: 242500,
        kalkstein_kanafar: 247000,
        schiefer_massiv: 248000
      }
    },
    fassadenplatten_schwarz: {
      kiefer: {
        parkett: 259100,
        kalkstein_kanafar: 263600,
        schiefer_massiv: 264600
      },
      fichte: {
        parkett: 260500,
        kalkstein_kanafar: 265000,
        schiefer_massiv: 266000
      },
      steirische_eiche: {
        parkett: 269300,
        kalkstein_kanafar: 273800,
        schiefer_massiv: 274800
      }
    },
    fassadenplatten_weiss: {
      kiefer: {
        parkett: 259100,
        kalkstein_kanafar: 263600,
        schiefer_massiv: 264600
      },
      fichte: {
        parkett: 260500,
        kalkstein_kanafar: 265000,
        schiefer_massiv: 266000
      },
      steirische_eiche: {
        parkett: 269300,
        kalkstein_kanafar: 273800,
        schiefer_massiv: 274800
      }
    }
  },
  nest140: {
    trapezblech: {
      kiefer: {
        parkett: 256300,
        kalkstein_kanafar: 260800,
        schiefer_massiv: 261800
      },
      fichte: {
        parkett: 257700,
        kalkstein_kanafar: 262200,
        schiefer_massiv: 263200
      },
      steirische_eiche: {
        parkett: 266500,
        kalkstein_kanafar: 271000,
        schiefer_massiv: 272000
      }
    },
    holzlattung: {
      kiefer: {
        parkett: 265900,
        kalkstein_kanafar: 270400,
        schiefer_massiv: 271400
      },
      fichte: {
        parkett: 267300,
        kalkstein_kanafar: 271800,
        schiefer_massiv: 272800
      },
      steirische_eiche: {
        parkett: 276100,
        kalkstein_kanafar: 280600,
        schiefer_massiv: 281600
      }
    },
    fassadenplatten_schwarz: {
      kiefer: {
        parkett: 292700,
        kalkstein_kanafar: 297200,
        schiefer_massiv: 298200
      },
      fichte: {
        parkett: 294100,
        kalkstein_kanafar: 298600,
        schiefer_massiv: 299600
      },
      steirische_eiche: {
        parkett: 302900,
        kalkstein_kanafar: 307400,
        schiefer_massiv: 308400
      }
    },
    fassadenplatten_weiss: {
      kiefer: {
        parkett: 292700,
        kalkstein_kanafar: 297200,
        schiefer_massiv: 298200
      },
      fichte: {
        parkett: 294100,
        kalkstein_kanafar: 298600,
        schiefer_massiv: 299600
      },
      steirische_eiche: {
        parkett: 302900,
        kalkstein_kanafar: 307400,
        schiefer_massiv: 308400
      }
    }
  },
  nest160: {
    trapezblech: {
      kiefer: {
        parkett: 289900,
        kalkstein_kanafar: 294400,
        schiefer_massiv: 295400
      },
      fichte: {
        parkett: 291300,
        kalkstein_kanafar: 295800,
        schiefer_massiv: 296800
      },
      steirische_eiche: {
        parkett: 300100,
        kalkstein_kanafar: 304600,
        schiefer_massiv: 305600
      }
    },
    holzlattung: {
      kiefer: {
        parkett: 299500,
        kalkstein_kanafar: 304000,
        schiefer_massiv: 305000
      },
      fichte: {
        parkett: 300900,
        kalkstein_kanafar: 305400,
        schiefer_massiv: 306400
      },
      steirische_eiche: {
        parkett: 309700,
        kalkstein_kanafar: 314200,
        schiefer_massiv: 315200
      }
    },
    fassadenplatten_schwarz: {
      kiefer: {
        parkett: 326300,
        kalkstein_kanafar: 330800,
        schiefer_massiv: 331800
      },
      fichte: {
        parkett: 327700,
        kalkstein_kanafar: 332200,
        schiefer_massiv: 333200
      },
      steirische_eiche: {
        parkett: 336500,
        kalkstein_kanafar: 341000,
        schiefer_massiv: 342000
      }
    },
    fassadenplatten_weiss: {
      kiefer: {
        parkett: 326300,
        kalkstein_kanafar: 330800,
        schiefer_massiv: 331800
      },
      fichte: {
        parkett: 327700,
        kalkstein_kanafar: 332200,
        schiefer_massiv: 333200
      },
      steirische_eiche: {
        parkett: 336500,
        kalkstein_kanafar: 341000,
        schiefer_massiv: 342000
      }
    }
  }
}

// Grundstückscheck price
export const GRUNDSTUECKSCHECK_PRICE = 490

// Utility function to calculate combination price - EXACT logic from old configurator
export function calculateCombinationPrice(
  nestType: string,
  gebaeudehuelle: string,
  innenverkleidung: string,
  fussboden: string
): number {
  return COMBINATION_PRICES[nestType]?.[gebaeudehuelle]?.[innenverkleidung]?.[fussboden] || 0
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

export function getModuleSizeIndex(nestValue: string): number {
  const sizeMap: Record<string, number> = {
    'nest80': 0,
    'nest100': 1,
    'nest120': 2,
    'nest140': 3,
    'nest160': 4
  }
  return sizeMap[nestValue] || 0
} 