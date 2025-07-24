"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface ImageGlassCardProps {
  maxWidth?: boolean;
  backgroundColor?: "white" | "black";
  image?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function ImageGlassCard({
  maxWidth = true,
  backgroundColor = "black",
  image = IMAGES.function.nestHausHandDrawing, // 26-NEST-Haus-Planung-Innenausbau-Zeichnen-Grundriss
  primaryButtonText = "Primary Action",
  secondaryButtonText = "Secondary Action",
  onPrimaryClick = () => console.log("Primary button clicked"),
  onSecondaryClick = () => console.log("Secondary button clicked"),
}: ImageGlassCardProps) {
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);
  }, []);

  // Track screen width for responsive behavior
  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  const containerClasses = maxWidth
    ? "w-full max-w-screen-2xl mx-auto"
    : "w-full";

  // Background classes
  const backgroundClasses =
    backgroundColor === "black" ? "bg-black" : "bg-white";

  // Calculate max width based on screen size, let image determine height
  const getMaxCardWidth = () => {
    if (!isClient) return 600;

    // Use max-w-[1550px] to match unser-part page image sections
    const maxWidth = 1550;

    if (screenWidth >= 1600) {
      return Math.min(maxWidth, screenWidth * 0.85);
    } else if (screenWidth >= 1024) {
      return Math.min(maxWidth * 0.8, screenWidth * 0.7);
    } else if (screenWidth >= 768) {
      return Math.min(maxWidth * 0.6, screenWidth * 0.8);
    } else {
      return Math.min(maxWidth * 0.4, screenWidth * 0.9);
    }
  };

  const maxCardWidth = getMaxCardWidth();

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className={`${containerClasses} ${backgroundClasses} py-8`}>
        <div className="px-4 md:px-8">
          <div className="flex justify-center">
            <div
              className="animate-pulse bg-gray-800 rounded-3xl"
              style={{ width: 600, height: 400 }}
            />
          </div>
          <div className="flex gap-4 justify-center mt-8">
            <div
              className="animate-pulse bg-gray-700 rounded"
              style={{ width: 120, height: 40 }}
            />
            <div
              className="animate-pulse bg-gray-700 rounded"
              style={{ width: 120, height: 40 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${backgroundClasses} py-8`}>
      <div className={`${containerClasses}`}>
        <div className="px-4 md:px-8">
          <div className="flex justify-center">
            {/* Glass Card with Image - Natural aspect ratio */}
            <motion.div
              className="flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              style={{
                maxWidth: maxCardWidth,
                backgroundColor: "#121212",
                boxShadow:
                  "inset 0 6px 12px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Image with Natural Aspect Ratio */}
              <div className="relative w-full">
                <HybridBlobImage
                  path={image}
                  alt="NEST-Haus Planung und Innenausbau Zeichnung Grundriss"
                  width={maxCardWidth}
                  height={0}
                  className="w-full h-auto object-cover"
                  strategy="client"
                  isInteractive={true}
                  enableCache={true}
                  sizes={`(max-width: 768px) 90vw, (max-width: 1024px) 70vw, (max-width: 1600px) 50vw, 45vw`}
                />
              </div>
            </motion.div>
          </div>

          {/* Buttons */}
          <motion.div
            className="flex gap-4 justify-center mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Button variant="secondary" size="xs" onClick={onSecondaryClick}>
              {secondaryButtonText}
            </Button>
            <Button variant="primary" size="xs" onClick={onPrimaryClick}>
              {primaryButtonText}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
