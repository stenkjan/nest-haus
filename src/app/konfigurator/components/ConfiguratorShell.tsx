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
    initializeSession,
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

  // Dialog state
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [isGrundstueckCheckDialogOpen, setIsGrundstueckCheckDialogOpen] =
    useState(false);
  const [isPlanungspaketeDialogOpen, setIsPlanungspaketeDialogOpen] =
    useState(false);

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

  // Initialize session once on mount
  useEffect(() => {
    initializeSession();
    return () => finalizeSession();
  }, [initializeSession, finalizeSession]);

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

  // Optimized selection handlers using useCallback to prevent re-renders
  const handleSelection = useCallback(
    (categoryId: string, optionId: string) => {
      const category = configuratorData.find((cat) => cat.id === categoryId);
      const option = category?.options.find((opt) => opt.id === optionId);

      // For planungspaket, allow unselection by clicking the same option
      if (
        categoryId === "planungspaket" &&
        configuration?.planungspaket?.value === optionId
      ) {
        removeSelection("planungspaket");
        return;
      }

      if (option && category) {
        updateSelection({
          category: categoryId,
          value: optionId,
          name: option.name,
          price: option.price.amount || 0,
          description: option.description,
        });
      }
    },
    [updateSelection, removeSelection, configuration?.planungspaket?.value]
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

  // Define which categories can be unselected once selected
  const canUnselect = useCallback((categoryId: string): boolean => {
    // Only these categories can be unselected once selected
    // Both grundstueckscheck and planungspaket can be unselected but without visual X button
    const unselectableCategories = ["grundstueckscheck"];
    return unselectableCategories.includes(categoryId);
  }, []);

  // Handle unselection for categories that support it
  const handleUnselect = useCallback(
    (categoryId: string, _optionId: string) => {
      if (canUnselect(categoryId)) {
        removeSelection(categoryId);

        // Reset local state for special categories
        if (categoryId === "pvanlage") {
          setPvQuantity(0);
        } else if (categoryId === "fenster") {
          setFensterSquareMeters(0);
        }
      }
    },
    [canUnselect, removeSelection]
  );

  // Handle Grundstückscheck unselection (removed separate handler since visual button removed)

  const handleGrundstuecksCheckToggle = useCallback(() => {
    const newSelected = !isGrundstuecksCheckSelected;
    setIsGrundstuecksCheckSelected(newSelected);

    if (newSelected) {
      updateSelection({
        category: "grundstueckscheck",
        value: "grundstueckscheck",
        name: "Grundstücks-Check",
        price: GRUNDSTUECKSCHECK_PRICE,
        description:
          "Prüfung der rechtlichen und baulichen Voraussetzungen deines Grundstücks",
      });
    } else {
      // Remove selection when unchecked
      removeSelection("grundstueckscheck");
    }
  }, [isGrundstuecksCheckSelected, updateSelection, removeSelection]);

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

  const resetLocalState = useCallback(() => {
    setPvQuantity(0);
    setFensterSquareMeters(0);
    setIsGrundstuecksCheckSelected(false);
  }, []);

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
                  canUnselect={canUnselect(category.id)}
                  onUnselect={
                    canUnselect(category.id)
                      ? (optionId) => handleUnselect(category.id, optionId)
                      : undefined
                  }
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
            <QuantitySelector
              label="Anzahl der PV-Module"
              value={pvQuantity}
              max={getMaxPvModules()}
              unitPrice={configuration.pvanlage.price || 0}
              onChange={handlePvQuantityChange}
            />
          )}

          {/* Fenster Square Meters Selector */}
          {category.id === "fenster" && configuration?.fenster && (
            <QuantitySelector
              label="Anzahl der Fenster / Türen"
              value={fensterSquareMeters}
              max={getMaxFensterSquareMeters()}
              unitPrice={configuration.fenster.price || 0}
              unit="m²"
              onChange={handleFensterSquareMetersChange}
            />
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
          title="Mehr Informationen zum Grundstücks-Check"
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
