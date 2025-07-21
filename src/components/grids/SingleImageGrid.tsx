'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HybridBlobImage } from '@/components/images';

interface SingleImageGridProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  imagePath?: string;
  imageDescription?: string;
  aspectRatio?: string;
  enableLightbox?: boolean;
  backgroundColor?: 'white' | 'black' | 'gray';
}

export default function SingleImageGrid({ 
  title = 'Single Image Display',
  subtitle = 'Centered image with responsive layout',
  maxWidth = true,
  imagePath = '33-NEST-Haus-Planung-Innenausbau-Zeichnen-Fenster-Tueren-Perspektive-Schema',
  imageDescription = 'NEST Haus Grundriss Schema',
  aspectRatio = '16/9',
  enableLightbox = false,
  backgroundColor = 'white'
}: SingleImageGridProps) {
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  // Calculate responsive sizing for ultra-wide screens
  const isUltraWide = isClient && screenWidth >= 1600;
  
  // Background color classes
  const bgColorClasses = {
    white: 'bg-white',
    black: 'bg-black',
    gray: 'bg-gray-50'
  };

  const textColorClasses = {
    white: 'text-gray-900',
    black: 'text-white',
    gray: 'text-gray-900'
  };

  // Prevent hydration mismatch by showing loading state until client is ready
  if (!isClient) {
    return (
      <div className={`${containerClasses} ${bgColorClasses[backgroundColor]} py-12`}>
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${textColorClasses[backgroundColor]} mb-2`}>{title}</h2>
          {subtitle && <p className={textColorClasses[backgroundColor]}>{subtitle}</p>}
        </div>
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="animate-pulse bg-gray-200 rounded-lg w-full" style={{ aspectRatio }} />
        </div>
      </div>
    );
  }

  const handleImageClick = () => {
    if (enableLightbox) {
      setIsLightboxOpen(true);
    }
  };

  return (
    <>
      <div className={`${containerClasses} ${bgColorClasses[backgroundColor]} py-12`}>
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${textColorClasses[backgroundColor]} mb-2`}>{title}</h2>
          {subtitle && <p className={textColorClasses[backgroundColor]}>{subtitle}</p>}
        </div>

        {/* Single Image Container */}
        <div className="max-w-screen-2xl mx-auto px-4">
          <motion.div
            className={`relative w-full overflow-hidden rounded-lg shadow-lg ${enableLightbox ? 'cursor-pointer hover:shadow-xl' : ''} transition-shadow duration-300`}
            style={{ aspectRatio }}
            whileHover={enableLightbox ? { scale: 1.02 } : {}}
            transition={{ duration: 0.2 }}
            onClick={handleImageClick}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <HybridBlobImage
              path={imagePath}
              strategy="auto"
              isAboveFold={false}
              isCritical={false}
              alt={imageDescription}
              className="w-full h-full object-cover object-center"
              sizes={maxWidth ? "(max-width: 768px) 100vw, (max-width: 1536px) 90vw, 1536px" : "100vw"}
              quality={90}
            />
            
            {enableLightbox && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8 text-sm opacity-60">
          <p className={textColorClasses[backgroundColor]}>
            Responsive single image layout{isUltraWide ? ' • Optimized for ultra-wide screens' : ''}
            {enableLightbox ? ' • Click to enlarge' : ''}
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {enableLightbox && isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <HybridBlobImage
              path={imagePath}
              strategy="client"
              isInteractive={true}
              alt={imageDescription}
              className="max-w-full max-h-full object-contain"
              quality={100}
            />
          </div>
        </div>
      )}
    </>
  );
} 