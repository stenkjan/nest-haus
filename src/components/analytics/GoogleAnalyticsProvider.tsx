/**
 * Google Analytics 4 Provider Component
 * 
 * Integrates GA4 with cookie consent system
 * Provides demographics and marketing insights alongside custom analytics
 * 
 * Features:
 * - Consent-based tracking (GDPR compliant)
 * - Custom event integration
 * - Enhanced ecommerce tracking
 * - User demographics collection
 */

'use client'

import { useEffect } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { useCookieConsent } from '@/contexts/CookieConsentContext'

interface GoogleAnalyticsProviderProps {
  gaId: string
}

export default function GoogleAnalyticsProvider({ gaId }: GoogleAnalyticsProviderProps) {
  const { preferences, hasConsented } = useCookieConsent()

  useEffect(() => {
    if (!hasConsented) return

    // Configure Google Analytics consent mode
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'default', {
        'ad_storage': preferences.marketing ? 'granted' : 'denied',
        'ad_user_data': preferences.marketing ? 'granted' : 'denied',
        'ad_personalization': preferences.marketing ? 'granted' : 'denied',
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'functionality_storage': preferences.functional ? 'granted' : 'denied',
        'personalization_storage': preferences.functional ? 'granted' : 'denied',
      })

      console.log('✅ Google Analytics consent updated:', preferences)
    }
  }, [preferences, hasConsented])

  // Listen for cookie preference updates
  useEffect(() => {
    const handlePreferencesUpdate = (event: CustomEvent) => {
      const newPreferences = event.detail
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': newPreferences.marketing ? 'granted' : 'denied',
          'ad_user_data': newPreferences.marketing ? 'granted' : 'denied',
          'ad_personalization': newPreferences.marketing ? 'granted' : 'denied',
          'analytics_storage': newPreferences.analytics ? 'granted' : 'denied',
          'functionality_storage': newPreferences.functional ? 'granted' : 'denied',
          'personalization_storage': newPreferences.functional ? 'granted' : 'denied',
        })

        console.log('🔄 Google Analytics consent updated dynamically')
      }
    }

    window.addEventListener('cookiePreferencesUpdated', handlePreferencesUpdate as EventListener)

    return () => {
      window.removeEventListener('cookiePreferencesUpdated', handlePreferencesUpdate as EventListener)
    }
  }, [])

  // Only render GA4 script if analytics are enabled
  if (!hasConsented || !preferences.analytics) {
    return null
  }

  return <GoogleAnalytics gaId={gaId} />
}

// Extend window object for gtag
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

