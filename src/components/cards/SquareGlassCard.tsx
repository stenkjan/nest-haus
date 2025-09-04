"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface SquareGlassCardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface SquareGlassCardProps {
  maxWidth?: boolean;
  backgroundColor?: "white" | "black";
  size?: "small" | "medium" | "large";
  cardData?: SquareGlassCardData;
}

// Default card data
const defaultCardData: SquareGlassCardData = {
  id: 1,
  title: "NEST-Haus Planning",
  subtitle: "Hand-drawn floor plans",
  description:
    "Innovative planning with hand-drawn precision and digital accuracy for your perfect home.",
  image: IMAGES.function.nestHausHandDrawing,
};

export default function SquareGlassCard({
  maxWidth = true,
  backgroundColor = "black",
  size = "medium",
  cardData = defaultCardData,
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

  // Calculate square card size based on screen size and size prop (same scaling as ContentCardsGlass)
  const getCardSize = () => {
    if (!isClient) return 600;

    const sizeMultipliers = {
      small: 0.7,
      medium: 0.85,
      large: 1.0,
    };

    const multiplier = sizeMultipliers[size];

    // Use similar widths to ContentCardsGlass but maintain square aspect ratio
    if (screenWidth >= 1600) {
      // Ultra-wide screens: Match ContentCardsGlass large size
      return Math.min(830 * multiplier, screenWidth * 0.5);
    } else if (screenWidth >= 1280) {
      // Desktop XL: Match ContentCardsGlass XL size
      return Math.min(692 * multiplier, screenWidth * 0.55);
    } else if (screenWidth >= 1024) {
      // Desktop: Match ContentCardsGlass desktop size
      return Math.min(600 * multiplier, screenWidth * 0.6);
    } else if (screenWidth >= 768) {
      // Tablet: Match ContentCardsGlass tablet size
      return Math.min(480 * multiplier, screenWidth * 0.65);
    } else {
      // Mobile: Match ContentCardsGlass mobile size
      return Math.min(400 * multiplier, screenWidth * 0.9);
    }
  };

  const cardSize = getCardSize();

  // Calculate height: square for desktop, taller for tablet/mobile to fit text + 2:3 image
  const cardHeight =
    screenWidth >= 1024
      ? cardSize
      : Math.min(
          cardSize * 1.4,
          typeof window !== "undefined"
            ? window.innerHeight * 0.8
            : cardSize * 1.4
        );

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className={`${containerClasses} ${backgroundClasses} py-8`}>
        <div className="px-4 md:px-8">
          <div className="flex justify-center">
            <div
              className="animate-pulse bg-gray-800 rounded-3xl"
              style={{ width: 600, height: 600 }}
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
              className="flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              style={{
                width: cardSize,
                height: cardHeight,
                backgroundColor: "#121212",
                boxShadow:
                  "inset 0 6px 12px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {/* Text Content - Top Section */}
              <div className="flex-shrink-0 flex flex-col justify-center items-center text-center p-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white mb-2">
                    {cardData.title}
                  </h2>
                  <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-gray-300 mb-5">
                    {cardData.subtitle}
                  </h3>
                  <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-white leading-relaxed whitespace-pre-line">
                    {cardData.description}
                  </p>
                </motion.div>
              </div>

              {/* Image Content - Bottom Section with 2:3 aspect ratio */}
              <div className="flex-1 relative overflow-hidden p-[15px]">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="relative w-full h-full rounded-3xl overflow-hidden"
                  style={{
                    aspectRatio: "2/3",
                  }}
                >
                  <HybridBlobImage
                    path={cardData.image}
                    alt={cardData.title}
                    fill
                    className="object-cover object-center"
                    strategy="client"
                    isInteractive={true}
                    enableCache={true}
                    sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 30vw, (max-width: 1600px) 25vw, 20vw`}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
