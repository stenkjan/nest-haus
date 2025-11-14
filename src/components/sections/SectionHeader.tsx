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
 * New Feature: Responsive Mobile/Desktop Variants
 * - Use `mobileTitle` and `mobileSubtitle` to provide different content for mobile
 * - Supports HTML in mobile variants for line breaks (use `<br/>`)
 * - Mobile subtitle optional - no space occupied if not provided
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
 * // With mobile variants (different text for mobile)
 * <SectionHeader
 *   title="Konfiguriere dein ®Nest Haus"
 *   subtitle="Durch serielle Fertigung zu transparenten Bestpreisen"
 *   mobileTitle="Konfiguriere dein<br/>®Nest Haus"
 *   mobileSubtitle="Durch serielle Fertigung<br/>zu transparenten Bestpreisen"
 * />
 *
 * // Mobile title only (no subtitle on mobile)
 * <SectionHeader
 *   title="Desktop Title with Subtitle"
 *   subtitle="Desktop Subtitle"
 *   mobileTitle="Mobile Title<br/>Only"
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
   * Mobile-specific title (supports HTML for line breaks)
   * If provided, will be used on screens < 1024px instead of title
   */
  mobileTitle?: string;

  /**
   * Mobile-specific subtitle (supports HTML for line breaks)
   * If provided, will be used on screens < 1024px instead of subtitle
   * If not provided and mobileTitle is set, no subtitle space is occupied on mobile
   */
  mobileSubtitle?: string;

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
  mobileTitle,
  mobileSubtitle,
  titleTag = "h1",
  titleClassName = "",
  subtitleClassName = "text-black",
  maxWidth: _maxWidth = "max-w-3xl",
  containerMaxWidth: _containerMaxWidth = "max-w-[1536px]",
  wrapperMargin = "mb-12",
  centered = true,
  className = "",
}: SectionHeaderProps) {
  const TitleTag = titleTag;

  // Determine if we have mobile variants
  const hasMobileVariant = mobileTitle !== undefined;

  return (
    <div
      className={`w-full px-4 md:px-12 ${centered ? "text-center" : ""} ${wrapperMargin} ${className}`}
    >
      {/* Desktop Version (≥1024px) */}
      {hasMobileVariant ? (
        <>
          <TitleTag
            className={`h1-secondary mb-2 md:mb-3 ${titleClassName} hidden lg:block`}
          >
            {title}
          </TitleTag>
          {subtitle && (
            <h3 className={`h3-secondary ${subtitleClassName} hidden lg:block`}>
              {subtitle}
            </h3>
          )}
        </>
      ) : (
        <>
          <TitleTag className={`h1-secondary mb-2 md:mb-3 ${titleClassName}`}>
            {title}
          </TitleTag>
          {subtitle && (
            <h3 className={`h3-secondary ${subtitleClassName}`}>{subtitle}</h3>
          )}
        </>
      )}

      {/* Mobile Version (<1024px) - Only shown if mobile variants exist */}
      {hasMobileVariant && (
        <>
          <TitleTag
            className={`h1-secondary mb-2 md:mb-3 ${titleClassName} lg:hidden`}
            dangerouslySetInnerHTML={{ __html: mobileTitle }}
          />
          {mobileSubtitle && (
            <h3
              className={`h3-secondary ${subtitleClassName} lg:hidden`}
              dangerouslySetInnerHTML={{ __html: mobileSubtitle }}
            />
          )}
        </>
      )}
    </div>
  );
}
