"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ClientBlobVideo } from "@/components/images";
import { Button } from "@/components/ui";
import { VideoCardPreset } from "@/constants/contentCardPresets";
import "@/app/konfigurator/components/hide-scrollbar.css";

interface VideoCard16by9Props {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
  isLightboxMode?: boolean;
  onCardClick?: (cardId: number) => void;
  customData?: VideoCardPreset[];
}

// Fixed sizing system to ensure text area (1/3) has adequate space for content
// Desktop: Text takes 1/3 width, video takes 2/3 width with 16:9 ratio
// Mobile: Stacked layout with natural content height
const getCardDimensions = (screenWidth: number) => {
  // Calculate height based on video area width (2/3 of card) + consistent padding
  // Formula: (video_width / 16 * 9) + 30px padding = card_height

  if (screenWidth >= 1600) {
    const cardWidth = 1600;
    const videoWidth = (cardWidth * 2) / 3; // 1067px
    const videoHeight = (videoWidth / 16) * 9; // 600px
    return { width: cardWidth, height: videoHeight + 30 }; // 630px
  } else if (screenWidth >= 1400) {
    const cardWidth = 1380;
    const videoWidth = (cardWidth * 2) / 3; // 920px
    const videoHeight = (videoWidth / 16) * 9; // 518px
    return { width: cardWidth, height: videoHeight + 30 }; // 548px
  } else if (screenWidth >= 1280) {
    const cardWidth = 1280;
    const videoWidth = (cardWidth * 2) / 3; // 853px
    const videoHeight = (videoWidth / 16) * 9; // 480px
    return { width: cardWidth, height: videoHeight + 30 }; // 510px
  } else if (screenWidth >= 1024) {
    const cardWidth = 1200;
    const videoWidth = (cardWidth * 2) / 3; // 800px
    const videoHeight = (videoWidth / 16) * 9; // 450px
    return { width: cardWidth, height: videoHeight + 30 }; // 480px
  } else if (screenWidth >= 768) {
    return { width: 336, height: undefined }; // Tablet: Use natural height
  } else {
    return { width: 312, height: undefined }; // Mobile: Use natural height
  }
};

