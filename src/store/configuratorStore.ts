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
  
  // Preview panel progression state (matches old configurator logic)
  hasPart2BeenActive: boolean
  hasPart3BeenActive: boolean
  
  // Actions
  initializeSession: () => void
  updateSelection: (item: ConfigurationItem) => void
  removeSelection: (category: string) => void
  calculatePrice: () => void
  saveConfiguration: (userDetails?: Record<string, unknown>) => Promise<boolean>
  resetConfiguration: () => void
  finalizeSession: () => void
  
  // Part activation
  activatePart2: () => void
  activatePart3: () => void
  
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
      hasPart2BeenActive: false,
      hasPart3BeenActive: false,

      // Initialize session CLIENT-SIDE ONLY (no API dependency)
      initializeSession: () => {
        const state = get()
        
        // DEV MODE: Always reset to prevent state persistence across reloads
        if (process.env.NODE_ENV === 'development') {
          console.debug('🔄 DEV: Forcing fresh configurator state');
          get().resetConfiguration()
          return;
        }
        
        if (state.sessionId) {
          return; // Already initialized in production
        }

        // Initialize with complete default configuration matching old configurator
        get().resetConfiguration()
      },

      // Update selection - FULLY CLIENT-SIDE (no API calls)
      updateSelection: (item: ConfigurationItem) => {
        const state = get()
        if (!state.sessionId || !state.configuration) {
          console.warn('⚠️ ConfiguratorStore: Cannot update selection - no session or configuration')
          return;
        }
        
        console.debug('🔧 ConfiguratorStore: Updating selection', {
          category: item.category,
          value: item.value,
          name: item.name,
          previousValue: state.configuration[item.category as keyof Configuration]?.value
        })
        
        // Update local state immediately
        const updatedConfig = {
          ...state.configuration,
          [item.category]: item,
          timestamp: Date.now()
        }
        
        // Part activation logic (matches old configurator behavior)
        let newState: Partial<ConfiguratorState> = { configuration: updatedConfig }
        
        // Activate Part 2 when innenverkleidung is selected (matches old logic)
        if (item.category === 'innenverkleidung' && !state.hasPart2BeenActive) {
          console.debug('🎨 ConfiguratorStore: Activating Part 2 (interior view enabled)')
          newState.hasPart2BeenActive = true
        }
        
        // Activate Part 3 when PV or Fenster is selected (matches old logic)
        if ((item.category === 'pvanlage' || item.category === 'fenster') && !state.hasPart3BeenActive) {
          console.debug('⚡ ConfiguratorStore: Activating Part 3 (PV/Fenster views enabled)')
          newState.hasPart3BeenActive = true
        }
        
        set(newState)

        // Clear ImageManager cache when key visual properties change (temporarily disabled for debugging)
        // if (['nest', 'gebaeudehuelle', 'innenverkleidung', 'fussboden'].includes(item.category)) {
        //   if (typeof window !== 'undefined') {
        //     // Use dynamic import to avoid SSR issues
        //     import('@/app/konfigurator/core/ImageManager').then(({ ImageManager }) => {
        //       ImageManager.clearImageCache()
        //       console.debug('🗑️ ConfiguratorStore: Cleared image cache for visual change')
        //     }).catch(() => {
        //       // Silently fail - cache clearing is optional
        //     })
        //   }
        // }

        // Calculate price immediately using client-side logic
        get().calculatePrice()

        console.debug('✅ ConfiguratorStore: Selection updated', {
          category: item.category,
          totalPrice: get().currentPrice,
          hasPart2Active: get().hasPart2BeenActive,
          hasPart3Active: get().hasPart3BeenActive
        })

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
        if (!state.configuration) {
          return;
        }

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

      // Part activation functions
      activatePart2: () => {
        set({ hasPart2BeenActive: true })
      },

      activatePart3: () => {
        set({ hasPart3BeenActive: true })
      },

      // Reset configuration - Complete defaults matching old configurator
      resetConfiguration: () => {
        const sessionId = `client_${Date.now()}_${Math.random().toString(36).substring(2)}`
        
        console.debug('🔄 ConfiguratorStore: Resetting to default configuration');
        
        set({
          sessionId,
          configuration: {
            sessionId,
            // Complete default selections matching old configurator exactly
            nest: {
              category: 'nest',
              value: 'nest80',
              name: 'Nest 80',
              price: 155500,
              description: '80m² Nutzfläche'
            },
            gebaeudehuelle: {
              category: 'gebaeudehuelle', 
              value: 'trapezblech',
              name: 'Trapezblech',
              price: 0,
              description: 'RAL 9005 - 3000 x 1142 mm'
            },
            innenverkleidung: {
              category: 'innenverkleidung',
              value: 'kiefer', 
              name: 'Kiefer',
              price: 0,
              description: 'PEFC - Zertifiziert - Sicht 1,5 cm'
            },
            fussboden: {
              category: 'fussboden',
              value: 'parkett',
              name: 'Parkett Eiche', 
              price: 0,
              description: 'Schwimmend verlegt'
            },
            totalPrice: 155500,
            timestamp: Date.now()
          },
          hasPart2BeenActive: false,
          hasPart3BeenActive: false,
          currentPrice: 155500,
          priceBreakdown: null
        })
        
        // Clear ImageManager cache to ensure fresh image loading (temporarily disabled for debugging)
        // if (typeof window !== 'undefined') {
        //   // Use dynamic import to avoid SSR issues
        //   import('@/app/konfigurator/core/ImageManager').then(({ ImageManager }) => {
        //     ImageManager.clearImageCache()
        //   }).catch(() => {
        //     // Silently fail - cache clearing is optional
        //   })
        // }
        
        // Calculate price
        get().calculatePrice()
        
        console.debug('✅ ConfiguratorStore: Reset complete', get().configuration)
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
        priceBreakdown: state.priceBreakdown,
        hasPart2BeenActive: state.hasPart2BeenActive,
        hasPart3BeenActive: state.hasPart3BeenActive
      })
    }
  )
) 