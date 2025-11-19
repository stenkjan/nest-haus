"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PriceUtils } from "@/app/konfigurator/core/PriceUtils";
import { PriceCalculator } from "@/app/konfigurator/core/PriceCalculator";
import type { CartItem, ConfigurationCartItem } from "@/store/cartStore";
import type { ConfigurationItem } from "@/store/configuratorStore";
import { useConfiguratorStore } from "@/store/configuratorStore";
import {
  PLANNING_PACKAGES,
  GRUNDSTUECKSCHECK_PRICE,
  calculateSizeDependentPrice,
} from "@/constants/configurator";
import { GrundstueckCheckForm, SectionHeader } from "@/components/sections";
import { AppointmentBooking } from "@/components/sections";
import {
  planungspaketeCardData,
  type PlanungspaketeCardData,
} from "@/components/cards/PlanungspaketeCards";
import PlanungspaketeCards from "@/components/cards/PlanungspaketeCards";
import {
  UnifiedContentCard,
  CheckoutPlanungspaketeCards,
} from "@/components/cards";
import { Dialog } from "@/components/ui/Dialog";
import { ImageManager } from "@/app/konfigurator/core/ImageManager";
import { HybridBlobImage } from "@/components/images";
import { useCartStore } from "@/store/cartStore";
import type { ViewType } from "@/app/konfigurator/types/configurator.types";
import { CHECKOUT_STEPS } from "@/app/warenkorb/steps";
import { Button } from "@/components/ui";
// Overlay components for warenkorb preview
import PvModuleOverlay from "@/app/konfigurator/components/PvModuleOverlay";
// Payment components
import PaymentModal from "@/components/payments/PaymentModal";

