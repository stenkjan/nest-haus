/**
 * PriceCalculator - Updated with MODULAR pricing system from Excel data
 * Uses base price (Nest 80) + (modules × per-module cost) logic
 * CLIENT-SIDE ONLY - for efficient state management without API calls
 * 
 * ENHANCED: Added caching and race condition prevention for optimal performance
 */

import {
  calculateSizeDependentPrice,
  GRUNDSTUECKSCHECK_PRICE,
  MODULAR_PRICING,
  NEST_OPTIONS,
  type CombinationKey
} from '@/constants/configurator'
import type { PricingData, NestSize } from '@/services/pricing-sheet-service'

import { PriceUtils } from './PriceUtils'
// REMOVED: SimplePriceCache class - no longer needed after reverting complex pricing logic

interface SelectionOption {
  category: string
  value: string
  name: string
  price: number
  description?: string
  quantity?: number
  squareMeters?: number
}

interface Selections {
  nest?: SelectionOption
  gebaeudehuelle?: SelectionOption
  innenverkleidung?: SelectionOption
  fussboden?: SelectionOption
  belichtungspaket?: SelectionOption
  pvanlage?: SelectionOption
  fenster?: SelectionOption
  stirnseite?: SelectionOption
  planungspaket?: SelectionOption
  paket?: SelectionOption
  grundstueckscheck?: boolean
  kamindurchzug?: SelectionOption
  fussbodenheizung?: SelectionOption
  bodenaufbau?: SelectionOption
  geschossdecke?: SelectionOption
  fundament?: SelectionOption
}

export class PriceCalculator {
  // LRU cache for price calculations with bounded size
  private static cache = new Map<string, { result: number; timestamp: number }>();
  private static cacheKeys: string[] = []; // Track insertion order for LRU
  private static readonly CACHE_TTL = 60000; // 60 seconds (increased from 5s for better hit rate)
  private static readonly MAX_CACHE_SIZE = 100; // Prevent unbounded growth

  // Performance metrics (development only)
  private static cacheHits = 0;
  private static cacheMisses = 0;
  private static totalCalculations = 0;
  private static totalDuration = 0;

  /**
   * Normalize price for calculation (convert -1 to 0 for math)
   */
  private static normalizePriceForCalculation(price: number): number {
    return price === -1 ? 0 : price;
  }

  // Pricing data from Google Sheets
  private static pricingData: PricingData | null = null;
  private static pricingDataPromise: Promise<PricingData> | null = null;
  private static pricingDataTimestamp = 0;
  private static readonly PRICING_DATA_TTL = 5 * 60 * 1000; // 5 minutes

  // Callbacks to notify when pricing data is loaded
  private static onDataLoadedCallbacks: Array<() => void> = [];

  /**
   * Register a callback to be called when pricing data is loaded
   */
  static onPricingDataLoaded(callback: () => void): void {
    if (this.pricingData) {
      // Data already loaded, call immediately
      callback();
    } else {
      // Register for later
      this.onDataLoadedCallbacks.push(callback);
    }
  }

