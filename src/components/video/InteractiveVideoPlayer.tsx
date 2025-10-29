"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "@/components/ui";
import "./video-player.css";

interface InteractiveVideoPlayerProps {
  videoPath: string;
  mobileVideoPath?: string;
  aspectRatio?: "16/9" | "21/9" | "4/3";
  autoPlay?: boolean;
  className?: string;
  subtitlesPath?: string;
  enableFullscreen?: boolean;
  enableSubtitles?: boolean;
  enableVolumeControl?: boolean;
  enableTimeline?: boolean;
}

export default function InteractiveVideoPlayer({
  videoPath,
  mobileVideoPath,
  aspectRatio = "16/9",
  autoPlay = false,
  className = "",
  subtitlesPath,
  enableFullscreen = true,
  enableSubtitles = true,
  enableVolumeControl = true,
  enableTimeline = true,
}: InteractiveVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!isPlaying) return;

    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Update current time and handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handlePlay);

    return () => {
      // Pause video before cleanup to prevent play() interruption
      if (!video.paused) {
        video.pause();
      }
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("play", handlePlay);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.warn("Video play was prevented:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleVolumeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat((e.target as HTMLInputElement).value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const VideoPlayer = () => (
    <div
      ref={containerRef}
      className={`relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl ${className}`}
      style={{ aspectRatio }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={autoPlay ? true : isMuted}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
      >
        <source
          src={isMobile && mobileVideoPath ? mobileVideoPath : videoPath}
          type="video/mp4"
        />
        {subtitlesPath && (
          <track
            kind="subtitles"
            src={subtitlesPath}
            srcLang="de"
            label="Deutsch"
            default={showSubtitles}
          />
        )}
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Overlay - Modern Design */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer group"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="relative">
            {/* Pulsing background effect */}
            <div className="absolute inset-0 w-24 h-24 bg-white/20 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-white to-white/90 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl backdrop-blur-sm">
              <svg
                className="w-12 h-12 text-black ml-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Modern Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
          showControls
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
      >
        {/* Gradient background for better readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="relative px-6 pb-5 pt-8">
          {/* Timeline */}
          {enableTimeline && (
            <div className="mb-4">
              {/* Timeline container with hover effect */}
              <div className="group/timeline relative">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleTimelineChange}
                  className="w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer relative z-10"
                  style={{
                    background: "transparent",
                  }}
                />
                {/* Custom timeline track */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-white/30 rounded-full overflow-hidden pointer-events-none">
                  {/* Progress fill */}
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-100 relative"
                    style={{
                      width: `${(currentTime / (duration || 1)) * 100}%`,
                    }}
                  >
                    {/* Glowing effect */}
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-full shadow-lg shadow-blue-500/50" />
                  </div>
                </div>
                {/* Hover scrubber thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/timeline:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    left: `${(currentTime / (duration || 1)) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
              <div className="flex justify-between text-white/80 text-xs mt-2 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Control Buttons - Modern Layout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause Button - Larger and more prominent */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition-all duration-200 hover:scale-110"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Volume Control - Sleek Design */}
              {enableVolumeControl && (
                <div className="flex items-center gap-3 group/volume">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-blue-400 transition-all duration-200 hover:scale-110"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : volume < 0.5 ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                      </svg>
                    )}
                  </button>
                  {/* Volume slider with modern styling - stays visible on hover */}
                  <div className="relative w-20 opacity-0 group-hover/volume:opacity-100 transition-opacity duration-200">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      onInput={handleVolumeInput}
                      className="w-full h-1 bg-transparent rounded-full appearance-none cursor-pointer relative z-10"
                    />
                    {/* Custom slider track */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-white/30 rounded-full overflow-hidden pointer-events-none">
                      <div
                        className="h-full bg-blue-500 transition-all duration-100"
                        style={{
                          width: `${(isMuted ? 0 : volume) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Subtitles Toggle - Modern Icon */}
              {enableSubtitles && subtitlesPath && (
                <button
                  onClick={() => {
                    setShowSubtitles(!showSubtitles);
                    const video = videoRef.current;
                    if (video) {
                      const tracks = video.textTracks;
                      for (let i = 0; i < tracks.length; i++) {
                        tracks[i].mode = !showSubtitles ? "showing" : "hidden";
                      }
                    }
                  }}
                  className={`transition-all duration-200 hover:scale-110 ${
                    showSubtitles
                      ? "text-blue-400"
                      : "text-white hover:text-blue-400"
                  }`}
                  aria-label="Toggle subtitles"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" />
                  </svg>
                </button>
              )}

              {/* Fullscreen Toggle - Modern Icon */}
              {enableFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400 transition-all duration-200 hover:scale-110"
                  aria-label="Fullscreen"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Regular Video Player */}
      {!isFullscreen && <VideoPlayer />}

      {/* Fullscreen Dialog */}
      {isFullscreen && (
        <Dialog
          isOpen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          transparent={true}
          className="p-0 bg-black"
        >
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
            <VideoPlayer />
          </div>
        </Dialog>
      )}
    </>
  );
}
