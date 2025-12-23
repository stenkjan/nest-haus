"use client";

import React from "react";
import { PLANNING_PACKAGES } from "@/constants/configurator";
import { planungspaketeCardData } from "@/components/cards/PlanungspaketeCards";

interface CheckoutPlanungspaketeCardsProps {
  selectedPlan: string | null;
  onPlanSelect: (value: string) => void;
  basisDisplayPrice?: number;
}

export default function CheckoutPlanungspaketeCards({
  selectedPlan,
  onPlanSelect,
  basisDisplayPrice: _basisDisplayPrice = 0, // Basis is now included (0€)
}: CheckoutPlanungspaketeCardsProps) {
  // Helper function to get the corresponding card data from PlanungspaketeCards
  const getCardData = (packageValue: string) => {
    const cardMap = {
      basis: planungspaketeCardData[0], // Planungspaket 01 Basis
      plus: planungspaketeCardData[1], // Planungspaket 02 Plus
      pro: planungspaketeCardData[2], // Planungspaket 03 Pro
    };
    return cardMap[packageValue as keyof typeof cardMap];
  };

  // Helper function to format price consistently
  const formatPrice = (price: number): string => {
    if (price === 0) return "Standard";
    return new Intl.NumberFormat("de-AT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      {PLANNING_PACKAGES.map((pkg) => {
        const isSelected = selectedPlan === pkg.value;
        const isBasis = pkg.value === "basis";
        const cardData = getCardData(pkg.value);
        const displayPrice = formatPrice(pkg.price);

        return (
          <div key={pkg.value} className="h-full">
            <div
              className={`w-full h-full rounded-3xl overflow-hidden border bg-white cursor-pointer transition-all duration-200 hover:shadow-lg flex flex-col ${isSelected ? "border-blue-600 shadow-md" : "border-gray-300"
                }`}
              onClick={() => {
                // Allow deselection for Plus and Pro, but always keep Basis selected
                if (pkg.value === "basis") {
                  onPlanSelect(pkg.value);
                } else {
                  // For Plus and Pro: toggle selection, fallback to Basis if deselecting
                  if (isSelected) {
                    onPlanSelect("basis"); // Deselect by selecting Basis
                  } else {
                    onPlanSelect(pkg.value); // Select this package
                  }
                }
              }}
            >
              {/* Header Section - Title and Price */}
              <div className="px-6 pt-6">
                {/* Text above title - Different for each package */}
                <p className="p-primary text-nest-gray">
                  {pkg.value === "basis"
                    ? "Standard im Preis"
                    : pkg.value === "plus"
                      ? "Für Aufpreis erhältlich"
                      : "Für Aufpreis erhältlich"}
                </p>

                {/* Main Title */}
                <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-nest-gray mb-4">
                  <span className="text-black">
                    Planungspaket{" "}
                    {pkg.value === "basis"
                      ? "01"
                      : pkg.value === "plus"
                        ? "02"
                        : "03"}
                  </span>
                  <span className="text-nest-gray">
                    {" "}
                    {pkg.value === "basis"
                      ? "Basis"
                      : pkg.value === "plus"
                        ? "Plus"
                        : "Pro"}
                  </span>
                </h2>
              </div>

              {/* Content Section - Description - Shortened design with no line spacing */}
              <div className="px-6 py-4 flex-grow flex flex-col">
                {/* Only show the shortened description - p-primary small, no line spacing */}
                <div className="p-primary whitespace-pre-line">
                  {cardData?.description || pkg.description}
                </div>
              </div>

              {/* Price Section - Both mobile and desktop (at bottom) */}
              <div className="px-6 pb-6 flex-shrink-0">
                <div className="pt-4">
                  <div className="text-left">
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-regular text-gray-900">
                      {displayPrice}
                    </div>
                    <p className="p-primary-small text-nest-gray mt-2">
                      {pkg.value === "basis"
                        ? "in jedem ®Hoam inkludiert"
                        : pkg.value === "plus"
                          ? "Kosten nur bei Inanspruchnahme"
                          : "Kosten nur bei Inanspruchnahme"}
                    </p>
                  </div>
                  {/* Click instruction - right side, positioned lower */}
                  <div className="text-right mt-6">
                    <div className="text-xs text-gray-500 italic">
                      {isSelected
                        ? isBasis
                          ? "✓ Ausgewählt"
                          : "✓ Ausgewählt (Klicken zum Abwählen)"
                        : "Klicken zum Auswählen"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
