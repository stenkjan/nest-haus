import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.popularConfiguration.deleteMany()
  await prisma.pricingRule.deleteMany()
  await prisma.houseOption.deleteMany()

  // ===== HOUSE OPTIONS - EXACT PRICES FROM OLD CONFIGURATOR =====

  // Nest Types - ORIGINAL PRICES
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'nest',
        value: 'nest80',
        name: 'Nest. 80',
        description: '80m² Nutzfläche',
        basePrice: 155500,
        sortOrder: 1,
        properties: { area: 80, bedrooms: 2, maxPersons: 4 }
      },
      {
        category: 'nest',
        value: 'nest100',
        name: 'Nest. 100',
        description: '100m² Nutzfläche',
        basePrice: 189100,
        sortOrder: 2,
        properties: { area: 100, bedrooms: 3, maxPersons: 5 }
      },
      {
        category: 'nest',
        value: 'nest120',
        name: 'Nest. 120',
        description: '120m² Nutzfläche',
        basePrice: 222700,
        sortOrder: 3,
        properties: { area: 120, bedrooms: 4, maxPersons: 6 }
      },
      {
        category: 'nest',
        value: 'nest140',
        name: 'Nest. 140',
        description: '140m² Nutzfläche',
        basePrice: 256300,
        sortOrder: 4,
        properties: { area: 140, bedrooms: 5, maxPersons: 7 }
      },
      {
        category: 'nest',
        value: 'nest160',
        name: 'Nest. 160',
        description: '160m² Nutzfläche',
        basePrice: 289900,
        sortOrder: 5,
        properties: { area: 160, bedrooms: 6, maxPersons: 8 }
      }
    ]
  })

  // Gebäudehülle - ORIGINAL PRICES
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'gebaeudehuelle',
        value: 'trapezblech',
        name: 'Trapezblech',
        description: 'RAL 9005 - 3000 x 1142 mm',
        basePrice: 0,
        sortOrder: 1,
        properties: { material: 'metal', maintenance: 'low', included: true }
      },
      {
        category: 'gebaeudehuelle',
        value: 'holzlattung',
        name: 'Holzlattung Lärche Natur',
        description: 'PEFC-Zertifiziert 5,0 x 4,0 cm\nNatürlich. Ökologisch.',
        basePrice: 9600,
        sortOrder: 2,
        properties: { material: 'wood', maintenance: 'medium', sustainability: 'high' }
      },
      {
        category: 'gebaeudehuelle',
        value: 'fassadenplatten_schwarz',
        name: 'Fassadenplatten Schwarz',
        description: '268 x 130 cm\nSustainability Award 2024',
        basePrice: 36400,
        sortOrder: 3,
        properties: { material: 'composite', maintenance: 'low', sustainability: 'high' }
      },
      {
        category: 'gebaeudehuelle',
        value: 'fassadenplatten_weiss',
        name: 'Fassadenplatten Weiß',
        description: '268 x 130 cm\nSustainability Award 2024',
        basePrice: 36400,
        sortOrder: 4,
        properties: { material: 'composite', maintenance: 'low', sustainability: 'high' }
      }
    ]
  })

  // Innenverkleidung - ORIGINAL PRICES
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'innenverkleidung',
        value: 'kiefer',
        name: 'Kiefer',
        description: 'PEFC - Zertifiziert - Sicht 1,5 cm',
        basePrice: 0,
        sortOrder: 1,
        properties: { woodType: 'pine', color: 'light', included: true }
      },
      {
        category: 'innenverkleidung',
        value: 'fichte',
        name: 'Fichte',
        description: 'PEFC - Zertifiziert - Sicht 1,9 cm',
        basePrice: 1400,
        sortOrder: 2,
        properties: { woodType: 'spruce', color: 'light', durability: 'good' }
      },
      {
        category: 'innenverkleidung',
        value: 'steirische_eiche',
        name: 'Steirische Eiche',
        description: 'PEFC - Zertifiziert - Sicht 1,9 cm',
        basePrice: 10200,
        sortOrder: 3,
        properties: { woodType: 'oak', color: 'medium', durability: 'excellent' }
      }
    ]
  })

  // Fußboden - ORIGINAL PRICES
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'fussboden',
        value: 'parkett',
        name: 'Parkett Eiche',
        description: 'Schwimmend verlegt',
        basePrice: 0,
        sortOrder: 1,
        properties: { material: 'wood', maintenance: 'medium', included: true }
      },
      {
        category: 'fussboden',
        value: 'kalkstein_kanafar',
        name: 'Kalkstein Kanafar',
        description: 'Schieferplatten Kalkstein\n800 x 800 x 10 cm',
        basePrice: 4500,
        sortOrder: 2,
        properties: { material: 'stone', maintenance: 'low', durability: 'excellent' }
      },
      {
        category: 'fussboden',
        value: 'schiefer_massiv',
        name: 'Schiefer Massiv',
        description: 'Feinsteinzeug Schieferoptik\n800 x 800 x 5,5cm',
        basePrice: 5500,
        sortOrder: 3,
        properties: { material: 'ceramic', maintenance: 'low', durability: 'excellent' }
      }
    ]
  })

  // PV-Anlage - ORIGINAL PRICES
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'pvanlage',
        value: 'pv_panels',
        name: 'Photovoltaik-Panels',
        description: '0,4 kWpeak pro Panel',
        basePrice: 390,
        sortOrder: 1,
        properties: { power: '0.4kWp', type: 'per_panel' }
      }
    ]
  })

  // Fenster - ORIGINAL PRICES
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'fenster',
        value: 'pvc_fenster',
        name: 'PVC Fenster',
        description: 'RAL 9016 - Kunststoff',
        basePrice: 290,
        sortOrder: 1,
        properties: { material: 'pvc', glazing: 'double', type: 'per_sqm' }
      },
      {
        category: 'fenster',
        value: 'fichte',
        name: 'Fichte',
        description: 'Holzfenster Fichte',
        basePrice: 600,
        sortOrder: 2,
        properties: { material: 'wood', glazing: 'double', type: 'per_sqm' }
      },
      {
        category: 'fenster',
        value: 'steirische_eiche',
        name: 'Steirische Eiche',
        description: 'RAL 9005 - Tiefschwarz',
        basePrice: 560,
        sortOrder: 3,
        properties: { material: 'wood', glazing: 'double', type: 'per_sqm' }
      },
      {
        category: 'fenster',
        value: 'aluminium',
        name: 'Aluminium',
        description: 'RAL 9005 - Tiefschwarz\nbis 6000 x 3200 mm',
        basePrice: 700,
        sortOrder: 4,
        properties: { material: 'aluminum', glazing: 'triple', type: 'per_sqm' }
      }
    ]
  })

  // Planungspaket - ORIGINAL PRICES
  await prisma.houseOption.createMany({
    data: [
      {
        category: 'planungspaket',
        value: 'basis',
        name: 'Planung Basis',
        description: 'Einreichplanung (Baugenehmigung)\nFachplanung und Baustützung',
        basePrice: 700,
        sortOrder: 1,
        properties: { level: 'basic', includes: ['building_permit', 'technical_planning'] }
      },
      {
        category: 'planungspaket',
        value: 'plus',
        name: 'Planung Plus',
        description: 'Einreichplanung Basis\nPlus HVLS-Planung (Gebäudetechnik)',
        basePrice: 700,
        sortOrder: 2,
        properties: { level: 'plus', includes: ['building_permit', 'technical_planning', 'hvac'] }
      },
      {
        category: 'planungspaket',
        value: 'pro',
        name: 'Planung Pro',
        description: 'Inkl. Planungspaket Plus\nPlus Baustüberwachung (Modalbestandschef)',
        basePrice: 700,
        sortOrder: 3,
        properties: { level: 'pro', includes: ['building_permit', 'technical_planning', 'hvac', 'supervision'] }
      }
    ]
  })

  // ===== COMBINATION PRICING RULES - EXACT FROM OLD CONFIGURATOR =====

  const nestTypes = ['nest80', 'nest100', 'nest120', 'nest140', 'nest160']
  const gebaeudehuelle = ['trapezblech', 'holzlattung', 'fassadenplatten_schwarz', 'fassadenplatten_weiss']
  const innenverkleidung = ['kiefer', 'fichte', 'steirische_eiche']
  const fussboden = ['parkett', 'kalkstein_kanafar', 'schiefer_massiv']

  // EXACT COMBINATION PRICES FROM OLD CONFIGURATOR
  const combinationPrices: Record<string, Record<string, Record<string, Record<string, number>>>> = {
    nest80: {
      trapezblech: {
        kiefer: { parkett: 155500, kalkstein_kanafar: 160000, schiefer_massiv: 161000 },
        fichte: { parkett: 156900, kalkstein_kanafar: 161400, schiefer_massiv: 162400 },
        steirische_eiche: { parkett: 165700, kalkstein_kanafar: 170200, schiefer_massiv: 171200 }
      },
      holzlattung: {
        kiefer: { parkett: 165100, kalkstein_kanafar: 169600, schiefer_massiv: 170600 },
        fichte: { parkett: 166500, kalkstein_kanafar: 171000, schiefer_massiv: 172000 },
        steirische_eiche: { parkett: 175300, kalkstein_kanafar: 179800, schiefer_massiv: 180800 }
      },
      fassadenplatten_schwarz: {
        kiefer: { parkett: 191900, kalkstein_kanafar: 196400, schiefer_massiv: 197400 },
        fichte: { parkett: 193300, kalkstein_kanafar: 197800, schiefer_massiv: 198800 },
        steirische_eiche: { parkett: 202100, kalkstein_kanafar: 206600, schiefer_massiv: 207600 }
      },
      fassadenplatten_weiss: {
        kiefer: { parkett: 191900, kalkstein_kanafar: 196400, schiefer_massiv: 197400 },
        fichte: { parkett: 193300, kalkstein_kanafar: 197800, schiefer_massiv: 198800 },
        steirische_eiche: { parkett: 202100, kalkstein_kanafar: 206600, schiefer_massiv: 207600 }
      }
    },
    nest100: {
      trapezblech: {
        kiefer: { parkett: 189100, kalkstein_kanafar: 193600, schiefer_massiv: 194600 },
        fichte: { parkett: 190500, kalkstein_kanafar: 195000, schiefer_massiv: 196000 },
        steirische_eiche: { parkett: 199300, kalkstein_kanafar: 203800, schiefer_massiv: 204800 }
      },
      holzlattung: {
        kiefer: { parkett: 198700, kalkstein_kanafar: 203200, schiefer_massiv: 204200 },
        fichte: { parkett: 200100, kalkstein_kanafar: 204600, schiefer_massiv: 205600 },
        steirische_eiche: { parkett: 208900, kalkstein_kanafar: 213400, schiefer_massiv: 214400 }
      },
      fassadenplatten_schwarz: {
        kiefer: { parkett: 225500, kalkstein_kanafar: 230000, schiefer_massiv: 231000 },
        fichte: { parkett: 226900, kalkstein_kanafar: 231400, schiefer_massiv: 232400 },
        steirische_eiche: { parkett: 235700, kalkstein_kanafar: 240200, schiefer_massiv: 241200 }
      },
      fassadenplatten_weiss: {
        kiefer: { parkett: 225500, kalkstein_kanafar: 230000, schiefer_massiv: 231000 },
        fichte: { parkett: 226900, kalkstein_kanafar: 231400, schiefer_massiv: 232400 },
        steirische_eiche: { parkett: 235700, kalkstein_kanafar: 240200, schiefer_massiv: 241200 }
      }
    },
    nest120: {
      trapezblech: {
        kiefer: { parkett: 222700, kalkstein_kanafar: 227200, schiefer_massiv: 228200 },
        fichte: { parkett: 224100, kalkstein_kanafar: 228600, schiefer_massiv: 229600 },
        steirische_eiche: { parkett: 232900, kalkstein_kanafar: 237400, schiefer_massiv: 238400 }
      },
      holzlattung: {
        kiefer: { parkett: 232300, kalkstein_kanafar: 236800, schiefer_massiv: 237800 },
        fichte: { parkett: 233700, kalkstein_kanafar: 238200, schiefer_massiv: 239200 },
        steirische_eiche: { parkett: 242500, kalkstein_kanafar: 247000, schiefer_massiv: 248000 }
      },
      fassadenplatten_schwarz: {
        kiefer: { parkett: 259100, kalkstein_kanafar: 263600, schiefer_massiv: 264600 },
        fichte: { parkett: 260500, kalkstein_kanafar: 265000, schiefer_massiv: 266000 },
        steirische_eiche: { parkett: 269300, kalkstein_kanafar: 273800, schiefer_massiv: 274800 }
      },
      fassadenplatten_weiss: {
        kiefer: { parkett: 259100, kalkstein_kanafar: 263600, schiefer_massiv: 264600 },
        fichte: { parkett: 260500, kalkstein_kanafar: 265000, schiefer_massiv: 266000 },
        steirische_eiche: { parkett: 269300, kalkstein_kanafar: 273800, schiefer_massiv: 274800 }
      }
    },
    nest140: {
      trapezblech: {
        kiefer: { parkett: 256300, kalkstein_kanafar: 260800, schiefer_massiv: 261800 },
        fichte: { parkett: 257700, kalkstein_kanafar: 262200, schiefer_massiv: 263200 },
        steirische_eiche: { parkett: 266500, kalkstein_kanafar: 271000, schiefer_massiv: 272000 }
      },
      holzlattung: {
        kiefer: { parkett: 265900, kalkstein_kanafar: 270400, schiefer_massiv: 271400 },
        fichte: { parkett: 267300, kalkstein_kanafar: 271800, schiefer_massiv: 272800 },
        steirische_eiche: { parkett: 276100, kalkstein_kanafar: 280600, schiefer_massiv: 281600 }
      },
      fassadenplatten_schwarz: {
        kiefer: { parkett: 292700, kalkstein_kanafar: 297200, schiefer_massiv: 298200 },
        fichte: { parkett: 294100, kalkstein_kanafar: 298600, schiefer_massiv: 299600 },
        steirische_eiche: { parkett: 302900, kalkstein_kanafar: 307400, schiefer_massiv: 308400 }
      },
      fassadenplatten_weiss: {
        kiefer: { parkett: 292700, kalkstein_kanafar: 297200, schiefer_massiv: 298200 },
        fichte: { parkett: 294100, kalkstein_kanafar: 298600, schiefer_massiv: 299600 },
        steirische_eiche: { parkett: 302900, kalkstein_kanafar: 307400, schiefer_massiv: 308400 }
      }
    },
    nest160: {
      trapezblech: {
        kiefer: { parkett: 289900, kalkstein_kanafar: 294400, schiefer_massiv: 295400 },
        fichte: { parkett: 291300, kalkstein_kanafar: 295800, schiefer_massiv: 296800 },
        steirische_eiche: { parkett: 300100, kalkstein_kanafar: 304600, schiefer_massiv: 305600 }
      },
      holzlattung: {
        kiefer: { parkett: 299500, kalkstein_kanafar: 304000, schiefer_massiv: 305000 },
        fichte: { parkett: 300900, kalkstein_kanafar: 305400, schiefer_massiv: 306400 },
        steirische_eiche: { parkett: 309700, kalkstein_kanafar: 314200, schiefer_massiv: 315200 }
      },
      fassadenplatten_schwarz: {
        kiefer: { parkett: 326300, kalkstein_kanafar: 330800, schiefer_massiv: 331800 },
        fichte: { parkett: 327700, kalkstein_kanafar: 332200, schiefer_massiv: 333200 },
        steirische_eiche: { parkett: 336500, kalkstein_kanafar: 341000, schiefer_massiv: 342000 }
      },
      fassadenplatten_weiss: {
        kiefer: { parkett: 326300, kalkstein_kanafar: 330800, schiefer_massiv: 331800 },
        fichte: { parkett: 327700, kalkstein_kanafar: 332200, schiefer_massiv: 333200 },
        steirische_eiche: { parkett: 336500, kalkstein_kanafar: 341000, schiefer_massiv: 342000 }
      }
    }
  }

  // Create all combination pricing rules
  for (const nest of nestTypes) {
    for (const huelle of gebaeudehuelle) {
      for (const innen of innenverkleidung) {
        for (const boden of fussboden) {
          const totalPrice = combinationPrices[nest]?.[huelle]?.[innen]?.[boden]
          if (totalPrice) {
            await prisma.pricingRule.create({
              data: {
                nestType: nest,
                gebaeudehuelle: huelle,
                innenverkleidung: innen,
                fussboden: boden,
                totalPrice: totalPrice,
                isActive: true
              }
            })
          }
        }
      }
    }
  }

  const houseOptionsCount = await prisma.houseOption.count()
  const pricingRulesCount = await prisma.pricingRule.count()

  console.log('✅ Database seeding completed!')
  console.log(`📊 Created ${houseOptionsCount} house options`)
  console.log(`💰 Created ${pricingRulesCount} pricing rules`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 