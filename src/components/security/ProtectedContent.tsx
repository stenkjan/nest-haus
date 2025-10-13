"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ImageProtection } from "@/lib/security/ImageProtection";

// Extended CSS style declaration to include deprecated properties
interface ExtendedCSSStyleDeclaration extends CSSStyleDeclaration {
  msUserSelect?: string;
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
}

/**
 * ProtectedContent wrapper component
 * Applies comprehensive content protection to wrapped elements
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
}: ProtectedContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

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

    if (finalConfig.preventRightClick) {
      const handler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
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
        return false;
      };
      const dropHandler = (e: Event) => {
        e.preventDefault();
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
        return false;
      };
      const keydownHandler = (e: KeyboardEvent) => {
        // Prevent Ctrl+C, Ctrl+A, Ctrl+S, Ctrl+P
        if (e.ctrlKey && ["c", "a", "s", "p"].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
        // Prevent Cmd+C, Cmd+A, Cmd+S, Cmd+P on Mac
        if (e.metaKey && ["c", "a", "s", "p"].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
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
        alert("Printing is not allowed for this content.");
        return false;
      };
      window.addEventListener("beforeprint", beforePrintHandler);
      cleanupFunctions.push(() =>
        window.removeEventListener("beforeprint", beforePrintHandler)
      );
    }

    // Apply CSS-based protections
    element.style.userSelect = finalConfig.preventSelection ? "none" : "";
    element.style.webkitUserSelect = finalConfig.preventSelection ? "none" : "";
    // Use type assertion for deprecated msUserSelect property
    (element.style as ExtendedCSSStyleDeclaration).msUserSelect =
      finalConfig.preventSelection ? "none" : "";
    element.style.webkitTouchCallout = finalConfig.preventSelection
      ? "none"
      : "";
    element.style.webkitTapHighlightColor = finalConfig.preventSelection
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
  ]);

  // Generate CSS classes based on protection level
  const protectionClasses = [
    "protected-content",
    `protection-level-${level}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={contentRef}
      className={protectionClasses}
      data-protection-level={level}
      data-watermark={enableWatermark ? watermarkText : undefined}
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
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">
      <text x="100" y="50" font-family="Arial, sans-serif" font-size="12" 
            text-anchor="middle" dominant-baseline="middle" 
            fill="currentColor" opacity="0.1" transform="rotate(-45 100 50)">
        ${text}
      </text>
    </svg>
  `;
}
