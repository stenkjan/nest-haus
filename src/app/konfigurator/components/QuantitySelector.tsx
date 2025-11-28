/**
 * QuantitySelector - Reusable Quantity Selection Component
 *
 * Handles quantity selection for PV modules and Fenster square meters.
 * Extracted from legacy Configurator.tsx for better reusability.
 */

"use client";

import { PriceUtils } from "../core/PriceUtils";

interface QuantitySelectorProps {
  label: string;
  value: number;
  max: number;
  unitPrice: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
  /** Optional: For cumulative pricing (PV-Anlage), pass the total price directly instead of calculating quantity * unitPrice */
  cumulativePrice?: number;
}

export default function QuantitySelector({
  label,
  value,
  max,
  unitPrice,
  unit = "Stück",
  onChange,
  className = "",
  cumulativePrice,
}: QuantitySelectorProps) {
  const formatPrice = (price: number) => {
    // Check if price is -1 (price on request)
    if (PriceUtils.isPriceOnRequest(price)) {
      return "-";
    }
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatUnitPrice = (price: number, unit: string) => {
    // Format price without space before € and add unit suffix
    const formattedPrice = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace(" €", "€"); // Remove space before €

    // Add unit suffix based on unit type
    const unitSuffix = unit === "m²" ? "/m²" : "/Modul";
    return `${formattedPrice}${unitSuffix}`;
  };

  const handleDecrease = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const totalPrice = cumulativePrice !== undefined ? cumulativePrice : value * unitPrice;

  return (
    <div
      className={`mt-[clamp(1rem,2vh,1.5rem)] px-[clamp(1rem,2vw,1.5rem)] ${className}`}
    >
      <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 mb-[0.5em]">
        {label}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={value <= 0}
            aria-label="Decrease quantity"
            className="bg-gray-200 hover:bg-gray-300 rounded-lg min-w-[2.75rem] min-h-[2.75rem] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[1.25rem] h-[1.25rem]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <span className="bg-gray-100 border border-gray-300 rounded-lg px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] min-w-[3rem] text-center font-medium text-black text-[clamp(0.875rem,1.4vw,1rem)]">
            {value}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            disabled={value >= max}
            aria-label="Increase quantity"
            className="bg-gray-200 hover:bg-gray-300 rounded-lg min-w-[2.75rem] min-h-[2.75rem] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[1.25rem] h-[1.25rem]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <div className="ml-[clamp(1rem,2vw,1.5rem)] text-right">
          {/* For cumulative pricing (PV), show total as main price */}
          {cumulativePrice !== undefined ? (
            <>
              <div className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 font-medium">
                {formatPrice(totalPrice)}
              </div>
              <div className="text-[clamp(0.75rem,1.1vw,0.8125rem)] text-gray-500 mt-1">
                für {value} {value === 1 ? 'Modul' : 'Module'}
              </div>
            </>
          ) : (
            <>
              {/* Unit price per panel/m² */}
              <div className="text-[clamp(0.75rem,1.1vw,0.8125rem)] text-gray-600 mb-1">
                {formatUnitPrice(unitPrice, unit)}
              </div>
              {/* Total price */}
              <div className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 font-medium">
                {formatPrice(totalPrice)}
                {unit !== "Stück" && value > 0 && ` / ${value} ${unit}`}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
