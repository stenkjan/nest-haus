"use client";

import React, { useState, useEffect, useRef } from "react";

interface ModernVideoPlayerProps {
  videoPath: string;
  aspectRatio?: "16/9" | "21/9" | "4/3";
  autoPlay?: boolean;
  className?: string;
}

export default function ModernVideoPlayer({
  videoPath,
  aspectRatio = "16/9",
  autoPlay = false,
  className = "",
}: ModernVideoPlayerProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Resolve the video URL from API
  useEffect(() => {
    const fetchVideoUrl = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching video from:", videoPath);

        // If videoPath already includes /api/, fetch the actual URL
        if (videoPath.includes("/api/")) {
          const response = await fetch(videoPath);

          console.log("API Response status:", response.status);

          if (!response.ok) {
            throw new Error(
              `Failed to fetch video: ${response.status} ${response.statusText}`
            );
          }

          const data = await response.json();
          console.log("API Response data:", data);

          if (!data.url) {
            throw new Error("No URL in API response");
          }

          console.log("✅ Video URL resolved:", data.url);
          setResolvedUrl(data.url);
        } else {
          // Direct URL provided
          console.log("✅ Using direct URL:", videoPath);
          setResolvedUrl(videoPath);
        }
      } catch (err) {
        console.error("❌ Error fetching video URL:", err);
        setError(err instanceof Error ? err.message : "Failed to load video");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoUrl();
  }, [videoPath]);

  // Handle video load
  useEffect(() => {
    if (resolvedUrl && videoRef.current) {
      console.log("🎬 Video element src set to:", resolvedUrl);
      videoRef.current.load();
    }
  }, [resolvedUrl]);

  if (isLoading) {
    return (
      <div
        className={`relative w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center ${className}`}
        style={{ aspectRatio }}
      >
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !resolvedUrl) {
    return (
      <div
        className={`relative w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center ${className}`}
        style={{ aspectRatio }}
      >
        <div className="text-white text-center p-8">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm mb-2">{error || "Failed to load video"}</p>
          <p className="text-xs text-gray-400">Check console for details</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full bg-black shadow-2xl ${className}`}
      style={{ aspectRatio }}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        controlsList="nodownload"
        disablePictureInPicture
        autoPlay={autoPlay}
        muted={autoPlay}
        playsInline
        crossOrigin="anonymous"
        preload="metadata"
        onLoadedMetadata={() => console.log("✅ Video metadata loaded")}
        onLoadedData={() => console.log("✅ Video data loaded")}
        onCanPlay={() => console.log("✅ Video can play")}
        onPlay={() => console.log("▶️ Video playing")}
        onError={(e) => {
          console.error("❌ Video error:", e);
          const videoElement = e.currentTarget;
          console.error("Video error code:", videoElement.error?.code);
          console.error("Video error message:", videoElement.error?.message);
          setError("Video playback error");
        }}
      >
        <source src={resolvedUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
