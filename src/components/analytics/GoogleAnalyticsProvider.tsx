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
 * 
 * IMPORTANT: Consent mode is configured BEFORE gtag script loads to ensure
 * proper consent initialization (Google's best practice)
 */

'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { useCookieConsent } from '@/contexts/CookieConsentContext'

interface GoogleAnalyticsProviderProps {
  gaId: string
}

export default function GoogleAnalyticsProvider({ gaId }: GoogleAnalyticsProviderProps) {
  const { preferences, hasConsented } = useCookieConsent()
  const [isGtagReady, setIsGtagReady] = useState(false)

  // Initialize consent mode BEFORE gtag loads (using dataLayer)
  useEffect(() => {
    if (!hasConsented || typeof window === 'undefined') return

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || []
    
    // Push consent configuration to dataLayer BEFORE gtag loads
    // This is Google's recommended approach for consent mode
    window.dataLayer.push({
      event: 'consent_default',
      consent: {
        ad_storage: preferences.marketing ? 'granted' : 'denied',
        ad_user_data: preferences.marketing ? 'granted' : 'denied',
        ad_personalization: preferences.marketing ? 'granted' : 'denied',
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        functionality_storage: preferences.functional ? 'granted' : 'denied',
        personalization_storage: preferences.functional ? 'granted' : 'denied',
      }
    })

    console.log('✅ Google Analytics consent initialized (pre-gtag):', preferences)
  }, [hasConsented, preferences])

  // Update consent when gtag is ready and preferences change
  useEffect(() => {
    if (!isGtagReady || !hasConsented) return

    // Now that gtag is loaded, we can use it to update consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': preferences.marketing ? 'granted' : 'denied',
        'ad_user_data': preferences.marketing ? 'granted' : 'denied',
        'ad_personalization': preferences.marketing ? 'granted' : 'denied',
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'functionality_storage': preferences.functional ? 'granted' : 'denied',
        'personalization_storage': preferences.functional ? 'granted' : 'denied',
      })

      console.log('🔄 Google Analytics consent updated (via gtag):', preferences)
    }
  }, [preferences, isGtagReady, hasConsented])

  // Listen for cookie preference updates via custom event
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

  return (
    <>
      {/* Load gtag.js script */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        onLoad={() => {
          setIsGtagReady(true)
          console.log('✅ Google Analytics gtag script loaded')
        }}
      />
      
      {/* Initialize gtag and configure GA4 */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            // Set default consent (already pushed to dataLayer, but ensure it's set)
            gtag('consent', 'default', {
              'ad_storage': '${preferences.marketing ? 'granted' : 'denied'}',
              'ad_user_data': '${preferences.marketing ? 'granted' : 'denied'}',
              'ad_personalization': '${preferences.marketing ? 'granted' : 'denied'}',
              'analytics_storage': '${preferences.analytics ? 'granted' : 'denied'}',
              'functionality_storage': '${preferences.functional ? 'granted' : 'denied'}',
              'personalization_storage': '${preferences.functional ? 'granted' : 'denied'}'
            });
            
            // Configure GA4
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

