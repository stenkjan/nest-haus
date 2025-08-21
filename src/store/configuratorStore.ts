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
  belichtungspaket?: ConfigurationItem | null
  pvanlage?: ConfigurationItem | null
  fenster?: ConfigurationItem | null
  stirnseite?: ConfigurationItem | null
  totalPrice: number
  timestamp: number
}

export interface PriceBreakdown {
  basePrice: number
  options: Record<string, { name: string; price: number }>
  totalPrice: number
}

// Configuration mode types


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
  setDefaultSelections: () => void

  // Part activation
  activatePart2: () => void
  activatePart3: () => void

  // View switching
  clearViewSwitchSignal: () => void
  switchToView: (view: string) => void
  determineOptimalView: () => string

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
        belichtungspaket: null,
        pvanlage: null,
        fenster: null,
        stirnseite: null,
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

        // Skip auto-reset in test environment to allow explicit testing
        if (process.env.NODE_ENV === 'test') {
          return;
        }

        // Check if this is a completely new session (no sessionId and no selections)
        const isNewSession = !state.sessionId && !state.configuration.nest;

        // Generate sessionId if missing
        if (!state.sessionId) {
          set({ sessionId: `client_${Date.now()}_${Math.random().toString(36).substring(2)}` })
        }

        // Set default preselections only for completely new sessions
        if (isNewSession) {
          get().setDefaultSelections()
        }

        // Calculate price immediately
        get().calculatePrice()
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
        // PRIORITY SYSTEM: Always switch to the most relevant view for the selection
        let shouldSwitchToView: string | null = null;
        let newHasPart2BeenActive = state.hasPart2BeenActive;
        let newHasPart3BeenActive = state.hasPart3BeenActive;

        if (item.category === 'nest' || item.category === 'gebaeudehuelle') {
          // When selecting nest modules or building envelope, switch to exterior view to show modules
          shouldSwitchToView = 'exterior';
        } else if (item.category === 'innenverkleidung' || item.category === 'fussboden') {
          // Activate Part 2 and switch to interior view to show the selection
          if (!state.hasPart2BeenActive) {
            newHasPart2BeenActive = true;
          }
          shouldSwitchToView = 'interior';
        } else if (item.category === 'pvanlage') {
          // Activate Part 3 and switch to exterior view to show gebäudehülle with PV overlay
          if (!state.hasPart3BeenActive) {
            newHasPart3BeenActive = true;
          }
          // Switch to exterior view to show PV modules on the house
          shouldSwitchToView = 'exterior';
        } else if (item.category === 'belichtungspaket') {
          // When selecting belichtungspaket, switch to exterior view to show gebäudehülle
          shouldSwitchToView = 'exterior';
        } else if (item.category === 'fenster') {
          // Activate Part 3 but don't switch views - Fenster has its own info dialog
          if (!state.hasPart3BeenActive) {
            newHasPart3BeenActive = true;
          }
          // No view switching for fenster - stays on current view
          shouldSwitchToView = null;
        } else if (item.category === 'stirnseite') {
          // When selecting any stirnseite option, switch to stirnseite view
          // This includes "keine_verglasung" to show the stirnseite image
          shouldSwitchToView = 'stirnseite';
        }

        // Clear image cache if this is a visual change (nest, gebäudehülle, innenverkleidung, fussboden)
        if (['nest', 'gebaeudehuelle', 'innenverkleidung', 'fussboden'].includes(item.category)) {
          // Import ImageManager dynamically to clear cache when visual configuration changes
          if (typeof window !== 'undefined') {
            import('@/app/konfigurator/core/ImageManager').then(({ ImageManager }) => {
              ImageManager.clearImageCache();
            }).catch(() => {
              // Silently fail - cache clearing is optimization only
            });
          }
        }

        // Update state first
        set({
          configuration: updatedConfiguration,
          hasPart2BeenActive: newHasPart2BeenActive,
          hasPart3BeenActive: newHasPart3BeenActive,
          shouldSwitchToView,
          lastSelectionCategory: item.category
        })

        // SIMPLIFIED: Calculate price immediately and synchronously (avoid unnecessary Effects)
        // Following React docs: "Avoid unnecessary Effects that update state"
        const priceAffectingCategories = ['nest', 'gebaeudehuelle', 'innenverkleidung', 'fussboden', 'pvanlage', 'fenster'];
        if (priceAffectingCategories.includes(item.category)) {
          // Calculate immediately in the same update cycle
          const newState = get();
          const selections = {
            nest: newState.configuration.nest || undefined,
            gebaeudehuelle: newState.configuration.gebaeudehuelle || undefined,
            innenverkleidung: newState.configuration.innenverkleidung || undefined,
            fussboden: newState.configuration.fussboden || undefined,
            pvanlage: newState.configuration.pvanlage || undefined,
            fenster: newState.configuration.fenster || undefined
          };

          const totalPrice = PriceCalculator.calculateTotalPrice(selections as unknown as Record<string, unknown>);
          const priceBreakdown = PriceCalculator.getPriceBreakdown(selections as unknown as Record<string, unknown>);

          // Update price in the same cycle to avoid multiple re-renders
          set({
            currentPrice: totalPrice,
            priceBreakdown,
            configuration: {
              ...newState.configuration,
              totalPrice,
              timestamp: Date.now()
            }
          });
        }

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

        // Determine intelligent view switching after removal
        let shouldSwitchToView: string | null = null;

        if (category === 'fenster') {
          // If fenster is removed, don't switch views - fenster doesn't affect preview panel anymore
          shouldSwitchToView = null;
        } else if (category === 'pvanlage') {
          // If PV is removed, don't switch views - PV doesn't affect preview panel anymore  
          shouldSwitchToView = null;
        } else if (category === 'innenverkleidung' || category === 'fussboden') {
          // If interior elements are removed, stay on interior if we still have some, otherwise switch to exterior
          if (!updatedConfig.innenverkleidung && !updatedConfig.fussboden) {
            shouldSwitchToView = 'exterior';
          }
        }
        // For nest/gebaeudehuelle removal, stay on current view (user might be changing selection)

        set({
          configuration: updatedConfig,
          shouldSwitchToView
        })
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
          fenster: state.configuration.fenster || undefined
        }

        const totalPrice = PriceCalculator.calculateTotalPrice(selections)
        const priceBreakdown = PriceCalculator.getPriceBreakdown(selections)

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

      switchToView: (view: string) => {
        set({ shouldSwitchToView: view })
      },

      // Determine optimal view based on current configuration and user context
      determineOptimalView: () => {
        const state = get()
        const config = state.configuration

        // Priority system for view selection based on available views:
        // 1. If interior selections exist and part2 is active, show interior
        if ((config.innenverkleidung || config.fussboden) && state.hasPart2BeenActive) {
          return 'interior'
        }

        // 2. If nest module or gebäudehülle is selected, show stirnseite as secondary view
        if (config.nest || config.gebaeudehuelle) {
          return 'stirnseite'
        }

        // 3. Default to exterior view (always available and shows nest + gebäudehülle)
        return 'exterior'
      },

      // Reset configuration - NO preselections
      resetConfiguration: () => {

        // Only generate sessionId if not in test environment
        const sessionId = process.env.NODE_ENV === 'test' ? null : `client_${Date.now()}_${Math.random().toString(36).substring(2)}`

        const defaultConfiguration = {
          sessionId: sessionId || '',
          nest: null,
          gebaeudehuelle: null,
          innenverkleidung: null,
          fussboden: null,
          belichtungspaket: null,
          pvanlage: null,
          fenster: null,
          stirnseite: null,
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

        // Set default selections after reset
        get().setDefaultSelections()
        // Calculate price with defaults
        get().calculatePrice()
      },

      // Set default preselections - DISABLED (no preselections wanted)
      setDefaultSelections: () => {
        // Set default selections as requested
        const defaultSelections = [
          // Nest 80
          {
            category: 'nest',
            value: 'nest80',
            name: 'Nest. 80',
            price: 155500,
            description: '75m² Nutzfläche'
          },
          // Holzlattung Lärche
          {
            category: 'gebaeudehuelle',
            value: 'holzlattung',
            name: 'Holzlattung Lärche Natur',
            price: 9600,
            description: 'PEFC-Zertifiziert 5,0 x 4,0 cm\nNatürlich. Ökologisch.'
          },
          // Kiefer
          {
            category: 'innenverkleidung',
            value: 'kiefer',
            name: 'Kiefer',
            price: -1400,
            description: 'PEFC - Zertifiziert - Sicht 1,5 cm'
          },
          // Parkett Eiche
          {
            category: 'fussboden',
            value: 'parkett',
            name: 'Parkett Eiche',
            price: 0,
            description: 'Schwimmend verlegt'
          },
          // Light Belichtungspaket
          {
            category: 'belichtungspaket',
            value: 'light',
            name: 'Light',
            price: 0, // Will be calculated dynamically
            description: '12% der Nestfläche\nGrundbeleuchtung'
          },
          // PVC Fenster
          {
            category: 'fenster',
            value: 'pvc_fenster',
            name: 'PVC Fenster',
            price: 280,
            description: 'RAL 9016 - Kunststoff'
          },
          // Keine Verglasung (default)
          {
            category: 'stirnseite',
            value: 'keine_verglasung',
            name: 'Keine Verglasung',
            price: 0,
            description: 'Geschlossene Stirnseite\nKeine zusätzlichen Fenster'
          }
        ];

        // Apply default selections directly to avoid multiple view switches
        const state = get();

        // Build new configuration with defaults
        const newConfiguration: Configuration = {
          ...state.configuration,
          nest: defaultSelections[0] as ConfigurationItem,
          gebaeudehuelle: defaultSelections[1] as ConfigurationItem,
          innenverkleidung: defaultSelections[2] as ConfigurationItem,
          fussboden: defaultSelections[3] as ConfigurationItem,
          belichtungspaket: defaultSelections[4] as ConfigurationItem,
          fenster: defaultSelections[5] as ConfigurationItem,
          stirnseite: defaultSelections[6] as ConfigurationItem,
          timestamp: Date.now()
        };

        // Update configuration with all defaults at once
        set({
          configuration: newConfiguration,
          shouldSwitchToView: 'exterior', // Show exterior view with defaults
          hasPart2BeenActive: true, // Enable interior view
          hasPart3BeenActive: false // Don't enable part 3 yet
        });

        // Calculate price with all defaults
        get().calculatePrice();
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
        console.log("🔄 ConfiguratorStore: Complete reset")

        // Clear localStorage to force fresh start
        if (typeof window !== 'undefined') {
          localStorage.removeItem('configurator-store')
        }

        // Reset to initial state
        set({
          sessionId: null,
          configuration: {
            sessionId: '',
            nest: null,
            gebaeudehuelle: null,
            innenverkleidung: null,
            fussboden: null,
            belichtungspaket: null,
            pvanlage: null,
            fenster: null,
            stirnseite: null,
            totalPrice: 0,
            timestamp: 0
          },
          currentPrice: 0,
          priceBreakdown: null,
          hasPart2BeenActive: false,
          hasPart3BeenActive: false,
          shouldSwitchToView: null,
          lastSelectionCategory: null
        })

        // Initialize fresh session with defaults
        get().initializeSession()
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

        // Configuration is complete if nest module is selected
        // This allows checkout once a module is chosen
        return !!state.configuration.nest
      }
    }),
    {
      name: 'nest-configurator',
      // Skip persistence in test only to prevent state conflicts
      skipHydration: process.env.NODE_ENV === 'test',
      partialize: (state) => ({
        sessionId: state.sessionId,
        configuration: state.configuration,
        currentPrice: state.currentPrice,
        priceBreakdown: state.priceBreakdown,
        hasPart2BeenActive: state.hasPart2BeenActive,
        hasPart3BeenActive: state.hasPart3BeenActive,
        shouldSwitchToView: state.shouldSwitchToView,
        lastSelectionCategory: state.lastSelectionCategory
      }),
      // Add onRehydrateStorage to ensure price calculation after rehydration
      onRehydrateStorage: () => (state) => {
        if (state && process.env.NODE_ENV !== 'test') {
          // NO preselections - just recalculate price after rehydration
          setTimeout(() => {
            // Always recalculate price after rehydration to ensure consistency
            state.calculatePrice()
          }, 150) // Longer delay to ensure proper hydration
        }
      }
    }
  )
)