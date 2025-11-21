/**
 * Google Analytics gtag.js Type Definitions
 * 
 * Consolidated type definitions for Google Analytics 4
 * Extends the Window interface to include gtag and dataLayer
 * Used across all GA4 tracking utilities
 */

declare global {
  interface Window {
    /**
     * Google Analytics dataLayer for event tracking
     * Used by both gtag.js and Google Tag Manager
     */
    dataLayer: Array<Record<string, unknown>>;
    
    /**
     * Google Analytics gtag function
     * Optional because it may not be loaded yet (e.g., before consent)
     */
    gtag?: (
      command: 'event' | 'config' | 'consent' | 'set' | 'get',
      targetOrAction: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export {};

