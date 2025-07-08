/**
 * SummaryPanel - Configuration Summary Component
 *
 * Shows the complete configuration overview with pricing breakdown.
 * Extracted from legacy Configurator.tsx and integrated with Zustand store.
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { useCartStore } from "@/store/cartStore";
import { PriceCalculator } from "../core/PriceCalculator";
import { PriceUtils } from "../core/PriceUtils";
import InfoBox from "./InfoBox";
import Button from "@/components/ui/Button";

interface SummaryPanelProps {
  onInfoClick?: (infoKey: string) => void;
  className?: string;
}

export default function SummaryPanel({
  onInfoClick,
  className = "",
}: SummaryPanelProps) {
  const {
    configuration,
    currentPrice,
    isConfigurationComplete,
    getConfigurationForCart,
    resetConfiguration,
  } = useConfiguratorStore();

  const { addConfigurationToCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // PERFORMANCE FIX: Memoize dynamic price calculations to prevent recalculation during rendering
  const getDynamicPrice = useMemo(() => {
    if (!configuration?.nest) return () => null;

    const selections = {
      nest: {
        category: configuration.nest.category,
        value: configuration.nest.value,
        name: configuration.nest.name,
        price: configuration.nest.price,
      },
      gebaeudehuelle: configuration.gebaeudehuelle
        ? {
            category: configuration.gebaeudehuelle.category,
            value: configuration.gebaeudehuelle.value,
            name: configuration.gebaeudehuelle.name,
            price: configuration.gebaeudehuelle.price,
          }
        : undefined,
      innenverkleidung: configuration.innenverkleidung
        ? {
            category: configuration.innenverkleidung.category,
            value: configuration.innenverkleidung.value,
            name: configuration.innenverkleidung.name,
            price: configuration.innenverkleidung.price,
          }
        : undefined,
      fussboden: configuration.fussboden
        ? {
            category: configuration.fussboden.category,
            value: configuration.fussboden.value,
            name: configuration.fussboden.name,
            price: configuration.fussboden.price,
          }
        : undefined,
    };

    // Return a function that uses the memoized selections
    return (categoryId: string, selectionValue: string) => {
      if (
        !["gebaeudehuelle", "innenverkleidung", "fussboden"].includes(
          categoryId
        )
      ) {
        return null;
      }

      return PriceCalculator.getOptionDisplayPrice(
        configuration.nest!.value,
        selections,
        categoryId,
        selectionValue
      );
    };
  }, [
    configuration?.nest,
    configuration?.gebaeudehuelle,
    configuration?.innenverkleidung,
    configuration?.fussboden,
  ]);

  // SIMPLIFIED: Helper functions without unnecessary useCallback (per React docs)
  const getItemPrice = (
    key: string,
    selection: Record<string, unknown>
  ): number => {
    // For core categories that change with NEST size, use dynamic pricing
    if (["gebaeudehuelle", "innenverkleidung", "fussboden"].includes(key)) {
      const dynamicPrice = getDynamicPrice(key, selection.value as string);
      if (
        dynamicPrice &&
        dynamicPrice.type === "upgrade" &&
        dynamicPrice.amount
      ) {
        return dynamicPrice.amount;
      }
      return 0; // If it's included or no price
    }

    // For other items, calculate based on quantity/squareMeters
    if (key === "pvanlage") {
      return (
        ((selection.quantity as number) || 1) *
        ((selection.price as number) || 0)
      );
    }
    if (key === "fenster") {
      return (
        ((selection.squareMeters as number) || 1) *
        ((selection.price as number) || 0)
      );
    }

    // Default case
    return (selection.price as number) || 0;
  };

  const isItemIncluded = (
    key: string,
    selection: Record<string, unknown>
  ): boolean => {
    // For core categories that change with NEST size, check dynamic pricing
    if (["gebaeudehuelle", "innenverkleidung", "fussboden"].includes(key)) {
      const dynamicPrice = getDynamicPrice(key, selection.value as string);
      return !dynamicPrice || dynamicPrice.type === "included";
    }

    // For other items, check if price is 0
    if (!selection?.price) return true;
    return !(selection.price as number) || (selection.price as number) === 0;
  };

  if (!configuration) {
    return (
      <div className={`summary-panel p-6 ${className}`}>
        <p className="text-gray-500">Konfiguration wird geladen...</p>
      </div>
    );
  }

  // Helper function to get short description for packages
  const getPaketShortText = (paketValue: string) => {
    const paketDescriptions: Record<string, string> = {
      basis: "Grundlegende Planungsleistungen",
      komfort: "Erweiterte Planungsleistungen",
      premium: "Vollumfängliche Planungsleistungen",
    };
    return paketDescriptions[paketValue] || "Planungsleistungen";
  };

  // Helper function to get display name for fenster
  const getFensterDisplayName = (
    selection: { name: string; squareMeters?: number },
    forSummary: boolean = false
  ) => {
    if (!selection) return "";

    if (forSummary && selection.squareMeters) {
      return `${selection.name} (${selection.squareMeters}m²)`;
    }

    return selection.name;
  };

  return (
    <div className={`summary-panel ${className}`}>
      <div className="mt-12">
        <h3 className="text-[clamp(1rem,2.2vw,1.25rem)] font-medium tracking-[-0.015em] leading-[1.2] mb-4">
          <span className="text-black">Dein Nest.</span>{" "}
          <span className="text-[#999999]">Überblick</span>
        </h3>

        <div className="border border-gray-300 rounded-[19px] px-6 py-4">
          <div className="space-y-4">
            {/* Show all configuration items individually, including preselected ones */}
            {Object.entries(configuration).map(([key, selection]) => {
              if (
                !selection ||
                key === "sessionId" ||
                key === "totalPrice" ||
                key === "timestamp"
              ) {
                return null;
              }

              // Handle base configuration items (including preselected)
              if (
                key === "nest" ||
                key === "gebaeudehuelle" ||
                key === "innenverkleidung" ||
                key === "fussboden"
              ) {
                const itemPrice = getItemPrice(key, selection);
                const isIncluded = isItemIncluded(key, selection);

                return (
                  <div
                    key={key}
                    className="flex justify-between items-center border-b border-gray-100 pb-3 gap-4"
                  >
                    <div className="flex-1 min-w-0 max-w-[50%]">
                      <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black break-words">
                        {selection.name}
                      </div>
                      {selection.description && (
                        <div className="font-normal text-[clamp(10px,2.5vw,12px)] tracking-[0.03em] leading-[1.17] text-gray-600 mt-1 break-words">
                          {selection.description}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-right max-w-[50%] min-w-0">
                      {key === "nest" ? (
                        <>
                          <div className="mb-1 text-black text-[clamp(12px,2.5vw,14px)]">
                            Startpreis
                          </div>
                          <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                            {PriceUtils.formatPrice(selection.price || 0)}
                          </div>
                        </>
                      ) : !isIncluded && itemPrice > 0 ? (
                        <>
                          {/* Remove "zzgl." from specified sections */}
                          {![
                            "gebaeudehuelle",
                            "innenverkleidung",
                            "fussboden",
                          ].includes(key) && (
                            <div className="mb-1 text-black text-[clamp(12px,2.5vw,14px)]">
                              zzgl.
                            </div>
                          )}
                          <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                            {PriceUtils.formatPrice(itemPrice)}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-[clamp(12px,2.5vw,14px)]">
                          inkludiert
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Special handling for paket
              if (key === "planungspaket" && selection.value) {
                const itemPrice = getItemPrice(key, selection);

                return (
                  <div
                    key={key}
                    className="flex justify-between items-center border-b border-gray-100 pb-3 gap-4"
                  >
                    <div className="flex-1 min-w-0 max-w-[50%]">
                      <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black break-words">
                        {selection.name}
                      </div>
                      <div className="font-normal text-[clamp(10px,2.5vw,12px)] tracking-[0.03em] leading-[1.17] text-gray-600 mt-1 break-words">
                        {getPaketShortText(selection.value)}
                      </div>
                    </div>
                    <div className="flex-1 text-right max-w-[50%] min-w-0">
                      {itemPrice > 0 ? (
                        <>
                          {/* Remove "zzgl." from planungspaket */}
                          <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                            {PriceUtils.formatPrice(itemPrice)}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-[clamp(12px,2.5vw,14px)]">
                          inkludiert
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Handle other selections
              if (selection.value) {
                const itemPrice = getItemPrice(key, selection);

                return (
                  <div
                    key={key}
                    className="flex justify-between items-center border-b border-gray-100 pb-3 gap-4"
                  >
                    <div className="flex-1 min-w-0 max-w-[50%]">
                      <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black break-words">
                        {key === "fenster"
                          ? getFensterDisplayName(selection, true)
                          : selection.name}
                        {key === "pvanlage" &&
                          selection.quantity &&
                          selection.quantity > 1 &&
                          ` (${selection.quantity}x)`}
                      </div>
                      {selection.description && (
                        <div className="font-normal text-[clamp(10px,2.5vw,12px)] tracking-[0.03em] leading-[1.17] text-gray-600 mt-1 break-words">
                          {selection.description}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-right max-w-[50%] min-w-0">
                      {itemPrice > 0 ? (
                        <>
                          {/* Remove "zzgl." from fenster, pvanlage, and grundstueckscheck */}
                          {/* zzgl. is not shown for fenster, pvanlage, or grundstueckscheck as required */}
                          {![
                            "fenster",
                            "pvanlage",
                            "grundstueckscheck",
                          ].includes(key) && (
                            <div className="mb-1 text-black text-[clamp(12px,2.5vw,14px)]">
                              zzgl.
                            </div>
                          )}
                          <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                            {PriceUtils.formatPrice(itemPrice)}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-[clamp(12px,2.5vw,14px)]">
                          inkludiert
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* Total Price */}
          <div className="mt-6 text-right">
            <h3 className="text-[clamp(16px,3vw,18px)] font-medium tracking-[-0.015em] leading-[1.2]">
              <span className="text-black">Gesamtpreis:</span>
              <span className="font-medium">
                {" "}
                {PriceUtils.formatPrice(currentPrice)}
              </span>
            </h3>
            <p className="text-[clamp(12px,2.5vw,12px)] text-gray-600 mt-2 leading-[1.3]">
              {configuration?.nest
                ? PriceUtils.calculatePricePerSquareMeter(
                    currentPrice,
                    configuration.nest.value
                  )
                : ""}
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6">
          <InfoBox
            title="Noch Fragen offen?"
            description="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch."
            onClick={() => onInfoClick?.("beratung")}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6">
          {isClient && (
            <div className="flex gap-4">
              {/* Neu konfigurieren Button */}
              <Button
                variant="tertiary"
                size="xs"
                onClick={() => resetConfiguration()}
                className="flex-1"
              >
                Neu konfigurieren
              </Button>

              {/* Navigate to Warenkorb Button */}
              <Link href="/warenkorb" className="flex-1">
                <Button variant="landing-primary" size="xs" className="w-full">
                  {isConfigurationComplete()
                    ? `In den Warenkorb - ${PriceUtils.formatPrice(currentPrice)}`
                    : "Jetzt bauen"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
