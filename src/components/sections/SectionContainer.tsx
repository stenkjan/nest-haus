import React from "react";

interface SectionContainerProps {
  id: string;
  children: React.ReactNode;
  backgroundColor?: "white" | "gray" | "black";
  padding?: "sm" | "md" | "lg";
  maxWidth?: string | false;
  className?: string;
}

export function SectionContainer({
  id,
  children,
  backgroundColor = "white",
  padding = "lg",
  maxWidth = "max-w-[1536px]",
  className = "",
}: SectionContainerProps) {
  const bgClass = {
    white: "bg-white",
    gray: "bg-gray-50",
    black: "bg-black",
  }[backgroundColor];

  const paddingClass = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
  }[padding];

  const contentMaxWidth = maxWidth ? maxWidth : "w-full";

  return (
    <section
      id={id}
      className={`w-full ${paddingClass} ${bgClass} ${className} flex justify-center`}
    >
      <div className={`${contentMaxWidth} w-full px-4 md:px-12`}>
        {children}
      </div>
    </section>
  );
}
