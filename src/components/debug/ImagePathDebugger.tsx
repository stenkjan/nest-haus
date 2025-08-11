"use client";

import React, { useState, useEffect } from "react";
import { IMAGES } from "@/constants/images";

/**
 * ImagePathDebugger - Development tool to verify mobile/desktop image path selection
 *
 * Shows what image paths are being selected for landing page sections
 * Only renders in development mode
 */
export default function ImagePathDebugger() {
  const [isClient, setIsClient] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setIsClient(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== "development" || !isClient) {
    return null;
  }

  const getMobileImagePath = (imagePath: string): string => {
    const mobileMapping: { [key: string]: string } = {
      [IMAGES.hero.nestHaus1]: IMAGES.hero.mobile.nestHaus1,
      [IMAGES.hero.nestHaus2]: IMAGES.hero.mobile.nestHaus2,
      [IMAGES.hero.nestHaus3]: IMAGES.hero.mobile.nestHaus3,
      [IMAGES.hero.nestHaus4]: IMAGES.hero.mobile.nestHaus4,
      [IMAGES.hero.nestHaus5]: IMAGES.hero.mobile.nestHaus5,
      [IMAGES.hero.nestHaus6]: IMAGES.hero.mobile.nestHaus6,
      [IMAGES.hero.nestHaus7]: IMAGES.hero.mobile.nestHaus7,
      [IMAGES.hero.nestHaus8]: IMAGES.hero.mobile.nestHaus8,
    };
    return mobileMapping[imagePath] || imagePath;
  };

  const isMobile = windowWidth < 768;
  const sections = [
    { id: 1, imagePath: IMAGES.hero.nestHaus1 },
    { id: 2, imagePath: IMAGES.hero.nestHaus2 },
    { id: 3, imagePath: IMAGES.hero.nestHaus3 },
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg z-50 max-w-md text-xs">
      <h3 className="font-bold mb-2">🛠️ Image Path Debug</h3>
      <div className="mb-2">
        <strong>Screen:</strong> {windowWidth}px (
        {isMobile ? "Mobile" : "Desktop"})
      </div>

      {sections.map((section) => {
        const desktopPath = section.imagePath;
        const mobilePath = getMobileImagePath(section.imagePath);
        const selectedPath = isMobile ? mobilePath : desktopPath;

        return (
          <div key={section.id} className="mb-2 border-t pt-2">
                       <div>
             <strong>Section {section.id}:</strong>
           </div>
           <div className="text-green-400">✅ Selected: {selectedPath}</div>
           <div className="text-gray-400">💻 Desktop: {desktopPath}</div>
           <div className="text-gray-400">📱 Mobile: {mobilePath}</div>
           <div className="text-yellow-400">
             Using: {selectedPath.includes("-mobile") ? "Mobile" : "Desktop"} variant
           </div>
           <div className="text-blue-400">
             📐 Ratio: {isMobile ? "Natural (vertical)" : "16:9 (landscape)"}
           </div>
          </div>
        );
      })}
    </div>
  );
}
