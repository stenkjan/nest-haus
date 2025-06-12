import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.popularConfiguration.deleteMany()
  await prisma.pricingRule.deleteMany()
  await prisma.houseOption.deleteMany()

  // ===== HOUSE OPTIONS =====
  
  // Nest Types
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'nest',
        value: 'nest80',
        name: 'Nest 80',
        description: '80m² Wohnfläche, ideal für Paare oder kleine Familien',
        basePrice: 145000,
        sortOrder: 1,
        properties: { area: 80, bedrooms: 2, maxPersons: 4 }
      },
      {
        category: 'nest',
        value: 'nest100',
        name: 'Nest 100',
        description: '100m² Wohnfläche, perfekt für Familien',
        basePrice: 175000,
        sortOrder: 2,
        properties: { area: 100, bedrooms: 3, maxPersons: 5 }
      },
      {
        category: 'nest',
        value: 'nest120',
        name: 'Nest 120',
        description: '120m² Wohnfläche, großzügig für größere Familien',
        basePrice: 205000,
        sortOrder: 3,
        properties: { area: 120, bedrooms: 4, maxPersons: 6 }
      }
    ]
  })

  // Gebäudehülle
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'gebaeudehuelle',
        value: 'holzlattung',
        name: 'Holzlattung',
        description: 'Natürliche Holzoptik, nachhaltig und langlebig',
        basePrice: 0,
        sortOrder: 1,
        properties: { material: 'wood', maintenance: 'medium', sustainability: 'high' }
      },
      {
        category: 'gebaeudehuelle',
        value: 'trapezblech',
        name: 'Trapezblech',
        description: 'Moderne Metalloptik, wartungsarm und robust',
        basePrice: 5000,
        sortOrder: 2,
        properties: { material: 'metal', maintenance: 'low', sustainability: 'medium' }
      }
    ]
  })

  // Innenverkleidung
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'innenverkleidung',
        value: 'kiefer',
        name: 'Kiefer',
        description: 'Helle, freundliche Holzoptik',
        basePrice: 0,
        sortOrder: 1,
        properties: { woodType: 'pine', color: 'light', durability: 'good' }
      },
      {
        category: 'innenverkleidung',
        value: 'eiche',
        name: 'Eiche',
        description: 'Premium Eichenholz, elegant und hochwertig',
        basePrice: 8000,
        sortOrder: 2,
        properties: { woodType: 'oak', color: 'medium', durability: 'excellent' }
      },
      {
        category: 'innenverkleidung',
        value: 'laerche',
        name: 'Lärche',
        description: 'Robustes Lärchenholz mit natürlicher Maserung',
        basePrice: 5000,
        sortOrder: 3,
        properties: { woodType: 'larch', color: 'medium', durability: 'very good' }
      }
    ]
  })

  // Fußboden
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'fussboden',
        value: 'laminat',
        name: 'Laminat',
        description: 'Pflegeleicht und robust',
        basePrice: 0,
        sortOrder: 1,
        properties: { material: 'laminate', maintenance: 'easy', durability: 'good' }
      },
      {
        category: 'fussboden',
        value: 'parkett',
        name: 'Parkett',
        description: 'Echtholz-Parkett, natürlich und hochwertig',
        basePrice: 12000,
        sortOrder: 2,
        properties: { material: 'wood', maintenance: 'medium', durability: 'excellent' }
      }
    ]
  })

  // PV-Anlage (Optional)
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'pvanlage',
        value: 'none',
        name: 'Keine PV-Anlage',
        description: 'Standard ohne Solaranlage',
        basePrice: 0,
        sortOrder: 1,
        properties: { power: 0, panels: 0 }
      },
      {
        category: 'pvanlage',
        value: '5kwp',
        name: '5 kWp PV-Anlage',
        description: 'Kleine Solaranlage für Grundversorgung',
        basePrice: 8000,
        sortOrder: 2,
        properties: { power: 5, panels: 16, production: '5000 kWh/Jahr' }
      },
      {
        category: 'pvanlage',
        value: '10kwp',
        name: '10 kWp PV-Anlage',
        description: 'Mittlere Solaranlage für gute Eigenversorgung',
        basePrice: 15000,
        sortOrder: 3,
        properties: { power: 10, panels: 32, production: '10000 kWh/Jahr' }
      },
      {
        category: 'pvanlage',
        value: '15kwp',
        name: '15 kWp PV-Anlage',
        description: 'Große Solaranlage für maximale Autarkie',
        basePrice: 22000,
        sortOrder: 4,
        properties: { power: 15, panels: 48, production: '15000 kWh/Jahr' }
      }
    ]
  })

  // Fenster (Optional)
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'fenster',
        value: 'standard',
        name: 'Standard Fenster',
        description: 'Doppelverglasung, gute Isolierung',
        basePrice: 0,
        sortOrder: 1,
        properties: { glazing: 'double', uValue: '1.3', frame: 'standard' }
      },
      {
        category: 'fenster',
        value: 'premium',
        name: 'Premium Fenster',
        description: 'Dreifachverglasung, beste Isolierung',
        basePrice: 6000,
        sortOrder: 2,
        properties: { glazing: 'triple', uValue: '0.8', frame: 'premium' }
      }
    ]
  })

  // Planungspaket (Optional)
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'planungspaket',
        value: 'basic',
        name: 'Basic Planung',
        description: 'Grundlegende Planungsleistungen',
        basePrice: 0,
        sortOrder: 1,
        properties: { services: ['Grundriss', 'Ansichten'], duration: '2-3 Wochen' }
      },
      {
        category: 'planungspaket',
        value: 'comfort',
        name: 'Comfort Planung',
        description: 'Erweiterte Planungsleistungen inkl. 3D-Visualisierung',
        basePrice: 3000,
        sortOrder: 2,
        properties: { services: ['Grundriss', 'Ansichten', '3D-Rendering'], duration: '3-4 Wochen' }
      },
      {
        category: 'planungspaket',
        value: 'premium',
        name: 'Premium Planung',
        description: 'Vollständige Planungsleistungen inkl. Beratung vor Ort',
        basePrice: 6000,
        sortOrder: 3,
        properties: { services: ['Grundriss', 'Ansichten', '3D-Rendering', 'Vor-Ort-Beratung'], duration: '4-5 Wochen' }
      }
    ]
  })

  // ===== PRICING RULES =====
  
  const nestTypes = ['nest80', 'nest100', 'nest120']
  const gebaeudehuelle = ['holzlattung', 'trapezblech']
  const innenverkleidung = ['kiefer', 'eiche', 'laerche']
  const fussboden = ['laminat', 'parkett']

  const pricingRules = []
  for (const nest of nestTypes) {
    for (const huelle of gebaeudehuelle) {
      for (const innen of innenverkleidung) {
        for (const boden of fussboden) {
          // Base prices
          const basePrices = { nest80: 145000, nest100: 175000, nest120: 205000 }
          const huellePrices = { holzlattung: 0, trapezblech: 5000 }
          const innenPrices = { kiefer: 0, eiche: 8000, laerche: 5000 }
          const bodenPrices = { laminat: 0, parkett: 12000 }

          const totalPrice = basePrices[nest as keyof typeof basePrices] + 
                           huellePrices[huelle as keyof typeof huellePrices] + 
                           innenPrices[innen as keyof typeof innenPrices] + 
                           bodenPrices[boden as keyof typeof bodenPrices]

          pricingRules.push({
            nestType: nest,
            gebaeudehuelle: huelle,
            innenverkleidung: innen,
            fussboden: boden,
            totalPrice
          })
        }
      }
    }
  }

  await prisma.pricingRule.createMany({ data: pricingRules })

  console.log('✅ Database seeding completed!')
  console.log(`📊 Created ${await prisma.houseOption.count()} house options`)
  console.log(`💰 Created ${await prisma.pricingRule.count()} pricing rules`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 