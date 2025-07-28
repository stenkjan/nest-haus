"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface LoopingVideoProps {
  introPath: string; // First video path
  outroPath: string; // Second video path
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  fallbackSrc?: string;
  enableCache?: boolean;
}

// Video URL resolution with cache
class VideoUrlCache {
  private static cache = new Map<string, string>();

  static get(path: string): string | null {
    return this.cache.get(path) || null;
  }

  static set(path: string, url: string): void {
    this.cache.set(path, url);
  }
}

export const LoopingVideo: React.FC<LoopingVideoProps> = ({
  introPath,
  outroPath,
  className = "",
  autoPlay = true,
  muted = true,
  playsInline = true,
  controls = false,
  onLoad,
  onError,
  fallbackSrc,
  enableCache = true,
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // 0 for intro, 1 for outro
  const [introUrl, setIntroUrl] = useState<string>("");
  const [outroUrl, setOutroUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Resolve video URLs
  const resolveVideoUrl = useCallback(
    async (path: string): Promise<string> => {
      // Check cache first
      if (enableCache) {
        const cached = VideoUrlCache.get(path);
        if (cached) return cached;
      }

      try {
        const response = await fetch(
          `/api/images?path=${encodeURIComponent(path)}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to resolve video URL: ${response.statusText}`
          );
        }

        const data = await response.json();
        const url = data.url || data.fallback;

        if (enableCache) {
          VideoUrlCache.set(path, url);
        }

        return url;
      } catch (err) {
        console.error(`❌ Failed to resolve video URL for ${path}:`, err);
        return (
          fallbackSrc ||
          "/api/placeholder/1200/800?style=nest&text=Video+Not+Found"
        );
      }
    },
    [enableCache, fallbackSrc]
  );

  // Load video URLs
  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const [introUrlResult, outroUrlResult] = await Promise.all([
          resolveVideoUrl(introPath),
          resolveVideoUrl(outroPath),
        ]);

        setIntroUrl(introUrlResult);
        setOutroUrl(outroUrlResult);
        setLoading(false);

        if (onLoad) {
          onLoad();
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to load videos");
        setError(error);
        setLoading(false);

        if (onError) {
          onError(error);
        }
      }
    };

    loadVideos();
  }, [introPath, outroPath, resolveVideoUrl, onLoad, onError]);

  // Handle video end - switch to next video
  const handleVideoEnded = useCallback(() => {
    setCurrentVideoIndex((prev) => (prev === 0 ? 1 : 0));
  }, []);

  // Auto-play when video changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || loading || error || !autoPlay) return;

    // Small delay to ensure video is ready
    const timeoutId = setTimeout(() => {
      video.play().catch((playError) => {
        console.warn("⚠️ Video autoplay failed:", playError);
        if (onError) {
          onError(new Error("Autoplay failed"));
        }
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentVideoIndex, loading, error, autoPlay, onError]);

  if (loading) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <div className="text-gray-500">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <div className="text-red-500">Failed to load videos</div>
      </div>
    );
  }

  const currentVideoUrl = currentVideoIndex === 0 ? introUrl : outroUrl;

  return (
    <video
      ref={videoRef}
      key={currentVideoIndex} // Force re-render when switching videos
      src={currentVideoUrl}
      className={className}
      autoPlay={false} // Controlled via useEffect
      loop={false} // We handle looping manually
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      onEnded={handleVideoEnded}
      onError={(e) => {
        const error = new Error(
          `Video playback failed: ${e.currentTarget.error?.message || "Unknown error"}`
        );
        if (onError) onError(error);
      }}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
};

export default LoopingVideo;
