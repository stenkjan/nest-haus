"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, animate } from "framer-motion";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui";
import { useIOSViewport, getIOSViewportStyles } from "@/hooks/useIOSViewport";
import { PLANUNGSPAKETE_CARDS } from "@/constants/contentCardPresets";
import "@/app/konfigurator/components/hide-scrollbar.css";
import "./mobile-scroll-optimizations.css";

export interface PlanungspaketeCardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  image: string;
  price: string;
  monthlyPrice?: string;
  extendedDescription?: string;
  mobileExtendedDescription?: string;
  backgroundColor: string;
  grayWord?: string; // Word to make gray in the title
}

interface PlanungspaketeCardsProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
  isLightboxMode?: boolean;
  enableBuiltInLightbox?: boolean; // New prop for built-in lightbox
  onCardClick?: (cardId: number) => void;
  customData?: PlanungspaketeCardData[];
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
    showOnlyOnDesktop?: boolean;
    onClick?: () => void;
  }>;
  onOpenLightbox?: () => void; // Callback for opening lightbox (used by "Die Pakete" button)
}

// Default data uses the preset system - all content is now centralized in contentCardPresets.ts
// Exported for backwards compatibility
export const planungspaketeCardData: PlanungspaketeCardData[] =
  PLANUNGSPAKETE_CARDS as PlanungspaketeCardData[];

