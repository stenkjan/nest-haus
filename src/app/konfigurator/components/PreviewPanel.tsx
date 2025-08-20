/**
 * PreviewPanel - Image Preview Component
 *
 * Handles the sticky preview panel with image display and navigation.
 * Optimized for performance with simplified memoization and consistent layout.
 */

"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import { HybridBlobImage } from "@/components/images";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { ImageManager } from "../core/ImageManager";
import type { ViewType } from "../types/configurator.types";
import PvModuleOverlay from "./PvModuleOverlay";
import BrightnessOverlay from "./BrightnessOverlay";

interface PreviewPanelProps {
  isMobile?: boolean;
  className?: string;
  isPvOverlayVisible?: boolean;
  isBrightnessOverlayVisible?: boolean;
}

export default function PreviewPanel({
  isMobile = false,
  className = "",
  isPvOverlayVisible = true,
  isBrightnessOverlayVisible = true,
}: PreviewPanelProps) {
  const {
    configuration,
    hasPart2BeenActive,
    hasPart3BeenActive,
    shouldSwitchToView,
    clearViewSwitchSignal,
  } = useConfiguratorStore();
  const [activeView, setActiveView] = useState<ViewType>("exterior");
  const [previewHeight, setPreviewHeight] = useState(
    "clamp(20rem, 40vh, 35rem)"
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  // Calculate preview height for mobile only - WebKit optimized
  useEffect(() => {
    if (!isMobile) return;

    const calculatePreviewHeight = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Calculate height to maintain 16:9 aspect ratio at full width
      const aspectRatioHeight = (screenWidth / 16) * 9;

      // Use responsive sizing that works well with sticky positioning
      // Account for potential address bar changes on mobile browsers
      const maxHeight = Math.min(screenHeight * 0.5, 400);
      const optimalHeight = Math.min(aspectRatioHeight, maxHeight);
      setPreviewHeight(`${optimalHeight}px`);
    };

    calculatePreviewHeight();
    const resizeHandler = () => requestAnimationFrame(calculatePreviewHeight);
    window.addEventListener("resize", resizeHandler);
    window.addEventListener("orientationchange", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("orientationchange", resizeHandler);
    };
  }, [isMobile]);

  // Get available views
  const availableViews = useMemo(() => {
    return ImageManager.getAvailableViews(
      configuration,
      hasPart2BeenActive,
      hasPart3BeenActive
    );
  }, [configuration, hasPart2BeenActive, hasPart3BeenActive]);

  // Get current image path with preloading optimization
  const currentImagePath = useMemo(() => {
    const imagePath = ImageManager.getPreviewImage(configuration, activeView);

    // PERFORMANCE: Connection-aware preload of next likely image
    if (configuration && typeof window !== "undefined") {
      const otherViews = availableViews.filter((view) => view !== activeView);
      if (otherViews.length > 0) {
        // Dynamic import for tree-shaking
        import("@/utils/connectionDetection")
          .then(({ shouldLimitPreloading, getPreloadDelay }) => {
            const delay = shouldLimitPreloading() ? getPreloadDelay() : 100;

            setTimeout(() => {
              const nextView = otherViews[0];
              const nextImagePath = ImageManager.getPreviewImage(
                configuration,
                nextView
              );

              // Use redirect parameter for single-request loading (performance improvement)
              const img = new Image();
              img.src = `/api/images?path=${encodeURIComponent(nextImagePath)}&redirect=true`;
            }, delay);
          })
          .catch(() => {
            // Fallback if connection detection fails
            setTimeout(() => {
              const nextView = otherViews[0];
              const nextImagePath = ImageManager.getPreviewImage(
                configuration,
                nextView
              );
              const img = new Image();
              img.src = `/api/images?path=${encodeURIComponent(nextImagePath)}&redirect=true`;
            }, 200);
          });
      }
    }

    return imagePath;
  }, [configuration, activeView, availableViews]);

  // PERFORMANCE FIX: Create a stable key for the image to prevent loading stale images
  const imageKey = useMemo(() => {
    // Create a unique key that changes when the configuration changes
    // This ensures HybridBlobImage completely re-renders with the new path
    return `${currentImagePath}-${JSON.stringify({
      nest: configuration?.nest?.value,
      gebaeudehuelle: configuration?.gebaeudehuelle?.value,
      innenverkleidung: configuration?.innenverkleidung?.value,
      fussboden: configuration?.fussboden?.value,
      pvanlage: configuration?.pvanlage?.value,
      fenster: configuration?.fenster?.value,
    })}`;
  }, [currentImagePath, configuration]);

  // Listen for view switching signals from the store (manual navigation)
  useEffect(() => {
    if (shouldSwitchToView && shouldSwitchToView !== activeView) {
      startTransition(() => {
        setActiveView(shouldSwitchToView as ViewType);
        clearViewSwitchSignal();
      });
    }
  }, [shouldSwitchToView, activeView, clearViewSwitchSignal]);

  // Reset to exterior view if current view becomes unavailable
  useEffect(() => {
    if (!availableViews.includes(activeView)) {
      startTransition(() => {
        setActiveView("exterior");
      });
    }
  }, [availableViews, activeView]);

  // Navigation handlers
  const handlePrevView = useCallback(() => {
    startTransition(() => {
      const currentIndex = availableViews.indexOf(activeView);
      const prevIndex =
        currentIndex > 0 ? currentIndex - 1 : availableViews.length - 1;
      setActiveView(availableViews[prevIndex]);
    });
  }, [availableViews, activeView]);

  const handleNextView = useCallback(() => {
    startTransition(() => {
      const currentIndex = availableViews.indexOf(activeView);
      const nextIndex =
        currentIndex < availableViews.length - 1 ? currentIndex + 1 : 0;
      setActiveView(availableViews[nextIndex]);
    });
  }, [availableViews, activeView]);

  // Preload images for the current configuration, immediate
  useEffect(() => {
    if (configuration) {
      // PERFORMANCE FIX: Don't use startTransition for preloading - we want immediate loading
      ImageManager.preloadImages(configuration);
    }
  }, [configuration]);

  // View labels for display and accessibility
  const viewLabels = {
    exterior: "Außenansicht",
    stirnseite: "Stirnseite",
    interior: "Innenansicht",
    pv: "PV-Anlage",
    fenster: "Fenster & Türen",
  };

  // Simplified container style - consistent with right panel
  const containerStyle = useMemo(() => {
    if (isMobile) {
      // Mobile: use calculated height, sticky positioning handled by parent
      return {
        height: previewHeight,
        width: "100%",
      };
    }
    // Desktop: use full available height (no extra padding since it's handled by parent)
    return {
      height: "100%",
      width: "100%",
    };
  }, [isMobile, previewHeight]);

  return (
    <div
      ref={previewRef}
      className={`preview-panel flex flex-col relative ${className}`}
      style={containerStyle}
    >
      {/* Image Container - full width and height usage */}
      <div
        className="h-full w-full relative"
        style={{ backgroundColor: "white" }}
      >
        {/* Image filling the entire container */}
        <div className="relative w-full h-full">
          <div className="relative w-full h-full">
            {/* Main image */}
            <HybridBlobImage
              key={imageKey}
              path={currentImagePath}
              alt={`${viewLabels[activeView]} - ${configuration?.nest?.name || "Nest Konfigurator"}`}
              fill
              className="transition-opacity duration-300 object-contain"
              // Strategy optimized for interactive configurator
              strategy="client"
              isInteractive={true}
              enableCache={true}
              // Standard image props
              sizes="(max-width: 1023px) 100vw, 70vw"
              quality={85}
              priority={activeView === "exterior"}
            />

            {/* PV Module Overlay - only show on exterior view when PV is selected */}
            {activeView === "exterior" &&
              configuration?.pvanlage &&
              configuration?.pvanlage?.quantity &&
              configuration?.pvanlage?.quantity > 0 &&
              configuration?.nest && (
                <PvModuleOverlay
                  nestSize={
                    configuration.nest.value as
                      | "nest80"
                      | "nest100"
                      | "nest120"
                      | "nest140"
                      | "nest160"
                  }
                  moduleCount={configuration.pvanlage.quantity}
                  isVisible={isPvOverlayVisible}
                  className="opacity-90"
                />
              )}

            {/* Brightness Overlay - only show on stirnseite view when belichtungspaket is selected */}
            {activeView === "stirnseite" &&
              configuration?.beleuchtungspaket && (
                <BrightnessOverlay
                  brightnessLevel={
                    configuration.beleuchtungspaket.value as
                      | "light"
                      | "medium"
                      | "bright"
                  }
                  isVisible={isBrightnessOverlayVisible}
                  className="opacity-90"
                />
              )}
          </div>
        </div>

        {/* Navigation Arrows - Only show if multiple views available */}
        {availableViews.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-[clamp(0.75rem,2vw,1rem)] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Vorherige Ansicht`}
              onClick={handlePrevView}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
              type="button"
              className="absolute right-[clamp(0.75rem,2vw,1rem)] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Nächste Ansicht`}
              onClick={handleNextView}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

      {/* REMOVED: Flex-1 spacer and excessive performance monitoring */}
    </div>
  );
}
