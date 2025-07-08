"use client";

import React, { useEffect, useState } from "react";
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

  // Auto-add current configuration to cart if complete
  useEffect(() => {
    const cartConfig = getConfigurationForCart();
    if (
      cartConfig &&
      !items.find(
        (item) => "sessionId" in item && item.sessionId === cartConfig.sessionId
      )
    ) {
      addConfigurationToCart(cartConfig);
    }
  }, [configuration, getConfigurationForCart, addConfigurationToCart, items]);

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

  // Render configuration item details with right panel styling
  const renderConfigurationDetails = (
    item: CartItem | ConfigurationCartItem
  ) => {
    const details = [];

    // Only render configuration details for ConfigurationCartItem
    if ("nest" in item) {
      if (item.nest)
        details.push({
          label: "Nest",
          value: item.nest?.name ?? "—",
          price: item.nest?.price,
        });
      if (item.gebaeudehuelle)
        details.push({
          label: "Gebäudehülle",
          value: item.gebaeudehuelle?.name ?? "—",
          price: item.gebaeudehuelle?.price,
        });
      if (item.innenverkleidung)
        details.push({
          label: "Innenverkleidung",
          value: item.innenverkleidung?.name ?? "—",
          price: item.innenverkleidung?.price,
        });
      if (item.fussboden)
        details.push({
          label: "Fußboden",
          value: item.fussboden?.name ?? "—",
          price: item.fussboden?.price,
        });
      if (item.pvanlage)
        details.push({
          label: "PV-Anlage",
          value: `${item.pvanlage?.name ?? "—"}${item.pvanlage?.quantity ? ` (${item.pvanlage.quantity}x)` : ""}`,
          price: item.pvanlage?.price,
        });
      if (item.fenster)
        details.push({
          label: "Fenster",
          value: `${item.fenster?.name ?? "—"}${item.fenster?.squareMeters ? ` (${item.fenster.squareMeters}m²)` : ""}`,
          price: item.fenster?.price,
        });
      if (item.planungspaket)
        details.push({
          label: "Planungspaket",
          value: item.planungspaket?.name ?? "—",
          price: item.planungspaket?.price,
        });
      if (item.grundstueckscheck)
        details.push({
          label: "Grundstückscheck",
          value: item.grundstueckscheck?.name ?? "—",
          price: item.grundstueckscheck?.price,
        });
    } else {
      // For regular cart items, show basic info
      if ("name" in item) {
        details.push({ label: "Artikel", value: item.name, price: item.price });
        details.push({
          label: "Beschreibung",
          value: item.description,
          price: undefined,
        });
      }
    }

    return details;
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: "5vh" }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/konfigurator"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Zurück zum Konfigurator
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
                          {"nest" in item
                            ? item.nest?.name || "Nest Konfiguration"
                            : "name" in item
                              ? item.name
                              : "Artikel"}
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
                        <div className="text-[clamp(10px,2.5vw,12px)] text-gray-600 mt-1">
                          oder{" "}
                          {calculateMonthlyPayment(
                            "totalPrice" in item ? item.totalPrice : item.price
                          )}{" "}
                          monatlich
                        </div>
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
                              {detail.price && detail.price > 0 ? (
                                <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                                  {PriceUtils.formatPrice(detail.price)}
                                </div>
                              ) : (
                                <div className="text-gray-500 text-[clamp(12px,2.5vw,14px)]">
                                  inkludiert
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Item Actions */}
                    <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 text-[clamp(12px,2.5vw,14px)] transition-colors"
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                <div className="flex justify-center">
                  <button
                    onClick={clearCart}
                    className="text-gray-600 hover:text-gray-800 underline"
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
                      <p className="text-[clamp(12px,2.5vw,12px)] text-gray-600 mt-2 leading-[1.3]">
                        oder {calculateMonthlyPayment(getCartTotal())} monatlich
                      </p>
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
