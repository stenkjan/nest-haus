import React from "react";
import { VideoCard16by9 } from "@/components/cards";
import { VIDEO_CARD_PRESETS } from "@/constants/contentCardPresets";

/**
 * GrundstueckCheckSection Component
 *
 * Standardized "Dein Grundstück - Unser Check" section with consistent typography.
 * Uses proper responsive breakpoints and semantic HTML structure.
 *
 * Typography Standards:
 * - Title: text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold
 * - Subtitle: text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl
 *
 * See: /docs/TYPOGRAPHY_STANDARDS.md
 */

interface GrundstueckCheckSectionProps {
  /**
   * Section ID for navigation
   */
  id?: string;
  /**
   * Custom title
   * @default "Dein Grundstück - Unser Check"
   */
  title?: string;
  /**
   * Custom subtitle
   * @default "Wir überprüfen für dich, wie dein Nest Haus auf ein Grundstück deiner Wahl passt."
   */
  subtitle?: string;
  /**
   * Background color
   * @default "white"
   */
  backgroundColor?: "white" | "black";
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show the content cards
   * @default true
   */
  showCards?: boolean;
  /**
   * Center align text on mobile only
   * @default false
   */
  centerOnMobile?: boolean;
}

export function GrundstueckCheckSection({
  id = "grundstueck-check",
  title = "Dein Grundstück - Unser Check",
  subtitle = "Wir überprüfen für dich, wie dein Nest Haus auf ein Grundstück deiner Wahl passt.",
  backgroundColor = "white",
  className = "",
  showCards = true,
  centerOnMobile = false,
}: GrundstueckCheckSectionProps) {
  const backgroundClasses =
    backgroundColor === "black" ? "bg-black" : "bg-white";
  const titleColor =
    backgroundColor === "black" ? "text-white" : "text-gray-900";
  const subtitleColor =
    backgroundColor === "black" ? "text-gray-300" : "text-gray-600";

  return (
    <section
      id={id}
      className={`w-full py-16 ${backgroundClasses} ${className}`}
    >
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-16 ${centerOnMobile ? "text-center md:text-left" : "text-center"}`}
        >
          <h1
            className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold ${titleColor} mb-2 md:mb-3`}
          >
            {title}
          </h1>
          <h3
            className={`text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl ${subtitleColor} mb-8`}
          >
            {subtitle}
          </h3>
        </div>

        {showCards && (
          <VideoCard16by9
            title=""
            subtitle=""
            maxWidth={false}
            showInstructions={false}
            customData={[VIDEO_CARD_PRESETS.sicherheit]}
          />
        )}
      </div>
    </section>
  );
}
