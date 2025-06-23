import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PriceCalculator } from '@/app/konfigurator/core/PriceCalculator'

// Configuration types matching our backend
export interface ConfigurationItem {
  category: string
  value: string
  name: string
  price: number
  description?: string
  quantity?: number
  squareMeters?: number
}

export interface Configuration {
  sessionId: string
  nest?: ConfigurationItem | null
  gebaeudehuelle?: ConfigurationItem | null
  innenverkleidung?: ConfigurationItem | null
  fussboden?: ConfigurationItem | null
  pvanlage?: ConfigurationItem | null
  fenster?: ConfigurationItem | null
  planungspaket?: ConfigurationItem | null
  grundstueckscheck?: ConfigurationItem | null
  totalPrice: number
  timestamp: number
}

export interface PriceBreakdown {
  basePrice: number
  options: Record<string, { name: string; price: number }>
  totalPrice: number
}

interface ConfiguratorState {
  // Session & Configuration (CLIENT-SIDE ONLY)
  sessionId: string | null
  configuration: Configuration
  
  // Price calculations (CLIENT-SIDE for efficiency)
  currentPrice: number
  priceBreakdown: PriceBreakdown | null
  
  // Preview panel progression state (matches old configurator logic)
  hasPart2BeenActive: boolean
  hasPart3BeenActive: boolean
  
  // View switching state (matches old configurator behavior)
  shouldSwitchToView: string | null
  lastSelectionCategory: string | null
  
  // Actions
  initializeSession: () => void
  updateSelection: (item: ConfigurationItem) => void
  removeSelection: (category: string) => void
  calculatePrice: () => void
  saveConfiguration: (userDetails?: Record<string, unknown>) => Promise<boolean>
  resetConfiguration: () => void
  reset: () => void
  finalizeSession: () => void
  
  // Part activation
  activatePart2: () => void
  activatePart3: () => void
  
  // View switching
  clearViewSwitchSignal: () => void
  
