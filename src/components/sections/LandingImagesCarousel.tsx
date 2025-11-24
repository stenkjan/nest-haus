"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface LandingImagesCarouselProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: "white" | "gray" | "black";
  maxWidth?: boolean;
  intervalMs?: number;
}

interface _ImageDescription {
  title: string;
  subtitle: string;
  sectionSlug: string;
}

const LandingImagesCarousel: React.FC<LandingImagesCarouselProps> = ({
  // Unused props kept for future extensibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title = "Bildergalerie",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subtitle = "Einblicke in NEST-Haus",
  backgroundColor = "white",
  maxWidth = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  intervalMs = 5000,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const images = useMemo(
    () => [
      {
        path: IMAGES.hero.nestHaus1,
        mobilePath: IMAGES.hero.mobile.nestHaus1,
        alt: "NEST-Haus Bild 1",
        description: {
          title: "Nest 140",
          subtitle: "Fassadenplatten Weiss",
          sectionSlug: "dein-nest-haus", // Use slug instead of sectionId
        },
      },
      {
        path: IMAGES.hero.nestHaus2,
        mobilePath: IMAGES.hero.mobile.nestHaus2,
        alt: "NEST-Haus Bild 2",
        description: {
          title: "Nest 100",
          subtitle: "Mediterrane Ansicht",
          sectionSlug: "wohnen-ohne-grenzen",
        },
      },
      {
        path: IMAGES.hero.nestHaus3,
        mobilePath: IMAGES.hero.mobile.nestHaus3,
        alt: "NEST-Haus Bild 3",
        description: {
          title: "Nest Interior",
          subtitle: "Kalkstein Verglasung",
          sectionSlug: "zuhause-fuer-ideen",
        },
      },
      {
        path: IMAGES.hero.nestHaus4,
        mobilePath: IMAGES.hero.mobile.nestHaus4,
        alt: "NEST-Haus Bild 4",
        description: {
          title: "Nest 140",
          subtitle: "Vogelperspektive Holzlattung",
          sectionSlug: "wohnen-neu-gedacht",
        },
      },
      {
        path: IMAGES.hero.nestHaus5,
        mobilePath: IMAGES.hero.mobile.nestHaus5,
        alt: "NEST-Haus Bild 5",
        description: {
          title: "Nest 100",
          subtitle: "Stirnseite Trapezblech",
          sectionSlug: "mehr-als-vier-waende",
        },
      },
      {
        path: IMAGES.hero.nestHaus6,
        mobilePath: IMAGES.hero.mobile.nestHaus6,
        alt: "NEST-Haus Bild 6",
        description: {
          title: "Nest Interior",
          subtitle: "Innenverkleidung Fichte, Parkett Eiche",
          sectionSlug: "gestaltung-fuer-visionen",
        },
      },
      {
        path: IMAGES.hero.nestHaus7,
        mobilePath: IMAGES.hero.mobile.nestHaus7,
        alt: "NEST-Haus Bild 7",
        description: {
          title: "Nest 120",
          subtitle: "Wald Ansicht Schwarz",
          sectionSlug: "raum-fuer-ideen",
        },
      },
    ],
    []
  );

  // Create infinite loop by duplicating images
  const infiniteImages = useMemo(
    () => [...images, ...images, ...images],
    [images]
  );

  const [itemsPerView, setItemsPerView] = useState<number>(4);
  const [isHovered, setIsHovered] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const bgClass =
    backgroundColor === "gray"
      ? "bg-gray-50"
      : backgroundColor === "black"
        ? "bg-black"
        : "bg-white";

  const containerClass = maxWidth
    ? "w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8"
    : "w-full";

  // Continuous slow movement speed (pixels per second)
  const movementSpeed = 30; // Adjust this value to control speed

  // Responsive items per view and image sizing
  const [imageWidth, setImageWidth] = useState<number>(400);

  useEffect(() => {
    const updateItems = () => {
      const width = window.innerWidth;

      // Dynamic image sizing based on screen size
      let dynamicImageWidth = 400; // Base size
      if (width >= 1920) {
        // Largest screens: 30% bigger (was 20%, now 30%)
        dynamicImageWidth = 620;
      } else if (width >= 1536) {
        // 2xl screens: 20% bigger (increased from 15%)
        dynamicImageWidth = 580;
      } else if (width >= 1280) {
        // xl screens: 15% bigger (increased from 10%)
        dynamicImageWidth = 540;
      } else if (width >= 1024) {
        // lg screens: 10% bigger (increased from 5%)
        dynamicImageWidth = 500;
      } else if (width >= 768) {
        // md screens: base size
        dynamicImageWidth = 460;
      } else {
        // sm screens: smaller
        dynamicImageWidth = 250;
      }

      setImageWidth(dynamicImageWidth);
      const maxItems = Math.floor(width / dynamicImageWidth);
      setItemsPerView(Math.max(1, Math.min(maxItems, images.length)));
    };
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, [images.length]);

  // Auto-advance with seamless looping
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setTranslateX((prev) => {
        const newTranslate = prev + (movementSpeed * deltaTime) / 1000;

        // Reset position for seamless loop when we've scrolled past one full set
        const totalWidth = images.length * imageWidth;
        if (newTranslate >= totalWidth) {
          return newTranslate - totalWidth;
        }

        return newTranslate;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [imageWidth, images.length, movementSpeed]);

  // Arrow keys for manual control
  useEffect(() => {
    const handleManualScroll = (direction: number) => {
      setTranslateX((prev) => {
        const newTranslate = prev + direction * imageWidth;
        const totalWidth = images.length * imageWidth;

        // Wrap around for seamless loop
        if (newTranslate < 0) {
          return totalWidth + newTranslate;
        } else if (newTranslate >= totalWidth) {
          return newTranslate - totalWidth;
        }

        return newTranslate;
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleManualScroll(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleManualScroll(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [imageWidth, images.length]);

  // Track width based on infinite images and dynamic sizing
  const trackStyle: React.CSSProperties = {
    width: `${infiniteImages.length * imageWidth}px`,
    transform: `translateX(-${translateX}px)`,
    transition: "none", // Smooth continuous animation without CSS transitions
  };

  // Navigation functions for arrow buttons
  const handlePrev = () => {
    setTranslateX((prev) => {
      const newTranslate = prev - imageWidth;
      const totalWidth = images.length * imageWidth;

      if (newTranslate < 0) {
        return totalWidth + newTranslate;
      }

      return newTranslate;
    });
  };

  const handleNext = () => {
    setTranslateX((prev) => {
      const newTranslate = prev + imageWidth;
      const totalWidth = images.length * imageWidth;

      if (newTranslate >= totalWidth) {
        return newTranslate - totalWidth;
      }

      return newTranslate;
    });
  };

  return (
    <section className={`w-full ${bgClass}`}>
      <div className={containerClass}>
        <div
          className="relative w-full overflow-x-hidden pb-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)]">
            <div className="flex items-center" style={trackStyle}>
              {infiniteImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${imageWidth}px` }}
                >
                  <div className="relative w-full transition-transform duration-300 hover:scale-[1.02] hover:z-10">
                    {/* Mobile: Clickable image linking to landing page section */}
                    {isMobile ? (
                      <Link href={`/#${img.description.sectionSlug}`}>
                        <HybridBlobImage
                          path={img.mobilePath}
                          alt={img.alt}
                          strategy="client"
                          isInteractive={true}
                          enableCache={true}
                          width={imageWidth}
                          height={Math.round(imageWidth * 1.333)} // 3:4 on mobile (4/3)
                          className="object-cover"
                          sizes={`${imageWidth}px`}
                          priority={idx === 0}
                        />
                      </Link>
                    ) : (
                      /* Desktop: Image without link wrapper (text overlay has link) */
                      <HybridBlobImage
                        path={img.path}
                        alt={img.alt}
                        strategy="client"
                        isInteractive={true}
                        enableCache={true}
                        width={imageWidth}
                        height={Math.round(imageWidth * 0.5625)} // 16:9 on desktop (9/16)
                        className="object-cover"
                        sizes={`${imageWidth}px`}
                        priority={idx === 0}
                      />
                    )}

                    {/* Description Overlay - Hidden on mobile */}
                    <div className="hidden md:block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4 lg:p-6">
                      {/* Flex container for positioning */}
                      <div className="flex justify-between items-end">
                        {/* Left side - Title and Subtitle */}
                        <div className="text-white flex-1 pr-4">
                          <h3 className="p-primary-small text-white">
                            {img.description.title}
                          </h3>
                          <p className="p-primary-small2 text-gray-200">
                            {img.description.subtitle}
                          </p>
                        </div>

                        {/* Right side - Link */}
                        <div className="flex-shrink-0">
                          <Link
                            href={`/#${img.description.sectionSlug}`}
                            className="inline-flex items-center p-primary-small2 text-white hover:text-gray-200 transition-colors duration-200 group whitespace-nowrap underline"
                          >
                            Weitere Beispiele entdecken
                            <svg
                              className="ml-2 w-4 h-4 transform transition-transform group-hover:translate-x-1"
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
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - only visible on hover */}
          {infiniteImages.length > itemsPerView && isHovered && (
            <>
              <button
                onClick={handlePrev}
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
                onClick={handleNext}
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
