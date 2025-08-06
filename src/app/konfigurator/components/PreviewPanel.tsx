/**
 * PreviewPanel - Image Preview Component
 *
 * Handles the sticky preview panel with image display and navigation.
 * OPTIMIZED: Intelligent preloading, predictive navigation, smooth transitions
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

interface PreviewPanelProps {
  isMobile?: boolean;
  className?: string;
}

export default function PreviewPanel({
  isMobile = false,
  className = "",
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextImagePath, setNextImagePath] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

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

  // Get current image path
  const currentImagePath = useMemo(() => {
    return ImageManager.getPreviewImage(configuration, activeView);
  }, [configuration, activeView]);

  // Get available views
  const availableViews = useMemo(() => {
    return ImageManager.getAvailableViews(
      configuration,
      hasPart2BeenActive,
      hasPart3BeenActive
    );
  }, [configuration, hasPart2BeenActive, hasPart3BeenActive]);

  // ENHANCED: Intelligent preloading with current view context
  useEffect(() => {
    if (configuration) {
      startTransition(() => {
        // Use high priority for initial load, normal for updates
        const priority = !isPending ? "high" : "normal";
        ImageManager.preloadImages(configuration, activeView, priority);
      });
    }
  }, [configuration, activeView, isPending]);

  // ENHANCED: Predictive preloading for adjacent views
  useEffect(() => {
    if (configuration && availableViews.length > 1) {
      // Preload predicted next views in background
      const predictedViews = ImageManager.getPredictedNextViews(
        configuration,
        activeView,
        hasPart2BeenActive,
        hasPart3BeenActive
      );

      // Preload next likely images in background
      predictedViews.forEach((view, index) => {
        setTimeout(
          () => {
            ImageManager.preloadSpecificView(configuration, view);
          },
          100 + index * 50
        ); // Stagger preloading
      });
    }
  }, [
    configuration,
    activeView,
    availableViews,
    hasPart2BeenActive,
    hasPart3BeenActive,
  ]);

  // Listen for view switching signals from the store
  useEffect(() => {
    if (shouldSwitchToView && shouldSwitchToView !== activeView) {
      handleViewTransition(shouldSwitchToView as ViewType);
      clearViewSwitchSignal();
    }
  }, [shouldSwitchToView, activeView, clearViewSwitchSignal]);

  // Reset to exterior view if current view becomes unavailable
  useEffect(() => {
    if (!availableViews.includes(activeView)) {
      handleViewTransition("exterior");
    }
  }, [availableViews, activeView]);

  // ENHANCED: Smooth view transition with preloading
  const handleViewTransition = useCallback(
    async (newView: ViewType) => {
      if (newView === activeView || isTransitioning) return;

      setIsTransitioning(true);

      try {
        // Pre-fetch the new image if not already cached
        if (configuration) {
          const newImagePath = ImageManager.getPreviewImage(
            configuration,
            newView
          );
          setNextImagePath(newImagePath);

          // Ensure the target image is loaded before transition
          await ImageManager.preloadSpecificView(configuration, newView);
        }

        // Small delay for smooth visual transition
        await new Promise((resolve) => setTimeout(resolve, 50));

        startTransition(() => {
          setActiveView(newView);
        });

        // Clean up after transition
        setTimeout(() => {
          setNextImagePath(null);
          setIsTransitioning(false);
        }, 300); // Match CSS transition duration
      } catch (error) {
        console.warn("🖼️ View transition error:", error);
        // Fallback: direct transition without preloading
        startTransition(() => {
          setActiveView(newView);
          setIsTransitioning(false);
          setNextImagePath(null);
        });
      }
    },
    [activeView, isTransitioning, configuration]
  );

  // Navigation handlers with enhanced preloading
  const handlePrevView = useCallback(() => {
    if (isTransitioning) return;

    const currentIndex = availableViews.indexOf(activeView);
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : availableViews.length - 1;
    const prevView = availableViews[prevIndex];

    handleViewTransition(prevView);
  }, [availableViews, activeView, isTransitioning, handleViewTransition]);

  const handleNextView = useCallback(() => {
    if (isTransitioning) return;

    const currentIndex = availableViews.indexOf(activeView);
    const nextIndex =
      currentIndex < availableViews.length - 1 ? currentIndex + 1 : 0;
    const nextView = availableViews[nextIndex];

    handleViewTransition(nextView);
  }, [availableViews, activeView, isTransitioning, handleViewTransition]);

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
            {/* Main image with enhanced loading states */}
            <HybridBlobImage
              path={currentImagePath}
              alt={`${viewLabels[activeView]} - ${configuration?.nest?.name || "Nest Konfigurator"}`}
              fill
              className={`object-contain transition-all duration-300 ease-in-out ${
                isTransitioning
                  ? "opacity-75 scale-105"
                  : "opacity-100 scale-100"
              }`}
              // Strategy optimized for interactive configurator
              strategy="client"
              isInteractive={true}
              enableCache={true}
              // Enhanced loading feedback
              showLoadingSpinner={true}
              // Standard image props
              sizes="(max-width: 1023px) 100vw, 70vw"
              quality={85}
              priority={activeView === "exterior"}
            />

            {/* Loading overlay during transitions */}
            {isTransitioning && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-300">
                <div className="bg-white/90 rounded-full p-3 shadow-lg">
                  <svg
                    className="w-6 h-6 animate-spin text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows - Enhanced with loading states */}
        {availableViews.length > 1 && (
          <>
            <button
              type="button"
              disabled={isTransitioning}
              className={`absolute left-[clamp(0.75rem,2vw,1rem)] top-1/2 transform -translate-y-1/2 rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isTransitioning
                  ? "bg-gray-300/70 cursor-not-allowed"
                  : "bg-white/90 hover:bg-white hover:shadow-xl"
              }`}
              aria-label={`Vorherige Ansicht`}
              onClick={handlePrevView}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)] transition-transform ${
                  isTransitioning ? "opacity-50" : "opacity-100"
                }`}
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
              disabled={isTransitioning}
              className={`absolute right-[clamp(0.75rem,2vw,1rem)] top-1/2 transform -translate-y-1/2 rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isTransitioning
                  ? "bg-gray-300/70 cursor-not-allowed"
                  : "bg-white/90 hover:bg-white hover:shadow-xl"
              }`}
              aria-label={`Nächste Ansicht`}
              onClick={handleNextView}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)] transition-transform ${
                  isTransitioning ? "opacity-50" : "opacity-100"
                }`}
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

        {/* View indicator dots for better UX */}
        {availableViews.length > 2 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {availableViews.map((view, index) => (
              <button
                key={view}
                onClick={() => handleViewTransition(view)}
                disabled={isTransitioning}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  view === activeView
                    ? "bg-white shadow-md scale-125"
                    : "bg-white/50 hover:bg-white/80"
                } ${isTransitioning ? "cursor-not-allowed" : "cursor-pointer"}`}
                aria-label={`Zu ${viewLabels[view]} wechseln`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
