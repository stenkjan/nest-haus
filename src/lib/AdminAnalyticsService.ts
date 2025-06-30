/**
 * Admin Analytics Service - Safe Integration Layer
 * 
 * ISOLATION GUARANTEE: This service only calls the new analytics API and never touches
 * any existing configurator, session management, or Redis functionality.
 * 
 * This ensures complete safety when integrating real analytics data.
 */

/**
 * Analytics data interface - matches API response
 */
export interface AdminAnalyticsData {
  activeSessions: number;
  totalSessions: number;
  totalSessionsToday: number;
  averageSessionDuration: number;
  conversionRate: number;
  completedConfigurations: number;
  abandonedSessions: number;
  sessionsLast24h: number;
  sessionsLast7d: number;
  averageInteractionsPerSession: number;
  averageApiResponseTime: number;
  systemHealth: 'excellent' | 'good' | 'needs_attention';
  lastUpdated: string;
  dataRange: {
    from: string;
    to: string;
  };
}

/**
 * API response wrapper
 */
interface AnalyticsApiResponse {
  success: boolean;
  data: AdminAnalyticsData;
  performance: {
    processingTime: number;
    efficiency: string;
  };
  metadata: {
    timestamp: string;
    version: string;
    dataSource: string;
  };
  error?: string;
  details?: string;
}

/**
 * Safe fallback data for when API fails
 */
const SAFE_FALLBACK_DATA: AdminAnalyticsData = {
  activeSessions: 0,
  totalSessions: 0,
  totalSessionsToday: 0,
  averageSessionDuration: 0,
  conversionRate: 0,
  completedConfigurations: 0,
  abandonedSessions: 0,
  sessionsLast24h: 0,
  sessionsLast7d: 0,
  averageInteractionsPerSession: 0,
  averageApiResponseTime: 0,
  systemHealth: 'needs_attention',
  lastUpdated: new Date().toISOString(),
  dataRange: {
    from: new Date().toISOString(),
    to: new Date().toISOString()
  }
};

/**
 * Admin Analytics Service
 * 
 * This service provides a safe interface between the admin dashboard
 * and the new analytics API. It includes comprehensive error handling
 * and fallback mechanisms.
 */
export class AdminAnalyticsService {
  private static readonly API_ENDPOINT = '/api/admin/analytics';
  private static readonly REQUEST_TIMEOUT = 10000; // 10 seconds
  
  /**
   * Get the correct API URL for both client and server environments
   */
  private static getApiUrl(): string {
    // If we're on the server side (no window object), we need to construct the full URL
    if (typeof window === 'undefined') {
      // For server-side rendering, use the local host
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NODE_ENV === 'production'
        ? 'https://nest-haus.vercel.app' // Replace with your actual production domain
        : 'http://localhost:3000';
      
      return `${baseUrl}${this.API_ENDPOINT}`;
    }
    
    // Client side can use relative URLs
    return this.API_ENDPOINT;
  }
  
  /**
   * Fetch analytics data with comprehensive error handling
   */
  static async getAnalytics(): Promise<AdminAnalyticsData> {
    const startTime = Date.now();
    
    try {
      console.log('🔍 Fetching admin analytics data...');
      
      // Create abort controller for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);
      
      // Get the correct URL for the environment
      const apiUrl = this.getApiUrl();
      console.log(`🌐 Fetching from: ${apiUrl}`);
      
      // Make API request with timeout
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Analytics API returned ${response.status}: ${response.statusText}`);
      }
      
      const apiResponse: AnalyticsApiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error(`Analytics API error: ${apiResponse.error || 'Unknown error'}`);
      }
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ Analytics data fetched successfully in ${processingTime}ms`);
      
      // Validate data structure
      const data = apiResponse.data;
      if (!this.validateAnalyticsData(data)) {
        console.warn('⚠️ Analytics data validation failed, using fallback');
        return SAFE_FALLBACK_DATA;
      }
      
      return data;
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      // Log error but don't throw - always return safe data
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`❌ Analytics request timeout after ${this.REQUEST_TIMEOUT}ms`);
        } else {
          console.error(`❌ Analytics service error (${processingTime}ms):`, error.message);
        }
      } else {
        console.error(`❌ Unknown analytics error (${processingTime}ms):`, error);
      }
      
      // Always return safe fallback data - never break the admin dashboard
      return SAFE_FALLBACK_DATA;
    }
  }
  
  /**
   * Validate analytics data structure
   */
  private static validateAnalyticsData(data: unknown): data is AdminAnalyticsData {
    try {
      return (
        typeof data === 'object' &&
        data !== null &&
        typeof (data as AdminAnalyticsData).activeSessions === 'number' &&
        typeof (data as AdminAnalyticsData).totalSessions === 'number' &&
        typeof (data as AdminAnalyticsData).averageSessionDuration === 'number' &&
        typeof (data as AdminAnalyticsData).conversionRate === 'number' &&
        typeof (data as AdminAnalyticsData).systemHealth === 'string' &&
        ['excellent', 'good', 'needs_attention'].includes((data as AdminAnalyticsData).systemHealth) &&
        typeof (data as AdminAnalyticsData).lastUpdated === 'string'
      );
    } catch {
      return false;
    }
  }
  
  /**
   * Get formatted session analytics for dashboard display
   */
  static async getSessionAnalytics(): Promise<{
    activeSessions: number;
    totalSessions: number;
    averageSessionDuration: number;
  }> {
    const data = await this.getAnalytics();
    
    return {
      activeSessions: data.activeSessions,
      totalSessions: data.totalSessions,
      averageSessionDuration: data.averageSessionDuration
    };
  }
  
  /**
   * Check if analytics service is healthy
   */
  static async checkHealth(): Promise<{
    healthy: boolean;
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check
      
      const apiUrl = this.getApiUrl();
      const response = await fetch(apiUrl, {
        method: 'HEAD', // Use HEAD for health check
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      return {
        healthy: response.ok,
        responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        healthy: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Format duration in human readable format
   */
  static formatDuration(milliseconds: number): string {
    if (milliseconds === 0) return '0m';
    
    const minutes = Math.round(milliseconds / 1000 / 60);
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  
  /**
   * Format percentage with proper rounding
   */
  static formatPercentage(value: number): string {
    return `${Math.round(value * 100) / 100}%`;
  }
  
  /**
   * Get system health status with emoji
   */
  static formatSystemHealth(health: string): string {
    switch (health) {
      case 'excellent': return '🟢 Excellent';
      case 'good': return '🟡 Good';
      case 'needs_attention': return '🔴 Needs Attention';
      default: return '⚫ Unknown';
    }
  }
} 