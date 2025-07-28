"use client";

import React from "react";
import Link from "next/link";
import Button from "./Button";

interface CallToActionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: "white" | "gray" | "black";
  titleColor?: string;
  subtitleColor?: string;
  maxWidth?: boolean;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  backgroundColor = "gray",
  titleColor,
  subtitleColor,
  maxWidth = true,
}) => {
  const bgColorClass = {
    white: "bg-white",
    gray: "bg-[#F4F4F4]",
    black: "bg-black",
  }[backgroundColor];

  const defaultTitleColor =
    backgroundColor === "black" ? "text-white" : "text-gray-900";
  const defaultSubtitleColor =
    backgroundColor === "black" ? "text-white" : "text-black";

  const containerClass = maxWidth
    ? "w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8"
    : "w-full px-4 sm:px-6 lg:px-8";

  return (
    <section className={`w-full py-20 ${bgColorClass}`}>
      <div className={containerClass}>
        <div className="text-center">
          <h2
            className={`font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 ${titleColor || defaultTitleColor}`}
          >
            {title}
          </h2>
          <h3
            className={`text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto ${subtitleColor || defaultSubtitleColor}`}
          >
            {subtitle}
          </h3>

          <Link href={buttonLink}>
            <Button variant="primary" size="lg" className="inline-flex">
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
