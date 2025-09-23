"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";
import "./mobile-scroll-optimizations.css";

interface SquareCardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  backgroundColor?: string;
}

interface SquareGlassCardsScrollProps {
  maxWidth?: boolean;
  backgroundColor?: "white" | "black";
  title?: string;
  subtitle?: string;
  showInstructions?: boolean;
  customData?: SquareCardData[];
  onCardClick?: (cardId: number) => void;
}

// Default square card data with descriptions
const defaultSquareCardData: SquareCardData[] = [
  {
    id: 1,
    title: "NEST-Haus Planning",
    subtitle: "Hand-drawn floor plans",
    description:
      "Innovative planning with hand-drawn precision and digital accuracy for your perfect home.",
    image: IMAGES.function.nestHausHandDrawing,
    backgroundColor: "#121212",
  },
  {
    id: 2,
    title: "Mountain Vision",
    subtitle: "Alpine architecture",
    description:
      "Stunning Alpine design with natural wood cladding that harmonizes with mountain landscapes.",
    image:
      "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    backgroundColor: "#121212",
  },
  {
    id: 3,
    title: "Modular System",
    subtitle: "7 modules, white facade",
    description:
      "Flexible modular building system with clean white facade panels for modern architectural aesthetics.",
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    backgroundColor: "#121212",
  },
  {
    id: 4,
    title: "Ensemble Living",
    subtitle: "3 buildings, wood cladding",
    description:
      "Harmonious ensemble of multiple NEST units with natural larch wood cladding for community living.",
    image:
      "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
    backgroundColor: "#121212",
  },
  {
    id: 5,
    title: "Winter Design",
    subtitle: "Black trapezoidal facade",
    description:
      "Bold winter architecture with black trapezoidal metal facade designed for alpine environments.",
    image:
      "/images/4-NEST-Haus-2-Gebaeude-Schnee-Stirnseite-Schwarze-Trapezblech-Fassade.png",
    backgroundColor: "#121212",
  },
  {
    id: 6,
    title: "Forest Integration",
    subtitle: "6 modules, black facade",
    description:
      "Perfect forest integration with black facade panels creating elegant contrast with green landscape.",
    image:
      "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
    backgroundColor: "#121212",
  },
];

