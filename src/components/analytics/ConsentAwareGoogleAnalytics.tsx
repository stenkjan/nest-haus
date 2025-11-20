'use client'

import { useEffect, useState } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { useCookieConsent } from '@/contexts/CookieConsentContext'
import Script from 'next/script'

/**
 * Google Analytics 4 mit Consent Mode v2
 * 
 * Implementiert DSGVO-konformes Tracking für EWR/Österreich:
 * - Lädt Analytics nur mit Nutzereinwilligung
 * - Consent Mode v2 für personalisierte Anzeigen
 * - Conversion-Modellierung bei fehlender Einwilligung
 */
export default function ConsentAwareGoogleAnalytics() {
  const { preferences } = useCookieConsent()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize Consent Mode v2 with default (denied) state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set default consent state (before user interaction)
      window.gtag = window.gtag || function(...args: unknown[]) {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push(args)
      }
      
      // Default consent for EWR/Austria (denied until user accepts)
      window.gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'granted', // For cookie banner itself
        'personalization_storage': 'denied',
        'security_storage': 'granted', // For security features
        'wait_for_update': 500, // Wait 500ms for user consent
      })
      
      console.log('📊 GA4 Consent Mode v2: Default state set (all denied)')
    }
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

  // Don't render on server
  if (!mounted) return null

  // Don't render if no measurement ID
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    console.warn('⚠️ GA4 Measurement ID not found in environment variables')
    return null
  }

  // Only load Google Analytics if user has consented to analytics
  if (!preferences.analytics) {
    console.log('📊 GA4: User has not consented to analytics, not loading script')
    return (
      <Script
        id="gtag-consent-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'granted',
              'personalization_storage': 'denied',
              'security_storage': 'granted',
              'wait_for_update': 500
            });
          `,
        }}
      />
    )
  }

  return (
    <>
      {/* Consent Mode v2 initialization script */}
      <Script
        id="gtag-consent-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'granted',
              'personalization_storage': 'denied',
              'security_storage': 'granted',
              'wait_for_update': 500
            });
          `,
        }}
      />
      
      {/* Google Analytics component - loads script only if consent given */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    </>
  )
}

// Type declarations for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
