"use client";

import { useState, useEffect } from "react";

interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    screenWidth: number;
}

export function useDeviceDetect(): DeviceInfo {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: typeof window !== "undefined" ? window.innerWidth : 1024,
    });

    useEffect(() => {
        function detectDevice() {
            // Get viewport width
            const width = window.innerWidth;

            // Check for mobile device signals
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobileDevice =
                /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
                    userAgent
                );
            const isTabletDevice = /ipad|tablet/i.test(userAgent);

            // CRITICAL: Check if this is a desktop browser (not mobile/tablet in user agent)
            // This helps prevent F12 device toolbar from triggering mobile mode
            const isDesktopUserAgent = !isMobileDevice && !isTabletDevice && 
                !/mobile|android/i.test(userAgent);

            // Check for touch capabilities
            const hasTouchScreen =
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                ((navigator as Navigator & { msMaxTouchPoints?: number }).msMaxTouchPoints || 0) > 0 ||
                ("matchMedia" in window &&
                    window.matchMedia("(pointer: coarse)").matches);

            // Check for orientation API (mobile/tablet specific)
            const _hasOrientationAPI =
                typeof window.orientation !== "undefined" ||
                "orientation" in window ||
                navigator.userAgent.indexOf("Mobile") !== -1;

            // IMPROVED LOGIC: Balanced approach for DevTools and real devices
            
            // CRITICAL FIX #1: Viewport >= 1024px is ALWAYS desktop (laptops, large tablets, desktops)
            // This handles DevTools laptop presets (1440px, 1024px) that simulate touch
            if (width >= 1024) {
                return {
                    isMobile: false,
                    isTablet: false,
                    isDesktop: true,
                    screenWidth: width,
                };
            }
            
            // CRITICAL FIX #2: Viewport < 768px with desktop UA = Allow mobile for DevTools testing
            // This lets developers test mobile layouts in DevTools with mobile presets
            if (width < 768) {
                // For small viewports, show mobile view even with desktop user agent
                // This enables mobile testing in DevTools while still detecting real mobile devices
                return {
                    isMobile: true,
                    isTablet: false,
                    isDesktop: false,
                    screenWidth: width,
                };
            }
            
            // For medium viewports (768-1023px): Check device signals for tablets
            // This range is typically tablets or small laptops
            if (width >= 768 && width < 1024) {
                // Check if it's a real tablet device
                const isTablet = (isTabletDevice && hasTouchScreen) || 
                                 (hasTouchScreen && !isMobileDevice && !isDesktopUserAgent);
                
                if (isTablet) {
                    return {
                        isMobile: false,
                        isTablet: true,
                        isDesktop: false,
                        screenWidth: width,
                    };
                }
                
                // For desktop browsers in this range (e.g., resized window)
                // treat as desktop to avoid switching to mobile on resize
                return {
                    isMobile: false,
                    isTablet: false,
                    isDesktop: true,
                    screenWidth: width,
                };
            }

            // Fallback (should not reach here due to above conditions)
            const isMobile = isMobileDevice && hasTouchScreen;
            const isTablet = isTabletDevice && hasTouchScreen;
            const isDesktop = !isMobile && !isTablet;

            return {
                isMobile,
                isTablet,
                isDesktop,
                screenWidth: width,
            };
        }

        // Initial detection
        setDeviceInfo(detectDevice());

        // Set up listeners for changes
        const handleResize = () => {
            setDeviceInfo(detectDevice());
        };

        const handleOrientationChange = () => {
            // Force mobile detection on orientation change
            const width = window.innerWidth;
            setDeviceInfo((prev) => ({
                ...prev,
                isMobile: true,
                isTablet: width >= 768 && width < 1024,
                isDesktop: false,
                screenWidth: width,
            }));
        };

        // Add event listeners
        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleOrientationChange);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleOrientationChange);
        };
    }, []);

    return deviceInfo;
} 