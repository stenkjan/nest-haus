/**
 * PriceDisplay - Reusable Price Component with Memoization
 * Optimized for performance with caching and consistent formatting
 */

"use client";

import React, { memo, useMemo } from "react";
import { PriceUtils } from "@/app/konfigurator/core/PriceUtils";

interface PriceDisplayProps {
  price: number;
  nestModel?: string;
  geschossdeckeQuantity?: number;
  showPerSquareMeter?: boolean;
  className?: string;
  priceClassName?: string;
  perSqmClassName?: string;
  prefix?: string;
  suffix?: string;
}

const PriceDisplay = memo(function PriceDisplay({
  price,
  nestModel,
  geschossdeckeQuantity = 0,
  showPerSquareMeter = false,
  className = "",
  priceClassName = "",
  perSqmClassName = "text-gray-600 mt-1",
  prefix = "",
  suffix = "",
}: PriceDisplayProps) {
  // Memoize price formatting to avoid recalculation
  const formattedPrice = useMemo(() => {
    return PriceUtils.formatPrice(price);
  }, [price]);

  // Memoize price per m² calculation
  const pricePerSqm = useMemo(() => {
    if (!showPerSquareMeter || !nestModel || price <= 0) return null;

    return PriceUtils.calculatePricePerSquareMeter(
      price,
      nestModel,
      geschossdeckeQuantity
    );
  }, [price, nestModel, geschossdeckeQuantity, showPerSquareMeter]);

  return (
    <div className={className}>
      <div className={priceClassName}>
        {prefix}
        {formattedPrice}
        {suffix}
      </div>
      {pricePerSqm && <div className={perSqmClassName}>{pricePerSqm}</div>}
    </div>
  );
});

export default PriceDisplay;
