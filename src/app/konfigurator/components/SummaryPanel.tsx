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
import { calculateSizeDependentPrice } from "@/constants/configurator";
import InfoBox from "./InfoBox";
import Button from "@/components/ui/Button";

interface SummaryPanelProps {
  onInfoClick?: (infoKey: string) => void;
  onReset?: () => void;
  className?: string;
}

export default function SummaryPanel({
  onInfoClick: _onInfoClick,
  onReset: _onReset,
  className = "",
}: SummaryPanelProps) {
  const {
    configuration,
    currentPrice,
    resetConfiguration: _resetConfiguration,
  } = useConfiguratorStore();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Enhanced item price calculation with dynamic pricing from Google Sheets
  const getItemPrice = (key: string, selection: ConfigurationItem): number => {
    // For nest, return the RAW nest base price from PriceCalculator
    if (key === "nest" && configuration?.nest) {
      try {
        const pricingData = PriceCalculator.getPricingData();
        if (pricingData) {
          const nestSize = configuration.nest.value as
            | "nest80"
            | "nest100"
            | "nest120"
            | "nest140"
            | "nest160";
          const nestBasePrice = pricingData.nest[nestSize]?.price || 0;
          return nestBasePrice; // Return RAW construction price only
        }
      } catch {
        // Fallback to stored price if pricing data not loaded yet
      }
      return selection.price || 0;
    }

    // For innenverkleidung, return RELATIVE price from PriceCalculator (baseline: ohne_innenverkleidung)
    if (key === "innenverkleidung" && configuration?.nest) {
      try {
        const pricingData = PriceCalculator.getPricingData();
        if (pricingData && selection.value) {
          const nestSize = configuration.nest.value as
            | "nest80"
            | "nest100"
            | "nest120"
            | "nest140"
            | "nest160";
          const innenverkleidungOption = selection.value as
            | "ohne_innenverkleidung"
            | "fichte"
            | "laerche"
            | "steirische_eiche";

          const absolutePrice =
            pricingData.innenverkleidung[innenverkleidungOption]?.[nestSize] ||
            0;
          const baselinePrice =
            pricingData.innenverkleidung.ohne_innenverkleidung?.[nestSize] || 0;

          // Return relative price (ohne_innenverkleidung = 0 baseline)
          return absolutePrice - baselinePrice;
        }
      } catch {
        // Fallback to stored price if pricing data not loaded yet
      }
      return selection.price || 0;
    }

    // For quantity-based items, calculate based on quantity/squareMeters
    if (key === "fenster") {
      // Fenster price is already included in belichtungspaket calculation, so return 0
      return 0;
    }

    // For belichtungspaket, calculate dynamic price
    if (key === "belichtungspaket" && configuration?.nest) {
      try {
        // Ensure we have valid selection data
        if (!selection.value || !configuration.nest.value) {
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

    // For gebäudehülle and fussboden, calculate dynamic price based on nest size
    if (
      (key === "gebaeudehuelle" || key === "fussboden") &&
      configuration?.nest
    ) {
      try {
        // First check if this option has a dash price in raw pricing data
        const pricingData = PriceCalculator.getPricingData();
        if (pricingData) {
          const nestSize = configuration.nest.value as "nest80" | "nest100" | "nest120" | "nest140" | "nest160";
          
          if (key === "gebaeudehuelle") {
            const rawPrice = pricingData.gebaeudehuelle[selection.value]?.[nestSize];
            if (rawPrice === -1) return -1; // Return -1 for dash prices
          }
          
          if (key === "fussboden") {
            const rawPrice = pricingData.bodenbelag[selection.value]?.[nestSize];
            if (rawPrice === -1) return -1; // Return -1 for dash prices
          }
        }
        
        // Calculate the price difference for this specific option
        const currentNestValue = configuration.nest.value;

        // Use defaults for base calculation
        const baseGebaeudehuelle = "trapezblech";
        const baseInnenverkleidung = "ohne_innenverkleidung";
        const baseFussboden = "ohne_belag";

        // Calculate base combination price (all defaults)
        const basePrice = PriceCalculator.calculateCombinationPrice(
          currentNestValue,
          baseGebaeudehuelle,
          baseInnenverkleidung,
          baseFussboden
        );

        // Calculate combination price with this specific option
        let testGebaeudehuelle = baseGebaeudehuelle;
        const testInnenverkleidung = baseInnenverkleidung;
        let testFussboden = baseFussboden;

        if (key === "gebaeudehuelle") testGebaeudehuelle = selection.value;
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

    // For bodenaufbau, calculate dynamic price using dedicated method
    if (key === "bodenaufbau" && configuration?.nest) {
      const selectionOption = {
        category: key,
        value: selection.value,
        name: selection.name,
        price: selection.price || 0,
      };
      return PriceCalculator.calculateBodenaufbauPrice(
        selectionOption,
        configuration.nest
      );
    }

    // For geschossdecke, calculate dynamic price using dedicated method
    if (key === "geschossdecke" && configuration?.nest) {
      const selectionOption = {
        category: key,
        value: selection.value,
        name: selection.name,
        price: selection.price || 0,
        quantity: selection.quantity,
      };
      return PriceCalculator.calculateGeschossdeckePrice(
        selectionOption,
        configuration.nest
      );
    }

    // For fundament, calculate dynamic price
    if (key === "fundament" && configuration?.nest) {
      return calculateSizeDependentPrice(configuration.nest.value, "fundament");
    }

    // For pvanlage, check pricing data for dash prices
    if (key === "pvanlage" && configuration?.nest) {
      try {
        const pricingData = PriceCalculator.getPricingData();
        if (pricingData && selection.quantity) {
          const nestSize = configuration.nest.value as "nest80" | "nest100" | "nest120" | "nest140" | "nest160";
          const price = pricingData.pvanlage.pricesByQuantity[nestSize]?.[selection.quantity];
          if (price === -1) return -1; // Return -1 for dash prices
          if (price !== undefined) return price;
        }
      } catch (error) {
        console.error("Error getting PV price from pricing data:", error);
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
                        {PriceUtils.isPriceOnRequest(itemPrice) ? (
                          <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                            -
                          </div>
                        ) : itemPrice > 0 ? (
                          <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                            {PriceUtils.formatPrice(itemPrice)}
                          </div>
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
                          {key === "fussboden"
                            ? `Bodenbelag - ${selection.name}`
                            : selection.name}
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
                            {PriceUtils.isPriceOnRequest(itemPrice) ? (
                              <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                                -
                              </div>
                            ) : (
                              <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                                {PriceUtils.formatPrice(itemPrice)}
                              </div>
                            )}
                          </>
                        ) : PriceUtils.isPriceOnRequest(itemPrice) ? (
                          <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                            -
                          </div>
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
                        {PriceUtils.isPriceOnRequest(itemPrice) ? (
                          <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                            -
                          </div>
                        ) : itemPrice > 0 ? (
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
                {PriceUtils.isPriceOnRequest(currentPrice)
                  ? "-"
                  : PriceUtils.formatPrice(currentPrice)}
              </span>
            </h3>
            <p className="text-[clamp(12px,2.5vw,12px)] text-gray-600 mt-2 leading-[1.3]">
              {PriceUtils.isPriceOnRequest(currentPrice)
                ? "Genauer Preis auf Anfrage"
                : configuration?.nest
                  ? (() => {
                      const price = currentPrice;
                      const nestModel = configuration.nest.value;
                      const geschossdeckeQty =
                        configuration.geschossdecke?.quantity || 0;
                      console.log("🏠 CONFIGURATOR PANEL m² calculation:", {
                        price,
                        nestModel,
                        geschossdeckeQty,
                        baseArea: PriceUtils.getAdjustedNutzflaeche(
                          nestModel,
                          0
                        ),
                        adjustedArea: PriceUtils.getAdjustedNutzflaeche(
                          nestModel,
                          geschossdeckeQty
                        ),
                        result: PriceUtils.calculatePricePerSquareMeter(
                          price,
                          nestModel,
                          geschossdeckeQty
                        ),
                      });
                      return `${PriceUtils.calculatePricePerSquareMeter(
                        price,
                        nestModel,
                        geschossdeckeQty
                      )} (Preise inkl. MwSt.)`;
                    })()
                  : ""}
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6">
          <InfoBox
            title="Noch Fragen offen?"
            description="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch."
            onClick={() => window.open("/kontakt", "_blank")}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 mb-6 flex justify-center">
          {isClient && (
            <div className="flex flex-col gap-3 w-full items-center">
              <Button
                variant="tertiary"
                onClick={() => {
                  // Navigate to warenkorb with ohne-nest flag
                  window.location.href = "/warenkorb?mode=konzept-check";
                }}
                className="bg-white text-[clamp(0.75rem,1.2vw,1rem)] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.3rem,0.6vw,0.5rem)] min-h-[44px] touch-manipulation whitespace-nowrap"
              >
                Konzept-Check
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}