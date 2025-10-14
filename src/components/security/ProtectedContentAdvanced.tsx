"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { ImageProtection } from "@/lib/security/ImageProtection";
import { realTimeMonitor } from "@/lib/security/RealTimeMonitor";
import { behavioralAnalyzer } from "@/lib/security/BehavioralAnalyzer";

// Extended CSS style declaration to include deprecated and webkit properties
interface ExtendedCSSStyleDeclaration {
  userSelect?: string;
  webkitUserSelect?: string;
  msUserSelect?: string;
  webkitTouchCallout?: string;
  webkitTapHighlightColor?: string;
}

export interface ProtectedContentProps {
  children: ReactNode;
  className?: string;
  preventRightClick?: boolean;
  preventSelection?: boolean;
  preventDragDrop?: boolean;
  preventCopy?: boolean;
  preventPrint?: boolean;
  enableWatermark?: boolean;
  watermarkText?: string;
  level?: "basic" | "standard" | "strict";
  sessionId?: string; // For behavioral tracking
  enableBehaviorTracking?: boolean;
  enableViolationLogging?: boolean;
  onViolationDetected?: (violationType: string, elementId?: string) => void;
}

/**
 * ProtectedContent wrapper component
 * Applies comprehensive content protection to wrapped elements
 * Enhanced with real-time monitoring and advanced access control
 */
