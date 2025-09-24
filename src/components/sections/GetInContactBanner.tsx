import React from "react";
import { Button } from "@/components/ui";

/**
 * GetInContactBanner Component
 *
 * Uses consistent typography standards:
 * - Title: text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium
 * - Subtitle: text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl
 * - Colors: Dynamic based on background (gray-300 on dark, gray-600 on light)
 *
 * See: /docs/TYPOGRAPHY_STANDARDS.md
 */

interface GetInContactBannerProps {
  /**
   * Section ID for navigation
   */
  id?: string;
  /**
   * Main title text
   * @default "Kein Plan? Kein Problem!"
   */
  title?: string;
  /**
   * Subtitle text
   * @default "Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch"
   */
  subtitle?: string;
  /**
   * Button text
   * @default "Termin vereinbaren"
   */
  buttonText?: string;
  /**
   * Button click handler
   */
  onButtonClick?: () => void;
  /**
   * Background color
   * @default "#F4F4F4"
   */
  backgroundColor?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function GetInContactBanner({
  id,
  title = "Kein Plan? Kein Problem!",
  subtitle = "Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch",
  buttonText = "Jetzt vereinbaren",
  onButtonClick,
  backgroundColor = "#F4F4F4",
  className = "",
}: GetInContactBannerProps) {
  return (
    <section
      id={id}
      className={`w-full py-12 ${className}`}
      style={{ backgroundColor }}
    >
      <div className="w-full max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-0">
          <h2 className="h2-title mb-4 text-gray-900">{title}</h2>
          <h3 className="h3-secondary text-gray-600">{subtitle}</h3>
        </div>

        {/* Single Button */}
        <div className="flex justify-center w-full mt-8">
          <Button variant="primary" size="xs" onClick={onButtonClick}>
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
