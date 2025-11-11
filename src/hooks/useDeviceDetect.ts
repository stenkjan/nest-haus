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
            const hasOrientationAPI =
                typeof window.orientation !== "undefined" ||
                "orientation" in window ||
                navigator.userAgent.indexOf("Mobile") !== -1;

            // IMPROVED LOGIC: Prioritize user agent over viewport width
            // This prevents F12 device toolbar from incorrectly triggering mobile detection
            
            // CRITICAL FIX: Viewport >= 1024px is ALWAYS desktop (laptops, large tablets, desktops)
            // This handles DevTools laptop presets (1440px, 1024px) that simulate touch
            if (width >= 1024) {
                return {
                    isMobile: false,
                    isTablet: false,
                    isDesktop: true,
                    screenWidth: width,
                };
            }
            
            // If user agent clearly indicates desktop (and not large screen already handled above)
            if (isDesktopUserAgent && !hasTouchScreen) {
                // Desktop browser - viewport size alone doesn't make it mobile
                // This handles F12 device toolbar case with smaller viewports
                return {
                    isMobile: false,
                    isTablet: false,
                    isDesktop: true,
                    screenWidth: width,
                };
            }

            // For actual mobile devices: User agent says mobile + touch screen
            const isMobile =
                (isMobileDevice && hasTouchScreen) ||
                (width < 768 && isMobileDevice) ||
                (width < 768 && hasTouchScreen && hasOrientationAPI);

            // For tablets: User agent says tablet + touch screen (only in 768-1023px range)
            const isTablet =
                (isTabletDevice && hasTouchScreen) ||
                (width >= 768 && width < 1024 && isTabletDevice);

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