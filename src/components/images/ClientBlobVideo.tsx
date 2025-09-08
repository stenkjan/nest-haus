"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

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
    } catch (error) {
      console.warn("⚠️ Failed to store video URL in sessionStorage:", error);
    }
  }

  static async getOrFetch(path: string): Promise<string> {
    // Check cache first
    const cached = this.get(path);
    if (cached) return cached;

    // Check if already loading
    const existingPromise = this.pending.get(path);
    if (existingPromise) return existingPromise;

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
    try {
      const response = await fetch(
        `/api/images?path=${encodeURIComponent(path)}`
      );
      if (!response.ok) {
        throw new Error(`Failed to resolve video URL: ${response.statusText}`);
      }

      const data = await response.json();
      return data.url || data.fallback;
    } catch (error) {
      console.error(`❌ Failed to fetch video URL for ${path}:`, error);
      throw error;
    }
  }

  static loadFromSession(path: string): boolean {
    try {
      const stored = sessionStorage.getItem(`nest_video_${path}`);
      if (stored) {
        const { url, timestamp } = JSON.parse(stored);
        const isExpired = Date.now() - timestamp > 3600000; // 1 hour TTL

        if (!isExpired) {
          this.cache.set(path, url);
          return true;
        } else {
          sessionStorage.removeItem(`nest_video_${path}`);
        }
      }
    } catch (error) {
      console.warn("⚠️ Failed to load video URL from sessionStorage:", error);
    }
    return false;
  }

  static preload(paths: string[]): void {
    paths.forEach((path) => {
      if (!this.get(path) && !this.isLoading(path)) {
        this.getOrFetch(path).catch(() => {
          // Silently handle preload errors
        });
      }
    });
  }

  static clear(): void {
    this.cache.clear();
    this.pending.clear();
    this.loadingStates.clear();
  }

  static getStats(): { cached: number; loading: number; pending: number } {
    return {
      cached: this.cache.size,
      loading: Array.from(this.loadingStates.values()).filter(Boolean).length,
      pending: this.pending.size,
    };
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
  fallbackSrc,
  enableCache = true,
}) => {
  // URL Resolution State
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Resolve a fallback source that might be a plain path via the same blob API
  const switchToFallback = useCallback(async (): Promise<boolean> => {
    if (!fallbackSrc) return false;
    try {
      if (
        /^(https?:)?\/\//i.test(fallbackSrc) ||
        fallbackSrc.startsWith("data:")
      ) {
        setVideoUrl(fallbackSrc);
        setLoading(false);
        return true;
      }
      const url = await VideoCache.getOrFetch(fallbackSrc);
      setVideoUrl(url);
      setLoading(false);
      return true;
    } catch (e) {
      console.warn("⚠️ Failed to resolve fallback video path:", fallbackSrc, e);
      return false;
    }
  }, [fallbackSrc]);

  // Resolve video URL from blob storage or use direct path
  const resolveVideoUrl = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Try to load from session cache first
      if (enableCache && VideoCache.loadFromSession(path)) {
        const cachedUrl = VideoCache.get(path);
        if (cachedUrl) {
          setVideoUrl(cachedUrl);
          setLoading(false);
          return;
        }
      }

      // Fetch URL from API
      const url = await VideoCache.getOrFetch(path);
      setVideoUrl(url);
      setLoading(false);

      if (process.env.NODE_ENV === "development") {
        console.log(`🎥 Video URL resolved for ${path}:`, url);
      }
    } catch (err) {
      console.error(`❌ Failed to resolve video URL for ${path}:`, err);

      // Use fallback if available (resolve if it's a path)
      const switched = await switchToFallback();
      if (!switched) {
        const error = new Error(`Failed to resolve video URL for ${path}`);
        setError(error);
        setLoading(false);

        if (onError) {
          onError(error);
        }
      }
    }
  }, [path, enableCache, onError, switchToFallback]);

  // Load video URL on mount and path change
  useEffect(() => {
    resolveVideoUrl();
  }, [resolveVideoUrl]);

  // Handle successful video load
  const handleVideoLoad = useCallback(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // Handle video errors
  const handleVideoError = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      const videoError = e.currentTarget.error;
      const errorMessage = videoError?.message || "Unknown error";
      const videoSrc = e.currentTarget.src;

      console.error("🎥 Video error details:", {
        message: errorMessage,
        code: videoError?.code,
        src: videoSrc,
        path: path,
        networkState: e.currentTarget.networkState,
        readyState: e.currentTarget.readyState,
      });

      // Check if this is a DEMUXER_ERROR_COULD_NOT_OPEN error
      if (errorMessage.includes("DEMUXER_ERROR_COULD_NOT_OPEN")) {
        console.warn(
          "🔧 DEMUXER error detected - video file may be corrupted or inaccessible"
        );

        // Try fallback if available
        if (fallbackSrc && videoSrc !== fallbackSrc) {
          console.log("🔄 Attempting fallback video source");
          switchToFallback();
          return;
        }
      }

      // Check if this is an audio decoding error that we can ignore for video-only content
      if (
        errorMessage.includes("audio packet") ||
        errorMessage.includes("PIPELINE_ERROR_DECODE")
      ) {
        console.warn(
          "🔇 Audio decoding issue detected, continuing with video-only playback:",
          errorMessage
        );

        // Try to continue playback without audio
        const video = e.currentTarget;
        if (video && autoPlay) {
          setTimeout(() => {
            video.play().catch(() => {
              // If still fails, set error
              const error = new Error(`Video playback failed: ${errorMessage}`);
              setError(error);
              if (onError) onError(error);
            });
          }, 100);
        }
        return;
      }

      // For any other error type, attempt fallback if provided
      if (fallbackSrc && videoSrc !== fallbackSrc) {
        console.log("🔄 Generic error: switching to fallback video source");
        switchToFallback();
        return;
      }

      const error = new Error(`Video playback failed: ${errorMessage}`);
      console.error("🎥 Video error:", error);

      setError(error);
      if (onError) {
        onError(error);
      }
    },
    [onError, autoPlay, fallbackSrc, path, switchToFallback]
  );

  // Auto-play setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay || !videoUrl || loading) return;

    const startPlayback = () => {
      // Ensure video is muted for autoplay to work reliably
      video.muted = true;

      video
        .play()
        .then(() => {
          if (onLoad) onLoad();
        })
        .catch((error) => {
          const errorMessage = error.message || error.toString();

          // Handle audio decoding errors gracefully
          if (
            errorMessage.includes("audio packet") ||
            errorMessage.includes("PIPELINE_ERROR_DECODE")
          ) {
            console.warn(
              "🔇 Audio decoding issue during autoplay, continuing video-only:",
              errorMessage
            );

            // Try playing again after a short delay
            setTimeout(() => {
              video.play().catch((retryError) => {
                console.warn("⚠️ Video autoplay retry failed:", retryError);
                // Don't call onError for audio-related issues in video-only content
              });
            }, 200);
          } else {
            console.warn("⚠️ Video autoplay failed:", error);
            if (onError) onError(error);
          }
        });
    };

    // Small delay to ensure video is ready
    const timeoutId = setTimeout(startPlayback, 100);
    return () => clearTimeout(timeoutId);
  }, [autoPlay, videoUrl, loading, onLoad, onError]);

  // Loading state - don't render anything while loading
  if (loading) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-red-50`}
      >
        <div className="text-red-500 text-center">
          <div className="font-medium">Video Error</div>
          <div className="text-sm">{error.message}</div>
        </div>
      </div>
    );
  }

  // Render video
  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        className={`${className} bg-black`}
        autoPlay={false} // Controlled via useEffect for better control
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        preload="metadata"
        disableRemotePlayback
        crossOrigin="anonymous"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

export default ClientBlobVideo;
