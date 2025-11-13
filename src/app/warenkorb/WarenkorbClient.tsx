"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { useConfiguratorStore } from "../../store/configuratorStore";
import { PriceCalculator } from "../konfigurator/core/PriceCalculator";
import { PriceUtils } from "../konfigurator/core/PriceUtils";
import { GRUNDSTUECKSCHECK_PRICE, PLANNING_PACKAGES } from "@/constants/configurator";
import type { CartItem, ConfigurationCartItem } from "../../store/cartStore";
import CheckoutStepper from "./components/CheckoutStepper";

import Footer from "@/components/Footer";

export default function WarenkorbClient() {
  const {
    items,
    isProcessingOrder: _isProcessingOrder,
    addConfigurationToCart,
    removeFromCart,
    clearCart,
    setOrderDetails,
    processOrder,
    getCartTotal,
    canProceedToCheckout: _canProceedToCheckout,
    setOhneNestMode,
    getIsOhneNestMode,
  } = useCartStore();

  const { configuration, getConfigurationForCart } = useConfiguratorStore();

  const [customerForm, _setCustomerForm] = useState({
    email: "",
    name: "",
    phone: "",
    notes: "",
  });

  // Load pricing data on mount for price calculations
  useEffect(() => {
    PriceCalculator.initializePricingData()
      .then(() => {
        console.log("✅ Warenkorb: Pricing data loaded successfully");
      })
      .catch((error) => {
        console.error("❌ Warenkorb: Failed to load pricing data:", error);
      });
  }, []);

  // URL hash mapping for checkout steps - wrapped in useMemo to prevent re-creation
  const stepToHash = useMemo(
    () =>
      ({
        0: "übersicht",
        1: "check-und-entwurf",
        2: "terminvereinbarung",
        3: "planungspakete",
        4: "abschluss",
      }) as const,
    []
  );

  const hashToStep = useMemo(
    () =>
      ({
        übersicht: 0,
        "check-und-entwurf": 1,
        terminvereinbarung: 2,
        planungspakete: 3,
        abschluss: 4,
      }) as const,
    []
  );

  // Step state to reflect progress at top of page - initialize from URL hash
  const [stepIndex, setStepIndex] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1); // Remove #
      const stepFromHash = hashToStep[hash as keyof typeof hashToStep];
      if (stepFromHash !== undefined) {
        return stepFromHash;
      }
    }
    return 0;
  });

  // State for payment redirect handling
  const [paymentRedirectStatus, setPaymentRedirectStatus] = useState<{
    show: boolean;
    success: boolean;
    paymentIntentId: string | null;
    amount: number;
    currency: string;
  } | null>(null);

  // Set default hash after component mounts to avoid setState during render
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for ohne-nest mode from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get("mode");

      // Check for payment redirect return
      const paymentIntent = urlParams.get("payment_intent");
      const redirectStatus = urlParams.get("redirect_status");

      // Handle payment redirect return (EPS, SOFORT, etc.)
      if (paymentIntent && redirectStatus) {
        console.log(
          "💳 Payment redirect detected:",
          paymentIntent,
          redirectStatus
        );

        // Verify payment status with backend
        fetch(`/api/payments/verify-redirect?payment_intent=${paymentIntent}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.status === "succeeded") {
              console.log("✅ Payment redirect verified as successful");
              setPaymentRedirectStatus({
                show: true,
                success: true,
                paymentIntentId: data.paymentIntentId,
                amount: data.amount,
                currency: data.currency,
              });
            } else if (data.status === "processing") {
              console.log("⏳ Payment is still processing");
              // Show processing state
              setPaymentRedirectStatus({
                show: true,
                success: false,
                paymentIntentId: data.paymentIntentId,
                amount: data.amount,
                currency: data.currency,
              });
            } else {
              console.error("❌ Payment redirect failed or canceled");
              // Could show error modal here
            }

            // Clean up URL parameters
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("payment_intent");
            newUrl.searchParams.delete("payment_intent_client_secret");
            newUrl.searchParams.delete("redirect_status");
            window.history.replaceState({}, "", newUrl.toString());
          })
          .catch((error) => {
            console.error("❌ Failed to verify payment redirect:", error);
          });
      }

      if (mode === "ohne-nest" || mode === "entwurf") {
        console.log("🏠 URL has ohne-nest/entwurf mode, setting to TRUE");
        setOhneNestMode(true);

        // Update the session to mark it as ohne-nest mode
        const sessionId = configuration?.sessionId;
        if (sessionId) {
          console.log("📝 Updating session to ohne-nest mode:", sessionId);
          fetch("/api/sessions/update-ohne-nest-mode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              isOhneNestMode: true,
            }),
          }).catch((error) => {
            console.warn("⚠️ Failed to update ohne-nest mode:", error);
          });
        }

        // Remove the mode parameter from URL to clean it up
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("mode");
        window.history.replaceState({}, "", newUrl.toString());
      } else if (mode === "configuration") {
        // Explicitly using configuration mode (from "Zum Warenkorb" button)
        console.log("🏠 URL has configuration mode, setting ohne-nest to FALSE");
        setOhneNestMode(false);

        // Update the session to mark it as normal mode
        const sessionId = configuration?.sessionId;
        if (sessionId) {
          console.log("📝 Updating session to configuration mode:", sessionId);
          fetch("/api/sessions/update-ohne-nest-mode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              isOhneNestMode: false,
            }),
          }).catch((error) => {
            console.warn("⚠️ Failed to update configuration mode:", error);
          });
        }

        // Remove the mode parameter from URL to clean it up
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("mode");
        window.history.replaceState({}, "", newUrl.toString());
      } else {
        // Check if this is a new session with no configuration selected
        // If no nest has been selected and configurator hasn't been opened, treat as ohne-nest mode
        const hasNestSelected = configuration?.nest != null;
        const hasAnyConfiguration = hasNestSelected || 
          configuration?.gebaeudehuelle != null ||
          configuration?.innenverkleidung != null ||
          configuration?.fussboden != null ||
          configuration?.belichtungspaket != null;

        if (!hasAnyConfiguration) {
          console.log(
            "🏠 No configuration found, automatically enabling ohne-nest mode (entwurf)"
          );
          setOhneNestMode(true);

          // Update the session to mark it as ohne-nest mode
          const sessionId = configuration?.sessionId;
          if (sessionId) {
            console.log("📝 Updating session to ohne-nest mode:", sessionId);
            fetch("/api/sessions/update-ohne-nest-mode", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sessionId,
                isOhneNestMode: true,
              }),
            }).catch((error) => {
              console.warn("⚠️ Failed to update ohne-nest mode:", error);
            });
          }
        } else {
          // User has a configuration, this is normal warenkorb mode
          console.log(
            "🏠 Configuration found, using normal warenkorb mode"
          );
          setOhneNestMode(false);
        }
      }

      // Set default hash if none exists
      if (!window.location.hash) {
        window.history.replaceState(null, "", "#übersicht");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount, sessionId captured at mount time

  // Handle step changes and update URL hash
  const handleStepChange = (nextIndex: number) => {
    setStepIndex(nextIndex);
    if (typeof window !== "undefined") {
      const targetHash = stepToHash[nextIndex as keyof typeof stepToHash];
      if (targetHash) {
        window.history.replaceState(null, "", `#${targetHash}`);
      }
    }
  };

  // Listen for hash changes to sync step index
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const stepFromHash = hashToStep[hash as keyof typeof hashToStep];
      if (stepFromHash !== undefined) {
        setStepIndex(stepFromHash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [hashToStep]);

  // Force cart update when planungspaket changes in configurator
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePlanungspaketChanged = () => {
      const cartConfig = getConfigurationForCart();

      if (cartConfig) {
        // Remove existing configurator items and add new one
        items.forEach((item) => {
          if ("isFromConfigurator" in item && item.isFromConfigurator) {
            removeFromCart(item.id);
          }
        });
        // Add updated configuration with new planungspaket
        setTimeout(() => {
          addConfigurationToCart(cartConfig);
        }, 50); // Reduced timeout for faster sync
      }
    };

    window.addEventListener(
      "planungspaket-changed",
      handlePlanungspaketChanged
    );
    return () =>
      window.removeEventListener(
        "planungspaket-changed",
        handlePlanungspaketChanged
      );
  }, [items, getConfigurationForCart, addConfigurationToCart, removeFromCart]);

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

    // DEBUG: Log the configuration being added to cart
    console.log("🛒 DEBUG: Adding configuration to cart:", cartConfig);
    if (cartConfig.gebaeudehuelle) {
      console.log(
        "🛒 DEBUG: Gebäudehülle being added:",
        cartConfig.gebaeudehuelle
      );
    }

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
          const sameBelichtungspaket =
            item.belichtungspaket?.value === cartConfig.belichtungspaket?.value;
          const sameStirnseite =
            item.stirnseite?.value === cartConfig.stirnseite?.value;
          const samePvanlage =
            item.pvanlage?.value === cartConfig.pvanlage?.value &&
            item.pvanlage?.quantity === cartConfig.pvanlage?.quantity;
          const sameFenster =
            item.fenster?.value === cartConfig.fenster?.value &&
            item.fenster?.squareMeters === cartConfig.fenster?.squareMeters;
          const samePlanungspaket =
            item.planungspaket?.value === cartConfig.planungspaket?.value;
          const sameKamindurchzug =
            item.kamindurchzug?.value === cartConfig.kamindurchzug?.value;
          const sameFussbodenheizung =
            item.fussbodenheizung?.value === cartConfig.fussbodenheizung?.value;
          const sameBodenaufbau =
            item.bodenaufbau?.value === cartConfig.bodenaufbau?.value;
          const sameGeschossdecke =
            item.geschossdecke?.value === cartConfig.geschossdecke?.value &&
            item.geschossdecke?.quantity === cartConfig.geschossdecke?.quantity;
          const sameFundament =
            item.fundament?.value === cartConfig.fundament?.value;
          // Handle grundstueckscheck comparison - cartConfig from configurator never has grundstueckscheck
          // So we only need to check if the cart item has it (if it does, they're different)
          const sameGrundstueckscheck = !item.grundstueckscheck;

          return (
            sameNest &&
            sameGebaeudehuelle &&
            sameInnenverkleidung &&
            sameFussboden &&
            sameBelichtungspaket &&
            sameStirnseite &&
            samePvanlage &&
            sameFenster &&
            samePlanungspaket &&
            sameKamindurchzug &&
            sameFussbodenheizung &&
            sameBodenaufbau &&
            sameGeschossdecke &&
            sameFundament &&
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
      // Check if configuration has actually changed before updating
      const existingItem = items.find((item) => {
        if ("sessionId" in item && item.isFromConfigurator) {
          if (cartConfig.sessionId && item.sessionId) {
            return item.sessionId === cartConfig.sessionId;
          }
        }
        return false;
      });

      if (
        existingItem &&
        "sessionId" in existingItem &&
        "nest" in existingItem
      ) {
        // Compare configurations to see if update is needed
        const configChanged =
          existingItem.gebaeudehuelle?.value !==
            cartConfig.gebaeudehuelle?.value ||
          existingItem.innenverkleidung?.value !==
            cartConfig.innenverkleidung?.value ||
          existingItem.fussboden?.value !== cartConfig.fussboden?.value ||
          existingItem.bodenaufbau?.value !== cartConfig.bodenaufbau?.value ||
          existingItem.geschossdecke?.value !==
            cartConfig.geschossdecke?.value ||
          existingItem.geschossdecke?.quantity !==
            cartConfig.geschossdecke?.quantity ||
          existingItem.fundament?.value !== cartConfig.fundament?.value ||
          existingItem.belichtungspaket?.value !==
            cartConfig.belichtungspaket?.value ||
          existingItem.pvanlage?.value !== cartConfig.pvanlage?.value ||
          existingItem.pvanlage?.quantity !== cartConfig.pvanlage?.quantity ||
          existingItem.fenster?.value !== cartConfig.fenster?.value ||
          existingItem.stirnseite?.value !== cartConfig.stirnseite?.value ||
          existingItem.planungspaket?.value !== cartConfig.planungspaket?.value;

        if (configChanged) {
          console.log("🛒 Configuration changed, updating cart item");
          // Use setTimeout to prevent race conditions
          setTimeout(() => {
            removeFromCart(existingItem.id);
            setTimeout(() => {
              addConfigurationToCart(cartConfig);
            }, 50);
          }, 10);
        } else {
          console.log("🛒 Configuration unchanged, skipping update");
        }
      }
    }
  }, [
    configuration,
    getConfigurationForCart,
    addConfigurationToCart,
    removeFromCart,
    items,
    hasManuallyCleared,
  ]);

  // Calculate monthly payment with total months
  const _calculateMonthlyPayment = (price: number) => {
    const months = 240;
    const interestRate = 0.035 / 12;
    const monthlyPayment =
      (price * (interestRate * Math.pow(1 + interestRate, months))) /
      (Math.pow(1 + interestRate, months) - 1);
    return PriceUtils.formatPrice(monthlyPayment);
  };

  // Get next higher planungspaket for upgrade suggestions
  const getNextPlanungspaket = (currentPackage?: string) => {
    // Use PLANNING_PACKAGES from constants to ensure consistency
    const packageHierarchy = PLANNING_PACKAGES.map(pkg => ({
      id: pkg.value,
      name: `Planung ${pkg.name}`,
      price: pkg.price
    }));

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
  const _getUpgradeSuggestion = (item: CartItem | ConfigurationCartItem) => {
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
        price: GRUNDSTUECKSCHECK_PRICE,
        description: "Grundstückscheck hinzufügen",
      };
    }

    return null;
  };

  // Handle form submission
  const _handleOrderSubmit = async (e: React.FormEvent) => {
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
  const _handleClearCart = () => {
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
      fussboden: "Bodenbelag",
      bodenaufbau: "Bodenaufbau",
      geschossdecke: "Geschossdecke",
      fundament: "Fundament",
      pvanlage: "PV-Anlage",
      fenster: "Fenster",
      planungspaket: "Planungspaket",
      grundstueckscheck: "Grundstückscheck",
    };
    return categoryNames[category] || category;
  };

  // Helper function to get the main configuration title
  const _getConfigurationTitle = (
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

  const scrollToContactForm = () => {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Render configuration item details
  const _renderConfigurationDetails = (
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
            "bodenaufbau",
            "geschossdecke",
          ].includes(key)
        ) {
          // Exclude fenster from cart display since its price is incorporated into belichtungspaket
          let displayName = selection.name;
          let displayPrice = selection.price || 0;

          if (
            key === "pvanlage" &&
            selection.quantity &&
            selection.quantity > 1
          ) {
            displayName = selection.name + " (" + selection.quantity + "x)";
            displayPrice = (selection.quantity || 1) * (selection.price || 0);
          }

          if (key === "geschossdecke" && selection.quantity) {
            if (selection.quantity > 1) {
              displayName = selection.name + " (" + selection.quantity + "x)";
            }
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
    <div
      className="min-h-screen bg-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      <div className="w-full">
        {items.length === 0 ? (
          /* Empty Cart */
          <section className="w-full py-16">
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal whitespace-nowrap bg-[#3D6CE1] text-white hover:bg-[#3D6CE1] focus:ring-[#3D6CE1] shadow-sm box-border px-3 py-1.5 text-sm xl:text-base 2xl:text-xl whitespace-nowrap"
                >
                  Zum Konfigurator
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <CheckoutStepper
            items={items}
            getCartTotal={getCartTotal}
            removeFromCart={removeFromCart}
            addConfigurationToCart={addConfigurationToCart}
            onScrollToContact={scrollToContactForm}
            stepIndex={stepIndex}
            onStepChange={handleStepChange}
            isOhneNestMode={getIsOhneNestMode()}
            paymentRedirectStatus={paymentRedirectStatus}
            onPaymentRedirectHandled={() => setPaymentRedirectStatus(null)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
