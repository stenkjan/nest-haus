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

  // Optimized selection handlers using useCallback to prevent re-renders
  const handleSelection = useCallback((categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);

    if (option && category) {
      updateSelection({
        category: categoryId,
        value: optionId,
        name: option.name,
        price: option.price.amount || 0,
        description: option.description
      });
    }
  }, [updateSelection]);

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
    if (configuration?.pvanlage) {
      updateSelection({
        category: configuration.pvanlage.category,
        value: configuration.pvanlage.value,
        name: configuration.pvanlage.name,
        price: configuration.pvanlage.price,
        description: configuration.pvanlage.description,
        quantity: newQuantity
      });
    }
  }, [configuration?.pvanlage, updateSelection]);

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
    if (configuration?.fenster) {
      updateSelection({
        category: configuration.fenster.category,
        value: configuration.fenster.value,
        name: configuration.fenster.name,
        price: configuration.fenster.price,
        description: configuration.fenster.description,
        squareMeters: newSquareMeters
      });
    }
  }, [configuration?.fenster, updateSelection]);

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
    }
  }, [isGrundstuecksCheckSelected, updateSelection]);

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
              max={4}
              unitPrice={configuration.pvanlage.price || 0}
              onChange={handlePvQuantityChange}
            />
          )}

          {/* Fenster Square Meters Selector */}
          {category.id === 'fenster' && configuration?.fenster && (
            <QuantitySelector
              label="Anzahl der Fenster / Türen"
              value={fensterSquareMeters}
              max={75}
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