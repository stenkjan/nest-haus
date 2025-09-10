"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ClientBlobVideo } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface FullWidthVideoGridProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  video?: string;
  backgroundColor?: "white" | "black";
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  cropPercent?: number; // Percentage to crop from top and bottom (e.g., 20 for 20%)
  // Optional text fields for compatibility with existing pages
  textBox1?: string;
  textBox2?: string;
}

export default function FullWidthVideoGrid({
  title = "Full Width Video Grid",
  subtitle = "Large video",
  maxWidth = true,
  video = IMAGES.function.nestHausModulSchemaIntro,
  backgroundColor = "black",
  autoPlay = true,
  muted = true,
  controls = false,
  cropPercent = 0,
}: FullWidthVideoGridProps) {
  const [isClient, setIsClient] = useState(false);
  const [_screenWidth, setScreenWidth] = useState(0);

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

  // Background and text color classes
  const backgroundClasses =
    backgroundColor === "black"
      ? "bg-black text-white"
      : "bg-white text-gray-900";

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className={`${containerClasses} ${backgroundClasses} py-8`}>
        <div className="text-center mb-24">
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
    <div className={`${backgroundClasses} py-8`}>
      {/* Title and Subtitle */}
      <div className={`${containerClasses}`}>
        <div className="text-center mb-24 px-4 md:px-8">
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

      {/* Main Container */}
      <div>
        {/* Large Video at Top - Full Width */}
        <motion.div
          className={`relative overflow-hidden h-auto ${
            video !== IMAGES.function.nestHausModulSchemaIntro
              ? "w-screen"
              : "w-full"
          }`}
          style={
            video !== IMAGES.function.nestHausModulSchemaIntro
              ? {
                  marginLeft: "calc(-50vw + 50%)",
                  marginRight: "calc(-50vw + 50%)",
                }
              : undefined
          }
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center">
            <div
              className={`w-full overflow-hidden bg-gray-900 ${
                video === IMAGES.function.nestHausModulSchemaIntro
                  ? "max-w-6xl rounded-lg"
                  : ""
              }`}
            >
              {video === IMAGES.function.nestHausModulSchemaIntro ? (
                <ClientBlobVideo
                  path={video}
                  className="w-full h-auto object-contain"
                  autoPlay={autoPlay}
                  loop={true}
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
                      className="w-full h-auto object-contain"
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
      </div>
    </div>
  );
}
