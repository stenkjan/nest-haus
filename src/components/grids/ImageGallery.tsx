"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

interface ImageProps {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images?: ImageProps[];
  useHeroImages?: boolean;
  backgroundColor?: "white" | "gray" | "black";
  maxWidth?: boolean;
}

const VISIBLE_COUNT = 5;

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images: customImages,
  useHeroImages = true,
  backgroundColor = "white",
  maxWidth = true,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Default gallery images using hero images from constants
  const defaultGalleryImages: ImageProps[] = useMemo(() => [
    {
      src: IMAGES.hero.nestHaus1,
      alt: "Hoam House Berg Vision Austria Swiss Holzlattung Lärche",
    },
    {
      src: IMAGES.hero.nestHaus2,
      alt: "Hoam House 7 Module Ansicht Weisse Fassadenplatten",
    },
    {
      src: IMAGES.hero.nestHaus3,
      alt: "Hoam House 3 Gebäude Vogelperspektive Holzlattung Lärche",
    },
    {
      src: IMAGES.hero.nestHaus4,
      alt: "Hoam House 2 Gebäude Schnee Stirnseite Schwarze Trapezblech Fassade",
    },
    {
      src: IMAGES.hero.nestHaus5,
      alt: "Hoam House 6 Module Wald Ansicht Schwarze Fassadenplatten",
    },
    {
      src: IMAGES.hero.nestHaus6,
      alt: "Hoam House 4 Module Ansicht Meer Mediterran Stirnseite Holzlattung Lärche",
    },
    {
      src: IMAGES.hero.nestHaus7,
      alt: "Hoam House Innenperspektive Kalkstein Holz Verglasung Stirnseite",
    },
    {
      src: IMAGES.hero.nestHaus8,
      alt: "Hoam House Innenperspektive Schwarze Innenverkleidung Fichte Parkett Eiche",
    },
  ], []);

  const images = useMemo(() =>
    customImages || (useHeroImages ? defaultGalleryImages : []),
    [customImages, useHeroImages, defaultGalleryImages]
  );

  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  // Reset start index when images array changes
  useEffect(() => {
    setStartIndex(0);
  }, [images]);

  // Optimized animation effect
  useEffect(() => {
    if (!containerRef.current || isInitialLoad || images.length === 0) return;

    let lastTime = performance.now();
    const container = containerRef.current;
    const firstImage = container.firstElementChild as HTMLElement;
    if (!firstImage) return;

    const imageWidth = firstImage.offsetWidth;
    let currentOffset = 0;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!containerRef.current) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Only animate if not hovered
      if (!isHovered) {
        // Move at a constant speed of 30 pixels per second
        currentOffset -= (30 * deltaTime) / 1000;

        // When we've moved one image width, update the start index
        if (Math.abs(currentOffset) >= imageWidth) {
          currentOffset = 0;
          setStartIndex((prev) => (prev + 1) % images.length);
        }

        container.style.transform = `translateX(${currentOffset}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [images, isHovered, isInitialLoad]);

  if (images.length === 0) return null;

  // Render VISIBLE_COUNT + 1 images for seamless transition
  const visibleImages = Array.from(
    { length: VISIBLE_COUNT + 1 },
    (_, i) => images[(startIndex + i) % images.length]
  );

  const bgColorClass = {
    white: "bg-white",
    gray: "bg-gray-50",
    black: "bg-black",
  }[backgroundColor];

  const containerClass = maxWidth ? "w-full max-w-[1536px] mx-auto" : "w-full";

  return (
    <section className={`w-full py-16 ${bgColorClass}`}>
      <div className={containerClass}>
        <div
          className="w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] overflow-x-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={containerRef}
            className="flex"
            style={{
              transform: "translateX(0)",
              width: `${(VISIBLE_COUNT + 1) * 20}%`,
            }}
          >
            {visibleImages.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="w-1/5 h-[clamp(200px,25vw,300px)] flex-shrink-0"
              >
                <div
                  className="w-full h-full relative hover:scale-105 transition-transform duration-500"
                  aria-label={image.alt}
                  role="img"
                >
                  <HybridBlobImage
                    path={image.src}
                    alt={image.alt}
                    strategy="client"
                    isInteractive={true}
                    enableCache={true}
                    fill
                    className="object-cover object-center"
                    sizes="20vw"
                    quality={85}
                    priority={index < 2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
