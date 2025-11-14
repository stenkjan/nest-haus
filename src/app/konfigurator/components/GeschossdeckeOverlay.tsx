"use client";

import React from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface GeschossdeckeOverlayProps {
  innenverkleidung?: string; // "ohne_innenverkleidung" | "fichte" | "laerche" | "steirische_eiche" | etc.
  fussboden?: string; // "schiefer" | "kalkstein" | "parkett" | etc.
  isVisible?: boolean;
  className?: string;
}

export default function GeschossdeckeOverlay({
  innenverkleidung,
  fussboden,
  isVisible = true,
  className = "",
}: GeschossdeckeOverlayProps) {
  // Don't render if visibility is disabled
  if (!isVisible) {
    return null;
  }

  // Determine which overlay image to use based on innenverkleidung and fussboden
  const getOverlayImage = (
    innenverkleidung?: string,
    fussboden?: string
  ): string => {
    // Map innenverkleidung values to overlay image names
    // ohne_innenverkleidung → fichte (fallback visual), laerche → laerche, fichte → fichte, steirische_eiche → eiche
    let wallMaterial = "fichte"; // Default/fallback visual for ohne_innenverkleidung
    
    if (innenverkleidung) {
      const innenLower = innenverkleidung.toLowerCase();
      if (innenLower.includes("laerche") || innenLower.includes("kiefer")) {
        wallMaterial = "laerche"; // Uses laerche image path (holznatur)
      } else if (innenLower.includes("fichte")) {
        wallMaterial = "fichte";
      } else if (innenLower.includes("eiche")) {
        wallMaterial = "eiche";
      } else if (innenLower.includes("ohne")) {
        wallMaterial = "fichte"; // Use fichte as visual fallback for "ohne"
      }
    }
    
    // Determine floor type based on fussboden selection
    let floorType = "ohne_belag"; // Default
    
    if (fussboden) {
      const fussbodenLower = fussboden.toLowerCase();
      if (fussbodenLower.includes("parkett")) {
        floorType = "parkett";
      } else if (fussbodenLower.includes("schiefer")) {
        floorType = "steinplatten_dunkel";
      } else if (fussbodenLower.includes("kalkstein")) {
        floorType = "steinplatten_hell";
      }
    }

    // Build the key for IMAGES.pvModule (where geschossdecke overlays are stored)
    const key = `geschossdecke_${wallMaterial}_${floorType}` as keyof typeof IMAGES.pvModule;
    
    // Return the image path if it exists, otherwise return a default
    const imagePath = IMAGES.pvModule[key];
    
    if (imagePath && typeof imagePath === 'string') {
      return imagePath;
    }
    
    // Fallback to fichte ohne_belag if no match found
    return IMAGES.pvModule.geschossdecke_fichte_ohne_belag;
  };

  const overlayImagePath = getOverlayImage(innenverkleidung, fussboden);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Geschossdecke overlay image - EXACT same styling as main preview image */}
      <HybridBlobImage
        key={`geschossdecke-overlay-${innenverkleidung}-${fussboden}`}
        path={overlayImagePath}
        alt="Geschossdecke Overlay"
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
