/**
 * ConfiguratorShell - New Modular Architecture
 * 
 * Clean, optimized configurator using the new modular architecture
 * with ConfiguratorEngine for business logic and useOptimizedConfigurator
 * for React integration with optimistic updates.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useRef, useEffect } from 'react';
import { useOptimizedConfigurator } from '../hooks/useOptimizedConfigurator';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { configuratorData } from '../data/configuratorData';
import type { ConfiguratorProps, ConfigurationItem } from '../types/configurator.types';
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
  
  // Use the new optimized configurator hook
  const {
    configuration,
    currentPrice,
    optimisticState,
    isProcessing,
    error,
    handleSelection: processSelection,
    clearError
  } = useOptimizedConfigurator();

  // Also get resetConfiguration from the store
  const { resetConfiguration } = useConfiguratorStore();

  // Height sync logic for desktop
  const previewPanelRef = useRef<HTMLDivElement>(null);
  
  // Initialize session and platform detection
  useEffect(() => {
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
  }, []);

  // Notify parent components of price changes
  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(currentPrice);
    }
  }, [currentPrice, onPriceChange]);

  // Handle regular selection with optimistic updates
  const handleSelection = async (categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);
    
    if (option && category) {
      const selection = {
        category: categoryId,
        value: optionId,
        name: option.name,
        price: option.price.amount || 0,
        description: option.description
      };

      // Process selection with optimistic updates
      await processSelection(selection);
    }
  };

  // Handle PV selection with quantity
  const handlePvSelection = async (categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);
    
    if (option && category) {
      const selection = {
        category: categoryId,
        value: optionId,
        name: option.name,
        price: option.price.amount || 0,
        description: option.description,
        quantity: 1
      };

      await processSelection(selection);
    }
  };

  // Handle PV quantity change
  const handlePvQuantityChange = async (newQuantity: number) => {
    if (configuration && typeof configuration === 'object' && configuration !== null && 'pvanlage' in configuration) {
      const pvConfig = (configuration as any).pvanlage;
      if (pvConfig) {
        const updatedSelection: ConfigurationItem = {
          category: 'pvanlage',
          value: pvConfig.value || 'standard',
          name: pvConfig.name || 'PV-Anlage',
          price: pvConfig.price || 0,
          quantity: newQuantity
        };

        await processSelection(updatedSelection);
      }
    }
  };

  // Handle Fenster selection with square meters
  const handleFensterSelection = async (categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);
    
    if (option && category) {
      const selection = {
        category: categoryId,
        value: optionId,
        name: option.name,
        price: option.price.amount || 0,
        description: option.description,
        squareMeters: 1
      };

      await processSelection(selection);
    }
  };

  // Handle Fenster square meters change
  const handleFensterSquareMetersChange = async (newSquareMeters: number) => {
    if (configuration && typeof configuration === 'object' && configuration !== null && 'fenster' in configuration) {
      const fensterConfig = (configuration as any).fenster;
      if (fensterConfig) {
        const updatedSelection: ConfigurationItem = {
          category: 'fenster',
          value: fensterConfig.value || 'standard',
          name: fensterConfig.name || 'Fenster',
          price: fensterConfig.price || 0,
          squareMeters: newSquareMeters
        };

        await processSelection(updatedSelection);
      }
    }
  };

  // Handle Grundstückscheck toggle
  const handleGrundstuecksCheckToggle = async () => {
    const isCurrentlySelected = configuration && typeof configuration === 'object' && configuration !== null && 'grundstueckscheck' in configuration && !!(configuration as any).grundstueckscheck;
    
    if (isCurrentlySelected) {
      // Remove grundstueckscheck by resetting configuration
      resetConfiguration();
    } else {
      // Add grundstueckscheck
      const selection: ConfigurationItem = {
        category: 'grundstueckscheck',
        value: 'grundstueckscheck',
        name: 'Grundstücks-Check',
        price: GRUNDSTUECKSCHECK_PRICE,
        description: 'Professionelle Grundstücksanalyse'
      };

      await processSelection(selection);
    }
  };

  // Handle info click
  const handleInfoClick = (_infoKey: string) => {
    // Info dialog logic would go here
    console.log('Info clicked:', _infoKey);
  };

  // Check if option is selected
  const isOptionSelected = (categoryId: string, optionId: string): boolean => {
    if (!configuration) return false;
    const categoryConfig = (configuration as any)[categoryId];
    if (typeof categoryConfig === 'object' && categoryConfig !== null && 'value' in categoryConfig) {
      return categoryConfig.value === optionId;
    }
    return false;
  };

  // Get current price (with optimistic updates)
  const displayPrice = optimisticState?.estimatedPrice ?? currentPrice;

  // Get current selections (with optimistic updates)
  const currentSelections = optimisticState ? {
    ...(configuration as any),
    [optimisticState.selection.category]: optimisticState.selection
  } : configuration;

  const SelectionContent = () => (
    <div className="w-full">
      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          ⚠️ {error.message}
          <button 
            onClick={clearError}
            className="ml-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Configurator sections */}
      {configuratorData.map((category) => (
        <CategorySection key={category.id} {...{ category } as any}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.options.map((option) => (
              <SelectionOption
                key={option.id}
                {...{
                  option,
                  category,
                  isSelected: isOptionSelected(category.id, option.id),
                  onSelect: () => {
                    if (category.id === 'pvanlage') {
                      handlePvSelection(category.id, option.id);
                    } else if (category.id === 'fenster') {
                      handleFensterSelection(category.id, option.id);
                    } else {
                      handleSelection(category.id, option.id);
                    }
                  },
                  isProcessing: isProcessing && optimisticState?.selection.value === option.id,
                  optimisticFeedback: optimisticState?.selection.value === option.id
                } as any}
              />
            ))}
          </div>

          {/* Quantity selectors */}
          {category.id === 'pvanlage' && currentSelections && typeof currentSelections === 'object' && currentSelections !== null && 'pvanlage' in currentSelections && (currentSelections as any).pvanlage && (
            <div className="mt-4">
              <QuantitySelector
                {...{
                  value: (currentSelections as any).pvanlage.quantity || 1,
                  onChange: handlePvQuantityChange,
                  min: 1,
                  max: 10,
                  label: "Anzahl Module",
                  disabled: isProcessing
                } as any}
              />
            </div>
          )}

          {category.id === 'fenster' && currentSelections && typeof currentSelections === 'object' && currentSelections !== null && 'fenster' in currentSelections && (currentSelections as any).fenster && (
            <div className="mt-4">
              <QuantitySelector
                {...{
                  value: (currentSelections as any).fenster.squareMeters || 1,
                  onChange: handleFensterSquareMetersChange,
                  min: 1,
                  max: 50,
                  step: 0.5,
                  label: "Quadratmeter",
                  unit: "m²",
                  disabled: isProcessing
                } as any}
              />
            </div>
          )}
        </CategorySection>
      ))}

      {/* Grundstückscheck */}
      <div className="mt-8">
        <GrundstuecksCheckBox
          {...{
            isSelected: !!(currentSelections && typeof currentSelections === 'object' && currentSelections !== null && 'grundstueckscheck' in currentSelections && (currentSelections as any).grundstueckscheck),
            onToggle: handleGrundstuecksCheckToggle,
            disabled: isProcessing
          } as any}
        />
      </div>

      {/* Info boxes */}
      <div className="mt-8 space-y-4">
        <InfoBox {...{ onInfoClick: handleInfoClick } as any} />
        <FactsBox {...{ title: "Fakten" } as any} />
      </div>
    </div>
  );

  const PreviewContent = () => (
    <div ref={previewPanelRef} className="h-full">
      <PreviewPanel
        {...{
          selections: currentSelections || {},
          activeView: "exterior",
          onViewChange: (view: any) => {
            // View change logic would go here
            console.log('View changed to:', view);
          },
          availableViews: ['exterior', 'interior'],
          isLoading: isProcessing,
          optimisticPreview: !!optimisticState
        } as any}
      />
    </div>
  );

  const SummaryContent = () => (
    <SummaryPanel
      {...{
        selections: currentSelections || {},
        totalPrice: displayPrice,
        onCheckout: () => {
          // Checkout logic would go here
          console.log('Checkout initiated');
        },
        isProcessing: isProcessing,
        optimisticPrice: optimisticState?.estimatedPrice
      } as any}
    />
  );

  // Mobile layout
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return (
      <div className="configurator-shell-mobile w-full">
        <div className="preview-section mb-6">
          <PreviewContent />
        </div>
        
        <div className="selection-section mb-6">
          <SelectionContent />
        </div>
        
        <div className="summary-section">
          <SummaryContent />
        </div>
        
        <CartFooter
          {...{
            totalPrice: displayPrice,
            isProcessing: isProcessing,
            optimisticPrice: optimisticState?.estimatedPrice
          } as any}
        />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="configurator-shell-desktop flex gap-8 w-full max-w-7xl mx-auto">
      {/* Left Panel - Selection */}
      <div className="flex-1 min-w-0">
        <SelectionContent />
      </div>

      {/* Right Panel - Preview & Summary */}
      <div ref={rightPanelRef} className="w-96 flex-shrink-0 space-y-6">
        <PreviewContent />
        <SummaryContent />
      </div>
    </div>
  );
}

/**
 * Migration Notes:
 * 
 * 1. Extract Components:F
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