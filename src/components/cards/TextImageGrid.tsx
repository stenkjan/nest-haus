'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HybridBlobImage } from '@/components/images';
import { IMAGES } from '@/constants/images';

interface TextImageGridProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
  text?: string;
  mobileText?: string;
  image1?: string;
  image2?: string;
}

export default function TextImageGrid({ 
  title = 'Text & Image Grid',
  subtitle = 'Responsive 3-column layout with text and images',
  maxWidth = true,
  showInstructions = true,
  text = "Standardisierung für Effizienz und Kostenoptimierung. Höchste Qualität zu einem leistbaren Preis durch intelligente Optimierung – und volle gestalterische Freiheit dort, wo sie wirklich zählt. Alles, was sinnvoll standardisierbar ist, wird perfektioniert: Präzisionsgefertigte Module, effiziente Fertigung und bewährte Konstruktion sichern höchste Qualität.",
  mobileText,
  image1 = IMAGES.function.nestHausModulKonzept,
  image2 = IMAGES.function.nestHausModulLiniengrafik
}: TextImageGridProps) {
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  // 🔍 DEBUG: Log image paths to understand what's being loaded
  useEffect(() => {
    console.log('🖼️ TextImageGrid Debug Info:');
    console.log('  - Image 1 path:', image1);
    console.log('  - Image 2 path:', image2);
    console.log('  - IMAGES.function.nestHausModulKonzept:', IMAGES.function.nestHausModulKonzept);
    console.log('  - IMAGES.function.nestHausModulLiniengrafik:', IMAGES.function.nestHausModulLiniengrafik);
    console.log('');
    console.log('📝 Note: If images show placeholders, check that BLOB_READ_WRITE_TOKEN is set in .env.local');
    
    // Test if we can reach the images API
    if (typeof window !== 'undefined') {
      const testImage1 = async () => {
        try {
          console.log('🔍 Testing image 1 API call...');
          const response = await fetch(`/api/images?path=${encodeURIComponent(image1)}`);
          const result = await response.json();
          console.log('✅ Image 1 API response:', result);
        } catch (error) {
          console.error('❌ Image 1 API error:', error);
        }
      };
      
      const testImage2 = async () => {
        try {
          console.log('🔍 Testing image 2 API call...');
          const response = await fetch(`/api/images?path=${encodeURIComponent(image2)}`);
          const result = await response.json();
          console.log('✅ Image 2 API response:', result);
        } catch (error) {
          console.error('❌ Image 2 API error:', error);
        }
      };
      
      testImage1();
      testImage2();
    }
  }, [image1, image2]);

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

  // Determine if we should use mobile layout (same breakpoint as other components)
  const isMobile = isClient && screenWidth < 1024;

  // Get appropriate text based on screen size
  const displayText = isMobile && mobileText ? mobileText : text;

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className={containerClasses}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-pulse bg-gray-200 rounded-3xl" style={{ width: '100%', height: 400 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      {/* Grid Container */}
      <div className="px-4 md:px-8">
        {isMobile ? (
          /* Mobile Layout: Stack vertically */
          <div className="space-y-6">
            {/* Text Section */}
            <motion.div
              className="flex items-center justify-center"
              style={{ minHeight: '200px' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm md:text-base text-gray-800 leading-relaxed text-center">
                {displayText}
              </p>
            </motion.div>

            {/* Images Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                className="relative overflow-hidden"
                style={{ aspectRatio: '1/1' }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <HybridBlobImage
                  path={image1}
                  alt="NEST Haus Module Schema Concept"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  strategy="client"
                  enableCache={true}
                  isInteractive={false}
                  onError={(error) => {
                    console.error('❌ HybridBlobImage Error (Mobile Image 1):', error);
                    console.error('   - Path:', image1);
                  }}
                  onLoad={() => {
                    console.log('✅ HybridBlobImage Loaded (Mobile Image 1):', image1);
                  }}
                />
              </motion.div>

              <motion.div
                className="relative overflow-hidden"
                style={{ aspectRatio: '1/1' }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <HybridBlobImage
                  path={image2}
                  alt="NEST Haus Module Line Drawing Concept"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  strategy="client"
                  enableCache={true}
                  isInteractive={false}
                  onError={(error) => {
                    console.error('❌ HybridBlobImage Error (Mobile Image 2):', error);
                    console.error('   - Path:', image2);
                  }}
                  onLoad={() => {
                    console.log('✅ HybridBlobImage Loaded (Mobile Image 2):', image2);
                  }}
                />
              </motion.div>
            </div>
          </div>
        ) : (
          /* Desktop Layout: 3 columns in 1 row */
          <div className="grid grid-cols-3 gap-6">
            {/* Text Column */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm lg:text-base text-gray-800 leading-relaxed text-center">
                {displayText}
              </p>
            </motion.div>

                      {/* Image 1 Column */}
          <motion.div
            className="relative overflow-hidden"
            style={{ aspectRatio: '1/1' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <HybridBlobImage
              path={image1}
              alt="NEST Haus Module Schema Concept"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 50vw, 33vw"
              quality={85}
              strategy="client"
              enableCache={true}
              isInteractive={false}
              onError={(error) => {
                console.error('❌ HybridBlobImage Error (Desktop Image 1):', error);
                console.error('   - Path:', image1);
              }}
              onLoad={() => {
                console.log('✅ HybridBlobImage Loaded (Desktop Image 1):', image1);
              }}
            />
          </motion.div>

          {/* Image 2 Column */}
          <motion.div
            className="relative overflow-hidden"
            style={{ aspectRatio: '1/1' }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <HybridBlobImage
              path={image2}
              alt="NEST Haus Module Line Drawing Concept"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 50vw, 33vw"
              quality={85}
              strategy="client"
              enableCache={true}
              isInteractive={false}
              onError={(error) => {
                console.error('❌ HybridBlobImage Error (Desktop Image 2):', error);
                console.error('   - Path:', image2);
              }}
              onLoad={() => {
                console.log('✅ HybridBlobImage Loaded (Desktop Image 2):', image2);
              }}
            />
          </motion.div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className="text-center mt-8 text-sm text-gray-500">
          {isMobile ? (
            <p>Mobile layout: Text above, images below in responsive grid</p>
          ) : (
            <p>Desktop layout: 3 columns with text left, images center and right</p>
          )}
        </div>
      )}
    </div>
  );
} 