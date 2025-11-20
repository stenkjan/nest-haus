'use client'

import { useEffect, useState } from 'react'
import { useCookieConsent } from '@/contexts/CookieConsentContext'

/**
 * Google Analytics 4 - Consent State Manager
 * 
 * Diese Komponente managed nur den Consent-Status.
 * Das eigentliche Google Tag ist direkt im <head> von layout.tsx eingebaut.
 * 
 * Implementiert DSGVO-konformes Tracking für EWR/Österreich:
 * - Lädt Analytics nur mit Nutzereinwilligung (Consent Mode v2)
 * - Aktualisiert Consent-Status wenn User Cookie-Präferenzen ändert
 * - Conversion-Modellierung bei fehlender Einwilligung
 */
export default function ConsentAwareGoogleAnalytics() {
  const { preferences } = useCookieConsent()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update consent when user makes a choice
  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && window.gtag) {
      // Use the 'analytics' preference from your existing cookie consent
      window.gtag('consent', 'update', {
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'ad_storage': 'denied', // Keep ads denied (no advertising cookies)
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
      })
      
      console.log('📊 GA4 Consent updated:', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        analytics: preferences.analytics
      })
    }
  }, [mounted, preferences.analytics])

  // This component doesn't render anything
  // It only manages consent state updates
  return null
}

// Type declarations for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
