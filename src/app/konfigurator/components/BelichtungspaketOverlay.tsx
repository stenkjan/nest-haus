"use client";

import React from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface BelichtungspaketOverlayProps {
  belichtungspaket?: string; // "light" | "medium" | "bright"
  isVisible?: boolean;
  className?: string;
}

export default function BelichtungspaketOverlay({
  belichtungspaket,
  isVisible = true,
  className = "",
}: BelichtungspaketOverlayProps) {
  // Don't render if visibility is disabled or no belichtungspaket selected
  if (!isVisible || !belichtungspaket) {
    return null;
  }

  // Get the overlay image based on belichtungspaket selection
  const getOverlayImage = (belichtungspaket: string): string | null => {
    // Map belichtungspaket values to overlay images
    const belichtungspaketLower = belichtungspaket.toLowerCase();
    
    if (belichtungspaketLower === 'light') {
      return IMAGES.belichtungspaketOverlays.light;
    } else if (belichtungspaketLower === 'medium') {
      return IMAGES.belichtungspaketOverlays.medium;
    } else if (belichtungspaketLower === 'bright') {
      return IMAGES.belichtungspaketOverlays.bright;
    }
    
    return null;
  };

  const overlayImagePath = getOverlayImage(belichtungspaket);

  // Don't render if no valid overlay image found
  if (!overlayImagePath) {
    return null;
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Belichtungspaket overlay image - EXACT same styling as main preview image */}
      <HybridBlobImage
        key={`belichtungspaket-overlay-${belichtungspaket}`}
        path={overlayImagePath}
        alt={`Belichtungspaket ${belichtungspaket} Overlay`}
        fill
        className="transition-opacity duration-300 object-contain z-20"
        strategy="client"
        isInteractive={true}
        enableCache={true}
        sizes="(max-width: 1023px) 100vw, 70vw"
        quality={85}
      />
    </div>
  );
}

