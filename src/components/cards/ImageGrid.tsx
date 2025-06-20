'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { Dialog } from '@/components/ui/Dialog';

interface GridItem {
  id: number;
  title: string;
  subtitle: string;
  description: string; // max 25 characters
  image: string;
  backgroundColor: string;
  primaryAction: string;
  secondaryAction: string;
}

interface ImageGridProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
}

const gridData: GridItem[] = [
  {
    id: 1,
    title: "Alpine Vision",
    subtitle: "Mountain Design",
    description: "Swiss architecture style",
    image: "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    backgroundColor: "#F8F9FA",
    primaryAction: "View Details",
    secondaryAction: "Configure"
  },
  {
    id: 2,
    title: "Modern Living",
    subtitle: "Contemporary",
    description: "Clean modern aesthetic",
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    backgroundColor: "#F1F3F4",
    primaryAction: "Explore",
    secondaryAction: "Customize"
  },
  {
    id: 3,
    title: "Forest Retreat",
    subtitle: "Natural Harmony",
    description: "Blend with nature",
    image: "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
    backgroundColor: "#F4F4F4",
    primaryAction: "Discover",
    secondaryAction: "Plan"
  },
  {
    id: 4,
    title: "Mediterranean",
    subtitle: "Coastal Style",
    description: "Ocean view elegance",
    image: "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
    backgroundColor: "#F6F8FA",
    primaryAction: "See More",
    secondaryAction: "Design"
  }
];

export default function ImageGrid({ 
  title = 'Image Grid Gallery',
  subtitle = 'Interactive 2x2 layout with hover effects',
  maxWidth = true
}: ImageGridProps) {
  const [selectedCard, setSelectedCard] = useState<GridItem | null>(null);

  const containerClasses = maxWidth 
    ? "w-full max-w-screen-2xl mx-auto p-6"
    : "w-full p-6";

  return (
    <div className={containerClasses}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      {/* 2x2 Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto" style={{ gap: '15px' }}>
        {gridData.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative flex-shrink-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            style={{ 
              aspectRatio: '1/1', // Perfect square
              minHeight: '400px'
            }}
            onClick={() => setSelectedCard(item)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center"
                unoptimized
              />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-between p-6">
              {/* Title and Subtitle - Upper 1/5 */}
              <motion.div
                className="flex-shrink-0"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="p-4 text-center">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    {item.title}
                  </h2>
                  <h4 className="text-base lg:text-lg font-medium text-white">
                    {item.subtitle}
                  </h4>
                </div>
              </motion.div>

              {/* Bottom Section - Lower 1/5 */}
              <motion.div
                className="flex-shrink-0"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
              >
                <div className="p-4">
                  {/* Description Text */}
                  <p className="text-sm text-white mb-4 text-center">
                    {item.description}
                  </p>
                  
                  {/* Button Group */}
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="landing-primary"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Primary action for ${item.title}`);
                      }}
                    >
                      {item.primaryAction}
                    </Button>
                    <Button
                      variant="landing-secondary"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Secondary action for ${item.title}`);
                      }}
                    >
                      {item.secondaryAction}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Individual Card Lightbox */}
      {selectedCard && (
        <Dialog 
          isOpen={!!selectedCard} 
          onClose={() => setSelectedCard(null)}
          transparent={true}
          className="p-0"
        >
          <div className="w-full h-full flex items-center justify-center p-4">
            <motion.div
              className="relative shadow-2xl overflow-hidden max-w-4xl w-full"
              style={{ 
                aspectRatio: '16/10',
                maxHeight: '80vh'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={selectedCard.image}
                  alt={selectedCard.title}
                  fill
                  className="object-cover object-center"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black bg-opacity-30" />
              </div>

              {/* Content Container */}
              <div className="relative h-full flex flex-col justify-between p-8">
                {/* Title and Subtitle */}
                <div className="flex-shrink-0">
                  <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 shadow-lg max-w-md">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedCard.title}
                    </h3>
                    <h4 className="text-xl font-medium text-gray-700 mb-3">
                      {selectedCard.subtitle}
                    </h4>
                    <p className="text-gray-600">
                      {selectedCard.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Section with Buttons */}
                <div className="flex-shrink-0">
                  <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 shadow-lg max-w-md">
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="landing-primary"
                        size="xs"
                        onClick={() => {
                          console.log(`Primary action for ${selectedCard.title}`);
                          setSelectedCard(null);
                        }}
                      >
                        {selectedCard.primaryAction}
                      </Button>
                      <Button
                        variant="landing-secondary"
                        size="xs"
                        onClick={() => {
                          console.log(`Secondary action for ${selectedCard.title}`);
                          setSelectedCard(null);
                        }}
                      >
                        {selectedCard.secondaryAction}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 shadow-lg transition-all duration-200"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </div>
        </Dialog>
      )}

      {/* Instructions */}
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Click on any card to open it in a detailed view • Hover for interactive effects</p>
        <p className="mt-1">2x2 responsive grid layout</p>
      </div>
    </div>
  );
} 