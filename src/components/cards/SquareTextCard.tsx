"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { Button } from "@/components/ui";
import Link from "next/link";
import ClientBlobFile from "@/components/files/ClientBlobFile";
import { FILES } from "@/constants/files";
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
  icon?: React.ReactNode; // Optional icon to display above title
}

interface SquareTextCardProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
  isLightboxMode?: boolean;
  onCardClick?: (cardId: number) => void;
  customData?: SquareTextCardData[];
}

// Default icon component - easily customizable
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

// Helper function to create icons for specific cards - makes it easy to customize later
export const createSquareTextCardIcon = (
  cardId: number,
  customIcon?: React.ReactNode
): React.ReactNode => {
  if (customIcon) return customIcon;

  // Future: Add specific icons per card ID
  // switch (cardId) {
  //   case 1: return <SpecificIcon1 />;
  //   case 2: return <SpecificIcon2 />;
  //   default: return <DefaultSquareTextCardIcon />;
  // }

  return <DefaultSquareTextCardIcon />;
};

// Default data for demonstration
export const defaultSquareTextCardData: SquareTextCardData[] = [
  {
    id: 1,
    title: "1. Vorentwurf",
    subtitle: "Fenster, Türen, Innenwände",
    description:
      "Der Vorentwurf verbindet deine Ideen mit unserer Erfahrung. Was du im Konfigurator auswählst, bleibt die Basis und sorgt für volle Preistransparenz.\n\n Gemeinsam planen wir Fenster, Türen, Innenwände und mögliche Zwischendecken. Alles wird mit der Gemeinde abgestimmt und von uns rechtlich wie statisch geprüft, damit dein Zuhause auf sicheren Grundlagen entsteht.",
    mobileTitle: "Modulbau",
    mobileSubtitle: "Flexibel & Erweiterbar",
    mobileDescription:
      "Bevor wir starten, prüfen wir gemeinsam die Machbarkeit deines Projekts auf deinem Grundstück. \n\n Im Vorentwurfsplan legen wir Fenster, Türen und Innenwände nach deinen Wünschen fest und stimmen diese Planung mit der zuständigen Gemeinde ab. \n\n Dabei prüfen wir für dich, rechtliche Rahmenbedingungen (Bebauungsplan, Widmung, Bauvorschriften), bautechnische Faktoren (Grundstücksgegebenheiten, Anbindung, Erschließung) und statische Machbarkeit (Tragfähigkeit, Fundament, Aufstellmöglichkeiten).",
    backgroundColor: "#F9FAFB",
    icon: <DefaultSquareTextCardIcon />,
  },
  {
    id: 2,
    title: "2. Einreichplan",
    subtitle: "Zwei Wege zum Ziel",
    description:
      "Nach dem Vorentwurf übernehmen wir die Einreichplanung und stimmen alles mit der Gemeinde ab. Du wählst den nächsten Schritt: \n\n sofort starten und dein Nest Haus fix nach sechs Monaten erhalten\n\nwarten, bis der Baubescheid vorliegt und wir danach den Produktionstermin festlegen.",
    mobileTitle: "Einreichplanung",
    mobileSubtitle: "Zwei Wege zum Ziel",
    mobileDescription:
      "Nach dem Vorentwurf erstellen wir die komplette Einreichplanung und reichen diese bei der zuständigen Gemeinde ein. Ab hier hast du die Wahl, wie du mit der Bestellung deines Nest Hauses fortfährst:\n\n Option A – Sofort starten\nDu bestellst dein Nest Haus direkt nach dem Vorentwurfsbescheid. Wir garantieren dir einen fixen Liefertermin innerhalb von 6 Monaten.\n\nOption B – Abwarten auf Baubescheid\nDu wartest den positiven Baubescheid der Gemeinde ab, bevor du die Bestellung freigibst. Erst nach dem Bescheid wird der Produktionstermin fixiert.",
    backgroundColor: "#F9FAFB",
    icon: <DefaultSquareTextCardIcon />,
  },
  {
    id: 3,
    title: "3. Baubescheid",
    subtitle: "Grundstücksvorbereitung",
    description:
      "Sobald dein Baubescheid vorliegt, beginnt die Vorbereitung deines Grundstücks. Dazu gehören alle nötigen Erschließungsarbeiten wie Strom, Wasser, Kanal und Zufahrt. \n\nDie Kosten trägst du als Bauherrin oder Bauherr. Wir begleiten dich mit unserem Netzwerk an erfahrenen Partnerfirmen, damit jeder Schritt reibungslos und effizient umgesetzt wird.",
    mobileTitle: "Positiver Baubescheid",
    mobileSubtitle: "Grundstück & Fundament",
    mobileDescription:
      "Sobald dein Baubescheid vorliegt, startet die Vorbereitung deines Grundstücks. Dazu gehören alle notwendigen Erschließungsarbeiten wie Strom- und Wasseranschluss, Kanal sowie die Zufahrt.\n\nDiese Kosten sind grundstücksabhängig und werden von dir als Bauherr:in getragen. Wir unterstützen dich dabei mit unserem Netzwerk an erfahrenen Partnerfirmen, damit du reibungslos und effizient ans Ziel kommst.\n\nIm nächsten Schritt kümmern wir uns um das Fundament für dein Nest Haus. Planung, Organisation und Umsetzung übernimmt vollständig Nest Haus. Die Kosten dafür sind bereits im Projektpreis enthalten – für dich entstehen keine zusätzlichen Aufwendungen.",
    backgroundColor: "#F9FAFB",
    icon: <DefaultSquareTextCardIcon />,
  },
  {
    id: 4,
    title: "4. Fundament",
    subtitle: "Keine zusätzlichen Kosten",
    description:
      "Ist dein Grundstück vorbereitet, kümmern wir uns um das Fundament deines Nest Hauses. Planung, Organisation und Umsetzung übernehmen wir vollständig. \n\nDie Kosten sind bereits im Gesamtpreis enthalten. So ist die Basis gelegt und dein Zuhause bereit für die Montage.",
    mobileTitle: "Fundament",
    mobileSubtitle: "Die Kosten tragen wir vollständig",
    mobileDescription:
      "Sobald dein Grundstück vorbereitet ist, kümmern wir uns um das Fundament für dein Nest Haus. Planung, Organisation und Umsetzung liegen vollständig in unserer Verantwortung.\n\nDie Kosten für das Fundament sind bereits im Gesamtpreis enthalten. Für dich entstehen keine zusätzlichen Aufwendungen. Damit ist die Basis deines Hauses sicher gelegt und alles für die anschließende Montage vorbereitet.",
    backgroundColor: "#F9FAFB",
    icon: <DefaultSquareTextCardIcon />,
  },
  {
    id: 5,
    title: "5. Lieferung + Aufbau",
    subtitle: "Immer transparent",
    description:
      "Ist das Fundament fertig, bringen wir dein Nest Haus direkt zu dir. Lieferung und Montage erfolgen durch unser Team, sodass dein Zuhause in kürzester Zeit steht. Die Kosten sind klar geregelt:\n\n 8 € pro m² Wohnfläche je Kilometer Entfernung",
    // description:
    // "Ist das Fundament fertig, bringen wir dein Nest Haus direkt zu dir. Lieferung und Montage erfolgen durch unser Team, sodass dein Zuhause in kürzester Zeit steht. Die Kosten sind klar geregelt:\n\nbis 75 km kostenlos\n bis 200 km € 3.000 Pauschale\ndarüber individuelles Angebot.",
    mobileTitle: "Lieferung & Montage",
    mobileSubtitle: "Transparente Lieferkosten",
    mobileDescription:
      "Sobald das Fundament fertiggestellt ist, machen wir dein Nest Haus auf den Weg zu dir. Die Lieferung erfolgt direkt von unserem Produktionsstandort und wird von unserem Team bis ins Detail organisiert. Vor Ort kümmern wir uns um die fachgerechte Montage, sodass dein Haus innerhalb kürzester Zeit steht und beziehbar wird.\n\nDie Lieferkosten sind dabei transparent geregelt:\n\n• Bis 75 km: Kostenlos\n• 75-200 km: € 3.000 Pauschale\n• Über 200 km: Individuelles Angebot\n\nSo weißt du von Anfang an genau, womit du rechnen kannst.",
    backgroundColor: "#F9FAFB",
    icon: <DefaultSquareTextCardIcon />,
  },
  {
    id: 6,
    title: "6. Fertigstellung",
    subtitle: "Gemeinsam stark",
    description:
      "Für die Fertigstellung begleiten wir dich mit erfahrenen Partnerfirmen.\n\nGemeinsam mit Fachbetrieben und klaren Planungspaketen erhältst du einen genauen Ablaufplan und Unterstützung bis zur Übergabe. Dazu zählen Elektro, Sanitär, Heizung, Sicherheit, Brandschutz und mehr.",
    mobileTitle: "Fertigstellung",
    mobileSubtitle: "Mit Partnerunternehmen",
    mobileDescription:
      "Für die Fertigstellung begleiten wir dich mit einem Netzwerk aus erfahrenen Partnerfirmen. Gemeinsam mit diesen Fachbetrieben und anhand klarer Planungspakete erhältst du einen Ablaufplan und die passende Unterstützung bis zur bezugsfertigen Übergabe.\n\nDas beinhaltet under anderem:\n• Elektrotechnik: Stromversorgung, Steckdosen, Leitungen, Beleuchtung, Internet, TV\n• Sanitärtechnik: Warmwasserbereitung, Abwasserleitungen, Regenwasserentsorgung, Armaturen, WC, Dusche, Badewanne\n • Heizungsanlagen, Wärmeverteilung, Klimaanlagen\n• Sicherheit & Brandschutz\n• Energie & Zusatzsysteme: Photovoltaikanlagen, Batteriespeicher\n• Innenwände & Zimmertüren\n• Auswahl und Einbau der Türen\n• Außengestaltung, Terrasse und Garten",
    backgroundColor: "#F9FAFB",
    icon: <DefaultSquareTextCardIcon />,
  },
  {
    id: 7,
    title: "7. Interior Design",
    subtitle: "Planungspaket Pro",
    description:
      "Bei der Interior-Planung geht es darum, wie sich deine Räume später anfühlen und genutzt werden – vom Grundriss über Möbel bis zu Materialien und Farben.\n\nWichtig ist, dass Küche, Licht und Ausstattung nicht nur praktisch, sondern auch atmosphärisch überzeugen und Innen- und Außenbereiche harmonisch zusammenspielen.",
    mobileTitle: "Interior",
    mobileSubtitle: "Planungspaket 03 Pro",
    mobileDescription:
      "Bei der Interior-Planung geht es darum, wie sich Räume später anfühlen und genutzt werden – vom Grundriss über die Möblierung bis hin zu Materialien und Farben. Entscheidend ist, dass Küche, Beleuchtung und Ausstattung nicht nur funktional, sondern auch atmosphärisch überzeugen. Ebenso wichtig ist ein stimmiges Zusammenspiel von Innen- und Außenbereichen, damit dein Zuhause als Ganzes wirkt.\n\nMit dem Planungspaket 03 Pro erhältst du dafür eine ganzheitliche Lösung. Küche, Licht und Möblierung werden funktional durchdacht und gestalterisch integriert, während Farben und Materialien für Harmonie sorgen. So entsteht ein individuelles Interiorkonzept, das dein Nest Haus zu einem Ausdruck deiner Persönlichkeit macht – durchdacht, gestaltet und bereit zum Leben.",
    backgroundColor: "#F9FAFB",
    icon: <DefaultSquareTextCardIcon />,
  },
];

