"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

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
  fallbackSrc,
  enableCache = true,
}) => {
  // URL Resolution State
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Ping-pong state for reverse playback
  const [isPlayingReverse, setIsPlayingReverse] = useState(false);
  const [_videoDuration, setVideoDuration] = useState<number>(0);

  // Video reference and animation frame tracking
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isReversePlayingRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(0);

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

      if (process.env.NODE_ENV === "development") {
        console.log("🎥 DEBUG: Video URL loaded successfully", {
          path,
          url: url.substring(0, 50) + "...",
          reversePlayback,
          autoPlay,
        });
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to load video");
      setError(error);

      // Try fallback if available
      if (fallbackSrc) {
        setVideoUrl(fallbackSrc);
        if (process.env.NODE_ENV === "development") {
          console.warn(`🎥 Using fallback for ${path}: ${fallbackSrc}`);
        }
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

  // Reverse playback animation using requestAnimationFrame
  const playReverse = useCallback(() => {
    const video = videoRef.current;

    if (process.env.NODE_ENV === "development") {
      console.log("🎥 DEBUG: playReverse called", {
        hasVideo: !!video,
        reversePlayback,
        currentTime: video?.currentTime,
        duration: video?.duration,
        paused: video?.paused,
        ended: video?.ended,
      });
    }

    if (!video || !reversePlayback) {
      if (process.env.NODE_ENV === "development") {
        console.warn("🎥 DEBUG: playReverse exiting early", {
          hasVideo: !!video,
          reversePlayback,
        });
      }
      return;
    }

    // Pause the video to prevent forward playback during reverse
    video.pause();

    isReversePlayingRef.current = true;
    setIsPlayingReverse(true);

    if (process.env.NODE_ENV === "development") {
      console.log("🎥 DEBUG: Starting reverse animation", {
        startTime: video.currentTime,
        duration: video.duration,
      });
    }

    const animate = () => {
      if (!isReversePlayingRef.current || !video) {
        if (process.env.NODE_ENV === "development") {
          console.log("🎥 DEBUG: animate() stopping", {
            isReversePlaying: isReversePlayingRef.current,
            hasVideo: !!video,
          });
        }
        return;
      }

      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Calculate reverse playback speed (approximately 30fps)
      const reverseSpeed = deltaTime * 0.03; // Back to original speed for visibility
      const currentTime = video.currentTime;
      const newTime = Math.max(0, currentTime - reverseSpeed);

      if (
        process.env.NODE_ENV === "development" &&
        Math.floor(now) % 1000 < 50
      ) {
        console.log("🎥 DEBUG: Reverse frame", {
          deltaTime: deltaTime.toFixed(2),
          reverseSpeed: reverseSpeed.toFixed(4),
          currentTime: currentTime.toFixed(3),
          newTime: newTime.toFixed(3),
          timeLeft: newTime.toFixed(3),
        });
      }

      video.currentTime = newTime;

      // Check if we've reached the beginning
      if (newTime <= 0.1) {
        // Small threshold to avoid precision issues
        if (process.env.NODE_ENV === "development") {
          console.log("🎥 DEBUG: Reached beginning, switching to forward", {
            finalTime: newTime,
            duration: video.duration,
          });
        }

        // Switch back to forward playback
        isReversePlayingRef.current = false;
        setIsPlayingReverse(false);
        video.currentTime = 0;

        video.play().catch((error) => {
          if (process.env.NODE_ENV === "development") {
            console.error(
              "🎥 DEBUG: Failed to restart forward playback:",
              error
            );
          }
        });

        if (process.env.NODE_ENV === "development") {
          console.log("🎥 Ping-pong: switched to forward playback");
        }
      } else {
        // Continue reverse animation
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    if (process.env.NODE_ENV === "development") {
      console.log("🎥 Ping-pong: started reverse playback");
    }
  }, [reversePlayback]);

  // Handle video end for ping-pong effect
  const handleVideoEnded = useCallback(() => {
    const video = videoRef.current;

    if (process.env.NODE_ENV === "development") {
      console.log("🎥 DEBUG: handleVideoEnded called", {
        reversePlayback,
        hasVideo: !!video,
        currentTime: video?.currentTime,
        duration: video?.duration,
        loop,
      });
    }

    if (!reversePlayback || !video) {
      if (process.env.NODE_ENV === "development") {
        console.log("🎥 DEBUG: Standard loop behavior", {
          loop,
          hasVideo: !!video,
        });
      }

      // Standard loop behavior if reversePlayback is disabled
      if (loop && video) {
        video.currentTime = 0;
        video.play().catch((error) => {
          if (process.env.NODE_ENV === "development") {
            console.warn("🎥 Standard loop restart failed:", error);
          }
        });
      }
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("🎥 DEBUG: Video ended, starting reverse playback");
    }

    // Start reverse playback when video ends
    playReverse();
  }, [reversePlayback, loop, playReverse]);

  // Handle video metadata loaded (get duration)
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setVideoDuration(video.duration);
      if (process.env.NODE_ENV === "development") {
        console.log("🎥 DEBUG: Video metadata loaded", {
          duration: video.duration,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState,
          currentTime: video.currentTime,
        });
      }
    }
  }, []);

  // Note: Event listeners are now handled via React props (onEnded, onLoadedMetadata)
  // This is more reliable than addEventListener in React components

  // Load video on mount and path change
  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  // Auto-play setup
  useEffect(() => {
    const video = videoRef.current;

    if (process.env.NODE_ENV === "development") {
      console.log("🎥 DEBUG: Auto-play effect triggered", {
        hasVideo: !!video,
        autoPlay,
        hasVideoUrl: !!videoUrl,
        loading,
        reversePlayback,
      });
    }

    if (!video || !autoPlay || !videoUrl || loading) {
      if (process.env.NODE_ENV === "development") {
        console.log("🎥 DEBUG: Auto-play conditions not met", {
          hasVideo: !!video,
          autoPlay,
          hasVideoUrl: !!videoUrl,
          loading,
        });
      }
      return;
    }

    // Small delay to ensure video is ready
    const timeoutId = setTimeout(() => {
      if (process.env.NODE_ENV === "development") {
        console.log("🎥 DEBUG: Starting autoplay", {
          currentTime: video.currentTime,
          duration: video.duration,
          paused: video.paused,
          readyState: video.readyState,
        });
      }

      video.play().catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.error("🎥 DEBUG: Autoplay failed:", error);
        }
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [autoPlay, videoUrl, loading, reversePlayback]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isReversePlayingRef.current = false;
    };
  }, []);

  // Debugging: Log component state periodically
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && videoUrl) {
      const interval = setInterval(() => {
        const video = videoRef.current;
        if (video) {
          console.log("🎥 DEBUG: Component state", {
            currentTime: video.currentTime.toFixed(2),
            duration: video.duration?.toFixed(2) || "unknown",
            paused: video.paused,
            ended: video.ended,
            isPlayingReverse,
            reversePlayback,
            readyState: video.readyState,
          });
        }
      }, 2000); // Log every 2 seconds

      return () => clearInterval(interval);
    }
    // Return undefined explicitly when no cleanup is needed
    return undefined;
  }, [videoUrl, isPlayingReverse, reversePlayback]);

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
      onEnded={() => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "🎥 DEBUG: onEnded event fired - starting handleVideoEnded"
          );
        }
        handleVideoEnded();
      }}
      onTimeUpdate={(e) => {
        // Debug time updates
        if (process.env.NODE_ENV === "development" && reversePlayback) {
          const video = e.currentTarget;
          console.log("🎥 DEBUG: Time update", {
            currentTime: video.currentTime.toFixed(3),
            isPlayingReverse,
            paused: video.paused,
          });
        }
      }}
      onPlay={() => {
        if (process.env.NODE_ENV === "development") {
          console.log("🎥 DEBUG: Video play event fired");
        }
      }}
      onPause={() => {
        if (process.env.NODE_ENV === "development") {
          console.log("🎥 DEBUG: Video pause event fired", {
            isPlayingReverse,
            currentTime: videoRef.current?.currentTime,
          });
        }
      }}
      onLoadedMetadata={() => {
        if (process.env.NODE_ENV === "development") {
          console.log("🎥 DEBUG: onLoadedMetadata event fired via prop", {
            reversePlayback,
            autoPlay,
            duration: videoRef.current?.duration,
          });
        }
        handleLoadedMetadata();
      }}
      onLoadStart={() => {
        if (process.env.NODE_ENV === "development") {
          console.log("🎥 DEBUG: Video element started loading");
        }
      }}
      onCanPlay={() => {
        if (process.env.NODE_ENV === "development") {
          console.log("🎥 DEBUG: Video can start playing", {
            reversePlayback,
            autoPlay,
          });
        }
      }}
    />
  );
};

// Export cache for external management if needed
export { VideoCache };

export default ClientBlobVideo;
