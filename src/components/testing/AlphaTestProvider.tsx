"use client";

import React, { useEffect, useState } from "react";
import AlphaTestButton from "./AlphaTestButton";

/**
 * Alpha Test Provider
 *
 * Globally available alpha test system that works across all pages
 * Automatically detects alpha-test parameter and manages test state
 */

export default function AlphaTestProvider() {
  const [isAlphaTestEnabled, setIsAlphaTestEnabled] = useState(false);

  useEffect(() => {
    // Check for alpha test parameter or existing test state
    const checkAlphaTestStatus = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasAlphaParam = urlParams.get("alpha-test") === "true";
      const hasExistingTest = localStorage.getItem("nest-haus-test-session-id");

      setIsAlphaTestEnabled(hasAlphaParam || !!hasExistingTest);
    };

    // Check on mount
    checkAlphaTestStatus();

    // Listen for URL changes (for SPA navigation)
    const handleLocationChange = () => {
      checkAlphaTestStatus();
    };

    // Listen for storage changes (for cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("nest-haus-test-")) {
        checkAlphaTestStatus();
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return <AlphaTestButton isEnabled={isAlphaTestEnabled} />;
}
