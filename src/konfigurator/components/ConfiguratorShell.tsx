/**
 * ConfiguratorShell - Main Container Component
 * 
 * Replaces the monolithic legacy Configurator.tsx with a clean,
 * modular architecture that separates concerns.
 * 
 * @example
 * <ConfiguratorShell initialModel="nest80" />
 */

'use client';

import React, { useState } from 'react';
import type { ConfiguratorProps } from '../types/configurator.types';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { configuratorData } from '../data/configuratorData';
import { CategorySection, SelectionOption, InfoBox, FactsBox } from './';

// Import child components (to be created)
// import { PreviewPanel } from './PreviewPanel';
// import { SelectionPanel } from './SelectionPanel';
// import { SummaryPanel } from './SummaryPanel';

// Import hooks (to be created)
// import { useConfiguratorState } from '../hooks/useConfiguratorState';
// import { useInteractionTracking } from '../hooks/useInteractionTracking';

export default function ConfiguratorShell({ 
  initialModel = 'nest80',
  onSelectionChange,
  onPriceChange 
}: ConfiguratorProps) {
  const { updateSelection, configuration } = useConfiguratorStore();
  const [selections, setSelections] = useState<Record<string, string>>({
    nest: initialModel
  });

  // Initialize session on mount
  React.useEffect(() => {
    console.log('ConfiguratorShell initialized with:', { 
      initialModel, 
      hasSelectionCallback: !!onSelectionChange,
      hasPriceCallback: !!onPriceChange 
    });
  }, [initialModel, onSelectionChange, onPriceChange]);

  const handleSelection = (categoryId: string, optionId: string) => {
    const category = configuratorData.find(cat => cat.id === categoryId);
    const option = category?.options.find(opt => opt.id === optionId);
    
    if (option && category) {
      setSelections(prev => ({ ...prev, [categoryId]: optionId }));
      
      updateSelection({
        category: categoryId,
        value: optionId,
        name: option.name,
        price: option.price.amount || 0,
        description: option.description
      });
    }
  };

  const handleInfoClick = (categoryId: string) => {
    console.log('Info clicked for category:', categoryId);
    // TODO: Open modal/lightbox
  };

  const SelectionContent = () => (
    <div className="p-8 space-y-6">
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
                isSelected={selections[category.id] === option.id}
                onClick={(optionId) => handleSelection(category.id, optionId)}
              />
            ))}
          </div>
          
          {category.infoBox && (
            <InfoBox
              title={category.infoBox.title}
              description={category.infoBox.description}
              onClick={() => handleInfoClick(category.id)}
            />
          )}
          
          {category.facts && (
            <FactsBox
              title={category.facts.title}
              facts={category.facts.content}
              links={category.facts.links}
            />
          )}
        </CategorySection>
      ))}
    </div>
  );

  return (
    <div className="configurator-shell w-screen relative">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Preview (Sticky) */}
        <div className="sticky top-0 bg-white z-30">
          {/* TODO: Replace with PreviewPanel component */}
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p>Mobile Preview Panel (TODO: Implement)</p>
          </div>
        </div>

        {/* Mobile Selections (Scrollable) */}
        <SelectionContent />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left: Preview Panel */}
        <div className="flex-1 relative">
          {/* TODO: Replace with PreviewPanel component */}
          <div className="h-full bg-gray-100 flex items-center justify-center">
            <p>Desktop Preview Panel (TODO: Implement)</p>
          </div>
        </div>

        {/* Right: Selection + Summary Panel */}
        <div className="w-[572px] bg-white overflow-y-auto">
          <SelectionContent />
        </div>
      </div>
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