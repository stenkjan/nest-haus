'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getMobilePath } from '../../../lib/image-utils';
import { toFilesystemPath } from '../../../lib/image-name-mapper';

// Add type declaration for deviceMemory
declare global {
  interface Navigator {
    deviceMemory?: number;
  }
}

// Remote logging helper
function remoteLog(data: any) {
  // Comment out remote logging to reduce console spam
  /*
  try {
    fetch('/api/debug-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(e => console.error('Failed to send remote log', e));
  } catch (error) {
    // Silently fail if remote logging fails
  }
  */
}

export interface ClientBlobImageProps extends Omit<ImageProps, 'src' | 'onLoad' | 'onError'> {
  path: string;
  fallbackSrc?: string;
  mobilePath?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (error: Error) => void;
  strict?: boolean;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  disableMobilePath?: boolean;
}

export const ClientBlobImage: React.FC<ClientBlobImageProps> = ({
  path,
  fallbackSrc = '/api/placeholder/400/300',
  mobilePath,
  alt,
  width,
  height,
  onLoad,
  onError,
  strict = true,
  className = '',
  quality = 85,
  sizes = '100vw',
  priority = false,
  fill,
  disableMobilePath = false,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;
  // Add default general fallback images for different types
  const GLOBAL_FALLBACKS = {
    exterior: '/assets/fallbacks/exterior-default.jpg',
    interior: '/assets/fallbacks/interior-default.jpg',
    stirnseite: '/assets/fallbacks/stirnseite-default.jpg',
    holzlattung: '/assets/fallbacks/holzlattung-default.jpg',
    trapezblech: '/assets/fallbacks/trapezblech-default.jpg',
    plattenschwarz: '/assets/fallbacks/exterior-default.jpg',
    plattenweiss: '/assets/fallbacks/exterior-default.jpg',
    holznatur: '/assets/fallbacks/interior-default.jpg',
    holzweiss: '/assets/fallbacks/interior-default.jpg',
    eiche: '/assets/fallbacks/interior-default.jpg',
    default: fallbackSrc
  };

  // Try to determine image type from path to use appropriate fallback
  const getTypedFallback = (imagePath: string): string => {
    if (!imagePath) return GLOBAL_FALLBACKS.default;

    // Material/exterior type detection
    if (imagePath.includes('trapezblech')) {
      return GLOBAL_FALLBACKS.trapezblech;
    }
    
    if (imagePath.includes('holzlattung')) {
      return GLOBAL_FALLBACKS.holzlattung;
    }
    
    if (imagePath.includes('plattenschwarz')) {
      return GLOBAL_FALLBACKS.plattenschwarz;
    }
    
    if (imagePath.includes('plattenweiss')) {
      return GLOBAL_FALLBACKS.plattenweiss;
    }
    
    // Interior materials
    if (imagePath.includes('holznatur')) {
      return GLOBAL_FALLBACKS.holznatur;
    }
    
    if (imagePath.includes('holzweiss')) {
      return GLOBAL_FALLBACKS.holzweiss;
    }
    
    if (imagePath.includes('eiche')) {
      return GLOBAL_FALLBACKS.eiche;
    }
    
    // View type detection
    if (imagePath.includes('interior') || 
        imagePath.includes('kalkstein') ||
        imagePath.includes('parkett') ||
        imagePath.includes('granit')) {
      return GLOBAL_FALLBACKS.interior;
    }
    
    if (imagePath.includes('stirnseite')) {
      return GLOBAL_FALLBACKS.stirnseite;
    }
    
    // Default to exterior fallback for other cases
    return GLOBAL_FALLBACKS.exterior;
  };

  // Modified mobile detection with reduced logging
  useEffect(() => {
    let isMounted = true;

    function detectMobile() {
      // Check if we're on a real mobile device
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
      
      // Mobile media query for responsive design detection
      const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
      
      // Check for touch capabilities (strong signal of mobile)
      const hasTouchScreen = (
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0 || 
        ('matchMedia' in window && window.matchMedia('(pointer: coarse)').matches)
      );
      
      // Check viewport width
      const isSmallViewport = window.innerWidth < 768;
      
      // Check orientation API (only available on mobile)
      const hasOrientationAPI = typeof window.orientation !== 'undefined' || 
                               'orientation' in window || 
                               navigator.userAgent.indexOf('Mobile') !== -1;
      
      // Check for device memory limitations
      const hasLimitedMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
      
      // Combine mobile features into a single flag
      const hasMobileFeatures = hasTouchScreen || hasOrientationAPI || isSmallViewport || hasLimitedMemory;
      
      // Use a combination of signals, with priority on hardware indicators
      return (
        (isMobileDevice && (hasTouchScreen || hasOrientationAPI)) || 
        (hasTouchScreen && hasOrientationAPI) ||
        (isMobileDevice && hasMobileFeatures && isSmallViewport)
      );
    }

    // Initial detection
    const initialMobileStatus = detectMobile();
    if (isMounted) {
      setIsMobile(initialMobileStatus);
    }

    // Set up orientation change listener (only triggers on real mobile devices)
    const handleOrientationChange = () => {
      if (isMounted) {
        setIsMobile(true);
      }
    };
    
    // Set up resize listener with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isMounted) {
          const newMobileStatus = detectMobile();
          setIsMobile(newMobileStatus);
        }
      }, 200); // Debounce resize events
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      clearTimeout(resizeTimeout);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array since we only want to set up listeners once

  // Image loading logic
  useEffect(() => {
    const fetchImage = async () => {
      // Basic validation - if no path, use fallback
      if (!path || path === 'undefined' || path === '{}' || path === 'null') {
        console.warn('Invalid image path provided:', path);
        setImageSrc(fallbackSrc);
        setLoading(false);
        setError(false);
        return;
      }
      
      // Safety check - if path is empty or invalid, use typed fallback
      if (!path || path === undefined || path === 'undefined' || path === '{}' || path === 'null' || 
          path === 'undefined_undefined' || path.includes('_undefined_')) {
        console.warn('Invalid image path provided:', path);
        setImageSrc(getTypedFallback(path));
        setLoading(false);
        setError(false);
        return;
      }
      
      if (retryCount > MAX_RETRIES) {
        console.warn('Max retries reached for path:', path);
        setImageSrc(getTypedFallback(path));
        setLoading(false);
        setError(false);
        return;
      }
      
      // Standard image loading for all path types
      try {
        setLoading(true);
        
        // Determine which path to use based on mobile status and disableMobilePath prop
        let imagePath = path;
        const shouldUseMobile = !disableMobilePath && (isMobile || window.innerWidth < 768);
        
        if (shouldUseMobile) {
          imagePath = mobilePath || getMobilePath(path);
        }
        
        // Normalize path by removing any existing extension
        const basePath = imagePath.replace(/\.(jpg|jpeg|png|mp4)$/i, '');
        
        // Get the base URL for API calls
        const baseUrl = typeof window === 'undefined' 
          ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          : window.location.origin;
        
        // Try each extension separately with debug mode for more information
        let response = null;
        let successfulPath = '';
        const extensions = ['.jpg', '.jpeg', '.png'];
        
        for (const ext of extensions) {
            const pathWithExt = `${basePath}${ext}`;
          // Enable debug for trapezblech paths to understand why they're failing
          const isDebug = path.includes('trapezblech') || retryCount > 0;
          try {
            response = await fetch(`${baseUrl}/api/images?path=${encodeURIComponent(pathWithExt)}&strict=${strict}&debug=${isDebug}`);
            
            if (response.ok) {
              successfulPath = pathWithExt;
              break;
            } else if (isDebug) {
              // Log response for debugging
              const respData = await response.clone().json();
              console.debug(`Debug - Failed to load ${pathWithExt}:`, respData);
            }
          } catch (fetchError) {
            console.error(`Error fetching ${pathWithExt}:`, fetchError);
          }
        }
        
        // If not found, try mp4 as last resort
        if (!response?.ok) {
          const mp4Path = `${basePath}.mp4`;
          response = await fetch(`${baseUrl}/api/images?path=${encodeURIComponent(mp4Path)}&strict=${strict}&debug=false`);
          if (response.ok) successfulPath = mp4Path;
        }
        
        if (!response?.ok) {
          // Try with the exact path as a last resort (no extension added)
          response = await fetch(`${baseUrl}/api/images?path=${encodeURIComponent(imagePath)}&strict=${strict}&debug=true`);
          if (response.ok) successfulPath = imagePath;
        }
        
        if (!response?.ok) {
          throw new Error('Image not found');
        }
        
        const data = await response.json();
        
        if (!data.url) {
          console.error(`No image URL returned for path: ${basePath}`, data);
          throw new Error(`No image URL returned for path: ${basePath}`);
        }
        
        // Log successful image loading for debugging
        if (path.includes('trapezblech')) {
          console.debug(`Successfully loaded image: ${successfulPath} -> ${data.url}`);
        }
        
        setImageSrc(data.url);
        setError(false);
        
        if (onLoad) onLoad({} as React.SyntheticEvent<HTMLImageElement>);
      } catch (error) {
        console.error(`Error loading image: ${path}`, error);
        setError(true);
        
        // Add immediate retry logic for trapezblech images
        if (path.includes('trapezblech') && retryCount < MAX_RETRIES) {
          console.log(`Retrying trapezblech image: ${path}, attempt ${retryCount + 1}`);
          setRetryCount(prev => prev + 1);
          return; // Will trigger another fetch due to retryCount changing
        }
        
        // Set fallback after max retries
        setImageSrc(getTypedFallback(path));
        
        if (onError && error instanceof Error) onError(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImage();
  }, [path, mobilePath, isMobile, strict, onLoad, onError, retryCount, disableMobilePath]);

  // Image error handling
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Error loading image on client:', path);
    setError(true);
    
    // Use typed fallback on image load error
    setImageSrc(getTypedFallback(path));
    
    if (onError) onError(new Error(`Failed to load image: ${path}`));
  };

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageSrc}
        alt={alt || "Image"}
        width={width}
        height={height}
        fill={fill}
        quality={quality}
        sizes={sizes}
        priority={priority}
        {...props}
        className={`${className} ${fill ? 'object-cover' : 'object-contain'}`}
        style={{
          ...props.style,
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        onError={handleImageError}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};