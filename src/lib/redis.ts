/**
 * Redis Configuration for User Session Tracking
 * 
 * Handles real-time session data and user interactions
 * Integrates with Upstash Redis free tier (500K commands/month)
 */

import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Type definitions for session tracking
export interface UserSession {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  startTime: number;
  lastActivity: number;
  clickHistory: ClickEvent[];
  currentConfiguration?: any;
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

    // Store session with 24-hour expiration
    await redis.setex(sessionId, 86400, JSON.stringify(session));
    return sessionId;
  }

  /**
   * Update session with new activity
   */
  static async updateSession(sessionId: string, update: Partial<UserSession>): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      const updatedSession = {
        ...session,
        ...update,
        lastActivity: Date.now(),
      };
      await redis.setex(sessionId, 86400, JSON.stringify(updatedSession));
    }
  }

  /**
   * Get session data
   */
  static async getSession(sessionId: string): Promise<UserSession | null> {
    const sessionData = await redis.get(sessionId);
    return sessionData ? JSON.parse(sessionData as string) : null;
  }

  /**
   * Track user interaction
   */
  static async trackClick(sessionId: string, clickEvent: ClickEvent): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      session.clickHistory.push(clickEvent);
      session.lastActivity = Date.now();
      
      // Keep only last 100 clicks to manage memory
      if (session.clickHistory.length > 100) {
        session.clickHistory = session.clickHistory.slice(-100);
      }
      
      await redis.setex(sessionId, 86400, JSON.stringify(session));
      
      // Also store click as separate entry for analytics
      const clickKey = `click:${sessionId}:${Date.now()}`;
      await redis.setex(clickKey, 86400, JSON.stringify(clickEvent));
    }
  }

  /**
   * Finalize session (page exit)
   */
  static async finalizeSession(sessionId: string, finalConfiguration: any): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      // Update session with final state
      session.currentConfiguration = finalConfiguration;
      
      // Store final session data in a separate key for PostgreSQL sync
      const finalSessionKey = `final:${sessionId}`;
      await redis.setex(finalSessionKey, 604800, JSON.stringify(session)); // 7 days

      // Clean up active session
      await redis.del(sessionId);
    }
  }

  /**
   * Get analytics data for admin panel
   */
  static async getSessionAnalytics(timeframe: 'day' | 'week' | 'month' = 'day'): Promise<any> {
    // This will query Redis for session patterns
    // Implementation depends on your specific analytics needs
    const keys = await redis.keys('session:*');
    const sessions = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.get(key);
        return data ? JSON.parse(data as string) : null;
      })
    );

    return {
      totalSessions: sessions.filter(Boolean).length,
      activeSessions: sessions.filter(s => s && Date.now() - s.lastActivity < 300000).length, // Active in last 5 min
      averageSessionDuration: sessions.reduce((acc, s) => s ? acc + (s.lastActivity - s.startTime) : acc, 0) / sessions.length,
    };
  }
}

export default redis; 