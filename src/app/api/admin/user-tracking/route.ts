/**
 * User Tracking API - Enhanced Analytics
 * 
 * Comprehensive tracking that only counts configurations that reached cart (IN_CART, COMPLETED, CONVERTED).
 * Includes funnel metrics, time analytics, and alpha test integration.
 */

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Type definitions
interface ConfigurationData {
    nestType?: string;
    gebaeudehuelle?: string;
    innenverkleidung?: string;
    fussboden?: string;
    pvanlage?: string;
    fenster?: string;
    planungspaket?: string;
    geschossdecke?: string;
    belichtungspaket?: string;
    stirnseite?: string;
    kamindurchzug?: string;
    fussbodenheizung?: string;
    bodenaufbau?: string;
    fundament?: string;
}

interface UserTrackingData {
    // Funnel metrics
    funnel: {
        totalSessions: number;
        reachedCart: number;
        completedInquiry: number;
        converted: number;
        cartRate: number;
        inquiryRate: number;
        conversionRate: number;
    };

    // Top configurations (only those that reached cart)
    topConfigurations: Array<{
        id: string;
        nestType: string;
        gebaeudehuelle: string;
        innenverkleidung: string;
        fussboden: string;
        pvanlage: string;
        fenster: string;
        planungspaket: string;
        totalPrice: number;
        cartCount: number;
        inquiryCount: number;
        conversionCount: number;
        lastSelected: string;
    }>;

    // Price distribution
    priceDistribution: Array<{
        range: string;
        count: number;
        percentage: number;
    }>;

    // Selection statistics (only from IN_CART+ sessions)
    selectionStats: {
        nestTypes: Array<{ name: string; count: number; percentage: number }>;
        gebaeudehuelle: Array<{ name: string; count: number; percentage: number }>;
        innenverkleidung: Array<{ name: string; count: number; percentage: number }>;
    };

    // Click analytics
    clickAnalytics: {
        pageClicks: Array<{ path: string; title: string; count: number; percentage: number }>;
        mouseClicks: Array<{ elementId: string; category: string; count: number; percentage: number }>;
    };

    // Configuration selection analytics (comprehensive)
    configurationAnalytics: {
        [category: string]: Array<{
            value: string;
            name: string;
            count: number;
            percentageOfCategory: number;
            percentageOfTotal: number;
            quantity?: number; // For geschossdecke and pvanlage
        }>;
    };

    // Quantity analytics for geschossdecke and pvanlage
    quantityAnalytics: {
        geschossdecke: {
            totalWithOption: number;
            averageQuantity: number;
            quantityDistribution: Array<{ quantity: number; count: number }>;
        };
        pvanlage: {
            totalWithOption: number;
            averageQuantity: number;
            quantityDistribution: Array<{ quantity: number; count: number }>;
        };
    };

    // Time metrics
    timeMetrics: {
        avgTimeToCart: number; // in seconds
        avgTimeToInquiry: number;
        avgSessionDuration: number;
    };

    metadata: {
        totalConfigurations: number;
        dataRange: {
            from: string;
            to: string;
        };
        lastUpdated: string;
    };
}

interface SessionWithConfig {
    sessionId: string;
    configurationData: unknown;
    totalPrice: number | null;
    status: string;
    startTime: Date;
    endTime?: Date | null;
}

class UserTrackingService {

