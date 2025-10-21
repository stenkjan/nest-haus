"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Link from "next/link";
import { HybridBlobImage } from "@/components/images";
import { ClientBlobVideo } from "@/components/images";
import { Button } from "@/components/ui";
import { Dialog } from "@/components/ui";
import ClientBlobFile from "@/components/files/ClientBlobFile";
import {
  getContentByCategory,
  type ContentCategory,
  type ContentCardData,
} from "@/constants/cardContent";
import { IMAGES } from "@/constants/images";
import "@/app/konfigurator/components/hide-scrollbar.css";
import "./mobile-scroll-optimizations.css";

// Step icon component using HybridBlobImage (extra large size: 48px mobile, 56px desktop)
const StepIcon = ({
  stepNumber,
  className = "w-12 h-12 md:w-14 md:h-14",
}: {
  stepNumber: number;
  className?: string;
}) => {
  const iconKey = `icon${stepNumber}` as keyof typeof IMAGES.stepIcons;
  const iconPath = IMAGES.stepIcons[iconKey];

  if (!iconPath) {
    return null;
  }

  return (
    <div className={className}>
      <HybridBlobImage
        path={iconPath}
        alt={`Step ${stepNumber} icon`}
        className="w-full h-full"
        width={56}
        height={56}
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
};

/**
 * Layout Types for UnifiedContentCard
 */
export type CardLayout =
  | "horizontal" // Text left, image/video right (default - most common)
  | "vertical" // Text top, image bottom (stacked)
  | "square" // Square card with text top, image bottom
  | "image-only" // Only image, no text overlay
  | "video" // Video card (16:9 ratio)
  | "text-icon" // Square card with text and optional icon, no image
  | "process-detail"; // Large horizontal card on top + 5 square cards below for checkout steps

/**
 * Style Types for UnifiedContentCard
 */
export type CardStyle = "standard" | "glass";

/**
 * Variant Types
 */
export type CardVariant = "responsive" | "static";

/**
 * Height Mode Types
 */
export type HeightMode = "standard" | "tall";

/**
 * Props for UnifiedContentCard
 */
export interface UnifiedContentCardProps {
  // Layout configuration
  layout?: CardLayout;
  style?: CardStyle;
  variant?: CardVariant;
  heightMode?: HeightMode;

  // Content source (category or custom data)
  category?: ContentCategory;
  customData?: ContentCardData[];

  // Display options
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
  backgroundColor?: "white" | "gray" | "black";

  // External buttons (appear below the card carousel)
  buttons?: Array<{
    text: string;
    variant: string;
    size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
    link?: string;
    file?: string;
    fileMode?: "open" | "download";
    onClick?: () => void;
  }>;

  // Lightbox configuration
  enableLightbox?: boolean;
  isLightboxMode?: boolean;

  // Callbacks
  onCardClick?: (cardId: number) => void;
}

/**
 * UnifiedContentCard Component
 *
 * A flexible card component that supports multiple layouts, styles, and content sources.
 * Consolidates functionality from ContentCards, ImageGlassCard, SquareGlassCard, etc.
 *
 * @example
 * // Use with category
 * <UnifiedContentCard category="materialien" style="glass" layout="horizontal" />
 *
 * @example
 * // Use with custom data
 * <UnifiedContentCard customData={myCards} layout="square" />
 */
export default function UnifiedContentCard({
  layout = "horizontal",
  style = "standard",
  variant = "responsive",
  heightMode = "standard",
  category,
  customData,
  title = "",
  subtitle = "",
  maxWidth = true,
  showInstructions = true,
  backgroundColor = "black",
  buttons,
  enableLightbox = true,
  isLightboxMode = false,
  onCardClick,
}: UnifiedContentCardProps) {
  // State management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const gap = 24;

  // Get card data from category or custom data
  const cardData =
    customData || (category ? getContentByCategory(category) : []);

  const isStatic = variant === "static";
  const isResponsive = variant === "responsive";
  const isGlass = style === "glass";
  const heightMultiplier = heightMode === "tall" ? 1.25 : 1;

  // Determine text colors based on style: glass = white text, standard = black text
  const textColors = {
    title: isGlass ? "text-white" : "text-black",
    subtitle: isGlass ? "text-white" : "text-black",
    description: isGlass ? "text-white" : "text-black",
  };

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);

    // Center the first card initially
    const containerWidth = window.innerWidth;
    let centerOffset;

    if (containerWidth < 768) {
      const containerPadding = 32;
      centerOffset = (containerWidth - cardWidth - containerPadding) / 2;
    } else {
      const effectiveWidth =
        containerWidth < 1024 ? containerWidth - 32 : containerWidth;
      centerOffset =
        (effectiveWidth - cardWidth) / 2 + (containerWidth < 1024 ? 16 : 0);
    }

    x.set(centerOffset);
  }, [cardWidth, x]);

  // Calculate responsive card dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      setScreenWidth(width);

      // Special sizing for video layout (16:9 aspect ratio on desktop, 16:10 on mobile)
      if (layout === "video") {
        // Match VideoCard16by9 dimensions exactly
        if (width >= 1600) {
          setCardsPerView(1);
          setCardWidth(1600);
        } else if (width >= 1400) {
          setCardsPerView(1);
          setCardWidth(1380);
        } else if (width >= 1280) {
          setCardsPerView(1);
          setCardWidth(1280);
        } else if (width >= 1024) {
          setCardsPerView(1);
          setCardWidth(992); // Fit within 1024px viewport with padding
        } else {
          // Mobile/Tablet: Match PlanungspaketeCards width (350px)
          setCardsPerView(1);
          setCardWidth(350);
        }
      } else if (layout === "text-icon") {
        // On desktop/tablet: width = height (based on viewport height for consistency with other cards)
        // On mobile: fixed width with taller height for content
        if (width >= 1600) {
          const calculatedHeight = Math.min(
            830,
            typeof window !== "undefined" ? window.innerHeight * 0.75 : 830
          );
          setCardsPerView(2.5);
          setCardWidth(calculatedHeight); // Square: width = height
        } else if (width >= 1280) {
          const calculatedHeight = Math.min(
            692,
            typeof window !== "undefined" ? window.innerHeight * 0.7 : 692
          );
          setCardsPerView(2.2);
          setCardWidth(calculatedHeight); // Square: width = height
        } else if (width >= 1024) {
          const calculatedHeight = Math.min(
            577,
            typeof window !== "undefined" ? window.innerHeight * 0.7 : 577
          );
          setCardsPerView(2);
          setCardWidth(calculatedHeight); // Square: width = height
        } else if (width >= 768) {
          const calculatedHeight = Math.min(
            720,
            typeof window !== "undefined" ? window.innerHeight * 0.75 : 720
          );
          setCardsPerView(1.5);
          setCardWidth(calculatedHeight); // Square: width = height
        } else {
          // Mobile: fixed width, taller height
          setCardsPerView(1.1);
          setCardWidth(312);
        }
      } else if (isStatic) {
        // Static variant: single responsive card
        if (width >= 1600) {
          setCardsPerView(1);
          setCardWidth(1380);
        } else if (width >= 1280) {
          setCardsPerView(1);
          setCardWidth(1152);
        } else if (width >= 1024) {
          setCardsPerView(1);
          setCardWidth(960);
        } else if (width >= 768) {
          setCardsPerView(1);
          setCardWidth(336);
        } else {
          setCardsPerView(1);
          setCardWidth(312);
        }
      } else if (isResponsive) {
        // Responsive variant: multiple cards
        if (width >= 1600) {
          setCardsPerView(1.4);
          setCardWidth(1380);
        } else if (width >= 1280) {
          setCardsPerView(1.3);
          setCardWidth(1152);
        } else if (width >= 1024) {
          setCardsPerView(1.1);
          setCardWidth(960);
        } else if (width >= 768) {
          setCardsPerView(2);
          setCardWidth(336);
        } else {
          setCardsPerView(1.2);
          setCardWidth(312);
        }
      }

      // Recenter the current card after dimension changes
      if (isClient) {
        const containerWidth = width;
        let centerOffset;

        if (containerWidth < 768) {
          const containerPadding = 32;
          centerOffset = (containerWidth - cardWidth - containerPadding) / 2;
        } else {
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
  }, [
    layout,
    isStatic,
    isResponsive,
    isLightboxMode,
    isClient,
    currentIndex,
    cardWidth,
    gap,
    x,
  ]);

  // Process-detail layout needs all cards (first card + 5 detail cards)
  // Static variant shows only first card for carousel layouts
  const displayCards =
    layout === "process-detail"
      ? cardData
      : isStatic
        ? cardData.slice(0, 1)
        : cardData;

  // Navigation logic
  const navigateCard = useCallback(
    (direction: number) => {
      const targetMaxIndex = displayCards.length - 1; // Allow centering the last card
      const newIndex = Math.max(
        0,
        Math.min(targetMaxIndex, currentIndex + direction)
      );
      setCurrentIndex(newIndex);

      const containerWidth =
        typeof window !== "undefined" ? window.innerWidth : 1200;

      let centerOffset;
      if (containerWidth < 768) {
        const containerPadding = 32;
        centerOffset = (containerWidth - cardWidth - containerPadding) / 2;
      } else {
        const effectiveWidth =
          containerWidth < 1024 ? containerWidth - 32 : containerWidth;
        centerOffset =
          (effectiveWidth - cardWidth) / 2 + (containerWidth < 1024 ? 16 : 0);
      }

      const cardPosition = newIndex * (cardWidth + gap);
      const newX = centerOffset - cardPosition;

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
    [displayCards.length, currentIndex, cardWidth, gap, x]
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

  // Helper function to get appropriate text based on screen size
  const getCardText = (
    card: ContentCardData,
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

  // Helper function to get image path from API URL
  const getImagePath = (imageUrl: string): string => {
    if (imageUrl.startsWith("/api/images?path=")) {
      const url = new URL(imageUrl, "http://localhost");
      return decodeURIComponent(url.searchParams.get("path") || "");
    }
    return imageUrl;
  };

  const containerClasses =
    layout === "video"
      ? maxWidth
        ? "w-full max-w-[1700px] mx-auto"
        : "w-full"
      : maxWidth
        ? "w-full max-w-screen-2xl mx-auto"
        : "w-full";

  // Check if we should show title/subtitle
  const shouldShowTitle =
    !(
      isLightboxMode &&
      typeof window !== "undefined" &&
      window.innerWidth < 768
    ) &&
    title &&
    title.trim() !== "";

  const shouldShowSubtitle = subtitle && subtitle.trim() !== "";
  const shouldRenderTitleContainer = shouldShowTitle || shouldShowSubtitle;

  // Loading state
  if (!isClient) {
    return (
      <div className={containerClasses}>
        {shouldRenderTitleContainer && (
          <div className="text-center mb-8">
            {shouldShowTitle && (
              <h2 className={`text-3xl font-bold mb-2 ${textColors.title}`}>
                {title}
              </h2>
            )}
            {shouldShowSubtitle && (
              <p className={textColors.subtitle}>{subtitle}</p>
            )}
          </div>
        )}
        <div className="flex justify-center items-center py-8">
          <div
            className={`animate-pulse rounded-3xl ${isGlass ? "bg-gray-800" : "bg-gray-200"}`}
            style={{ width: 320, height: 480 }}
          />
        </div>
      </div>
    );
  }

  // Render text-icon layout (square card with text and optional icon, no image)
  const renderTextIconLayout = (card: ContentCardData, index: number) => {
    // Determine which icon to use: custom icon > iconNumber > null
    const iconToRender = card.icon ? (
      <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
        {card.icon}
      </div>
    ) : card.iconNumber ? (
      <StepIcon
        stepNumber={card.iconNumber}
        className="w-12 h-12 md:w-14 md:h-14"
      />
    ) : null;

    return (
      <div className="w-full h-full flex flex-col px-6 md:px-12 py-8 md:py-12">
        {/* Upper Part: Icon, Title, Subtitle - Top Aligned */}
        <motion.div
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          {/* Icon */}
          {iconToRender && (
            <div className="flex justify-center mb-5 md:mb-6">
              {iconToRender}
            </div>
          )}

          {/* Title */}
          <h2 className={`h2-title ${card.textColor || textColors.title} mb-2`}>
            {getCardText(card, "title")}
          </h2>

          {/* Subtitle */}
          {card.subtitle && (
            <h3
              className={`h3-secondary ${card.textColor || textColors.subtitle} mb-0`}
            >
              {getCardText(card, "subtitle")}
            </h3>
          )}
        </motion.div>

        {/* Lower Part: Description - Starts at Fixed Position (top-aligned) */}
        <motion.div
          className="flex-1 flex flex-col justify-start text-center mt-8 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
        >
          <p
            className={`p-primary ${card.textColor || textColors.description} leading-relaxed max-w-3xl mx-auto`}
          >
            {getCardText(card, "description")}
          </p>

          {/* Buttons for text-icon cards */}
          {card.buttons && card.buttons.length > 0 && (
            <div className="flex flex-row gap-2 items-center justify-center w-full mt-8">
              {card.buttons.map((button, btnIndex) => {
                return button.link ? (
                  <Link
                    key={btnIndex}
                    href={button.link}
                    className="flex-shrink-0"
                  >
                    <Button variant={button.variant} size={button.size}>
                      {button.text}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={btnIndex}
                    variant={button.variant}
                    size={button.size}
                    onClick={button.onClick}
                    className="flex-shrink-0"
                  >
                    {button.text}
                  </Button>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  // Render square layout (text top, image bottom with 2:3 aspect ratio)
  const renderSquareLayout = (card: ContentCardData, index: number) => {
    return (
      <>
        {/* Text Content - Top Section */}
        <div className="flex-shrink-0 flex flex-col justify-center items-center text-center p-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <h2
              className={`${isGlass ? "h2-title" : "text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold"} ${textColors.title} mb-2`}
            >
              {getCardText(card, "title")}
            </h2>
            {card.subtitle && (
              <h3
                className={`${isGlass ? "h3-secondary" : "text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium"} ${textColors.subtitle} mb-5`}
              >
                {getCardText(card, "subtitle")}
              </h3>
            )}
            <p
              className={`${isGlass ? `p-primary text-${textColors.description}` : "p-primary"} leading-relaxed`}
            >
              {getCardText(card, "description")}
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
            {card.video ? (
              <ClientBlobVideo
                path={getImagePath(card.video)}
                className="w-full h-full object-cover"
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                controls={false}
                enableCache={true}
                playbackRate={card.playbackRate}
              />
            ) : card.image ? (
              <HybridBlobImage
                path={getImagePath(card.image)}
                alt={getCardText(card, "title")}
                fill
                className="object-cover object-center"
                strategy="client"
                isInteractive={true}
                enableCache={true}
                sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 30vw, (max-width: 1600px) 25vw, 20vw`}
              />
            ) : null}
            {/* Overlay image if provided */}
            {card.overlayImage && (
              <HybridBlobImage
                path={getImagePath(card.overlayImage)}
                alt={`${getCardText(card, "title")} Overlay`}
                fill
                className="object-contain object-center absolute inset-0 z-10"
                strategy="client"
                isInteractive={true}
                enableCache={true}
              />
            )}
          </motion.div>
        </div>
      </>
    );
  };

  // Render image-only layout (no text, just image)
  const renderImageOnlyLayout = (card: ContentCardData, index: number) => {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className="relative w-full h-full"
      >
        {card.video ? (
          <ClientBlobVideo
            path={getImagePath(card.video)}
            className="w-full h-full object-cover"
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
            controls={false}
            enableCache={true}
            playbackRate={card.playbackRate}
          />
        ) : card.image ? (
          <HybridBlobImage
            path={getImagePath(card.image)}
            alt={getCardText(card, "title")}
            width={960}
            height={640}
            className="w-full h-auto object-cover"
            strategy="client"
            isInteractive={true}
            enableCache={true}
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 72vw, 819px"
          />
        ) : null}
        {/* Overlay image if provided */}
        {card.overlayImage && (
          <HybridBlobImage
            path={getImagePath(card.overlayImage)}
            alt={`${getCardText(card, "title")} Overlay`}
            width={960}
            height={640}
            className="w-full h-auto object-contain absolute inset-0 z-10"
            strategy="client"
            isInteractive={true}
            enableCache={true}
          />
        )}
      </motion.div>
    );
  };

  // Render video layout (1:1 at 1024px, 16:9 at 1280px+, 16:10 on mobile)
  const renderVideoLayout = (card: ContentCardData, index: number) => {
    const isMobile = isClient && screenWidth < 1024;

    return isMobile ? (
      // Mobile/Tablet: Stacked layout (Text top, Video bottom with 16:10 aspect ratio)
      <div className="flex flex-col">
        {/* Text Content - More space with better padding */}
        <div className="flex flex-col justify-center items-center text-center px-6 py-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="w-full max-w-none"
          >
            <h2
              className={`h2-title ${textColors.title} ${
                card.subtitle ? "mb-1" : "mb-4"
              }`}
            >
              {getCardText(card, "title")}
            </h2>
            {card.subtitle && (
              <h3
                className={`h3-secondary font-medium ${textColors.subtitle} mb-3`}
              >
                {getCardText(card, "subtitle")}
              </h3>
            )}
            <p
              className={`p-primary ${textColors.description} leading-relaxed`}
            >
              {getCardText(card, "description")}
            </p>
            {/* Note: Buttons are not shown on mobile/tablet to match VideoCard16by9 behavior */}
          </motion.div>
        </div>

        {/* Video Content - Rectangle format with proper spacing */}
        <div
          className={`relative overflow-hidden py-4 px-4 flex ${
            heightMode === "tall" ? "items-stretch" : "items-center"
          } justify-center`}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: index * 0.1 + 0.2,
              duration: 0.8,
            }}
            className="relative rounded-2xl md:rounded-3xl overflow-hidden"
            style={{
              aspectRatio: "16/10", // 16:10 aspect ratio for mobile video (more rectangular)
              width: "100%",
              height: "auto",
              ...(heightMode === "tall" && { height: "100%" }),
            }}
          >
            {card.video ? (
              <ClientBlobVideo
                path={getImagePath(card.video)}
                className="w-full h-full object-cover"
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                controls={false}
                enableCache={true}
                playbackRate={card.playbackRate}
              />
            ) : card.image ? (
              <HybridBlobImage
                path={getImagePath(card.image)}
                alt={getCardText(card, "title")}
                fill
                className="object-cover object-center"
                strategy="client"
                isInteractive={true}
                enableCache={true}
              />
            ) : null}
          </motion.div>
        </div>
      </div>
    ) : (
      // Desktop: Wide layout
      // - 1024px: 50/50 split (Text 1/2, Video 1/2) for better content fit
      // - 1280px+: 1/3-2/3 split (Text 1/3, Video 2/3) for standard layout
      <div className="flex items-stretch h-full">
        {/* Text Content - Responsive width based on screen size */}
        <div
          className={`${
            isClient && screenWidth >= 1024 && screenWidth < 1280
              ? "w-1/2" // 50% at 1024px for more text space
              : "w-1/3" // 33% at 1280px+ for standard layout
          } flex flex-col justify-center items-start text-left ${
            isClient && screenWidth >= 1024 && screenWidth < 1280
              ? "px-8" // Less padding at 1024px
              : "px-12" // Standard padding at 1280px+
          } py-6`}
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <h2
              className={`h2-title ${textColors.title} ${
                card.subtitle ? "mb-1" : "mb-6"
              }`}
            >
              {getCardText(card, "title")}
            </h2>
            {card.subtitle && (
              <h3
                className={`h3-secondary font-medium ${textColors.subtitle} mb-5`}
              >
                {getCardText(card, "subtitle")}
              </h3>
            )}
            <p className={`p-primary ${textColors.description}`}>
              {getCardText(card, "description")}
            </p>

            {/* Buttons for Video Cards - Desktop Layout */}
            {card.buttons && card.buttons.length > 0 && (
              <div className="flex flex-row gap-2 items-start justify-center w-full mt-8">
                {card.buttons.map((button, btnIndex) => {
                  // Convert standard variants to narrow variants
                  const narrowVariant =
                    button.variant === "primary"
                      ? "primary-narrow"
                      : button.variant === "secondary"
                        ? "secondary-narrow-blue"
                        : button.variant;

                  return button.link ? (
                    <Link
                      key={btnIndex}
                      href={button.link}
                      className="flex-shrink-0"
                    >
                      <Button variant={narrowVariant} size={button.size}>
                        {button.text}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      key={btnIndex}
                      variant={narrowVariant}
                      size={button.size}
                      onClick={button.onClick}
                      className="flex-shrink-0"
                    >
                      {button.text}
                    </Button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Video Content - Right side (1:1 at 1024px, 16:9 at 1280px+) */}
        <div
          className={`${
            isClient && screenWidth >= 1024 && screenWidth < 1280
              ? "w-1/2" // 50% at 1024px
              : "w-2/3" // 67% at 1280px+
          } relative overflow-hidden py-[15px] pr-[15px] flex ${
            heightMode === "tall" ? "items-stretch" : "items-center"
          } justify-end`}
        >
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: index * 0.1 + 0.2,
              duration: 0.8,
            }}
            className="relative rounded-3xl overflow-hidden w-full"
            style={{
              // 1:1 at 1024px for better height visibility with 50/50 split
              // 16:9 at 1280px+ for standard widescreen with 1/3-2/3 split
              aspectRatio:
                isClient && screenWidth >= 1024 && screenWidth < 1280
                  ? "1/1"
                  : "16/9",
              maxWidth: "100%",
              ...(heightMode === "tall" && { height: "100%" }),
            }}
          >
            {card.video ? (
              <ClientBlobVideo
                path={getImagePath(card.video)}
                className="w-full h-full object-cover"
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                controls={false}
                enableCache={true}
                playbackRate={card.playbackRate}
              />
            ) : card.image ? (
              <HybridBlobImage
                path={getImagePath(card.image)}
                alt={getCardText(card, "title")}
                fill
                className="object-cover object-center"
                strategy="client"
                isInteractive={true}
                enableCache={true}
              />
            ) : null}
          </motion.div>
        </div>
      </div>
    );
  };

  // Render process-detail layout (large horizontal card + 5 square cards)
  const renderProcessDetailLayout = () => {
    // First card is the large horizontal card at the top
    const mainCard = displayCards[0];
    // Next 5 cards are the small square cards below
    const detailCards = displayCards.slice(1, 6);

    // Calculate aspect ratio for upper card to be exactly 2x height of square cards
    // The calculation needs to account for gaps between grid items
    // Formula: If we have N columns with gaps, and want height = 2 * (one square card height),
    // then aspect_ratio = (N + (N-1)*gap_fraction) : 2
    // Simplified for visual balance: N : 1.33 gives roughly 2x height
    const getUpperCardAspectRatio = () => {
      if (screenWidth >= 1024) {
        return "15 / 4"; // 5 columns = 15:4 aspect ratio (3.75:1)
      } else if (screenWidth >= 768) {
        return "9 / 4"; // 3 columns = 9:4 aspect ratio (2.25:1)
      } else {
        return "3 / 2"; // 2 columns = 3:2 aspect ratio (1.5:1)
      }
    };

    return (
      <div className="w-full space-y-6">
        {/* Main Large Horizontal Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-3xl shadow-lg overflow-hidden"
          style={{
            backgroundColor: "#F4F4F4",
            aspectRatio:
              screenWidth >= 1024 ? getUpperCardAspectRatio() : "auto",
          }}
        >
          <div className="flex flex-col lg:flex-row items-stretch h-full">
            {/* Left Section: Icon, Title, Subtitle */}
            <div
              className="flex flex-col justify-center items-center text-center p-8 lg:p-12 lg:w-1/2"
              style={{ backgroundColor: "#F4F4F4" }}
            >
              {/* Icon */}
              {mainCard.iconNumber && (
                <div className="flex justify-center mb-6">
                  <StepIcon
                    stepNumber={mainCard.iconNumber}
                    className="w-16 h-16 md:w-20 md:h-20"
                  />
                </div>
              )}
              {mainCard.icon && (
                <div className="flex justify-center mb-6 w-16 h-16 md:w-20 md:h-20">
                  {mainCard.icon}
                </div>
              )}

              {/* Title */}
              <h2 className={`h2-title ${textColors.title} mb-2`}>
                {getCardText(mainCard, "title")}
              </h2>

              {/* Subtitle */}
              {mainCard.subtitle && (
                <h3 className={`h3-secondary ${textColors.subtitle} mb-0`}>
                  {getCardText(mainCard, "subtitle")}
                </h3>
              )}
            </div>

            {/* Right Section: Description */}
            <div
              className="flex flex-col justify-center pb-8 px-8 lg:p-12 lg:w-1/2"
              style={{ backgroundColor: "#F4F4F4" }}
            >
              <p className="p-primary textblack leading-relaxed whitespace-pre-line">
                {getCardText(mainCard, "description")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 5 Small Square Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {detailCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
              className="rounded-3xl shadow-lg overflow-hidden flex flex-col justify-center items-center text-center p-6 hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundColor: "#F4F4F4",
                aspectRatio: "1 / 1",
                width: "100%",
              }}
            >
              {/* Icon */}
              {card.iconNumber && (
                <div className="flex justify-center mb-3 md:mb-4">
                  <StepIcon
                    stepNumber={card.iconNumber}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-14 lg:h-14 xl:w-20 xl:h-20"
                  />
                </div>
              )}
              {card.icon && (
                <div className="flex justify-center mb-3 md:mb-4 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-14 lg:h-14 xl:w-20 xl:h-20">
                  {card.icon}
                </div>
              )}

              {/* Title */}
              <h3 className="p-primary text-black font-bold mb-1">
                {getCardText(card, "title")}
              </h3>

              {/* Subtitle */}
              {card.subtitle && (
                <p className="text-xs md:text-sm text-black max-lg:hidden">
                  {getCardText(card, "subtitle")}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Render horizontal layout (text-left, image-right)
  const renderHorizontalLayout = (card: ContentCardData, index: number) => {
    const isMobile = isClient && screenWidth < 1024;

    return isMobile ? (
      // Mobile: Vertical stack (text top, image bottom)
      <>
        {/* Text Content - Top Half */}
        <div className="h-1/2 flex flex-col justify-center items-center text-center p-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <h2
              className={`${isGlass ? "h2-title" : "text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold"} ${textColors.title} mb-2`}
            >
              {getCardText(card, "title")}
            </h2>
            {card.subtitle && (
              <h3
                className={`${isGlass ? "h3-secondary" : "text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium"} ${textColors.subtitle} mb-5`}
              >
                {getCardText(card, "subtitle")}
              </h3>
            )}
            <p
              className={`${isGlass ? `p-primary-${textColors.description}` : "p-primary"} leading-relaxed`}
            >
              {getCardText(card, "description")}
            </p>
          </motion.div>
        </div>

        {/* Image Content - Bottom Half */}
        <div className="h-1/2 relative overflow-hidden p-[15px]">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: index * 0.1 + 0.2,
              duration: 0.8,
            }}
            className="relative w-full h-full rounded-3xl overflow-hidden"
          >
            {card.video ? (
              <ClientBlobVideo
                path={getImagePath(card.video)}
                className="w-full h-full object-cover"
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                controls={false}
                enableCache={true}
                playbackRate={card.playbackRate}
              />
            ) : card.image ? (
              <HybridBlobImage
                path={getImagePath(card.image)}
                alt={getCardText(card, "title")}
                fill
                className="object-cover object-center"
                strategy="client"
                isInteractive={true}
                enableCache={true}
              />
            ) : null}
            {/* Overlay image if provided */}
            {card.overlayImage && (
              <HybridBlobImage
                path={getImagePath(card.overlayImage)}
                alt={`${getCardText(card, "title")} Overlay`}
                fill
                className="object-contain object-center absolute inset-0 z-10"
                strategy="client"
                isInteractive={true}
                enableCache={true}
              />
            )}
          </motion.div>
        </div>
      </>
    ) : (
      // Desktop: Horizontal layout (text left, image right)
      <>
        {/* Text Content - Left Third */}
        <div className="w-1/3 flex flex-col justify-center items-start text-left pt-6 pr-6 pb-6 pl-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <h2
              className={`${isGlass ? "h2-title" : "text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold"} ${textColors.title} mb-2`}
            >
              {getCardText(card, "title")}
            </h2>
            {card.subtitle && (
              <h3
                className={`${isGlass ? "h3-secondary" : "text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium"} ${textColors.subtitle} mb-5`}
              >
                {getCardText(card, "subtitle")}
              </h3>
            )}
            <p
              className={`${isGlass ? `p-primary-${textColors.description}` : "p-primary"} leading-relaxed`}
            >
              {getCardText(card, "description")}
            </p>

            {/* Buttons for cards with button configuration */}
            {card.buttons && card.buttons.length > 0 && (
              <div className="flex flex-row gap-2 items-start justify-center w-full mt-8">
                {card.buttons.map((button, btnIndex) => {
                  const narrowVariant =
                    button.variant === "primary"
                      ? "primary-narrow"
                      : button.variant === "secondary"
                        ? "secondary-narrow-blue"
                        : button.variant;

                  return button.link ? (
                    <Link
                      key={btnIndex}
                      href={button.link}
                      className="flex-shrink-0"
                    >
                      <Button variant={narrowVariant} size={button.size}>
                        {button.text}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      key={btnIndex}
                      variant={narrowVariant}
                      size={button.size}
                      onClick={button.onClick}
                      className="flex-shrink-0"
                    >
                      {button.text}
                    </Button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Image/Video Content - Right Two-Thirds with 1:1 aspect ratio */}
        <div className="w-2/3 relative overflow-hidden p-[15px] flex items-center justify-end">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: index * 0.1 + 0.2,
              duration: 0.8,
            }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              width: "100%",
              height: "100%",
              maxWidth: isClient && screenWidth >= 1600 ? "800px" : "662px",
              maxHeight: isClient && screenWidth >= 1600 ? "800px" : "662px",
              aspectRatio: "1/1",
            }}
          >
            {card.video ? (
              <ClientBlobVideo
                path={getImagePath(card.video)}
                className="w-full h-full object-cover"
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                controls={false}
                enableCache={true}
                playbackRate={card.playbackRate}
              />
            ) : card.image ? (
              <HybridBlobImage
                path={getImagePath(card.image)}
                alt={getCardText(card, "title")}
                fill
                className="object-cover object-center"
                strategy="client"
                isInteractive={true}
                enableCache={true}
              />
            ) : null}
            {/* Overlay image if provided */}
            {card.overlayImage && (
              <HybridBlobImage
                path={getImagePath(card.overlayImage)}
                alt={`${getCardText(card, "title")} Overlay`}
                fill
                className="object-contain object-center absolute inset-0 z-10"
                strategy="client"
                isInteractive={true}
                enableCache={true}
              />
            )}
          </motion.div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={containerClasses}>
        {shouldRenderTitleContainer && (
          <div className={`text-center ${isLightboxMode ? "mb-4" : "mb-8"}`}>
            {shouldShowTitle && (
              <h2 className={`text-3xl font-bold mb-2 ${textColors.title}`}>
                {title}
              </h2>
            )}
            {shouldShowSubtitle && (
              <p className={textColors.subtitle}>{subtitle}</p>
            )}
          </div>
        )}

        {/* Process Detail Layout - Static, Full Width */}
        {layout === "process-detail" ? (
          <div className="py-8">{renderProcessDetailLayout()}</div>
        ) : (
          /* Cards Container - Carousel Layouts */
          <div
            className={`relative ${isLightboxMode ? "py-1 xl:py-2" : "py-8"}`}
          >
            {/* Horizontal Scrolling Layout */}
            <div className="overflow-x-clip">
              <div
                ref={containerRef}
                className={`overflow-x-hidden cards-scroll-container ${
                  isStatic
                    ? ""
                    : isClient && screenWidth < 1024
                      ? "cards-scroll-snap cards-touch-optimized cards-no-bounce"
                      : ""
                } ${
                  layout === "video" ? "px-4" : maxWidth ? "px-8" : "px-4"
                } ${isStatic ? "" : "cursor-grab active:cursor-grabbing"}`}
                style={{ overflow: "visible" }}
              >
                <motion.div
                  className={`flex gap-6 ${isStatic ? "justify-center" : ""}`}
                  style={
                    isStatic
                      ? {}
                      : {
                          x,
                          width: `${(cardWidth + gap) * displayCards.length - gap}px`,
                        }
                  }
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
                      className={`flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                        layout === "square" ||
                        layout === "image-only" ||
                        layout === "text-icon"
                          ? "flex flex-col"
                          : layout === "video"
                            ? isClient && screenWidth >= 1024
                              ? "flex" // Desktop: horizontal layout
                              : "flex flex-col" // Mobile: vertical stack
                            : (isStatic && isClient && screenWidth >= 1024) ||
                                (isResponsive &&
                                  isClient &&
                                  screenWidth >= 1024)
                              ? "flex"
                              : ""
                      } ${isStatic ? "" : "cards-scroll-snap-item"} cards-mobile-smooth`}
                      style={{
                        width: cardWidth,
                        height:
                          layout === "video"
                            ? isClient && screenWidth >= 1024
                              ? // Desktop: Calculate height based on video area with 16:9 ratio + padding
                                isClient && screenWidth >= 1600
                                ? (((1600 * 2) / 3 / 16) * 9 + 30) *
                                  heightMultiplier // 630px standard, 787.5px tall (2/3 split)
                                : isClient && screenWidth >= 1400
                                  ? (((1380 * 2) / 3 / 16) * 9 + 30) *
                                    heightMultiplier // 548px standard, 685px tall (2/3 split)
                                  : isClient && screenWidth >= 1280
                                    ? (((1280 * 2) / 3 / 16) * 9 + 30) *
                                      heightMultiplier // 510px standard, 637.5px tall (2/3 split)
                                    : ((992 * 1) / 2 + 30) * heightMultiplier // 526px standard, 657.5px tall at 1024px (1/2 split, 1:1 aspect ratio)
                              : undefined // Mobile: auto height
                            : layout === "text-icon"
                              ? isClient && screenWidth >= 768
                                ? cardWidth // Square on tablet/desktop: height = width (already calculated from viewport)
                                : 480 * heightMultiplier // 480px standard, 600px tall on mobile to fit content nicely
                              : isStatic || isResponsive
                                ? isClient && screenWidth >= 1600
                                  ? Math.min(
                                      830 * heightMultiplier, // 830px standard, 1037.5px tall
                                      typeof window !== "undefined"
                                        ? window.innerHeight *
                                            0.75 *
                                            heightMultiplier
                                        : 830 * heightMultiplier
                                    )
                                  : isClient && screenWidth >= 1280
                                    ? Math.min(
                                        692 * heightMultiplier, // 692px standard, 865px tall
                                        typeof window !== "undefined"
                                          ? window.innerHeight *
                                              0.7 *
                                              heightMultiplier
                                          : 692 * heightMultiplier
                                      )
                                    : isClient && screenWidth >= 1024
                                      ? Math.min(
                                          577 * heightMultiplier, // 577px standard, 721.25px tall
                                          typeof window !== "undefined"
                                            ? window.innerHeight *
                                                0.7 *
                                                heightMultiplier
                                            : 577 * heightMultiplier
                                        )
                                      : Math.min(
                                          720 * heightMultiplier, // 720px standard, 900px tall
                                          typeof window !== "undefined"
                                            ? window.innerHeight *
                                                0.75 *
                                                heightMultiplier
                                            : 720 * heightMultiplier
                                        )
                                : Math.min(
                                    600 * heightMultiplier, // 600px standard, 750px tall
                                    typeof window !== "undefined"
                                      ? window.innerHeight *
                                          0.75 *
                                          heightMultiplier
                                      : 600 * heightMultiplier
                                  ),
                        backgroundColor: isGlass
                          ? "#121212"
                          : card.backgroundColor,
                        boxShadow: isGlass
                          ? "inset 0 6px 12px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3)"
                          : undefined,
                      }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        if (!isStatic && enableLightbox && !isLightboxMode) {
                          setLightboxOpen(true);
                        } else if (onCardClick) {
                          onCardClick(card.id);
                        }
                      }}
                    >
                      {/* Render layout based on layout prop */}
                      {layout === "video" && renderVideoLayout(card, index)}
                      {layout === "horizontal" &&
                        renderHorizontalLayout(card, index)}
                      {layout === "square" && renderSquareLayout(card, index)}
                      {layout === "text-icon" &&
                        renderTextIconLayout(card, index)}
                      {layout === "image-only" &&
                        renderImageOnlyLayout(card, index)}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {!isStatic && (
              <>
                {currentIndex > 0 && (
                  <button
                    onClick={() => navigateCard(-1)}
                    disabled={isAnimating}
                    className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 ${
                      isGlass
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20 ${
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
                      className={`w-6 h-6 ${isGlass ? "text-white" : "text-black"}`}
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

                {currentIndex < displayCards.length - 1 && (
                  <button
                    onClick={() => navigateCard(1)}
                    disabled={isAnimating}
                    className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 ${
                      isGlass
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20 ${
                      screenWidth < 1024 ? "p-3" : "p-4"
                    }`}
                    style={{
                      left:
                        screenWidth < 1024
                          ? `min(calc(100% - 24px), calc(50% + ${cardWidth / 2 + 30}px))`
                          : `calc(50% + ${cardWidth / 2 + 60}px)`,
                    }}
                  >
                    <svg
                      className={`w-6 h-6 ${isGlass ? "text-white" : "text-black"}`}
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
        )}

        {/* Instructions */}
        {showInstructions && layout !== "process-detail" && (
          <div
            className={`text-center mt-6 text-sm ${isGlass ? "text-white" : "text-black"}`}
          >
            {isStatic ? (
              <p>
                Single responsive {isGlass ? "glass" : ""} card • {layout}{" "}
                layout
              </p>
            ) : (
              <>
                <p className="hidden md:block">
                  Use ← → arrow keys to navigate
                </p>
                <p className="md:hidden">Use arrow buttons to navigate</p>
                <p className="mt-1">
                  Showing{" "}
                  {Math.min(
                    Math.ceil(cardsPerView),
                    displayCards.length - currentIndex
                  )}{" "}
                  of {displayCards.length} cards
                </p>
              </>
            )}
          </div>
        )}

        {/* External Action Buttons (below carousel) */}
        {buttons && buttons.length > 0 && (
          <div className="flex flex-row gap-4 justify-center mt-8">
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
                    <Button
                      variant={
                        button.variant as
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
                          | "configurator"
                      }
                      size={button.size || "xs"}
                    >
                      {button.text}
                    </Button>
                  </ClientBlobFile>
                );
              }

              // Button with link
              if (button.link) {
                return (
                  <Link key={index} href={button.link}>
                    <Button
                      variant={
                        button.variant as
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
                          | "configurator"
                      }
                      size={button.size || "xs"}
                    >
                      {button.text}
                    </Button>
                  </Link>
                );
              }

              // Button with onClick
              return (
                <Button
                  key={index}
                  variant={
                    button.variant as
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
                      | "configurator"
                  }
                  size={button.size || "xs"}
                  onClick={button.onClick}
                >
                  {button.text}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Built-in Lightbox Dialog */}
      {enableLightbox && !isLightboxMode && (
        <Dialog
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          transparent={true}
          className="p-0"
        >
          <div className="w-full h-full flex items-center justify-center p-2 md:p-8 overflow-y-auto">
            <div className="w-full max-w-none my-4">
              <UnifiedContentCard
                {...{
                  layout,
                  style,
                  variant,
                  heightMode,
                  category,
                  customData,
                  title,
                  subtitle: "",
                  maxWidth: false,
                  showInstructions: false,
                  backgroundColor,
                  buttons,
                  enableLightbox: false,
                  isLightboxMode: true,
                  onCardClick,
                }}
              />
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
