/**
 * usePriceCalculation - Optimized Price Calculation Hook
 * Provides memoized price calculations with caching
 */

"use client";

import { useMemo } from "react";
import { PriceCalculator } from "@/app/konfigurator/core/PriceCalculator";
import { PriceUtils } from "@/app/konfigurator/core/PriceUtils";
import { Configuration, ConfigurationItem } from "@/store/configuratorStore";

interface PriceCalculationResult {
    totalPrice: number;
    formattedPrice: string;
    pricePerSqm: string | null;
    priceBreakdown: ReturnType<typeof PriceCalculator.getPriceBreakdown>;
}

interface UsePriceCalculationOptions {
    enableMemoization?: boolean;
    enablePerSqmCalculation?: boolean;
}

/**
 * Hook for optimized price calculations with memoization
 */
export function usePriceCalculation(
    configuration: Configuration,
    options: UsePriceCalculationOptions = {}
): PriceCalculationResult {
    const { enableMemoization = true, enablePerSqmCalculation = true } = options;

    // Memoize selections object to prevent unnecessary recalculations
    const selections = useMemo(() => {
        return {
            nest: configuration.nest || undefined,
            gebaeudehuelle: configuration.gebaeudehuelle || undefined,
            innenverkleidung: configuration.innenverkleidung || undefined,
            fussboden: configuration.fussboden || undefined,
            belichtungspaket: configuration.belichtungspaket || undefined,
            pvanlage: configuration.pvanlage || undefined,
            fenster: configuration.fenster || undefined,
            stirnseite: configuration.stirnseite || undefined,
            planungspaket: configuration.planungspaket || undefined,
            kamindurchzug: configuration.kamindurchzug || undefined,
            fussbodenheizung: configuration.fussbodenheizung || undefined,
            bodenaufbau: configuration.bodenaufbau || undefined,
            geschossdecke: configuration.geschossdecke || undefined,
            fundament: configuration.fundament || undefined,
        };
    }, [
        configuration.nest,
        configuration.gebaeudehuelle,
        configuration.innenverkleidung,
        configuration.fussboden,
        configuration.belichtungspaket,
        configuration.pvanlage,
        configuration.fenster,
        configuration.stirnseite,
        configuration.planungspaket,
        configuration.kamindurchzug,
        configuration.fussbodenheizung,
        configuration.bodenaufbau,
        configuration.geschossdecke,
        configuration.fundament,
    ]);

    // Memoize total price calculation
    const totalPrice = useMemo(() => {
        if (!enableMemoization) {
            return PriceCalculator.calculateTotalPrice(selections as Record<string, unknown>);
        }

        // Use configuration timestamp as cache key
        const cacheKey = `${configuration.timestamp}_${JSON.stringify(selections)}`;

        // Simple in-memory cache (could be enhanced with LRU cache)
        if (typeof window !== 'undefined') {
            const windowWithCache = window as typeof window & {
                __priceCache?: Record<string, { price: number; timestamp: number }>;
            };
            const cached = windowWithCache.__priceCache?.[cacheKey];
            if (cached && Date.now() - cached.timestamp < 5000) { // 5 second cache
                return cached.price;
            }
        }

        const price = PriceCalculator.calculateTotalPrice(selections as Record<string, unknown>);

        // Store in cache
        if (typeof window !== 'undefined') {
            const windowWithCache = window as typeof window & {
                __priceCache?: Record<string, { price: number; timestamp: number }>;
            };
            windowWithCache.__priceCache = windowWithCache.__priceCache || {};
            windowWithCache.__priceCache[cacheKey] = {
                price,
                timestamp: Date.now(),
            };
        }

        return price;
    }, [selections, configuration.timestamp, enableMemoization]);

    // Memoize formatted price
    const formattedPrice = useMemo(() => {
        return PriceUtils.formatPrice(totalPrice);
    }, [totalPrice]);

    // Memoize price per m² calculation
    const pricePerSqm = useMemo(() => {
        if (!enablePerSqmCalculation || !configuration.nest) return null;

        const geschossdeckeQuantity = configuration.geschossdecke?.quantity || 0;
        return PriceUtils.calculatePricePerSquareMeter(
            totalPrice,
            configuration.nest.value,
            geschossdeckeQuantity
        );
    }, [totalPrice, configuration.nest, configuration.geschossdecke, enablePerSqmCalculation]);

    // Memoize price breakdown
    const priceBreakdown = useMemo(() => {
        return PriceCalculator.getPriceBreakdown(selections as Record<string, unknown>);
    }, [selections]);

    return {
        totalPrice,
        formattedPrice,
        pricePerSqm,
        priceBreakdown,
    };
}

/**
 * Hook for individual item price calculations
 */
export function useItemPriceCalculation(
    item: ConfigurationItem,
    configuration: Configuration
): number {
    return useMemo(() => {
        // Implement item-specific price calculation logic
        // This would contain the logic from SummaryPanel.getItemPrice

        if (item.category === "pvanlage") {
            return (item.quantity || 1) * (item.price || 0);
        }

        if (item.category === "geschossdecke") {
            return (item.quantity || 1) * (item.price || 0);
        }

        if (item.category === "belichtungspaket" && configuration.nest) {
            try {
                const selectionOption = {
                    category: item.category,
                    value: item.value,
                    name: item.name,
                    price: item.price || 0,
                };
                return PriceCalculator.calculateBelichtungspaketPrice(
                    selectionOption,
                    configuration.nest,
                    configuration.fenster ?? undefined
                );
            } catch (error) {
                console.error("Error calculating belichtungspaket price:", error);
                return item.price || 0;
            }
        }

        // Default to item price
        return item.price || 0;
    }, [item, configuration.nest, configuration.fenster]);
}
