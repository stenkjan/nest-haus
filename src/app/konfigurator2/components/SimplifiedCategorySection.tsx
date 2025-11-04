"use client";

import React from "react";

interface SimplifiedOption {
  id: string;
  name: string;
  subtitle: string;
}

interface SimplifiedCategorySectionProps {
  title: string;
  subtitle: string;
  options: SimplifiedOption[];
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
}

export default function SimplifiedCategorySection({
  title,
  subtitle,
  options,
  selectedOption,
  onSelect,
}: SimplifiedCategorySectionProps) {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="border-b border-gray-200 pb-2">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`
              w-full p-4 rounded-lg border-2 transition-all
              flex items-center justify-between
              ${
                selectedOption === option.id
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400 bg-white'
              }
            `}
          >
            <div className="flex flex-col items-start text-left">
              <span className="font-semibold text-gray-900">{option.name}</span>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-sm text-gray-600">{option.subtitle}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}



