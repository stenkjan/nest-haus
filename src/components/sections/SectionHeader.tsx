import React from "react";

/**
 * SectionHeader Component
 *
 * Standardized section header pattern used throughout the application.
 * Based on the pattern from EntdeckenClient.tsx and aligned with Typography Standards.
 *
 * Standard 1: Centered Section Header Pattern
 * - Container with max-width constraint and responsive padding
 * - Centered text alignment (configurable)
 * - H1 with h1-secondary styling + responsive margins
 * - H3 subtitle with h3-secondary styling + max-width constraint
 * - Consistent margin-bottom between sections (mb-12)
 *
 * See: /docs/TYPOGRAPHY_STANDARDS.md
 *
 * @example
 * ```tsx
 * // Basic usage with default styles
 * <SectionHeader
 *   title="Dein Zuhause zieht um"
 *   subtitle="Architektur für ein bewegtes Leben."
 * />
 *
 * // With custom styling
 * <SectionHeader
 *   title="Design für dich gemacht"
 *   subtitle="Dein Design im Freistil."
 *   titleClassName="text-gray-900"
 *   subtitleClassName="text-gray-600"
 *   wrapperMargin="md:mb-12 mb-12"
 * />
 *
 * // Left-aligned variant
 * <SectionHeader
 *   title="Section Title"
 *   subtitle="Section subtitle"
 *   centered={false}
 * />
 * ```
 */

interface SectionHeaderProps {
  /**
   * Main title text (required)
   */
  title: string;

  /**
   * Optional subtitle text
   */
  subtitle?: string;

  /**
   * HTML tag for the title
   * @default 'h1'
   */
  titleTag?: "h1" | "h2";

  /**
   * Additional classes for the title element
   * Use for color variations: 'text-gray-900', 'text-white', etc.
   * @default ''
   */
  titleClassName?: string;

  /**
   * Additional classes for the subtitle element
   * Use for color variations: 'text-gray-600', 'text-black', etc.
   * @default 'text-black'
   */
  subtitleClassName?: string;

  /**
   * Max width constraint for subtitle
   * @default 'max-w-3xl'
   */
  maxWidth?: string;

  /**
   * Max width constraint for the outer container
   * @default 'max-w-[1536px]'
   */
  containerMaxWidth?: string;

  /**
   * Margin bottom for the wrapper div (controls spacing after the header)
   * @default 'mb-12'
   */
  wrapperMargin?: string;

  /**
   * Whether to center-align text
   * @default true
   */
  centered?: boolean;

  /**
   * Additional classes for the wrapper div
   */
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  titleTag = "h1",
  titleClassName = "",
  subtitleClassName = "text-black",
  maxWidth = "max-w-3xl",
  containerMaxWidth = "max-w-[1536px]",
  wrapperMargin = "mb-12",
  centered = true,
  className = "",
}: SectionHeaderProps) {
  const TitleTag = titleTag;

  return (
    <div className={`w-full ${containerMaxWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
      <div
        className={`${centered ? "text-center" : ""} ${wrapperMargin} ${className}`}
      >
        <TitleTag className={`h1-secondary mb-2 md:mb-3 ${titleClassName}`}>
          {title}
        </TitleTag>
        {subtitle && (
          <h3
            className={`h3-secondary ${subtitleClassName} ${maxWidth} ${centered ? "mx-auto text-center" : ""}`}
          >
            {subtitle}
          </h3>
        )}
      </div>
    </div>
  );
}
