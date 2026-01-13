/**
 * Enhanced Analytics Tracking Utilities
 * 
 * Provides advanced tracking capabilities for conversion optimization:
 * - CTA click tracking
 * - Form interaction tracking
 * - Scroll depth tracking
 * - Time on page tracking
 * - Form abandonment detection
 */

import { trackClick, trackCustomEvent } from '../ga4-tracking';

/**
 * Track CTA button clicks with context
 */
export function trackCTAClick(data: {
  buttonText: string;
  buttonId?: string;
  location: string; // Page or section where button appears
  destination: string;
  variant?: string; // For A/B testing
}) {
  trackClick({
    elementId: data.buttonId || `cta-${data.location}`,
    elementText: data.buttonText,
    elementType: 'cta_button',
    destination: data.destination,
  });

  // Also track as custom event for CTA-specific analysis
  trackCustomEvent('cta_click', {
    button_text: data.buttonText,
    button_location: data.location,
    destination: data.destination,
    variant: data.variant || 'default',
  });
}

/**
 * Track form field interactions
 */
export function trackFormFieldInteraction(data: {
  formId: string;
  fieldName: string;
  fieldType: string;
  action: 'focus' | 'blur' | 'change';
}) {
  trackCustomEvent('form_interaction', {
    form_id: data.formId,
    field_name: data.fieldName,
    field_type: data.fieldType,
    interaction_type: data.action,
  });
}

/**
 * Track form start (first field interaction)
 */
export function trackFormStart(formId: string, formType: 'appointment' | 'contact' | 'grundstueck' | 'checkout') {
  trackCustomEvent('form_start', {
    form_id: formId,
    form_type: formType,
  });
}

/**
 * Track form abandonment (user leaves without submitting)
 */
export function trackFormAbandonment(data: {
  formId: string;
  formType: string;
  fieldsCompleted: string[];
  totalFields: number;
  timeSpent: number; // milliseconds
}) {
  const completionRate = (data.fieldsCompleted.length / data.totalFields) * 100;

  trackCustomEvent('form_abandon', {
    form_id: data.formId,
    form_type: data.formType,
    completion_rate: Math.round(completionRate),
    fields_completed: data.fieldsCompleted.join(','),
    time_spent_seconds: Math.round(data.timeSpent / 1000),
  });
}

/**
 * Track form validation errors
 */
export function trackFormValidationError(data: {
  formId: string;
  fieldName: string;
  errorType: string;
  errorMessage?: string;
}) {
  trackCustomEvent('form_error', {
    form_id: data.formId,
    field_name: data.fieldName,
    error_type: data.errorType,
    error_message: data.errorMessage || '',
  });
}

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth(depth: 25 | 50 | 75 | 100) {
  trackCustomEvent('scroll', {
    depth_percentage: depth,
    page_path: window.location.pathname,
  });
}

/**
 * Track time spent on page
 */
export function trackTimeOnPage(data: {
  pagePath: string;
  durationSeconds: number;
  durationCategory: '<1min' | '1-5min' | '5-10min' | '>10min';
}) {
  trackCustomEvent('page_engagement', {
    page: data.pagePath,
    duration_seconds: data.durationSeconds,
    duration_category: data.durationCategory,
  });
}

/**
 * Hook for tracking scroll depth on a page
 * Returns cleanup function
 */
export function useScrollDepthTracking() {
  if (typeof window === 'undefined') return () => {};

  const tracked = {
    '25': false,
    '50': false,
    '75': false,
    '100': false,
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / scrollHeight) * 100;

    (['25', '50', '75', '100'] as const).forEach(threshold => {
      const thresholdNum = parseInt(threshold);
      if (scrollPercent >= thresholdNum && !tracked[threshold]) {
        trackScrollDepth(thresholdNum as 25 | 50 | 75 | 100);
        tracked[threshold] = true;
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

/**
 * Hook for tracking time on page
 * Returns cleanup function
 */
export function useTimeOnPageTracking(pagePath: string) {
  if (typeof window === 'undefined') return () => {};

  const startTime = Date.now();

  return () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    if (duration > 10) { // Only track if > 10 seconds
      const category =
        duration < 60 ? '<1min' :
        duration < 300 ? '1-5min' :
        duration < 600 ? '5-10min' : '>10min';

      trackTimeOnPage({
        pagePath,
        durationSeconds: duration,
        durationCategory: category,
      });
    }
  };
}
