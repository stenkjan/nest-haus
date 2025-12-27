"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface ImageWithFourTextGridProps {
  maxWidth?: boolean;
  image?: string;
  mobileImage?: string;
  imageDescription?: string;
  textCell1?: string;
  textCell2?: string;
  textCell3?: string;
  textCell4?: string;
  textCellTitle1?: string;
  textCellTitle2?: string;
  textCellTitle3?: string;
  textCellTitle4?: string;
  backgroundColor?: "white" | "black";
}

export default function ImageWithFourTextGrid({
  maxWidth = true,
  image = IMAGES.function.nestHausModulAnsicht,
  mobileImage,
  imageDescription = "Hoam Concept Image",
  textCell1 = "First text cell with important information about the concept and features.",
  textCell2 = "Second text cell with additional details and supporting information.",
  textCell3 = "Third text cell with technical specifications and quality aspects.",
  textCell4 = "Fourth text cell with benefits and advantages of the system.",
  textCellTitle1 = "Feature 1",
  textCellTitle2 = "Feature 2",
  textCellTitle3 = "Feature 3",
  textCellTitle4 = "Feature 4",
  backgroundColor = "white",
}: ImageWithFourTextGridProps) {
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

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

  // Get the appropriate image based on screen size
  const currentImage = isMobile && mobileImage ? mobileImage : image;

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
    <div className={`${backgroundClasses}`}>
      {/* Main Container with Padding */}
      <div className="px-4 md:px-12">
        {/* Image at Top - Standard Max Width */}
        <motion.div
          className="relative overflow-hidden w-full h-auto mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`${containerClasses}`}>
            <HybridBlobImage
              path={currentImage}
              alt={imageDescription}
              width={1395}
              height={720}
              className="w-full md:w-9/10 h-auto object-contain rounded-none md:rounded-lg md:mx-auto"
              sizes="(max-width: 1536px) 90vw, 1382px"
              quality={85}
              strategy="client"
              enableCache={true}
              isInteractive={false}
              isAboveFold={true}
              isCritical={true}
            />
          </div>
        </motion.div>

        {/* Horizontal Line - Hidden on Mobile */}
        {!isMobile && (
          <div className={`${containerClasses}`}>
            <div
              className={`h-px w-full ${backgroundColor === "black" ? "bg-gray-700" : "bg-gray-300"
                } mb-8`}
            ></div>
          </div>
        )}

        {isMobile ? (
          /* Mobile Layout: "Mehr Informationen" pattern - No text visible initially */
          <div>
            {/* Mobile: More Information Toggle */}
            <motion.div
              className="text-center mt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <button
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className={`text-sm ${textColorClasses} opacity-80 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 mx-auto focus:outline-none focus:ring-2 focus:ring-offset-2 ${backgroundColor === "black"
                    ? "focus:ring-white"
                    : "focus:ring-gray-500"
                  } rounded-lg px-4 py-2`}
              >
                Mehr Informationen
                <motion.span
                  animate={{ rotate: showMoreInfo ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-lg"
                >
                  ↓
                </motion.span>
              </button>
            </motion.div>

            {/* Mobile: Expandable All Text Cells */}
            <motion.div
              initial={false}
              animate={{
                height: showMoreInfo ? "auto" : 0,
                opacity: showMoreInfo ? 1 : 0,
              }}
              transition={{
                height: { duration: 0.4, ease: "easeInOut" },
                opacity: { duration: 0.3, delay: showMoreInfo ? 0.1 : 0 },
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{ y: showMoreInfo ? 0 : -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="pt-6"
              >
                {/* Horizontal divider */}
                <div
                  className={`h-px w-full ${backgroundColor === "black" ? "bg-gray-700" : "bg-gray-300"
                    } mb-6`}
                ></div>

                {/* All text cells for mobile */}
                <div className="space-y-6">
                  <motion.div
                    className="flex flex-col items-start justify-start space-y-3"
                    style={{ minHeight: "150px" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: showMoreInfo ? 0 : 20,
                      opacity: showMoreInfo ? 1 : 0,
                    }}
                    transition={{ delay: 0.0, duration: 0.4 }}
                  >
                    <h3
                      className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold ${textColorClasses} text-left`}
                    >
                      {textCellTitle1}
                    </h3>
                    <p
                      className={`text-xs 2xl:text-sm ${textColorClasses} opacity-80 leading-relaxed text-left`}
                    >
                      {textCell1}
                    </p>
                  </motion.div>

                  <motion.div
                    className="flex flex-col items-start justify-start space-y-3"
                    style={{ minHeight: "150px" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: showMoreInfo ? 0 : 20,
                      opacity: showMoreInfo ? 1 : 0,
                    }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <h3
                      className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold ${textColorClasses} text-left`}
                    >
                      {textCellTitle2}
                    </h3>
                    <p
                      className={`text-xs 2xl:text-sm ${textColorClasses} opacity-80 leading-relaxed text-left`}
                    >
                      {textCell2}
                    </p>
                  </motion.div>

                  <motion.div
                    className="flex flex-col items-start justify-start space-y-3"
                    style={{ minHeight: "150px" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: showMoreInfo ? 0 : 20,
                      opacity: showMoreInfo ? 1 : 0,
                    }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <h3
                      className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold ${textColorClasses} text-left`}
                    >
                      {textCellTitle3}
                    </h3>
                    <p
                      className={`text-xs 2xl:text-sm ${textColorClasses} opacity-80 leading-relaxed text-left`}
                    >
                      {textCell3}
                    </p>
                  </motion.div>

                  <motion.div
                    className="flex flex-col items-start justify-start space-y-3"
                    style={{ minHeight: "150px" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: showMoreInfo ? 0 : 20,
                      opacity: showMoreInfo ? 1 : 0,
                    }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <h3
                      className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold ${textColorClasses} text-left`}
                    >
                      {textCellTitle4}
                    </h3>
                    <p
                      className={`text-xs 2xl:text-sm ${textColorClasses} opacity-80 leading-relaxed text-left`}
                    >
                      {textCell4}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          /* Desktop Layout: 4 columns with text */
          <div className={`${containerClasses}`}>
            <div className="grid grid-cols-4 gap-6">
              {/* Text Cell 1 */}
              <motion.div
                className="flex flex-col items-start justify-start space-y-4"
                style={{ minHeight: "200px" }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h3
                  className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold ${textColorClasses} text-left`}
                >
                  {textCellTitle1}
                </h3>
                <p
                  className={`text-xs 2xl:text-sm ${textColorClasses} opacity-80 leading-relaxed text-left`}
                >
                  {textCell1}
                </p>
              </motion.div>

              {/* Text Cell 2 */}
              <motion.div
                className="flex flex-col items-start justify-start space-y-4"
                style={{ minHeight: "200px" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h3
                  className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold ${textColorClasses} text-left`}
                >
                  {textCellTitle2}
                </h3>
                <p
                  className={`text-xs 2xl:text-sm ${textColorClasses} opacity-80 leading-relaxed text-left`}
                >
                  {textCell2}
                </p>
              </motion.div>

              {/* Text Cell 3 */}
              <motion.div
                className="flex flex-col items-start justify-start space-y-4"
                style={{ minHeight: "200px" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h3
                  className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold ${textColorClasses} text-left`}
                >
                  {textCellTitle3}
                </h3>
                <p
                  className={`text-xs 2xl:text-sm ${textColorClasses} opacity-80 leading-relaxed text-left`}
                >
                  {textCell3}
                </p>
              </motion.div>

              {/* Text Cell 4 */}
              <motion.div
                className="flex flex-col items-start justify-start space-y-4"
                style={{ minHeight: "200px" }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <h3
                  className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold ${textColorClasses} text-left`}
                >
                  {textCellTitle4}
                </h3>
                <p
                  className={`text-xs 2xl:text-sm ${textColorClasses} opacity-80 leading-relaxed text-left`}
                >
                  {textCell4}
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
