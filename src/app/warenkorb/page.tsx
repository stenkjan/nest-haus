"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { useConfiguratorStore } from "../../store/configuratorStore";
import { PriceUtils } from "../konfigurator/core/PriceUtils";
import type { CartItem, ConfigurationCartItem } from "../../store/cartStore";

export default function WarenkorbPage() {
  const {
    items,
    isProcessingOrder,
    addConfigurationToCart,
    clearCart,
    setOrderDetails,
    processOrder,
    getCartTotal,
    getCartCount,
    canProceedToCheckout,
  } = useCartStore();

  const { configuration, getConfigurationForCart } = useConfiguratorStore();

  const [customerForm, setCustomerForm] = useState({
    email: "",
    name: "",
    phone: "",
    notes: "",
  });

  // Flag to prevent auto-add after manual cart clearing
  const [hasManuallyCleared, setHasManuallyCleared] = useState(false);
  const clearingCartRef = useRef(false);

  // Watch for cart changes for debugging
  useEffect(() => {
    console.log("🛒 Warenkorb: Cart items changed, count:", items.length);
  }, [items]);

  // Reset manual clear flag when configuration changes (user makes new selections)
  useEffect(() => {
    if (hasManuallyCleared) {
      console.log("🛒 Resetting manual clear flag due to configuration change");
      setHasManuallyCleared(false);
    }
  }, [configuration, hasManuallyCleared]);

  // Auto-add current configuration to cart if complete
  useEffect(() => {
    // Don't auto-add if user has manually cleared the cart or we're currently clearing
    if (hasManuallyCleared || clearingCartRef.current) {
      console.log(
        "🛒 Skipping auto-add because cart was manually cleared or being cleared"
      );
      return;
    }

    const cartConfig = getConfigurationForCart();
    if (!cartConfig) return;

    // Check if this exact configuration is already in the cart
    // Compare by sessionId if available, otherwise compare configuration content
    const hasExistingConfig = items.some((item) => {
      if ("sessionId" in item && item.isFromConfigurator) {
        // If both have sessionId, compare them
        if (cartConfig.sessionId && item.sessionId) {
          return item.sessionId === cartConfig.sessionId;
        }

        // If no sessionId available, compare configuration content to avoid duplicates
        if ("nest" in item) {
          // Compare key configuration values to detect duplicates
          const sameNest = item.nest?.value === cartConfig.nest?.value;
          const sameGebaeudehuelle =
            item.gebaeudehuelle?.value === cartConfig.gebaeudehuelle?.value;
          const sameInnenverkleidung =
            item.innenverkleidung?.value === cartConfig.innenverkleidung?.value;
          const sameFussboden =
            item.fussboden?.value === cartConfig.fussboden?.value;
          const sameGrundstueckscheck =
            !!item.grundstueckscheck === !!cartConfig.grundstueckscheck;

          // Consider it a duplicate if all main configuration values match
          return (
            sameNest &&
            sameGebaeudehuelle &&
            sameInnenverkleidung &&
            sameFussboden &&
            sameGrundstueckscheck
          );
        }
      }
      return false;
    });

    if (!hasExistingConfig) {
      console.log(
        "🛒 Adding configuration to cart:",
        cartConfig.nest?.name || "Grundstückscheck"
      );
      addConfigurationToCart(cartConfig);
    } else {
      console.log("🛒 Configuration already in cart, skipping duplicate");
    }
  }, [
    configuration,
    getConfigurationForCart,
    addConfigurationToCart,
    items,
    hasManuallyCleared,
  ]);

  // Calculate monthly payment
  const calculateMonthlyPayment = (price: number) => {
    const months = 240;
    const interestRate = 0.035 / 12;
    const monthlyPayment =
      (price * (interestRate * Math.pow(1 + interestRate, months))) /
      (Math.pow(1 + interestRate, months) - 1);
    return PriceUtils.formatPrice(monthlyPayment);
  };

  // Handle form submission
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerForm.email) return;

    setOrderDetails({
      customerInfo: {
        email: customerForm.email,
        name: customerForm.name || undefined,
        phone: customerForm.phone || undefined,
      },
      notes: customerForm.notes || undefined,
    });

    const success = await processOrder();
    if (success) {
      // Redirect to success page or show success message
      console.log("Order processed successfully");
    }
  };

  // Handle clear cart with debugging
  const handleClearCart = () => {
    console.log("🛒 Clear cart button clicked");
    console.log("🛒 Items before clear:", items.length);
    console.log("🛒 Items content before clear:", items);

    // Set immediate flag to prevent auto-add during clear operation
    clearingCartRef.current = true;

    // Set flag to prevent auto-add after clearing
    setHasManuallyCleared(true);

    clearCart();
    console.log("🛒 Clear cart function called");

    // Reset the clearing flag after clearing is complete
    setTimeout(() => {
      clearingCartRef.current = false;
      console.log("🛒 Items after clear (50ms):", items.length);
    }, 100);

    setTimeout(() => {
      console.log("🛒 Items after clear (200ms):", items.length);
      console.log("🛒 Items content after clear:", items);
    }, 200);
  };

  // Render configuration item details with right panel styling
  const renderConfigurationDetails = (
    item: CartItem | ConfigurationCartItem
  ) => {
    const details = [];

    // Only render configuration details for ConfigurationCartItem
    if ("nest" in item) {
      // Mirror SummaryPanel logic exactly - show all configuration items individually
      Object.entries(item).forEach(([key, selection]) => {
        if (
          !selection ||
          key === "sessionId" ||
          key === "totalPrice" ||
          key === "timestamp" ||
          key === "id" ||
          key === "addedAt" ||
          key === "isFromConfigurator"
        ) {
          return;
        }

        // Handle all configuration categories (except nest which is shown as the main title)
        if (
          key === "gebaeudehuelle" ||
          key === "innenverkleidung" ||
          key === "fussboden" ||
          key === "pvanlage" ||
          key === "fenster" ||
          key === "planungspaket" ||
          key === "grundstueckscheck"
        ) {
          let displayName = selection.name;
          let displayPrice = selection.price || 0;

          // Special formatting for specific categories
          if (key === "fenster" && selection.squareMeters) {
            displayName = `${selection.name} (${selection.squareMeters}m²)`;
            displayPrice =
              (selection.squareMeters || 1) * (selection.price || 0);
          } else if (
            key === "pvanlage" &&
            selection.quantity &&
            selection.quantity > 1
          ) {
            displayName = `${selection.name} (${selection.quantity}x)`;
            displayPrice = (selection.quantity || 1) * (selection.price || 0);
          }

          // Determine if the item price should be shown or marked as included
          const isIncluded = displayPrice === 0;

          details.push({
            label: getCategoryDisplayName(key),
            value: displayName,
            price: isIncluded ? 0 : displayPrice,
            isIncluded: isIncluded,
            category: key,
          });
        }
      });
    } else {
      // For regular cart items, show basic info
      if ("name" in item) {
        details.push({
          label: "Artikel",
          value: item.name,
          price: item.price,
          isIncluded: false,
          category: "item",
        });
        if (item.description) {
          details.push({
            label: "Beschreibung",
            value: item.description,
            price: 0,
            isIncluded: true,
            category: "description",
          });
        }
      }
    }

    return details;
  };

  // Helper function to get display names for categories
  const getCategoryDisplayName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      nest: "Nest",
      gebaeudehuelle: "Gebäudehülle",
      innenverkleidung: "Innenverkleidung",
      fussboden: "Fußboden",
      pvanlage: "PV-Anlage",
      fenster: "Fenster",
      planungspaket: "Planungspaket",
      grundstueckscheck: "Grundstückscheck",
    };
    return categoryNames[category] || category;
  };

  // Helper function to get the main configuration title
  const getConfigurationTitle = (
    item: CartItem | ConfigurationCartItem
  ): string => {
    if ("nest" in item) {
      // Configuration cart item
      if (item.nest?.name) {
        // Full configuration with nest module
        return item.nest.name;
      } else if (item.grundstueckscheck && !item.nest) {
        // Standalone grundstückscheck
        return "Grundstückscheck";
      } else {
        // Fallback for other configurations
        return "Nest Konfiguration";
      }
    } else {
      // Regular cart item
      if ("name" in item) {
        return item.name;
      } else {
        return "Artikel";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: "5vh" }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/konfigurator"
              className="bg-white/90 hover:bg-white rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Zurück zum Konfigurator"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="M19 12H5" />
                <path d="M12 19L5 12L12 5" />
              </svg>
            </Link>
            <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-medium tracking-[-0.015em] leading-[1.2]">
              <span className="text-black">Dein Nest.</span>{" "}
              <span className="text-[#999999]">Warenkorb</span>
            </h1>
          </div>

          {items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Ihr Warenkorb ist leer
              </h2>
              <p className="text-gray-600 mb-8">
                Konfigurieren Sie Ihr Nest-Haus, um es zum Warenkorb
                hinzuzufügen.
              </p>
              <Link
                href="/konfigurator"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zum Konfigurator
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-[clamp(1rem,2.2vw,1.25rem)] font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                  Ihre Konfigurationen
                </h3>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-300 rounded-[19px] px-6 py-4"
                  >
                    {/* Item Header with right panel styling */}
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                      <div className="flex-1 min-w-0 max-w-[70%]">
                        <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black break-words">
                          {getConfigurationTitle(item)}
                        </div>
                        <div className="font-normal text-[clamp(10px,2.5vw,12px)] tracking-[0.03em] leading-[1.17] text-gray-600 mt-1 break-words">
                          Hinzugefügt am{" "}
                          {new Date(
                            item.addedAt || Date.now()
                          ).toLocaleDateString("de-DE")}
                        </div>
                      </div>
                      <div className="flex-1 text-right max-w-[30%] min-w-0">
                        <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                          {PriceUtils.formatPrice(
                            "totalPrice" in item ? item.totalPrice : item.price
                          )}
                        </div>
                        {/* Show monthly payment only for house configurations (with nest module), not for grundstückscheck-only */}
                        {(() => {
                          const isConfigItem = "nest" in item;
                          if (isConfigItem) {
                            // Configuration items: show monthly only if has nest module
                            return !!item.nest;
                          } else {
                            // Regular cart items: always show monthly
                            return true;
                          }
                        })() && (
                          <div className="text-[clamp(10px,2.5vw,12px)] text-gray-600 mt-1">
                            oder{" "}
                            {calculateMonthlyPayment(
                              "totalPrice" in item
                                ? item.totalPrice
                                : item.price
                            )}{" "}
                            monatlich
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Configuration Details with right panel styling */}
                    <div className="space-y-4">
                      {renderConfigurationDetails(item).map((detail, idx) => {
                        if (!detail.value || detail.value === "—") return null;

                        return (
                          <div
                            key={idx}
                            className="flex justify-between items-center border-b border-gray-100 pb-3 gap-4"
                          >
                            <div className="flex-1 min-w-0 max-w-[50%]">
                              <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black break-words">
                                {detail.value}
                              </div>
                              <div className="font-normal text-[clamp(10px,2.5vw,12px)] tracking-[0.03em] leading-[1.17] text-gray-600 mt-1 break-words">
                                {detail.label}
                              </div>
                            </div>
                            <div className="flex-1 text-right max-w-[50%] min-w-0">
                              {detail.isIncluded ||
                              (detail.price && detail.price === 0) ? (
                                <div className="text-gray-500 text-[clamp(12px,2.5vw,14px)]">
                                  inkludiert
                                </div>
                              ) : (
                                <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                                  {PriceUtils.formatPrice(detail.price || 0)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleClearCart}
                    className="text-gray-600 hover:text-gray-800 underline text-[clamp(12px,2.5vw,14px)] transition-colors"
                  >
                    Warenkorb leeren
                  </button>
                </div>
              </div>

              {/* Order Summary & Checkout */}
              <div className="space-y-6">
                {/* Price Summary */}
                <div className="border border-gray-300 rounded-[19px] px-6 py-4">
                  <h3 className="text-[clamp(1rem,2.2vw,1.25rem)] font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                    Zusammenfassung
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3 gap-4">
                      <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black">
                        Anzahl Konfigurationen
                      </div>
                      <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                        {getCartCount()}
                      </div>
                    </div>

                    {/* Total Price with right panel styling */}
                    <div className="mt-6 text-right">
                      <h3 className="text-[clamp(16px,3vw,18px)] font-medium tracking-[-0.015em] leading-[1.2]">
                        <span className="text-black">Gesamtpreis:</span>
                        <span className="font-medium">
                          {" "}
                          {PriceUtils.formatPrice(getCartTotal())}
                        </span>
                      </h3>
                      {/* Show monthly payment only if cart contains house configurations (with nest module) */}
                      {items.some((item) => {
                        // Check if any item qualifies for monthly payment
                        if (!("nest" in item)) return true; // Regular cart items
                        return !!item.nest; // Configuration items with nest module
                      }) && (
                        <p className="text-[clamp(12px,2.5vw,12px)] text-gray-600 mt-2 leading-[1.3]">
                          oder {calculateMonthlyPayment(getCartTotal())}{" "}
                          monatlich
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Form */}
                <div className="border border-gray-300 rounded-[19px] px-6 py-4">
                  <h3 className="text-[clamp(1rem,2.2vw,1.25rem)] font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                    Kontaktdaten
                  </h3>

                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[clamp(12px,2.5vw,14px)] font-medium mb-2 text-black">
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerForm.email}
                        onChange={(e) =>
                          setCustomerForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[clamp(14px,3vw,16px)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ihre@email.de"
                      />
                    </div>

                    <div>
                      <label className="block text-[clamp(12px,2.5vw,14px)] font-medium mb-2 text-black">
                        Name
                      </label>
                      <input
                        type="text"
                        value={customerForm.name}
                        onChange={(e) =>
                          setCustomerForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[clamp(14px,3vw,16px)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ihr Name"
                      />
                    </div>

                    <div>
                      <label className="block text-[clamp(12px,2.5vw,14px)] font-medium mb-2 text-black">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={customerForm.phone}
                        onChange={(e) =>
                          setCustomerForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[clamp(14px,3vw,16px)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+49 123 456789"
                      />
                    </div>

                    <div>
                      <label className="block text-[clamp(12px,2.5vw,14px)] font-medium mb-2 text-black">
                        Nachricht (optional)
                      </label>
                      <textarea
                        value={customerForm.notes}
                        onChange={(e) =>
                          setCustomerForm((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[clamp(14px,3vw,16px)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Zusätzliche Informationen..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!canProceedToCheckout() || isProcessingOrder}
                      className="w-full bg-blue-600 text-white py-3 rounded-full text-[clamp(14px,3vw,16px)] font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
                    >
                      {isProcessingOrder
                        ? "Wird verarbeitet..."
                        : "Anfrage senden"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
