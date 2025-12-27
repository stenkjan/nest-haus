/**
 * Client-side Interaction Tracking Hook
 * 
 * Tracks user interactions including:
 * - Page visits (navigation)
 * - Button/link clicks
 * - Form interactions
 * - Configurator selections
 * 
 * Mimics alpha test tracking for consistency
 */

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Elements to ignore from tracking (non-valuable interactions)
const IGNORED_ELEMENT_IDS = [
  'unknown-element',
];

// Classes that indicate elements should be ignored
const IGNORED_CLASSES = [
  'simple-nav',
  'back-button',
  'next-button',
];

// Generic text patterns to ignore
const IGNORED_TEXT_PATTERNS = [
  /^(back|next|close|×|✕)$/i,
  /^(weiter|zurück|schließen)$/i, // German equivalents
];

/**
 * Check if an element should be ignored from tracking
 */
function shouldIgnoreElement(element: Element, elementId: string, elementText?: string): boolean {
  // Ignore if in blacklist
  if (IGNORED_ELEMENT_IDS.includes(elementId)) {
    return true;
  }

  // Ignore if has blacklisted class
  for (const className of IGNORED_CLASSES) {
    if (element.classList.contains(className)) {
      return true;
    }
  }

  // Ignore if text matches generic patterns
  if (elementText) {
    const trimmedText = elementText.trim();
    for (const pattern of IGNORED_TEXT_PATTERNS) {
      if (pattern.test(trimmedText)) {
        return true;
      }
    }
  }

  // Ignore if text is too short (likely not meaningful)
  if (elementText && elementText.trim().length < 2) {
    return true;
  }

  return false;
}

interface DeviceInfo {
  type: string;
  width: number;
  height: number;
}

interface InteractionData {
  eventType: 'page_visit' | 'click' | 'form_interaction' | 'configurator_selection';
  category: string;
  elementId?: string;
  selectionValue?: string;
  previousValue?: string;
  timeSpent?: number;
  deviceInfo?: DeviceInfo;
}

interface UseInteractionTrackingOptions {
  sessionId: string;
  enableClickTracking?: boolean;
  enablePageTracking?: boolean;
  debounceMs?: number;
}

/**
 * Hook to track user interactions
 */
