"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PriceUtils } from "@/app/konfigurator/core/PriceUtils";
import { PriceCalculator } from "@/app/konfigurator/core/PriceCalculator";
import type { CartItem, ConfigurationCartItem } from "@/store/cartStore";
import type { ConfigurationItem } from "@/store/configuratorStore";
import {
  PLANNING_PACKAGES,
  GRUNDSTUECKSCHECK_PRICE,
} from "@/constants/configurator";
import { GrundstueckCheckForm } from "@/components/sections";
import { AppointmentBooking } from "@/components/sections";
import {
  planungspaketeCardData,
  type PlanungspaketeCardData,
} from "@/components/cards/PlanungspaketeCards";
import { defaultSquareTextCardData } from "@/components/cards/SquareTextCard";
import {
  CheckoutStepCard,
  CheckoutPlanungspaketeCards,
} from "@/components/cards";
import { ImageManager } from "@/app/konfigurator/core/ImageManager";
import { HybridBlobImage } from "@/components/images";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { useCartStore } from "@/store/cartStore";
import type { ViewType } from "@/app/konfigurator/types/configurator.types";
import { CHECKOUT_STEPS } from "@/app/warenkorb/steps";
import { Button } from "@/components/ui";
// Overlay components for warenkorb preview
import PvModuleOverlay from "@/app/konfigurator/components/PvModuleOverlay";
import BelichtungsPaketOverlay from "@/app/konfigurator/components/BelichtungsPaketOverlay";
import FensterOverlay from "@/app/konfigurator/components/FensterOverlay";

interface CheckoutStepperProps {
  items: (CartItem | ConfigurationCartItem)[];
  getCartTotal: () => number;
  removeFromCart: (itemId: string) => void;
  addConfigurationToCart: (config: ConfigurationCartItem) => void;
  onScrollToContact?: () => void;
  stepIndex?: number;
  onStepChange?: (nextIndex: number) => void;
  hideProgress?: boolean;
}

