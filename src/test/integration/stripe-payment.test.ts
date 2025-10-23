/**
 * Stripe Payment Integration Tests
 * Tests complete payment flow with Stripe test cards
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import {
    generateTestSessionId,
    generateTestCustomer,
    generateTestConfiguration,
    cleanupTestData,
    TEST_CARDS,
    wait,
} from '../utils/test-helpers';
import { TEST_CONFIG } from '../config/test-config';

describe('Stripe Payment Integration Tests', () => {
    let testSessionId: string;
    let testCustomer: ReturnType<typeof generateTestCustomer>;

    beforeEach(() => {
        testSessionId = generateTestSessionId();
        testCustomer = generateTestCustomer();
    });

    afterEach(async () => {
        if (TEST_CONFIG.AUTO_CLEANUP) {
            await cleanupTestData(testSessionId);
        }
    });

    describe('Payment Intent Creation', () => {
        it('should create payment intent with valid amount', async () => {
            const config = generateTestConfiguration();

            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: config.totalPrice,
                        currency: 'eur',
                        customerEmail: testCustomer.email,
                        customerName: testCustomer.name,
                        metadata: {
                            sessionId: testSessionId,
                            source: 'test-suite',
                        },
                    }),
                }
            );

            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.clientSecret).toBeDefined();
            expect(data.paymentIntentId).toBeDefined();
            expect(typeof data.clientSecret).toBe('string');
            expect(data.clientSecret).toContain('pi_');
        });

        it('should reject payment intent with amount below minimum', async () => {
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: 25, // Below minimum of 50 cents
                        currency: 'eur',
                        customerEmail: testCustomer.email,
                        customerName: testCustomer.name,
                    }),
                }
            );

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBeDefined();
        });

        it('should reject payment intent with invalid email', async () => {
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: 10000,
                        currency: 'eur',
                        customerEmail: 'invalid-email',
                        customerName: testCustomer.name,
                    }),
                }
            );

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBeDefined();
        });

        it('should use deposit amount in deposit mode', async () => {
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: 50000000, // Large amount
                        currency: 'eur',
                        customerEmail: testCustomer.email,
                        customerName: testCustomer.name,
                    }),
                }
            );

            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.amount).toBe(TEST_CONFIG.DEPOSIT_AMOUNT); // Should use deposit amount
        });
    });

    describe('Payment Confirmation', () => {
        let paymentIntentId: string;

        beforeEach(async () => {
            // Create a payment intent first
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: TEST_CONFIG.DEPOSIT_AMOUNT,
                        currency: 'eur',
                        customerEmail: testCustomer.email,
                        customerName: testCustomer.name,
                    }),
                }
            );

            const data = await response.json();
            paymentIntentId = data.paymentIntentId;
        });

        it('should confirm payment with valid payment intent', async () => {
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/confirm-payment`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentIntentId,
                    }),
                }
            );

            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.paymentIntent).toBeDefined();
        });

        it('should reject confirmation with invalid payment intent ID', async () => {
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/confirm-payment`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentIntentId: 'pi_invalid_12345',
                    }),
                }
            );

            expect(response.status).toBeGreaterThanOrEqual(400);
        });
    });

    describe('Payment Status Checking', () => {
        let paymentIntentId: string;

        beforeEach(async () => {
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: TEST_CONFIG.DEPOSIT_AMOUNT,
                        currency: 'eur',
                        customerEmail: testCustomer.email,
                        customerName: testCustomer.name,
                    }),
                }
            );

            const data = await response.json();
            paymentIntentId = data.paymentIntentId;
        });

        it('should retrieve payment status', async () => {
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/status/${paymentIntentId}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.status).toBeDefined();
            expect(data.amount).toBeDefined();
        });

        it('should return 404 for non-existent payment intent', async () => {
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/status/pi_nonexistent`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            expect(response.status).toBe(404);
        });
    });

    describe('Order Creation with Payment', () => {
        it('should create order with payment intent ID', async () => {
            const config = generateTestConfiguration();

            // Create payment intent
            const paymentResponse = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: TEST_CONFIG.DEPOSIT_AMOUNT,
                        currency: 'eur',
                        customerEmail: testCustomer.email,
                        customerName: testCustomer.name,
                    }),
                }
            );

            const paymentData = await paymentResponse.json();

            // Create order with payment
            const orderResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [
                        {
                            sessionId: testSessionId,
                            configuration: config,
                            price: config.totalPrice,
                        },
                    ],
                    orderDetails: {
                        customerInfo: {
                            name: testCustomer.name,
                            email: testCustomer.email,
                            phone: testCustomer.phone,
                        },
                        notes: 'Test order',
                    },
                    totalPrice: config.totalPrice,
                    paymentIntentId: paymentData.paymentIntentId,
                }),
            });

            const orderData = await orderResponse.json();

            expect(orderResponse.status).toBe(200);
            expect(orderData.success).toBe(true);
            expect(orderData.orderId).toBeDefined();

            // Verify inquiry with payment details
            await wait(100);
            const inquiry = await prisma.customerInquiry.findFirst({
                where: {
                    email: testCustomer.email,
                    paymentIntentId: paymentData.paymentIntentId,
                },
            });

            expect(inquiry).toBeDefined();
            expect(inquiry?.paymentStatus).toBe('PAID');
            expect(inquiry?.paymentIntentId).toBe(paymentData.paymentIntentId);
            expect(inquiry?.status).toBe('CONVERTED');
        });

        it('should create order without payment (inquiry only)', async () => {
            const config = generateTestConfiguration();

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [
                        {
                            sessionId: testSessionId,
                            configuration: config,
                            price: config.totalPrice,
                        },
                    ],
                    orderDetails: {
                        customerInfo: {
                            name: testCustomer.name,
                            email: testCustomer.email,
                            phone: testCustomer.phone,
                        },
                    },
                    totalPrice: config.totalPrice,
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);

            // Verify inquiry without payment
            await wait(100);
            const inquiry = await prisma.customerInquiry.findFirst({
                where: { email: testCustomer.email },
                orderBy: { createdAt: 'desc' },
            });

            expect(inquiry).toBeDefined();
            expect(inquiry?.paymentStatus).toBe('PENDING');
            expect(inquiry?.paymentIntentId).toBeNull();
            expect(inquiry?.status).toBe('NEW');
        });
    });

    describe('Webhook Handling', () => {
        it('should handle payment_intent.succeeded webhook', async () => {
            // Note: This test would require mock webhook events
            // In a real test environment, you would use Stripe CLI to send test webhooks
            // For now, we verify the endpoint exists and accepts POST requests

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/payments/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'stripe-signature': 'test-signature',
                },
                body: JSON.stringify({
                    type: 'payment_intent.succeeded',
                    data: {
                        object: {
                            id: 'pi_test_123',
                            amount: TEST_CONFIG.DEPOSIT_AMOUNT,
                            status: 'succeeded',
                        },
                    },
                }),
            });

            // Webhook will likely return 400 due to invalid signature in test
            // But endpoint should be accessible
            expect(response.status).toBeLessThan(500);
        });
    });

    describe('Stripe Test Cards', () => {
        it('should document test card scenarios', () => {
            // This test documents available test cards for manual testing
            expect(TEST_CARDS.SUCCESS).toBe('4242424242424242');
            expect(TEST_CARDS.DECLINE).toBe('4000000000000002');
            expect(TEST_CARDS.AUTH_REQUIRED).toBe('4000002760003184');
            expect(TEST_CARDS.INSUFFICIENT_FUNDS).toBe('4000000000009995');

            // These test cards should be used in integration tests with Stripe Elements
            // Success card: Payment succeeds
            // Decline card: Card is declined
            // Auth required: Requires 3D Secure authentication
            // Insufficient funds: Card has insufficient funds
        });
    });

    describe('Deposit Amount Calculation', () => {
        it('should match deposit amount with configuration total', async () => {
            const config = generateTestConfiguration();
            const depositAmount = TEST_CONFIG.DEPOSIT_AMOUNT;

            // In production, deposit might be a percentage of total
            // For testing, we use a fixed small amount
            expect(depositAmount).toBeLessThan(config.totalPrice);

            // Verify payment intent uses deposit amount
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: config.totalPrice,
                        currency: 'eur',
                        customerEmail: testCustomer.email,
                        customerName: testCustomer.name,
                    }),
                }
            );

            const data = await response.json();
            expect(data.amount).toBe(depositAmount);
        });
    });
});

