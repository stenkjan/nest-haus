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

            // Check for touch capabilities
            const hasTouchScreen =
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                (navigator as any).msMaxTouchPoints > 0 ||
                ("matchMedia" in window &&
                    window.matchMedia("(pointer: coarse)").matches);

            // Check for orientation API (mobile/tablet specific)
            const hasOrientationAPI =
                typeof window.orientation !== "undefined" ||
                "orientation" in window ||
                navigator.userAgent.indexOf("Mobile") !== -1;

            // Determine device type using multiple signals
            const isMobile =
                (width < 768 &&
                    (isMobileDevice || (hasTouchScreen && hasOrientationAPI))) ||
                (isMobileDevice && hasTouchScreen);

            const isTablet =
                (width >= 768 && width < 1024 && (isTabletDevice || hasTouchScreen)) ||
                (isTabletDevice && hasTouchScreen);

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