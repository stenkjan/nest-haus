/**
 * InteractionTracker - User behavior and analytics tracking
 * 
 * Tracks user interactions, selection patterns, and session data
 * for analytics and product improvement insights.
 */

import type { ConfigurationItem, SelectionContext, FullConfiguration } from '../types/configurator.types';

interface InteractionEvent {
  type: 'selection' | 'view_change' | 'error' | 'session_start' | 'session_end' | 'configuration_complete';
  timestamp: number;
  data: Record<string, unknown>;
  sessionId?: string;
}

interface SessionData {
  sessionId: string;
  startTime: number;
  endTime?: number;
  userAgent: string;
  interactions: InteractionEvent[];
  finalConfiguration?: FullConfiguration;
}

export class InteractionTracker {
  private currentSession: SessionData | null = null;
  private isEnabled: boolean;
  private eventQueue: InteractionEvent[] = [];

  constructor() {
    this.isEnabled = process.env.NODE_ENV !== 'test';
    this.initializeSession();
  }

  /**
   * Initialize a new tracking session
   */
  private initializeSession(): void {
    if (!this.isEnabled) return;

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentSession = {
      sessionId,
      startTime: Date.now(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      interactions: []
    };

    this.trackEvent({
      type: 'session_start',
      timestamp: Date.now(),
      data: {
        sessionId,
        userAgent: this.currentSession.userAgent,
        viewport: typeof window !== 'undefined' ? {
          width: window.innerWidth,
          height: window.innerHeight
        } : null
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Interaction tracking started:', sessionId);
    }
  }

  /**
   * Track a user selection
   */
  trackSelection(selection: ConfigurationItem, context?: SelectionContext): void {
    if (!this.isEnabled || !this.currentSession) return;

    this.trackEvent({
      type: 'selection',
      timestamp: Date.now(),
      data: {
        category: selection.category,
        value: selection.value,
        name: selection.name,
        price: selection.price,
        quantity: selection.quantity,
        squareMeters: selection.squareMeters,
        sessionId: context?.sessionId,
        userAgent: context?.userAgent
      },
      sessionId: this.currentSession.sessionId
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Selection tracked:', {
        category: selection.category,
        name: selection.name
      });
    }
  }

  /**
   * Track view changes (exterior, interior, pv, etc.)
   */
  trackViewChange(fromView: string, toView: string): void {
    if (!this.isEnabled || !this.currentSession) return;

    this.trackEvent({
      type: 'view_change',
      timestamp: Date.now(),
      data: {
        fromView,
        toView,
        sessionDuration: Date.now() - this.currentSession.startTime
      },
      sessionId: this.currentSession.sessionId
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('👁️ View change tracked:', `${fromView} → ${toView}`);
    }
  }

  /**
   * Track errors
   */
  trackError(error: Error, selection?: ConfigurationItem): void {
    if (!this.isEnabled || !this.currentSession) return;

    this.trackEvent({
      type: 'error',
      timestamp: Date.now(),
      data: {
        errorMessage: error.message,
        errorStack: error.stack,
        selection: selection ? {
          category: selection.category,
          value: selection.value,
          name: selection.name
        } : null,
        sessionDuration: Date.now() - this.currentSession.startTime
      },
      sessionId: this.currentSession.sessionId
    });

    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error tracked:', {
        error: error.message,
        selection: selection?.name
      });
    }
  }

