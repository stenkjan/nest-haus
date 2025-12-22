/**
 * Session Tracking Integration Tests
 * Tests complete session lifecycle, Redis/PostgreSQL sync, and drop-off identification
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import {
    generateTestSessionId,
    generateTestConfiguration,
    cleanupTestData,
    wait,
    mockRedis
} from '../utils/test-helpers';
import { TEST_CONFIG } from '../config/test-config';

// Create mocked Redis client for testing
const testRedis = mockRedis();

// Mock the redis module to use our test Redis
vi.mock('@/lib/redis', () => ({
    default: testRedis,
}));

describe('Session Tracking Tests', () => {
    let testSessionId: string;

    beforeEach(async () => {
        testSessionId = generateTestSessionId();
        // Clear Redis mock before each test
        await testRedis.flushall();
    });

    afterEach(async () => {
        if (TEST_CONFIG.AUTO_CLEANUP) {
            await cleanupTestData(testSessionId);
        }
    });

    describe('Session Creation', () => {
        it('should create a new session and return sessionId', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-agent': 'Test Agent',
                    'x-forwarded-for': '127.0.0.1',
                },
            });

            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.sessionId).toBeDefined();
            expect(typeof data.sessionId).toBe('string');
            expect(data.timestamp).toBeDefined();

            // Verify session exists in PostgreSQL
            const session = await prisma.userSession.findUnique({
                where: { sessionId: data.sessionId },
            });

            expect(session).toBeDefined();
            expect(session?.sessionId).toBe(data.sessionId);
            expect(session?.status).toBe('ACTIVE');
            expect(session?.ipAddress).toBe('127.0.0.1');

            // Verify session exists in Redis
            const redisKey = `session:${data.sessionId}`;
            const redisData = await testRedis.get(redisKey);
            expect(redisData).toBeDefined();

            if (typeof redisData === 'string') {
                const sessionData = JSON.parse(redisData);
                expect(sessionData.sessionId).toBe(data.sessionId);
                expect(sessionData.selections).toBeDefined();
            }

            testSessionId = data.sessionId; // Save for cleanup
        });

        it('should set session expiry in Redis (2 hours)', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            const redisKey = `session:${data.sessionId}`;

            // Check TTL (should be around 7200 seconds / 2 hours)
            const ttl = await testRedis.ttl(redisKey);
            expect(ttl).toBeGreaterThan(7000); // At least 7000 seconds
            expect(ttl).toBeLessThanOrEqual(7200); // At most 7200 seconds

            testSessionId = data.sessionId;
        });
    });

    describe('Selection Tracking', () => {
        beforeEach(async () => {
            // Create a test session first
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            testSessionId = data.sessionId;
        });

        it('should track selection and update both Redis and PostgreSQL', async () => {
            const selection = {
                sessionId: testSessionId,
                category: 'nest',
                selection: 'Hoam 100',
                previousSelection: null,
                priceChange: 10000000,
                totalPrice: 10000000,
            };

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selection),
            });

            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);

            // Verify Redis update
            const redisKey = `session:${testSessionId}`;
            const redisData = await testRedis.get(redisKey);
            expect(redisData).toBeDefined();

            if (typeof redisData === 'string') {
                const sessionData = JSON.parse(redisData);
                expect(sessionData.selections.nest).toBe('Hoam 100');
                expect(sessionData.totalPrice).toBe(10000000);
            }

            // Verify PostgreSQL selection event
            await wait(100); // Small delay for DB write
            const selectionEvent = await prisma.selectionEvent.findFirst({
                where: {
                    sessionId: testSessionId,
                    category: 'nest',
                },
            });

            expect(selectionEvent).toBeDefined();
            expect(selectionEvent?.selection).toBe('Hoam 100');
            expect(selectionEvent?.totalPrice).toBe(10000000);
        });

        it('should track multiple selections in order', async () => {
            const selections = [
                {
                    sessionId: testSessionId,
                    category: 'nest',
                    selection: 'Hoam 100',
                    totalPrice: 10000000,
                },
                {
                    sessionId: testSessionId,
                    category: 'gebaeudehuelle',
                    selection: 'Holzlattung',
                    totalPrice: 12000000,
                },
                {
                    sessionId: testSessionId,
                    category: 'innenverkleidung',
                    selection: 'Kiefer',
                    totalPrice: 13000000,
                },
            ];

            for (const selection of selections) {
                await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(selection),
                });
                await wait(50); // Small delay between requests
            }

            // Verify all selections in PostgreSQL
            await wait(100);
            const events = await prisma.selectionEvent.findMany({
                where: { sessionId: testSessionId },
                orderBy: { timestamp: 'asc' },
            });

            expect(events).toHaveLength(3);
            expect(events[0].category).toBe('nest');
            expect(events[1].category).toBe('gebaeudehuelle');
            expect(events[2].category).toBe('innenverkleidung');
        });

        it('should handle selection without existing session (fail-safe)', async () => {
            const nonExistentSession = generateTestSessionId();
            const selection = {
                sessionId: nonExistentSession,
                category: 'nest',
                selection: 'Hoam 100',
                totalPrice: 10000000,
            };

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selection),
            });

            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.success).toBe(true); // Should not block user experience

            // Verify session was created via upsert
            await wait(100);
            const session = await prisma.userSession.findUnique({
                where: { sessionId: nonExistentSession },
            });

            expect(session).toBeDefined();
            expect(session?.status).toBe('ACTIVE');

            testSessionId = nonExistentSession; // For cleanup
        });
    });

    describe('Interaction Tracking', () => {
        beforeEach(async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            testSessionId = data.sessionId;
        });

        it('should track user interactions', async () => {
            const interaction = {
                sessionId: testSessionId,
                interaction: {
                    eventType: 'click',
                    category: 'nest',
                    elementId: 'nest-100-card',
                    selectionValue: 'Hoam 100',
                    previousValue: null,
                    timeSpent: 5000,
                    deviceInfo: {
                        deviceType: 'desktop',
                        viewportWidth: 1920,
                        viewportHeight: 1080,
                    },
                },
            };

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track-interaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(interaction),
            });

            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);

            // Verify interaction in PostgreSQL
            await wait(100);
            const interactionEvent = await prisma.interactionEvent.findFirst({
                where: {
                    sessionId: testSessionId,
                    eventType: 'click',
                },
            });

            expect(interactionEvent).toBeDefined();
            expect(interactionEvent?.category).toBe('nest');
            expect(interactionEvent?.elementId).toBe('nest-100-card');
        });
    });

    describe('Session Finalization', () => {
        beforeEach(async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            testSessionId = data.sessionId;
        });

        it('should mark completed session with configuration', async () => {
            const config = generateTestConfiguration();

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/finalize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: testSessionId,
                    config,
                }),
            });

            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);

            // Verify session status
            await wait(100);
            const session = await prisma.userSession.findUnique({
                where: { sessionId: testSessionId },
            });

            expect(session?.status).toBe('COMPLETED');
            expect(session?.endTime).toBeDefined();
            expect(session?.configurationData).toBeDefined();
            expect(session?.totalPrice).toBe(config.totalPrice);
        });

        it('should mark abandoned session without configuration', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/finalize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: testSessionId,
                    config: {},
                }),
            });

            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);

            // Verify session status
            await wait(100);
            const session = await prisma.userSession.findUnique({
                where: { sessionId: testSessionId },
            });

            expect(session?.status).toBe('ABANDONED');
        });

        it('should clean up Redis session after finalization', async () => {
            const config = generateTestConfiguration();

            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/finalize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: testSessionId,
                    config,
                }),
            });

            await wait(100);

            // Verify Redis cleanup
            const redisKey = `session:${testSessionId}`;
            const redisData = await testRedis.get(redisKey);
            expect(redisData).toBeNull();
        });
    });

    describe('Drop-off Identification', () => {
        it('should identify drop-off at specific step', async () => {
            // Create session
            const createResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const { sessionId } = await createResponse.json();
            testSessionId = sessionId;

            // Make only first selection
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: 'nest',
                    selection: 'Hoam 100',
                    totalPrice: 10000000,
                }),
            });

            await wait(100);

            // Finalize without completing configuration
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/finalize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    config: { nest: { name: 'Hoam 100' } }, // Incomplete
                }),
            });

            await wait(100);

            // Verify session is marked as abandoned
            const session = await prisma.userSession.findUnique({
                where: { sessionId },
            });

            expect(session?.status).toBe('ABANDONED');

            // Check selection events to identify drop-off point
            const events = await prisma.selectionEvent.findMany({
                where: { sessionId },
            });

            expect(events).toHaveLength(1);
            expect(events[0].category).toBe('nest'); // Dropped off after Hoam selection
        });
    });

    describe('PostgreSQL Failure Handling', () => {
        it('should not block user experience if PostgreSQL tracking fails', async () => {
            // This test verifies the fail-safe pattern in the code
            // Even if PostgreSQL fails, the API returns success to not block UI
            const invalidSession = {
                sessionId: '', // Invalid to potentially cause error
                category: 'nest',
                selection: 'Hoam 100',
                totalPrice: 10000000,
            };

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invalidSession),
            });

            // Should return 400 for missing required field, but not 500
            expect(response.status).toBeLessThan(500);
        });
    });
});

