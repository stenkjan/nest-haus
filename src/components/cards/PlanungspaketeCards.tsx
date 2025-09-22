"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { Dialog } from "@/components/ui/Dialog";
import { useIOSViewport, getIOSViewportStyles } from "@/hooks/useIOSViewport";
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
}

export const planungspaketeCardData: PlanungspaketeCardData[] = [
  {
    id: 1,
    title: "Planungspaket 01",
    subtitle: "Basis",
    description:
      "Inkl.\nEinreichplanung des Gesamtprojekts\nFachberatung und Baubegleitung\nBürokratische Unterstützung",
    mobileTitle: "Planungspaket 01",
    mobileSubtitle: "Basis",
    mobileDescription:
      "Inkl.\nEinreichplanung des Gesamtprojekts\nFachberatung und Baubegleitung\nBürokratische Unterstützung",
    image:
      "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    price: "€10.900,00",
    backgroundColor: "#F4F4F4",
    grayWord: "Basis",
    extendedDescription:
      "Nachdem dein Vorentwurf abgeschlossen ist, erstellen wir die vollständige und rechtlich korrekte Planung für dein zuständiges Bauamt. Im Planungspaket Basis bereiten wir alle notwendigen Unterlagen auf, die für den offiziellen Einreichprozess erforderlich sind. Dazu gehören die präzise Darstellung des geplanten Gebäudes auf deinem Grundstück, die Prüfung der örtlichen Bauvorschriften sowie die Berücksichtigung aller relevanten Abstände, Höhen und Flächen. \n \n Darüber hinaus stimmen wir technische Aspekte wie Stromversorgung, Wasser- und Kanalanschlüsse, Heizungsanschlussmöglichkeiten und Zufahrtswege sorgfältig ab. Auch Anforderungen zur Erschließung, zu Brandschutz oder zu besonderen Auflagen der Behörde werden berücksichtigt und in die Planung integriert. \n \n Mit dem Planungspaket Basis erhältst du eine genehmigungsfähige Einreichplanung und die Sicherheit, dass wir dich während des gesamten Bauprozesses begleiten und unterstützen, von den ersten Behördenschritten bis hin zur finalen Umsetzung deines Nest Hauses.",
    mobileExtendedDescription:
      "Nachdem dein Vorentwurf abgeschlossen ist, erstellen wir die vollständige und rechtlich korrekte Planung für dein zuständiges Bauamt. Im Planungspaket Basis bereiten wir alle notwendigen Unterlagen auf, die für den offiziellen Einreichprozess erforderlich sind. Dazu gehören die präzise Darstellung des geplanten Gebäudes auf deinem Grundstück, die Prüfung der örtlichen Bauvorschriften sowie die Berücksichtigung aller relevanten Abstände, Höhen und Flächen. \n \n Darüber hinaus stimmen wir technische Aspekte wie Stromversorgung, Wasser- und Kanalanschlüsse, Heizungsanschlussmöglichkeiten und Zufahrtswege sorgfältig ab. Auch Anforderungen zur Erschließung, zu Brandschutz oder zu besonderen Auflagen der Behörde werden berücksichtigt und in die Planung integriert. \n \n Mit dem Planungspaket Basis erhältst du eine genehmigungsfähige Einreichplanung und die Sicherheit, dass wir dich während des gesamten Bauprozesses begleiten und unterstützen, von den ersten Behördenschritten bis hin zur finalen Umsetzung deines Nest Hauses.",
  },
  {
    id: 2,
    title: "Planungspaket 02",
    subtitle: "Plus",
    description:
      "Inkl.\nPlanungspaket Basis (Einreichplanung) \n Haustechnik-Planung \n Ausführungsplanung Innenausbau",
    mobileTitle: "Planungspaket 02",
    mobileSubtitle: "Plus",
    mobileDescription:
      "Inkl.\nPlanungspaket Basis (Einreichplanung) \n Haustechnik-Planung \n Ausführungsplanung Innenausbau",
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    price: "€16.900,00",
    backgroundColor: "#F4F4F4",
    grayWord: "Plus",
    extendedDescription:
      "Du möchtest Unterstützung bei der technischen Innenausbauplanung? Dann ist unser Plus-Paket genau das Richtige für dich. Es umfasst alle Leistungen des Basispakets, von der Einreichplanung bis zur Detailplanung und ergänzt sie um die komplette Haustechnikplanung: Elektrik, Sanitär, Abwasser und Innenausbau. \n \n Warum das sinnvoll ist? Weil du damit alle Leitungen, Anschlüsse und Einbauten frühzeitig mitplanst. Das spart Zeit, vermeidet Abstimmungsprobleme auf der Baustelle und sorgt dafür, dass dein Haus technisch von Anfang an durchdacht ist. \n \n Aber klar, wenn du die technische Planung lieber selbst übernehmen oder mit einem Partner deines Vertrauens umsetzen möchtest, ist das genauso möglich. Unser Nest-System ist so konzipiert, dass du flexibel bleibst und auch diesen Weg einfach gehen kannst. \n \n Das Plus-Paket ist unsere Lösung für dich, wenn du maximale Planungssicherheit willst. Alles aus einer Hand, alles bestens vorbereitet.",
    mobileExtendedDescription:
      "Du möchtest Unterstützung bei der technischen Innenausbauplanung? Dann ist unser Plus-Paket genau das Richtige für dich. Es umfasst alle Leistungen des Basispakets, von der Einreichplanung bis zur Detailplanung und ergänzt sie um die komplette Haustechnikplanung: Elektrik, Sanitär, Abwasser und Innenausbau. \n \n Warum das sinnvoll ist? Weil du damit alle Leitungen, Anschlüsse und Einbauten frühzeitig mitplanst. Das spart Zeit, vermeidet Abstimmungsprobleme auf der Baustelle und sorgt dafür, dass dein Haus technisch von Anfang an durchdacht ist. \n \n Aber klar, wenn du die technische Planung lieber selbst übernehmen oder mit einem Partner deines Vertrauens umsetzen möchtest, ist das genauso möglich. Unser Nest-System ist so konzipiert, dass du flexibel bleibst und auch diesen Weg einfach gehen kannst. \n \n Das Plus-Paket ist unsere Lösung für dich, wenn du maximale Planungssicherheit willst. Alles aus einer Hand, alles bestens vorbereitet.",
  },
  {
    id: 3,
    title: "Planungspaket 03",
    subtitle: "Pro",
    description:
      "Inkl.\nPlanungspaket Plus (HKLS Planung) \n Belauchtungskonzept, Möblierungsplanung, Farb- und Materialkonzept",
    mobileTitle: "Planungspaket 03",
    mobileSubtitle: "Pro",
    mobileDescription:
      "Inkl.\nPlanungspaket Plus (HKLS Planung) \n Belauchtungskonzept, Möblierungsplanung, Farb- und Materialkonzept",
    image:
      "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
    price: "€21.900,00",
    backgroundColor: "#F4F4F4",
    grayWord: "Pro",
    extendedDescription:
      "Du willst nicht nur planen, du willst gestalten. Mit Gefühl für Raum, Stil und Atmosphäre. \n \n Das Pro-Paket ergänzt die technischen und baurechtlichen Grundlagen der ersten beiden Pakete um eine umfassende gestalterische Ebene. Gemeinsam entwickeln wir ein Interiorkonzept, das deine Wünsche in Raumgefühl, Möblierung und Stil widerspiegelt. Die Küche wird funktional durchdacht und gestalterisch in das Gesamtkonzept eingebettet – alle Anschlüsse und Geräte exakt geplant. Ein stimmungsvolles Licht- und Beleuchtungskonzept bringt Leben in deine Räume, während harmonisch abgestimmte Farben und Materialien innen wie außen für ein rundes Gesamtbild sorgen. Auch der Garten und die Außenräume werden in die Planung miteinbezogen, sodass dein neues Zuhause nicht nur innen, sondern auch im Außenbereich überzeugt. \n \nMit dem Pro-Paket wird dein Nest-Haus zum Ausdruck deiner Persönlichkeit. Durchdacht, gestaltet und bereit zum Leben.",
    mobileExtendedDescription:
      "Du willst nicht nur planen, du willst gestalten. Mit Gefühl für Raum, Stil und Atmosphäre. \n \n Das Pro-Paket ergänzt die technischen und baurechtlichen Grundlagen der ersten beiden Pakete um eine umfassende gestalterische Ebene. Gemeinsam entwickeln wir ein Interiorkonzept, das deine Wünsche in Raumgefühl, Möblierung und Stil widerspiegelt. Die Küche wird funktional durchdacht und gestalterisch in das Gesamtkonzept eingebettet – alle Anschlüsse und Geräte exakt geplant. Ein stimmungsvolles Licht- und Beleuchtungskonzept bringt Leben in deine Räume, während harmonisch abgestimmte Farben und Materialien innen wie außen für ein rundes Gesamtbild sorgen. Auch der Garten und die Außenräume werden in die Planung miteinbezogen, sodass dein neues Zuhause nicht nur innen, sondern auch im Außenbereich überzeugt. \n \nMit dem Pro-Paket wird dein Nest-Haus zum Ausdruck deiner Persönlichkeit. Durchdacht, gestaltet und bereit zum Leben.",
  },
];

