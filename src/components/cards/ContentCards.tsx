'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, PanInfo } from 'motion/react';
import { HybridBlobImage } from '@/components/images';

interface CardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  image: string;
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
  backgroundColor: string;
}

interface PricingCardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  image: string;
  price: string;
  originalPrice?: string;
  savings?: string;
  extendedDescription?: string;
  mobileExtendedDescription?: string;
  backgroundColor: string;
}

interface ContentCardsProps {
  variant?: 'responsive' | 'static' | 'pricing';
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
  isLightboxMode?: boolean;
  onCardClick?: (cardId: number) => void;
  customData?: CardData[] | StaticCardData[] | PricingCardData[];
}

const contentCardData: CardData[] = [
  {
    id: 1,
    title: "Naturstein - Kanfanar",
    subtitle: "",
    description: "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung. Seine fein strukturierte Oberfläche und die einzigartigen Adern und Fossileinschlüsse machen jedes Element zu einem Unikat.",
    mobileTitle: "Kanfanar Naturstein",
    mobileSubtitle: "",
    mobileDescription: "Massive Kalkstein-Eleganz mit warmen Beigetönen bis sanften Graunuancen. Einzigartige Struktur und Fossileinschlüsse. zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen",
    image: "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 2,
    title: "Modulare Architektur",
    subtitle: "7 Module mit weißen Fassadenplatten",
    description: "Maximale Flexibilität durch unser modulares Bausystem. Die weißen Fassadenplatten sorgen für eine klare, zeitgemäße Optik und optimale Energieeffizienz.",
    mobileTitle: "Modulbau System",
    mobileSubtitle: "7 Module, weiße Fassade",
    mobileDescription: "Flexibles Bausystem mit weißen Fassadenplatten für moderne Optik und Energieeffizienz.",
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 3,
    title: "Ensemble Wohnen",
    subtitle: "3 Gebäude mit Holzlattung",
    description: "Harmonisches Zusammenspiel mehrerer NEST Haus Einheiten. Die Lärchen-Holzlattung schafft eine einheitliche und natürliche Ästhetik für Wohnensembles.",
    mobileTitle: "Wohn-Ensemble",
    mobileSubtitle: "3 Gebäude, Holzlattung", 
    mobileDescription: "Harmonisches Zusammenspiel mit natürlicher Lärchen-Holzlattung für einheitliche Ästhetik.",
    image: "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 4,
    title: "Winterlandschaft",
    subtitle: "Schwarze Trapezblech-Fassade",
    description: "Kraftvolle Optik mit schwarzer Trapezblech-Fassade. Perfekt für alpine Standorte und moderne Architektur, die sich markant von der Umgebung abhebt.",
    mobileTitle: "Winter Design",
    mobileSubtitle: "Schwarze Trapezblech-Fassade",
    mobileDescription: "Kraftvolle schwarze Trapezblech-Optik für alpine Standorte und moderne Architektur.",
    image: "/images/4-NEST-Haus-2-Gebaeude-Schnee-Stirnseite-Schwarze-Trapezblech-Fassade.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 5,
    title: "Wald Integration",
    subtitle: "6 Module mit schwarzen Fassadenplatten",
    description: "Perfekte Integration in die natürliche Umgebung. Die schwarzen Fassadenplatten schaffen einen eleganten Kontrast zur grünen Waldlandschaft.",
    mobileTitle: "Wald Design",
    mobileSubtitle: "6 Module, schwarze Fassade",
    mobileDescription: "Elegante Integration mit schwarzen Fassadenplatten im Kontrast zur Waldlandschaft.",
    image: "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 6,
    title: "Mediterrane Variante",
    subtitle: "4 Module am Meer",
    description: "Stilvolles Wohnen am Wasser. Die Holzlattung aus Lärche harmoniert perfekt mit mediterranen Landschaften und schafft eine entspannte Urlaubsatmosphäre.",
    mobileTitle: "Meer Design",
    mobileSubtitle: "4 Module am Wasser",
    mobileDescription: "Stilvolles Wohnen mit Lärchen-Holzlattung für mediterrane Urlaubsatmosphäre.",
    image: "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4"
  }
];

