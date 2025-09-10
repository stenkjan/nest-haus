"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, PanInfo, animate } from "motion/react";
import Link from "next/link";
import { HybridBlobImage } from "@/components/images";
import { Button } from "@/components/ui";
import "@/app/konfigurator/components/hide-scrollbar.css";
import "./mobile-scroll-optimizations.css";

interface CardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  image: string;
  overlayImage?: string;
  backgroundColor: string;
}

interface StaticCardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  image: string;
  overlayImage?: string;
  backgroundColor: string;
  buttons?: Array<{
    text: string;
    variant: "primary" | "secondary";
    size: "xs" | "sm" | "md" | "lg";
    link?: string;
    onClick?: () => void;
  }>;
}

interface ContentCardsProps {
  variant?: "responsive" | "static";
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
  isLightboxMode?: boolean;
  onCardClick?: (cardId: number) => void;
  customData?: CardData[] | StaticCardData[];
}

const contentCardData: CardData[] = [
  {
    id: 1,
    title: "Naturstein - Kanfanar",
    subtitle: "",
    description:
      "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung. Seine fein strukturierte Oberfläche und die einzigartigen Adern und Fossileinschlüsse machen jedes Element zu einem Unikat.",
    mobileTitle: "Kanfanar Naturstein",
    mobileSubtitle: "",
    mobileDescription:
      "Massive Kalkstein-Eleganz mit warmen Beigetönen bis sanften Graunuancen. Einzigartige Struktur und Fossileinschlüsse. zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen",
    image:
      "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4",
  },
  {
    id: 2,
    title: "Modulare Architektur",
    subtitle: "7 Module mit weißen Fassadenplatten",
    description:
      "Maximale Flexibilität durch unser modulares Bausystem. Die weißen Fassadenplatten sorgen für eine klare, zeitgemäße Optik und optimale Energieeffizienz.",
    mobileTitle: "Modulbau System",
    mobileSubtitle: "7 Module, weiße Fassade",
    mobileDescription:
      "Flexibles Bausystem mit weißen Fassadenplatten für moderne Optik und Energieeffizienz.",
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    backgroundColor: "#F4F4F4",
  },
  {
    id: 3,
    title: "Ensemble Wohnen",
    subtitle: "3 Gebäude mit Holzlattung",
    description:
      "Harmonisches Zusammenspiel mehrerer NEST Haus Einheiten. Die Lärchen-Holzlattung schafft eine einheitliche und natürliche Ästhetik für Wohnensembles.",
    mobileTitle: "Wohn-Ensemble",
    mobileSubtitle: "3 Gebäude, Holzlattung",
    mobileDescription:
      "Harmonisches Zusammenspiel mit natürlicher Lärchen-Holzlattung für einheitliche Ästhetik.",
    image:
      "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4",
  },
  {
    id: 4,
    title: "Winterlandschaft",
    subtitle: "Schwarze Trapezblech-Fassade",
    description:
      "Kraftvolle Optik mit schwarzer Trapezblech-Fassade. Perfekt für alpine Standorte und moderne Architektur, die sich markant von der Umgebung abhebt.",
    mobileTitle: "Winter Design",
    mobileSubtitle: "Schwarze Trapezblech-Fassade",
    mobileDescription:
      "Kraftvolle schwarze Trapezblech-Optik für alpine Standorte und moderne Architektur.",
    image:
      "/images/4-NEST-Haus-2-Gebaeude-Schnee-Stirnseite-Schwarze-Trapezblech-Fassade.png",
    backgroundColor: "#F4F4F4",
  },
  {
    id: 5,
    title: "Wald Integration",
    subtitle: "6 Module mit schwarzen Fassadenplatten",
    description:
      "Perfekte Integration in die natürliche Umgebung. Die schwarzen Fassadenplatten schaffen einen eleganten Kontrast zur grünen Waldlandschaft.",
    mobileTitle: "Wald Design",
    mobileSubtitle: "6 Module, schwarze Fassade",
    mobileDescription:
      "Elegante Integration mit schwarzen Fassadenplatten im Kontrast zur Waldlandschaft.",
    image:
      "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
    backgroundColor: "#F4F4F4",
  },
  {
    id: 6,
    title: "Mediterrane Variante",
    subtitle: "4 Module am Meer",
    description:
      "Stilvolles Wohnen am Wasser. Die Holzlattung aus Lärche harmoniert perfekt mit mediterranen Landschaften und schafft eine entspannte Urlaubsatmosphäre.",
    mobileTitle: "Meer Design",
    mobileSubtitle: "4 Module am Wasser",
    mobileDescription:
      "Stilvolles Wohnen mit Lärchen-Holzlattung für mediterrane Urlaubsatmosphäre.",
    image:
      "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4",
  },
];

