"use client";

import React from "react";
import { ClientBlobVideo } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface VideoGalleryProps {
  title?: string;
  subtitle?: string;
  videoPath?: string;
  backgroundColor?: "white" | "gray" | "black";
  maxWidth?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({
  title,
  subtitle,
  videoPath = IMAGES.variantvideo.nine,
  backgroundColor = "white",
  maxWidth = true,
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
}) => {
  const bgColorClass = {
    white: "bg-white",
    gray: "bg-gray-50",
    black: "bg-black",
  }[backgroundColor];

  const titleColor =
    backgroundColor === "black" ? "text-white" : "text-gray-900";
  const subtitleColor =
    backgroundColor === "black" ? "text-white" : "text-black";

  const containerClass = maxWidth
    ? "w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8"
    : "w-full px-4 sm:px-6 lg:px-8";

  return (
    <section className={`w-full py-16 ${bgColorClass}`}>
      <div className={containerClass}>
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2
                className={`font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 ${titleColor}`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <h3
                className={`text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 ${subtitleColor} max-w-3xl mx-auto`}
              >
                {subtitle}
              </h3>
            )}
          </div>
        )}

        <div className="w-full">
          <div className="w-full rounded-lg overflow-hidden bg-gray-900">
            <ClientBlobVideo
              path={videoPath}
              className="w-full h-auto object-contain"
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              playsInline={true}
              controls={controls}
              enableCache={true}
              fallbackSrc={videoPath}
            />
            {/* Accessibility description for screen readers */}
            <span className="sr-only">
              Video demonstration of NEST-Haus modular construction variants
              showing different architectural configurations and possibilities
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;