export function useInteractionTracking({
  sessionId,
  enableClickTracking = true,
  enablePageTracking = true,
  debounceMs = 300,
}: UseInteractionTrackingOptions) {
  const pathname = usePathname();
  const lastPathRef = useRef<string>('');
  const pageStartTimeRef = useRef<number>(Date.now());
  const pendingTracksRef = useRef<Set<Promise<void>>>(new Set());

  /**
   * Get device information
   */
  const getDeviceInfo = useCallback((): DeviceInfo => {
    return {
      type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  /**
   * Track interaction with the API
   */
  const trackInteraction = useCallback(async (interaction: InteractionData) => {
    if (!sessionId) {
      console.warn('🔴 Interaction tracking skipped - no session ID');
      return;
    }

    console.log('📊 Tracking interaction:', {
      sessionId: sessionId.substring(0, 20) + '...',
      eventType: interaction.eventType,
      category: interaction.category,
      elementId: interaction.elementId,
      selectionValue: interaction.selectionValue?.substring(0, 30)
    });

    const trackPromise = (async () => {
      const maxRetries = 2;
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch('/api/sessions/track-interaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              interaction: {
                ...interaction,
                deviceInfo: interaction.deviceInfo || getDeviceInfo(),
              },
            }),
          });

          if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.warn(`❌ Failed to track interaction (attempt ${attempt + 1}/${maxRetries + 1}):`, 
              response.status, response.statusText, errorText);
            
            // Don't retry on client errors (4xx), only on server errors (5xx) or network issues
            if (response.status >= 400 && response.status < 500) {
              break;
            }
            
            if (attempt === maxRetries) {
              console.error('❌ Interaction tracking failed after all retries');
            }
          } else {
            // Check if response indicates dev mode (services unavailable)
            const data = await response.json().catch(() => ({}));
            if (data.devMode) {
              // Silent success in dev mode - tracking is disabled gracefully
              return;
            }
            console.log('✅ Interaction tracked successfully');
            return; // Success, exit retry loop
          }
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown fetch error');
          console.error(`❌ Interaction tracking error (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
          
          // Add delay before retry (exponential backoff)
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          }
        }
      }

      // Log final error if all retries failed
      if (lastError) {
        console.error('❌ Interaction tracking failed permanently:', lastError.message);
      }
    })();

    pendingTracksRef.current.add(trackPromise);
    trackPromise.finally(() => pendingTracksRef.current.delete(trackPromise));
  }, [sessionId, getDeviceInfo]);

  /**
   * Track page visit
   */
  const trackPageVisit = useCallback((path: string, timeSpent?: number) => {
    trackInteraction({
      eventType: 'page_visit',
      category: 'navigation',
      selectionValue: path,
      timeSpent,
    });
  }, [trackInteraction]);

  /**
   * Track click event
   */
  const trackClick = useCallback((
    elementId: string,
    category: string = 'button',
    selectionValue?: string
  ) => {
    trackInteraction({
      eventType: 'click',
      category,
      elementId,
      selectionValue: selectionValue || elementId,
    });
  }, [trackInteraction]);

  /**
   * Track form interaction
   */
  const trackFormInteraction = useCallback((
    formId: string,
    fieldName: string,
    action: 'focus' | 'blur' | 'submit'
  ) => {
    trackInteraction({
      eventType: 'form_interaction',
      category: 'form',
      elementId: formId,
      selectionValue: `${fieldName}:${action}`,
    });
  }, [trackInteraction]);

  /**
   * Track configurator selection
   */
  const trackConfiguratorSelection = useCallback((
    category: string,
    newValue: string,
    previousValue?: string
  ) => {
    trackInteraction({
      eventType: 'configurator_selection',
      category,
      selectionValue: newValue,
      previousValue,
    });
  }, [trackInteraction]);

  /**
   * Auto-track page visits
   */
  useEffect(() => {
    if (!enablePageTracking || !sessionId) return;

    const currentPath = pathname;

    // Track when leaving previous page
    if (lastPathRef.current && lastPathRef.current !== currentPath) {
      const timeSpent = Date.now() - pageStartTimeRef.current;
      trackPageVisit(lastPathRef.current, timeSpent);
    }

    // Track new page visit
    if (currentPath !== lastPathRef.current) {
      trackPageVisit(currentPath);
      lastPathRef.current = currentPath;
      pageStartTimeRef.current = Date.now();
    }

    // Track on unmount (page leave)
    return () => {
      const timeSpent = Date.now() - pageStartTimeRef.current;
      trackPageVisit(currentPath, timeSpent);
    };
  }, [pathname, sessionId, enablePageTracking, trackPageVisit]);

  /**
   * Auto-track clicks on buttons and links
   */
  useEffect(() => {
    if (!enableClickTracking || !sessionId) return;

    let debounceTimer: NodeJS.Timeout | null = null;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Find the closest interactive element
      const interactiveElement = target.closest('button, a, [role="button"], [data-track-click]');

      if (!interactiveElement) return;

      // Extract element text for filtering
      const elementText = (interactiveElement as HTMLElement).innerText?.trim() || '';

      // Try to get a meaningful element ID
      let elementId = 
        interactiveElement.id ||
        interactiveElement.getAttribute('data-track-id') ||
        interactiveElement.getAttribute('aria-label');

      // If no explicit ID, check parent elements for context
      if (!elementId) {
        const parent = interactiveElement.parentElement;
        if (parent) {
          elementId = parent.id || parent.getAttribute('data-track-id');
        }
      }

      // If still no ID, use meaningful text (if available)
      if (!elementId && elementText.length >= 3) {
        elementId = elementText.slice(0, 50);
      }

      // Last resort: unknown-element
      if (!elementId) {
        elementId = 'unknown-element';
      }

      // Check if element should be ignored
      if (shouldIgnoreElement(interactiveElement, elementId, elementText)) {
        return; // Don't track this element
      }

      const category =
        interactiveElement.getAttribute('data-track-category') ||
        (interactiveElement.tagName === 'A' ? 'link' : 'button');

      const selectionValue =
        interactiveElement.getAttribute('data-track-value') ||
        elementText.slice(0, 100);

      // Debounce to avoid duplicate tracking
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        trackClick(elementId, category, selectionValue);
      }, debounceMs);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [sessionId, enableClickTracking, debounceMs, trackClick]);

  /**
   * Wait for all pending tracks to complete (useful for testing)
   */
  const waitForPendingTracks = useCallback(async () => {
    await Promise.allSettled(Array.from(pendingTracksRef.current));
  }, []);

  /**
   * Finalize session when user leaves the site
   * Sets endTime in database to calculate session duration
   */
  useEffect(() => {
    if (!sessionId) return;

    const finalizeSession = async () => {
      try {
        console.log('📊 Finalizing session:', sessionId.substring(0, 20) + '...');
        
        // Wait for any pending tracks to complete first
        await Promise.allSettled(Array.from(pendingTracksRef.current));
        
        // Call finalize API to set endTime
        await fetch('/api/sessions/finalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            config: null, // No config data needed, just finalizing the session
          }),
          keepalive: true, // Ensure request completes even if page is closing
        });
        
        console.log('✅ Session finalized');
      } catch (error) {
        console.error('❌ Failed to finalize session:', error);
      }
    };

    // Finalize on page unload
    const handleBeforeUnload = () => {
      // Use sendBeacon with Blob to set correct Content-Type for JSON
      const data = JSON.stringify({ sessionId, config: null });
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon('/api/sessions/finalize', blob);
    };

    // Use both methods for maximum reliability
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    // Cleanup - finalize immediately, don't wait for async
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      
      // Finalize synchronously on component unmount (navigation)
      // Fire-and-forget pattern since we can't await in cleanup
      void finalizeSession();
    };
  }, [sessionId]);

  return {
    trackClick,
    trackPageVisit,
    trackFormInteraction,
    trackConfiguratorSelection,
    waitForPendingTracks,
  };
}

