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
        name: 'Parkett',
        description: 'Hochwertiger Parkettboden',
        price: { type: 'included' }
      },
      {
        id: 'vinyl',
        name: 'Vinyl',
        description: 'Moderner Vinylboden',
        price: { type: 'upgrade', amount: 2500, monthly: 13 }
      },
      {
        id: 'fliesen',
        name: 'Fliesen',
        description: 'Keramische Fliesen',
        price: { type: 'upgrade', amount: 4200, monthly: 22 }
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
    id: 'pvanlage',
    title: 'PV-Anlage',
    subtitle: 'Saubere Energie',
    options: [
      {
        id: 'pv_standard',
        name: 'PV-Module Standard',
        description: 'Hocheffiziente Solarmodule',
        price: { type: 'upgrade', amount: 1200, monthly: 6 }
      },
      {
        id: 'pv_premium',
        name: 'PV-Module Premium',
        description: 'Premium Solarmodule mit höherem Wirkungsgrad',
        price: { type: 'upgrade', amount: 1500, monthly: 8 }
      }
    ],
    infoBox: {
      title: 'Mehr Informationen zu Photovoltaik'
    }
  },
  {
    id: 'fenster',
    title: 'Fenster & Türen',
    subtitle: 'Deine Öffnungen',
    options: [
      {
        id: 'fenster_standard',
        name: 'Fenster Standard',
        description: 'Dreh-Kipp-Fenster',
        price: { type: 'upgrade', amount: 450, monthly: 2 }
      },
      {
        id: 'fenster_premium',
        name: 'Fenster Premium',
        description: 'Hochwertige Fenster mit besserer Isolierung',
        price: { type: 'upgrade', amount: 650, monthly: 3 }
      }
    ],
    infoBox: {
      title: 'Mehr Informationen zu Fenstern'
    },
    facts: {
      title: 'Fenster & Türen',
      content: [
        'Du bestimmst Individuell wo du deine Öffnungen für Fenster & Türen benötigst.',
        'Nach Reservierung setzen wir uns mit dir in Verbindung und definieren die Positionen deiner Fenster & Türen.',
        'Die Fensteroptionen im Konfigurator beziehen sich auf klassische Dreh-Kipp-Flügel und Türen. Sonderlösungen wie Hebeschiebetüren sind nicht im Preis enthalten und können bei Bedarf individuell kalkuliert werden.',
        'Die angegebenen Quadratmeterpreise beziehen sich auf das lichte Einbaumaß der Fensteröffnungen.'
      ],
      links: [
        {
          text: 'Mehr Informationen',
          href: '/fenster-info'
        }
      ]
    }
  },
  {
    id: 'planungspaket',
    title: 'Die Pakete',
    subtitle: 'Dein Service',
    options: [
      {
        id: 'basis',
        name: 'Basis Paket',
        description: 'Grundlegende Planungsleistungen\nBauantrag\nStatik\nEnergieausweis',
        price: { type: 'included' }
      },
      {
        id: 'komfort',
        name: 'Komfort Paket',
        description: 'Erweiterte Planungsleistungen\nAlles aus Basis\nBauleitung\nKoordination',
        price: { type: 'upgrade', amount: 8500, monthly: 45 }
      },
      {
        id: 'premium',
        name: 'Premium Paket',
        description: 'Vollumfängliche Planungsleistungen\nAlles aus Komfort\nInnenarchitektur\nLandschaftsplanung',
        price: { type: 'upgrade', amount: 15000, monthly: 79 }
      }
    ],
    infoBox: {
      title: 'Welches Planungspaket passt zu dir?',
      description: 'Sehe dir die Pakete im Detail an und entdecke, welches am besten zu dir passt.'
    },
    facts: {
      title: 'Gemeinsam großes Schaffen',
      content: [
        'Wir konzentrieren uns darauf, alle standardisierten Arbeitsprozesse zu optimieren und höchste Qualität zu fairen Preisen sicherzustellen.',
        'Darauf aufbauend machst du dein Nest individuell.'
      ],
      links: [
        {
          text: 'Mehr Informationen',
          href: '/gemeinsam'
        }
      ]
    }
  }
] 