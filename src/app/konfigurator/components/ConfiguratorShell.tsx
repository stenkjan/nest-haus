/**
 * ConfiguratorShell - Main Container Component
 * 
 * Replaces the monolithic legacy Configurator.tsx with a clean,
 * modular architecture that separates concerns and integrates with Zustand store.
 * 
 * @example
 * <ConfiguratorShell initialModel="nest80" />
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { configuratorData } from '../data/configuratorData';
import type { ConfiguratorProps } from '../types/configurator.types';
import {
  CategorySection,
  SelectionOption,
  InfoBox,
  FactsBox,
  PreviewPanel,
  QuantitySelector,
  SummaryPanel,
  GrundstuecksCheckBox,
  CartFooter
} from './';
import { GRUNDSTUECKSCHECK_PRICE } from '@/constants/configurator';

export default function ConfiguratorShell({
  onPriceChange,
  rightPanelRef
}: ConfiguratorProps & { rightPanelRef?: React.Ref<HTMLDivElement> }) {
  const {
    initializeSession,
    updateSelection,
    removeSelection,
    configuration,
    currentPrice,
    finalizeSession
  } = useConfiguratorStore();

  // Local state for quantities and special selections
  const [pvQuantity, setPvQuantity] = useState<number>(0);
  const [fensterSquareMeters, setFensterSquareMeters] = useState<number>(0);
  const [isGrundstuecksCheckSelected, setIsGrundstuecksCheckSelected] = useState(false);

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
  const handleSelection = useCallback((categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);

    // For planungspaket, allow unselection by clicking the same option
    if (categoryId === 'planungspaket' && configuration?.planungspaket?.value === optionId) {
      removeSelection('planungspaket');
      return;
    }

    if (option && category) {
      updateSelection({
        category: categoryId,
        value: optionId,
        name: option.name,
        price: option.price.amount || 0,
        description: option.description
      });
    }
  }, [updateSelection, removeSelection, configuration?.planungspaket?.value]);

  const handlePvSelection = useCallback((categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);

    if (option && category) {
      setPvQuantity(1);
      updateSelection({
        category: categoryId,
        value: optionId,
        name: option.name,
        price: option.price.amount || 0,
        description: option.description,
        quantity: 1
      });
    }
  }, [updateSelection]);

  const handlePvQuantityChange = useCallback((newQuantity: number) => {
    setPvQuantity(newQuantity);
    
    if (newQuantity === 0) {
      // Remove PV selection entirely when set to 0
      removeSelection('pvanlage');
    } else if (configuration?.pvanlage) {
      // Update the selection with new quantity
      updateSelection({
        category: configuration.pvanlage.category,
        value: configuration.pvanlage.value,
        name: configuration.pvanlage.name,
        price: configuration.pvanlage.price,
        description: configuration.pvanlage.description,
        quantity: newQuantity
      });
    }
  }, [configuration?.pvanlage, updateSelection, removeSelection]);

  const handleFensterSelection = useCallback((categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);

    if (option && category) {
      setFensterSquareMeters(1);
      updateSelection({
        category: categoryId,
        value: optionId,
        name: option.name,
        price: option.price.amount || 0,
        description: option.description,
        squareMeters: 1
      });
    }
  }, [updateSelection]);

  const handleFensterSquareMetersChange = useCallback((newSquareMeters: number) => {
    setFensterSquareMeters(newSquareMeters);
    
    if (newSquareMeters === 0) {
      // Remove fenster selection entirely when set to 0
      removeSelection('fenster');
    } else if (configuration?.fenster) {
      // Update the selection with new square meters
      updateSelection({
        category: configuration.fenster.category,
        value: configuration.fenster.value,
        name: configuration.fenster.name,
        price: configuration.fenster.price,
        description: configuration.fenster.description,
        squareMeters: newSquareMeters
      });
    }
  }, [configuration?.fenster, updateSelection, removeSelection]);

  // Define which categories can be unselected once selected
  const canUnselect = useCallback((categoryId: string): boolean => {
    // Only these categories can be unselected once selected
    // Both grundstueckscheck and planungspaket can be unselected but without visual X button
    const unselectableCategories = ['grundstueckscheck'];
    return unselectableCategories.includes(categoryId);
  }, []);

  // Handle unselection for categories that support it
  const handleUnselect = useCallback((categoryId: string, _optionId: string) => {
    if (canUnselect(categoryId)) {
      removeSelection(categoryId);
      
      // Reset local state for special categories
      if (categoryId === 'pvanlage') {
        setPvQuantity(0);
      } else if (categoryId === 'fenster') {
        setFensterSquareMeters(0);
      }
    }
  }, [canUnselect, removeSelection]);

  // Handle Grundstückscheck unselection (removed separate handler since visual button removed)

  const handleGrundstuecksCheckToggle = useCallback(() => {
    const newSelected = !isGrundstuecksCheckSelected;
    setIsGrundstuecksCheckSelected(newSelected);

    if (newSelected) {
      updateSelection({
        category: 'grundstueckscheck',
        value: 'grundstueckscheck',
        name: 'Grundstücks-Check',
        price: GRUNDSTUECKSCHECK_PRICE,
        description: 'Prüfung der rechtlichen und baulichen Voraussetzungen deines Grundstücks'
      });
    } else {
      // Remove selection when unchecked
      removeSelection('grundstueckscheck');
    }
  }, [isGrundstuecksCheckSelected, updateSelection, removeSelection]);

  const handleInfoClick = useCallback((_infoKey: string) => {
    // TODO: Implement dialog opening logic
  }, []);

  const isOptionSelected = useCallback((categoryId: string, optionId: string): boolean => {
    const categoryConfig = configuration?.[categoryId as keyof typeof configuration];
    if (typeof categoryConfig === 'object' && categoryConfig !== null && 'value' in categoryConfig) {
      return categoryConfig.value === optionId;
    }
    return false;
  }, [configuration]);

  const resetLocalState = useCallback(() => {
    setPvQuantity(0);
    setFensterSquareMeters(0);
    setIsGrundstuecksCheckSelected(false);
  }, []);

  // Helper function to get number of modules based on nest size
  const getModuleCount = useCallback((nestValue: string): number => {
    const moduleMapping: Record<string, number> = {
      'nest80': 4,   // 80m² = 4 modules
      'nest100': 5,  // 100m² = 5 modules
      'nest120': 6,  // 120m² = 6 modules
      'nest140': 7,  // 140m² = 7 modules
      'nest160': 8   // 160m² = 8 modules
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

  // Helper function to calculate maximum Fenster square meters based on nest size
  const getMaxFensterSquareMeters = useCallback((): number => {
    if (!configuration?.nest?.value) return 100; // Default for nest80
    const moduleCount = getModuleCount(configuration.nest.value);
    // Formula: 52 + (number_of_modules * 12)
    return 52 + (moduleCount * 12);
  }, [configuration?.nest?.value, getModuleCount]);

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
          quantity: maxPv
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
          squareMeters: maxFenster
        });
      }
    }
  }, [getMaxFensterSquareMeters, fensterSquareMeters, configuration?.fenster, updateSelection]);

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
            {category.options.map((option) => (
              <SelectionOption
                key={option.id}
                id={option.id}
                name={option.name}
                description={option.description}
                price={option.price}
                isSelected={isOptionSelected(category.id, option.id)}
                canUnselect={canUnselect(category.id)}
                onUnselect={canUnselect(category.id) ? (optionId) => handleUnselect(category.id, optionId) : undefined}
                onClick={(optionId) => {
                  if (category.id === 'pvanlage') {
                    handlePvSelection(category.id, optionId);
                  } else if (category.id === 'fenster') {
                    handleFensterSelection(category.id, optionId);
                  } else {
                    handleSelection(category.id, optionId);
                  }
                }}
              />
            ))}
          </div>

          {/* PV Quantity Selector */}
          {category.id === 'pvanlage' && configuration?.pvanlage && (
            <QuantitySelector
              label="Anzahl der PV-Module"
              value={pvQuantity}
              max={getMaxPvModules()}
              unitPrice={configuration.pvanlage.price || 0}
              onChange={handlePvQuantityChange}
            />
          )}

          {/* Fenster Square Meters Selector */}
          {category.id === 'fenster' && configuration?.fenster && (
            <QuantitySelector
              label="Anzahl der Fenster / Türen"
              value={fensterSquareMeters}
              max={getMaxFensterSquareMeters()}
              unitPrice={configuration.fenster.price || 0}
              unit="m²"
              onChange={handleFensterSquareMetersChange}
            />
          )}

          {/* Info Box */}
          {category.infoBox && (
            <InfoBox
              title={category.infoBox.title}
              description={category.infoBox.description}
              onClick={() => handleInfoClick(category.id)}
            />
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
      <CategorySection title="Grundstücks-Check" subtitle="Optional">
        <GrundstuecksCheckBox
          isSelected={isGrundstuecksCheckSelected}
          onClick={handleGrundstuecksCheckToggle}
        />
        <InfoBox
          title="Mehr Informationen zum Grundstücks-Check"
          onClick={() => handleInfoClick('grundcheck')}
        />
      </CategorySection>

      {/* Summary Panel */}
      <SummaryPanel onInfoClick={handleInfoClick} />
    </div>
  );

  // Consistent viewport height calculation for both panels - 5vh higher as requested
  const panelHeight = 'calc(100vh - var(--navbar-height, 3.5rem) - var(--footer-height, 2.5rem) + 5vh)';
  const panelPaddingTop = 'var(--navbar-height, 3.5rem)';

  return (
    <div className="configurator-shell w-full h-full bg-white">
      {/* Mobile Layout (< 1024px) */}
      <div className="lg:hidden h-full flex flex-col">
        <div className="flex-shrink-0 bg-white">
          <PreviewPanel isMobile={true} />
        </div>
        <div 
          ref={rightPanelRef} 
          className="flex-1 overflow-y-auto bg-white" 
          style={{ WebkitOverflowScrolling: 'touch' }}
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
            paddingTop: panelPaddingTop
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
            paddingTop: panelPaddingTop
          }}
        >
          <SelectionContent />
        </div>
      </div>

      {/* Cart Footer */}
      <CartFooter onReset={resetLocalState} />
    </div>
  );
}

/**
 * Migration Notes:
 * 
 * 1. Extract Components:
 *    - PreviewPanel: Image display + navigation arrows
 *    - SelectionPanel: All house option categories
 *    - SummaryPanel: Price breakdown + checkout
 * 
 * 2. Extract State Management:
 *    - useConfiguratorState: Main selection state
 *    - useInteractionTracking: User behavior tracking
 *    - usePriceCalculation: Price updates with debouncing
 * 
 * 3. Performance Improvements:
 *    - Optimistic UI updates
 *    - Image preloading
 *    - Batched tracking events
 * 
 * 4. Mobile Optimizations:
 *    - Separate mobile/desktop layouts
 *    - Touch-friendly interactions
 *    - Efficient scroll handling
 */ 