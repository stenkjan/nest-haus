"use client";

import React, { useState, useEffect } from "react";
import HybridBlobImage from "./HybridBlobImage";
import { ImageProps } from "next/image";

interface ResponsiveHybridImageProps extends Omit<ImageProps, "src"> {
  desktopPath: string;
  mobilePath: string;
  breakpoint?: number; // Width breakpoint for mobile/desktop switch
  strategy?: "ssr" | "client" | "auto";
  isAboveFold?: boolean;
  isCritical?: boolean;
  isInteractive?: boolean;
  enableCache?: boolean;
  fallbackSrc?: string;
  // Aspect ratio handling
  desktopAspectRatio?: string; // e.g., "16/9" for landscape
  mobileAspectRatio?: string; // e.g., "9/16" or "auto" for natural ratio
  useMobileNaturalRatio?: boolean; // If true, mobile uses natural image ratio
}

/**
 * ResponsiveHybridImage - Truly Responsive Image Component
 *
 * CRITICAL PERFORMANCE FIX: Only loads ONE image based on actual device size
 * Prevents the mobile loading issue where both mobile and desktop images were loaded
 *
 * This replaces the CSS-based hiding which still loads both images
 */
export default function ResponsiveHybridImage({
  desktopPath,
  mobilePath,
  breakpoint = 768,
  strategy = "auto",
  isAboveFold = false,
  isCritical = false,
  isInteractive = false,
  enableCache = true,
  fallbackSrc,
  alt,
  desktopAspectRatio = "16/9",
  mobileAspectRatio = "auto",
  useMobileNaturalRatio = true,
  ...props
}: ResponsiveHybridImageProps) {
  // Initialize with intelligent guess based on user agent and viewport
  const getInitialMobileState = (): boolean => {
    if (typeof window === "undefined") {
      // SSR: Use conservative mobile-first approach for critical images only
      // For non-critical images, default to desktop to prevent hydration mismatch
      return isCritical || isAboveFold;
    }

    // Client-side: Immediate detection with proper desktop browser handling
    const width = window.innerWidth;
    
    // CRITICAL FIX #1: Viewport >= 1024px is ALWAYS desktop
    // This handles DevTools laptop presets that simulate touch
    if (width >= 1024) {
      return false; // Large viewport = desktop, always
    }
    
    // CRITICAL FIX #2: Viewport < 768px = ALWAYS mobile
    // This allows mobile testing in DevTools and detects real mobile devices
    if (width < 768) {
      return true; // Small viewport = mobile for testing and real devices
    }
    
    // For medium viewports (768-1023px): Check device signals
    const userAgent = navigator.userAgent.toLowerCase();
    const _isMobileUserAgent =
      /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    const isTabletUserAgent = /ipad|tablet/i.test(userAgent);

    // Check for touch capabilities
    const hasTouchScreen =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

    // In tablet range (768-1023px), treat as desktop unless it's a real tablet
    // This prevents desktop browser resize from triggering mobile mode
    return isTabletUserAgent && hasTouchScreen;
  };

  const [isMobile, setIsMobile] = useState<boolean>(getInitialMobileState);
  const [isClient, setIsClient] = useState(false);

  // Determine device type on client side only
  useEffect(() => {
    setIsClient(true);

    const checkDevice = () => {
      // Enhanced mobile detection combining viewport size and user agent
      const width = window.innerWidth;
      
      // CRITICAL FIX #1: Viewport >= 1024px is ALWAYS desktop
      // This handles DevTools laptop presets (1440px, 1024px) that simulate touch
      if (width >= 1024) {
        setIsMobile((current) => (current !== false ? false : current));
        return;
      }
      
      // CRITICAL FIX #2: Viewport < 768px is ALWAYS mobile
      // This allows mobile testing in DevTools and detects real mobile devices
      if (width < 768) {
        setIsMobile((current) => (current !== true ? true : current));
        return;
      }
      
      // For medium viewports (768-1023px): Check device signals for tablets
      const userAgent = navigator.userAgent.toLowerCase();
      const _isMobileUserAgent =
        /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      const isTabletUserAgent = /ipad|tablet/i.test(userAgent);

      // Check for touch capabilities (real mobile devices have touch)
      const hasTouchScreen =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

      // In tablet range, only treat as mobile if it's a real tablet device
      const newIsMobile = isTabletUserAgent && hasTouchScreen;

      // Only update if the state actually changes to prevent unnecessary re-renders
      setIsMobile((current) =>
        current !== newIsMobile ? newIsMobile : current
      );
    };

    // Immediate check on mount
    checkDevice();

    const debouncedResize = debounce(checkDevice, 150);
    window.addEventListener("resize", debouncedResize);

    return () => window.removeEventListener("resize", debouncedResize);
  }, [breakpoint]);

  // Show loading state only during SSR to prevent hydration mismatch
  if (!isClient) {
    // During SSR, default to desktop images to prevent mobile images showing on desktop
    // In production, the client-side detection will quickly switch to mobile if needed
    return (
      <HybridBlobImage
        path={desktopPath} // Desktop-first for SSR to prevent mobile images on desktop
        alt={`${alt} - Loading`}
        strategy="ssr"
        isAboveFold={isAboveFold}
        isCritical={isCritical}
        enableCache={enableCache}
        fallbackSrc={fallbackSrc}
        {...props}
      />
    );
  }

  // Only render ONE image based on actual device detection
  // CRITICAL FIX: For non-critical images, ensure we don't use mobile path during initial render
  const shouldUseMobilePath =
    isMobile && (isClient || isCritical || isAboveFold);
  const imagePath = shouldUseMobilePath ? mobilePath : desktopPath;
  const deviceType = shouldUseMobilePath ? "Mobile" : "Desktop";

  // Enhanced alt text with device context for debugging
  const enhancedAlt = `${alt} - ${deviceType} optimized`;

  // Debug logging in development to verify correct path selection
  if (process.env.NODE_ENV === "development") {
    const debugId = `${alt?.slice(0, 20)}...` || "Unknown";
    console.group(`🖼️ ResponsiveHybridImage: ${debugId}`);
    console.log(
      `🖥️ Device: ${deviceType} (width: ${typeof window !== "undefined" ? window.innerWidth : "SSR"})`
    );
    console.log(`📱 Mobile path: ${mobilePath}`);
    console.log(`💻 Desktop path: ${desktopPath}`);
    console.log(`✅ Selected path: ${imagePath}`);
    console.log(
      `🔧 Strategy: ${strategy}, Critical: ${isCritical}, AboveFold: ${isAboveFold}`
    );
    console.log(
      `🖥️ isClient: ${isClient}, isMobile: ${isMobile}, shouldUseMobilePath: ${shouldUseMobilePath}`
    );
    console.log(
      `📐 Aspect ratio: ${shouldUseMobilePath ? mobileAspectRatio : desktopAspectRatio}`
    );

    // Clean up - no longer need specific nestHaus8 debug since issue is resolved

    console.groupEnd();
  }

  // Handle different rendering approaches for mobile vs desktop
  if (shouldUseMobilePath && useMobileNaturalRatio) {
    // Mobile: Use natural aspect ratio for vertical images
    return (
      <div className="relative w-full">
        <HybridBlobImage
          path={imagePath}
          alt={enhancedAlt}
          strategy={strategy}
          isAboveFold={isAboveFold}
          isCritical={isCritical}
          isInteractive={isInteractive}
          enableCache={enableCache}
          fallbackSrc={fallbackSrc}
          width={800}
          height={1200}
          className="w-full h-auto object-cover"
          style={{
            position: "relative",
            width: "100%",
            height: "auto",
          }}
          {...props}
        />
      </div>
    );
  } else {
    // Desktop: Use natural image dimensions for full-width display
    return (
      <div className="relative w-full">
        <HybridBlobImage
          path={imagePath}
          alt={enhancedAlt}
          strategy={strategy}
          isAboveFold={isAboveFold}
          isCritical={isCritical}
          isInteractive={isInteractive}
          enableCache={enableCache}
          fallbackSrc={fallbackSrc}
          width={1200}
          height={800}
          className="w-full h-auto object-contain"
          style={{
            width: "100%",
            height: "auto",
          }}
          sizes="100vw"
          {...props}
        />
      </div>
    );
  }
}

// Simple debounce utility
function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