export default function PlanungspaketeCards({
  title,
  subtitle,
  maxWidth = true,
  showInstructions = false,
  isLightboxMode = false,
  enableBuiltInLightbox = true, // Default to true for built-in lightbox
  onCardClick,
  customData,
  buttons,
  onOpenLightbox,
}: PlanungspaketeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation state for smooth transitions
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // iOS viewport hook for stable lightbox sizing
  const viewport = useIOSViewport();

  // Use appropriate data source based on custom data
  const cardData = customData || planungspaketeCardData;

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

  // Calculate responsive card dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      setScreenWidth(width);

      if (isLightboxMode) {
        // Lightbox mode: Use mobile-friendly dimensions instead of large fixed ones
        if (width >= 1280) {
          setCardsPerView(1.5);
          setCardWidth(760); // Desktop: larger cards
        } else if (width >= 1024) {
          setCardsPerView(1.2);
          setCardWidth(720);
        } else if (width >= 768) {
          setCardsPerView(1);
          setCardWidth(680);
        } else {
          // Mobile: Use mobile variant dimensions for perfect fit
          setCardsPerView(1);
          setCardWidth(320); // Much smaller, similar to mobile variant
        }
      } else {
        // Normal mode - responsive grid layout
        // Use consistent width since flex-wrap handles the layout
        setCardsPerView(3);
        // Dynamic card width: smaller on desktop to fit all 3 cards, larger on mobile for better readability
        if (width >= 1024) {
          // Desktop: Calculate width to fit 3 cards with gaps
          const containerPadding = maxWidth ? 64 : 32; // px-8 vs px-4
          const containerWidth = maxWidth
            ? Math.min(1144, width - containerPadding)
            : width - containerPadding;
          const gapTotal = gap * 2; // 2 gaps between 3 cards
          const calculatedWidth = Math.floor((containerWidth - gapTotal) / 3);
          setCardWidth(Math.max(280, Math.min(400, calculatedWidth))); // Min 280px, max 400px per card
        } else {
          // Mobile/Tablet: Use larger cards
          setCardWidth(350);
        }
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
  }, [isLightboxMode, isClient, currentIndex, cardWidth, gap, x, maxWidth]);

  // No pre-measurement needed - cards size naturally

  // Cards now size naturally - no measurement needed

  const maxIndex = Math.max(0, cardData.length - Math.floor(cardsPerView));
  const _maxScroll = -(maxIndex * (cardWidth + gap));

  // Show only the first 3 cards
  const displayCards = cardData.slice(0, 3);
  const _adjustedMaxIndex = Math.max(
    0,
    displayCards.length - Math.floor(cardsPerView)
  );

  // Navigation logic
  const navigateCard = useCallback(
    (direction: number) => {
      const targetMaxIndex = displayCards.length - Math.floor(cardsPerView);
      const newIndex = Math.max(
        0,
        Math.min(targetMaxIndex, currentIndex + direction)
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
    },
    [displayCards.length, cardsPerView, currentIndex, cardWidth, gap, x]
  );

  // Keyboard navigation - disabled for normal mode
  useEffect(() => {
    if (!isLightboxMode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        navigateCard(-1);
      } else if (event.key === "ArrowRight") {
        navigateCard(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateCard, isLightboxMode]);

  const containerClasses = maxWidth ? "w-full max-w-none mx-auto" : "w-full";

  // Prevent hydration mismatch by showing loading state until client is ready
  if (!isClient) {
    return (
      <div className={containerClasses}>
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {!(
              isLightboxMode &&
              typeof window !== "undefined" &&
              window.innerWidth < 768
            ) &&
              title && <h3 className="h3-secondary">{title}</h3>}
            {subtitle && <p className="p-primary">{subtitle}</p>}
          </div>
        )}
        <div className="flex justify-center items-center py-4 md:py-8">
          <div
            className="animate-pulse bg-gray-200 rounded-3xl"
            style={{ width: 320, height: 480 }}
          />
        </div>
      </div>
    );
  }

  // Toggle card expansion for mobile with iOS-specific fixes
  const toggleCardExpansion = (cardId: number) => {
    const isMobile = isClient && screenWidth < 1024;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    setExpandedCards((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);

        // No height calculation needed - let cards size naturally
      }

      // iOS-specific layout fixes
      if (isMobile && isIOS) {
        // Prevent scroll interference
        document.body.style.overflow = "hidden";

        // Multiple layout triggers for iOS
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event("resize"));

          // Re-enable scrolling after animation
          setTimeout(() => {
            document.body.style.overflow = "";
          }, 650); // Slightly longer than animation duration
        });
      }

      return newSet;
    });
  };

  // Helper function to get appropriate text based on screen size
  const getCardText = (
    card: PlanungspaketeCardData,
    field: "title" | "subtitle" | "description" | "extendedDescription"
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
      case "extendedDescription":
        return isMobileScreen && card.mobileExtendedDescription
          ? card.mobileExtendedDescription
          : card.extendedDescription || "";
      default:
        return "";
    }
  };

  return (
    <div className={containerClasses}>
      {(title || subtitle) && (
        <div className={`text-center ${isLightboxMode ? "mb-4" : "mb-8"}`}>
          {!(
            isLightboxMode &&
            typeof window !== "undefined" &&
            window.innerWidth < 768
          ) &&
            title && <h1 className="h1-secondary">{title}</h1>}
          {subtitle && <p className="p-primary">{subtitle}</p>}
        </div>
      )}

      {/* Cards Container */}
      <div className={`relative ${isLightboxMode ? "py-2" : "md:pb-8"}`}>
        {!isLightboxMode ? (
          /* Normal Mode - Responsive Grid Layout */
          <div
            className={`flex ${screenWidth >= 1024 ? "flex-row justify-center items-stretch" : "flex-wrap justify-center"} gap-6 ${
              maxWidth ? "px-8" : "px-4"
            }`}
          >
            {displayCards.map((card, index) => {
              const isExpanded = expandedCards.has(card.id);
              const isMobile = isClient && screenWidth < 1024;

              return (
                <motion.div
                  key={card.id}
                  ref={(el) => {
                    if (el) {
                      cardRefs.current.set(card.id, el);
                    }
                  }}
                  className={`${screenWidth >= 1024 ? "flex-1" : "flex-shrink-0"} rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer`}
                  style={{
                    width: screenWidth >= 1024 ? undefined : cardWidth,
                    backgroundColor: card.backgroundColor,
                    // iOS-specific fixes
                    WebkitTransform: "translateZ(0)", // Force hardware acceleration
                    transform: "translateZ(0)",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                  }}
                  animate={
                    {
                      // Let all cards size naturally to their content
                    }
                  }
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "tween",
                  }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    if (isMobile && isExpanded) {
                      // On mobile, clicking anywhere on expanded card collapses it
                      toggleCardExpansion(card.id);
                    } else if (!isMobile) {
                      if (enableBuiltInLightbox && !isLightboxMode) {
                        setLightboxOpen(true);
                      } else if (onCardClick) {
                        onCardClick(card.id);
                      }
                    }
                  }}
                >
                  {/* Top Section - EXPANDED HEIGHT */}
                  <div
                    className={`px-6 py-2 overflow-hidden ${!isMobile ? "pb-6 pt-6" : "pt-8 pt-6"} flex-1 flex flex-col`}
                  >
                    {/* Header Row - Title/Subtitle left, Price right */}
                    <div className="flex">
                      {/* Title/Subtitle - Left Side */}
                      <div className="flex-1">
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
                        >
                          <h3
                            className={`${isMobile ? "h3-mobile" : "h3-secondary"} px-3 text-gray-900`}
                          >
                            {getCardText(card, "title")}{" "}
                            <span
                              className={`${isMobile ? "h3-mobile" : "h3-secondary"} font-medium text-gray-500`}
                            >
                              {getCardText(card, "subtitle") || card.grayWord}
                            </span>
                          </h3>
                        </motion.div>
                      </div>
                    </div>

                    {/* Description and Price - Split Layout */}
                    <div className="flex gap-6 px-3 items-start">
                      {/* Description - Left Half */}
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                        className="flex-1"
                      >
                        <p className="p-primary-small overflow-hidden">
                          {getCardText(card, "description")}
                        </p>
                      </motion.div>

                      {/* Price - Right Half */}
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: index * 0.1 + 0.2,
                          duration: 0.6,
                        }}
                        className="flex-shrink-0 flex items-start justify-start"
                      >
                        <div className="p-primary-small">{card.price}</div>
                      </motion.div>
                    </div>

                    {/* Desktop: Flexible spacer to ensure consistent card height */}
                    {!isMobile && <div className="flex-1"></div>}
                  </div>

                  {/* Mobile: Mehr erfahren button or Extended Description */}
                  {card.extendedDescription && isMobile && (
                    <>
                      {!isExpanded ? (
                        /* Collapsed state: Show only "Mehr erfahren" button with minimal padding */
                        <div className="px-8 pb-6 text-align-left">
                          <motion.button
                            className="p-primary-small font-bold underline hover:no-underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 rounded px-1"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              toggleCardExpansion(card.id);
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            Mehr erfahren
                          </motion.button>
                        </div>
                      ) : (
                        /* Expanded state: Show full extended description with tight padding */
                        <div className="px-9 pt-2 pb-2">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                          >
                            <motion.p
                              className="p-primary mb-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            >
                              {getCardText(card, "extendedDescription")}
                            </motion.p>

                            {/* Weniger anzeigen button at end of expanded text */}
                            <motion.button
                              className="p-primary-small font-bold underline pb-6 hover:no-underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 rounded px-1"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                toggleCardExpansion(card.id);
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.3 }}
                            >
                              Weniger anzeigen
                            </motion.button>
                          </motion.div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Lightbox Mode - Horizontal Scrolling Layout */
          <div className="overflow-x-clip">
            <div
              ref={containerRef}
              className={`overflow-x-hidden ${
                maxWidth ? "px-8" : "px-4"
              } cursor-grab active:cursor-grabbing cards-scroll-container`}
              style={{ overflow: "visible" }}
            >
              <motion.div
                className={`flex gap-6 ${
                  isClient && screenWidth < 1024
                    ? "cards-scroll-snap cards-touch-optimized cards-no-bounce"
                    : ""
                }`}
                style={{
                  x,
                  width: `${(cardWidth + gap) * displayCards.length - gap}px`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                  mass: 0.8,
                }}
              >
                {displayCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    className="flex-shrink-0 rounded-3xl shadow-lg overflow-y-auto hide-scrollbar hover:shadow-xl transition-shadow duration-300 flex-col"
                    style={{
                      width: cardWidth,
                      height:
                        typeof window !== "undefined" && window.innerWidth < 768
                          ? Math.min(600, viewport.height * 0.75) // Use stable viewport height for mobile
                          : Math.min(1000, viewport.height * 0.875), // Use stable viewport height for desktop
                      backgroundColor: card.backgroundColor,
                      scrollSnapAlign: "start",
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Lightbox layout: Responsive with mobile-friendly sizing */}
                    {/* Top Section - Header and Description */}
                    <div className="flex-shrink-0 px-4 md:px-12 pt-4 md:pt-12 pb-2">
                      {/* Header Row - Title/Subtitle left, Price right */}
                      <div className="flex mb-5">
                        {/* Title/Subtitle - Left Side */}
                        <div className="flex-1">
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                              delay: index * 0.1,
                              duration: 0.6,
                            }}
                          >
                            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-bold text-gray-900 mb-1">
                              {getCardText(card, "title")}{" "}
                              <span className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-xl font-medium text-gray-500">
                                {getCardText(card, "subtitle") || card.grayWord}
                              </span>
                            </h2>
                          </motion.div>
                        </div>

                        {/* Price - Right Side */}
                        <div className="w-20 md:w-32 flex flex-col justify-start items-end text-right">
                          <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                              delay: index * 0.1 + 0.2,
                              duration: 0.6,
                            }}
                            className="text-right"
                          >
                            <div className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                              {card.price}
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Description - Full Width */}
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: index * 0.1 + 0.3,
                          duration: 0.6,
                        }}
                      >
                        <p className="p-primary leading-relaxed">
                          {getCardText(card, "description")}
                        </p>
                      </motion.div>
                    </div>

                    {/* Bottom Section - Extended Description (Full Width) */}
                    {card.extendedDescription && (
                      <div className="px-4 md:px-12 pt-4 md:pt-8 pb-4 md:pb-12 flex-1 min-h-0">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            delay: index * 0.1 + 0.4,
                            duration: 0.8,
                          }}
                          className="h-full overflow-y-auto hide-scrollbar"
                        >
                          <p className="p-primary leading-relaxed">
                            {getCardText(card, "extendedDescription")}
                          </p>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )}

        {/* Navigation Arrows - Only for lightbox mode */}
        {isLightboxMode && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={() => navigateCard(-1)}
                disabled={isAnimating}
                className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20 ${
                  screenWidth < 1024 ? "p-3" : "p-4"
                }`}
                style={{
                  left:
                    screenWidth < 1024
                      ? `max(24px, calc(50% - ${cardWidth / 2 + 30}px))`
                      : `calc(50% - ${cardWidth / 2 + 60}px)`,
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

            {currentIndex < displayCards.length - Math.floor(cardsPerView) && (
              <button
                onClick={() => navigateCard(1)}
                disabled={isAnimating}
                className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20 ${
                  screenWidth < 1024 ? "p-3" : "p-4"
                }`}
                style={{
                  left:
                    screenWidth < 1024
                      ? `min(calc(100% - 24px), calc(50% + ${
                          cardWidth / 2 + 30
                        }px))`
                      : `calc(50% + ${cardWidth / 2 + 60}px)`,
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
          </>
        )}
      </div>

      {/* Progress Indicator - Only for lightbox mode */}
      {isLightboxMode && displayCards.length > Math.floor(cardsPerView) && (
        <div className="flex justify-center mt-8">
          <div className="bg-gray-200 rounded-full h-1 w-32">
            <motion.div
              className="bg-gray-900 rounded-full h-1"
              style={{
                width: `${Math.min(
                  100,
                  ((currentIndex + Math.floor(cardsPerView)) /
                    displayCards.length) *
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
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Click on any card to see detailed information</p>
        </div>
      )}

      {/* Action Buttons - Rendered from preset configuration */}
      {buttons && buttons.length > 0 && !isLightboxMode && (
        <div className="flex gap-4 justify-center w-full mt-6 md:mt-8">
          {buttons.map((button, index) => {
            const isMobile = isClient && screenWidth < 768;

            // Skip desktop-only buttons on mobile
            if (button.showOnlyOnDesktop && isMobile) {
              return null;
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

            // Button with onClick or opens lightbox
            const handleClick =
              button.onClick ||
              (button.text === "Die Pakete" && onOpenLightbox
                ? onOpenLightbox
                : undefined);

            return (
              <Button
                key={index}
                variant={button.variant}
                size={button.size || "xs"}
                onClick={handleClick}
              >
                {button.text}
              </Button>
            );
          })}
        </div>
      )}

      {/* Built-in Lightbox Dialog */}
      {enableBuiltInLightbox && (
        <Dialog
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          transparent={true}
          className="p-0"
        >
          <div
            className="w-full h-full flex items-center justify-center p-2 md:p-8 overflow-y-auto ios-dialog-container"
            style={getIOSViewportStyles(viewport)}
          >
            <div className="w-full max-w-none my-4">
              <PlanungspaketeCards
                title={title}
                subtitle=""
                maxWidth={false}
                showInstructions={false}
                isLightboxMode={true}
                enableBuiltInLightbox={false} // Disable nested lightbox
                customData={customData}
              />
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
