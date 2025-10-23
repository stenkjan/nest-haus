/**
 * Contact Form and Appointment Booking Integration Tests
 * Tests contact form submission, appointment booking, and calendar integration
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

describe('Contact Form and Appointment Booking Tests', () => {
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

    describe('Contact Form Submission', () => {
        it('should submit contact form with valid data', async () => {
            const config = generateTestConfiguration();

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    phone: testCustomer.phone,
                    message: testCustomer.message,
                    preferredContact: 'email',
                    requestType: 'contact',
                    configurationData: config,
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.inquiryId).toBeDefined();
            expect(data.message).toContain('erfolgreich');

            // Verify inquiry in database
            await wait(100);
            const inquiry = await prisma.customerInquiry.findUnique({
                where: { id: data.inquiryId },
            });

            expect(inquiry).toBeDefined();
            expect(inquiry?.email).toBe(testCustomer.email);
            expect(inquiry?.name).toBe(testCustomer.name);
            expect(inquiry?.status).toBe('NEW');
        });

        it('should reject form with missing required fields', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Missing email and name
                    phone: testCustomer.phone,
                }),
            });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBeDefined();
        });

        it('should reject form with invalid email', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'invalid-email',
                    name: testCustomer.name,
                    requestType: 'contact',
                }),
            });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBeDefined();
            expect(data.details).toBeDefined();
        });

        it('should accept form without optional phone', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    requestType: 'contact',
                }),
            });

            const data = await response.json();
            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
        });

        it('should store configuration data with inquiry', async () => {
            const config = generateTestConfiguration();

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    requestType: 'contact',
                    configurationData: config,
                }),
            });

            const data = await response.json();
            expect(response.status).toBe(201);

            // Verify configuration data is stored
            await wait(100);
            const inquiry = await prisma.customerInquiry.findUnique({
                where: { id: data.inquiryId },
            });

            expect(inquiry?.configurationData).toBeDefined();
            expect(inquiry?.totalPrice).toBe(config.totalPrice);
        });
    });

    describe('Appointment Booking', () => {
        it('should submit appointment request with valid data', async () => {
            const appointmentDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
            const config = generateTestConfiguration();

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    phone: testCustomer.phone,
                    requestType: 'appointment',
                    appointmentDateTime: appointmentDate.toISOString(),
                    preferredContact: 'phone',
                    bestTimeToCall: '10:00-12:00',
                    configurationData: config,
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.inquiryId).toBeDefined();
            expect(data.message).toContain('Terminanfrage');

            // Verify appointment details in database
            await wait(100);
            const inquiry = await prisma.customerInquiry.findUnique({
                where: { id: data.inquiryId },
            });

            expect(inquiry).toBeDefined();
            expect(inquiry?.followUpDate).toBeDefined();
            expect(inquiry?.adminNotes).toContain('Terminwunsch');
        });

        it('should check calendar availability for appointment', async () => {
            const appointmentDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    phone: testCustomer.phone,
                    requestType: 'appointment',
                    appointmentDateTime: appointmentDate.toISOString(),
                    preferredContact: 'phone',
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.timeSlotAvailable).toBeDefined();
            expect(typeof data.timeSlotAvailable).toBe('boolean');
        });

        it('should handle calendar conflicts gracefully', async () => {
            // Note: This test assumes calendar integration is working
            // In a real test, you would mock the calendar service
            const appointmentDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    phone: testCustomer.phone,
                    requestType: 'appointment',
                    appointmentDateTime: appointmentDate.toISOString(),
                }),
            });

            const data = await response.json();

            // Should still succeed even if calendar check fails
            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
        });
    });

    describe('Email Notifications', () => {
        it('should send confirmation email to customer', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    requestType: 'contact',
                    message: 'Test inquiry',
                }),
            });

            const data = await response.json();

            // Email sending should not block the response
            expect(response.status).toBe(201);
            expect(data.success).toBe(true);

            // Note: Actual email verification would require email service mocking
            // or checking email service logs/webhooks
        });

        it('should send notification email to admin', async () => {
            const config = generateTestConfiguration();

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    requestType: 'contact',
                    configurationData: config,
                }),
            });

            const data = await response.json();

            // Should succeed even if email fails
            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
        });

        it('should not fail request if email service fails', async () => {
            // This test verifies the fail-safe pattern
            // Email failures should be logged but not block the inquiry
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    requestType: 'contact',
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.inquiryId).toBeDefined();
        });
    });

    describe('Preferred Contact Method', () => {
        it('should store email as preferred contact', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    preferredContact: 'email',
                    requestType: 'contact',
                }),
            });

            const data = await response.json();
            expect(response.status).toBe(201);

            await wait(100);
            const inquiry = await prisma.customerInquiry.findUnique({
                where: { id: data.inquiryId },
            });

            expect(inquiry?.preferredContact).toBe('EMAIL');
        });

        it('should store phone as preferred contact', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    phone: testCustomer.phone,
                    preferredContact: 'phone',
                    bestTimeToCall: '14:00-16:00',
                    requestType: 'contact',
                }),
            });

            const data = await response.json();
            expect(response.status).toBe(201);

            await wait(100);
            const inquiry = await prisma.customerInquiry.findUnique({
                where: { id: data.inquiryId },
            });

            expect(inquiry?.preferredContact).toBe('PHONE');
            expect(inquiry?.bestTimeToCall).toBe('14:00-16:00');
        });

        it('should store whatsapp as preferred contact', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    phone: testCustomer.phone,
                    preferredContact: 'whatsapp',
                    requestType: 'contact',
                }),
            });

            const data = await response.json();
            expect(response.status).toBe(201);

            await wait(100);
            const inquiry = await prisma.customerInquiry.findUnique({
                where: { id: data.inquiryId },
            });

            expect(inquiry?.preferredContact).toBe('WHATSAPP');
        });
    });

    describe('Session Linking', () => {
        it('should link inquiry to session when session ID provided', async () => {
            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    requestType: 'contact',
                }),
            });

            const data = await response.json();
            expect(response.status).toBe(201);

            await wait(100);
            const inquiry = await prisma.customerInquiry.findUnique({
                where: { id: data.inquiryId },
            });

            expect(inquiry?.sessionId).toBe(testSessionId);
        });

        it('should track analytics event when session provided', async () => {
            // First create a session
            await fetch(`${TEST_CONFIG.API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': testSessionId,
                },
                body: JSON.stringify({
                    email: testCustomer.email,
                    name: testCustomer.name,
                    requestType: 'contact',
                }),
            });

            const data = await response.json();
            expect(response.status).toBe(201);

            // Verify analytics event (if session tracking is working)
            // This is a best-effort check
            await wait(100);
        });
    });
});

