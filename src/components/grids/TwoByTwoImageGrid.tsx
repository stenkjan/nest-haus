"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HybridBlobImage, ClientBlobVideo } from "@/components/images";
import { Button } from "@/components/ui";

interface GridItem {
  id: number;
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  description: string; // max 25 characters
  image?: string; // Optional - use either image or video
  video?: string; // Optional - use either video or image
  playbackRate?: number; // Optional playback speed control for videos
  backgroundColor: string;
  primaryAction?: string; // Optional - if omitted, no primary button
  secondaryAction?: string; // Optional - if omitted, no secondary button
  textColor?: "white" | "black"; // Optional text color per item
  primaryButtonVariant?:
    | "primary"
    | "secondary"
    | "primary-narrow"
    | "secondary-narrow"
    | "secondary-narrow-white"
    | "secondary-narrow-blue"
    | "tertiary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "info"
    | "landing-primary"
    | "landing-secondary"
    | "landing-secondary-blue"
    | "landing-secondary-blue-white"
    | "configurator"; // Optional primary button variant (defaults to "landing-primary")
  secondaryButtonVariant?:
    | "primary"
    | "secondary"
    | "primary-narrow"
    | "secondary-narrow"
    | "secondary-narrow-white"
    | "secondary-narrow-blue"
    | "tertiary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "info"
    | "landing-primary"
    | "landing-secondary"
    | "landing-secondary-blue"
    | "landing-secondary-blue-white"
    | "configurator"; // Optional secondary button variant (defaults to "landing-secondary")
  primaryLink?: string; // Optional link for primary action
  secondaryLink?: string; // Optional link for secondary action
}

interface TwoByTwoImageGridProps {
  maxWidth?: boolean;
  customData: GridItem[]; // Required since we don't have default data
  textColor?: "white" | "black"; // Default text color (can be overridden per item)
}

