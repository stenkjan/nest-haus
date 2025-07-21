"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface ThreeByOneGridProps {
  title?: string;
  subtitle?: string;
  maxWidth?: boolean;
  showInstructions?: boolean;
  text?: string;
  mobileText?: string;
  image1?: string;
  image2?: string;
  image1Description?: string;
  image2Description?: string;
  textPosition?: "left" | "right";
  backgroundColor?: "white" | "black";
}

export default function ThreeByOneGrid({
  title = "3x1 Grid",
  subtitle = "Responsive 3-column layout with text and images",
  maxWidth = true,
  showInstructions = true,
  text = "Standardisierung für Effizienz und Kostenoptimierung. Höchste Qualität zu einem leistbaren Preis durch intelligente Optimierung – und volle gestalterische Freiheit dort, wo sie wirklich zählt. Alles, was sinnvoll standardisierbar ist, wird perfektioniert: Präzisionsgefertigte Module, effiziente Fertigung und bewährte Konstruktion sichern höchste Qualität.",
  mobileText,
  image1 = IMAGES.function.nestHausModulKonzept,
  image2 = IMAGES.function.nestHausModulSeiteKonzept,
  image1Description = "Modulkonzept zeigt die durchdachte Konstruktion",
  image2Description = "Seitenansicht verdeutlicht die optimierte Statik",
  textPosition = "left",
  backgroundColor = "white",
}: ThreeByOneGridProps) {
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
      <div className={`${containerClasses} ${backgroundClasses} py-8`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && (
            <p
              className={
                backgroundColor === "black" ? "text-gray-300" : "text-gray-600"
              }
            >
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex justify-center items-center py-8">
          <div
            className={`animate-pulse ${backgroundColor === "black" ? "bg-gray-700" : "bg-gray-200"} rounded-3xl`}
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
        <div className="text-center mb-8 px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && (
            <p
              className={
                backgroundColor === "black" ? "text-gray-300" : "text-gray-600"
              }
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div>
        {isMobile ? (
          /* Mobile Layout: Stack vertically */
          <div className="space-y-6">
            {/* Text Section */}
            <div className="px-4 md:px-8">
              <motion.div
                className="flex items-center justify-center"
                style={{ minHeight: "200px" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <p
                  className={`text-sm md:text-base ${textColorClasses} leading-relaxed text-center`}
                >
                  {displayText}
                </p>
              </motion.div>
            </div>

            {/* Images Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/3" }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <HybridBlobImage
                  path={image1}
                  alt={image1Description}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  strategy="client"
                  enableCache={true}
                  isInteractive={false}
                  isAboveFold={true}
                  isCritical={true}
                />
              </motion.div>

              <motion.div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/3" }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <HybridBlobImage
                  path={image2}
                  alt={image2Description}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  strategy="client"
                  enableCache={true}
                  isInteractive={false}
                  isAboveFold={false}
                  isCritical={false}
                />
              </motion.div>
            </div>

            {/* Mobile: More Information Toggle */}
            <div className="px-4 md:px-8">
              <motion.div
                className="text-center mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <button
                  onClick={() => setShowMoreInfo(!showMoreInfo)}
                  className={`text-sm ${textColorClasses} opacity-80 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 mx-auto focus:outline-none focus:ring-2 focus:ring-offset-2 ${backgroundColor === "black" ? "focus:ring-white" : "focus:ring-gray-500"} rounded-lg px-4 py-2`}
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

              {/* Mobile: Expandable Technical Details */}
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
                  className="pt-6 px-4"
                >
                  {/* Horizontal divider */}
                  <div
                    className={`h-px w-full ${backgroundColor === "black" ? "bg-gray-700" : "bg-gray-300"} mb-6`}
                  ></div>

                  {/* Technical specifications for mobile */}
                  <div className="space-y-6">
                    <div>
                      <h4
                        className={`font-bold text-sm ${textColorClasses} mb-3`}
                      >
                        Technische Details
                      </h4>

                      {/* Aufbau a */}
                      <div className="mb-4">
                        <div
                          className={`font-bold text-xs ${textColorClasses} mb-2`}
                        >
                          Aufbau a
                        </div>
                        <div
                          className={`text-xs ${textColorClasses} opacity-80 leading-relaxed space-y-1`}
                        >
                          <div>Holzlattung Lärche Natur 5x4cm</div>
                          <div>ALU Traglattung 2,5cm + 2,0cm Abstandhalter</div>
                          <div>Foliendach UV-beständig RAL9005</div>
                          <div>Rauschalung 2,4cm</div>
                          <div>Konterlattung 5,0cm</div>
                          <div>Holzfaserplatte 4,0cm</div>
                          <div>
                            Sparren FJI 9x32cm + Steico Holzfaserdämmung
                          </div>
                          <div>OSB NF 1,8cm</div>
                          <div>Install-Ebene 5,0cm</div>
                          <div>3-Schichtplatte Fichte sicht 1,9cm</div>
                        </div>
                      </div>

                      {/* Aufbau b */}
                      <div className="mb-4">
                        <div
                          className={`font-bold text-xs ${textColorClasses} mb-2`}
                        >
                          Aufbau b
                        </div>
                        <div
                          className={`text-xs ${textColorClasses} opacity-80 leading-relaxed space-y-1`}
                        >
                          <div>Parkett Eiche - Schwimmend verlegt</div>
                          <div>Flies Unterlegbahn 0,2cm</div>
                          <div>OSB 2,2cm</div>
                          <div>FJI Träger 36,0/8,9cm</div>
                          <div>Steico Holzfaserdämmung</div>
                          <div>H2O Zementfaserplatte 1,25cm</div>
                        </div>
                      </div>

                      {/* Element c */}
                      <div className="mb-4">
                        <div
                          className={`font-bold text-xs ${textColorClasses} mb-2`}
                        >
                          Element c
                        </div>
                        <div
                          className={`text-xs ${textColorClasses} opacity-80`}
                        >
                          Zugstab
                        </div>
                      </div>

                      {/* Element d */}
                      <div className="mb-4">
                        <div
                          className={`font-bold text-xs ${textColorClasses} mb-2`}
                        >
                          Element d
                        </div>
                        <div
                          className={`text-xs ${textColorClasses} opacity-80`}
                        >
                          Fundament
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Desktop Layout: 3 columns with 2 rows (main text only in first row) */
          <div className="px-4 md:px-8">
            <div className="grid grid-rows-[auto_auto] grid-cols-3 gap-6">
              {/* First row: main text, image1, image2 */}
              {textPosition === "left" ? (
                <>
                  {/* Main text - first column, first row */}
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <p
                      className={`text-sm lg:text-base ${textColorClasses} leading-relaxed text-left`}
                    >
                      {displayText}
                    </p>
                  </motion.div>
                  {/* Image 1 - second column, first row */}
                  <motion.div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "4/3" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
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
                  </motion.div>
                  {/* Image 2 - third column, first row */}
                  <motion.div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "4/3" }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
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
                  </motion.div>
                  {/* Horizontal line spanning all 3 columns */}
                  <div
                    className={`col-span-3 h-px w-full ${backgroundColor === "black" ? "bg-gray-700" : "bg-gray-300"} my-2`}
                  ></div>
                  {/* Second row: empty cell under text, description1, description2 */}
                  <div></div>
                  <motion.div
                    className="flex items-start justify-center px-2"
                    style={{ minHeight: "60px" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="grid grid-cols-2 gap-4 w-full text-left">
                      <div
                        className={`text-[10px] ${textColorClasses} opacity-80 leading-tight`}
                      >
                        <div className="font-bold text-[10px]">Aufbau a</div>
                        <div className="text-[10px]">
                          Holzlattung Lärche Natur 5x4cm
                        </div>
                        <div className="text-[10px]">
                          ALU Traglattung 2,5cm + 2,0cm Abstandhalter
                        </div>
                        <div className="text-[10px]">
                          Foliendach UV-beständig RAL9005
                        </div>
                        <div className="text-[10px]">Rauschalung 2,4cm</div>
                        <div className="text-[10px]">Konterlattung 5,0cm</div>
                      </div>
                      <div
                        className={`text-[10px] ${textColorClasses} opacity-80 leading-tight`}
                      >
                        <div className="text-[10px]">&nbsp;</div>
                        <div className="text-[10px]">Holzfaserplatte 4,0cm</div>
                        <div className="text-[10px]">
                          Sparren FJI 9x32cm + Steico Holzfaserdämmung
                        </div>
                        <div className="text-[10px]">OSB NF 1,8cm</div>
                        <div className="text-[10px]">Install-Ebene 5,0cm</div>
                        <div className="text-[10px]">
                          3-Schichtplatte Fichte sicht 1,9cm
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-start justify-center px-2"
                    style={{ minHeight: "60px" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <div className="grid grid-cols-2 gap-4 w-full text-left">
                      <div
                        className={`text-[10px] ${textColorClasses} opacity-80 leading-tight`}
                      >
                        <div className="font-bold text-[10px]">Aufbau b</div>
                        <div className="text-[10px]">
                          Parkett Eiche - Schwimmend verlegt
                        </div>
                        <div className="text-[10px]">
                          Flies Unterlegbahn 0,2cm
                        </div>
                        <div className="text-[10px]">OSB 2,2cm</div>
                        <div className="text-[10px]">FJI Träger 36,0/8,9cm</div>
                        <div className="text-[10px]">
                          Steico Holzfaserdämmung
                        </div>
                        <div className="text-[10px]">
                          H2O Zementfaserplatte 1,25cm
                        </div>
                      </div>
                      <div
                        className={`text-[10px] ${textColorClasses} opacity-80 leading-tight`}
                      >
                        <div className="font-bold text-[10px]">Element c</div>
                        <div className="text-[10px]">Zugstab</div>
                        <div className="text-[10px]">&nbsp;</div>
                        <div className="font-bold text-[10px]">Element d</div>
                        <div className="text-[10px]">Fundament</div>
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Image 1 - first column, first row */}
                  <motion.div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "4/3" }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
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
                  </motion.div>
                  {/* Image 2 - second column, first row */}
                  <motion.div
                    className="relative overflow-hidden"
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
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    quality={85}
                    strategy="client"
                    enableCache={true}
                    isInteractive={false}
                    isAboveFold={false}
                    isCritical={false}
                  />
                  </motion.div>
                  {/* Main text - third column, first row */}
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <p
                      className={`text-sm lg:text-base ${textColorClasses} leading-relaxed text-left`}
                    >
                      {displayText}
                    </p>
                  </motion.div>
                  {/* Horizontal line spanning all 3 columns */}
                  <div
                    className={`col-span-3 h-px w-full ${backgroundColor === "black" ? "bg-gray-700" : "bg-gray-300"} my-2`}
                  ></div>
                  {/* Second row: description1, description2, empty cell under text */}
                  <motion.div
                    className="flex items-start justify-center px-2"
                    style={{ minHeight: "60px" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="grid grid-cols-2 gap-4 w-full text-left">
                      <div
                        className={`text-[10px] ${textColorClasses} opacity-80 leading-tight`}
                      >
                        <div className="font-bold text-[10px]">Aufbau a</div>
                        <div className="text-[10px]">
                          Holzlattung Lärche Natur 5x4cm
                        </div>
                        <div className="text-[10px]">
                          ALU Traglattung 2,5cm + 2,0cm Abstandhalter
                        </div>
                        <div className="text-[10px]">
                          Foliendach UV-beständig RAL9005
                        </div>
                        <div className="text-[10px]">Rauschalung 2,4cm</div>
                        <div className="text-[10px]">Konterlattung 5,0cm</div>
                      </div>
                      <div
                        className={`text-[10px] ${textColorClasses} opacity-80 leading-tight`}
                      >
                        <div className="text-[10px]">&nbsp;</div>
                        <div className="text-[10px]">Holzfaserplatte 4,0cm</div>
                        <div className="text-[10px]">
                          Sparren FJI 9x32cm + Steico Holzfaserdämmung
                        </div>
                        <div className="text-[10px]">OSB NF 1,8cm</div>
                        <div className="text-[10px]">Install-Ebene 5,0cm</div>
                        <div className="text-[10px]">
                          3-Schichtplatte Fichte sicht 1,9cm
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-start justify-center px-2"
                    style={{ minHeight: "60px" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <div className="grid grid-cols-2 gap-4 w-full text-left">
                      <div
                        className={`text-[10px] ${textColorClasses} opacity-80 leading-tight`}
                      >
                        <div className="font-bold text-[10px]">Aufbau b</div>
                        <div className="text-[10px]">
                          Parkett Eiche - Schwimmend verlegt
                        </div>
                        <div className="text-[10px]">
                          Flies Unterlegbahn 0,2cm
                        </div>
                        <div className="text-[10px]">OSB 2,2cm</div>
                        <div className="text-[10px]">FJI Träger 36,0/8,9cm</div>
                        <div className="text-[10px]">
                          Steico Holzfaserdämmung
                        </div>
                        <div className="text-[10px]">
                          H2O Zementfaserplatte 1,25cm
                        </div>
                      </div>
                      <div
                        className={`text-[10px] ${textColorClasses} opacity-80 leading-tight`}
                      >
                        <div className="font-bold text-[10px]">Element c</div>
                        <div className="text-[10px]">Zugstab</div>
                        <div className="text-[10px]">&nbsp;</div>
                        <div className="font-bold text-[10px]">Element d</div>
                        <div className="text-[10px]">Fundament</div>
                      </div>
                    </div>
                  </motion.div>
                  <div></div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className={`${containerClasses}`}>
          <div
            className={`text-center mt-8 text-sm px-4 md:px-8 ${backgroundColor === "black" ? "text-gray-400" : "text-gray-500"}`}
          >
            {isMobile ? (
              <p>Mobile layout: Text above, images below in responsive grid</p>
            ) : (
              <p>
                Desktop layout: 3 columns with text {textPosition}, images{" "}
                {textPosition === "left"
                  ? "center and right"
                  : "left and center"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
