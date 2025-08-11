"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import ClientBlobVideo from "./ClientBlobVideo";

interface LazyVideoLoaderProps {
  path: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  posterPath?: string; // Optional poster image path
  onLoad?: () => void;
  onError?: (error: Error) => void;
  quality?: number;
  priority?: boolean;
  fallbackSrc?: string;
  enableCache?: boolean;
  rootMargin?: string; // Intersection observer root margin
}

/**
 * LazyVideoLoader - Performance-optimized video component
 *
 * Features:
 * - Intersection Observer for lazy loading
 * - Poster image support
 * - preload="metadata" for better performance
 * - Auto pause when out of view
 * - Connection-aware loading (respects slow connections)
 */
export default function LazyVideoLoader({
  path,
  className = "",
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
  controls = false,
  posterPath,
  onLoad,
  onError,
  priority = false,
  fallbackSrc,
  enableCache = true,
  rootMargin = "50px", // Start loading 50px before entering viewport
}: LazyVideoLoaderProps) {
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Connection-aware loading
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Check connection speed using type-safe approach
    interface NetworkConnection {
      effectiveType?: "2g" | "3g" | "4g" | "slow-2g";
      addEventListener?: (type: string, listener: () => void) => void;
      removeEventListener?: (type: string, listener: () => void) => void;
    }

    const nav = navigator as Navigator & { connection?: NetworkConnection };
    const connection = nav.connection;

    if (connection) {
      const slowTypes = ["slow-2g", "2g"];
      setIsSlowConnection(slowTypes.includes(connection.effectiveType || ""));

      const handleConnectionChange = () => {
        setIsSlowConnection(slowTypes.includes(connection.effectiveType || ""));
      };

      connection.addEventListener?.("change", handleConnectionChange);
      return () =>
        connection.removeEventListener?.("change", handleConnectionChange);
    }

    // Return nothing if no connection API available
    return undefined;
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry.isIntersecting);

        if (entry.isIntersecting && !hasLoaded) {
          // Add delay for slow connections
          const loadDelay = isSlowConnection ? 500 : 100;

          setTimeout(() => {
            setShouldLoad(true);
            setHasLoaded(true);
          }, loadDelay);
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      }
    );

    observer.observe(currentContainer);

    return () => {
      observer.unobserve(currentContainer);
    };
  }, [priority, hasLoaded, isSlowConnection, rootMargin]);

  // Auto pause/play based on visibility for performance
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    if (isInView && !isPlaying) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.warn("Video autoplay failed:", error);
        });
    } else if (!isInView && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isInView, autoPlay, isPlaying]);

  const handleVideoLoad = useCallback(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleVideoError = useCallback(
    (error: Error) => {
      if (onError) onError(error);
    },
    [onError]
  );

  // Show placeholder until video should load
  if (!shouldLoad) {
    return (
      <div
        ref={containerRef}
        className={`${className} flex items-center justify-center bg-gray-900 relative overflow-hidden`}
        style={{ aspectRatio: "16/9" }}
      >
        {posterPath ? (
          <Image
            src={`/api/images?path=${encodeURIComponent(posterPath)}&redirect=true`}
            alt="Video poster"
            fill
            className="object-cover"
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-white/10 rounded-full">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <p className="text-sm opacity-75">Video wird geladen...</p>
          </div>
        )}

        {/* Loading indicator for slow connections */}
        {isSlowConnection && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Optimiert für langsame Verbindung
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <ClientBlobVideo
        path={path}
        className={className}
        autoPlay={false} // We handle autoplay manually for better control
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        onLoad={handleVideoLoad}
        onError={handleVideoError}
        fallbackSrc={fallbackSrc}
        enableCache={enableCache}
      />
    </div>
  );
}