export default function SquareTextCard({
  title = "Square Text Cards",
  subtitle = "Text-only square cards with responsive behavior • Navigate with arrow keys",
  maxWidth = true,
  showInstructions = true,
  isLightboxMode = false,
  onCardClick,
  customData,
}: SquareTextCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [allCardsExpanded, setAllCardsExpanded] = useState(false);
  const [cardHeights, setCardHeights] = useState<Map<number, number>>(
    new Map()
  );
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

  // Pre-measure card heights on mobile for smooth expansion
  useEffect(() => {
    if (!isClient || screenWidth >= 1024) return;

    const preMeasureHeights = () => {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        cardData.forEach((card) => {
          const cardElement = cardRefs.current.get(card.id);
          if (cardElement && !cardHeights.has(card.id)) {
            // Calculate expanded height using clone method for accuracy
            const clone = cardElement.cloneNode(true) as HTMLElement;
            clone.style.position = "absolute";
            clone.style.visibility = "hidden";
            clone.style.height = "auto";
            clone.style.width = cardWidth + "px";
            clone.style.top = "-9999px";

            // Remove line-clamp from clone
            const cloneDescription = clone.querySelector("p");
            if (cloneDescription) {
              cloneDescription.className = cloneDescription.className.replace(
                "line-clamp-6",
                ""
              );
            }

            document.body.appendChild(clone);
            const fullHeight = clone.scrollHeight;
            document.body.removeChild(clone);

            // Add generous padding for iOS and different screen sizes
            const padding =
              isClient && /iPad|iPhone|iPod/.test(navigator.userAgent)
                ? 100
                : 80;
            const calculatedHeight = fullHeight + padding;

            // Ensure minimum height for iOS with more generous padding
            const finalHeight = Math.max(calculatedHeight, 650);
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
  }, [isClient, screenWidth, cardData, cardHeights, cardWidth]);

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
      // Note: Preserve allCardsExpanded state during navigation
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

  // Toggle all cards expansion for mobile with iOS-specific fixes
  const toggleAllCardsExpansion = () => {
    const isMobile = isClient && screenWidth < 1024;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    setAllCardsExpanded((prev) => {
      const isExpanding = !prev;

      // Ensure heights are measured before expansion
      if (isMobile && isExpanding) {
        cardData.forEach((card) => {
          if (!cardHeights.has(card.id)) {
            const cardElement = cardRefs.current.get(card.id);
            if (cardElement) {
              // Immediate measurement using clone method for accuracy
              const clone = cardElement.cloneNode(true) as HTMLElement;
              clone.style.position = "absolute";
              clone.style.visibility = "hidden";
              clone.style.height = "auto";
              clone.style.width = cardWidth + "px";
              clone.style.top = "-9999px";

              // Remove line-clamp from clone
              const cloneDescription = clone.querySelector("p");
              if (cloneDescription) {
                cloneDescription.className = cloneDescription.className.replace(
                  "line-clamp-6",
                  ""
                );
              }

              document.body.appendChild(clone);
              const fullHeight = clone.scrollHeight;
              document.body.removeChild(clone);

              // Add generous padding for iOS and different screen sizes
              const padding = isIOS ? 100 : 80;
              const calculatedHeight = fullHeight + padding;

              const finalHeight = Math.max(calculatedHeight, isIOS ? 680 : 650);
              setCardHeights((prev) => new Map(prev.set(card.id, finalHeight)));
            }
          }
        });
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

      return !prev;
    });
  };

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
        <div className="flex justify-center items-center py-8">
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
      <div className={`text-center ${isLightboxMode ? "mb-4" : "mb-8"}`}>
        {!(
          isLightboxMode &&
          typeof window !== "undefined" &&
          window.innerWidth < 768
        ) && <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>}
        {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
      </div>

      {/* Enhanced Progress Indicator - Moved above cards */}
      {cardData.length > 1 && (
        <div className="mb-8">
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
        className={`relative ${isLightboxMode ? "py-2" : "py-8"} ${
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
                const expandedHeight = cardHeights.get(card.id) || 650; // fallback to reasonable height

                return (
                  <motion.div
                    key={card.id}
                    ref={(el) => {
                      if (el) {
                        cardRefs.current.set(card.id, el);
                      }
                    }}
                    className="flex-shrink-0 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer cards-scroll-snap-item cards-mobile-smooth"
                    style={{
                      width: cardWidth,
                      backgroundColor: card.backgroundColor,
                      // iOS-specific fixes
                      WebkitTransform: "translateZ(0)", // Force hardware acceleration
                      transform: "translateZ(0)",
                      WebkitBackfaceVisibility: "hidden",
                      backfaceVisibility: "hidden",
                    }}
                    animate={{
                      opacity: index === currentIndex ? 1 : 0.4,
                      scale: index === currentIndex ? 1 : 0.95,
                      height:
                        isMobile && allCardsExpanded
                          ? expandedHeight
                          : isClient && screenWidth < 768
                            ? 360 // Mobile collapsed: compact height for title + subtitle + 6 lines of text + padding
                            : cardWidth, // Desktop/Tablet: Square aspect ratio
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      type: "tween",
                    }}
                    onClick={() => {
                      // Prevent action during animation
                      if (isAnimating) return;

                      if (isMobile) {
                        toggleAllCardsExpansion();
                      } else if (onCardClick) {
                        onCardClick(card.id);
                      }
                    }}
                  >
                    {/* Text Content - Full card */}
                    <div
                      className={`h-full flex flex-col ${
                        screenWidth < 768 ? "justify-center" : "justify-start"
                      } items-center px-8 md:px-16 py-16 ${
                        screenWidth < 768 ? "pt-16" : "pt-10 md:pt-20"
                      }`}
                    >
                      {/* Icon, Title and Subtitle - Centered horizontally */}
                      <motion.div
                        className="text-center mb-6"
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
                          className={`square-text-card-title ${
                            card.textColor || "text-gray-900"
                          }`}
                        >
                          {getCardText(card, "title")}
                        </h2>
                        <h3
                          className={`text-base md:text-lg lg:text-xl 2xl:text-2xl font-medium mb-5 ${
                            card.textColor || "text-gray-700"
                          }`}
                        >
                          {getCardText(card, "subtitle")}
                        </h3>
                      </motion.div>

                      {/* Description - Left aligned on desktop, centered on mobile */}
                      <motion.div
                        className={`${
                          screenWidth < 768 ? "text-center" : "text-left"
                        } relative ${
                          screenWidth < 768 ? "" : "flex-1"
                        } overflow-hidden`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                      >
                        <motion.p
                          className={`text-sm md:text-base lg:text-lg 2xl:text-xl leading-relaxed whitespace-pre-line max-w-3xl ${
                            card.textColor || "text-black"
                          } ${
                            isMobile && !allCardsExpanded ? "line-clamp-6" : ""
                          }`}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {getCardText(card, "description")}
                        </motion.p>

                        {/* Blur gradient overlay for mobile when collapsed */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                          style={{
                            background: `linear-gradient(to top, ${card.backgroundColor} 0%, ${card.backgroundColor}f8 15%, ${card.backgroundColor}f0 25%, ${card.backgroundColor}e0 35%, ${card.backgroundColor}cc 45%, ${card.backgroundColor}b3 55%, ${card.backgroundColor}80 65%, ${card.backgroundColor}4d 75%, ${card.backgroundColor}26 85%, transparent 100%)`,
                          }}
                          animate={{
                            opacity: isMobile && !allCardsExpanded ? 1 : 0,
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
                            opacity: isMobile && allCardsExpanded ? 1 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                            delay: isMobile && allCardsExpanded ? 0.3 : 0,
                          }}
                        >
                          <p className="text-xs text-gray-500">
                            drücken zum schließen
                          </p>
                        </motion.div>
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
            className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20 ${
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

        {currentIndex < cardData.length - 1 && (
          <button
            onClick={() => navigateCard(1)}
            disabled={isAnimating}
            className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20 ${
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
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row gap-4 justify-center mt-6 md:mt-16">
        <ClientBlobFile
          path={FILES.anleitung.pdf}
          mode="open"
          onDownloadStart={() => console.log("📄 Opening PDF in new window...")}
          onDownloadComplete={() => console.log("✅ PDF opened successfully")}
          onError={(error) => console.error("❌ PDF open failed:", error)}
        >
          <Button variant="primary" size="xs">
            Anleitung als PDF
          </Button>
        </ClientBlobFile>
        <Link href="/konfigurator">
          <Button variant="landing-secondary-blue" size="xs">
            Jetzt bauen
          </Button>
        </Link>
      </div>

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