    /**
     * Parse configuration data safely
     */
    private static parseConfigurationData(data: unknown): ConfigurationData | null {
        try {
            if (!data || typeof data !== 'object') return null;

            const config = data as Record<string, unknown>;

            // Helper to extract value or quantity if it's an object
            const extractValueOrQuantity = (field: unknown): { value?: string; quantity?: number } => {
                if (typeof field === 'string') return { value: field };
                if (field && typeof field === 'object' && 'value' in field) {
                    const valueField = field as { value?: unknown; quantity?: unknown };
                    return {
                        value: typeof valueField.value === 'string' ? valueField.value : undefined,
                        quantity: typeof valueField.quantity === 'number' ? valueField.quantity : undefined
                    };
                }
                return {};
            };

            const nestData = extractValueOrQuantity(config.nestType || config.nest);
            const gebaeudehuelleData = extractValueOrQuantity(config.gebaeudehuelle);
            const innenverkleidungData = extractValueOrQuantity(config.innenverkleidung);
            const fussbodenData = extractValueOrQuantity(config.fussboden);
            const pvanlageData = extractValueOrQuantity(config.pvanlage);
            const fensterData = extractValueOrQuantity(config.fenster);
            const planungspaketData = extractValueOrQuantity(config.planungspaket);
            const geschossdeckeData = extractValueOrQuantity(config.geschossdecke);
            const belichtungspaketData = extractValueOrQuantity(config.belichtungspaket);
            const stirnseiteData = extractValueOrQuantity(config.stirnseite);
            const kamindurchzugData = extractValueOrQuantity(config.kamindurchzug);
            const fussbodenheizungData = extractValueOrQuantity(config.fussbodenheizung);
            const bodenaufbauData = extractValueOrQuantity(config.bodenaufbau);
            const fundamentData = extractValueOrQuantity(config.fundament);

            return {
                nestType: nestData.value,
                gebaeudehuelle: gebaeudehuelleData.value,
                innenverkleidung: innenverkleidungData.value,
                fussboden: fussbodenData.value,
                pvanlage: pvanlageData.value,
                fenster: fensterData.value,
                planungspaket: planungspaketData.value,
                geschossdecke: geschossdeckeData.value,
                belichtungspaket: belichtungspaketData.value,
                stirnseite: stirnseiteData.value,
                kamindurchzug: kamindurchzugData.value,
                fussbodenheizung: fussbodenheizungData.value,
                bodenaufbau: bodenaufbauData.value,
                fundament: fundamentData.value,
            };
        } catch (error) {
            console.error('Failed to parse configuration data:', error);
            return null;
        }
    }

