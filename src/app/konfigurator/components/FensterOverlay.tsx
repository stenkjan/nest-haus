"use client";

import React from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface FensterOverlayProps {
  fensterMaterial?: string; // Material selection from fenster option
  isVisible?: boolean;
  className?: string;
}

export default function FensterOverlay({
  fensterMaterial,
  isVisible = true,
  className = "",
}: FensterOverlayProps) {
  // Don't render if visibility is disabled
  if (!isVisible || !fensterMaterial) {
    return null;
  }

  // Determine which overlay image to use based on fenster material
  const getOverlayImage = (material?: string): string | null => {
    if (!material) return null;
    
    const materialLower = material.toLowerCase();
    
    // Map fenster material values to overlay images
    if (materialLower.includes('holz') || materialLower.includes('fichte') || materialLower.includes('eiche')) {
      return IMAGES.fensterOverlays.holz;
    } else if (materialLower.includes('pvc') || materialLower.includes('kunststoff')) {
      return IMAGES.fensterOverlays.pvc_fenster;
    } else if (materialLower.includes('aluminium')) {
      // Check if it's schwarz or weiss
      if (materialLower.includes('schwarz') || materialLower.includes('dunkel')) {
        return IMAGES.fensterOverlays.aluminium_schwarz;
      } else {
        return IMAGES.fensterOverlays.aluminium_weiss;
      }
    }
    
    // Default to PVC if no match
    return IMAGES.fensterOverlays.pvc_fenster;
  };

  const overlayImagePath = getOverlayImage(fensterMaterial);
  
  if (!overlayImagePath) {
    return null;
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Fenster overlay image - EXACT same styling as main preview image */}
      <HybridBlobImage
        key={`fenster-overlay-${fensterMaterial}`}
        path={overlayImagePath}
        alt="Fenster & Türen Overlay"
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

