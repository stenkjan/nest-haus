'use client'

import Script from 'next/script'
import { useCookieConsent } from '@/contexts/CookieConsentContext'
import { useEffect, useState } from 'react'

interface GoogleAdSenseProps {
  publisherId: string
}

export default function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  const { preferences, hasConsented } = useCookieConsent()
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Only load if user has consented and marketing cookies are enabled
    if (hasConsented && preferences.marketing) {
      setShouldLoad(true)
    } else {
      setShouldLoad(false)
    }
  }, [hasConsented, preferences.marketing])

  if (!shouldLoad || !publisherId) {
    return null
  }

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
