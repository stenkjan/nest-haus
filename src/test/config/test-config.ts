/**
 * Test Configuration
 * Central configuration for all tests
 */

export const TEST_CONFIG = {
    // API Base URL
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',

    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // Redis Configuration
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    REDIS_TEST_DB: 1, // Use database 1 for tests
    USE_MOCK_REDIS: process.env.USE_MOCK_REDIS !== 'false', // Mock by default

    // Stripe Test Keys
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,

    // Test Mode Settings
    IS_TEST_MODE: process.env.NODE_ENV === 'test',
    PAYMENT_MODE: 'deposit',
    DEPOSIT_AMOUNT: 100, // 1 EUR in cents for testing

    // Timeouts
    DEFAULT_TIMEOUT: 10000, // 10 seconds
    API_TIMEOUT: 5000, // 5 seconds

    // Test Data
    TEST_EMAIL_DOMAIN: '@test-nest-haus.com',

    // Cleanup
    AUTO_CLEANUP: true, // Automatically clean up test data after tests
    CLEANUP_ORPHANED_EVENTS: process.env.CLEANUP_ORPHANED_EVENTS === 'true', // Optional deep cleanup
};

/**
 * Test environment validation
 */
export function validateTestEnvironment(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!TEST_CONFIG.DATABASE_URL) {
        errors.push('DATABASE_URL not set');
    }

    if (!TEST_CONFIG.STRIPE_SECRET_KEY || !TEST_CONFIG.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
        errors.push('STRIPE_SECRET_KEY not set or not in test mode');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

