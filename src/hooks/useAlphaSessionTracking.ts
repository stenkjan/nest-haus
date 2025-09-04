"use client";

import { useState, useEffect, useCallback } from "react";

interface ButtonClickEvent {
    buttonText: string;
    buttonId?: string;
    elementType: string;
    coordinates: { x: number; y: number };
    timestamp: number;
    path: string;
}

interface FormInteractionEvent {
    fieldName: string;
    fieldType: string;
    action: "focus" | "blur" | "change" | "submit";
    value?: string;
    formId?: string;
    timestamp: number;
    path: string;
}

interface AlphaSessionTrackingHook {
    isTrackingActive: boolean;
    trackButtonClick: (
        buttonText: string,
        buttonId?: string,
        elementType?: string,
        coordinates?: { x: number; y: number }
    ) => void;
    trackFormInteraction: (
        fieldName: string,
        fieldType: string,
        action: "focus" | "blur" | "change" | "submit",
        value?: string,
        formId?: string
    ) => void;
    trackPageVisit: (path: string, title?: string) => void;
    sessionId: string | null;
}

/**
 * Hook for alpha test session tracking
 * Tracks user interactions during alpha testing sessions
 */
export function useAlphaSessionTracking(): AlphaSessionTrackingHook {
    const [isTrackingActive, setIsTrackingActive] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Check if alpha test is active
    useEffect(() => {
        const checkAlphaTestStatus = () => {
            // Check URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const hasAlphaParam = urlParams.get("alpha-test") === "true";

            // Check localStorage for existing test session
            const existingSessionId = localStorage.getItem("nest-haus-test-session-id");

            const isActive = hasAlphaParam || !!existingSessionId;
            setIsTrackingActive(isActive);
            setSessionId(existingSessionId);

            console.log("🔍 Alpha test status check:", {
                hasAlphaParam,
                existingSessionId,
                isActive,
            });
        };

        checkAlphaTestStatus();

        // Listen for storage changes (cross-tab synchronization)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "nest-haus-test-session-id") {
                checkAlphaTestStatus();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Track button clicks
    const trackButtonClick = useCallback(
        (
            buttonText: string,
            buttonId?: string,
            elementType: string = "button",
            coordinates: { x: number; y: number } = { x: 0, y: 0 }
        ) => {
            if (!isTrackingActive) return;

            const event: ButtonClickEvent = {
                buttonText,
                buttonId,
                elementType,
                coordinates,
                timestamp: Date.now(),
                path: window.location.pathname,
            };

            console.log("🖱️ Alpha test button click tracked:", event);

            // Store in localStorage for now (could be sent to API later)
            const existingEvents = JSON.parse(
                localStorage.getItem("nest-haus-alpha-button-clicks") || "[]"
            );
            existingEvents.push(event);
            localStorage.setItem(
                "nest-haus-alpha-button-clicks",
                JSON.stringify(existingEvents)
            );

            // Send to API endpoint
            if (sessionId) {
                console.log("🖱️ Sending button click to API:", {
                    testId: sessionId,
                    eventType: "button_click",
                    buttonText: event.buttonText,
                    path: event.path
                });
                
                fetch("/api/usability-test/track-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        testId: sessionId,
                        eventType: "button_click",
                        data: event,
                        timestamp: event.timestamp,
                    }),
                }).then(response => {
                    console.log("🖱️ Button click API response:", response.status, response.statusText);
                    return response.json();
                }).then(data => {
                    console.log("🖱️ Button click API data:", data);
                }).catch((error) => {
                    console.warn("Failed to send button click to API:", error);
                });
            } else {
                console.warn("🖱️ No sessionId available for button click tracking");
            }
        },
        [isTrackingActive, sessionId]
    );

    // Track form interactions
    const trackFormInteraction = useCallback(
        (
            fieldName: string,
            fieldType: string,
            action: "focus" | "blur" | "change" | "submit",
            value?: string,
            formId?: string
        ) => {
            if (!isTrackingActive) return;

            const event: FormInteractionEvent = {
                fieldName,
                fieldType,
                action,
                value,
                formId,
                timestamp: Date.now(),
                path: window.location.pathname,
            };

            console.log("📝 Alpha test form interaction tracked:", event);

            // Store in localStorage for now (could be sent to API later)
            const existingEvents = JSON.parse(
                localStorage.getItem("nest-haus-alpha-form-interactions") || "[]"
            );
            existingEvents.push(event);
            localStorage.setItem(
                "nest-haus-alpha-form-interactions",
                JSON.stringify(existingEvents)
            );

            // Send to API endpoint
            if (sessionId) {
                fetch("/api/usability-test/track-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        testId: sessionId,
                        eventType: "form_interaction",
                        data: event,
                        timestamp: event.timestamp,
                    }),
                }).catch((error) => {
                    console.warn("Failed to send form interaction to API:", error);
                });
            }
        },
        [isTrackingActive, sessionId]
    );

    // Track page visits
    const trackPageVisit = useCallback(
        (path: string, title?: string) => {
            if (!isTrackingActive) return;

            const event = {
                path,
                title: title || document.title,
                timestamp: Date.now(),
                referrer: document.referrer,
                userAgent: navigator.userAgent,
            };

            console.log("📄 Alpha test page visit tracked:", event);

            // Send to API endpoint
            if (sessionId) {
                fetch("/api/usability-test/track-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        testId: sessionId,
                        eventType: "page_visit",
                        data: event,
                        timestamp: event.timestamp,
                    }),
                }).catch((error) => {
                    console.warn("Failed to send page visit to API:", error);
                });
            }
        },
        [isTrackingActive, sessionId]
    );

    return {
        isTrackingActive,
        trackButtonClick,
        trackFormInteraction,
        trackPageVisit,
        sessionId,
    };
}
