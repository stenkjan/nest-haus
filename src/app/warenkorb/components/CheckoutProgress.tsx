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
      {/* Desktop/Tablet */}
      <div className="relative hidden md:block">
        <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200" />
        <div
          className="absolute left-0 top-3 h-0.5 bg-blue-600 transition-all"
          style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
        />
        <div className="grid grid-cols-5 gap-0">
          {steps.map((label, idx) => {
            const isDone = idx < stepIndex;
            const isCurrent = idx === stepIndex;
            const circleClass = isDone
              ? "bg-blue-600 border-blue-600"
              : isCurrent
              ? "bg-white border-blue-600"
              : "bg-white border-gray-300";
            const dotInner = isDone ? (
              <span className="w-2 h-2 bg-white rounded-full" />
            ) : null;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                  aria-label={`Schritt ${idx + 1}: ${label}`}
                >
                  {dotInner}
                </div>
                <div className="mt-2 text-sm text-center text-gray-700 leading-tight break-words px-1">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: two rows with circles and labels */}
      <div className="md:hidden">
        {/* Top row with connecting line and fill */}
        <div className="relative mb-1">
          <div className="absolute left-0 right-0 top-2.5 h-0.5 bg-gray-200" />
          <div
            className="absolute left-0 top-2.5 h-0.5 bg-blue-600 transition-all"
            style={{
              width: `${Math.min(100, (Math.min(stepIndex, 2) / 2) * 100)}%`,
            }}
          />
          <div className="grid grid-cols-3 gap-2">
            {steps.slice(0, 3).map((label, i) => {
              const idx = i;
              const isDone = idx < stepIndex;
              const isCurrent = idx === stepIndex;
              const circleClass = isDone
                ? "bg-blue-600 border-blue-600"
                : isCurrent
                ? "bg-white border-blue-600"
                : "bg-white border-gray-300";
              const dotInner = isDone ? (
                <span className="w-2 h-2 bg-white rounded-full" />
              ) : null;
              return (
                <div
                  key={`mrow1-${idx}`}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                  >
                    {dotInner}
                  </div>
                  <div className="mt-1 text-[11px] text-center text-gray-700 leading-tight break-words px-1">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Bottom row with connecting line and fill */}
        <div className="relative mt-2">
          <div className="absolute left-0 right-0 top-2.5 h-0.5 bg-gray-200" />
          <div
            className="absolute left-0 top-2.5 h-0.5 bg-blue-600 transition-all"
            style={{ width: `${stepIndex >= 4 ? 100 : 0}%` }}
          />
          <div className="grid grid-cols-2 gap-2">
            {steps.slice(3).map((label, i) => {
              const idx = i + 3;
              const isDone = idx < stepIndex;
              const isCurrent = idx === stepIndex;
              const circleClass = isDone
                ? "bg-blue-600 border-blue-600"
                : isCurrent
                ? "bg-white border-blue-600"
                : "bg-white border-gray-300";
              const dotInner = isDone ? (
                <span className="w-2 h-2 bg-white rounded-full" />
              ) : null;
              return (
                <div
                  key={`mrow2-${idx}`}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                  >
                    {dotInner}
                  </div>
                  <div className="mt-1 text-[11px] text-center text-gray-700 leading-tight break-words px-1">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