const staticCardData: StaticCardData[] = [
  {
    id: 1,
    title: "NEST Haus Konfigurator",
    subtitle: "Gestalten Sie Ihr Traumhaus",
    description:
      "Entdecken Sie die Möglichkeiten des modularen Bauens mit unserem interaktiven Konfigurator. Wählen Sie aus verschiedenen Modulgrößen, Fassadenmaterialien und Ausstattungsoptionen, um Ihr individuelles NEST Haus zu gestalten. Von der ersten Idee bis zur finalen Konfiguration – erleben Sie, wie Ihr Traumhaus Gestalt annimmt.",
    mobileTitle: "NEST Konfigurator",
    mobileSubtitle: "Ihr Traumhaus gestalten",
    mobileDescription:
      "Interaktiver Konfigurator für modulares Bauen. Wählen Sie Module, Fassaden und Ausstattung für Ihr individuelles NEST Haus.",
    image:
      "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4",
  },
];

// Helper function to extract path from API URL
const getImagePath = (imageUrl: string): string => {
  if (imageUrl.startsWith("/api/images?path=")) {
    const url = new URL(imageUrl, "http://localhost");
    return decodeURIComponent(url.searchParams.get("path") || "");
  }
  return imageUrl;
};

export default function ContentCards({
  variant = "responsive",
  title = "Content Cards",
  subtitle = "Navigate with arrow keys",
  maxWidth = true,
  showInstructions = true,
  isLightboxMode = false,
  onCardClick: _onCardClick,
  customData,
}: ContentCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation state for smooth transitions
  const [isAnimating, setIsAnimating] = useState(false);

  const isStatic = variant === "static";
  const isResponsive = variant === "responsive";

  // Use appropriate data source based on variant or custom data
  const cardData = customData || (isStatic ? staticCardData : contentCardData);

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
  }, [cardWidth, x]);

  // Calculate responsive card dimensions based on variant
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const _height = window.innerHeight; // Available for future use
      setScreenWidth(width);

      if (isStatic) {
        // Static variant: single responsive card - wide layout on desktop, mobile layout on tablet/mobile
        if (width >= 1600) {
          // Ultra-wide screens: Extra large layout
          setCardsPerView(1);
          setCardWidth(1380); // 20% larger than XL
        } else if (width >= 1280) {
          // Desktop XL: Wide layout
          setCardsPerView(1);
          setCardWidth(1152); // Wide card size
        } else if (width >= 1024) {
          // Desktop: Wide layout
          setCardsPerView(1);
          setCardWidth(960); // Wide card size
        } else if (width >= 768) {
          // Tablet: Mobile layout with larger cards
          setCardsPerView(1);
          setCardWidth(336); // Mobile card size (20% larger)
        } else {
          // Mobile: Mobile layout
          setCardsPerView(1);
          setCardWidth(312); // Mobile card size (20% larger)
        }
      } else if (isResponsive) {
        // Responsive variant: Wide layout on desktop (>=1024px), Mobile layout on tablet/mobile (<1024px)
        if (width >= 1600) {
          // Ultra-wide screens: Extra large layout
          setCardsPerView(1.4);
          setCardWidth(1380); // 20% larger than XL
        } else if (width >= 1280) {
          // Desktop XL: Wide layout
          setCardsPerView(1.3);
          setCardWidth(1152); // Wide card size
        } else if (width >= 1024) {
          // Desktop: Wide layout
          setCardsPerView(1.1);
          setCardWidth(960); // Wide card size
        } else if (width >= 768) {
          // Tablet: Mobile layout with larger cards
          setCardsPerView(2);
          setCardWidth(336); // Mobile card size (20% larger)
        } else {
          // Mobile: Mobile layout
          setCardsPerView(1.2);
          setCardWidth(312); // Mobile card size (20% larger)
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
  }, [
    isStatic,
    isResponsive,
    isLightboxMode,
    isClient,
    currentIndex,
    cardWidth,
    gap,
    x,
  ]);

  const maxIndex = Math.max(0, cardData.length - Math.floor(cardsPerView));
  const maxScroll = -(maxIndex * (cardWidth + gap));

  // For static variant, show only the first card
  const displayCards = isStatic ? cardData.slice(0, 1) : cardData;
  const adjustedMaxIndex = Math.max(
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

  // Prevent hydration mismatch by showing loading state until client is ready
  if (!isClient) {
    return (
      <div className={containerClasses}>
        <div className="text-center mb-8">
          {!(
            isLightboxMode &&
            typeof window !== "undefined" &&
            window.innerWidth < 768
          ) && (
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex justify-center items-center py-8">
          <div
            className="animate-pulse bg-gray-200 rounded-3xl"
            style={{ width: 320, height: 480 }}
          />
        </div>
      </div>
    );
  }

  // Helper function to get appropriate text based on screen size
  const getCardText = (
    card: CardData | StaticCardData,
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

  return (
    <div className={containerClasses}>
      <div className={`text-center ${isLightboxMode ? "mb-4" : "mb-8"}`}>
        {!(
          isLightboxMode &&
          typeof window !== "undefined" &&
          window.innerWidth < 768
        ) && <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>}
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      {/* Cards Container */}
      <div className={`relative ${isLightboxMode ? "py-2" : "py-8"}`}>
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
            } ${maxWidth ? "px-8" : "px-4"} ${
              isStatic ? "" : "cursor-grab active:cursor-grabbing"
            }`}
            style={{ overflow: "visible" }}
          >
            <motion.div
              className={`flex gap-6 ${isStatic ? "justify-center" : ""}`}
              style={
                isStatic
                  ? {}
                  : {
                      x,
                      width: `${
                        (cardWidth + gap) * displayCards.length - gap
                      }px`,
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
                    (isStatic && isClient && screenWidth >= 1024) ||
                    (isResponsive && isClient && screenWidth >= 1024)
                      ? "flex"
                      : ""
                  } ${
                    isStatic ? "" : "cards-scroll-snap-item"
                  } cards-mobile-smooth`}
                  style={{
                    width: cardWidth,
                    height: isStatic
                      ? isClient && screenWidth >= 1600
                        ? Math.min(
                            830,
                            typeof window !== "undefined"
                              ? window.innerHeight * 0.75
                              : 830
                          )
                        : isClient && screenWidth >= 1280
                          ? Math.min(
                              692,
                              typeof window !== "undefined"
                                ? window.innerHeight * 0.7
                                : 692
                            )
                          : isClient && screenWidth >= 1024
                            ? Math.min(
                                577, // Proportional height: 960 * (692/1152) = 577
                                typeof window !== "undefined"
                                  ? window.innerHeight * 0.7
                                  : 577
                              )
                            : Math.min(
                                720,
                                typeof window !== "undefined"
                                  ? window.innerHeight * 0.75
                                  : 720
                              )
                      : isResponsive
                        ? isClient && screenWidth >= 1600
                          ? Math.min(
                              830,
                              typeof window !== "undefined"
                                ? window.innerHeight * 0.75
                                : 830
                            )
                          : isClient && screenWidth >= 1280
                            ? Math.min(
                                692,
                                typeof window !== "undefined"
                                  ? window.innerHeight * 0.7
                                  : 692
                              )
                            : isClient && screenWidth >= 1024
                              ? Math.min(
                                  577, // Proportional height: 960 * (692/1152) = 577
                                  typeof window !== "undefined"
                                    ? window.innerHeight * 0.7
                                    : 577
                                )
                              : Math.min(
                                  720,
                                  typeof window !== "undefined"
                                    ? window.innerHeight * 0.75
                                    : 720
                                )
                        : isClient && screenWidth >= 1600
                          ? Math.min(
                              750,
                              typeof window !== "undefined"
                                ? window.innerHeight * 0.8
                                : 750
                            )
                          : Math.min(
                              600,
                              typeof window !== "undefined"
                                ? window.innerHeight * 0.75
                                : 600
                            ),
                    backgroundColor: card.backgroundColor,
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {isResponsive ? (
                    // Responsive layout: Wide on desktop (>=1024px), mobile on tablet/mobile (<1024px)
                    isClient && screenWidth >= 1024 ? (
                      // Desktop: Wide layout (Text left 1/3, Image right 2/3)
                      <>
                        {/* Text Content - Left Third */}
                        <div className="w-1/3 flex flex-col justify-center items-start text-left px-8 py-6">
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                          >
                            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">
                              {getCardText(card, "title")}
                            </h2>
                            <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-gray-700 mb-5">
                              {getCardText(card, "subtitle")}
                            </h3>
                            <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-black leading-relaxed whitespace-pre-line">
                              {getCardText(card, "description")}
                            </p>
                          </motion.div>
                        </div>

                        {/* Image Content - Right Two-Thirds with 1:1 aspect ratio */}
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
                              width: "100%", // Fill available width within padding
                              height: "100%", // Fill available height within padding
                              maxWidth:
                                isClient && screenWidth >= 1600
                                  ? "800px"
                                  : "662px", // Larger for ultra-wide screens
                              maxHeight:
                                isClient && screenWidth >= 1600
                                  ? "800px"
                                  : "662px", // Larger for ultra-wide screens
                              aspectRatio: "1/1", // Maintain 1:1 square aspect ratio
                            }}
                          >
                            <HybridBlobImage
                              path={getImagePath(card.image)}
                              alt={getCardText(card, "title")}
                              fill
                              className="object-cover object-center"
                              strategy="client"
                              isInteractive={true}
                              enableCache={true}
                            />
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
                      // Tablet/Mobile: Mobile layout (Text top, Image bottom)
                      <>
                        {/* Text Content - Top Half */}
                        <div className="h-1/2 flex flex-col justify-center items-center text-center p-6">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                          >
                            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">
                              {getCardText(card, "title")}
                            </h2>
                            <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-gray-700 mb-5">
                              {getCardText(card, "subtitle")}
                            </h3>
                            <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-black leading-relaxed whitespace-pre-line">
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
                            <HybridBlobImage
                              path={getImagePath(card.image)}
                              alt={getCardText(card, "title")}
                              fill
                              className="object-cover object-center"
                              strategy="client"
                              isInteractive={true}
                              enableCache={true}
                            />
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
                    )
                  ) : isStatic ? (
                    // Static layout: Responsive single card - wide on desktop, mobile on tablet/mobile
                    isClient && screenWidth >= 1024 ? (
                      // Desktop: Wide layout (Text left 1/3, Image right 2/3)
                      <>
                        {/* Text Content - Left Third */}
                        <div className="w-1/3 flex flex-col justify-center items-start text-left px-8 py-6">
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                          >
                            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">
                              {getCardText(card, "title")}
                            </h2>
                            <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-gray-700 mb-5">
                              {getCardText(card, "subtitle")}
                            </h3>
                            <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-black leading-relaxed whitespace-pre-line">
                              {getCardText(card, "description")}
                            </p>

                            {/* Buttons for Static Cards - Desktop Layout */}
                            {isStatic && (card as StaticCardData).buttons && (
                              <div className="flex flex-row gap-2 items-start justify-center w-full mt-8">
                                {(card as StaticCardData).buttons!.map(
                                  (button, btnIndex) => {
                                    // Convert standard variants to narrow variants
                                    // For GrundstueckCheckSection (sicherheit preset), make secondary button blue
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
                                        <Button
                                          variant={narrowVariant}
                                          size={button.size}
                                        >
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
                                  }
                                )}
                              </div>
                            )}
                          </motion.div>
                        </div>

                        {/* Image Content - Right Two-Thirds with 1:1 aspect ratio */}
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
                              width: "100%", // Fill available width within padding
                              height: "100%", // Fill available height within padding
                              maxWidth:
                                isClient && screenWidth >= 1600
                                  ? "800px"
                                  : "662px", // Larger for ultra-wide screens
                              maxHeight:
                                isClient && screenWidth >= 1600
                                  ? "800px"
                                  : "662px", // Larger for ultra-wide screens
                              aspectRatio: "1/1", // Maintain 1:1 square aspect ratio
                            }}
                          >
                            <HybridBlobImage
                              path={getImagePath(card.image)}
                              alt={getCardText(card, "title")}
                              fill
                              className="object-cover object-center"
                              strategy="client"
                              isInteractive={true}
                              enableCache={true}
                            />
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
                      // Tablet/Mobile: Mobile layout (Text top, Image bottom)
                      <>
                        {/* Text Content - Top Half */}
                        <div className="h-1/2 flex flex-col justify-center items-center text-center p-6">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                          >
                            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">
                              {getCardText(card, "title")}
                            </h2>
                            <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-gray-700 mb-5">
                              {getCardText(card, "subtitle")}
                            </h3>
                            <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-black leading-relaxed whitespace-pre-line">
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
                            <HybridBlobImage
                              path={getImagePath(card.image)}
                              alt={getCardText(card, "title")}
                              fill
                              className="object-cover object-center"
                              strategy="client"
                              isInteractive={true}
                              enableCache={true}
                            />
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
                    )
                  ) : (
                    // Normal layout: Text top, Image bottom
                    <>
                      {/* Text Content - Top Half */}
                      <div className="h-1/2 flex flex-col justify-center items-center text-center p-6">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
                        >
                          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                            {getCardText(card, "title")}
                          </h3>
                          <h3 className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-medium text-gray-700 mb-5">
                            {getCardText(card, "subtitle")}
                          </h3>
                          <p className="text-sm md:text-base lg:text-lg 2xl:text-xl text-black leading-relaxed whitespace-pre-line">
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
                          <HybridBlobImage
                            path={getImagePath(card.image)}
                            alt={getCardText(card, "title")}
                            fill
                            className="object-cover object-center"
                            strategy="client"
                            isInteractive={true}
                            enableCache={true}
                          />
                        </motion.div>
                      </div>
                    </>
                  )}
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

      {/* Instructions */}
      {showInstructions && (
        <div className="text-center mt-6 text-sm text-gray-500">
          {isStatic ? (
            <p>
              Single responsive card • Wide layout on desktop, mobile layout on
              tablets/phones
            </p>
          ) : (
            <>
              <p className="hidden md:block">Use ← → arrow keys to navigate</p>
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
    </div>
  );
}
