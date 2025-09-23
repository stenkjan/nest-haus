"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface ThreeByOneAdaptiveHeightProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  text?: string;
  image?: string;
  imageDescription?: string;
  backgroundColor?: "white" | "black";
}

export default function ThreeByOneAdaptiveHeight({
  title = "3x1 Grid with Adaptive Height",
  subtitle = "Standard grid layout with flexible middle cell height",
  maxWidth = false, // Default to false to avoid width constraints
  text = "<span class='text-white font-medium'>Mit deinem Nest-Haus bestimmst du selbst,</span> <span class='text-gray-400'>wo Fenster und Türen ihren Platz finden sollen. Nach deiner Reservierung setzen wir uns mit dir in Verbindung, um die ideale Platzierung festzulegen. Auf Basis deiner Vorgaben fertigen wir dein Zuhause mit</span> <span class='text-white font-medium'>passgenauen Öffnungen</span> <span class='text-gray-400'>an.</span> <span class='text-white font-medium'>Dort platzieren wir</span> <span class='text-gray-400'>im Anschluss</span> <span class='text-white font-medium'>deine Fenster & Türen.</span>",
  image = IMAGES.function.nestHausFensterTuerenPosition,
  imageDescription = "NEST Haus Fenster und Türen Positionierung Konzept",
  backgroundColor = "black",
}: ThreeByOneAdaptiveHeightProps) {
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
    ? "w-full max-w-screen-2xl mx-auto"
    : "w-full";

  // Determine if we should use mobile layout
  const isMobile = isClient && screenWidth < 1024;

  // Background and text color classes
  const backgroundClasses =
    backgroundColor === "black"
      ? "bg-black text-white"
      : "bg-white text-gray-900";

  const textColorClasses =
    backgroundColor === "black" ? "text-white" : "text-gray-800";

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div
        className={`${containerClasses} ${backgroundClasses} pb-16 md:pb-32`}
      >
        <div className="text-center mb-12 2xl:mb-24">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-2 md:mb-3">
            {title}
          </h1>
          {subtitle && (
            <h3
              className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl ${
                backgroundColor === "black" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {subtitle}
            </h3>
          )}
        </div>
        <div className="flex justify-center items-center py-8">
          <div
            className={`animate-pulse ${
              backgroundColor === "black" ? "bg-gray-700" : "bg-gray-200"
            } rounded-3xl`}
            style={{ width: "100%", height: 400 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${backgroundClasses} pb-16 md:pb-32`}>
      {/* Title and Subtitle */}
      <div className={`${containerClasses}`}>
        <div className="text-center mb-12 2xl:mb-24 px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-2 md:mb-3">
            {title}
          </h1>
          {subtitle && (
            <h3
              className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl ${
                backgroundColor === "black" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {subtitle}
            </h3>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className={`${containerClasses} px-4 md:px-8`}>
        {isMobile ? (
          /* Mobile Layout: Image - Text - Empty (since this component only has one image) */
          <div className="space-y-6">
            {/* First Image */}
            <motion.div
              className="flex justify-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <HybridBlobImage
                path={image}
                alt={imageDescription}
                width={320}
                height={240}
                className="w-4/5 h-auto object-contain rounded-lg"
                sizes="80vw"
                quality={85}
                strategy="client"
                enableCache={true}
                isInteractive={false}
                isAboveFold={true}
                isCritical={true}
              />
            </motion.div>

            {/* Text Section - Always in the middle */}
            <motion.div
              className="flex items-center justify-center"
              style={{ minHeight: "200px" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p
                className={`text-sm md:text-base lg:text-lg 2xl:text-xl ${textColorClasses} leading-relaxed text-center ${
                  screenWidth > 1700 ? "px-8" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </motion.div>

            {/* Placeholder for consistency (empty space where second image would be) */}
            <div className="h-6"></div>
          </div>
        ) : (
          /* Desktop Layout: Grid without height restrictions */
          <div className="grid grid-cols-3 gap-6">
            {/* First Column: Empty with black background - full height */}
            <motion.div
              className="bg-black rounded-lg h-full"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Empty cell with black background */}
            </motion.div>

            {/* Second Column: Image - adaptive height */}
            <motion.div
              className="relative flex items-start justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <HybridBlobImage
                path={image}
                alt={imageDescription}
                width={320}
                height={240}
                className="w-4/5 h-auto object-contain rounded-lg"
                sizes="26vw"
                quality={85}
                strategy="client"
                enableCache={true}
                isInteractive={false}
                isAboveFold={true}
                isCritical={true}
              />
            </motion.div>

            {/* Third Column: Text - full height */}
            <motion.div
              className="rounded-lg p-6 h-full"
              style={{
                display: "grid",
                placeItems: "center",
              }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p
                className={`text-sm md:text-base lg:text-lg 2xl:text-xl ${textColorClasses} leading-relaxed text-left ${
                  screenWidth > 1700 ? "px-8" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
