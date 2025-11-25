import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PriceCalculator } from '@/app/konfigurator/core/PriceCalculator'
import { SessionManager } from '@/lib/session/SessionManager'

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
  isEntwurfMode?: boolean
}

interface ConfiguratorState {
  // Session & Configuration (CLIENT-SIDE ONLY)
  sessionId: string | null
  configuration: Configuration

  // Price calculations (CLIENT-SIDE for efficiency)
  currentPrice: number
  priceBreakdown: PriceBreakdown | null

  // Session interaction tracking (NEW - for price reset behavior)
  hasUserInteracted: boolean
  sessionStartTime: number
  lastActivityTime: number

  // Preview panel progression state (matches old configurator logic)
  hasPart2BeenActive: boolean
  hasPart3BeenActive: boolean

  // View switching state (matches old configurator behavior)
  shouldSwitchToView: string | null
  lastSelectionCategory: string | null

  // Entwurf mode state (simplified konfigurator)
  isEntwurfMode: boolean

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

  // Session tracking (NEW)
  markUserInteraction: () => void
  checkSessionExpiry: () => void
  resetSession: () => void

  // Part activation
  activatePart2: () => void
  activatePart3: () => void

  // View switching
  clearViewSwitchSignal: () => void
  switchToView: (view: string) => void
  determineOptimalView: () => string

  // Entwurf mode
  setEntwurfMode: (mode: boolean) => void
  getEntwurfMode: () => boolean

  // Getters
  getConfiguration: () => Configuration | null
  getConfigurationForCart: () => Configuration | null
  isConfigurationComplete: () => boolean
}

