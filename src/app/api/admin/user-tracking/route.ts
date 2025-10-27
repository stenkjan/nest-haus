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

            const extractValue = (field: unknown): string | undefined => {
                if (typeof field === 'string') return field;
                if (field && typeof field === 'object' && 'value' in field) {
                    const valueField = field as { value?: unknown };
                    return typeof valueField.value === 'string' ? valueField.value : undefined;
                }
                return undefined;
            };

            return {
                nestType: extractValue(config.nestType) || extractValue(config.nest),
                gebaeudehuelle: extractValue(config.gebaeudehuelle),
                innenverkleidung: extractValue(config.innenverkleidung),
                fussboden: extractValue(config.fussboden),
                pvanlage: extractValue(config.pvanlage),
                fenster: extractValue(config.fenster),
                planungspaket: extractValue(config.planungspaket),
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
     * Calculate time metrics
     */
    static async getTimeMetrics() {
        const sessions = await prisma.userSession.findMany({
            where: {
                status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                endTime: { not: null }
            },
            select: {
                startTime: true,
                endTime: true,
                status: true
            }
        });

        let totalTimeToCart = 0;
        let totalTimeToInquiry = 0;
        let totalDuration = 0;
        let cartCount = 0;
        let inquiryCount = 0;

        sessions.forEach(session => {
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
            avgSessionDuration: sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0
        };
    }
}

export async function GET() {
    try {
        console.log('📊 User tracking request started');
        const startTime = Date.now();

        // Fetch all data in parallel
        const [funnel, topConfigurations, priceDistribution, selectionStats, timeMetrics] = await Promise.all([
            UserTrackingService.getFunnelMetrics(),
            UserTrackingService.getTopConfigurations(),
            UserTrackingService.getPriceDistribution(),
            UserTrackingService.getSelectionStats(),
            UserTrackingService.getTimeMetrics()
        ]);

        const response: UserTrackingData = {
            funnel,
            topConfigurations,
            priceDistribution,
            selectionStats,
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

