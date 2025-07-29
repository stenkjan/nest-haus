import React from "react";
import { Button } from "@/components/ui";

interface ButtonConfig {
  text: string;
  variant: "primary" | "secondary" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  link?: string;
  onClick?: () => void;
}

interface ButtonGroupProps {
  buttons: ButtonConfig[];
  alignment?: "center" | "left" | "right";
  spacing?: "sm" | "md" | "lg";
  className?: string;
  wrap?: boolean;
}

export function ButtonGroup({
  buttons,
  alignment = "center",
  spacing = "md",
  className = "",
  wrap = false,
}: ButtonGroupProps) {
  const alignmentClass = {
    center: "justify-center",
    left: "justify-start",
    right: "justify-end",
  }[alignment];

  const spacingClass = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  }[spacing];

  const wrapClass = wrap ? "flex-wrap" : "";

  return (
    <div
      className={`flex ${alignmentClass} ${spacingClass} ${wrapClass} ${className}`}
    >
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant}
          size={button.size || "lg"}
          onClick={button.onClick}
          {...(button.link && { as: "a", href: button.link })}
        >
          {button.text}
        </Button>
      ))}
    </div>
  );
}
