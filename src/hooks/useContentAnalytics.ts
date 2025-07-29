import { useEffect, useRef, useCallback } from "react";
import type { SectionDefinition } from "@/types/content";

interface UseContentAnalyticsProps {
    pageType: "content" | "landing" | "product";
    sections: SectionDefinition[];
    currentSectionId: string;
    enabled?: boolean;
}

export function useContentAnalytics({
    pageType,
    sections: _sections,
    currentSectionId,
    enabled = true,
}: UseContentAnalyticsProps) {
    const startTime = useRef<number>(Date.now());
    const sectionTimes = useRef<Record<string, number>>({});
    const sectionViews = useRef<Record<string, number>>({});
    const buttonClicks = useRef<Record<string, number>>({});
    const lastSectionId = useRef<string>(currentSectionId);

    // Get session ID (placeholder - should integrate with actual session management)
    const getSessionId = useCallback(() => {
        let sessionId = localStorage.getItem("nest-session-id");
        if (!sessionId) {
            sessionId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("nest-session-id", sessionId);
        }
        return sessionId;
    }, []);

    // Send analytics data to backend
    const trackEvent = useCallback(async (eventType: string, data: Record<string, unknown>) => {
        if (!enabled) return;

        try {
            // Non-blocking API call for analytics
            fetch("/api/sessions/track-interaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: getSessionId(),
                    interaction: {
                        eventType,
                        category: "content",
                        elementId: data.section_id,
                        selectionValue: data.button_text || data.depth_percent?.toString(),
                        timeSpent: data.timestamp,
                        deviceInfo: {
                            type: window.innerWidth > 768 ? "desktop" : "mobile",
                            width: window.innerWidth,
                            height: window.innerHeight,
                        },
                    },
                }),
            }).catch(() => {
                // Fail silently - don't block user experience
            });
        } catch {
            // Fail silently
        }
    }, [enabled, getSessionId]);

    // Track section view time
    useEffect(() => {
        if (!enabled) return;

        const now = Date.now();

        // Record time spent in previous section
        if (lastSectionId.current && lastSectionId.current !== currentSectionId) {
            const timeInSection = now - (sectionTimes.current[lastSectionId.current] || now);

            // Only track if spent meaningful time (>2 seconds)
            if (timeInSection > 2000) {
                sectionViews.current[lastSectionId.current] =
                    (sectionViews.current[lastSectionId.current] || 0) + 1;
            }
        }

        // Start timing current section
        sectionTimes.current[currentSectionId] = now;
        lastSectionId.current = currentSectionId;

        // Track section entry
        trackEvent("section_view", {
            section_id: currentSectionId,
            page_type: pageType,
            timestamp: now,
        });
    }, [currentSectionId, pageType, enabled, trackEvent]);

    // Track button clicks
    const trackButtonClick = useCallback((buttonText: string, sectionId?: string) => {
        if (!enabled) return;

        const section = sectionId || currentSectionId;
        const clickKey = `${section}_${buttonText}`;

        buttonClicks.current[clickKey] = (buttonClicks.current[clickKey] || 0) + 1;

        trackEvent("button_click", {
            button_text: buttonText,
            section_id: section,
            page_type: pageType,
            timestamp: Date.now(),
        });
    }, [currentSectionId, pageType, enabled, trackEvent]);

    // Track scroll depth
    const trackScrollDepth = useCallback((depth: number) => {
        if (!enabled) return;

        // Only track significant scroll milestones (25%, 50%, 75%, 100%)
        if (depth === 25 || depth === 50 || depth === 75 || depth === 100) {
            trackEvent("scroll_depth", {
                depth_percent: depth,
                section_id: currentSectionId,
                page_type: pageType,
                timestamp: Date.now(),
            });
        }
    }, [currentSectionId, pageType, enabled, trackEvent]);

    // Cleanup and final tracking on unmount
    useEffect(() => {
        const startTimeValue = startTime.current;
        const sectionViewsValue = sectionViews.current;
        const buttonClicksValue = buttonClicks.current;

        return () => {
            if (!enabled) return;

            const totalTime = Date.now() - startTimeValue;

            // Send final analytics
            trackEvent("page_exit", {
                total_time: totalTime,
                sections_viewed: Object.keys(sectionViewsValue).length,
                interactions: Object.values(buttonClicksValue).reduce((a, b) => a + b, 0),
            });
        };
    }, [pageType, enabled, trackEvent]);

    return {
        trackButtonClick,
        trackScrollDepth,
        analytics: {
            sectionViews: sectionViews.current,
            buttonClicks: buttonClicks.current,
        },
    };
} 