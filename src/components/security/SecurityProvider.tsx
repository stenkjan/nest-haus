"use client";

import { useEffect } from "react";
import { ImageProtection } from "@/lib/security/ImageProtection";
import { initializeDevToolsDetection } from "@/lib/security/DevToolsDetector";

export interface SecurityProviderProps {
  enableDevToolsDetection?: boolean;
  enableImageProtection?: boolean;
  devToolsConfig?: {
    threshold?: number;
    checkInterval?: number;
    redirectUrl?: string;
    showWarning?: boolean;
    blockAccess?: boolean;
  };
  imageProtectionConfig?: {
    enableWatermark?: boolean;
    watermarkText?: string;
    protectionLevel?: "basic" | "standard" | "strict";
  };
}

/**
 * SecurityProvider component
 * Initializes global security measures for the application
 */
export default function SecurityProvider({
  enableDevToolsDetection = true,
  enableImageProtection = true,
  devToolsConfig = {},
  imageProtectionConfig = {},
}: SecurityProviderProps) {
  useEffect(() => {
    // Initialize DevTools detection
    if (enableDevToolsDetection) {
      const defaultDevToolsConfig = {
        enabled: true,
        threshold: 160,
        checkInterval: 500,
        redirectUrl: "/access-denied",
        showWarning: true,
        warningMessage:
          "Developer tools detected. Access restricted for security reasons.",
        blockAccess: false, // Don't block completely in production
        ...devToolsConfig,
      };

      try {
        initializeDevToolsDetection(defaultDevToolsConfig);
        console.log("🔒 DevTools detection initialized");
      } catch (error) {
        console.error("Failed to initialize DevTools detection:", error);
      }
    }

    // Initialize image protection
    if (enableImageProtection) {
      const defaultImageConfig = {
        enableWatermark: true,
        watermarkOptions: {
          text: imageProtectionConfig.watermarkText || "© NEST-Haus",
          fontSize: 20,
          color: "rgba(255, 255, 255, 0.6)",
          position: "bottom-right" as const,
          margin: 15,
        },
        preventRightClick: true,
        preventDragDrop: true,
        preventSelection: true,
        replaceWithCanvas: imageProtectionConfig.protectionLevel === "strict",
      };

      try {
        ImageProtection.initialize(defaultImageConfig);
        console.log("🔒 Image protection initialized");
      } catch (error) {
        console.error("Failed to initialize image protection:", error);
      }
    }

    // Add global keyboard shortcuts protection
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        return false;
      }

      // Prevent Cmd+Option+I (Mac DevTools)
      if (e.metaKey && e.altKey && e.key === "i") {
        e.preventDefault();
        return false;
      }

      // Prevent Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && e.key === "j") {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    enableDevToolsDetection,
    enableImageProtection,
    devToolsConfig,
    imageProtectionConfig,
  ]);

  // This component doesn't render anything visible
  return null;
}

