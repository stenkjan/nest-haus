'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HybridBlobImage } from '@/components/images';
import { IMAGES } from '@/constants/images';

interface ImageTextBoxesProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
  image?: string;
  textBox1?: string;
  textBox2?: string;
  backgroundColor?: 'white' | 'black';
}

export default function ImageTextBoxes({ 
  title = 'Image & Text Boxes',
  subtitle = 'Large image with two text boxes below',
  maxWidth = true,
  showInstructions = true,
  image = IMAGES.function.nestHausModulAnsicht,
  textBox1 = "Standardisierung für Effizienz und Kostenoptimierung. Höchste Qualität zu einem leistbaren Preis durch intelligente Optimierung – und volle gestalterische Freiheit dort, wo sie wirklich zählt.",
  textBox2 = "Alles, was sinnvoll standardisierbar ist, wird perfektioniert: Präzisionsgefertigte Module, effiziente Fertigung und bewährte Konstruktion sichern höchste Qualität bei optimalen Kosten.",
  backgroundColor = 'white'
}: ImageTextBoxesProps) {
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && <p className={backgroundColor === 'black' ? 'text-gray-300' : 'text-gray-600'}>{subtitle}</p>}
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
        <div className="text-center mb-8 px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && <p className={backgroundColor === 'black' ? 'text-gray-300' : 'text-gray-600'}>{subtitle}</p>}
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
              <p className={`text-sm md:text-base ${textColorClasses} leading-relaxed ${isMobile ? 'text-center' : 'text-left'}`}>
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
              <p className={`text-sm md:text-base ${textColorClasses} leading-relaxed ${isMobile ? 'text-center' : 'text-left'}`}>
                {textBox2}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className={`${containerClasses}`}>
          <div className={`text-center mt-8 text-sm px-4 md:px-8 ${backgroundColor === 'black' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>Layout: Large image at top, two text boxes below ({isMobile ? 'stacked vertically on mobile' : 'side by side on desktop'})</p>
          </div>
        </div>
      )}
    </div>
  );
} 