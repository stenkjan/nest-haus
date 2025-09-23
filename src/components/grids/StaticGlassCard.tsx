"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui";

interface StaticGlassCardProps {
  maxWidth?: boolean;
  backgroundColor?: "white" | "black";
  cardContent?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function StaticGlassCard({
  maxWidth = true,
  backgroundColor = "black",
  cardContent = "This is a static glass card component with elegant design and responsive layout. Perfect for highlighting important content or calls to action.",
  primaryButtonText = "Primary Action",
  secondaryButtonText = "Secondary Action",
  onPrimaryClick = () => console.log("Primary button clicked"),
  onSecondaryClick = () => console.log("Secondary button clicked"),
}: StaticGlassCardProps) {
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  const containerClasses = maxWidth
    ? "w-full max-w-screen-2xl mx-auto"
    : "w-full";

  // Background classes
  const backgroundClasses =
    backgroundColor === "black" ? "bg-black" : "bg-white";

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className={`${containerClasses} ${backgroundClasses} py-8`}>
        <div className="px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            <div
              className={`animate-pulse ${
                backgroundColor === "black" ? "bg-gray-700" : "bg-gray-200"
              } rounded-3xl`}
              style={{ height: 300 }}
            />
            <div className="flex gap-4 justify-center mt-8">
              <div
                className={`animate-pulse ${
                  backgroundColor === "black" ? "bg-gray-700" : "bg-gray-200"
                } rounded`}
                style={{ width: 120, height: 40 }}
              />
              <div
                className={`animate-pulse ${
                  backgroundColor === "black" ? "bg-gray-700" : "bg-gray-200"
                } rounded`}
                style={{ width: 120, height: 40 }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${backgroundClasses} py-8`}>
      <div className={`${containerClasses}`}>
        <div className="px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Glass Card */}
            <motion.div
              className="relative overflow-hidden rounded-3xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Glass effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl" />

              {/* Content */}
              <div className="relative z-10 p-8 md:p-12">
                <p className="p-primary text-white leading-relaxed text-center">
                  {cardContent}
                </p>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex gap-4 justify-center mt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Button variant="secondary" size="xs" onClick={onSecondaryClick}>
                {secondaryButtonText}
              </Button>
              <Button variant="primary" size="xs" onClick={onPrimaryClick}>
                {primaryButtonText}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
