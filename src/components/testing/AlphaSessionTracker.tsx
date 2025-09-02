"use client";

import { useEffect } from "react";
import { useAlphaSessionTracking } from "@/hooks/useAlphaSessionTracking";

/**
 * Global session tracker for alpha test
 * Automatically tracks user interactions when alpha test is active
 */
export default function AlphaSessionTracker() {
  const { isTrackingActive, trackButtonClick, trackFormInteraction, trackPageVisit } =
    useAlphaSessionTracking();

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
        console.log("🔍 Click event: skipped (test popup element)", target);
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
    const handleFormFocus = (event: FocusEvent) => {
      // Skip focus events as they're not meaningful user interactions
      // We'll track changes and submissions instead
      return;
    };

    const handleFormBlur = (event: FocusEvent) => {
      // Skip blur events as they're not meaningful user interactions
      return;
    };

    const handleFormChange = (event: Event) => {
      const target = event.target as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement;

      if (!target || !isFormElement(target)) return;

      // Skip if it's part of the test popup
      if (isTestPopupElement(target as HTMLElement)) {
        console.log("🔍 Form change: skipped (test popup element)", target);
        return;
      }

      // Skip configurator-related form elements (these are tracked separately)
      const isConfiguratorElement = 
        window.location.pathname === '/konfigurator' && 
        (target.closest('.configurator-panel') || 
         target.closest('[data-configurator]') ||
         target.name?.includes('config') ||
         target.id?.includes('config'));

      if (isConfiguratorElement) {
        console.log("🔍 Form change: skipped (configurator element)", target);
        return;
      }

      const fieldName =
        target.name ||
        target.id ||
        (target as HTMLInputElement | HTMLTextAreaElement).placeholder ||
        "unnamed_field";
      const fieldType = target.type || target.tagName.toLowerCase();
      const formId = target.form?.id || target.closest("form")?.id || undefined;

      // Don't store sensitive values (passwords, etc.)
      const value =
        target.type === "password"
          ? "[HIDDEN]"
          : target.type === "email"
            ? "[EMAIL]"
            : target.value.length > 50
              ? "[LONG_TEXT]"
              : target.value;

      console.log("📝 Tracking form change:", {
        fieldName,
        fieldType,
        formId,
        value: value.substring(0, 20),
        path: window.location.pathname,
      });

      trackFormInteraction(fieldName, fieldType, "change", value, formId);
    };

    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      if (!form) return;

      // Skip if it's part of the test popup
      if (isTestPopupElement(form)) {
        console.log("🔍 Form submit: skipped (test popup element)", form);
        return;
      }

      const formId = form.id || form.className || "unnamed_form";

      console.log("📝 Tracking form submit:", {
        formId,
        path: window.location.pathname,
      });

      trackFormInteraction(formId, "form", "submit", undefined, formId);
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
  }, [isTrackingActive, trackButtonClick, trackFormInteraction, trackPageVisit]);

  // This component doesn't render anything
  return null;
}

// Helper function to check if element is a form element
function isFormElement(
  element: Element
): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.tagName === "SELECT"
  );
}
