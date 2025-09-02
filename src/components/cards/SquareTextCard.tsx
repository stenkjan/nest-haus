"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, PanInfo, animate } from "motion/react";
import "@/app/konfigurator/components/hide-scrollbar.css";
import "./mobile-scroll-optimizations.css";

interface SquareTextCardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  backgroundColor: string;
  textColor?: string; // Optional custom text color, defaults to gray-900
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

// Default data for demonstration
export const defaultSquareTextCardData: SquareTextCardData[] = [
  {
    id: 1,
    title: "1. Vorentwurf",
    subtitle: "Fenster, Türen, Innenwände",
    description:
      "Bevor wir starten, prüfen wir gemeinsam die Machbarkeit deines Projekts auf deinem Grundstück. \n\n Im Vorentwurfsplan legen wir Fenster, Türen und Innenwände nach deinen Wünschen fest und stimmen diese Planung mit der zuständigen Gemeinde ab. \n\n Dabei prüfen wir für dich, rechtliche Rahmenbedingungen (Bebauungsplan, Widmung, Bauvorschriften), bautechnische Faktoren (Grundstücksgegebenheiten, Anbindung, Erschließung) und statische Machbarkeit (Tragfähigkeit, Fundament, Aufstellmöglichkeiten).",
    mobileTitle: "Modulbau",
    mobileSubtitle: "Flexibel & Erweiterbar",
    mobileDescription:
      "Bevor wir starten, prüfen wir gemeinsam die Machbarkeit deines Projekts auf deinem Grundstück. \n\n Im Vorentwurfsplan legen wir Fenster, Türen und Innenwände nach deinen Wünschen fest und stimmen diese Planung mit der zuständigen Gemeinde ab. \n\n Dabei prüfen wir für dich, rechtliche Rahmenbedingungen (Bebauungsplan, Widmung, Bauvorschriften), bautechnische Faktoren (Grundstücksgegebenheiten, Anbindung, Erschließung) und statische Machbarkeit (Tragfähigkeit, Fundament, Aufstellmöglichkeiten).",
    backgroundColor: "#F9FAFB",
  },
  {
    id: 2,
    title: "2. Einreichplanung",
    subtitle: "Zwei Wege zum Ziel",
    description:
      "Nach dem Vorentwurf erstellen wir die komplette Einreichplanung und reichen diese bei der zuständigen Gemeinde ein. Ab hier hast du die Wahl, wie du mit der Bestellung deines Nest Hauses fortfährst:\n\n Option A – Sofort starten\nDu bestellst dein Nest Haus direkt nach dem Vorentwurfsbescheid. Wir garantieren dir einen fixen Liefertermin innerhalb von 6 Monaten.\n\nOption B – Abwarten auf Baubescheid\nDu wartest den positiven Baubescheid der Gemeinde ab, bevor du die Bestellung freigibst. Erst nach dem Bescheid wird der Produktionstermin fixiert.",
    mobileTitle: "Einreichplanung",
    mobileSubtitle: "Zwei Wege zum Ziel",
    mobileDescription:
      "Nach dem Vorentwurf erstellen wir die komplette Einreichplanung und reichen diese bei der zuständigen Gemeinde ein. Ab hier hast du die Wahl, wie du mit der Bestellung deines Nest Hauses fortfährst:\n\n Option A – Sofort starten\nDu bestellst dein Nest Haus direkt nach dem Vorentwurfsbescheid. Wir garantieren dir einen fixen Liefertermin innerhalb von 6 Monaten.\n\nOption B – Abwarten auf Baubescheid\nDu wartest den positiven Baubescheid der Gemeinde ab, bevor du die Bestellung freigibst. Erst nach dem Bescheid wird der Produktionstermin fixiert.",
    backgroundColor: "#F9FAFB",
  },
  {
    id: 3,
    title: "3. Positiver Baubescheid",
    subtitle: "Grundstücksvorbereitung & Fundament",
    description:
      "Sobald dein Baubescheid vorliegt, startet die Vorbereitung deines Grundstücks. Dazu gehören alle notwendigen Erschließungsarbeiten wie Strom- und Wasseranschluss, Kanal sowie die Zufahrt.\n\nDiese Kosten sind grundstücksabhängig und werden von dir als Bauherr:in getragen. Wir unterstützen dich dabei mit unserem Netzwerk an erfahrenen Partnerfirmen, damit du reibungslos und effizient ans Ziel kommst.\n\nIm nächsten Schritt kümmern wir uns um das Fundament für dein Nest Haus. Planung, Organisation und Umsetzung übernimmt vollständig Nest Haus. Die Kosten dafür sind bereits im Projektpreis enthalten – für dich entstehen keine zusätzlichen Aufwendungen.",
    mobileTitle: "Positiver Baubescheid",
    mobileSubtitle: "Grundstück & Fundament",
    mobileDescription:
      "Sobald dein Baubescheid vorliegt, startet die Vorbereitung deines Grundstücks. Dazu gehören alle notwendigen Erschließungsarbeiten wie Strom- und Wasseranschluss, Kanal sowie die Zufahrt.\n\nDiese Kosten sind grundstücksabhängig und werden von dir als Bauherr:in getragen. Wir unterstützen dich dabei mit unserem Netzwerk an erfahrenen Partnerfirmen, damit du reibungslos und effizient ans Ziel kommst.\n\nIm nächsten Schritt kümmern wir uns um das Fundament für dein Nest Haus. Planung, Organisation und Umsetzung übernimmt vollständig Nest Haus. Die Kosten dafür sind bereits im Projektpreis enthalten – für dich entstehen keine zusätzlichen Aufwendungen.",
    backgroundColor: "#F9FAFB",
  },
  {
    id: 4,
    title: "4. Fundament",
    subtitle: "Die Kosten tragen wir vollständig",
    description:
      "Sobald dein Grundstück vorbereitet ist, kümmern wir uns um das Fundament für dein Nest Haus. Planung, Organisation und Umsetzung liegen vollständig in unserer Verantwortung.\n\nDie Kosten für das Fundament sind bereits im Gesamtpreis enthalten. Für dich entstehen keine zusätzlichen Aufwendungen. Damit ist die Basis deines Hauses sicher gelegt und alles für die anschließende Montage vorbereitet.",
    mobileTitle: "Fundament",
    mobileSubtitle: "Die Kosten tragen wir vollständig",
    mobileDescription:
      "Sobald dein Grundstück vorbereitet ist, kümmern wir uns um das Fundament für dein Nest Haus. Planung, Organisation und Umsetzung liegen vollständig in unserer Verantwortung.\n\nDie Kosten für das Fundament sind bereits im Gesamtpreis enthalten. Für dich entstehen keine zusätzlichen Aufwendungen. Damit ist die Basis deines Hauses sicher gelegt und alles für die anschließende Montage vorbereitet.",
    backgroundColor: "#F9FAFB",
  },
  {
    id: 5,
    title: "5. Lieferung & Montage",
    subtitle: "Transparente Lieferkosten",
    description:
      "Sobald das Fundament fertiggestellt ist, machen wir dein Nest Haus auf den Weg zu dir. Die Lieferung erfolgt direkt von unserem Produktionsstandort und wird von unserem Team bis ins Detail organisiert. Vor Ort kümmern wir uns um die fachgerechte Montage, sodass dein Haus innerhalb kürzester Zeit steht und beziehbar wird.\n\nDie Lieferkosten sind dabei transparent geregelt:\n\n• Bis 75 km: Kostenlos\n• 75-200 km: € 3.000 Pauschale\n• Über 200 km: Individuelles Angebot\n\nSo weißt du von Anfang an genau, womit du rechnen kannst.",
    mobileTitle: "Lieferung & Montage",
    mobileSubtitle: "Transparente Lieferkosten",
    mobileDescription:
      "Sobald das Fundament fertiggestellt ist, machen wir dein Nest Haus auf den Weg zu dir. Die Lieferung erfolgt direkt von unserem Produktionsstandort und wird von unserem Team bis ins Detail organisiert. Vor Ort kümmern wir uns um die fachgerechte Montage, sodass dein Haus innerhalb kürzester Zeit steht und beziehbar wird.\n\nDie Lieferkosten sind dabei transparent geregelt:\n\n• Bis 75 km: Kostenlos\n• 75-200 km: € 3.000 Pauschale\n• Über 200 km: Individuelles Angebot\n\nSo weißt du von Anfang an genau, womit du rechnen kannst.",
    backgroundColor: "#F9FAFB",
  },
  {
    id: 6,
    title: "6. Fertigstellung",
    subtitle: "Mit Partnerunternehmen",
    description:
      "Für die Fertigstellung begleiten wir dich mit einem Netzwerk aus erfahrenen Partnerfirmen. Gemeinsam mit diesen Fachbetrieben und anhand klarer Planungspakete erhältst du einen Ablaufplan und die passende Unterstützung bis zur bezugsfertigen Übergabe.\n\nDas beinhaltet under anderem:\n• Elektrotechnik: Stromversorgung, Steckdosen, Leitungen, Beleuchtung, Internet, TV\n• Sanitärtechnik: Warmwasserbereitung, Abwasserleitungen, Regenwasserentsorgung, Armaturen, WC, Dusche, Badewanne\n • Heizungsanlagen, Wärmeverteilung, Klimaanlagen\n• Sicherheit & Brandschutz\n• Energie & Zusatzsysteme: Photovoltaikanlagen, Batteriespeicher\n• Innenwände & Zimmertüren\n• Auswahl und Einbau der Türen\n• Außengestaltung, Terrasse und Garten",
    mobileTitle: "Fertigstellung",
    mobileSubtitle: "Mit Partnerunternehmen",
    mobileDescription:
      "Für die Fertigstellung begleiten wir dich mit einem Netzwerk aus erfahrenen Partnerfirmen. Gemeinsam mit diesen Fachbetrieben und anhand klarer Planungspakete erhältst du einen Ablaufplan und die passende Unterstützung bis zur bezugsfertigen Übergabe.\n\nDas beinhaltet under anderem:\n• Elektrotechnik: Stromversorgung, Steckdosen, Leitungen, Beleuchtung, Internet, TV\n• Sanitärtechnik: Warmwasserbereitung, Abwasserleitungen, Regenwasserentsorgung, Armaturen, WC, Dusche, Badewanne\n • Heizungsanlagen, Wärmeverteilung, Klimaanlagen\n• Sicherheit & Brandschutz\n• Energie & Zusatzsysteme: Photovoltaikanlagen, Batteriespeicher\n• Innenwände & Zimmertüren\n• Auswahl und Einbau der Türen\n• Außengestaltung, Terrasse und Garten",
    backgroundColor: "#F9FAFB",
  },
  {
    id: 7,
    title: "7. Interior",
    subtitle: "Planungspaket 03 Pro",
    description:
      "Bei der Interior-Planung geht es darum, wie sich Räume später anfühlen und genutzt werden – vom Grundriss über die Möblierung bis hin zu Materialien und Farben. Entscheidend ist, dass Küche, Beleuchtung und Ausstattung nicht nur funktional, sondern auch atmosphärisch überzeugen. Ebenso wichtig ist ein stimmiges Zusammenspiel von Innen- und Außenbereichen, damit dein Zuhause als Ganzes wirkt.\n\nMit dem Planungspaket 03 Pro erhältst du dafür eine ganzheitliche Lösung. Küche, Licht und Möblierung werden funktional durchdacht und gestalterisch integriert, während Farben und Materialien für Harmonie sorgen. So entsteht ein individuelles Interiorkonzept, das dein Nest Haus zu einem Ausdruck deiner Persönlichkeit macht – durchdacht, gestaltet und bereit zum Leben.",
    mobileTitle: "Interior",
    mobileSubtitle: "Planungspaket 03 Pro",
    mobileDescription:
      "Bei der Interior-Planung geht es darum, wie sich Räume später anfühlen und genutzt werden – vom Grundriss über die Möblierung bis hin zu Materialien und Farben. Entscheidend ist, dass Küche, Beleuchtung und Ausstattung nicht nur funktional, sondern auch atmosphärisch überzeugen. Ebenso wichtig ist ein stimmiges Zusammenspiel von Innen- und Außenbereichen, damit dein Zuhause als Ganzes wirkt.\n\nMit dem Planungspaket 03 Pro erhältst du dafür eine ganzheitliche Lösung. Küche, Licht und Möblierung werden funktional durchdacht und gestalterisch integriert, während Farben und Materialien für Harmonie sorgen. So entsteht ein individuelles Interiorkonzept, das dein Nest Haus zu einem Ausdruck deiner Persönlichkeit macht – durchdacht, gestaltet und bereit zum Leben.",
    backgroundColor: "#F9FAFB",
  },
];

