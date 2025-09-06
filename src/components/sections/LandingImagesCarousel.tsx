"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface LandingImagesCarouselProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: "white" | "gray" | "black";
  maxWidth?: boolean;
  intervalMs?: number;
}

const LandingImagesCarousel: React.FC<LandingImagesCarouselProps> = ({
  title = "Bildergalerie",
  subtitle = "Einblicke in NEST-Haus",
  backgroundColor = "white",
  maxWidth = true,
  intervalMs = 5000,
}) => {
  const images = useMemo(
    () => [
      { path: IMAGES.hero.nestHaus1, alt: "NEST-Haus Bild 1" },
      { path: IMAGES.hero.nestHaus2, alt: "NEST-Haus Bild 2" },
      { path: IMAGES.hero.nestHaus3, alt: "NEST-Haus Bild 3" },
      { path: IMAGES.hero.nestHaus4, alt: "NEST-Haus Bild 4" },
      { path: IMAGES.hero.nestHaus5, alt: "NEST-Haus Bild 5" },
      { path: IMAGES.hero.nestHaus6, alt: "NEST-Haus Bild 6" },
      { path: IMAGES.hero.nestHaus7, alt: "NEST-Haus Bild 7" },
      { path: IMAGES.hero.nestHaus8, alt: "NEST-Haus Bild 8" },
    ],
    []
  );

  // Create infinite loop by duplicating images
  const infiniteImages = useMemo(
    () => [...images, ...images, ...images],
    [images]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState<number>(4);
  const [isHovered, setIsHovered] = useState(false);
  const isAnimatingRef = useRef(false);

  const bgClass =
    backgroundColor === "gray"
      ? "bg-gray-50"
      : backgroundColor === "black"
      ? "bg-black"
      : "bg-white";

  const containerClass = maxWidth
    ? "w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8"
    : "w-full px-[7.5%]";

  const goTo = (index: number) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // Handle seamless infinite looping
    let newIndex = index;
    if (index >= images.length * 2) {
      // If we're past the second set, jump to the start of the second set (seamless)
      newIndex = images.length;
    } else if (index < images.length) {
      // If we're before the first set, jump to the end of the second set (seamless)
      newIndex = images.length * 2 - 1;
    }

    setCurrentIndex(newIndex);

    // After transition completes, reset position if needed for seamless loop
    setTimeout(() => {
      if (newIndex >= images.length * 2) {
        setCurrentIndex(images.length);
      } else if (newIndex < images.length) {
        setCurrentIndex(images.length * 2 - 1);
      }
      isAnimatingRef.current = false;
    }, 600);
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  // Responsive items per view (desktop only) - based on fixed image width
  useEffect(() => {
    const updateItems = () => {
      const width = window.innerWidth;
      // Each image is ~400px wide (including padding), so calculate how many fit
      const imageWidth = 400;
      const maxItems = Math.floor(width / imageWidth);
      setItemsPerView(Math.max(1, Math.min(maxItems, images.length)));
    };
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, [images.length]);

  // Auto-advance with seamless looping
  useEffect(() => {
    const timer = setInterval(() => {
      // Always move forward, the goTo function handles the looping
      next();
    }, Math.max(2000, intervalMs));
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, intervalMs]);

  // Arrow keys
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Track width based on infinite images
  const trackStyle: React.CSSProperties = {
    width: `${infiniteImages.length * 400}px`,
    transform: `translateX(-${currentIndex * 400}px)`,
    transition: "transform 600ms ease-in-out",
  };

  return (
    <section className={`w-full ${bgClass} hidden md:block`}>
      <div className={containerClass}>
        <div
          className="relative w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full">
            <div className="flex items-center" style={trackStyle}>
              {infiniteImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 px-2"
                  style={{ width: "400px" }}
                >
                  <div className="relative w-full transition-transform duration-300 hover:scale-105 hover:z-10">
                    <HybridBlobImage
                      path={img.path}
                      alt={img.alt}
                      strategy="client"
                      isInteractive={true}
                      enableCache={true}
                      width={400}
                      height={225}
                      className="object-cover"
                      sizes="400px"
                      priority={idx === 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - only visible on hover */}
          {infiniteImages.length > itemsPerView && isHovered && (
            <>
              <button
                onClick={prev}
                aria-label="Vorheriges Bild"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-all duration-200 hover:scale-110 z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Nächstes Bild"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-all duration-200 hover:scale-110 z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default LandingImagesCarousel;
