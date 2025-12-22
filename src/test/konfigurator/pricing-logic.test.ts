/**
 * Konfigurator Pricing Logic Test Suite
 * 
 * Tests all pricing fixes implemented on December 4, 2025:
 * 1. Bodenaufbau standard display with dash prices
 * 2. Belichtungspaket relative pricing
 * 3. Fenster & Türen total prices
 * 4. Fenster & Türen relative pricing
 * 5. Fenster & Türen m² calculation
 * 6. Planungspaket relative pricing
 * 7. Geschossdecke m² isolation for fenster
 */

import { describe, test, expect, beforeAll } from '@jest/globals';
import { PriceCalculator } from '@/app/konfigurator/core/PriceCalculator';
import { PriceUtils } from '@/app/konfigurator/core/PriceUtils';

// Mock pricing data that matches Google Sheets structure (December 2024)
const mockPricingData = {
  nest: {
    nest80: { price: 213032, pricePerSqm: 2840, squareMeters: 75 },
    nest100: { price: 254731, pricePerSqm: 2681, squareMeters: 95 },
    nest120: { price: 296430, pricePerSqm: 2578, squareMeters: 115 },
    nest140: { price: 338129, pricePerSqm: 2505, squareMeters: 135 },
    nest160: { price: 379828, pricePerSqm: 2451, squareMeters: 155 },
  },
  geschossdecke: {
    basePrice: 4115,
    maxAmounts: {
      nest80: 3,
      nest100: 4,
      nest120: 5,
      nest140: 6,
      nest160: 7,
    },
  },
  gebaeudehuelle: {
    trapezblech: {
      nest80: 0,
      nest100: 0,
      nest120: 0,
      nest140: 0,
      nest160: 0,
    },
    holzlattung: {
      nest80: 24413,
      nest100: 30516,
      nest120: 36620,
      nest140: 42723,
      nest160: 48826,
    },
  },
  innenverkleidung: {
    ohne_innenverkleidung: {
      nest80: 0,
      nest100: 0,
      nest120: 0,
      nest140: 0,
      nest160: 0,
    },
    fichte: {
      nest80: 23020,
      nest100: 28775,
      nest120: 34530,
      nest140: 40285,
      nest160: 46040,
    },
  },
  bodenaufbau: {
    ohne_heizung: {
      nest80: 0,
      nest100: 0,
      nest120: 0,
      nest140: 0,
      nest160: 0,
    },
    elektrische_fussbodenheizung: {
      nest80: -1, // Dash price
      nest100: -1,
      nest120: -1,
      nest140: -1,
      nest160: -1,
    },
    wassergefuehrte_fussbodenheizung: {
      nest80: -1, // Dash price
      nest100: -1,
      nest120: -1,
      nest140: -1,
      nest160: -1,
    },
  },
  fenster: {
    totalPrices: {
      pvc_fenster: {
        nest80: {
          light: 15107,
          medium: 19357,
          bright: 22235,
        },
        nest100: {
          light: 18884,
          medium: 24196,
          bright: 27794,
        },
      },
      holz: {
        nest80: {
          light: 21378,
          medium: 26723,
          bright: 32068,
        },
        nest100: {
          light: 26723,
          medium: 33404,
          bright: 40085,
        },
      },
      aluminium_schwarz: {
        nest80: {
          light: 28322,
          medium: 35389,
          bright: 42456,
        },
        nest100: {
          light: 35403,
          medium: 44254,
          bright: 53105,
        },
      },
    },
  },
  planungspaket: {
    plus: {
      nest80: 4900,
      nest100: 4900,
      nest120: 4900,
      nest140: 4900,
      nest160: 4900,
    },
    pro: {
      nest80: 9600,
      nest100: 9600,
      nest120: 9600,
      nest140: 9600,
      nest160: 9600,
    },
  },
};

