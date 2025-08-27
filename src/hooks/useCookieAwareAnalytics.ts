"use client";

import { useEffect, useCallback } from "react";
import { useCookieConsent, canUseAnalytics, canUseFunctional, canUseMarketing } from "@/contexts/CookieConsentContext";

interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
    sessionId?: string;
}

interface TrackingOptions {
    requiresAnalytics?: boolean;
    requiresFunctional?: boolean;
    requiresMarketing?: boolean;
}

export function useCookieAwareAnalytics() {
    const { preferences, hasConsented } = useCookieConsent();

    // Track page view
    const trackPageView = useCallback((
        page: string,
        options: TrackingOptions = { requiresAnalytics: true }
    ) => {
        if (!hasConsented) return;

        const canTrack =
            (!options.requiresAnalytics || canUseAnalytics(preferences)) &&
            (!options.requiresFunctional || canUseFunctional(preferences)) &&
            (!options.requiresMarketing || canUseMarketing(preferences));

        if (!canTrack) return;

        // Send to your analytics service
        console.log("📊 Page view tracked:", page);

        // Example: Send to your existing analytics API
        fetch("/api/content/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "page_view",
                page,
                timestamp: Date.now(),
                consent: preferences
            })
        }).catch(() => {
            // Fail silently - don't block user experience
        });
    }, [preferences, hasConsented]);

    // Track custom event
    const trackEvent = useCallback((
        event: AnalyticsEvent,
        options: TrackingOptions = { requiresAnalytics: true }
    ) => {
        if (!hasConsented) return;

        const canTrack =
            (!options.requiresAnalytics || canUseAnalytics(preferences)) &&
            (!options.requiresFunctional || canUseFunctional(preferences)) &&
            (!options.requiresMarketing || canUseMarketing(preferences));

        if (!canTrack) return;

        console.log("📊 Event tracked:", event);

        // Send to your analytics service
        fetch("/api/content/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "custom_event",
                event,
                timestamp: Date.now(),
                consent: preferences
            })
        }).catch(() => {
            // Fail silently
        });
    }, [preferences, hasConsented]);

    // Track configurator interaction (requires analytics consent)
    const trackConfiguratorInteraction = useCallback((
        action: string,
        category: string,
        value?: string,
        sessionId?: string
    ) => {
        trackEvent({
            category: "configurator",
            action,
            label: category,
            value: value ? parseInt(value) : undefined,
            sessionId
        }, { requiresAnalytics: true });
    }, [trackEvent]);

    // Track form interaction (requires functional consent)
    const trackFormInteraction = useCallback((
        formId: string,
        action: "start" | "complete" | "abandon",
        fieldName?: string
    ) => {
        trackEvent({
            category: "form",
            action,
            label: `${formId}${fieldName ? `:${fieldName}` : ""}`
        }, { requiresFunctional: true });
    }, [trackEvent]);

    // Track marketing attribution (requires marketing consent)
    const trackMarketingAttribution = useCallback((
        source: string,
        medium: string,
        campaign?: string
    ) => {
        trackEvent({
            category: "marketing",
            action: "attribution",
            label: `${source}/${medium}${campaign ? `/${campaign}` : ""}`
        }, { requiresMarketing: true });
    }, [trackEvent]);

    // Listen for cookie preference changes
    useEffect(() => {
        const handlePreferenceChange = (event: CustomEvent) => {
            const newPreferences = event.detail;
            console.log("🍪 Cookie preferences updated:", newPreferences);

            // Optionally track the preference change itself (with necessary cookies only)
            if (hasConsented) {
                fetch("/api/content/analytics", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "cookie_preferences_updated",
                        preferences: newPreferences,
                        timestamp: Date.now()
                    })
                }).catch(() => { });
            }
        };

        window.addEventListener("cookiePreferencesUpdated", handlePreferenceChange as EventListener);

        return () => {
            window.removeEventListener("cookiePreferencesUpdated", handlePreferenceChange as EventListener);
        };
    }, [hasConsented]);

    return {
        trackPageView,
        trackEvent,
        trackConfiguratorInteraction,
        trackFormInteraction,
        trackMarketingAttribution,
        canUseAnalytics: canUseAnalytics(preferences),
        canUseFunctional: canUseFunctional(preferences),
        canUseMarketing: canUseMarketing(preferences),
        hasConsented
    };
}
