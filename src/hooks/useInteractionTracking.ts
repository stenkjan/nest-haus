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
    if (!sessionId) return;

    const trackPromise = (async () => {
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
          console.warn('Failed to track interaction:', response.statusText);
        }
      } catch (error) {
        console.error('Interaction tracking error:', error);
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

      const elementId = 
        interactiveElement.id ||
        interactiveElement.getAttribute('data-track-id') ||
        interactiveElement.getAttribute('aria-label') ||
        (interactiveElement as HTMLElement).innerText?.slice(0, 50) ||
        'unknown-element';

      const category = 
        interactiveElement.getAttribute('data-track-category') ||
        (interactiveElement.tagName === 'A' ? 'link' : 'button');

      const selectionValue = 
        interactiveElement.getAttribute('data-track-value') ||
        (interactiveElement as HTMLElement).innerText?.slice(0, 100);

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

  return {
    trackClick,
    trackPageVisit,
    trackFormInteraction,
    trackConfiguratorSelection,
    waitForPendingTracks,
  };
}