const staticCardData: StaticCardData[] = [
  {
    id: 1,
    title: "NEST Haus Konfigurator",
    subtitle: "Gestalten Sie Ihr Traumhaus",
    description: "Entdecken Sie die Möglichkeiten des modularen Bauens mit unserem interaktiven Konfigurator. Wählen Sie aus verschiedenen Modulgrößen, Fassadenmaterialien und Ausstattungsoptionen, um Ihr individuelles NEST Haus zu gestalten. Von der ersten Idee bis zur finalen Konfiguration – erleben Sie, wie Ihr Traumhaus Gestalt annimmt.",
    mobileTitle: "NEST Konfigurator",
    mobileSubtitle: "Ihr Traumhaus gestalten",
    mobileDescription: "Interaktiver Konfigurator für modulares Bauen. Wählen Sie Module, Fassaden und Ausstattung für Ihr individuelles NEST Haus.",
    image: "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4"
  }
];

const pricingCardData: PricingCardData[] = [
  {
    id: 1,
    title: "Planungspaket 01",
    subtitle: "Basis",
    description: "-Einreichplanung des Gesamtprojekts \n -Fachberatung und Baubegleitung \n -Bürokratische Unterstützung",
    mobileTitle: "Starter",
    mobileSubtitle: "Einstieg",
    mobileDescription: "Erster Schritt ins modulare Wohnen mit wesentlicher Ausstattung.",
    image: "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    price: "€189,000",
    originalPrice: "€210,000",
    savings: "€21,000",
    backgroundColor: "#F4F4F4",
    extendedDescription: "Das NEST Starter Paket bietet Ihnen den idealen Einstieg in die Welt des modularen Wohnens. Mit durchdachter Grundausstattung und flexiblen Erweiterungsmöglichkeiten schaffen Sie sich Ihr individuelles Zuhause.",
    mobileExtendedDescription: "Idealer Einstieg ins modulare Wohnen mit Grundausstattung und flexiblen Erweiterungen."
  },
  {
    id: 2,
    title: "NEST Comfort",
    subtitle: "Komfortpaket",
    description: "Erweiterte Ausstattung für höchsten Wohnkomfort. Inklusive Premium-Materialien und Smart-Home-Integration.",
    mobileTitle: "Comfort",
    mobileSubtitle: "Komfort",
    mobileDescription: "Erweiterte Ausstattung mit Premium-Materialien und Smart-Home.",
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    price: "€259,000",
    originalPrice: "€290,000",
    savings: "€31,000",
    backgroundColor: "#F4F4F4",
    extendedDescription: "Das NEST Comfort Paket vereint hochwertige Materialien mit intelligenter Haustechnik. Genießen Sie erstklassigen Wohnkomfort mit energieeffizienten Lösungen und modernster Ausstattung.",
    mobileExtendedDescription: "Hochwertige Materialien mit intelligenter Haustechnik für erstklassigen Wohnkomfort."
  },
  {
    id: 3,
    title: "NEST Premium",
    subtitle: "Luxuspaket",
    description: "Luxuriöse Vollausstattung mit exklusiven Materialien und maßgeschneiderten Lösungen für anspruchsvolle Wohnträume.",
    mobileTitle: "Premium",
    mobileSubtitle: "Luxus",
    mobileDescription: "Luxuriöse Vollausstattung mit exklusiven Materialien und maßgeschneiderten Lösungen.",
    image: "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
    price: "€349,000",
    originalPrice: "€390,000",
    savings: "€41,000",
    backgroundColor: "#F4F4F4",
    extendedDescription: "Das NEST Premium Paket erfüllt höchste Ansprüche an Luxus und Individualität. Exklusive Materialien, maßgeschneiderte Lösungen und außergewöhnliche Ausstattungsdetails machen Ihr Zuhause zu etwas Besonderem.",
    mobileExtendedDescription: "Höchste Ansprüche an Luxus mit exklusiven Materialien und maßgeschneiderten Lösungen."
  }
];

// Helper function to extract path from API URL
const getImagePath = (imageUrl: string): string => {
  if (imageUrl.startsWith('/api/images?path=')) {
    const url = new URL(imageUrl, 'http://localhost');
    return decodeURIComponent(url.searchParams.get('path') || '');
  }
  return imageUrl;
};

