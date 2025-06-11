/**
 * User Tracking & Analytics Types
 * 
 * TypeScript definitions for user behavior tracking system.
 * Supports Redis session tracking and PostgreSQL analytics.
 */

import type { SelectionCategory, Configuration } from './configurator.types';

// ===== SESSION TYPES =====

export interface UserSession {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  startTime: number;
  lastActivity: number;
  clickHistory: ClickEvent[];
  currentConfiguration?: Configuration;
  referrer?: string;
  utmSource?: string;
}

export type SessionStatus = 'active' | 'abandoned' | 'completed' | 'expired';

// ===== INTERACTION TRACKING =====

export interface ClickEvent {
  timestamp: number;
  category: SelectionCategory;
  selection: string;
  previousSelection?: string;
  timeSpent: number; // milliseconds on this selection
  scrollPosition?: number;
  viewportSize?: {
    width: number;
    height: number;
  };
}

export interface SelectionEvent extends ClickEvent {
  priceChange: number;
  totalPrice: number;
  isFirstSelection: boolean;
}

export interface PageEvent {
  type: 'page_enter' | 'page_exit' | 'tab_hidden' | 'tab_visible';
  timestamp: number;
  url: string;
  sessionDuration?: number;
}

// ===== ANALYTICS TYPES =====

export interface SelectionAnalytics {
  id: string;
  date: string;
  selectionType: SelectionCategory;
  selectionValue: string;
  clickCount: number;
  uniqueUsers: number;
  averageTimeSpent: number;
  conversionRate: number;
}

export interface SessionAnalytics {
  totalSessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  popularSelections: {
    category: SelectionCategory;
    value: string;
    percentage: number;
  }[];
  abandonmentPoints: {
    step: string;
    percentage: number;
  }[];
}

export interface FunnelAnalytics {
  step: string;
  users: number;
  dropoffRate: number;
  averageTimeSpent: number;
}

// ===== REDIS TYPES =====

export interface RedisSessionData {
  sessionId: string;
  data: UserSession;
  expiresAt: number;
}

export interface RedisClickBatch {
  sessionId: string;
  events: ClickEvent[];
  batchTimestamp: number;
}

// ===== DATABASE TYPES =====

export interface SessionRecord {
  session_id: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
  last_activity: Date;
  configuration_data: Configuration; // JSONB
  status: SessionStatus;
  total_price?: number;
  referrer?: string;
  utm_source?: string;
}

export interface SelectionEventRecord {
  id: string;
  session_id: string;
  timestamp: Date;
  category: SelectionCategory;
  selection: string;
  previous_selection?: string;
  time_spent_ms: number;
  price_change: number;
  total_price: number;
}

// ===== API TYPES =====

export interface TrackingApiRequest {
  sessionId: string;
  events: ClickEvent[];
  configuration?: Configuration;
}

export interface TrackingApiResponse {
  success: boolean;
  sessionId: string;
  eventsProcessed: number;
  error?: string;
}

export interface AnalyticsQuery {
  startDate: string;
  endDate: string;
  metrics: ('clicks' | 'sessions' | 'conversions' | 'funnel')[];
  filters?: {
    category?: SelectionCategory;
    selection?: string;
    source?: string;
  };
} 