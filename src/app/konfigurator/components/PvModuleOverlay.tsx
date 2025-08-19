"use client";

import React from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface PvModuleOverlayProps {
  nestSize: "nest80" | "nest100" | "nest120" | "nest140" | "nest160";
  moduleCount: number;
  isVisible?: boolean; // New prop to control visibility via checkbox
  className?: string;
}

export default function PvModuleOverlay({
  nestSize: _nestSize,
  moduleCount,
  isVisible = true,
  className = "",
}: PvModuleOverlayProps) {
  // Don't render if no modules selected or visibility is disabled
  if (moduleCount === 0 || !isVisible) {
    return null;
  }

  // Calculate total modules (each "moduleCount" represents 3 actual modules)
  const totalModules = moduleCount * 3;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Single centered PV overlay image - truly 2x larger */}
      <div
        className="absolute"
        style={{
          left: "50%", // Center horizontally
          top: "12%", // Position for the image
          width: "80%", // 2x larger: 25% → 50%
          height: "70%", // 2x larger: 20% → 40%
          transform: "translateX(-50%)", // Center the image
        }}
      >
        <HybridBlobImage
          path={IMAGES.pvModue.pvOverlay}
          strategy="client"
          alt="PV Module Overlay"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Module count text - positioned directly above the image with minimal gap */}
      <div
        className="absolute bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold shadow-lg"
        style={{
          left: "50%",
          top: "18%", // Just above the image (12% - 3% = minimal gap)
          transform: "translateX(-50%)",
        }}
      >
        +{totalModules}
      </div>
    </div>
  );
}
