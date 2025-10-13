"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image, { ImageProps } from "next/image";
import {
  ImageProtection,
  WatermarkOptions,
} from "@/lib/security/ImageProtection";

export interface ProtectedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  mobileSrc?: string;
  enableWatermark?: boolean;
  watermarkOptions?: Partial<WatermarkOptions>;
  protectionLevel?: "basic" | "standard" | "strict";
  fallbackSrc?: string;
  enableCanvasReplacement?: boolean;
  onProtectionApplied?: () => void;
  onError?: (error: Error) => void;
}

/**
 * ProtectedImage component
 * Integrates with existing image system while adding comprehensive protection
 */
export default function ProtectedImage({
  src,
  mobileSrc,
  enableWatermark = true,
  watermarkOptions = {},
  protectionLevel = "standard",
  fallbackSrc,
  enableCanvasReplacement = true,
  onProtectionApplied,
  onError,
  className = "",
  alt,
  ...imageProps
}: ProtectedImageProps) {
  const [protectedSrc, setProtectedSrc] = useState<string>(src);
  const [isProtected, setIsProtected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Memoize watermark options to prevent re-renders
  const finalWatermarkOptions = useMemo(() => {
    const defaultWatermarkOptions: WatermarkOptions = {
      text: "© NEST-Haus",
      fontSize: 20,
      fontFamily: "Arial, sans-serif",
      color: "rgba(255, 255, 255, 0.6)",
      opacity: 0.6,
      position: "bottom-right",
      margin: 15,
    };

    return {
      ...defaultWatermarkOptions,
      ...watermarkOptions,
    };
  }, [watermarkOptions]);

  // Memoize image source function to prevent re-renders
  const getImageSource = useCallback((): string => {
    if (typeof window !== "undefined" && mobileSrc) {
      const isMobile =
        window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      return isMobile ? mobileSrc : src;
    }
    return src;
  }, [src, mobileSrc]);

  useEffect(() => {
    const applyProtection = async () => {
      try {
        const currentSrc = getImageSource();

        if (enableWatermark && enableCanvasReplacement) {
          // Create watermarked version
          const watermarkedSrc = await ImageProtection.addWatermark(
            currentSrc,
            finalWatermarkOptions
          );
          setProtectedSrc(watermarkedSrc);
        } else {
          setProtectedSrc(currentSrc);
        }

        setIsProtected(true);
        onProtectionApplied?.();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to apply protection");
        console.error("Image protection failed:", error);
        setError(error.message);

        // Fallback to original or fallback source
        setProtectedSrc(fallbackSrc || getImageSource());
        onError?.(error);
      }
    };

    applyProtection();
  }, [
    enableWatermark,
    enableCanvasReplacement,
    finalWatermarkOptions,
    fallbackSrc,
    onProtectionApplied,
    onError,
    getImageSource,
  ]);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement || !isProtected) return;

    // Apply protection based on level
    const protectionConfig = getProtectionConfig(protectionLevel);

    if (protectionConfig.preventRightClick) {
      ImageProtection.preventRightClick(imageElement);
    }

    if (protectionConfig.preventDragDrop) {
      ImageProtection.preventDragDrop(imageElement);
    }

    if (protectionConfig.preventSelection) {
      ImageProtection.preventSelection(imageElement);
    }

    // Add protected class for CSS styling
    imageElement.classList.add(
      "protected-image",
      `protection-${protectionLevel}`
    );

    // Replace with canvas if strict protection is enabled
    if (protectionLevel === "strict" && enableCanvasReplacement) {
      const replaceWithCanvas = async () => {
        try {
          const canvas = await ImageProtection.replaceImageWithCanvas(
            imageElement,
            {
              enableWatermark,
              watermarkOptions: finalWatermarkOptions,
              preventRightClick: true,
              preventDragDrop: true,
              preventSelection: true,
              replaceWithCanvas: true,
            }
          );

          // Replace image with canvas
          if (imageElement.parentNode && canvasRef.current) {
            canvasRef.current.replaceWith(canvas);
          }
        } catch (err) {
          console.error("Canvas replacement failed:", err);
        }
      };

      // Wait for image to load before replacing
      if (imageElement.complete) {
        replaceWithCanvas();
      } else {
        imageElement.addEventListener("load", replaceWithCanvas, {
          once: true,
        });
      }
    }
  }, [
    isProtected,
    protectionLevel,
    enableWatermark,
    enableCanvasReplacement,
    finalWatermarkOptions,
  ]);

  // Generate protection classes
  const protectionClasses = [
    "protected-image",
    `protection-${protectionLevel}`,
    enableWatermark ? "watermarked" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Handle image load error
  const handleImageError = () => {
    if (fallbackSrc && protectedSrc !== fallbackSrc) {
      setProtectedSrc(fallbackSrc);
    } else {
      setError("Failed to load image");
    }
  };

  if (error && !fallbackSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-500 ${className}`}
        style={{ width: imageProps.width, height: imageProps.height }}
      >
        <span className="text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <>
      <Image
        ref={imageRef}
        src={protectedSrc}
        alt={alt || ""}
        className={protectionClasses}
        onError={handleImageError}
        {...imageProps}
        // Override some props for security
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          ...imageProps.style,
          userSelect: "none",
          WebkitUserSelect: "none",
          msUserSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      />

      {/* Hidden canvas for strict protection mode */}
      {protectionLevel === "strict" && (
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          className="protected-canvas"
        />
      )}
    </>
  );
}

/**
 * Get protection configuration based on level
 */
function getProtectionConfig(level: "basic" | "standard" | "strict") {
  switch (level) {
    case "basic":
      return {
        preventRightClick: true,
        preventDragDrop: true,
        preventSelection: false,
      };
    case "standard":
      return {
        preventRightClick: true,
        preventDragDrop: true,
        preventSelection: true,
      };
    case "strict":
      return {
        preventRightClick: true,
        preventDragDrop: true,
        preventSelection: true,
      };
    default:
      return {
        preventRightClick: true,
        preventDragDrop: true,
        preventSelection: true,
      };
  }
}

/**
 * Hook for using protected images with existing image components
 */
export function useProtectedImage(
  src: string,
  options: {
    enableWatermark?: boolean;
    watermarkOptions?: Partial<WatermarkOptions>;
    protectionLevel?: "basic" | "standard" | "strict";
  } = {}
) {
  const [protectedSrc, setProtectedSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize watermark options to prevent re-renders
  const memoizedWatermarkOptions = useMemo(() => {
    return options.watermarkOptions;
  }, [options.watermarkOptions]);

  useEffect(() => {
    const applyProtection = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (options.enableWatermark) {
          const watermarkedSrc = await ImageProtection.addWatermark(
            src,
            memoizedWatermarkOptions
          );
          setProtectedSrc(watermarkedSrc);
        } else {
          setProtectedSrc(src);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Protection failed");
        setError(error);
        setProtectedSrc(src); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    applyProtection();
  }, [src, options.enableWatermark, memoizedWatermarkOptions]);

  return {
    protectedSrc,
    isLoading,
    error,
    applyProtection: (element: HTMLImageElement) => {
      const config = getProtectionConfig(options.protectionLevel || "standard");

      if (config.preventRightClick) {
        ImageProtection.preventRightClick(element);
      }
      if (config.preventDragDrop) {
        ImageProtection.preventDragDrop(element);
      }
      if (config.preventSelection) {
        ImageProtection.preventSelection(element);
      }
    },
  };
}
