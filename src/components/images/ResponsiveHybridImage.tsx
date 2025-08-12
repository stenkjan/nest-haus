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
      // SSR: Use conservative mobile-first approach
      return true;
    }

    // Client-side: Immediate detection
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent =
      /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    const isSmallViewport = window.innerWidth < breakpoint;

    return isMobileUserAgent || isSmallViewport;
  };

  const [isMobile, setIsMobile] = useState<boolean>(getInitialMobileState);
  const [isClient, setIsClient] = useState(false);

  // Determine device type on client side only
  useEffect(() => {
    setIsClient(true);

    const checkDevice = () => {
      const newIsMobile = window.innerWidth < breakpoint;
      setIsMobile(newIsMobile);
    };

    // Immediate check on mount
    checkDevice();

    const debouncedResize = debounce(checkDevice, 150);
    window.addEventListener("resize", debouncedResize);

    return () => window.removeEventListener("resize", debouncedResize);
  }, [breakpoint]);

  // Show loading state only during SSR to prevent hydration mismatch
  if (!isClient) {
    // During SSR, show placeholder with mobile-first image if critical
    if (isCritical || isAboveFold) {
      return (
        <HybridBlobImage
          path={mobilePath} // Mobile-first for SSR performance
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

    return (
      <div
        className="animate-pulse bg-gray-200 w-full"
        style={{ aspectRatio: "16/9" }}
        aria-label="Loading image..."
      />
    );
  }

  // Only render ONE image based on actual device detection
  const imagePath = isMobile ? mobilePath : desktopPath;
  const deviceType = isMobile ? "Mobile" : "Desktop";

  // Enhanced alt text with device context for debugging
  const enhancedAlt = `${alt} - ${deviceType} optimized`;

  // Debug logging in development to verify correct path selection
  if (process.env.NODE_ENV === "development") {
    console.log(
      `🖼️ ResponsiveHybridImage: ${deviceType} detected (width: ${typeof window !== "undefined" ? window.innerWidth : "SSR"})`
    );
    console.log(`📱 Mobile path: ${mobilePath}`);
    console.log(`💻 Desktop path: ${desktopPath}`);
    console.log(`✅ Selected path: ${imagePath}`);
    console.log(
      `📐 Aspect ratio: ${isMobile ? mobileAspectRatio : desktopAspectRatio}`
    );
  }

  // Handle different rendering approaches for mobile vs desktop
  if (isMobile && useMobileNaturalRatio) {
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
          fill
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
          fill
          className="w-full h-auto object-contain"
          style={{
            width: "100%",
            height: "auto",
          }}
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
