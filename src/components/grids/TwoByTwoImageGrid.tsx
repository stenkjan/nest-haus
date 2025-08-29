"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { HybridBlobImage } from "@/components/images";
import { Button } from "@/components/ui";

interface GridItem {
  id: number;
  title: string;
  subtitle: string;
  description: string; // max 25 characters
  image: string;
  backgroundColor: string;
  primaryAction: string;
  secondaryAction: string;
  textColor?: string; // Optional custom text color, defaults to white
}

interface TwoByTwoImageGridProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  customData?: GridItem[];
}

const gridData: GridItem[] = [
  {
    id: 1,
    title: "Alpine Vision",
    subtitle: "Mountain Design",
    description: "Swiss architecture style",
    image:
      "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    backgroundColor: "#F8F9FA",
    primaryAction: "View Details",
    secondaryAction: "Configure",
  },
  {
    id: 2,
    title: "Modern Living",
    subtitle: "Contemporary",
    description: "Clean modern aesthetic",
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    backgroundColor: "#F1F3F4",
    primaryAction: "Explore",
    secondaryAction: "Customize",
  },
  {
    id: 3,
    title: "Forest Retreat",
    subtitle: "Natural Harmony",
    description: "Blend with nature",
    image:
      "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
    backgroundColor: "#F4F4F4",
    primaryAction: "Discover",
    secondaryAction: "Plan",
  },
  {
    id: 4,
    title: "Mediterranean",
    subtitle: "Coastal Style",
    description: "Ocean view elegance",
    image:
      "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
    backgroundColor: "#F6F8FA",
    primaryAction: "See More",
    secondaryAction: "Design",
  },
];

export default function TwoByTwoImageGrid({
  title = "2x2 Image Grid Gallery",
  subtitle = "Interactive 2x2 layout with hover effects",
  maxWidth = true,
  customData,
}: TwoByTwoImageGridProps) {
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
    window.addEventListener("resize", updateScreenWidth);
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  const containerClasses = maxWidth
    ? "w-full max-w-[1700px] mx-auto"
    : "w-full";

  // Use custom data if provided, otherwise use default gridData
  const displayData = customData || gridData;

  // Calculate responsive sizing for ultra-wide screens
  const isUltraWide = isClient && screenWidth >= 1600;
  const gridMinHeight = isUltraWide ? "500px" : "400px";

  // Prevent hydration mismatch by showing loading state until client is ready
  if (!isClient) {
    return (
      <div className={containerClasses}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1700px] mx-auto gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg"
              style={{ aspectRatio: "1/1", minHeight: "400px" }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Header with padding only on mobile */}
      <div
        className={`text-center mb-8 ${
          isClient && screenWidth < 1024 ? "px-4" : ""
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      {/* 2x2 Grid Container - No padding on mobile */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 ${
          maxWidth ? "max-w-[1700px] mx-auto lg:px-4" : "w-full lg:px-4"
        }`}
        style={{ gap: isClient && screenWidth < 1024 ? "8px" : "15px" }}
      >
        {displayData.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative flex-shrink-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            style={{
              aspectRatio: "1/1", // Perfect square
              minHeight: gridMinHeight,
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <HybridBlobImage
                path={item.image}
                alt={item.title}
                fill
                className="object-cover object-center"
                strategy="client"
                isInteractive={true}
                enableCache={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
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
                <div className={`${isUltraWide ? "p-6" : "p-4"} text-center`}>
                  <h2
                    className={`text-lg md:text-xl lg:text-3xl 2xl:text-4xl font-bold mb-1 ${
                      item.textColor || "text-white"
                    }`}
                  >
                    {item.title}
                  </h2>
                  <h4
                    className={`text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl ${
                      item.textColor || "text-white"
                    }`}
                  >
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
                <div className={`${isUltraWide ? "p-6" : "p-4"}`}>
                  {/* Description Text */}
                  <p
                    className={`text-sm md:text-base lg:text-lg 2xl:text-xl mb-4 text-center ${
                      item.textColor || "text-white"
                    }`}
                  >
                    {item.description}
                  </p>

                  {/* Button Group */}
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="landing-primary"
                      size={isUltraWide ? "sm" : "xs"}
                      onClick={() => {
                        console.log(`Primary action for ${item.title}`);
                      }}
                    >
                      {item.primaryAction}
                    </Button>
                    <Button
                      variant={
                        item.id === 2
                          ? "landing-secondary-blue"
                          : "landing-secondary"
                      }
                      size={isUltraWide ? "sm" : "xs"}
                      onClick={() => {
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
    </div>
  );
}
