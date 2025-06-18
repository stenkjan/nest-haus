import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  
  // Price calculations
  currentPrice: number
  priceBreakdown: PriceBreakdown | null
  
  // Internal state for optimization
  priceCalculationTimeoutId?: NodeJS.Timeout
  
  // Actions
  initializeSession: () => Promise<void>
  updateSelection: (item: ConfigurationItem) => Promise<void>
  removeSelection: (category: string) => Promise<void>
  calculatePrice: () => Promise<void>
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

      // Update selection and track with backend (optimized)
      updateSelection: async (item: ConfigurationItem) => {
        const state = get()
        if (!state.sessionId || !state.configuration) return

        const previousSelection = state.configuration[item.category as keyof Configuration] as ConfigurationItem
        
        // Optimistic UI update - update local state immediately
        const updatedConfig = {
          ...state.configuration,
          [item.category]: item,
          timestamp: Date.now()
        }
        
        set({ 
          configuration: updatedConfig
          // Remove isLoading - selections should be immediate for better UX
        })

        // Batch async operations for better performance
        const promises = []
        
        // Calculate new price (async)
        promises.push(get().calculatePrice())

        // Track selection with backend (async, non-blocking)
        promises.push(
          fetch('/api/sessions/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: state.sessionId,
              category: item.category,
              selection: item.value,
              previousSelection: previousSelection?.value || null,
              priceChange: item.price - (previousSelection?.price || 0),
              totalPrice: item.price + (state.currentPrice - (previousSelection?.price || 0)) // Optimistic price calculation
            })
          }).catch(error => {
            console.error('Failed to track selection:', error)
            // Don't throw - tracking failures shouldn't break user experience
          })
        )

        // Wait for async operations to complete
        await Promise.allSettled(promises)
        // Remove isLoading state change - UI stays responsive
      },

      // Remove selection
      removeSelection: async (category: string) => {
        const state = get()
        if (!state.configuration) return

        const updatedConfig = { ...state.configuration }
        delete updatedConfig[category as keyof Configuration]
        updatedConfig.timestamp = Date.now()
        
        set({ configuration: updatedConfig })
        await get().calculatePrice()
      },

      // Calculate price using backend (debounced for performance)
      calculatePrice: async () => {
        const state = get()
        if (!state.configuration) return

        // Clear existing timeout to debounce rapid calls
        const timeoutId = state.priceCalculationTimeoutId
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

        // Set new timeout for debounced calculation
        const newTimeoutId = setTimeout(async () => {
          try {
            const response = await fetch('/api/pricing/calculate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(state.configuration)
            })
            const data = await response.json()
            
            if (data.success) {
              set({
                currentPrice: data.totalPrice,
                priceBreakdown: data.priceBreakdown,
                configuration: {
                  ...state.configuration!,
                  totalPrice: data.totalPrice
                }
              })
            }
          } catch (error) {
            console.error('Failed to calculate price:', error)
          }
        }, 300) // 300ms debounce

        // Store timeout ID in state for cleanup
        set({ priceCalculationTimeoutId: newTimeoutId })
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