// Session timeout configuration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

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
          price: 0 // inkludiert - no additional cost
        },
        kamindurchzug: null,
        fussbodenheizung: null,
        totalPrice: 0, // Will be calculated on initialization
        timestamp: 0
      },

      currentPrice: 0, // Start at 0€ for new sessions
      priceBreakdown: null,
      
      // Session interaction tracking (NEW)
      hasUserInteracted: false, // No interaction initially
      sessionStartTime: Date.now(),
      lastActivityTime: Date.now(),
      
      hasPart2BeenActive: false,
      hasPart3BeenActive: false,
      shouldSwitchToView: null,
      lastSelectionCategory: null,
      isEntwurfMode: false,

      // Initialize session CLIENT-SIDE ONLY (no API dependency)
      initializeSession: () => {
        // Skip auto-reset in test environment to allow explicit testing
        if (process.env.NODE_ENV === 'test') {
          return;
        }

        // NEW: Check if session should be reset
        get().checkSessionExpiry()

        // BUG FIX: Re-fetch state AFTER checkSessionExpiry() to get updated state
        const state = get()

        // Check if this is a completely new session (no sessionId and no selections)
        const isNewSession = !state.sessionId && !state.configuration.nest;

        // Generate sessionId if missing
        if (!state.sessionId) {
          set({ sessionId: `client_${Date.now()}_${Math.random().toString(36).substring(2)}` })
        }

        // Set default preselections only for completely new sessions
        if (isNewSession) {
          get().setDefaultSelections()
          // DON'T calculate price yet - wait for user interaction
          // Price will remain 0€ until user clicks something
        }
      },

      // Update selection with intelligent view switching and price calculation
      updateSelection: (item: ConfigurationItem) => {
        const state = get()

        // NEW: Mark user interaction on first selection
        if (!state.hasUserInteracted) {
          get().markUserInteraction()
        } else {
          // Update activity time
          set({ lastActivityTime: Date.now() })
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

          // Sync session to server (debounced, non-blocking)
          if (typeof window !== 'undefined') {
            const finalState = get();
            SessionManager.debouncedSync({
              sessionId: finalState.sessionId || '',
              configuration: finalState.configuration,
              currentPrice: finalState.currentPrice,
              timestamp: Date.now(),
            });
          }
        }

        // Optional: Track selection in background (non-blocking, fail-safe)
        if (typeof window !== 'undefined') {
          const finalSessionId = get().sessionId;

          // Only track if we have a valid sessionId
          if (finalSessionId) {
            // Legacy session tracking to /api/sessions/track for SelectionEvents
            fetch('/api/sessions/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId: finalSessionId,
                category: item.category,
                selection: item.value,
                totalPrice: get().currentPrice
              })
            }).catch((error) => {
              // Silently fail - tracking is optional, don't break user experience
              console.warn('⚠️ Selection tracking failed:', error);
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
                  console.warn("⚙️ Configurator tracking API error:", error);
                });
            }
          } else {
            console.warn('⚠️ No sessionId available for tracking selection');
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
        get().calculatePrice()
      },

      // Update checkbox options (kamindurchzug, fussbodenheizung, fundament)
      updateCheckboxOption: (category: 'kamindurchzug' | 'fussbodenheizung' | 'fundament', isChecked: boolean) => {
        const state = get()

        // NEW: Mark user interaction
        if (!state.hasUserInteracted) {
          get().markUserInteraction()
        } else {
          set({ lastActivityTime: Date.now() })
        }

        const updatedConfig: Configuration = {
          ...state.configuration,
          timestamp: Date.now()
        }

        if (isChecked) {
          // Add the option
          const optionData = {
            kamindurchzug: {
              name: 'Kaminschachtvorbereitung',
              price: 887,
              description: 'Durchzug für den Kamin'
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

        // NEW: If user hasn't interacted yet, keep price at 0€
        if (!state.hasUserInteracted) {
          set({
            currentPrice: 0,
            priceBreakdown: null,
            configuration: {
              ...state.configuration,
              totalPrice: 0,
              timestamp: Date.now()
            }
          })
          return
        }

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

      // NEW: Mark that user has interacted with the configurator
      markUserInteraction: () => {
        const state = get()
        
        if (!state.hasUserInteracted) {
          console.log('🎯 First user interaction detected - enabling price calculation')
          set({
            hasUserInteracted: true,
            lastActivityTime: Date.now()
          })
          
          // Recalculate price now that user has interacted
          get().calculatePrice()
        } else {
          // Update activity time
          set({ lastActivityTime: Date.now() })
        }
      },

      // NEW: Check if session should be reset due to expiry or browser close
      checkSessionExpiry: () => {
        if (process.env.NODE_ENV === 'test') {
          return // Skip in test environment
        }

        const now = Date.now()
        const state = get()
        
        // Check if session expired due to inactivity
        if (now - state.lastActivityTime > SESSION_TIMEOUT) {
          console.log('⏰ Session expired due to inactivity - resetting')
          get().resetSession()
          return
        }
        
        // BUG FIX: Check if browser was closed (sessionStorage cleared)
        // Only treat as "browser close" if we have persisted data (not first visit)
        if (typeof window !== 'undefined') {
          const sessionActive = sessionStorage.getItem('nest-haus-session-active')
          const hasPersistedData = state.sessionId || state.hasUserInteracted
          
          // Only reset if sessionStorage is empty BUT we have persisted data
          // (meaning user had a session before, but browser was closed)
          if (!sessionActive && hasPersistedData) {
            console.log('🔄 Browser was closed - resetting session')
            get().resetSession()
          }
          
          // Always set the flag for next time
          sessionStorage.setItem('nest-haus-session-active', 'true')
        }
      },

      // NEW: Reset session to new state (keep visual preselections, zero price)
      resetSession: () => {
        console.log('🔄 Resetting session to new state')
        
        const newSessionId = process.env.NODE_ENV === 'test' ? null : `client_${Date.now()}_${Math.random().toString(36).substring(2)}`
        
        set({
          sessionId: newSessionId,
          hasUserInteracted: false, // Reset interaction flag
          sessionStartTime: Date.now(),
          lastActivityTime: Date.now(),
          currentPrice: 0, // Start at 0€
          priceBreakdown: null,
          hasPart2BeenActive: false,
          hasPart3BeenActive: false,
          shouldSwitchToView: null,
          lastSelectionCategory: null
        })
        
        // Set default selections (visually) but don't calculate price yet
        get().setDefaultSelections()
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
            price: 0 // Basis is inkludiert (updated Nov 2025)
          },
          totalPrice: 0, // No initial price since basis is inkludiert
          timestamp: Date.now()
        }

        set({
          sessionId,
          configuration: defaultConfiguration,

          currentPrice: 0, // No initial price since basis is inkludiert
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
        // NOTE: All prices set to 0 (placeholder) - will be calculated dynamically by PriceCalculator
        const defaultSelections = [
          // Nest 80
          {
            category: 'nest',
            value: 'nest80',
            name: 'Nest. 80',
            price: 0, // Placeholder - calculated dynamically from Google Sheets
            description: '75m² Nutzfläche'
          },
          // Trapezblech (new default)
          {
            category: 'gebaeudehuelle',
            value: 'trapezblech',
            name: 'Trapezblech',
            price: 0, // Placeholder - calculated dynamically from Google Sheets
            description: 'RAL 9005 - 3000 x 1142 mm'
          },
          // Standard (ohne_innenverkleidung) - new default baseline
          {
            category: 'innenverkleidung',
            value: 'ohne_innenverkleidung',
            name: 'Verbaue deine Innenwandpanele selbst',
            price: 0, // Placeholder - calculated dynamically from Google Sheets
            description: ''
          },
          // Standard (ohne_belag) - default flooring
          {
            category: 'fussboden',
            value: 'ohne_belag',
            name: 'Verlege deinen Boden selbst',
            price: 0, // Placeholder - calculated dynamically from Google Sheets
            description: ''
          },
          // Light Belichtungspaket
          {
            category: 'belichtungspaket',
            value: 'light',
            name: 'Light',
            price: 0, // Placeholder - calculated dynamically from Google Sheets
            description: '15% der Nestfläche\nGrundbeleuchtung'
          },
          // PVC Fenster (default)
          {
            category: 'fenster',
            value: 'pvc_fenster',
            name: 'PVC Fenster',
            price: 0, // Placeholder - calculated dynamically from Google Sheets
            description: 'RAL 9016 - Kunststoff'
          },

          // Ohne Heizung (new default for bodenaufbau)
          {
            category: 'bodenaufbau',
            value: 'ohne_heizung',
            name: 'Verlege dein Heizsystem selbst',
            price: 0, // Placeholder - calculated dynamically from Google Sheets
            description: ''
          },

          // Planung Basis (default) - now inkludiert
          {
            category: 'planungspaket',
            value: 'basis',
            name: 'Planung Basis',
            price: 0, // Placeholder - calculated dynamically from Google Sheets
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

        // Price will be calculated by initializeSession() after this returns
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
          lastSelectionCategory: null,
          isEntwurfMode: false
        })

        // Initialize fresh session with defaults
        get().initializeSession()
      },

      // Entwurf mode actions
      setEntwurfMode: (mode: boolean) => {
        console.log("🏗️ ConfiguratorStore: Setting entwurf mode:", mode)
        set({ isEntwurfMode: mode })
      },

      getEntwurfMode: () => {
        return get().isEntwurfMode
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
      version: 2, // Incremented for fussboden description update
      // Skip persistence in test only to prevent state conflicts
      skipHydration: process.env.NODE_ENV === 'test',
      migrate: (persistedState: unknown, version: number) => {
        // Type guard to ensure persistedState is the expected type
        const state = persistedState as PersistedConfiguratorState;

        // Migration for planungspaket price update (v0 → v1)
        // Basis planungspaket is now inkludiert (0€) instead of 10900€
        if (version < 1 && state?.configuration?.planungspaket) {
          const planungspaket = state.configuration.planungspaket;
          // Update basis planungspaket price from 10900 to 0 (inkludiert)
          if (planungspaket.value === 'basis' && planungspaket.price === 10900) {
            planungspaket.price = 0;
            // Subtract from total price if it was included
            if (state.configuration.totalPrice >= 10900) {
              state.configuration.totalPrice -= 10900;
            }
            // Update current price
            if (state.currentPrice && state.currentPrice >= 10900) {
              state.currentPrice -= 10900;
            }
          }
        }

        // Migration for fussboden description update (v1 → v2)
        // Add "Verlege deinen Boden selbst" description to Standard option
        if (version < 2 && state?.configuration?.fussboden) {
          const fussboden = state.configuration.fussboden;
          // Update Standard (ohne_belag) to include description
          if (fussboden.value === 'ohne_belag' && !fussboden.description) {
            fussboden.description = 'Verlege deinen Boden selbst';
          }
        }

        return state;
      },
      partialize: (state) => ({
        sessionId: state.sessionId,
        configuration: state.configuration,
        currentPrice: state.currentPrice,
        priceBreakdown: state.priceBreakdown,
        hasUserInteracted: state.hasUserInteracted, // NEW
        sessionStartTime: state.sessionStartTime, // NEW
        lastActivityTime: state.lastActivityTime, // NEW
        hasPart2BeenActive: state.hasPart2BeenActive,
        hasPart3BeenActive: state.hasPart3BeenActive,
        shouldSwitchToView: state.shouldSwitchToView,
        lastSelectionCategory: state.lastSelectionCategory
      }),
      // Add onRehydrateStorage to ensure price calculation after rehydration
      onRehydrateStorage: () => (state) => {
        if (state && process.env.NODE_ENV !== 'test') {
          // BUG FIX: state is the plain persisted object, not the store
          // We need to use the store instance to call methods
          setTimeout(() => {
            // Get the store instance and recalculate if user has already interacted
            const storeInstance = useConfiguratorStore.getState()
            
            // Only recalculate if user has interacted in previous session
            if (storeInstance.hasUserInteracted) {
              storeInstance.calculatePrice()
            }
          }, 150) // Longer delay to ensure proper hydration
        }
      }
    }
  )
)