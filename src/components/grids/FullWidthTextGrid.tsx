"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface FullWidthTextGridProps {
  maxWidth?: boolean;
  textBox1?: string;
  textBox2?: string;
  backgroundColor?: "white" | "black";
}

export default function FullWidthTextGrid({
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
      <div className={`${containerClasses} ${backgroundClasses} pb-8`}>
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
    <div className={`${backgroundClasses} `}>
      {/* Two Text Columns */}
      <div className="px-4 md:px-12 pb-8 md:pb-16">
        <div
          className={`grid ${
            isMobile ? "grid-cols-1" : "grid-cols-2"
          } gap-8 md:gap-6 max-w-4xl mx-auto`}
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
              className={`p-secondary ${textColorClasses} ${
                isMobile ? "text-center" : "text-left"
              }`}
              dangerouslySetInnerHTML={{ __html: textBox1 }}
            />
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
              className={`p-secondary ${textColorClasses} ${
                isMobile ? "text-center" : "text-left"
              }`}
              dangerouslySetInnerHTML={{ __html: textBox2 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
