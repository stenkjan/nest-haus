'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';

interface ClientBlobImageProps extends Omit<ImageProps, 'src'> {
  path: string;
  mobilePath?: string;
  fallbackSrc?: string;
  enableCache?: boolean;
  enableMobileDetection?: boolean; // Only for landing page
  showLoadingSpinner?: boolean;
}

// Enhanced session-based image URL cache with loading state management
class ImageCache {
  private static cache = new Map<string, string>();
  private static pending = new Map<string, Promise<string>>();
  private static loadingStates = new Map<string, boolean>();
  
  static get(path: string): string | null {
    return this.cache.get(path) || null;
  }
  
  static isLoading(path: string): boolean {
    return this.loadingStates.get(path) || false;
  }
  
  static set(path: string, url: string): void {
    this.cache.set(path, url);
    this.loadingStates.set(path, false);
    
    // Store in sessionStorage for persistence
    try {
      sessionStorage.setItem(`nest_img_${path}`, JSON.stringify({
        url,
        timestamp: Date.now()
      }));
    } catch (e) {
      // Handle quota exceeded gracefully
      console.warn('SessionStorage quota exceeded, clearing old entries');
      this.clearOldEntries();
    }
  }
  
  static async getOrFetch(path: string): Promise<string> {
    // Return cached URL if available
    const cached = this.get(path);
    if (cached) return cached;
    
    // Return pending promise if already fetching to prevent duplicate calls
    const pending = this.pending.get(path);
    if (pending) return pending;
    
    // Set loading state
    this.loadingStates.set(path, true);
    
    // Create new fetch promise
    const fetchPromise = this.fetchImageUrl(path);
    this.pending.set(path, fetchPromise);
    
    try {
      const url = await fetchPromise;
      this.set(path, url);
      return url;
    } catch (error) {
      this.loadingStates.set(path, false);
      throw error;
    } finally {
      this.pending.delete(path);
    }
  }
  
  private static async fetchImageUrl(path: string): Promise<string> {
    const response = await fetch(`/api/images?path=${encodeURIComponent(path)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.url) {
      throw new Error('No URL returned');
    }
    
    return data.url;
  }
  
  static loadFromSession(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      const now = Date.now();
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('nest_img_')) {
          const path = key.substring(9); // Remove 'nest_img_' prefix
          const stored = sessionStorage.getItem(key);
          
          if (stored) {
            try {
              const { url, timestamp } = JSON.parse(stored);
              
              // Only use cached URLs that are less than 1 hour old
              if (now - timestamp < oneHour) {
                this.cache.set(path, url);
              } else {
                sessionStorage.removeItem(key);
              }
            } catch (e) {
              sessionStorage.removeItem(key);
            }
          }
        }
      }
    } catch (e) {
      // Handle gracefully
    }
  }
  
  private static clearOldEntries(): void {
    try {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('nest_img_')) {
          keys.push(key);
        }
      }
      
      // Remove oldest entries (keep only most recent 50)
      if (keys.length > 50) {
        const toRemove = keys.slice(0, keys.length - 50);
        toRemove.forEach(key => sessionStorage.removeItem(key));
      }
    } catch (e) {
      // Handle gracefully
    }
  }
}

export default function ClientBlobImage({
  path,
  mobilePath,
  fallbackSrc = '/api/placeholder/400/300',
  enableCache = true,
  enableMobileDetection = false, // Only enable for landing page
  showLoadingSpinner = false,
  alt,
  width,
  height,
  fill,
  ...props
}: ClientBlobImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  const loadingRef = useRef<boolean>(false);

  // Mobile detection - only if explicitly enabled (landing page)
  useEffect(() => {
    if (!enableMobileDetection) return;
    
    const checkMobile = () => {
      if (mountedRef.current) {
        setIsMobile(window.innerWidth < 768);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [enableMobileDetection]);

  // Load cache from session on mount - only once
  useEffect(() => {
    if (enableCache) {
      ImageCache.loadFromSession();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [enableCache]);

  // Determine which path to use - only consider mobile if detection is enabled
  const targetPath = useMemo(() => {
    if (enableMobileDetection && isMobile && mobilePath) {
      return mobilePath;
    }
    return path;
  }, [enableMobileDetection, isMobile, mobilePath, path]);

  // Optimized image loading with duplicate prevention
  const loadImage = useCallback(async (pathToLoad: string) => {
    // Prevent duplicate loading
    if (loadingRef.current || !pathToLoad || pathToLoad === 'undefined' || pathToLoad === '') {
      return;
    }

    // Check if already cached and set immediately
    if (enableCache) {
      const cached = ImageCache.get(pathToLoad);
      if (cached && mountedRef.current) {
        setImageSrc(cached);
        setIsLoading(false);
        setError(false);
        return;
      }
      
      // Check if currently loading to prevent duplicates
      if (ImageCache.isLoading(pathToLoad)) {
        return;
      }
    }

    loadingRef.current = true;
    
    try {
      if (mountedRef.current) {
        setIsLoading(true);
        setError(false);
      }
      
      let imageUrl: string;
      
      if (enableCache) {
        imageUrl = await ImageCache.getOrFetch(pathToLoad);
      } else {
        const response = await fetch(`/api/images?path=${encodeURIComponent(pathToLoad)}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        imageUrl = data.url;
      }
      
      if (mountedRef.current) {
        setImageSrc(imageUrl);
        setError(false);
      }
    } catch (err) {
      console.error('Error loading image:', err);
      if (mountedRef.current) {
        setError(true);
        setImageSrc(fallbackSrc);
      }
    } finally {
      loadingRef.current = false;
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [enableCache, fallbackSrc]);

  // Load image when target path changes
  useEffect(() => {
    if (targetPath) {
      loadImage(targetPath);
    } else {
      setImageSrc(fallbackSrc);
      setIsLoading(false);
    }
  }, [targetPath, loadImage, fallbackSrc]);

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageSrc}
        alt={alt || 'NEST-Haus Image'}
        {...(fill ? { fill: true } : { width: width || 400, height: height || 300 })}
        {...props}
        style={{
          ...props.style,
          opacity: isLoading ? 0.8 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}
        onError={() => {
          if (mountedRef.current) {
            setError(true);
            setImageSrc(fallbackSrc);
          }
        }}
      />
      
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
} 