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
  }
  // Add more categories as needed
] 