"use client";

import React, { useState, useEffect, useRef } from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface PvModuleOverlayProps {
  nestSize: "nest80" | "nest100" | "nest120" | "nest140" | "nest160";
  moduleCount: number;
  isVisible?: boolean; // New prop to control visibility via checkbox
  className?: string;
}

export default function PvModuleOverlay({
  nestSize,
  moduleCount,
  isVisible = true,
  className = "",
}: PvModuleOverlayProps) {
  const [imageMetrics, setImageMetrics] = useState({
    containerWidth: 0,
    containerHeight: 0,
    imageTop: 0,
    imageHeight: 0,
    scaleFactor: 1,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate actual rendered image dimensions
  useEffect(() => {
    const calculateImageMetrics = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // For object-contain images, calculate the actual rendered size
      // Assuming the overlay image has similar aspect ratio to the main preview image
      const containerAspectRatio = containerWidth / containerHeight;

      // Typical house image aspect ratio (adjust if needed)
      const imageAspectRatio = 16 / 9; // or 4/3, depending on your images

      let renderedWidth, renderedHeight, imageTop, _imageLeft;

      if (containerAspectRatio > imageAspectRatio) {
        // Container is wider than image - image is constrained by height
        renderedHeight = containerHeight;
        renderedWidth = renderedHeight * imageAspectRatio;
        imageTop = 0;
        _imageLeft = (containerWidth - renderedWidth) / 2;
      } else {
        // Container is taller than image - image is constrained by width
        renderedWidth = containerWidth;
        renderedHeight = renderedWidth / imageAspectRatio;
        imageTop = (containerHeight - renderedHeight) / 2;
        _imageLeft = 0;
      }

      // Calculate scale factor for responsive text sizing
      const scaleFactor = Math.min(renderedWidth / 800, renderedHeight / 450); // Base size reference

      setImageMetrics({
        containerWidth,
        containerHeight,
        imageTop,
        imageHeight: renderedHeight,
        scaleFactor: Math.max(0.5, Math.min(1.5, scaleFactor)), // Clamp between 0.5x and 1.5x
      });
    };

    // Initial calculation
    calculateImageMetrics();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateImageMetrics);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", calculateImageMetrics);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateImageMetrics);
    };
  }, []);

  // Don't render if no modules selected or visibility is disabled
  if (moduleCount === 0 || !isVisible) {
    return null;
  }

  // Determine which overlay image to use based on module count and nest size
  const getOverlayImage = (nestSize: string, moduleCount: number) => {
    switch (nestSize) {
      case "nest80": // 75m² - 4 modules max
        if (moduleCount === 1)
          return IMAGES.pvModule.nest75_solar_overlay_mod_1;
        if (moduleCount === 2)
          return IMAGES.pvModule.nest75_solar_overlay_mod_2;
        if (moduleCount === 3)
          return IMAGES.pvModule.nest75_solar_overlay_mod_3;
        if (moduleCount >= 4) return IMAGES.pvModule.nest75_solar_overlay_mod_4;
        break;

      case "nest100": // 95m² - 5 modules max
        if (moduleCount === 1)
          return IMAGES.pvModule.nest95_solar_overlay_mod_1;
        if (moduleCount === 2)
          return IMAGES.pvModule.nest95_solar_overlay_mod_2;
        if (moduleCount === 3)
          return IMAGES.pvModule.nest95_solar_overlay_mod_3;
        if (moduleCount === 4)
          return IMAGES.pvModule.nest95_solar_overlay_mod_4;
        if (moduleCount >= 5) return IMAGES.pvModule.nest95_solar_overlay_mod_5;
        break;

      case "nest120": // 115m² - 6 modules max
        if (moduleCount === 1)
          return IMAGES.pvModule.nest115_solar_overlay_mod_1;
        if (moduleCount === 2)
          return IMAGES.pvModule.nest115_solar_overlay_mod_2;
        if (moduleCount === 3)
          return IMAGES.pvModule.nest115_solar_overlay_mod_3;
        if (moduleCount === 4)
          return IMAGES.pvModule.nest115_solar_overlay_mod_4;
        if (moduleCount === 5)
          return IMAGES.pvModule.nest115_solar_overlay_mod_5;
        if (moduleCount >= 6)
          return IMAGES.pvModule.nest115_solar_overlay_mod_6;
        break;

      case "nest140": // 135m² - 7 modules max
        if (moduleCount === 1)
          return IMAGES.pvModule.nest135_solar_overlay_mod_1;
        if (moduleCount === 2)
          return IMAGES.pvModule.nest135_solar_overlay_mod_2;
        if (moduleCount === 3)
          return IMAGES.pvModule.nest135_solar_overlay_mod_3;
        if (moduleCount === 4)
          return IMAGES.pvModule.nest135_solar_overlay_mod_4;
        if (moduleCount === 5)
          return IMAGES.pvModule.nest135_solar_overlay_mod_5;
        if (moduleCount === 6)
          return IMAGES.pvModule.nest135_solar_overlay_mod_6;
        if (moduleCount >= 7)
          return IMAGES.pvModule.nest135_solar_overlay_mod_7;
        break;

      case "nest160": // 155m² - 8 modules max
        if (moduleCount === 1)
          return IMAGES.pvModule.nest155_solar_overlay_mod_1;
        if (moduleCount === 2)
          return IMAGES.pvModule.nest155_solar_overlay_mod_2;
        if (moduleCount === 3)
          return IMAGES.pvModule.nest155_solar_overlay_mod_3;
        if (moduleCount === 4)
          return IMAGES.pvModule.nest155_solar_overlay_mod_4;
        if (moduleCount === 5)
          return IMAGES.pvModule.nest155_solar_overlay_mod_5;
        if (moduleCount === 6)
          return IMAGES.pvModule.nest155_solar_overlay_mod_6;
        if (moduleCount === 7)
          return IMAGES.pvModule.nest155_solar_overlay_mod_7;
        if (moduleCount >= 8)
          return IMAGES.pvModule.nest155_solar_overlay_mod_8;
        break;
    }

    // Fallback to original overlay if something goes wrong
    return IMAGES.pvModule.pvOverlay;
  };

  const overlayImagePath = getOverlayImage(nestSize, moduleCount);

  // Determine maximum modules and counter logic for each nest size
  const getMaxModules = (nestSize: string) => {
    switch (nestSize) {
      case "nest80":
        return 4; // 75m² - 4 modules max
      case "nest100":
        return 5; // 95m² - 5 modules max
      case "nest120":
        return 6; // 115m² - 6 modules max
      case "nest140":
        return 7; // 135m² - 7 modules max
      case "nest160":
        return 8; // 155m² - 8 modules max
      default:
        return 0;
    }
  };

  const maxModules = getMaxModules(nestSize);
  const shouldShowCounter = moduleCount > maxModules;

  // Calculate responsive counter positioning and sizing - positioned lower when visible
  const counterSize = {
    desktop: Math.round(28 * imageMetrics.scaleFactor), // Half size: 28px instead of 56px
    mobile: Math.round(24 * imageMetrics.scaleFactor), // Half size: 24px instead of 48px
  };

  // Position counter lower - at the height where the old PV overlay was positioned
  const counterTop = imageMetrics.imageTop + imageMetrics.imageHeight * 0.25; // Position 25% down from top of image (lower than before)
  const counterTopMobile =
    imageMetrics.imageTop + imageMetrics.imageHeight * 0.20; // Position 25% down from top of image on mobile (5% higher than before)

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      {/* PV overlay image - EXACT same styling as main preview image */}
      <HybridBlobImage
        key={`pv-overlay-${nestSize}-${moduleCount}`} // Force re-render when module count changes
        path={overlayImagePath}
        alt="PV Module Overlay"
        fill
        className="transition-opacity duration-300 object-contain z-10"
        strategy="client"
        isInteractive={true}
        enableCache={true}
        sizes="(max-width: 1023px) 100vw, 70vw"
        quality={85}
      />

      {/* Module count badge - only show for amounts above 4 modules */}
      {shouldShowCounter && (
        <>
          {/* Desktop: Lower position within the image area (above 770px) */}
          <div
            className="absolute bg-[#3D6DE1] text-white rounded-full flex items-center justify-center font-bold shadow-lg
                       hidden min-[770px]:flex z-20"
            style={{
              left: "50%",
              top: `${counterTop}px`, // Positioned lower than before (25% down from top of actual image)
              width: `${counterSize.desktop}px`,
              height: `${counterSize.desktop}px`,
              fontSize: `${Math.round(10 * imageMetrics.scaleFactor)}px`, // Smaller font for half-size counter
              transform: "translateX(-50%)",
              minWidth: "20px", // Smaller minimum for half-size
              minHeight: "20px",
            }}
          >
            +{moduleCount - maxModules}{" "}
            {/* Show additional modules beyond max (e.g., +1 for nest80 with 5 modules) */}
          </div>

          {/* Mobile: Positioned more to the right and slightly higher (below 770px) */}
          <div
            className="absolute bg-[#3D6DE1] text-white rounded-full flex items-center justify-center font-bold shadow-lg
                       max-[769px]:flex min-[770px]:hidden z-20"
            style={{
              left: "50%", // 30% right of center (50% + 30%)
              top: `${counterTopMobile}px`, // Positioned 25% down from top of actual image (5% higher than before)
              width: `${counterSize.mobile}px`,
              height: `${counterSize.mobile}px`,
              fontSize: `${Math.round(8 * imageMetrics.scaleFactor)}px`, // Smaller font for mobile half-size
              transform: "translateX(-50%)", // Center the counter on its position
              minWidth: "18px", // Smaller minimum for mobile half-size
              minHeight: "18px",
            }}
          >
            +{moduleCount - maxModules}{" "}
            {/* Show additional modules beyond max (e.g., +1 for nest80 with 5 modules) */}
          </div>
        </>
      )}
    </div>
  );
}
