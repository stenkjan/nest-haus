"use client";

import { useEffect } from "react";
import { useAlphaSessionTracking } from "@/hooks/useAlphaSessionTracking";

/**
 * Global session tracker for alpha test
 * Automatically tracks user interactions when alpha test is active
 */
export default function AlphaSessionTracker() {
  const {
    isTrackingActive,
    trackButtonClick,
    trackFormInteraction,
    trackPageVisit,
  } = useAlphaSessionTracking();

  useEffect(() => {
    console.log(
      "🔍 AlphaSessionTracker effect - isTrackingActive:",
      isTrackingActive
    );

    if (!isTrackingActive) {
      console.log("🔍 Tracking not active - skipping event listeners");
      return;
    }

    console.log("🔍 Setting up global event listeners for session tracking");

    // Track initial page visit
    trackPageVisit(window.location.pathname, document.title);

    // Track navigation changes (for SPA routing)
    let currentPath = window.location.pathname;
    const checkForNavigation = () => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        console.log("📄 Navigation detected:", currentPath);
        trackPageVisit(currentPath, document.title);
      }
    };

    // Check for navigation changes periodically
    const navigationInterval = setInterval(checkForNavigation, 1000);

    // Helper function to check if element is part of test popup
    const isTestPopupElement = (element: HTMLElement): boolean => {
      // Check if element or any parent has test-related classes/IDs
      let current: HTMLElement | null = element;
      while (current && current !== document.body) {
        const className = String(current.className || "");
        const id = String(current.id || "");

        // Check for test popup indicators
        if (
          className.includes("alpha-test") ||
          className.includes("usability-test") ||
          className.includes("test-popup") ||
          id.includes("alpha-test") ||
          id.includes("usability-test") ||
          id.includes("test-popup") ||
          current.getAttribute("data-test-popup") === "true"
        ) {
          return true;
        }

        // Check for usability test popup specific patterns
        if (
          // Fixed positioned overlay with high z-index (test popup container)
          (className.includes("fixed") &&
            className.includes("inset-0") &&
            className.includes("z-50")) ||
          // Backdrop blur with border (test popup content)
          (className.includes("backdrop-blur") &&
            className.includes("border-2") &&
            className.includes("border-blue-300")) ||
          // Check for test-specific text content
          (current.textContent &&
            (current.textContent.includes("Schritt") ||
              current.textContent.includes("Nächster Schritt") ||
              current.textContent.includes("Ihre Antwort") ||
              current.textContent.includes("Alpha Test") ||
              current.textContent.includes("Usability Test"))) ||
          // Check for rating buttons (1-6 scale)
          (current.tagName === "BUTTON" &&
            /^[1-6]$/.test(current.textContent?.trim() || ""))
        ) {
          return true;
        }

        current = current.parentElement;
      }
      return false;
    };

    // Track all button clicks globally
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) {
        console.log("🔍 Click event: no target");
        return;
      }

      // Skip if it's part of the test popup
      if (isTestPopupElement(target)) {
        console.log("🔍 Click event: skipped (test popup element)", {
          tagName: target.tagName,
          textContent: target.textContent?.trim(),
          className: target.className,
          id: target.id,
        });
        return;
      }

      // Check if it's a button or clickable element
      const isButton =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("cursor-pointer");

      console.log("🔍 Click event:", {
        tagName: target.tagName,
        isButton,
        className: target.className,
        id: target.id,
        textContent: target.textContent?.trim()?.substring(0, 50),
        path: window.location.pathname,
        isTrackingActive,
      });

      if (isButton) {
        const buttonText =
          target.textContent?.trim() ||
          target.getAttribute("aria-label") ||
          target.getAttribute("title") ||
          "Unknown Button";

        const buttonId =
          target.id || target.getAttribute("data-testid") || undefined;
        const elementType = target.tagName.toLowerCase();

        // Get click coordinates relative to viewport
        const coordinates = {
          x: event.clientX,
          y: event.clientY,
        };

        console.log("🖱️ Tracking button click:", {
          buttonText,
          buttonId,
          elementType,
          path: window.location.pathname,
        });

        trackButtonClick(buttonText, buttonId, elementType, coordinates);
      }
    };

    // Track meaningful form interactions (skip focus/blur, focus on changes and submissions)
    const handleFormFocus = (_event: FocusEvent) => {
      // Skip focus events as they're not meaningful user interactions
      // We'll track changes and submissions instead
      return;
    };

    const handleFormBlur = (_event: FocusEvent) => {
      // Skip blur events as they're not meaningful user interactions
      return;
    };

    const handleFormChange = (_event: Event) => {
      // Skip all form changes - we only want to track button and link clicks
      // Form interactions are not meaningful for user behavior analysis
      return;
    };

    const handleFormSubmit = (_event: SubmitEvent) => {
      // Skip all form submissions - we only want to track button and link clicks
      return;
    };

    // Add event listeners
    console.log("🔍 Adding event listeners for session tracking");
    document.addEventListener("click", handleClick, true);
    document.addEventListener("focusin", handleFormFocus, true);
    document.addEventListener("focusout", handleFormBlur, true);
    document.addEventListener("change", handleFormChange, true);
    document.addEventListener("submit", handleFormSubmit, true);

    console.log(
      "✅ Global interaction tracking enabled - all listeners attached"
    );

    return () => {
      console.log("🔍 Removing event listeners for session tracking");
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("focusin", handleFormFocus, true);
      document.removeEventListener("focusout", handleFormBlur, true);
      document.removeEventListener("change", handleFormChange, true);
      document.removeEventListener("submit", handleFormSubmit, true);
      clearInterval(navigationInterval);
      console.log("✅ Event listeners and navigation tracking removed");
    };
  }, [
    isTrackingActive,
    trackButtonClick,
    trackFormInteraction,
    trackPageVisit,
  ]);

  // This component doesn't render anything
  return null;
}

// Helper function to check if element is a form element
function _isFormElement(
  element: Element
): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.tagName === "SELECT"
  );
}
