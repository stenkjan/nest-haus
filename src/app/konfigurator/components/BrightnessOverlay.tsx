"use client";

import React from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface BrightnessOverlayProps {
  brightnessLevel: "light" | "medium" | "bright";
  isVisible?: boolean; // New prop to control visibility via checkbox
  className?: string;
}

export default function BrightnessOverlay({
  brightnessLevel,
  isVisible = true,
  className = "",
}: BrightnessOverlayProps) {
  // Don't render if visibility is disabled
  if (!isVisible) {
    return null;
  }

  // Get the appropriate image path based on brightness level
  const getImagePath = () => {
    switch (brightnessLevel) {
      case "light":
        return IMAGES.brightnessLevel.light;
      case "medium":
        return IMAGES.brightnessLevel.medium;
      case "bright":
        return IMAGES.brightnessLevel.bright;
      default:
        return IMAGES.brightnessLevel.medium; // Default fallback
    }
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Brightness overlay image - EXACT same styling as main preview image */}
      <HybridBlobImage
        key={`brightness-${brightnessLevel}`} // Force re-render when brightness level changes
        path={getImagePath()}
        alt={`Belichtung ${brightnessLevel} Overlay`}
        fill
        className="transition-opacity duration-300 object-contain z-10"
        strategy="client"
        isInteractive={true}
        enableCache={true}
        sizes="(max-width: 1023px) 100vw, 70vw"
        quality={85}
      />
    </div>
  );
}
