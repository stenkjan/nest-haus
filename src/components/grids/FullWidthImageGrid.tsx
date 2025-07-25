'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HybridBlobImage } from '@/components/images';
import { IMAGES } from '@/constants/images';

interface FullWidthImageGridProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  image?: string;
  textBox1?: string;
  textBox2?: string;
  backgroundColor?: 'white' | 'black';
}

export default function FullWidthImageGrid({ 
  title = 'Full Width Image Grid',
  subtitle = 'Large image with two text boxes below',
  maxWidth = true,
  image = IMAGES.function.nestHausModulAnsicht,
  textBox1 = "Warum solltest du dich zwischen Flexibilität, Qualität und Nachhaltigkeit entscheiden, wenn du mit dem Nest System alles haben kannst?  Unsere Architekten und Ingenieure haben ein Haus entwickelt, das maximale Freiheit ohne Kompromisse bietet. Durch intelligente Standardisierung garantieren wir höchste",
  textBox2 = "Qualität, Langlebigkeit und Nachhaltigkeit zum bestmöglichen Preis. Präzisionsgefertigte Module sorgen für Stabilität, Energieeffizienz und ein unvergleichliches Wohngefühl. Dein Zuhause, dein Stil, deine Freiheit. Mit Nest. musst du dich nicht entscheiden, denn du bekommst alles. Heute bauen, morgen wohnen - Nest.",
  backgroundColor = 'white'
}: FullWidthImageGridProps) {
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);
  }, []);

  // Track screen width for responsive behavior
  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth);
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, []);

  const containerClasses = maxWidth 
    ? "w-full max-w-screen-2xl mx-auto"
    : "w-full";

  // Determine if we should use mobile layout
  const isMobile = isClient && screenWidth < 1024;

  // Background and text color classes
  const backgroundClasses = backgroundColor === 'black' 
    ? 'bg-black text-white' 
    : 'bg-white text-gray-900';
  
  const textColorClasses = backgroundColor === 'black' 
    ? 'text-white' 
    : 'text-gray-800';

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className={`${containerClasses} ${backgroundClasses} py-8`}>
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold mb-3">{title}</h2>
          {subtitle && <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">{subtitle}</p>}
        </div>
        <div className="flex justify-center items-center py-8">
          <div className={`animate-pulse ${backgroundColor === 'black' ? 'bg-gray-700' : 'bg-gray-200'} rounded-3xl`} style={{ width: '100%', height: 400 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${backgroundClasses} py-8`}>
      {/* Title and Subtitle */}
      <div className={`${containerClasses}`}>
        <div className="text-center mb-24 px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold mb-3">{title}</h2>
          {subtitle && <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">{subtitle}</p>}
        </div>
      </div>

      {/* Main Container */}
      <div>
        {/* Large Image at Top - Full Width */}
        <motion.div
          className="relative overflow-hidden w-full h-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <HybridBlobImage
            path={image}
            alt="NEST Haus Module Concept"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain"
            sizes="100vw"
            quality={85}
            strategy="client"
            enableCache={true}
            isInteractive={false}
            isAboveFold={true}
            isCritical={true}
          />
        </motion.div>

        {/* Two Text Boxes Below - Responsive Layout */}
        <div className="px-4 md:px-8 mt-4">
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4 md:gap-6 max-w-4xl mx-auto`}>
            {/* Text Box 1 */}
            <motion.div
              className="flex items-center justify-center"
              style={isMobile ? {} : { minHeight: '200px' }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className={`text-sm md:text-base lg:text-lg 2xl:text-xl ${textColorClasses} leading-relaxed ${isMobile ? 'text-center' : 'text-left'}`}>
                {textBox1}
              </p>
            </motion.div>

            {/* Text Box 2 */}
            <motion.div
              className="flex items-center justify-center"
              style={isMobile ? {} : { minHeight: '200px' }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p className={`text-sm md:text-base lg:text-lg 2xl:text-xl ${textColorClasses} leading-relaxed ${isMobile ? 'text-center' : 'text-left'}`}>
                {textBox2}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 