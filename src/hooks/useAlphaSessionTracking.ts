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
    const [sessionReady, setSessionReady] = useState(false);

    // Helper function to get device info
    const getDeviceInfo = useCallback(() => {
        return {
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                devicePixelRatio: window.devicePixelRatio || 1
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            timestamp: Date.now()
        };
    }, []);

    // Verify if a test session exists in the database
    const verifyTestSession = useCallback(async (testId: string): Promise<boolean> => {
        try {
            const response = await fetch(`/api/usability-test/verify/${testId}`);
            if (!response.ok) return false;

            const data = await response.json();
            return data.exists && data.active;
        } catch (error) {
            console.warn("🔍 Session verification failed:", error);
            return false;
        }
    }, []);

    // Create a new test session
    const createTestSession = useCallback(async (): Promise<string | null> => {
        try {
            const newTestId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`;

            const response = await fetch("/api/usability-test/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    testId: newTestId,
                    deviceInfo: getDeviceInfo(),
                    startUrl: window.location.href,
                    participantName: "Anonymous"
                }),
            });

            if (!response.ok) {
                console.warn("🔍 Failed to create test session:", response.status);
                return null;
            }

            const result = await response.json();
            if (result.success) {
                localStorage.setItem("nest-haus-test-session-id", newTestId);
                console.log("🔍 New test session created:", newTestId);
                return newTestId;
            }

            return null;
        } catch (error) {
            console.warn("🔍 Test session creation failed:", error);
            return null;
        }
    }, [getDeviceInfo]);

    // Ensure test session is ready before tracking
    const ensureTestSession = useCallback(async (): Promise<string | null> => {
        // Don't create sessions in development unless explicitly requested
        if (process.env.NODE_ENV === 'development') {
            const urlParams = new URLSearchParams(window.location.search);
            const hasAlphaParam = urlParams.get("alpha-test") === "true";
            if (!hasAlphaParam) {
                return null;
            }
        }

        // Check existing session first
        if (sessionId) {
            const isValid = await verifyTestSession(sessionId);
            if (isValid) {
                return sessionId;
            } else {
                // Clean up invalid session
                localStorage.removeItem("nest-haus-test-session-id");
                setSessionId(null);
                setSessionReady(false);
            }
        }

        // Create new session if needed
        const newSessionId = await createTestSession();
        if (newSessionId) {
            setSessionId(newSessionId);
            setSessionReady(true);
            return newSessionId;
        }

        return null;
    }, [sessionId, verifyTestSession, createTestSession]);

    // Check if alpha test is active and initialize session
    useEffect(() => {
        const checkAlphaTestStatus = async () => {
            // Check URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const hasAlphaParam = urlParams.get("alpha-test") === "true";

            // Check localStorage for existing test session
            const existingSessionId = localStorage.getItem("nest-haus-test-session-id");

            // Only activate if explicitly requested or valid session exists
            if (hasAlphaParam || existingSessionId) {
                // Verify session exists and is valid
                if (existingSessionId) {
                    const isValid = await verifyTestSession(existingSessionId);
                    if (isValid) {
                        setSessionId(existingSessionId);
                        setSessionReady(true);
                        setIsTrackingActive(true);
                        return;
                    } else {
                        // Clean up invalid session
                        localStorage.removeItem("nest-haus-test-session-id");
                    }
                }

                // Create new session if alpha param is present
                if (hasAlphaParam) {
                    const newSessionId = await createTestSession();
                    if (newSessionId) {
                        setSessionId(newSessionId);
                        setSessionReady(true);
                        setIsTrackingActive(true);
                    }
                }
            } else {
                // No alpha test active
                setIsTrackingActive(false);
                setSessionReady(false);
                setSessionId(null);
            }
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
    }, [verifyTestSession, createTestSession]);

    // Track button clicks
    const trackButtonClick = useCallback(
        (
            buttonText: string,
            buttonId?: string,
            elementType: string = "button",
            coordinates: { x: number; y: number } = { x: 0, y: 0 }
        ) => {
            // Only track if session is ready and tracking is active
            if (!isTrackingActive || !sessionReady) return;

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
            if (sessionReady && sessionId) {
                (async () => {
                    try {
                        const validSessionId = await ensureTestSession();
                        if (!validSessionId) return;

                        console.log("🖱️ Sending button click to API:", {
                            testId: validSessionId,
                            eventType: "button_click",
                            buttonText: event.buttonText,
                            path: event.path
                        });

                        const response = await fetch("/api/usability-test/track-session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                testId: validSessionId,
                                eventType: "button_click",
                                data: event,
                                timestamp: event.timestamp,
                            }),
                        });

                        const result = await response.json();
                        console.log("🖱️ Button click API response:", response.status, response.statusText);
                        console.log("🖱️ Button click API data:", result);
                    } catch (error) {
                        console.warn("🖱️ Button click tracking failed:", error);
                    }
                })();
            } else {
                console.warn("🖱️ No valid session available for button click tracking");
            }
        },
        [isTrackingActive, sessionReady, sessionId, ensureTestSession]
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
            // Only track if session is ready and tracking is active
            if (!isTrackingActive || !sessionReady) return;

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
            if (sessionReady && sessionId) {
                (async () => {
                    try {
                        const validSessionId = await ensureTestSession();
                        if (!validSessionId) return;

                        await fetch("/api/usability-test/track-session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                testId: validSessionId,
                                eventType: "form_interaction",
                                data: event,
                                timestamp: event.timestamp,
                            }),
                        });
                    } catch (error) {
                        console.warn("Failed to send form interaction to API:", error);
                    }
                })();
            }
        },
        [isTrackingActive, sessionReady, sessionId, ensureTestSession]
    );

    // Track page visits
    const trackPageVisit = useCallback(
        (path: string, title?: string) => {
            // Only track if session is ready and tracking is active
            if (!isTrackingActive || !sessionReady) return;

            const event = {
                path,
                title: title || document.title,
                timestamp: Date.now(),
                referrer: document.referrer,
                userAgent: navigator.userAgent,
            };

            console.log("📄 Alpha test page visit tracked:", event);

            // Send to API endpoint
            if (sessionReady && sessionId) {
                (async () => {
                    try {
                        const validSessionId = await ensureTestSession();
                        if (!validSessionId) return;

                        await fetch("/api/usability-test/track-session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                testId: validSessionId,
                                eventType: "page_visit",
                                data: event,
                                timestamp: event.timestamp,
                            }),
                        });
                    } catch (error) {
                        console.warn("Failed to send page visit to API:", error);
                    }
                })();
            }
        },
        [isTrackingActive, sessionReady, sessionId, ensureTestSession]
    );

    return {
        isTrackingActive,
        trackButtonClick,
        trackFormInteraction,
        trackPageVisit,
        sessionId,
    };
}
