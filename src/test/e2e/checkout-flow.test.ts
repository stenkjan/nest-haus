/**
 * End-to-End Checkout Flow Tests
 * Tests complete user journey from browsing to checkout
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import {
    generateTestSessionId,
    generateTestCustomer,
    generateTestConfiguration,
    cleanupTestData,
    wait,
} from '../utils/test-helpers';
import { TEST_CONFIG } from '../config/test-config';

describe('End-to-End Checkout Flow Tests', () => {
    let testSessionId: string;
    let testCustomer: ReturnType<typeof generateTestCustomer>;
    let testConfig: ReturnType<typeof generateTestConfiguration>;

    beforeEach(() => {
        testSessionId = generateTestSessionId();
        testCustomer = generateTestCustomer();
        testConfig = generateTestConfiguration();
    });

    afterEach(async () => {
        if (TEST_CONFIG.AUTO_CLEANUP) {
            await cleanupTestData(testSessionId);
        }
    });

    describe('Complete Checkout Flow with Payment', () => {
        it('should complete entire checkout flow', async () => {
            // Step 1: Create session
            const sessionResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const { sessionId } = await sessionResponse.json();
            testSessionId = sessionId;

            expect(sessionResponse.status).toBe(200);
            expect(sessionId).toBeDefined();

            // Step 2: Make selections in configurator
            const steps = [
                { category: 'nest', selection: 'Hoam 100', price: 10000000 },
                { category: 'gebaeudehuelle', selection: 'Holzlattung', price: 12000000 },
                { category: 'innenverkleidung', selection: 'Kiefer', price: 13000000 },
                { category: 'fussboden', selection: 'Parkett', price: 15000000 },
            ];

            for (const step of steps) {
                const trackResponse = await fetch(
                    `${TEST_CONFIG.API_BASE_URL}/api/sessions/track`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            sessionId,
                            category: step.category,
                            selection: step.selection,
                            totalPrice: step.price,
                        }),
                    }
                );

                expect(trackResponse.status).toBe(200);
                await wait(50);
            }

            // Step 3: Add to cart (simulated by having configuration)
            await wait(100);

            // Step 4: Create payment intent
            const paymentResponse = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: testConfig.totalPrice,
                        currency: 'eur',
                        customerEmail: testCustomer.email,
                        customerName: testCustomer.name,
                    }),
                }
            );

            const paymentData = await paymentResponse.json();
            expect(paymentResponse.status).toBe(200);
            expect(paymentData.paymentIntentId).toBeDefined();

            // Step 5: Create order with payment
            const orderResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [
                        {
                            sessionId,
                            configuration: testConfig,
                            price: testConfig.totalPrice,
                        },
                    ],
                    orderDetails: {
                        customerInfo: {
                            name: testCustomer.name,
                            email: testCustomer.email,
                            phone: testCustomer.phone,
                        },
                        notes: 'E2E test order',
                    },
                    totalPrice: testConfig.totalPrice,
                    paymentIntentId: paymentData.paymentIntentId,
                }),
            });

            const orderData = await orderResponse.json();
            expect(orderResponse.status).toBe(200);
            expect(orderData.success).toBe(true);
            expect(orderData.orderId).toBeDefined();

            // Step 6: Verify order in database
            await wait(100);

            const inquiry = await prisma.customerInquiry.findUnique({
                where: { id: orderData.orderId },
            });

            expect(inquiry).toBeDefined();
            expect(inquiry?.status).toBe('CONVERTED');
            expect(inquiry?.paymentStatus).toBe('PAID');
            expect(inquiry?.paymentIntentId).toBe(paymentData.paymentIntentId);

            // Step 7: Verify session is marked as completed
            const session = await prisma.userSession.findMany({
                where: { sessionId },
            });

            expect(session.length).toBeGreaterThan(0);
            expect(session[0].status).toBe('COMPLETED');
        });
    });

    describe('Complete Checkout Flow without Payment', () => {
        it('should complete checkout as inquiry only', async () => {
            // Step 1: Create session
            const sessionResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const { sessionId } = await sessionResponse.json();
            testSessionId = sessionId;

            // Step 2: Make selections
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

            // Step 3: Submit inquiry without payment
            const orderResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [
                        {
                            sessionId,
                            configuration: testConfig,
                            price: testConfig.totalPrice,
                        },
                    ],
                    orderDetails: {
                        customerInfo: {
                            name: testCustomer.name,
                            email: testCustomer.email,
                        },
                    },
                    totalPrice: testConfig.totalPrice,
                    // No paymentIntentId
                }),
            });

            const orderData = await orderResponse.json();
            expect(orderResponse.status).toBe(200);
            expect(orderData.success).toBe(true);

            // Verify inquiry without payment
            await wait(100);

            const inquiry = await prisma.customerInquiry.findUnique({
                where: { id: orderData.orderId },
            });

            expect(inquiry).toBeDefined();
            expect(inquiry?.status).toBe('NEW');
            expect(inquiry?.paymentStatus).toBe('PENDING');
            expect(inquiry?.paymentIntentId).toBeNull();
        });
    });

    describe('Abandoned Cart Tracking', () => {
        it('should track abandoned checkout', async () => {
            // Create session and make selections
            const sessionResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const { sessionId } = await sessionResponse.json();
            testSessionId = sessionId;

            // Make some selections
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

            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: 'gebaeudehuelle',
                    selection: 'Holzlattung',
                    totalPrice: 12000000,
                }),
            });

            await wait(100);

            // Finalize without completing order
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/finalize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    config: {
                        nest: testConfig.nest,
                        gebaeudehuelle: testConfig.gebaeudehuelle,
                    },
                }),
            });

            await wait(100);

            // Verify session marked as abandoned (no order, incomplete config)
            const session = await prisma.userSession.findFirst({
                where: { sessionId },
            });

            expect(session).toBeDefined();
            expect(session?.status).toBe('ABANDONED');
        });
    });

    describe('Resume Abandoned Cart', () => {
        it('should allow resuming configuration', async () => {
            // Create and abandon a session
            const sessionResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const { sessionId } = await sessionResponse.json();
            testSessionId = sessionId;

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

            // Retrieve session configuration
            const session = await prisma.userSession.findUnique({
                where: { sessionId },
                include: {
                    selectionEvents: {
                        orderBy: { timestamp: 'asc' },
                    },
                },
            });

            expect(session).toBeDefined();
            expect(session?.selectionEvents.length).toBeGreaterThan(0);

            // User can resume by continuing to add selections
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: 'innenverkleidung',
                    selection: 'Kiefer',
                    totalPrice: 13000000,
                }),
            });

            await wait(100);

            const updatedSession = await prisma.userSession.findUnique({
                where: { sessionId },
                include: {
                    selectionEvents: true,
                },
            });

            expect(updatedSession?.selectionEvents.length).toBeGreaterThan(1);
        });
    });

    describe('Multiple Configurations in Cart', () => {
        it('should handle cart with multiple configurations', async () => {
            // Create two separate sessions
            const session1Response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
            });
            const { sessionId: sessionId1 } = await session1Response.json();

            const session2Response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
            });
            const { sessionId: sessionId2 } = await session2Response.json();

            testSessionId = sessionId1; // For cleanup

            const config1 = generateTestConfiguration();
            const config2 = {
                ...generateTestConfiguration(),
                nest: { name: 'Hoam 150', value: 'nest150' },
            };

            // Create order with both configurations
            const orderResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [
                        {
                            sessionId: sessionId1,
                            configuration: config1,
                            price: config1.totalPrice,
                        },
                        {
                            sessionId: sessionId2,
                            configuration: config2,
                            price: config2.totalPrice,
                        },
                    ],
                    orderDetails: {
                        customerInfo: {
                            name: testCustomer.name,
                            email: testCustomer.email,
                        },
                    },
                    totalPrice: config1.totalPrice + config2.totalPrice,
                }),
            });

            const orderData = await orderResponse.json();
            expect(orderResponse.status).toBe(200);
            expect(orderData.success).toBe(true);

            // Verify order includes both configurations
            await wait(100);

            const inquiry = await prisma.customerInquiry.findUnique({
                where: { id: orderData.orderId },
            });

            expect(inquiry).toBeDefined();
            expect(inquiry?.configurationData).toBeDefined();

            // Verify both sessions marked as completed
            const session1 = await prisma.userSession.findMany({
                where: { sessionId: sessionId1 },
            });
            expect(session1[0]?.status).toBe('COMPLETED');

            await cleanupTestData(sessionId2);
        });
    });

    describe('Customer Information Validation', () => {
        it('should reject checkout with invalid email', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [{ configuration: testConfig, price: testConfig.totalPrice }],
                    orderDetails: {
                        customerInfo: {
                            email: 'invalid-email',
                            name: testCustomer.name,
                        },
                    },
                    totalPrice: testConfig.totalPrice,
                }),
            });

            expect(response.status).toBe(400);
        });

        it('should require customer email', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [{ configuration: testConfig, price: testConfig.totalPrice }],
                    orderDetails: {
                        customerInfo: {
                            name: testCustomer.name,
                            // Missing email
                        },
                    },
                    totalPrice: testConfig.totalPrice,
                }),
            });

            expect(response.status).toBe(400);
        });
    });
});

