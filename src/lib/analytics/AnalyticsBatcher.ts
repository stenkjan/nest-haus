/**
 * Analytics Batching Service
 * 
 * Batches analytics events to reduce database writes from ~55/session to ~8/session
 * Implements queue with configurable batch size and time interval
 */

interface InteractionEvent {
  sessionId: string;
  eventType: string;
  category: string;
  elementId?: string;
  selectionValue?: string;
  previousValue?: string;
  timeSpent?: number;
  deviceInfo?: {
    type: string;
    width: number;
    height: number;
  };
}

interface BatchConfig {
  maxSize: number;      // Max events before auto-flush
  maxWaitMs: number;    // Max time to wait before flush
  endpoint: string;     // API endpoint for batch submission
}

export class AnalyticsBatcher {
  private static instance: AnalyticsBatcher;
  private queue: InteractionEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isFlushing: boolean = false;
  
  private config: BatchConfig = {
    maxSize: 10,          // Flush after 10 events
    maxWaitMs: 5000,      // Flush after 5 seconds
    endpoint: '/api/sessions/track-batch'
  };

  private constructor() {
    // Set up page unload handler to flush remaining events
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushSync();
      });

      // Also handle page hide (mobile/background)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flushSync();
        }
      });
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AnalyticsBatcher {
    if (!AnalyticsBatcher.instance) {
      AnalyticsBatcher.instance = new AnalyticsBatcher();
    }
    return AnalyticsBatcher.instance;
  }

  /**
   * Add event to batch queue
   */
  addEvent(event: InteractionEvent): void {
    this.queue.push(event);
    console.log(`📦 Batched event (queue: ${this.queue.length}/${this.config.maxSize}):`, 
      event.eventType, event.category);

    // Check if we should flush based on batch size
    if (this.queue.length >= this.config.maxSize) {
      this.flush();
    } else if (!this.flushTimer) {
      // Start timer for time-based flush
      this.flushTimer = setTimeout(() => {
        this.flush();
      }, this.config.maxWaitMs);
    }
  }

  /**
   * Flush events to server (async, non-blocking)
   */
  async flush(): Promise<void> {
    if (this.isFlushing || this.queue.length === 0) {
      return;
    }

    // Clear any pending timer
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    // Take events from queue
    const eventsToSend = [...this.queue];
    this.queue = [];
    this.isFlushing = true;

    console.log(`🚀 Flushing ${eventsToSend.length} batched events...`);

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend })
      });

      if (!response.ok) {
        throw new Error(`Batch flush failed: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Batched events sent successfully:`, result);
    } catch (error) {
      console.error('❌ Failed to flush batched events:', error);
      
      // Re-queue failed events (up to a limit to prevent infinite growth)
      if (this.queue.length < 50) {
        this.queue.unshift(...eventsToSend);
      }
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Synchronous flush using sendBeacon (for page unload)
   */
  private flushSync(): void {
    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    console.log(`📡 Sync flush ${eventsToSend.length} events (page unload)`);

    try {
      // Use sendBeacon for reliable delivery on page unload
      const blob = new Blob(
        [JSON.stringify({ events: eventsToSend })],
        { type: 'application/json' }
      );
      
      const sent = navigator.sendBeacon(this.config.endpoint, blob);
      
      if (!sent) {
        console.warn('⚠️ sendBeacon failed, events may be lost');
      }
    } catch (error) {
      console.error('❌ Sync flush failed:', error);
    }
  }

  /**
   * Force immediate flush (useful for testing)
   */
  async forceFlush(): Promise<void> {
    return this.flush();
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Clear queue (for testing)
   */
  clearQueue(): void {
    this.queue = [];
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }
}

// Export singleton instance for easy import
export const analyticsBatcher = AnalyticsBatcher.getInstance();

/**
 * Helper function to track event with batching
 */
export function trackEvent(event: InteractionEvent): void {
  analyticsBatcher.addEvent(event);
}