export default function PlanungspaketeCards({
  title = "Planungspakete Cards",
  subtitle = "Click on any card to see detailed information",
  maxWidth = true,
  showInstructions = true,
  isLightboxMode = false,
  enableBuiltInLightbox = true, // Default to true for built-in lightbox
  onCardClick,
  customData,
}: PlanungspaketeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [cardHeights, setCardHeights] = useState<Map<number, number>>(
    new Map()
  );
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
        // Match TwoByTwoImageGrid mobile breakpoint (1024px) - use 350px below lg breakpoint
        setCardWidth(width >= 1024 ? 450 : 350);
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

  // Pre-measure card heights on mobile for smooth expansion
  useEffect(() => {
    if (!isClient || screenWidth >= 1024) return;

    const preMeasureHeights = () => {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        cardData.forEach((card) => {
          const cardElement = cardRefs.current.get(card.id);
          if (cardElement && !cardHeights.has(card.id)) {
            // Calculate expanded height based on actual content
            const topSection = cardElement.querySelector(
              ".h-56"
            ) as HTMLElement;
            const bottomSection = cardElement.querySelector(
              '[class*="px-6 pt-2 pb-6"]'
            ) as HTMLElement;

            let calculatedHeight = 360; // base height

            if (topSection && bottomSection) {
              // Get the extended description text element
              const extendedTextElement = bottomSection.querySelector(
                "p"
              ) as HTMLElement;

              if (extendedTextElement) {
                // Temporarily remove line-clamp to measure full height
                const originalClasses = extendedTextElement.className;
                extendedTextElement.className = originalClasses.replace(
                  "line-clamp-4",
                  ""
                );

                // Measure the full content height
                const topHeight = topSection.scrollHeight;
                const bottomHeight = bottomSection.scrollHeight;
                calculatedHeight = topHeight + bottomHeight + 48; // Extra padding for iOS

                // Restore original classes
                extendedTextElement.className = originalClasses;
              } else {
                // Fallback measurement
                const topHeight = topSection.scrollHeight;
                const bottomHeight = bottomSection.scrollHeight;
                calculatedHeight = topHeight + bottomHeight + 48;
              }
            }

            // Ensure minimum height for iOS with more generous padding
            const finalHeight = Math.max(calculatedHeight, 520);
            setCardHeights((prev) => new Map(prev.set(card.id, finalHeight)));
          }
        });
      });
    };

    // Multiple attempts to ensure measurement
    const timer1 = setTimeout(preMeasureHeights, 100);
    const timer2 = setTimeout(preMeasureHeights, 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isClient, screenWidth, cardData, cardHeights]);

  // Calculate and store card height when expanded
  const _measureCardHeight = useCallback((cardId: number) => {
    const cardElement = cardRefs.current.get(cardId);
    if (cardElement) {
      // Get sections for precise measurement
      const topSection = cardElement.querySelector(".h-56") as HTMLElement;
      const bottomSection = cardElement.querySelector(
        '[class*="px-6 pt-2 pb-6"]'
      ) as HTMLElement;

      let calculatedHeight = 360;

      if (topSection && bottomSection) {
        // Get the extended description text element
        const extendedTextElement = bottomSection.querySelector(
          "p"
        ) as HTMLElement;

        if (extendedTextElement) {
          // Temporarily remove line-clamp to measure full height
          const originalClasses = extendedTextElement.className;
          extendedTextElement.className = originalClasses.replace(
            "line-clamp-4",
            ""
          );

          // Measure the full content height
          const topHeight = topSection.scrollHeight;
          const bottomHeight = bottomSection.scrollHeight;
          calculatedHeight = topHeight + bottomHeight + 48; // Extra padding

          // Restore original classes
          extendedTextElement.className = originalClasses;
        } else {
          // Fallback measurement
          const topHeight = topSection.scrollHeight;
          const bottomHeight = bottomSection.scrollHeight;
          calculatedHeight = topHeight + bottomHeight + 48;
        }
      }

      const finalHeight = Math.max(calculatedHeight, 520);
      setCardHeights((prev) => new Map(prev.set(cardId, finalHeight)));
      return finalHeight;
    }
    return 520; // fallback height
  }, []);

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

  const containerClasses = maxWidth
    ? "w-full max-w-screen-2xl mx-auto"
    : "w-full";

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
              title && (
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
              )}
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
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
      const isExpanding = !newSet.has(cardId);

      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);

        // Ensure height is measured before expansion
        if (isMobile && isExpanding && !cardHeights.has(cardId)) {
          const cardElement = cardRefs.current.get(cardId);
          if (cardElement) {
            // Immediate measurement for iOS with full content calculation
            const topSection = cardElement.querySelector(
              ".h-56"
            ) as HTMLElement;
            const bottomSection = cardElement.querySelector(
              '[class*="px-6 pt-2 pb-6"]'
            ) as HTMLElement;

            let calculatedHeight = 360;
            if (topSection && bottomSection) {
              // Get the extended description text element
              const extendedTextElement = bottomSection.querySelector(
                "p"
              ) as HTMLElement;

              if (extendedTextElement) {
                // Temporarily remove line-clamp to measure full height
                const originalClasses = extendedTextElement.className;
                extendedTextElement.className = originalClasses.replace(
                  "line-clamp-4",
                  ""
                );

                // Measure the full content height
                const topHeight = topSection.scrollHeight;
                const bottomHeight = bottomSection.scrollHeight;
                calculatedHeight = topHeight + bottomHeight + 48; // Extra padding

                // Restore original classes
                extendedTextElement.className = originalClasses;
              } else {
                // Fallback measurement
                const topHeight = topSection.scrollHeight;
                const bottomHeight = bottomSection.scrollHeight;
                calculatedHeight = topHeight + bottomHeight + 48;
              }
            }

            const finalHeight = Math.max(calculatedHeight, isIOS ? 560 : 520);
            setCardHeights((prev) => new Map(prev.set(cardId, finalHeight)));
          }
        }
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
            title && (
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
                {title}
              </h1>
            )}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}

      {/* Cards Container */}
      <div className={`relative ${isLightboxMode ? "py-2" : "py-4 md:py-8"}`}>
        {!isLightboxMode ? (
          /* Normal Mode - Responsive Grid Layout */
          <div
            className={`flex flex-wrap justify-center items-center gap-6 ${
              maxWidth ? "px-8" : "px-4"
            }`}
          >
            {displayCards.map((card, index) => {
              const isExpanded = expandedCards.has(card.id);
              const isMobile = isClient && screenWidth < 1024;
              const expandedHeight = cardHeights.get(card.id) || 500; // fallback to reasonable height

              return (
                <motion.div
                  key={card.id}
                  ref={(el) => {
                    if (el) {
                      cardRefs.current.set(card.id, el);
                    }
                  }}
                  className="flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
                  style={{
                    width: cardWidth,
                    height:
                      isMobile && isExpanded
                        ? expandedHeight
                        : isMobile
                          ? 360
                          : 280,
                    backgroundColor: card.backgroundColor,
                    // iOS-specific fixes
                    WebkitTransform: "translateZ(0)", // Force hardware acceleration
                    transform: "translateZ(0)",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                  }}
                  animate={
                    isMobile
                      ? {
                          height: isExpanded ? expandedHeight : 360,
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "tween",
                  }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    if (isMobile) {
                      toggleCardExpansion(card.id);
                    } else if (enableBuiltInLightbox && !isLightboxMode) {
                      setLightboxOpen(true);
                    } else if (onCardClick) {
                      onCardClick(card.id);
                    }
                  }}
                >
                  {/* Top Section - EXPANDED HEIGHT */}
                  <div
                    className={`${
                      isMobile ? "h-56 min-h-56" : ""
                    } px-6 pt-8 pb-6 overflow-hidden`}
                  >
                    {/* Header Row - Title/Subtitle left, Price right */}
                    <div className="flex mb-5">
                      {/* Title/Subtitle - Left Side */}
                      <div className="flex-1">
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
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
                      <div className="w-24 flex flex-col justify-start items-end text-right">
                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            delay: index * 0.1 + 0.2,
                            duration: 0.6,
                          }}
                          className="text-right"
                        >
                          <div className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1">
                            {card.price}
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Description - Full Width */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                    >
                      <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-black leading-relaxed whitespace-pre-line overflow-hidden">
                        {getCardText(card, "description")}
                      </p>
                    </motion.div>
                  </div>

                  {/* Bottom Section - Extended Description (Mobile Only) - FLEXIBLE HEIGHT */}
                  {card.extendedDescription && isMobile && (
                    <div className="px-6 pt-2 pb-6 flex-1 overflow-hidden relative">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }}
                        className="h-full"
                      >
                        <motion.p
                          className={`text-sm md:text-base lg:text-lg text-black leading-relaxed whitespace-pre-line ${
                            !isExpanded ? "line-clamp-4" : ""
                          }`}
                          animate={{
                            opacity: isExpanded ? 1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {getCardText(card, "extendedDescription")}
                        </motion.p>

                        {/* Blur gradient overlay for mobile when collapsed */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                          style={{
                            background: `linear-gradient(to top, ${card.backgroundColor} 0%, ${card.backgroundColor}f8 15%, ${card.backgroundColor}f0 25%, ${card.backgroundColor}e0 35%, ${card.backgroundColor}cc 45%, ${card.backgroundColor}b3 55%, ${card.backgroundColor}80 65%, ${card.backgroundColor}4d 75%, ${card.backgroundColor}26 85%, transparent 100%)`,
                          }}
                          animate={{
                            opacity: !isExpanded ? 1 : 0,
                          }}
                          transition={{
                            duration: 0.5,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        />

                        {/* Close instruction text for expanded cards */}
                        <motion.div
                          className="absolute bottom-2 left-0 right-0 text-center pointer-events-none"
                          animate={{
                            opacity: isExpanded ? 1 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                            delay: isExpanded ? 0.3 : 0,
                          }}
                        >
                          <p className="text-xs text-gray-500">
                            drücken zum schließen
                          </p>
                        </motion.div>
                      </motion.div>
                    </div>
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
                        <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-black leading-relaxed whitespace-pre-line">
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
                          <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-black leading-relaxed whitespace-pre-line">
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
