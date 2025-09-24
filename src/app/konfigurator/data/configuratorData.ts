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
        name: 'Nest. 80',
        description: '75m² Nutzfläche',
        price: { type: 'base', amount: 155500, monthly: 816 }
      },
      {
        id: 'nest100',
        name: 'Nest. 100',
        description: '95m² Nutzfläche',
        price: { type: 'base', amount: 189100, monthly: 993 }
      },
      {
        id: 'nest120',
        name: 'Nest. 120',
        description: '115m² Nutzfläche',
        price: { type: 'base', amount: 222700, monthly: 1169 }
      },
      {
        id: 'nest140',
        name: 'Nest. 140',
        description: '135m² Nutzfläche',
        price: { type: 'base', amount: 256300, monthly: 1346 }
      },
      {
        id: 'nest160',
        name: 'Nest. 160',
        description: '155m² Nutzfläche',
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
    id: 'gebaeudehuelle',
    title: 'Gebäudehülle',
    subtitle: 'Kleide dich ein',
    options: [
      {
        id: 'trapezblech',
        name: 'Trapezblech',
        description: 'RAL 9005 - 3000 x 1142 mm',
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
        description: 'FUNDERMAX® 268 x 130 cm\nSustainability Award 2024',
        price: { type: 'upgrade', amount: 26800, monthly: 141 } // 36400 - 9600 = 26800 vs standard
      },
      {
        id: 'fassadenplatten_weiss',
        name: 'Fassadenplatten Weiß',
        description: 'FUNDERMAX® 268 x 130 cm\nSustainability Award 2024',
        price: { type: 'upgrade', amount: 26800, monthly: 141 } // 36400 - 9600 = 26800 vs standard
      }
    ],
    infoBox: {
      title: 'Mehr Informationen zu den Materialien'
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
        description: '3 x 0,4 kWpeak Panele pro Modul',
        price: { type: 'upgrade', amount: 1170, monthly: 6 }
      }
    ],
    infoBox: {
      title: 'Mehr Informationen zu Photovoltaik'
    }
  },
  {
    id: 'innenverkleidung',
    title: 'Innenverkleidung',
    subtitle: 'Der Charakter',
    options: [
      {
        id: 'kiefer',
        name: 'Kiefer',
        description: 'PEFC - Zertifiziert - Sicht 1,5 cm',
        price: { type: 'discount', amount: -1400, monthly: -7 } // Cheaper option vs standard
      },
      {
        id: 'fichte',
        name: 'Fichte',
        description: 'PEFC - Zertifiziert - Sicht 1,9 cm',
        price: { type: 'standard', amount: 1400, monthly: 7 } // Standard item with background price
      },
      {
        id: 'steirische_eiche',
        name: 'Steirische Eiche',
        description: 'PEFC - Zertifiziert - Sicht 1,9 cm',
        price: { type: 'upgrade', amount: 8800, monthly: 47 } // 10200 - 1400 = 8800 vs standard
      }
    ],
    infoBox: {
      title: 'Mehr Informationen zur Innenverkleidung'
    }
  },
  {
    id: 'fussboden',
    title: 'Der Fußboden',
    subtitle: 'Oberflächen',
    options: [
      {
        id: 'parkett',
        name: 'Parkett Eiche',
        description: 'Schwimmend verlegt',
        price: { type: 'included' }
      },
      {
        id: 'kalkstein_kanafar',
        name: 'Kalkstein Kanafar',
        description: 'Schieferplatten Kalkstein\n800 x 800 x 10 cm',
        price: { type: 'upgrade', amount: 4500, monthly: 24 }
      },
      {
        id: 'schiefer_massiv', // granit paths but display as schiefer
        name: 'Schiefer Massiv',
        description: 'Feinsteinzeug Schieferoptik\n800 x 800 x 5,5cm',
        price: { type: 'upgrade', amount: 5500, monthly: 29 }
      }
    ],
    infoBox: {
      title: 'Mehr Informationen zum Fußboden'
    }
  },
  {
    id: 'belichtungspaket',
    title: 'Belichtungspaket',
    subtitle: 'Deine Helligkeit',
    options: [
      {
        id: 'light',
        name: 'Light',
        description: '12% der Nestfläche\nGrundbelichtung',
        price: { type: 'upgrade', amount: 0, monthly: 0 } // Dynamic pricing
      },
      {
        id: 'medium',
        name: 'Medium',
        description: '16% der Nestfläche\nAusgewogene Belichtung',
        price: { type: 'upgrade', amount: 0, monthly: 0 } // Dynamic pricing
      },
      {
        id: 'bright',
        name: 'Bright',
        description: '22% der Nestfläche\nMaximale Helligkeit',
        price: { type: 'upgrade', amount: 0, monthly: 0 } // Dynamic pricing
      }
    ],
    infoBox: {
      title: 'Belichtungspaket',
      description: 'Wähle die Menge an Fenstern und Türen basierend auf deinen Lichtbedürfnissen.'
    },
    facts: {
      title: 'Informationen zu den Fenstern',
      content: [
        'Die Größe und Platzierung deiner Fenster in deinem Nest-Haus werden hier nur schematisch angezeigt.'
      ]
    }
  },
  {
    id: 'fenster',
    title: 'Fenster & Türen',
    subtitle: 'Deine Öffnungen',
    options: [
      {
        id: 'pvc_fenster',
        name: 'PVC Fenster',
        description: 'RAL 9016 - Kunststoff',
        price: { type: 'upgrade', amount: 280, monthly: 2 }
      },
      {
        id: 'holz',
        name: 'Holz',
        description: 'Holzfenster Lärche',
        price: { type: 'upgrade', amount: 400, monthly: 3 }
      },
      {
        id: 'aluminium_schwarz',
        name: 'Aluminium Schwarz',
        description: 'RAL 9005 - Tiefschwarz\nbis 6000 x 3200 mm',
        price: { type: 'upgrade', amount: 700, monthly: 4 }
      },
      {
        id: 'aluminium_weiss',
        name: 'Aluminium Weiß',
        description: 'RAL 9016 - Weiß\nbis 6000 x 3200 mm',
        price: { type: 'upgrade', amount: 700, monthly: 4 }
      }
    ],
    infoBox: {
      title: 'Fenster & Türen',
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
        price: { type: 'upgrade', amount: 10900, monthly: 63 }
      },
      {
        id: 'plus',
        name: 'Planung Plus',
        description: 'Inkl. Planungspaket Basis\nPlus HKLS-Planung (Gebäudetechnik)',
        price: { type: 'upgrade', amount: 16900, monthly: 98 }
      },
      {
        id: 'pro',
        name: 'Planung Pro',
        description: 'Inkl. Planungspaket Plus\nPlus Interiorkonzept (Möblierungsvorschlag)',
        price: { type: 'upgrade', amount: 21900, monthly: 127 }
      }
    ]
  }
] 