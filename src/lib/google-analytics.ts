/**
 * Google Analytics Data API Client
 * 
 * Server-side utility for fetching GA4 data
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Initialize the Google Analytics Data API client
// This is called lazily to avoid crashes at module load time
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

export function getAnalyticsClient(): BetaAnalyticsDataClient {
  // Return cached client if already initialized
  if (analyticsDataClient) {
    return analyticsDataClient;
  }

  try {
    // Check if running in Vercel with base64 credentials
    if (process.env.GOOGLE_ANALYTICS_CREDENTIALS_BASE64) {
      try {
        const credentialsJson = Buffer.from(
          process.env.GOOGLE_ANALYTICS_CREDENTIALS_BASE64,
          'base64'
        ).toString('utf-8');

        const credentials = JSON.parse(credentialsJson);

        analyticsDataClient = new BetaAnalyticsDataClient({
          credentials,
        });

        return analyticsDataClient;
      } catch (error) {
        throw new Error(
          `Failed to parse GOOGLE_ANALYTICS_CREDENTIALS_BASE64: ${error instanceof Error ? error.message : 'Invalid base64 or JSON format'
          }`
        );
      }
    }

    // Check if credentials file path is provided
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      analyticsDataClient = new BetaAnalyticsDataClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });

      return analyticsDataClient;
    }

    // No credentials configured - throw clear error
    throw new Error(
      'Google Analytics credentials not configured. Please set either ' +
      'GOOGLE_ANALYTICS_CREDENTIALS_BASE64 or GOOGLE_APPLICATION_CREDENTIALS environment variable.'
    );
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to initialize Google Analytics client');
  }
}

/**
 * Get GA4 Property ID from environment
 */
export function getPropertyId(): string {
  const propertyId = process.env.GA4_PROPERTY_ID;

  if (!propertyId) {
    throw new Error('GA4_PROPERTY_ID environment variable is not set');
  }

  return `properties/${propertyId}`;
}

/**
 * Check if Google Analytics is configured
 */
export function isGAConfigured(): boolean {
  return !!(
    process.env.GA4_PROPERTY_ID &&
    (process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.GOOGLE_ANALYTICS_CREDENTIALS_BASE64)
  );
}

/**
 * Get overview metrics (users, sessions, pageviews, etc.)
 */
export async function getOverviewMetrics(dateRange: '7d' | '30d' | '90d' = '30d') {
  const client = getAnalyticsClient();

  const [response] = await client.runReport({
    property: getPropertyId(),
    dateRanges: [
      {
        startDate: dateRange === '7d' ? '7daysAgo' : dateRange === '30d' ? '30daysAgo' : '90daysAgo',
        endDate: 'today',
      },
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'sessionsPerUser' },
    ],
  });

  const row = response.rows?.[0];
  if (!row) {
    // Return zeros instead of null for consistent empty data handling
    return {
      activeUsers: 0,
      sessions: 0,
      pageViews: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      sessionsPerUser: 0,
    };
  }

  return {
    activeUsers: parseInt(row.metricValues?.[0]?.value || '0'),
    sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
    avgSessionDuration: parseFloat(row.metricValues?.[3]?.value || '0'),
    bounceRate: parseFloat(row.metricValues?.[4]?.value || '0'),
    sessionsPerUser: parseFloat(row.metricValues?.[5]?.value || '0'),
  };
}

/**
 * Get geographic data (countries and cities)
 */
