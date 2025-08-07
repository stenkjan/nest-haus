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

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { PriceCalculator } from "../core/PriceCalculator";
import { configuratorData } from "../data/configuratorData";
import CategorySection from "./CategorySection";
import SelectionOption from "./SelectionOption";
import QuantitySelector from "./QuantitySelector";
import SummaryPanel from "./SummaryPanel";
import PreviewPanel from "./PreviewPanel";
import FactsBox from "./FactsBox";
import type { ConfiguratorProps } from "../types/configurator.types";
import { InfoBox, GrundstuecksCheckBox, CartFooter } from "./index";
import ConfiguratorContentCardsLightbox from "./ConfiguratorContentCardsLightbox";
import {
  CalendarDialog,
  GrundstueckCheckDialog,
  PlanungspaketeDialog,
} from "@/components/dialogs";
import { GRUNDSTUECKSCHECK_PRICE } from "@/constants/configurator";

// Simple debounce implementation to avoid lodash dependency
function debounce(
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
  const {
    updateSelection,
    removeSelection,
    configuration,
    currentPrice,
    finalizeSession,
  } = useConfiguratorStore();

  // Local state for quantities and special selections
  const [pvQuantity, setPvQuantity] = useState<number>(0);
  const [fensterSquareMeters, setFensterSquareMeters] = useState<number>(0);
  const [isGrundstuecksCheckSelected, setIsGrundstuecksCheckSelected] =
    useState(false);

  // State for confirmation buttons on PV and Fenster sections
  const [showPvConfirmation, setShowPvConfirmation] = useState<boolean>(false);
  const [showFensterConfirmation, setShowFensterConfirmation] =
    useState<boolean>(false);

  // Dialog state
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [isGrundstueckCheckDialogOpen, setIsGrundstueckCheckDialogOpen] =
    useState(false);
  const [isPlanungspaketeDialogOpen, setIsPlanungspaketeDialogOpen] =
    useState(false);

  // Auto-scroll utility function for both mobile and desktop
  const scrollToSection = useCallback(
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
    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  // PERFORMANCE FIX: Pre-calculate all option prices when nest changes (bulk calculation)
  // This prevents individual calculations during render for every option
  const [optionPricesCache, setOptionPricesCache] = useState<
    Map<
      string,
      {
        type: "base" | "upgrade" | "included";
        amount?: number;
        monthly?: number;
      }
    >
  >(new Map());

  // Bulk price calculation function
  const calculateOptionPrices = useCallback(
    (nestValue: string, configurationSelections: Record<string, unknown>) => {
      if (!nestValue) return;

      const newCache = new Map();
      const coreCategories = [
        "gebaeudehuelle",
        "innenverkleidung",
        "fussboden",
      ];

      // Pre-calculate prices for all core options that depend on nest size
      configuratorData.forEach((category) => {
        if (coreCategories.includes(category.id)) {
          category.options.forEach((option) => {
            try {
              const price = PriceCalculator.getOptionDisplayPrice(
                nestValue,
                configurationSelections,
                category.id,
                option.id
              );
              newCache.set(`${category.id}:${option.id}`, price);
            } catch {
              // Fallback for any calculation errors
              newCache.set(`${category.id}:${option.id}`, {
                type: "included" as const,
              });
            }
          });
        } else {
          // For non-core categories, use static prices from configuratorData
          category.options.forEach((option) => {
            newCache.set(
              `${category.id}:${option.id}`,
              option.price || { type: "included" as const }
            );
          });
        }
      });

      setOptionPricesCache(newCache);
    },
    [setOptionPricesCache]
  );

  // Debounced version for performance - using useMemo to avoid dependency issues
  const bulkCalculateOptionPrices = useMemo(
    () => debounce(calculateOptionPrices, 150), // 150ms debounce to prevent rapid recalculations
    [calculateOptionPrices]
  );

  // Trigger bulk calculation when nest or core selections change
  useEffect(() => {
    if (!configuration?.nest) return;

    const configurationSelections = {
      nest: configuration.nest
        ? {
            category: configuration.nest.category,
            value: configuration.nest.value,
            name: configuration.nest.name,
            price: configuration.nest.price || 0,
          }
        : undefined,
      gebaeudehuelle: configuration.gebaeudehuelle
        ? {
            category: configuration.gebaeudehuelle.category,
            value: configuration.gebaeudehuelle.value,
            name: configuration.gebaeudehuelle.name,
            price: configuration.gebaeudehuelle.price || 0,
          }
        : undefined,
      innenverkleidung: configuration.innenverkleidung
        ? {
            category: configuration.innenverkleidung.category,
            value: configuration.innenverkleidung.value,
            name: configuration.innenverkleidung.name,
            price: configuration.innenverkleidung.price || 0,
          }
        : undefined,
      fussboden: configuration.fussboden
        ? {
            category: configuration.fussboden.category,
            value: configuration.fussboden.value,
            name: configuration.fussboden.name,
            price: configuration.fussboden.price || 0,
          }
        : undefined,
    };

    bulkCalculateOptionPrices(
      configuration.nest.value,
      configurationSelections
    );
  }, [
    configuration?.nest,
    configuration?.gebaeudehuelle,
    configuration?.innenverkleidung,
    configuration?.fussboden,
    bulkCalculateOptionPrices,
  ]);

  // PERFORMANCE BOOST: Intelligent image preloading when configuration changes
  useEffect(() => {
    // Only preload if we have a meaningful configuration
    if (!configuration?.nest) return;

    // Debounce preloading to avoid excessive API calls during rapid changes
    const preloadTimer = setTimeout(() => {
      // Import ImageManager dynamically to avoid circular dependencies
      import("../core/ImageManager").then(({ ImageManager }) => {
        ImageManager.preloadImages(configuration);
      });
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

  // Synchronize local Grundstückscheck state with store configuration
  useEffect(() => {
    const hasGrundstuecksCheck = !!configuration?.grundstueckscheck;
    if (hasGrundstuecksCheck !== isGrundstuecksCheckSelected) {
      setIsGrundstuecksCheckSelected(hasGrundstuecksCheck);
    }
  }, [configuration?.grundstueckscheck, isGrundstuecksCheckSelected]);

  // Reset local state function for CartFooter
  const resetLocalState = useCallback(() => {
    console.log("🔄 ConfiguratorShell: Resetting local state");
    setPvQuantity(0);
    setFensterSquareMeters(0);
    setIsGrundstuecksCheckSelected(false);
    setShowPvConfirmation(false);
    setShowFensterConfirmation(false);
  }, []);

  // Confirmation handlers for PV and Fenster sections
  const handlePvConfirmation = useCallback(() => {
    setShowPvConfirmation(false);
    // After confirming PV selection, scroll to grundstückscheck
    scrollToSection("section-grundstueckscheck");
  }, [scrollToSection]);

  const handleFensterConfirmation = useCallback(() => {
    setShowFensterConfirmation(false);
    // After confirming Fenster selection, scroll to pvanlage
    scrollToSection("section-pvanlage");
  }, [scrollToSection]);

  // Optimized selection handlers using useCallback to prevent re-renders
  const handleSelection = useCallback(
    (categoryId: string, optionId: string) => {
      const category = configuratorData.find((cat) => cat.id === categoryId);
      const option = category?.options.find((opt) => opt.id === optionId);

      // Allow unselection by clicking the same option for these categories
      const toggleableCategories = [
        "planungspaket",
        "nest",
        "gebaeudehuelle",
        "innenverkleidung",
        "fussboden",
      ];

      if (toggleableCategories.includes(categoryId)) {
        const currentSelection =
          configuration?.[categoryId as keyof typeof configuration];
        if (
          currentSelection &&
          typeof currentSelection === "object" &&
          "value" in currentSelection &&
          currentSelection.value === optionId
        ) {
          removeSelection(categoryId);

          // Cascading unselection: If nest module is being unselected,
          // also unselect dependent options that rely on nest module
          if (categoryId === "nest") {
            // Remove dependent selections since they depend on nest module for context/pricing
            const dependentCategories = [
              "gebaeudehuelle",
              "innenverkleidung",
              "fussboden",
            ];
            dependentCategories.forEach((depCategory) => {
              if (configuration?.[depCategory as keyof typeof configuration]) {
                removeSelection(depCategory);
              }
            });
          }

          return;
        }
      }

      if (option && category) {
        updateSelection({
          category: categoryId,
          value: optionId,
          name: option.name,
          price: option.price.amount || 0,
          description: option.description,
        });

        // Auto-scroll to next section after selection
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
          // After selecting fussboden, scroll to fenster
          scrollToSection("section-fenster");
        } else if (categoryId === "planungspaket") {
          // After selecting planungspaket, scroll to grundstückscheck
          scrollToSection("section-grundstueckscheck");
        }
      }
    },
    [updateSelection, removeSelection, configuration, scrollToSection]
  );

  const handlePvSelection = useCallback(
    (categoryId: string, optionId: string) => {
      const category = configuratorData.find((cat) => cat.id === categoryId);
      const option = category?.options.find((opt) => opt.id === optionId);

      if (option && category) {
        setPvQuantity(1);
        updateSelection({
          category: categoryId,
          value: optionId,
          name: option.name,
          price: option.price.amount || 0,
          description: option.description,
          quantity: 1,
        });
        // Show confirmation button for PV selection
        setShowPvConfirmation(true);
      }
    },
    [updateSelection]
  );

  const handlePvQuantityChange = useCallback(
    (newQuantity: number) => {
      setPvQuantity(newQuantity);

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

  const handleFensterSelection = useCallback(
    (categoryId: string, optionId: string) => {
      const category = configuratorData.find((cat) => cat.id === categoryId);
      const option = category?.options.find((opt) => opt.id === optionId);

      if (option && category) {
        setFensterSquareMeters(1);
        updateSelection({
          category: categoryId,
          value: optionId,
          name: option.name,
          price: option.price.amount || 0,
          description: option.description,
          squareMeters: 1,
        });
        // Show confirmation button for Fenster selection
        setShowFensterConfirmation(true);
      }
    },
    [updateSelection]
  );

  const handleFensterSquareMetersChange = useCallback(
    (newSquareMeters: number) => {
      setFensterSquareMeters(newSquareMeters);

      if (newSquareMeters === 0) {
        // Remove fenster selection entirely when set to 0
        removeSelection("fenster");
      } else if (configuration?.fenster) {
        // Update the selection with new square meters
        updateSelection({
          category: configuration.fenster.category,
          value: configuration.fenster.value,
          name: configuration.fenster.name,
          price: configuration.fenster.price,
          description: configuration.fenster.description,
          squareMeters: newSquareMeters,
        });
      }
    },
    [configuration?.fenster, updateSelection, removeSelection]
  );

  // Handle Grundstückscheck unselection (removed separate handler since visual button removed)

  const handleGrundstuecksCheckToggle = useCallback(() => {
    const newSelected = !isGrundstuecksCheckSelected;
    setIsGrundstuecksCheckSelected(newSelected);

    if (newSelected) {
      updateSelection({
        category: "grundstueckscheck",
        value: "grundstueckscheck",
        name: "Grundstückscheck",
        price: GRUNDSTUECKSCHECK_PRICE,
        description:
          "Prüfung der rechtlichen und baulichen Voraussetzungen deines Grundstücks",
      });
      // After selecting grundstückscheck, scroll to summary panel
      setTimeout(() => {
        const summaryElement = document.querySelector(
          ".summary-panel"
        ) as HTMLElement;
        if (summaryElement) {
          // Check if we're on mobile or desktop
          const isMobile = window.innerWidth < 1024;

          if (isMobile) {
            // Mobile: Use window scroll
            const elementTop =
              summaryElement.getBoundingClientRect().top + window.pageYOffset;
            const headerHeight = 80;
            window.scrollTo({
              top: elementTop - headerHeight,
              behavior: "smooth",
            });
          } else {
            // Desktop: Use right panel scroll
            const rightPanel = (
              rightPanelRef as React.RefObject<HTMLDivElement>
            )?.current;
            if (rightPanel) {
              const elementTop = summaryElement.offsetTop;
              const targetScrollTop = elementTop - 20;
              rightPanel.scrollTo({
                top: targetScrollTop,
                behavior: "smooth",
              });
            }
          }
        }
      }, 150);
    } else {
      // Remove selection when unchecked
      removeSelection("grundstueckscheck");
    }
  }, [
    isGrundstuecksCheckSelected,
    updateSelection,
    removeSelection,
    rightPanelRef,
  ]);

  const handleInfoClick = useCallback((infoKey: string) => {
    console.log("🚀 Info click:", infoKey);

    switch (infoKey) {
      case "beratung":
      case "nest": // "Noch Fragen offen?" box after module selection
        setIsCalendarDialogOpen(true);
        break;
      case "grundcheck":
        setIsGrundstueckCheckDialogOpen(true);
        break;
      case "planungspaket":
        setIsPlanungspaketeDialogOpen(true);
        break;
      default:
        // Other info clicks are handled by individual ConfiguratorContentCardsLightbox components
        break;
    }
  }, []);

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
  const getModuleCount = useCallback((nestValue: string): number => {
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
    if (!configuration?.nest?.value) return 8; // Default for nest80
    const moduleCount = getModuleCount(configuration.nest.value);
    // Each module can have 2 PV panels (one on each side of the roof)
    return moduleCount * 2;
  }, [configuration?.nest?.value, getModuleCount]);

  /**
   * Calculate maximum Fenster square meters based on nest size
   *
   * Formula: 30 + (x * 4) where x = number of additional modules beyond base Nest 80
   *
   * Examples:
   * - Nest 80 (0 modules): 30 + (0 * 4) = 30m²
   * - Nest 100 (1 module): 30 + (1 * 4) = 34m²
   * - Nest 120 (2 modules): 30 + (2 * 4) = 38m²
   * - Nest 140 (3 modules): 30 + (3 * 4) = 42m²
   * - Nest 160 (4 modules): 30 + (4 * 4) = 46m²
   *
   * This formula ensures that larger nest sizes allow proportionally more window area
   * while maintaining reasonable architectural constraints.
   *
   * Updated: 2025-01-31 - Changed from 52 + (x * 12) to 30 + (x * 4) formula
   */
  const getMaxFensterSquareMeters = useCallback((): number => {
    if (!configuration?.nest?.value) return 30; // Default for nest80 (base formula: 30 + 0*4)
    const moduleCount = getModuleCount(configuration.nest.value);
    // Formula: 30 + (number_of_modules * 4)
    return 30 + moduleCount * 4;
  }, [configuration?.nest?.value, getModuleCount]);

  // PERFORMANCE FIX: Simple cache lookup instead of calculation during render
  const getDisplayPrice = useCallback(
    (categoryId: string, optionId: string) => {
      const cacheKey = `${categoryId}:${optionId}`;
      const cachedPrice = optionPricesCache.get(cacheKey);

      if (cachedPrice) {
        return cachedPrice;
      }

      // Fallback to static price from configuratorData (no expensive calculation)
      const category = configuratorData.find((cat) => cat.id === categoryId);
      const option = category?.options.find((opt) => opt.id === optionId);
      return option?.price || { type: "included" as const };
    },
    [optionPricesCache]
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

  // Adjust Fenster quantity when nest size changes and exceeds new maximum
  useEffect(() => {
    const maxFenster = getMaxFensterSquareMeters();
    if (fensterSquareMeters > maxFenster) {
      setFensterSquareMeters(maxFenster);
      // Update the configuration with the new capped quantity
      if (configuration?.fenster) {
        updateSelection({
          category: configuration.fenster.category,
          value: configuration.fenster.value,
          name: configuration.fenster.name,
          price: configuration.fenster.price,
          description: configuration.fenster.description,
          squareMeters: maxFenster,
        });
      }
    }
  }, [
    getMaxFensterSquareMeters,
    fensterSquareMeters,
    configuration?.fenster,
    updateSelection,
  ]);

  // Reset local quantities when selections are removed
  useEffect(() => {
    if (!configuration?.pvanlage && pvQuantity > 0) {
      setPvQuantity(0);
    }
  }, [configuration?.pvanlage, pvQuantity]);

  useEffect(() => {
    if (!configuration?.fenster && fensterSquareMeters > 0) {
      setFensterSquareMeters(0);
    }
  }, [configuration?.fenster, fensterSquareMeters]);

  // Render selection content
  const SelectionContent = () => (
    <div className="p-[clamp(1rem,3vw,2rem)] space-y-[clamp(1rem,2vh,1.5rem)]">
      {configuratorData.map((category) => (
        <CategorySection
          key={category.id}
          id={`section-${category.id}`} // Add ID for auto-scroll targeting
          title={category.title}
          subtitle={category.subtitle}
        >
          <div className="space-y-2">
            {category.options.map((option) => {
              // Use static price from configuratorData for consistent display
              const displayPrice = getDisplayPrice(category.id, option.id);

              return (
                <SelectionOption
                  key={option.id}
                  id={option.id}
                  name={option.name}
                  description={option.description}
                  price={displayPrice}
                  isSelected={isOptionSelected(category.id, option.id)}
                  categoryId={category.id}
                  nestModel={configuration?.nest?.value}
                  onClick={(optionId) => {
                    if (category.id === "pvanlage") {
                      handlePvSelection(category.id, optionId);
                    } else if (category.id === "fenster") {
                      handleFensterSelection(category.id, optionId);
                    } else {
                      handleSelection(category.id, optionId);
                    }
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
                unitPrice={configuration.pvanlage.price || 0}
                onChange={handlePvQuantityChange}
              />
              {/* PV Confirmation Button */}
              {showPvConfirmation && (
                <div className="mt-4 flex justify-end px-[clamp(1rem,2vw,1.5rem)]">
                  <button
                    onClick={handlePvConfirmation}
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium min-w-[80px] min-h-[44px] touch-manipulation"
                  >
                    Okay
                  </button>
                </div>
              )}
            </>
          )}

          {/* Fenster Square Meters Selector */}
          {category.id === "fenster" && configuration?.fenster && (
            <>
              <QuantitySelector
                label="Anzahl der Fenster / Türen"
                value={fensterSquareMeters}
                max={getMaxFensterSquareMeters()}
                unitPrice={configuration.fenster.price || 0}
                unit="m²"
                onChange={handleFensterSquareMetersChange}
              />
              {/* Fenster Confirmation Button */}
              {showFensterConfirmation && (
                <div className="mt-4 flex justify-end px-[clamp(1rem,2vw,1.5rem)]">
                  <button
                    onClick={handleFensterConfirmation}
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium min-w-[80px] min-h-[44px] touch-manipulation"
                  >
                    Okay
                  </button>
                </div>
              )}
            </>
          )}

          {/* Info Box - Use new responsive cards for specific categories */}
          {category.infoBox && (
            <>
              {/* Use ConfiguratorContentCardsLightbox for responsive card categories */}
              {category.id === "gebaeudehuelle" ||
              category.id === "innenverkleidung" ||
              category.id === "fenster" ||
              category.id === "pvanlage" ? (
                <ConfiguratorContentCardsLightbox
                  categoryKey={
                    category.id === "gebaeudehuelle"
                      ? "materials"
                      : category.id === "pvanlage"
                        ? "photovoltaik"
                        : (category.id as "innenverkleidung" | "fenster")
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

          {/* Facts Box */}
          {category.facts && (
            <FactsBox
              title={category.facts.title}
              facts={category.facts.content}
              links={category.facts.links}
            />
          )}
        </CategorySection>
      ))}

      {/* Grundstücks-Check Section */}
      <CategorySection
        id="section-grundstueckscheck"
        title="Grundstückscheck"
        subtitle={
          <span className="text-[clamp(0.5rem,0.9vw,0.75rem)] text-gray-400">
            Optional
          </span>
        }
      >
        <GrundstuecksCheckBox
          isSelected={isGrundstuecksCheckSelected}
          onClick={handleGrundstuecksCheckToggle}
        />
        <InfoBox
          title="Mehr Informationen zum Grundstückscheck"
          onClick={() => handleInfoClick("grundcheck")}
        />
      </CategorySection>

      {/* Summary Panel */}
      <SummaryPanel onInfoClick={handleInfoClick} />
    </div>
  );

  // Consistent viewport height calculation for both panels - 5vh higher as requested
  const panelHeight =
    "calc(100vh - var(--navbar-height, 3.5rem) - var(--footer-height, 2.5rem) + 5vh)";
  const panelPaddingTop = "var(--navbar-height, 3.5rem)";

  return (
    <div className="configurator-shell w-full h-full bg-white">
      {/* Mobile Layout (< 1024px) - Document-level scrolling for proper WebKit behavior */}
      <div className="lg:hidden min-h-screen bg-white">
        {/* Sticky Image Header - sticks to top during scroll */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <PreviewPanel isMobile={true} />
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
          <PreviewPanel isMobile={false} />
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

      <GrundstueckCheckDialog
        isOpen={isGrundstueckCheckDialogOpen}
        onClose={() => setIsGrundstueckCheckDialogOpen(false)}
      />

      <PlanungspaketeDialog
        isOpen={isPlanungspaketeDialogOpen}
        onClose={() => setIsPlanungspaketeDialogOpen(false)}
      />
    </div>
  );
}
