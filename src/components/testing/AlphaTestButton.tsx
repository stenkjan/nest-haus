"use client";

import React, { useState, useEffect } from "react";
import { shouldShowStep1Tooltip } from "./config/TestQuestions";
import UsabilityTestPopup from "./UsabilityTestPopup";

interface AlphaTestButtonProps {
  isEnabled?: boolean;
  shouldAutoOpen?: boolean;
  onAutoOpenHandled?: () => void;
}

export default function AlphaTestButton({
  isEnabled = false,
  shouldAutoOpen = false,
  onAutoOpenHandled,
}: AlphaTestButtonProps) {
  const [isTestActive, setIsTestActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenButton, setHasSeenButton] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasExistingTest, setHasExistingTest] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  // Check if this is an alpha test session
  useEffect(() => {
    // Don't show test button on admin pages or alpha-test intro page
    const isAdminPage = window.location.pathname.startsWith("/admin");
    const isAlphaTestIntroPage = window.location.pathname === "/alpha-test";

    // Only show button if alpha test is explicitly enabled AND user has started a test
    const hasActiveTest = localStorage.getItem("nest-haus-test-session-id");
    const isTestCompleted =
      localStorage.getItem("nest-haus-test-completed") === "true";
    const alphaTestParam = new URLSearchParams(window.location.search).get(
      "alpha-test"
    );

    if (
      isEnabled &&
      !isAdminPage &&
      !isAlphaTestIntroPage &&
      (hasActiveTest || alphaTestParam === "true") &&
      !isTestCompleted
    ) {
      setIsVisible(true);

      // Note: Removed auto-reset logic that was interfering with step progression

      // Check for existing test state (simplified)
      const existingSessionId = localStorage.getItem(
        "nest-haus-test-session-id"
      );

      if (existingSessionId) {
        setHasExistingTest(true);
        setHasSeenButton(true);
      } else {
        setHasExistingTest(false);
      }

      // Check if we should show tooltip for step 1
      setShowTooltip(shouldShowStep1Tooltip());

      // Show button after a short delay
      const timer = setTimeout(() => {
        if (!hasSeenButton) {
          setHasSeenButton(true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }

    return () => {}; // Return empty cleanup function when not enabled
  }, [isEnabled, hasSeenButton, isTestActive, hasExistingTest]);

  // Handle auto-open when navigation was triggered by popup
  useEffect(() => {
    console.log("🧪 Auto-open check:", {
      shouldAutoOpen,
      isEnabled,
      currentPath: window.location.pathname,
    });
    if (shouldAutoOpen && isEnabled) {
      console.log(
        "🧪 Auto-opening popup after navigation to:",
        window.location.pathname
      );
      setIsTestActive(true);
      setIsMinimized(false); // Ensure popup is not minimized
      setManualOpen(true); // Ensure manual open is set

      // Notify parent that auto-open was handled
      if (onAutoOpenHandled) {
        onAutoOpenHandled();
      }
    }
  }, [shouldAutoOpen, isEnabled, onAutoOpenHandled]);

  // Listen for purchase completion event
  useEffect(() => {
    const handlePurchaseCompleted = () => {
      console.log(
        "🧪 Purchase completion event received, isEnabled:",
        isEnabled
      );
      if (isEnabled) {
        console.log("🧪 Opening popup for feedback phase");
        setIsTestActive(true);
        setIsMinimized(false);
        // Force manual open to ensure step detection re-runs
        setManualOpen(true);
      }
    };

    window.addEventListener(
      "alpha-test-purchase-completed",
      handlePurchaseCompleted
    );

    return () => {
      window.removeEventListener(
        "alpha-test-purchase-completed",
        handlePurchaseCompleted
      );
    };
  }, [isEnabled]);

  const handleStartTest = () => {
    console.log("🧪 Starting test");

    // Check if step 1 is completed
    const step1Completed =
      localStorage.getItem("nest-haus-test-step1-completed") === "true";
    const currentPath = window.location.pathname;

    // Only redirect to landing page if step 1 is NOT completed and not already on landing page
    if (!step1Completed && currentPath !== "/") {
      console.log("🧪 Step 1 not completed, redirecting to landing page");
      // Set flag to auto-open popup after navigation
      localStorage.setItem("alphaTestNavigationTriggered", "true");

      // Navigate to landing page with alpha test parameter
      const landingUrl = new URL("/", window.location.origin);
      landingUrl.searchParams.set("alpha-test", "true");
      window.location.href = landingUrl.toString();
      return;
    }

    // Simply open the popup (no redirect needed)
    console.log("🧪 Opening popup directly, step1Completed:", step1Completed);
    setManualOpen(true);
    setIsTestActive(true);
    setHasSeenButton(true);
    setIsMinimized(false);
    setShowTooltip(false);

    console.log("🧪 Popup should now be visible");
  };

  const handleCloseTest = () => {
    setIsTestActive(false);
    setIsMinimized(false);
    setManualOpen(false);

    // Set a timestamp to prevent immediate auto-reopening
    localStorage.setItem("nest-haus-test-last-closed", Date.now().toString());

    // Don't clear test state completely, just close the popup
    // This allows the button to remain visible for resuming
    // Only clear if user explicitly wants to end the test
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Test Button - Hidden when popup is minimized */}
      {!isMinimized && (
        <div
          className={`fixed right-4 sm:right-6 z-50 ${
            typeof window !== "undefined" &&
            window.location.pathname === "/konfigurator"
              ? "bottom-32 sm:bottom-40" // Higher position in configurator, adjusted for mobile
              : "bottom-4 sm:bottom-6" // Lower position on mobile for better reach
          }`}
        >
          <div className="relative">
            {/* Pulse animation for new users */}
            {!hasSeenButton && (
              <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75" />
            )}

            {/* Welcome tooltip */}
            {!hasSeenButton && !hasExistingTest && (
              <div className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-lg shadow-lg border p-4 transform transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🧪</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Alpha Test
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Helfen Sie uns, NEST-Haus zu verbessern! Dieser Test
                      dauert nur 15-20 Minuten.
                    </p>
                    <button
                      onClick={handleStartTest}
                      className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      Test starten
                    </button>
                  </div>
                  <button
                    onClick={() => setHasSeenButton(true)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <span className="text-sm">✕</span>
                  </button>
                </div>
                {/* Arrow pointing to button */}
                <div className="absolute top-full right-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
              </div>
            )}

            {/* Step 1 tooltip */}
            {showTooltip && hasSeenButton && (
              <div className="absolute bottom-full right-0 mb-4 w-72 bg-white rounded-lg shadow-lg border p-4 transform transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Schritt 1: Website erkunden
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Haben Sie sich bereits einen Überblick verschafft? Dann
                      können Sie hier den Test starten.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTooltip(false)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <span className="text-sm">✕</span>
                  </button>
                </div>
                {/* Arrow pointing to button */}
                <div className="absolute top-full right-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
              </div>
            )}

            {/* Main button */}
            <button
              onClick={handleStartTest}
              className={`relative text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 group ${
                typeof window !== "undefined" &&
                window.location.pathname === "/konfigurator"
                  ? "p-5 sm:p-6" // 10% smaller, responsive
                  : "p-6 sm:p-7" // 10% smaller, responsive
              } bg-blue-600 hover:bg-blue-700`}
              title={hasExistingTest ? "Test fortsetzen" : "Alpha Test starten"}
            >
              <span
                className={`${
                  typeof window !== "undefined" &&
                  window.location.pathname === "/konfigurator"
                    ? "text-3xl sm:text-4xl" // 10% smaller, responsive
                    : "text-4xl sm:text-5xl" // 10% smaller, responsive
                }`}
              >
                🧪
              </span>

              {/* Badge for new test */}
              {!hasSeenButton && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">!</span>
                </div>
              )}

              {/* Hover tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {hasExistingTest ? "Test fortsetzen" : "Alpha Test starten"}
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Test Popup */}
      <UsabilityTestPopup
        isActive={isTestActive}
        onClose={handleCloseTest}
        onMinimize={handleMinimizeToggle}
        isMinimized={isMinimized}
        manualOpen={manualOpen}
      />
    </>
  );
}
