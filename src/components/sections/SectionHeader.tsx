import React from "react";

/**
 * SectionHeader Component
 *
 * Provides consistent typography for section titles and subtitles.
 * Automatically applies responsive breakpoints and proper semantic HTML.
 *
 * Typography Standards:
 * - Title: text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl (font-weight via titleClassName)
 * - Subtitle: text-base md:text-lg lg:text-xl 2xl:text-2xl
 *
 * See: /docs/TYPOGRAPHY_STANDARDS.md
 */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  titleSize?: "default" | "large";
  alignment?: "center" | "left";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  maxWidth?: string | false;
}

export function SectionHeader({
  title,
  subtitle,
  titleSize = "default",
  alignment = "center",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  maxWidth = "max-w-3xl",
}: SectionHeaderProps) {
  const baseContainerClasses = `${
    alignment === "center" ? "text-center" : "text-left"
  } ${className}`;
  const titleClasses = `mb-3 ${
    titleSize === "large"
      ? "text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl"
      : "text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl"
  } ${titleClassName}`;
  const subtitleClasses = `text-base md:text-lg lg:text-xl 2xl:text-2xl mb-8 ${
    alignment === "center" ? "mx-auto" : ""
  } ${maxWidth ? maxWidth : ""} ${subtitleClassName}`;

  return (
    <div className={baseContainerClasses}>
      <h2 className={titleClasses}>{title}</h2>
      {subtitle && <h3 className={subtitleClasses}>{subtitle}</h3>}
    </div>
  );
}