export default function ProtectedContent({
  children,
  className = "",
  preventRightClick = true,
  preventSelection = true,
  preventDragDrop = true,
  preventCopy = true,
  preventPrint = false,
  enableWatermark = true,
  watermarkText = "© NEST-Haus",
  level = "standard",
  sessionId,
  enableBehaviorTracking = true,
  enableViolationLogging = true,
  onViolationDetected,
}: ProtectedContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [violationCount, setViolationCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    // Initialize behavioral tracking if enabled and sessionId provided
    if (enableBehaviorTracking && sessionId) {
      behavioralAnalyzer.initializeSession(sessionId);
    }

    // Apply protection level presets
    const protectionConfig = getProtectionConfig(level);
    const finalConfig = {
      preventRightClick:
        protectionConfig.preventRightClick && preventRightClick,
      preventSelection: protectionConfig.preventSelection && preventSelection,
      preventDragDrop: protectionConfig.preventDragDrop && preventDragDrop,
      preventCopy: protectionConfig.preventCopy && preventCopy,
      preventPrint: protectionConfig.preventPrint && preventPrint,
    };

    // Apply protections
    const cleanupFunctions: (() => void)[] = [];

    // Enhanced violation logging function
    const logViolation = (violationType: string, elementId?: string) => {
      setViolationCount((prev) => {
        const newCount = prev + 1;

        if (enableViolationLogging && sessionId) {
          realTimeMonitor.logContentProtectionViolation(
            sessionId,
            violationType,
            elementId,
            navigator.userAgent
          );
        }

        if (onViolationDetected) {
          onViolationDetected(violationType, elementId);
        }

        // Track behavioral data for violation attempts
        if (enableBehaviorTracking && sessionId) {
          behavioralAnalyzer.trackClick(
            sessionId,
            0,
            0, // No coordinates for violations
            "violation",
            violationType
          );
        }

        // Implement progressive blocking for repeated violations
        if (newCount >= 5 && level === "strict") {
          setIsBlocked(true);
          console.warn("🚫 Content access blocked due to repeated violations");
        }

        return newCount;
      });
    };

    if (finalConfig.preventRightClick) {
      const handler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        logViolation("right_click", (e.target as HTMLElement)?.id);
        return false;
      };
      element.addEventListener("contextmenu", handler);
      cleanupFunctions.push(() =>
        element.removeEventListener("contextmenu", handler)
      );
    }

    if (finalConfig.preventSelection) {
      const selectStartHandler = (e: Event) => {
        e.preventDefault();
        logViolation("text_selection", (e.target as HTMLElement)?.id);
        return false;
      };
      element.addEventListener("selectstart", selectStartHandler);
      cleanupFunctions.push(() =>
        element.removeEventListener("selectstart", selectStartHandler)
      );
    }

    if (finalConfig.preventDragDrop) {
      const dragStartHandler = (e: Event) => {
        e.preventDefault();
        logViolation("drag_drop", (e.target as HTMLElement)?.id);
        return false;
      };
      const dropHandler = (e: Event) => {
        e.preventDefault();
        logViolation("drop_attempt", (e.target as HTMLElement)?.id);
        return false;
      };
      element.addEventListener("dragstart", dragStartHandler);
      element.addEventListener("drop", dropHandler);
      cleanupFunctions.push(() => {
        element.removeEventListener("dragstart", dragStartHandler);
        element.removeEventListener("drop", dropHandler);
      });
    }

    if (finalConfig.preventCopy) {
      const copyHandler = (e: Event) => {
        e.preventDefault();
        logViolation("copy_attempt");
        return false;
      };
      const keydownHandler = (e: KeyboardEvent) => {
        // Enhanced keyboard shortcut protection
        if (
          (e.ctrlKey &&
            ["c", "a", "s", "p", "v", "x", "u"].includes(
              e.key.toLowerCase()
            )) ||
          (e.metaKey &&
            ["c", "a", "s", "p", "v", "x", "u"].includes(
              e.key.toLowerCase()
            )) ||
          (e.ctrlKey &&
            e.shiftKey &&
            ["i", "j", "c"].includes(e.key.toLowerCase())) ||
          e.key === "F12"
        ) {
          e.preventDefault();
          logViolation(
            "keyboard_shortcut",
            `${e.ctrlKey ? "Ctrl+" : ""}${e.shiftKey ? "Shift+" : ""}${e.metaKey ? "Cmd+" : ""}${e.key}`
          );
          return false;
        }

        // Track keystroke for behavioral analysis
        if (enableBehaviorTracking && sessionId) {
          behavioralAnalyzer.trackKeystroke(sessionId, e.key, 100); // Placeholder duration
        }

        return true;
      };
      element.addEventListener("copy", copyHandler);
      element.addEventListener("keydown", keydownHandler);
      cleanupFunctions.push(() => {
        element.removeEventListener("copy", copyHandler);
        element.removeEventListener("keydown", keydownHandler);
      });
    }

    if (finalConfig.preventPrint) {
      const beforePrintHandler = (e: Event) => {
        e.preventDefault();
        logViolation("print_attempt");
        alert("Printing is not allowed for this content.");
        return false;
      };
      window.addEventListener("beforeprint", beforePrintHandler);
      cleanupFunctions.push(() =>
        window.removeEventListener("beforeprint", beforePrintHandler)
      );
    }

    // Mouse movement and interaction tracking for behavioral analysis
    if (enableBehaviorTracking && sessionId) {
      const mouseMoveHandler = (e: MouseEvent) => {
        behavioralAnalyzer.trackMouseMovement(sessionId, e.clientX, e.clientY);
      };

      const clickHandler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        behavioralAnalyzer.trackClick(
          sessionId,
          e.clientX,
          e.clientY,
          target.tagName.toLowerCase(),
          target.id,
          e.detail === 2 // Double click detection
        );
      };

      const scrollHandler = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.scrollTop !== undefined) {
          behavioralAnalyzer.trackScroll(sessionId, 0, target.scrollTop);
        }
      };

      // Throttle mouse movement tracking to avoid performance issues
      let mouseMoveThrottle: NodeJS.Timeout;
      const throttledMouseMove = (e: MouseEvent) => {
        if (mouseMoveThrottle) return;
        mouseMoveThrottle = setTimeout(() => {
          mouseMoveHandler(e);
          mouseMoveThrottle = null as any;
        }, 100);
      };

      element.addEventListener("mousemove", throttledMouseMove);
      element.addEventListener("click", clickHandler);
      element.addEventListener("scroll", scrollHandler);

      cleanupFunctions.push(() => {
        element.removeEventListener("mousemove", throttledMouseMove);
        element.removeEventListener("click", clickHandler);
        element.removeEventListener("scroll", scrollHandler);
        if (mouseMoveThrottle) clearTimeout(mouseMoveThrottle);
      });
    }

    // Apply CSS-based protections using extended interface
    const extendedStyle = element.style as ExtendedCSSStyleDeclaration;
    extendedStyle.userSelect = finalConfig.preventSelection ? "none" : "";
    extendedStyle.webkitUserSelect = finalConfig.preventSelection ? "none" : "";
    extendedStyle.msUserSelect = finalConfig.preventSelection ? "none" : "";
    extendedStyle.webkitTouchCallout = finalConfig.preventSelection
      ? "none"
      : "";
    extendedStyle.webkitTapHighlightColor = finalConfig.preventSelection
      ? "transparent"
      : "";

    // Protect images within the content
    if (enableWatermark) {
      const images = element.querySelectorAll(
        "img"
      ) as NodeListOf<HTMLImageElement>;
      images.forEach((img) => {
        img.classList.add("protected");
        ImageProtection.preventRightClick(img);
        ImageProtection.preventDragDrop(img);
        ImageProtection.preventSelection(img);
      });
    }

    // Cleanup function
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [
    preventRightClick,
    preventSelection,
    preventDragDrop,
    preventCopy,
    preventPrint,
    enableWatermark,
    level,
    sessionId,
    enableBehaviorTracking,
    enableViolationLogging,
    onViolationDetected,
  ]);

  // Generate CSS classes based on protection level and state
  const protectionClasses = [
    "protected-content",
    `protection-level-${level}`,
    isBlocked ? "content-blocked" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Show blocked content message if access is blocked
  if (isBlocked) {
    return (
      <div
        className={`${protectionClasses} flex items-center justify-center min-h-[200px] bg-gray-100 border border-red-300 rounded-lg`}
        data-protection-level={level}
      >
        <div className="text-center p-6">
          <div className="text-red-600 text-lg font-semibold mb-2">
            🚫 Content Access Blocked
          </div>
          <div className="text-gray-600 text-sm">
            Access to this content has been restricted due to security policy
            violations.
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Violations detected: {violationCount}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      className={protectionClasses}
      data-protection-level={level}
      data-watermark={enableWatermark ? watermarkText : undefined}
      data-violations={violationCount}
    >
      {children}

      {/* Invisible watermark overlay for additional protection */}
      {enableWatermark && (
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            background: `url("data:image/svg+xml,${encodeURIComponent(
              createWatermarkSVG(watermarkText)
            )}") repeat`,
            opacity: 0.02,
            zIndex: 1,
          }}
        />
      )}

      {/* Development mode violation counter */}
      {process.env.NODE_ENV === "development" && violationCount > 0 && (
        <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-300 rounded px-2 py-1 text-xs text-yellow-800 z-50">
          Protection violations: {violationCount}
        </div>
      )}
    </div>
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
        preventSelection: false,
        preventDragDrop: true,
        preventCopy: false,
        preventPrint: false,
      };
    case "standard":
      return {
        preventRightClick: true,
        preventSelection: true,
        preventDragDrop: true,
        preventCopy: true,
        preventPrint: false,
      };
    case "strict":
      return {
        preventRightClick: true,
        preventSelection: true,
        preventDragDrop: true,
        preventCopy: true,
        preventPrint: true,
      };
    default:
      return {
        preventRightClick: true,
        preventSelection: true,
        preventDragDrop: true,
        preventCopy: true,
        preventPrint: false,
      };
  }
}

/**
 * Create SVG watermark pattern
 */
function createWatermarkSVG(text: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">
    <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" font-size="12" fill="rgba(0,0,0,0.1)" transform="rotate(-45 100 50)">
      ${text}
    </text>
  </svg>`;
}
