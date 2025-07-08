"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import Image, { ImageProps } from "next/image";

interface ClientBlobImageProps extends Omit<ImageProps, "src"> {
  path: string;
  mobilePath?: string;
  fallbackSrc?: string;
  enableCache?: boolean;
  enableMobileDetection?: boolean; // Only for landing page
  showLoadingSpinner?: boolean;
}

// Enhanced session-based image URL cache with loading state management and performance monitoring
class ImageCache {
  private static cache = new Map<string, string>();
  private static pending = new Map<string, Promise<string>>();
  private static loadingStates = new Map<string, boolean>();
  private static requestCounts = new Map<string, number>();

  static get(path: string): string | null {
    const cached = this.cache.get(path);
    if (cached) {
      // Track cache hit for performance monitoring
      if (process.env.NODE_ENV === "development") {
        console.debug(`🎯 Cache HIT: ${path}`);
      }
    }
    return cached || null;
  }

  static isLoading(path: string): boolean {
    return this.loadingStates.get(path) || false;
  }

  static set(path: string, url: string): void {
    this.cache.set(path, url);
    this.loadingStates.set(path, false);

    // Store in sessionStorage for persistence
    try {
      sessionStorage.setItem(
        `nest_img_${path}`,
        JSON.stringify({
          url,
          timestamp: Date.now(),
        })
      );
    } catch {
      // Handle quota exceeded gracefully
      console.warn("SessionStorage quota exceeded, clearing old entries");
      this.clearOldEntries();
    }
  }

  static async getOrFetch(path: string): Promise<string> {
    // Track request count for performance monitoring
    const currentCount = this.requestCounts.get(path) || 0;
    this.requestCounts.set(path, currentCount + 1);

    // Warn about excessive requests in development
    if (process.env.NODE_ENV === "development" && currentCount > 2) {
      console.warn(
        `🚨 PERFORMANCE WARNING: Image "${path}" requested ${currentCount + 1} times! Possible render loop or missing memoization.`
      );
    }

    // Return cached URL if available - PREVENT REDUNDANT REQUESTS
    const cached = this.get(path);
    if (cached) return cached;

    // Return pending promise if already fetching to prevent duplicate calls - CRITICAL FIX
    const pending = this.pending.get(path);
    if (pending) {
      if (process.env.NODE_ENV === "development") {
        console.debug(`⏳ Request already pending for: ${path}`);
      }
      return pending;
    }

    // Set loading state
    this.loadingStates.set(path, true);

    // Create new fetch promise
    const fetchPromise = this.fetchImageUrl(path);
    this.pending.set(path, fetchPromise);

    try {
      const url = await fetchPromise;
      this.set(path, url);
      if (process.env.NODE_ENV === "development") {
        console.debug(
          `🖼️ Successfully loaded: ${path} -> ${url.substring(0, 50)}...`
        );
      }
      return url;
    } catch (error) {
      this.loadingStates.set(path, false);
      if (process.env.NODE_ENV === "development") {
        console.error(`❌ Failed to load image: ${path}`, error);
      }
      throw error;
    } finally {
      this.pending.delete(path);
    }
  }

