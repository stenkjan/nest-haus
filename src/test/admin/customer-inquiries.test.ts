/**
 * Customer Inquiries Admin Service Tests
 * Tests inquiry management, data retrieval, and statistics
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Customer Inquiries Service', () => {
    let testEmail: string;
    let testInquiryIds: string[] = [];

    beforeEach(() => {
        testEmail = `test.inquiry${Date.now()}@test-nest-haus.com`;
        testInquiryIds = [];
    });

    afterEach(async () => {
        // Cleanup test inquiries
        if (testInquiryIds.length > 0) {
            await prisma.customerInquiry.deleteMany({
                where: {
                    id: {
                        in: testInquiryIds
                    }
                }
            });
        }
    });

    describe('Database Queries', () => {
        it('should fetch inquiries with pagination', async () => {
            const page = 1;
            const limit = 10;

            const inquiries = await prisma.customerInquiry.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                skip: (page - 1) * limit,
                take: limit
            });

            expect(Array.isArray(inquiries)).toBe(true);
            expect(inquiries.length).toBeLessThanOrEqual(limit);
        });

        it('should count total inquiries', async () => {
            const count = await prisma.customerInquiry.count();

            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);
        });

        it('should filter by status', async () => {
            const newInquiries = await prisma.customerInquiry.findMany({
                where: {
                    status: 'NEW'
                },
                take: 10
            });

            expect(Array.isArray(newInquiries)).toBe(true);

            // All returned inquiries should have NEW status
            newInquiries.forEach(inquiry => {
                expect(inquiry.status).toBe('NEW');
            });
        });

        it('should fetch inquiries with payment information', async () => {
            const paidInquiries = await prisma.customerInquiry.findMany({
                where: {
                    paymentStatus: 'PAID'
                },
                select: {
                    id: true,
                    email: true,
                    paymentStatus: true,
                    paymentAmount: true,
                    paymentIntentId: true,
                    paidAt: true
                },
                take: 10
            });

            expect(Array.isArray(paidInquiries)).toBe(true);

            // Verify payment fields exist for paid inquiries
            paidInquiries.forEach(inquiry => {
                expect(inquiry.paymentStatus).toBe('PAID');
            });
        });
    });

    describe('Inquiry Creation', () => {
        it('should create inquiry with all required fields', async () => {
            const inquiry = await prisma.customerInquiry.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    status: 'NEW',
                    preferredContact: 'EMAIL',
                }
            });

            testInquiryIds.push(inquiry.id);

            expect(inquiry.id).toBeDefined();
            expect(inquiry.email).toBe(testEmail);
            expect(inquiry.name).toBe('Test User');
            expect(inquiry.status).toBe('NEW');
            expect(inquiry.createdAt).toBeInstanceOf(Date);
        });

        it('should create inquiry with payment information', async () => {
            const inquiry = await prisma.customerInquiry.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    status: 'CONVERTED',
                    preferredContact: 'EMAIL',
                    paymentStatus: 'PAID',
                    paymentIntentId: 'pi_test_123',
                    paymentAmount: 350000,
                    totalPrice: 15000000,
                    paidAt: new Date(),
                }
            });

            testInquiryIds.push(inquiry.id);

            expect(inquiry.paymentStatus).toBe('PAID');
            expect(inquiry.paymentAmount).toBe(350000);
            expect(inquiry.paymentIntentId).toBe('pi_test_123');
            expect(inquiry.paidAt).toBeInstanceOf(Date);
        });

        it('should create inquiry with configuration data', async () => {
            const configData = {
                nest: 'NEST 100',
                gebaeudehuelle: 'Holzlattung',
                totalPrice: 15000000,
            };

            const inquiry = await prisma.customerInquiry.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    status: 'NEW',
                    preferredContact: 'EMAIL',
                    configurationData: configData,
                    totalPrice: 15000000,
                }
            });

            testInquiryIds.push(inquiry.id);

            expect(inquiry.configurationData).toBeDefined();
            expect(inquiry.totalPrice).toBe(15000000);
        });
    });

    describe('Status Management', () => {
        it('should handle all inquiry status types', async () => {
            const statuses: Array<'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'QUOTED' | 'CONVERTED' | 'CLOSED'> = [
                'NEW',
                'CONTACTED',
                'IN_PROGRESS',
                'QUOTED',
                'CONVERTED',
                'CLOSED',
            ];

            for (const status of statuses) {
                const inquiry = await prisma.customerInquiry.create({
                    data: {
                        email: `test.${status.toLowerCase()}${Date.now()}@test-nest-haus.com`,
                        name: `Test ${status}`,
                        status,
                        preferredContact: 'EMAIL',
                    }
                });

                testInquiryIds.push(inquiry.id);
                expect(inquiry.status).toBe(status);
            }
        });

        it('should update inquiry status', async () => {
            const inquiry = await prisma.customerInquiry.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    status: 'NEW',
                    preferredContact: 'EMAIL',
                }
            });

            testInquiryIds.push(inquiry.id);

            // Update status
            const updated = await prisma.customerInquiry.update({
                where: { id: inquiry.id },
                data: { status: 'CONTACTED' }
            });

            expect(updated.status).toBe('CONTACTED');
        });
    });

    describe('Payment Status Tracking', () => {
        it('should track payment status lifecycle', async () => {
            // Create with pending payment
            const inquiry = await prisma.customerInquiry.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    status: 'NEW',
                    preferredContact: 'EMAIL',
                    paymentStatus: 'PENDING',
                    paymentIntentId: 'pi_test_pending',
                    paymentAmount: 350000,
                }
            });

            testInquiryIds.push(inquiry.id);
            expect(inquiry.paymentStatus).toBe('PENDING');

            // Update to paid
            const paid = await prisma.customerInquiry.update({
                where: { id: inquiry.id },
                data: {
                    paymentStatus: 'PAID',
                    paidAt: new Date(),
                    status: 'CONVERTED'
                }
            });

            expect(paid.paymentStatus).toBe('PAID');
            expect(paid.status).toBe('CONVERTED');
            expect(paid.paidAt).toBeInstanceOf(Date);
        });

        it('should handle failed payments', async () => {
            const inquiry = await prisma.customerInquiry.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    status: 'NEW',
                    preferredContact: 'EMAIL',
                    paymentStatus: 'FAILED',
                    paymentIntentId: 'pi_test_failed',
                }
            });

            testInquiryIds.push(inquiry.id);
            expect(inquiry.paymentStatus).toBe('FAILED');
        });
    });

    describe('Contact Methods', () => {
        it('should support all contact methods', async () => {
            const methods: Array<'EMAIL' | 'PHONE' | 'WHATSAPP'> = ['EMAIL', 'PHONE', 'WHATSAPP'];

            for (const method of methods) {
                const inquiry = await prisma.customerInquiry.create({
                    data: {
                        email: `test.${method.toLowerCase()}${Date.now()}@test-nest-haus.com`,
                        name: `Test ${method}`,
                        status: 'NEW',
                        preferredContact: method,
                        phone: method !== 'EMAIL' ? '+43 123 456789' : undefined,
                    }
                });

                testInquiryIds.push(inquiry.id);
                expect(inquiry.preferredContact).toBe(method);
            }
        });
    });

    describe('Session Linking', () => {
        it('should link inquiry to session', async () => {
            const sessionId = `test_session_${Date.now()}`;

            const inquiry = await prisma.customerInquiry.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    status: 'NEW',
                    preferredContact: 'EMAIL',
                    sessionId: sessionId,
                }
            });

            testInquiryIds.push(inquiry.id);
            expect(inquiry.sessionId).toBe(sessionId);
        });

        it('should find inquiry by sessionId', async () => {
            const sessionId = `test_session_${Date.now()}`;

            const created = await prisma.customerInquiry.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    status: 'NEW',
                    preferredContact: 'EMAIL',
                    sessionId: sessionId,
                }
            });

            testInquiryIds.push(created.id);

            // Find by sessionId
            const found = await prisma.customerInquiry.findFirst({
                where: { sessionId: sessionId }
            });

            expect(found).toBeDefined();
            expect(found?.id).toBe(created.id);
        });
    });

    describe('Pagination Logic', () => {
        it('should calculate pagination correctly', () => {
            const totalCount = 47;
            const limit = 10;

            const totalPages = Math.ceil(totalCount / limit);
            expect(totalPages).toBe(5);

            // Test page calculations
            const page1Skip = (1 - 1) * limit;
            const page2Skip = (2 - 1) * limit;
            const page5Skip = (5 - 1) * limit;

            expect(page1Skip).toBe(0);
            expect(page2Skip).toBe(10);
            expect(page5Skip).toBe(40);

            // Has next/prev logic
            const page1HasNext = 1 < totalPages;
            const page1HasPrev = 1 > 1;
            const page5HasNext = 5 < totalPages;
            const page5HasPrev = 5 > 1;

            expect(page1HasNext).toBe(true);
            expect(page1HasPrev).toBe(false);
            expect(page5HasNext).toBe(false);
            expect(page5HasPrev).toBe(true);
        });
    });

    describe('Data Integrity', () => {
        it('should enforce required fields', async () => {
            // Should fail without required fields
            await expect(async () => {
                await prisma.customerInquiry.create({
                    data: {
                        // Missing email and name
                        status: 'NEW',
                        preferredContact: 'EMAIL',
                    } as { email: string; name: string; status: string; preferredContact: string; }
                });
            }).rejects.toThrow();
        });

        it('should store timestamps correctly', async () => {
            const beforeCreate = new Date();

            const inquiry = await prisma.customerInquiry.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    status: 'NEW',
                    preferredContact: 'EMAIL',
                }
            });

            testInquiryIds.push(inquiry.id);

            const afterCreate = new Date();

            expect(inquiry.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
            expect(inquiry.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
        });
    });
});
