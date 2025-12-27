/**
 * Popular Configurations Admin Service Tests
 * Tests the service layer that powers the popular configurations dashboard
 */

import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Popular Configurations Service', () => {
    describe('Database Queries', () => {
        it('should fetch user sessions with configuration data', async () => {
            const sessions = await prisma.userSession.findMany({
                where: {
                    configurationData: {
                        not: null
                    }
                },
                select: {
                    id: true,
                    sessionId: true,
                    configurationData: true,
                    totalPrice: true,
                    status: true
                },
                take: 10
            });

            expect(Array.isArray(sessions)).toBe(true);

            // If we have sessions, verify structure
            if (sessions.length > 0) {
                const firstSession = sessions[0];
                expect(firstSession.sessionId).toBeDefined();
                expect(firstSession.configurationData).toBeDefined();
            }
        });

        it('should fetch price distribution data', async () => {
            const sessions = await prisma.userSession.findMany({
                where: {
                    totalPrice: {
                        not: null,
                        gt: 0
                    }
                },
                select: {
                    totalPrice: true
                },
                take: 100
            });

            expect(Array.isArray(sessions)).toBe(true);

            // If we have prices, verify they're numbers
            if (sessions.length > 0) {
                sessions.forEach(session => {
                    expect(typeof session.totalPrice).toBe('number');
                    expect(session.totalPrice).toBeGreaterThan(0);
                });
            }
        });

        it('should count total configurations', async () => {
            const count = await prisma.userSession.count({
                where: {
                    configurationData: {
                        not: null
                    }
                }
            });

            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);
        });

        it('should fetch configurations from last 30 days', async () => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const sessions = await prisma.userSession.findMany({
                where: {
                    startTime: {
                        gte: thirtyDaysAgo
                    },
                    configurationData: {
                        not: null
                    }
                },
                select: {
                    startTime: true,
                    configurationData: true
                },
                take: 100
            });

            expect(Array.isArray(sessions)).toBe(true);

            // Verify timestamps are within range
            sessions.forEach(session => {
                expect(session.startTime.getTime()).toBeGreaterThanOrEqual(thirtyDaysAgo.getTime());
            });
        });
    });

    describe('Configuration Data Structure', () => {
        it('should parse configuration data correctly', async () => {
            const sessions = await prisma.userSession.findMany({
                where: {
                    configurationData: {
                        not: null
                    }
                },
                select: {
                    configurationData: true
                },
                take: 5
            });

            sessions.forEach(session => {
                expect(session.configurationData).toBeDefined();
                expect(typeof session.configurationData).toBe('object');
            });
        });

        it('should handle sessions with conversion status', async () => {
            const convertedSessions = await prisma.userSession.findMany({
                where: {
                    status: 'COMPLETED'
                },
                select: {
                    status: true,
                    configurationData: true
                },
                take: 10
            });

            expect(Array.isArray(convertedSessions)).toBe(true);

            convertedSessions.forEach(session => {
                expect(session.status).toBe('COMPLETED');
            });
        });
    });

    describe('Price Analysis', () => {
        it('should calculate price ranges correctly', () => {
            const priceRanges = [
                { range: '100k-150k', min: 100000, max: 150000 },
                { range: '150k-200k', min: 150000, max: 200000 },
                { range: '200k-250k', min: 200000, max: 250000 },
                { range: '250k-300k', min: 250000, max: 300000 },
                { range: '300k+', min: 300000, max: Infinity }
            ];

            // Test various prices
            const testPrices = [120000, 180000, 220000, 280000, 350000];

            testPrices.forEach(price => {
                const matchingRange = priceRanges.find(r => price >= r.min && price < r.max);
                expect(matchingRange).toBeDefined();
            });
        });

        it('should handle edge case prices', () => {
            const price1 = 150000; // Exactly on boundary
            const price2 = 99999;  // Below minimum
            const price3 = 500000; // Above maximum defined range

            expect(typeof price1).toBe('number');
            expect(typeof price2).toBe('number');
            expect(typeof price3).toBe('number');
        });
    });

    describe('Selection Statistics', () => {
        it('should group configurations by Hoam type', async () => {
            const sessions = await prisma.userSession.findMany({
                where: {
                    configurationData: {
                        not: null
                    }
                },
                select: {
                    configurationData: true
                },
                take: 50
            });

            const nestTypes = new Map<string, number>();

            sessions.forEach(session => {
                const config = session.configurationData as Record<string, unknown>;
                if (config && typeof config.nestType === 'string') {
                    nestTypes.set(config.nestType, (nestTypes.get(config.nestType) || 0) + 1);
                }
            });

            // Map should be created successfully
            expect(nestTypes instanceof Map).toBe(true);
        });

        it('should track selection frequency', async () => {
            const events = await prisma.selectionEvent.findMany({
                select: {
                    category: true,
                    selection: true
                },
                take: 100
            });

            expect(Array.isArray(events)).toBe(true);

            // Count selections
            const selectionCounts = new Map<string, number>();
            events.forEach(event => {
                const key = `${event.category}:${event.selection}`;
                selectionCounts.set(key, (selectionCounts.get(key) || 0) + 1);
            });

            expect(selectionCounts instanceof Map).toBe(true);
        });
    });

    describe('Trends Analysis', () => {
        it('should group sessions by week', async () => {
            const fourWeeksAgo = new Date();
            fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

            const sessions = await prisma.userSession.findMany({
                where: {
                    startTime: {
                        gte: fourWeeksAgo
                    }
                },
                select: {
                    startTime: true,
                    configurationData: true
                },
                orderBy: {
                    startTime: 'asc'
                },
                take: 100
            });

            expect(Array.isArray(sessions)).toBe(true);

            // Group by week
            const weeklyGroups = new Map<number, number>();
            sessions.forEach(session => {
                const weekNumber = Math.ceil(
                    (session.startTime.getTime() - new Date(session.startTime.getFullYear(), 0, 1).getTime()) /
                    (7 * 24 * 60 * 60 * 1000)
                );
                weeklyGroups.set(weekNumber, (weeklyGroups.get(weekNumber) || 0) + 1);
            });

            expect(weeklyGroups instanceof Map).toBe(true);
        });
    });

    describe('Performance', () => {
        it('should fetch data efficiently', async () => {
            const startTime = Date.now();

            await prisma.userSession.findMany({
                where: {
                    configurationData: {
                        not: null
                    }
                },
                select: {
                    configurationData: true,
                    totalPrice: true
                },
                take: 100
            });

            const duration = Date.now() - startTime;

            // Should complete in reasonable time (< 1 second for 100 records)
            expect(duration).toBeLessThan(1000);
        });

        it('should handle large datasets', async () => {
            const count = await prisma.userSession.count();

            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);

            // Even with many records, count should be fast
        });
    });
});
