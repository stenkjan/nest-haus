/**
 * SummaryPanel - Configuration Summary Component
 *
 * Shows the complete configuration overview with pricing breakdown.
 * Extracted from legacy Configurator.tsx and integrated with Zustand store.
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  useConfiguratorStore,
  type ConfigurationItem,
} from "@/store/configuratorStore";
import { PriceCalculator } from "../core/PriceCalculator"; // Re-added for dynamic price calculations
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
    resetConfiguration,
  } = useConfiguratorStore();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // REMOVED: getDynamicPrice variable no longer needed after reverting complex pricing logic

  // Enhanced item price calculation with dynamic pricing for beleuchtungspaket and stirnseite
  const getItemPrice = (key: string, selection: ConfigurationItem): number => {
    // For quantity-based items, calculate based on quantity/squareMeters
    if (key === "pvanlage") {
      return (selection.quantity || 1) * (selection.price || 0);
    }
    if (key === "fenster") {
      return (selection.squareMeters || 1) * (selection.price || 0);
    }

    // For beleuchtungspaket, calculate dynamic price
    if (key === "beleuchtungspaket" && configuration?.nest) {
      try {
        const selectionOption = {
          category: key,
          value: selection.value,
          name: selection.name,
          price: selection.price || 0,
        };
        return PriceCalculator.calculateBeleuchtungspaketPrice(
          selectionOption,
          configuration.nest,
          configuration.fenster || undefined
        );
      } catch (error) {
        console.error(
          "Error calculating beleuchtungspaket price in summary:",
          error
        );
        return selection.price || 0;
      }
    }

    // For stirnseite, calculate dynamic price
    if (key === "stirnseite" && selection.value !== "keine_verglasung") {
      try {
        const selectionOption = {
          category: key,
          value: selection.value,
          name: selection.name,
          price: selection.price || 0,
        };
        return PriceCalculator.calculateStirnseitePrice(
          selectionOption,
          configuration.fenster || undefined
        );
      } catch (error) {
        console.error("Error calculating stirnseite price in summary:", error);
        return selection.price || 0;
      }
    }

    // For all other items, use the base price
    return selection.price || 0;
  };

  const isItemIncluded = (
    key: string,
    selection: ConfigurationItem
  ): boolean => {
    // Use the calculated price to determine if item is included
    const calculatedPrice = getItemPrice(key, selection);
    return calculatedPrice === 0;
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
            {(() => {
              // Filter and sort configuration entries
              // Exclude fenster from cart display since its price is incorporated into beleuchtungspaket and stirnseite
              const configEntries = Object.entries(configuration).filter(
                ([key, selection]) =>
                  selection &&
                  key !== "sessionId" &&
                  key !== "totalPrice" &&
                  key !== "timestamp" &&
                  key !== "fenster" // Fenster price is included in beleuchtungspaket/stirnseite calculations
              );

              const { topItems, middleItems, bottomItems } =
                PriceUtils.sortConfigurationEntries(configEntries);

              const renderConfigurationItem = ([key, selection]: [
                string,
                ConfigurationItem,
              ]) => {
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
                            {![
                              "gebaeudehuelle",
                              "innenverkleidung",
                              "fussboden",
                              "beleuchtungspaket",
                              "stirnseite",
                            ].includes(key) && (
                              <div className="mb-1 text-black text-[clamp(12px,2.5vw,14px)]">
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
                            {![
                              "fenster",
                              "pvanlage",
                              "grundstueckscheck",
                            ].includes(key) && (
                              <div className="mb-1 text-black text-[clamp(12px,2.5vw,14px)]">
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
              };

              return (
                <>
                  {/* Top items (nest module) */}
                  {topItems.map(renderConfigurationItem)}

                  {/* Middle items (regular selections) */}
                  {middleItems.map(renderConfigurationItem)}

                  {/* Divider line before bottom items */}
                  {bottomItems.length > 0 && (
                    <div className="border-t border-gray-200 pt-6 mt-4">
                      {/* Bottom items (planungspaket, grundstueckscheck) */}
                      {bottomItems.map(([key, selection], _index) => (
                        <div
                          key={key}
                          className={key === "grundstueckscheck" ? "pt-2" : ""}
                        >
                          {renderConfigurationItem([key, selection])}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
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
            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-1">
              {/* Navigate to Warenkorb Button - Primary button first */}
              <Link
                href="/warenkorb"
                className={`bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal w-36 sm:w-40 lg:w-44 xl:w-48 2xl:w-56 px-2 py-1.5 text-sm xl:text-base 2xl:text-xl h-[44px] min-h-[44px] px-6 whitespace-nowrap ${
                  !isConfigurationComplete()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={(e) =>
                  !isConfigurationComplete() && e.preventDefault()
                }
              >
                {isConfigurationComplete() ? "Zum Warenkorb" : "Jetzt bauen"}
              </Link>

              {/* Neu konfigurieren Button - Secondary button beside on desktop, below on mobile */}
              <Button
                variant="tertiary"
                size="xs"
                onClick={() => resetConfiguration()}
                className="h-[44px] min-h-[44px] px-6 flex items-center justify-center whitespace-nowrap"
              >
                Neu konfigurieren
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
