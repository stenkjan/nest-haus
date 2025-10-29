"use client";

import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { Dialog } from "@/components/ui";

interface ModernVideoPlayerProps {
  videoPath: string;
  aspectRatio?: "16/9" | "21/9" | "4/3";
  autoPlay?: boolean;
  className?: string;
  enableFullscreen?: boolean;
}

export default function ModernVideoPlayer({
  videoPath,
  aspectRatio = "16/9",
  autoPlay = false,
  className = "",
  enableFullscreen = true,
}: ModernVideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);

  return (
    <>
      {/* Regular Video Player */}
      {!isFullscreen && (
        <div
          className={`relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl ${className}`}
          style={{ aspectRatio }}
        >
          <ReactPlayer
            ref={playerRef}
            url={videoPath}
            width="100%"
            height="100%"
            controls={true}
            playing={autoPlay}
            muted={autoPlay}
            loop={false}
            playsinline={true}
            pip={false}
            stopOnUnmount={true}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                  disablePictureInPicture: true,
                },
              },
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />

          {/* Fullscreen Button Overlay */}
          {enableFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
              aria-label="Fullscreen"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Fullscreen Dialog */}
      {isFullscreen && (
        <Dialog
          isOpen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          transparent={true}
          className="p-0 bg-black"
        >
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
            <div className="relative w-full h-full max-w-7xl">
              <ReactPlayer
                ref={playerRef}
                url={videoPath}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                loop={false}
                playsinline={true}
                pip={false}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                      disablePictureInPicture: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