interface CheckoutStepperProps {
  items: (CartItem | ConfigurationCartItem)[];
  getCartTotal: () => number;
  removeFromCart: (itemId: string) => void;
  addConfigurationToCart: (config: ConfigurationCartItem) => void;
  onScrollToContact?: () => void;
  stepIndex?: number;
  onStepChange?: (nextIndex: number) => void;
  hideProgress?: boolean;
  isOhneNestMode?: boolean;
  paymentRedirectStatus?: {
    show: boolean;
    success: boolean;
    paymentIntentId: string | null;
    amount: number;
    currency: string;
  } | null;
  onPaymentRedirectHandled?: () => void;
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
  isOhneNestMode = false,
  paymentRedirectStatus,
  onPaymentRedirectHandled,
}: CheckoutStepperProps) {
  const {
    getAppointmentSummary,
    getAppointmentSummaryShort,
    getDeliveryDate: _getDeliveryDate,
    isAppointmentFromCurrentSession,
    appointmentDetails,
  } = useCartStore();
  const {
    currentPrice: _currentPrice,
    configuration: _currentConfiguration,
    sessionId,
  } = useConfiguratorStore();
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
    const found = items.find((it) => "nest" in it && it.nest) as
      | ConfigurationCartItem
      | undefined;

    console.log("🛒 ConfigItem found:", !!found, found?.nest?.value);
    return found;
  }, [items]);

  // Debug logging after configItem is defined
  console.log("🔍 CheckoutStepper render:", {
    isOhneNestMode,
    itemsCount: items.length,
    hasConfigItem: !!configItem,
  });

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

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [_paymentError, setPaymentError] = useState<string | null>(null);
  const [contactWarning, setContactWarning] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState<string | undefined>(undefined);

  // Payment completion state
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [successfulPaymentIntentId, setSuccessfulPaymentIntentId] = useState<
    string | null
  >(null);
  const [paymentCompletedDate, setPaymentCompletedDate] = useState<Date | null>(
    null
  );
  const [showPlanungspaketeDetails, setShowPlanungspaketeDetails] =
    useState(false);

  // Load pricing data on mount to ensure fresh prices from Google Sheets
  useEffect(() => {
    PriceCalculator.initializePricingData()
      .then(() => {
        console.log("✅ Warenkorb: Pricing data loaded successfully");
      })
      .catch((error) => {
        console.error("❌ Warenkorb: Failed to load pricing data:", error);
      });
  }, []);

  // Handle payment redirect returns
  useEffect(() => {
    if (paymentRedirectStatus?.show && paymentRedirectStatus?.success) {
      console.log("✅ Payment redirect success detected, showing modal");
      setIsPaymentCompleted(true);
      setIsPaymentModalOpen(true);

      // Mark as completed after showing modal
      if (onPaymentRedirectHandled) {
        // Wait a bit to let modal render
        setTimeout(() => {
          onPaymentRedirectHandled();
        }, 100);
      }
    }
  }, [paymentRedirectStatus, onPaymentRedirectHandled]);

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

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = CHECKOUT_STEPS;

  // URL hash mapping for checkout steps - wrapped in useMemo to prevent re-creation
  const stepToHash = useMemo(
    () =>
      ({
        0: "übersicht",
        1: "entwurf",
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
        entwurf: 1,
        terminvereinbarung: 2,
        planungspakete: 3,
        abschluss: 4,
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
        name: "Entwurf",
        price: GRUNDSTUECKSCHECK_PRICE,
        description: "Der erste Schritt",
      },
      totalPrice: Math.max(0, (configItem.totalPrice || 0) - previousPrice),
    };

    removeFromCart(configItem.id);
    addConfigurationToCart(updated);
  };

  const setPlanningPackage = (value: string) => {
    console.log("📦 CheckoutStepper: Setting planning package to:", value);

    const target = PLANNING_PACKAGES.find((p) => p.value === value);
    if (!target) return;

    // Handle ohne nest mode - update configurator store only
    if (isOhneNestMode || !configItem) {
      console.log(
        "🔄 CheckoutStepper: Ohne nest mode - updating configurator store only"
      );
      const { updateSelection } = useConfiguratorStore.getState();
      updateSelection({
        category: "planungspaket",
        value: target.value,
        name: target.name,
        price: target.price,
        description: target.description,
      });
      return;
    }

    // Normal mode - update both cart and configurator
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
      // Check pricing data for dash prices
      try {
        const pricingData = PriceCalculator.getPricingData();
        if (pricingData && cartItemConfig?.nest && selection.quantity) {
          const nestSize = cartItemConfig.nest.value as
            | "nest80"
            | "nest100"
            | "nest120"
            | "nest140"
            | "nest160";
          const price =
            pricingData.pvanlage.pricesByQuantity[nestSize]?.[
              selection.quantity
            ];
          if (price === -1) return -1; // Return -1 for dash prices
          if (price !== undefined) return price;
        }
      } catch (error) {
        console.error("Error getting PV price from pricing data:", error);
      }
      // Fallback to stored price
      return (selection.quantity || 1) * (selection.price || 0);
    }
    if (key === "geschossdecke") {
      // Always calculate quantity-based price for geschossdecke
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

    // For bodenaufbau and fundament, calculate dynamic price based on nest size
    if (
      (key === "bodenaufbau" || key === "fundament") &&
      cartItemConfig?.nest
    ) {
      try {
        const selectionOption = {
          category: key,
          value: selection.value,
          name: selection.name,
          price: selection.price || 0,
        };

        if (key === "bodenaufbau") {
          return PriceCalculator.calculateBodenaufbauPrice(
            selectionOption,
            cartItemConfig.nest
          );
        }

        if (key === "fundament") {
          // Use calculateSizeDependentPrice for fundament
          return calculateSizeDependentPrice(
            cartItemConfig.nest.value,
            "fundament"
          );
        }
      } catch (error) {
        console.error(`Error calculating ${key} price in summary:`, error);
        return selection.price || 0;
      }
    }

    // For nest, get RAW nest base price from pricing data
    if (key === "nest" && cartItemConfig?.nest) {
      try {
        const pricingData = PriceCalculator.getPricingData();
        if (pricingData) {
          const nestSize = cartItemConfig.nest.value as
            | "nest80"
            | "nest100"
            | "nest120"
            | "nest140"
            | "nest160";
          const nestBasePrice = pricingData.nest[nestSize]?.price || 0;
          return nestBasePrice; // Return RAW construction price only
        }
      } catch {
        // Fall back to stored price
      }
      return selection.price || 0;
    }

    // For innenverkleidung, return RELATIVE price from PriceCalculator (baseline: ohne_innenverkleidung)
    if (key === "innenverkleidung" && cartItemConfig?.nest && selection.value) {
      try {
        const pricingData = PriceCalculator.getPricingData();
        if (pricingData) {
          const nestSize = cartItemConfig.nest.value as
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

    // For gebäudehülle and fussboden, calculate based on actual user selections
    if (
      (key === "gebaeudehuelle" || key === "fussboden") &&
      cartItemConfig?.nest
    ) {
      try {
        // First check if this option has a dash price in raw pricing data
        const pricingData = PriceCalculator.getPricingData();
        if (pricingData) {
          const nestSize = cartItemConfig.nest.value as
            | "nest80"
            | "nest100"
            | "nest120"
            | "nest140"
            | "nest160";

          if (key === "gebaeudehuelle") {
            const rawPrice =
              pricingData.gebaeudehuelle[selection.value]?.[nestSize];
            if (rawPrice === -1) return -1; // Return -1 for dash prices
          }

          if (key === "fussboden") {
            const rawPrice =
              pricingData.bodenbelag[selection.value]?.[nestSize];
            if (rawPrice === -1) return -1; // Return -1 for dash prices
          }
        }

        const currentNestValue = cartItemConfig.nest.value;

        // Calculate individual item price by ONLY changing that specific item
        // Keep all other materials at baseline to isolate the price contribution
        let testGebaeudehuelle = "trapezblech"; // baseline
        const testInnenverkleidung = "ohne_innenverkleidung"; // baseline
        let testFussboden = "ohne_belag"; // baseline

        // Only change the specific material being priced
        if (key === "gebaeudehuelle") {
          testGebaeudehuelle = selection.value;
        } else if (key === "fussboden") {
          testFussboden = selection.value;
        }

        // Calculate combination price with ONLY this item changed
        const combinationPrice = PriceCalculator.calculateCombinationPrice(
          currentNestValue,
          testGebaeudehuelle,
          testInnenverkleidung,
          testFussboden
        );

        // Calculate base price (all baselines)
        const basePrice = PriceCalculator.calculateCombinationPrice(
          currentNestValue,
          "trapezblech",
          "ohne_innenverkleidung",
          "ohne_belag"
        );

        // Return the relative price (difference from base)
        const relativePrice = combinationPrice - basePrice;
        return Math.max(0, relativePrice);
      } catch (error) {
        console.error(`Error calculating ${key} price in summary:`, error);
        return selection.price || 0;
      }
    }

    // For planungspaket, calculate nest-size dependent price using new pricing system
    if (key === "planungspaket" && cartItemConfig?.nest) {
      try {
        const pricingData = PriceCalculator.getPricingData();
        if (pricingData && selection.value) {
          const nestSize = cartItemConfig.nest.value as
            | "nest80"
            | "nest100"
            | "nest120"
            | "nest140"
            | "nest160";

          // Basis is always 0 (included)
          if (selection.value === "basis") {
            return 0;
          }

          // Plus and Pro are nest-size dependent
          if (selection.value === "plus") {
            return pricingData.planungspaket.plus[nestSize] || 0;
          }

          if (selection.value === "pro") {
            return pricingData.planungspaket.pro[nestSize] || 0;
          }
        }
      } catch (error) {
        console.error("Error calculating planungspaket price:", error);
      }
      // Fallback to stored price if calculation fails
      return selection.price || 0;
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
    fenster?: ConfigurationItem | null,
    includeSquareMeters: boolean = false
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

    // Add m² information if requested and available
    const squareMetersText =
      includeSquareMeters && fenster?.squareMeters
        ? ` (${fenster.squareMeters}m²)`
        : "";

    return `Belichtungspaket ${levelName}${fensterName}${squareMetersText}`;
  };

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
      belichtungspaket: "Belichtungspaket",
      fenster: "Fenster",
      planungspaket: "Planungspaket",
      grundstueckscheck: "Grundstückscheck",
      kamindurchzug: "Durchbruch für deinen Kamin",
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

  // Helper to calculate m² price for individual items
  const calculateItemPricePerSqm = (
    itemPrice: number,
    nestModel: string,
    geschossdeckeQty: number = 0
  ): string => {
    if (itemPrice === 0) return "";
    if (PriceUtils.isPriceOnRequest(itemPrice)) return " (-)";
    const area = PriceUtils.getAdjustedNutzflaeche(nestModel, geschossdeckeQty);
    if (area === 0) return "";
    const pricePerSqm = itemPrice / area;
    return ` (${PriceUtils.formatPrice(pricePerSqm)}/m²)`;
  };

  const renderConfigurationDetails = (
    item: CartItem | ConfigurationCartItem,
    excludeGrundstueckscheck: boolean = false
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
            "bodenaufbau",
            "geschossdecke",
            "fundament",
            "kamindurchzug",
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
          let labelName = getCategoryDisplayName(key);

          // Special display name handling
          if (key === "belichtungspaket") {
            displayName = getBelichtungspaketDisplayName(
              selection,
              (item as ConfigurationCartItem).fenster ?? null,
              true // Include m² for fenster area
            );
          } else if (
            key === "pvanlage" &&
            selection.quantity &&
            selection.quantity > 1
          ) {
            displayName = `${selection.name} (${selection.quantity}x)`;
          }

          // Add m² price to LABEL (description) for applicable items
          if (
            [
              "gebaeudehuelle",
              "innenverkleidung",
              "fussboden",
              "bodenaufbau",
              "belichtungspaket",
              "fundament",
            ].includes(key) &&
            !isIncluded &&
            calculatedPrice > 0
          ) {
            const configItem = item as ConfigurationCartItem;
            const nestModel = configItem.nest?.value || "";
            const geschossdeckeQty = configItem.geschossdecke?.quantity || 0;
            labelName += calculateItemPricePerSqm(
              calculatedPrice,
              nestModel,
              geschossdeckeQty
            );
          }

          details.push({
            label: labelName,
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
        // Exclude grundstueckscheck if specified (e.g., in step 4 where it's already shown in "Dein Preis Überblick")
        if (
          key === "planungspaket" ||
          (key === "grundstueckscheck" && !excludeGrundstueckscheck)
        ) {
          const displayName = selection.name;
          // For grundstueckscheck, always show 3,000€ (full price, not discounted 1,500€)
          // For planungspaket, calculate dynamic price using new pricing system
          const displayPrice =
            key === "grundstueckscheck"
              ? 3000
              : key === "planungspaket"
                ? getItemPrice(key, selection, item as ConfigurationCartItem)
                : selection.price || 0;
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
    // Use prices from PLANNING_PACKAGES constant to ensure consistency
    const packageHierarchy = PLANNING_PACKAGES.map((pkg) => ({
      id: pkg.value,
      name: `Planung ${pkg.name}`,
      price: pkg.price,
    }));
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
              className="absolute top-3 h-0.5 bg-[#3D6CE1] transition-all duration-300"
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
                ? "bg-[#3D6CE1] border-[#3D6CE1]"
                : isCurrent
                  ? "bg-white border-[#3D6CE1]"
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
              className="absolute top-2.5 h-0.5 bg-[#3D6CE1] transition-all duration-300"
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
                  ? "bg-[#3D6CE1] border-[#3D6CE1]"
                  : isCurrent
                    ? "bg-white border-[#3D6CE1]"
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
              className="absolute top-2.5 h-0.5 bg-[#3D6CE1] transition-all duration-300"
              style={{
                left: `${100 / 2 / 2}%`,
                width:
                  Math.min(stepIndex - 3, 1) <= 0
                    ? "0%"
                    : `${(Math.min(stepIndex - 3, 1) / 1) * (100 - 100 / 2)}%`,
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              {steps.slice(3).map((label, i) => {
                const idx = i + 3;
                const isDone = idx < stepIndex;
                const isCurrent = idx === stepIndex;
                const circleClass = isDone
                  ? "bg-[#3D6CE1] border-[#3D6CE1]"
                  : isCurrent
                    ? "bg-white border-[#3D6CE1]"
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
      title: "Der Ablauf",
      subtitle: "Schritt für Schritt",
      description:
        "Damit aus deinem Entwurf **ein Zuhause wird,** begleiten wir dich durch den gesamten Bauprozess. **Schritt für Schritt** gehen wir mit dir alle Phasen durch: von der **Einreichplanung und dem Baubescheid** über die Vorbereitung deines Grundstücks und den Bau des **Fundaments** bis hin zur **Lieferung und Montage** deines Nest-Haus.\n\nNach der **Lieferung** deines Nest-Hauses kannst du die **Haustechnik** und den **Innenausbau** entweder selbst übernehmen oder auf das Know-how unserer erfahrenen **Partnerbetriebe** zurückgreifen. Dabei stehen wir dir jederzeit **beratend zur Seite,** damit dein Zuhause genau so wird, wie du es dir wünschst.",
    },
    {
      title: "Wir freuen uns auf dich",
      subtitle: "Vereinbare dein Entwurfsgespräch mit dem Nest Team",
      description:
        "Buche deinen **Termin** für ein persönliches **Startgespräch**, in dem wir deine **individuellen Wünsche** aufnehmen und die Grundlage für deinen **Entwurf** erarbeiten. \n\n  Durch die Angaben zu deinem **Grundstück** können wir uns bestmöglich vorbereiten und dir bereits **erste Ideen** und konkrete Ansätze vorstellen. So entsteht **Schritt für Schritt** ein Entwurf, der genau zu deinen Bedürfnissen passt.**",
    },
    {
      title: "Unterstützung gefällig?",
      subtitle: "Unsere Planungspakete helfen auf deinem Weg zum Haus",
      description:
        "Unsere **drei Planungspakete** geben dir Sicherheit für dein Nest-Haus. Mit dem **Basis-Paket** erhältst du eine genehmigungsfähige **Einreichplanung** und alle technischen **Grundlagen.** Das **Plus-Paket** erweitert dies um die komplette **Haustechnik- und Innenausbauplanung.**\n\nIm **Pro-Paket** entwickeln wir zusätzlich ein umfassendes **Interiorkonzept,** das Raumgefühl, Farben, Materialien und Licht vereint. Die Umsetzung kannst du **selbst übernehmen** oder mit unseren erfahrenen **Partnerfirmen realisieren.**",
    },
    {
      title: "Bereit für Vorfreude?",
      subtitle: "Dein Garantierter Liefertermin steht fest",
      description:
        "Hier findest du **alle Details deiner Auswahl** inklusive transparenter Preise. Nutze diesen Moment, um **alle Angaben** in Ruhe zu **überprüfen**. Nach dem Absenden erhältst du eine **schriftliche Bestätigung,** und wir beginnen mit der Ausarbeitung deines Entwurfowie der Überprüfung deines Grundstücks.",
    },
    {
      title: "Dein Nest Haus",
      subtitle: "Weil nur du weißt, wie du wohnen willst",
      description:
        "**Die Bestellung deines Nest-Hauses. Alles beginnt mit dem Entwurf und dem Grundstückscheck. Sobald du dein Nest-Haus bestellst und die erste Teilzahlung leistest, erhältst du von uns deinen verbindlich garantierten Liefertermin. Transparent, planbar und verlässlich.**",
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

    // Helper function: Convert ConfigurationCartItem to Selections type for PriceCalculator
    // Filters out null values to match Selections interface (undefined only)
    const convertToSelections = (item: ConfigurationCartItem) => ({
      nest: item.nest || undefined,
      gebaeudehuelle: item.gebaeudehuelle || undefined,
      innenverkleidung: item.innenverkleidung || undefined,
      fussboden: item.fussboden || undefined,
      bodenaufbau: item.bodenaufbau || undefined,
      geschossdecke: item.geschossdecke || undefined,
      belichtungspaket: item.belichtungspaket || undefined,
      pvanlage: item.pvanlage || undefined,
      fenster: item.fenster || undefined,
      stirnseite: item.stirnseite || undefined,
      planungspaket: item.planungspaket || undefined,
      fundament: item.fundament || undefined,
      kamindurchzug: item.kamindurchzug || undefined,
      // grundstueckscheck is boolean in PriceCalculator.Selections interface
      grundstueckscheck: Boolean(item.grundstueckscheck),
    });

    // Calculate dynamic total from configuration using PriceCalculator (same as konfigurator)
    // IMPORTANT: Separate "Dein Nest Haus" (physical house) from "Planungspaket" (service)
    let nestHausTotal = 0; // Physical house price (without planungspaket)

    if (configItem && configItem.nest) {
      // Use PriceCalculator.calculateTotalPrice() for consistency with konfigurator
      // This ensures exact same price calculation logic and avoids rounding differences
      nestHausTotal = PriceCalculator.calculateTotalPrice(
        convertToSelections(configItem)
      );
      // Note: Planungspaket is calculated separately and shown in "Dein Preis Überblick" box
    } else {
      // Fall back to cart total if no configuration
      nestHausTotal = getCartTotal();
    }

    const total = nestHausTotal; // "Dein Nest Haus" shows only physical house price
    const grundstueckscheckDone = Boolean(configItem?.grundstueckscheck);
    const _dueNow = GRUNDSTUECKSCHECK_PRICE; // Grundstückscheck is always due today as part of the process
    const _planungspaketDone = Boolean(configItem?.planungspaket?.value);
    const _terminDone = false; // Integrate with AppointmentBooking state if available

    // Use local selection if available so summary reflects user choice immediately
    // In ohne nest mode, default to "basis" if nothing is selected
    const selectedPlanValue =
      localSelectedPlan ??
      configItem?.planungspaket?.value ??
      (isOhneNestMode ? "basis" : null);
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
    const rowTextClass = (_rowStep: number) =>
      "p-primary text-black font-medium"; // Use p-primary for consistent typography
    const rowSubtitleClass = "p-primary-small text-nest-gray leading-snug mt-1"; // Use p-primary-small for subtitles
    const getRowSubtitle = (rowStep: number): string => {
      switch (rowStep) {
        case 0:
          return "Ein erster Einblick";
        case 1:
          return "Entwurf- und Grundstückscheck";
        case 2:
          return "Wähle aus 3 Paketen";
        case 3:
          return "Dein Termin bei Nest";
        default:
          return "max. 6 Monate";
      }
    };
    return (
      <div className="flex flex-col gap-6">
        <div className="w-full">
          <SectionHeader
            title={stepIndex === 0 ? "Bereit einzuziehen?" : c.title}
            subtitle={
              stepIndex === 0 ? "Liefergarantie von 6 Monaten" : c.subtitle
            }
            titleClassName="text-black"
            subtitleClassName="text-black"
            wrapperMargin="mb-8"
          />
          <div className="w-full"></div>
        </div>
        {/* Timeline directly after title/subtitle */}
        {!hideProgress && <div className="mb-6">{renderProgress()}</div>}
        <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-12 md:gap-6">
          <div className="w-full md:w-1/2 text-left md:px-16 lg:px-24 order-2 md:order-1 mt-5">
            {/* Delivery Date Component for Step 4 */}
            {stepIndex === 4 && (
              <div className="mb-8 text-center md:text-left">
                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-500 leading-relaxed text-center md:text-left mb-1">
                  Dein Liefertermin
                </div>
                <div className="h2-title text-black">
                  {calculateDeliveryDate}
                </div>
              </div>
            )}
            {stepIndex === 0 ? (
              <div className="p-secondary text-center md:text-left">
                <p>
                  <span className="text-nest-gray">
                    Du hast dein Nest bereits konfiguriert und hast somit den
                  </span>{" "}
                  <span className="text-black font-medium">
                    Überblick über Preis und Aussehen
                  </span>{" "}
                  <span className="text-nest-gray">
                    deines Bauvorhabens. Deine
                  </span>{" "}
                  <span className="text-black font-medium">Auswahl</span>{" "}
                  <span className="text-nest-gray">bleibt dabei stets</span>{" "}
                  <span className="text-black font-medium">flexibel</span>{" "}
                  <span className="text-nest-gray">
                    und kann jederzeit an deine Wünsche angepasst werden.
                  </span>
                </p>
                <p className="mt-6">
                  <span className="text-nest-gray">Mit dem</span>{" "}
                  <span className="text-black font-medium">heutigen Kauf</span>{" "}
                  <span className="text-nest-gray">
                    deckst du die Kosten für
                  </span>{" "}
                  <span className="text-black font-medium">
                    Grundstückscheck und Entwurf.
                  </span>{" "}
                  <span className="text-nest-gray">
                    Fahre fort und mache den ersten Schritt in Richtung
                  </span>{" "}
                  <span className="text-black font-medium">neues Zuhause.</span>
                </p>
              </div>
            ) : (
              <div className="p-secondary whitespace-pre-line text-center md:text-left">
                {c.description.split("\n").map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-6" : ""}>
                    {paragraph
                      .split(/(\*\*[^*]+\*\*)/)
                      .map((part, partIndex) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return (
                            <span
                              key={partIndex}
                              className="text-black font-medium"
                            >
                              {part.slice(2, -2)}
                            </span>
                          );
                        }
                        return (
                          <span key={partIndex} className="text-nest-gray">
                            {part}
                          </span>
                        );
                      })}
                  </p>
                ))}
              </div>
            )}

            {/* Additional p-primary-small text for step 4 */}
            {stepIndex === 4 && (
              <div className="p-primary-small text-center md:text-left mt-12">
                <p>
                  <span className="text-black font-bold">
                    *Immer flexibel bleiben
                  </span>
                </p>
                <p className="mt-2">
                  <span className="text-nest-gray">
                    Solltest du deine Meinung nach Erstellen des Erstentwurfs
                    ändern, kannst du vom Kauf, ohne weitere Teilzahlungen,
                    zurücktreten. In diesem Fall zahlst du lediglich die Kosten
                    für den Entwurf.
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="w-full max-w-[520px] ml-auto mt-1 md:mt-2">
              <h2 className="h2-title mb-3">
                <span className="text-black">Dein Preis</span>
                <span className="text-nest-gray"> Überblick</span>
              </h2>
              <div className="border border-gray-300 rounded-2xl md:min-w-[260px] w-full overflow-hidden">
                <div>
                  {/* Show house configuration only if NOT in ohne nest mode */}
                  {!isOhneNestMode && (
                    <div className={rowWrapperClass}>
                      <div className="flex-1 min-w-0">
                        <div className={`leading-relaxed ${rowTextClass(0)}`}>
                          Dein Nest Haus
                        </div>
                        <div className={rowSubtitleClass}>
                          {PriceUtils.isPriceOnRequest(total)
                            ? "Genauer Preis auf Anfrage"
                            : configItem?.nest
                              ? (() => {
                                  // Show m² price for "Dein Nest Haus" (total house price / area)
                                  const nestModel = configItem.nest.value || "";
                                  const geschossdeckeQty =
                                    configItem.geschossdecke?.quantity || 0;
                                  return `${PriceUtils.calculatePricePerSquareMeter(
                                    total,
                                    nestModel,
                                    geschossdeckeQty
                                  )} (Preise inkl. MwSt.)`;
                                })()
                              : getRowSubtitle(0)}
                        </div>
                      </div>
                      <div className={`leading-relaxed ${rowTextClass(0)}`}>
                        {PriceUtils.isPriceOnRequest(total)
                          ? "-"
                          : PriceUtils.formatPrice(total)}
                      </div>
                    </div>
                  )}

                  {/* In ohne nest mode, show modified title */}
                  {isOhneNestMode && (
                    <div className={rowWrapperClass}>
                      <div className="flex-1 min-w-0">
                        <div className={`leading-relaxed ${rowTextClass(0)}`}>
                          Dein Nest Haus
                        </div>
                        <div className={rowSubtitleClass}>
                          Konfiguriere dein Nest mit uns
                        </div>
                      </div>
                      <div className={`leading-relaxed ${rowTextClass(0)}`}>
                        -
                      </div>
                    </div>
                  )}
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div className={`leading-relaxed ${rowTextClass(1)}`}>
                        Konzeptcheck
                      </div>
                      <div className={rowSubtitleClass}>
                        {getRowSubtitle(1)}
                      </div>
                    </div>
                    <div className={`leading-relaxed ${rowTextClass(1)}`}>
                      <span className="inline-flex items-center gap-2">
                        {/* Always show 3.000€ in overview box (full price, not discounted) */}
                        {PriceUtils.formatPrice(3000)}
                        {grundstueckscheckDone && (
                          <span aria-hidden className="text-[#3D6CE1]">
                            ✓
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div className={`leading-relaxed ${rowTextClass(2)}`}>
                        Planungspaket
                      </div>
                      <div className={rowSubtitleClass}>
                        {getRowSubtitle(2)}
                      </div>
                    </div>
                    <div className={`leading-relaxed ${rowTextClass(2)}`}>
                      {/* Show plan details in both normal and ohne nest mode */}
                      <span className="inline-flex items-center gap-2">
                        {selectedPlanName}
                        {isPlanSelected && (
                          <>
                            <span className="text-gray-600">
                              (
                              {selectedPlanValue === "basis"
                                ? "inkludiert"
                                : PriceUtils.formatPrice(selectedPlanPrice)}
                              )
                            </span>
                            <span aria-hidden className="text-[#3D6CE1]">
                              ✓
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div className={`leading-relaxed ${rowTextClass(3)}`}>
                        Terminvereinbarung
                      </div>
                      <div className={rowSubtitleClass}>
                        {getRowSubtitle(3)}
                      </div>
                    </div>
                    <div className={`leading-relaxed ${rowTextClass(3)}`}>
                      {(() => {
                        const appointmentSummary =
                          getAppointmentSummaryShort(sessionId);
                        const hasAppointmentFromOtherSession =
                          appointmentDetails &&
                          !isAppointmentFromCurrentSession(sessionId);

                        // Check if appointment is in the past
                        if (appointmentSummary && isAppointmentInPast) {
                          return (
                            <button
                              onClick={() => {
                                window.location.hash = "terminvereinbarung";
                              }}
                              className="text-blue-600 text-sm hover:underline"
                            >
                              Neu vereinbaren
                            </button>
                          );
                        }

                        if (appointmentSummary) {
                          return (
                            <div className="flex items-start gap-2 justify-end">
                              <span className="p-primary text-gray-600 whitespace-pre-line text-right">
                                {appointmentSummary}
                              </span>
                              <span
                                aria-hidden
                                className="text-[#3D6CE1] flex-shrink-0"
                              >
                                ✓
                              </span>
                            </div>
                          );
                        } else if (
                          hasAppointmentFromOtherSession &&
                          isAppointmentInPast
                        ) {
                          return (
                            <button
                              onClick={() => {
                                window.location.hash = "terminvereinbarung";
                              }}
                              className="text-blue-600 p-primary hover:underline"
                            >
                              Neu vereinbaren
                            </button>
                          );
                        } else if (hasAppointmentFromOtherSession) {
                          return (
                            <div className="flex items-start gap-2 justify-end">
                              <span className="p-primary text-gray-600 text-right">
                                bereits vereinbart
                              </span>
                            </div>
                          );
                        } else {
                          return "—";
                        }
                      })()}
                    </div>
                  </div>
                  {/* Show delivery date only if NOT in ohne nest mode */}
                  {!isOhneNestMode && (
                    <div className={rowWrapperClass}>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(4)}`}
                        >
                          Liefertermin
                        </div>
                        <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                          {getRowSubtitle(4)}
                        </div>
                      </div>
                      <div
                        className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(4)}`}
                      >
                        {getAppointmentSummary(sessionId) ? (
                          <div className="flex items-start gap-2 justify-end">
                            <span className="text-xs md:text-sm text-gray-600 text-right max-w-[120px] md:max-w-none">
                              {calculateDeliveryDate}
                            </span>
                            <span
                              aria-hidden
                              className="text-[#3D6CE1] flex-shrink-0"
                            >
                              ✓
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="border border-gray-300 rounded-2xl w-full overflow-hidden mt-3 md:mt-4">
                <div className={rowWrapperClass}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-900 leading-relaxed">
                      Konzept-Check
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                      Heute zu bezahlen
                    </div>
                  </div>
                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-900 leading-relaxed">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-gray-400 line-through">3.000 €</span>
                      <span>1.500 €</span>
                    </div>
                    <div className="text-xs text-gray-500 text-right mt-1">
                      Preise inkl. MwSt.
                    </div>
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

  // Calculate delivery date: current date + 6 months (next weekday)
  const calculateDeliveryDate = useMemo(() => {
    const now = new Date();
    const sixMonthsLater = new Date(now);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    // If the date falls on a weekend, move to next Monday
    const dayOfWeek = sixMonthsLater.getDay();
    if (dayOfWeek === 0) {
      // Sunday
      sixMonthsLater.setDate(sixMonthsLater.getDate() + 1);
    } else if (dayOfWeek === 6) {
      // Saturday
      sixMonthsLater.setDate(sixMonthsLater.getDate() + 2);
    }

    return sixMonthsLater.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  // State for userData loaded from database
  const [userDataFromDb, setUserDataFromDb] = useState<Record<
    string,
    string
  > | null>(null);

  // Trigger to force re-reading sessionStorage when navigating between steps
  const [_sessionStorageTrigger, setSessionStorageTrigger] = useState(0);

  // Re-check sessionStorage when step changes to abschluss
  useEffect(() => {
    if (stepIndex === steps.length - 1) {
      // Force re-read of sessionStorage by incrementing trigger
      setSessionStorageTrigger((prev) => prev + 1);
    }
  }, [stepIndex, steps.length]);

  // Load userData from database as fallback when sessionStorage is empty
  useEffect(() => {
    if (!sessionId) return;

    // Check if we already have data in sessionStorage
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("grundstueckCheckData");
      if (storedData) {
        return; // Data already available in sessionStorage
      }
    }

    // No data in sessionStorage, try to load from database
    const loadUserDataFromDb = async () => {
      try {
        const response = await fetch(
          `/api/sessions/get-session?sessionId=${sessionId}`
        );
        const result = await response.json();

        if (
          response.ok &&
          result.success &&
          result.session?.configurationData
        ) {
          const configData = result.session.configurationData as Record<
            string,
            unknown
          >;
          const userData = configData.userData as
            | Record<string, string>
            | undefined;

          if (userData) {
            console.log("✅ Loaded userData from database:", userData);
            setUserDataFromDb(userData);

            // Also store in sessionStorage for faster future access
            if (typeof window !== "undefined") {
              sessionStorage.setItem(
                "grundstueckCheckData",
                JSON.stringify(userData)
              );
            }
          }
        }
      } catch (error) {
        console.warn("⚠️ Failed to load userData from database:", error);
      }
    };

    loadUserDataFromDb();
  }, [sessionId]);

  // Get user data from appointment and grundstueck forms
  const getUserData = useMemo(() => {
    // Try to get data from appointmentDetails (stored in cart store)
    const appointmentData = appointmentDetails?.customerInfo;

    // Try to get data from sessionStorage (grundstueck form)
    let grundstueckData = null;
    if (typeof window !== "undefined") {
      try {
        const storedData = sessionStorage.getItem("grundstueckCheckData");
        if (storedData) {
          grundstueckData = JSON.parse(storedData);
        }
      } catch (error) {
        console.error("Error reading grundstueckCheckData:", error);
      }
    }

    // Fallback to database-loaded data if sessionStorage is empty
    if (!grundstueckData && userDataFromDb) {
      grundstueckData = userDataFromDb;
    }

    // Merge data with priority: appointment data > grundstueck data > database data
    return {
      name: appointmentData?.name || grundstueckData?.name || "",
      lastName: appointmentData?.lastName || grundstueckData?.lastName || "",
      phone: appointmentData?.phone || grundstueckData?.phone || "",
      email: appointmentData?.email || grundstueckData?.email || "",
      address: grundstueckData?.address || "",
      addressLine2: grundstueckData?.addressLine2 || "",
      propertyNumber: grundstueckData?.propertyNumber || "",
      cadastralCommunity: grundstueckData?.cadastralCommunity || "",
      city: grundstueckData?.city || "",
      state: grundstueckData?.state || "",
      postalCode: grundstueckData?.postalCode || "",
      country: grundstueckData?.country || "Österreich",
    };
  }, [appointmentDetails, userDataFromDb]);

  // Helper function to check if appointment is in the past
  const isAppointmentInPast = useMemo(() => {
    if (!appointmentDetails?.date) return false;

    const appointmentDate = new Date(appointmentDetails.date);
    const now = new Date();

    // Set time to start of day for fair comparison
    appointmentDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    return appointmentDate < now;
  }, [appointmentDetails?.date]);

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

  // Safety check to prevent crashes during cart updates
  const currentImagePath = sourceConfig
    ? ImageManager.getPreviewImage(sourceConfig, currentView)
    : ImageManager.getPreviewImage(null, currentView);

  const goPrevImage = () =>
    setGalleryIndex((i) => (i - 1 + galleryViews.length) % galleryViews.length);
  const goNextImage = () =>
    setGalleryIndex((i) => (i + 1) % galleryViews.length);

  useEffect(() => {
    ImageManager.preloadImages(sourceConfig || null);
  }, [sourceConfig]);

  // No extra memoization for summary; rely on lightweight renderer

  return (
    <section className="w-full pt-12 pb-8">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
        {renderIntro()}
        {stepIndex === 0 && (
          <div className="space-y-6 pt-8">
            {/* Overview grid: cart on left, summary/upgrade on right */}
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-stretch">
              {/* Show house configuration section only if not in ohne nest mode */}
              {!isOhneNestMode && (
                <div className="contents">
                  <div className="space-y-6 w-full max-w-[520px] lg:flex-none lg:flex lg:flex-col">
                    <h2 className="h3-secondary text-gray-500">
                      <span className="text-black">Dein Nest</span>
                      <span className="text-gray-300"> Deine Auswahl</span>
                    </h2>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-300 rounded-[19px] px-6 py-6 flex flex-col [aspect-ratio:unset]"
                        style={{
                          minHeight: "clamp(400px, 40vw, 520px)",
                        }}
                      >
                        {/* Header Section */}
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900 break-words">
                              {getConfigurationTitle(item)}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                              {(() => {
                                // For configuration items with nest, show NEST MODULE price per m² (not total)
                                if (
                                  "totalPrice" in item &&
                                  (item as ConfigurationCartItem).nest
                                ) {
                                  const configItem =
                                    item as ConfigurationCartItem;
                                  const nestModel =
                                    configItem.nest?.value || "";

                                  // Show only NEST MODULE price per m² (relative price)
                                  const nestPrice = configItem.nest
                                    ? getItemPrice(
                                        "nest",
                                        configItem.nest,
                                        configItem
                                      )
                                    : 0;

                                  const geschossdeckeQuantity =
                                    configItem.geschossdecke?.quantity || 0;

                                  return PriceUtils.calculatePricePerSquareMeter(
                                    nestPrice,
                                    nestModel,
                                    geschossdeckeQuantity
                                  );
                                }
                                // For other items, keep monthly payment
                                const priceValue =
                                  "totalPrice" in item
                                    ? (item as ConfigurationCartItem).totalPrice
                                    : (item as CartItem).price;
                                return `oder ${calculateMonthlyPayment(
                                  priceValue
                                )} für 240 Monate`;
                              })()}
                            </div>
                          </div>
                          <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-900 leading-relaxed min-w-0">
                            {(() => {
                              const price = (() => {
                                // For nest configuration, show ONLY the nest base price (not total house price)
                                if (
                                  "totalPrice" in item &&
                                  (item as ConfigurationCartItem).nest
                                ) {
                                  const configItem =
                                    item as ConfigurationCartItem;
                                  if (configItem.nest) {
                                    return getItemPrice(
                                      "nest",
                                      configItem.nest,
                                      configItem
                                    );
                                  }
                                }
                                // For other items, use totalPrice
                                return "totalPrice" in item
                                  ? (item as ConfigurationCartItem).totalPrice
                                  : (item as CartItem).price;
                              })();
                              return PriceUtils.isPriceOnRequest(price)
                                ? "-"
                                : PriceUtils.formatPrice(price);
                            })()}
                          </div>
                        </div>

                        {/* Details Section - Now takes remaining space and distributes items evenly */}
                        <div className="flex-1 flex flex-col justify-evenly min-h-0">
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
                                  className="flex items-center justify-between gap-4 py-1"
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
                                    {PriceUtils.isPriceOnRequest(
                                      detail.price || 0
                                    ) ? (
                                      <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-900 leading-relaxed">
                                        -
                                      </div>
                                    ) : detail.isIncluded ||
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

                            // Combine all items into a single array for even distribution
                            const allItems = [
                              ...topAndMiddleItems,
                              ...bottomItems,
                            ];

                            return <>{allItems.map(renderDetailItem)}</>;
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6 w-full lg:flex-1 min-w-0 lg:flex lg:flex-col">
                    <h2 className="h3-secondary text-gray-500 lg:flex-shrink-0">
                      <span className="text-black">Dein Nest</span>
                      <span className="text-gray-300">
                        {" "}
                        Ein Blick in die Zukunft
                      </span>
                    </h2>
                    {/* Configuration Image Gallery */}
                    <div className="border border-gray-300 rounded-[19px] overflow-hidden bg-transparent lg:flex-[1.15] lg:flex lg:flex-col">
                      <div
                        className="relative w-full lg:flex-1"
                        style={{ aspectRatio: "16/10" }}
                      >
                        {currentImagePath && (
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
                        )}

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
                        <div className="flex items-center justify-center gap-2 py-2 lg:flex-shrink-0">
                          {galleryViews.map((v, i) => (
                            <button
                              key={v + i}
                              type="button"
                              aria-label={`Wechsel zu Ansicht ${v}`}
                              onClick={() => setGalleryIndex(i)}
                              className={
                                "w-2.5 h-2.5 rounded-full " +
                                (i === galleryIndex
                                  ? "bg-[#3D6CE1]"
                                  : "bg-gray-300")
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Show "Planen heißt Preise kennen" section for ohne-nest mode */}
              {isOhneNestMode && (
                <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#F4F4F4] py-12 md:py-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                      {/* Text content on left - directly on gray background */}
                      <div className="w-full md:w-1/2 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 mb-6">
                          Planen heißt Preise kennen
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                          Wenn du dein Nest schon jetzt konfigurierst, erhältst
                          du volle Klarheit über Preis, Umfang und
                          Möglichkeiten. Deine Auswahl bleibt dabei flexibel und
                          kann jederzeit angepasst werden, falls sich deine
                          Wünsche im Laufe der Planung verändern.
                        </p>
                        <div className="flex justify-center md:justify-start">
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => {
                              window.location.href = "/konfigurator";
                            }}
                          >
                            Jetzt konfigurieren
                          </Button>
                        </div>
                      </div>

                      {/* Image on right - inside white box */}
                      <div className="w-full md:w-1/2">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                          <div className="relative w-full aspect-square">
                            <HybridBlobImage
                              path="173-NEST-Haus-Konfigurator-Modul-Holzfassade-Steirische-Eiche-Parkett-Eiche"
                              alt="NEST-Haus Konfiguration"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
          <div className="space-y-4 pt-16 md:pt-32">
            {/* Dein Grundstück - Unser Check Section - FIRST */}
            <div id="entwurf-formular" className="mb-16">
              <div className="text-center mb-12 md:mb-16">
                <h1 className="h1-secondary text-black mb-2 md:mb-3">
                  Konzept-Check
                </h1>
                <h3 className="h3-secondary text-black mb-2">
                  Wir überprüfen für dich wie dein Nest-Haus auf ein Grundstück
                  deiner Wahl passt
                </h3>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-6">
                <div className="w-full md:w-1/2 text-center md:text-left md:px-16 lg:px-24">
                  <p className="p-secondary mb-4 md:mt-12">
                    <span className="text-nest-gray">Bevor dein </span>
                    <span className="text-black font-medium">
                      Traum vom Nest-Haus
                    </span>
                    <span className="text-nest-gray">
                      {" "}
                      Realität wird, prüfen wir, ob dein{" "}
                    </span>
                    <span className="text-black font-medium">Grundstück</span>
                    <span className="text-nest-gray">
                      {" "}
                      alle rechtlichen und{" "}
                    </span>
                    <span className="text-black font-medium">
                      baulichen Anforderungen
                    </span>
                    <span className="text-nest-gray"> erfüllt. Für </span>
                    <span className="text-black font-medium">€ 3.000</span>
                    <span className="text-nest-gray">
                      {" "}
                      übernehmen wir diese Überprüfung und entwickeln gemeinsam
                      mit dir ein individuelles{" "}
                    </span>
                    <span className="text-black font-medium">
                      Entwurfskonzept
                    </span>
                    <span className="text-nest-gray"> deines Nest-Hauses.</span>
                  </p>
                  <p className="p-secondary mb-6">
                    <span className="text-nest-gray">
                      Dabei verbinden wir deine{" "}
                    </span>
                    <span className="text-black font-medium">Wünsche</span>
                    <span className="text-nest-gray"> mit den gegebenen </span>
                    <span className="text-black font-medium">
                      Rahmenbedingungen
                    </span>
                    <span className="text-nest-gray">
                      {" "}
                      und schaffen so die ideale Grundlage für dein{" "}
                    </span>
                    <span className="text-black font-medium">
                      zukünftiges Zuhause
                    </span>
                    <span className="text-nest-gray">.</span>
                  </p>
                </div>

                <div className="w-full md:w-1/2">
                  <div className="w-full max-w-[520px] ml-auto mt-1 md:mt-2">
                    <GrundstueckCheckForm
                      backgroundColor="white"
                      maxWidth={false}
                      padding="sm"
                      excludePersonalData={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Process Steps - Step by Step nach Hause - SECOND */}
            <div className="text-center mb-12 md:mb-16">
              <h1 className="h1-primary text-black mb-2 md:mb-3">
                Step by Step nach Hause
              </h1>
              <h3 className="h3-secondary text-black mb-8">
                Deine Vorstellungen formen jeden Schritt am Weg zum neuen
                Zuhause
              </h3>
            </div>

            <UnifiedContentCard
              category="ablaufSteps"
              layout="process-detail"
              style="standard"
              variant="responsive"
              maxWidth={true}
              showInstructions={false}
              backgroundColor="white"
            />

            <div className="flex justify-center mt-16 md:mt-20">
              <Button
                variant="landing-secondary-blue"
                size="xs"
                className="whitespace-nowrap"
                onClick={goPrev}
                disabled={stepIndex <= 0}
              >
                Vorheriger Schritt
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

        {/* Step 3: Planungspakete - Show when there's a configuration OR not in ohne-nest mode */}
        {stepIndex === 3 && (!isOhneNestMode || configItem) && (
          <div className="space-y-4 pt-16">
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

            {/* Welches Planungspaket passt zu dir - Konfigurator popup style */}
            <div className="mt-12 max-w-4xl mx-auto">
              <button
                onClick={() =>
                  setShowPlanungspaketeDetails(!showPlanungspaketeDetails)
                }
                className="w-full rounded-3xl p-6 bg-[#F4F4F4] flex items-center justify-between"
              >
                <div className="text-left">
                  <h3 className="p-primary text-black mb-1">
                    Welches Planungspaket passt zu dir?
                  </h3>
                  <p className="p-primary-small text-black">
                    Siehe dir die Pakete im Detail an und entdecke welches am
                    besten zu dir passt.
                  </p>
                </div>
                <div className="min-w-[1.5rem] min-h-[1.5rem] rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Navigation buttons for step 3 - Always show when on step 3 */}
        {stepIndex === 3 && (
          <div className="flex justify-center mt-16 md:mt-20">
            <Button
              variant="landing-secondary-blue"
              size="xs"
              className="whitespace-nowrap"
              onClick={goPrev}
              disabled={stepIndex <= 0}
            >
              Vorheriger Schritt
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
        )}

        {stepIndex === 2 && (
          <div className="space-y-4 pt-16 md:pt-16">
            {/* Show notification if redirected without booking appointment */}
            {contactWarning && (
              <div className="flex justify-center mb-6">
                <div className="border-2 border-gray-300 rounded-xl px-6 py-4 max-w-2xl bg-white">
                  <p className="text-black font-normal text-base text-center">
                    Bitte buchen Sie einen Beratungstermin, um die Zahlung Ihres
                    Entwurfs abzuschließen.
                  </p>
                </div>
              </div>
            )}
            {/* Terminvereinbarung with centered title */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="h2-title text-black mb-2 md:mb-3">
                Vereinbare jetzt deinen Termin
              </h2>
              <h3 className="h3-secondary text-black mb-2">Wir helfen gerne</h3>
            </div>

            {/* Left text + right calendar layout */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-start gap-8">
              <div className="w-full md:w-1/2 text-center md:text-left md:px-16 lg:px-24 md:pt-12 md:mt-12">
                <p className="p-secondary mb-4 md:mb-6 md:pt-6 hidden md:block">
                  <span className="text-nest-gray">
                    Der Kauf deines Hauses ist ein großer Schritt – und{" "}
                  </span>
                  <span className="text-black font-medium">
                    wir sind da, um dir dabei zu helfen.
                  </span>
                  <span className="text-nest-gray">
                    {" "}
                    Für mehr Sicherheit und Klarheit{" "}
                  </span>
                  <span className="text-black font-medium">
                    stehen wir dir jederzeit persönlich zur Seite.
                  </span>
                  <span className="text-nest-gray"> Ruf uns an, um dein </span>
                  <span className="text-black font-medium">
                    Beratungsgespräch
                  </span>
                  <span className="text-nest-gray">
                    {" "}
                    zu vereinbaren, oder buche deinen{" "}
                  </span>
                  <span className="text-black font-medium">
                    Termin ganz einfach online.
                  </span>
                  <span className="text-nest-gray">
                    {" "}
                    Dein Weg zu deinem Traumhaus beginnt mit einem Gespräch.
                  </span>
                </p>
              </div>

              <div className="w-full md:w-1/2">
                <AppointmentBooking showLeftSide={false} />
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
                Vorheriger Schritt
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

            {/* ContactMap */}
            <div className="mt-16 md:mt-24">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="h2-title text-black mb-2 md:mb-3">
                  So findest du uns
                </h2>
                <h3 className="h3-secondary text-black mb-2">
                  Persönlich oder telefonisch? Du entscheidest.
                </h3>
              </div>
              <div className="w-full max-w-[1536px] mx-auto">
                <div
                  className="relative h-[600px] w-full bg-white rounded-[60px] overflow-hidden shadow-xl"
                  style={{ border: "15px solid #F4F4F4" }}
                >
                  <iframe
                    title="Google Maps Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.0612860304307!2d15.416334776632444!3d47.08126897114428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476e3352d2429edf%3A0x3a9430b9a0f0fd25!2sKarmeliterplatz%208%2C%208010%20Graz%2C%20Austria!5e0!3m2!1sen!2sus!4v1712087456318!5m2!1sen!2sus"
                    width="600"
                    height="450"
                    style={{ width: "100%", height: "100%", border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {stepIndex === 4 && (
          <div className="space-y-6 pt-16 md:pt-16">
            {/* Ohne-Nest Mode: Show "Konfiguration hinzufügen" section */}
            {isOhneNestMode && (
              <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#F4F4F4] py-12 md:py-16 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                    {/* Text content on left - directly on gray background */}
                    <div className="w-full md:w-1/2">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 mb-6">
                        Planen heißt Preise kennen
                      </h2>
                      <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                        Wenn du dein Nest schon jetzt konfigurierst, erhältst du
                        volle Klarheit über Preis, Umfang und Möglichkeiten.
                        Deine Auswahl bleibt dabei flexibel und kann jederzeit
                        angepasst werden, falls sich deine Wünsche im Laufe der
                        Planung verändern.
                      </p>
                      <div>
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => {
                            window.location.href = "/konfigurator";
                          }}
                        >
                          Jetzt konfigurieren
                        </Button>
                      </div>
                    </div>

                    {/* Image on right - inside white box */}
                    <div className="w-full md:w-1/2">
                      <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                        <div className="relative w-full aspect-square">
                          <HybridBlobImage
                            path="173-NEST-Haus-Konfigurator-Modul-Holzfassade-Steirische-Eiche-Parkett-Eiche"
                            alt="NEST-Haus Konfiguration"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Title before Dein Nest sections */}
            {!isOhneNestMode && (
              <div className="text-center mb-12 md:mb-16">
                <h2 className="h2-title text-black mb-2">
                  Du hast es gleich Geschafft
                </h2>
                <h3 className="h3-secondary text-black">
                  Überprüfe deine Daten und Angaben
                </h3>
              </div>
            )}

            {/* Overview grid: cart on left, summary/upgrade on right */}
            {!isOhneNestMode && (
              <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-stretch">
                <div className="space-y-6 w-full max-w-[520px] lg:flex-none lg:flex lg:flex-col">
                  <h2 className="h3-secondary text-black">
                    <span className="text-black">Dein Nest</span>
                    <span className="text-nest-gray"> Deine Auswahl</span>
                  </h2>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-300 rounded-[19px] px-6 py-6 flex flex-col [aspect-ratio:unset]"
                      style={{
                        minHeight: "clamp(400px, 40vw, 520px)",
                      }}
                    >
                      {/* Header Section */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900 break-words">
                            {getConfigurationTitle(item)}
                          </div>
                          <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                            {(() => {
                              // For configuration items with nest, show price per m²
                              if (
                                "totalPrice" in item &&
                                (item as ConfigurationCartItem).nest
                              ) {
                                const configItem =
                                  item as ConfigurationCartItem;
                                const nestModel = configItem.nest?.value || "";

                                // Convert to Selections type for PriceCalculator
                                const selections = {
                                  nest: configItem.nest || undefined,
                                  gebaeudehuelle:
                                    configItem.gebaeudehuelle || undefined,
                                  innenverkleidung:
                                    configItem.innenverkleidung || undefined,
                                  fussboden: configItem.fussboden || undefined,
                                  bodenaufbau:
                                    configItem.bodenaufbau || undefined,
                                  geschossdecke:
                                    configItem.geschossdecke || undefined,
                                  belichtungspaket:
                                    configItem.belichtungspaket || undefined,
                                  pvanlage: configItem.pvanlage || undefined,
                                  fenster: configItem.fenster || undefined,
                                  stirnseite:
                                    configItem.stirnseite || undefined,
                                  planungspaket:
                                    configItem.planungspaket || undefined,
                                  fundament: configItem.fundament || undefined,
                                  kamindurchzug:
                                    configItem.kamindurchzug || undefined,
                                  grundstueckscheck: Boolean(
                                    configItem.grundstueckscheck
                                  ),
                                };

                                // Use PriceCalculator.calculateTotalPrice() for consistency with konfigurator
                                const priceValue =
                                  PriceCalculator.calculateTotalPrice(
                                    selections
                                  );
                                const geschossdeckeQuantity =
                                  configItem.geschossdecke?.quantity || 0;

                                return PriceUtils.calculatePricePerSquareMeter(
                                  priceValue,
                                  nestModel,
                                  geschossdeckeQuantity
                                );
                              }
                              // For other items, keep monthly payment
                              const priceValue =
                                "totalPrice" in item
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
                            (() => {
                              // For nest configuration, show ONLY the nest base price (not total house price)
                              if (
                                "totalPrice" in item &&
                                (item as ConfigurationCartItem).nest
                              ) {
                                const configItem =
                                  item as ConfigurationCartItem;
                                if (configItem.nest) {
                                  return getItemPrice(
                                    "nest",
                                    configItem.nest,
                                    configItem
                                  );
                                }
                              }
                              // For other items, use totalPrice
                              return "totalPrice" in item
                                ? (item as ConfigurationCartItem).totalPrice
                                : (item as CartItem).price;
                            })()
                          )}
                        </div>
                      </div>

                      {/* Details Section - Now takes remaining space and distributes items evenly */}
                      <div className="flex-1 flex flex-col justify-evenly min-h-0">
                        {(() => {
                          const details = renderConfigurationDetails(
                            item,
                            true
                          ); // Exclude grundstueckscheck in step 4 (shown in "Dein Preis Überblick")
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
                                className="flex items-center justify-between gap-4 py-1"
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
                                  {PriceUtils.isPriceOnRequest(
                                    detail.price || 0
                                  ) ? (
                                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-900 leading-relaxed">
                                      -
                                    </div>
                                  ) : detail.isIncluded ||
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

                          // Combine all items into a single array for even distribution
                          const allItems = [
                            ...topAndMiddleItems,
                            ...bottomItems,
                          ];

                          return <>{allItems.map(renderDetailItem)}</>;
                        })()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 w-full lg:flex-1 min-w-0 lg:flex lg:flex-col">
                  <h2 className="h3-secondary text-gray-500 lg:flex-shrink-0">
                    <span className="text-black">Dein Nest</span>
                    <span className="text-nest-gray">
                      {" "}
                      Ein Blick in die Zukunft
                    </span>
                  </h2>
                  {/* Configuration Image Gallery */}
                  <div className="border border-gray-300 rounded-[19px] overflow-hidden bg-transparent lg:flex-1 lg:flex lg:flex-col">
                    <div
                      className="relative w-full lg:flex-1"
                      style={{ aspectRatio: "16/10" }}
                    >
                      {currentImagePath && (
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
                      )}

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
                      <div className="flex items-center justify-center gap-2 py-2 lg:flex-shrink-0">
                        {galleryViews.map((v, i) => (
                          <button
                            key={v + i}
                            type="button"
                            aria-label={`Wechsel zu Ansicht ${v}`}
                            onClick={() => setGalleryIndex(i)}
                            className={
                              "w-2.5 h-2.5 rounded-full " +
                              (i === galleryIndex
                                ? "bg-[#3D6CE1]"
                                : "bg-gray-300")
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bewerber Data Section - 4 boxes in 2x2 grid with column headers */}
            <div className="max-w-6xl mx-auto mt-16 mb-12">
              {/* Section Headers */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="h3-secondary text-black">
                    <span className="text-black">Bewerber</span>
                    <span className="text-nest-gray"> Deine Daten</span>
                  </h3>
                </div>
                <div>
                  <h3 className="h3-secondary text-black">
                    <span className="text-black">Deine Termine</span>
                    <span className="text-nest-gray"> Im Überblick</span>
                  </h3>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Box 1: Bewerber Data (no title) */}
                <div className="bg-white border border-gray-300 rounded-2xl p-6 flex flex-col justify-center">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div>
                        <div className="text-gray-600">Vollständiger Name</div>
                        <div className="text-gray-900 font-medium">
                          {getUserData.name && getUserData.lastName
                            ? `${getUserData.name} ${getUserData.lastName}`
                            : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Email</div>
                        <div className="text-gray-900 font-medium">
                          {getUserData.email || "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Telefon</div>
                        <div className="text-gray-900 font-medium">
                          {getUserData.phone || "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Land</div>
                        <div className="text-gray-900 font-medium">
                          {getUserData.country || "—"}
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          window.location.hash = "entwurf";
                          // Scroll to the GrundstueckCheckForm after hash change
                          setTimeout(() => {
                            const entwurfElement =
                              document.getElementById("entwurf-formular");
                            if (entwurfElement) {
                              entwurfElement.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }
                          }, 100);
                        }}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Daten bearbeiten
                      </button>
                    </div>
                  </div>
                </div>

                {/* Box 2: Entwurfsgespräch (no title) */}
                <div className="bg-white border border-gray-300 rounded-2xl p-6 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-600 text-sm">
                        {appointmentDetails?.appointmentType === "personal"
                          ? "Persönliches Gespräch"
                          : appointmentDetails?.appointmentType === "phone"
                            ? "Telefonische Beratung"
                            : "Termin"}
                      </div>
                      {isAppointmentInPast ? (
                        <>
                          <div className="text-xl font-bold text-gray-900">
                            Neuen Termin vereinbaren
                          </div>
                          <button
                            onClick={() => {
                              window.location.hash = "terminvereinbarung";
                            }}
                            className="text-blue-600 text-sm hover:underline mt-2"
                          >
                            Zur Terminvereinbarung
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-xl font-bold text-gray-900">
                            {appointmentDetails?.date
                              ? new Date(
                                  appointmentDetails.date
                                ).toLocaleDateString("de-DE", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                              : "—"}
                          </div>
                          {appointmentDetails?.time && (
                            <div className="text-sm text-gray-600 mt-1">
                              {appointmentDetails.time} Uhr
                            </div>
                          )}
                          <button
                            onClick={() => {
                              window.location.hash = "terminvereinbarung";
                            }}
                            className="text-blue-600 text-sm hover:underline mt-2"
                          >
                            Termin personalisieren
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Box 3: Grundstücksinformationen (no title) */}
                <div className="bg-white border border-gray-300 rounded-2xl p-6 flex flex-col justify-center">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 text-sm">
                    <div>
                      <div className="text-gray-600">Straße und Nummer</div>
                      <div className="text-gray-900 font-medium">
                        {getUserData.address || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Stadt</div>
                      <div className="text-gray-900 font-medium">
                        {getUserData.city || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Zusatz</div>
                      <div className="text-gray-900 font-medium">
                        {getUserData.addressLine2 || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Postleitzahl</div>
                      <div className="text-gray-900 font-medium">
                        {getUserData.postalCode || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Grundstücknummer</div>
                      <div className="text-gray-900 font-medium">
                        {getUserData.propertyNumber || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Bundesland</div>
                      <div className="text-gray-900 font-medium">
                        {getUserData.state || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Katastralgemeinde</div>
                      <div className="text-gray-900 font-medium">
                        {getUserData.cadastralCommunity || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Land</div>
                      <div className="text-gray-900 font-medium">
                        {getUserData.country || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="pt-3">
                    <button
                      onClick={() => {
                        window.location.hash = "entwurf";
                        // Scroll to the GrundstueckCheckForm after hash change
                        setTimeout(() => {
                          const entwurfElement =
                            document.getElementById("entwurf-formular");
                          if (entwurfElement) {
                            entwurfElement.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }, 100);
                      }}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Daten bearbeiten
                    </button>
                  </div>
                </div>

                {/* Box 4: Lieferungsdatum (no title) */}
                <div className="bg-white border border-gray-300 rounded-2xl p-6 flex flex-col justify-center">
                  <div className="space-y-2">
                    <div className="text-gray-600 text-sm">
                      Garantierter Liefertermin
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {calculateDeliveryDate}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      6 Monate Liefergarantie
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* So gehts danach weiter Section */}
            <div className="text-center mb-12 pt-4 md:mb-8">
              <h2 className="h2-title text-black mb-2">
                {isPaymentCompleted ? "Vielen Dank" : "So geht's danach weiter"}
              </h2>
              <p className="p-secondary text-black">
                {isPaymentCompleted
                  ? "Deine Zahlung wurde bearbeitet"
                  : "Dein Preis im Überblick"}
              </p>
            </div>

            {/* Left/Right Layout: Teilzahlungen (left) + Heute zu bezahlen (right) */}
            {!isOhneNestMode &&
              (() => {
                // Calculate dynamic total (Dein Nest Haus price from Dein Preis Überblick)
                // Use PriceCalculator.calculateTotalPrice() for consistency with konfigurator
                let deinNestHausTotal = 0;
                if (configItem && configItem.nest) {
                  // Convert to Selections type for PriceCalculator
                  const selections = {
                    nest: configItem.nest || undefined,
                    gebaeudehuelle: configItem.gebaeudehuelle || undefined,
                    innenverkleidung: configItem.innenverkleidung || undefined,
                    fussboden: configItem.fussboden || undefined,
                    bodenaufbau: configItem.bodenaufbau || undefined,
                    geschossdecke: configItem.geschossdecke || undefined,
                    belichtungspaket: configItem.belichtungspaket || undefined,
                    pvanlage: configItem.pvanlage || undefined,
                    fenster: configItem.fenster || undefined,
                    stirnseite: configItem.stirnseite || undefined,
                    planungspaket: configItem.planungspaket || undefined,
                    fundament: configItem.fundament || undefined,
                    kamindurchzug: configItem.kamindurchzug || undefined,
                    grundstueckscheck: Boolean(configItem.grundstueckscheck),
                  };

                  deinNestHausTotal =
                    PriceCalculator.calculateTotalPrice(selections);
                }

                // Calculate planungspaket price using new pricing system (nest-size dependent)
                const planungspaketPrice = (() => {
                  if (configItem?.planungspaket) {
                    return getItemPrice(
                      "planungspaket",
                      configItem.planungspaket,
                      configItem
                    );
                  }
                  // Fallback to PLANNING_PACKAGES if no stored planungspaket
                  const planValue = localSelectedPlan || "basis";
                  if (planValue === "basis") return 0;
                  const planPkg = PLANNING_PACKAGES.find(
                    (p) => p.value === planValue
                  );
                  return planPkg?.price || 0;
                })();

                // Total price for payment calculations (Nest Haus + Planungspaket)
                const totalPrice = deinNestHausTotal + planungspaketPrice;

                const _firstPayment = 3000; // Grundstückscheck full price (shown in display above)
                const grundstueckscheckCredit = 1500; // Actual payment (discount applied)
                const secondPaymentOriginal = Math.max(0, totalPrice * 0.3);
                const secondPayment = Math.max(
                  0,
                  secondPaymentOriginal - grundstueckscheckCredit
                );
                const thirdPayment = Math.max(0, totalPrice * 0.5);
                const fourthPayment = Math.max(0, totalPrice * 0.2);

                return (
                  <div className="max-w-6xl mx-auto mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      {/* Left: Dein Nest - Deine Konfiguration with Teilzahlungen */}
                      <div className="border border-gray-300 rounded-2xl p-6 bg-white">
                        <div className="space-y-4">
                          {/* 1. Teilzahlung */}
                          <div className="pb-4 border-b border-gray-200">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  1. Teilzahlung
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Heute zu begleichen
                                  <br />
                                  Grundstückscheck und Entwurf
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  Fixpreis
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {PriceUtils.formatPrice(3000)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2. Teilzahlung */}
                          <div className="pb-4 border-b border-gray-200">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  2. Teilzahlung
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Liefergarantie 6 Monate ab Teilzahlung
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  30% des Gesamtpreises
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {PriceUtils.formatPrice(secondPayment)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. Teilzahlung */}
                          <div className="pb-4 border-b border-gray-200">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  3. Teilzahlung
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Fällig nach Fertigstellung in Produktion
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  50% des Gesamtpreises nach Fertigstellung
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {PriceUtils.formatPrice(thirdPayment)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 4. Teilzahlung */}
                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  4. Teilzahlung
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Fällig nach Fertigstellung am Grundstück
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  20% des Gesamtpreises nach Fertigstellung
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {PriceUtils.formatPrice(fourthPayment)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 mt-4 border-t border-gray-200">
                            <button
                              onClick={() => {
                                window.location.href = "/konfigurator";
                              }}
                              className="text-blue-600 text-sm hover:underline cursor-pointer"
                            >
                              Konfiguration bearbeiten
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Heute zu bezahlen box - compact design per image */}
                      <div className="lg:sticky lg:top-4">
                        {/* Compact box with title/subtitle left, price right */}
                        <div className="border border-gray-300 rounded-2xl p-6 bg-white mb-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="text-left">
                              <h3
                                className={`text-lg font-medium mb-1 ${isPaymentCompleted ? "text-green-600" : "text-gray-900"}`}
                              >
                                {isPaymentCompleted
                                  ? "Bezahlt"
                                  : "Konzept-Check"}
                              </h3>
                              <div className="text-sm text-gray-600">
                                {isPaymentCompleted
                                  ? "Zahlung erfolgreich abgeschlossen"
                                  : "Heute zu bezahlen"}
                              </div>
                            </div>
                            {!isPaymentCompleted ? (
                              <div className="text-right">
                                <div className="flex items-center gap-2 justify-end mt-2">
                                  <span className="text-gray-400 line-through text-xl">
                                    3.000 €
                                  </span>
                                  <div className="text-3xl font-bold text-gray-900">
                                    1.500 €
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 text-right mt-1">
                                  Preise inkl. MwSt.
                                </div>
                              </div>
                            ) : (
                              <div className="text-right flex items-center justify-end gap-2">
                                <svg
                                  className="w-8 h-8 text-green-600 mt-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <div className="text-2xl font-bold text-green-600 mt-2">
                                  Bezahlt
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Green transaction details box - only show after payment */}
                        {isPaymentCompleted && (
                          <div className="mb-6">
                            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                                    Deine Nest ID:
                                  </span>
                                  <span className="font-mono text-sm md:text-base bg-white px-3 py-1.5 rounded-lg border border-green-300">
                                    {configItem?.sessionId ||
                                      configuration?.sessionId ||
                                      "nest-haus-" + Date.now().toString(36)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                                    Transaktion ID:
                                  </span>
                                  <span className="font-mono text-xs md:text-sm bg-white px-3 py-1.5 rounded-lg border border-green-300">
                                    {successfulPaymentIntentId ||
                                      "pi_xxxxxxxxxxxxx"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                                    Betrag:
                                  </span>
                                  <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-green-700 font-bold">
                                    1.500 €
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                                    Status:
                                  </span>
                                  <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-green-600 font-bold">
                                    Bezahlt
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                                    Datum:
                                  </span>
                                  <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700">
                                    {(() => {
                                      const paymentDate =
                                        paymentCompletedDate || new Date();
                                      const date = `${paymentDate.getDate().toString().padStart(2, "0")}.${(paymentDate.getMonth() + 1).toString().padStart(2, "0")}.${paymentDate.getFullYear()}`;
                                      const time = `${paymentDate.getHours().toString().padStart(2, "0")}:${paymentDate.getMinutes().toString().padStart(2, "0")}`;
                                      return `${date} | ${time}`;
                                    })()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Disclaimer text - centered below box with margin */}
                        <div className="text-sm text-gray-600 leading-relaxed text-center pt-2 mb-6 mx-5">
                          Solltest du mit dem Entwurf nicht zufrieden sein,
                          kannst du vom Kauf deines Nest-Hauses zurücktreten. In
                          diesem Fall zahlst du lediglich die Kosten für den
                          Entwurf und Grundstückscheck.
                        </div>

                        {/* Jetzt bezahlen button - centered below text */}
                        {!isPaymentCompleted && (
                          <div className="flex justify-center">
                            <Button
                              variant="landing-primary"
                              size="xs"
                              onClick={() => setIsPaymentModalOpen(true)}
                            >
                              Jetzt bezahlen
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

            {/* Ohne-Nest Mode: Show simplified centered payment box */}
            {isOhneNestMode && (
              <div className="max-w-2xl mx-auto mb-12">
                {/* Centered "Heute zu bezahlen" box */}
                <div className="border border-gray-300 rounded-2xl p-6 bg-white mb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-left flex-1">
                      <h3
                        className={`text-lg font-medium mb-1 ${isPaymentCompleted ? "text-green-600" : "text-gray-900"}`}
                      >
                        {isPaymentCompleted ? "Bezahlt" : "Heute zu bezahlen"}
                      </h3>
                      <div className="text-sm text-gray-600">
                        {isPaymentCompleted
                          ? "Zahlung erfolgreich abgeschlossen"
                          : "Starte dein Bauvorhaben"}
                      </div>
                    </div>
                    <div className="text-right">
                      {!isPaymentCompleted && (
                        <div>
                          <div className="flex items-center gap-2 justify-end mt-2">
                            <span className="text-gray-400 line-through text-2xl">
                              3.000 €
                            </span>
                            <div className="text-3xl font-bold text-gray-900">
                              1.500 €
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 text-right mt-1">
                            Preise inkl. MwSt.
                          </div>
                        </div>
                      )}
                      {isPaymentCompleted && (
                        <div className="flex items-center justify-end gap-2">
                          <svg
                            className="w-8 h-8 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="text-2xl font-bold text-green-600">
                            Bezahlt
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Green transaction details box - only show after payment */}
                {isPaymentCompleted && (
                  <div className="mb-6">
                    <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                            Deine Nest ID:
                          </span>
                          <span className="font-mono text-sm md:text-base bg-white px-3 py-1.5 rounded-lg border border-green-300">
                            {configItem?.sessionId ||
                              configuration?.sessionId ||
                              "nest-haus-" + Date.now().toString(36)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                            Transaktion ID:
                          </span>
                          <span className="font-mono text-xs md:text-sm bg-white px-3 py-1.5 rounded-lg border border-green-300">
                            {successfulPaymentIntentId || "pi_xxxxxxxxxxxxx"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                            Betrag:
                          </span>
                          <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-green-700 font-bold">
                            1.500 €
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                            Status:
                          </span>
                          <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-green-600 font-bold">
                            Bezahlt
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                            Datum:
                          </span>
                          <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700">
                            {(() => {
                              const paymentDate =
                                paymentCompletedDate || new Date();
                              const date = `${paymentDate.getDate().toString().padStart(2, "0")}.${(paymentDate.getMonth() + 1).toString().padStart(2, "0")}.${paymentDate.getFullYear()}`;
                              const time = `${paymentDate.getHours().toString().padStart(2, "0")}:${paymentDate.getMinutes().toString().padStart(2, "0")}`;
                              return `${date} | ${time}`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disclaimer text - centered below box */}
                <div className="text-sm text-gray-600 leading-relaxed text-center mb-6 mx-5">
                  Solltest du mit dem Entwurf nicht zufrieden sein, kannst du
                  vom Kauf deines Nest-Hauses zurücktreten. In diesem Fall
                  zahlst du lediglich die Kosten für den Entwurf und
                  Grundstückscheck.
                </div>

                {/* Note: "Jetzt bezahlen" button is hidden for ohne nest mode by not rendering it here */}
              </div>
            )}

            <div className="flex justify-center mt-16 md:mt-20">
              <Button
                variant="landing-secondary-blue"
                size="xs"
                className="whitespace-nowrap"
                onClick={goPrev}
                disabled={stepIndex <= 0}
              >
                Vorheriger Schritt
              </Button>
              <span className="inline-block w-3" />
              <Button
                variant="primary"
                size="xs"
                className="whitespace-nowrap"
                onClick={() => {
                  // Validate email exists before opening payment
                  if (!getUserData.email) {
                    setContactWarning(
                      "Bitte fülle zuerst das Terminvereinbarungsformular aus, damit wir deine E-Mail-Adresse haben."
                    );
                    setStepIndex(3); // Navigate to Terminvereinbarung
                    setTimeout(() => setContactWarning(null), 8000);
                    return;
                  }
                  setIsPaymentModalOpen(true);
                }}
                disabled={isPaymentCompleted}
              >
                {isPaymentCompleted ? "✓ Bezahlt" : "Zur Kassa"}
              </Button>
            </div>
          </div>
        )}

        {/* Removed step 5 - we only have 5 steps (0-4) now */}
        {false && stepIndex === 5 && (
          <div className="space-y-4 pt-8">
            <div className="pt-2"></div>
            {/* Title row replaced above - keep spacing consistent */}
            {/* Deine Auswahl Title */}
            <div className="pt-2"></div>
            <h2 className="h2-title text-black mb-3">Deine Auswahl</h2>

            <div className="space-y-4 mb-8">
              {configItem && !isOhneNestMode ? (
                <>
                  {(() => {
                    const item = configItem as ConfigurationCartItem;
                    const details = renderConfigurationDetails(item);
                    const topAndMiddleItems = details.filter(
                      (d) => !d.isBottomItem
                    );
                    const _bottomItems = details.filter((d) => d.isBottomItem);

                    return (
                      <>
                        {topAndMiddleItems.length > 0 && (
                          <div className="border border-gray-300 rounded-2xl md:min-w-[260px] w-full overflow-hidden">
                            <div>
                              {topAndMiddleItems.map((detail, idx) => {
                                if (!detail.value || detail.value === "—")
                                  return null;
                                return (
                                  <div
                                    key={detail.category + "-" + idx}
                                    className="flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                                        {detail.value}
                                      </div>
                                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                                        {detail.label}
                                      </div>
                                    </div>
                                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                                      {detail.isIncluded ||
                                      (detail.price && detail.price === 0)
                                        ? "inkludiert"
                                        : PriceUtils.isPriceOnRequest(
                                              detail.price || 0
                                            )
                                          ? "-"
                                          : PriceUtils.formatPrice(
                                              detail.price || 0
                                            )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        <div className="border border-gray-300 rounded-2xl md:min-w-[260px] w-full overflow-hidden">
                          <div>
                            {/* Grundstückscheck row - removed "Entwurf" since it's shown below */}
                            {/* Planungspaket row - show if exists in cart OR if locally selected */}
                            {(configItem?.planungspaket ||
                              localSelectedPlan) && (
                              <div className="flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                                    {(() => {
                                      // Get name from cart item first, but use new naming
                                      if (configItem?.planungspaket?.name) {
                                        const name =
                                          configItem?.planungspaket?.name?.toLowerCase() ||
                                          "";
                                        if (name.includes("basis"))
                                          return "Planungspaket 01 Basis";
                                        if (name.includes("plus"))
                                          return "Planungspaket 02 Plus";
                                        if (name.includes("pro"))
                                          return "Planungspaket 03 Pro";
                                        return (
                                          configItem?.planungspaket?.name || "—"
                                        );
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
                                  <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                                    Planungspaket
                                  </div>
                                </div>
                                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                                  {(() => {
                                    // Determine which package we're dealing with
                                    let packageType = "basis";

                                    if (configItem?.planungspaket?.name) {
                                      const name =
                                        configItem?.planungspaket?.name?.toLowerCase() ||
                                        "";
                                      if (name.includes("plus"))
                                        packageType = "plus";
                                      else if (name.includes("pro"))
                                        packageType = "pro";
                                    } else if (localSelectedPlan) {
                                      packageType = localSelectedPlan || "";
                                    }

                                    // Return price display with "inkludiert" for basis
                                    return packageType === "basis"
                                      ? "inkludiert"
                                      : packageType === "plus"
                                        ? "16.900,00€"
                                        : "21.900,00€";
                                  })()}
                                </div>
                              </div>
                            )}
                            {/* Termin mit dem Nest Team row */}
                            <div className="flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                                  {getAppointmentSummary(sessionId)
                                    ? "Terminvereinbarung"
                                    : "—"}
                                </div>
                                <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                                  Termin mit dem Nest Team
                                </div>
                              </div>
                              <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                                {(() => {
                                  const appointmentSummary =
                                    getAppointmentSummaryShort(sessionId);
                                  const hasAppointmentFromOtherSession =
                                    appointmentDetails &&
                                    !isAppointmentFromCurrentSession(sessionId);

                                  if (appointmentSummary) {
                                    return (
                                      <div className="flex items-start justify-end">
                                        <span className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900 text-right max-w-[120px] md:max-w-none">
                                          {appointmentSummary}
                                        </span>
                                      </div>
                                    );
                                  } else if (hasAppointmentFromOtherSession) {
                                    return (
                                      <div className="flex items-start justify-end">
                                        <span className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900 text-right max-w-[120px] md:max-w-none">
                                          bereits vereinbart
                                        </span>
                                      </div>
                                    );
                                  } else {
                                    return "—";
                                  }
                                })()}
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
                  {isOhneNestMode
                    ? "Dein Nest-Haus wird gemeinsam mit uns konfiguriert."
                    : "Keine Konfiguration im Warenkorb."}
                </div>
              )}
            </div>

            {/* Teilzahlungen Title - only show when NOT in ohne nest mode */}
            {!isOhneNestMode && (
              <h2 className="h2-title text-black mb-3">Teilzahlungen</h2>
            )}

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
                totalPrice - firstPayment - secondPaymentOriginal - thirdPayment
              );
              return (
                <div className="border border-gray-300 rounded-2xl md:min-w-[260px] w-full overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                          Entwurf & Grundstückscheck
                        </div>
                        <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                          Der erste Schritt zu deinem Nest-Haus auf deinem
                          Grundstück.
                        </div>
                      </div>
                      <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                        {PriceUtils.formatPrice(firstPayment)}
                      </div>
                    </div>

                    {/* Planungspaket row */}
                    {(configItem?.planungspaket || localSelectedPlan) && (
                      <div className="flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7 border-t border-gray-200">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                            Planungspaket
                          </div>
                          <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                            {(() => {
                              // Get name from cart item first, but use new naming
                              if (configItem?.planungspaket?.name) {
                                const name =
                                  configItem?.planungspaket?.name?.toLowerCase() ||
                                  "";
                                if (name.includes("basis"))
                                  return "Planungspaket 01 Basis";
                                if (name.includes("plus"))
                                  return "Planungspaket 02 Plus";
                                if (name.includes("pro"))
                                  return "Planungspaket 03 Pro";
                                return configItem?.planungspaket?.name || "—";
                              }
                              // Otherwise get from localSelectedPlan
                              if (localSelectedPlan) {
                                if (localSelectedPlan === "basis")
                                  return "Planungspaket 01 Basis";
                                if (localSelectedPlan === "plus")
                                  return "Planungspaket 02 Plus";
                                if (localSelectedPlan === "pro")
                                  return "Planungspaket 03 Pro";
                              }
                              return "—";
                            })()}
                          </div>
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                          {(() => {
                            const planPrice =
                              configItem?.planungspaket?.price ||
                              (localSelectedPlan
                                ? PLANNING_PACKAGES.find(
                                    (p) => p.value === localSelectedPlan
                                  )?.price || 0
                                : 0);

                            // Check if it's basis planungspaket (should show as inkludiert)
                            const planValue =
                              configItem?.planungspaket?.value ||
                              localSelectedPlan;
                            if (planValue === "basis") {
                              return "inkludiert";
                            } else {
                              return PriceUtils.formatPrice(planPrice);
                            }
                          })()}
                        </div>
                      </div>
                    )}
                    {!isOhneNestMode && (
                      <>
                        <div className="flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                              1. Teilzahlung
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                              30% vom Gesamtpreis
                              <br />
                              Abzüglch Grundstückscheck: (
                              {PriceUtils.formatPrice(grundstueckscheckCredit)}
                              ) -
                              <br />
                              Liefergarantie 6 Monate ab Teilzahlung.
                            </div>
                          </div>
                          <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                            {PriceUtils.formatPrice(secondPayment)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                              2. Teilzahlung
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                              50% vom Gesamtpreis <br />
                              Fällig nach Fertigstellung in der Produktion
                            </div>
                          </div>
                          <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                            {PriceUtils.formatPrice(thirdPayment)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                              3. Teilzahlung
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                              20% vom Gesamtpreis <br />
                              Fällig nach Errichtung am Grundstück
                            </div>
                          </div>
                          <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900">
                            {PriceUtils.formatPrice(fourthPayment)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="border border-gray-300 rounded-2xl w-full overflow-hidden mt-3 md:mt-4">
              <div className="flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7">
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-900 leading-relaxed">
                    Gesamtpreis
                  </div>
                </div>
                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-900 leading-relaxed">
                  {isOhneNestMode
                    ? PriceUtils.formatPrice(GRUNDSTUECKSCHECK_PRICE)
                    : PriceUtils.formatPrice(getCartTotal())}
                </div>
              </div>
            </div>

            {/* Moved: Heute zu bezahlen section at the end */}
            <div className="flex items-start justify-between gap-4 py-3">
              <div className="text-left">
                <h2
                  className={`h2-title mb-3 ${isPaymentCompleted ? "text-green-600" : "text-black"}`}
                >
                  {isPaymentCompleted ? "Bezahlt" : "Heute zu bezahlen"}
                </h2>
                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 leading-snug">
                  {isPaymentCompleted && (
                    <span className="text-green-600 font-medium">
                      Zahlung erfolgreich abgeschlossen
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                {!isPaymentCompleted && (
                  <div>
                    <div className="flex items-center gap-3 justify-end mb-1">
                      <span className="h2-title text-gray-400 line-through">
                        3.000 €
                      </span>
                      <span className="h2-title text-black">1.500 €</span>
                    </div>
                    <div className="text-xs text-gray-500 text-right mt-1">
                      Preise inkl. MwSt.
                    </div>
                  </div>
                )}
                {isPaymentCompleted && (
                  <div className="text-right flex items-center justify-end gap-2">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="h2-title text-green-600">Bezahlt</div>
                  </div>
                )}
                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 leading-snug"></div>
              </div>
            </div>

            {/* Green transaction details box - only show after payment */}
            {isPaymentCompleted && (
              <div className="mt-6">
                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                        Deine Nest ID:
                      </span>
                      <span className="font-mono text-sm md:text-base bg-white px-3 py-1.5 rounded-lg border border-green-300">
                        {configItem?.sessionId ||
                          configuration?.sessionId ||
                          "nest-haus-" + Date.now().toString(36)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                        Transaktion ID:
                      </span>
                      <span className="font-mono text-xs md:text-sm bg-white px-3 py-1.5 rounded-lg border border-green-300">
                        {/* Will be populated from payment success */}
                        pi_xxxxxxxxxxxxx
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                        Betrag:
                      </span>
                      <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-green-700 font-bold">
                        1.500 €
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                        Status:
                      </span>
                      <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-green-600 font-bold">
                        Bezahlt
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 font-medium">
                        Datum:
                      </span>
                      <span className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700">
                        {(() => {
                          const now = new Date();
                          const date = `${now.getDate().toString().padStart(2, "0")}.${(now.getMonth() + 1).toString().padStart(2, "0")}.${now.getFullYear()}`;
                          const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
                          return `${date} | ${time}`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact form warning */}
            {contactWarning && (
              <div className="flex justify-center mt-4">
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl px-6 py-4 max-w-2xl">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-yellow-800 font-medium text-base">
                      {contactWarning}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button
                type="button"
                disabled={isPaymentCompleted}
                onClick={() => {
                  // Check if contact form has been submitted
                  const contactSubmitted = localStorage.getItem(
                    "nest-haus-contact-submitted"
                  );

                  // Check if this is an alpha test
                  const isAlphaTest =
                    new URLSearchParams(window.location.search).get(
                      "alpha-test"
                    ) === "true" ||
                    localStorage.getItem("nest-haus-test-session-id");

                  if (isAlphaTest) {
                    // Trigger alpha test Step 3 (feedback phase)
                    localStorage.setItem(
                      "nest-haus-test-purchase-completed",
                      "true"
                    );
                    window.dispatchEvent(
                      new CustomEvent("alpha-test-purchase-completed")
                    );

                    // Call the original scroll to contact function for alpha test
                    if (onScrollToContact) {
                      onScrollToContact();
                    }
                  } else if (!contactSubmitted) {
                    // Production flow: Check if contact form was filled
                    setContactWarning(
                      "Bitte fülle zuerst das Terminvereinbarungsformular aus, damit wir dich kontaktieren können."
                    );
                    // Scroll to contact section (step 3: Terminvereinbarung)
                    setStepIndex(3); // Navigate to Terminvereinbarung section (index 3)
                    // Clear warning after 8 seconds
                    setTimeout(() => setContactWarning(null), 8000);
                  } else {
                    // Production flow: Create inquiry with cart data, then open Stripe payment modal
                    setContactWarning(null);
                    setPaymentError(null);

                    // Create inquiry with cart configuration data
                    createInquiryWithCart().then((createdInquiryId) => {
                      if (createdInquiryId) {
                        setInquiryId(createdInquiryId);
                        setIsPaymentModalOpen(true);
                      } else {
                        setPaymentError(
                          "Fehler beim Erstellen der Anfrage. Bitte versuche es erneut."
                        );
                      }
                    });
                  }
                }}
                className={`${
                  isPaymentCompleted
                    ? "bg-green-600 cursor-not-allowed opacity-75"
                    : "bg-[#3D6CE1] hover:bg-blue-700"
                } text-white py-4 px-12 rounded-full text-[clamp(16px,4vw,20px)] font-medium transition-colors`}
              >
                {isPaymentCompleted ? "✓ Bezahlt" : "Zur Kassa"}
              </button>
            </div>

            <div className="border border-gray-300 rounded-[19px] px-6 py-3 bg-white mt-12">
              <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 leading-relaxed">
                {isOhneNestMode
                  ? "Du zahlst lediglich den Entwurf und Grundstückscheck"
                  : "Solltest du mit dem Entwurf nicht zufrieden sein, kannst du vom Kauf deines Nest-Hauses zurücktreten. In diesem Fall zahlst du lediglich die Kosten für den Entwurf und Grundstückscheck."}
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
                Vorheriger Schritt
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={paymentRedirectStatus?.amount || getPaymentAmount()}
          currency={paymentRedirectStatus?.currency || "eur"}
          customerEmail={getCustomerEmail()}
          customerName={getCustomerName()}
          inquiryId={inquiryId}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          initialPaymentIntentId={
            paymentRedirectStatus?.paymentIntentId || undefined
          }
          initialPaymentState={
            paymentRedirectStatus?.success ? "success" : undefined
          }
        />
      )}

      {/* Planungspakete Details Dialog */}
      <Dialog
        isOpen={showPlanungspaketeDetails}
        onClose={() => setShowPlanungspaketeDetails(false)}
      >
        <PlanungspaketeCards
          isLightboxMode={true}
          enableBuiltInLightbox={false}
        />
      </Dialog>
    </section>
  );

  // Helper functions for payment
  function getPaymentAmount(): number {
    // Entwurf deposit: €1,500 (150000 cents) - Action price (50% discount from €3,000)
    // This matches the "Heute zu bezahlen" amount displayed in the checkout
    return 150000; // 1,500 EUR in cents
  }

  function getCustomerEmail(): string {
    // Get email from user data (appointment or grundstueck form)
    return getUserData.email || "";
  }

  function getCustomerName(): string {
    // Get name from user data (appointment or grundstueck form)
    const fullName =
      getUserData.name && getUserData.lastName
        ? `${getUserData.name} ${getUserData.lastName}`
        : getUserData.name || "";
    return fullName || "NEST-Haus Kunde";
  }

  // Capture configuration data from cart items - use existing breakdown from cart
  function getCartConfigurationData(): unknown {
    const configItem = items.find(
      (item): item is ConfigurationCartItem => "nest" in item
    );

    if (!configItem) {
      return null;
    }

    // Get appointment details
    const appointmentDetails = useCartStore.getState().appointmentDetails;
    const appointmentDateTime = appointmentDetails?.date
      ? `${appointmentDetails.date.toLocaleDateString("de-DE")} ${
          appointmentDetails.time
        }`
      : undefined;

    // Calculate delivery date (6 months from appointment)
    let liefertermin = undefined;
    if (appointmentDetails?.date) {
      const deliveryDate = new Date(appointmentDetails.date);
      deliveryDate.setMonth(deliveryDate.getMonth() + 6);
      liefertermin = deliveryDate.toLocaleDateString("de-DE");
    }

    // Pass through the configuration data from cart - prices are already calculated
    return {
      ...configItem,
      appointmentDateTime,
      liefertermin,
    };
  }

  // Create inquiry with cart configuration before payment
  async function createInquiryWithCart(): Promise<string | null> {
    try {
      const email = getCustomerEmail();
      const name = getCustomerName();
      const phone = getUserData.phone;
      const configurationData = getCartConfigurationData();

      const configItem = items.find(
        (item): item is ConfigurationCartItem => "nest" in item
      );
      const sessionId = configItem?.sessionId;

      const response = await fetch("/api/inquiries/create-with-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          phone,
          sessionId,
          configurationData,
        }),
      });

      const result = await response.json();

      if (response.ok && result.inquiryId) {
        console.log("✅ Created inquiry with cart data:", result.inquiryId);
        return result.inquiryId;
      } else {
        console.error("❌ Failed to create inquiry:", result.error);
        return null;
      }
    } catch (error) {
      console.error("❌ Error creating inquiry:", error);
      return null;
    }
  }

  function handlePaymentSuccess(paymentIntentId: string) {
    console.log("✅ Payment successful:", paymentIntentId);
    setPaymentError(null);
    setIsPaymentCompleted(true); // Mark payment as completed
    setSuccessfulPaymentIntentId(paymentIntentId); // Store the payment intent ID
    setPaymentCompletedDate(new Date()); // Store the payment completion date

    // DON'T close the modal yet - let the user see the success message
    // The PaymentModal will show the success screen
    // User can close it manually by clicking the close button

    // Send payment confirmation emails (backup to webhook)
    sendPaymentConfirmationEmails(paymentIntentId);

    // Track conversion (non-blocking)
    const sessionId = configItem?.sessionId || configuration?.sessionId;
    if (sessionId) {
      fetch("/api/sessions/track-conversion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          paymentIntentId,
          totalPrice: configItem?.totalPrice || configuration?.totalPrice || 0,
        }),
      }).catch((error) => {
        console.warn("⚠️ Conversion tracking failed:", error);
      });
    }

    // Trigger alpha test completion event for consistency
    window.dispatchEvent(new CustomEvent("alpha-test-purchase-completed"));

    // Note: onScrollToContact will be triggered when user closes the success modal
  }

  async function sendPaymentConfirmationEmails(paymentIntentId: string) {
    try {
      console.log("📧 Sending payment confirmation emails...");

      const response = await fetch("/api/payments/send-confirmation-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          customerEmail: getCustomerEmail(),
          customerName: getCustomerName(),
          configurationData: configItem || configuration,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.alreadySent) {
          console.log(
            "✅ Payment confirmation emails already sent (idempotent)"
          );
        } else {
          console.log("✅ Payment confirmation emails sent successfully");
        }
      } else {
        console.warn(
          "⚠️ Failed to send confirmation emails (webhook will handle)"
        );
      }
    } catch (error) {
      console.warn(
        "⚠️ Error sending confirmation emails (webhook will handle):",
        error
      );
    }
  }

  function handlePaymentError(error: string) {
    console.error("❌ Payment failed:", error);
    setPaymentError(error);
    // Modal stays open to show error state
  }
}
