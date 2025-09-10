"use client";

import React from "react";
import type { SquareTextCardData } from "./SquareTextCard";

interface CheckoutStepCardProps {
  cards: SquareTextCardData[];
  maxWidth?: boolean;
}

// Default icon component for checkout steps - same as SquareTextCard
const DefaultCheckoutStepIcon = ({
  className = "w-8 h-8 md:w-10 md:h-10 text-black",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    {/* Moving box icon */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1L5 3l4 2 4-2-4-2z"
    />
  </svg>
);

export default function CheckoutStepCard({
  cards,
  maxWidth = true,
}: CheckoutStepCardProps) {
  const containerClasses = maxWidth
    ? "w-full max-w-[1536px] mx-auto"
    : "w-full";

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Vertical connecting line - centered */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-300 z-0" />

        <div className="space-y-0">
          {cards.map((card, index) => (
            <div key={card.id} className="relative">
              {/* Card */}
              <div
                className={`relative z-10 rounded-3xl overflow-hidden mb-6 ${
                  index === 0 ? "shadow-xl" : "border border-gray-300"
                } h-[580px] sm:h-[600px] md:h-96 lg:h-[400px] xl:h-[440px] 2xl:h-[480px]`}
                style={{
                  backgroundColor: index === 0 ? card.backgroundColor : "white",
                }}
              >
                <div className="h-full flex flex-col md:flex-row">
                  {/* Top/Left side - Icon, Title, Subtitle */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 sm:px-8 md:px-12 py-10 sm:py-8 md:py-8 relative text-center">
                    {/* Icon and Title/Subtitle Group */}
                    <div className="flex flex-col items-center">
                      {/* Icon */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center justify-center">
                          {card.icon || <DefaultCheckoutStepIcon />}
                        </div>
                      </div>

                      {/* Title and Subtitle */}
                      {/* Title */}
                      <h2
                        className={`text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-2 ${
                          card.textColor || "text-gray-900"
                        }`}
                      >
                        {card.title}
                      </h2>

                      {/* Subtitle */}
                      <h3
                        className={`text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium ${
                          card.textColor || "text-gray-600"
                        }`}
                      >
                        {card.subtitle}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom/Right side - Description */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center px-12 sm:px-16 md:px-12 lg:pr-16 xl:pr-20 2xl:pr-24 py-6 md:py-8">
                    <p
                      className={`text-sm sm:text-base md:text-base lg:text-base xl:text-lg 2xl:text-xl leading-relaxed whitespace-pre-line text-center md:text-left ${
                        card.textColor || "text-black"
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