export default function SquareTextCard({
  title = "Square Text Cards",
  subtitle = "Text-only square cards with responsive behavior • Navigate with arrow keys or swipe",
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
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use custom data if provided, otherwise use default
  const cardData = customData || defaultSquareTextCardData;

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);
  }, []);

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
        setCardWidth(312); // Mobile card size (matches other components)
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isLightboxMode]);

  const gap = 24;
  const maxIndex = Math.max(0, cardData.length - Math.floor(cardsPerView));
  const maxScroll = -(maxIndex * (cardWidth + gap));

  // Navigation logic
  const navigateCard = useCallback(
    (direction: number) => {
      const newIndex = Math.max(
        0,
        Math.min(maxIndex, currentIndex + direction)
      );
      setCurrentIndex(newIndex);
      const newX = -(newIndex * (cardWidth + gap));
      x.set(newX);
    },
    [maxIndex, currentIndex, cardWidth, gap, x]
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
    let targetIndex = Math.round(-currentX / (cardWidth + gap));

    // Mobile vs Desktop behavior
    const isMobile = screenWidth < 1024; // Changed threshold to 1024px

    if (isMobile) {
      // Mobile: Enhanced snapping with visual feedback
      const offsetThreshold = 30;
      const velocityThreshold = 300;

      // Better snapping logic: only change cards with intentional movement
      // Start with current card as default
      targetIndex = currentIndex;

      // Only change cards if there's significant drag or velocity
      if (
        Math.abs(offset) > offsetThreshold ||
        Math.abs(velocity) > velocityThreshold
      ) {
        if (offset > 0 || velocity > velocityThreshold) {
          // Dragging/flicking right (previous card)
          targetIndex = Math.max(0, currentIndex - 1);
        } else if (offset < 0 || velocity < -velocityThreshold) {
          // Dragging/flicking left (next card)
          targetIndex = Math.min(maxIndex, currentIndex + 1);
        }
      } else {
        // Small movements: check if we're more than 70% to next card
        const currentX = x.get();
        const currentCardPosition = -(currentIndex * (cardWidth + gap));
        const distanceFromCurrent = Math.abs(currentX - currentCardPosition);
        const cardThreshold = (cardWidth + gap) * 0.7; // 70% of card width

        if (distanceFromCurrent > cardThreshold) {
          // We're far enough to snap to the next logical card
          if (currentX < currentCardPosition) {
            // Scrolled significantly left, go to next card
            targetIndex = Math.min(maxIndex, currentIndex + 1);
          } else {
            // Scrolled significantly right, go to previous card
            targetIndex = Math.max(0, currentIndex - 1);
          }
        }
      }

      // Ensure target index is within bounds
      targetIndex = Math.max(0, Math.min(maxIndex, targetIndex));

      // Animate with visual feedback for direction
      setCurrentIndex(targetIndex);
      const newX = -(targetIndex * (cardWidth + gap));

      // Add visual feedback animation with directional easing
      // First, add a small bounce in the opposite direction for visual feedback
      const direction = targetIndex > currentIndex ? -1 : 1;
      const bounceDistance = 15; // Small bounce distance

      animate(x, x.get() + direction * bounceDistance, {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.15,
      }).then(() => {
        // Then animate to the final position
        animate(x, newX, {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          duration: 0.5,
        });
      });
    } else {
      // Desktop: Free scrolling, no snapping
      // Let the drag settle naturally without forced snapping
      const naturalX = currentX + velocity * 0.1; // Small momentum continuation
      const boundedX = Math.max(
        -(maxIndex * (cardWidth + gap)),
        Math.min(0, naturalX)
      );

      // Update current index based on final position
      const finalIndex = Math.round(-boundedX / (cardWidth + gap));
      setCurrentIndex(Math.max(0, Math.min(maxIndex, finalIndex)));

      // Smooth deceleration without snapping
      animate(x, boundedX, {
        type: "spring",
        stiffness: 150,
        damping: 20,
        mass: 1.0,
      });
    }
  };

  const containerClasses = maxWidth
    ? "w-full max-w-screen-2xl mx-auto"
    : "w-full";

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

  // Prevent hydration mismatch by showing loading state until client is ready
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
              width:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 312
                  : 640,
              height:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 312 * 1.75 // Mobile: taller aspect ratio with mobile width (25% increase)
                  : 640, // Desktop: square
            }}
          />
        </div>
      </div>
    );
  }

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
              isClient && screenWidth < 1024
                ? "cards-scroll-snap cards-touch-optimized cards-no-bounce"
                : ""
            } ${maxWidth ? "px-8" : "px-4"} cursor-grab active:cursor-grabbing`}
            style={{ overflow: "visible" }}
          >
            <motion.div
              className="flex gap-6"
              style={{
                x,
                width: `${(cardWidth + gap) * cardData.length - gap}px`,
              }}
              drag="x"
              dragConstraints={{
                left: maxScroll,
                right: 0,
              }}
              dragElastic={0.05}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
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
                  className="flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer cards-scroll-snap-item cards-mobile-smooth"
                  style={{
                    width: cardWidth,
                    height:
                      isClient && screenWidth < 768
                        ? cardWidth * 1.75 // Mobile: 1.75:1 aspect ratio (25% taller than 1.4 for more text space)
                        : cardWidth, // Desktop/Tablet: Square aspect ratio
                    backgroundColor: card.backgroundColor,
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onCardClick?.(card.id)}
                >
                  {/* Text Content - Full card */}
                  <div className="h-full flex flex-col justify-start items-center px-8 md:px-16 py-16 pt-10 md:pt-20">
                    {/* Title and Subtitle - Centered horizontally */}
                    <motion.div
                      className="text-center mb-6"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <h3
                        className={`text-lg md:text-xl lg:text-3xl 2xl:text-4xl font-bold mb-1 ${
                          card.textColor || "text-gray-900"
                        }`}
                      >
                        {getCardText(card, "title")}
                      </h3>
                      <h4
                        className={`text-sm md:text-xl font-medium mb-5 ${
                          card.textColor || "text-gray-700"
                        }`}
                      >
                        {getCardText(card, "subtitle")}
                      </h4>
                    </motion.div>

                    {/* Description - Left aligned on desktop, centered on mobile */}
                    <motion.div
                      className={`${
                        screenWidth < 768 ? "text-center" : "text-left"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                    >
                      <p
                        className={`text-sm md:text-base lg:text-lg 2xl:text-xl leading-relaxed whitespace-pre-line max-w-3xl ${
                          card.textColor || "text-black"
                        }`}
                      >
                        {getCardText(card, "description")}
                      </p>
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
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${
              maxWidth ? "-translate-x-4" : "translate-x-2"
            } bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10`}
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

        {currentIndex < cardData.length - Math.floor(cardsPerView) && (
          <button
            onClick={() => navigateCard(1)}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${
              maxWidth ? "translate-x-4" : "-translate-x-2"
            } bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10`}
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

      {/* Enhanced Progress Indicator */}
      {cardData.length > 1 && (
        <div className="mt-8">
          {/* Current Card Title */}
          <div className="text-center mb-6">
            <motion.h3
              key={currentIndex}
              className="text-lg md:text-xl font-semibold text-gray-900 mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {getCardText(cardData[currentIndex], "title")}
            </motion.h3>
            <p className="text-sm text-gray-500">
              {currentIndex + 1} von {cardData.length}
            </p>
          </div>

          {/* Desktop: Horizontal Progress Steps */}
          <div className="hidden md:block">
            <div className="relative max-w-2xl mx-auto">
              {/* Background Line */}
              <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200" />
              {/* Progress Line */}
              <div
                className="absolute left-0 top-3 h-0.5 bg-gray-900 transition-all duration-300"
                style={{
                  width: `${
                    (currentIndex / Math.max(1, cardData.length - 1)) * 100
                  }%`,
                }}
              />
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
                    ? "bg-gray-900 border-gray-900"
                    : isActive
                    ? "bg-white border-gray-900 ring-2 ring-gray-900 ring-offset-2"
                    : "bg-white border-gray-300";

                  return (
                    <div key={card.id} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          setCurrentIndex(idx);
                          const newX = -(idx * (cardWidth + gap));
                          x.set(newX);
                        }}
                        className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${circleClass}`}
                        aria-label={`Zu Schritt ${idx + 1}: ${getCardText(
                          card,
                          "title"
                        )}`}
                      >
                        {isPassed && (
                          <span className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </button>
                      {/* Step Number - only show on hover or active */}
                      <div
                        className={`mt-2 text-xs text-center transition-opacity duration-200 ${
                          isActive
                            ? "opacity-100 text-gray-900 font-medium"
                            : "opacity-60 text-gray-500"
                        }`}
                      >
                        {idx + 1}
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
              {cardData.map((card, idx) => {
                const isActive = idx === currentIndex;
                const isPassed = idx < currentIndex;

                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      const newX = -(idx * (cardWidth + gap));
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

      {/* Instructions */}
      {showInstructions && (
        <div className="text-center mt-6 text-sm text-gray-500">
          <p className="hidden md:block">
            Use ← → arrow keys to navigate • Drag to scroll
          </p>
          <p className="md:hidden">Swipe left or right to navigate</p>
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
