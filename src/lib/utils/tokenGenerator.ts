import { randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure random token for email confirmation links
 * Uses 32 bytes (256 bits) of randomness, encoded as hex
 */
export function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Generate a short, time-limited token (for less critical operations)
 * Uses 16 bytes (128 bits) of randomness
 */
export function generateShortToken(): string {
  return randomBytes(16).toString('hex');
}

