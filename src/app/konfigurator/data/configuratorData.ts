export interface CategoryData {
  id: string
  title: string
  subtitle: string
  options: Array<{
    id: string
    name: string
    description: string
    price: {
      type: 'base' | 'upgrade' | 'included' | 'standard' | 'discount'
      amount?: number
      monthly?: number
    }
  }>
  infoBox?: {
    title: string
    description?: string
    action?: string
  }
  facts?: {
    title: string
    content: string[]
    links?: Array<{
      text: string
      href: string
    }>
  }
}

export const configuratorData: CategoryData[] = [
  {
    id: 'nest',
    title: 'Nest',
    subtitle: 'Wie groß',
    options: [
      {
        id: 'nest80',
        name: 'Nest 80',
        description: '4 Module für\n75m² Nutzfläche',
        price: { type: 'base', amount: 155500, monthly: 816 }
      },
      {
        id: 'nest100',
        name: 'Nest 100',
        description: '5 Module für\n95m² Nutzfläche',
        price: { type: 'base', amount: 189100, monthly: 993 }
      },
      {
        id: 'nest120',
        name: 'Nest 120',
        description: '6 Module für\n115m² Nutzfläche',
        price: { type: 'base', amount: 222700, monthly: 1169 }
      },
      {
        id: 'nest140',
        name: 'Nest 140',
        description: '7 Module für\n135m² Nutzfläche',
        price: { type: 'base', amount: 256300, monthly: 1346 }
      },
      {
        id: 'nest160',
        name: 'Nest 160',
        description: '8 Module für\n155m² Nutzfläche',
        price: { type: 'base', amount: 289900, monthly: 1522 }
      }
    ],
    facts: {
      title: 'Energieausweis A++',
      content: [
        'Heizungsart: Beliebig',
        'Heizwärmebedarf: ≤60kWh/m²a',
        'CO₂-Emissionen: 15kg CO2/m²',
        'CO₂-Bindung: ca. 1.000kg/m²',
        'U-Wert: 0,15W/m²K',
        'Gesamteffizienzklasse: A++',
        'Berechnungsnormen: OIB RL 1-6'
      ]
    }
  },
  {
    id: 'geschossdecke',
    title: 'Geschossdecke',
    subtitle: 'Zusätzliche Ebenen',
    options: [
      {
        id: 'geschossdecke_module',
        name: 'Geschossdecke',
        description: 'Zusätzliche Geschossdecke', // Price will be added dynamically
        price: { type: 'upgrade', amount: 5000, monthly: 26 }
      }
    ]
  },
  {
    id: 'gebaeudehuelle',
    title: 'Gebäudehülle',
    subtitle: 'Kleide dich ein',
    options: [
      {
        id: 'trapezblech',
        name: 'Trapezblech',
        description: 'RAL 9005\n3000 x 1142 mm',
        price: { type: 'discount', amount: -9600, monthly: -50 } // Cheaper option vs standard
      },
      {
        id: 'holzlattung',
        name: 'Holzlattung Lärche Natur',
        description: 'PEFC-Zertifiziert 5,0 x 4,0 cm\nNatürlich. Ökologisch.',
        price: { type: 'standard', amount: 9600, monthly: 50 } // Standard item with background price
      },
      {
        id: 'fassadenplatten_schwarz',
        name: 'Fassadenplatten Schwarz',
        description: '268 x 130 cm\nSustainability Award 2024',
        price: { type: 'upgrade', amount: 26800, monthly: 141 } // 36400 - 9600 = 26800 vs standard
      },
      {
        id: 'fassadenplatten_weiss',
        name: 'Fassadenplatten Weiß',
        description: '268 x 130 cm\nSustainability Award 2024',
        price: { type: 'upgrade', amount: 26800, monthly: 141 } // 36400 - 9600 = 26800 vs standard
      }
    ],
    infoBox: {
      title: 'Daraus besteht dein Nest - Außenhülle'
    }
  },
  {
    id: 'pvanlage',
    title: 'PV-Anlage',
    subtitle: 'Kleide dich ein',
    options: [
      {
        id: 'pv_modules',
        name: 'Photovoltaik-Module',
        description: '0,4 kWpeak pro Panel\n3 Panels pro PV-Modul',
        price: { type: 'upgrade', amount: 1170, monthly: 6 }
      }
    ],
    infoBox: {
      title: 'Mehr zur grünen Energie für dein Nest'
    }
  },
  {
    id: 'innenverkleidung',
    title: 'Innenverkleidung',
    subtitle: 'Der Charakter',
    options: [
      {
        id: 'ohne_innenverkleidung',
        name: 'Verbaue deine Innenwandpanele selbst',
        description: '',
        price: { type: 'included', amount: 0 } // New baseline (0€)
      },
      {
        id: 'fichte',
        name: 'Fichte',
        description: 'PEFC-Zertifiziert\nSicht 1,9 cm',
        price: { type: 'upgrade', amount: 23020, monthly: 96 } // Now shows as upgrade from baseline
      },
      {
        id: 'laerche',
        name: 'Lärche',
        description: 'PEFC-Zertifiziert\nSicht 1,5 cm',
        price: { type: 'upgrade', amount: 31921, monthly: 133 } // Upgrade from baseline
      },
      {
        id: 'steirische_eiche',
        name: 'Steirische Eiche',
        description: 'PEFC-Zertifiziert\nSicht 1,9 cm',
        price: { type: 'upgrade', amount: 38148, monthly: 159 } // Upgrade from baseline
      }
    ],
    infoBox: {
      title: 'Mehr Informationen zur Innenverkleidung'
    }
  },
  {
    id: 'fussboden',
    title: 'Bodenbelag',
    subtitle: 'Oberflächen',
    options: [
      {
        id: 'ohne_belag',
        name: 'Verlege deinen Boden selbst',
        description: '',
        price: { type: 'included', amount: 0 }
      },
      {
        id: 'parkett',
        name: 'Parkett Eiche',
        description: 'Eichenparkett\nSchwimmend verlegt\n',
        price: { type: 'upgrade', amount: 3800, monthly: 20 }
      },
      {
        id: 'kalkstein_kanafar',
        name: 'Steinbelag Hell',
        description: 'Schieferplatten Kalkstein\n800 x 800 x 10 cm',
        price: { type: 'upgrade', amount: 4500, monthly: 24 }
      },
      {
        id: 'schiefer_massiv', // granit paths but display as schiefer
        name: 'Steinbelag Dunkel',
        description: 'Feinsteinzeug Schieferoptik\n800 x 800 x 5,5cm',
        price: { type: 'upgrade', amount: 5500, monthly: 29 }
      }
    ],
    infoBox: {
      title: 'Daraus besteht dein Nest - Fußboden'
    }
  },
  {
    id: 'bodenaufbau',
    title: 'Bodenaufbau',
    subtitle: 'Heizungssystem',
    options: [
      {
        id: 'ohne_heizung',
        name: 'Verlege dein Heizsystem selbst',
        description: '',
        price: { type: 'included', amount: 0 }
      },
      {
        id: 'elektrische_fussbodenheizung',
        name: 'Elektrische Fußbodenheizung',
        description: 'Elektrisches Heizungssystem\nDynamische Preisgestaltung nach Größe',
        price: { type: 'upgrade', amount: 5000, monthly: 26 } // Base price for nest80
      },
      {
        id: 'wassergefuehrte_fussbodenheizung',
        name: 'Wassergeführte Fußbodenheizung',
        description: 'Wasserbasiertes Heizungssystem\nDynamische Preisgestaltung nach Größe',
        price: { type: 'upgrade', amount: 7500, monthly: 39 } // Base price for nest80
      }
    ]
  },
  {
    id: 'belichtungspaket',
    title: 'Belichtungspaket',
    subtitle: 'Deine Helligkeit',
    options: [
      {
        id: 'light',
        name: 'Light',
        description: '15% der Nestfläche\nGrundbelichtung',
        price: { type: 'upgrade', amount: 0, monthly: 0 } // Dynamic pricing
      },
      {
        id: 'medium',
        name: 'Medium',
        description: '22% der Nestfläche\nAusgewogene Belichtung',
        price: { type: 'upgrade', amount: 0, monthly: 0 } // Dynamic pricing
      },
      {
        id: 'bright',
        name: 'Bright',
        description: '28% der Nestfläche\nMaximale Helligkeit',
        price: { type: 'upgrade', amount: 0, monthly: 0 } // Dynamic pricing
      }
    ],
    infoBox: {
      title: 'So platzierst du deine Öffnungen',
      description: 'Wähle die Menge an Fenstern und Türen basierend auf deinen Lichtbedürfnissen.'
    }
  },
  {
    id: 'fenster',
    title: 'Fenster & Türen',
    subtitle: 'Deine Öffnungen',
    options: [
      {
        id: 'pvc_fenster',
        name: 'PVC',
        description: 'RAL 9016\nKunststoff',
        price: { type: 'upgrade', amount: 280, monthly: 2 }
      },
      {
        id: 'holz',
        name: 'Holz',
        description: 'Farbtöne können variieren\nFichte',
        price: { type: 'upgrade', amount: 400, monthly: 3 }
      },
      {
        id: 'aluminium_schwarz',
        name: 'Aluminium Holz',
        description: 'RAL 9005 - Tiefschwarz\nBis zu 6,0 x 3,2 m',
        price: { type: 'upgrade', amount: 700, monthly: 4 }
      }
    ],
    infoBox: {
      title: 'Die Materialien deiner Öffnungen',
      // description: 'Du bestimmst Individuell wie uns die Öffnungen für Fenster & Türen bestücken.'
    }
  },
  {
    id: 'planungspaket',
    title: 'Die Planungspakete',
    subtitle: 'Unser Service',
    options: [
      {
        id: 'basis',
        name: 'Planung Basis',
        description: 'Einreichplanung (Raumteilung)\nFachberatung und Baubegleitung',
        price: { type: 'included', amount: 0, monthly: 0 }
      },
      {
        id: 'plus',
        name: 'Planung Plus',
        description: 'Inkl. Planungspaket Basis\nPlus HKLS-Planung (Gebäudetechnik)',
        price: { type: 'upgrade', amount: 9600, monthly: 56 } // Updated Nov 2025
      },
      {
        id: 'pro',
        name: 'Planung Pro',
        description: 'Inkl. Planungspaket Plus\nPlus Interiorkonzept (Möblierungsvorschlag)',
        price: { type: 'upgrade', amount: 12700, monthly: 74 } // Updated Nov 2025
      }
    ]
  }
] 