export default function TwoByTwoImageGrid({
  maxWidth: _maxWidth = true,
  customData,
  textColor = "black",
}: TwoByTwoImageGridProps) {
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

  const containerClasses = "w-full";

  // Calculate responsive sizing for ultra-wide screens
  const isUltraWide = isClient && screenWidth >= 1536;
  const gridMinHeight = isUltraWide ? "500px" : "400px";

  // Prevent hydration mismatch by showing loading state until client is ready
  if (!isClient) {
    return (
      <div className={containerClasses}>
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full mx-auto gap-4 px-4">
          {customData.map((item) => (
            <div
              key={item.id}
              className="animate-pulse bg-gray-200 rounded-lg"
              style={{ aspectRatio: "3/2", minHeight: "400px" }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* 2x2 Grid Container - Consistent padding */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 w-full mx-auto px-2"
        style={{ gap: "1vh" }}
      >
        {customData.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative w-full flex-shrink-0 overflow-hidden"
            style={{
              aspectRatio: "3/2", // 3:2 horizontal aspect ratio
              minHeight: gridMinHeight,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Background Image or Video */}
            <div className="absolute inset-0">
              {item.video ? (
                <ClientBlobVideo
                  path={item.video}
                  className="w-full h-full object-cover"
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  playsInline={true}
                  controls={false}
                  playbackRate={item.playbackRate || 1.0}
                  enableCache={true}
                />
              ) : (
                <HybridBlobImage
                  path={item.image || ""}
                  alt={
                    typeof item.title === "string" ? item.title : "Grid Image"
                  }
                  fill
                  className="object-cover object-center"
                  strategy="client"
                  isInteractive={true}
                  // enableCache={item.id !== 1} // Disable cache for first image to test
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={85}
                />
              )}
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-between p-6 max-md:pb-[5vh]">
              {/* Top Section - Title, Subtitle, and Buttons (except for id 1) */}
              <motion.div
                className="flex-shrink-0"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div
                  className={`${
                    isUltraWide
                      ? "p-6"
                      : screenWidth < 1024
                        ? "p-0 -mt-2"
                        : "p-4"
                  } text-center`}
                >
                  <h2
                    className={`mb-2 sm:mb-1 font-bold text-2xl sm:text-2xl md:font-medium md:text-xl lg:text-5xl md:lg:text-3xl xl:text-6xl md:xl:text-4xl md:2xl:text-5xl ${
                      (item.textColor || textColor) === "white"
                        ? "!text-white"
                        : "!text-black"
                    }`}
                  >
                    {item.title}
                  </h2>
                  <h3
                    className={`hidden sm:block font-medium text-lg sm:text-base md:text-sm lg:text-lg md:lg:text-xl xl:text-2xl md:xl:text-2xl ${item.id !== 1 && (item.primaryAction || item.secondaryAction) ? "mb-2" : ""} ${
                      (item.textColor || textColor) === "white"
                        ? "!text-white"
                        : "!text-black"
                    }`}
                  >
                    {item.subtitle}
                  </h3>

                  {/* Button Group - Top position (for all items except id 1) */}
                  {item.id !== 1 &&
                    (item.primaryAction || item.secondaryAction) && (
                      <div className="flex gap-2 justify-center">
                        {/* Primary Button - Only render if primaryAction is provided */}
                        {item.primaryAction &&
                          (item.primaryLink ? (
                            <Link href={item.primaryLink}>
                              <Button
                                variant={
                                  item.primaryButtonVariant || "landing-primary"
                                }
                                size="xs"
                                className="w-full"
                              >
                                {item.primaryAction}
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              variant={
                                item.primaryButtonVariant || "landing-primary"
                              }
                              size="xs"
                              className="w-full"
                            >
                              {item.primaryAction}
                            </Button>
                          ))}

                        {/* Secondary Button - Only render if secondaryAction is provided */}
                        {item.secondaryAction &&
                          (item.secondaryLink ? (
                            <Link href={item.secondaryLink}>
                              <Button
                                variant={
                                  item.secondaryButtonVariant ||
                                  "landing-secondary"
                                }
                                size="xs"
                                className="w-full"
                              >
                                {item.secondaryAction}
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              variant={
                                item.secondaryButtonVariant ||
                                "landing-secondary"
                              }
                              size="xs"
                              className="w-full"
                            >
                              {item.secondaryAction}
                            </Button>
                          ))}
                      </div>
                    )}
                </div>
              </motion.div>

              {/* Bottom Section - Description and Buttons (only for id 1) */}
              <motion.div
                className={`flex-shrink-0 ${item.id === 1 ? "pt-[120px] sm:pt-[150px]" : ""}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
              >
                <div
                  className={`${
                    isUltraWide ? "p-6" : screenWidth < 1024 ? "p-0" : "p-4"
                  }`}
                >
                  {/* Description Text */}
                  {item.description && (
                    <p
                      className={`p-primary text-center ${item.id === 1 && (item.primaryAction || item.secondaryAction) ? "mb-4" : ""} ${
                        (item.textColor || textColor) === "white"
                          ? "!text-white"
                          : "!text-black"
                      }`}
                    >
                      {item.description}
                    </p>
                  )}

                  {/* Button Group - Bottom position (only for id 1) */}
                  {item.id === 1 &&
                    (item.primaryAction || item.secondaryAction) && (
                      <div className="flex gap-2 justify-center">
                        {/* Primary Button - Only render if primaryAction is provided */}
                        {item.primaryAction &&
                          (item.primaryLink ? (
                            <Link href={item.primaryLink}>
                              <Button
                                variant="landing-primary"
                                size="xs"
                                className="w-full"
                              >
                                {item.primaryAction}
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              variant="landing-primary"
                              size="xs"
                              className="w-full"
                            >
                              {item.primaryAction}
                            </Button>
                          ))}

                        {/* Secondary Button - Only render if secondaryAction is provided */}
                        {item.secondaryAction &&
                          (item.secondaryLink ? (
                            <Link href={item.secondaryLink}>
                              <Button
                                variant={
                                  item.secondaryButtonVariant ||
                                  "landing-secondary"
                                }
                                size="xs"
                                className="w-full"
                              >
                                {item.secondaryAction}
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              variant={
                                item.secondaryButtonVariant ||
                                "landing-secondary"
                              }
                              size="xs"
                              className="w-full"
                            >
                              {item.secondaryAction}
                            </Button>
                          ))}
                      </div>
                    )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
