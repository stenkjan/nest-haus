'use client';

import { useEffect, useState } from 'react';

interface ViewportDimensions {
  height: number;
  width: number;
  isIOS: boolean;
  isIOSSafari: boolean;
}

/**
 * Custom hook for iOS Safari stable viewport dimensions
 * Prevents address bar show/hide from affecting dialog sizing
 * 
 * USAGE: Apply to dialogs only, doesn't affect main configurator
 */
export function useIOSViewport(): ViewportDimensions {
  const [dimensions, setDimensions] = useState<ViewportDimensions>({
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    width: typeof window !== 'undefined' ? window.innerWidth : 400,
    isIOS: false,
    isIOSSafari: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isIOSSafari = isIOS && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

    // Function to update viewport dimensions
    const updateDimensions = () => {
      let height = window.innerHeight;
      let width = window.innerWidth;

      // For iOS Safari, use Visual Viewport API if available for more stable measurements
      if (isIOSSafari && window.visualViewport) {
        height = window.visualViewport.height;
        width = window.visualViewport.width;
      }

      setDimensions({
        height,
        width,
        isIOS,
        isIOSSafari
      });
    };

    // Initial measurement
    updateDimensions();

    // For iOS Safari with Visual Viewport API
    if (isIOSSafari && window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateDimensions);
      window.visualViewport.addEventListener('scroll', updateDimensions);
    } else {
      // Fallback for other devices/browsers
      window.addEventListener('resize', updateDimensions);
      window.addEventListener('orientationchange', updateDimensions);
    }

    // Cleanup
    return () => {
      if (isIOSSafari && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateDimensions);
        window.visualViewport.removeEventListener('scroll', updateDimensions);
      } else {
        window.removeEventListener('resize', updateDimensions);
        window.removeEventListener('orientationchange', updateDimensions);
      }
    };
  }, []);

  return dimensions;
}

/**
 * Get CSS custom properties for stable iOS viewport
 * Apply these to dialog containers to prevent address bar issues
 */
export function getIOSViewportStyles(viewport: ViewportDimensions) {
  if (!viewport.isIOSSafari) {
    // Return empty object for non-iOS devices - use regular CSS
    return {};
  }

  return {
    '--ios-vh': `${viewport.height}px`,
    '--ios-vw': `${viewport.width}px`,
    '--ios-5vh': `${viewport.height * 0.05}px`,
    '--ios-10vh': `${viewport.height * 0.1}px`,
    '--ios-85vh': `${viewport.height * 0.85}px`,
    '--ios-90vh': `${viewport.height * 0.9}px`,
  } as React.CSSProperties;
} 