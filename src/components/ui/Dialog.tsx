"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useIOSViewport, getIOSViewportStyles } from "@/hooks/useIOSViewport";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  children,
  transparent = false,
  className = "",
}: DialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const savedScrollPosition = useRef<{
    window: number;
    configuratorPanel?: number;
  }>({ window: 0 });

  // Get stable iOS viewport dimensions
  const viewport = useIOSViewport();
  const iosStyles = getIOSViewportStyles(viewport);

  // Handle escape key and scroll position
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Save the current scroll position to avoid stale closure
    const currentScrollPosition = savedScrollPosition.current;

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = "hidden";

      // Save current scroll positions
      const windowScrollY = window.scrollY || window.pageYOffset || 0;
      savedScrollPosition.current.window = windowScrollY;

      // For configurator: also save the right panel scroll position
      const isKonfigurator = window.location.pathname.includes("/konfigurator");
      if (isKonfigurator) {
        // Find the configurator right panel based on screen size
        const isMobile = window.innerWidth < 1024;
        let configuratorPanel: HTMLElement | null = null;

        if (isMobile) {
          // Mobile: Find the scrollable content div within the mobile layout
          // In mobile, the scroll actually happens on the document/window, but we want to check if there's panel scrolling too
          const _mobileScrollableDiv = document.querySelector(
            ".lg\\:hidden .relative.bg-white"
          ) as HTMLElement;
          // For mobile configurator, we use document scroll, not panel scroll
          configuratorPanel =
            (document.scrollingElement as HTMLElement) ||
            document.documentElement;
        } else {
          // Desktop: Find the right panel with overflow-y-auto
          configuratorPanel = document.querySelector(
            ".configurator-right-panel.overflow-y-auto"
          ) as HTMLElement;
        }

        if (configuratorPanel) {
          if (isMobile) {
            // For mobile, save document scroll position (which is already saved as windowScrollY)
            savedScrollPosition.current.configuratorPanel = windowScrollY;
          } else {
            // For desktop, save panel scroll position
            savedScrollPosition.current.configuratorPanel =
              configuratorPanel.scrollTop;
          }
        }
      }

      // iOS Safari: Additional scroll prevention
      if (viewport.isIOSSafari) {
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = `-${windowScrollY}px`;
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);

      if (viewport.isIOSSafari) {
        // Restore window scroll position on iOS Safari
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";

        if (scrollY) {
          const windowScrollPosition = parseInt(scrollY || "0") * -1;
          window.scrollTo(0, windowScrollPosition);
        }

        // For configurator: restore the right panel scroll position
        const isKonfigurator =
          window.location.pathname.includes("/konfigurator");
        if (
          isKonfigurator &&
          currentScrollPosition.configuratorPanel !== undefined
        ) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            const isMobile = window.innerWidth < 1024;

            if (isMobile) {
              // Mobile: Scroll is already restored by window.scrollTo above
              // No additional action needed since mobile uses document scroll
            } else {
              // Desktop: Find the right panel with overflow-y-auto and restore its scroll
              const configuratorPanel = document.querySelector(
                ".configurator-right-panel.overflow-y-auto"
              ) as HTMLElement;
              if (
                configuratorPanel &&
                currentScrollPosition.configuratorPanel !== undefined
              ) {
                configuratorPanel.scrollTop =
                  currentScrollPosition.configuratorPanel;
              }
            }
          }, 10);
        }
      } else {
        // For non-iOS or non-Safari browsers, still restore configurator panel if needed
        const isKonfigurator =
          window.location.pathname.includes("/konfigurator");
        if (
          isKonfigurator &&
          currentScrollPosition.configuratorPanel !== undefined
        ) {
          setTimeout(() => {
            const isMobile = window.innerWidth < 1024;

            if (isMobile) {
              // Mobile: Restore document scroll position
              window.scrollTo(0, currentScrollPosition.configuratorPanel || 0);
            } else {
              // Desktop: Find the right panel with overflow-y-auto and restore its scroll
              const configuratorPanel = document.querySelector(
                ".configurator-right-panel.overflow-y-auto"
              ) as HTMLElement;
              if (
                configuratorPanel &&
                currentScrollPosition.configuratorPanel !== undefined
              ) {
                configuratorPanel.scrollTop =
                  currentScrollPosition.configuratorPanel;
              }
            }
          }, 10);
        }
      }

      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, viewport.isIOSSafari]);

  // Handle click outside
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (
      contentRef.current &&
      !contentRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md ${className}`}
          onClick={handleBackdropClick}
          style={{
            backgroundColor: transparent
              ? "rgba(0, 0, 0, 0.4)"
              : "rgba(0, 0, 0, 0.8)",
            // Apply stable iOS dimensions
            ...iosStyles,
            // Use stable height on iOS Safari
            ...(viewport.isIOSSafari && {
              height: "var(--ios-vh)",
              width: "var(--ios-vw)",
            }),
          }}
        >
          <motion.div
            ref={contentRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full flex items-center justify-center"
            style={{
              // Ensure content container also uses stable dimensions on iOS
              ...(viewport.isIOSSafari && {
                height: "var(--ios-vh)",
                width: "var(--ios-vw)",
              }),
            }}
          >
            {children}
          </motion.div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-[clamp(0.75rem,1.5vw,1rem)] right-[clamp(0.75rem,1.5vw,1rem)] bg-white hover:bg-gray-100 rounded-full p-[clamp(0.375rem,0.8vw,0.5rem)] shadow-lg transition-all duration-200 hover:scale-110 z-[10000]"
          >
            <svg
              className="w-[clamp(1rem,2vw,1.5rem)] h-[clamp(1rem,2vw,1.5rem)] text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
