/**
 * IP Geolocation Service
 * 
 * Provides geographic location data from IP addresses
 * Uses ipapi.co free tier (1000 requests/day) with Redis caching
 * Privacy-focused: Only stores hashed IPs
 */

import crypto from 'crypto';
import redis from '@/lib/redis';

export interface LocationData {
  country: string;      // ISO country code (e.g., "DE", "AT")
  city: string;         // City name
  latitude: number;     // Geographic coordinates
  longitude: number;
  countryName: string;  // Full country name
}

export interface TrafficSource {
  source: string;       // 'direct', 'google', 'referral', 'utm'
  medium?: string;      // For UTM tracking
  domain?: string;      // Referral domain
}

/**
 * Hash IP address for privacy (GDPR compliance)
 */
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

/**
 * Get location data from IP address
 * Uses Redis cache with 30-day TTL
 */
export async function getLocationFromIP(ip: string): Promise<LocationData | null> {
  if (!ip || ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
    return null;
  }

  const ipHash = hashIP(ip);
  const cacheKey = `geo:ip:${ipHash}`;

  try {
    // Check Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`🗺️  Geolocation cache hit for IP hash: ${ipHash}`);
      if (typeof cached === 'string') {
        return JSON.parse(cached) as LocationData;
      }
      return cached as LocationData;
    }

    // Call geolocation API (ipapi.co free tier: 1000 req/day)
    console.log(`🌍 Fetching geolocation for IP hash: ${ipHash}`);
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'nest-haus-analytics/1.0'
      }
    });

    if (!response.ok) {
      console.warn(`⚠️  Geolocation API returned ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Check for API errors or rate limiting
    if (data.error) {
      console.warn(`⚠️  Geolocation API error: ${data.reason || data.error}`);
      return null;
    }

    const locationData: LocationData = {
      country: data.country_code || 'XX',
      city: data.city || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      countryName: data.country_name || 'Unknown'
    };

    // Cache in Redis for 30 days
    await redis.setex(cacheKey, 30 * 24 * 60 * 60, JSON.stringify(locationData));
    console.log(`✅ Cached geolocation for ${locationData.city}, ${locationData.country}`);

    return locationData;
  } catch (error) {
    console.error('❌ Geolocation lookup failed:', error);
    return null;
  }
}

/**
 * Parse referrer URL to determine traffic source
 */
export function parseReferrer(referrer: string | null): TrafficSource {
  if (!referrer) {
    return { source: 'direct' };
  }

  try {
    const url = new URL(referrer);
    const domain = url.hostname.replace('www.', '');

    // Check for search engines
    if (domain.includes('google')) {
      return {
        source: 'google',
        medium: 'organic',
        domain: 'google.com'
      };
    }

    if (domain.includes('bing')) {
      return {
        source: 'bing',
        medium: 'organic',
        domain: 'bing.com'
      };
    }

    if (domain.includes('yahoo')) {
      return {
        source: 'yahoo',
        medium: 'organic',
        domain: 'yahoo.com'
      };
    }

    if (domain.includes('duckduckgo')) {
      return {
        source: 'duckduckgo',
        medium: 'organic',
        domain: 'duckduckgo.com'
      };
    }

    // Check for social media
    if (domain.includes('facebook') || domain.includes('fb.com')) {
      return {
        source: 'facebook',
        medium: 'social',
        domain: 'facebook.com'
      };
    }

    if (domain.includes('instagram')) {
      return {
        source: 'instagram',
        medium: 'social',
        domain: 'instagram.com'
      };
    }

    if (domain.includes('linkedin')) {
      return {
        source: 'linkedin',
        medium: 'social',
        domain: 'linkedin.com'
      };
    }

    if (domain.includes('twitter') || domain.includes('t.co')) {
      return {
        source: 'twitter',
        medium: 'social',
        domain: 'twitter.com'
      };
    }

    // Default: referral from other site
    return {
      source: 'referral',
      medium: 'referral',
      domain
    };
  } catch {
    // Invalid URL, treat as direct
    return { source: 'direct' };
  }
}

/**
 * Parse UTM parameters from URL
 */
export function parseUTMParams(searchParams: URLSearchParams): TrafficSource | null {
  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');

  if (utmSource) {
    return {
      source: 'utm',
      medium: utmMedium || utmCampaign || 'utm',
      domain: utmSource
    };
  }

  return null;
}

/**
 * Get complete traffic source information
 * Prioritizes UTM params, then referrer
 */
export function getTrafficSource(
  searchParams: URLSearchParams,
  referrer: string | null
): TrafficSource {
  // Check UTM parameters first (highest priority)
  const utmSource = parseUTMParams(searchParams);
  if (utmSource) {
    return utmSource;
  }

  // Fall back to referrer analysis
  return parseReferrer(referrer);
}

/**
 * Extract IP address from request headers
 * Handles various proxy headers
 */
export function getClientIP(headers: Headers): string {
  // Check common proxy headers in order of reliability
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first (client)
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIP = headers.get('x-real-ip');
  if (xRealIP) {
    return xRealIP;
  }

  const cfConnectingIP = headers.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return 'unknown';
}

