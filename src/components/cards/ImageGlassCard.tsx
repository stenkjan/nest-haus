"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface ImageGlassCardProps {
  maxWidth?: boolean;
  backgroundColor?: "white" | "black";
  image?: string;
}

export default function ImageGlassCard({
  maxWidth = true,
  backgroundColor = "black",
  image = IMAGES.function.nestHausHandDrawing, // 26-NEST-Haus-Planung-Innenausbau-Zeichnen-Grundriss
}: ImageGlassCardProps) {
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
          <div className="flex justify-center">
            <div className="w-full max-w-4xl animate-pulse bg-gray-800 rounded-3xl aspect-[4/3]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${backgroundClasses} py-8`}>
      <div className={`${containerClasses}`}>
        <div className="px-4 md:px-8">
          <div className="flex justify-center">
            {/* Glass Card with Image - Standard responsive sizing */}
            <motion.div
              className="w-full max-w-6xl rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundColor: "#121212",
                boxShadow:
                  "inset 0 6px 12px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {/* Image with Natural Aspect Ratio */}
              <div className="relative w-full">
                <HybridBlobImage
                  path={image}
                  alt="NEST-Haus Planung und Innenausbau Zeichnung Grundriss"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  strategy="client"
                  isInteractive={true}
                  enableCache={true}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, (max-width: 1280px) 70vw, 1024px"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
