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
      | "selected"
      | "dash";
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
  geschossdeckeQuantity?: number; // Number of Geschossdecke units selected (affects m² calculation)
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
  geschossdeckeQuantity,
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
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] text-gray-500 tracking-wide leading-[1.2]">
              Ab {formattedPrice}
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
              entspricht
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
              {shouldShowPricePerSqm && nestModel && contributionPrice
                ? PriceUtils.calculateOptionPricePerSquareMeter(
                    contributionPrice,
                    nestModel,
                    categoryId,
                    id,
                    geschossdeckeQuantity
                  )
                : ""}
            </p>
          </div>
        );
      }

      // For other categories, show contribution price (smaller and greyer) with m² price
      if (contributionPrice !== null && contributionPrice !== undefined) {
        const shouldShowPricePerSqm =
          categoryId && PriceUtils.shouldShowPricePerSquareMeter(categoryId);

        return (
          <div className="text-right">
            {contributionPrice === 0 ? (
              // For inklusive items (including innenverkleidung Standard), center the text
              <>
                <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] text-gray-500 tracking-wide leading-[1.2]">
                  &nbsp;
                </p>
                <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] text-gray-500 tracking-wide leading-[1.2]">
                  Standard
                </p>
                <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
                  &nbsp;
                </p>
              </>
            ) : PriceUtils.isPriceOnRequest(contributionPrice) ? (
              // For price on request (-1), show dash
              <>
                <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] text-gray-500 tracking-wide leading-[1.2]">
                  &nbsp;
                </p>
                <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] text-gray-500 tracking-wide leading-[1.2]">
                  -
                </p>
                <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
                  &nbsp;
                </p>
              </>
            ) : categoryId === "belichtungspaket" ? (
              // For belichtungspaket, center the price without entspricht
              <>
                <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] text-gray-500 tracking-wide leading-[1.2]">
                  &nbsp;
                </p>
                <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] text-gray-500 tracking-wide leading-[1.2]">
                  {PriceUtils.formatPrice(contributionPrice)}
                </p>
                <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
                  &nbsp;
                </p>
              </>
            ) : (
              // For items with actual prices
              <>
                <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] text-gray-500 tracking-wide leading-[1.2]">
                  {categoryId === "pvanlage" || categoryId === "geschossdecke"
                    ? `Ab ${PriceUtils.formatPrice(contributionPrice)}` 
                    : `${PriceUtils.formatPrice(contributionPrice)}${categoryId === "fenster" ? "/m²" : ""}`}
                </p>
                <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
                  {categoryId === "fenster"
                    ? "basierend auf deinem"
                    : "entspricht"}
                </p>
                <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
                  {categoryId === "fenster"
                    ? "Belichtungspaket"
                    : categoryId === "pvanlage" && contributionPrice > 0 && !PriceUtils.isPriceOnRequest(contributionPrice)
                      ? `${PriceUtils.formatPrice(Math.round(contributionPrice / 4))} / Panel`
                      : shouldShowPricePerSqm &&
                          nestModel &&
                          contributionPrice > 0
                        ? PriceUtils.calculateOptionPricePerSquareMeter(
                            contributionPrice,
                            nestModel,
                            categoryId,
                            id,
                            geschossdeckeQuantity
                          )
                        : ""}
                </p>
              </>
            )}
          </div>
        );
      }
      return null;
    }

    if (price.type === "included") {
      return (
        <div className="text-right">
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
            &nbsp;
          </p>
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
            Standard
          </p>
          <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
            &nbsp;
          </p>
        </div>
      );
    }

    if (price.type === "dash") {
      return (
        <div className="text-right">
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
            &nbsp;
          </p>
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
            -
          </p>
          <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
            &nbsp;
          </p>
        </div>
      );
    }

    if (price.type === "base") {
      // Check if price is -1 (price on request) and format accordingly
      const formattedPrice = price.amount && PriceUtils.isPriceOnRequest(price.amount)
        ? "-"
        : price.amount
          ? PriceUtils.formatPrice(price.amount)
          : "0 €";

      const shouldShowPricePerSqm =
        categoryId && PriceUtils.shouldShowPricePerSquareMeter(categoryId);

      // Remove "Ab" from planungspakete, keep it for nest modules and pvanlage
      const showAbPrefix = categoryId === "nest" || categoryId === "pvanlage";

      // Special handling for dash prices: center "-" without any subtitles
      if (formattedPrice === "-") {
        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              &nbsp;
            </p>
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              -
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      // Special handling for fenster & belichtungspaket: center price without "entspricht"
      if (categoryId === "fenster" || categoryId === "belichtungspaket") {
        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] text-gray-500 tracking-wide leading-[1.2]">
              &nbsp;
            </p>
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] text-gray-500 tracking-wide leading-[1.2]">
              {formattedPrice}
              {categoryId === "fenster" && "/m²"}
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      return (
        <div className="text-right">
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
            {showAbPrefix ? `Ab ${formattedPrice}` : formattedPrice}
          </p>
          <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
            entspricht
          </p>
          <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
            {categoryId === "pvanlage" && price.amount && !PriceUtils.isPriceOnRequest(price.amount)
              ? `${PriceUtils.formatPrice(Math.round(price.amount / 4))} / Panel`
              : shouldShowPricePerSqm && nestModel && price.amount
                ? PriceUtils.calculateOptionPricePerSquareMeter(
                    price.amount,
                    nestModel,
                    categoryId,
                    id,
                    geschossdeckeQuantity
                  )
                : ""}
          </p>
        </div>
      );
    }

    if (price.type === "upgrade") {
      // When amount is 0 (same price), only show "+/-" for ALL categories
      if (price.amount === 0) {
        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              +/-
            </p>
          </div>
        );
      }

      // Special handling for Belichtungspaket - center price without entspricht (only when amount !== 0)
      if (categoryId === "belichtungspaket") {
        const formattedPrice = price.amount
          ? PriceUtils.formatPrice(price.amount)
          : "0 €";

        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              &nbsp;
            </p>
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              {price.amount !== undefined && price.amount > 0
                ? `+${formattedPrice}`
                : formattedPrice}
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      // Special handling for Fenster - center price without entspricht (only when amount !== 0)
      if (categoryId === "fenster") {
        const formattedPrice = price.amount
          ? PriceUtils.formatPrice(price.amount)
          : "0 €";

        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              &nbsp;
            </p>
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              {price.amount !== undefined && price.amount > 0
                ? `+${formattedPrice}`
                : formattedPrice}
              /m²
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      // Check if price is -1 (price on request) and format accordingly
      const formattedPrice = price.amount && PriceUtils.isPriceOnRequest(price.amount)
        ? "-"
        : price.amount
          ? PriceUtils.formatPrice(price.amount)
          : "0 €";

      const shouldShowPricePerSqm =
        categoryId &&
        PriceUtils.shouldShowPricePerSquareMeter(categoryId) &&
        categoryId !== "fenster";

      // Special handling for dash prices: center "-" without any subtitles
      if (formattedPrice === "-") {
        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              &nbsp;
            </p>
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              -
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      return (
        <div className="text-right">
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
            {categoryId === "pvanlage" || categoryId === "geschossdecke"
              ? `Ab ${formattedPrice}` // PV-Anlage and Geschossdecke show "Ab" prefix
              : price.amount !== undefined && price.amount > 0
                ? `+${formattedPrice}`
                : formattedPrice}
          </p>
          <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
            entspricht
          </p>
          <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
            {categoryId === "pvanlage" && price.amount && !PriceUtils.isPriceOnRequest(price.amount)
              ? `${PriceUtils.formatPrice(Math.round(price.amount / 4))} / Panel`
              : shouldShowPricePerSqm &&
                  nestModel &&
                  price.amount &&
                  price.amount !== 0
                ? PriceUtils.calculateOptionPricePerSquareMeter(
                    price.amount,
                    nestModel,
                    categoryId,
                    id,
                    geschossdeckeQuantity
                  )
                : ""}
          </p>
        </div>
      );
    }

    if (price.type === "discount") {
      // Check if price is -1 (price on request) and format accordingly
      const formattedPrice = price.amount && PriceUtils.isPriceOnRequest(price.amount)
        ? "-"
        : price.amount
          ? PriceUtils.formatPrice(price.amount)
          : "0 €";

      const shouldShowPricePerSqm =
        categoryId &&
        PriceUtils.shouldShowPricePerSquareMeter(categoryId) &&
        categoryId !== "fenster";

      // When amount is 0 (same price), only show "+/-" for ALL categories
      if (price.amount === 0) {
        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              +/-
            </p>
          </div>
        );
      }

      // Special handling for dash prices: center "-" without any subtitles
      if (formattedPrice === "-") {
        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              &nbsp;
            </p>
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2]">
              -
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      // Special handling for Belichtungspaket - center price without entspricht (only when amount !== 0)
      if (categoryId === "belichtungspaket") {
        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] text-gray-700">
              &nbsp;
            </p>
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] text-gray-700">
              -{formattedPrice}
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      // Special handling for Fenster - center price without entspricht (only when amount !== 0)
      if (categoryId === "fenster") {
        return (
          <div className="text-right">
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] text-gray-700">
              &nbsp;
            </p>
            <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] text-gray-700">
              -{formattedPrice}/m²
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      return (
        <div className="text-right">
          <p className="text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] text-gray-700">
            -{formattedPrice}
          </p>
          <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
            entspricht
          </p>
          <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
            {categoryId === "pvanlage" && price.amount && !PriceUtils.isPriceOnRequest(price.amount)
              ? `${PriceUtils.formatPrice(Math.round(Math.abs(price.amount) / 4))} / Panel`
              : shouldShowPricePerSqm && nestModel && price.amount
                ? PriceUtils.calculateOptionPricePerSquareMeter(
                    price.amount,
                    nestModel,
                    categoryId,
                    id,
                    geschossdeckeQuantity
                  )
                : ""}
          </p>
        </div>
      );
    }

    if (price.type === "standard") {
      // Check if price is -1 (price on request) and format accordingly
      const formattedPrice = price.amount && PriceUtils.isPriceOnRequest(price.amount)
        ? "-"
        : price.amount
          ? PriceUtils.formatPrice(price.amount)
          : "0 €";

      const shouldShowPricePerSqm =
        categoryId &&
        PriceUtils.shouldShowPricePerSquareMeter(categoryId) &&
        categoryId !== "fenster";

      // Use grey text for selected options, even when type is "standard"
      const textColor = isSelected ? "text-gray-500" : "";

      // When amount is 0 (same price), only show "+/-" for ALL categories
      if (price.amount === 0) {
        return (
          <div className="text-right">
            <p className={`text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] ${textColor}`}>
              +/-
            </p>
          </div>
        );
      }

      // Special handling for dash prices: center "-" without any subtitles
      if (formattedPrice === "-") {
        return (
          <div className="text-right">
            <p className={`text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] ${textColor}`}>
              &nbsp;
            </p>
            <p className={`text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] ${textColor}`}>
              -
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      // Special handling for Belichtungspaket - center price without entspricht (only when amount !== 0)
      if (categoryId === "belichtungspaket") {
        return (
          <div className="text-right">
            <p className={`text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] ${textColor}`}>
              &nbsp;
            </p>
            <p className={`text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] ${textColor}`}>
              {formattedPrice}
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      // Special handling for Fenster - center price without entspricht (only when amount !== 0)
      if (categoryId === "fenster") {
        return (
          <div className="text-right">
            <p className={`text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] ${textColor}`}>
              &nbsp;
            </p>
            <p className={`text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] ${textColor}`}>
              {formattedPrice}/m²
            </p>
            <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500">
              &nbsp;
            </p>
          </div>
        );
      }

      return (
        <div className="text-right">
          <p
            className={`text-[clamp(0.625rem,1.1vw,0.875rem)] tracking-wide leading-[1.2] ${textColor}`}
          >
            {categoryId === "pvanlage" || categoryId === "geschossdecke"
              ? `Ab ${formattedPrice}`
              : formattedPrice}
          </p>
          <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
            entspricht
          </p>
          <p className="text-[clamp(0.475rem,0.95vw,0.725rem)] tracking-wide leading-[1.2] text-gray-500 mt-1">
            {categoryId === "pvanlage" && price.amount && !PriceUtils.isPriceOnRequest(price.amount)
              ? `${PriceUtils.formatPrice(Math.round(price.amount / 4))} / Panel`
              : categoryId === "geschossdecke" && price.amount && nestModel
                ? (() => {
                    // Calculate price per m² for geschossdecke: total price / (nest size + geschossdecke * 6.5)
                    const adjustedNutzflaeche = PriceUtils.getAdjustedNutzflaeche(nestModel, geschossdeckeQuantity);
                    if (adjustedNutzflaeche === 0) return '';
                    const pricePerSqm = Math.round(price.amount / adjustedNutzflaeche);
                    return `${PriceUtils.formatPrice(pricePerSqm)} /m²`;
                  })()
                : shouldShowPricePerSqm && nestModel && price.amount
                  ? PriceUtils.calculateOptionPricePerSquareMeter(
                      price.amount,
                      nestModel,
                      categoryId,
                      id,
                      geschossdeckeQuantity
                    )
                  : ""}
          </p>
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`box_selection flex justify-between items-center min-h-[6rem] lg:min-h-[5.5rem] border rounded-[1.2rem] px-[clamp(0.625rem,1.35vw,1.35rem)] py-[clamp(0.75rem,1.5vw,1rem)] cursor-pointer transition-all duration-200 min-w-0 min-h-[44px] relative outline-none focus:ring-2 focus:ring-[#3D6CE1] focus:ring-offset-2 ${
        isSelected
          ? "selected border-[#3D6CE1] shadow-[0_0_0_1px_#3D6CE1] bg-blue-50/50"
          : "border-gray-300 hover:border-[#3D6CE1] hover:shadow-sm"
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

      <div className={`box_selection_name flex-1 min-w-0 pr-[clamp(0.625rem,1.75vw,1.125rem)] ${((categoryId === "innenverkleidung" && id === "ohne_innenverkleidung") || (categoryId === "fussboden" && id === "ohne_belag") || (categoryId === "bodenaufbau" && id === "ohne_heizung")) ? "flex flex-col justify-center" : ""}`}>
        <p className={`font-medium text-[clamp(0.875rem,1.6vw,1.125rem)] tracking-wide leading-tight text-black`}>
          {name}
        </p>
        {(() => {
          // Don't show description if it's empty
          if (!description || description.trim() === "") {
            return null;
          }

          // Split description into lines for three-row layout
          const descriptionLines = description
            .split("\n")
            .filter((line) => line.trim());

          // For nest modules, the description already contains the proper format with newlines
          if (categoryId === "nest" && descriptionLines.length >= 2) {
            return (
              <>
                <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                  {descriptionLines[0]}
                </p>
                <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                  {descriptionLines[1]}
                </p>
              </>
            );
          }

          // For PV-Anlage, handle two-line descriptions with proper spacing
          if (categoryId === "pvanlage" && descriptionLines.length >= 2) {
            return (
              <>
                <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                  {descriptionLines[0]}
                </p>
                <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                  {descriptionLines[1]}
                </p>
              </>
            );
          }

          // For categories with descriptions that need three rows (but prevent wrapping)
          if (categoryId === "innenverkleidung" || categoryId === "fussboden") {
            if (descriptionLines.length >= 3) {
              return (
                <>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[0]}
                  </p>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[1]}
                  </p>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[2]}
                  </p>
                </>
              );
            } else if (descriptionLines.length >= 2) {
              // Only 2 rows, no empty 3rd row
              return (
                <>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[0]}
                  </p>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[1]}
                  </p>
                </>
              );
            } else {
              // Single line with empty second line
              return (
                <>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[0] || description}
                  </p>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700">
                    &nbsp;
                  </p>
                </>
              );
            }
          }

          // For belichtungspaket, keep mt-1 on first line, only 2 rows
          if (categoryId === "belichtungspaket") {
            if (descriptionLines.length >= 2) {
              return (
                <>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[0]}
                  </p>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[1]}
                  </p>
                </>
              );
            } else {
              // Single line with empty second line
              return (
                <>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[0] || description}
                  </p>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700">
                    &nbsp;
                  </p>
                </>
              );
            }
          }

          // For building envelope options, handle two-line descriptions now
          if (categoryId === "gebaeudehuelle") {
            if (descriptionLines.length >= 2) {
              return (
                <>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[0]}
                  </p>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[1]}
                  </p>
                </>
              );
            } else {
              return (
                <>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {descriptionLines[0] || description}
                  </p>
                  <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700">
                    &nbsp;
                  </p>
                </>
              );
            }
          }

          // Default: show description as two lines if possible, otherwise single line with empty second line
          if (descriptionLines.length >= 2) {
            return (
              <>
                <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                  {descriptionLines[0]}
                </p>
                <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                  {descriptionLines[1]}
                </p>
              </>
            );
          } else {
            return (
              <>
                <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                  {description}
                </p>
                <p className="text-[clamp(0.5rem,1vw,0.875rem)] tracking-wide leading-relaxed text-gray-700">
                  {/* Empty second line to maintain consistent height */}
                  &nbsp;
                </p>
              </>
            );
          }
        })()}
      </div>
      <div className="box_selection_price text-right whitespace-nowrap text-black flex-shrink-0 min-w-[clamp(5rem,12vw,7rem)]">
        {renderPrice()}
      </div>
    </div>
  );
}
