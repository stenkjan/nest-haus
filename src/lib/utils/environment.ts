/**
 * Environment Detection Utilities
 * 
 * Helper functions to check availability of external services
 * and environment configuration for graceful degradation
 */

/**
 * Check if PostgreSQL database is configured
 * Required for Prisma operations and session tracking
 */
export const isDatabaseAvailable = (): boolean => {
  return !!process.env.DATABASE_URL;
};

/**
 * Check if Redis/Upstash is configured
 * Required for real-time session caching
 */
export const isRedisAvailable = (): boolean => {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && 
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
};

/**
 * Check if running in production environment
 * Used to determine if service unavailability should be treated as critical
 */
export const isProductionEnvironment = (): boolean => {
  return (
    process.env.NODE_ENV === 'production' || 
    process.env.VERCEL_ENV === 'production'
  );
};

/**
 * Check if tracking services are available
 * Tracking requires both database and Redis
 */
export const isTrackingAvailable = (): boolean => {
  return isDatabaseAvailable() && isRedisAvailable();
};