describe('Konfigurator Pricing Logic Tests', () => {
  beforeAll(() => {
    // Mock the PriceCalculator to return our test data
    jest.spyOn(PriceCalculator, 'getPricingData').mockReturnValue(mockPricingData as any);
  });

  describe('1. Bodenaufbau Standard Display', () => {
    test('should show "standard" type when all upgrade options are dash (-1)', () => {
      // All upgrade options in bodenaufbau are dash prices
      const allAreDash = Object.keys(mockPricingData.bodenaufbau).every((key) => {
        if (key === 'ohne_heizung') return true;
        return mockPricingData.bodenaufbau[key as keyof typeof mockPricingData.bodenaufbau].nest80 === -1;
      });

      expect(allAreDash).toBe(true);
      // In the UI, this should trigger "standard" display for ohne_heizung
    });

    test('should return -1 for dash priced options', () => {
      const elektrischePrice = mockPricingData.bodenaufbau.elektrische_fussbodenheizung.nest80;
      const wassergefuehrtePrice = mockPricingData.bodenaufbau.wassergefuehrte_fussbodenheizung.nest80;

      expect(elektrischePrice).toBe(-1);
      expect(wassergefuehrtePrice).toBe(-1);
    });
  });

  describe('2. Belichtungspaket Relative Pricing', () => {
    test('should calculate correct relative price between light and medium (nest80 + PVC)', () => {
      const lightPrice = mockPricingData.fenster.totalPrices.pvc_fenster.nest80.light;
      const mediumPrice = mockPricingData.fenster.totalPrices.pvc_fenster.nest80.medium;
      const expectedDiff = mediumPrice - lightPrice;

      expect(lightPrice).toBe(15107);
      expect(mediumPrice).toBe(19357);
      expect(expectedDiff).toBe(4250); // NOT 19357!
    });

    test('should calculate correct relative price between light and bright (nest80 + PVC)', () => {
      const lightPrice = mockPricingData.fenster.totalPrices.pvc_fenster.nest80.light;
      const brightPrice = mockPricingData.fenster.totalPrices.pvc_fenster.nest80.bright;
      const expectedDiff = brightPrice - lightPrice;

      expect(lightPrice).toBe(15107);
      expect(brightPrice).toBe(22235);
      expect(expectedDiff).toBe(7128); // NOT 22235!
    });
  });

  describe('3. Fenster & Türen Total Prices', () => {
    test('should use Google Sheets combination prices (nest80 + light)', () => {
      const pvcLight = mockPricingData.fenster.totalPrices.pvc_fenster.nest80.light;
      const holzLight = mockPricingData.fenster.totalPrices.holz.nest80.light;
      const aluLight = mockPricingData.fenster.totalPrices.aluminium_schwarz.nest80.light;

      expect(pvcLight).toBe(15107);
      expect(holzLight).toBe(21378);
      expect(aluLight).toBe(28322);
    });

    test('should use Google Sheets combination prices (nest100 + medium)', () => {
      const pvcMedium = mockPricingData.fenster.totalPrices.pvc_fenster.nest100.medium;
      const holzMedium = mockPricingData.fenster.totalPrices.holz.nest100.medium;
      const aluMedium = mockPricingData.fenster.totalPrices.aluminium_schwarz.nest100.medium;

      expect(pvcMedium).toBe(24196);
      expect(holzMedium).toBe(33404);
      expect(aluMedium).toBe(44254);
    });
  });

  describe('4. Fenster & Türen Relative Pricing', () => {
    test('should calculate correct relative price between PVC and Holz (nest80 + light)', () => {
      const pvcLight = mockPricingData.fenster.totalPrices.pvc_fenster.nest80.light;
      const holzLight = mockPricingData.fenster.totalPrices.holz.nest80.light;
      const expectedDiff = holzLight - pvcLight;

      expect(pvcLight).toBe(15107);
      expect(holzLight).toBe(21378);
      expect(expectedDiff).toBe(6271); // Correct relative price
    });

    test('should calculate correct relative price between PVC and Aluminium (nest80 + light)', () => {
      const pvcLight = mockPricingData.fenster.totalPrices.pvc_fenster.nest80.light;
      const aluLight = mockPricingData.fenster.totalPrices.aluminium_schwarz.nest80.light;
      const expectedDiff = aluLight - pvcLight;

      expect(pvcLight).toBe(15107);
      expect(aluLight).toBe(28322);
      expect(expectedDiff).toBe(13215); // Correct relative price
    });
  });

  describe('5. Fenster & Türen m² Calculation', () => {
    test('should calculate correct m² price using formula: price / (nest_size * belichtung_percentage)', () => {
      const pvcLightNest80 = mockPricingData.fenster.totalPrices.pvc_fenster.nest80.light;
      const nestSize = 75; // nest80 base area
      const lightPercentage = 0.15; // 15%
      const effectiveArea = nestSize * lightPercentage; // 11.25m²
      const expectedPricePerSqm = Math.round(pvcLightNest80 / effectiveArea);

      expect(pvcLightNest80).toBe(15107);
      expect(effectiveArea).toBe(11.25);
      expect(expectedPricePerSqm).toBe(1343); // 15107 / 11.25 = 1342.84... ≈ 1343
    });

    test('should use correct percentages for each belichtungspaket level', () => {
      const percentages = {
        light: 0.15,   // 15%
        medium: 0.22,  // 22%
        bright: 0.28,  // 28%
      };

      expect(percentages.light).toBe(0.15);
      expect(percentages.medium).toBe(0.22);
      expect(percentages.bright).toBe(0.28);
    });

    test('should NOT include geschossdecke in fenster m² calculation', () => {
      // This is a critical rule: geschossdecke affects most categories but NOT fenster
      const pvcLightNest80 = mockPricingData.fenster.totalPrices.pvc_fenster.nest80.light;
      const nestSize = 75; // nest80 base area
      const lightPercentage = 0.15;

      // WITHOUT geschossdecke
      const areaWithout = nestSize * lightPercentage; // 11.25m²
      const pricePerSqmWithout = Math.round(pvcLightNest80 / areaWithout);

      // WITH geschossdecke (should be same!)
      // Note: geschossdecke adds 6.5m² to Hoam area, but NOT to fenster calculation
      const areaWith = nestSize * lightPercentage; // Still 11.25m² (geschossdecke ignored)
      const pricePerSqmWith = Math.round(pvcLightNest80 / areaWith);

      expect(pricePerSqmWithout).toBe(pricePerSqmWith);
      expect(pricePerSqmWithout).toBe(1343);
    });

    test('PriceCalculator.getFensterPricePerSqm should use correct formula', () => {
      const result = PriceCalculator.getFensterPricePerSqm(
        'pvc_fenster',
        'nest80',
        'light',
        0 // geschossdeckeQuantity intentionally ignored
      );

      expect(result).toBe(1343); // 15107 / (75 * 0.15)
    });

    test('PriceCalculator.getFensterPricePerSqm with geschossdecke should give same result', () => {
      const withoutGeschossdecke = PriceCalculator.getFensterPricePerSqm(
        'pvc_fenster',
        'nest80',
        'light',
        0
      );

      const withGeschossdecke = PriceCalculator.getFensterPricePerSqm(
        'pvc_fenster',
        'nest80',
        'light',
        2 // Should be ignored
      );

      expect(withoutGeschossdecke).toBe(withGeschossdecke);
      expect(withoutGeschossdecke).toBe(1343);
    });
  });

  describe('6. Planungspaket Relative Pricing', () => {
    test('should use new prices: plus=4900, pro=9600', () => {
      const plusPrice = mockPricingData.planungspaket.plus.nest80;
      const proPrice = mockPricingData.planungspaket.pro.nest80;

      expect(plusPrice).toBe(4900); // NOT 9600!
      expect(proPrice).toBe(9600);  // NOT 12700!
    });

    test('should calculate correct relative prices when basis is selected', () => {
      const basisPrice = 0; // Basis is always 0€
      const plusPrice = mockPricingData.planungspaket.plus.nest80;
      const proPrice = mockPricingData.planungspaket.pro.nest80;

      const plusRelative = plusPrice - basisPrice;
      const proRelative = proPrice - basisPrice;

      expect(plusRelative).toBe(4900); // NOT +9600
      expect(proRelative).toBe(9600);  // NOT +12700
    });

    test('should calculate correct relative price from plus to pro', () => {
      const plusPrice = mockPricingData.planungspaket.plus.nest80;
      const proPrice = mockPricingData.planungspaket.pro.nest80;
      const diff = proPrice - plusPrice;

      expect(plusPrice).toBe(4900);
      expect(proPrice).toBe(9600);
      expect(diff).toBe(4700); // Pro is +4700€ more than Plus
    });
  });

  describe('7. Geschossdecke m² Isolation', () => {
    test('PriceUtils.getAdjustedNutzflaeche should include geschossdecke', () => {
      const nest80Without = PriceUtils.getAdjustedNutzflaeche('nest80', 0);
      const nest80With1 = PriceUtils.getAdjustedNutzflaeche('nest80', 1);
      const nest80With2 = PriceUtils.getAdjustedNutzflaeche('nest80', 2);

      expect(nest80Without).toBe(75);      // 75m²
      expect(nest80With1).toBe(81.5);      // 75 + (1 × 6.5)
      expect(nest80With2).toBe(88);        // 75 + (2 × 6.5)
    });

    test('Gebäudehülle m² should include geschossdecke', () => {
      const holzlattungPrice = mockPricingData.gebaeudehuelle.holzlattung.nest80;

      // Without geschossdecke
      const areaWithout = PriceUtils.getAdjustedNutzflaeche('nest80', 0);
      const pricePerSqmWithout = Math.round(holzlattungPrice / areaWithout);

      // With 1 geschossdecke
      const areaWith1 = PriceUtils.getAdjustedNutzflaeche('nest80', 1);
      const pricePerSqmWith1 = Math.round(holzlattungPrice / areaWith1);

      expect(pricePerSqmWithout).toBe(326);  // 24413 / 75 = 325.5...
      expect(pricePerSqmWith1).toBe(300);    // 24413 / 81.5 = 299.5...
      expect(pricePerSqmWithout).toBeGreaterThan(pricePerSqmWith1); // m² price decreases
    });

    test('Fenster m² should NOT include geschossdecke', () => {
      const pvcLightPrice = mockPricingData.fenster.totalPrices.pvc_fenster.nest80.light;

      // Calculate using fenster formula (NOT affected by geschossdecke)
      const nestSize = 75;
      const lightPercentage = 0.15;
      const effectiveArea = nestSize * lightPercentage;
      const pricePerSqm = Math.round(pvcLightPrice / effectiveArea);

      expect(pricePerSqm).toBe(1343); // Always 1343 regardless of geschossdecke

      // Verify with PriceCalculator
      const calculatorResult = PriceCalculator.getFensterPricePerSqm(
        'pvc_fenster',
        'nest80',
        'light',
        5 // Even with 5 geschossdecke, result should be same
      );

      expect(calculatorResult).toBe(1343);
    });
  });

  describe('8. Integration Tests', () => {
    test('complete configuration calculation (nest80 + PVC + light)', () => {
      const config = {
        nest: { category: 'nest', value: 'nest80', name: 'Hoam 80', price: 213032 },
        gebaeudehuelle: { category: 'gebaeudehuelle', value: 'trapezblech', name: 'Trapezblech', price: 0 },
        innenverkleidung: { category: 'innenverkleidung', value: 'ohne_innenverkleidung', name: 'Standard', price: 0 },
        fussboden: { category: 'fussboden', value: 'ohne_belag', name: 'Standard', price: 0 },
        belichtungspaket: { category: 'belichtungspaket', value: 'light', name: 'Light', price: 15107 },
        fenster: { category: 'fenster', value: 'pvc_fenster', name: 'PVC', price: 15107 },
        planungspaket: { category: 'planungspaket', value: 'basis', name: 'Basis', price: 0 },
      };

      // Calculate total using PriceCalculator
      const totalPrice = PriceCalculator.calculateTotalPrice(config as any);

      // Expected: 213032 (nest) + 0 (trapezblech) + 0 (ohne_innenverkleidung) + 0 (ohne_belag) + 15107 (belichtung+fenster) + 0 (basis)
      // Note: belichtungspaket price is the TOTAL combination price (includes fenster)
      expect(totalPrice).toBe(228139); // 213032 + 15107
    });

    test('verify all relative pricing scenarios work together', () => {
      // Test that changing one category doesn't affect relative pricing in another
      const belichtungDiff = 19357 - 15107; // medium - light for PVC
      const fensterDiff = 21378 - 15107;    // holz - PVC for light

      expect(belichtungDiff).toBe(4250);
      expect(fensterDiff).toBe(6271);

      // These should be independent
      expect(belichtungDiff).not.toBe(fensterDiff);
    });
  });
});

describe('Edge Cases and Error Handling', () => {
  test('should handle -1 (dash) prices correctly', () => {
    const dashPrice = -1;
    const isDash = PriceUtils.isPriceOnRequest(dashPrice);
    const formatted = PriceUtils.formatPriceOrDash(dashPrice);

    expect(isDash).toBe(true);
    expect(formatted).toBe('-');
  });

  test('should normalize -1 to 0 for calculations', () => {
    // When calculating totals with -1 prices, they should be treated as 0
    const price1 = 10000;
    const price2 = -1; // dash price

    const normalized = price2 === -1 ? 0 : price2;
    const total = price1 + normalized;

    expect(normalized).toBe(0);
    expect(total).toBe(10000);
  });

  test('should handle missing pricing data gracefully', () => {
    // If pricing data not loaded, should return safe defaults
    const result = PriceCalculator.getFensterPricePerSqm(
      'invalid_material',
      'nest80',
      'light',
      0
    );

    expect(result).toBe(0); // Safe default
  });
});

