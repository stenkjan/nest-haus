"use client";

import React from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface BelichtungsPaketOverlayProps {
  nestSize: "nest80" | "nest100" | "nest120" | "nest140" | "nest160";
  brightnessLevel: "light" | "medium" | "bright";
  fensterMaterial?: "holz" | "pvc" | "aluminium_hell" | "aluminium_dunkel";
  isVisible?: boolean;
  className?: string;
}

export default function BelichtungsPaketOverlay({
  nestSize,
  brightnessLevel,
  fensterMaterial = "holz", // Default to holz (preselected)
  isVisible = true,
  className = "",
}: BelichtungsPaketOverlayProps) {
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Map nest sizes to the image naming convention
  const nestSizeMapping = {
    nest80: "75", // nest80 = 75 in image names
    nest100: "95", // nest100 = 95 in image names
    nest120: "115", // nest120 = 115 in image names
    nest140: "135", // nest140 = 135 in image names
    nest160: "155", // nest160 = 155 in image names
  };

  // Map fenster material values to image naming convention
  const fensterMaterialMapping = {
    holz: "holz",
    pvc: "pvc",
    aluminium_hell: "aluminium_hell",
    aluminium_dunkel: "aluminium_dunkel",
  };

  // Get the appropriate image path based on nest size, brightness level, and fenster material
  const getImagePath = () => {
    const sizeCode = nestSizeMapping[nestSize];
    const materialCode = fensterMaterialMapping[fensterMaterial];

    // Build the image key: nest_{size}_fenster_overlay_{brightness}_{material}
    const imageKey = `nest_${sizeCode}_fenster_overlay_${brightnessLevel}_${materialCode}`;

    console.log("🌟 BelichtungsPaket overlay image key:", {
      nestSize,
      sizeCode,
      brightnessLevel,
      fensterMaterial,
      materialCode,
      imageKey,
    });

    // Get image path from IMAGES.pvModule (where the overlay images are stored)
    const imagePath = IMAGES.pvModule[imageKey as keyof typeof IMAGES.pvModule];

    if (!imagePath) {
      console.warn(
        `🌟 BelichtungsPaket overlay image not found for key: ${imageKey}`
      );
      // Fallback to the simple brightness overlay if detailed overlay not found
      return IMAGES.brightnessLevel[brightnessLevel];
    }

    return imagePath;
  };

  const overlayImagePath = getImagePath();

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Belichtungspaket overlay image - EXACT same styling as main preview image */}
      <HybridBlobImage
        key={`belichtungspaket-${nestSize}-${brightnessLevel}-${fensterMaterial}`} // Force re-render when any prop changes
        path={overlayImagePath}
        alt={`Belichtungspaket ${brightnessLevel} Overlay - ${fensterMaterial}`}
        fill
        className="transition-opacity duration-300 object-contain z-30" // Higher z-index than other overlays
        strategy="client"
        isInteractive={true}
        enableCache={true}
        sizes="(max-width: 1023px) 100vw, 70vw"
        quality={85}
      />
    </div>
  );
}
