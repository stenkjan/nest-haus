"use client";

import { PriceUtils } from "../core/PriceUtils";

interface SelectionOptionProps {
  id: string;
  name: string;
  description: string;
  price?: {
    type:
      | "base"
      | "upgrade"
      | "included"
      | "standard"
      | "discount"
      | "selected";
    amount?: number;
    monthly?: number;
  };
  isSelected?: boolean;
  onClick: (id: string) => void;
  onUnselect?: (id: string) => void;
  canUnselect?: boolean;
  disabled?: boolean;
  className?: string;
  categoryId?: string;
  nestModel?: string;
  contributionPrice?: number | null; // Actual price contribution for selected options
}

export default function SelectionOption({
  id,
  name,
  description,
  price,
  isSelected = false,
  onClick,
  onUnselect,
  canUnselect = false,
  disabled: _disabled = false,
  className = "",
  categoryId,
  nestModel,
  contributionPrice,
}: SelectionOptionProps) {
  const renderPrice = () => {
    if (!price) return null;

    if (price.type === "selected") {
      // For nest modules, show the same format as non-selected
      if (
        categoryId === "nest" &&
        contributionPrice !== null &&
        contributionPrice !== undefined
      ) {
        const formattedPrice = PriceUtils.formatPrice(contributionPrice);
        const shouldShowPricePerSqm =
          PriceUtils.shouldShowPricePerSquareMeter(categoryId);

        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              Ab {formattedPrice}
            </p>
            {shouldShowPricePerSqm && nestModel && contributionPrice && (
              <p className="text-[clamp(0.5rem,1vw,0.75rem)] tracking-wide leading-[1.2] text-gray-600 mt-1">
                {PriceUtils.calculateOptionPricePerSquareMeter(
                  contributionPrice,
                  nestModel,
                  categoryId,
                  id
                )}
              </p>
            )}
          </div>
        );
      }

      // For other categories, show contribution price (smaller and greyer)
      if (contributionPrice !== null && contributionPrice !== undefined) {
        return (
          <p className="text-[clamp(0.5rem,0.9vw,0.75rem)] text-gray-500 tracking-wide leading-[1.2]">
            {contributionPrice === 0
              ? "inklusive"
              : PriceUtils.formatPrice(contributionPrice)}
          </p>
        );
      }
      return null;
    }

    if (price.type === "included") {
      return (
        <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
          <span>inklusive</span>
        </p>
      );
    }

    if (price.type === "base") {
      const formattedPrice = price.amount
        ? PriceUtils.formatPrice(price.amount)
        : "0 €";

      const shouldShowPricePerSqm =
        categoryId && PriceUtils.shouldShowPricePerSquareMeter(categoryId);

      // Remove "Ab" from planungspakete, keep it for nest modules
      const showAbPrefix = categoryId === "nest";

      return (
        <div className="text-right">
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
            {showAbPrefix ? `Ab ${formattedPrice}` : formattedPrice}
            {categoryId === "fenster" && "/m²"}
          </p>
          {shouldShowPricePerSqm && nestModel && price.amount && (
            <p className="text-[clamp(0.5rem,1vw,0.75rem)] tracking-wide leading-[1.2] text-gray-600 mt-1">
              {PriceUtils.calculateOptionPricePerSquareMeter(
                price.amount,
                nestModel,
                categoryId,
                id
              )}
            </p>
          )}
        </div>
      );
    }

    if (price.type === "upgrade") {
      // When amount is 0 (same price), only show "+/-" and hide any numeric values
      if (price.amount === 0) {
        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              +/-
            </p>
          </div>
        );
      }

      const formattedPrice = price.amount
        ? PriceUtils.formatPrice(price.amount)
        : "0 €";

      const shouldShowPricePerSqm =
        categoryId &&
        PriceUtils.shouldShowPricePerSquareMeter(categoryId) &&
        categoryId !== "fenster";

      // Remove "zzgl." from specified sections: nest, innenverkleidung, fussboden, gebaeudehuelle, beleuchtungspaket, fenster, stirnseite, pvanlage
      const sectionsWithoutZzgl = [
        "nest",
        "innenverkleidung",
        "fussboden",
        "gebaeudehuelle",
        "beleuchtungspaket",
        "fenster",
        "stirnseite",
        "pvanlage",
      ];
      const showZzglPrefix = !sectionsWithoutZzgl.includes(categoryId || "");

      return (
        <div className="text-right">
          {showZzglPrefix && (
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              zzgl.
            </p>
          )}
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
            {price.amount !== undefined && price.amount > 0
              ? `+${formattedPrice}`
              : formattedPrice}
            {categoryId === "fenster" && "/m²"}
          </p>
          {shouldShowPricePerSqm &&
            nestModel &&
            price.amount &&
            price.amount !== 0 && (
              <p className="text-[clamp(0.5rem,1vw,0.75rem)] tracking-wide leading-[1.2] text-gray-600 mt-1">
                {PriceUtils.calculateOptionPricePerSquareMeter(
                  price.amount,
                  nestModel,
                  categoryId,
                  id
                )}
              </p>
            )}
        </div>
      );
    }

    if (price.type === "discount") {
      const formattedPrice = price.amount
        ? PriceUtils.formatPrice(price.amount)
        : "0 €";

      const shouldShowPricePerSqm =
        categoryId &&
        PriceUtils.shouldShowPricePerSquareMeter(categoryId) &&
        categoryId !== "fenster";

      return (
        <div className="text-right">
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] text-gray-700">
            -{formattedPrice}
            {categoryId === "fenster" && "/m²"}
          </p>
          {shouldShowPricePerSqm && nestModel && price.amount && (
            <p className="text-[clamp(0.5rem,1vw,0.75rem)] tracking-wide leading-[1.2] text-gray-600 mt-1">
              {PriceUtils.calculateOptionPricePerSquareMeter(
                price.amount,
                nestModel,
                categoryId,
                id
              )}
            </p>
          )}
        </div>
      );
    }

    if (price.type === "standard") {
      const formattedPrice = price.amount
        ? PriceUtils.formatPrice(price.amount)
        : "0 €";

      const shouldShowPricePerSqm =
        categoryId &&
        PriceUtils.shouldShowPricePerSquareMeter(categoryId) &&
        categoryId !== "fenster";

      return (
        <div className="text-right">
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
            {formattedPrice}
            {categoryId === "fenster" && "/m²"}
          </p>
          {shouldShowPricePerSqm && nestModel && price.amount && (
            <p className="text-[clamp(0.5rem,1vw,0.75rem)] tracking-wide leading-[1.2] text-gray-600 mt-1">
              {PriceUtils.calculateOptionPricePerSquareMeter(
                price.amount,
                nestModel,
                categoryId,
                id
              )}
            </p>
          )}
        </div>
      );
    }

    // Default fallback
    return null;
  };

  const handleClick = () => {
    onClick(id);
  };

  const handleUnselect = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the main click
    if (onUnselect && canUnselect) {
      onUnselect(id);
    }
  };

  return (
    <div
      className={`box_selection flex justify-between items-center min-h-[6rem] lg:min-h-[5.5rem] border rounded-[1.2rem] px-[clamp(0.75rem,1.5vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] cursor-pointer transition-all duration-200 min-w-0 min-h-[44px] relative ${
        isSelected
          ? "selected border-[#3D6DE1] shadow-[0_0_0_1px_#3D6DE1] bg-blue-50/50"
          : "border-gray-300 hover:border-[#3D6DE1] hover:shadow-sm"
      } ${className}`}
      onClick={handleClick}
    >
      {/* Unselect button for selected items that can be unselected */}
      {isSelected && canUnselect && onUnselect && (
        <button
          onClick={handleUnselect}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 z-10 min-w-[24px] min-h-[24px]"
          aria-label={`${name} entfernen`}
          title={`${name} entfernen`}
        >
          ×
        </button>
      )}

      <div className="box_selection_name flex-1 min-w-0 pr-[clamp(0.75rem,2vw,1.25rem)]">
        <p className="font-medium text-[clamp(0.875rem,1.6vw,1.125rem)] tracking-wide leading-tight mb-[0.5em] text-black">
          {name}
        </p>
        <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700">
          {description}
        </p>
      </div>
      <div className="box_selection_price text-right whitespace-nowrap text-black flex-shrink-0 min-w-[clamp(5rem,12vw,7rem)]">
        {renderPrice()}
      </div>
    </div>
  );
}
