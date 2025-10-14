"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Button } from "@/components/ui";
import Link from "next/link";
import ClientBlobFile from "@/components/files/ClientBlobFile";
import { IMAGES } from "@/constants/images";
import HybridBlobImage from "@/components/images/HybridBlobImage";
import { ABLAUF_STEPS_PRESET } from "@/constants/contentCardPresets";
import "@/app/konfigurator/components/hide-scrollbar.css";
import "./mobile-scroll-optimizations.css";

export interface SquareTextCardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  backgroundColor: string;
  textColor?: string; // Optional custom text color, defaults to gray-900
  icon?: React.ReactNode; // Optional custom icon component to display above title
  iconNumber?: number; // Or specify a step icon by number (1-7)
}

interface SquareTextCardProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
  isLightboxMode?: boolean;
  onCardClick?: (cardId: number) => void;
  customData?: SquareTextCardData[];
  buttons?: Array<{
    text: string;
    variant:
      | "primary"
      | "secondary"
      | "primary-narrow"
      | "secondary-narrow"
      | "secondary-narrow-white"
      | "secondary-narrow-blue"
      | "tertiary"
      | "outline"
      | "ghost"
      | "danger"
      | "success"
      | "info"
      | "landing-primary"
      | "landing-secondary"
      | "landing-secondary-blue"
      | "landing-secondary-blue-white"
      | "configurator";
    size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
    link?: string;
    file?: string;
    fileMode?: "open" | "download";
    onClick?: () => void;
  }>;
}

// Step icon component using HybridBlobImage
const StepIcon = ({
  stepNumber,
  className = "w-10 h-10 md:w-14 md:h-14",
}: {
  stepNumber: number;
  className?: string;
}) => {
  const iconKey = `icon${stepNumber}` as keyof typeof IMAGES.stepIcons;
  const iconPath = IMAGES.stepIcons[iconKey];

  if (!iconPath) {
    return <DefaultSquareTextCardIcon className={className} />;
  }

  return (
    <HybridBlobImage
      path={iconPath}
      alt={`Step ${stepNumber} icon`}
      className={className}
      width={64}
      height={64}
      style={{
        objectFit: "contain",
        width: "100%",
        height: "100%",
      }}
    />
  );
};

