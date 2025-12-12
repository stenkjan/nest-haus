"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
  | "process-detail" // Large horizontal card on top + 5 square cards below for checkout steps
  | "overlay-text" // Full image background with left-aligned text overlay and optional button
  | "glass-quote" // Glass background with quote-style text layout (quote mark, mixed bold/gray text, attribution)
  | "team-card"; // Full image background with custom team/value card layout (subtitle/title/description at top, metadata at bottom)

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
 * Image Padding Mode Types
 * Controls whether tall cards have padding around the image
 */
export type ImagePaddingMode = "none" | "standard";

/**
 * Aspect Ratio Types for overlay-text layout
 */
export type AspectRatio = "2x1" | "1x1";

/**
 * Alignment Types for card positioning
 */
export type CardAlignment = "center" | "left";

/**
 * Props for UnifiedContentCard
 */
export interface UnifiedContentCardProps {
  // Layout configuration
  layout?: CardLayout;
  style?: CardStyle;
  variant?: CardVariant;
  heightMode?: HeightMode;
  imagePadding?: ImagePaddingMode; // Controls image padding for tall cards
  aspectRatio?: AspectRatio; // Controls aspect ratio for overlay-text layout (2x1 or 1x1)
  noPadding?: boolean; // Remove py-8 container padding
  showProgress?: boolean; // Show integrated progress bar above cards
  alignment?: CardAlignment; // Controls horizontal alignment of cards (center or left)

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
  imagePadding = "none", // Default: no padding (edge-to-edge)
  aspectRatio = "2x1", // Default: 2x1 aspect ratio for overlay-text
  noPadding: _noPadding = false, // Default: include py-8 padding
  showProgress = false, // Default: don't show integrated progress bar
  alignment = "center", // Default: center alignment
  category,
  customData,
  title = "",
  subtitle = "",
  maxWidth = true,
  showInstructions: _showInstructions = true,
  backgroundColor = "black",
  buttons,
  enableLightbox = false,
  isLightboxMode = false,
  onCardClick,
}: UnifiedContentCardProps) {
  // State management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [_cardsPerView, setCardsPerView] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [stableViewportHeight, setStableViewportHeight] = useState(0);

  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const gap = 24;

  // Get card data from category or custom data
  const cardData = useMemo(
    () => customData || (category ? getContentByCategory(category) : []),
    [customData, category]
  );

  const isStatic = variant === "static";
  const isResponsive = variant === "responsive";
  const isGlass = style === "glass";
  const heightMultiplier = heightMode === "tall" ? 1.25 : 1;

  // Helper function to get stable viewport height (prevents iOS Safari scaling issues)
  const _getViewportHeight = useCallback(() => {
    if (stableViewportHeight > 0) {
      return stableViewportHeight;
    }
    return typeof window !== "undefined" ? window.innerHeight : 0;
  }, [stableViewportHeight]);

  // Helper function to get container padding based on layout and screen width
  const getContainerPadding = useCallback(
    (screenWidth: number) => {
      // Check if this is a layout with px-4 md:px-12 pattern
      const hasResponsivePadding =
        layout === "video" ||
        layout === "overlay-text" ||
        layout === "glass-quote" ||
        layout === "team-card";

      if (isLightboxMode) {
        return 0; // No padding in lightbox mode
      }

      if (hasResponsivePadding) {
        // px-4 on mobile (<768px), px-12 on desktop (≥768px)
        return screenWidth < 768 ? 16 : 48; // One side only
      } else if (maxWidth) {
        // px-8 for maxWidth layouts
        return 32; // One side only
      } else {
        // px-4 default
        return 16; // One side only
      }
    },
    [layout, maxWidth, isLightboxMode]
  );

  // Determine text colors based on style: glass = white text, standard = black text
  const textColors = {
    title: isGlass ? "text-white" : "text-black",
    subtitle: isGlass ? "text-white" : "text-black",
    description: isGlass ? "text-white" : "text-black",
  };

  // Process-detail layout needs all cards (first card + 5 detail cards)
  // Static variant shows only first card for carousel layouts
  const displayCards = useMemo(
    () =>
      layout === "process-detail"
        ? cardData
        : isStatic
          ? cardData.slice(0, 1)
          : cardData,
    [layout, isStatic, cardData]
  );

  // Helper function to calculate individual card width based on aspect ratio
  const getCardWidthForIndex = useCallback(
    (card: ContentCardData, currentScreenWidth: number) => {
      // For overlay-text layout, calculate width based on card's aspect ratio
      if (layout === "overlay-text") {
        const cardAspectRatio = card.aspectRatio || aspectRatio;
        // MOBILE OVERRIDE: Force all cards to 2x1 (portrait) on mobile for better UX
        const effectiveAspectRatio =
          currentScreenWidth < 1024 ? "2x1" : cardAspectRatio;

        const width =
          currentScreenWidth >= 1536
            ? 830 * heightMultiplier
            : currentScreenWidth >= 1280
              ? 692 * heightMultiplier
              : currentScreenWidth >= 1024
                ? 577 * heightMultiplier
                : currentScreenWidth >= 768
                  ? 720 * heightMultiplier
                  : 600 * heightMultiplier;

        const cardHeight = width; // Use fixed heights, not viewport-based

        return effectiveAspectRatio === "2x1"
          ? cardHeight * 0.6
          : cardHeight * 1.2;
      }

      // For all other layouts, use the standard cardWidth
      return cardWidth;
    },
    [layout, aspectRatio, heightMultiplier, cardWidth]
  );

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);

    // Set stable viewport height for iOS Safari (use the largest viewport height to avoid scaling on browser bar show/hide)
    // visualViewport gives us the visible area excluding browser UI
    const getStableHeight = () => {
      if (typeof window !== "undefined") {
        // For iOS Safari, capture the maximum viewport height on initial load
        // This prevents the dialog from shrinking when the address bar state changes
        const vh = window.visualViewport
          ? window.visualViewport.height
          : window.innerHeight;

        // Use the larger of the two to ensure consistent sizing
        // This prevents shrinking on first interaction
        const calculatedHeight = Math.max(vh, window.innerHeight);

        // Store the initial height for future reference
        if (stableViewportHeight === 0) {
          return calculatedHeight;
        }
        return stableViewportHeight;
      }
      return 0;
    };

    const initialHeight = getStableHeight();
    if (initialHeight > 0 && stableViewportHeight === 0) {
      setStableViewportHeight(initialHeight);
    }

    // For lightbox mode on iOS, ensure viewport is locked immediately
    // This prevents the shrinking issue on first slide transition
    if (isLightboxMode && stableViewportHeight === 0) {
      const iosHeight = Math.max(
        window.innerHeight,
        window.visualViewport?.height || window.innerHeight
      );
      setStableViewportHeight(iosHeight);
    }

    // Center or left-align the first card initially
    const containerWidth = window.innerWidth;
    const firstCardWidth =
      displayCards.length > 0
        ? getCardWidthForIndex(displayCards[0], containerWidth)
        : cardWidth;

    let centerOffset;
    if (alignment === "left" && containerWidth >= 1024) {
      // Left alignment: start from left edge (padding handled by container px class)
      centerOffset = 0;
    } else {
      // Center alignment (default behavior for all, and mobile/tablet for left alignment)
      const padding = getContainerPadding(containerWidth);
      const totalPadding = padding * 2; // Left + right padding
      const availableWidth = containerWidth - totalPadding;
      centerOffset = (availableWidth - firstCardWidth) / 2;
    }

    x.set(centerOffset);
  }, [
    cardWidth,
    x,
    displayCards,
    getCardWidthForIndex,
    alignment,
    isLightboxMode,
    stableViewportHeight,
    getContainerPadding,
  ]);

  // Calculate responsive card dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      setScreenWidth(width);

      // Special sizing for video layout (16:9 aspect ratio on desktop, 16:10 on mobile)
      if (layout === "video") {
        // Match VideoCard16by9 dimensions exactly
        if (width >= 1536) {
          setCardsPerView(1);
          setCardWidth(1536);
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
        // Square cards: width = height (fixed heights based on width breakpoints only)
        // No viewport height dependency - scales based on width breakpoints only
        if (width >= 1536) {
          // 1536px+: 650px
          setCardsPerView(2.5);
          setCardWidth(650); // Square: width = height (fixed)
        } else if (width >= 1280) {
          // 1280-1535px: 600px
          setCardsPerView(2.3);
          setCardWidth(600); // Square: width = height (fixed)
        } else if (width >= 1024) {
          // 1024-1279px: 550px
          setCardsPerView(2.2);
          setCardWidth(550); // Square: width = height (fixed)
        } else if (width >= 768) {
          // 768-1023px: 500px
          setCardsPerView(2);
          setCardWidth(500); // Square: width = height (fixed)
        } else {
          // Mobile (<768px): 480px base height, fixed width
          setCardsPerView(1.1);
          setCardWidth(350);
        }
      } else if (layout === "overlay-text") {
        // Overlay-text layout: same HEIGHT as other cards, width varies by aspect ratio
        // Height is consistent across all cards, aspect ratio controls WIDTH
        // "2x1" = 1.2:2 ratio (portrait - 1.2cm width × 2cm height), "1x1" = 2.4:2 ratio (WIDER - 2.4cm width × 2cm height)
        // MOBILE OVERRIDE: Force 2x1 aspect ratio on mobile (<1024px) for better UX
        const effectiveAspectRatio = width < 1024 ? "2x1" : aspectRatio;

        if (width >= 1536) {
          // Height: 830px fixed, Width varies by aspect ratio
          const cardHeight = 830;
          setCardsPerView(effectiveAspectRatio === "2x1" ? 3.8 : 1.9);
          setCardWidth(
            effectiveAspectRatio === "2x1" ? cardHeight * 0.6 : cardHeight * 1.2
          );
        } else if (width >= 1280) {
          // Height: 692px fixed, Width varies by aspect ratio
          const cardHeight = 692;
          setCardsPerView(effectiveAspectRatio === "2x1" ? 3.2 : 1.7);
          setCardWidth(
            effectiveAspectRatio === "2x1" ? cardHeight * 0.6 : cardHeight * 1.2
          );
        } else if (width >= 1024) {
          // Height: 577px fixed, Width varies by aspect ratio
          const cardHeight = 577;
          setCardsPerView(effectiveAspectRatio === "2x1" ? 2.6 : 1.5);
          setCardWidth(
            effectiveAspectRatio === "2x1" ? cardHeight * 0.6 : cardHeight * 1.2
          );
        } else if (width >= 768) {
          // Height: 720px fixed, Width varies by aspect ratio
          const cardHeight = 720;
          setCardsPerView(effectiveAspectRatio === "2x1" ? 2.6 : 1.5);
          setCardWidth(
            effectiveAspectRatio === "2x1" ? cardHeight * 0.6 : cardHeight * 1.2
          );
        } else {
          // Mobile: Height: 600px fixed, Width forced to 2x1 (portrait)
          const _cardHeight = 600;
          setCardsPerView(2); // Always 2 cards per view on mobile (portrait)
          setCardWidth(350); // Match video layout width for consistency
        }
      } else if (layout === "glass-quote") {
        // Glass-quote layout: Use 2x1 aspect ratio (portrait/tall like video background cards)
        const viewportHeight =
          stableViewportHeight > 0
            ? stableViewportHeight
            : typeof window !== "undefined"
              ? window.innerHeight
              : 0;

        if (width >= 1536) {
          const cardHeight = Math.min(830, viewportHeight * 0.75);
          setCardsPerView(3.8);
          setCardWidth(cardHeight * 0.6); // 2x1 portrait ratio
        } else if (width >= 1280) {
          const cardHeight = Math.min(692, viewportHeight * 0.7);
          setCardsPerView(3.2);
          setCardWidth(cardHeight * 0.6); // 2x1 portrait ratio
        } else if (width >= 1024) {
          const cardHeight = Math.min(577, viewportHeight * 0.7);
          setCardsPerView(2.6);
          setCardWidth(cardHeight * 0.6); // 2x1 portrait ratio
        } else if (width >= 768) {
          // Keep same height as 1024px to avoid weird scaling
          const cardHeight = Math.min(577, viewportHeight * 0.7);
          setCardsPerView(2.6);
          setCardWidth(cardHeight * 0.6); // 2x1 portrait ratio
        } else {
          // Mobile: Taller cards while maintaining width
          // We want height=500 but width to stay close to 768px width (577*0.6=346)
          const cardHeight = Math.min(500, viewportHeight * 0.65);
          setCardsPerView(2);
          setCardWidth(cardHeight * 0.7); // Adjusted ratio to maintain similar width
        }
      } else if (layout === "team-card") {
        // Team-card layout: Use 1.8:2 aspect ratio (9:10 - nearly square but slightly taller)
        const viewportHeight =
          stableViewportHeight > 0
            ? stableViewportHeight
            : typeof window !== "undefined"
              ? window.innerHeight
              : 0;

        if (width >= 1536) {
          const cardHeight = Math.min(830, viewportHeight * 0.75);
          setCardsPerView(2.5);
          setCardWidth(cardHeight * 0.9); // 1.8:2 ratio (9:10)
        } else if (width >= 1280) {
          const cardHeight = Math.min(692, viewportHeight * 0.7);
          setCardsPerView(2.2);
          setCardWidth(cardHeight * 0.9); // 1.8:2 ratio (9:10)
        } else if (width >= 1024) {
          const cardHeight = Math.min(577, viewportHeight * 0.7);
          setCardsPerView(1.8);
          setCardWidth(cardHeight * 0.9); // 1.8:2 ratio (9:10)
        } else if (width >= 768) {
          const cardHeight = Math.min(720, viewportHeight * 0.75);
          setCardsPerView(1.5);
          setCardWidth(cardHeight * 0.9); // 1.8:2 ratio (9:10)
        } else {
          // Mobile: 2x1 portrait ratio (matching glass-quote cards)
          const cardHeight = Math.min(600, viewportHeight * 0.75);
          setCardsPerView(2);
          setCardWidth(cardHeight * 0.6);
        }
      } else if (isStatic) {
        // Static variant: single responsive card
        if (width >= 1536) {
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
        if (width >= 1536) {
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

        // Get the width of the current card
        const currentCardWidth =
          displayCards.length > currentIndex
            ? getCardWidthForIndex(displayCards[currentIndex], width)
            : cardWidth;

        let centerOffset;
        if (alignment === "left" && containerWidth >= 1024) {
          // Left alignment: start from left edge (padding handled by container px class)
          centerOffset = 0;
        } else {
          // Center alignment (default behavior for all, and mobile/tablet for left alignment)
          const padding = getContainerPadding(containerWidth);
          const totalPadding = padding * 2; // Left + right padding
          const availableWidth = containerWidth - totalPadding;
          centerOffset = (availableWidth - currentCardWidth) / 2;
        }

        // Calculate cumulative position for variable-width cards
        let cardPosition = 0;
        for (let i = 0; i < currentIndex; i++) {
          cardPosition += getCardWidthForIndex(displayCards[i], width) + gap;
        }

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
    aspectRatio,
    heightMultiplier,
    displayCards,
    getCardWidthForIndex,
    stableViewportHeight,
    alignment,
    getContainerPadding,
  ]);

  // Helper function to calculate individual card width based on aspect ratio
  const getCardWidth = useCallback(
    (card: ContentCardData) => {
      return getCardWidthForIndex(card, screenWidth);
    },
    [getCardWidthForIndex, screenWidth]
  );

  // Helper function to calculate cumulative position for variable-width cards
  const getCumulativePosition = useCallback(
    (targetIndex: number) => {
      let position = 0;
      for (let i = 0; i < targetIndex; i++) {
        position += getCardWidth(displayCards[i]) + gap;
      }
      return position;
    },
    [displayCards, getCardWidth, gap]
  );

  // Navigation logic - handles variable-width cards
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

      // Get the width of the target card (for centering calculation)
      const targetCardWidth = getCardWidth(displayCards[newIndex]);

      let centerOffset;
      if (alignment === "left" && containerWidth >= 1024) {
        // Left alignment: start from left edge (padding handled by container px class)
        centerOffset = 0;
      } else {
        // Center alignment (default behavior for all, and mobile/tablet for left alignment)
        const padding = getContainerPadding(containerWidth);
        const totalPadding = padding * 2; // Left + right padding
        const availableWidth = containerWidth - totalPadding;
        centerOffset = (availableWidth - targetCardWidth) / 2;
      }

      // Calculate cumulative position for variable-width cards
      const cardPosition = getCumulativePosition(newIndex);
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
    [
      displayCards,
      currentIndex,
      getCardWidth,
      getCumulativePosition,
      x,
      alignment,
      getContainerPadding,
    ]
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
  const getCardText = useCallback(
    (card: ContentCardData, field: "title" | "subtitle" | "description") => {
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
    },
    [isClient, screenWidth]
  );

  // Helper function to get image path from API URL
  const getImagePath = useCallback((imageUrl: string): string => {
    if (imageUrl.startsWith("/api/images?path=")) {
      const url = new URL(imageUrl, "http://localhost");
      return decodeURIComponent(url.searchParams.get("path") || "");
    }
    return imageUrl;
  }, []);

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
      <div className="w-12 h-12 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center">
        {card.icon}
      </div>
    ) : card.iconNumber ? (
      <StepIcon
        stepNumber={card.iconNumber}
        className="w-12 h-12 md:w-12 md:h-12 lg:w-14 lg:h-14"
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
                sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 30vw, (max-width: 1536px) 25vw, 20vw`}
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
        <div className="flex flex-col justify-center items-start text-left px-6 py-6">
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
              dangerouslySetInnerHTML={{
                __html: getCardText(card, "description").replace(
                  /\n/g,
                  "<br/>"
                ),
              }}
            />
            {/* Note: Buttons are not shown on mobile/tablet to match VideoCard16by9 behavior */}
          </motion.div>
        </div>

        {/* Video Content - Rectangle format with proper spacing */}
        <div
          className={`relative overflow-hidden ${
            // Padding logic for mobile - SAME as desktop:
            // - imagePadding="standard": py-4 px-4
            // - imagePadding="none": no padding (only for tall cards)
            heightMode === "tall" && imagePadding === "none" ? "" : "py-4 px-4"
          } flex ${
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
              // 16:10 aspect ratio for mobile video (more rectangular)
              width: "100%",
              aspectRatio: "16/10",
              height: "auto",
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
      // - 1024px-1279px: 50/50 split for both tall and standard cards to fit text content
      // - 1280px-1399px: 40/60 split for slightly more text space
      // - 1400px+: 1/3-2/3 split (Text 1/3, Video 2/3) for standard layout
      <div className="flex items-stretch h-full">
        {/* Text Content - Responsive width based on screen size */}
        <div
          className={`flex flex-col justify-center items-start text-left ${
            isClient && screenWidth >= 1024 && screenWidth < 1280
              ? "px-16" // Standard padding at 1024-1279px
              : "px-16" // Standard padding at 1280px+
          } py-6`}
          style={{
            width:
              isClient && screenWidth >= 1024 && screenWidth < 1280
                ? "50%" // 50% for all cards at 1024-1279px to fit text content
                : isClient && screenWidth >= 1280 && screenWidth < 1400
                  ? "40%" // 40% at 1280-1399px for slightly more text space
                  : "33.333333%", // 33% at 1400px+ for all cards
          }}
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
            <p
              className={`p-primary ${textColors.description}`}
              dangerouslySetInnerHTML={{
                __html: getCardText(card, "description").replace(
                  /\n/g,
                  "<br/>"
                ),
              }}
            />

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

        {/* Video Content - Right side (50% at 1024-1279px, 60% at 1280-1399px, 67% at 1400px+) */}
        <div
          className={`relative flex ${
            heightMode === "tall" ? "items-stretch" : "items-center"
          } justify-end ${
            // Padding logic - SAME for all cards regardless of heightMode:
            // - imagePadding="standard": py-[15px] pr-[15px]
            // - imagePadding="none": no padding (only for tall cards)
            heightMode === "tall" && imagePadding === "none"
              ? ""
              : "py-[15px] pr-[15px]"
          }`}
          style={{
            width:
              isClient && screenWidth >= 1024 && screenWidth < 1280
                ? "50%" // 50% for all cards at 1024-1279px to match text
                : isClient && screenWidth >= 1280 && screenWidth < 1400
                  ? "60%" // 60% at 1280-1399px to match text
                  : "66.666667%", // 67% at 1400px+ for all cards
          }}
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
              // For tall cards at desktop (1024px+), remove aspect ratio and fill available space
              // For standard cards: 1:1 at 1024-1279px, 16:9 at 1280px+
              ...(heightMode === "tall" && isClient && screenWidth >= 1024
                ? { height: "100%" }
                : {
                    aspectRatio:
                      isClient && screenWidth >= 1024 && screenWidth < 1280
                        ? "1/1"
                        : "16/9",
                    maxWidth: "100%",
                  }),
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
                className={`object-cover ${
                  // Use custom imagePosition if provided, otherwise use defaults
                  card.imagePosition
                    ? `object-${card.imagePosition}`
                    : heightMode === "tall"
                      ? "object-left" // Left-aligned for tall cards (default)
                      : "object-center" // Center for standard cards
                }`}
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

  // Render overlay-text layout (full image background with text overlay and optional button)
  const renderOverlayTextLayout = (card: ContentCardData, index: number) => {
    // Determine image fit behavior
    const imageFitClass =
      card.imageFit === "contain-width"
        ? "w-full h-auto min-h-full object-contain object-center"
        : "object-cover object-center";

    // Determine text color (default to white, allow override)
    const overlayTextColor = card.textColor || "text-white";

    // Determine description color (default to overlayTextColor, allow override)
    const descriptionTextColor = card.descriptionColor || overlayTextColor;

    // Determine heading level (default to h3)
    const headingLevel = card.headingLevel || "h3";
    const baseHeadingClass =
      headingLevel === "h2" ? "h2-title" : "h3-secondary";

    // Use h2-title for first card (id: 0) when h2 (not h2-title-large)
    const headingClass = baseHeadingClass;

    // Determine text order (default: description first, title second)
    const reverseOrder = card.reverseTextOrder || false;

    // Use custom padding if specified, otherwise use default (same as glass-quote layout)
    const paddingClasses = card.customPadding || "p-6 md:p-8 lg:p-10";

    return (
      <div className="relative w-full h-full overflow-hidden">
        {/* Background Image (full card) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
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
              className={imageFitClass}
              strategy="client"
              isInteractive={true}
              enableCache={true}
            />
          ) : null}
          {/* Dark overlay for better text readability - only for glass style with images */}
          {isGlass && (card.image || card.video) && (
            <div className="absolute inset-0 bg-black/30" />
          )}
        </div>

        {/* Text Content Overlay - Left Aligned */}
        <div
          className={`relative z-10 h-full flex flex-col justify-between ${paddingClasses}`}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="text-left"
          >
            {reverseOrder ? (
              <>
                {/* Title first (h2 or h3) */}
                {headingLevel === "h2" ? (
                  <h2
                    className={`${card.mobileTitleClass || headingClass} ${overlayTextColor} font-bold mb-2 md:mb-3 whitespace-pre-line`}
                  >
                    {getCardText(card, "title")}
                  </h2>
                ) : (
                  <h3
                    className={`${card.mobileTitleClass || headingClass} ${overlayTextColor} font-bold mb-2 md:mb-3 whitespace-pre-line`}
                  >
                    {getCardText(card, "title")}
                  </h3>
                )}
                {/* Description second */}
                <p
                  className={`${card.mobileDescriptionClass || "p-primary"} ${overlayTextColor}`}
                >
                  {getCardText(card, "description")}
                </p>
              </>
            ) : (
              <>
                {/* Default order: Description first */}
                <p
                  className={`${card.mobileDescriptionClass || "p-primary"} ${descriptionTextColor} mb-2 md:mb-3`}
                >
                  {getCardText(card, "description")}
                </p>
                {/* Title second (h2 or h3) */}
                {headingLevel === "h2" ? (
                  <h2
                    className={`${card.mobileTitleClass || headingClass} ${overlayTextColor} font-bold whitespace-pre-line`}
                  >
                    {getCardText(card, "title")}
                  </h2>
                ) : (
                  <h3
                    className={`${card.mobileTitleClass || headingClass} ${overlayTextColor} font-bold whitespace-pre-line`}
                  >
                    {getCardText(card, "title")}
                  </h3>
                )}
              </>
            )}
          </motion.div>

          {/* Optional Button at Bottom - Centered */}
          {card.buttons && card.buttons.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
              className="flex justify-center gap-4"
            >
              {card.buttons.map((button, btnIndex) => {
                // Hide second button on mobile (<768px) - only show first button
                const hideOnMobile =
                  btnIndex > 0 && isClient && screenWidth < 768;

                return button.link ? (
                  <Link
                    key={btnIndex}
                    href={button.link}
                    className={`flex-shrink-0 ${hideOnMobile ? "hidden md:block" : ""}`}
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
                    className={`flex-shrink-0 ${hideOnMobile ? "hidden md:block" : ""}`}
                  >
                    {button.text}
                  </Button>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  // Hook to detect text overflow and adjust font size dynamically
  const useTextOverflow = <T extends HTMLElement>(
    element: T | null,
    container: HTMLElement | null
  ) => {
    const [fontScale, setFontScale] = useState(1);

    useEffect(() => {
      if (!element || !container) return;

      const checkOverflow = () => {
        // Check if text overflows container
        const textHeight = element.scrollHeight;
        const containerHeight = container.clientHeight;

        setFontScale((prev) => {
          if (textHeight > containerHeight && prev > 0.7) {
            return Math.max(0.7, prev - 0.05);
          } else if (textHeight <= containerHeight * 0.9 && prev < 1) {
            return Math.min(1, prev + 0.05);
          }
          return prev;
        });
      };

      // Check on mount and resize
      checkOverflow();
      window.addEventListener("resize", checkOverflow);
      const resizeObserver = new ResizeObserver(checkOverflow);

      resizeObserver.observe(container);
      resizeObserver.observe(element);

      return () => {
        window.removeEventListener("resize", checkOverflow);
        resizeObserver.disconnect();
      };
    }, [element, container]); // Re-run when actual elements change

    return fontScale;
  };

  // Separate component for glass quote card to properly use hooks
  // Defined inside component to access getCardText and getImagePath
  const GlassQuoteCard = React.memo(
    ({
      card,
      index,
      getCardText,
      getImagePath,
    }: {
      card: ContentCardData;
      index: number;
      getCardText: (
        card: ContentCardData,
        field: "title" | "subtitle" | "description"
      ) => string;
      getImagePath: (imageUrl: string) => string;
    }) => {
      // Parse the description to extract quote text and attribution
      const description = getCardText(card, "description");
      const parts = (description || "").split("|||");
      const quoteText = parts[0] || "";
      const attributionName = parts[1] || "";
      const attributionTitle = parts[2] || "";

      // Use custom padding if specified, otherwise use default
      const paddingClasses = card.customPadding || "p-6 md:p-8 lg:p-10";

      // Conditional title class: Use h2-title-large for first card (id: 0), p-primary for others
      const titleClass = card.id === 0 ? "h2-title-large mt-6 md:mt-0" : "p-primary";

      // Refs for overflow detection containers
      const [titleContainer, setTitleContainer] =
        useState<HTMLDivElement | null>(null);
      const [quoteContainer, setQuoteContainer] =
        useState<HTMLDivElement | null>(null);

      const titleContainerRef = useCallback((node: HTMLDivElement | null) => {
        setTitleContainer(node);
      }, []);

      const quoteContainerRef = useCallback((node: HTMLDivElement | null) => {
        setQuoteContainer(node);
      }, []);

      // Use state-based refs to trigger re-renders when elements change
      const [titleElement, setTitleElement] = useState<HTMLElement | null>(
        null
      );
      const [quoteElement, setQuoteElement] =
        useState<HTMLParagraphElement | null>(null);

      // Create callback refs that update state when element changes
      const titleCallbackRef = useCallback((node: HTMLElement | null) => {
        setTitleElement(node);
      }, []);

      const quoteCallbackRef = useCallback(
        (node: HTMLParagraphElement | null) => {
          setQuoteElement(node);
        },
        []
      );

      // Detect overflow and adjust font size - pass actual elements, not refs
      const titleScale = useTextOverflow(titleElement, titleContainer);
      const quoteScale = useTextOverflow(quoteElement, quoteContainer);

      const cardContent = (
        <div
          className={`relative z-10 h-full flex flex-col justify-between ${paddingClasses}`}
        >
          {/* Top Section: Logo + Title + Subtitle - Auto height to prevent text cutoff */}
          <motion.div
            ref={titleContainerRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="flex flex-col items-start"
          >
            {/* Logo Image - White filtered, left-aligned */}
            {card.image && (
              <div className="mb-2 md:mb-3 w-24 h-12 md:w-32 md:h-16 flex-shrink-0">
                <HybridBlobImage
                  path={getImagePath(card.image)}
                  alt={getCardText(card, "title")}
                  width={128}
                  height={64}
                  className="w-full h-full object-contain object-left"
                  style={{
                    filter: "brightness(0) invert(1)", // Makes logo white
                  }}
                  strategy="client"
                  enableCache={true}
                />
              </div>
            )}

            {/* Icon fallback */}
            {!card.image && card.icon && (
              <div className="mb-2 md:mb-3 flex-shrink-0">{card.icon}</div>
            )}

            {/* Top Text - h2-title for first card (id: 0), p-primary for others */}
            {card.title &&
              (card.externalLink ? (
                <a
                  ref={titleCallbackRef}
                  href={card.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${titleClass} text-white ${
                    card.id === 0
                      ? "whitespace-pre-line ml-2 mr-2 md:mt-6 md:mb-4"
                      : "mb-1 underline hover:opacity-80 transition-opacity cursor-pointer"
                  }`}
                  style={
                    card.id === 0 ? {} : { fontSize: `${titleScale * 100}%` }
                  }
                >
                  {getCardText(card, "title")}
                </a>
              ) : (
                <p
                  ref={titleCallbackRef}
                  className={`${titleClass} text-white ${
                    card.id === 0
                      ? "whitespace-pre-line ml-2 mr-2 md:mt-6 md:mb-4"
                      : "mb-1 underline"
                  }`}
                  style={
                    card.id === 0 ? {} : { fontSize: `${titleScale * 100}%` }
                  }
                >
                  {getCardText(card, "title")}
                </p>
              ))}

            {/* Secondary Top Text - p-primary-small with mobile text support */}
            {card.subtitle && (
              <p
                className={`p-primary-small ${card.id === 0 ? "pl-4 pr-8 pt-4 pt-6 md:pt-4 leading-relaxed" : ""} text-gray-400`}
              >
                {getCardText(card, "subtitle")}
              </p>
            )}
          </motion.div>

          {/* Middle Section: Quote Text - Fixed height for alignment */}
          {(card.id === 0 || quoteText) && (
            <motion.div
              ref={quoteContainerRef}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
              className="flex items-center md:items-start flex-1 min-h-[200px] md:min-h-[240px] mt-0 mb-4 md:mb-0 lg:mt-8 overflow-hidden"
            >
              <div className="w-full px-8 md:px-0">
                {/* Large Quote Mark - block element with fixed height (skip for card id 0) */}
                {card.id !== 0 && (
                  <span className="block text-4xl md:text-4xl lg:text-5xl text-white/90 leading-none h-8 md:h-8 lg:h-10">
                    &ldquo;
                  </span>
                )}
                {/* Quote Text - h2-title-large for id 0, p-primary for others */}
                <p
                  ref={quoteCallbackRef}
                  className={`${card.id === 0 ? "h2-title-large text-white/80 leading-tight" : "p-primary text-white leading-relaxed"}`}
                  style={{ fontSize: `${quoteScale * 100}%` }}
                  dangerouslySetInnerHTML={{ __html: quoteText }}
                />
              </div>
            </motion.div>
          )}

          {/* Bottom Section: Attribution - Fixed height for alignment (not for card id 0) */}
          {card.id !== 0 && (attributionName || attributionTitle) && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
              className="flex flex-col items-start h-[80px] md:h-[100px] justify-end"
            >
              {/* Attribution Name - p-primary */}
              {attributionName && (
                <p className="p-primary text-white mb-1">{attributionName}</p>
              )}

              {/* Attribution Title - p-primary-small */}
              {attributionTitle && (
                <p className="p-primary-small text-gray-400">
                  {attributionTitle}
                </p>
              )}
            </motion.div>
          )}
        </div>
      );

      return (
        <div
          className="relative w-full h-full overflow-hidden rounded-3xl"
          style={{
            backgroundColor: "#121212",
            boxShadow:
              "inset 0 0 20px rgba(255, 255, 255, 0.6), 0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          {cardContent}
        </div>
      );
    }
  );
  GlassQuoteCard.displayName = "GlassQuoteCard";

  // Render glass-quote layout (glass background with quote-style text layout)
  const renderGlassQuoteLayout = (card: ContentCardData, index: number) => {
    return (
      <GlassQuoteCard
        card={card}
        index={index}
        getCardText={getCardText}
        getImagePath={getImagePath}
      />
    );
  };

  // Render team-card layout (full image background with custom team/value card layout)
  const renderTeamCardLayout = (card: ContentCardData, index: number) => {
    // Determine image fit behavior - use custom imagePosition if provided, otherwise right-aligned for team photos
    const objectFit =
      card.imageFit === "contain" ? "object-contain" : "object-cover";
    const objectPosition = card.imagePosition
      ? `object-${card.imagePosition}`
      : "object-right";
    const imageFitClass = `${objectFit} ${objectPosition}`;

    // Determine text color (default to white)
    const textColor = card.textColor || "text-white";

    return (
      <div className="relative w-full h-full overflow-hidden rounded-3xl">
        {/* Background Image (full card) */}
        <div className="absolute inset-0 z-0">
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
              className={imageFitClass}
              strategy="client"
              isInteractive={true}
              enableCache={true}
            />
          ) : null}
          {/* Optional dark overlay for better text readability - removed for team photos */}
        </div>

        {/* Text Content Overlay - Left Aligned with top and bottom sections */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8 lg:p-10">
          {/* Top Section: Subtitle (p-primary-small) + Title (h3-secondary) + Description (p-primary) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="text-left"
            style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)" }}
          >
            {/* Subtitle - p-primary-small */}
            {card.subtitle && (
              <p
                className={`p-primary-small ${textColor} !mb-1 md:!mb-2`}
                dangerouslySetInnerHTML={{
                  __html: getCardText(card, "subtitle"),
                }}
              />
            )}

            {/* Title - h3-secondary */}
            <h3
              className={`h3-secondary ${textColor} font-bold !mb-1 md:!mb-2`}
            >
              {getCardText(card, "title")}
            </h3>

            {/* Description - p-primary (only render if not empty) */}
            {card.description && (
              <p className={`p-primary ${textColor}`}>
                {getCardText(card, "description")}
              </p>
            )}
          </motion.div>

          {/* Bottom Section: Bottom Label (p-primary-small) + Bottom Text (p-tertiary) */}
          {(card.bottomLabel || card.bottomText) && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
              className="text-left"
              style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)" }}
            >
              {/* Bottom Label - p-primary-small */}
              {card.bottomLabel && (
                <p
                  className={`p-primary-small ${textColor} mb-1 md:mb-2`}
                  dangerouslySetInnerHTML={{ __html: card.bottomLabel }}
                />
              )}

              {/* Bottom Text - p-tertiary */}
              {card.bottomText && (
                <p
                  className={`p-secondary ${textColor} opacity-90 whitespace-pre-line`}
                >
                  {card.bottomText}
                </p>
              )}
            </motion.div>
          )}
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
              className="rounded-3xl shadow-lg overflow-hidden flex flex-col justify-center items-center text-center p-6"
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
              maxWidth: isClient && screenWidth >= 1536 ? "800px" : "662px",
              maxHeight: isClient && screenWidth >= 1536 ? "800px" : "662px",
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
          <div className="relative">
            {/* Integrated Progress Bar - Shown above cards when enabled */}
            {showProgress && displayCards.length > 1 && (
              <div className="mb-8 px-4 md:px-8">
                {/* Desktop: Horizontal Progress Steps */}
                <div className="hidden md:block">
                  <div className="relative max-w-4xl mx-auto">
                    {/* Step Dots */}
                    <div
                      className="grid gap-0"
                      style={{
                        gridTemplateColumns: `repeat(${displayCards.length}, 1fr)`,
                      }}
                    >
                      {/* Background Line - positioned to connect circle centers */}
                      <div
                        className="absolute top-3 h-0.5 bg-gray-200"
                        style={{
                          left: `calc(${100 / (displayCards.length * 2)}%)`,
                          right: `calc(${100 / (displayCards.length * 2)}%)`,
                        }}
                      />
                      {/* Progress Line - grows from first to current circle */}
                      <div
                        className="absolute top-3 h-0.5 bg-blue-500 transition-all duration-300"
                        style={{
                          left: `calc(${100 / (displayCards.length * 2)}%)`,
                          width:
                            currentIndex === 0
                              ? "0%"
                              : `calc(${(currentIndex / (displayCards.length - 1)) * (100 - 100 / displayCards.length)}%)`,
                        }}
                      />
                      {displayCards.map((card, idx) => {
                        const isActive = idx === currentIndex;
                        const isPassed = idx < currentIndex;
                        const circleClass = isPassed
                          ? "bg-blue-500 border-blue-500 text-white"
                          : isActive
                            ? "bg-white border-blue-500 text-blue-500"
                            : "bg-white border-gray-300 text-gray-400";

                        return (
                          <div
                            key={card.id}
                            className="flex flex-col items-center"
                          >
                            <button
                              onClick={() => navigateCard(idx - currentIndex)}
                              className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${circleClass}`}
                              aria-label={`Zu Schritt ${idx + 1}: ${card.title}`}
                            >
                              <span className="text-xs font-medium">
                                {idx + 1}
                              </span>
                            </button>
                            <div className="mt-3 text-xs text-center transition-opacity duration-200 max-w-24 leading-tight px-1 break-words">
                              <span
                                className={
                                  isActive
                                    ? "text-gray-900"
                                    : "text-gray-600 opacity-80"
                                }
                              >
                                {card.title}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Mobile: Compact Dots */}
                <div className="md:hidden">
                  <div className="flex justify-center items-center space-x-2">
                    {displayCards.map((card, idx) => {
                      const isActive = idx === currentIndex;
                      const isPassed = idx < currentIndex;

                      return (
                        <button
                          key={card.id}
                          onClick={() => navigateCard(idx - currentIndex)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            isActive
                              ? "bg-gray-900 scale-125"
                              : isPassed
                                ? "bg-gray-600"
                                : "bg-gray-300"
                          }`}
                          aria-label={`Zu Schritt ${idx + 1}: ${card.title}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Horizontal Scrolling Layout */}
            <div className="overflow-x-clip">
              <div
                ref={containerRef}
                className={`relative cards-scroll-container ${
                  isStatic
                    ? ""
                    : isClient && screenWidth < 1024
                      ? "cards-scroll-snap cards-touch-optimized cards-no-bounce"
                      : ""
                } ${
                  isLightboxMode
                    ? "" // No padding in lightbox mode - use full width
                    : layout === "video"
                      ? "px-4 md:px-12"
                      : layout === "overlay-text"
                        ? "px-4 md:px-12"
                        : layout === "glass-quote"
                          ? "px-4 md:px-12"
                          : layout === "team-card"
                            ? "px-4 md:px-12"
                            : maxWidth
                              ? "px-8"
                              : "px-4"
                }`}
                style={{ overflow: "visible", overflowX: "clip" }}
              >
                <motion.div
                  className={`flex gap-6 ${isStatic ? "justify-center" : ""}`}
                  style={
                    isStatic
                      ? {}
                      : {
                          x,
                          width:
                            layout === "overlay-text"
                              ? // For overlay-text, calculate total width based on individual card widths
                                `${displayCards.reduce((total, card) => total + getCardWidthForIndex(card, screenWidth) + gap, 0) - gap}px`
                              : // For other layouts, use standard calculation
                                `${(cardWidth + gap) * displayCards.length - gap}px`,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                >
                  {displayCards.map((card, index) => {
                    // Calculate width for overlay-text cards based on individual aspect ratio
                    let cardSpecificWidth = cardWidth;
                    if (layout === "overlay-text") {
                      // Use getCardWidthForIndex to ensure consistency with carousel width calculation
                      cardSpecificWidth = getCardWidthForIndex(
                        card,
                        screenWidth
                      );
                    }

                    return (
                      <motion.div
                        key={card.id}
                        className={`flex-shrink-0 rounded-3xl shadow-lg overflow-hidden ${
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
                          width: cardSpecificWidth,
                          minWidth: cardSpecificWidth,
                          height:
                            layout === "video"
                              ? isClient && screenWidth >= 1024
                                ? // Desktop: Calculate height based on video area with aspect ratio + padding
                                  // Use cardWidth to ensure height scales properly with viewport
                                  cardWidth >= 1536
                                  ? (((1536 * 2) / 3 / 16) * 9 + 30) *
                                    heightMultiplier // 630px standard, 787.5px tall (2/3 split)
                                  : cardWidth >= 1380
                                    ? (((1380 * 2) / 3 / 16) * 9 + 30) *
                                      heightMultiplier // 548px standard, 685px tall (2/3 split)
                                    : cardWidth >= 1280
                                      ? (((1280 * 2) / 3 / 16) * 9 + 30) *
                                        heightMultiplier // 510px standard, 637.5px tall (2/3 split)
                                      : ((992 * 1) / 2 + 30) * heightMultiplier // 526px standard, 657.5px tall at 1024px (1/2 split, 1:1 aspect ratio)
                                : undefined // Mobile: auto height
                              : layout === "text-icon"
                                ? isClient && screenWidth >= 768
                                  ? cardWidth // Square on tablet/desktop (≥768px): height = width (already calculated from viewport)
                                  : 480 * heightMultiplier // Mobile (<768px): 480px standard, 600px tall to fit content nicely
                                : layout === "overlay-text"
                                  ? // Overlay-text: Use fixed heights at each breakpoint (no viewport height dependency)
                                    isClient && screenWidth >= 1536
                                    ? 830 * heightMultiplier
                                    : isClient && screenWidth >= 1280
                                      ? 692 * heightMultiplier
                                      : isClient && screenWidth >= 1024
                                        ? 577 * heightMultiplier
                                        : isClient && screenWidth >= 768
                                          ? 720 * heightMultiplier
                                          : 600 * heightMultiplier
                                  : layout === "glass-quote"
                                    ? // Glass-quote: Fixed heights to avoid weird scaling
                                      (() => {
                                        const viewportHeight =
                                          stableViewportHeight > 0
                                            ? stableViewportHeight
                                            : typeof window !== "undefined"
                                              ? window.innerHeight
                                              : 0;
                                        return isClient && screenWidth >= 1536
                                          ? Math.min(
                                              830 * heightMultiplier,
                                              viewportHeight *
                                                0.75 *
                                                heightMultiplier
                                            )
                                          : isClient && screenWidth >= 1280
                                            ? Math.min(
                                                692 * heightMultiplier,
                                                viewportHeight *
                                                  0.7 *
                                                  heightMultiplier
                                              )
                                            : isClient && screenWidth >= 1024
                                              ? Math.min(
                                                  577 * heightMultiplier,
                                                  viewportHeight *
                                                    0.7 *
                                                    heightMultiplier
                                                )
                                              : isClient && screenWidth >= 768
                                                ? Math.min(
                                                    577 * heightMultiplier,
                                                    viewportHeight *
                                                      0.7 *
                                                      heightMultiplier
                                                  )
                                                : Math.min(
                                                    500 * heightMultiplier,
                                                    viewportHeight *
                                                      0.65 *
                                                      heightMultiplier
                                                  );
                                      })()
                                    : layout === "team-card"
                                      ? // Team-card: Standard height on mobile (600px)
                                        (() => {
                                          const viewportHeight =
                                            stableViewportHeight > 0
                                              ? stableViewportHeight
                                              : typeof window !== "undefined"
                                                ? window.innerHeight
                                                : 0;
                                          return isClient && screenWidth >= 1536
                                            ? Math.min(
                                                830 * heightMultiplier,
                                                viewportHeight *
                                                  0.75 *
                                                  heightMultiplier
                                              )
                                            : isClient && screenWidth >= 1280
                                              ? Math.min(
                                                  692 * heightMultiplier,
                                                  viewportHeight *
                                                    0.7 *
                                                    heightMultiplier
                                                )
                                              : isClient && screenWidth >= 1024
                                                ? Math.min(
                                                    577 * heightMultiplier,
                                                    viewportHeight *
                                                      0.7 *
                                                      heightMultiplier
                                                  )
                                                : isClient && screenWidth >= 768
                                                  ? Math.min(
                                                      720 * heightMultiplier,
                                                      viewportHeight *
                                                        0.75 *
                                                        heightMultiplier
                                                    )
                                                  : Math.min(
                                                      600 * heightMultiplier,
                                                      viewportHeight *
                                                        0.75 *
                                                        heightMultiplier
                                                    );
                                        })()
                                      : isStatic || isResponsive
                                        ? isClient && screenWidth >= 1536
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
                          minHeight:
                            layout === "overlay-text"
                              ? // Overlay-text: Set minHeight to prevent shrinking
                                isClient && screenWidth >= 1536
                                ? 830 * heightMultiplier
                                : isClient && screenWidth >= 1280
                                  ? 692 * heightMultiplier
                                  : isClient && screenWidth >= 1024
                                    ? 577 * heightMultiplier
                                    : isClient && screenWidth >= 768
                                      ? 720 * heightMultiplier
                                      : 600 * heightMultiplier
                              : undefined,
                          backgroundColor: isGlass
                            ? "#121212"
                            : card.backgroundColor,
                          boxShadow: isGlass
                            ? "inset 0 0 20px rgba(255, 255, 255, 0.6), 0 8px 32px rgba(0, 0, 0, 0.3)"
                            : undefined,
                        }}
                        // whileHover={{ scale: 1.02 }} // DISABLED: Hover effect removed
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
                        {layout === "overlay-text" &&
                          renderOverlayTextLayout(card, index)}
                        {layout === "team-card" &&
                          renderTeamCardLayout(card, index)}
                        {layout === "glass-quote" &&
                          (card.buttons &&
                          card.buttons.length > 0 &&
                          !card.image
                            ? renderOverlayTextLayout(card, index)
                            : renderGlassQuoteLayout(card, index))}
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Navigation Arrows - Positioned relative to cards */}
                {!isStatic && (
                  <>
                    {currentIndex > 0 && (
                      <button
                        onClick={() => navigateCard(-1)}
                        disabled={isAnimating}
                        className={`absolute top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20 ${
                          screenWidth < 1024 ? "p-3" : "p-4"
                        }`}
                        style={{
                          left: screenWidth < 1024 ? "16px" : "24px",
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-black"
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
                        className={`absolute top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20 ${
                          screenWidth < 1024 ? "p-3" : "p-4"
                        }`}
                        style={{
                          right: screenWidth < 1024 ? "16px" : "24px",
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-black"
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
            </div>
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
