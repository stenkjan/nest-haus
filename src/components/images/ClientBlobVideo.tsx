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

    // API resolution for path-based access
    const response = await fetch(
      `/api/images?path=${encodeURIComponent(path)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch video URL: ${response.status}`);
    }

    const data = await response.json();
    if (!data.url) {
      throw new Error("No video URL returned");
    }

    return data.url;
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

  // Dual Video Strategy (for reverse playback)
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState(1);
  const [isReversed, setIsReversed] = useState(false);

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
        console.log(`🎥 Video loaded: ${path} -> ${url}`);
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
  }, [path, enableCache, fallbackSrc, onLoad, onError]);

  // Load video on mount and path change
  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  // Dual video element coordination for reverse playback
  const handleEnded = useCallback(
    (videoElement: HTMLVideoElement, isFirst: boolean) => {
      if (!reversePlayback || isFirst !== (activeVideo === 1)) return;

      const otherVideo = isFirst ? videoRef2.current : videoRef1.current;

      if (!otherVideo) return;

      try {
        // Set playback direction and position
        otherVideo.currentTime = isReversed ? 0 : otherVideo.duration;
        otherVideo.playbackRate = isReversed ? 1 : -1;
        otherVideo.play();

        // Switch active video and direction
        setActiveVideo(isFirst ? 2 : 1);
        setIsReversed(!isReversed);
      } catch (error) {
        console.error("🎥 Error in reverse playback:", error);
      }
    },
    [reversePlayback, activeVideo, isReversed]
  );

  // Handle video load events
  const handleVideoLoad = useCallback(
    (videoElement: HTMLVideoElement) => {
      if (reversePlayback && videoElement.duration > 0) {
        // Initialize for reverse playback
        videoElement.playbackRate = 1;
        videoElement.currentTime = 0;
      }
    },
    [reversePlayback]
  );

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

  // Render video(s)
  if (reversePlayback) {
    // Dual video elements with opacity transitions for reverse playback
    return (
      <div className={className} style={{ position: "relative" }}>
        <video
          ref={videoRef1}
          src={videoUrl}
          autoPlay={autoPlay}
          loop={!reversePlayback && loop} // Disable standard loop for reverse playback
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: activeVideo === 1 ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
          onEnded={(e) => handleEnded(e.currentTarget, true)}
          onLoadedData={(e) => handleVideoLoad(e.currentTarget)}
        />
        <video
          ref={videoRef2}
          src={videoUrl}
          muted={muted}
          playsInline={playsInline}
          controls={false} // Only show controls on primary video
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: activeVideo === 2 ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
          onEnded={(e) => handleEnded(e.currentTarget, false)}
          onLoadedData={(e) => handleVideoLoad(e.currentTarget)}
        />
      </div>
    );
  }

  // Standard single video element
  return (
    <video
      ref={videoRef1}
      src={videoUrl}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      onLoadedData={(e) => handleVideoLoad(e.currentTarget)}
    />
  );
};

// Export cache for external management if needed
export { VideoCache };

export default ClientBlobVideo;
