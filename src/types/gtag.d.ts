/**
 * Google Analytics gtag.js Type Definitions
 * 
 * Extends the Window interface to include gtag and dataLayer
 * Used across all GA4 tracking utilities
 */

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag?: (
      command: 'event' | 'config' | 'consent' | 'set' | 'get',
      targetOrAction: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export {};

