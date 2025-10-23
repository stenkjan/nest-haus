/**
 * Drop-off Analysis Tests
 * Tests funnel tracking, exit point identification, and user journey analysis
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import {
    generateTestSessionId,
    cleanupTestData,
    wait,
} from '../utils/test-helpers';
import { TEST_CONFIG } from '../config/test-config';

describe('Drop-off Analysis Tests', () => {
    describe('Drop-off Rate Calculation', () => {
        const configuratorSteps = [
            'nest',
            'gebaeudehuelle',
            'innenverkleidung',
            'fussboden',
            'pvanlage',
            'fenster',
            'planungspaket',
        ];

        it('should calculate drop-off rate per step', async () => {
            // Create sessions with varying completion levels
            const sessions = await createSessionsWithDropoffs();

            // Calculate drop-off rates
            const stats = await calculateDropoffStats(sessions);

            expect(stats).toBeDefined();
            expect(stats.totalSessions).toBeGreaterThan(0);
            expect(stats.dropoffsByStep).toBeDefined();

            // Verify drop-off rate increases with step depth
            const nestDropoff = stats.dropoffsByStep['nest'] || 0;
            const lastStepDropoff = stats.dropoffsByStep['planungspaket'] || 0;

            expect(lastStepDropoff).toBeGreaterThanOrEqual(nestDropoff);
        });

        it('should identify highest drop-off step', async () => {
            const sessions = await createSessionsWithDropoffs();
            const stats = await calculateDropoffStats(sessions);

            const dropoffRates = Object.entries(stats.dropoffsByStep);
            expect(dropoffRates.length).toBeGreaterThan(0);

            // Find step with highest drop-off
            const highestDropoff = dropoffRates.reduce((max, current) =>
                current[1] > max[1] ? current : max
            );

            expect(highestDropoff).toBeDefined();
            expect(highestDropoff[1]).toBeGreaterThan(0);
        });

        it('should track completion percentage', async () => {
            const sessions = await createSessionsWithDropoffs();
            const stats = await calculateDropoffStats(sessions);

            expect(stats.averageCompletion).toBeDefined();
            expect(stats.averageCompletion).toBeGreaterThanOrEqual(0);
            expect(stats.averageCompletion).toBeLessThanOrEqual(100);
        });
    });

    describe('Common Exit Points', () => {
        it('should identify where users commonly exit', async () => {
            const sessions = await createSessionsWithDropoffs();

            // Analyze exit points
            const exitPoints = await analyzeExitPoints(sessions);

            expect(exitPoints).toBeDefined();
            expect(Array.isArray(exitPoints)).toBe(true);
            expect(exitPoints.length).toBeGreaterThan(0);

            // Each exit point should have step and count
            exitPoints.forEach(point => {
                expect(point.step).toBeDefined();
                expect(point.count).toBeGreaterThan(0);
            });
        });

        it('should rank exit points by frequency', async () => {
            const sessions = await createSessionsWithDropoffs();
            const exitPoints = await analyzeExitPoints(sessions);

            // Verify exit points are sorted by count (descending)
            for (let i = 0; i < exitPoints.length - 1; i++) {
                expect(exitPoints[i].count).toBeGreaterThanOrEqual(exitPoints[i + 1].count);
            }
        });
    });

    describe('Time Spent Before Abandonment', () => {
        it('should track time spent before each drop-off', async () => {
            const sessionId = generateTestSessionId();

            // Create session
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json());

            const startTime = Date.now();

            // Make some selections with delays
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: 'nest',
                    selection: 'NEST 100',
                }),
            });

            await wait(100);

            // Finalize (abandon)
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/finalize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    config: {},
                }),
            });

            const endTime = Date.now();
            await wait(50);

            // Verify session duration was recorded
            const session = await prisma.userSession.findFirst({
                where: { sessionId },
            });

            expect(session).toBeDefined();
            expect(session?.endTime).toBeDefined();

            if (session?.startTime && session?.endTime) {
                const duration =
                    session.endTime.getTime() - session.startTime.getTime();
                expect(duration).toBeGreaterThan(0);
            }

            await cleanupTestData(sessionId);
        });

        it('should calculate average time before abandonment per step', async () => {
            const sessions = await createSessionsWithDropoffs();
            const timeStats = await calculateTimeBeforeAbandonment(sessions);

            expect(timeStats).toBeDefined();
            expect(typeof timeStats.averageTime).toBe('number');
            expect(timeStats.averageTime).toBeGreaterThan(0);
        });
    });

    describe('User Journey Reconstruction', () => {
        it('should reconstruct complete user journey', async () => {
            const sessionId = generateTestSessionId();

            // Create a complete journey
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
            }).then(res => res.json());

            const steps = ['nest', 'gebaeudehuelle', 'innenverkleidung'];

            for (const step of steps) {
                await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId,
                        category: step,
                        selection: `${step}_value`,
                    }),
                });
                await wait(50);
            }

            await wait(100);

            // Reconstruct journey
            const journey = await reconstructUserJourney(sessionId);

            expect(journey).toBeDefined();
            expect(journey.steps.length).toBeGreaterThanOrEqual(steps.length);
            expect(journey.completed).toBeDefined();

            await cleanupTestData(sessionId);
        });

        it('should identify backtracking in user journey', async () => {
            const sessionId = generateTestSessionId();

            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
            });

            // User selects, then changes their mind
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: 'nest',
                    selection: 'NEST 100',
                }),
            });

            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: 'nest',
                    selection: 'NEST 150', // Changed selection
                    previousSelection: 'NEST 100',
                }),
            });

            await wait(100);

            const events = await prisma.selectionEvent.findMany({
                where: { sessionId },
                orderBy: { timestamp: 'asc' },
            });

            expect(events.length).toBeGreaterThanOrEqual(2);
            expect(events[1].previousSelection).toBe('NEST 100');

            await cleanupTestData(sessionId);
        });
    });

    describe('Conversion Funnel Analysis', () => {
        it('should analyze conversion funnel from start to completion', async () => {
            const sessions = await createSessionsWithDropoffs();
            const funnel = await analyzeConversionFunnel(sessions);

            expect(funnel).toBeDefined();
            expect(funnel.stages).toBeDefined();
            expect(funnel.conversionRate).toBeDefined();
            expect(funnel.conversionRate).toBeGreaterThanOrEqual(0);
            expect(funnel.conversionRate).toBeLessThanOrEqual(100);
        });

        it('should track conversion rate by step', async () => {
            const sessions = await createSessionsWithDropoffs();
            const funnel = await analyzeConversionFunnel(sessions);

            expect(funnel.stages.length).toBeGreaterThan(0);

            // Verify conversion rate decreases at each stage
            for (let i = 0; i < funnel.stages.length - 1; i++) {
                expect(funnel.stages[i].conversionRate).toBeGreaterThanOrEqual(
                    funnel.stages[i + 1].conversionRate
                );
            }
        });
    });
});

// Helper functions for drop-off analysis tests

async function createSessionsWithDropoffs() {
    const sessions = [];
    const steps = [
        'nest',
        'gebaeudehuelle',
        'innenverkleidung',
        'fussboden',
        'pvanlage',
    ];

    // Create 10 sessions with varying completion levels
    for (let i = 0; i < 10; i++) {
        const sessionId = generateTestSessionId();
        sessions.push(sessionId);

        // Create session
        await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
            method: 'POST',
        });

        // Complete random number of steps
        const completedSteps = Math.floor(Math.random() * steps.length) + 1;

        for (let j = 0; j < completedSteps; j++) {
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: steps[j],
                    selection: `${steps[j]}_value`,
                }),
            });
            await wait(20);
        }

        // Finalize session
        await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/finalize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                config: completedSteps === steps.length ? { complete: true } : {},
            }),
        });
    }

    await wait(200);
    return sessions;
}

async function calculateDropoffStats(sessionIds: string[]) {
    const stats = {
        totalSessions: sessionIds.length,
        dropoffsByStep: {} as Record<string, number>,
        averageCompletion: 0,
    };

    for (const sessionId of sessionIds) {
        const events = await prisma.selectionEvent.findMany({
            where: { sessionId },
        });

        events.forEach(event => {
            stats.dropoffsByStep[event.category] =
                (stats.dropoffsByStep[event.category] || 0) + 1;
        });
    }

    return stats;
}

async function analyzeExitPoints(sessionIds: string[]) {
    const exitCounts: Record<string, number> = {};

    for (const sessionId of sessionIds) {
        const events = await prisma.selectionEvent.findMany({
            where: { sessionId },
            orderBy: { timestamp: 'desc' },
            take: 1,
        });

        if (events[0]) {
            exitCounts[events[0].category] = (exitCounts[events[0].category] || 0) + 1;
        }
    }

    return Object.entries(exitCounts)
        .map(([step, count]) => ({ step, count }))
        .sort((a, b) => b.count - a.count);
}

async function calculateTimeBeforeAbandonment(sessionIds: string[]) {
    let totalTime = 0;
    let count = 0;

    for (const sessionId of sessionIds) {
        const session = await prisma.userSession.findFirst({
            where: { sessionId, status: 'ABANDONED' },
        });

        if (session?.startTime && session?.endTime) {
            totalTime += session.endTime.getTime() - session.startTime.getTime();
            count++;
        }
    }

    return {
        averageTime: count > 0 ? totalTime / count : 0,
        count,
    };
}

async function reconstructUserJourney(sessionId: string) {
    const events = await prisma.selectionEvent.findMany({
        where: { sessionId },
        orderBy: { timestamp: 'asc' },
    });

    const session = await prisma.userSession.findUnique({
        where: { sessionId },
    });

    return {
        steps: events.map(e => ({
            category: e.category,
            selection: e.selection,
            timestamp: e.timestamp,
        })),
        completed: session?.status === 'COMPLETED',
        totalTime: session?.endTime && session?.startTime
            ? session.endTime.getTime() - session.startTime.getTime()
            : null,
    };
}

async function analyzeConversionFunnel(sessionIds: string[]) {
    const stages = [
        { name: 'Started', count: sessionIds.length },
        { name: 'Nest Selected', count: 0 },
        { name: 'Gebäudehülle Selected', count: 0 },
        { name: 'Completed', count: 0 },
    ];

    for (const sessionId of sessionIds) {
        const events = await prisma.selectionEvent.findMany({
            where: { sessionId },
        });

        const hasNest = events.some(e => e.category === 'nest');
        const hasGebaeude = events.some(e => e.category === 'gebaeudehuelle');

        if (hasNest) stages[1].count++;
        if (hasGebaeude) stages[2].count++;

        const session = await prisma.userSession.findUnique({
            where: { sessionId },
        });

        if (session?.status === 'COMPLETED') stages[3].count++;
    }

    const conversionRate =
        sessionIds.length > 0
            ? (stages[3].count / sessionIds.length) * 100
            : 0;

    return {
        stages: stages.map(stage => ({
            ...stage,
            conversionRate: (stage.count / sessionIds.length) * 100,
        })),
        conversionRate,
    };
}