export default function ContentCards({ 
  variant = 'responsive',
  title = 'Content Cards',
  subtitle = 'Navigate with arrow keys or swipe on mobile',
  maxWidth = true,
  showInstructions = true,
  isLightboxMode = false,
  onCardClick,
  customData
}: ContentCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const isStatic = variant === 'static';
  const isPricing = variant === 'pricing';
  const isResponsive = variant === 'responsive';

  // Use appropriate data source based on variant or custom data
  const cardData = customData || (isPricing 
    ? pricingCardData 
    : isStatic 
      ? staticCardData 
      : contentCardData);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);
  }, []);

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
      } else if (isPricing) {
        // Pricing variant: medium-sized cards, 3 total, no images
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
        // Normal pricing mode - responsive grid layout
        // Use consistent width since flex-wrap handles the layout
        setCardsPerView(3);
        // Match TwoByTwoImageGrid mobile breakpoint (1024px) - use 350px below lg breakpoint
        setCardWidth(width >= 1024 ? 450 : 350);
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
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isStatic, isPricing, isResponsive, isLightboxMode]);

  const gap = 24;
  const maxIndex = Math.max(0, cardData.length - Math.floor(cardsPerView));
  const maxScroll = -(maxIndex * (cardWidth + gap));

  // For static variant, show only the first card
  // For pricing variant, show only the first 3 cards
  const displayCards = isStatic 
    ? cardData.slice(0, 1) 
    : isPricing 
      ? cardData.slice(0, 3)
      : cardData;
  const adjustedMaxIndex = Math.max(0, displayCards.length - Math.floor(cardsPerView));

  // FIXED: Navigation logic to always work properly
  const navigateCard = useCallback((direction: number) => {
    const targetMaxIndex = displayCards.length - Math.floor(cardsPerView);
    const newIndex = Math.max(0, Math.min(targetMaxIndex, currentIndex + direction));
    setCurrentIndex(newIndex);
    const newX = -(newIndex * (cardWidth + gap));
    x.set(newX);
  }, [displayCards.length, cardsPerView, currentIndex, cardWidth, gap, x]);

  // Keyboard navigation - disabled for pricing cards
  useEffect(() => {
    if (isPricing && !isLightboxMode) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        navigateCard(-1);
      } else if (event.key === 'ArrowRight') {
        navigateCard(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateCard, isPricing, isLightboxMode]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    // Calculate which card to snap to based on drag
    const currentX = x.get();
    let targetIndex = Math.round(-currentX / (cardWidth + gap));
    
    const targetMaxIndex = isStatic ? adjustedMaxIndex : maxIndex;
    
    // Adjust based on drag direction and velocity
    if (Math.abs(offset) > 50 || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 500) {
        targetIndex = Math.max(0, targetIndex - 1);
      } else if (offset < 0 || velocity < -500) {
        targetIndex = Math.min(targetMaxIndex, targetIndex + 1);
      }
    }
    
    setCurrentIndex(targetIndex);
    const newX = -(targetIndex * (cardWidth + gap));
    x.set(newX);
  };

  const containerClasses = maxWidth 
    ? "w-full max-w-screen-2xl mx-auto"
    : "w-full";

  // Prevent hydration mismatch by showing loading state until client is ready
  if (!isClient) {
    return (
      <div className={containerClasses}>
        <div className="text-center mb-8">
          {!(isLightboxMode && typeof window !== 'undefined' && window.innerWidth < 768) && (
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-pulse bg-gray-200 rounded-3xl" style={{ width: 320, height: 480 }} />
        </div>
      </div>
    );
  }

  // Helper function to get appropriate text based on screen size
  const getCardText = (card: CardData | StaticCardData | PricingCardData, field: 'title' | 'subtitle' | 'description' | 'extendedDescription') => {
    const isMobileScreen = isClient && screenWidth < 1024;
    
    switch (field) {
      case 'title':
        return isMobileScreen && card.mobileTitle ? card.mobileTitle : card.title;
      case 'subtitle':
        return isMobileScreen && card.mobileSubtitle ? card.mobileSubtitle : card.subtitle;
      case 'description':
        return isMobileScreen && card.mobileDescription ? card.mobileDescription : card.description;
      case 'extendedDescription':
        if ('extendedDescription' in card) {
          return isMobileScreen && card.mobileExtendedDescription ? card.mobileExtendedDescription : card.extendedDescription || '';
        }
        return '';
      default:
        return '';
    }
  };

  return (
    <div className={containerClasses}>
      <div className={`text-center ${isLightboxMode ? 'mb-4' : 'mb-8'}`}>
        {!(isLightboxMode && typeof window !== 'undefined' && window.innerWidth < 768) && (
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        )}
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      {/* Cards Container */}
      <div className={`relative ${isLightboxMode ? 'py-2' : 'py-8'}`}>
        {isPricing && !isLightboxMode ? (
          /* Pricing Cards - Responsive Grid Layout */
          <div className={`flex flex-wrap justify-center items-center gap-6 ${maxWidth ? 'px-8' : 'px-4'}`}>
            {(displayCards as PricingCardData[]).map((card, index) => (
              <motion.div
                key={card.id}
                className="flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
                style={{ 
                  width: cardWidth,
                  height: 300, 
                  backgroundColor: card.backgroundColor 
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={onCardClick ? () => onCardClick(card.id) : undefined}
              >
                {/* Top Section - Text left, Price right */}
                <div className="flex flex-1 min-h-0">
                  {/* Text Content - Left Side */}
                  <div className="flex-1 flex flex-col justify-start items-start text-left px-6 pt-6 pb-1">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {getCardText(card, 'title')}
                      </h3>
                      <h4 className="text-sm font-medium text-gray-700 mb-5">
                        {getCardText(card, 'subtitle')}
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                        {getCardText(card, 'description')}
                      </p>
                    </motion.div>
                  </div>

                  {/* Price Content - Right Side */}
                  <div className="w-24 flex flex-col justify-start items-end text-right px-6 pt-6 pb-1">
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                      className="text-right"
                    >
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {card.price}
                      </div>
                      {card.originalPrice && (
                        <div className="text-xs text-gray-500 line-through mb-1">
                          {card.originalPrice}
                        </div>
                      )}
                      {card.savings && (
                        <div className="text-xs text-green-600 font-medium">
                          Save {card.savings}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Bottom Section - Extended Description (Full Width) */}
                {card.extendedDescription && (
                  <div className="px-6 pt-1 pb-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }}
                    >
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                        {getCardText(card, 'extendedDescription')}
                      </p>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          /* Other Variants - Horizontal Scrolling Layout */
        <div className="overflow-x-clip">
          <div 
            ref={containerRef}
              className={`overflow-x-hidden ${maxWidth ? 'px-8' : 'px-4'} ${isStatic || (isPricing && isLightboxMode) ? '' : 'cursor-grab active:cursor-grabbing'}`}
            style={{ overflow: 'visible' }}
          >
            <motion.div
                className={`flex gap-6 ${isStatic ? 'justify-center' : ''}`}
                style={isStatic ? {} : { 
                  x,
                  width: `${(cardWidth + gap) * displayCards.length - gap}px`
                }}
                drag={isStatic ? false : "x"}
                dragConstraints={isStatic ? undefined : {
                  left: maxScroll,
                  right: 0,
                }}
                dragElastic={isStatic ? undefined : 0.1}
                onDragEnd={isStatic ? undefined : handleDragEnd}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
            >
              {displayCards.map((card, index) => (
                <motion.div
                  key={card.id}
                    className={`flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${(isStatic && isClient && screenWidth >= 1024) || isPricing || (isResponsive && isClient && screenWidth >= 1024) ? 'flex' : ''} ${isPricing && isLightboxMode ? 'flex-col' : ''}`}
                                      style={{ 
                    width: cardWidth, 
                    height: isPricing && isLightboxMode 
                      ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 
                          Math.min(600, window.innerHeight * 0.75) : 
                          Math.min(800, window.innerHeight * 0.7)) // Dynamic height based on viewport
                      : isStatic ? (isClient && screenWidth >= 1600 ? 
                          Math.min(830, typeof window !== 'undefined' ? window.innerHeight * 0.75 : 830) :
                          (isClient && screenWidth >= 1024 ? 
                            Math.min(692, typeof window !== 'undefined' ? window.innerHeight * 0.7 : 692) : 
                            Math.min(720, typeof window !== 'undefined' ? window.innerHeight * 0.75 : 720)))
                      : isResponsive ? (isClient && screenWidth >= 1600 ? 
                          Math.min(830, typeof window !== 'undefined' ? window.innerHeight * 0.75 : 830) :
                          (isClient && screenWidth >= 1024 ? 
                            Math.min(692, typeof window !== 'undefined' ? window.innerHeight * 0.7 : 692) : 
                            Math.min(720, typeof window !== 'undefined' ? window.innerHeight * 0.75 : 720)))
                      : (isClient && screenWidth >= 1600 ? 
                          Math.min(750, typeof window !== 'undefined' ? window.innerHeight * 0.8 : 750) :
                          Math.min(600, typeof window !== 'undefined' ? window.innerHeight * 0.75 : 600)),
                    backgroundColor: card.backgroundColor 
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                    {isPricing && isLightboxMode ? (
                      // Lightbox Pricing layout: Responsive with mobile-friendly sizing
                      <>
                        {/* Top Section - Text left, Price right */}
                        <div className="flex">
                          {/* Text Content - Left Side */}
                          <div className="flex-1 flex flex-col justify-start items-start text-left px-4 md:px-12 pt-4 md:pt-12 pb-2">
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.6 }}
                            >
                              <h3 className="text-lg md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
                                {getCardText(card, 'title')}
                              </h3>
                              <h4 className="text-sm md:text-xl font-medium text-gray-700 mb-5">
                                {getCardText(card, 'subtitle')}
                              </h4>
                              <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                {getCardText(card, 'description')}
                              </p>
                            </motion.div>
                          </div>

                          {/* Price Content - Right Side */}
                          <div className="w-20 md:w-32 flex flex-col justify-start items-end text-right px-4 md:px-12 pt-4 md:pt-12 pb-2">
                            <motion.div
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                              className="text-right"
                            >
                              <div className="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                                {(card as PricingCardData).price}
                              </div>
                              {(card as PricingCardData).originalPrice && (
                                <div className="text-sm md:text-lg text-gray-500 line-through mb-1 md:mb-2">
                                  {(card as PricingCardData).originalPrice}
                                </div>
                              )}
                              {(card as PricingCardData).savings && (
                                <div className="text-xs md:text-sm text-green-600 font-medium">
                                  Save {(card as PricingCardData).savings}
                                </div>
                              )}
                            </motion.div>
                          </div>
                        </div>

                        {/* Bottom Section - Extended Description (Full Width) */}
                        {(card as PricingCardData).extendedDescription && (
                          <div className="px-4 md:px-12 pt-4 md:pt-8 pb-4 md:pb-12">
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }}
                            >
                              <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                                {getCardText(card, 'extendedDescription')}
                              </p>
                            </motion.div>
                          </div>
                        )}
                      </>
                    ) : isResponsive ? (
                      // Responsive layout: Wide on desktop (>=1024px), mobile on tablet/mobile (<1024px)
                      isClient && screenWidth >= 1024 ? (
                        // Desktop: Wide layout (Text left 1/3, Image right 2/3)
                        <>
                          {/* Text Content - Left Third */}
                          <div className="w-1/3 flex flex-col justify-center items-start text-left pt-6 pr-6 pb-6 pl-12">
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.6 }}
                            >
                              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {getCardText(card, 'title')}
                              </h3>
                              <h4 className="text-lg md:text-xl font-medium text-gray-700 mb-5">
                                {getCardText(card, 'subtitle')}
                              </h4>
                              <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                {getCardText(card, 'description')}
                              </p>
                            </motion.div>
                          </div>

                          {/* Image Content - Right Two-Thirds with 1:1 aspect ratio */}
                          <div className="w-2/3 relative overflow-hidden p-[15px] flex items-center justify-end">
                            <motion.div
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                              className="relative rounded-3xl overflow-hidden"
                              style={{ 
                                width: '100%', // Fill available width within padding
                                height: '100%', // Fill available height within padding
                                maxWidth: isClient && screenWidth >= 1600 ? '800px' : '662px', // Larger for ultra-wide screens
                                maxHeight: isClient && screenWidth >= 1600 ? '800px' : '662px', // Larger for ultra-wide screens
                                aspectRatio: '1/1', // Maintain 1:1 square aspect ratio
                              }}
                            >
                              <HybridBlobImage
                                path={getImagePath(card.image)}
                                alt={getCardText(card, 'title')}
                                fill
                                className="object-cover object-center"
                                strategy="client"
                                isInteractive={true}
                                enableCache={true}
                              />
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
                              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {getCardText(card, 'title')}
                              </h3>
                              <h4 className="text-lg md:text-xl font-medium text-gray-700 mb-5">
                                {getCardText(card, 'subtitle')}
                              </h4>
                              <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                {getCardText(card, 'description')}
                              </p>
                            </motion.div>
                          </div>

                          {/* Image Content - Bottom Half */}
                          <div className="h-1/2 relative overflow-hidden p-[15px]">
                            <motion.div
                              initial={{ y: 30, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                              className="relative w-full h-full rounded-3xl overflow-hidden"
                            >
                              <HybridBlobImage
                                path={getImagePath(card.image)}
                                alt={getCardText(card, 'title')}
                                fill
                                className="object-cover object-center"
                                strategy="client"
                                isInteractive={true}
                                enableCache={true}
                              />
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
                          <div className="w-1/3 flex flex-col justify-center items-start text-left pt-6 pr-6 pb-6 pl-12">
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.6 }}
                            >
                              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {getCardText(card, 'title')}
                              </h3>
                              <h4 className="text-lg md:text-xl font-medium text-gray-700 mb-5">
                                {getCardText(card, 'subtitle')}
                              </h4>
                              <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                {getCardText(card, 'description')}
                              </p>
                            </motion.div>
                          </div>

                          {/* Image Content - Right Two-Thirds with 1:1 aspect ratio */}
                          <div className="w-2/3 relative overflow-hidden p-[15px] flex items-center justify-end">
                            <motion.div
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                              className="relative rounded-3xl overflow-hidden"
                              style={{ 
                                width: '100%', // Fill available width within padding
                                height: '100%', // Fill available height within padding
                                maxWidth: isClient && screenWidth >= 1600 ? '800px' : '662px', // Larger for ultra-wide screens
                                maxHeight: isClient && screenWidth >= 1600 ? '800px' : '662px', // Larger for ultra-wide screens
                                aspectRatio: '1/1', // Maintain 1:1 square aspect ratio
                              }}
                            >
                              <HybridBlobImage
                                path={getImagePath(card.image)}
                                alt={getCardText(card, 'title')}
                                fill
                                className="object-cover object-center"
                                strategy="client"
                                isInteractive={true}
                                enableCache={true}
                              />
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
                              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {getCardText(card, 'title')}
                              </h3>
                              <h4 className="text-lg md:text-xl font-medium text-gray-700 mb-5">
                                {getCardText(card, 'subtitle')}
                              </h4>
                              <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                {getCardText(card, 'description')}
                              </p>
                            </motion.div>
                          </div>

                          {/* Image Content - Bottom Half */}
                          <div className="h-1/2 relative overflow-hidden p-[15px]">
                            <motion.div
                              initial={{ y: 30, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                              className="relative w-full h-full rounded-3xl overflow-hidden"
                            >
                              <HybridBlobImage
                                path={getImagePath(card.image)}
                                alt={getCardText(card, 'title')}
                                fill
                                className="object-cover object-center"
                                strategy="client"
                                isInteractive={true}
                                enableCache={true}
                              />
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
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {getCardText(card, 'title')}
                          </h3>
                          <h4 className="text-lg md:text-xl font-medium text-gray-700 mb-5">
                            {getCardText(card, 'subtitle')}
                          </h4>
                          <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                            {getCardText(card, 'description')}
                          </p>
                        </motion.div>
                      </div>

                      {/* Image Content - Bottom Half */}
                      <div className="h-1/2 relative overflow-hidden p-[15px]">
                        <motion.div
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                          className="relative w-full h-full rounded-3xl overflow-hidden"
                        >
                          <HybridBlobImage
                            path={getImagePath(card.image)}
                            alt={getCardText(card, 'title')}
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
        )}

        {/* Navigation Arrows - FIXED: Better visibility conditions */}
        {!isStatic && !(isPricing && !isLightboxMode) && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={() => navigateCard(-1)}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${maxWidth ? '-translate-x-4' : 'translate-x-2'} bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10`}
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {currentIndex < displayCards.length - Math.floor(cardsPerView) && (
              <button
                onClick={() => navigateCard(1)}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${maxWidth ? 'translate-x-4' : '-translate-x-2'} bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10`}
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* FIXED: Progress Indicator - Only one and only when needed */}
      {!isStatic && !(isPricing && !isLightboxMode) && displayCards.length > Math.floor(cardsPerView) && (
        <div className="flex justify-center mt-8">
          <div className="bg-gray-200 rounded-full h-1 w-32">
            <motion.div
              className="bg-gray-900 rounded-full h-1"
              style={{
                width: `${Math.min(100, ((currentIndex + Math.floor(cardsPerView)) / displayCards.length) * 100)}%`
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      {showInstructions && (
        <div className="text-center mt-6 text-sm text-gray-500">
          {isStatic ? (
            <p>Single responsive card • Wide layout on desktop, mobile layout on tablets/phones</p>
          ) : isPricing ? (
            <p>Click on any card to see detailed information</p>
          ) : (
            <>
              <p className="hidden md:block">Use ← → arrow keys to navigate • Drag to scroll</p>
              <p className="md:hidden">Swipe left or right to navigate</p>
              <p className="mt-1">
                Showing {Math.min(Math.ceil(cardsPerView), displayCards.length - currentIndex)} of {displayCards.length} cards
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
} 