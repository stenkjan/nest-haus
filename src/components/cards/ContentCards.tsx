'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, PanInfo } from 'motion/react';
import Image from 'next/image';

interface CardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  backgroundColor: string;
}

interface ContentCardsProps {
  variant?: 'normal' | 'wide' | 'extra-wide';
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
}

const cardData: CardData[] = [
  {
    id: 1,
    title: "iPad Pro",
    subtitle: "Supercharged by M2",
    description: "The ultimate iPad experience with the most advanced technology.",
    image: "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 2,
    title: "MacBook Air",
    subtitle: "15-inch",
    description: "Impressively big. Impossibly thin. M2 chip brings speed and efficiency.",
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 3,
    title: "iPhone 15 Pro",
    subtitle: "Titanium",
    description: "Forged in titanium with the powerful A17 Pro chip.",
    image: "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 4,
    title: "Apple Watch",
    subtitle: "Series 9",
    description: "Your essential companion for a healthy life.",
    image: "/images/4-NEST-Haus-2-Gebaeude-Schnee-Stirnseite-Schwarze-Trapezblech-Fassade.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 5,
    title: "AirPods Pro",
    subtitle: "2nd Generation",
    description: "Adaptive Audio automatically tunes the noise control.",
    image: "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 6,
    title: "Mac Studio",
    subtitle: "M2 Ultra",
    description: "Desktop-class performance that fits under most displays.",
    image: "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4"
  },
  {
    id: 7,
    title: "Mac Pro",
    subtitle: "M2 Ultra",
    description: "The most powerful Mac ever built for extreme workloads.",
    image: "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    backgroundColor: "#F4F4F4"
  }
];

