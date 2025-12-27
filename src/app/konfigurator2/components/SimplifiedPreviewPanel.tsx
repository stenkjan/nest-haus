"use client";

import React, { useMemo } from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";
import { NEST_SIZE_MAPPING, GEBAEUDE_EXTERIOR_MAPPING } from "@/constants/configurator";

interface SimplifiedPreviewPanelProps {
  selectedNest: string | null;
  selectedFacade: string | null;
}

export default function SimplifiedPreviewPanel({
  selectedNest,
  selectedFacade,
}: SimplifiedPreviewPanelProps) {
  // Get the appropriate image path based on selections
  const imagePath = useMemo(() => {
    // Default to nest80 + holzlattung if nothing selected
    const nestSize = selectedNest ? NEST_SIZE_MAPPING[selectedNest] : '75';
    const facadeType = selectedFacade ? GEBAEUDE_EXTERIOR_MAPPING[selectedFacade] : 'holzlattung';

    // Build the image key for exterior view (images from images.ts line 228-251)
    const imageKey = `nest${nestSize}_${facadeType}` as keyof typeof IMAGES.configurations;

    return IMAGES.configurations[imageKey] || IMAGES.configurations.nest75_trapezblech;
  }, [selectedNest, selectedFacade]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4">
      <div className="relative w-full h-full max-w-[800px] max-h-[600px]">
        <HybridBlobImage
          path={imagePath}
          alt="®Hoam Haus Vorschau"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
