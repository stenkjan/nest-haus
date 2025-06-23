/**
 * useOptimizedConfigurator - Enhanced state management hook
 * 
 * This hook integrates the ConfiguratorEngine with React components,
 * providing optimistic updates, error handling, and performance monitoring.
 * 
 * @example
 * const { handleSelection, isProcessing, optimisticState, error } = useOptimizedConfigurator();
 * await handleSelection(selection);
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { ConfiguratorEngine } from '../core/ConfiguratorEngine';
import type { 
  ConfigurationItem, 
  ProcessedSelection,
  OptimisticState,
  SelectionContext
} from '../types/configurator.types';

interface UseOptimizedConfiguratorReturn {
  // State
  isProcessing: boolean;
  optimisticState: LocalOptimisticState | null;
  error: Error | null;
  lastProcessedSelection: ProcessedSelection | null;
  
  // Actions
  handleSelection: (selection: ConfigurationItem) => Promise<ProcessedSelection>;
  clearError: () => void;
  clearOptimisticState: () => void;
  
  // Store integration
  configuration: any;
  currentPrice: number;
  sessionId: string | null;
}

// Local OptimisticState interface (removed from import to avoid conflict)
interface LocalOptimisticState {
  selection: ConfigurationItem;
  estimatedPrice: number;
  timestamp: number;
  processingStartTime: number;
}

export function useOptimizedConfigurator(): UseOptimizedConfiguratorReturn {
  const store = useConfiguratorStore();
  const engineRef = useRef<ConfiguratorEngine | null>(null);
  
  // Local state for optimistic updates and error handling
  const [optimisticState, setOptimisticState] = useState<LocalOptimisticState | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [lastProcessedSelection, setLastProcessedSelection] = useState<ProcessedSelection | null>(null);

  // Initialize engine once
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new ConfiguratorEngine();
    }
    
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Clear error when configuration changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [store.configuration, error]);

  /**
   * Handle selection with optimistic updates and comprehensive error handling
   */
  const handleSelection = useCallback(async (
    selection: ConfigurationItem
  ): Promise<ProcessedSelection> => {
    if (!engineRef.current) {
      throw new Error('ConfiguratorEngine not initialized');
    }

    const processingStartTime = performance.now();
    
    // Clear previous error
    setError(null);

    // Immediate optimistic update for instant UI feedback
    const estimatedPrice = store.currentPrice + (selection.price || 0);
    const optimisticUpdate: LocalOptimisticState = {
      selection,
      estimatedPrice,
      timestamp: Date.now(),
      processingStartTime
    };
    
    setOptimisticState(optimisticUpdate);

    try {
      // Prepare selection context
      const context: SelectionContext = {
        currentConfiguration: store.configuration as any,
        sessionId: store.sessionId,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        timestamp: Date.now()
      };

      // Process selection through the engine
      const result = await engineRef.current.processSelection(selection, context);
      
      // Update the store with the real results
      store.updateSelection(result.selection);
      
      // Clear optimistic state
      setOptimisticState(null);
      
      // Store the processed result for potential future use
      setLastProcessedSelection(result);
      
      // Log successful processing
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Selection processed successfully:', {
          selection: result.selection.name,
          processingTime: result.performance.processingTime,
          recommendedView: result.recommendedView
        });
      }
      
      return result;

    } catch (processingError) {
      // Handle processing errors gracefully
      const error = processingError instanceof Error 
        ? processingError 
        : new Error('Unknown processing error');

      // Revert optimistic state
      setOptimisticState(null);
      
      // Set error state for UI feedback
      setError(error);
      
      // Log error for debugging
      console.error('❌ Selection processing failed:', {
        error: error.message,
        selection: selection.name,
        processingTime: performance.now() - processingStartTime
      });
      
      // Re-throw for component-level error handling
      throw error;
    }
  }, [store]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear optimistic state (useful for manual cancellation)
   */
  const clearOptimisticState = useCallback(() => {
    setOptimisticState(null);
  }, []);

  // Compute derived state
  const isProcessing = optimisticState !== null;
  
  // Use optimistic price if available, otherwise use store price
  const currentPrice = optimisticState?.estimatedPrice ?? store.currentPrice;

  return {
    // State
    isProcessing,
    optimisticState,
    error,
    lastProcessedSelection,
    
    // Actions
    handleSelection,
    clearError,
    clearOptimisticState,
    
    // Store integration with optimistic updates
    configuration: store.configuration,
    currentPrice,
    sessionId: store.sessionId
  };
}

/**
 * Helper hook for performance monitoring
 */
export function useConfiguratorPerformance() {
  const [metrics, setMetrics] = useState({
    averageSelectionTime: 0,
    totalSelections: 0,
    errorRate: 0,
    imageLoadTime: 0
  });

  const updateMetrics = useCallback((newMetric: Partial<typeof metrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetric }));
  }, []);

  return { metrics, updateMetrics };
}

/**
 * Hook for managing configurator view state
 */
export function useConfiguratorView(initialView: string = 'exterior') {
  const [currentView, setCurrentView] = useState(initialView);
  const [availableViews, setAvailableViews] = useState<string[]>(['exterior']);
  const [viewTransitioning, setViewTransitioning] = useState(false);

  const switchView = useCallback(async (newView: string) => {
    if (newView === currentView || viewTransitioning) return;
    
    setViewTransitioning(true);
    
    // Simulate view transition delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 150));
    
    setCurrentView(newView);
    setViewTransitioning(false);
  }, [currentView, viewTransitioning]);

  const updateAvailableViews = useCallback((views: string[]) => {
    setAvailableViews(views);
  }, []);

  return {
    currentView,
    availableViews,
    viewTransitioning,
    switchView,
    updateAvailableViews
  };
} 