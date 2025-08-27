"use client";

import { useEffect, useRef, useCallback, useState } from 'react';

export interface PageVisit {
    path: string;
    title: string;
    entryTime: number;
    exitTime?: number;
    timeSpent?: number;
}

export interface ButtonClick {
    buttonText: string;
    buttonId?: string;
    elementType: string;
    path: string;
    timestamp: number;
    coordinates?: { x: number; y: number };
}

export interface FormInteraction {
    formId?: string;
    fieldName: string;
    fieldType: string;
    action: 'focus' | 'blur' | 'change' | 'submit';
    value?: string;
    path: string;
    timestamp: number;
}

export interface ConfiguratorSelection {
    category: string;
    value: string;
    name: string;
    price: number;
    previousValue?: string;
    timestamp: number;
    totalPrice: number;
}

export interface SessionTrackingData {
    testId: string;
    pageVisits: PageVisit[];
    buttonClicks: ButtonClick[];
    formInteractions: FormInteraction[];
    configuratorSelections: ConfiguratorSelection[];
    startTime: number;
    lastActivity: number;
}

/**
 * Enhanced session tracking hook for alpha test
 * Integrates seamlessly with existing alpha test infrastructure
 */
export function useAlphaSessionTracking() {
    const currentPageRef = useRef<PageVisit | null>(null);
    const sessionDataRef = useRef<SessionTrackingData | null>(null);
    const isTrackingActiveRef = useRef(false);
    const [isTrackingActive, setIsTrackingActive] = useState(false);

    // Initialize tracking when alpha test is active
    const initializeTracking = useCallback(() => {
        const testSessionId = localStorage.getItem("nest-haus-test-session-id");
        const isTestCompleted = localStorage.getItem("nest-haus-test-completed") === "true";

        if (!testSessionId || isTestCompleted) {
            isTrackingActiveRef.current = false;
            setIsTrackingActive(false);
            return;
        }

        isTrackingActiveRef.current = true;
        setIsTrackingActive(true);

        // Initialize session data
        if (!sessionDataRef.current) {
            sessionDataRef.current = {
                testId: testSessionId,
                pageVisits: [],
                buttonClicks: [],
                formInteractions: [],
                configuratorSelections: [],
                startTime: Date.now(),
                lastActivity: Date.now()
            };
        }

        console.log("🔍 Alpha session tracking initialized for:", testSessionId);
    }, []);

    // Send tracking data to backend
    const sendTrackingData = useCallback((eventType: string, data: unknown) => {
        const testSessionId = localStorage.getItem("nest-haus-test-session-id");
        if (!testSessionId) {
            console.log("🔍 sendTrackingData: No test session ID found");
            return;
        }

        const payload = {
            testId: testSessionId,
            eventType,
            data,
            timestamp: Date.now()
        };

        console.log("🔍 Sending tracking data:", {
            eventType,
            testId: testSessionId,
            dataKeys: Object.keys(data as Record<string, unknown> || {}),
            timestamp: payload.timestamp
        });

        fetch('/api/usability-test/track-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                console.log("🔍 Tracking API response:", {
                    status: response.status,
                    ok: response.ok,
                    eventType
                });
                return response.json();
            })
            .then(result => {
                console.log("🔍 Tracking API result:", result);
            })
            .catch(error => {
                console.error("🔍 Tracking API error:", error);
            });
    }, []);

    // Track page visit
    const trackPageVisit = useCallback((path: string, title: string) => {
        if (!isTrackingActiveRef.current || !sessionDataRef.current) return;

        // End previous page visit
        if (currentPageRef.current && !currentPageRef.current.exitTime) {
            const exitTime = Date.now();
            currentPageRef.current.exitTime = exitTime;
            currentPageRef.current.timeSpent = exitTime - currentPageRef.current.entryTime;

            // Add to session data
            sessionDataRef.current.pageVisits.push({ ...currentPageRef.current });
        }

        // Start new page visit
        const newPageVisit: PageVisit = {
            path,
            title,
            entryTime: Date.now()
        };

        currentPageRef.current = newPageVisit;
        sessionDataRef.current.lastActivity = Date.now();

        console.log("📄 Page visit tracked:", path);

        // Send to backend (non-blocking)
        sendTrackingData('page_visit', { path, title, timestamp: Date.now() });
    }, [sendTrackingData]);

    // Track button click
    const trackButtonClick = useCallback((
        buttonText: string,
        buttonId?: string,
        elementType: string = 'button',
        coordinates?: { x: number; y: number }
    ) => {
        if (!isTrackingActiveRef.current || !sessionDataRef.current) return;

        const buttonClick: ButtonClick = {
            buttonText,
            buttonId,
            elementType,
            path: window.location.pathname,
            timestamp: Date.now(),
            coordinates
        };

        sessionDataRef.current.buttonClicks.push(buttonClick);
        sessionDataRef.current.lastActivity = Date.now();

        console.log("🖱️ Button click tracked:", buttonText);

        // Send to backend (non-blocking)
        sendTrackingData('button_click', buttonClick);
    }, [sendTrackingData]);

    // Track form interaction
    const trackFormInteraction = useCallback((
        fieldName: string,
        fieldType: string,
        action: 'focus' | 'blur' | 'change' | 'submit',
        value?: string,
        formId?: string
    ) => {
        if (!isTrackingActiveRef.current || !sessionDataRef.current) return;

        const formInteraction: FormInteraction = {
            formId,
            fieldName,
            fieldType,
            action,
            value: action === 'submit' ? undefined : value, // Don't store sensitive data
            path: window.location.pathname,
            timestamp: Date.now()
        };

        sessionDataRef.current.formInteractions.push(formInteraction);
        sessionDataRef.current.lastActivity = Date.now();

        console.log("📝 Form interaction tracked:", fieldName, action);

        // Send to backend (non-blocking)
        sendTrackingData('form_interaction', formInteraction);
    }, [sendTrackingData]);

    // Track configurator selection
    const trackConfiguratorSelection = useCallback((
        category: string,
        value: string,
        name: string,
        price: number,
        totalPrice: number,
        previousValue?: string
    ) => {
        if (!isTrackingActiveRef.current || !sessionDataRef.current) return;

        const selection: ConfiguratorSelection = {
            category,
            value,
            name,
            price,
            previousValue,
            timestamp: Date.now(),
            totalPrice
        };

        sessionDataRef.current.configuratorSelections.push(selection);
        sessionDataRef.current.lastActivity = Date.now();

        console.log("⚙️ Configurator selection tracked:", category, value);

        // Send to backend (non-blocking)
        sendTrackingData('configurator_selection', selection);
    }, [sendTrackingData]);

    // Get current session data
    const getSessionData = useCallback((): SessionTrackingData | null => {
        return sessionDataRef.current;
    }, []);

    // Finalize current page visit when component unmounts or test ends
    const finalizeTracking = useCallback(() => {
        if (currentPageRef.current && !currentPageRef.current.exitTime) {
            const exitTime = Date.now();
            currentPageRef.current.exitTime = exitTime;
            currentPageRef.current.timeSpent = exitTime - currentPageRef.current.entryTime;

            if (sessionDataRef.current) {
                sessionDataRef.current.pageVisits.push({ ...currentPageRef.current });

                // Send final session data
                sendTrackingData('session_finalize', sessionDataRef.current);
            }
        }
    }, [sendTrackingData]);

    // Initialize tracking on mount and listen for test state changes
    useEffect(() => {
        initializeTracking();

        // Listen for storage changes to detect test start/end
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "nest-haus-test-session-id") {
                if (e.newValue) {
                    initializeTracking();
                } else {
                    finalizeTracking();
                    isTrackingActiveRef.current = false;
                    setIsTrackingActive(false);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Track initial page visit
        setTimeout(() => {
            if (isTrackingActiveRef.current) {
                trackPageVisit(window.location.pathname, document.title);
            }
        }, 100);

        // Finalize tracking on page unload
        const handleBeforeUnload = () => {
            finalizeTracking();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            finalizeTracking();
        };
    }, [initializeTracking, trackPageVisit, finalizeTracking]);

    // Track page changes for SPA navigation
    useEffect(() => {
        setTimeout(() => {
            if (isTrackingActiveRef.current) {
                trackPageVisit(window.location.pathname, document.title);
            }
        }, 100);
    }, [trackPageVisit]);

    return {
        isTrackingActive,
        trackPageVisit,
        trackButtonClick,
        trackFormInteraction,
        trackConfiguratorSelection,
        getSessionData,
        initializeTracking,
        finalizeTracking
    };
}
