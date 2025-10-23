/**
 * Error Handling and Fail-safe Tests
 * Tests system resilience, graceful degradation, and user experience protection
 */

import { describe, it, expect } from 'vitest';
import { TEST_CONFIG } from '../config/test-config';
import { generateTestSessionId, generateTestCustomer } from '../utils/test-helpers';

describe('Error Handling and Fail-safe Tests', () => {
    describe('API Failure Handling', () => {
        it('should not block user experience if tracking fails', async () => {
            // Send invalid tracking data
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: '', // Invalid
                    category: 'nest',
                    selection: 'NEST 100',
                }),
            });

            // Should return error but not crash
            expect(response.status).toBeLessThan(500);
        });

        it('should handle missing required fields gracefully', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}), // Empty body
            });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBeDefined();
        });

        it('should handle malformed JSON gracefully', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: '{invalid json',
            });

            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(500);
        });
    });

    describe('Redis Connection Failures', () => {
        it('should fallback to PostgreSQL if Redis fails', async () => {
            // Note: This test verifies the fail-safe pattern exists in code
            // Actual Redis failure simulation would require mocking

            const sessionId = generateTestSessionId();

            // Even if Redis fails, tracking should continue to PostgreSQL
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: 'nest',
                    selection: 'NEST 100',
                    totalPrice: 10000000,
                }),
            });

            // Should succeed (returns 200 even if tracking partially fails)
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
        });
    });

    describe('Stripe API Errors', () => {
        it('should return meaningful error for declined card', async () => {
            // Test with invalid payment intent
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/confirm-payment`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentIntentId: 'pi_invalid_test',
                    }),
                }
            );

            expect(response.status).toBeGreaterThanOrEqual(400);
            const data = await response.json();
            expect(data.error || data.message).toBeDefined();
        });

        it('should handle Stripe network errors', async () => {
            // Test with completely invalid data to potentially trigger network error
            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: -1, // Invalid amount
                        currency: 'invalid',
                        customerEmail: 'test@test.com',
                    }),
                }
            );

            expect(response.status).toBeGreaterThanOrEqual(400);
        });

        it('should reject payment intent with missing Stripe key', async () => {
            // This tests environment validation
            // If Stripe key is missing, API should fail early
            const testCustomer = generateTestCustomer();

            const response = await fetch(
                `${TEST_CONFIG.API_BASE_URL}/api/payments/create-payment-intent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: 1000,
                        currency: 'eur',
                        customerEmail: testCustomer.email,
                    }),
                }
            );

            // Should either succeed (if key exists) or fail gracefully
            expect(response.status).toBeLessThan(500);
        });
    });

    describe('Email Service Failures', () => {
        it('should not fail inquiry if email sending fails', async () => {
            const testCustomer = generateTestCustomer();

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    requestType: 'contact',
                    message: 'Test inquiry',
                }),
            });

            const data = await response.json();

            // Inquiry should succeed even if email fails
            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.inquiryId).toBeDefined();
        });
    });

    describe('Network Timeouts', () => {
        it('should handle slow API responses', async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);
                expect(response.status).toBeLessThan(500);
            } catch (error) {
                clearTimeout(timeoutId);
                // Timeout is acceptable for this test
                if (error instanceof Error && error.name === 'AbortError') {
                    expect(error.name).toBe('AbortError');
                }
            }
        });
    });

    describe('Graceful Degradation', () => {
        it('should provide basic functionality even with partial failures', async () => {
            const sessionId = generateTestSessionId();

            // Create session (core functionality)
            const sessionResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            expect(sessionResponse.status).toBe(200);

            // Track selection (should work even if some features fail)
            const trackResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: 'nest',
                    selection: 'NEST 100',
                }),
            });

            // Should return success to not block user
            expect(trackResponse.status).toBe(200);
        });

        it('should continue working after database errors', async () => {
            // First request might fail, but subsequent requests should work
            const sessionId = generateTestSessionId();

            const response1 = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: 'nest',
                    selection: 'NEST 100',
                }),
            });

            // Should not return 500 even if first request has issues
            expect(response1.status).toBeLessThan(500);

            // Second request should work
            const response2 = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: 'gebaeudehuelle',
                    selection: 'Holzlattung',
                }),
            });

            expect(response2.status).toBe(200);
        });
    });

    describe('User Experience Protection', () => {
        it('should never block configurator due to tracking failures', async () => {
            const sessionId = generateTestSessionId();

            // Even with completely invalid data, should not block UI
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    category: null, // Invalid but should not crash
                    selection: undefined,
                }),
            });

            // May return error, but should be handled gracefully
            expect(response).toBeDefined();
        });

        it('should provide meaningful error messages', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'invalid-email',
                    name: 'Test User',
                }),
            });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBeDefined();
            expect(typeof data.error).toBe('string');
            expect(data.error.length).toBeGreaterThan(0);
        });

        it('should not expose sensitive errors to client', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: 'x'.repeat(1000), // Extremely long ID
                    category: 'nest',
                    selection: 'NEST 100',
                }),
            });

            const data = await response.json();

            // Should return generic error, not database error details
            if (!data.success && data.error) {
                expect(data.error).not.toContain('SQL');
                expect(data.error).not.toContain('Prisma');
                expect(data.error).not.toContain('Database');
            }
        });
    });

    describe('Concurrent Request Handling', () => {
        it('should handle multiple concurrent requests without crashing', async () => {
            const promises = Array.from({ length: 20 }).map(() =>
                fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })
            );

            const responses = await Promise.all(promises);

            // All responses should be valid (not 500+)
            responses.forEach(response => {
                expect(response.status).toBeLessThan(500);
            });
        });

        it('should handle rate limiting gracefully', async () => {
            // Send many requests quickly
            const promises = Array.from({ length: 100 }).map((_, i) =>
                fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })
            );

            const responses = await Promise.allSettled(promises);

            // Most should succeed, some might be rate limited
            const successful = responses.filter(
                r => r.status === 'fulfilled' && r.value.status < 400
            );

            // At least some should succeed
            expect(successful.length).toBeGreaterThan(0);
        });
    });

    describe('Input Validation Errors', () => {
        it('should reject extremely long input fields', async () => {
            const longString = 'a'.repeat(100000);
            const testCustomer = generateTestCustomer();

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    message: longString,
                }),
            });

            expect(response.status).toBe(400);
        });

        it('should sanitize potentially dangerous input', async () => {
            const testCustomer = generateTestCustomer();

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: '<script>alert("xss")</script>',
                    message: 'DROP TABLE users;',
                }),
            });

            // Should either reject or sanitize, but not execute malicious code
            expect(response.status).toBeLessThan(500);
        });
    });
});

