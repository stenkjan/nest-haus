"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePingPongVideo } from "@/hooks/usePingPongVideo";

interface ClientBlobVideoProps {
  path: string; // Blob path or direct URL
  className?: string; // CSS styling
  autoPlay?: boolean; // Auto-start playback
  loop?: boolean; // Standard looping
  muted?: boolean; // Audio state
  playsInline?: boolean; // Mobile optimization
  controls?: boolean; // Show/hide controls
  onLoad?: () => void; // Success callback
  onError?: (error: Error) => void; // Error callback
  reversePlayback?: boolean; // Enable ping-pong effect
  reverseSpeedMultiplier?: number; // How much slower reverse should be (default: 3x slower)
  quality?: number; // Video quality (not used but for consistency)
  priority?: boolean; // For consistency with image components
  fallbackSrc?: string; // Fallback video URL
  enableCache?: boolean; // Enable URL caching
}

// Enhanced session-based video URL cache
class VideoCache {
  private static cache = new Map<string, string>();
  private static pending = new Map<string, Promise<string>>();
  private static loadingStates = new Map<string, boolean>();

  static get(path: string): string | null {
    const cached = this.cache.get(path);
    if (cached && process.env.NODE_ENV === "development") {
      console.debug(`🎯 Video Cache HIT: ${path}`);
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
        `nest_video_${path}`,
        JSON.stringify({ url, timestamp: Date.now() })
      );
    } catch {
      // Silently handle storage errors
    }
  }

  static async fetch(path: string): Promise<string> {
    // Check cache first
    const cached = this.get(path);
    if (cached) return cached;

    // Check if already loading
    const pending = this.pending.get(path);
    if (pending) return pending;

    // Start loading
    this.loadingStates.set(path, true);

    const promise = this.fetchVideoUrl(path);
    this.pending.set(path, promise);

    try {
      const url = await promise;
      this.set(path, url);
      this.pending.delete(path);
      return url;
    } catch (error) {
      this.loadingStates.set(path, false);
      this.pending.delete(path);
      throw error;
    }
  }

  private static async fetchVideoUrl(path: string): Promise<string> {
    // Direct blob URL - use immediately
    if (path.includes("blob.vercel-storage.com")) {
      return path;
    }

    const maxRetries = 3;
    const baseTimeout = 10000; // Start with 10 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutMs = baseTimeout * attempt; // Progressive timeout: 10s, 20s, 30s
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        if (process.env.NODE_ENV === "development" && attempt > 1) {
          console.log(
            `🔄 Retry attempt ${attempt}/${maxRetries} for video: ${path} (timeout: ${timeoutMs}ms)`
          );
        }

        // API resolution for path-based access
        const response = await fetch(
          `/api/images?path=${encodeURIComponent(path)}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch video URL: ${response.status}`);
        }

        const data = await response.json();
        if (!data.url) {
          throw new Error("No video URL returned");
        }

        if (process.env.NODE_ENV === "development" && attempt > 1) {
          console.log(
            `✅ Successfully loaded video: ${path} -> ${data.url.substring(
              0,
              50
            )}... (attempt ${attempt})`
          );
        }

        return data.url;
      } catch (error) {
        clearTimeout(timeoutId);

        const isTimeoutError =
          error instanceof Error && error.name === "AbortError";
        const isNetworkError =
          error instanceof TypeError && error.message.includes("fetch");

        // If this is the last attempt or a non-retryable error, throw
        if (attempt === maxRetries || (!isTimeoutError && !isNetworkError)) {
          if (isTimeoutError) {
            if (process.env.NODE_ENV === "development") {
              console.error(
                `⏰ Video request timeout after ${timeoutMs}ms: ${path}`
              );
            }
            throw new Error(
              `Video request timeout after ${maxRetries} attempts (max ${timeoutMs}ms)`
            );
          }

          if (process.env.NODE_ENV === "development") {
            console.error(
              `❌ Failed to load video after ${attempt} attempts: ${path}`,
              error
            );
          }
          throw error;
        }

        // Wait before retry with exponential backoff
        const backoffMs = 1000 * attempt; // 1s, 2s, 3s
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `⚠️ Video attempt ${attempt} failed for ${path}, retrying in ${backoffMs}ms...`,
            error instanceof Error ? error.message : error
          );
        }
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }

    // This should never be reached due to the throw in the loop
    throw new Error(
      `Failed to load video after ${maxRetries} attempts: ${path}`
    );
  }

  static clear(): void {
    this.cache.clear();
    this.pending.clear();
    this.loadingStates.clear();
  }

  static preload(path: string): void {
    if (!this.get(path) && !this.pending.get(path)) {
      this.fetch(path).catch(() => {
        // Silently handle preload errors
      });
    }
  }
}

