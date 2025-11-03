"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { useCartStore } from "@/store/cartStore";

import { PriceUtils } from "../core/PriceUtils";

interface CartFooterProps {
  onReset?: () => void;
}

export default function CartFooter({ onReset }: CartFooterProps) {
  // Use same subscription pattern as SummaryPanel (which works correctly)
  const { currentPrice, resetConfiguration, configuration } =
    useConfiguratorStore();
  const { setOhneNestMode } = useCartStore();
  const router = useRouter();

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
      <div className="max-w-[1600px] mx-auto px-4 flex justify-between items-center">
        {/* Reset button */}
        <button
          className="bg-transparent border-none p-0 m-0 text-[#222] font-normal focus:outline-none cursor-pointer text-[clamp(0.7rem,1.1vw,0.9rem)] hover:text-[#3D6CE1] transition-colors touch-manipulation"
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
              {PriceUtils.formatPrice(currentPrice)}
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
                    return PriceUtils.calculatePricePerSquareMeter(
                      price,
                      nestModel,
                      geschossdeckeQty
                    );
                  })()
                : ""}
            </p>
          </div>

          {/* Cart button */}
          <button
            onClick={() => {
              // Reset ohne nest mode when going to warenkorb from regular konfigurator
              console.log("🛒 CartFooter: Deactivating ohne nest mode before navigating to warenkorb");
              setOhneNestMode(false);
              router.push("/warenkorb");
            }}
            className="bg-[#3D6CE1] text-white rounded-full font-medium text-[clamp(0.75rem,1.2vw,1rem)] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.3rem,0.6vw,0.5rem)] transition-all hover:bg-[#2855d6] min-h-[44px] flex items-center justify-center touch-manipulation cursor-pointer"
          >
            In den Warenkorb
          </button>
        </div>
      </div>
    </div>
  );
}
