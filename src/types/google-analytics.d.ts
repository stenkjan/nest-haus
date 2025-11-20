// Google Analytics type definitions
// Consolidated from GoogleAnalyticsEvents.ts and GoogleAnalyticsProvider.tsx

declare global {
  interface Window {
    gtag: (
      command: 'consent' | 'config' | 'event' | 'set',
      targetOrAction: string,
      params?: Record<string, unknown>
    ) => void
    dataLayer: unknown[]
  }
}

export {}

