import { useCookieConsent } from '@/contexts/CookieConsentContext'

interface AnalyticsEvent {
    action: string
    category: string
    label?: string
    value?: number
    [key: string]: unknown
}

export function useAnalytics() {
    const { hasConsented, preferences } = useCookieConsent()

    const trackEvent = ({ action, category, label, value, ...customDimensions }: AnalyticsEvent) => {
        // Only track if user has consented to analytics
        if (!hasConsented || !preferences.analytics) {
            console.log('Analytics event blocked (no consent):', { action, category })
            return
        }

        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value,
                ...customDimensions,
            })
            console.log('Analytics event tracked:', { action, category, label, value })
        } else {
            console.warn('Google Analytics not initialized')
        }
    }

    return { trackEvent }
}