export default function VideoCard16by9({
  title = "Video Card 16:9",
  subtitle = "Video content with 16:9 aspect ratio",
  maxWidth = true,
  showInstructions = true,
  isLightboxMode: _isLightboxMode = false,
  onCardClick,
  customData,
}: VideoCard16by9Props) {
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0); // Start with 0 to prevent SSR mismatch
  const _containerRef = useRef<HTMLDivElement>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);
  }, []);

  // Track screen width for responsive behavior
  useEffect(() => {
    const updateScreenWidth = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
    };

    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  // Use custom data if provided, otherwise use default
  const displayCards = customData || [];

  const getCardText = (card: VideoCardPreset, field: keyof VideoCardPreset) => {
    if (!isClient) return card[field] as string;

    // Use mobile versions on smaller screens if available
    if (screenWidth < 768) {
      const mobileField = `mobile${
        field.charAt(0).toUpperCase() + field.slice(1)
      }` as keyof VideoCardPreset;
      return (card[mobileField] as string) || (card[field] as string);
    }

    return card[field] as string;
  };

  const getVideoPath = (videoPath: string): string => {
    // For now, return the path as-is. This will be handled by HybridBlobImage
    return videoPath;
  };

  // Prevent hydration mismatch by showing loading state until client is ready
  if (!isClient) {
    return (
      <div className="w-full">
        {/* Header Section */}
        {showInstructions && (
          <div
            className={`text-center mb-12 ${
              maxWidth ? "max-w-7xl mx-auto px-4" : "px-4"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>
        )}

        {/* Loading placeholder */}
        <div className={`${maxWidth ? "max-w-[1700px] mx-auto px-4" : "px-4"}`}>
          <div className="flex justify-center">
            <div className="w-full max-w-[1380px] h-[548px] animate-pulse bg-gray-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      {showInstructions && (
        <div
          className={`text-center mb-12 ${
            maxWidth ? "max-w-7xl mx-auto px-4" : "px-4"
          }`}
        >
          <h2 className="h2-title text-gray-900 hidden lg:block">{title}</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
      )}

      {/* Video Cards Container */}
      <div className={`${maxWidth ? "max-w-[1700px] mx-auto px-4" : "px-4"}`}>
        <div className="flex justify-center">
          {displayCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex-shrink-0"
              onClick={() => onCardClick?.(card.id)}
            >
              <div
                className="w-full rounded-3xl shadow-lg overflow-hidden cursor-pointer"
                style={{
                  backgroundColor: card.backgroundColor,
                  width: getCardDimensions(screenWidth).width,
                  ...(getCardDimensions(screenWidth).height && {
                    height: getCardDimensions(screenWidth).height,
                  }),
                }}
              >
                {/* Responsive Layout */}
                {screenWidth >= 1024 ? (
                  // Desktop: Wide layout (Text left, Video right with 16:9 aspect ratio)
                  <div
                    className="flex items-stretch"
                    style={{
                      ...(getCardDimensions(screenWidth).height && {
                        height: getCardDimensions(screenWidth).height,
                      }),
                    }}
                  >
                    {/* Text Content - Same width as content cards (1/3) */}
                    <div className="w-1/3 flex flex-col justify-center items-start text-left px-12 py-6">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <h2
                          className={`h2-title text-gray-900 ${
                            card.subtitle ? "mb-1" : "mb-6"
                          }`}
                        >
                          {getCardText(card, "title")}
                        </h2>
                        {card.subtitle && (
                          <h3 className="h3-secondary font-medium text-gray-700 mb-5">
                            {getCardText(card, "subtitle")}
                          </h3>
                        )}
                        <p className="p-primary">
                          {getCardText(card, "description")}
                        </p>

                        {/* Buttons for Video Cards - Desktop Layout */}
                        {card.buttons && (
                          <div className="flex flex-row gap-2 items-start justify-center w-full mt-8">
                            {card.buttons.map((button, btnIndex) => {
                              // Convert standard variants to narrow variants
                              const narrowVariant =
                                button.variant === "primary"
                                  ? "primary-narrow"
                                  : button.variant === "secondary"
                                    ? "secondary-narrow-blue"
                                    : button.variant;

                              return button.link ? (
                                <Link
                                  key={btnIndex}
                                  href={button.link}
                                  className="flex-shrink-0"
                                >
                                  <Button
                                    variant={narrowVariant}
                                    size={button.size}
                                  >
                                    {button.text}
                                  </Button>
                                </Link>
                              ) : (
                                <Button
                                  key={btnIndex}
                                  variant={narrowVariant}
                                  size={button.size}
                                  onClick={button.onClick}
                                  className="flex-shrink-0"
                                >
                                  {button.text}
                                </Button>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Video Content - Right side with 16:9 aspect ratio */}
                    <div className="w-2/3 relative overflow-hidden py-[15px] pr-[15px] flex items-center justify-end">
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: index * 0.1 + 0.2,
                          duration: 0.8,
                        }}
                        className="relative rounded-3xl overflow-hidden w-full"
                        style={{
                          aspectRatio: "16/9", // 16:9 aspect ratio for video
                          maxWidth: "100%",
                        }}
                      >
                        <ClientBlobVideo
                          path={getVideoPath(card.video)}
                          className="w-full h-full object-cover"
                          autoPlay={true}
                          loop={true}
                          muted={true}
                          playsInline={true}
                          controls={false}
                          enableCache={true}
                          playbackRate={card.playbackRate}
                        />
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  // Mobile/Tablet: Stacked layout (Text top, Video bottom with 1:1 aspect ratio)
                  <div className="flex flex-col">
                    {/* Text Content - Natural height with padding */}
                    <div className="flex flex-col justify-center items-center text-center p-6">
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className="w-full max-w-md"
                      >
                        <h2
                          className={`h2-title text-gray-900 ${
                            card.subtitle ? "mb-1" : "mb-4"
                          }`}
                        >
                          {getCardText(card, "title")}
                        </h2>
                        {card.subtitle && (
                          <h3 className="h3-secondary font-medium text-gray-700 mb-3">
                            {getCardText(card, "subtitle")}
                          </h3>
                        )}
                        <p className="p-primary leading-relaxed">
                          {getCardText(card, "description")}
                        </p>
                        {/* Note: Buttons are not shown on mobile/tablet to match ContentCards behavior */}
                      </motion.div>
                    </div>

                    {/* Video Content - Natural height with small padding gap */}
                    <div className="relative overflow-hidden py-4 px-4 flex items-center justify-center">
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: index * 0.1 + 0.2,
                          duration: 0.8,
                        }}
                        className="relative rounded-2xl md:rounded-3xl overflow-hidden"
                        style={{
                          aspectRatio: "1/1", // 1:1 aspect ratio for mobile video
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        <ClientBlobVideo
                          path={getVideoPath(card.video)}
                          className="w-full h-full object-cover"
                          autoPlay={true}
                          loop={true}
                          muted={true}
                          playsInline={true}
                          controls={false}
                          enableCache={true}
                          playbackRate={card.playbackRate}
                        />
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
