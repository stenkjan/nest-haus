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
  nest?: ConfigurationItem
  gebaeudehuelle?: ConfigurationItem
  innenverkleidung?: ConfigurationItem
  fussboden?: ConfigurationItem
  pvanlage?: ConfigurationItem
  fenster?: ConfigurationItem
  planungspaket?: ConfigurationItem
  grundstueckscheck?: ConfigurationItem
  totalPrice: number
  timestamp: number
}

export interface PriceBreakdown {
  basePrice: number
  options: Record<string, { name: string; price: number }>
  totalPrice: number
}

interface ConfiguratorState {
  // Session & Configuration
  sessionId: string | null
  configuration: Configuration | null
  isLoading: boolean
  lastSaved: number | null
  
  // Price calculations (CLIENT-SIDE for efficiency)
  currentPrice: number
  priceBreakdown: PriceBreakdown | null
  
  // Actions
  initializeSession: () => Promise<void>
  updateSelection: (item: ConfigurationItem) => void
  removeSelection: (category: string) => void
  calculatePrice: () => void
  saveConfiguration: (userDetails?: Record<string, unknown>) => Promise<boolean>
  resetConfiguration: () => void
  finalizeSession: () => Promise<void>
  
  // Getters
  getConfigurationForCart: () => Configuration | null
  isConfigurationComplete: () => boolean
}

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionId: null,
      configuration: null,
      isLoading: false,
      lastSaved: null,
      currentPrice: 0,
      priceBreakdown: null,

      // Initialize session with backend
      initializeSession: async () => {
        const state = get()
        if (state.sessionId) return // Already initialized

        set({ isLoading: true })
        
        try {
          const response = await fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
          const data = await response.json()
          
          if (data.success) {
            set({
              sessionId: data.sessionId,
              configuration: {
                sessionId: data.sessionId,
                totalPrice: 0,
                timestamp: Date.now()
              }
            })
          }
        } catch (error) {
          console.error('Failed to initialize session:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      // Update selection - OPTIMIZED: No API calls for price calculation
      updateSelection: (item: ConfigurationItem) => {
        const state = get()
        if (!state.sessionId || !state.configuration) return

        const previousSelection = state.configuration[item.category as keyof Configuration] as ConfigurationItem
        
        // Optimistic UI update - update local state immediately
        const updatedConfig = {
          ...state.configuration,
          [item.category]: item,
          timestamp: Date.now()
        }
        
        set({ configuration: updatedConfig })

        // Calculate price immediately using client-side logic (no API call)
        get().calculatePrice()

        // Track selection with backend (async, non-blocking)
        fetch('/api/sessions/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: state.sessionId,
            category: item.category,
            selection: item.value,
            previousSelection: previousSelection?.value || null,
            priceChange: item.price - (previousSelection?.price || 0),
            totalPrice: get().currentPrice // Use calculated price
          })
        }).catch(error => {
          console.error('Failed to track selection:', error)
          // Don't throw - tracking failures shouldn't break user experience
        })
      },

      // Remove selection
      removeSelection: (category: string) => {
        const state = get()
        if (!state.configuration) return

        const updatedConfig = { ...state.configuration }
        delete updatedConfig[category as keyof Configuration]
        updatedConfig.timestamp = Date.now()
        
        set({ configuration: updatedConfig })
        get().calculatePrice()
      },

      // Calculate price using CLIENT-SIDE logic (OPTIMIZED: No API calls)
      calculatePrice: () => {
        const state = get()
        if (!state.configuration) return

        // Convert configuration to selections format
        const selections = {
          nest: state.configuration.nest,
          gebaeudehuelle: state.configuration.gebaeudehuelle,
          innenverkleidung: state.configuration.innenverkleidung,
          fussboden: state.configuration.fussboden,
          pvanlage: state.configuration.pvanlage,
          fenster: state.configuration.fenster,
          paket: state.configuration.planungspaket,
          grundstueckscheck: !!state.configuration.grundstueckscheck
        }

        // Use client-side PriceCalculator for instant results
        const totalPrice = PriceCalculator.calculateTotalPrice(selections)
        const priceBreakdown = PriceCalculator.getPriceBreakdown(selections)

        set({
          currentPrice: totalPrice,
          priceBreakdown,
          configuration: {
            ...state.configuration!,
            totalPrice
          }
        })
      },

      // Save configuration
      saveConfiguration: async (userDetails?: Record<string, unknown>) => {
        const state = get()
        if (!state.configuration) return false

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
          
          const data = await response.json()
          if (data.success) {
            set({ lastSaved: Date.now() })
            return true
          }
          return false
        } catch (error) {
          console.error('Failed to save configuration:', error)
          return false
        }
      },

      // Reset configuration
      resetConfiguration: () => {
        const state = get()
        if (state.sessionId) {
          set({
            configuration: {
              sessionId: state.sessionId,
              totalPrice: 0,
              timestamp: Date.now()
            },
            currentPrice: 0,
            priceBreakdown: null
          })
        }
      },

      // Finalize session
      finalizeSession: async () => {
        const state = get()
        if (!state.sessionId || !state.configuration) return

        try {
          await fetch('/api/sessions/finalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: state.sessionId,
              config: state.configuration
            })
          })
        } catch (error) {
          console.error('Failed to finalize session:', error)
        }
      },

      // Get configuration for cart
      getConfigurationForCart: () => {
        const state = get()
        return state.configuration && state.isConfigurationComplete() 
          ? state.configuration 
          : null
      },

      // Check if configuration is complete
      isConfigurationComplete: () => {
        const state = get()
        if (!state.configuration) return false
        
        const required = ['nest', 'gebaeudehuelle', 'innenverkleidung', 'fussboden']
        return required.every(key => state.configuration![key as keyof Configuration])
      }
    }),
    {
      name: 'configurator-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        configuration: state.configuration,
        currentPrice: state.currentPrice,
        lastSaved: state.lastSaved
      })
    }
  )
) 