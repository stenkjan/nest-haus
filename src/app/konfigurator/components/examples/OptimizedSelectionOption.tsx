/**
 * OptimizedSelectionOption - Example of modular architecture implementation
 * 
 * This component demonstrates how the new modular architecture:
 * - Separates business logic from UI
 * - Provides optimistic updates for instant feedback
 * - Handles errors gracefully
 * - Uses performance monitoring
 * - Maintains clean, testable code
 * 
 * Compare this to the current SelectionOption.tsx to see the improvements.
 */

import React, { memo, useCallback, useState } from 'react';
import { useOptimizedConfigurator } from '../../hooks/useOptimizedConfigurator';
import type { ConfigurationItem } from '../../types/configurator.types';

interface OptimizedSelectionOptionProps {
  /** Option data from configuratorData */
  option: {
    id: string;
    name: string;
    description: string;
    price: {
      type: 'base' | 'upgrade' | 'included';
      amount?: number;
      monthly?: number;
    };
  };
  /** Category this option belongs to */
  category: string;
  /** Whether this option is currently selected */
  isSelected: boolean;
  /** Optional quantity for PV modules */
  quantity?: number;
  /** Optional square meters for Fenster */
  squareMeters?: number;
  /** Custom styling */
  className?: string;
}

export const OptimizedSelectionOption = memo<OptimizedSelectionOptionProps>(({
  option,
  category,
  isSelected,
  quantity = 1,
  squareMeters = 1,
  className = ''
}) => {
  const { 
    handleSelection, 
    isProcessing, 
    optimisticState, 
    error,
    clearError 
  } = useOptimizedConfigurator();
  
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handle option selection with optimized business logic
   */
  const onSelect = useCallback(async () => {
    // Clear any previous errors
    if (error) {
      clearError();
    }

    try {
      // Build configuration item
      const configItem: ConfigurationItem = {
        category,
        value: option.id,
        name: option.name,
        price: option.price.amount || 0,
        description: option.description,
        ...(category === 'pvanlage' && { quantity }),
        ...(category === 'fenster' && { squareMeters })
      };

      // Process through the optimized engine
      await handleSelection(configItem);
      
    } catch (selectionError) {
      // Error is already handled by the hook, but we could add
      // component-specific error handling here if needed
      console.warn('Selection failed:', selectionError);
    }
  }, [
    option, 
    category, 
    quantity, 
    squareMeters, 
    handleSelection, 
    error, 
    clearError
  ]);

  // Determine if this option is being optimistically processed
  const isOptimisticallySelected = optimisticState?.selection.value === option.id;
  
  // Show processing state for better UX
  const showProcessing = isProcessing && isOptimisticallySelected;
  
  // Calculate displayed price (with potential optimistic updates)
  const displayPrice = option.price.amount || 0;
  const isUpgrade = option.price.type === 'upgrade';
  const isIncluded = option.price.type === 'included';

  return (
    <div
      className={`
        relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : isHovered 
            ? 'border-gray-400 bg-gray-50' 
            : 'border-gray-200 bg-white'
        }
        ${showProcessing ? 'animate-pulse' : ''}
        ${error ? 'border-red-300 bg-red-50' : ''}
        ${className}
      `}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select ${option.name}`}
    >
      {/* Processing indicator */}
      {showProcessing && (
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error indicator */}
      {error && (
        <div className="absolute top-2 right-2 text-red-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Option content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">
          {option.name}
        </h3>
        
        <p className="text-sm text-gray-600">
          {option.description}
        </p>
        
        {/* Price display */}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            {isIncluded ? (
              <span className="text-green-600 font-medium">Inklusive</span>
            ) : isUpgrade ? (
              <span className="text-blue-600 font-medium">
                +{displayPrice.toLocaleString('de-DE')} €
              </span>
            ) : (
              <span className="text-gray-900 font-medium">
                {displayPrice.toLocaleString('de-DE')} €
              </span>
            )}
          </div>
          
          {/* Monthly price if available */}
          {option.price.monthly && (
            <div className="text-xs text-gray-500">
              {option.price.monthly} €/Monat
            </div>
          )}
        </div>

        {/* Quantity/Square meters controls for special categories */}
        {category === 'pvanlage' && isSelected && (
          <div className="pt-2 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700">
              Anzahl Module: {quantity}
            </label>
            {/* Quantity controls would go here */}
          </div>
        )}

        {category === 'fenster' && isSelected && (
          <div className="pt-2 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700">
              Quadratmeter: {squareMeters}
            </label>
            {/* Square meter controls would go here */}
          </div>
        )}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 text-blue-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 text-xs text-red-600">
          Auswahl fehlgeschlagen. Bitte versuchen Sie es erneut.
        </div>
      )}
    </div>
  );
});

OptimizedSelectionOption.displayName = 'OptimizedSelectionOption';

/**
 * Performance comparison:
 * 
 * OLD APPROACH (Current SelectionOption):
 * - Mixed business logic and UI
 * - Direct store manipulation
 * - No optimistic updates
 * - Limited error handling
 * - Difficult to test business logic
 * 
 * NEW APPROACH (This component):
 * - Clean separation of concerns
 * - Business logic in ConfiguratorEngine
 * - Optimistic updates for instant feedback
 * - Comprehensive error handling
 * - Easy to test and maintain
 * - Performance monitoring built-in
 * - Better accessibility
 */ 