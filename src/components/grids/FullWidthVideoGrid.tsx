"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LoopingVideo } from "@/components/videos";
import { ClientBlobVideo } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface FullWidthVideoGridProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  video?: string;
  textBox1?: string;
  textBox2?: string;
  backgroundColor?: "white" | "black";
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  cropPercent?: number; // Percentage to crop from top and bottom (e.g., 20 for 20%)
}

export default function FullWidthVideoGrid({
  title = "Full Width Video Grid",
  subtitle = "Large video with two text boxes below",
  maxWidth = true,
  video = IMAGES.function.nestHausModulSchemaIntro,
  textBox1 = "Video content with descriptive text below explaining the key concepts and features of the NEST-Haus system.",
  textBox2 = "Additional information about the video content and how it relates to the overall NEST-Haus experience and philosophy.",
  backgroundColor = "black",
  autoPlay = true,
  muted = true,
  controls = false,
  cropPercent = 0,
}: FullWidthVideoGridProps) {
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
            <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl">
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
            <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div>
        {/* Large Video at Top - Full Width */}
        <motion.div
          className="relative overflow-hidden w-full h-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center">
            <div className="w-full max-w-6xl aspect-video rounded-lg overflow-hidden bg-gray-900">
              {video === IMAGES.function.nestHausModulSchemaIntro ? (
                <LoopingVideo
                  introPath={video}
                  outroPath={IMAGES.function.nestHausModulSchemaOutro}
                  className="w-full h-full object-cover"
                  autoPlay={autoPlay}
                  muted={muted}
                  playsInline={true}
                  controls={controls}
                  enableCache={true}
                />
              ) : (
                <div
                  className="w-full h-full overflow-hidden relative"
                  style={
                    cropPercent > 0
                      ? {
                          clipPath: `inset(${cropPercent}% 0)`,
                        }
                      : undefined
                  }
                >
                  <div
                    className="w-full h-full"
                    style={
                      cropPercent > 0
                        ? {
                            height: `${100 + cropPercent * 2}%`,
                            marginTop: `-${cropPercent}%`,
                          }
                        : undefined
                    }
                  >
                    <ClientBlobVideo
                      path={video}
                      className="w-full h-full object-cover"
                      autoPlay={autoPlay}
                      loop={true}
                      muted={muted}
                      playsInline={true}
                      controls={controls}
                      enableCache={true}
                    />
                  </div>
                </div>
              )}
              {/* Accessibility description for screen readers */}
              <span className="sr-only">
                Video demonstration of NEST-Haus modular construction system
                showing architectural components and assembly process
              </span>
            </div>
          </div>
        </motion.div>

        {/* Two Text Boxes Below - Responsive Layout */}
        <div className="px-4 md:px-8 mt-4">
          <div
            className={`grid ${
              isMobile ? "grid-cols-1" : "grid-cols-2"
            } gap-4 md:gap-6 max-w-4xl mx-auto`}
          >
            {/* Text Box 1 */}
            <motion.div
              className="flex items-center justify-center"
              style={isMobile ? {} : { minHeight: "200px" }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p
                className={`text-sm md:text-base lg:text-lg 2xl:text-xl ${textColorClasses} leading-relaxed ${
                  isMobile ? "text-center" : "text-left"
                }`}
              >
                {textBox1}
              </p>
            </motion.div>

            {/* Text Box 2 */}
            <motion.div
              className="flex items-center justify-center"
              style={isMobile ? {} : { minHeight: "200px" }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p
                className={`text-sm md:text-base lg:text-lg 2xl:text-xl ${textColorClasses} leading-relaxed ${
                  isMobile ? "text-center" : "text-left"
                }`}
              >
                {textBox2}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
