"use client";

import { useEffect, useRef } from "react";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { trackConfigurationComplete, trackAddToCart } from "@/lib/ga4-tracking";

import { PriceUtils } from "../core/PriceUtils";

interface CartFooterProps {
  onReset?: () => void;
}

export default function CartFooter({ onReset }: CartFooterProps) {
  // Use same subscription pattern as SummaryPanel (which works correctly)
  const { currentPrice, resetConfiguration, configuration } =
    useConfiguratorStore();

  const footerRef = useRef<HTMLDivElement>(null);

  // Set CSS variable for footer height (similar to navbar)
  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        const height = footerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--footer-height",
          height + "px"
        );
      }
    };

    updateFooterHeight();

    // Update on resize
    window.addEventListener("resize", updateFooterHeight);
    return () => window.removeEventListener("resize", updateFooterHeight);
  }, []);

  const handleReset = () => {
    resetConfiguration();
    if (onReset) {
      onReset();
    }
  };

  // Always enabled now since we have default selections
  const _isComplete = true;

  return (
    <div
      ref={footerRef}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-3 z-50" //Compact footer for maximum configurator space
    >
      <div className="max-w-[1536px] mx-auto px-4 flex justify-between items-center">
        {/* Reset button */}
        <button
          className="bg-transparent border-none p-0 m-0 text-[#3D6CE1] font-normal focus:outline-none cursor-pointer text-[clamp(0.7rem,1.1vw,0.9rem)] hover:text-[#2855d6] transition-colors touch-manipulation"
          style={{ minWidth: 0 }}
          onClick={handleReset}
          type="button"
        >
          Neu konfigurieren
        </button>

        <div className="flex items-center gap-[clamp(0.5rem,1.5vw,1rem)]">
          {/* Price and price per sqm */}
          <div className="text-right pr-[clamp(0.5rem,1vw,0.75rem)]">
            <p className="font-semibold leading-tight text-[clamp(0.875rem,1.8vw,1.25rem)] text-black">
              {PriceUtils.isPriceOnRequest(currentPrice)
                ? "-"
                : PriceUtils.formatPrice(currentPrice)}
            </p>
            <p className="text-[clamp(0.625rem,1vw,0.75rem)] text-gray-500 leading-tight">
              {configuration?.nest
                ? (() => {
                    const price = currentPrice;
                    const nestModel = configuration.nest.value;
                    const geschossdeckeQty =
                      configuration.geschossdecke?.quantity || 0;
                    console.log(
                      "🛒 CART FOOTER (in konfigurator) m² calculation:",
                      {
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
                      }
                    );
                    return `${PriceUtils.calculatePricePerSquareMeter(
                      price,
                      nestModel,
                      geschossdeckeQty
                    )} inkl. MwSt.`;
                  })()
                : ""}
            </p>
          </div>
          {/* Zum Warenkorb button */}
          <button
            onClick={() => {
              // NEW: If price is 0€, redirect to konzept-check (no interaction yet)
              if (currentPrice === 0) {
                console.log(
                  "🛒 CartFooter: No interaction yet - redirecting to konzept-check"
                );
                window.location.href = "/warenkorb#konzept-check";
                return;
              }

              // Build customization options array from configuration
              const customizationOptions: string[] = [];

              if (configuration.nest?.name) {
                customizationOptions.push(
                  `Nest_${configuration.nest.name.replace(/\s+/g, "_")}`
                );
              }
              if (configuration.gebaeudehuelle?.name) {
                customizationOptions.push(
                  `Fassade_${configuration.gebaeudehuelle.name.replace(/\s+/g, "_")}`
                );
              }
              if (configuration.innenverkleidung?.name) {
                customizationOptions.push(
                  `Innen_${configuration.innenverkleidung.name.replace(/\s+/g, "_")}`
                );
              }
              if (configuration.fussboden?.name) {
                customizationOptions.push(
                  `Boden_${configuration.fussboden.name.replace(/\s+/g, "_")}`
                );
              }
              if (configuration.belichtungspaket?.name) {
                customizationOptions.push(
                  `Belichtung_${configuration.belichtungspaket.name.replace(/\s+/g, "_")}`
                );
              }
              if (configuration.pvanlage?.name) {
                customizationOptions.push(
                  `PV_${configuration.pvanlage.name.replace(/\s+/g, "_")}`
                );
              }
              if (configuration.planungspaket?.name) {
                customizationOptions.push(
                  `Planung_${configuration.planungspaket.name.replace(/\s+/g, "_")}`
                );
              }
              if (configuration.kamindurchzug) {
                customizationOptions.push("Kamindurchzug_Ja");
              }
              if (configuration.fussbodenheizung) {
                customizationOptions.push("Fussbodenheizung_Ja");
              }
              if (configuration.fundament) {
                customizationOptions.push("Fundament_Ja");
              }

              // Track configuration complete event
              trackConfigurationComplete({
                houseModel: configuration.nest?.name || "Unknown",
                priceEstimated: currentPrice / 100, // Convert from cents to euros
                customizationOptions,
              });

              // Track add to cart event (ecommerce)
              const currentDate = new Date();
              const configId = `HOUSE-CONF-${configuration.sessionId?.substring(0, 8) || "TEMP"}-${currentDate.getMonth() + 1}${currentDate.getFullYear()}`;
              const itemName = `${configuration.nest?.name || "Nest Haus"} (Konfig. ${currentDate.getMonth() + 1}/${currentDate.getFullYear()})`;

              trackAddToCart({
                itemId: configId,
                itemName: itemName,
                price: currentPrice / 100, // Convert from cents to euros
                quantity: 1,
              });

              // Go to warenkorb with normal mode (with configuration)
              console.log(
                "🛒 CartFooter: Going to warenkorb with configuration"
              );
              // Use window.location.href for full page reload to ensure proper state initialization
              // Add mode=configuration to explicitly indicate we want to use the configuration
              window.location.href = "/warenkorb?mode=configuration";
            }}
            className="bg-[#3D6CE1] text-white rounded-full font-medium text-[clamp(0.75rem,1.2vw,1rem)] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.3rem,0.6vw,0.5rem)] transition-all hover:bg-[#2855d6] min-h-[44px] flex items-center justify-center touch-manipulation cursor-pointer"
          >
            {currentPrice === 0 ? "Konzept-Check bestellen" : "Zum Warenkorb"}
          </button>
        </div>
      </div>
    </div>
  );
}
