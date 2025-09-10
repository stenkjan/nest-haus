import React from "react";

interface CheckoutProgressProps {
  steps: readonly string[];
  stepIndex: number;
}

export default function CheckoutProgress({
  steps,
  stepIndex,
}: CheckoutProgressProps) {
  return (
    <div className="w-full">
      {/* Desktop: Improved progress with dynamic grid and numbered circles */}
      <div className="hidden md:block">
        <div className="relative max-w-[1440px] mx-auto">
          {/* Background Line */}
          <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200" />
          {/* Progress Line */}
          <div
            className="absolute left-0 top-3 h-0.5 bg-blue-600 transition-all duration-300"
            style={{
              width:
                steps.length <= 1
                  ? "0%"
                  : stepIndex === 0
                  ? `${100 / steps.length / 2}%` // From left edge to center of first circle (10% for 5 steps)
                  : stepIndex === steps.length - 1
                  ? "100%" // Full width when on last step
                  : `${((stepIndex + 0.5) * 100) / steps.length}%`, // From left edge to center of current step circle
              transformOrigin: "left center",
            }}
          />
          {/* Step Dots */}
          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
          >
            {steps.map((label, idx) => {
              const isActive = idx === stepIndex;
              const isPassed = idx < stepIndex;
              const circleClass = isPassed
                ? "bg-blue-600 border-blue-600 text-white"
                : isActive
                ? "bg-white border-blue-600 text-blue-600"
                : "bg-white border-gray-300 text-gray-400";
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                    aria-label={`Schritt ${idx + 1}: ${label}`}
                  >
                    <span className="text-xs font-medium">{idx + 1}</span>
                  </div>
                  <div className="mt-3 text-xs text-center transition-opacity duration-200 max-w-24 leading-tight px-1 break-words">
                    <span
                      className={
                        isActive ? "text-gray-900" : "text-gray-600 opacity-80"
                      }
                    >
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Compact dots with current step title */}
      <div className="md:hidden">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex justify-center items-center space-x-2">
            {steps.map((label, idx) => {
              const isActive = idx === stepIndex;
              const isPassed = idx < stepIndex;
              const dotClass = isActive
                ? "bg-gray-900 scale-125"
                : isPassed
                ? "bg-gray-600"
                : "bg-gray-300";
              return (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${dotClass}`}
                  aria-label={`Schritt ${idx + 1}: ${label}`}
                />
              );
            })}
          </div>
          {/* Current step title */}
          <div className="text-xs text-center text-gray-600 font-medium">
            {steps[stepIndex]}
          </div>
        </div>
      </div>
    </div>
  );
}
