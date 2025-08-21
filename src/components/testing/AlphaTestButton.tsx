"use client";

import React, { useState, useEffect } from "react";
import UsabilityTestPopup from "./UsabilityTestPopup";

interface AlphaTestButtonProps {
  isEnabled?: boolean;
}

export default function AlphaTestButton({
  isEnabled = false,
}: AlphaTestButtonProps) {
  const [isTestActive, setIsTestActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenButton, setHasSeenButton] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasExistingTest, setHasExistingTest] = useState(false);

  // Check if this is an alpha test session
  useEffect(() => {
    // Don't show test button on admin pages
    const isAdminPage = window.location.pathname.startsWith("/admin");

    if (isEnabled && !isAdminPage) {
      setIsVisible(true);

      // Check for existing test state
      const existingStep = localStorage.getItem("nest-haus-test-step");
      const existingSessionId = localStorage.getItem(
        "nest-haus-test-session-id"
      );

      if (existingStep && existingSessionId) {
        setHasExistingTest(true);
        setHasSeenButton(true);

        // If we have an existing test and we're on the landing page, auto-activate
        if (window.location.pathname === "/" && !isTestActive) {
          setIsTestActive(true);
        }
      }

      // Show welcome message after a short delay
      const timer = setTimeout(() => {
        if (!hasSeenButton && !hasExistingTest) {
          setHasSeenButton(true);
          // Auto-start test after 2 seconds if user hasn't interacted
          const autoStartTimer = setTimeout(() => {
            if (!isTestActive) {
              setIsTestActive(true);
            }
          }, 2000);

          return () => clearTimeout(autoStartTimer);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isEnabled, hasSeenButton, isTestActive, hasExistingTest]);

  const handleStartTest = () => {
    // If we have an existing test, just activate it
    if (hasExistingTest) {
      setIsTestActive(true);
      setIsMinimized(false);
      return;
    }

    // For new tests, check if we need to navigate to the landing page first
    const currentPath = window.location.pathname;
    if (currentPath !== "/") {
      // Navigate to landing page with alpha test parameter
      const landingUrl = new URL("/", window.location.origin);
      landingUrl.searchParams.set("alpha-test", "true");
      window.location.href = landingUrl.toString();
      return;
    }

    setIsTestActive(true);
    setHasSeenButton(true);
    setIsMinimized(false);
  };

  const handleCloseTest = () => {
    setIsTestActive(false);
    setIsMinimized(false);

    // Clear test state if user manually closes
    localStorage.removeItem("nest-haus-test-step");
    localStorage.removeItem("nest-haus-test-responses");
    localStorage.removeItem("nest-haus-test-session-id");
    localStorage.removeItem("nest-haus-test-start-time");

    setHasExistingTest(false);

    // Remove alpha-test parameter from URL
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("alpha-test");
    window.history.replaceState({}, "", currentUrl.toString());
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Test Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isTestActive && (
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

            {/* Existing test tooltip */}
            {hasExistingTest && !isTestActive && (
              <div className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-lg shadow-lg border p-4 transform transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🔄</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Test fortsetzen
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Sie haben einen laufenden Test. Klicken Sie hier, um
                      fortzufahren.
                    </p>
                    <button
                      onClick={handleStartTest}
                      className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                    >
                      Fortsetzen
                    </button>
                  </div>
                  <button
                    onClick={() => setHasExistingTest(false)}
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
              className={`relative text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group ${
                hasExistingTest
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              title={hasExistingTest ? "Test fortsetzen" : "Alpha Test starten"}
            >
              <span className="text-2xl">{hasExistingTest ? "🔄" : "🧪"}</span>

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
        )}
      </div>

      {/* Test Popup */}
      <UsabilityTestPopup
        isActive={isTestActive}
        onClose={handleCloseTest}
        onMinimize={handleMinimizeToggle}
        isMinimized={isMinimized}
      />
    </>
  );
}