  /**
   * Track configuration completion
   */
  trackConfigurationComplete(configuration: FullConfiguration, userDetails?: Record<string, unknown>): void {
    if (!this.isEnabled || !this.currentSession) return;

    this.currentSession.finalConfiguration = configuration;

    this.trackEvent({
      type: 'configuration_complete',
      timestamp: Date.now(),
      data: {
        configurationId: configuration.sessionId,
        totalPrice: configuration.totalPrice,
        selectionCount: configuration.selections.length,
        sessionDuration: Date.now() - this.currentSession.startTime,
        userDetails: userDetails || null,
        categories: configuration.selections.map(s => s.category)
      },
      sessionId: this.currentSession.sessionId
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('🎉 Configuration completion tracked:', {
        totalPrice: configuration.totalPrice,
        selections: configuration.selections.length
      });
    }
  }

  /**
   * Track a generic event
   */
  private trackEvent(event: InteractionEvent): void {
    if (!this.isEnabled || !this.currentSession) return;

    // Add to current session
    this.currentSession.interactions.push(event);

    // Add to event queue for batch sending
    this.eventQueue.push(event);

    // Send events in batches to avoid overwhelming the analytics service
    if (this.eventQueue.length >= 10) {
      this.flushEvents();
    }
  }

  /**
   * Get current session data
   */
  getCurrentSession(): SessionData | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  /**
   * Get session analytics summary
   */
  getSessionSummary(): Record<string, unknown> | null {
    if (!this.currentSession) return null;

    const interactions = this.currentSession.interactions;
    const selectionEvents = interactions.filter(e => e.type === 'selection');
    const errorEvents = interactions.filter(e => e.type === 'error');
    const viewChangeEvents = interactions.filter(e => e.type === 'view_change');

    const sessionDuration = Date.now() - this.currentSession.startTime;

    return {
      sessionId: this.currentSession.sessionId,
      duration: sessionDuration,
      totalInteractions: interactions.length,
      selections: selectionEvents.length,
      errors: errorEvents.length,
      viewChanges: viewChangeEvents.length,
      completedConfiguration: !!this.currentSession.finalConfiguration,
      averageTimePerSelection: selectionEvents.length > 0 
        ? sessionDuration / selectionEvents.length 
        : 0,
      mostUsedCategories: this.getMostUsedCategories(selectionEvents),
      errorRate: interactions.length > 0 ? errorEvents.length / interactions.length : 0
    };
  }

  /**
   * Get most used categories from selection events
   */
  private getMostUsedCategories(selectionEvents: InteractionEvent[]): Record<string, number> {
    const categories: Record<string, number> = {};
    
    selectionEvents.forEach(event => {
      const category = event.data.category as string;
      if (category) {
        categories[category] = (categories[category] || 0) + 1;
      }
    });

    return categories;
  }

  /**
   * Flush events to analytics service
   */
  private flushEvents(): void {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    // In a real application, send to analytics service
    this.sendToAnalytics(eventsToSend);
  }

  /**
   * Send events to analytics service
   */
  private sendToAnalytics(events: InteractionEvent[]): void {
    // This would be implemented to send data to your analytics service
    // For now, we'll just log in development
    if (process.env.NODE_ENV === 'development' && events.length > 0) {
      console.debug('📈 Analytics events would be sent:', {
        eventCount: events.length,
        types: events.map(e => e.type),
        sessionId: this.currentSession?.sessionId
      });
    }

    // Optional: Send to actual analytics service
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
      // Example implementation for sending to analytics
      // fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events })
      // }).catch(() => {
      //   // Silent fail - analytics shouldn't break user experience
      // });
    }
  }

  /**
   * End the current session
   */
  endSession(): void {
    if (!this.isEnabled || !this.currentSession) return;

    this.currentSession.endTime = Date.now();

    this.trackEvent({
      type: 'session_end',
      timestamp: Date.now(),
      data: {
        sessionDuration: this.currentSession.endTime - this.currentSession.startTime,
        totalInteractions: this.currentSession.interactions.length,
        completedConfiguration: !!this.currentSession.finalConfiguration
      },
      sessionId: this.currentSession.sessionId
    });

    // Flush any remaining events
    this.flushEvents();

    if (process.env.NODE_ENV === 'development') {
      const summary = this.getSessionSummary();
      console.log('📊 Session ended:', summary);
    }

    this.currentSession = null;
  }

  /**
   * Enable or disable tracking
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    
    if (enabled && !this.currentSession) {
      this.initializeSession();
    } else if (!enabled && this.currentSession) {
      this.endSession();
    }
  }

  /**
   * Check if tracking is enabled
   */
  isTrackingEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Manual flush for cleanup
   */
  flush(): void {
    this.flushEvents();
  }
} 