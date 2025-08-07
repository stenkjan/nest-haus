"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { useConfiguratorStore } from "../../store/configuratorStore";
import { PriceUtils } from "../konfigurator/core/PriceUtils";
import type { CartItem, ConfigurationCartItem } from "../../store/cartStore";

export default function WarenkorbClient() {
  const {
    items,
    isProcessingOrder,
    addConfigurationToCart,
    removeFromCart,
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
    const hasExistingConfig = items.some((item) => {
      if ("sessionId" in item && item.isFromConfigurator) {
        // If both have sessionId, compare them
        if (cartConfig.sessionId && item.sessionId) {
          return item.sessionId === cartConfig.sessionId;
        }

        // If no sessionId available, compare configuration content to avoid duplicates
        if ("nest" in item) {
          const sameNest = item.nest?.value === cartConfig.nest?.value;
          const sameGebaeudehuelle =
            item.gebaeudehuelle?.value === cartConfig.gebaeudehuelle?.value;
          const sameInnenverkleidung =
            item.innenverkleidung?.value === cartConfig.innenverkleidung?.value;
          const sameFussboden =
            item.fussboden?.value === cartConfig.fussboden?.value;
          const sameGrundstueckscheck =
            !!item.grundstueckscheck === !!cartConfig.grundstueckscheck;

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

  // Calculate monthly payment with total months
  const calculateMonthlyPayment = (price: number) => {
    const months = 240;
    const interestRate = 0.035 / 12;
    const monthlyPayment =
      (price * (interestRate * Math.pow(1 + interestRate, months))) /
      (Math.pow(1 + interestRate, months) - 1);
    return PriceUtils.formatPrice(monthlyPayment);
  };

  // Get next higher planungspaket for upgrade suggestions
  const getNextPlanungspaket = (currentPackage?: string) => {
    const packageHierarchy = [
      { id: "basis", name: "Planung Basis", price: 8900 },
      { id: "plus", name: "Planung Plus", price: 13900 },
      { id: "pro", name: "Planung Pro", price: 18900 },
    ];

    if (!currentPackage) {
      return packageHierarchy[0]; // Suggest basis if no package selected
    }

    const currentIndex = packageHierarchy.findIndex(
      (pkg) => pkg.id === currentPackage
    );
    if (currentIndex !== -1 && currentIndex < packageHierarchy.length - 1) {
      return packageHierarchy[currentIndex + 1];
    }

    return null; // No higher package available
  };

  // Get upgrade suggestion for user's configuration
  const getUpgradeSuggestion = (item: CartItem | ConfigurationCartItem) => {
    if (!("nest" in item) || !item.nest) return null;

    // Priority 1: Planungspaket upgrade
    const currentPlanungspaket = item.planungspaket?.value;
    const nextPlanungspaket = getNextPlanungspaket(currentPlanungspaket);

    if (nextPlanungspaket) {
      const currentPrice = item.planungspaket?.price || 0;
      const upgradePrice = nextPlanungspaket.price - currentPrice;
      return {
        type: "planungspaket",
        name: nextPlanungspaket.name,
        price: upgradePrice,
        description: "Planungspaket " + nextPlanungspaket.name + " hinzufügen",
      };
    }

    // Priority 2: Grundstückscheck if not selected
    if (!item.grundstueckscheck) {
      return {
        type: "grundstueckscheck",
        name: "Grundstückscheck",
        price: 2000,
        description: "Grundstückscheck hinzufügen",
      };
    }

    return null;
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
      console.log("Order processed successfully");
    }
  };

  // Handle clear cart with debugging
  const handleClearCart = () => {
    console.log("🛒 Clear cart button clicked");
    clearingCartRef.current = true;
    setHasManuallyCleared(true);
    clearCart();

    setTimeout(() => {
      clearingCartRef.current = false;
    }, 100);
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
      if (item.nest?.name) {
        return item.nest.name;
      } else if (item.grundstueckscheck && !item.nest) {
        return "Grundstückscheck";
      } else {
        return "Nest Konfiguration";
      }
    } else {
      if ("name" in item) {
        return item.name;
      } else {
        return "Artikel";
      }
    }
  };

  // Render configuration item details
  const renderConfigurationDetails = (
    item: CartItem | ConfigurationCartItem
  ) => {
    const details: Array<{
      label: string;
      value: string;
      price: number;
      isIncluded: boolean;
      category: string;
      isBottomItem?: boolean;
    }> = [];

    // Only render configuration details for ConfigurationCartItem
    if ("nest" in item) {
      // Filter configuration entries (exclude nest which is shown as main title)
      const configEntries = Object.entries(item).filter(
        ([key, selection]) =>
          selection &&
          key !== "sessionId" &&
          key !== "totalPrice" &&
          key !== "timestamp" &&
          key !== "id" &&
          key !== "addedAt" &&
          key !== "isFromConfigurator" &&
          key !== "nest"
      );

      const { middleItems, bottomItems } =
        PriceUtils.sortConfigurationEntries(configEntries);

      // Process middle items
      middleItems.forEach(([key, selection]) => {
        if (
          [
            "gebaeudehuelle",
            "innenverkleidung",
            "fussboden",
            "pvanlage",
            "fenster",
          ].includes(key)
        ) {
          let displayName = selection.name;
          let displayPrice = selection.price || 0;

          if (key === "fenster" && selection.squareMeters) {
            displayName =
              selection.name + " (" + selection.squareMeters + "m²)";
            displayPrice =
              (selection.squareMeters || 1) * (selection.price || 0);
          } else if (
            key === "pvanlage" &&
            selection.quantity &&
            selection.quantity > 1
          ) {
            displayName = selection.name + " (" + selection.quantity + "x)";
            displayPrice = (selection.quantity || 1) * (selection.price || 0);
          }

          const isIncluded = displayPrice === 0;

          details.push({
            label: getCategoryDisplayName(key),
            value: displayName,
            price: isIncluded ? 0 : displayPrice,
            isIncluded: isIncluded,
            category: key,
            isBottomItem: false,
          });
        }
      });

      // Process bottom items
      bottomItems.forEach(([key, selection]) => {
        if (key === "planungspaket" || key === "grundstueckscheck") {
          const displayName = selection.name;
          const displayPrice = selection.price || 0;
          const isIncluded = displayPrice === 0;

          details.push({
            label: getCategoryDisplayName(key),
            value: displayName,
            price: isIncluded ? 0 : displayPrice,
            isIncluded: isIncluded,
            category: key,
            isBottomItem: true,
          });
        }
      });
    }

    return details;
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: "5vh" }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Centered Header Section */}
          <div className="text-center mb-12">
            <h1 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4">
              Bereit einzuziehen?
            </h1>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto">
              Liefergarantie von 6 Monaten
            </h3>
            <div className="flex gap-4 justify-center items-center">
              <Link
                href="/konfigurator"
                className="bg-transparent border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors text-[clamp(0.875rem,1.5vw,1rem)] font-medium"
              >
                Neu konfigurieren
              </Link>
              <button
                onClick={() => {
                  const contactForm = document.getElementById("contact-form");
                  if (contactForm) {
                    contactForm.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors text-[clamp(0.875rem,1.5vw,1rem)] font-medium"
              >
                Check Out
              </button>
            </div>
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
            <div className="space-y-8">
              {/* Section Titles - Aligned */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <h3 className="text-[clamp(1rem,2.2vw,1.25rem)] font-medium tracking-[-0.015em] leading-[1.2]">
                  <span className="text-black">Dein Nest.</span>{" "}
                  <span className="text-[#999999]">Überblick</span>
                </h3>
                <h3 className="text-[clamp(1rem,2.2vw,1.25rem)] font-medium tracking-[-0.015em] leading-[1.2]">
                  Dein Preis
                </h3>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left: Cart Items */}
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-300 rounded-[19px] px-6 py-4"
                    >
                      {/* Item Header */}
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
                              "totalPrice" in item
                                ? item.totalPrice
                                : item.price
                            )}
                          </div>
                          {(() => {
                            const isConfigItem = "nest" in item;
                            if (isConfigItem) {
                              return !!item.nest;
                            } else {
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
                              für 240 Monate
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Configuration Details */}
                      <div className="space-y-4">
                        {(() => {
                          const details = renderConfigurationDetails(item);
                          const topAndMiddleItems = details.filter(
                            (detail) => !detail.isBottomItem
                          );
                          const bottomItems = details.filter(
                            (detail) => detail.isBottomItem
                          );

                          const renderDetailItem = (
                            detail: {
                              label: string;
                              value: string;
                              price: number;
                              isIncluded: boolean;
                              category: string;
                              isBottomItem?: boolean;
                            },
                            idx: number
                          ) => {
                            if (!detail.value || detail.value === "—")
                              return null;

                            return (
                              <div
                                key={detail.category + "-" + idx}
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
                                      {PriceUtils.formatPrice(
                                        detail.price || 0
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          };

                          return (
                            <>
                              {topAndMiddleItems.map(renderDetailItem)}
                              {bottomItems.length > 0 && (
                                <div className="border-t border-gray-200 pt-6 mt-4">
                                  {bottomItems.map((detail, idx) => (
                                    <div
                                      key={detail.category + "-" + idx}
                                      className={
                                        detail.category === "grundstueckscheck"
                                          ? "pt-2"
                                          : ""
                                      }
                                    >
                                      {renderDetailItem(detail, idx)}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          );
                        })()}
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

                {/* Right: Price Summary & Upgrade */}
                <div className="space-y-6">
                  {/* Price Summary Box */}
                  <div className="border border-gray-300 rounded-[19px] px-6 py-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3 gap-4">
                        <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black">
                          Anzahl Konfigurationen
                        </div>
                        <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                          {getCartCount()}
                        </div>
                      </div>

                      {/* Total Price - Removed "Gesamtpreis:" label */}
                      <div className="mt-6 text-right">
                        <h3 className="text-[clamp(16px,3vw,18px)] font-medium tracking-[-0.015em] leading-[1.2]">
                          <span className="font-medium text-black">
                            {PriceUtils.formatPrice(getCartTotal())}
                          </span>
                        </h3>
                        {/* Updated monthly payment format with total months */}
                        {items.some((item) => {
                          if (!("nest" in item)) return true;
                          return !!item.nest;
                        }) && (
                          <p className="text-[clamp(12px,2.5vw,12px)] text-gray-600 mt-2 leading-[1.3]">
                            oder {calculateMonthlyPayment(getCartTotal())} für
                            240 Monate
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upgrade Box */}
                  {(() => {
                    const upgradeItem = items.find(
                      (item) => "nest" in item && item.nest
                    );
                    const upgrade = upgradeItem
                      ? getUpgradeSuggestion(upgradeItem)
                      : null;

                    if (!upgrade) return null;

                    return (
                      <div className="border border-gray-300 rounded-[19px] px-6 py-4">
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black mb-2">
                              für weitere
                            </div>
                            <div className="text-[clamp(16px,3vw,18px)] font-medium tracking-[-0.015em] leading-[1.2] text-black mb-2">
                              {PriceUtils.formatPrice(upgrade.price)}
                            </div>
                            <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black mb-4">
                              {upgrade.description}
                            </div>
                            <button
                              onClick={() => {
                                // Find the configuration item to upgrade
                                const upgradeItem = items.find(
                                  (item) => "nest" in item && item.nest
                                ) as ConfigurationCartItem | undefined;

                                if (
                                  upgradeItem &&
                                  upgrade.type === "planungspaket"
                                ) {
                                  const nextPlanungspaket =
                                    getNextPlanungspaket(
                                      upgradeItem.planungspaket?.value
                                    );

                                  if (nextPlanungspaket) {
                                    // Create updated configuration item
                                    const updatedItem: ConfigurationCartItem = {
                                      ...upgradeItem,
                                      planungspaket: {
                                        category: "planungspaket",
                                        value: nextPlanungspaket.id,
                                        name: nextPlanungspaket.name,
                                        price: nextPlanungspaket.price,
                                        description: `Planungspaket ${nextPlanungspaket.name}`,
                                      },
                                      totalPrice:
                                        upgradeItem.totalPrice + upgrade.price,
                                    };

                                    // Remove the old item and add the updated one
                                    removeFromCart(upgradeItem.id);
                                    addConfigurationToCart(updatedItem);

                                    console.log(
                                      "🔄 Planungspaket upgraded:",
                                      nextPlanungspaket.name
                                    );
                                  }
                                } else if (
                                  upgradeItem &&
                                  upgrade.type === "grundstueckscheck"
                                ) {
                                  // Create updated configuration with grundstueckscheck
                                  const updatedItem: ConfigurationCartItem = {
                                    ...upgradeItem,
                                    grundstueckscheck: {
                                      category: "grundstueckscheck",
                                      value: "grundstueckscheck",
                                      name: "Grundstückscheck",
                                      price: 2000,
                                      description: "Grundstückscheck",
                                    },
                                    totalPrice: upgradeItem.totalPrice + 2000,
                                  };

                                  // Remove the old item and add the updated one
                                  removeFromCart(upgradeItem.id);
                                  addConfigurationToCart(updatedItem);

                                  console.log("🔄 Grundstückscheck added");
                                }
                              }}
                              className="w-full bg-gray-100 text-gray-700 py-3 rounded-full text-[clamp(14px,3vw,16px)] font-medium hover:bg-gray-200 transition-colors"
                            >
                              Hinzufügen
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Checkout Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        const contactForm =
                          document.getElementById("contact-form");
                        if (contactForm) {
                          contactForm.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="bg-blue-600 text-white py-3 px-8 rounded-full text-[clamp(14px,3vw,16px)] font-medium hover:bg-blue-700 transition-colors"
                    >
                      Check Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Form - Moved to bottom */}
              <div className="mt-16 max-w-2xl mx-auto">
                <div
                  className="border border-gray-300 rounded-[19px] px-6 py-4"
                  id="contact-form"
                >
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
