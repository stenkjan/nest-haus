"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";
import { Button } from "@/components/ui";
import type { ButtonVariant, ButtonSize } from "@/components/ui";
import Link from "next/link";

interface ButtonConfig {
  text: string;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

interface FullWidthImageGridProps {
  maxWidth?: boolean;
  image?: string;
  textBox1?: string;
  textBox2?: string;
  backgroundColor?: "white" | "black";
  showButtons?: boolean;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
}

export default function FullWidthImageGrid({
  maxWidth = true,
  image = IMAGES.function.nestHausModulAnsicht,
  textBox1 = "Warum solltest du dich zwischen Flexibilität, Qualität und Nachhaltigkeit entscheiden, wenn du mit dem ®Hoam System alles haben kannst?  Unsere Architekten und Ingenieure haben ein Haus entwickelt, das maximale Freiheit ohne Kompromisse bietet. Durch intelligente Standardisierung garantieren wir höchste",
  textBox2 = "Qualität, Langlebigkeit und Nachhaltigkeit zum bestmöglichen Preis. Präzisionsgefertigte Module sorgen für Stabilität, Energieeffizienz und ein unvergleichliches Wohngefühl. Dein Zuhause, dein Stil, deine Freiheit. Mit Nest. musst du dich nicht entscheiden, denn du bekommst alles. Heute bauen, morgen wohnen - Nest.",
  backgroundColor = "white",
  showButtons = false,
  primaryButton,
  secondaryButton,
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
      <div className={`${containerClasses} ${backgroundClasses}`}>
        <div className="flex justify-center items-center py-8">
          <div
            className={`animate-pulse ${backgroundColor === "black" ? "bg-gray-700" : "bg-gray-200"
              } rounded-3xl`}
            style={{ width: "100%", height: 400 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${backgroundClasses} `}>
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
            alt="®Hoam Haus Module Concept"
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
        <div className="px-4 md:px-8 mt-8">
          <div
            className={`${isMobile
                ? "flex flex-col space-y-4"
                : "grid grid-cols-2 gap-4 md:gap-6 grid-rows-1"
              } max-w-4xl mx-auto`}
          >
            {/* Text Box 1 */}
            <motion.div
              className={`${isMobile
                  ? "flex items-center justify-center"
                  : "flex items-start justify-start"
                }`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div
                className={`p-secondary ${textColorClasses} ${isMobile ? "text-center" : "text-left"
                  } ${screenWidth > 1700 ? "px-8" : ""}`}
                dangerouslySetInnerHTML={{ __html: textBox1 }}
              />
            </motion.div>

            {/* Text Box 2 */}
            <motion.div
              className={`${isMobile
                  ? "flex items-center justify-center"
                  : "flex items-start justify-start"
                }`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div
                className={`p-secondary ${textColorClasses} ${isMobile ? "text-center" : "text-left"
                  } ${screenWidth > 1700 ? "px-8" : ""}`}
                dangerouslySetInnerHTML={{ __html: textBox2 }}
              />
            </motion.div>
          </div>
        </div>

        {/* Optional Buttons */}
        {showButtons && (primaryButton || secondaryButton) && (
          <motion.div
            className="flex gap-4 mt-12 justify-center w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {primaryButton && (
              <Link href={primaryButton.href}>
                <Button
                  variant={primaryButton.variant || "primary"}
                  size={primaryButton.size || "xs"}
                >
                  {primaryButton.text}
                </Button>
              </Link>
            )}
            {secondaryButton && (
              <Link href={secondaryButton.href}>
                <Button
                  variant={secondaryButton.variant || "landing-secondary"}
                  size={secondaryButton.size || "xs"}
                >
                  {secondaryButton.text}
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
