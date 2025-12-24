/**
 * Redis Configuration for User Session Tracking
 * 
 * Handles real-time session data and user interactions
 * Integrates with Upstash Redis free tier (500K commands/month)
 * 
 * Gracefully degrades when Redis is not configured (development mode)
 */

import { Redis } from '@upstash/redis';

// Check if Redis credentials are available
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
export const isRedisConfigured = !!(REDIS_URL && REDIS_TOKEN);

// Initialize Redis client only if credentials are available
let redis: Redis | null = null;

if (isRedisConfigured) {
  redis = new Redis({
    url: REDIS_URL!,
    token: REDIS_TOKEN!,
  });

  // Test Redis connection at startup
  redis.ping().catch(error => {
    console.error('Redis connection failed at startup:', error);
  });
} else {
  console.warn('⚠️ Redis not configured - session caching disabled (dev mode)');
}

// Type definitions for configuration
export interface Configuration {
  nest?: string;
  accessories?: string[];
  pricing?: {
    basePrice: number;
    totalPrice: number;
  };
  [key: string]: unknown;
}

// Type definitions for session tracking
export interface UserSession {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  startTime: number;
  lastActivity: number;
  clickHistory: ClickEvent[];
  currentConfiguration?: Configuration;
  referrer?: string;
}

export interface ClickEvent {
  timestamp: number;
  category: string;
  selection: string;
  previousSelection?: string;
  timeSpent: number;
  priceChange?: number;
  totalPrice?: number;
  eventType?: string;
  elementId?: string;
}

// Analytics response type
export interface SessionAnalytics {
  totalSessions: number;
  activeSessions: number;
  averageSessionDuration: number;
}