    /**
     * Calculate funnel metrics
     */
    static async getFunnelMetrics() {
        const totalSessions = await prisma.userSession.count({
            where: {
                status: { in: ['ACTIVE', 'IN_CART', 'COMPLETED', 'CONVERTED', 'ABANDONED'] }
            }
        });

        const reachedCart = await prisma.userSession.count({
            where: {
                status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] }
            }
        });

        const completedInquiry = await prisma.userSession.count({
            where: {
                status: { in: ['COMPLETED', 'CONVERTED'] }
            }
        });

        const converted = await prisma.userSession.count({
            where: {
                status: 'CONVERTED'
            }
        });

        return {
            totalSessions,
            reachedCart,
            completedInquiry,
            converted,
            cartRate: totalSessions > 0 ? (reachedCart / totalSessions) * 100 : 0,
            inquiryRate: reachedCart > 0 ? (completedInquiry / reachedCart) * 100 : 0,
            conversionRate: completedInquiry > 0 ? (converted / completedInquiry) * 100 : 0,
        };
    }

    /**
     * Get top configurations (only IN_CART, COMPLETED, CONVERTED)
     */
    static async getTopConfigurations() {
        const sessions = await prisma.userSession.findMany({
            where: {
                status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                configurationData: { not: Prisma.JsonNull }
            },
            select: {
                sessionId: true,
                configurationData: true,
                totalPrice: true,
                status: true,
                startTime: true,
                endTime: true
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 1000
        });

        const configurationGroups = new Map<string, {
            cartCount: number;
            inquiryCount: number;
            conversionCount: number;
            prices: number[];
            lastSelected: Date;
            config: ConfigurationData;
        }>();

        sessions.forEach((session: SessionWithConfig) => {
            const config = this.parseConfigurationData(session.configurationData);
            if (!config || !config.nestType) return;

            const key = `${config.nestType}-${config.gebaeudehuelle || 'Unknown'}-${config.innenverkleidung || 'Unknown'}`;

            if (!configurationGroups.has(key)) {
                configurationGroups.set(key, {
                    cartCount: 0,
                    inquiryCount: 0,
                    conversionCount: 0,
                    prices: [],
                    lastSelected: session.startTime,
                    config
                });
            }

            const group = configurationGroups.get(key)!;

            // Count by status - each session counted only once per status
            // Sessions progress: ACTIVE -> IN_CART -> COMPLETED -> CONVERTED
            if (session.status === 'IN_CART') {
                group.cartCount++;
            }
            if (session.status === 'COMPLETED') {
                group.cartCount++;
                group.inquiryCount++;
            }
            if (session.status === 'CONVERTED') {
                group.cartCount++;
                group.inquiryCount++;
                group.conversionCount++;
            }

            if (session.totalPrice && session.totalPrice > 0) {
                group.prices.push(session.totalPrice);
            }

            if (session.startTime > group.lastSelected) {
                group.lastSelected = session.startTime;
            }
        });

        // Sort by total engagement (cart count primarily)
        const results = Array.from(configurationGroups.entries())
            .map(([key, group]) => ({
                id: key,
                nestType: group.config.nestType || 'Unknown',
                gebaeudehuelle: group.config.gebaeudehuelle || 'Unknown',
                innenverkleidung: group.config.innenverkleidung || 'Unknown',
                fussboden: group.config.fussboden || 'Unknown',
                pvanlage: group.config.pvanlage || 'None',
                fenster: group.config.fenster || 'Standard',
                planungspaket: group.config.planungspaket || 'Basic',
                totalPrice: group.prices.length > 0
                    ? Math.round(group.prices.reduce((a, b) => a + b, 0) / group.prices.length)
                    : 0,
                cartCount: group.cartCount,
                inquiryCount: group.inquiryCount,
                conversionCount: group.conversionCount,
                lastSelected: group.lastSelected.toISOString()
            }))
            .sort((a, b) => {
                // Sort by conversion first, then inquiry, then cart
                if (b.conversionCount !== a.conversionCount) {
                    return b.conversionCount - a.conversionCount;
                }
                if (b.inquiryCount !== a.inquiryCount) {
                    return b.inquiryCount - a.inquiryCount;
                }
                return b.cartCount - a.cartCount;
            })
            .slice(0, 10);

        return results;
    }

    /**
     * Get price distribution
     */
    static async getPriceDistribution() {
        const sessions = await prisma.userSession.findMany({
            where: {
                status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                totalPrice: { gt: 0 }
            },
            select: {
                totalPrice: true
            }
        });

        const priceRanges = [
            { min: 0, max: 100000, label: '< 100k' },
            { min: 100000, max: 150000, label: '100k - 150k' },
            { min: 150000, max: 200000, label: '150k - 200k' },
            { min: 200000, max: 250000, label: '200k - 250k' },
            { min: 250000, max: 300000, label: '250k - 300k' },
            { min: 300000, max: Infinity, label: '> 300k' }
        ];

        const distribution = priceRanges.map(range => {
            const count = sessions.filter(s =>
                s.totalPrice! >= range.min && s.totalPrice! < range.max
            ).length;

            return {
                range: range.label,
                count,
                percentage: sessions.length > 0 ? (count / sessions.length) * 100 : 0
            };
        });

        return distribution;
    }

    /**
     * Get selection statistics
     */
    static async getSelectionStats() {
        const sessions = await prisma.userSession.findMany({
            where: {
                status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                configurationData: { not: Prisma.JsonNull }
            },
            select: {
                configurationData: true
            }
        });

        const stats = {
            nestTypes: new Map<string, number>(),
            gebaeudehuelle: new Map<string, number>(),
            innenverkleidung: new Map<string, number>()
        };

        sessions.forEach(session => {
            const config = this.parseConfigurationData(session.configurationData);
            if (!config) return;

            if (config.nestType) {
                stats.nestTypes.set(config.nestType, (stats.nestTypes.get(config.nestType) || 0) + 1);
            }
            if (config.gebaeudehuelle) {
                stats.gebaeudehuelle.set(config.gebaeudehuelle, (stats.gebaeudehuelle.get(config.gebaeudehuelle) || 0) + 1);
            }
            if (config.innenverkleidung) {
                stats.innenverkleidung.set(config.innenverkleidung, (stats.innenverkleidung.get(config.innenverkleidung) || 0) + 1);
            }
        });

        const total = sessions.length;

        return {
            nestTypes: Array.from(stats.nestTypes.entries())
                .map(([name, count]) => ({ name, count, percentage: (count / total) * 100 }))
                .sort((a, b) => b.count - a.count),
            gebaeudehuelle: Array.from(stats.gebaeudehuelle.entries())
                .map(([name, count]) => ({ name, count, percentage: (count / total) * 100 }))
                .sort((a, b) => b.count - a.count),
            innenverkleidung: Array.from(stats.innenverkleidung.entries())
                .map(([name, count]) => ({ name, count, percentage: (count / total) * 100 }))
                .sort((a, b) => b.count - a.count)
        };
    }

    /**
     * Get click analytics (page clicks and mouse clicks)
     */
    static async getClickAnalytics() {
        // Get all sessions that reached cart
        const sessionIds = await prisma.userSession.findMany({
            where: {
                status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] }
            },
            select: {
                sessionId: true
            }
        });

        const sessionIdList = sessionIds.map(s => s.sessionId);

        // Get all interaction events for these sessions
        const interactions = await prisma.interactionEvent.findMany({
            where: {
                sessionId: { in: sessionIdList }
            },
            select: {
                eventType: true,
                selectionValue: true,
                elementId: true,
                category: true
            }
        });

        // Count page visits (page_visit events)
        const pageClicksMap = new Map<string, number>();
        interactions
            .filter(i => i.eventType === 'page_visit' && i.selectionValue)
            .forEach(i => {
                const path = i.selectionValue || 'unknown';
                const count = pageClicksMap.get(path) || 0;
                pageClicksMap.set(path, count + 1);
            });

        const totalPageClicks = Array.from(pageClicksMap.values()).reduce((a, b) => a + b, 0);

        const pageClicks = Array.from(pageClicksMap.entries())
            .map(([path, count]) => {
                // Try to extract title from path
                const pathParts = path.split('/').filter(p => p);
                const title = pathParts.length > 0 
                    ? pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                    : path;
                
                return {
                    path,
                    title,
                    count,
                    percentage: totalPageClicks > 0 ? (count / totalPageClicks) * 100 : 0
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);

        // Count mouse clicks (click events)
        const mouseClicksMap = new Map<string, { category: string; count: number }>();
        interactions
            .filter(i => i.eventType === 'click' && i.elementId)
            .forEach(i => {
                const key = i.elementId || 'unknown';
                const category = i.category || 'other';
                const existing = mouseClicksMap.get(key);
                if (existing) {
                    existing.count++;
                } else {
                    mouseClicksMap.set(key, { category, count: 1 });
                }
            });

        const totalMouseClicks = Array.from(mouseClicksMap.values()).reduce((a, b) => a + b.count, 0);

        const mouseClicks = Array.from(mouseClicksMap.entries())
            .map(([elementId, data]) => ({
                elementId,
                category: data.category,
                count: data.count,
                percentage: totalMouseClicks > 0 ? (data.count / totalMouseClicks) * 100 : 0
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 30);

        return {
            pageClicks,
            mouseClicks
        };
    }

    /**
     * Get comprehensive configuration selection analytics
     */
    static async getConfigurationAnalytics() {
        const sessions = await prisma.userSession.findMany({
            where: {
                status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                configurationData: { not: Prisma.JsonNull }
            },
            select: {
                configurationData: true
            }
        });

        const totalConfigs = sessions.length;

        // Category order matching configurator
        const categories = [
            'nest', 'gebaeudehuelle', 'innenverkleidung', 'fussboden', 'belichtungspaket',
            'fenster', 'pvanlage', 'stirnseite', 'planungspaket', 'bodenaufbau',
            'geschossdecke', 'kamindurchzug', 'fussbodenheizung', 'fundament'
        ];

        // Map to store selections per category
        const categorySelections = new Map<string, Map<string, { name: string; count: number; totalQuantity: number; configCount: number }>>();
        const categoryTotals = new Map<string, number>();

        // Helper to get option name from value
        const getOptionName = (category: string, value: string): string => {
            // Basic mapping - could be enhanced with database lookup
            const nameMap: Record<string, Record<string, string>> = {
                nest: {
                    'nest80': 'Nest 80',
                    'nest100': 'Nest 100',
                    'nest120': 'Nest 120',
                    'nest140': 'Nest 140',
                    'nest160': 'Nest 160'
                },
                gebaeudehuelle: {
                    'trapezblech': 'Trapezblech',
                    'holzlattung': 'Holzlattung Lärche Natur',
                    'fassadenplatten_schwarz': 'Fassadenplatten Schwarz',
                    'fassadenplatten_weiss': 'Fassadenplatten Weiß'
                },
                innenverkleidung: {
                    'laerche': 'Lärche',
                    'fichte': 'Fichte',
                    'steirische_eiche': 'Steirische Eiche'
                },
                fussboden: {
                    'ohne_belag': 'Ohne Belag',
                    'parkett': 'Parkett Eiche',
                    'kalkstein_kanafar': 'Steinbelag Hell',
                    'schiefer_massiv': 'Steinbelag Dunkel'
                },
                belichtungspaket: {
                    'light': 'Light',
                    'medium': 'Medium',
                    'bright': 'Bright'
                },
                fenster: {
                    'pvc_fenster': 'PVC',
                    'holz': 'Fichte',
                    'aluminium_schwarz': 'Aluminium Dunkel',
                    'aluminium_weiss': 'Aluminium Hell'
                },
                planungspaket: {
                    'basis': 'Planung Basis',
                    'plus': 'Planung Plus',
                    'pro': 'Planung Pro'
                },
                bodenaufbau: {
                    'ohne_heizung': 'Ohne Heizung',
                    'elektrische_fussbodenheizung': 'Elektrische Fußbodenheizung',
                    'wassergefuehrte_fussbodenheizung': 'Wassergeführte Fußbodenheizung'
                }
            };
            return nameMap[category]?.[value] || value;
        };

        // Process each session
        sessions.forEach(session => {
            const config = session.configurationData as Record<string, unknown>;
            
            categories.forEach(category => {
                const field = category === 'nest' ? (config.nestType || config.nest) : config[category];
                
                if (!field) return;

                // Extract value and quantity
                let value: string | undefined;
                let quantity: number | undefined;
                
                if (typeof field === 'string') {
                    value = field;
                } else if (field && typeof field === 'object' && 'value' in field) {
                    const obj = field as { value?: unknown; quantity?: unknown; name?: unknown };
                    value = typeof obj.value === 'string' ? obj.value : undefined;
                    quantity = typeof obj.quantity === 'number' ? obj.quantity : undefined;
                }

                if (!value) return;

                // Initialize category map if needed
                if (!categorySelections.has(category)) {
                    categorySelections.set(category, new Map());
                }
                if (!categoryTotals.has(category)) {
                    categoryTotals.set(category, 0);
                }

                // Update counts
                categoryTotals.set(category, categoryTotals.get(category)! + 1);
                
                const selectionsMap = categorySelections.get(category)!;
                const existing = selectionsMap.get(value);
                
                if (existing) {
                    existing.count++;
                    if (quantity) {
                        existing.totalQuantity += quantity;
                        existing.configCount++;
                    }
                } else {
                    selectionsMap.set(value, {
                        name: getOptionName(category, value),
                        count: 1,
                        totalQuantity: quantity || 0,
                        configCount: quantity ? 1 : 0
                    });
                }
            });
        });

        // Build result object
        const result: UserTrackingData['configurationAnalytics'] = {};
        
        categories.forEach(category => {
            const selectionsMap = categorySelections.get(category);
            const categoryTotal = categoryTotals.get(category) || 0;
            
            if (selectionsMap) {
                result[category] = Array.from(selectionsMap.entries())
                    .map(([value, data]) => ({
                        value,
                        name: data.name,
                        count: data.count,
                        percentageOfCategory: categoryTotal > 0 ? (data.count / categoryTotal) * 100 : 0,
                        percentageOfTotal: totalConfigs > 0 ? (data.count / totalConfigs) * 100 : 0,
                        quantity: data.configCount > 0 ? data.totalQuantity / data.configCount : undefined
                    }))
                    .sort((a, b) => b.count - a.count);
            } else {
                result[category] = [];
            }
        });

        return result;
    }

    /**
     * Get quantity analytics for geschossdecke and pvanlage
     */
    static async getQuantityAnalytics() {
        const sessions = await prisma.userSession.findMany({
            where: {
                status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                configurationData: { not: Prisma.JsonNull }
            },
            select: {
                configurationData: true
            }
        });

        // Helper to extract quantity from field
        const extractQuantity = (field: unknown): number | null => {
            if (field && typeof field === 'object' && 'quantity' in field) {
                const qty = (field as { quantity?: unknown }).quantity;
                return typeof qty === 'number' && qty > 0 ? qty : null;
            }
            return null;
        };

        const geschossdeckeData = {
            totalWithOption: 0,
            totalQuantity: 0,
            quantityMap: new Map<number, number>()
        };

        const pvanlageData = {
            totalWithOption: 0,
            totalQuantity: 0,
            quantityMap: new Map<number, number>()
        };

        sessions.forEach(session => {
            const config = session.configurationData as Record<string, unknown>;
            
            // Process geschossdecke
            if (config.geschossdecke) {
                geschossdeckeData.totalWithOption++;
                const quantity = extractQuantity(config.geschossdecke);
                if (quantity) {
                    geschossdeckeData.totalQuantity += quantity;
                    const count = geschossdeckeData.quantityMap.get(quantity) || 0;
                    geschossdeckeData.quantityMap.set(quantity, count + 1);
                }
            }

            // Process pvanlage
            if (config.pvanlage) {
                pvanlageData.totalWithOption++;
                const quantity = extractQuantity(config.pvanlage);
                if (quantity) {
                    pvanlageData.totalQuantity += quantity;
                    const count = pvanlageData.quantityMap.get(quantity) || 0;
                    pvanlageData.quantityMap.set(quantity, count + 1);
                }
            }
        });

        return {
            geschossdecke: {
                totalWithOption: geschossdeckeData.totalWithOption,
                averageQuantity: geschossdeckeData.totalWithOption > 0 
                    ? geschossdeckeData.totalQuantity / geschossdeckeData.totalWithOption 
                    : 0,
                quantityDistribution: Array.from(geschossdeckeData.quantityMap.entries())
                    .map(([quantity, count]) => ({ quantity, count }))
                    .sort((a, b) => a.quantity - b.quantity)
            },
            pvanlage: {
                totalWithOption: pvanlageData.totalWithOption,
                averageQuantity: pvanlageData.totalWithOption > 0 
                    ? pvanlageData.totalQuantity / pvanlageData.totalWithOption 
                    : 0,
                quantityDistribution: Array.from(pvanlageData.quantityMap.entries())
                    .map(([quantity, count]) => ({ quantity, count }))
                    .sort((a, b) => a.quantity - b.quantity)
            }
        };
    }

    /**
     * Calculate time metrics with data quality filters
     */
    static async getTimeMetrics() {
        const sessions = await prisma.userSession.findMany({
            where: {
                status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                endTime: { not: null }
            },
            select: {
                sessionId: true,
                startTime: true,
                endTime: true,
                status: true
            }
        });

        // Filter sessions with realistic durations (10 seconds to 2 hours)
        const MIN_DURATION = 10; // seconds
        const MAX_DURATION = 7200; // 2 hours in seconds

        const validSessions = sessions.filter(session => {
            if (!session.endTime) return false;
            const duration = (session.endTime.getTime() - session.startTime.getTime()) / 1000;
            return duration >= MIN_DURATION && duration <= MAX_DURATION;
        });

        let totalTimeToCart = 0;
        let totalTimeToInquiry = 0;
        let totalDuration = 0;
        let cartCount = 0;
        let inquiryCount = 0;

        validSessions.forEach(session => {
            if (!session.endTime) return;

            const duration = (session.endTime.getTime() - session.startTime.getTime()) / 1000; // seconds
            totalDuration += duration;

            if (session.status === 'IN_CART') {
                totalTimeToCart += duration;
                cartCount++;
            }

            if (session.status === 'COMPLETED' || session.status === 'CONVERTED') {
                totalTimeToInquiry += duration;
                inquiryCount++;
            }
        });

        return {
            avgTimeToCart: cartCount > 0 ? Math.round(totalTimeToCart / cartCount) : 0,
            avgTimeToInquiry: inquiryCount > 0 ? Math.round(totalTimeToInquiry / inquiryCount) : 0,
            avgSessionDuration: validSessions.length > 0 ? Math.round(totalDuration / validSessions.length) : 0
        };
    }
}

export async function GET() {
    try {
        console.log('📊 User tracking request started');
        const startTime = Date.now();

        // Fetch all data in parallel with error handling
        const results = await Promise.allSettled([
            UserTrackingService.getFunnelMetrics(),
            UserTrackingService.getTopConfigurations(),
            UserTrackingService.getPriceDistribution(),
            UserTrackingService.getSelectionStats(),
            UserTrackingService.getClickAnalytics(),
            UserTrackingService.getConfigurationAnalytics(),
            UserTrackingService.getQuantityAnalytics(),
            UserTrackingService.getTimeMetrics()
        ]);

        // Helper to extract value with default fallback
        const getResult = <T,>(index: number, defaultValue: T): T => {
            const result = results[index];
            if (result.status === 'fulfilled') {
                return result.value as T;
            } else {
                console.error(`❌ Failed to fetch analytics data [${index}]:`, result.reason);
                return defaultValue;
            }
        };

        const funnel = getResult(0, { totalSessions: 0, reachedCart: 0, completedInquiry: 0, converted: 0, cartRate: 0, inquiryRate: 0, conversionRate: 0 });
        const topConfigurations = getResult(1, []);
        const priceDistribution = getResult(2, []);
        const selectionStats = getResult(3, { nestTypes: [], gebaeudehuelle: [], innenverkleidung: [] });
        const clickAnalytics = getResult(4, { pageClicks: [], mouseClicks: [] });
        const configurationAnalytics = getResult(5, {});
        const quantityAnalytics = getResult(6, { 
            geschossdecke: { totalWithOption: 0, averageQuantity: 0, quantityDistribution: [] }, 
            pvanlage: { totalWithOption: 0, averageQuantity: 0, quantityDistribution: [] } 
        });
        const timeMetrics = getResult(7, { avgTimeToCart: 0, avgTimeToInquiry: 0, avgSessionDuration: 0 });

        const response: UserTrackingData = {
            funnel,
            topConfigurations,
            priceDistribution,
            selectionStats,
            clickAnalytics,
            configurationAnalytics,
            quantityAnalytics,
            timeMetrics,
            metadata: {
                totalConfigurations: funnel.reachedCart,
                dataRange: {
                    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                    to: new Date().toISOString()
                },
                lastUpdated: new Date().toISOString()
            }
        };

        console.log(`✅ User tracking data generated in ${Date.now() - startTime}ms`);

        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ User tracking error:', error);
        return NextResponse.json({
            error: 'Failed to fetch user tracking data',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