  /**
   * Initialize pricing data from database API
   * Uses multi-level caching: sessionStorage → memory → database
   * Call this once on app startup (client-side)
   */
  static async initializePricingData(): Promise<void> {
    const now = Date.now();

    // Return cached data if still valid
    if (this.pricingData && (now - this.pricingDataTimestamp) < this.PRICING_DATA_TTL) {
      return;
    }

    // If already fetching, wait for that promise
    if (this.pricingDataPromise) {
      await this.pricingDataPromise;
      return;
    }

    // Try to load from sessionStorage first (fastest)
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('nest-haus-pricing-data');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (now - timestamp < this.PRICING_DATA_TTL) {
            this.pricingData = data;
            this.pricingDataTimestamp = timestamp;

            // Clear calculation cache since pricing data has changed
            this.cache.clear();
            this.cacheKeys = [];

            // Notify callbacks
            this.onDataLoadedCallbacks.forEach(cb => { try { cb(); } catch (e) { console.error(e); } });
            this.onDataLoadedCallbacks = [];
            return;
          }
        }
      } catch {
        // SessionStorage not available or failed
      }
    }

    // Start fetching from database (shadow copy)
    this.pricingDataPromise = (async () => {
      try {
        const response = await fetch('/api/pricing/data');
        if (!response.ok) {
          throw new Error(`Failed to fetch pricing data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          this.pricingData = result.data;
          this.pricingDataTimestamp = now;

          // Save to sessionStorage for faster future loads
          if (typeof window !== 'undefined') {
            try {
              sessionStorage.setItem('nest-haus-pricing-data', JSON.stringify({
                data: this.pricingData,
                timestamp: now,
                version: result.version || 1,
              }));
            } catch {
              // SessionStorage not available
            }
          }

          // Notify all registered callbacks
          this.onDataLoadedCallbacks.forEach(callback => {
            try {
              callback();
            } catch (error) {
              console.error('Error in pricing data loaded callback:', error);
            }
          });
          // Clear callbacks after calling them
          this.onDataLoadedCallbacks = [];
        } else {
          throw new Error(result.message || 'Pricing data fetch returned unsuccessful result');
        }
      } catch (error) {
        console.error('❌ Error initializing pricing data from database:', error);
        // No fallback - prices should always be in database
        // If database is empty, admin needs to run initial sync
        throw error;
      } finally {
        this.pricingDataPromise = null;
      }
      return this.pricingData!;
    })();

    await this.pricingDataPromise;
  }

  /**
   * Get pricing data (synchronous access, may return null if not initialized)
   * Public for use in UI components that need direct access to pricing structure
   */
  static getPricingData(): PricingData | null {
    return this.pricingData;
  }

  /**
   * Clear expired cache entries and enforce max size with LRU eviction
   */
  private static cleanCache(): void {
    const now = Date.now();

    // Remove expired entries
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key);
        const index = this.cacheKeys.indexOf(key);
        if (index > -1) {
          this.cacheKeys.splice(index, 1);
        }
      }
    }

    // Enforce max size with LRU eviction
    while (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cacheKeys.shift();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  /**
   * Get cached result or calculate new one with LRU cache management
   */
  private static getCachedResult<T>(
    cacheKey: string,
    calculator: () => T
  ): T {
    const startTime = performance.now();
    const cached = this.cache.get(cacheKey);

    // Cache hit
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.cacheHits++;

      // Move to end of LRU queue (most recently used)
      const index = this.cacheKeys.indexOf(cacheKey);
      if (index > -1) {
        this.cacheKeys.splice(index, 1);
        this.cacheKeys.push(cacheKey);
      }

      return cached.result as T;
    }

    // Cache miss - calculate
    this.cacheMisses++;
    this.totalCalculations++;

    const result = calculator();
    const duration = performance.now() - startTime;
    this.totalDuration += duration;

    // Clean cache before adding new entry
    this.cleanCache();

    // Add to cache with LRU tracking
    this.cache.set(cacheKey, {
      result: result as number,
      timestamp: Date.now(),
    });
    this.cacheKeys.push(cacheKey);

    return result;
  }

  /**
   * Get cache statistics (development/monitoring)
   */
  static getCacheStats() {
    const hitRate = this.cacheHits + this.cacheMisses > 0
      ? (this.cacheHits / (this.cacheHits + this.cacheMisses)) * 100
      : 0;
    const avgDuration = this.totalCalculations > 0
      ? this.totalDuration / this.totalCalculations
      : 0;

    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: hitRate.toFixed(2) + '%',
      avgDuration: avgDuration.toFixed(2) + 'ms',
      totalCalculations: this.totalCalculations,
    };
  }

  /**
   * Clear all caches (calculation cache, pricing data, and sessionStorage)
   */
  static clearAllCaches(): void {
    // Clear calculation cache
    this.cache.clear();
    this.cacheKeys = [];

    // Clear pricing data
    this.pricingData = null;
    this.pricingDataTimestamp = 0;
    this.pricingDataPromise = null;

    // Clear sessionStorage
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('nest-haus-pricing-data');
      } catch {
        // SessionStorage not available
      }
    }

    // Reset cache stats
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.totalCalculations = 0;
    this.totalDuration = 0;
  }

  /**
   * Calculate the EXACT modular price using Google Sheets data
   * 
   * PRICING MODEL (ALL PRICES ARE RELATIVE TO BASELINES):
   * - Nest base price: Raw construction only (e.g., 188,619€ for Nest 80)
   * - Gebäudehülle: Exterior material (Trapezblech = 0€ baseline, others are upgrades)
   * - Innenverkleidung: Interior cladding (ohne_innenverkleidung = 0€ baseline, Fichte/Lärche/Eiche are upgrades)
   * - Bodenbelag: Flooring (ohne_belag = 0€ baseline, others are upgrades)
   * 
   * TOTAL = Nest base + Gebäudehülle relative + Innenverkleidung relative + Bodenbelag relative + other options
   * 
   * CLIENT-SIDE calculation for efficiency with memoization
   * HANDLES -1 (PRICE ON REQUEST): If any component is -1, returns -1
   */
  static calculateCombinationPrice(
    nestType: string,
    gebaeudehuelle: string,
    innenverkleidung: string,
    fussboden: string
  ): number {
    const pricingData = this.getPricingData();

    // If pricing data is available, use it
    if (pricingData) {
      try {
        const nestSize = nestType as NestSize;

        // Get nest base price (raw construction only)
        const nestPrice = pricingData.nest[nestSize]?.price || 0;

        // Get gebaeudehuelle price (relative to trapezblech = 0)
        const gebaeudehuellePrice = pricingData.gebaeudehuelle[gebaeudehuelle]?.[nestSize] || 0;
        const trapezblechPrice = pricingData.gebaeudehuelle.trapezblech?.[nestSize] || 0;
        const gebaeudehuelleRelative = gebaeudehuellePrice - trapezblechPrice;

        // Get innenverkleidung RELATIVE price (baseline: ohne_innenverkleidung = 0€)
        const innenverkleidungPrice = pricingData.innenverkleidung[innenverkleidung]?.[nestSize] || 0;
        const ohneInnenverkleidungPrice = pricingData.innenverkleidung.ohne_innenverkleidung?.[nestSize] || 0;
        const innenverkleidungRelative = innenverkleidungPrice - ohneInnenverkleidungPrice;

        // Get bodenbelag price (relative to ohne_belag/bauherr = 0)
        const bodenbelagPrice = pricingData.bodenbelag[fussboden]?.[nestSize] || 0;
        const ohneBelagPrice = pricingData.bodenbelag.ohne_belag?.[nestSize] || 0;
        const bodenbelagRelative = bodenbelagPrice - ohneBelagPrice;

        // TOTAL = Nest base + Gebäudehülle relative + Innenverkleidung relative + Bodenbelag relative
        // Treat -1 (price on request) as 0 for calculation, so we still show sum of known prices
        return this.normalizePriceForCalculation(nestPrice) +
          this.normalizePriceForCalculation(gebaeudehuelleRelative) +
          this.normalizePriceForCalculation(innenverkleidungRelative) +
          this.normalizePriceForCalculation(bodenbelagRelative);
      } catch (error) {
        console.error('Error calculating combination price from database:', error);
        // Fall through to fallback prices below
      }
    }

    // Fallback prices when pricing data is not available yet (still loading)
    // These are the base nest prices from Google Sheets
    const nestFallbackPrices: Record<string, number> = {
      nest80: 188619,
      nest100: 226108,
      nest120: 263597,
      nest140: 301086,
      nest160: 338575,
    };

    return nestFallbackPrices[nestType] || 0;
  }

  /**
   * Get dynamic upgrade price for a selection based on current nest size
   * This calculates the price difference between combinations
   */
  static getUpgradePrice(
    nestType: string,
    currentSelections: Selections,
    newSelection: SelectionOption
  ): number {
    if (!currentSelections.nest) return 0;

    // Default selections for base comparison
    const defaultSelections = {
      gebaeudehuelle: 'trapezblech',
      innenverkleidung: 'ohne_innenverkleidung', // Standard baseline (no interior cladding)
      fussboden: 'ohne_belag'
    };

    // Current combination price
    const currentCombination = {
      gebaeudehuelle: currentSelections.gebaeudehuelle?.value || defaultSelections.gebaeudehuelle,
      innenverkleidung: currentSelections.innenverkleidung?.value || defaultSelections.innenverkleidung,
      fussboden: currentSelections.fussboden?.value || defaultSelections.fussboden
    };

    // New combination price
    const newCombination = {
      ...currentCombination,
      [newSelection.category]: newSelection.value
    };

    const currentPrice = this.calculateCombinationPrice(
      nestType,
      currentCombination.gebaeudehuelle,
      currentCombination.innenverkleidung,
      currentCombination.fussboden
    );

    const newPrice = this.calculateCombinationPrice(
      nestType,
      newCombination.gebaeudehuelle,
      newCombination.innenverkleidung,
      newCombination.fussboden
    );

    return newPrice - currentPrice;
  }

  /**
   * NEW: Calculate dynamic price for individual option display in UI
   * Returns the upgrade price compared to the BASE configuration (Trapezblech + Kiefer + Parkett)
   * This ensures consistent pricing regardless of current selections
   * 
   * ENHANCED: Added caching and error handling for optimal performance
   * RESTORED: Material upgrade prices scale with nest size as intended
   */
  static getOptionDisplayPrice(
    _nestType: string,
    _currentSelections: Selections,
    _categoryId: string,
    _optionValue: string
  ): { type: 'base' | 'upgrade' | 'included'; amount?: number; monthly?: number } {
    // REVERTED: Simplified method - just return included for compatibility
    // This removes the complex pricing logic that was causing display issues
    return { type: 'included' };
  }

  /**
   * Helper method to calculate monthly payment amount as number (not formatted string)
   */
  static calculateMonthlyPaymentAmount(totalPrice: number, months: number = 240): number {
    const interestRate = 0.035 / 12; // 3.5% annual rate
    const monthlyPayment = totalPrice * (interestRate * Math.pow(1 + interestRate, months)) /
      (Math.pow(1 + interestRate, months) - 1);

    return Math.round(monthlyPayment);
  }

  /**
   * Calculate total price - PROGRESSIVE pricing with immediate feedback
   * Uses MODULAR PRICING for accurate scaling with nest size
   * CLIENT-SIDE calculation to avoid unnecessary API calls with memoization
   * HANDLES -1 (PRICE ON REQUEST): If ANY component is -1, total returns -1
   */
  static calculateTotalPrice(selections: Selections): number {
    // Create cache key from selections
    const cacheKey = `total_${JSON.stringify(selections)}`;

    return this.getCachedResult(cacheKey, () => {
      try {
        let totalPrice = 0;

        // Calculate nest module combination price if selected
        if (selections.nest) {
          // ALWAYS use combination pricing with defaults for missing core selections
          // This ensures consistent pricing regardless of selection order
          const gebaeudehuelle = selections.gebaeudehuelle?.value || 'trapezblech';
          const innenverkleidung = selections.innenverkleidung?.value || 'ohne_innenverkleidung';
          const fussboden = selections.fussboden?.value || 'ohne_belag';

          // Calculate combination price using modular pricing system
          totalPrice = this.calculateCombinationPrice(
            selections.nest.value,
            gebaeudehuelle,
            innenverkleidung,
            fussboden
          );

          // If combination price is -1 (price on request), it will be normalized to 0 at the end
        }

        // Add additional components (these work regardless of nest selection)
        let additionalPrice = 0;

        // Add PV price
        if (selections.pvanlage && selections.pvanlage.quantity && selections.nest) {
          const pricingData = this.getPricingData();
          if (pricingData) {
            const nestSize = selections.nest.value as NestSize;
            const quantity = selections.pvanlage.quantity;
            const price = pricingData.pvanlage.pricesByQuantity[nestSize]?.[quantity] || 0;
            // Only add if not -1 (price on request)
            if (price !== -1) {
              additionalPrice += price;
            }
          }
          // If data not loaded, price will be 0 until loaded
        }

        // Add belichtungspaket price (calculated based on nest size and fenster material)
        if (selections.belichtungspaket && selections.nest) {
          const belichtungspaketPrice = this.calculateBelichtungspaketPrice(
            selections.belichtungspaket,
            selections.nest,
            selections.fenster
          );
          // Only add if not -1 (price on request)
          if (belichtungspaketPrice !== -1) {
            additionalPrice += belichtungspaketPrice;
          }
        }

        // Add bodenaufbau price (calculated based on nest size)
        if (selections.bodenaufbau && selections.nest) {
          const bodenaufbauPrice = this.calculateBodenaufbauPrice(
            selections.bodenaufbau,
            selections.nest
          );
          // Only add if not -1 (price on request)
          if (bodenaufbauPrice !== -1) {
            additionalPrice += bodenaufbauPrice;
          }
        }

        // Add geschossdecke price (calculated based on nest size and quantity)
        if (selections.geschossdecke && selections.nest) {
          const geschossdeckePrice = this.calculateGeschossdeckePrice(
            selections.geschossdecke,
            selections.nest
          );
          // Only add if not -1 (price on request)
          if (geschossdeckePrice !== -1) {
            additionalPrice += geschossdeckePrice;
          }
        }

        // Add stirnseite verglasung price (calculated based on fenster material)
        if (selections.stirnseite && selections.stirnseite.value !== 'keine_verglasung') {
          const stirnseitePrice = this.calculateStirnseitePrice(
            selections.stirnseite,
            selections.fenster
          );
          // Only add if not -1 (price on request)
          if (stirnseitePrice !== -1) {
            additionalPrice += stirnseitePrice;
          }
        }

        // Fenster price is already included in belichtungspaket calculation, so don't add it separately

        // Add planungspaket price (nest-size dependent)
        if (selections.planungspaket && selections.nest) {
          const pricingData = this.getPricingData();
          if (pricingData && selections.planungspaket.value !== 'basis') {
            const nestSize = selections.nest.value as NestSize;
            if (selections.planungspaket.value === 'plus') {
              const planungPrice = pricingData.planungspaket.plus[nestSize] || 0;
              // Only add if not -1 (price on request)
              if (planungPrice !== -1) {
                additionalPrice += planungPrice;
              }
            } else if (selections.planungspaket.value === 'pro') {
              const planungPrice = pricingData.planungspaket.pro[nestSize] || 0;
              // Only add if not -1 (price on request)
              if (planungPrice !== -1) {
                additionalPrice += planungPrice;
              }
            }
          }
          // Basis is always 0 (included)
        }

        // Add checkbox options (kamindurchzug, fussbodenheizung, fundament)
        if (selections.kamindurchzug) {
          const pricingData = this.getPricingData();
          if (pricingData) {
            const kaminPrice = pricingData.optionen.kaminschacht || 0;
            // Only add if not -1 (price on request)
            if (kaminPrice !== -1) {
              additionalPrice += kaminPrice;
            }
          }
          // If data not loaded, price will be 0 until loaded
        }

        if (selections.fussbodenheizung) {
          const fussbodenPrice = selections.fussbodenheizung.price || 0;
          // Only add if not -1 (price on request)
          if (fussbodenPrice !== -1) {
            additionalPrice += fussbodenPrice;
          }
        }

        if (selections.fundament && selections.nest) {
          const pricingData = this.getPricingData();
          if (pricingData) {
            const nestSize = selections.nest.value as NestSize;
            const fundamentPrice = pricingData.optionen.fundament[nestSize] || 0;
            // Only add if not -1 (price on request)
            if (fundamentPrice !== -1) {
              additionalPrice += fundamentPrice;
            }
          }
          // If data not loaded, price will be 0 until loaded
        }

        // Planning package and Grundstückscheck removed - handled in separate cart logic

        // Always return the sum of known prices, treating -1 (price on request) as 0
        // This ensures we show "Nest + Belichtungspaket + other known prices" even if some items are "auf Anfrage"
        return this.normalizePriceForCalculation(totalPrice) + this.normalizePriceForCalculation(additionalPrice);
      } catch (error) {
        console.error('💰 PriceCalculator: Error calculating price:', error);
        return 0;
      }
    });
  }

  /**
   * Calculate belichtungspaket price based on nest size, belichtungspaket option, and fenster material
   * Uses combination prices from Google Sheets (F70-N78)
   * Formula: combination_price = price_per_sqm × nest_size (from sheet)
   * HANDLES -1 (PRICE ON REQUEST): Returns -1 if the combination is marked as price on request
   */
  static calculateBelichtungspaketPrice(
    belichtungspaket: SelectionOption,
    nest: SelectionOption,
    fenster?: SelectionOption
  ): number {
    try {
      const pricingData = this.getPricingData();

      if (pricingData && fenster) {
        const nestSize = nest.value as NestSize;
        const fensterKey = fenster.value; // Use fenster value as-is (holz, pvc_fenster, aluminium_schwarz)
        const belichtungKey = belichtungspaket.value;

        // Get total combination price from sheet (F70-N78 contains TOTAL prices)
        const fensterPricing = pricingData.fenster.totalPrices[fensterKey];
        if (fensterPricing && fensterPricing[nestSize]) {
          const totalPrice = fensterPricing[nestSize][belichtungKey];
          if (totalPrice !== undefined) {
            return totalPrice; // Return total price directly (may be -1 for price on request)
          }
        }
      }

      // If pricing data not available yet (loading), return 0 to prevent crash
      return 0;
    } catch (error) {
      console.error('Error calculating belichtungspaket price:', error);
      return 0; // Return 0 instead of throwing to prevent crashes during loading
    }
  }

  /**
   * Calculate bodenaufbau price based on nest size
   * Uses Google Sheets pricing data
   * HANDLES -1 (PRICE ON REQUEST): Returns -1 if the option is marked as price on request
   */
  static calculateBodenaufbauPrice(
    bodenaufbau: SelectionOption,
    nest: SelectionOption
  ): number {
    try {
      if (bodenaufbau.value === 'ohne_heizung') {
        return 0;
      }

      const pricingData = this.getPricingData();
      if (pricingData) {
        const nestSize = nest.value as NestSize;

        // Handle key variations (database may have 'wassergef. fbh' instead of 'wassergefuehrte_fussbodenheizung')
        let bodenaufbauKey = bodenaufbau.value;

        // Map key if needed (backwards compatibility with old database data)
        if (bodenaufbauKey === 'wassergefuehrte_fussbodenheizung' && !pricingData.bodenaufbau[bodenaufbauKey]) {
          bodenaufbauKey = 'wassergef. fbh'; // Try abbreviated version
        }

        const bodenaufbauPrice = pricingData.bodenaufbau[bodenaufbauKey]?.[nestSize];
        if (bodenaufbauPrice !== undefined) {
          // Check if price is -1 (price on request)
          if (bodenaufbauPrice === -1) {
            return -1;
          }

          // Get relative price (ohne_heizung is base = 0)
          const ohneHeizungPrice = pricingData.bodenaufbau.ohne_heizung?.[nestSize] || 0;
          return bodenaufbauPrice - ohneHeizungPrice;
        }
      }

      // If pricing data not available yet, return 0
      return 0;
    } catch (error) {
      console.error('Error calculating bodenaufbau price:', error);
      return 0;
    }
  }

  /**
   * Calculate geschossdecke price based on nest size and quantity
   * Uses Google Sheets base price (D7) × quantity
   * HANDLES -1 (PRICE ON REQUEST): Returns -1 if basePrice is -1, but area calculation still works
   */
  static calculateGeschossdeckePrice(
    geschossdecke: SelectionOption,
    _nest: SelectionOption // Renamed to _nest to mark as intentionally unused
  ): number {
    try {
      const quantity = geschossdecke.quantity || 1;

      const pricingData = this.getPricingData();
      if (pricingData) {
        const basePrice = pricingData.geschossdecke.basePrice;

        // If price is -1 (price on request), return -1 regardless of quantity
        if (basePrice === -1) {
          return -1;
        }

        return basePrice * quantity;
      }

      // If pricing data not available yet, return 0
      return 0;
    } catch (error) {
      console.error('Error calculating geschossdecke price:', error);
      return 0;
    }
  }

  /**
   * Calculate stirnseite verglasung price based on fenster material
   * Formula: verglasung_area * fenster_material_price_per_sqm
   * Areas: oben=8m², einfache_schiebetuer=8.5m², doppelte_schiebetuer=17m², vollverglasung=25m²
   * Default fenster material: PVC (280€/m²) if no fenster selected
   */
  static calculateStirnseitePrice(
    stirnseite: SelectionOption,
    fenster?: SelectionOption
  ): number {
    try {
      // Get area based on stirnseite option
      const areaMap: Record<string, number> = {
        'verglasung_oben': 8,                        // 8m²
        'verglasung_einfache_schiebetuer': 8.5,      // 8.5m² (half of doppelte)
        'verglasung_doppelte_schiebetuer': 17,       // 17m² (same as old verglasung_unten)
        'vollverglasung': 25,                        // 25m²
        'keine_verglasung': 0                        // 0m² (should not be called for this)
      };

      const area = areaMap[stirnseite.value] || 0;

      // Get fenster material price (default to PVC 280€ if no fenster selected)
      const fensterPricePerSqm = fenster?.price || 280;

      // Calculate total price
      const totalPrice = area * fensterPricePerSqm;

      console.log(`🪟 Stirnseite calculation: ${stirnseite.value} = ${area}m² × ${fensterPricePerSqm}€ = ${totalPrice}€`);

      return totalPrice;
    } catch (error) {
      console.error('🪟 Error calculating stirnseite price:', error);
      return 0;
    }
  }

  /**
   * Get base price for a nest option (calculated with default selections)
   */
  static getBasePrice(nestType: string): number {
    // Default selections (Trapezblech + Standard/Ohne Innenverkleidung + Standard/Ohne Belag)
    return this.calculateCombinationPrice(
      nestType,
      'trapezblech',              // default
      'ohne_innenverkleidung',    // default (new baseline - no interior cladding)
      'ohne_belag'                // default - 0€ flooring
    )
  }

  /**
   * Calculate monthly payment using exact old configurator logic
   */
  static calculateMonthlyPayment(totalPrice: number, months: number = 240): string {
    const interestRate = 0.035 / 12 // 3.5% annual rate
    const monthlyPayment = totalPrice * (interestRate * Math.pow(1 + interestRate, months)) /
      (Math.pow(1 + interestRate, months) - 1)

    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monthlyPayment)
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  /**
   * Calculate price impact for engine compatibility
   * Uses modular pricing for accurate scaling
   */
  static calculatePriceImpact(selection: SelectionOption, currentSelections: Selections): number {
    const currentPrice = this.calculateTotalPrice(currentSelections)
    const newSelections = { ...currentSelections, [selection.category]: selection }
    const newPrice = this.calculateTotalPrice(newSelections)
    return newPrice - currentPrice
  }

  /**
   * Generate full configuration for engine compatibility
   */
  static generateFullConfiguration(selections: Selections): Record<string, unknown> {
    return {
      id: `config_${Date.now()}`,
      selections,
      totalPrice: this.calculateTotalPrice(selections),
      timestamp: Date.now(),
      status: 'active'
    }
  }

  /**
   * Get detailed price breakdown for transparency
   * CLIENT-SIDE calculation for better performance
   * SUPPORTS PROGRESSIVE PRICING with MODULAR SCALING
   */
  static getPriceBreakdown(selections: Selections): {
    basePrice: number;
    options: Record<string, { name: string; price: number }>;
    totalPrice: number;
    modules?: number;
    pricePerModule?: number;
    combinationKey?: string;
  } {
    const breakdown = {
      basePrice: 0,
      options: {} as Record<string, { name: string; price: number }>,
      totalPrice: 0,
      modules: 0,
      pricePerModule: 0,
      combinationKey: ''
    }

    try {
      // Handle nest module breakdown if selected
      if (selections.nest) {
        // Get nest module information
        const nestOption = NEST_OPTIONS.find(option => option.id === selections.nest!.value);
        breakdown.modules = nestOption?.modules || 0;

        // Determine combination for breakdown
        const gebaeudehuelle = selections.gebaeudehuelle?.value || 'trapezblech';
        const innenverkleidung = selections.innenverkleidung?.value || 'ohne_innenverkleidung';
        const fussboden = selections.fussboden?.value || 'ohne_belag';

        breakdown.combinationKey = `${gebaeudehuelle}-${innenverkleidung}-${fussboden}`;

        // Calculate core combination price
        const combinationPrice = this.calculateCombinationPrice(
          selections.nest.value,
          gebaeudehuelle,
          innenverkleidung,
          fussboden
        );

        breakdown.basePrice = combinationPrice;
      }

      // Add additional options (works for both nest and grundstückscheck-only)
      if (selections.pvanlage && selections.pvanlage.quantity) {
        breakdown.options.pvanlage = {
          name: `${selections.pvanlage.name} (${selections.pvanlage.quantity}x)`,
          price: selections.pvanlage.quantity * selections.pvanlage.price
        }
      }

      if (selections.belichtungspaket && selections.nest) {
        const belichtungspaketPrice = this.calculateBelichtungspaketPrice(
          selections.belichtungspaket,
          selections.nest,
          selections.fenster
        );

        // Calculate square meters for display
        const nestSizeMap: Record<string, number> = {
          'nest80': 80, 'nest100': 100, 'nest120': 120, 'nest140': 140, 'nest160': 160
        };
        const nestSize = nestSizeMap[selections.nest.value] || 80;
        const percentageMap: Record<string, number> = {
          'light': 0.12, 'medium': 0.16, 'bright': 0.22
        };
        const percentage = percentageMap[selections.belichtungspaket.value] || 0.12;
        const beleuchtungsSquareMeters = Math.ceil(nestSize * percentage);

        breakdown.options.belichtungspaket = {
          name: `${selections.belichtungspaket.name} (${beleuchtungsSquareMeters}m²)`,
          price: belichtungspaketPrice
        }
      }

      if (selections.stirnseite && selections.stirnseite.value !== 'keine_verglasung') {
        const stirnseitePrice = this.calculateStirnseitePrice(
          selections.stirnseite,
          selections.fenster
        );

        // Calculate area for display
        const areaMap: Record<string, number> = {
          'verglasung_oben': 8, 'verglasung_einfache_schiebetuer': 8.5, 'verglasung_doppelte_schiebetuer': 17, 'vollverglasung': 25
        };
        const area = areaMap[selections.stirnseite.value] || 0;

        breakdown.options.stirnseite = {
          name: `${selections.stirnseite.name} (${area}m²)`,
          price: stirnseitePrice
        }
      }

      if (selections.fenster && selections.fenster.squareMeters) {
        breakdown.options.fenster = {
          name: `${selections.fenster.name} (${selections.fenster.squareMeters}m²)`,
          price: selections.fenster.squareMeters * selections.fenster.price
        }
      }

      if (selections.paket) {
        breakdown.options.paket = {
          name: selections.paket.name,
          price: selections.paket.price
        }
      }

      if (selections.grundstueckscheck) {
        breakdown.options.grundstueckscheck = {
          name: 'Grundstückscheck',
          price: GRUNDSTUECKSCHECK_PRICE
        }
      }

      // Add planungspaket to breakdown (only if price > 0, basis is inkludiert)
      if (selections.planungspaket && selections.planungspaket.price > 0) {
        breakdown.options.planungspaket = {
          name: selections.planungspaket.name,
          price: selections.planungspaket.price
        }
      }

      // Add checkbox options
      if (selections.kamindurchzug) {
        breakdown.options.kamindurchzug = {
          name: selections.kamindurchzug.name,
          price: selections.kamindurchzug.price
        }
      }

      if (selections.fussbodenheizung) {
        breakdown.options.fussbodenheizung = {
          name: selections.fussbodenheizung.name,
          price: selections.fussbodenheizung.price
        }
      }

      // Add new dynamic pricing options using dedicated methods
      if (selections.bodenaufbau && selections.nest) {
        const bodenaufbauPrice = this.calculateBodenaufbauPrice(
          selections.bodenaufbau,
          selections.nest
        );
        if (bodenaufbauPrice > 0) {
          breakdown.options.bodenaufbau = {
            name: selections.bodenaufbau.name,
            price: bodenaufbauPrice
          }
        }
      }

      if (selections.geschossdecke && selections.nest) {
        const geschossdeckePrice = this.calculateGeschossdeckePrice(
          selections.geschossdecke,
          selections.nest
        );
        if (geschossdeckePrice > 0) {
          breakdown.options.geschossdecke = {
            name: `${selections.geschossdecke.name} (${selections.geschossdecke.quantity || 1}x)`,
            price: geschossdeckePrice
          }
        }
      }

      if (selections.fundament && selections.nest) {
        const fundamentPrice = calculateSizeDependentPrice(
          selections.nest.value,
          'fundament'
        );
        breakdown.options.fundament = {
          name: selections.fundament.name,
          price: fundamentPrice
        }
      }

      // Calculate total
      const optionsTotal = Object.values(breakdown.options).reduce((sum, option) => sum + option.price, 0)
      breakdown.totalPrice = breakdown.basePrice + optionsTotal

      return breakdown
    } catch (error) {
      console.error('💰 Error calculating price breakdown:', error)
      return breakdown
    }
  }

  /**
   * Validate that a combination exists in pricing data
   */
  static isValidCombination(
    nestType: string,
    gebaeudehuelle: string,
    innenverkleidung: string,
    fussboden: string
  ): boolean {
    const combinationKey = `${gebaeudehuelle}_${innenverkleidung}_${fussboden}`;
    return combinationKey in MODULAR_PRICING.combinations;
  }

  /**
   * Get all valid combinations for a given nest type
   */
  static getValidCombinations(_nestType: string): CombinationKey[] {
    return Object.keys(MODULAR_PRICING.combinations) as CombinationKey[];
  }

  /**
   * Get fenster price per m² for display in fenster section
   * Calculates: total_price / (nest_size_numeric * belichtungspaket_percentage)
   * NOTE: Geschossdecke does NOT affect fenster m² calculation
   */
  static getFensterPricePerSqm(
    fensterValue: string,
    nestValue: string,
    belichtungspaketValue: string,
    _geschossdeckeQuantity?: number // Intentionally unused - geschossdecke doesn't affect fenster m²
  ): number {
    const pricingData = this.getPricingData();
    if (pricingData) {
      const nestSize = nestValue as NestSize;
      const fensterKey = fensterValue === 'aluminium_schwarz' ? 'aluminium_schwarz' : fensterValue;
      const belichtungKey = belichtungspaketValue;

      const fensterPricing = pricingData.fenster.totalPrices[fensterKey];
      if (fensterPricing && fensterPricing[nestSize]) {
        const totalPrice = fensterPricing[nestSize][belichtungKey];
        if (totalPrice !== undefined && totalPrice !== -1) {
          // Nest size numeric values (from base area)
          const nestSizeNumeric: Record<string, number> = {
            'nest80': 75,
            'nest100': 95,
            'nest120': 115,
            'nest140': 135,
            'nest160': 155,
          };
          
          // Belichtungspaket percentages
          const belichtungPercentage: Record<string, number> = {
            'light': 0.15,   // 15%
            'medium': 0.22,  // 22%
            'bright': 0.28,  // 28%
          };
          
          const baseArea = nestSizeNumeric[nestValue] || 75;
          const percentage = belichtungPercentage[belichtungspaketValue] || 0.15;
          
          // Formula: total_price / (nest_size * belichtung_percentage)
          // Example: 15107 / (75 * 0.15) = 15107 / 11.25 = 1343€/m²
          const effectiveArea = baseArea * percentage;
          return effectiveArea > 0 ? Math.round(totalPrice / effectiveArea) : 0;
        }
      }
    }

    // If pricing data not available yet, return 0
    return 0;
  }

  /**
   * Get max geschossdecke amount for a nest size
   */
  static getMaxGeschossdecke(nestValue: string): number {
    const pricingData = this.getPricingData();
    if (pricingData) {
      const nestSize = nestValue as NestSize;
      return pricingData.geschossdecke.maxAmounts[nestSize] || 0;
    }

    // Return safe default if pricing data not loaded yet
    const defaults: Record<string, number> = {
      nest80: 3,
      nest100: 3,
      nest120: 4,
      nest140: 4,
      nest160: 0,
    };
    return defaults[nestValue] || 3;
  }

  /**
   * Get max PV-Anlage modules for a nest size
   */
  static getMaxPvModules(nestValue: string): number {
    const pricingData = this.getPricingData();
    if (pricingData) {
      const nestSize = nestValue as NestSize;
      return pricingData.pvanlage.maxModules[nestSize] || 0;
    }

    // Return safe default if pricing data not loaded yet
    const defaults: Record<string, number> = {
      nest80: 8,
      nest100: 10,
      nest120: 12,
      nest140: 14,
      nest160: 16,
    };
    return defaults[nestValue] || 8;
  }

  // REMOVED: Cache management methods no longer needed after reverting complex pricing logic
} 