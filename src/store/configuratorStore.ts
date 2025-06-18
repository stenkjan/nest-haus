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
  // Session & Configuration (CLIENT-SIDE ONLY)
  sessionId: string | null
  configuration: Configuration | null
  
  // Price calculations (CLIENT-SIDE for efficiency)
  currentPrice: number
  priceBreakdown: PriceBreakdown | null
  
  // Actions
  initializeSession: () => void
  updateSelection: (item: ConfigurationItem) => void
  removeSelection: (category: string) => void
  calculatePrice: () => void
  saveConfiguration: (userDetails?: Record<string, unknown>) => Promise<boolean>
  resetConfiguration: () => void
  finalizeSession: () => void
  
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
      currentPrice: 0,
      priceBreakdown: null,

      // Initialize session CLIENT-SIDE ONLY (no API dependency)
      initializeSession: () => {
        const state = get()
        if (state.sessionId) return // Already initialized

        // Generate client-side session ID
        const sessionId = `client_${Date.now()}_${Math.random().toString(36).substring(2)}`
        
        set({
          sessionId,
          configuration: {
            sessionId,
            totalPrice: 0,
            timestamp: Date.now()
          }
        })
      },

      // Update selection - FULLY CLIENT-SIDE (no API calls)
      updateSelection: (item: ConfigurationItem) => {
        const state = get()
        if (!state.sessionId || !state.configuration) return
        
        // Update local state immediately
        const updatedConfig = {
          ...state.configuration,
          [item.category]: item,
          timestamp: Date.now()
        }
        
        set({ configuration: updatedConfig })

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

      // Save configuration (optional API call, fail-safe)
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
          
          if (response.ok) {
            return true
          }
        } catch (error) {
          console.error('Failed to save configuration:', error)
        }
        
        // Return true even if save fails - user experience shouldn't be blocked
        return true
      },

      // Reset configuration
      resetConfiguration: () => {
        const sessionId = `client_${Date.now()}_${Math.random().toString(36).substring(2)}`
        set({
          sessionId,
          configuration: {
            sessionId,
            totalPrice: 0,
            timestamp: Date.now()
          },
          currentPrice: 0,
          priceBreakdown: null
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

      // Get configuration for cart
      getConfigurationForCart: () => {
        const state = get()
        return state.configuration
      },

      // Check if configuration is complete
      isConfigurationComplete: () => {
        const state = get()
        if (!state.configuration) return false
        
        // Check if required selections are made
        return !!(
          state.configuration.nest &&
          state.configuration.gebaeudehuelle &&
          state.configuration.innenverkleidung &&
          state.configuration.fussboden
        )
      }
    }),
    {
      name: 'nest-configurator',
      partialize: (state) => ({
        sessionId: state.sessionId,
        configuration: state.configuration,
        currentPrice: state.currentPrice,
        priceBreakdown: state.priceBreakdown
      })
    }
  )
) 