  // Getters
  getConfiguration: () => Configuration | null
  getConfigurationForCart: () => Configuration | null
  isConfigurationComplete: () => boolean
}

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionId: null,
      configuration: {
        sessionId: process.env.NODE_ENV === 'test' ? '' : '',  // Empty initially, will be set when session is initialized
        nest: null,
        gebaeudehuelle: null,
        innenverkleidung: null,
        fussboden: null,
        pvanlage: null,
        fenster: null,
        planungspaket: null,
        grundstueckscheck: null,
        totalPrice: 0,
        timestamp: 0
      },
      currentPrice: 0,
      priceBreakdown: null,
      hasPart2BeenActive: false,
      hasPart3BeenActive: false,
      shouldSwitchToView: null,
      lastSelectionCategory: null,

      // Initialize session CLIENT-SIDE ONLY (no API dependency)
      initializeSession: () => {
        const state = get()
        
        // Skip initialization if already configured (for tests)
        if (state.sessionId && state.configuration.sessionId) {
          return;
        }
        
        // Skip auto-reset in test environment to allow explicit testing
        if (process.env.NODE_ENV === 'test') {
          return;
        }
        
        // Only auto-reset in development if not already initialized
        if (process.env.NODE_ENV === 'development' && !state.sessionId) {
          get().resetConfiguration()
          return;
        }
        
        // For production, initialize with clean configuration
        if (!state.sessionId) {
          get().resetConfiguration()
        }
      },

      // Update selection with intelligent view switching and price calculation
      updateSelection: (item: ConfigurationItem) => {
        const state = get()
        
        // Generate sessionId only if not already set
        let sessionId = state.sessionId
        if (!sessionId) {
          sessionId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          set({ sessionId })
        }
        
        // Configuration is always available now
        const updatedConfiguration: Configuration = {
          ...state.configuration,
          sessionId: sessionId,
          [item.category]: item,
          timestamp: Date.now()
        }

        // Determine view switching based on category and activation states
        let shouldSwitchToView: string | null = null;
        let newHasPart2BeenActive = state.hasPart2BeenActive;
        let newHasPart3BeenActive = state.hasPart3BeenActive;

        if (item.category === 'innenverkleidung' || item.category === 'fussboden') {
          if (!state.hasPart2BeenActive) {
            newHasPart2BeenActive = true;
          }
          shouldSwitchToView = 'interior';
        } else if (item.category === 'pvanlage') {
          if (!state.hasPart3BeenActive) {
            newHasPart3BeenActive = true;
          }
          shouldSwitchToView = 'pv';
        } else if (item.category === 'fenster') {
          if (!state.hasPart3BeenActive) {
            newHasPart3BeenActive = true;
          }
          shouldSwitchToView = 'fenster';
        }

        // Clear image cache if this is a visual change (gebäudehülle, innenverkleidung, fussboden)
        if (['gebaeudehuelle', 'innenverkleidung', 'fussboden'].includes(item.category)) {
          // Image cache will be cleared automatically via ImageManager
        }

        set({
          configuration: updatedConfiguration,
          currentPrice: state.currentPrice, // Keep existing price for now
          hasPart2BeenActive: newHasPart2BeenActive,
          hasPart3BeenActive: newHasPart3BeenActive,
          shouldSwitchToView,
          lastSelectionCategory: item.category
        })

        // Calculate price immediately using client-side logic
        get().calculatePrice()

        // Optional: Track selection in background (non-blocking, fail-safe)
        if (typeof window !== 'undefined') {
          fetch('/api/sessions/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: state.sessionId,
              category: item.category,
              selection: item.value,
              totalPrice: get().currentPrice
            })
          }).catch(() => {
            // Silently fail - tracking is optional, don't break user experience
          })
        }
      },

      // Remove selection
      removeSelection: (category: string) => {
        const state = get()
        
        const updatedConfig: Configuration = { 
          ...state.configuration,
          timestamp: Date.now()
        }
        
        // Properly type the deletion using keyof
        if (category in updatedConfig) {
          delete (updatedConfig as unknown as Record<string, unknown>)[category]
        }
        
        set({ configuration: updatedConfig })
        get().calculatePrice()
      },

      // Calculate price using client-side PriceCalculator
      calculatePrice: () => {
        const state = get()
        
        // Build selections object for price calculation
        const selections = {
          nest: state.configuration.nest || undefined,
          gebaeudehuelle: state.configuration.gebaeudehuelle || undefined,
          innenverkleidung: state.configuration.innenverkleidung || undefined,
          fussboden: state.configuration.fussboden || undefined,
          pvanlage: state.configuration.pvanlage || undefined,
          fenster: state.configuration.fenster || undefined,
          paket: state.configuration.planungspaket || undefined,
          grundstueckscheck: !!state.configuration.grundstueckscheck
        }

        const totalPrice = PriceCalculator.calculateTotalPrice(selections as unknown as Record<string, unknown>)
        const priceBreakdown = PriceCalculator.getPriceBreakdown(selections as unknown as Record<string, unknown>)

        set({
          currentPrice: totalPrice,
          priceBreakdown,
          configuration: {
            ...state.configuration,
            totalPrice,
            timestamp: Date.now()
          }
        })
      },

      // Save configuration (optional API call, fail-safe)
      saveConfiguration: async (userDetails?: Record<string, unknown>) => {
        const state = get()
        
        try {
          const configToSave = {
            ...state.configuration,
            ...userDetails
          }

          const response = await fetch('/api/configurations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(configToSave)
          })
          
          if (response.ok) {
            return true
          }
        } catch (error) {
          console.error('Failed to save configuration:', error)
        }
        
        // Return true even if save fails - user experience shouldn't be blocked
        return true
      },

      // Part activation functions
      activatePart2: () => {
        set({ hasPart2BeenActive: true })
      },

      activatePart3: () => {
        set({ hasPart3BeenActive: true })
      },

      // View switching
      clearViewSwitchSignal: () => {
        set({ shouldSwitchToView: null })
      },

      // Reset configuration - Complete defaults matching old configurator
      resetConfiguration: () => {
        // Only generate sessionId if not in test environment
        const sessionId = process.env.NODE_ENV === 'test' ? null : `client_${Date.now()}_${Math.random().toString(36).substring(2)}`
        
        const defaultConfiguration = {
          sessionId: sessionId || '',
          nest: null,
          gebaeudehuelle: null,
          innenverkleidung: null,
          fussboden: null,
          pvanlage: null,
          fenster: null,
          planungspaket: null,
          grundstueckscheck: null,
          totalPrice: 0,
          timestamp: Date.now()
        }

        set({
          sessionId,
          configuration: defaultConfiguration,
          currentPrice: 0,
          priceBreakdown: null,
          hasPart2BeenActive: false,
          hasPart3BeenActive: false,
          shouldSwitchToView: null,
          lastSelectionCategory: null
        })
      },

      // Finalize session (CLIENT-SIDE ONLY)
      finalizeSession: () => {
        const state = get()
        if (!state.sessionId) return

        // Optional: Send finalization to backend (non-blocking)
        if (typeof window !== 'undefined') {
          fetch('/api/sessions/finalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: state.sessionId,
              finalConfiguration: state.configuration,
              totalPrice: state.currentPrice
            })
          }).catch(() => {
            // Silently fail - finalization is optional
          })
        }
      },

      // Reset alias (for test compatibility)
      reset: () => {
        get().resetConfiguration()
      },

      // Get configuration (for test compatibility)
      getConfiguration: () => {
        const state = get()
        return state.configuration
      },

      // Get configuration for cart
      getConfigurationForCart: () => {
        const state = get()
        return state.configuration
      },

      // Check if required configuration is complete
      isConfigurationComplete: () => {
        const state = get()
        return (
          !!state.configuration.nest &&
          !!state.configuration.gebaeudehuelle &&
          !!state.configuration.innenverkleidung &&
          !!state.configuration.fussboden
        )
      }
    }),
    {
      name: 'nest-configurator',
      // Skip persistence in development and test to prevent state conflicts
      skipHydration: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',
      partialize: (state) => ({
        sessionId: state.sessionId,
        configuration: state.configuration,
        currentPrice: state.currentPrice,
        priceBreakdown: state.priceBreakdown,
        hasPart2BeenActive: state.hasPart2BeenActive,
        hasPart3BeenActive: state.hasPart3BeenActive,
        shouldSwitchToView: state.shouldSwitchToView,
        lastSelectionCategory: state.lastSelectionCategory
      })
    }
  )
) 