// Default icon component - fallback for when no step icon is available
const DefaultSquareTextCardIcon = ({
  className = "w-10 h-10 md:w-14 md:h-14 text-black",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    {/* Moving box icon */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1L5 3l4 2 4-2-4-2z"
    />
  </svg>
);

// Helper function to create icons for specific cards - uses step icons based on card ID
export const createSquareTextCardIcon = (
  cardId: number,
  customIcon?: React.ReactNode
): React.ReactNode => {
  if (customIcon) return customIcon;

  // Use step icons for cards 1-7
  if (cardId >= 1 && cardId <= 7) {
    return <StepIcon stepNumber={cardId} />;
  }

  return <DefaultSquareTextCardIcon />;
};

// Helper function to add icons to preset data
export const addIconsToPreset = (
  preset: Array<
    Omit<SquareTextCardData, "icon"> & {
      icon?: React.ReactNode;
      iconNumber?: number;
    }
  >
): SquareTextCardData[] => {
  return preset.map((card) => {
    // Priority: custom icon > iconNumber > card id
    const iconToUse = card.icon
      ? card.icon
      : card.iconNumber !== undefined
        ? createSquareTextCardIcon(card.iconNumber)
        : createSquareTextCardIcon(card.id);

    return {
      ...card,
      icon: iconToUse,
    };
  });
};

// Default data uses the preset system - all content is now centralized in contentCardPresets.ts
export const defaultSquareTextCardData: SquareTextCardData[] = addIconsToPreset(
  ABLAUF_STEPS_PRESET.cards
);

export default function SquareTextCard({
  title,
  subtitle,
  maxWidth = true,
  showInstructions = true,
  isLightboxMode = false,
  onCardClick,
  customData,
  buttons,
}: SquareTextCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  // Note: allCardsExpanded and cardHeights removed since mobile cards are always auto-height
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Use custom data if provided, otherwise use default
  const cardData = customData || defaultSquareTextCardData;

  // Define gap constant at the top
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
      centerOffset = (containerWidth - cardWidth - containerPadding) / 2; // Center within available space
    } else {
      // Desktop/Tablet: Use existing logic
      const effectiveWidth =
        containerWidth < 1024 ? containerWidth - 32 : containerWidth;
      centerOffset =
        (effectiveWidth - cardWidth) / 2 + (containerWidth < 1024 ? 16 : 0);
    }

    x.set(centerOffset);

    // iOS-specific: Force initial layout calculation
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }
  }, [cardWidth, x]);

  // Calculate responsive card dimensions - square cards
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      setScreenWidth(width);

      if (width >= 1600) {
        // Ultra-wide screens: Show more cards
        setCardsPerView(1.4);
        setCardWidth(800); // Square cards - 2x original size (400px)
      } else if (width >= 1280) {
        // Desktop XL: Wide layout
        setCardsPerView(1.3);
        setCardWidth(720); // Square cards - 2x original size (360px)
      } else if (width >= 1024) {
        // Desktop: Wide layout
        setCardsPerView(1.1);
        setCardWidth(640); // Square cards - 2x original size (320px)
      } else if (width >= 768) {
        // Tablet: Show 2 cards
        setCardsPerView(2);
        setCardWidth(336); // Mobile card size (matches other components)
      } else {
        // Mobile: Show 1.2 cards (matches other components)
        setCardsPerView(1.2);
        // iOS Safari needs extra margin due to viewport quirks
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const margin = isIOS ? 40 : 32;
        setCardWidth(Math.min(320, width - margin)); // Mobile card size with margin
      }

      // Recenter the current card after dimension changes
      if (isClient) {
        const containerWidth = width;
        let centerOffset;

        if (containerWidth < 768) {
          // Mobile: Center the card perfectly in viewport, accounting for container padding
          const containerPadding = 32; // px-4 = 16px on each side = 32px total
          centerOffset = (containerWidth - cardWidth - containerPadding) / 2; // Center within available space
        } else {
          // Desktop/Tablet: Use existing logic
          const effectiveWidth =
            containerWidth < 1024 ? containerWidth - 32 : containerWidth;
          centerOffset =
            (effectiveWidth - cardWidth) / 2 + (containerWidth < 1024 ? 16 : 0);
        }

        const cardPosition = currentIndex * (cardWidth + gap);
        const newX = centerOffset - cardPosition;
        x.set(newX);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isLightboxMode, isClient, currentIndex, cardWidth, gap, x]);

  // Note: Pre-measuring heights removed since mobile cards now use auto height

  const maxIndex = Math.max(0, cardData.length - Math.floor(cardsPerView));
  const _maxScroll = -(maxIndex * (cardWidth + gap));

  // Navigation logic - Center active card
  const navigateCard = useCallback(
    (direction: number) => {
      const newIndex = Math.max(
        0,
        Math.min(cardData.length - 1, currentIndex + direction)
      );
      setCurrentIndex(newIndex);

      // Calculate position to center the active card
      const containerWidth =
        typeof window !== "undefined" ? window.innerWidth : 1200;

      let centerOffset;
      if (containerWidth < 768) {
        // Mobile: Center the card perfectly in viewport, accounting for container padding
        const containerPadding = 32; // px-4 = 16px on each side = 32px total
        centerOffset = (containerWidth - cardWidth - containerPadding) / 2; // Center within available space
      } else {
        // Desktop/Tablet: Use existing logic
        const effectiveWidth =
          containerWidth < 1024 ? containerWidth - 32 : containerWidth;
        centerOffset =
          (effectiveWidth - cardWidth) / 2 + (containerWidth < 1024 ? 16 : 0);
      }

      const cardPosition = newIndex * (cardWidth + gap);
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
      // Note: Mobile cards are always auto-sized during navigation
    },
    [currentIndex, cardWidth, gap, x, cardData.length]
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

  const containerClasses = maxWidth ? "w-full" : "w-full";

  // Animation state for smooth transitions
  const [isAnimating, setIsAnimating] = useState(false);

  // Note: Toggle expansion function removed since mobile cards are always expanded

  // Helper function to get appropriate text based on screen size
  const getCardText = (
    card: SquareTextCardData,
    field: "title" | "subtitle" | "description"
  ) => {
    const isMobileScreen = isClient && screenWidth < 1024;

    switch (field) {
      case "title":
        return isMobileScreen && card.mobileTitle
          ? card.mobileTitle
          : card.title;
      case "subtitle":
        return isMobileScreen && card.mobileSubtitle
          ? card.mobileSubtitle
          : card.subtitle;
      case "description":
        return isMobileScreen && card.mobileDescription
          ? card.mobileDescription
          : card.description;
      default:
        return "";
    }
  };

  // Helper function to remove numbers from title for timeline display
  const getTimelineTitle = (card: SquareTextCardData) => {
    const title = getCardText(card, "title");
    // Remove pattern like "1. ", "2. ", etc. from the beginning
    return title.replace(/^\d+\.\s*/, "");
  };

  // Prevent hydration mismatch by showing consistent loading state
  if (!isClient) {
    return (
      <div className={containerClasses}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex justify-center items-center md:py-8">
          <div
            className="animate-pulse bg-gray-200 rounded-3xl"
            style={{
              width: 320, // Use consistent dimensions for SSR
              height: 360, // Use consistent dimensions for SSR
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClasses} ${screenWidth < 1024 ? "px-4" : ""}`}>
      {(title || subtitle) && (
        <div className={`text-center ${isLightboxMode ? "mb-4" : "mb-8"}`}>
          {!(
            isLightboxMode &&
            typeof window !== "undefined" &&
            window.innerWidth < 768
          ) &&
            title && (
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            )}
          {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
        </div>
      )}

      {/* Enhanced Progress Indicator - Moved above cards */}
      {cardData.length > 1 && (
        <div className="mb-4">
          {/* Desktop: Horizontal Progress Steps */}
          <div className="hidden md:block">
            <div className="relative max-w-4xl mx-auto">
              {/* Connecting Line - Only between dots, not extending to edges */}
              {cardData.length > 1 && (
                <div
                  className="absolute top-3 h-0.5 bg-gray-200"
                  style={{
                    left: `${100 / cardData.length / 2}%`,
                    right: `${100 / cardData.length / 2}%`,
                  }}
                />
              )}
              {/* Progress Line - Only between dots */}
              {cardData.length > 1 && (
                <div
                  className="absolute top-3 h-0.5 bg-blue-500 transition-all duration-300"
                  style={{
                    left: `${100 / cardData.length / 2}%`,
                    width:
                      currentIndex === 0
                        ? "0%"
                        : `${(currentIndex / (cardData.length - 1)) * (100 - 100 / cardData.length)}%`,
                  }}
                />
              )}
              {/* Step Dots */}
              <div
                className="grid gap-0"
                style={{
                  gridTemplateColumns: `repeat(${cardData.length}, 1fr)`,
                }}
              >
                {cardData.map((card, idx) => {
                  const isActive = idx === currentIndex;
                  const isPassed = idx < currentIndex;
                  const circleClass = isPassed
                    ? "bg-blue-500 border-blue-500 text-white"
                    : isActive
                      ? "bg-white border-blue-500 text-blue-500"
                      : "bg-white border-gray-300 text-gray-400";

                  return (
                    <div key={card.id} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          setCurrentIndex(idx);
                          // Calculate position to center the selected card
                          const containerWidth =
                            typeof window !== "undefined"
                              ? window.innerWidth
                              : 1200;

                          let centerOffset;
                          if (containerWidth < 768) {
                            // Mobile: Center the card perfectly in viewport, accounting for container padding
                            const containerPadding = 32; // px-4 = 16px on each side = 32px total
                            centerOffset =
                              (containerWidth - cardWidth - containerPadding) /
                              2; // Center within available space
                          } else {
                            // Desktop/Tablet: Use existing logic
                            const effectiveWidth =
                              containerWidth < 1024
                                ? containerWidth - 32
                                : containerWidth;
                            centerOffset =
                              (effectiveWidth - cardWidth) / 2 +
                              (containerWidth < 1024 ? 16 : 0);
                          }

                          const cardPosition = idx * (cardWidth + gap);
                          const newX = centerOffset - cardPosition;
                          x.set(newX);
                        }}
                        className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${circleClass}`}
                        aria-label={`Zu Schritt ${idx + 1}: ${getTimelineTitle(
                          card
                        )}`}
                      >
                        <span className="text-xs font-medium">{idx + 1}</span>
                      </button>
                      {/* Card Title - show for all steps */}
                      <div
                        className={`mt-3 text-xs text-center transition-opacity duration-200 max-w-24 leading-tight ${
                          isActive
                            ? "opacity-100 text-gray-900 font-medium"
                            : "opacity-60 text-gray-600 font-normal"
                        }`}
                      >
                        {getTimelineTitle(card)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile: Compact Dots - Hidden */}
          <div className="hidden">
            <div className="flex justify-center items-center space-x-2">
              {cardData.map((card, idx) => {
                const isActive = idx === currentIndex;
                const isPassed = idx < currentIndex;

                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      // Calculate position to center the selected card
                      const containerWidth =
                        typeof window !== "undefined"
                          ? window.innerWidth
                          : 1200;

                      let centerOffset;
                      if (containerWidth < 768) {
                        // Mobile: Center the card perfectly in viewport, accounting for container padding
                        const containerPadding = 32; // px-4 = 16px on each side = 32px total
                        centerOffset =
                          (containerWidth - cardWidth - containerPadding) / 2; // Center within available space
                      } else {
                        // Desktop/Tablet: Use existing logic
                        const effectiveWidth =
                          containerWidth < 1024
                            ? containerWidth - 32
                            : containerWidth;
                        centerOffset =
                          (effectiveWidth - cardWidth) / 2 +
                          (containerWidth < 1024 ? 16 : 0);
                      }

                      const cardPosition = idx * (cardWidth + gap);
                      const newX = centerOffset - cardPosition;
                      x.set(newX);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-gray-900 scale-125"
                        : isPassed
                          ? "bg-gray-600"
                          : "bg-gray-300"
                    }`}
                    aria-label={`Zu Schritt ${idx + 1}: ${getCardText(
                      card,
                      "title"
                    )}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cards Container */}
      <div
        className={`relative ${isLightboxMode ? "py-2" : "pb-8 md:py-8"} ${
          screenWidth < 1024 ? "overflow-hidden w-full" : ""
        }`}
      >
        {/* Horizontal Scrolling Layout */}
        <div
          className={`${screenWidth < 1024 ? "w-full" : ""} overflow-x-clip`}
        >
          <div
            ref={containerRef}
            className={`overflow-x-hidden cards-scroll-container ${
              isClient && screenWidth < 1024
                ? "cards-scroll-snap cards-touch-optimized cards-no-bounce"
                : ""
            } cursor-grab active:cursor-grabbing`}
            style={{
              overflow: "visible",
              // Improve touch handling on mobile
              touchAction: screenWidth < 1024 ? "pan-y pinch-zoom" : "auto",
            }}
          >
            <motion.div
              className="flex gap-6"
              style={{
                x,
                width:
                  screenWidth < 1024
                    ? `${(cardWidth + gap) * cardData.length}px`
                    : `${(cardWidth + gap) * cardData.length - gap}px`,
              }}
            >
              {cardData.map((card, index) => {
                const isMobile = isClient && screenWidth < 1024;

                return (
                  <motion.div
                    key={card.id}
                    ref={(el) => {
                      if (el) {
                        cardRefs.current.set(card.id, el);
                      }
                    }}
                    className={`flex-shrink-0 rounded-3xl overflow-hidden transition-all duration-300 ${
                      isMobile ? "" : "cursor-pointer"
                    } cards-scroll-snap-item cards-mobile-smooth`}
                    style={{
                      width: cardWidth,
                      backgroundColor: card.backgroundColor,
                      // Bottom shadow - cast downward for standard card elevation
                      boxShadow: "0 4px 10px -3px rgba(0, 0, 0, 0.15)",
                      // iOS-specific fixes
                      WebkitTransform: "translateZ(0)", // Force hardware acceleration
                      transform: "translateZ(0)",
                      WebkitBackfaceVisibility: "hidden",
                      backfaceVisibility: "hidden",
                    }}
                    animate={{
                      opacity: index === currentIndex ? 1 : 0.4,
                      scale: index === currentIndex ? 1 : 0.95,
                      height: isMobile
                        ? "auto" // Mobile: Always auto height to fit content
                        : cardWidth * 0.75, // Desktop/Tablet: Shorter rectangular aspect ratio (3:4)
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      type: "tween",
                    }}
                    onClick={() => {
                      // Prevent action during animation
                      if (isAnimating) return;

                      // Mobile: No action (cards are always expanded)
                      if (isMobile) {
                        return;
                      } else if (onCardClick) {
                        onCardClick(card.id);
                      }
                    }}
                  >
                    {/* Text Content - Full card */}
                    <div
                      className={`h-full flex flex-col ${
                        isMobile ? "justify-start" : "justify-center"
                      } items-center px-8 md:px-16 ${
                        isMobile ? "py-6" : "py-16"
                      }`}
                    >
                      {/* Icon, Title and Subtitle - Centered horizontally */}
                      <motion.div
                        className={`text-center ${isMobile ? "mb-0" : "mb-6"}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        {/* Icon Space */}
                        {card.icon && (
                          <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                              {card.icon}
                            </div>
                          </div>
                        )}

                        <h2
                          className={`h2-title ${
                            card.textColor || "text-gray-900"
                          }`}
                        >
                          {getCardText(card, "title")}
                        </h2>
                        <h3
                          className={`h3-secondary ${
                            card.textColor || "text-gray-700"
                          }`}
                        >
                          {getCardText(card, "subtitle")}
                        </h3>
                      </motion.div>

                      {/* Description - Centered text */}
                      <motion.div
                        className="text-center relative overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                      >
                        <motion.p
                          className={`p-primary px-4 leading-relaxed max-w-3xl mx-auto ${
                            card.textColor || "text-black"
                          }`}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {getCardText(card, "description")}
                        </motion.p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Navigation Arrows - Positioned closer to active card */}
        {currentIndex > 0 && (
          <button
            onClick={() => navigateCard(-1)}
            disabled={isAnimating}
            className={`absolute transform -translate-y-1/2 -translate-x-1/2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-20 ${
              screenWidth < 1024 ? "p-3" : "p-4"
            }`}
            style={{
              left:
                screenWidth < 1024
                  ? `max(24px, calc(50% - ${cardWidth / 2 + 30}px))`
                  : `calc(50% - ${cardWidth / 2 + 60}px)`,
              top: "50%",
              transition: "all 0.4s ease",
            }}
          >
            <svg
              className="w-6 h-6 text-gray-700"
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

        {currentIndex < cardData.length - 1 && (
          <button
            onClick={() => navigateCard(1)}
            disabled={isAnimating}
            className={`absolute transform -translate-y-1/2 -translate-x-1/2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-20 ${
              screenWidth < 1024 ? "p-3" : "p-4"
            }`}
            style={{
              left:
                screenWidth < 1024
                  ? `min(calc(100% - 24px), calc(50% + ${
                      cardWidth / 2 + 30
                    }px))`
                  : `calc(50% + ${cardWidth / 2 + 60}px)`,
              top: "50%",
              transition: "all 0.4s ease",
            }}
          >
            <svg
              className="w-6 h-6 text-gray-700"
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
      </div>

      {/* Action Buttons - Rendered from preset configuration */}
      {buttons && buttons.length > 0 && (
        <div className="flex flex-row gap-4 justify-center md:mt-8">
          {buttons.map((button, index) => {
            // Button with file (download/open)
            if (button.file) {
              return (
                <ClientBlobFile
                  key={index}
                  path={button.file}
                  mode={button.fileMode || "open"}
                  onDownloadStart={() =>
                    console.log(
                      `📄 ${button.fileMode === "download" ? "Downloading" : "Opening"} file...`
                    )
                  }
                  onDownloadComplete={() =>
                    console.log("✅ File action completed")
                  }
                  onError={(error) =>
                    console.error("❌ File action failed:", error)
                  }
                >
                  <Button variant={button.variant} size={button.size || "xs"}>
                    {button.text}
                  </Button>
                </ClientBlobFile>
              );
            }

            // Button with link
            if (button.link) {
              return (
                <Link key={index} href={button.link}>
                  <Button variant={button.variant} size={button.size || "xs"}>
                    {button.text}
                  </Button>
                </Link>
              );
            }

            // Button with onClick
            return (
              <Button
                key={index}
                variant={button.variant}
                size={button.size || "xs"}
                onClick={button.onClick}
              >
                {button.text}
              </Button>
            );
          })}
        </div>
      )}

      {/* Instructions */}
      {showInstructions && (
        <div className="text-center mt-6 text-sm text-gray-500">
          <p className="hidden md:block">Use ← → arrow keys to navigate</p>
          <p className="md:hidden">Use arrow buttons to navigate</p>
          <p className="mt-1">
            Showing{" "}
            {Math.min(Math.ceil(cardsPerView), cardData.length - currentIndex)}{" "}
            of {cardData.length} cards
          </p>
        </div>
      )}
    </div>
  );
}