// Session Management Functions
export class SessionManager {
  /**
   * Create new user session
   */
  static async createSession(sessionData: Partial<UserSession>): Promise<string> {
    const sessionId = `session:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;

    const session: UserSession = {
      sessionId,
      ipAddress: sessionData.ipAddress || 'unknown',
      userAgent: sessionData.userAgent || 'unknown',
      startTime: Date.now(),
      lastActivity: Date.now(),
      clickHistory: [],
      currentConfiguration: sessionData.currentConfiguration,
      referrer: sessionData.referrer,
    };

    // Store session with 24-hour expiration (if Redis is available)
    if (redis) {
      await redis.setex(sessionId, 86400, session);
    }
    return sessionId;
  }

  /**
   * Update session with new activity
   */
  static async updateSession(sessionId: string, update: Partial<UserSession>): Promise<void> {
    if (!redis) return;
    
    const session = await this.getSession(sessionId);
    if (session) {
      const updatedSession = {
        ...session,
        ...update,
        lastActivity: Date.now(),
      };
      await redis.setex(sessionId, 86400, updatedSession);
    }
  }

  /**
   * Get session data
   */
  static async getSession(sessionId: string): Promise<UserSession | null> {
    if (!redis) return null;
    
    const sessionData = await redis.get(sessionId);
    if (!sessionData) return null;

    // Upstash Redis may return data already parsed, check if it's a string or object
    if (typeof sessionData === 'string') {
      return JSON.parse(sessionData);
    } else {
      // Data is already an object
      return sessionData as UserSession;
    }
  }

  /**
   * Track user interaction
   */
  static async trackClick(sessionId: string, clickEvent: ClickEvent): Promise<void> {
    if (!redis) return;
    
    const session = await this.getSession(sessionId);
    if (session) {
      session.clickHistory.push(clickEvent);
      session.lastActivity = Date.now();

      // Keep only last 100 clicks to manage memory
      if (session.clickHistory.length > 100) {
        session.clickHistory = session.clickHistory.slice(-100);
      }

      await redis.setex(sessionId, 86400, session);

      // Also store click as separate entry for analytics
      const clickKey = `click:${sessionId}:${Date.now()}`;
      await redis.setex(clickKey, 86400, clickEvent);
    }
  }

  /**
   * Finalize session (page exit)
   */
  static async finalizeSession(sessionId: string, finalConfiguration: Configuration): Promise<void> {
    if (!redis) return;
    
    const session = await this.getSession(sessionId);
    if (session) {
      // Update session with final state
      session.currentConfiguration = finalConfiguration;

      // Store final session data in a separate key for PostgreSQL sync
      const finalSessionKey = `final:${sessionId}`;
      await redis.setex(finalSessionKey, 604800, session); // 7 days

      // Clean up active session
      await redis.del(sessionId);
    }
  }

  /**
   * Get analytics data for admin panel
   */
  static async getSessionAnalytics(): Promise<SessionAnalytics> {
    if (!redis) {
      return {
        totalSessions: 0,
        activeSessions: 0,
        averageSessionDuration: 0,
      };
    }
    
    // This will query Redis for session patterns
    // Implementation depends on your specific analytics needs
    const keys = await redis.keys('session:*');
    const sessions = await Promise.all(
      keys.map(async (key) => {
        const data = await redis!.get(key);
        if (!data) return null;

        // Handle both string and object responses from Upstash
        if (typeof data === 'string') {
          return JSON.parse(data);
        } else {
          return data as UserSession;
        }
      })
    );

    const validSessions = sessions.filter(Boolean) as UserSession[];

    return {
      totalSessions: validSessions.length,
      activeSessions: validSessions.filter(s => Date.now() - s.lastActivity < 300000).length, // Active in last 5 min
      averageSessionDuration: validSessions.length > 0
        ? validSessions.reduce((acc, s) => acc + (s.lastActivity - s.startTime), 0) / validSessions.length
        : 0,
    };
  }

  // Content session management
  static async setContentSession(sessionId: string, session: unknown): Promise<void> {
    if (!redis) return;
    const contentKey = `content:${sessionId}`;
    await redis.setex(contentKey, 86400, session); // 24 hour expiration
  }

  static async getContentSession(sessionId: string): Promise<unknown> {
    if (!redis) return null;
    const contentKey = `content:${sessionId}`;
    return await redis.get(contentKey);
  }

  static async updateContentSession(sessionId: string, session: unknown): Promise<void> {
    if (!redis) return;
    const contentKey = `content:${sessionId}`;
    await redis.setex(contentKey, 86400, session); // 24 hour expiration
  }

  // Redis helper methods for analytics
  static async get(key: string): Promise<unknown> {
    if (!redis) return null;
    return await redis.get(key);
  }

  static async setex(key: string, expiration: number, value: unknown): Promise<void> {
    if (!redis) return;
    await redis.setex(key, expiration, value);
  }

  static async incr(key: string): Promise<number> {
    if (!redis) return 0;
    return await redis.incr(key);
  }

  static async expire(key: string, seconds: number): Promise<void> {
    if (!redis) return;
    await redis.expire(key, seconds);
  }

  static async hgetall(key: string): Promise<Record<string, string> | null> {
    if (!redis) return null;
    return await redis.hgetall(key);
  }

  static async hmset(key: string, data: Record<string, string | number>): Promise<void> {
    if (!redis) return;
    await redis.hmset(key, data);
  }

  /**
   * ===== REDIS-FIRST ANALYTICS PATTERN =====
   * Hot analytics data stored in Redis before PostgreSQL
   */

  /**
   * Store analytics event in Redis (hot storage)
   * Events are batched and flushed to PostgreSQL every 30 seconds
   */
  static async storeAnalyticsEvent(sessionId: string, event: {
    eventType: string;
    category: string;
    elementId?: string;
    value?: string;
    timestamp?: number;
  }): Promise<void> {
    if (!redis) return;
    
    const key = `analytics:events:${sessionId}`;
    const eventData = {
      ...event,
      timestamp: event.timestamp || Date.now()
    };

    // Add to Redis list (LPUSH for newest first)
    await redis.lpush(key, JSON.stringify(eventData));
    
    // Keep only last 100 events
    await redis.ltrim(key, 0, 99);
    
    // Set 24-hour expiration
    await redis.expire(key, 86400);

    // Add to pending flush queue
    await redis.sadd('analytics:pending:sessions', sessionId);
  }

  /**
   * Get hot analytics events from Redis
   */
  static async getAnalyticsEvents(sessionId: string, limit: number = 100): Promise<unknown[]> {
    if (!redis) return [];
    
    const key = `analytics:events:${sessionId}`;
    const events = await redis.lrange(key, 0, limit - 1);
    
    return events.map(event => {
      if (typeof event === 'string') {
        return JSON.parse(event);
      }
      return event;
    });
  }

  /**
   * Get all sessions with pending analytics events
   */
  static async getPendingAnalyticsSessions(): Promise<string[]> {
    if (!redis) return [];
    
    const sessions = await redis.smembers('analytics:pending:sessions');
    return sessions as string[];
  }

  /**
   * Mark analytics events as flushed to PostgreSQL
   */
  static async clearAnalyticsEvents(sessionId: string): Promise<void> {
    if (!redis) return;
    
    const key = `analytics:events:${sessionId}`;
    await redis.del(key);
    await redis.srem('analytics:pending:sessions', sessionId);
  }

  /**
   * Increment real-time counter (for dashboard)
   */
  static async incrementCounter(metric: string, timeWindow: string = 'hour'): Promise<number> {
    if (!redis) return 0;
    
    const now = new Date();
    let key: string;

    switch (timeWindow) {
      case 'minute':
        key = `counter:${metric}:${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}:${now.getUTCMinutes()}`;
        await redis.expire(key, 3600); // 1 hour
        break;
      case 'hour':
        key = `counter:${metric}:${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}`;
        await redis.expire(key, 86400); // 24 hours
        break;
      case 'day':
        key = `counter:${metric}:${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;
        await redis.expire(key, 604800); // 7 days
        break;
      default:
        key = `counter:${metric}:total`;
    }

    return await redis.incr(key);
  }

  /**
   * Get real-time counter value
   */
  static async getCounter(metric: string, timeWindow: string = 'hour'): Promise<number> {
    if (!redis) return 0;
    
    const now = new Date();
    let key: string;

    switch (timeWindow) {
      case 'minute':
        key = `counter:${metric}:${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}:${now.getUTCMinutes()}`;
        break;
      case 'hour':
        key = `counter:${metric}:${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}`;
        break;
      case 'day':
        key = `counter:${metric}:${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;
        break;
      default:
        key = `counter:${metric}:total`;
    }

    const value = await redis.get(key);
    return typeof value === 'number' ? value : parseInt(String(value || '0'), 10);
  }

  /**
   * Store hot traffic source data
   */
  static async trackTrafficSource(source: string): Promise<void> {
    if (!redis) return;
    
    const today = new Date().toISOString().split('T')[0];
    const key = `traffic:${today}`;
    
    await redis.hincrby(key, source, 1);
    await redis.expire(key, 604800); // 7 days
  }

  /**
   * Get traffic source stats for today
   */
  static async getTodayTrafficSources(): Promise<Record<string, number>> {
    if (!redis) return {};
    
    const today = new Date().toISOString().split('T')[0];
    const key = `traffic:${today}`;
    
    const data = await redis.hgetall(key);
    if (!data) return {};

    // Convert string values to numbers
    const result: Record<string, number> = {};
    for (const [source, count] of Object.entries(data)) {
      result[source] = parseInt(String(count), 10);
    }
    return result;
  }
}

// Export redis instance (may be null in development without credentials)
export default redis; 