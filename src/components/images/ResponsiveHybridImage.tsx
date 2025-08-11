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
  ...props
}: ResponsiveHybridImageProps) {
  // Initialize with no assumption - wait for client-side detection
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Determine device type on client side only
  useEffect(() => {
    setIsClient(true);

    const checkDevice = () => {
      // Enhanced mobile detection with user agent + viewport
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUserAgent =
        /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      const isSmallViewport = window.innerWidth < breakpoint;

      const newIsMobile = isMobileUserAgent || isSmallViewport;
      setIsMobile(newIsMobile);

      // Debug logging
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🔄 Device check: ${newIsMobile ? "Mobile" : "Desktop"} (width: ${window.innerWidth}, userAgent: ${isMobileUserAgent ? "mobile" : "desktop"})`
        );
      }
    };

    // Immediate check on mount
    checkDevice();

    const debouncedResize = debounce(checkDevice, 150);
    window.addEventListener("resize", debouncedResize);

    return () => window.removeEventListener("resize", debouncedResize);
  }, [breakpoint]);

  // Show loading state during SSR and until device type is determined
  if (!isClient || isMobile === null) {
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
      `🔍 Mobile has -mobile suffix: ${mobilePath.includes("-mobile")}`
    );
    console.log(
      `🔍 Desktop has NO -mobile suffix: ${!desktopPath.includes("-mobile")}`
    );
    console.log(
      `🎯 Final choice is correct: ${isMobile ? mobilePath.includes("-mobile") : !imagePath.includes("-mobile")}`
    );
    console.log("---");
  }

  return (
    <HybridBlobImage
      path={imagePath}
      alt={enhancedAlt}
      strategy={strategy}
      isAboveFold={isAboveFold}
      isCritical={isCritical}
      isInteractive={isInteractive}
      enableCache={enableCache}
      fallbackSrc={fallbackSrc}
      {...props}
    />
  );
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
