/**
 * Global Type Declarations for Google Analytics & Consent Management
 * 
 * Extends the Window interface for Google Analytics 4 and Consent Mode v2
 */

// Extend Window interface for gtag and dataLayer
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params: Record<string, unknown>
    ) => void;
    dataLayer?: Array<unknown>;
  }
}

export {};

