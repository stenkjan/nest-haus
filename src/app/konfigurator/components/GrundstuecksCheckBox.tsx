/**
 * GrundstuecksCheckBox - Property Check Selection Component
 *
 * Special checkbox component for Grundstücks-Check selection
 * with integrated pricing and monthly payment calculation.
 */

"use client";

import React from "react";
import { GRUNDSTUECKSCHECK_PRICE } from "@/constants/configurator";
import { PriceUtils } from "../core/PriceUtils";

interface GrundstuecksCheckBoxProps {
  isSelected: boolean;
  onClick: () => void;
  onUnselect?: () => void;
}

// Constants for Grundstückscheck
const GRUNDSTUECKSCHECK_OPTION = {
  value: "grundstueckscheck",
  name: "Grundstückscheck", // updated label
  category: "grundstueckscheck",
  description:
    "Prüfung der rechtlichen und baulichen Voraussetzungen deines Grundstücks",
  price: GRUNDSTUECKSCHECK_PRICE,
};

export default function GrundstuecksCheckBox({
  isSelected,
  onClick,
  onUnselect: _onUnselect,
}: GrundstuecksCheckBoxProps) {
  return (
    <div
      className={`box_selection flex justify-between items-center min-h-[6rem] lg:min-h-[5.5rem] border rounded-[1.2rem] px-[clamp(0.75rem,1.5vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] cursor-pointer transition-all duration-200 min-w-0 min-h-[44px] ${
        isSelected
          ? "selected border-[#3D6DE1] shadow-[0_0_0_1px_#3D6DE1] bg-blue-50/50"
          : "border-gray-300 hover:border-[#3D6DE1] hover:shadow-sm"
      }`}
      onClick={onClick}
    >
      <div className="box_selection_name flex-1 min-w-0 pr-[clamp(0.75rem,2vw,1.25rem)]">
        <p className="font-medium text-[clamp(0.875rem,1.6vw,1.125rem)] tracking-wide leading-tight mb-[0.5em] text-black">
          {GRUNDSTUECKSCHECK_OPTION.name}
        </p>
        <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700">
          {GRUNDSTUECKSCHECK_OPTION.description}
        </p>
      </div>
      <div className="box_selection_price text-right whitespace-nowrap text-black flex-shrink-0 min-w-[clamp(5rem,12vw,7rem)]">
        <div className="text-right">
          {/* zzgl. removed as per request */}
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
            {PriceUtils.formatPrice(GRUNDSTUECKSCHECK_PRICE)}
          </p>
        </div>
      </div>
    </div>
  );
}

// Export the constants for use in other components
export { GRUNDSTUECKSCHECK_PRICE, GRUNDSTUECKSCHECK_OPTION };
