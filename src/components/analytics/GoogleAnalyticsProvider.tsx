/**
 * Google Analytics 4 Provider Component
 *
 * Integrates GA4 with cookie consent system and Google Signals
 * Provides demographics and marketing insights alongside custom analytics
 *
 * Features:
 * - Consent Mode v2 (GDPR compliant)
 * - Google Signals enabled for demographic and remarketing data
 * - Custom event integration
 * - Enhanced ecommerce tracking
 * - User demographics collection
 * - Cross-device tracking with Google Signals
 * - Cross-domain tracking for nest-haus.at and da-hoam.at
 *
 * IMPORTANT: Consent mode is configured BEFORE gtag script loads to ensure
 * proper consent initialization (Google's best practice)
 *
 * Compliance:
 * - Follows Google's Advertising Features Policy Requirements
 * - Implements Consent Mode v2 for EEA/UK users
 * - Supports data deletion requests and retention policies
 */

"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

interface GoogleAnalyticsProviderProps {
  gaId: string;
}

export default function GoogleAnalyticsProvider({
  gaId,
}: GoogleAnalyticsProviderProps) {
  const { preferences, hasConsented } = useCookieConsent();

  // Initialize consent mode BEFORE gtag loads (using dataLayer)
  // ALWAYS initialize - even if consent is denied (for cookieless pings)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    if (!hasConsented) {
      // User hasn't made a choice yet - wait for consent
      window.dataLayer.push({
        event: "consent_default",
        consent: {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied",
          functionality_storage: "denied",
          personalization_storage: "denied",
          wait_for_update: 500, // Wait for user decision
        },
      });
      console.log("⏳ Google Analytics waiting for consent decision");
    } else {
      // User made a decision - apply it
      // Even if denied, this enables cookieless pings (no wait_for_update)
      window.dataLayer.push({
        event: "consent_default",
        consent: {
          ad_storage: preferences.marketing ? "granted" : "denied",
          ad_user_data: preferences.marketing ? "granted" : "denied",
          ad_personalization: preferences.marketing ? "granted" : "denied",
          analytics_storage: preferences.analytics ? "granted" : "denied",
          functionality_storage: preferences.functional ? "granted" : "denied",
          personalization_storage: preferences.functional
            ? "granted"
            : "denied",
          // No wait_for_update when consent is denied = enables cookieless pings
        },
      });

      if (preferences.analytics) {
        console.log("✅ Google Analytics full tracking enabled");
      } else {
        console.log(
          "🔒 Google Analytics cookieless pings enabled (no cookies, anonymized data only)"
        );
      }
    }
  }, [hasConsented, preferences]);

  // ALWAYS render GA4 script (even if consent denied - for cookieless pings)
  // The consent mode configuration controls what data is collected
  return (
    <>
      {/* Load gtag.js script */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        onLoad={() => {
          console.log("✅ Google Analytics gtag script loaded");
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
            
            // Set default consent based on user's decision
            // If consent denied, this still allows cookieless pings
            gtag('consent', 'default', {
              'ad_storage': '${hasConsented && preferences.marketing ? "granted" : "denied"}',
              'ad_user_data': '${hasConsented && preferences.marketing ? "granted" : "denied"}',
              'ad_personalization': '${hasConsented && preferences.marketing ? "granted" : "denied"}',
              'analytics_storage': '${hasConsented && preferences.analytics ? "granted" : "denied"}',
              'functionality_storage': '${hasConsented && preferences.functional ? "granted" : "denied"}',
              'personalization_storage': '${hasConsented && preferences.functional ? "granted" : "denied"}',
              ${!hasConsented ? "'wait_for_update': 500" : ""}
            });
            
            // Configure GA4 with Google Signals enabled (only if marketing consent given)
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              allow_google_signals: ${hasConsented && preferences.marketing ? "true" : "false"},
              allow_ad_personalization_signals: ${hasConsented && preferences.marketing ? "true" : "false"},
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
              cookie_domain: 'auto',
              cookie_expires: 63072000,
              // Enable cookieless pings when consent is denied
              send_page_view: true,
              // Cross-domain tracking for nest-haus.at and da-hoam.at
              linker: {
                domains: ['nest-haus.at', 'da-hoam.at']
              }
            });
          `,
        }}
      />
    </>
  );
}