const ClientBlobVideo: React.FC<ClientBlobVideoProps> = ({
  path,
  className = "",
  autoPlay = false,
  loop = false,
  muted = true, // Default to muted for autoplay compatibility
  playsInline = true,
  controls = false,
  onLoad,
  onError,
  reversePlayback = false,
  reverseSpeedMultiplier = 3, // Default: 3x slower than forward
  fallbackSrc,
  enableCache = true,
}) => {
  // URL Resolution State
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use the ping-pong video hook for reverse playback functionality
  const {
    isPlayingReverse,
    handleVideoEnded: pingPongHandleVideoEnded,
    handleLoadedMetadata: pingPongHandleLoadedMetadata,
    videoRef,
  } = usePingPongVideo({
    reversePlayback,
    reverseSpeedMultiplier,
  });

  // Load video URL
  const loadVideo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url: string;

      if (enableCache) {
        url = await VideoCache.fetch(path);
      } else {
        // Direct fetch without caching
        if (path.includes("blob.vercel-storage.com")) {
          url = path;
        } else {
          const response = await fetch(
            `/api/images?path=${encodeURIComponent(path)}`
          );
          if (!response.ok) throw new Error("Failed to fetch video URL");
          const data = await response.json();
          if (!data.url) throw new Error("No video URL returned");
          url = data.url;
        }
      }

      setVideoUrl(url);

      if (onLoad) {
        onLoad();
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to load video");
      setError(error);

      // Try fallback if available
      if (fallbackSrc) {
        setVideoUrl(fallbackSrc);
      }

      if (onError) {
        onError(error);
      }

      console.error("🎥 Error loading video:", error);
    } finally {
      setLoading(false);
    }
  }, [
    path,
    enableCache,
    fallbackSrc,
    onLoad,
    onError,
    autoPlay,
    reversePlayback,
  ]);

  // Handle video end - delegate to ping-pong hook or handle standard loop
  const handleVideoEnded = useCallback(() => {
    const video = videoRef.current;

    if (reversePlayback) {
      // Delegate to ping-pong hook for reverse playback
      pingPongHandleVideoEnded();
    } else if (loop && video) {
      // Standard loop behavior when reversePlayback is disabled

      video.currentTime = 0;
      video.play().catch(() => {
        // Silently handle playback errors
      });
    }
  }, [reversePlayback, loop, pingPongHandleVideoEnded, videoRef]);

  // Handle video metadata loaded - delegate to ping-pong hook
  const handleLoadedMetadata = useCallback(() => {
    pingPongHandleLoadedMetadata();
  }, [pingPongHandleLoadedMetadata, videoRef]);

  // Note: Event listeners are now handled via React props (onEnded, onLoadedMetadata)
  // This is more reliable than addEventListener in React components

  // Load video on mount and path change
  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  // Auto-play setup
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !autoPlay || !videoUrl || loading) {
      return;
    }

    // Small delay to ensure video is ready
    const timeoutId = setTimeout(() => {
      video.play().catch(() => {
        // Silently handle autoplay errors
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [autoPlay, videoUrl, loading, reversePlayback, videoRef]);

  // Note: Animation frame cleanup and debug logging are now handled by the usePingPongVideo hook

  // Show loading state
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ minHeight: "200px" }}
      >
        <div className="text-gray-500 text-sm">Loading video...</div>
      </div>
    );
  }

  // Show error state
  if (error && !videoUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ minHeight: "200px" }}
      >
        <div className="text-gray-500 text-sm">Failed to load video</div>
      </div>
    );
  }

  // Render video with ping-pong support
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className={className}
      autoPlay={false} // Controlled via useEffect for better control
      loop={reversePlayback ? false : loop} // Disable native loop for ping-pong effect
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      style={{
        // Only disable pointer events during reverse playback to prevent user interruption
        pointerEvents: isPlayingReverse && reversePlayback ? "none" : "auto",
      }}
      onEnded={handleVideoEnded}
      onLoadedMetadata={handleLoadedMetadata}
    />
  );
};

// Export cache for external management if needed
export { VideoCache };

export default ClientBlobVideo;
