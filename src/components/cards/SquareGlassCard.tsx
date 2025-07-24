"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface SquareGlassCardProps {
  maxWidth?: boolean;
  backgroundColor?: "white" | "black";
  image?: string;
  size?: "small" | "medium" | "large";
}

export default function SquareGlassCard({
  maxWidth = true,
  backgroundColor = "black",
  image = IMAGES.function.nestHausHandDrawing,
  size = "medium",
}: SquareGlassCardProps) {
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

  // Calculate square card size based on screen size and size prop
  const getCardSize = () => {
    if (!isClient) return 400;

    const sizeMultipliers = {
      small: 0.6,
      medium: 0.8,
      large: 1.0,
    };

    const multiplier = sizeMultipliers[size];

    if (screenWidth >= 1600) {
      return Math.min(600 * multiplier, screenWidth * 0.4);
    } else if (screenWidth >= 1024) {
      return Math.min(500 * multiplier, screenWidth * 0.45);
    } else if (screenWidth >= 768) {
      return Math.min(400 * multiplier, screenWidth * 0.6);
    } else {
      return Math.min(300 * multiplier, screenWidth * 0.8);
    }
  };

  const cardSize = getCardSize();

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className={`${containerClasses} ${backgroundClasses} py-8`}>
        <div className="px-4 md:px-8">
          <div className="flex justify-center">
            <div
              className="animate-pulse bg-gray-800 rounded-3xl"
              style={{ width: 400, height: 400 }}
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
            {/* Square Glass Card with 1:1 Aspect Ratio */}
            <motion.div
              className="flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              style={{
                width: cardSize,
                height: cardSize,
                backgroundColor: "#121212",
                boxShadow:
                  "inset 0 6px 12px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Square Image with 1:1 Aspect Ratio */}
              <div className="relative w-full h-full">
                <HybridBlobImage
                  path={image}
                  alt="NEST-Haus Square Glass Card"
                  fill
                  className="object-cover"
                  strategy="client"
                  isInteractive={true}
                  enableCache={true}
                  sizes={`(max-width: 768px) 80vw, (max-width: 1024px) 60vw, (max-width: 1600px) 40vw, 35vw`}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