export default function ContentCards({ 
  variant = 'normal',
  title = 'Content Cards',
  subtitle = 'Navigate with arrow keys or swipe on mobile',
  maxWidth = true,
  showInstructions = true
}: ContentCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardsPerView, setCardsPerView] = useState(3);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const isWide = variant === 'wide';
  const isExtraWide = variant === 'extra-wide';

  // Calculate responsive card dimensions based on variant
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      
      if (isExtraWide) {
        // Extra-wide variant: 3:1 ratio cards (1/3 text, 2/3 image)
        if (width >= 1280) {
          setCardsPerView(1);
          setCardWidth(1200);
        } else if (width >= 1024) {
          setCardsPerView(1);
          setCardWidth(1000);
        } else if (width >= 768) {
          setCardsPerView(1);
          setCardWidth(720);
        } else {
          setCardsPerView(1);
          setCardWidth(600);
        }
      } else if (isWide) {
        // Wide variant: 2:1 ratio cards
        if (width >= 1280) {
          setCardsPerView(1.3);
          setCardWidth(960);
        } else if (width >= 1024) {
          setCardsPerView(1.1);
          setCardWidth(800);
        } else if (width >= 768) {
          setCardsPerView(1);
          setCardWidth(720);
        } else {
          setCardsPerView(1);
          setCardWidth(600);
        }
      } else {
        // Normal variant: standard cards
        if (width >= 1280) {
          setCardsPerView(3.5);
          setCardWidth(320);
        } else if (width >= 1024) {
          setCardsPerView(2.5);
          setCardWidth(300);
        } else if (width >= 768) {
          setCardsPerView(2);
          setCardWidth(280);
        } else {
          setCardsPerView(1.2);
          setCardWidth(260);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isWide, isExtraWide]);

  const gap = 24;
  const maxIndex = Math.max(0, cardData.length - Math.floor(cardsPerView));
  const maxScroll = -(maxIndex * (cardWidth + gap));

  // For extra-wide variant, show only the first card
  const displayCards = isExtraWide ? cardData.slice(0, 1) : cardData;
  const adjustedMaxIndex = Math.max(0, displayCards.length - Math.floor(cardsPerView));

  const navigateCard = useCallback((direction: number) => {
    const targetMaxIndex = isExtraWide ? adjustedMaxIndex : maxIndex;
    const newIndex = Math.max(0, Math.min(targetMaxIndex, currentIndex + direction));
    setCurrentIndex(newIndex);
    const newX = -(newIndex * (cardWidth + gap));
    x.set(newX);
  }, [isExtraWide, adjustedMaxIndex, maxIndex, currentIndex, cardWidth, gap, x]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        navigateCard(-1);
      } else if (event.key === 'ArrowRight') {
        navigateCard(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateCard]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    // Calculate which card to snap to based on drag
    const currentX = x.get();
    let targetIndex = Math.round(-currentX / (cardWidth + gap));
    
    const targetMaxIndex = isExtraWide ? adjustedMaxIndex : maxIndex;
    
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
    ? "w-full max-w-screen-2xl mx-auto p-6"
    : "w-full p-6";

  return (
    <div className={containerClasses}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      {/* Cards Container */}
      <div className="relative py-8">
        <div 
          ref={containerRef}
          className={`overflow-x-hidden px-8 ${isExtraWide ? '' : 'cursor-grab active:cursor-grabbing'}`}
          style={{ overflow: 'visible' }}
        >
          <motion.div
            className={`flex gap-6 ${isExtraWide ? 'justify-center' : ''}`}
            style={isExtraWide ? {} : { x }}
            drag={isExtraWide ? false : "x"}
            dragConstraints={isExtraWide ? undefined : {
              left: maxScroll,
              right: 0,
            }}
            dragElastic={isExtraWide ? undefined : 0.1}
            onDragEnd={isExtraWide ? undefined : handleDragEnd}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {displayCards.map((card, index) => (
              <motion.div
                key={card.id}
                className={`flex-shrink-0 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${isWide || isExtraWide ? 'flex' : ''}`}
                style={{ width: cardWidth, height: 480, backgroundColor: card.backgroundColor }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {isExtraWide ? (
                  // Extra-wide layout: Text left (1/3), Image right (2/3)
                  <>
                    {/* Text Content - Left Third */}
                    <div className="w-1/3 flex flex-col justify-center items-start text-left p-6">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          {card.title}
                        </h3>
                        <h4 className="text-lg md:text-xl font-medium text-gray-700 mb-3">
                          {card.subtitle}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {card.description}
                        </p>
                      </motion.div>
                    </div>

                    {/* Image Content - Right Two-Thirds */}
                    <div className="w-2/3 relative overflow-hidden p-[15px]">
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                        className="relative w-full h-full rounded-3xl overflow-hidden"
                      >
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover object-center"
                          unoptimized
                        />
                      </motion.div>
                    </div>
                  </>
                ) : isWide ? (
                  // Wide layout: Text left, Image right
                  <>
                    {/* Text Content - Left Half */}
                    <div className="w-1/2 flex flex-col justify-center items-start text-left p-6">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          {card.title}
                        </h3>
                        <h4 className="text-lg md:text-xl font-medium text-gray-700 mb-3">
                          {card.subtitle}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {card.description}
                        </p>
                      </motion.div>
                    </div>

                    {/* Image Content - Right Half */}
                    <div className="w-1/2 relative overflow-hidden p-[15px]">
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                        className="relative w-full h-full rounded-3xl overflow-hidden"
                      >
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover object-center"
                          unoptimized
                        />
                      </motion.div>
                    </div>
                  </>
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
                          {card.title}
                        </h3>
                        <h4 className="text-lg md:text-xl font-medium text-gray-700 mb-3">
                          {card.subtitle}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {card.description}
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
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover object-center"
                          unoptimized
                        />
                      </motion.div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows - Hidden for extra-wide variant */}
        {!isExtraWide && currentIndex > 0 && (
          <button
            onClick={() => navigateCard(-1)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {!isExtraWide && currentIndex + cardsPerView < displayCards.length && (
          <button
            onClick={() => navigateCard(1)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Indicator - Hidden for extra-wide variant */}
      {!isExtraWide && (
        <div className="flex justify-center mt-8">
          <div className="bg-gray-200 rounded-full h-1 w-32">
            <motion.div
              className="bg-gray-900 rounded-full h-1"
              style={{
                width: `${((currentIndex + cardsPerView) / displayCards.length) * 100}%`
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      {showInstructions && (
        <div className="text-center mt-6 text-sm text-gray-500">
          {isExtraWide ? (
            <p>Single extra-wide card with 1/3 text and 2/3 image layout</p>
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