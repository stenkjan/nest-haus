"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HybridBlobImage } from "@/components/images";
import { Button } from "@/components/ui";
import { IMAGES } from "@/constants/images";

interface ThreeByOneGridProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  text?: string;
  mobileText?: string;
  image1?: string;
  image2?: string;
  image1Description?: string;
  image2Description?: string;
  textPosition?: "left" | "right";
  backgroundColor?: "white" | "black";
  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonOnClick?: () => void;
  secondaryButtonOnClick?: () => void;
  primaryButtonHref?: string;
  secondaryButtonHref?: string;
  textClassName?: string;
  textWrapperClassName?: string;
  image1ClassName?: string;
  hideImage2OnMobile?: boolean;
}

export default function ThreeByOneGrid({
  title,
  subtitle,
  maxWidth = true,
  text = "Standardisierung für Effizienz, Freiheit in der Gestaltung. Alles, was sinnvoll standardisiert werden kann, wird präzise gefertigt. Seriell gefertigte Module, effiziente Prozesse und bewährte Konstruktionen sichern höchste Qualität zu einem leistbaren Preis.",
  mobileText,
  image1 = IMAGES.function.nestHausModulKonzept,
  image2 = IMAGES.function.nestHausModulSeiteKonzept,
  image1Description = "Modulkonzept zeigt die durchdachte Konstruktion",
  image2Description = "Seitenansicht verdeutlicht die optimierte Statik",
  textPosition = "left",
  backgroundColor = "white",
  showButtons = false,
  primaryButtonText = "Primary Action",
  secondaryButtonText = "Secondary Action",
  primaryButtonOnClick,
  secondaryButtonOnClick,
  primaryButtonHref,
  secondaryButtonHref,
  textClassName = "",
  textWrapperClassName = "",
  image1ClassName = "",
  hideImage2OnMobile = false,
}: ThreeByOneGridProps) {
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

  // Determine if we should use mobile layout (same breakpoint as other components)
  const isMobile = isClient && screenWidth < 1024;

  // Get appropriate text based on screen size
  const displayText = isMobile && mobileText ? mobileText : text;

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
    <div className={`${backgroundClasses}`}>
      {/* Title and Subtitle Section */}
      {(title || subtitle) && (
        <div className="text-center py-8 px-4 md:px-12">
          {title && (
            <h2
              className={`h2-secondary mb-4 ${
                backgroundColor === "black" ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={`text-lg ${
                backgroundColor === "black" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Grid Container */}
      <div>
        {isMobile ? (
          /* Mobile Layout: Image - Text - Image */
          <div className="space-y-6">
            {/* First Image (Second Image on Mobile) */}
            <motion.div
              className={`relative overflow-hidden px-4 md:px-12 ${image1ClassName}`}
              style={{ aspectRatio: "4/3" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <HybridBlobImage
                path={image1}
                alt={image1Description}
                fill
                className="object-contain object-center"
                sizes="100vw"
                quality={85}
                strategy="client"
                enableCache={true}
                isInteractive={false}
                isAboveFold={true}
                isCritical={true}
              />
            </motion.div>

            {/* Text Section - Always in the middle */}
            <div className={`px-4 md:px-12 mb-12 ${textWrapperClassName}`}>
              <motion.div
                className={`p-secondary ${textColorClasses} text-left leading-snug lg:leading-relaxed ${textClassName}`}
                dangerouslySetInnerHTML={{ __html: displayText }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
              {/* Show buttons on mobile if showButtons is true */}
              {showButtons && (
                <div className="flex flex-row gap-2 items-center justify-center w-full mt-8">
                  <Button
                    variant="primary"
                    size="xs"
                    className="flex-shrink-0"
                    onClick={primaryButtonHref ? undefined : primaryButtonOnClick}
                    href={primaryButtonHref}
                  >
                    {primaryButtonText}
                  </Button>
                  {secondaryButtonText && secondaryButtonHref && (
                    <Button
                      variant="secondary-narrow-white"
                      size="xs"
                      className="flex-shrink-0"
                      onClick={
                        secondaryButtonHref ? undefined : secondaryButtonOnClick
                      }
                      href={secondaryButtonHref}
                    >
                      {secondaryButtonText}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Second Image (First Image on Mobile) */}
            {!hideImage2OnMobile && (
              <motion.div
                className="relative overflow-hidden px-4 md:px-12"
                style={{ aspectRatio: "4/3" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <HybridBlobImage
                  path={image2}
                  alt={image2Description}
                  fill
                  className="object-contain object-center"
                  sizes="100vw"
                  quality={85}
                  strategy="client"
                  enableCache={true}
                  isInteractive={false}
                  isAboveFold={false}
                  isCritical={false}
                />
              </motion.div>
            )}
          </div>
        ) : (
          /* Desktop Layout: 3 columns with 2 rows (main text only in first row) */
          <div className={`px-4 md:px-12 ${textWrapperClassName}`}>
            <div className="grid grid-rows-[auto_auto] grid-cols-3 gap-6">
              {/* First row: main text, image1, image2 */}
              {textPosition === "left" ? (
                <>
                  {/* Main text - first column, first row */}
                  <motion.div
                    className="flex flex-col items-center justify-center"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div
                      className={`p-secondary ${textColorClasses} text-left ${
                        screenWidth > 1700 ? "px-8" : ""
                      } ${textClassName}`}
                      dangerouslySetInnerHTML={{ __html: displayText }}
                    />
                    {showButtons && (
                      <div className="flex flex-row gap-2 items-start justify-center w-full mt-8">
                        <Button
                          variant="primary"
                          size="xs"
                          className="flex-shrink-0"
                          onClick={
                            primaryButtonHref ? undefined : primaryButtonOnClick
                          }
                          href={primaryButtonHref}
                        >
                          {primaryButtonText}
                        </Button>
                        {secondaryButtonText && secondaryButtonHref && (
                          <Button
                            variant="secondary-narrow-white"
                            size="xs"
                            className="flex-shrink-0"
                            onClick={
                              secondaryButtonHref
                                ? undefined
                                : secondaryButtonOnClick
                            }
                            href={secondaryButtonHref}
                          >
                            {secondaryButtonText}
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                  {/* Image 1 - second column, first row */}
                  <motion.div
                    className={`flex items-center justify-center ${image1ClassName}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: "4/3", width: "100%" }}
                    >
                      <HybridBlobImage
                        path={image1}
                        alt={image1Description}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        quality={85}
                        strategy="client"
                        enableCache={true}
                        isInteractive={false}
                        isAboveFold={true}
                        isCritical={true}
                      />
                    </div>
                  </motion.div>
                  {/* Image 2 - third column, first row */}
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: "4/3", width: "100%" }}
                    >
                      <HybridBlobImage
                        path={image2}
                        alt={image2Description}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        quality={85}
                        strategy="client"
                        enableCache={true}
                        isInteractive={false}
                        isAboveFold={false}
                        isCritical={false}
                      />
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Image 1 - first column, first row */}
                  <motion.div
                    className={`flex items-center justify-center ${image1ClassName}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: "4/3", width: "100%" }}
                    >
                      <HybridBlobImage
                        path={image1}
                        alt={image1Description}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        quality={85}
                        strategy="client"
                        enableCache={true}
                        isInteractive={false}
                        isAboveFold={true}
                        isCritical={true}
                      />
                    </div>
                  </motion.div>
                  {/* Image 2 - second column, first row */}
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: "4/3", width: "100%" }}
                    >
                      <HybridBlobImage
                        path={image2}
                        alt={image2Description}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        quality={85}
                        strategy="client"
                        enableCache={true}
                        isInteractive={false}
                        isAboveFold={false}
                        isCritical={false}
                      />
                    </div>
                  </motion.div>
                  {/* Main text - third column, first row */}
                  <motion.div
                    className="flex flex-col items-center justify-center"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div
                      className={`p-secondary ${textColorClasses} text-left ${
                        screenWidth > 1700 ? "px-8" : ""
                      } ${textClassName}`}
                      dangerouslySetInnerHTML={{ __html: displayText }}
                    />
                    {showButtons && (
                      <div className="flex flex-row gap-2 items-start justify-center w-full mt-8">
                        <Button
                          variant="primary-narrow"
                          size="xs"
                          className="flex-shrink-0"
                          onClick={
                            primaryButtonHref ? undefined : primaryButtonOnClick
                          }
                          href={primaryButtonHref}
                        >
                          {primaryButtonText}
                        </Button>
                        {secondaryButtonText && secondaryButtonHref && (
                          <Button
                            variant="secondary-narrow-white"
                            size="xs"
                            className="flex-shrink-0"
                            onClick={
                              secondaryButtonHref
                                ? undefined
                                : secondaryButtonOnClick
                            }
                            href={secondaryButtonHref}
                          >
                            {secondaryButtonText}
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
