"use client";

import React, { useState, useEffect, useRef } from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface FensterOverlayProps {
  fensterType: "pvc_fenster" | "holz" | "aluminium_schwarz" | "aluminium_weiss";
  isVisible?: boolean;
  className?: string;
}

export default function FensterOverlay({
  fensterType,
  isVisible = true,
  className = "",
}: FensterOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_imageMetrics, setImageMetrics] = useState({
    imageTop: 0,
    imageLeft: 0,
    imageWidth: 0,
    imageHeight: 0,
    scaleFactor: 1,
  });

  // Map fenster types to overlay image paths using constants
  const getOverlayImage = (type: string) => {
    const overlayMappings: Record<string, string> = {
      holz: IMAGES.fensterOverlays.holz,
      pvc_fenster: IMAGES.fensterOverlays.pvc_fenster,
      aluminium_weiss: IMAGES.fensterOverlays.aluminium_weiss,
      aluminium_schwarz: IMAGES.fensterOverlays.aluminium_schwarz,
    };

    return overlayMappings[type] || IMAGES.fensterOverlays.holz; // Default to holz
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  const overlayImagePath = getOverlayImage(fensterType);

  // Update image metrics when container size changes
  useEffect(() => {
    const updateMetrics = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      // Calculate image dimensions maintaining aspect ratio
      const containerAspectRatio = containerRect.width / containerRect.height;
      const imageAspectRatio = 16 / 9; // Assuming 16:9 aspect ratio for overlay images

      let imageWidth, imageHeight, imageLeft, imageTop;

      if (containerAspectRatio > imageAspectRatio) {
        // Container is wider than image - fit to height
        imageHeight = containerRect.height;
        imageWidth = imageHeight * imageAspectRatio;
        imageLeft = (containerRect.width - imageWidth) / 2;
        imageTop = 0;
      } else {
        // Container is taller than image - fit to width
        imageWidth = containerRect.width;
        imageHeight = imageWidth / imageAspectRatio;
        imageLeft = 0;
        imageTop = (containerRect.height - imageHeight) / 2;
      }

      const scaleFactor = Math.min(
        containerRect.width / 1200, // Assuming base width of 1200px
        containerRect.height / 800 // Assuming base height of 800px
      );

      setImageMetrics({
        imageTop,
        imageLeft,
        imageWidth,
        imageHeight,
        scaleFactor: Math.max(scaleFactor, 0.5), // Minimum scale factor
      });
    };

    // Initial calculation
    updateMetrics();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateMetrics);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      {/* Fenster overlay image - EXACT same styling as main preview image */}
      <HybridBlobImage
        key={`fenster-overlay-${fensterType}`}
        path={overlayImagePath}
        alt={`Fenster Material Overlay - ${fensterType}`}
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
