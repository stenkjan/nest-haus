export interface CategoryData {
  id: string
  title: string
  subtitle: string
  options: Array<{
    id: string
    name: string
    description: string
    price: {
      type: 'base' | 'upgrade' | 'included'
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
        description: '80m² Nutzfläche',
        price: { type: 'base', amount: 155500, monthly: 816 }
      },
      {
        id: 'nest100',
        name: 'Nest. 100',
        description: '100m² Nutzfläche',
        price: { type: 'base', amount: 189100, monthly: 993 }
      },
      {
        id: 'nest120',
        name: 'Nest. 120',
        description: '120m² Nutzfläche',
        price: { type: 'base', amount: 222700, monthly: 1169 }
      },
      {
        id: 'nest140',
        name: 'Nest. 140',
        description: '140m² Nutzfläche',
        price: { type: 'base', amount: 256300, monthly: 1346 }
      },
      {
        id: 'nest160',
        name: 'Nest. 160',
        description: '160m² Nutzfläche',
        price: { type: 'base', amount: 289900, monthly: 1522 }
      }
    ],
    infoBox: {
      title: 'Noch Fragen offen?',
      description: 'Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch.'
    },
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
        price: { type: 'included' }
      },
      {
        id: 'holzlattung',
        name: 'Holzlattung Lärche Natur',
        description: 'PEFC-Zertifiziert 5,0 x 4,0 cm\nNatürlich. Ökologisch.',
        price: { type: 'upgrade', amount: 9600, monthly: 50 }
      },
      {
        id: 'fassadenplatten_schwarz',
        name: 'Fassadenplatten Schwarz',
        description: 'FUNDERMAX® 268 x 130 cm\nSustainability Award 2024',
        price: { type: 'upgrade', amount: 36400, monthly: 191 }
      },
      {
        id: 'fassadenplatten_weiss',
        name: 'Fassadenplatten Weiß',
        description: 'FUNDERMAX® 268 x 130 cm\nSustainability Award 2024',
        price: { type: 'upgrade', amount: 36400, monthly: 191 }
      }
    ],
    infoBox: {
      title: 'Mehr Informationen zu den Materialien'
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
        price: { type: 'included' }
      },
      {
        id: 'fichte',
        name: 'Fichte',
        description: 'PEFC - Zertifiziert - Sicht 1,9 cm',
        price: { type: 'upgrade', amount: 1400, monthly: 7 }
      },
      {
        id: 'steirische_eiche',
        name: 'Steirische Eiche',
        description: 'PEFC - Zertifiziert - Sicht 1,9 cm',
        price: { type: 'upgrade', amount: 10200, monthly: 54 }
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
    facts: {
      title: 'Ein Patentiertes System',
      content: [
        'Die Technologie, die dein Nest transportabel macht, wird mittels unseres patentierten Systems sichergestellt. Unsere technischen Innovationen sind einzigartig am Markt und wurden in Kooperation mit der "Technical University of Graz" entwickelt.',
        'Erprobt im Labor für Bauphysik und getestet unter realen Bedingungen in Österreich. Dein Nest.'
      ],
      links: [
        {
          text: 'Mehr Informationen',
          href: '/system'
        }
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
        id: 'fichte',
        name: 'Fichte',
        description: 'Holzfenster Lärche',
        price: { type: 'upgrade', amount: 400, monthly: 3 }
      },
      {
        id: 'steirische_eiche',
        name: 'Steirische Eiche',
        description: 'RAL 9005 - Tiefschwarz',
        price: { type: 'upgrade', amount: 550, monthly: 3 }
      },
      {
        id: 'aluminium',
        name: 'Aluminium',
        description: 'RAL 9005 - Tiefschwarz\nbis 6000 x 3200 mm',
        price: { type: 'upgrade', amount: 700, monthly: 4 }
      }
    ],
    infoBox: {
      title: 'Fenster & Türen',
      description: 'Du bestimmst Individuell wie uns die Öffnungen für Fenster & Türen bestücken.'
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
        price: { type: 'base', amount: 133000, monthly: 700 }
      },
      {
        id: 'plus',
        name: 'Planung Plus',
        description: 'Inkl. Planungspaket Basis\nPlus HKLS-Planung (Gebäudetechnik)',
        price: { type: 'base', amount: 133000, monthly: 700 }
      },
      {
        id: 'pro',
        name: 'Planung Pro',
        description: 'Inkl. Planungspaket Plus\nPlus Interiorkonzept (Möblierungsvorschlag)',
        price: { type: 'base', amount: 133000, monthly: 700 }
      }
    ],
    infoBox: {
      title: 'Welches Planungspaket passt zu dir?',
      description: 'Siehe dir die Pakete im Detail an und entdecke welches am besten zu dir passt',
      action: 'Weitere Informationen'
    },
    facts: {
      title: 'Gemeinsam großes schaffen.',
      content: [
        'Wir konzentrieren uns darauf alle standardisierten Arbeitsprozesse zu optimieren und höchste Qualität zu fairen Preisen sicher zu stellen.',
        'Darauf aufbauend machst du dein Nest. Individuell.'
      ],
      links: [
        {
          text: 'Weitere Informationen',
          href: '/planungspakete'
        }
      ]
    }
  },
  {
    id: 'pvanlage',
    title: 'PV-Anlage',
    subtitle: 'Kleide dich ein',
    options: [
      {
        id: 'pv_panels',
        name: 'Photovoltaik-Panels',
        description: '0,4 kWpeak pro Panel',
        price: { type: 'upgrade', amount: 390, monthly: 2 }
      }
    ],
    infoBox: {
      title: 'Mehr Informationen zu Photovoltaik'
    }
  }
] 