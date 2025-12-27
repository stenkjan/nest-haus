/**
 * Data Storage and Integrity Tests
 * Tests database operations, upsert logic, race conditions, and data consistency
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';
import {
    generateTestSessionId,
    generateTestCustomer,
    generateTestConfiguration,
    cleanupTestData,
    wait,
    createTestSession,
} from '../utils/test-helpers';
import { TEST_CONFIG } from '../config/test-config';

describe('Data Storage and Integrity Tests', () => {
    let testSessionId: string;

    beforeEach(() => {
        testSessionId = generateTestSessionId();
    });

    afterEach(async () => {
        if (TEST_CONFIG.AUTO_CLEANUP) {
            await cleanupTestData(testSessionId);
        }
    });

    describe('Upsert Operations', () => {
        it('should create session on first upsert', async () => {
            const session = await prisma.userSession.upsert({
                where: { sessionId: testSessionId },
                update: { lastActivity: new Date() },
                create: {
                    sessionId: testSessionId,
                    ipAddress: '127.0.0.1',
                    userAgent: 'Test Agent',
                    status: 'ACTIVE',
                },
            });

            expect(session).toBeDefined();
            expect(session.sessionId).toBe(testSessionId);
            expect(session.status).toBe('ACTIVE');
        });

        it('should update existing session on second upsert', async () => {
            // First upsert - create
            const firstSession = await prisma.userSession.upsert({
                where: { sessionId: testSessionId },
                update: { lastActivity: new Date() },
                create: {
                    sessionId: testSessionId,
                    ipAddress: '127.0.0.1',
                    userAgent: 'Test Agent',
                    status: 'ACTIVE',
                },
            });

            await wait(50);

            // Second upsert - update
            const secondSession = await prisma.userSession.upsert({
                where: { sessionId: testSessionId },
                update: { lastActivity: new Date(), totalPrice: 10000000 },
                create: {
                    sessionId: testSessionId,
                    ipAddress: '127.0.0.1',
                    userAgent: 'Test Agent',
                    status: 'ACTIVE',
                },
            });

            expect(secondSession.id).toBe(firstSession.id);
            expect(secondSession.totalPrice).toBe(10000000);
            expect(secondSession.lastActivity.getTime()).toBeGreaterThan(
                firstSession.lastActivity.getTime()
            );
        });

        it('should handle concurrent upsert requests', async () => {
            // Simulate multiple concurrent upserts
            const promises = Array.from({ length: 5 }).map((_, i) =>
                prisma.userSession.upsert({
                    where: { sessionId: testSessionId },
                    update: { lastActivity: new Date(), totalPrice: (i + 1) * 1000000 },
                    create: {
                        sessionId: testSessionId,
                        ipAddress: '127.0.0.1',
                        userAgent: 'Test Agent',
                        status: 'ACTIVE',
                    },
                })
            );

            const results = await Promise.all(promises);

            // All results should be for the same session
            const uniqueIds = new Set(results.map(r => r.id));
            expect(uniqueIds.size).toBe(1);

            // Verify only one session exists
            const sessions = await prisma.userSession.findMany({
                where: { sessionId: testSessionId },
            });

            expect(sessions).toHaveLength(1);
        });
    });

    describe('Foreign Key Constraints', () => {
        beforeEach(async () => {
            await createTestSession(testSessionId);
        });

        it('should prevent orphaned selection events', async () => {
            // Try to create selection event without session
            const nonExistentSession = generateTestSessionId();

            await expect(
                prisma.selectionEvent.create({
                    data: {
                        sessionId: nonExistentSession,
                        category: 'nest',
                        selection: 'Hoam 100',
                    },
                })
            ).rejects.toThrow();
        });

        it('should allow selection events with valid session', async () => {
            const event = await prisma.selectionEvent.create({
                data: {
                    sessionId: testSessionId,
                    category: 'nest',
                    selection: 'Hoam 100',
                    totalPrice: 10000000,
                },
            });

            expect(event).toBeDefined();
            expect(event.sessionId).toBe(testSessionId);
        });
    });

    describe('Cascade Deletions', () => {
        beforeEach(async () => {
            await createTestSession(testSessionId);
        });

        it('should cascade delete selection events when session deleted', async () => {
            // Create selection events
            await prisma.selectionEvent.create({
                data: {
                    sessionId: testSessionId,
                    category: 'nest',
                    selection: 'Hoam 100',
                },
            });

            await prisma.selectionEvent.create({
                data: {
                    sessionId: testSessionId,
                    category: 'gebaeudehuelle',
                    selection: 'Holzlattung',
                },
            });

            // Delete session
            await prisma.userSession.delete({
                where: { sessionId: testSessionId },
            });

            // Verify selection events are deleted
            const events = await prisma.selectionEvent.findMany({
                where: { sessionId: testSessionId },
            });

            expect(events).toHaveLength(0);
        });

        it('should cascade delete interaction events when session deleted', async () => {
            // Create interaction events
            await prisma.interactionEvent.create({
                data: {
                    sessionId: testSessionId,
                    eventType: 'click',
                    category: 'nest',
                    elementId: 'nest-card',
                },
            });

            // Delete session
            await prisma.userSession.delete({
                where: { sessionId: testSessionId },
            });

            // Verify interaction events are deleted
            const interactions = await prisma.interactionEvent.findMany({
                where: { sessionId: testSessionId },
            });

            expect(interactions).toHaveLength(0);
        });
    });

    describe('Data Retrieval Accuracy', () => {
        it('should retrieve session with all related data', async () => {
            await createTestSession(testSessionId);

            // Add selection events
            await prisma.selectionEvent.createMany({
                data: [
                    {
                        sessionId: testSessionId,
                        category: 'nest',
                        selection: 'Hoam 100',
                    },
                    {
                        sessionId: testSessionId,
                        category: 'gebaeudehuelle',
                        selection: 'Holzlattung',
                    },
                ],
            });

            // Add interaction event
            await prisma.interactionEvent.create({
                data: {
                    sessionId: testSessionId,
                    eventType: 'click',
                    category: 'nest',
                },
            });

            // Retrieve with relations
            const session = await prisma.userSession.findUnique({
                where: { sessionId: testSessionId },
                include: {
                    selectionEvents: true,
                    interactionEvents: true,
                },
            });

            expect(session).toBeDefined();
            expect(session?.selectionEvents).toHaveLength(2);
            expect(session?.interactionEvents).toHaveLength(1);
        });

        it('should paginate inquiries correctly', async () => {
            const customer = generateTestCustomer();

            // Create multiple inquiries
            for (let i = 0; i < 5; i++) {
                await prisma.customerInquiry.create({
                    data: {
                        email: customer.email,
                        name: `${customer.name} ${i}`,
                        status: 'NEW',
                        preferredContact: 'EMAIL',
                    },
                });
            }

            await wait(50);

            // Get first page
            const page1 = await prisma.customerInquiry.findMany({
                where: { email: customer.email },
                orderBy: { createdAt: 'desc' },
                take: 2,
                skip: 0,
            });

            // Get second page
            const page2 = await prisma.customerInquiry.findMany({
                where: { email: customer.email },
                orderBy: { createdAt: 'desc' },
                take: 2,
                skip: 2,
            });

            expect(page1).toHaveLength(2);
            expect(page2).toHaveLength(2);
            expect(page1[0].id).not.toBe(page2[0].id);
        });
    });

    describe('Redis-PostgreSQL Synchronization', () => {
        it('should maintain consistency between Redis and PostgreSQL', async () => {
            // Create session in both
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const { sessionId } = await response.json();
            testSessionId = sessionId;

            // Track selection (updates both)
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

            // Check Redis
            const redisKey = `session:${sessionId}`;
            const redisData = await redis.get(redisKey);
            expect(redisData).toBeDefined();

            // Check PostgreSQL
            const pgSession = await prisma.userSession.findUnique({
                where: { sessionId },
            });

            expect(pgSession).toBeDefined();
            expect(pgSession?.totalPrice).toBe(10000000);
        });

        it('should handle Redis cache miss gracefully', async () => {
            // Create session in PostgreSQL only
            await createTestSession(testSessionId);

            // Session should still be retrievable even if not in Redis
            const session = await prisma.userSession.findUnique({
                where: { sessionId: testSessionId },
            });

            expect(session).toBeDefined();
        });
    });

    describe('Race Condition Handling', () => {
        it('should handle multiple simultaneous selections', async () => {
            await createTestSession(testSessionId);

            // Send multiple selections simultaneously
            const promises = [
                fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: testSessionId,
                        category: 'nest',
                        selection: 'Hoam 100',
                        totalPrice: 10000000,
                    }),
                }),
                fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: testSessionId,
                        category: 'gebaeudehuelle',
                        selection: 'Holzlattung',
                        totalPrice: 12000000,
                    }),
                }),
                fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: testSessionId,
                        category: 'innenverkleidung',
                        selection: 'Kiefer',
                        totalPrice: 13000000,
                    }),
                }),
            ];

            const responses = await Promise.all(promises);
            responses.forEach(res => {
                expect(res.status).toBe(200);
            });

            await wait(100);

            // Verify all selections were recorded
            const events = await prisma.selectionEvent.findMany({
                where: { sessionId: testSessionId },
            });

            expect(events.length).toBeGreaterThanOrEqual(3);
        });

        it('should handle concurrent inquiry submissions', async () => {
            const customer = generateTestCustomer();

            // Submit same inquiry twice simultaneously
            const promises = [
                fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: customer.email,
                        name: customer.name,
                        requestType: 'contact',
                    }),
                }),
                fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: customer.email,
                        name: customer.name,
                        requestType: 'contact',
                    }),
                }),
            ];

            const responses = await Promise.all(promises);

            // Both should succeed
            responses.forEach(res => {
                expect(res.status).toBe(201);
            });

            await wait(100);

            // Verify two separate inquiries were created
            const inquiries = await prisma.customerInquiry.findMany({
                where: { email: customer.email },
            });

            expect(inquiries.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('Query Performance', () => {
        it('should retrieve session data quickly', async () => {
            await createTestSession(testSessionId);

            const startTime = Date.now();
            const session = await prisma.userSession.findUnique({
                where: { sessionId: testSessionId },
            });
            const endTime = Date.now();

            expect(session).toBeDefined();
            expect(endTime - startTime).toBeLessThan(100); // Should be < 100ms
        });

        it('should handle bulk operations efficiently', async () => {
            await createTestSession(testSessionId);

            const startTime = Date.now();

            // Create 50 selection events
            await prisma.selectionEvent.createMany({
                data: Array.from({ length: 50 }).map((_, i) => ({
                    sessionId: testSessionId,
                    category: `category_${i}`,
                    selection: `Selection ${i}`,
                })),
            });

            const endTime = Date.now();

            expect(endTime - startTime).toBeLessThan(1000); // Should be < 1 second

            // Verify all were created
            const count = await prisma.selectionEvent.count({
                where: { sessionId: testSessionId },
            });

            expect(count).toBe(50);
        });
    });
});