export default function SquareGlassCardsScroll({
  maxWidth = true,
  backgroundColor = "black",
  title = "Square Glass Cards",
  subtitle = "Navigate with arrow keys",
  showInstructions = true,
  customData,
  onCardClick,
}: SquareGlassCardsScrollProps) {
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [cardSize, setCardSize] = useState(400);
  const [currentIndex, setCurrentIndex] = useState(0);

  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation state for smooth transitions
  const [isAnimating, setIsAnimating] = useState(false);

  const cardData = customData || defaultSquareCardData;

  const gap = 24;

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);

    // Center the first card initially
    const containerWidth = window.innerWidth;
    let centerOffset;

    if (containerWidth < 768) {
      // Mobile: Center the card perfectly in viewport, accounting for container padding
      const containerPadding = 32; // px-4 = 16px on each side = 32px total
      centerOffset = (containerWidth - cardSize - containerPadding) / 2; // Center within available space
    } else {
      // Desktop/Tablet: Use existing logic
      const effectiveWidth =
        containerWidth < 1024 ? containerWidth - 32 : containerWidth;
      centerOffset =
        (effectiveWidth - cardSize) / 2 + (containerWidth < 1024 ? 16 : 0);
    }

    x.set(centerOffset);
  }, [cardSize, x]);

  // Calculate responsive dimensions for square cards (same scaling as ContentCardsGlass)
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      setScreenWidth(width);

      // Match ContentCardsGlass sizing but adapted for square cards with multiple per view
      if (width >= 1600) {
        // Ultra-wide screens: Large cards, fewer per view
        setCardsPerView(1.8);
        setCardSize(720);
      } else if (width >= 1280) {
        // Desktop XL: Large cards, fewer per view
        setCardsPerView(1.6);
        setCardSize(650);
      } else if (width >= 1024) {
        // Desktop: Medium-large cards, fewer per view
        setCardsPerView(1.4);
        setCardSize(580);
      } else if (width >= 768) {
        // Tablet: Medium cards, taller height
        setCardsPerView(1.8);
        setCardSize(400);
      } else {
        // Mobile: Smaller cards, 1+ per view
        setCardsPerView(1.2);
        setCardSize(350);
      }

      // Recenter the current card after dimension changes
      if (isClient) {
        const containerWidth = width;
        let centerOffset;

        if (containerWidth < 768) {
          // Mobile: Center the card perfectly in viewport, accounting for container padding
          const containerPadding = 32; // px-4 = 16px on each side = 32px total
          centerOffset = (containerWidth - cardSize - containerPadding) / 2; // Center within available space
        } else {
          // Desktop/Tablet: Use existing logic
          const effectiveWidth =
            containerWidth < 1024 ? containerWidth - 32 : containerWidth;
          centerOffset =
            (effectiveWidth - cardSize) / 2 + (containerWidth < 1024 ? 16 : 0);
        }

        const cardPosition = currentIndex * (cardSize + gap);
        const newX = centerOffset - cardPosition;
        x.set(newX);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isClient, currentIndex, cardSize, gap, x]);

  const maxIndex = Math.max(0, cardData.length - Math.floor(cardsPerView));

  // Navigation logic
  const navigateCard = useCallback(
    (direction: number) => {
      const newIndex = Math.max(
        0,
        Math.min(maxIndex, currentIndex + direction)
      );
      setCurrentIndex(newIndex);

      // Calculate position to center the active card
      const containerWidth =
        typeof window !== "undefined" ? window.innerWidth : 1200;

      let centerOffset;
      if (containerWidth < 768) {
        // Mobile: Center the card perfectly in viewport, accounting for container padding
        const containerPadding = 32; // px-4 = 16px on each side = 32px total
        centerOffset = (containerWidth - cardSize - containerPadding) / 2; // Center within available space
      } else {
        // Desktop/Tablet: Use existing logic
        const effectiveWidth =
          containerWidth < 1024 ? containerWidth - 32 : containerWidth;
        centerOffset =
          (effectiveWidth - cardSize) / 2 + (containerWidth < 1024 ? 16 : 0);
      }

      const cardPosition = newIndex * (cardSize + gap);
      const newX = centerOffset - cardPosition;

      // Add smooth animation for arrow navigation
      setIsAnimating(true);
      animate(x, newX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        duration: 0.3,
      }).then(() => {
        setIsAnimating(false);
      });
    },
    [currentIndex, cardSize, gap, x, maxIndex]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        navigateCard(-1);
      } else if (event.key === "ArrowRight") {
        navigateCard(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateCard]);

  const containerClasses = maxWidth
    ? "w-full max-w-screen-2xl mx-auto"
    : "w-full";

  const backgroundClasses =
    backgroundColor === "black" ? "bg-black" : "bg-white";
  const textColor =
    backgroundColor === "black" ? "text-white" : "text-gray-900";

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className={`${backgroundClasses} py-12`}>
        <div className={`${containerClasses} px-4 md:px-8`}>
          <div className="text-center mb-8">
            <div className="animate-pulse bg-gray-700 h-8 w-64 mx-auto mb-2" />
            <div className="animate-pulse bg-gray-700 h-4 w-96 mx-auto" />
          </div>
          <div className="flex gap-6 justify-center">
            <div
              className="animate-pulse bg-gray-800 rounded-3xl"
              style={{ width: 650, height: 650 }}
            />
            <div
              className="animate-pulse bg-gray-800 rounded-3xl"
              style={{ width: 650, height: 650 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${backgroundClasses} py-12`}>
      <div className={`${containerClasses}`}>
        {/* Header */}
        <div className="text-center mb-12 px-4 md:px-8">
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold ${textColor} mb-3`}
          >
            {title}
          </h2>
          <h3
            className={`text-base md:text-lg lg:text-xl 2xl:text-2xl ${
              backgroundColor === "black" ? "text-gray-300" : "text-gray-600"
            } mb-8`}
          >
            {subtitle}
          </h3>
        </div>

        {/* Cards Container */}
        <div className="relative overflow-x-clip">
          <div
            ref={containerRef}
            className={`overflow-x-hidden cards-scroll-container ${
              isClient && screenWidth < 1024
                ? "cards-scroll-snap cards-touch-optimized cards-no-bounce"
                : ""
            } px-4 md:px-8 cursor-grab active:cursor-grabbing`}
            style={{ overflow: "visible" }}
          >
            <motion.div
              className="flex"
              style={{
                x,
                gap: `${gap}px`,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 35,
                mass: 0.8,
              }}
            >
              {cardData.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col cards-scroll-snap-item cards-mobile-smooth"
                  style={{
                    width: cardSize,
                    height:
                      screenWidth >= 1024
                        ? cardSize // Desktop: maintain square aspect
                        : Math.min(
                            cardSize * 1.3,
                            typeof window !== "undefined"
                              ? window.innerHeight * 0.7
                              : cardSize * 1.3
                          ), // Tablet/Mobile: taller to fit text + 2:3 image
                    backgroundColor: card.backgroundColor || "#121212",
                    boxShadow:
                      "inset 0 6px 12px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3)",
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  onClick={() => onCardClick?.(card.id)}
                >
                  {/* Text Content - Top Section */}
                  <div className="flex-shrink-0 flex flex-col justify-center items-center text-center p-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                    >
                      <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white mb-2">
                        {card.title}
                      </h2>
                      <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-gray-300 mb-5">
                        {card.subtitle}
                      </h3>
                      <p className="p-primary text-white leading-relaxed">
                        {card.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Image Content - Bottom Section with 2:3 aspect ratio */}
                  <div className="flex-1 relative overflow-hidden p-[15px]">
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                      className="relative w-full h-full rounded-3xl overflow-hidden"
                      style={{
                        aspectRatio: "2/3",
                      }}
                    >
                      <HybridBlobImage
                        path={card.image}
                        alt={card.title}
                        fill
                        className="object-cover object-center"
                        strategy="client"
                        isInteractive={true}
                        enableCache={true}
                        sizes={`(max-width: 768px) 40vw, (max-width: 1024px) 25vw, (max-width: 1600px) 20vw, 15vw`}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={() => navigateCard(-1)}
            disabled={isAnimating}
            className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20 ${
              screenWidth < 1024 ? "p-3" : "p-4"
            }`}
            style={{
              left:
                screenWidth < 1024
                  ? `max(24px, calc(50% - ${cardSize / 2 + 30}px))`
                  : `calc(50% - ${cardSize / 2 + 60}px)`,
            }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={() => navigateCard(1)}
            disabled={isAnimating}
            className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20 ${
              screenWidth < 1024 ? "p-3" : "p-4"
            }`}
            style={{
              left:
                screenWidth < 1024
                  ? `min(calc(100% - 24px), calc(50% + ${cardSize / 2 + 30}px))`
                  : `calc(50% + ${cardSize / 2 + 60}px)`,
            }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Progress Indicator */}
        {cardData.length > Math.floor(cardsPerView) && (
          <div className="flex justify-center mt-8">
            <div className="bg-gray-700 rounded-full h-1 w-32">
              <motion.div
                className="bg-white rounded-full h-1"
                style={{
                  width: `${Math.min(
                    100,
                    ((currentIndex + Math.floor(cardsPerView)) /
                      cardData.length) *
                      100
                  )}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Instructions */}
        {showInstructions && (
          <div className={`text-center mt-6 text-sm ${textColor} opacity-60`}>
            <p></p>
          </div>
        )}
      </div>
    </div>
  );
}
