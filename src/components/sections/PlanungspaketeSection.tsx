import React from "react";
import { PlanungspaketeCards } from "@/components/cards";

/**
 * PlanungspaketeSection Component
 *
 * Standardized "Unterstützung gefällig?" section with consistent typography.
 * Uses proper responsive breakpoints and semantic HTML structure.
 *
 * Typography Standards:
 * - Title: text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold
 * - Subtitle: text-base md:text-lg lg:text-xl 2xl:text-2xl
 *
 * See: /docs/TYPOGRAPHY_STANDARDS.md
 */

interface Props {
  /**
   * Section ID for navigation
   */
  id?: string;
  /**
   * Custom title
   * @default "Unterstützung gefällig?"
   */
  title?: string;
  /**
   * Custom subtitle
   * @default "Entdecke unsere Planungs-Pakete, um das Beste für dich und dein Nest rauszuholen."
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
   * Show the planungspakete cards
   * @default true
   */
  showCards?: boolean;
}

export function PlanungspaketeSection({
  id = "planungspakete",
  title = "Unterstützung gefällig?",
  subtitle = "Entdecke unsere Planungs-Pakete, um das Beste für dich und dein Nest rauszuholen.",
  backgroundColor = "white",
  className = "",
  showCards = true,
}: Props) {
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
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold ${titleColor} mb-3`}
          >
            {title}
          </h2>
          <h3
            className={`text-base md:text-lg lg:text-xl 2xl:text-2xl ${subtitleColor} mb-8`}
          >
            {subtitle}
          </h3>
        </div>

        {showCards && (
          <PlanungspaketeCards
            title=""
            subtitle=""
            maxWidth={false}
            showInstructions={false}
          />
        )}
      </div>
    </section>
  );
}
