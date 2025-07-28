"use client";

import React, { useEffect } from "react";
import { usePingPongVideo } from "@/hooks/usePingPongVideo";

interface PingPongVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  width?: number;
  height?: number;
  reversePlayback?: boolean;
  reverseSpeedMultiplier?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const PingPongVideo: React.FC<PingPongVideoProps> = ({
  src,
  className = "",
  autoPlay = true,
  muted = true,
  playsInline = true,
  controls = false,
  width,
  height,
  reversePlayback = true,
  reverseSpeedMultiplier = 3,
  onLoad,
  onError,
}) => {
  // Use the custom ping-pong hook
  const {
    isPlayingReverse,
    isVideoReady,
    handleVideoEnded,
    handleLoadedMetadata,
    videoRef,
  } = usePingPongVideo({
    reversePlayback,
    reverseSpeedMultiplier,
  });

  // Auto-play setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay || !isVideoReady) return;

    const startPlayback = () => {
      video
        .play()
        .then(() => {
          if (onLoad) onLoad();
        })
        .catch((error) => {
          if (onError)
            onError(
              error instanceof Error ? error : new Error("Autoplay failed")
            );
        });
    };

    // Small delay to ensure video is ready
    const timeoutId = setTimeout(startPlayback, 100);
    return () => clearTimeout(timeoutId);
  }, [autoPlay, isVideoReady, onLoad, onError, videoRef]);

  // Enhanced metadata handler
  const handleMetadataLoaded = () => {
    handleLoadedMetadata();
    if (onLoad && !autoPlay) {
      onLoad();
    }
  };

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      width={width}
      height={height}
      autoPlay={false} // Controlled via useEffect for better control
      loop={false} // We handle looping manually for ping-pong effect
      muted={muted}
      playsInline={playsInline}
      controls={controls && !isPlayingReverse} // Hide controls during reverse playback
      onEnded={handleVideoEnded}
      onLoadedMetadata={handleMetadataLoaded}
      onError={(e) => {
        const error = new Error(
          `Video loading failed: ${e.currentTarget.error?.message || "Unknown error"}`
        );
        if (onError) onError(error);
      }}
      style={{
        // Disable pointer events during reverse playback to prevent user interruption
        pointerEvents: isPlayingReverse ? "none" : "auto",
      }}
    />
  );
};

export default PingPongVideo;
