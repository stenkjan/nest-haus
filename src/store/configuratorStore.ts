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
  planungspaket?: ConfigurationItem | null
  kamindurchzug?: ConfigurationItem | null
  fussbodenheizung?: ConfigurationItem | null
  bodenaufbau?: ConfigurationItem | null
  geschossdecke?: ConfigurationItem | null
  fundament?: ConfigurationItem | null
  totalPrice: number
  timestamp: number
}

export interface PriceBreakdown {
  basePrice: number
  options: Record<string, { name: string; price: number }>
  totalPrice: number
}

// Configuration mode types

// Type for persisted state in migration function
interface PersistedConfiguratorState {
  sessionId?: string | null
  configuration?: Configuration
  currentPrice?: number
  priceBreakdown?: PriceBreakdown | null
  hasPart2BeenActive?: boolean
  hasPart3BeenActive?: boolean
  shouldSwitchToView?: string | null
  lastSelectionCategory?: string | null
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
  updateCheckboxOption: (category: 'kamindurchzug' | 'fussbodenheizung' | 'fundament', isChecked: boolean) => void
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
        planungspaket: {
          category: 'planungspaket',
          value: 'basis',
          name: 'Planung Basis',
          price: 10900
        },
        kamindurchzug: null,
        fussbodenheizung: null,
        totalPrice: 10900,
        timestamp: 0
      },

      currentPrice: 10900,
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

        // DEBUG: Log session initialization
        console.log("🔧 DEBUG: initializeSession called", {
          hasSessionId: !!state.sessionId,
          hasNest: !!state.configuration.nest,
          isNewSession,
          currentConfig: state.configuration
        });

        // Generate sessionId if missing
        if (!state.sessionId) {
          console.log("🔧 DEBUG: Generating new sessionId");
          set({ sessionId: `client_${Date.now()}_${Math.random().toString(36).substring(2)}` })
        }

        // Set default preselections only for completely new sessions
        if (isNewSession) {
          console.log("🔧 DEBUG: Setting default selections for new session");
          get().setDefaultSelections()
        } else {
          console.log("🔧 DEBUG: Skipping default selections - existing session");
        }

        // Calculate price immediately
        get().calculatePrice()
      },

      // Update selection with intelligent view switching and price calculation
      updateSelection: (item: ConfigurationItem) => {
        const state = get()

        // DEBUG: Log the selection being updated
        console.log("🔧 DEBUG: Updating selection:", item);
        console.log("🔧 DEBUG: Current config before update:", state.configuration[item.category as keyof Configuration]);
        if (item.category === 'gebaeudehuelle') {
          console.log("🔧 DEBUG: Gebäudehülle selection:", item);
        }

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

        // Force cart sync for planungspaket changes
        if (item.category === "planungspaket" && typeof window !== 'undefined') {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("planungspaket-changed"));
          }, 100);
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
          // Activate Part 3 and switch to interior view to show material combinations with fenster overlay
          if (!state.hasPart3BeenActive) {
            newHasPart3BeenActive = true;
          }
          // Switch to interior view to show fenster material overlay on interior combinations
          shouldSwitchToView = 'interior';
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
        console.log("🔧 DEBUG: Configuration updated, new bodenaufbau:", updatedConfiguration.bodenaufbau);

        // SIMPLIFIED: Calculate price immediately and synchronously (avoid unnecessary Effects)
        // Following React docs: "Avoid unnecessary Effects that update state"
        const priceAffectingCategories = ['nest', 'gebaeudehuelle', 'innenverkleidung', 'fussboden', 'belichtungspaket', 'pvanlage', 'fenster', 'stirnseite', 'planungspaket', 'bodenaufbau', 'geschossdecke'];
        if (priceAffectingCategories.includes(item.category)) {
          // Calculate immediately in the same update cycle
          const newState = get();
          const selections = {
            nest: newState.configuration.nest || undefined,
            gebaeudehuelle: newState.configuration.gebaeudehuelle || undefined,
            innenverkleidung: newState.configuration.innenverkleidung || undefined,
            fussboden: newState.configuration.fussboden || undefined,
            belichtungspaket: newState.configuration.belichtungspaket || undefined,
            pvanlage: newState.configuration.pvanlage || undefined,
            fenster: newState.configuration.fenster || undefined,
            stirnseite: newState.configuration.stirnseite || undefined,
            planungspaket: newState.configuration.planungspaket || undefined,
            kamindurchzug: newState.configuration.kamindurchzug || undefined,
            fussbodenheizung: newState.configuration.fussbodenheizung || undefined,
            bodenaufbau: newState.configuration.bodenaufbau || undefined,
            geschossdecke: newState.configuration.geschossdecke || undefined,
            fundament: newState.configuration.fundament || undefined
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
          // Legacy session tracking
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

          // Alpha test session tracking
          const testSessionId = localStorage.getItem("nest-haus-test-session-id");
          if (testSessionId) {
            const trackingData = {
              category: item.category,
              value: item.value,
              name: item.name,
              price: item.price,
              totalPrice: get().currentPrice,
              path: window.location.pathname,
              timestamp: Date.now()
            };

            console.log("⚙️ Configurator: Tracking selection:", {
              testId: testSessionId,
              category: item.category,
              value: item.value,
              name: item.name
            });

            // Send directly to API (can't use hooks in store)
            fetch('/api/usability-test/track-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                testId: testSessionId,
                eventType: 'configurator_selection',
                data: trackingData,
                timestamp: Date.now()
              })
            })
              .then(response => {
                console.log("⚙️ Configurator tracking API response:", {
                  status: response.status,
                  ok: response.ok,
                  category: item.category
                });
                return response.json();
              })
              .then(result => {
                console.log("⚙️ Configurator tracking API result:", result);
              })
              .catch(error => {
                console.error("⚙️ Configurator tracking API error:", error);
              });
          } else {
            console.log("⚙️ Configurator: No test session ID found for tracking");
          }
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
        console.log("🔧 DEBUG: Configuration updated, new bodenaufbau:", updatedConfig.bodenaufbau);
        get().calculatePrice()
      },

      // Update checkbox options (kamindurchzug, fussbodenheizung, fundament)
      updateCheckboxOption: (category: 'kamindurchzug' | 'fussbodenheizung' | 'fundament', isChecked: boolean) => {
        const state = get()

        const updatedConfig: Configuration = {
          ...state.configuration,
          timestamp: Date.now()
        }

        if (isChecked) {
          // Add the option
          const optionData = {
            kamindurchzug: {
              name: 'Kamindurchzug',
              price: 2000,
              description: 'Vorbereitung für Kaminanschluss'
            },
            fussbodenheizung: {
              name: 'Fußbodenheizung',
              price: 5000,
              description: 'Elektrische Fußbodenheizung'
            },
            fundament: {
              name: 'Fundament',
              price: 5000, // Base price, will be calculated dynamically in PriceCalculator
              description: 'Fundamentvorbereitung'
            }
          }

          updatedConfig[category] = {
            category,
            value: 'enabled',
            name: optionData[category].name,
            price: optionData[category].price,
            description: optionData[category].description
          }
        } else {
          // Remove the option
          updatedConfig[category] = null
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
          belichtungspaket: state.configuration.belichtungspaket || undefined,
          pvanlage: state.configuration.pvanlage || undefined,
          fenster: state.configuration.fenster || undefined,

          planungspaket: state.configuration.planungspaket || undefined,
          kamindurchzug: state.configuration.kamindurchzug || undefined,
          fussbodenheizung: state.configuration.fussbodenheizung || undefined,
          bodenaufbau: state.configuration.bodenaufbau || undefined,
          geschossdecke: state.configuration.geschossdecke || undefined,
          fundament: state.configuration.fundament || undefined
        }

        console.log('🔧 DEBUG: Store selections for price calc:', selections);
        console.log('🔧 DEBUG: Bodenaufbau in store:', state.configuration.bodenaufbau);
        console.log('🔧 DEBUG: Geschossdecke in store:', state.configuration.geschossdecke);
        const totalPrice = PriceCalculator.calculateTotalPrice(selections)
        const priceBreakdown = PriceCalculator.getPriceBreakdown(selections)
        console.log('💰 DEBUG: Total price result:', totalPrice);

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
          planungspaket: {
            category: 'planungspaket',
            value: 'basis',
            name: 'Planung Basis',
            price: 10900
          },
          totalPrice: 10900,
          timestamp: Date.now()
        }

        set({
          sessionId,
          configuration: defaultConfiguration,

          currentPrice: 10900,
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
          // Trapezblech (new default)
          {
            category: 'gebaeudehuelle',
            value: 'trapezblech',
            name: 'Trapezblech',
            price: -9600,
            description: 'RAL 9005 - 3000 x 1142 mm'
          },
          // Kiefer
          {
            category: 'innenverkleidung',
            value: 'kiefer',
            name: 'Kiefer',
            price: -1400,
            description: 'PEFC - Zertifiziert - Sicht 1,5 cm'
          },
          // Ohne Parkett (new default)
          {
            category: 'fussboden',
            value: 'ohne_parkett',
            name: 'Ohne Parkett',
            price: 0,
            description: 'Kein Bodenbelag'
          },
          // Light Belichtungspaket
          {
            category: 'belichtungspaket',
            value: 'light',
            name: 'Light',
            price: 0, // Will be calculated dynamically
            description: '12% der Nestfläche\nGrundbeleuchtung'
          },
          // Holz Fenster (default)
          {
            category: 'fenster',
            value: 'holz',
            name: 'Holz',
            price: 400,
            description: 'Holzfenster Fichte'
          },

          // Ohne Heizung (new default for bodenaufbau)
          {
            category: 'bodenaufbau',
            value: 'ohne_heizung',
            name: 'Ohne Heizung',
            price: 0,
            description: 'Kein Heizungssystem im Boden'
          },

          // Planung Basis (default) - now has a price
          {
            category: 'planungspaket',
            value: 'basis',
            name: 'Planung Basis',
            price: 10900,
            description: 'Einreichplanung (Raumteilung)\nFachberatung und Baubegleitung'
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
          bodenaufbau: defaultSelections[6] as ConfigurationItem,
          planungspaket: defaultSelections[7] as ConfigurationItem,
          stirnseite: null, // No default stirnseite
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
            planungspaket: null,
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
      version: 1, // Added version for planungspaket price migration
      // Skip persistence in test only to prevent state conflicts
      skipHydration: process.env.NODE_ENV === 'test',
      migrate: (persistedState: unknown, version: number) => {
        // Type guard to ensure persistedState is the expected type
        const state = persistedState as PersistedConfiguratorState;

        // Migration for planungspaket price update
        if (version === 0 && state?.configuration?.planungspaket) {
          const planungspaket = state.configuration.planungspaket;
          // Update basis planungspaket price from 0 to 10900
          if (planungspaket.value === 'basis' && planungspaket.price === 0) {
            planungspaket.price = 10900;
            // Also update total price if it was just the planungspaket
            if (state.configuration.totalPrice === 0) {
              state.configuration.totalPrice = 10900;
            } else {
              state.configuration.totalPrice += 10900;
            }
            // Update current price
            if (state.currentPrice === 0) {
              state.currentPrice = 10900;
            } else if (state.currentPrice !== undefined) {
              state.currentPrice += 10900;
            }
          }
        }
        return state;
      },
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