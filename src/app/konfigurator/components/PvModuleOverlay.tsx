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

  // Calculate total modules (each "moduleCount" represents 3 actual modules)
  const totalModules = moduleCount * 3;

  // Determine which overlay image to use based on module count and nest size
  const getOverlayImage = (nestSize: string, moduleCount: number) => {
    // For nest80 (75m²), use the new progressive overlay system
    if (nestSize === "nest80") {
      if (moduleCount === 1) {
        return IMAGES.pvModule.nest75_solar_overlay_mod_1;
      } else if (moduleCount === 2) {
        return IMAGES.pvModule.nest75_solar_overlay_mod_2;
      } else if (moduleCount === 3) {
        return IMAGES.pvModule.nest75_solar_overlay_mod_3;
      } else if (moduleCount >= 4) {
        return IMAGES.pvModule.nest75_solar_overlay_mod_4;
      }
    }

    // For other nest sizes, use the original overlay (future: will have their own overlays)
    return IMAGES.pvModule.pvOverlay;
  };

  const overlayImagePath = getOverlayImage(nestSize, moduleCount);

  // Only show counter for amounts above 4 modules (for nest80) or any amount (for other sizes)
  const shouldShowCounter =
    nestSize === "nest80" ? moduleCount > 4 : moduleCount > 0;

  // Calculate responsive counter positioning and sizing - positioned lower when visible
  const counterSize = {
    desktop: Math.round(28 * imageMetrics.scaleFactor), // Half size: 28px instead of 56px
    mobile: Math.round(24 * imageMetrics.scaleFactor), // Half size: 24px instead of 48px
  };

  // Position counter lower - at the height where the old PV overlay was positioned
  const counterTop = imageMetrics.imageTop + imageMetrics.imageHeight * 0.25; // Position 25% down from top of image (lower than before)
  const counterTopMobile =
    imageMetrics.imageTop + imageMetrics.imageHeight * 0.3; // Position 30% down from top of image on mobile (lower than before)

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
          {/* Desktop: Lower position within the image area */}
          <div
            className="absolute bg-[#3D6DE1] text-white rounded-full flex items-center justify-center font-bold shadow-lg
                       hidden md:flex z-20"
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
            +{moduleCount - 4}{" "}
            {/* Show additional modules beyond 4 (e.g., +1 for 5 modules) */}
          </div>

          {/* Mobile: Close to overlay, 5% right of center, at overlay height */}
          <div
            className="absolute bg-[#3D6DE1] text-white rounded-full flex items-center justify-center font-bold shadow-lg
                       md:hidden z-20"
            style={{
              left: "55%", // 5% right of center (50% + 5%)
              top: `${counterTopMobile}px`, // Positioned lower than before (30% down from top of actual image)
              width: `${counterSize.mobile}px`,
              height: `${counterSize.mobile}px`,
              fontSize: `${Math.round(8 * imageMetrics.scaleFactor)}px`, // Smaller font for mobile half-size
              transform: "translateX(-50%)", // Center the counter on its position
              minWidth: "18px", // Smaller minimum for mobile half-size
              minHeight: "18px",
            }}
          >
            +{moduleCount - 4}{" "}
            {/* Show additional modules beyond 4 (e.g., +1 for 5 modules) */}
          </div>
        </>
      )}
    </div>
  );
}
