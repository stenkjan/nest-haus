"use client";

import { useState } from "react";

interface ConfiguratorCheckboxProps {
  id: string;
  uncheckedText: string;
  checkedText: string;
  price: number;
  pricePerSqm?: number;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function ConfiguratorCheckbox({
  id,
  uncheckedText,
  checkedText,
  price,
  pricePerSqm,
  isChecked,
  onChange,
  className = "",
}: ConfiguratorCheckboxProps) {
  const handleChange = () => {
    onChange(!isChecked);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${className}`}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={handleChange}
          className={`w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-offset-0 ${
            isChecked
              ? "bg-[#3D6CE1] border-[#3D6CE1] text-white"
              : "bg-white text-black"
          }`}
          style={{
            accentColor: isChecked ? "#3D6CE1" : undefined,
          }}
        />
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-900 cursor-pointer"
        >
          {isChecked ? checkedText : uncheckedText}
        </label>
      </div>

      <div className="flex flex-col items-end">
        <span
          className={`text-sm font-semibold ${isChecked ? "text-gray-900" : "text-gray-400"}`}
        >
          {formatPrice(price)}
        </span>
        {pricePerSqm && (
          <span
            className={`text-xs ${isChecked ? "text-gray-500" : "text-gray-300"}`}
          >
            {formatPrice(pricePerSqm)}/m²
          </span>
        )}
      </div>
    </div>
  );
}
