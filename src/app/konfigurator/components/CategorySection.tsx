"use client";

import { ReactNode } from "react";

interface CategorySectionProps {
  title: string;
  subtitle: React.ReactNode;
  children: ReactNode;
  className?: string;
}

export default function CategorySection({
  title,
  subtitle,
  children,
  className = "",
}: CategorySectionProps) {
  return (
    <div className={`box_catagory rounded-lg ${className}`}>
      <h3 className="text-[clamp(1rem,2.2vw,1.25rem)] font-medium tracking-[-0.015em] leading-[1.2] mb-4">
        <span className="text-black">{title}</span>{" "}
        <span className="text-gray-600">{subtitle}</span>
      </h3>
      {children}
    </div>
  );
}
