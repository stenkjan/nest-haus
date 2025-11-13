/**
 * ConfiguratorShell - Main Container Component
 *
 * Replaces the monolithic legacy Configurator.tsx with a clean,
 * modular architecture that separates concerns and integrates with Zustand store.
 *
 * @example
 * <ConfiguratorShell initialModel="nest80" />
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  useConfiguratorStore,
  type ConfigurationItem,
} from "@/store/configuratorStore";
import type { SelectionOption as SelectionOptionType } from "../types/configurator.types";
import { ImageManager } from "../core/ImageManager";
import { PriceCalculator } from "../core/PriceCalculator";
import { PriceUtils } from "../core/PriceUtils";
import { configuratorData } from "../data/configuratorData";
import { calculateSizeDependentPrice } from "@/constants/configurator";
import CategorySection from "./CategorySection";
import SelectionOption from "./SelectionOption";
import QuantitySelector from "./QuantitySelector";
import SummaryPanel from "./SummaryPanel";
import PreviewPanel from "./PreviewPanel";
import FactsBox from "./FactsBox";
import type { ConfiguratorProps } from "../types/configurator.types";
import { InfoBox, CartFooter } from "./index";
import ConfiguratorContentCardsLightbox from "./ConfiguratorContentCardsLightbox";
import ConfiguratorCheckbox from "./ConfiguratorCheckbox";
import { CalendarDialog } from "@/components/dialogs";

// Simple debounce implementation to avoid lodash dependency
function _debounce(
  func: (
    nestValue: string,
    configurationSelections: Record<string, unknown>
  ) => void,
  wait: number
) {
  let timeout: NodeJS.Timeout;
  return (
    nestValue: string,
    configurationSelections: Record<string, unknown>
  ) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(nestValue, configurationSelections), wait);
  };
}

export default function ConfiguratorShell({
  onPriceChange,
  rightPanelRef,
}: ConfiguratorProps & { rightPanelRef?: React.Ref<HTMLDivElement> }) {
  // Track pricing data loading state
  const [isPricingDataLoaded, setIsPricingDataLoaded] = useState(false);
  const [pricingDataError, setPricingDataError] = useState<string | null>(null);

  // Initialize pricing data from database on mount
  useEffect(() => {
    PriceCalculator.initializePricingData()
      .then(() => {
        setIsPricingDataLoaded(true);
        // Recalculate prices now that data is available
        const store = useConfiguratorStore.getState();
        store.calculatePrice();
      })
      .catch((error) => {
        console.error('❌ Failed to initialize pricing data:', error);
        setPricingDataError(error.message || 'Failed to load pricing data');
      });
  }, []);

  const {
    updateSelection,
    removeSelection,
    updateCheckboxOption,
    configuration,
    currentPrice,
    finalizeSession,
  } = useConfiguratorStore();

  // Local state for quantities and special selections
  const [pvQuantity, setPvQuantity] = useState<number>(0);
  const [geschossdeckeQuantity, setGeschossdeckeQuantity] = useState<number>(0);
  const [isPvOverlayVisible, setIsPvOverlayVisible] = useState<boolean>(true);
  const [isGeschossdeckeOverlayVisible, setIsGeschossdeckeOverlayVisible] =
    useState<boolean>(false);
  const [isBelichtungspaketOverlayVisible, setIsBelichtungspaketOverlayVisible] =
    useState<boolean>(false);
  // Hidden by default, only show when actively selecting fenster

  // Dialog state
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);

  // Auto-scroll utility function for both mobile and desktop - Currently unused
  const _scrollToSection = useCallback(
    (sectionId: string) => {
      // Small delay to ensure DOM has updated after selection
      setTimeout(() => {
        const targetElement = document.getElementById(sectionId);
        if (!targetElement) return;

        // Check if we're on mobile or desktop
        const isMobile = window.innerWidth < 1024;

        if (isMobile) {
          // Mobile: Use document/window scroll with offset for sticky header
          const headerHeight = 80; // Approximate navbar height
          const elementTop = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: elementTop,
            behavior: "smooth",
          });
        } else {
          // Desktop: Use right panel scroll
          const rightPanel = (rightPanelRef as React.RefObject<HTMLDivElement>)
            ?.current;
          if (rightPanel) {
            const elementTop = targetElement.offsetTop;
            const targetScrollTop = elementTop - 20; // Small offset for better visual

            rightPanel.scrollTo({
              top: targetScrollTop,
              behavior: "smooth",
            });
          }
        }
      }, 150); // 150ms delay for DOM updates
    },
    [rightPanelRef]
  );

  // Add scroll debugging
  useEffect(() => {
    // Track window scroll (for mobile)
    const handleWindowScroll = () => {
      const _scrollY =
        window.pageYOffset || document.documentElement.scrollTop || 0;
    };

    // Add window scroll listener
    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  // REMOVED: Complex price caching system that was causing display issues

  // PERFORMANCE BOOST: Intelligent image preloading when configuration changes
  useEffect(() => {
    // Only preload if we have a meaningful configuration
    if (!configuration?.nest) return;

    // Debounce preloading to avoid excessive API calls during rapid changes
    const preloadTimer = setTimeout(() => {
      // Use static import from top of file
      ImageManager.preloadImages(configuration);
    }, 300); // 300ms debounce

    return () => clearTimeout(preloadTimer);
  }, [configuration]); // Use full configuration object as dependency

  // Initialize session once on mount
  useEffect(() => {
    // REMOVED: Don't initialize here since KonfiguratorClient already does it
    // This was causing double initialization conflicts
    // initializeSession();
    return () => finalizeSession();
  }, [finalizeSession]);

  // Notify parent components of price changes
  useEffect(() => {
    onPriceChange?.(currentPrice);
  }, [currentPrice, onPriceChange]);

  // Reset local state function for CartFooter
  const resetLocalState = useCallback(() => {
    setPvQuantity(0);
    setGeschossdeckeQuantity(0);
    setIsPvOverlayVisible(false); // Hide PV overlay when resetting since quantity is 0
    setIsGeschossdeckeOverlayVisible(false);
  }, []);

  // Confirmation handlers for PV and Fenster sections - REMOVED

  // Optimized selection handlers using useCallback to prevent re-renders
  const handleSelection = useCallback(
    (categoryId: string, optionId: string) => {
      const category = configuratorData.find((cat) => cat.id === categoryId);
      const option = category?.options.find((opt) => opt.id === optionId);

      // Special handling for PV-Anlage selection
      if (categoryId === "pvanlage") {
        const currentSelection =
          configuration?.[categoryId as keyof typeof configuration];

        // If clicking the same option that's already selected
        if (
          currentSelection &&
          typeof currentSelection === "object" &&
          "value" in currentSelection &&
          currentSelection.value === optionId
        ) {
          // If quantity is > 0, unselect (set to 0)
          if (pvQuantity > 0) {
            setPvQuantity(0);
            setIsPvOverlayVisible(false); // Hide overlay when deselecting PV
            removeSelection(categoryId);
            return;
          }
        }

        // If clicking PV option when quantity is 0, set to 1 and show overlay immediately
        if (pvQuantity === 0) {
          setPvQuantity(1);
          // Show PV overlay without hiding other compatible overlays
          setIsPvOverlayVisible(true);

          // Update the selection immediately with quantity 1
          if (option && category) {
            updateSelection({
              category: categoryId,
              value: optionId,
              name: option.name,
              price: option.price.amount || 0,
              description: option.description,
              quantity: 1,
            });
          }
          return; // Exit early to avoid duplicate updateSelection call
        }
      }

      // Fenster & Türen selection - NO special view switching
      // User requested to remove fenster overlay/view completely

      // OVERLAY PERSISTENCE FIX: Only hide overlays when switching to truly incompatible categories
      // Keep overlays persistent across related selections

      // Hide PV overlay only when switching to truly incompatible categories
      // Allow PV overlay to persist with belichtungspaket, gebäudehülle, fenster, and nest changes
      if (
        categoryId !== "pvanlage" &&
        isPvOverlayVisible &&
        categoryId !== "nest" && // Allow nest changes to keep PV overlay
        categoryId !== "belichtungspaket" && // Allow belichtungspaket changes to keep PV overlay
        categoryId !== "gebaeudehuelle" && // Allow gebäudehülle changes to keep PV overlay
        categoryId !== "fenster" && // Allow fenster changes to keep PV overlay
        categoryId !== "planungspaket"
      ) {
        setIsPvOverlayVisible(false);
      }

      if (option && category) {
        updateSelection({
          category: categoryId,
          value: optionId,
          name: option.name,
          price: option.price.amount || 0,
          description: option.description,
          ...(categoryId === "geschossdecke" && { quantity: 1 }), // Add quantity for geschossdecke
        });

        // Keep Geschossdecke overlay visible when innenverkleidung or fussboden changes
        // The overlay will automatically update to show the new material combination
        // No action needed - overlay stays visible and updates via props

        // Handle overlay visibility based on selection - PRESERVE EXISTING OVERLAYS
        if (categoryId === "belichtungspaket") {
          // PRESERVE PV overlay - allow both to be visible simultaneously on exterior view
          // DO NOT hide PV overlay - they can coexist on exterior view
          
          // Show belichtungspaket overlay when selecting belichtungspaket
          setIsBelichtungspaketOverlayVisible(true);

          // Switch to exterior view to show the belichtungspaket overlay
          const { switchToView } = useConfiguratorStore.getState();
          if (switchToView) {
            switchToView("exterior");
          }
        } else if (categoryId === "fenster") {
          // DO NOT hide PV or brightness overlays - they show on different views
          // Hide belichtungspaket overlay when fenster is being selected
          setIsBelichtungspaketOverlayVisible(false);
        } else if (categoryId === "geschossdecke") {
          // Handle geschossdecke overlay and quantity - check if already selected
          const currentSelection =
            configuration?.[categoryId as keyof typeof configuration];

          if (
            currentSelection &&
            typeof currentSelection === "object" &&
            "value" in currentSelection &&
            currentSelection.value === optionId
          ) {
            // If clicking the same selected option, unselect it
            if (geschossdeckeQuantity > 0) {
              setGeschossdeckeQuantity(0);
              setIsGeschossdeckeOverlayVisible(false);
              removeSelection(categoryId);
              return; // Don't continue to updateSelection
            }
          } else {
            // New selection - set quantity to 1 and show overlay
            setGeschossdeckeQuantity(1);
            setIsGeschossdeckeOverlayVisible(true);
            
            // Hide belichtungspaket overlay when geschossdecke is selected
            setIsBelichtungspaketOverlayVisible(false);

            // Switch to interior view to show the same image as fussboden/innenverkleidung
            const { switchToView } = useConfiguratorStore.getState();
            if (switchToView) {
              switchToView("interior");
            }
          }
        } else if (categoryId === "nest" || categoryId === "gebaeudehuelle") {
          // Hide belichtungspaket overlay when changing core building selections
          setIsBelichtungspaketOverlayVisible(false);
        } else if (categoryId === "innenverkleidung" || categoryId === "fussboden") {
          // Hide belichtungspaket overlay when changing interior materials
          setIsBelichtungspaketOverlayVisible(false);
        }

        // Auto-scroll to next section after selection - Commented out
        /*
        if (categoryId === "nest") {
          // After selecting nest module, scroll to gebäudehülle
          scrollToSection("section-gebaeudehuelle");
        } else if (categoryId === "gebaeudehuelle") {
          // After selecting gebäudehülle, scroll to innenverkleidung
          scrollToSection("section-innenverkleidung");
        } else if (categoryId === "innenverkleidung") {
          // After selecting innenverkleidung, scroll to fussboden
          scrollToSection("section-fussboden");
        } else if (categoryId === "fussboden") {
          // After selecting fussboden, scroll to belichtungspaket
          scrollToSection("section-belichtungspaket");
        } else if (categoryId === "belichtungspaket") {
          // After selecting belichtungspaket, scroll to fenster
          scrollToSection("section-fenster");
        } else if (categoryId === "fenster") {
          // After selecting fenster, scroll to stirnseite
          scrollToSection("section-stirnseite");
        } else if (categoryId === "planungspaket") {
          // After selecting planungspaket, scroll to grundstückscheck
          scrollToSection("section-grundstueckscheck");
        }
        */
      }
    },
    [
      updateSelection,
      removeSelection,
      configuration,
      pvQuantity,
      geschossdeckeQuantity,
      setIsPvOverlayVisible,
      isPvOverlayVisible,
    ]
  );

  const handlePvQuantityChange = useCallback(
    (newQuantity: number) => {
      setPvQuantity(newQuantity);

      // Handle overlay visibility - PRESERVE OTHER OVERLAYS
      if (newQuantity > 0) {
        // Show PV overlay without affecting belichtungspaket or fenster overlays
        setIsPvOverlayVisible(true);
        // DO NOT hide brightness or fenster overlays - they can coexist
      } else {
        // Hide PV overlay when quantity is 0, but keep other overlays
        setIsPvOverlayVisible(false);
        // DO NOT hide brightness or fenster overlays
      }

      if (newQuantity === 0) {
        // Remove PV selection entirely when set to 0
        removeSelection("pvanlage");
      } else if (configuration?.pvanlage) {
        // Update the selection with new quantity
        updateSelection({
          category: configuration.pvanlage.category,
          value: configuration.pvanlage.value,
          name: configuration.pvanlage.name,
          price: configuration.pvanlage.price,
          description: configuration.pvanlage.description,
          quantity: newQuantity,
        });
      }
    },
    [configuration?.pvanlage, updateSelection, removeSelection]
  );

  // Grundstückscheck logic removed from configurator; now handled in Warenkorb

  const handleInfoClick = useCallback((infoKey: string) => {
    switch (infoKey) {
      case "beratung":
      case "nest": // "Noch Fragen offen?" box after module selection
        setIsCalendarDialogOpen(true);
        break;
      default:
        // Other info clicks are handled by individual ConfiguratorContentCardsLightbox components
        break;
    }
  }, []);

  // Checkbox handlers
  const handleKamindurchzugChange = useCallback(
    (isChecked: boolean) => {
      updateCheckboxOption("kamindurchzug", isChecked);
    },
    [updateCheckboxOption]
  );

  const handleFundamentChange = useCallback(
    (isChecked: boolean) => {
      updateCheckboxOption("fundament", isChecked);
    },
    [updateCheckboxOption]
  );

  const handleGeschossdeckeQuantityChange = useCallback(
    (newQuantity: number) => {
      setGeschossdeckeQuantity(newQuantity);

      // Handle overlay visibility
      if (newQuantity > 0) {
        setIsGeschossdeckeOverlayVisible(true);
      } else {
        setIsGeschossdeckeOverlayVisible(false);
      }

      if (newQuantity === 0) {
        // Remove Geschossdecke selection entirely when set to 0
        removeSelection("geschossdecke");
      } else if (configuration?.geschossdecke) {
        // Update the selection with new quantity
        updateSelection({
          category: configuration.geschossdecke.category,
          value: configuration.geschossdecke.value,
          name: configuration.geschossdecke.name,
          price: configuration.geschossdecke.price,
          description: configuration.geschossdecke.description,
          quantity: newQuantity,
        });
      }
    },
    [configuration?.geschossdecke, updateSelection, removeSelection]
  );

  // Fixed selection detection logic - more robust checking
  const isOptionSelected = useCallback(
    (categoryId: string, optionId: string): boolean => {
      if (!configuration) return false;

      const categoryConfig =
        configuration[categoryId as keyof typeof configuration];

      // Handle different types of category configurations
      if (typeof categoryConfig === "object" && categoryConfig !== null) {
        if ("value" in categoryConfig) {
          return categoryConfig.value === optionId;
        }
      }

      return false;
    },
    [configuration]
  );

  // Helper function to get number of modules based on nest size
  const _getModuleCount = useCallback((nestValue: string): number => {
    const moduleMapping: Record<string, number> = {
      nest80: 4, // 80m² = 4 modules
      nest100: 5, // 100m² = 5 modules
      nest120: 6, // 120m² = 6 modules
      nest140: 7, // 140m² = 7 modules
      nest160: 8, // 160m² = 8 modules
    };
    return moduleMapping[nestValue] || 4; // Default to 4 if unknown
  }, []);

  // Helper function to calculate maximum PV modules based on nest size
  const getMaxPvModules = useCallback((): number => {
    if (!configuration?.nest?.value) return 8; // Default to nest80
    return PriceCalculator.getMaxPvModules(configuration.nest.value);
  }, [configuration?.nest?.value]);

  // Helper function to calculate maximum Geschossdecken based on nest size
  const getMaxGeschossdecken = useCallback((): number => {
    if (!configuration?.nest?.value) return 3; // Default to nest80
    return PriceCalculator.getMaxGeschossdecke(configuration.nest.value);
  }, [configuration?.nest?.value]);

  // RELATIVE price display - show price differences relative to currently selected option
  // Get actual price contribution of a selected option for visual indicator
  const getActualContributionPrice = useCallback(
    (categoryId: string, optionId: string): number | null => {
      if (!configuration?.nest) return null;

      try {
        const pricingData = PriceCalculator.getPricingData();
        const currentNestValue = configuration.nest.value;
        const nestSize = currentNestValue as 'nest80' | 'nest100' | 'nest120' | 'nest140' | 'nest160';

        // For NEST: Return ONLY the base price (raw construction, no materials)
        if (categoryId === "nest" && pricingData) {
          const nestBasePrice = pricingData.nest[optionId as typeof nestSize]?.price || 0;
          return nestBasePrice; // ONLY base price, no materials!
        }

        // For belichtungspaket, calculate actual price
        if (categoryId === "belichtungspaket") {
          const selectionOption = {
            category: categoryId,
            value: optionId,
            name: "", // Not needed for calculation
            price: 0, // Not needed for calculation
          };
          return PriceCalculator.calculateBelichtungspaketPrice(
            selectionOption,
            configuration.nest,
            configuration.fenster || undefined
          );
        }

        // For INNENVERKLEIDUNG: Return ABSOLUTE price (ALL options have prices!)
        if (categoryId === "innenverkleidung" && pricingData) {
          return pricingData.innenverkleidung[optionId]?.[nestSize] || 0;
        }

        // For GEBÄUDEHÜLLE: Return ABSOLUTE price, then calculate relative in display
        if (categoryId === "gebaeudehuelle" && pricingData) {
          const optionPrice = pricingData.gebaeudehuelle[optionId]?.[nestSize] || 0;
          const trapezblechPrice = pricingData.gebaeudehuelle.trapezblech?.[nestSize] || 0;
          return optionPrice - trapezblechPrice; // Relative to trapezblech = 0
        }

        // For BODENBELAG: Return ABSOLUTE price, then calculate relative in display
        if (categoryId === "fussboden" && pricingData) {
          const optionPrice = pricingData.bodenbelag[optionId]?.[nestSize] || 0;
          const ohneBelagPrice = pricingData.bodenbelag.ohne_belag?.[nestSize] || 0;
          return optionPrice - ohneBelagPrice; // Relative to ohne_belag = 0
        }

        // For fenster, calculate area × price
        if (categoryId === "fenster") {
          const category = configuratorData.find(
            (cat) => cat.id === categoryId
          );
          const option = category?.options.find((opt) => opt.id === optionId);

          if (
            option?.price?.amount &&
            configuration.belichtungspaket &&
            configuration.nest
          ) {
            // Calculate total fenster area needed (belichtungspaket + stirnseite)
            let totalArea = 0;

            // Add belichtungspaket area
            const nestSizeMap: Record<string, number> = {
              nest80: 80,
              nest100: 100,
              nest120: 120,
              nest140: 140,
              nest160: 160,
            };
            const nestSize = nestSizeMap[configuration.nest.value] || 80;
            const percentageMap: Record<string, number> = {
              light: 0.15,
              medium: 0.22,
              bright: 0.28,
            };
            const percentage =
              percentageMap[configuration.belichtungspaket.value] || 0.12;
            totalArea += Math.ceil(nestSize * percentage);

            return totalArea * option.price.amount;
          }
        }

        // For PV, use cumulative price from pricing data table
        if (categoryId === "pvanlage" && configuration.pvanlage?.quantity && configuration.nest) {
          const pricingData = PriceCalculator.getPricingData();
          if (!pricingData) return 0;
          const nestSize = configuration.nest.value as 'nest80' | 'nest100' | 'nest120' | 'nest140' | 'nest160';
          return pricingData.pvanlage.pricesByQuantity[nestSize]?.[configuration.pvanlage.quantity] || 0;
        }

        // For bodenaufbau, calculate dynamic price
        if (categoryId === "bodenaufbau" && configuration?.nest) {
          if (optionId === "ohne_heizung") {
            return 0;
          }
          return calculateSizeDependentPrice(
            configuration.nest.value,
            optionId as
              | "elektrische_fussbodenheizung"
              | "wassergefuehrte_fussbodenheizung"
          );
        }

        // For geschossdecke, show fixed unit price (not multiplied by quantity)
        // The quantity selector will show the total
        if (categoryId === "geschossdecke" && configuration?.nest) {
          const pricingData = PriceCalculator.getPricingData();
          if (pricingData) {
            return pricingData.geschossdecke.basePrice; // Return unit price only
          }
          return 0;
        }

        // For fundament, calculate dynamic price
        if (categoryId === "fundament" && configuration?.nest) {
          return calculateSizeDependentPrice(
            configuration.nest.value,
            "fundament"
          );
        }

        // For bodenaufbau, calculate dynamic price
        if (categoryId === "bodenaufbau" && configuration?.nest) {
          if (optionId === "ohne_heizung") {
            return 0;
          }
          return calculateSizeDependentPrice(
            configuration.nest.value,
            optionId as
              | "elektrische_fussbodenheizung"
              | "wassergefuehrte_fussbodenheizung"
          );
        }

        // For geschossdecke, show fixed unit price (not multiplied by quantity)
        // The quantity selector will show the total
        if (categoryId === "geschossdecke" && configuration?.nest) {
          const pricingData = PriceCalculator.getPricingData();
          if (pricingData) {
            return pricingData.geschossdecke.basePrice; // Return unit price only
          }
          return 0;
        }

        // For fundament, calculate dynamic price
        if (categoryId === "fundament" && configuration?.nest) {
          return calculateSizeDependentPrice(
            configuration.nest.value,
            "fundament"
          );
        }

        // For other categories, use original price
        const category = configuratorData.find((cat) => cat.id === categoryId);
        const option = category?.options.find((opt) => opt.id === optionId);
        return option?.price?.amount || 0;
      } catch (error) {
        console.error(
          `Error calculating contribution price for ${categoryId}:${optionId}:`,
          error
        );
        return null;
      }
    },
    [configuration]
  );

  const getDisplayPrice = useCallback(
    (categoryId: string, optionId: string) => {
      const category = configuratorData.find((cat) => cat.id === categoryId);
      const option = category?.options.find((opt) => opt.id === optionId);

      if (!option) {
        return { type: "included" as const };
      }

      // DYNAMIC PRICING: Override static configuratorData prices with Google Sheets data
      const pricingData = PriceCalculator.getPricingData();
      const currentNestValue = (configuration?.nest?.value || 'nest80') as 'nest80' | 'nest100' | 'nest120' | 'nest140' | 'nest160';

      // For PV anlage, convert upgrade types to standard for initial display
      if (categoryId === "pvanlage") {
        const originalPrice = option.price;
        if (originalPrice.type === "upgrade") {
          return {
            type: "standard" as const,
            amount: originalPrice.amount,
            monthly: originalPrice.monthly,
          };
        }
        return originalPrice;
      }

      // For nest modules, show ONLY the base price (raw construction, no materials included)
      if (categoryId === "nest") {
        const currentSelection = configuration[
          categoryId as keyof typeof configuration
        ] as ConfigurationItem | undefined;

        // If this option is currently selected, show as selected
        if (currentSelection && currentSelection.value === optionId) {
          return { type: "selected" as const };
        }

        // DYNAMIC PRICING: Show ONLY the nest base price from Google Sheets
        // DO NOT add innenverkleidung or any other materials!
        // Nest base price = raw construction only (e.g., 188,619€ for Nest 80)
        if (pricingData) {
          const nestSize = optionId as 'nest80' | 'nest100' | 'nest120' | 'nest140' | 'nest160';
          const nestBasePrice = pricingData.nest[nestSize]?.price;
          if (nestBasePrice) {
            return {
              type: "base" as const,
              amount: nestBasePrice, // ONLY base price, no materials!
              monthly: PriceCalculator.calculateMonthlyPaymentAmount(nestBasePrice),
            };
          }
        }

        // Fallback to static pricing if dynamic data not loaded yet
        const originalPrice = option.price;
        if (originalPrice.type === "upgrade") {
          return {
            type: "standard" as const,
            amount: originalPrice.amount,
            monthly: originalPrice.monthly,
          };
        }
        return originalPrice;
      }

      // DYNAMIC PRICING OVERRIDES FOR ALL CATEGORIES
      // Override static configuratorData prices with Google Sheets pricing
      if (pricingData && categoryId === "innenverkleidung") {
        // Innenverkleidung: Show ABSOLUTE prices from sheet (fichte is NOT 0€!)
        const absolutePrice = pricingData.innenverkleidung[optionId]?.[currentNestValue];
        if (absolutePrice !== undefined) {
          const currentSelection = configuration?.innenverkleidung;
          
          if (currentSelection && currentSelection.value === optionId) {
            // Selected option - show in gray with actual price
            return { type: "selected" as const };
          }
          
          // Get the price of Fichte (standard/base option for relative comparison)
          const fichtePrice = pricingData.innenverkleidung.fichte?.[currentNestValue] || 0;
          
          if (!currentSelection) {
            // No selection yet - show relative to Fichte (the standard preselected option)
            if (optionId === 'fichte') {
              // Fichte itself - show actual price
              return {
                type: "base" as const,
                amount: absolutePrice,
              };
            } else {
              // Other options - show difference from Fichte
              const priceDiff = absolutePrice - fichtePrice;
              return {
                type: priceDiff > 0 ? "upgrade" as const : "discount" as const,
                amount: Math.abs(priceDiff),
              };
            }
          }
          
          // Other options - show relative to selected option
          const selectedPrice = pricingData.innenverkleidung[currentSelection.value]?.[currentNestValue] || 0;
          const priceDiff = absolutePrice - selectedPrice;
          
          if (priceDiff === 0) {
            return { type: "upgrade" as const, amount: 0 };
          }
          
          return {
            type: priceDiff > 0 ? "upgrade" as const : "discount" as const,
            amount: Math.abs(priceDiff),
          };
        }
      }

      if (pricingData && categoryId === "gebaeudehuelle") {
        // Gebäudehülle: Relative to trapezblech (base = 0)
        const optionPrice = pricingData.gebaeudehuelle[optionId]?.[currentNestValue] || 0;
        const trapezblechPrice = pricingData.gebaeudehuelle.trapezblech?.[currentNestValue] || 0;
        const relativePrice = optionPrice - trapezblechPrice;
        
        const currentSelection = configuration?.gebaeudehuelle;
        
        if (currentSelection && currentSelection.value === optionId) {
          return { type: "selected" as const };
        }
        
        if (relativePrice === 0) {
          return { type: "included" as const }; // trapezblech
        }
        
        if (!currentSelection) {
          return {
            type: "upgrade" as const,
            amount: relativePrice,
          };
        }
        
        // Show relative to currently selected option
        const selectedPrice = pricingData.gebaeudehuelle[currentSelection.value]?.[currentNestValue] || 0;
        const selectedRelative = selectedPrice - trapezblechPrice;
        const priceDiff = relativePrice - selectedRelative;
        
        if (priceDiff === 0) {
          return { type: "upgrade" as const, amount: 0 };
        }
        
        return {
          type: priceDiff > 0 ? "upgrade" as const : "discount" as const,
          amount: Math.abs(priceDiff),
        };
      }

      if (pricingData && categoryId === "fussboden") {
        // Bodenbelag: Relative to ohne_belag (base = 0)
        const optionPrice = pricingData.bodenbelag[optionId]?.[currentNestValue] || 0;
        const ohneBelagPrice = pricingData.bodenbelag.ohne_belag?.[currentNestValue] || 0;
        const relativePrice = optionPrice - ohneBelagPrice;
        
        const currentSelection = configuration?.fussboden;
        
        if (currentSelection && currentSelection.value === optionId) {
          return { type: "selected" as const };
        }
        
        if (relativePrice === 0) {
          return { type: "included" as const }; // ohne_belag / standard
        }
        
        if (!currentSelection) {
          return {
            type: "upgrade" as const,
            amount: relativePrice,
          };
        }
        
        // Show relative to currently selected option
        const selectedPrice = pricingData.bodenbelag[currentSelection.value]?.[currentNestValue] || 0;
        const selectedRelative = selectedPrice - ohneBelagPrice;
        const priceDiff = relativePrice - selectedRelative;
        
        if (priceDiff === 0) {
          return { type: "upgrade" as const, amount: 0 };
        }
        
        return {
          type: priceDiff > 0 ? "upgrade" as const : "discount" as const,
          amount: Math.abs(priceDiff),
        };
      }

      if (pricingData && categoryId === "planungspaket") {
        // Planungspakete: Fixed prices (basis=0, plus=9600, pro=12700)
        const currentSelection = configuration?.planungspaket;
        
        if (currentSelection && currentSelection.value === optionId) {
          return { type: "selected" as const };
        }
        
        let dynamicPrice = 0;
        if (optionId === "plus") {
          dynamicPrice = pricingData.planungspaket.plus[currentNestValue];
        } else if (optionId === "pro") {
          dynamicPrice = pricingData.planungspaket.pro[currentNestValue];
        }
        
        if (dynamicPrice === 0) {
          return { type: "included" as const }; // basis
        }
        
        if (!currentSelection) {
          return {
            type: "base" as const,
            amount: dynamicPrice,
          };
        }
        
        // Show relative to currently selected
        let selectedPrice = 0;
        if (currentSelection.value === "plus") {
          selectedPrice = pricingData.planungspaket.plus[currentNestValue];
        } else if (currentSelection.value === "pro") {
          selectedPrice = pricingData.planungspaket.pro[currentNestValue];
        }
        
        const priceDiff = dynamicPrice - selectedPrice;
        
        if (priceDiff === 0) {
          return { type: "upgrade" as const, amount: 0 };
        }
        
        return {
          type: priceDiff > 0 ? "upgrade" as const : "discount" as const,
          amount: Math.abs(priceDiff),
        };
      }

      // For relative pricing sections (gebäudehülle, innenverkleidung, fussboden, belichtungspaket, fenster, planungspaket, bodenaufbau, geschossdecke)
      if (
        [
          "gebaeudehuelle",
          "innenverkleidung",
          "fussboden",
          "belichtungspaket",
          "fenster",
          "planungspaket",
          "bodenaufbau",
          "geschossdecke",
        ].includes(categoryId)
      ) {
        // Get currently selected option in this category
        const currentSelection = configuration[
          categoryId as keyof typeof configuration
        ] as ConfigurationItem | undefined;

        // Special handling for planungspaket - always calculate relative pricing
        if (categoryId === "planungspaket") {
          if (currentSelection) {
            const currentPrice = currentSelection.price || 0;
            const optionPrice = option.price.amount || 0;
            const priceDifference = optionPrice - currentPrice;

            if (priceDifference === 0) {
              return { type: "selected" as const };
            } else if (priceDifference > 0) {
              return {
                type: "upgrade" as const,
                amount: priceDifference,
                monthly: option.price.monthly,
              };
            } else {
              return {
                type: "discount" as const,
                amount: Math.abs(priceDifference),
                monthly: option.price.monthly,
              };
            }
          } else {
            // No planungspaket selected yet - show full prices
            return {
              type: "upgrade" as const,
              amount: option.price.amount || 0,
              monthly: option.price.monthly,
            };
          }
        }

        // Special handling for bodenaufbau - calculate relative pricing like planungspaket
        if (categoryId === "bodenaufbau") {
          if (currentSelection) {
            if (currentSelection.value === optionId) {
              // Show actual price for selected option in gray
              if (optionId === "ohne_heizung") {
                return { type: "selected" as const };
              }
              const actualPrice = calculateSizeDependentPrice(
                configuration.nest?.value || "nest80",
                optionId as
                  | "elektrische_fussbodenheizung"
                  | "wassergefuehrte_fussbodenheizung"
              );
              return {
                type: "standard" as const,
                amount: actualPrice,
                monthly: Math.round(actualPrice / 240),
              };
            } else {
              // Show relative price for other options
              const currentPrice =
                currentSelection.value === "ohne_heizung"
                  ? 0
                  : calculateSizeDependentPrice(
                      configuration.nest?.value || "nest80",
                      currentSelection.value as
                        | "elektrische_fussbodenheizung"
                        | "wassergefuehrte_fussbodenheizung"
                    );
              const optionPrice =
                optionId === "ohne_heizung"
                  ? 0
                  : calculateSizeDependentPrice(
                      configuration.nest?.value || "nest80",
                      optionId as
                        | "elektrische_fussbodenheizung"
                        | "wassergefuehrte_fussbodenheizung"
                    );
              const priceDifference = optionPrice - currentPrice;

              if (priceDifference === 0) {
                return { type: "selected" as const };
              } else if (priceDifference > 0) {
                return {
                  type: "upgrade" as const,
                  amount: priceDifference,
                  monthly: option.price.monthly,
                };
              } else {
                return {
                  type: "discount" as const,
                  amount: Math.abs(priceDifference),
                  monthly: option.price.monthly,
                };
              }
            }
          } else {
            // No bodenaufbau selected yet - show full prices
            if (optionId === "ohne_heizung") {
              return { type: "included" as const };
            }
            const actualPrice = calculateSizeDependentPrice(
              configuration.nest?.value || "nest80",
              optionId as
                | "elektrische_fussbodenheizung"
                | "wassergefuehrte_fussbodenheizung"
            );
            return {
              type: "upgrade" as const,
              amount: actualPrice,
              monthly: Math.round(actualPrice / 240),
            };
          }
        }

        // Special handling for geschossdecke - show fixed unit price
        if (categoryId === "geschossdecke") {
          const pricingData = PriceCalculator.getPricingData();
          const unitPrice = pricingData?.geschossdecke?.basePrice || 4115;
          
          if (currentSelection && currentSelection.value === optionId) {
            // Show fixed unit price for selected geschossdecke in gray
            return {
              type: "standard" as const,
              amount: unitPrice,
              monthly: Math.round(unitPrice / 240),
            };
          } else {
            // Show fixed unit price for geschossdecke
            return {
              type: "upgrade" as const,
              amount: unitPrice,
              monthly: Math.round(unitPrice / 240),
            };
          }
        }

        // If this option is currently selected, show per m² price for fenster, actual price for parkett, no price for others
        if (currentSelection && currentSelection.value === optionId) {
          if (categoryId === "fenster") {
            // Show per m² price for selected fenster option (depends on belichtungspaket and nest size)
            if (configuration?.nest && configuration?.belichtungspaket) {
              const geschossdeckeQty = configuration.geschossdecke?.quantity || 0;
              const pricePerSqm = PriceCalculator.getFensterPricePerSqm(
                optionId,
                configuration.nest.value,
                configuration.belichtungspaket.value,
                geschossdeckeQty
              );
              return {
                type: "standard" as const,
                amount: pricePerSqm,
                monthly: Math.round(pricePerSqm / 240),
              };
            }
            // Fallback to static price
            return {
              type: "standard" as const,
              amount: option.price.amount || 0,
              monthly: option.price.monthly,
            };
          }
          if (categoryId === "fussboden" && optionId === "parkett") {
            // Show actual price for selected parkett eiche
            const currentNestValue = configuration.nest?.value || "nest80";
            const basePrice = PriceCalculator.calculateCombinationPrice(
              currentNestValue,
              "trapezblech",
              "fichte",
              "ohne_belag"
            );
            const parkettPrice = PriceCalculator.calculateCombinationPrice(
              currentNestValue,
              "trapezblech",
              "fichte",
              "parkett"
            );
            const actualPrice = parkettPrice - basePrice;
            return {
              type: "standard" as const,
              amount: actualPrice,
              monthly: Math.round(actualPrice / 240),
            };
          }
          return { type: "selected" as const };
        }

        // If no option is selected yet, calculate actual price based on current nest module
        if (!currentSelection) {
          const originalPrice = option.price;

          // Special pricing for belichtungspaket - calculate based on nest size and fenster material
          if (categoryId === "belichtungspaket" && configuration?.nest) {
            const mockBelichtungspaket = {
              category: "belichtungspaket",
              value: optionId,
              name: option.name,
              price: option.price.amount || 0,
              description: option.description || "",
            };

            const calculatedPrice =
              PriceCalculator.calculateBelichtungspaketPrice(
                mockBelichtungspaket,
                configuration.nest,
                configuration.fenster || undefined
              );

            return {
              type: "upgrade" as const,
              amount: calculatedPrice,
              monthly: Math.round(calculatedPrice / 240), // 20-year financing
            };
          }

          // For nest-dependent categories, calculate modular price based on current nest size
          if (
            configuration?.nest &&
            ["gebaeudehuelle", "innenverkleidung", "fussboden"].includes(
              categoryId
            )
          ) {
            // Calculate the actual price for this option with current nest module
            const currentNestValue = configuration.nest.value;

            // Always use defaults for base calculation - prices should only depend on nest size, not other selections
            let testGebaeudehuelle = "trapezblech"; // Always use default
            let testInnenverkleidung = "fichte"; // fichte is standard default // Always use default
            let testFussboden = "ohne_belag"; // Always use default (changed from parkett)

            if (categoryId === "gebaeudehuelle") testGebaeudehuelle = optionId;
            if (categoryId === "innenverkleidung")
              testInnenverkleidung = optionId;
            if (categoryId === "fussboden") testFussboden = optionId;

            // Calculate combination price with this option
            const combinationPrice = PriceCalculator.calculateCombinationPrice(
              currentNestValue,
              testGebaeudehuelle,
              testInnenverkleidung,
              testFussboden
            );

            // Calculate base combination price (all defaults)
            const basePrice = PriceCalculator.calculateCombinationPrice(
              currentNestValue,
              "trapezblech",
              "fichte",
              "ohne_belag"
            );

            // Get the individual option price (difference from base)
            const optionPrice = combinationPrice - basePrice;

            if (optionPrice < 0) {
              // Negative prices should show as "inklusive"
              return { type: "included" as const };
            } else if (optionPrice === 0) {
              // Zero price should show as "inklusive"
              return { type: "included" as const };
            } else {
              // Positive price should show as standard price
              return {
                type: "standard" as const,
                amount: optionPrice,
                monthly: originalPrice.monthly,
              };
            }
          }

          // For nest-dependent categories when NO nest is selected, calculate as if smallest nest (nest80) is selected
          if (
            ["gebaeudehuelle", "innenverkleidung", "fussboden"].includes(
              categoryId
            )
          ) {
            // Use nest80 as base reference for pricing when nothing is selected
            let testGebaeudehuelle = "trapezblech";
            let testInnenverkleidung = "fichte"; // fichte is standard default
            let testFussboden = "parkett";

            if (categoryId === "gebaeudehuelle") testGebaeudehuelle = optionId;
            if (categoryId === "innenverkleidung")
              testInnenverkleidung = optionId;
            if (categoryId === "fussboden") testFussboden = optionId;

            // Calculate combination price with this option for nest80
            const combinationPrice = PriceCalculator.calculateCombinationPrice(
              "nest80",
              testGebaeudehuelle,
              testInnenverkleidung,
              testFussboden
            );

            // Calculate base combination price (all defaults) for nest80
            const basePrice = PriceCalculator.calculateCombinationPrice(
              "nest80",
              "trapezblech",
              "fichte",
              "parkett"
            );

            // Get the individual option price (difference from base)
            const optionPrice = combinationPrice - basePrice;

            if (optionPrice < 0) {
              return { type: "included" as const };
            } else if (optionPrice === 0) {
              return { type: "included" as const };
            } else {
              return {
                type: "standard" as const,
                amount: optionPrice,
                monthly: originalPrice.monthly,
              };
            }
          }

          // For other categories or when no nest selected, use original logic
          if (
            originalPrice.type === "discount" &&
            originalPrice.amount !== undefined &&
            originalPrice.amount < 0
          ) {
            // Negative discount amounts should show as "inklusive"
            return { type: "included" as const };
          } else if (originalPrice.type === "upgrade") {
            // Upgrade types should show as standard prices (no + sign)
            return {
              type: "standard" as const,
              amount: originalPrice.amount,
              monthly: originalPrice.monthly,
            };
          } else {
            // Keep other types as is (included, standard, base)
            return originalPrice;
          }
        }

        // For nest-dependent categories with current selection, use modular pricing calculation
        if (
          currentSelection &&
          configuration?.nest &&
          ["gebaeudehuelle", "innenverkleidung", "fussboden"].includes(
            categoryId
          )
        ) {
          const currentNestValue = configuration.nest.value;

          // Use defaults for base calculation, only change the current category for relative pricing
          const baseGebaeudehuelle = "trapezblech";
          const baseInnenverkleidung = "fichte"; // fichte is standard default
          const baseFussboden = "parkett";

          // Get the current selection for THIS category only
          const currentCategorySelection = configuration?.[
            categoryId as keyof typeof configuration
          ] as ConfigurationItem | undefined;

          // Calculate current total with defaults + current category selection
          let currentGebaeudehuelle = baseGebaeudehuelle;
          let currentInnenverkleidung = baseInnenverkleidung;
          let currentFussboden = baseFussboden;

          if (categoryId === "gebaeudehuelle" && currentCategorySelection) {
            currentGebaeudehuelle = currentCategorySelection.value;
          } else if (
            categoryId === "innenverkleidung" &&
            currentCategorySelection
          ) {
            currentInnenverkleidung = currentCategorySelection.value;
          } else if (categoryId === "fussboden" && currentCategorySelection) {
            currentFussboden = currentCategorySelection.value;
          }

          const currentTotal = PriceCalculator.calculateCombinationPrice(
            currentNestValue,
            currentGebaeudehuelle,
            currentInnenverkleidung,
            currentFussboden
          );

          // Calculate total if we switched to this option (only change the relevant category)
          let testGebaeudehuelle = baseGebaeudehuelle;
          let testInnenverkleidung = baseInnenverkleidung;
          let testFussboden = baseFussboden;

          if (categoryId === "gebaeudehuelle") testGebaeudehuelle = optionId;
          if (categoryId === "innenverkleidung")
            testInnenverkleidung = optionId;
          if (categoryId === "fussboden") testFussboden = optionId;

          const newTotal = PriceCalculator.calculateCombinationPrice(
            currentNestValue,
            testGebaeudehuelle,
            testInnenverkleidung,
            testFussboden
          );

          const priceDifference = newTotal - currentTotal;

          // Special handling for "Inklusive" options with negative prices
          const currentOptionPrice = currentSelection.price || 0;
          const targetOptionPrice = option.price.amount || 0;

          if (currentOptionPrice < 0) {
            // Current selection is "Inklusive" - show absolute price of target option
            // Calculate what the total would be with this target option
            let testGebaeudehuelle = baseGebaeudehuelle;
            let testInnenverkleidung = baseInnenverkleidung;
            let testFussboden = baseFussboden;

            if (categoryId === "gebaeudehuelle") testGebaeudehuelle = optionId;
            if (categoryId === "innenverkleidung")
              testInnenverkleidung = optionId;
            if (categoryId === "fussboden") testFussboden = optionId;

            const targetTotal = PriceCalculator.calculateCombinationPrice(
              currentNestValue,
              testGebaeudehuelle,
              testInnenverkleidung,
              testFussboden
            );

            const defaultTotal = PriceCalculator.calculateCombinationPrice(
              currentNestValue,
              baseGebaeudehuelle,
              baseInnenverkleidung,
              baseFussboden
            );

            const absolutePrice = targetTotal - defaultTotal;

            if (absolutePrice === 0) {
              return { type: "included" as const };
            } else if (absolutePrice > 0) {
              return {
                type: "upgrade" as const,
                amount: absolutePrice,
                monthly: option.price.monthly,
              };
            } else {
              return {
                type: "discount" as const,
                amount: Math.abs(absolutePrice),
                monthly: option.price.monthly,
              };
            }
          } else if (targetOptionPrice < 0) {
            // Target option is "Inklusive" - show negative of current selection's absolute price
            // Calculate how much the current selection costs compared to the baseline
            const defaultTotal = PriceCalculator.calculateCombinationPrice(
              currentNestValue,
              baseGebaeudehuelle,
              baseInnenverkleidung,
              baseFussboden
            );

            const discountAmount = currentTotal - defaultTotal;

            return {
              type: "discount" as const,
              amount: discountAmount,
              monthly: option.price.monthly,
            };
          } else {
            // Normal relative pricing
            if (priceDifference === 0) {
              return {
                type: "upgrade" as const,
                amount: 0,
                monthly: option.price.monthly,
              };
            } else if (priceDifference > 0) {
              return {
                type: "upgrade" as const,
                amount: priceDifference,
                monthly: option.price.monthly,
              };
            } else {
              return {
                type: "discount" as const,
                amount: Math.abs(priceDifference),
                monthly: option.price.monthly,
              };
            }
          }
        }

        // For fenster with current selection, calculate relative price/m² based on belichtungspaket and nest size
        if (currentSelection && categoryId === "fenster" && configuration?.nest && configuration?.belichtungspaket) {
          const geschossdeckeQty = configuration.geschossdecke?.quantity || 0;
          const currentPricePerSqm = PriceCalculator.getFensterPricePerSqm(
            currentSelection.value,
            configuration.nest.value,
            configuration.belichtungspaket.value,
            geschossdeckeQty
          );
          
          const optionPricePerSqm = PriceCalculator.getFensterPricePerSqm(
            optionId,
            configuration.nest.value,
            configuration.belichtungspaket.value,
            geschossdeckeQty
          );
          
          const priceDifference = optionPricePerSqm - currentPricePerSqm;
          
          if (priceDifference === 0) {
            return { type: "selected" as const };
          } else if (priceDifference > 0) {
            return {
              type: "upgrade" as const,
              amount: priceDifference,
              monthly: Math.round(priceDifference / 240),
            };
          } else {
            return {
              type: "discount" as const,
              amount: Math.abs(priceDifference),
              monthly: Math.round(Math.abs(priceDifference) / 240),
            };
          }
        }

        // For belichtungspaket with current selection, calculate relative pricing
        if (currentSelection && categoryId === "belichtungspaket") {
          // Calculate current total with currently selected option
          const currentPrice = PriceCalculator.calculateBelichtungspaketPrice(
            currentSelection as SelectionOptionType,
            configuration.nest as SelectionOptionType,
            configuration.fenster as SelectionOptionType | undefined
          );

          // Calculate price with this option
          const mockOption = {
            category: "belichtungspaket",
            value: optionId,
            name: option.name,
            price: option.price.amount || 0,
            description: option.description || "",
          };
          const optionPrice = PriceCalculator.calculateBelichtungspaketPrice(
            mockOption as SelectionOptionType,
            configuration.nest as SelectionOptionType,
            configuration.fenster as SelectionOptionType | undefined
          );

          const priceDifference = optionPrice - currentPrice;

          if (priceDifference === 0) {
            return {
              type: "upgrade" as const,
              amount: 0,
              monthly: option.price.monthly,
            };
          } else if (priceDifference > 0) {
            return {
              type: "upgrade" as const,
              amount: priceDifference,
              monthly: option.price.monthly,
            };
          } else {
            return {
              type: "discount" as const,
              amount: Math.abs(priceDifference),
              monthly: option.price.monthly,
            };
          }
        }

        // Calculate relative price difference using simpler direct price comparison for other categories
        if (
          currentSelection &&
          option.price.amount !== undefined &&
          currentSelection.price !== undefined &&
          !["gebaeudehuelle", "innenverkleidung", "fussboden"].includes(
            categoryId
          )
        ) {
          // For sections with direct price amounts, use simple difference calculation
          const currentPrice = currentSelection.price || 0;
          const optionPrice = option.price.amount || 0;
          const priceDifference = optionPrice - currentPrice;

          if (priceDifference === 0) {
            return {
              type: "upgrade" as const,
              amount: 0,
              monthly: option.price.monthly,
            };
          } else if (priceDifference > 0) {
            return {
              type: "upgrade" as const,
              amount: priceDifference,
              monthly: option.price.monthly,
            };
          } else {
            return {
              type: "discount" as const,
              amount: Math.abs(priceDifference),
              monthly: option.price.monthly,
            };
          }
        }

        // Fallback to total price calculation for complex cases
        // Build current configuration
        const currentConfig = {
          nest: configuration.nest || undefined,
          gebaeudehuelle: configuration.gebaeudehuelle || undefined,
          innenverkleidung: configuration.innenverkleidung || undefined,
          fussboden: configuration.fussboden || undefined,
          belichtungspaket: configuration.belichtungspaket || undefined,
          fenster: configuration.fenster || undefined,
          planungspaket: configuration.planungspaket || undefined,
          pvanlage: configuration.pvanlage || undefined,
        };

        // Build configuration with this option
        const newConfig = {
          ...currentConfig,
          [categoryId]: {
            category: categoryId,
            value: optionId,
            name: option.name,
            price: option.price.amount || 0,
          },
        };

        // Calculate total prices
        const currentTotal = PriceCalculator.calculateTotalPrice(currentConfig);
        const newTotal = PriceCalculator.calculateTotalPrice(newConfig);

        // Calculate the difference
        const priceDifference = newTotal - currentTotal;

        // Return the appropriate price type
        if (priceDifference === 0) {
          return {
            type: "upgrade" as const,
            amount: 0,
            monthly: option.price.monthly,
          };
        } else if (priceDifference > 0) {
          return {
            type: "upgrade" as const,
            amount: priceDifference,
            monthly: option.price.monthly,
          };
        } else {
          return {
            type: "discount" as const,
            amount: Math.abs(priceDifference),
            monthly: option.price.monthly,
          };
        }
      }

      // For all other categories, return original price
      return option.price;
    },
    [configuration]
  );

  // Adjust PV quantity when nest size changes and exceeds new maximum
  useEffect(() => {
    const maxPv = getMaxPvModules();
    if (pvQuantity > maxPv) {
      setPvQuantity(maxPv);
      // Update the configuration with the new capped quantity
      if (configuration?.pvanlage) {
        updateSelection({
          category: configuration.pvanlage.category,
          value: configuration.pvanlage.value,
          name: configuration.pvanlage.name,
          price: configuration.pvanlage.price,
          description: configuration.pvanlage.description,
          quantity: maxPv,
        });
      }
    }
  }, [getMaxPvModules, pvQuantity, configuration?.pvanlage, updateSelection]);

  // Adjust geschossdecke quantity when nest size changes and exceeds new maximum
  useEffect(() => {
    const maxGeschossdecke = getMaxGeschossdecken();
    if (geschossdeckeQuantity > maxGeschossdecke) {
      setGeschossdeckeQuantity(maxGeschossdecke);
      // Update the configuration with the new capped quantity
      if (configuration?.geschossdecke) {
        updateSelection({
          category: configuration.geschossdecke.category,
          value: configuration.geschossdecke.value,
          name: configuration.geschossdecke.name,
          price: configuration.geschossdecke.price,
          description: configuration.geschossdecke.description,
          quantity: maxGeschossdecke,
        });
      }
    }
  }, [getMaxGeschossdecken, geschossdeckeQuantity, configuration?.geschossdecke, updateSelection]);

  // Sync local PV quantity with store on mount/configuration change
  useEffect(() => {
    if (configuration?.pvanlage?.quantity !== undefined) {
      const storeQuantity = configuration.pvanlage.quantity;
      if (storeQuantity !== pvQuantity) {
        setPvQuantity(storeQuantity);
        // Also sync overlay visibility
        if (storeQuantity > 0) {
          setIsPvOverlayVisible(true);
        }
      }
    }
  }, [configuration?.pvanlage?.quantity, pvQuantity]);

  // Sync local Geschossdecke quantity with store on mount/configuration change
  useEffect(() => {
    if (configuration?.geschossdecke?.quantity !== undefined) {
      const storeQuantity = configuration.geschossdecke.quantity;
      if (storeQuantity !== geschossdeckeQuantity) {
        setGeschossdeckeQuantity(storeQuantity);
        // Also sync overlay visibility
        if (storeQuantity > 0) {
          setIsGeschossdeckeOverlayVisible(true);
        }
      }
    }
  }, [configuration?.geschossdecke?.quantity, geschossdeckeQuantity]);

  // Reset local quantities when selections are removed
  useEffect(() => {
    if (!configuration?.pvanlage && pvQuantity > 0) {
      setPvQuantity(0);
      setIsPvOverlayVisible(false); // Hide overlay when PV selection is removed from store
    }
  }, [configuration?.pvanlage, pvQuantity]);

  // Reset local geschossdecke quantities when selections are removed
  useEffect(() => {
    if (!configuration?.geschossdecke && geschossdeckeQuantity > 0) {
      setGeschossdeckeQuantity(0);
      setIsGeschossdeckeOverlayVisible(false); // Hide overlay when Geschossdecke selection is removed from store
    }
  }, [configuration?.geschossdecke, geschossdeckeQuantity]);

  // Render selection content
  const SelectionContent = () => (
    <div className="p-[clamp(0.875rem,2.75vw,1.75rem)] space-y-[clamp(2.75rem,5vh,3.75rem)]">
      {/* Ohne Nest fortfahren button - at the top */}
      <div className="flex flex-col items-center mt-3 lg:mt-0 mb-4 gap-2">
        <button
          onClick={() => {
            window.location.href = "/warenkorb?mode=entwurf";
          }}
          className="w-full max-w-[280px] bg-white text-[#3D6CE1] border-2 border-[#3D6CE1] rounded-full font-medium text-[clamp(0.875rem,1.2vw,1rem)] px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.5rem,1vw,0.75rem)] transition-all hover:bg-[#3D6CE1] hover:text-white min-h-[48px] flex items-center justify-center touch-manipulation cursor-pointer shadow-sm hover:shadow-md"
        >
          Ohne Nest fortfahren
        </button>
        <p className="text-gray-600 text-[clamp(0.75rem,1vw,0.875rem)]">
          *Nur den Entwurf bestellen
        </p>
      </div>

      {configuratorData.map((category, _index) => (
        <React.Fragment key={category.id}>
          {/* Add Optionen section before planungspaket */}
          {category.id === "planungspaket" && (
            <CategorySection
              id="section-optionen"
              title="Optionen"
              subtitle="Zusätzliche Ausstattung"
            >
              <div className="space-y-4">
                {/* Kamindurchzug Checkbox */}
                <ConfiguratorCheckbox
                  id="kamindurchzug-checkbox"
                  uncheckedText="Kaminschachtvorbereitung"
                  checkedText="Kaminschachtvorbereitung"
                  price={(() => {
                    const pricingData = PriceCalculator.getPricingData();
                    return pricingData?.optionen?.kaminschacht || 887;
                  })()}
                  isChecked={!!configuration?.kamindurchzug}
                  onChange={handleKamindurchzugChange}
                />

                {/* Fundament Checkbox */}
                <ConfiguratorCheckbox
                  id="fundament-checkbox"
                  uncheckedText="Fundament"
                  checkedText="Fundament"
                  price={(() => {
                    if (configuration?.nest?.value) {
                      const pricingData = PriceCalculator.getPricingData();
                      if (pricingData) {
                        const nestSize = configuration.nest.value as 'nest80' | 'nest100' | 'nest120' | 'nest140' | 'nest160';
                        return pricingData.optionen.fundament[nestSize] || 15480;
                      }
                    }
                    return 15480; // nest80 default
                  })()}
                  pricePerSqm={
                    configuration?.nest?.value
                      ? (() => {
                          const pricingData = PriceCalculator.getPricingData();
                          if (pricingData) {
                            const nestSize = configuration.nest.value as 'nest80' | 'nest100' | 'nest120' | 'nest140' | 'nest160';
                            const fundamentPrice = pricingData.optionen.fundament[nestSize] || 15480;
                            const nestSquareMeters = parseInt(configuration.nest.value.replace("nest", "")) || 80;
                            return fundamentPrice / nestSquareMeters;
                          }
                          return 193.5; // 15480 / 80
                        })()
                      : 193.5
                  }
                  isChecked={!!configuration?.fundament}
                  onChange={handleFundamentChange}
                />
                
                {/* Fundament description text */}
                <p className="text-sm text-gray-600 leading-relaxed mt-4 px-1">
                  Das Fundament bildet die stabile Basis für dein Nest-Haus. Es wird individuell auf dein Grundstück und die Bodenbeschaffenheit angepasst und sorgt für einen sicheren Stand über viele Jahre.
                </p>

                {/* Lightbox button for Optionen */}
                {/* <ConfiguratorContentCardsLightbox
                  categoryKey="fussboden"
                  triggerText="Mehr Informationen zu den Optionen"
                /> */}
              </div>
            </CategorySection>
          )}

          <CategorySection
            id={`section-${category.id}`} // Add ID for auto-scroll targeting
            title={category.title}
            subtitle={category.subtitle}
          >
            {(() => {
              // No more disabled states - always allow selections with defaults

              return (
                <>
                  <div className="space-y-2">
                    {category.options.map((option) => {
                      // Use static price from configuratorData for consistent display
                      const displayPrice = getDisplayPrice(
                        category.id,
                        option.id
                      );

                      // Get actual contribution price for selected options
                      const contributionPrice = isOptionSelected(
                        category.id,
                        option.id
                      )
                        ? getActualContributionPrice(category.id, option.id)
                        : null;

                      // For geschossdecke, use fixed unit price from pricing data
                      let dynamicDescription = option.description;
                      if (category.id === "geschossdecke") {
                        const pricingData = PriceCalculator.getPricingData();
                        if (pricingData) {
                          const unitPrice = pricingData.geschossdecke.basePrice;
                          const formattedPrice = PriceUtils.formatPrice(unitPrice);
                          dynamicDescription = `Zusätzliche Geschossdecke\n${formattedPrice} pro Einheit`;
                        }
                      }

                      return (
                        <SelectionOption
                          key={option.id}
                          id={option.id}
                          name={option.name}
                          description={dynamicDescription}
                          price={displayPrice}
                          isSelected={isOptionSelected(category.id, option.id)}
                          categoryId={category.id}
                          nestModel={configuration?.nest?.value}
                          contributionPrice={contributionPrice}
                          geschossdeckeQuantity={configuration?.geschossdecke?.quantity || 0}
                          onClick={(optionId) => {
                            // Always allow selections with defaults in place
                            handleSelection(category.id, optionId);
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* PV Quantity Selector */}
                  {category.id === "pvanlage" && configuration?.pvanlage && (
                    <>
                      <QuantitySelector
                        label="Anzahl der PV-Module"
                        value={pvQuantity}
                        max={getMaxPvModules()}
                        unitPrice={0} // Not used for PV, use cumulativePrice instead
                        cumulativePrice={(() => {
                          const pricingData = PriceCalculator.getPricingData();
                          if (!pricingData || !configuration.nest) return 0;
                          const nestSize = configuration.nest.value as 'nest80' | 'nest100' | 'nest120' | 'nest140' | 'nest160';
                          return pricingData.pvanlage.pricesByQuantity[nestSize]?.[pvQuantity] || 0;
                        })()}
                        onChange={handlePvQuantityChange}
                      />
                    </>
                  )}

                  {/* Geschossdecke Quantity Selector */}
                  {category.id === "geschossdecke" &&
                    (configuration?.geschossdecke || geschossdeckeQuantity > 0) && (
                      <>
                        <QuantitySelector
                          label="Anzahl der Geschossdecken"
                          value={geschossdeckeQuantity}
                          max={getMaxGeschossdecken()}
                          unitPrice={(() => {
                            const pricingData = PriceCalculator.getPricingData();
                            return pricingData?.geschossdecke?.basePrice || 4115;
                          })()}
                          onChange={handleGeschossdeckeQuantityChange}
                        />
                      </>
                    )}

                  {/* Noch Fragen offen? InfoBox - Only for nest category */}
                  {category.id === "nest" && (
                    <InfoBox
                      title="Noch Fragen offen?"
                      description="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch."
                      onClick={() => setIsCalendarDialogOpen(true)}
                    />
                  )}

                  {/* Info Box - Use new responsive cards for specific categories */}
                  {category.infoBox && (
                    <>
                      {/* Use ConfiguratorContentCardsLightbox for responsive card categories */}
                      {category.id === "gebaeudehuelle" ||
                      category.id === "innenverkleidung" ||
                      category.id === "fussboden" ||
                      category.id === "belichtungspaket" ||
                      category.id === "fenster" ||
                      category.id === "pvanlage" ? (
                        <ConfiguratorContentCardsLightbox
                          categoryKey={
                            category.id === "gebaeudehuelle"
                              ? "materials"
                              : category.id === "pvanlage"
                                ? "photovoltaik"
                                : category.id === "fussboden"
                                  ? "fussboden"
                                  : category.id === "belichtungspaket"
                                    ? "belichtungspaket"
                                    : (category.id as
                                        | "innenverkleidung"
                                        | "fenster")
                          }
                          triggerText={category.infoBox.title}
                        />
                      ) : (
                        /* Use regular InfoBox for other categories */
                        <InfoBox
                          title={category.infoBox.title}
                          description={category.infoBox.description}
                          onClick={() => handleInfoClick(category.id)}
                        />
                      )}
                    </>
                  )}

                  {/* Add lightbox button for planungspaket
                  {category.id === "planungspaket" && (
                    <ConfiguratorContentCardsLightbox
                      categoryKey="materials"
                      triggerText="Mehr Informationen"
                    />
                  )} */}

                  {/* Facts Box */}
                  {category.facts && (
                    <FactsBox
                      title={category.facts.title}
                      facts={category.facts.content}
                      links={category.facts.links}
                    />
                  )}
                </>
              );
            })()}
          </CategorySection>
        </React.Fragment>
      ))}

      {/* Grundstückscheck now handled in Warenkorb */}

      {/* Summary Panel */}
      <SummaryPanel onInfoClick={handleInfoClick} onReset={resetLocalState} />
    </div>
  );

  // Consistent viewport height calculation for both panels - 5vh higher as requested
  const panelHeight =
    "calc(100vh - var(--navbar-height, 3.5rem) - var(--footer-height, 2.5rem) + 5vh)";
  const panelPaddingTop = "var(--navbar-height, 3.5rem)";

  // Show loading state while pricing data is being fetched
  if (!isPricingDataLoaded && !pricingDataError) {
    return (
      <div className="configurator-shell w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Preisdaten werden geladen...</p>
        </div>
      </div>
    );
  }

  // Show error state if pricing data failed to load
  if (pricingDataError) {
    return (
      <div className="configurator-shell w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Fehler beim Laden der Preisdaten</h2>
          <p className="text-gray-600 mb-4">{pricingDataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="configurator-shell w-full h-full bg-white">
      {/* Mobile Layout (< 1024px) - Document-level scrolling for proper WebKit behavior */}
      <div className="lg:hidden min-h-screen bg-white">
        {/* Sticky Image Header - sticks to top during scroll */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <PreviewPanel
            isMobile={true}
            isPvOverlayVisible={isPvOverlayVisible}
            isGeschossdeckeOverlayVisible={isGeschossdeckeOverlayVisible}
            isBelichtungspaketOverlayVisible={isBelichtungspaketOverlayVisible}
          />
        </div>

        {/* Scrollable Content - flows underneath sticky image */}
        <div
          ref={rightPanelRef}
          className="relative bg-white"
          style={{
            // Ensure proper touch scrolling on WebKit
            WebkitOverflowScrolling: "touch",
            // Add padding to account for potential floating elements
            paddingBottom: "calc(var(--footer-height, 2.5rem) + 1rem)",
          }}
        >
          <SelectionContent />
        </div>
      </div>

      {/* Desktop Layout (≥ 1024px) - Synchronized panels */}
      <div className="hidden lg:flex">
        {/* Left: Preview Panel (70%) - Matches right panel positioning */}
        <div
          className="flex-[7] relative"
          style={{
            height: panelHeight,
            paddingTop: panelPaddingTop,
          }}
        >
          <PreviewPanel
            isMobile={false}
            isPvOverlayVisible={isPvOverlayVisible}
            isGeschossdeckeOverlayVisible={isGeschossdeckeOverlayVisible}
            isBelichtungspaketOverlayVisible={isBelichtungspaketOverlayVisible}
          />
        </div>

        {/* Right: Selection Panel (30%) - Matches left panel positioning */}
        <div
          ref={rightPanelRef}
          className="configurator-right-panel flex-[3] bg-white overflow-y-auto"
          style={{
            height: panelHeight,
            paddingTop: panelPaddingTop,
          }}
        >
          <SelectionContent />
        </div>
      </div>

      {/* Cart Footer - Fixed position on mobile for better UX */}
      <div className="lg:relative lg:static">
        <CartFooter onReset={resetLocalState} />
      </div>

      {/* Dialog Components */}
      <CalendarDialog
        isOpen={isCalendarDialogOpen}
        onClose={() => setIsCalendarDialogOpen(false)}
      />
    </div>
  );
}