export default function CheckoutStepper({
  items,
  getCartTotal,
  removeFromCart,
  addConfigurationToCart,
  onScrollToContact,
  stepIndex: controlledStepIndex,
  onStepChange,
  hideProgress = false,
}: CheckoutStepperProps) {
  const { getAppointmentSummary, getAppointmentSummaryShort, getDeliveryDate } =
    useCartStore();
  const [internalStepIndex, setInternalStepIndex] = useState<number>(0);
  const [_hasScrolledToBottom, setHasScrolledToBottom] =
    useState<boolean>(false);
  const isControlled =
    typeof controlledStepIndex === "number" &&
    typeof onStepChange === "function";
  const stepIndex = isControlled
    ? (controlledStepIndex as number)
    : internalStepIndex;
  const setStepIndex = (updater: number | ((i: number) => number)) => {
    const next =
      typeof updater === "function"
        ? (updater as (i: number) => number)(stepIndex)
        : updater;
    if (isControlled) {
      // Controlled: delegate to parent
      onStepChange!(Math.max(0, Math.min(next, steps.length - 1)));
    } else {
      // Uncontrolled or missing handler: update internal state
      setInternalStepIndex(Math.max(0, Math.min(next, steps.length - 1)));
    }
  };
  const {
    configuration,
    hasPart2BeenActive: _hasPart2BeenActive,
    hasPart3BeenActive: _hasPart3BeenActive,
  } = useConfiguratorStore();

  const configItem = useMemo(() => {
    return items.find((it) => "nest" in it && it.nest) as
      | ConfigurationCartItem
      | undefined;
  }, [items]);

  const [localSelectedPlan, setLocalSelectedPlan] = useState<string | null>(
    ((): string | null => {
      // Priority: configurator's current planungspaket > cart item's planungspaket
      const configuratorPlan = configuration?.planungspaket?.value;
      const cartPlan = (
        items.find((it) => "nest" in it && it.nest) as
          | ConfigurationCartItem
          | undefined
      )?.planungspaket?.value;
      const selectedPlan = configuratorPlan ?? cartPlan ?? "basis"; // Default to basis if nothing selected

      return selectedPlan;
    })()
  );

  useEffect(() => {
    // Sync with configurator's planungspaket when it changes, otherwise use cart item
    const configuratorPlan = configuration?.planungspaket?.value;
    const cartPlan = configItem?.planungspaket?.value;
    const selectedPlan = configuratorPlan ?? cartPlan ?? "basis"; // Default to basis

    setLocalSelectedPlan(selectedPlan);
  }, [
    configuration?.planungspaket?.value,
    configItem?.planungspaket?.value,
    localSelectedPlan,
  ]);

  // Listen for planungspaket changes from configurator to update local selection
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePlanungspaketChanged = () => {
      const configuratorPlan = configuration?.planungspaket?.value;
      const selectedPlan = configuratorPlan ?? "basis"; // Always ensure we have a selection
      setLocalSelectedPlan(selectedPlan);
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
  }, [configuration?.planungspaket?.value, localSelectedPlan]);

  // Ensure proper initialization after component mount (handles hydration timing)
  useEffect(() => {
    const configuratorPlan = configuration?.planungspaket?.value;
    const cartPlan = configItem?.planungspaket?.value;
    const selectedPlan = configuratorPlan ?? cartPlan ?? "basis";

    console.log(
      "🚀 CheckoutStepper: Post-mount planungspaket initialization:",
      {
        configuratorPlan,
        cartPlan,
        selectedPlan,
        currentLocal: localSelectedPlan,
        needsUpdate: localSelectedPlan !== selectedPlan,
        hasConfiguration: !!configuration,
        hasConfigItem: !!configItem,
      }
    );

    if (localSelectedPlan !== selectedPlan) {
      console.log(
        "🔄 CheckoutStepper: Correcting localSelectedPlan after mount"
      );
      setLocalSelectedPlan(selectedPlan);
    }
  }, [configuration, configItem, localSelectedPlan]);

  // Scroll detection for top forward button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if user has scrolled to within 100px of the bottom
      const hasReachedBottom = scrollTop + windowHeight >= documentHeight - 100;
      setHasScrolledToBottom(hasReachedBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = CHECKOUT_STEPS;

  // URL hash mapping for checkout steps - wrapped in useMemo to prevent re-creation
  const stepToHash = useMemo(
    () =>
      ({
        0: "übersicht",
        1: "vorentwurfsplan",
        2: "planungspakete",
        3: "terminvereinbarung",
        4: "liefertermin",
      }) as const,
    []
  );

  const hashToStep = useMemo(
    () =>
      ({
        übersicht: 0,
        vorentwurfsplan: 1,
        planungspakete: 2,
        terminvereinbarung: 3,
        liefertermin: 4,
      }) as const,
    []
  );

  // Initialize step from URL hash on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1); // Remove #
      const stepFromHash = hashToStep[hash as keyof typeof hashToStep];
      if (stepFromHash !== undefined && !isControlled) {
        setInternalStepIndex(stepFromHash);
      }
    }
  }, [hashToStep, isControlled]);

  // Listen for hash changes to update step
  useEffect(() => {
    if (typeof window === "undefined" || isControlled) return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const stepFromHash = hashToStep[hash as keyof typeof hashToStep];
      if (stepFromHash !== undefined) {
        setInternalStepIndex(stepFromHash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [hashToStep, isControlled]);

  // Update URL hash when step changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const targetHash = stepToHash[stepIndex as keyof typeof stepToHash];
      if (targetHash && window.location.hash !== `#${targetHash}`) {
        window.history.replaceState(null, "", `#${targetHash}`);
      }
    }
  }, [stepIndex, stepToHash]);

  const goNext = () => {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goPrev = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ensureGrundstueckscheckIncluded = () => {
    if (!configItem) return;
    const previousPrice = configItem.grundstueckscheck?.price || 0;

    const updated: ConfigurationCartItem = {
      ...configItem,
      grundstueckscheck: {
        category: "grundstueckscheck",
        value: "grundstueckscheck",
        name: "Grundstückscheck",
        price: GRUNDSTUECKSCHECK_PRICE,
        description: "Grundstückscheck",
      },
      totalPrice: Math.max(0, (configItem.totalPrice || 0) - previousPrice),
    };

    removeFromCart(configItem.id);
    addConfigurationToCart(updated);
  };

  const setPlanningPackage = (value: string) => {
    console.log("📦 CheckoutStepper: Setting planning package to:", value);

    if (!configItem) return;
    const target = PLANNING_PACKAGES.find((p) => p.value === value);
    if (!target) return;

    const previousPrice = configItem.planungspaket?.price || 0;
    const updated: ConfigurationCartItem = {
      ...configItem,
      planungspaket: {
        category: "planungspaket",
        value: target.value,
        name: target.name,
        price: target.price,
        description: target.description.replace(/\n/g, " "),
      },
      totalPrice: Math.max(
        0,
        (configItem.totalPrice || 0) - previousPrice + target.price
      ),
    };

    // Update configurator store to keep it in sync
    if (configuration) {
      console.log(
        "🔄 CheckoutStepper: Syncing planungspaket back to configurator store"
      );
      const { updateSelection } = useConfiguratorStore.getState();
      updateSelection({
        category: "planungspaket",
        value: target.value,
        name: target.name,
        price: target.price,
        description: target.description,
      });
    }

    removeFromCart(configItem.id);
    addConfigurationToCart(updated);
  };

  // Helpers for Überblick step
  const calculateMonthlyPayment = (price: number) => {
    const months = 240;
    const interestRate = 0.035 / 12;
    const monthlyPayment =
      (price * (interestRate * Math.pow(1 + interestRate, months))) /
      (Math.pow(1 + interestRate, months) - 1);
    return PriceUtils.formatPrice(monthlyPayment);
  };

  // Enhanced item price calculation - same logic as konfigurator SummaryPanel
  const getItemPrice = (
    key: string,
    selection: ConfigurationItem,
    cartItemConfig: ConfigurationCartItem
  ): number => {
    // For quantity-based items, calculate based on quantity/squareMeters
    if (key === "pvanlage") {
      return (selection.quantity || 1) * (selection.price || 0);
    }
    if (key === "fenster") {
      // Fenster price is already included in belichtungspaket calculation, so return 0
      return 0;
    }

    // For belichtungspaket, calculate dynamic price
    if (key === "belichtungspaket" && cartItemConfig?.nest) {
      try {
        // Ensure we have valid selection data
        if (!selection.value || !cartItemConfig.nest.value) {
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
          cartItemConfig.nest,
          cartItemConfig.fenster ?? undefined
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
          cartItemConfig.fenster ?? undefined
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
      cartItemConfig?.nest
    ) {
      try {
        // Calculate the price difference for this specific option
        const currentNestValue = cartItemConfig.nest.value;

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
    selection: ConfigurationItem,
    cartItemConfig: ConfigurationCartItem
  ): boolean => {
    // Use the calculated price to determine if item is included
    const calculatedPrice = getItemPrice(key, selection, cartItemConfig);
    return calculatedPrice === 0;
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

  const getConfigurationTitle = (
    item: CartItem | ConfigurationCartItem
  ): string => {
    if ("nest" in item) {
      if (item.nest?.name) return item.nest.name;
      if (item.grundstueckscheck && !item.nest) return "Grundstückscheck";
      return "Nest Konfiguration";
    }
    if ("name" in item) return item.name;
    return "Artikel";
  };

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

    if ("nest" in item) {
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

      middleItems.forEach(([key, selection]) => {
        if (
          [
            "gebaeudehuelle",
            "innenverkleidung",
            "fussboden",
            "pvanlage",
            "belichtungspaket",
            "stirnseite",
          ].includes(key)
        ) {
          // Exclude fenster from cart display since its price is incorporated into belichtungspaket and stirnseite
          // Use the same price calculation logic as konfigurator
          const calculatedPrice = getItemPrice(
            key,
            selection,
            item as ConfigurationCartItem
          );
          const isIncluded = isItemIncluded(
            key,
            selection,
            item as ConfigurationCartItem
          );

          let displayName = selection.name;

          // Special display name handling
          if (key === "belichtungspaket") {
            displayName = getBelichtungspaketDisplayName(
              selection,
              (item as ConfigurationCartItem).fenster ?? null
            );
          } else if (
            key === "pvanlage" &&
            selection.quantity &&
            selection.quantity > 1
          ) {
            displayName = `${selection.name} (${selection.quantity}x)`;
          }

          details.push({
            label: getCategoryDisplayName(key),
            value: displayName,
            price: isIncluded ? 0 : calculatedPrice,
            isIncluded,
            category: key,
            isBottomItem: false,
          });
        }
      });

      bottomItems.forEach(([key, selection]) => {
        // Show planungspaket in cart details
        if (key === "planungspaket" || key === "grundstueckscheck") {
          const displayName = selection.name;
          const displayPrice = selection.price || 0;
          // Only "basis" planungspaket is included (0€), others show actual price
          const isIncluded = displayPrice === 0 && key === "planungspaket";

          details.push({
            label: getCategoryDisplayName(key),
            value: displayName,
            price: displayPrice,
            isIncluded,
            category: key,
            isBottomItem: true,
          });
        }
      });
    }

    return details;
  };

  const getNextPlanungspaket = (currentPackage?: string) => {
    const packageHierarchy = [
      { id: "basis", name: "Planung Basis", price: 8900 },
      { id: "plus", name: "Planung Plus", price: 13900 },
      { id: "pro", name: "Planung Pro", price: 18900 },
    ];
    if (!currentPackage) return packageHierarchy[0];
    const currentIndex = packageHierarchy.findIndex(
      (pkg) => pkg.id === currentPackage
    );
    if (currentIndex !== -1 && currentIndex < packageHierarchy.length - 1) {
      return packageHierarchy[currentIndex + 1];
    }
    return null;
  };

  const _getUpgradeSuggestion = (item: CartItem | ConfigurationCartItem) => {
    if (!("nest" in item) || !item.nest) return null;
    const currentPlanungspaket = item.planungspaket?.value;
    const nextPlanungspaket = getNextPlanungspaket(currentPlanungspaket);
    if (nextPlanungspaket) {
      const currentPrice = item.planungspaket?.price || 0;
      const upgradePrice = nextPlanungspaket.price - currentPrice;
      return {
        type: "planungspaket" as const,
        name: nextPlanungspaket.name,
        price: upgradePrice,
        description: `Planungspaket ${nextPlanungspaket.name} hinzufügen`,
      };
    }
    if (!item.grundstueckscheck) {
      return {
        type: "grundstueckscheck" as const,
        name: "Grundstückscheck",
        price: GRUNDSTUECKSCHECK_PRICE,
        description: "Grundstückscheck hinzufügen",
      };
    }
    return null;
  };

  const renderProgress = () => {
    return (
      <div className="w-full mb-6">
        {/* Desktop/Tablet */}
        <div className="relative hidden md:block">
          {/* Connecting Line - Only between dots, not extending to edges */}
          {steps.length > 1 && (
            <div
              className="absolute top-3 h-0.5 bg-gray-200"
              style={{
                left: `${100 / steps.length / 2}%`,
                right: `${100 / steps.length / 2}%`,
              }}
            />
          )}
          {/* Progress Line - Only between dots */}
          {steps.length > 1 && (
            <div
              className="absolute top-3 h-0.5 bg-blue-500 transition-all duration-300"
              style={{
                left: `${100 / steps.length / 2}%`,
                width:
                  stepIndex === 0
                    ? "0%"
                    : `${(stepIndex / (steps.length - 1)) * (100 - 100 / steps.length)}%`,
              }}
            />
          )}
          <div className="grid grid-cols-5 gap-0">
            {steps.map((label, idx) => {
              const isDone = idx < stepIndex;
              const isCurrent = idx === stepIndex;
              const circleClass = isDone
                ? "bg-blue-500 border-blue-500"
                : isCurrent
                  ? "bg-white border-blue-500"
                  : "bg-white border-gray-300";
              const dotInner = isDone ? (
                <span className="w-2 h-2 bg-white rounded-full" />
              ) : null;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                    aria-label={`Schritt ${idx + 1}: ${label}`}
                  >
                    {dotInner}
                  </div>
                  <div className="mt-2 text-sm text-center text-gray-700 leading-tight break-words px-1">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Compact Dots with current step title */}
        <div className="md:hidden">
          {/* Top row with circles and labels */}
          <div className="relative mb-1">
            {/* Top row connecting line - between 3 dots */}
            <div
              className="absolute top-2.5 h-0.5 bg-gray-200"
              style={{
                left: `${100 / 3 / 2}%`, // 16.67%
                right: `${100 / 3 / 2}%`, // 16.67%
              }}
            />
            {/* Top row progress line */}
            <div
              className="absolute top-2.5 h-0.5 bg-blue-500 transition-all duration-300"
              style={{
                left: `${100 / 3 / 2}%`,
                width:
                  Math.min(stepIndex, 2) === 0
                    ? "0%"
                    : `${(Math.min(stepIndex, 2) / 2) * (100 - 100 / 3)}%`,
              }}
            />
            <div className="grid grid-cols-3 gap-2">
              {steps.slice(0, 3).map((label, i) => {
                const idx = i;
                const isDone = idx < stepIndex;
                const isCurrent = idx === stepIndex;
                const circleClass = isDone
                  ? "bg-blue-500 border-blue-500"
                  : isCurrent
                    ? "bg-white border-blue-500"
                    : "bg-white border-gray-300";
                const dotInner = isDone ? (
                  <span className="w-2 h-2 bg-white rounded-full" />
                ) : null;
                return (
                  <div
                    key={`mrow1-${idx}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                    >
                      {dotInner}
                    </div>
                    <div className="mt-1 text-[11px] text-center text-gray-700 leading-tight break-words px-1">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Bottom row with circles and labels */}
          <div className="relative mt-2">
            {/* Bottom row connecting line - between 2 dots */}
            <div
              className="absolute top-2.5 h-0.5 bg-gray-200"
              style={{
                left: `${100 / 2 / 2}%`, // 25%
                right: `${100 / 2 / 2}%`, // 25%
              }}
            />
            {/* Bottom row progress line */}
            <div
              className="absolute top-2.5 h-0.5 bg-blue-500 transition-all duration-300"
              style={{
                left: `${100 / 2 / 2}%`,
                width: stepIndex <= 3 ? "0%" : "50%", // Full progress between the 2 dots when on step 4
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              {steps.slice(3).map((label, i) => {
                const idx = i + 3;
                const isDone = idx < stepIndex;
                const isCurrent = idx === stepIndex;
                const circleClass = isDone
                  ? "bg-blue-500 border-blue-500"
                  : isCurrent
                    ? "bg-white border-blue-500"
                    : "bg-white border-gray-300";
                const dotInner = isDone ? (
                  <span className="w-2 h-2 bg-white rounded-full" />
                ) : null;
                return (
                  <div
                    key={`mrow2-${idx}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                    >
                      {dotInner}
                    </div>
                    <div className="mt-1 text-[11px] text-center text-gray-700 leading-tight break-words px-1">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const copyByStep: Array<{
    title: string;
    subtitle: string;
    description: string;
  }> = [
    {
      title: "Bereit für dein neues Zuhause?",
      subtitle:
        "In wenigen Schritten zu deinem neuen Zuhause - ganz ohne Verpflichtungen!",
      description:
        "Du hast dich für dein Nest-Haus entschieden. In den nächsten Schritten klären wir gemeinsam, was wir von dir benötigen und was wir für dich übernehmen, damit dein Zuhause genau so wird, wie du es dir wünschst. \n\n Wir kümmern uns um die Rahmenbedingungen und rechtlichen Schritte. Bis dahin zahlst du nur für unseren Service – keine Verpflichtung, falls etwas nicht passt.",
    },
    {
      title: "Eine starke Basis",
      subtitle: "Vorentwurf und Grundstückscheck",
      description:
        "Mit dem **Grundstückscheck** prüfen wir alle **relevanten Rahmenbedingungen** wie Bebauungsrichtlinien, Abstände, Zufahrten und Anschlüsse. So weißt du von Anfang an, womit du planen kannst und hast die **Sicherheit**, dass dein Projekt auf **soliden Grundlagen** steht.\n\nIm **Vorentwurf** legen wir gemeinsam die Position deiner Fenster und Türen fest. Schritt für Schritt entsteht so **ein Grundriss, der zu deinem Alltag passt**. All diese Leistungen sind Teil des **Planungspakets Basis**, das bereits **im Preis** deines Nest Hauses **enthalten ist**.",
    },
    {
      title: "Unser Service",
      subtitle: "Unsere Planungspakete sind hier, um dich zu unterstützen!",
      description:
        "Deine aktuelle Konfiguration enthält das Paket Basis. Dieses ist bereits im Preis deines Nest Hauses inbegriffen und bildet die Grundlage für den gesamten Prozess. \n\n Wenn sich deine Ansprüche im Laufe der Planung verändern, kannst du deine Auswahl jederzeit anpassen. Die zusätzlichen Pakete Plus und Pro bieten dir noch mehr Unterstützung auf dem Weg zu deinem neuen Zuhause.",
    },
    {
      title: "Termin vereinbaren",
      subtitle: "Persönlich oder telefonisch – wie es dir am besten passt.",
      description:
        "Wähle Datum und Uhrzeit und entscheide, ob du ein persönliches Gespräch oder einen Telefontermin möchtest. Wir besprechen die Ergebnisse des Grundstückschecks, deine Auswahl und die nächsten Schritte. Der Termin ist kostenlos und unverbindlich.",
    },
    {
      title: "Zusammenfassung & Anfrage",
      subtitle: "Prüfe deine Angaben und sende deine Anfrage.",
      description:
        "Hier siehst du alle Details deiner Auswahl samt Preisen. Nach dem Absenden bestätigen wir alles schriftlich und klären offene Fragen. Bis zur finalen Freigabe entstehen dir keine Bauverpflichtungen und keine Kosten über unseren Service hinaus.",
    },
  ];

  // Helper: parse euro-formatted strings like "€10.900" into integer euros (10900)
  const parseEuro = (s: string): number => {
    const digitsOnly = s.replace(/[^\d]/g, "");
    return digitsOnly ? parseInt(digitsOnly, 10) : 0;
  };

  // Basis price from displayed pricing cards to compute deltas consistently
  const basisDisplayPrice = useMemo(() => {
    const basisCard = (planungspaketeCardData as PlanungspaketeCardData[]).find(
      (c) => c.title.toLowerCase().includes("basis")
    );
    return parseEuro(basisCard?.price || "€0");
  }, []);

  const renderIntro = () => {
    const c = copyByStep[stepIndex];
    const total = getCartTotal();
    const grundstueckscheckDone = Boolean(configItem?.grundstueckscheck);
    const dueNow = GRUNDSTUECKSCHECK_PRICE; // Grundstückscheck is always due today as part of the process
    const _planungspaketDone = Boolean(configItem?.planungspaket?.value);
    const _terminDone = false; // Integrate with AppointmentBooking state if available

    // Use local selection if available so summary reflects user choice immediately
    const selectedPlanValue =
      localSelectedPlan ?? configItem?.planungspaket?.value ?? null;
    const selectedPlanPackage = selectedPlanValue
      ? PLANNING_PACKAGES.find((p) => p.value === selectedPlanValue)
      : null;
    const selectedPlanName =
      selectedPlanPackage?.name || selectedPlanValue || "—";
    const selectedPlanPrice =
      selectedPlanPackage?.price || configItem?.planungspaket?.price || 0;
    const isPlanSelected = Boolean(selectedPlanValue);

    const rowWrapperClass =
      "flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7";
    const rowTextClass = (_rowStep: number) => "text-gray-900"; // Always show main content in black, only subtexts should be grey
    const getRowSubtitle = (rowStep: number): string => {
      switch (rowStep) {
        case 0:
          return "Preis deiner Auswahl";
        case 1:
          return "Prüfung deines Grundstücks";
        case 2:
          return "Gewähltes Planungsniveau";
        case 3:
          return "Terminplanung";
        default:
          return "6 Monate nach Terminvereinbarung";
      }
    };
    return (
      <div className="flex flex-col gap-6">
        <div className="w-full">
          {stepIndex === 4 ? (
            <div className="pt-4 md:pt-6 pb-2 md:pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="text-left">
                  <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                    {getAppointmentSummary()
                      ? "Garantierter Liefertermin"
                      : "Liefertermin"}
                  </div>
                </div>
                <div className="text-right">
                  {getAppointmentSummary() ? (
                    <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                      {deliveryDateString}
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="text-lg md:text-xl lg:text-2xl text-red-600 font-medium">
                        Zum Fortfahren bitte einen{" "}
                        <button
                          onClick={() => onStepChange?.(3)}
                          className="underline hover:text-red-700 transition-colors"
                        >
                          Termin vereinbaren
                        </button>
                        !
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 md:mb-3 text-gray-900 whitespace-pre-line">
                {stepIndex === 0 ? "Bereit einzuziehen?" : c.title}
              </h1>
              <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-center whitespace-pre-line">
                {stepIndex === 0 ? "Liefergarantie von 6 Monaten" : c.subtitle}
              </h3>
            </div>
          )}
          <div className="w-full"></div>
        </div>
        {/* Timeline directly after title/subtitle */}
        {!hideProgress && <div className="mb-6">{renderProgress()}</div>}
        <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-12 md:gap-6">
          <div className="w-full md:w-1/2 text-left px-12 md:px-16 lg:px-24 order-2 md:order-1">
            {stepIndex === 0 ? (
              <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-500 leading-relaxed text-center md:text-left">
                <p>
                  Du hast dich für {""}
                  <span className="text-black">dein Nest-Haus</span> {""}
                  entschieden. In den nächsten Schritten klären wir gemeinsam,
                  was wir von dir benötigen und was wir für dich übernehmen,
                  damit {""}
                  <span className="text-black">dein Zuhause genau so</span> {""}
                  wird, wie du es dir wünschst.
                </p>
                <p className="mt-6">
                  <span className="text-black">Wir kümmern uns</span> um die
                  Rahmenbedingungen und rechtlichen Schritte. Bis dahin zahlst
                  du nur für unseren Service – {""}
                  <span className="text-black">keine Verpflichtung</span>, falls
                  etwas nicht passt.
                </p>
              </div>
            ) : (
              <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-500 leading-relaxed whitespace-pre-line text-center md:text-left">
                {c.description.split("\n").map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-6" : ""}>
                    {paragraph
                      .split(/(\*\*[^*]+\*\*)/)
                      .map((part, partIndex) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return (
                            <span key={partIndex} className="text-black">
                              {part.slice(2, -2)}
                            </span>
                          );
                        }
                        return part;
                      })}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="w-full max-w-[520px] ml-auto mt-1 md:mt-2">
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500 mb-3">
                <span className="text-black">Dein Preis</span>
                <span className="text-gray-300"> Überblick</span>
              </h2>
              <div className="border border-gray-300 rounded-2xl md:min-w-[260px] w-full overflow-hidden">
                <div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                          0
                        )}`}
                      >
                        Dein Nest Haus
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                        {getRowSubtitle(0)}
                      </div>
                    </div>
                    <div
                      className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                        0
                      )}`}
                    >
                      {PriceUtils.formatPrice(total)}
                    </div>
                  </div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                          1
                        )}`}
                      >
                        Grundstückscheck
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                        {getRowSubtitle(1)}
                      </div>
                    </div>
                    <div
                      className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                        1
                      )}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {PriceUtils.formatPrice(GRUNDSTUECKSCHECK_PRICE)}
                        {grundstueckscheckDone && (
                          <span aria-hidden className="text-blue-500">
                            ✓
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                          2
                        )}`}
                      >
                        Planungspaket
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                        {getRowSubtitle(2)}
                      </div>
                    </div>
                    <div
                      className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                        2
                      )}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {selectedPlanName}
                        {isPlanSelected && (
                          <>
                            <span className="text-gray-600">
                              (
                              {selectedPlanPrice === 0
                                ? "inkludiert"
                                : PriceUtils.formatPrice(selectedPlanPrice)}
                              )
                            </span>
                            <span aria-hidden className="text-blue-500">
                              ✓
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(3)}`}
                      >
                        Termin mit dem Nest Team
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                        {getRowSubtitle(3)}
                      </div>
                    </div>
                    <div
                      className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(3)}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {getAppointmentSummaryShort() ? (
                          <>
                            <span className="text-xs md:text-sm text-gray-600 whitespace-pre-line">
                              {getAppointmentSummaryShort()}
                            </span>
                            <span aria-hidden className="text-blue-500">
                              ✓
                            </span>
                          </>
                        ) : (
                          "—"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(4)}`}
                      >
                        Garantierter Liefertermin
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                        {getRowSubtitle(4)}
                      </div>
                    </div>
                    <div
                      className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(4)}`}
                    >
                      {getAppointmentSummary() ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="text-xs md:text-sm text-gray-600">
                            {deliveryDateString}
                          </span>
                          <span aria-hidden className="text-blue-500">
                            ✓
                          </span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded-2xl w-full overflow-hidden mt-3 md:mt-4">
                <div className={rowWrapperClass}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-900 leading-relaxed">
                      Heute zu bezahlen
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                      Grundstückscheck
                    </div>
                  </div>
                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-900 leading-relaxed">
                    {PriceUtils.formatPrice(dueNow)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const _renderOverviewPrice = () => (
    <div className="border border-gray-300 rounded-[19px] px-6 py-4">
      <div className="flex justify-between items-center gap-4">
        <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black">
          Gesamt:
        </div>
        <div className="text-black text-[clamp(16px,3vw,18px)] font-medium tracking-[-0.015em] leading-[1.2]">
          {PriceUtils.formatPrice(getCartTotal())}
        </div>
      </div>
    </div>
  );

  // Compute guaranteed delivery date (6 months from appointment date)
  const deliveryDateString = useMemo(() => {
    const deliveryDate = getDeliveryDate();
    if (!deliveryDate) return "";

    return deliveryDate.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [getDeliveryDate]);

  // Decide which configuration to use for images: prioritize cart item for consistent display
  const sourceConfig = useMemo(() => {
    // For warenkorb, prioritize cart item configuration to ensure consistency
    // between displayed configuration details and overlays
    return (
      (configItem as ConfigurationCartItem | undefined) ||
      configuration ||
      undefined
    );
  }, [configItem, configuration]);

  // Determine interior availability based on actual selections in the source config
  const interiorActive = useMemo(() => {
    return Boolean(
      sourceConfig?.innenverkleidung ||
        sourceConfig?.fussboden ||
        _hasPart2BeenActive
    );
  }, [
    sourceConfig?.innenverkleidung,
    sourceConfig?.fussboden,
    _hasPart2BeenActive,
  ]);

  // Gallery state for overview step (uses the cart configuration images)
  const availableViews: ViewType[] = useMemo(() => {
    return ImageManager.getAvailableViews(sourceConfig || null, interiorActive);
  }, [sourceConfig, interiorActive]);

  const galleryViews: ViewType[] = useMemo(() => {
    return availableViews && availableViews.length > 0
      ? availableViews
      : (["exterior"] as ViewType[]);
  }, [availableViews]);

  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  useEffect(() => {
    setGalleryIndex(0);
  }, [galleryViews.length]);

  const currentView: ViewType =
    galleryViews[Math.min(galleryIndex, galleryViews.length - 1)] || "exterior";
  const currentImagePath = ImageManager.getPreviewImage(
    sourceConfig || null,
    currentView
  );

  const goPrevImage = () =>
    setGalleryIndex((i) => (i - 1 + galleryViews.length) % galleryViews.length);
  const goNextImage = () =>
    setGalleryIndex((i) => (i + 1) % galleryViews.length);

  useEffect(() => {
    ImageManager.preloadImages(sourceConfig || null);
  }, [sourceConfig]);

  // No extra memoization for summary; rely on lightweight renderer

  return (
    <section className="w-full py-16">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {renderIntro()}
        <div className="mt-6 pt-6">
          {stepIndex === 0 && (
            <div className="space-y-6 pt-8">
              {/* Overview grid: cart on left, summary/upgrade on right */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="space-y-6 w-full max-w-[520px] lg:flex-none">
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500">
                    <span className="text-black">Dein Nest</span>
                    <span className="text-gray-300"> Deine Konfiguration</span>
                  </h2>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-300 rounded-[19px] px-6 py-4"
                    >
                      <div className="flex items-center justify-between gap-4 py-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900 break-words">
                            {getConfigurationTitle(item)}
                          </div>
                          <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                            {(() => {
                              const priceValue =
                                "totalPrice" in item &&
                                (item as ConfigurationCartItem).nest
                                  ? (item as ConfigurationCartItem).nest
                                      ?.price || 0
                                  : "totalPrice" in item
                                    ? (item as ConfigurationCartItem).totalPrice
                                    : (item as CartItem).price;
                              return `oder ${calculateMonthlyPayment(
                                priceValue
                              )} für 240 Monate`;
                            })()}
                          </div>
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-900 leading-relaxed min-w-0">
                          {PriceUtils.formatPrice(
                            "totalPrice" in item &&
                              (item as ConfigurationCartItem).nest
                              ? (item as ConfigurationCartItem).nest?.price || 0
                              : "totalPrice" in item
                                ? (item as ConfigurationCartItem).totalPrice
                                : (item as CartItem).price
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(() => {
                          const details = renderConfigurationDetails(item);
                          const topAndMiddleItems = details.filter(
                            (d) => !d.isBottomItem
                          );
                          const bottomItems = details.filter(
                            (d) => d.isBottomItem
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
                                className="flex items-center justify-between gap-4 py-3"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900 break-words">
                                    {detail.value}
                                  </div>
                                  <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1 break-words">
                                    {detail.label}
                                  </div>
                                </div>
                                <div className="text-right min-w-0">
                                  {detail.isIncluded ||
                                  (detail.price && detail.price === 0) ? (
                                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-500 leading-relaxed">
                                      inkludiert
                                    </div>
                                  ) : (
                                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-900 leading-relaxed">
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
                                <div>
                                  {bottomItems.map((detail, idx) => (
                                    <div key={detail.category + "-" + idx}>
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
                </div>

                <div className="space-y-6 w-full lg:flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500">
                    <span className="text-black">Dein Nest</span>
                    <span className="text-gray-300">
                      {" "}
                      Ein Einblick in die Zukunft
                    </span>
                  </h2>
                  {/* Configuration Image Gallery */}
                  <div className="border border-gray-300 rounded-[19px] overflow-hidden bg-transparent">
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: "16/10" }}
                    >
                      <HybridBlobImage
                        key={`${currentView}:${currentImagePath}`}
                        path={currentImagePath}
                        alt={`Konfiguration Vorschau – ${currentView}`}
                        fill
                        className="object-contain"
                        strategy="client"
                        isInteractive={true}
                        sizes="(max-width: 1023px) 100vw, 70vw"
                        quality={85}
                        priority={true}
                      />

                      {/* PV Module Overlay - only show on exterior view when PV is selected */}
                      {currentView === "exterior" &&
                        sourceConfig?.pvanlage &&
                        sourceConfig?.pvanlage?.quantity &&
                        sourceConfig?.pvanlage?.quantity > 0 &&
                        sourceConfig?.nest && (
                          <PvModuleOverlay
                            nestSize={
                              sourceConfig.nest.value as
                                | "nest80"
                                | "nest100"
                                | "nest120"
                                | "nest140"
                                | "nest160"
                            }
                            moduleCount={sourceConfig.pvanlage.quantity}
                            isVisible={true}
                            className=""
                          />
                        )}

                      {/* Belichtungspaket Overlay - only show on exterior view when belichtungspaket is selected */}
                      {currentView === "exterior" &&
                        sourceConfig?.belichtungspaket &&
                        sourceConfig?.nest && (
                          <BelichtungsPaketOverlay
                            nestSize={
                              sourceConfig.nest.value as
                                | "nest80"
                                | "nest100"
                                | "nest120"
                                | "nest140"
                                | "nest160"
                            }
                            brightnessLevel={
                              sourceConfig.belichtungspaket.value as
                                | "light"
                                | "medium"
                                | "bright"
                            }
                            fensterMaterial={
                              sourceConfig.fenster?.value === "pvc_fenster"
                                ? "pvc"
                                : sourceConfig.fenster?.value ===
                                    "aluminium_weiss"
                                  ? "aluminium_hell"
                                  : sourceConfig.fenster?.value ===
                                      "aluminium_schwarz"
                                    ? "aluminium_dunkel"
                                    : "holz" // Default to holz (preselected)
                            }
                            isVisible={true}
                            className=""
                          />
                        )}

                      {/* Fenster Overlay - only show on interior view when fenster is selected */}
                      {currentView === "interior" && sourceConfig?.fenster && (
                        <FensterOverlay
                          fensterType={
                            sourceConfig.fenster.value as
                              | "pvc_fenster"
                              | "holz"
                              | "aluminium_schwarz"
                              | "aluminium_weiss"
                          }
                          isVisible={true}
                          className=""
                        />
                      )}

                      {galleryViews.length > 1 && (
                        <>
                          <button
                            type="button"
                            aria-label="Vorheriges Bild"
                            onClick={goPrevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center border border-gray-300 shadow"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            aria-label="Nächstes Bild"
                            onClick={goNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center border border-gray-300 shadow"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>
                    {galleryViews.length > 1 && (
                      <div className="flex items-center justify-center gap-2 py-2">
                        {galleryViews.map((v, i) => (
                          <button
                            key={v + i}
                            type="button"
                            aria-label={`Wechsel zu Ansicht ${v}`}
                            onClick={() => setGalleryIndex(i)}
                            className={
                              "w-2.5 h-2.5 rounded-full " +
                              (i === galleryIndex
                                ? "bg-blue-500"
                                : "bg-gray-300")
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-16 md:mt-20">
                <Button
                  variant="landing-secondary-blue"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={() => {
                    // Clear cart and reset configurator completely for fresh start
                    items.forEach((item) => {
                      removeFromCart(item.id);
                    });

                    const { resetConfiguration } =
                      useConfiguratorStore.getState();
                    resetConfiguration();

                    window.location.href = "/konfigurator";
                  }}
                >
                  Neu konfigurieren
                </Button>
                <span className="inline-block w-3" />
                <Button
                  variant="primary"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goNext}
                >
                  Nächster Schritt
                </Button>
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-4 pt-8">
              {/* Process Steps Title Section */}
              <div className="text-center mb-16">
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
                  Step by Step nach Hause
                </h1>
                <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8">
                  Deine Vorstellungen formen jeden Schritt am Weg zum neuen
                  Zuhause
                </h3>
              </div>

              <CheckoutStepCard
                cards={defaultSquareTextCardData}
                maxWidth={true}
              />

              <div className="flex justify-center mt-16 md:mt-20">
                <Button
                  variant="landing-secondary-blue"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goPrev}
                  disabled={stepIndex <= 0}
                >
                  Zurück
                </Button>
                <span className="inline-block w-3" />
                <Button
                  variant="primary"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={() => {
                    ensureGrundstueckscheckIncluded();
                    goNext();
                    // Ensure scroll happens on mobile with a small delay
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Nächster Schritt
                </Button>
              </div>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-4 pt-8">
              {(() => {
                console.log(
                  "📋 CheckoutStepper: Rendering CheckoutPlanungspaketeCards with:",
                  {
                    selectedPlan: localSelectedPlan,
                    stepIndex,
                    configuratorPlan: configuration?.planungspaket?.value,
                    cartPlan: configItem?.planungspaket?.value,
                  }
                );
                return null;
              })()}
              <CheckoutPlanungspaketeCards
                selectedPlan={localSelectedPlan}
                onPlanSelect={(selectedValue) => {
                  console.log(
                    "📦 CheckoutStepper: User selected planungspaket:",
                    selectedValue
                  );
                  setLocalSelectedPlan(selectedValue);
                  // Immediately update the configuration when user selects
                  setPlanningPackage(selectedValue);
                }}
                basisDisplayPrice={basisDisplayPrice}
              />

              <div className="flex justify-center mt-16 md:mt-20">
                <Button
                  variant="landing-secondary-blue"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goPrev}
                  disabled={stepIndex <= 0}
                >
                  Zurück
                </Button>
                <span className="inline-block w-3" />
                <Button
                  variant="primary"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goNext}
                >
                  Nächster Schritt
                </Button>
              </div>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-4 pt-8">
              <AppointmentBooking showLeftSide={false} />

              {/* Grundstückscheck Form Section */}
              <div className="mt-16">
                <div className="text-center mb-8 pt-8">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
                    Dein Grundstück - Unser Check
                  </h2>
                  <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8 pb-4 max-w-3xl mx-auto">
                    Wir Prüfen deinen Baugrund
                  </h3>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-6">
                  <div className="w-full md:w-1/2 text-left px-12 md:px-16 lg:px-24">
                    <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-500 leading-relaxed mb-4 mt-12">
                      Wir prüfen, ob{" "}
                      <span className="text-black">dein Grundstück</span> die
                      gesetzlichen{" "}
                      <span className="text-black">Anforderungen erfüllt</span>.
                      Dazu gehören das jeweilige{" "}
                      <span className="text-black">Landesbaugesetz</span>, das{" "}
                      <span className="text-black">Raumordnungsgesetz</span> und
                      die{" "}
                      <span className="text-black">örtlichen Vorschriften</span>
                      , damit dein Bauvorhaben von Beginn an auf{" "}
                      <span className="text-black">sicheren Grundlagen</span>{" "}
                      steht.
                    </p>
                    <div className="h-3"></div>
                    <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-500 leading-relaxed mb-6">
                      Außerdem analysieren wir die{" "}
                      <span className="text-black">
                        Eignung des Grundstücks
                      </span>{" "}
                      für dein Nest Haus. Dabei geht es um alle notwendigen
                      Voraussetzungen, die für Planung und Aufbau entscheidend
                      sind, sodass{" "}
                      <span className="text-black">
                        dein Zuhause zuverlässig und ohne Hindernisse
                      </span>{" "}
                      entstehen kann.
                    </p>

                    <div className="mt-2 space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base"></h4>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <div className="w-full max-w-[520px] ml-auto mt-1 md:mt-2">
                      <GrundstueckCheckForm
                        backgroundColor="white"
                        maxWidth={false}
                        padding="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Move the buttons here, directly below the Grundstückscheck section */}
              <div className="flex justify-center mt-16 md:mt-20">
                <Button
                  variant="landing-secondary-blue"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goPrev}
                  disabled={stepIndex <= 0}
                >
                  Zurück
                </Button>
                <span className="inline-block w-3" />
                <Button
                  variant="primary"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={() => {
                    goNext();
                    // Ensure scroll happens on mobile with a small delay
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Nächster Schritt
                </Button>
              </div>
            </div>
          )}

          {stepIndex === 4 && (
            <div className="space-y-4 pt-8">
              <div className="pt-2"></div>
              {/* Title row replaced above - keep spacing consistent */}
              {/* Deine Auswahl Title */}
              <div className="pt-2"></div>
              <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                Deine Auswahl:
              </div>
              <div className="pb-2"></div>

              <div className="space-y-4">
                {configItem ? (
                  <>
                    {(() => {
                      const details = renderConfigurationDetails(configItem);
                      const topAndMiddleItems = details.filter(
                        (d) => !d.isBottomItem
                      );
                      const _bottomItems = details.filter(
                        (d) => d.isBottomItem
                      );

                      const renderDetailItem = (
                        detail: {
                          label: string;
                          value: string;
                          price: number;
                          isIncluded: boolean;
                          category: string;
                          isBottomItem?: boolean;
                          selectionValue?: string;
                        },
                        idx: number
                      ) => {
                        if (!detail.value || detail.value === "—") return null;
                        return (
                          <div
                            key={detail.category + "-" + idx}
                            className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4"
                          >
                            <div className="flex-1 min-w-0 max-w-[50%]">
                              <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                                {detail.value}
                              </div>
                              <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                                {detail.label}
                              </div>
                            </div>
                            <div className="flex-1 text-right max-w-[50%] min-w-0">
                              {detail.isIncluded ||
                              (detail.price && detail.price === 0) ? (
                                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-600">
                                  inkludiert
                                </div>
                              ) : (
                                <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                                  {PriceUtils.formatPrice(detail.price || 0)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      };

                      return (
                        <>
                          {topAndMiddleItems.length > 0 && (
                            <div className="border border-gray-300 rounded-[19px] px-6 py-4 bg-white">
                              {topAndMiddleItems.map(renderDetailItem)}
                            </div>
                          )}
                          <div className="border border-gray-300 rounded-[19px] px-6 py-4 bg-white">
                            {/* Grundstückscheck row */}
                            {configItem?.grundstueckscheck && (
                              <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                                <div className="flex-1 min-w-0 max-w-[50%]">
                                  <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                                    {configItem.grundstueckscheck.name}
                                  </div>
                                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                                    Grundstückscheck
                                  </div>
                                </div>
                                <div className="flex-1 text-right max-w-[50%] min-w-0">
                                  <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                                    {PriceUtils.formatPrice(
                                      GRUNDSTUECKSCHECK_PRICE
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* Planungspaket row - show if exists in cart OR if locally selected */}
                            {(configItem?.planungspaket ||
                              localSelectedPlan) && (
                              <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                                <div className="flex-1 min-w-0 max-w-[50%]">
                                  <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                                    {(() => {
                                      // Get name from cart item first, but use new naming
                                      if (configItem?.planungspaket?.name) {
                                        const name =
                                          configItem.planungspaket.name.toLowerCase();
                                        if (name.includes("basis"))
                                          return "Planungspaket 01 Basis";
                                        if (name.includes("plus"))
                                          return "Planungspaket 02 Plus";
                                        if (name.includes("pro"))
                                          return "Planungspaket 03 Pro";
                                        return configItem.planungspaket.name;
                                      }
                                      // Otherwise get from localSelectedPlan
                                      if (localSelectedPlan) {
                                        if (localSelectedPlan === "basis")
                                          return "Planungspaket 01 Basis";
                                        if (localSelectedPlan === "plus")
                                          return "Planungspaket 02 Plus";
                                        if (localSelectedPlan === "pro")
                                          return "Planungspaket 03 Pro";
                                        return localSelectedPlan;
                                      }
                                      return "—";
                                    })()}
                                  </div>
                                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                                    Planungspaket
                                  </div>
                                </div>
                                <div className="flex-1 text-right max-w-[50%] min-w-0">
                                  {(() => {
                                    // Determine which package we're dealing with
                                    let packageType = "basis";

                                    if (configItem?.planungspaket?.name) {
                                      const name =
                                        configItem.planungspaket.name.toLowerCase();
                                      if (name.includes("plus"))
                                        packageType = "plus";
                                      else if (name.includes("pro"))
                                        packageType = "pro";
                                    } else if (localSelectedPlan) {
                                      packageType = localSelectedPlan;
                                    }

                                    // Return simple price display
                                    return (
                                      <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                                        {packageType === "basis"
                                          ? "0,00€"
                                          : packageType === "plus"
                                            ? "13.900,00€"
                                            : "18.900,00€"}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}
                            {/* Termin mit dem Nest Team row */}
                            <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                              <div className="flex-1 min-w-0 max-w-[50%]">
                                <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                                  <span
                                    className={
                                      getAppointmentSummary()
                                        ? "text-blue-500"
                                        : ""
                                    }
                                  >
                                    {getAppointmentSummary() ? "✓" : "—"}
                                  </span>
                                </div>
                                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                                  Termin mit dem Nest Team
                                </div>
                              </div>
                              <div className="flex-1 text-right max-w-[50%] min-w-0">
                                <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                                  {getAppointmentSummary() || "—"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div className="text-sm text-gray-600">
                    Keine Konfiguration im Warenkorb.
                  </div>
                )}
              </div>

              {/* Teilzahlungen Title */}
              <div className="border-t border-gray-200 pt-2"></div>
              <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                Teilzahlungen:
              </div>
              <div className="border-b border-gray-200 pb-2"></div>

              {/* Instalment Breakdown */}
              {(() => {
                const totalPrice = Math.max(0, getCartTotal());
                const firstPayment = GRUNDSTUECKSCHECK_PRICE;
                const grundstueckscheckCredit = GRUNDSTUECKSCHECK_PRICE;
                const secondPaymentOriginal = Math.max(0, totalPrice * 0.3);
                const secondPayment = Math.max(
                  0,
                  secondPaymentOriginal - grundstueckscheckCredit
                );
                const thirdPayment = Math.max(0, totalPrice * 0.5);
                const fourthPayment = Math.max(
                  0,
                  totalPrice -
                    firstPayment -
                    secondPaymentOriginal -
                    thirdPayment
                );
                return (
                  <div className="border border-gray-300 rounded-[19px] px-6 py-4 bg-white">
                    <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                      <div className="flex-1 min-w-0 max-w-[50%]">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                          1. Teilzahlung
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                          Grundstückscheck <br /> Kosten werden bei negativem
                          Erstgespräch rückerstattet
                        </div>
                      </div>
                      <div className="flex-1 text-right max-w-[50%] min-w-0">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                          {PriceUtils.formatPrice(firstPayment)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                      <div className="flex-1 min-w-0 max-w-[50%]">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                          2. Teilzahlung
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                          30% vom Gesamtpreis <br /> abzüglich Grundstückscheck:{" "}
                          {PriceUtils.formatPrice(grundstueckscheckCredit)}{" "}
                          <br />
                          Planungspaket:
                          <ul className="list-disc list-inside mt-2 text-sm md:text-base lg:text-lg 2xl:text-xl">
                            <li>Einreichplanung des Gesamtprojekts</li>
                            <li>Fachberatung und Baubegleitung</li>
                            <li>Bürokratische Unterstützung</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex-1 text-right max-w-[50%] min-w-0">
                        <div className="flex flex-col items-end">
                          <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 mb-1">
                            {PriceUtils.formatPrice(secondPayment)}
                          </div>
                          <div className="text-xs md:text-sm font-medium text-gray-600 line-through opacity-60">
                            {PriceUtils.formatPrice(secondPaymentOriginal)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                      <div className="flex-1 min-w-0 max-w-[50%]">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                          3. Teilzahlung
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                          50% vom Gesamtpreis <br /> Fällig nach fertigstellung
                          in der Produktion
                        </div>
                      </div>
                      <div className="flex-1 text-right max-w-[50%] min-w-0">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                          {PriceUtils.formatPrice(thirdPayment)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                      <div className="flex-1 min-w-0 max-w-[50%]">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                          4. Teilzahlung
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                          Restbetrag <br /> Fällig nach Errichtung am Grundstück
                        </div>
                      </div>
                      <div className="flex-1 text-right max-w-[50%] min-w-0">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                          {PriceUtils.formatPrice(fourthPayment)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="border border-gray-300 rounded-[19px] px-6 py-4 bg-blue-50 mt-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0 max-w-[50%]">
                    <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                      Gesamtpreis
                    </div>
                  </div>
                  <div className="flex-1 text-right max-w-[50%] min-w-0">
                    <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 underline">
                      {PriceUtils.formatPrice(getCartTotal())}
                    </div>
                  </div>
                </div>
              </div>

              {/* Moved: Heute zu bezahlen section at the end */}
              <div className="border-t border-gray-200 pt-2"></div>
              <div className="flex items-start justify-between gap-4 py-3">
                <div className="text-left">
                  <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                    Heute zu bezahlen
                  </div>
                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 leading-snug"></div>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                    {PriceUtils.formatPrice(GRUNDSTUECKSCHECK_PRICE)}
                  </div>
                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 leading-snug"></div>
                </div>
              </div>
              <div className="border-b border-gray-200 pb-2"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                <button
                  type="button"
                  onClick={() => {
                    // Trigger alpha test Step 3 (feedback phase)
                    const isAlphaTest =
                      new URLSearchParams(window.location.search).get(
                        "alpha-test"
                      ) === "true" ||
                      localStorage.getItem("nest-haus-test-session-id");
                    if (isAlphaTest) {
                      localStorage.setItem(
                        "nest-haus-test-purchase-completed",
                        "true"
                      );
                      window.dispatchEvent(
                        new CustomEvent("alpha-test-purchase-completed")
                      );
                    }
                    // TODO: Add actual Apple Pay integration here
                  }}
                  className="bg-black text-white py-4 px-12 rounded-full text-[clamp(16px,4vw,20px)] font-medium hover:bg-gray-800 transition-colors"
                >
                  Mit Apple Pay bezahlen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Trigger alpha test Step 3 (feedback phase)
                    const isAlphaTest =
                      new URLSearchParams(window.location.search).get(
                        "alpha-test"
                      ) === "true" ||
                      localStorage.getItem("nest-haus-test-session-id");
                    if (isAlphaTest) {
                      localStorage.setItem(
                        "nest-haus-test-purchase-completed",
                        "true"
                      );
                      window.dispatchEvent(
                        new CustomEvent("alpha-test-purchase-completed")
                      );
                    }
                    // Call the original scroll to contact function
                    if (onScrollToContact) {
                      onScrollToContact();
                    }
                  }}
                  className="bg-blue-500 text-white py-4 px-12 rounded-full text-[clamp(16px,4vw,20px)] font-medium hover:bg-blue-700 transition-colors"
                >
                  Zur Kassa
                </button>
              </div>

              <div className="border border-gray-300 rounded-[19px] px-6 py-4 bg-white mt-6">
                <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 mb-2">
                  Doch anders entschieden?
                </div>
                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 leading-relaxed">
                  Im Hauspreis enthalten. Bei erfolgreichem ersten Termin und
                  Start des Vorentwurfsplans wird dieser Betrag vollständig vom
                  Gesamtpreis abgezogen. Sollte der Vorentwurfsplan ergeben,
                  dass das Projekt nicht möglich oder unzumutbar ist, erstatten
                  wir den Betrag vollständig.
                </div>
              </div>

              {/* Back Button */}
              <div className="flex justify-center mt-16 md:mt-20">
                <Button
                  variant="landing-secondary-blue"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goPrev}
                  disabled={stepIndex <= 0}
                >
                  Zurück
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
