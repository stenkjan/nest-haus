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
  playbackRate?: number; // Playback speed (1.0 = normal, 0.5 = half speed, 2.0 = double speed)
  onLoad?: () => void; // Success callback
  onError?: (error: Error) => void; // Error callback
  onStop?: () => void; // Stop callback
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
  playbackRate = 1.0,
  onLoad,
  onError,
  onStop,
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

  // Cleanup on unmount to prevent errors
  useEffect(() => {
    const currentVideo = videoRef.current; // Capture ref value
    return () => {
      if (currentVideo) {
        // Pause video and clear source to prevent playback errors
        currentVideo.pause();
        currentVideo.removeAttribute("src");
        currentVideo.load(); // Reset video element
        if (onStop) {
          onStop();
        }
      }
    };
  }, [onStop]);

  // Handle successful video load
  const handleVideoLoad = useCallback(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // Handle video errors gracefully
  const handleVideoError = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      const videoError = e.currentTarget.error;
      const errorMessage = videoError?.message || "Unknown error";
      const videoSrc = e.currentTarget.src;

      // Log error details for debugging (only in development)
      if (process.env.NODE_ENV === "development") {
        console.warn("🎥 Video error details:", {
          message: errorMessage,
          code: videoError?.code,
          src: videoSrc,
          path: path,
          networkState: e.currentTarget.networkState,
          readyState: e.currentTarget.readyState,
        });
      }

      // Check if this is a DEMUXER_ERROR_COULD_NOT_OPEN error
      if (errorMessage.includes("DEMUXER_ERROR_COULD_NOT_OPEN")) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "🔧 DEMUXER error detected - video file may be corrupted or inaccessible"
          );
        }

        // Try fallback if available
        if (fallbackSrc && videoSrc !== fallbackSrc) {
          if (process.env.NODE_ENV === "development") {
            console.log("🔄 Attempting fallback video source");
          }
          switchToFallback();
          return;
        }
      }

      // Check if this is an audio decoding error that we can ignore for video-only content
      if (
        errorMessage.includes("audio packet") ||
        errorMessage.includes("PIPELINE_ERROR_DECODE") ||
        errorMessage.includes("CHUNK_DEMUXER_ERROR")
      ) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "🔇 Audio/demux issue detected, silently continuing:",
            errorMessage
          );
        }

        // Try to continue playback without audio, but don't show errors
        const video = e.currentTarget;
        if (video && autoPlay) {
          setTimeout(() => {
            video.play().catch(() => {
              // Silently fail - don't show error to user
              if (process.env.NODE_ENV === "development") {
                console.warn("🎥 Video playback failed silently");
              }
            });
          }, 100);
        }
        return; // Don't set error state or call onError
      }

      // For network errors or loading issues, try fallback silently
      if (
        errorMessage.includes("NETWORK_ERROR") ||
        errorMessage.includes("SRC_NOT_SUPPORTED") ||
        videoError?.code === 3 || // MEDIA_ERR_DECODE
        videoError?.code === 4 // MEDIA_ERR_SRC_NOT_SUPPORTED
      ) {
        if (fallbackSrc && videoSrc !== fallbackSrc) {
          if (process.env.NODE_ENV === "development") {
            console.log(
              "🔄 Network/decode error: switching to fallback silently"
            );
          }
          switchToFallback();
          return;
        }

        // If no fallback, silently fail without showing error
        if (process.env.NODE_ENV === "development") {
          console.warn("🎥 Video failed to load, no fallback available");
        }
        return;
      }

      // Only show errors for critical issues that need user attention
      const error = new Error(`Video playback failed: ${errorMessage}`);
      if (process.env.NODE_ENV === "development") {
        console.error("🎥 Critical video error:", error);
      }

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

  // Playback rate setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl || loading) return;

    const setPlaybackRate = () => {
      try {
        video.playbackRate = playbackRate;
        if (process.env.NODE_ENV === "development") {
          console.log(`🎥 Playback rate set to ${playbackRate}x for ${path}`);
        }
      } catch (error) {
        console.warn("⚠️ Failed to set playback rate:", error);
      }
    };

    // Set playback rate when video is ready
    if (video.readyState >= 1) {
      setPlaybackRate();
      return; // Explicit return for this path
    } else {
      video.addEventListener("loadedmetadata", setPlaybackRate);
      return () => video.removeEventListener("loadedmetadata", setPlaybackRate);
    }
  }, [playbackRate, videoUrl, loading, path]);

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