  private static async fetchImageUrl(path: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      // IMPROVED: Better URL encoding for German characters (fixes image 177 issue)
      const encodedPath = encodeURIComponent(path);
      const response = await fetch(`/api/images?path=${encodedPath}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.url) {
        throw new Error("Image URL not found in response");
      }

      // DEBUG: Log successful image loading for German characters
      if (process.env.NODE_ENV === "development" && path.includes("177")) {
        console.log(`🖼️ Successfully loaded image 177: ${path} -> ${data.url}`);
      }

      return data.url;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }

      // DEBUG: Log image loading failures for troubleshooting
      if (process.env.NODE_ENV === "development") {
        console.error(`🖼️ Failed to load image: ${path}`, error);
      }

      throw error;
    }
  }

  static loadFromSession(): void {
    if (typeof window === "undefined") return;

    try {
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      const now = Date.now();

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith("nest_img_")) {
          const path = key.substring(9); // Remove 'nest_img_' prefix
          const stored = sessionStorage.getItem(key);

          if (stored) {
            try {
              const { url, timestamp } = JSON.parse(stored);

              // Only use cached URLs that are less than 1 hour old
              if (now - timestamp < oneHour) {
                this.cache.set(path, url);
                if (process.env.NODE_ENV === "development") {
                  console.debug(`💾 Restored from session: ${path}`);
                }
              } else {
                sessionStorage.removeItem(key);
              }
            } catch {
              sessionStorage.removeItem(key);
            }
          }
        }
      }
    } catch {
      // Handle gracefully
    }
  }

  private static clearOldEntries(): void {
    try {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith("nest_img_")) {
          keys.push(key);
        }
      }

      // Remove oldest entries (keep only most recent 50)
      if (keys.length > 50) {
        const toRemove = keys.slice(0, keys.length - 50);
        toRemove.forEach((key) => sessionStorage.removeItem(key));
      }
    } catch {
      // Handle gracefully
    }
  }

  // Performance monitoring methods
  static getPerformanceStats(): {
    cacheSize: number;
    requestCounts: Record<string, number>;
    totalRequests: number;
    duplicateRequests: number;
  } {
    const requestCounts: Record<string, number> = {};
    let totalRequests = 0;
    let duplicateRequests = 0;

    this.requestCounts.forEach((count, path) => {
      requestCounts[path] = count;
      totalRequests += count;
      if (count > 1) {
        duplicateRequests += count - 1;
      }
    });

    return {
      cacheSize: this.cache.size,
      requestCounts,
      totalRequests,
      duplicateRequests,
    };
  }

  static reset(): void {
    this.cache.clear();
    this.pending.clear();
    this.loadingStates.clear();
    this.requestCounts.clear();
  }

  // Clear session storage cache as well
  static clearSessionStorage(): void {
    if (typeof window === "undefined") return;

    try {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith("nest_img_")) {
          keys.push(key);
        }
      }

      keys.forEach((key) => sessionStorage.removeItem(key));
      console.log(
        `🗑️ Cleared ${keys.length} cached image URLs from session storage`
      );
    } catch {
      // Handle gracefully
    }
  }

  // Clear all caches (memory + session storage)
  static clearAllCaches(): void {
    this.reset();
    this.clearSessionStorage();
    console.log("🗑️ Cleared all image caches (memory + session storage)");
  }
}

export default function ClientBlobImage({
  path,
  mobilePath,
  fallbackSrc = "/api/placeholder/1200/800?style=nest&text=Loading...",
  enableCache = true,
  enableMobileDetection = false, // Only enable for landing page
  showLoadingSpinner = false,
  alt,
  width,
  height,
  fill,
  sizes = "(min-width: 1024px) 70vw, 100vw", // Default responsive sizes for configurator
  className,
  style,
  quality,
  priority,
  loading,
  placeholder,
  blurDataURL,
  unoptimized,
  onLoad,
  onError,
  ...props
}: ClientBlobImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  const lastLoadedPathRef = useRef<string>("");

  // Mobile detection - only if explicitly enabled (landing page)
  useEffect(() => {
    if (!enableMobileDetection) return;

    const checkMobile = () => {
      if (mountedRef.current) {
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [enableMobileDetection]);

  // Load cache from session on mount - only once
  useEffect(() => {
    if (enableCache) {
      ImageCache.loadFromSession();
    }

    // Expose cache clearing function globally for debugging
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      (
        window as typeof window & { clearImageCache?: () => void }
      ).clearImageCache = ImageCache.clearAllCaches;
    }

    return () => {
      mountedRef.current = false;
    };
  }, [enableCache]);

  // Add path sanitization method for security
  const sanitizePath = useCallback((inputPath: string): string => {
    if (!inputPath) return "";

    // Remove any potentially dangerous characters, keep only alphanumeric, hyphens, underscores, and forward slashes
    const sanitized = inputPath.replace(/[^a-zA-Z0-9\-_/]/g, "");

    // Ensure path doesn't start with / or contain ../ to prevent directory traversal
    return sanitized.replace(/^\/+|\.\.\/+/g, "");
  }, []);

  // Determine which path to use - only consider mobile if detection is enabled
  const effectivePath = useMemo(() => {
    // Validate and sanitize path input
    const sanitizedPath = sanitizePath(path);
    const sanitizedMobilePath = mobilePath ? sanitizePath(mobilePath) : null;

    if (enableMobileDetection && isMobile && sanitizedMobilePath) {
      return sanitizedMobilePath;
    }
    return sanitizedPath;
  }, [path, mobilePath, isMobile, enableMobileDetection, sanitizePath]);

  // CRITICAL FIX: Prevent re-fetching the same image
  const shouldFetchImage = useMemo(() => {
    return effectivePath !== lastLoadedPathRef.current;
  }, [effectivePath]);

  // Load image with proper error handling and caching
  useEffect(() => {
    if (!effectivePath || !mountedRef.current || !shouldFetchImage) {
      return;
    }

    // Performance monitoring
    if (process.env.NODE_ENV === "development") {
      console.debug(`🔄 ClientBlobImage loading: ${effectivePath}`);
    }

    let cancelled = false;

    const loadImage = async () => {
      try {
        if (enableCache) {
          // Check cache first
          const cached = ImageCache.get(effectivePath);
          if (cached && mountedRef.current && !cancelled) {
            setImageSrc(cached);
            setError(null);
            lastLoadedPathRef.current = effectivePath;
            return;
          }
        }

        // Set loading state
        if (mountedRef.current && !cancelled) {
          setIsLoading(true);
          setError(null);
        }

        // Fetch image URL
        let imageUrl: string;
        try {
          imageUrl = enableCache
            ? await ImageCache.getOrFetch(effectivePath)
            : await fetchImageDirect(effectivePath);
        } catch (mobileError) {
          // If mobile image fails and we're using mobile path, try desktop fallback
          if (
            enableMobileDetection &&
            isMobile &&
            mobilePath &&
            effectivePath === sanitizePath(mobilePath)
          ) {
            console.warn(
              `Mobile image failed, falling back to desktop: ${effectivePath} -> ${sanitizePath(path)}`
            );
            const desktopPath = sanitizePath(path);
            imageUrl = enableCache
              ? await ImageCache.getOrFetch(desktopPath)
              : await fetchImageDirect(desktopPath);
          } else {
            throw mobileError;
          }
        }

        // Update state if component is still mounted and request wasn't cancelled
        if (mountedRef.current && !cancelled) {
          setImageSrc(imageUrl);
          setIsLoading(false);
          setError(null);
          lastLoadedPathRef.current = effectivePath;
        }
      } catch (err) {
        if (mountedRef.current && !cancelled) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to load image";
          setError(errorMessage);
          setImageSrc(fallbackSrc);
          setIsLoading(false);

          if (process.env.NODE_ENV === "development") {
            console.error(
              `ClientBlobImage error loading ${effectivePath}:`,
              errorMessage
            );
          }
        }
      }
    };

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [
    effectivePath,
    enableCache,
    fallbackSrc,
    shouldFetchImage,
    enableMobileDetection,
    isMobile,
    mobilePath,
    path,
    sanitizePath,
  ]);

  // Direct fetch function (bypass cache)
  const fetchImageDirect = async (imagePath: string): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(
        `/api/images?path=${encodeURIComponent(imagePath)}`,
        {
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (!data.url) {
        throw new Error("No URL in response");
      }
      return data.url;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  };

  // Handle Next.js Image onLoad
  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      if (mountedRef.current) {
        setIsLoading(false);
        onLoad?.(event);
      }
    },
    [onLoad]
  );

  // Handle Next.js Image onError
  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      if (mountedRef.current) {
        setIsLoading(false);

        // If this was a mobile image that failed, try desktop fallback
        if (
          enableMobileDetection &&
          isMobile &&
          mobilePath &&
          effectivePath === sanitizePath(mobilePath)
        ) {
          console.warn(
            "Mobile image failed at Next.js level, falling back to desktop image"
          );
          const desktopPath = sanitizePath(path);

          // Try to load desktop image directly
          const loadDesktopFallback = async () => {
            try {
              const desktopUrl = enableCache
                ? await ImageCache.getOrFetch(desktopPath)
                : await fetchImageDirect(desktopPath);

              if (mountedRef.current) {
                setImageSrc(desktopUrl);
                setError(null);
                lastLoadedPathRef.current = desktopPath;
              }
            } catch {
              if (mountedRef.current) {
                setError("Both mobile and desktop images failed");
                setImageSrc(fallbackSrc);
              }
            }
          };

          loadDesktopFallback();
        } else {
          setError("Image failed to load");
        }

        onError?.(event);
      }
    },
    [
      onError,
      enableMobileDetection,
      isMobile,
      mobilePath,
      effectivePath,
      sanitizePath,
      path,
      enableCache,
      fallbackSrc,
    ]
  );

  return (
    <>
      {/* Loading spinner */}
      {showLoadingSpinner && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Main image */}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        className={className}
        style={style}
        quality={quality}
        priority={priority}
        loading={loading}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        unoptimized={unoptimized}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Error display in development */}
      {process.env.NODE_ENV === "development" && error && (
        <div className="absolute inset-0 bg-red-100 border border-red-300 flex items-center justify-center text-red-700 text-xs p-2 z-20">
          Error: {error}
        </div>
      )}
    </>
  );
}
