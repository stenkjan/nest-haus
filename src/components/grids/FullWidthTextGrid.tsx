"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface FullWidthTextGridProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  textBox1?: string;
  textBox2?: string;
  backgroundColor?: "white" | "black";
}

export default function FullWidthTextGrid({
  title = "Full Width Text Grid",
  subtitle = "Two text columns side by side",
  maxWidth = true,
  textBox1 = "First text column with descriptive content and key information about the topic.",
  textBox2 = "Second text column with additional information and supporting details about the subject matter.",
  backgroundColor = "black",
}: FullWidthTextGridProps) {
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
        <div className="px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            <div
              className={`animate-pulse ${
                backgroundColor === "black" ? "bg-gray-700" : "bg-gray-200"
              } rounded`}
              style={{ height: 120 }}
            />
            <div
              className={`animate-pulse ${
                backgroundColor === "black" ? "bg-gray-700" : "bg-gray-200"
              } rounded`}
              style={{ height: 120 }}
            />
          </div>
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

      {/* Two Text Columns */}
      <div className="px-4 md:px-8">
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
  );
}
