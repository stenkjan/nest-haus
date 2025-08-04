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
  text = "Mit deinem Nest-Haus bestimmst du selbst, wo Fenster und Türen ihren Platz finden sollen. Nach deiner Reservierung setzen wir uns mit dir in Verbindung, um die ideale Platzierung festzulegen. Auf Basis deiner Vorgaben fertigen wir dein Zuhause mit passgenauen Öffnungen an. Dort platzieren wir im Anschluss deine Fenster & Türen.",
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
      <div className={`${containerClasses} ${backgroundClasses} py-8`}>
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">
              {subtitle}
            </p>
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
    <div className={`${backgroundClasses} py-8`}>
      {/* Title and Subtitle */}
      <div className={`${containerClasses}`}>
        <div className="text-center mb-24 px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className={`${containerClasses} px-4 md:px-8`}>
        {isMobile ? (
          /* Mobile Layout: Stack vertically */
          <div className="space-y-6">
            {/* Image Section */}
            <motion.div
              className="flex justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <HybridBlobImage
                path={image}
                alt={imageDescription}
                width={400}
                height={0}
                className="max-w-full h-auto object-contain rounded-lg"
                sizes="100vw"
                quality={85}
                strategy="client"
                enableCache={true}
                isInteractive={false}
                isAboveFold={true}
                isCritical={true}
              />
            </motion.div>

            {/* Text Section */}
            <motion.div
              className="flex items-center justify-center"
              style={{ minHeight: "200px" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p
                className={`text-sm md:text-base lg:text-lg 2xl:text-xl ${textColorClasses} leading-relaxed text-center`}
              >
                {text}
              </p>
            </motion.div>
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
                width={400}
                height={0}
                className="w-full h-auto object-contain rounded-lg"
                sizes="33vw"
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
                className={`text-sm md:text-base lg:text-lg 2xl:text-xl ${textColorClasses} leading-relaxed text-left`}
              >
                {text}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
