import React from "react";

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
  const baseContainerClasses = `${alignment === "center" ? "text-center" : "text-left"} ${className}`;
  const titleClasses = `font-medium tracking-[-0.02em] mb-4 ${
    titleSize === "large"
      ? "text-4xl md:text-[60px]"
      : "text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl"
  } ${titleClassName}`;
  const subtitleClasses = `text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 ${
    alignment === "center" ? "mx-auto" : ""
  } ${maxWidth ? maxWidth : ""} ${subtitleClassName}`;

  return (
    <div className={baseContainerClasses}>
      <h2 className={titleClasses}>{title}</h2>
      {subtitle && <h3 className={subtitleClasses}>{subtitle}</h3>}
    </div>
  );
}
