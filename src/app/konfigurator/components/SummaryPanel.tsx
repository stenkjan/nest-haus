/**
 * SummaryPanel - Configuration Summary Component
 *
 * Shows the complete configuration overview with pricing breakdown.
 * Extracted from legacy Configurator.tsx and integrated with Zustand store.
 */

"use client";

import React, { useState, useEffect } from "react";
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
  const { configuration, currentPrice, resetConfiguration } =
    useConfiguratorStore();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // REMOVED: getDynamicPrice variable no longer needed after reverting complex pricing logic

  // Enhanced item price calculation with dynamic pricing for belichtungspaket and stirnseite
  const getItemPrice = (key: string, selection: ConfigurationItem): number => {
    // For quantity-based items, calculate based on quantity/squareMeters
    if (key === "pvanlage") {
      return (selection.quantity || 1) * (selection.price || 0);
    }
    if (key === "fenster") {
      // Fenster price is already included in belichtungspaket calculation, so return 0
      return 0;
    }

    // For belichtungspaket, calculate dynamic price
    if (key === "belichtungspaket" && configuration?.nest) {
      try {
        // Ensure we have valid selection data
        if (!selection.value || !configuration.nest.value) {
          console.warn(
            "Invalid belichtungspaket or nest data, using base price"
          );
          return selection.price || 0;
        }

        const selectionOption = {
          category: key,
          value: selection.value,
          name: selection.name,
          price: selection.price || 0,
        };
        return PriceCalculator.calculateBelichtungspaketPrice(
          selectionOption,
          configuration.nest,
          configuration.fenster ?? undefined
        );
      } catch (error) {
        console.error(
          "Error calculating belichtungspaket price in summary:",
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
          configuration.fenster ?? undefined
        );
      } catch (error) {
        console.error("Error calculating stirnseite price in summary:", error);
        return selection.price || 0;
      }
    }

    // For gebäudehülle, innenverkleidung, and fussboden, calculate dynamic price based on nest size
    if (
      (key === "gebaeudehuelle" ||
        key === "innenverkleidung" ||
        key === "fussboden") &&
      configuration?.nest
    ) {
      try {
        // Calculate the price difference for this specific option
        const currentNestValue = configuration.nest.value;

        // Use defaults for base calculation
        const baseGebaeudehuelle = "trapezblech";
        const baseInnenverkleidung = "kiefer";
        const baseFussboden = "parkett";

        // Calculate base combination price (all defaults)
        const basePrice = PriceCalculator.calculateCombinationPrice(
          currentNestValue,
          baseGebaeudehuelle,
          baseInnenverkleidung,
          baseFussboden
        );

        // Calculate combination price with this specific option
        let testGebaeudehuelle = baseGebaeudehuelle;
        let testInnenverkleidung = baseInnenverkleidung;
        let testFussboden = baseFussboden;

        if (key === "gebaeudehuelle") testGebaeudehuelle = selection.value;
        if (key === "innenverkleidung") testInnenverkleidung = selection.value;
        if (key === "fussboden") testFussboden = selection.value;

        const combinationPrice = PriceCalculator.calculateCombinationPrice(
          currentNestValue,
          testGebaeudehuelle,
          testInnenverkleidung,
          testFussboden
        );

        // Return the price difference (this option's contribution)
        const optionPrice = combinationPrice - basePrice;
        return Math.max(0, optionPrice); // Don't show negative prices in summary
      } catch (error) {
        console.error(`Error calculating ${key} price in summary:`, error);
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
      plus: "Erweiterte Planungsleistungen",
      pro: "Vollumfängliche Planungsleistungen",
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

  // Helper function to get display name for belichtungspaket
  const getBelichtungspaketDisplayName = (
    belichtungspaket: ConfigurationItem,
    fenster?: ConfigurationItem | null
  ) => {
    if (!belichtungspaket) return "";

    const levelNames = {
      light: "Light",
      medium: "Medium",
      bright: "Bright",
    };

    const levelName =
      levelNames[belichtungspaket.value as keyof typeof levelNames] ||
      belichtungspaket.name;
    const fensterName = fenster?.name ? ` - ${fenster.name}` : " - PVC Fenster";

    return `Belichtungspaket ${levelName}${fensterName}`;
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
              // Exclude fenster from cart display since its price is incorporated into belichtungspaket and stirnseite
              const configEntries = Object.entries(configuration).filter(
                ([key, selection]) =>
                  selection &&
                  key !== "sessionId" &&
                  key !== "totalPrice" &&
                  key !== "timestamp" &&
                  key !== "fenster" // Fenster price is included in belichtungspaket/stirnseite calculations
              );

              const { topItems, middleItems, bottomItems } =
                PriceUtils.sortConfigurationEntries(configEntries);

              const renderConfigurationItem = ([key, selection]: [
                string,
                ConfigurationItem,
              ]) => {
                // Special handling for planungspaket with proper display and pricing
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
                              "belichtungspaket",
                              "stirnseite",
                            ].includes(key) && (
                              <div className="mb-1 text-black text-[clamp(12px,2.5vw,14px)]"></div>
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

                // Handle other selections (planungspaket handled above to avoid duplicates)
                if (selection.value && key !== "planungspaket") {
                  const itemPrice = getItemPrice(key, selection);

                  return (
                    <div
                      key={key}
                      className="flex justify-between items-center border-b border-gray-100 pb-3 gap-4"
                    >
                      <div className="flex-1 min-w-0 max-w-[50%]">
                        <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black break-words">
                          {key === "belichtungspaket"
                            ? getBelichtungspaketDisplayName(
                                selection,
                                configuration?.fenster ?? null
                              )
                            : key === "fenster"
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
                              <div className="mb-1 text-black text-[clamp(12px,2.5vw,14px)]"></div>
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
            <p className="text-[clamp(10px,2.2vw,12px)] text-gray-800 mb-3 leading-[1.3]">
              Wir arbeiten mit natürlichen Oberflächen, die Symbolbilder können
              von der tatsächlichen Farbbildung abweichen.
            </p>
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
            <div className="flex justify-center">
              {/* Neu konfigurieren Button - Only button */}
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