export async function getGeographicData(dateRange: '7d' | '30d' | '90d' = '30d') {
  const client = getAnalyticsClient();

  // Get country data
  const [countryResponse] = await client.runReport({
    property: getPropertyId(),
    dateRanges: [
      {
        startDate: dateRange === '7d' ? '7daysAgo' : dateRange === '30d' ? '30daysAgo' : '90daysAgo',
        endDate: 'today',
      },
    ],
    dimensions: [
      { name: 'country' },
      { name: 'countryId' }, // ISO country code
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
    ],
    orderBys: [
      {
        metric: {
          metricName: 'sessions',
        },
        desc: true,
      },
    ],
    limit: 50,
  });

  // Get city data
  const [cityResponse] = await client.runReport({
    property: getPropertyId(),
    dateRanges: [
      {
        startDate: dateRange === '7d' ? '7daysAgo' : dateRange === '30d' ? '30daysAgo' : '90daysAgo',
        endDate: 'today',
      },
    ],
    dimensions: [
      { name: 'city' },
      { name: 'country' },
      { name: 'countryId' },
    ],
    metrics: [
      { name: 'sessions' },
    ],
    orderBys: [
      {
        metric: {
          metricName: 'sessions',
        },
        desc: true,
      },
    ],
    limit: 20,
  });

  const countries = countryResponse.rows?.map((row) => ({
    country: row.dimensionValues?.[0]?.value || 'Unknown',
    countryCode: row.dimensionValues?.[1]?.value || '',
    users: parseInt(row.metricValues?.[0]?.value || '0'),
    sessions: parseInt(row.metricValues?.[1]?.value || '0'),
  })) || [];

  const cities = cityResponse.rows?.map((row) => ({
    city: row.dimensionValues?.[0]?.value || 'Unknown',
    country: row.dimensionValues?.[1]?.value || 'Unknown',
    countryCode: row.dimensionValues?.[2]?.value || '',
    sessions: parseInt(row.metricValues?.[0]?.value || '0'),
  })) || [];

  return {
    countries,
    cities,
    totalCountries: countries.length,
    totalCities: cities.length,
  };
}

/**
 * Get real-time active users
 */
export async function getRealtimeUsers() {
  const client = getAnalyticsClient();

  const [response] = await client.runRealtimeReport({
    property: getPropertyId(),
    metrics: [
      { name: 'activeUsers' },
    ],
  });

  const row = response.rows?.[0];
  return parseInt(row?.metricValues?.[0]?.value || '0');
}

/**
 * Get traffic sources
 */
export async function getTrafficSources(dateRange: '7d' | '30d' | '90d' = '30d') {
  const client = getAnalyticsClient();

  const [response] = await client.runReport({
    property: getPropertyId(),
    dateRanges: [
      {
        startDate: dateRange === '7d' ? '7daysAgo' : dateRange === '30d' ? '30daysAgo' : '90daysAgo',
        endDate: 'today',
      },
    ],
    dimensions: [
      { name: 'sessionSource' },
      { name: 'sessionMedium' },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
    ],
    orderBys: [
      {
        metric: {
          metricName: 'sessions',
        },
        desc: true,
      },
    ],
    limit: 20,
  });

  return response.rows?.map((row) => ({
    source: row.dimensionValues?.[0]?.value || 'Unknown',
    medium: row.dimensionValues?.[1]?.value || 'Unknown',
    sessions: parseInt(row.metricValues?.[0]?.value || '0'),
    users: parseInt(row.metricValues?.[1]?.value || '0'),
  })) || [];
}

/**
 * Get top pages
 */
export async function getTopPages(dateRange: '7d' | '30d' | '90d' = '30d') {
  const client = getAnalyticsClient();

  const [response] = await client.runReport({
    property: getPropertyId(),
    dateRanges: [
      {
        startDate: dateRange === '7d' ? '7daysAgo' : dateRange === '30d' ? '30daysAgo' : '90daysAgo',
        endDate: 'today',
      },
    ],
    dimensions: [
      { name: 'pagePathPlusQueryString' },
      { name: 'pageTitle' },
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' },
      { name: 'averageSessionDuration' },
    ],
    orderBys: [
      {
        metric: {
          metricName: 'screenPageViews',
        },
        desc: true,
      },
    ],
    limit: 20,
  });

  return response.rows?.map((row) => ({
    path: row.dimensionValues?.[0]?.value || '/',
    title: row.dimensionValues?.[1]?.value || 'Untitled',
    views: parseInt(row.metricValues?.[0]?.value || '0'),
    users: parseInt(row.metricValues?.[1]?.value || '0'),
    avgDuration: parseFloat(row.metricValues?.[2]?.value || '0'),
  })) || [];
}

