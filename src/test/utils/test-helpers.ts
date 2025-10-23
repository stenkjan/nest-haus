/**
 * Test Helper Utilities
 * Common functions for testing across the application
 */

import { prisma } from '@/lib/prisma';

/**
 * Mock Redis client for testing
 * Provides in-memory Redis-like functionality without actual Redis connection
 */
export function mockRedis() {
    const store = new Map<string, any>();
    const ttlStore = new Map<string, number>();

    return {
        get: async (key: string) => {
            const value = store.get(key);
            return value || null;
        },
        set: async (key: string, value: any) => {
            store.set(key, value);
            return 'OK';
        },
        setex: async (key: string, ttl: number, value: any) => {
            store.set(key, value);
            ttlStore.set(key, ttl);
            return 'OK';
        },
        ttl: async (key: string) => {
            return ttlStore.get(key) || -1;
        },
        del: async (key: string) => {
            const existed = store.has(key);
            store.delete(key);
            ttlStore.delete(key);
            return existed ? 1 : 0;
        },
        exists: async (key: string) => {
            return store.has(key) ? 1 : 0;
        },
        keys: async (pattern: string) => {
            // Simple pattern matching for testing
            const regex = new RegExp(pattern.replace('*', '.*'));
            return Array.from(store.keys()).filter(key => regex.test(key));
        },
        expire: async (key: string, seconds: number) => {
            if (store.has(key)) {
                ttlStore.set(key, seconds);
                return 1;
            }
            return 0;
        },
        // Clear all test data
        flushall: async () => {
            store.clear();
            ttlStore.clear();
            return 'OK';
        },
    };
}

/**
 * Generate a unique test session ID
 */
export function generateTestSessionId(): string {
    return `test_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate test customer data
 */
export function generateTestCustomer() {
    const timestamp = Date.now();
    return {
        name: `Test User ${timestamp}`,
        email: `test.user${timestamp}@test-nest-haus.com`,
        phone: '+43 664 1234567',
        message: 'Test inquiry message',
    };
}

/**
 * Generate test configuration data
 */
export function generateTestConfiguration() {
    return {
        nest: { name: 'NEST 100', value: 'nest100' },
        gebaeudehuelle: { name: 'Holzlattung Lärche', value: 'holzlattung' },
        innenverkleidung: { name: 'Kiefer', value: 'kiefer' },
        fussboden: { name: 'Parkett Eiche', value: 'parkett' },
        totalPrice: 15000000, // 150,000 EUR in cents
    };
}

/**
 * Clean up test data from database
 */
export async function cleanupTestData(sessionId: string) {
    try {
        // Clean specific test session and all test sessions
        await prisma.userSession.deleteMany({
            where: {
                OR: [
                    { sessionId: sessionId },
                    { sessionId: { startsWith: 'test_' } },
                    { sessionId: { startsWith: 'config_' } }, // Also clean config_ sessions from tests
                ],
            },
        });

        // Clean up test inquiries
        await prisma.customerInquiry.deleteMany({
            where: {
                email: {
                    contains: '@test-nest-haus.com',
                },
            },
        });

        // Optional: Clean orphaned selection events (only if explicitly enabled)
        if (process.env.CLEANUP_ORPHANED_EVENTS === 'true') {
            // This would clean all selection events without a valid session
            // Use with caution in production database
            const orphanedEvents = await prisma.selectionEvent.findMany({
                where: {
                    session: null,
                },
                select: { id: true },
            });

            if (orphanedEvents.length > 0) {
                console.log(`🧹 Cleaning ${orphanedEvents.length} orphaned selection events`);
                await prisma.selectionEvent.deleteMany({
                    where: {
                        id: {
                            in: orphanedEvents.map(e => e.id),
                        },
                    },
                });
            }
        }

        console.log('✅ Test data cleaned up successfully');
    } catch (error) {
        console.error('⚠️ Error cleaning up test data:', error);
    }
}

/**
 * Wait for a specified amount of time
 */
export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a test session in the database
 */
export async function createTestSession(sessionId?: string) {
    const testSessionId = sessionId || generateTestSessionId();

    const session = await prisma.userSession.create({
        data: {
            sessionId: testSessionId,
            ipAddress: '127.0.0.1',
            userAgent: 'Test Agent',
            referrer: 'http://localhost:3000',
            status: 'ACTIVE',
        },
    });

    return session;
}

/**
 * Stripe test card numbers
 */
export const TEST_CARDS = {
    SUCCESS: '4242424242424242',
    DECLINE: '4000000000000002',
    AUTH_REQUIRED: '4000002760003184',
    INSUFFICIENT_FUNDS: '4000000000009995',
    EXPIRED: '4000000000000069',
    PROCESSING_ERROR: '4000000000000119',
};

/**
 * Test email addresses
 */
export const TEST_EMAILS = {
    VALID: [
        'test@example.com',
        'user+tag@domain.co.uk',
        'firstname.lastname@company.com',
        'user_name@sub.domain.com',
        'test123@test-domain.com',
    ],
    INVALID: [
        '@example.com',
        'user@',
        'user space@domain.com',
        'user@@domain.com',
        'user@domain',
    ],
};

/**
 * Test phone numbers
 */
export const TEST_PHONES = {
    AUSTRIAN: [
        '+43 664 1234567',
        '0664 1234567',
        '+43-664-1234567',
        '0043 664 1234567',
    ],
    INTERNATIONAL: [
        '+1 555 123 4567',
        '+49 30 12345678',
        '+44 20 7123 4567',
        '(123) 456-7890',
    ],
    INVALID: [
        'abc',
        '123',
        '+',
        'phone number',
    ],
};

/**
 * Test addresses
 */
export const TEST_ADDRESSES = {
    VALID: [
        'Karmeliterplatz 8',
        '123 Main Street',
        'Bahnhofstraße 45',
        'Rue de la Paix 12',
        '5th Avenue, Suite 100',
    ],
    INVALID: [
        'ab', // too short
        '!!', // only punctuation
    ],
};

/**
 * Test names
 */
export const TEST_NAMES = {
    VALID: [
        'Hans Müller',
        "O'Brien",
        'Jean-Claude',
        'María José',
        'van der Berg',
    ],
    INVALID: [
        'X', // too short
        '123', // numbers only
        '@user', // special chars
    ],
};

