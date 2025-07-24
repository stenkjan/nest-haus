"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, PanInfo } from "motion/react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface SquareCardData {
  id: number;
  title: string;
  subtitle: string;
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

// Default square card data
const defaultSquareCardData: SquareCardData[] = [
  {
    id: 1,
    title: "NEST-Haus Planning",
    subtitle: "Hand-drawn floor plans",
    image: IMAGES.function.nestHausHandDrawing,
    backgroundColor: "#121212",
  },
  {
    id: 2,
    title: "Mountain Vision",
    subtitle: "Alpine architecture",
    image:
      "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    backgroundColor: "#121212",
  },
  {
    id: 3,
    title: "Modular System",
    subtitle: "7 modules, white facade",
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    backgroundColor: "#121212",
  },
  {
    id: 4,
    title: "Ensemble Living",
    subtitle: "3 buildings, wood cladding",
    image:
      "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
    backgroundColor: "#121212",
  },
  {
    id: 5,
    title: "Winter Design",
    subtitle: "Black trapezoidal facade",
    image:
      "/images/4-NEST-Haus-2-Gebaeude-Schnee-Stirnseite-Schwarze-Trapezblech-Fassade.png",
    backgroundColor: "#121212",
  },
  {
    id: 6,
    title: "Forest Integration",
    subtitle: "6 modules, black facade",
    image:
      "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
    backgroundColor: "#121212",
  },
];

export default function SquareGlassCardsScroll({
  maxWidth = true,
  backgroundColor = "black",
  title = "Square Glass Cards",
  subtitle = "Navigate with arrow keys or swipe",
  showInstructions = true,
  customData,
  onCardClick,
}: SquareGlassCardsScrollProps) {
  const [isClient, setIsClient] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [cardSize, setCardSize] = useState(400);
  const [currentIndex, setCurrentIndex] = useState(0);

  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const cardData = customData || defaultSquareCardData;

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate responsive dimensions for square cards
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;

      if (width >= 1600) {
        // Ultra-wide screens: 3 cards per view
        setCardsPerView(3.2);
        setCardSize(400);
      } else if (width >= 1280) {
        // Desktop XL: 2.5 cards per view
        setCardsPerView(2.8);
        setCardSize(380);
      } else if (width >= 1024) {
        // Desktop: 2 cards per view
        setCardsPerView(2.2);
        setCardSize(360);
      } else if (width >= 768) {
        // Tablet: 1.5 cards per view
        setCardsPerView(1.8);
        setCardSize(320);
      } else {
        // Mobile: 1.2 cards per view
        setCardsPerView(1.3);
        setCardSize(280);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const gap = 24;
  const maxIndex = Math.max(0, cardData.length - Math.floor(cardsPerView));

  // Navigation logic
  const navigateCard = useCallback(
    (direction: number) => {
      const newIndex = Math.max(
        0,
        Math.min(maxIndex, currentIndex + direction)
      );
      setCurrentIndex(newIndex);
      const newX = -(newIndex * (cardSize + gap));
      x.set(newX);
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

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Calculate which card to snap to based on drag
    const currentX = x.get();
    let targetIndex = Math.round(-currentX / (cardSize + gap));

    // Adjust based on drag direction and velocity
    if (Math.abs(offset) > 50 || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 500) {
        targetIndex = Math.max(0, targetIndex - 1);
      } else if (offset < 0 || velocity < -500) {
        targetIndex = Math.min(maxIndex, targetIndex + 1);
      }
    }

    setCurrentIndex(targetIndex);
    const newX = -(targetIndex * (cardSize + gap));
    x.set(newX);
  };

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
              style={{ width: 400, height: 400 }}
            />
            <div
              className="animate-pulse bg-gray-800 rounded-3xl"
              style={{ width: 400, height: 400 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${backgroundClasses} py-12`}>
      <div className={`${containerClasses} px-4 md:px-8`}>
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-5xl font-bold ${textColor} mb-4`}>
            {title}
          </h2>
          <p className={`text-lg md:text-xl ${textColor} opacity-80`}>
            {subtitle}
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative overflow-hidden">
          <div className="overflow-hidden" ref={containerRef}>
            <motion.div
              className="flex"
              style={{
                x,
                gap: `${gap}px`,
              }}
              drag="x"
              dragConstraints={{
                left: -(maxIndex * (cardSize + gap)),
                right: 0,
              }}
              onDragEnd={handleDragEnd}
              dragElastic={0.1}
            >
              {cardData.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  style={{
                    width: cardSize,
                    height: cardSize,
                    backgroundColor: card.backgroundColor || "#121212",
                    boxShadow:
                      "inset 0 6px 12px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3)",
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onCardClick?.(card.id)}
                >
                  {/* Square Image with Overlay */}
                  <div className="relative w-full h-full group">
                    <HybridBlobImage
                      path={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      strategy="client"
                      isInteractive={true}
                      enableCache={true}
                      sizes={`(max-width: 768px) 80vw, (max-width: 1024px) 50vw, (max-width: 1600px) 33vw, 25vw`}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Text Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                      >
                        <h3 className="text-xl font-bold text-white mb-2">
                          {card.title}
                        </h3>
                        <p className="text-sm text-gray-300">{card.subtitle}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

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
            <p>
              Square glass cards • Navigate with arrow keys or swipe • Click on
              cards for interactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
