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

import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Height sync logic for desktop
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const [leftPanelHeight, setLeftPanelHeight] = useState<number | null>(null);

  // Function to measure and set left panel height
  const measureLeftPanelHeight = useCallback(() => {
    if (window.innerWidth >= 1024 && previewPanelRef.current) {
      setLeftPanelHeight(previewPanelRef.current.offsetHeight);
    } else {
      setLeftPanelHeight(null);
    }
  }, []);

  useEffect(() => {
    measureLeftPanelHeight();
    window.addEventListener('resize', measureLeftPanelHeight);
    return () => {
      window.removeEventListener('resize', measureLeftPanelHeight);
    };
  }, [measureLeftPanelHeight]);

  // Initialize session and platform detection
  useEffect(() => {
    // Initialize session on mount
    initializeSession();

    // iOS WebKit optimization for address bar hiding
    if (typeof window !== 'undefined') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document);

      if (isIOS && window.innerWidth < 1024) {
        // Enable smooth scrolling and address bar hiding
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.style.setProperty('-webkit-overflow-scrolling', 'touch');

        // Initial scroll to trigger address bar hide
        setTimeout(() => {
          if (window.pageYOffset === 0) {
            window.scrollTo(0, 1);
          }
        }, 100);
      }
    }

    // Cleanup session on unmount
    return () => {
      finalizeSession();
    };
  }, [initializeSession, finalizeSession]);

  // Notify parent components of price changes
  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(currentPrice);
    }
  }, [currentPrice, onPriceChange]);

  // Handle regular selection
  const handleSelection = async (categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);

    if (option && category) {
      // Prevent page jumping by using requestAnimationFrame
      requestAnimationFrame(() => {
        // Update selection without showing loading UI
        updateSelection({
          category: categoryId,
          value: optionId,
          name: option.name,
          price: option.price.amount || 0,
          description: option.description
        });
      });
    }
  };

  // Handle PV selection with quantity
  const handlePvSelection = async (categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);

    if (option && category) {
      setPvQuantity(1); // Default to 1 module

      requestAnimationFrame(() => {
        updateSelection({
          category: categoryId,
          value: optionId,
          name: option.name,
          price: option.price.amount || 0,
          description: option.description,
          quantity: 1
        });
      });
    }
  };

  // Handle PV quantity change
  const handlePvQuantityChange = async (newQuantity: number) => {
    setPvQuantity(newQuantity);

    if (configuration?.pvanlage) {
      requestAnimationFrame(() => {
        updateSelection({
          category: configuration.pvanlage!.category,
          value: configuration.pvanlage!.value,
          name: configuration.pvanlage!.name,
          price: configuration.pvanlage!.price,
          description: configuration.pvanlage!.description,
          quantity: newQuantity
        });
      });
    }
  };

  // Handle Fenster selection with square meters
  const handleFensterSelection = async (categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);

    if (option && category) {
      setFensterSquareMeters(1); // Default to 1 m²

      requestAnimationFrame(() => {
        updateSelection({
          category: categoryId,
          value: optionId,
          name: option.name,
          price: option.price.amount || 0,
          description: option.description,
          squareMeters: 1
        });
      });
    }
  };

  // Handle Fenster square meters change
  const handleFensterSquareMetersChange = async (newSquareMeters: number) => {
    setFensterSquareMeters(newSquareMeters);

    if (configuration?.fenster) {
      requestAnimationFrame(() => {
        updateSelection({
          category: configuration.fenster!.category,
          value: configuration.fenster!.value,
          name: configuration.fenster!.name,
          price: configuration.fenster!.price,
          description: configuration.fenster!.description,
          squareMeters: newSquareMeters
        });
      });
    }
  };

  // Handle Grundstückscheck toggle
  const handleGrundstuecksCheckToggle = async () => {
    const newSelected = !isGrundstuecksCheckSelected;
    setIsGrundstuecksCheckSelected(newSelected);

    if (newSelected) {
      requestAnimationFrame(() => {
        updateSelection({
          category: 'grundstueckscheck',
          value: 'grundstueckscheck',
          name: 'Grundstücks-Check',
          price: GRUNDSTUECKSCHECK_PRICE,
          description: 'Prüfung der rechtlichen und baulichen Voraussetzungen deines Grundstücks'
        });
      });
    } else {
      // Remove selection logic would go here if needed
    }
  };

  // Handle info box clicks (could open dialogs)
  const handleInfoClick = (_infoKey: string) => {
    // TODO: Implement dialog opening logic
  };

  // Helper function to check if option is selected
  const isOptionSelected = (categoryId: string, optionId: string): boolean => {
    const categoryConfig = configuration?.[categoryId as keyof typeof configuration];
    if (typeof categoryConfig === 'object' && categoryConfig !== null && 'value' in categoryConfig) {
      return categoryConfig.value === optionId;
    }
    return false;
  };

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

  // Remove visible loading overlay - selections should be immediate
  // Background loading happens without blocking the UI

  return (
    <div
      className="configurator-shell w-full"
      style={{
        marginTop: 'var(--navbar-height, 2.5rem)',
        marginBottom: 'var(--footer-height 2.5rem)'
      }}
    >
      {/* Mobile Layout (< 1024px) */}
      <div className="lg:hidden">
        {/* Mobile Preview (Sticky) - WebKit optimized */}
        <div className="sticky top-0 z-30 bg-white">
          <PreviewPanel isMobile={true} />
        </div>

        {/* Mobile Selections (Scrollable) - Single scroll container for WebKit */}
        <div ref={rightPanelRef} className="overflow-y-auto bg-white" style={{ WebkitOverflowScrolling: 'touch' }}>
          <SelectionContent />
        </div>
      </div>

      {/* Desktop Layout (≥ 1024px) - 70/30 ratio with proper height calculation */}
      <div className="hidden lg:flex" style={{ height: 'calc(100vh - var(--navbar-height, 3.5rem) - var(--footer-height, 5rem))' }}>
        {/* Left: Preview Panel (70%) */}
        <div className="flex-[7] relative">
          <div ref={previewPanelRef} className="h-full w-full">
            <PreviewPanel isMobile={false} className="h-full w-full" />
          </div>
        </div>

        {/* Right: Selection Panel (30%) - Height matches left panel */}
        <div
          ref={rightPanelRef}
          className="configurator-right-panel flex-[3] bg-white overflow-y-auto"
          style={leftPanelHeight ? { maxHeight: leftPanelHeight } : { maxHeight: 'calc(100vh - var(--navbar-height, 3.5rem) - var(--footer-height, 5rem))' }}
        >
          <SelectionContent />
        </div>
      </div>

      {/* Cart Footer */}
      <CartFooter onReset={() => {
        // Reset local state
        setPvQuantity(0);
        setFensterSquareMeters(0);
        setIsGrundstuecksCheckSelected(false);
      }} />

      {/* Add padding to account for fixed footer */}
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