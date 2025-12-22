import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Configuration, ConfigurationItem } from './configuratorStore'

export interface CartItem {
  id: string
  name: string
  price: number
  category: string
  description: string
  quantity?: number
  squareMeters?: number
  addedAt?: number
  isFromConfigurator?: boolean
}

// Cart configuration interface - includes all properties needed for cart logic
// This extends the configurator Configuration but adds back the properties needed for cart
export interface CartConfiguration extends Configuration {
  planungspaket?: ConfigurationItem | null
  grundstueckscheck?: ConfigurationItem | null
}

export interface ConfigurationCartItem extends CartConfiguration {
  id: string
  addedAt: number
  isFromConfigurator: boolean
}

export interface AppointmentDetails {
  date: Date
  time: string
  appointmentType: "personal" | "phone"
  customerInfo: {
    name: string
    lastName: string
    phone: string
    email: string
  }
  sessionId?: string | null
  inquiryId?: string
  timeSlotAvailable?: boolean
}

export interface OrderDetails {
  customerInfo: {
    email: string
    name?: string
    phone?: string
    address?: string
  }
  deliveryPreference?: string
  notes?: string
}

interface CartState {
  // Cart items
  items: (CartItem | ConfigurationCartItem)[]

  // Ohne Hoam mode state
  isOhneNestMode: boolean

  // Appointment state
  appointmentDetails: AppointmentDetails | null

  // Order state
  orderDetails: OrderDetails | null
  isProcessingOrder: boolean

  // Computed properties (updated automatically)
  total: number
  itemCount: number

  // Actions
  addConfigurationToCart: (config: Configuration) => void
  addItem: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  removeItem: (itemId: string) => void
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getItemById: (itemId: string) => CartItem | ConfigurationCartItem | undefined

  // Ohne Hoam mode actions
  setOhneNestMode: (isOhneNest: boolean) => void
  getIsOhneNestMode: () => boolean

  // Appointment actions
  setAppointmentDetails: (details: AppointmentDetails) => void
  clearAppointmentDetails: () => void
  getAppointmentSummary: (currentSessionId?: string | null) => string | null
  getAppointmentSummaryShort: (currentSessionId?: string | null) => string | null
  getDeliveryDate: (currentSessionId?: string | null) => Date | null
  getDeliveryDateFormatted: (currentSessionId?: string | null) => string | null
  isAppointmentFromCurrentSession: (currentSessionId?: string | null) => boolean

  // Order actions
  setOrderDetails: (details: OrderDetails) => void
  processOrder: () => Promise<boolean>

  // Private computation helpers
  _computeTotal: () => number
  _computeCount: () => number
  _updateComputedValues: () => void

  // Getters
  getCartTotal: () => number
  getCartCount: () => number
  getCartSummary: () => string
  canProceedToCheckout: () => boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOhneNestMode: false,
      appointmentDetails: null,
      orderDetails: null,
      isProcessingOrder: false,
      total: 0,
      itemCount: 0,

      // Add configuration to cart
      addConfigurationToCart: (config: Configuration) => {
        const cartItem: ConfigurationCartItem = {
          ...config,
          id: `cart_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          addedAt: Date.now(),
          isFromConfigurator: true
        }

        console.log("🛒 CartStore: Adding configuration to cart:", cartItem.nest?.name || "Grundstückscheck")

        set(state => {
          // Remove any existing configurator items to prevent duplicates
          const nonConfiguratorItems = state.items.filter(item => !('isFromConfigurator' in item) || !item.isFromConfigurator)
          const newItems = [...nonConfiguratorItems, cartItem]

          console.log("🛒 CartStore: Items after add:", newItems.length)

          return {
            items: newItems
          }
        })
        // Update computed values after state change
        get()._updateComputedValues()

        // Track cart addition (non-blocking)
        if (typeof window !== 'undefined') {
          if (!config.sessionId) {
            console.warn('⚠️ No sessionId found for cart tracking. Config:', {
              hasNest: !!config.nest,
              hasSessionId: !!config.sessionId,
              sessionIdValue: config.sessionId
            });
          } else {
            console.log('🛒 Tracking cart add for session:', config.sessionId);
            const isOhneNest = get().isOhneNestMode;
            fetch('/api/sessions/track-cart-add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId: config.sessionId,
                configuration: config,
                totalPrice: config.totalPrice || 0,
                isOhneNestMode: isOhneNest
              })
            }).then(response => {
              if (response.ok) {
                console.log('✅ Cart add tracked successfully');
              } else {
                console.error('❌ Cart add tracking failed with status:', response.status);
              }
            }).catch(error => {
              console.warn('⚠️ Cart add tracking failed:', error);
            });
          }
        }
      },

      // Add item to cart (for test compatibility)
      addItem: (item: CartItem) => {
        // Validate item before adding
        if (!item || !item.id || item.id.trim() === '' ||
          typeof item.price !== 'number' || item.price < 0 ||
          !item.name || item.name.trim() === '' ||
          !item.category || item.category.trim() === '') {
          return // Don't add invalid items
        }

        set(state => {
          const existingItemIndex = state.items.findIndex(existing => existing.id === item.id)
          let newItems: (CartItem | ConfigurationCartItem)[]

          if (existingItemIndex >= 0) {
            // Update existing item quantity if it exists and is a regular CartItem
            const updatedItems = [...state.items]
            const existingItem = updatedItems[existingItemIndex]

            if ('quantity' in existingItem && 'quantity' in item) {
              updatedItems[existingItemIndex] = {
                ...existingItem,
                quantity: (existingItem.quantity || 1) + (item.quantity || 1)
              }
            }
            newItems = updatedItems
          } else {
            // Add new item
            newItems = [...state.items, item]
          }

          return {
            items: newItems
          }
        })
        // Update computed values after state change
        get()._updateComputedValues()
      },

      // Remove item from cart
      removeFromCart: (itemId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }))
        get()._updateComputedValues()
      },

      // Remove item (alias for test compatibility)
      removeItem: (itemId: string) => {
        get().removeFromCart(itemId)
      },

      // Update cart item
      updateCartItem: (itemId: string, updates: Partial<CartItem>) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        }))
        get()._updateComputedValues()
      },

      // Update quantity (for test compatibility)
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }))
        get()._updateComputedValues()
      },

      // Get item by ID
      getItemById: (itemId: string) => {
        const state = get()
        return state.items.find(item => item.id === itemId)
      },

      // Clear entire cart
      clearCart: () => {
        console.log("🛒 CartStore: clearCart called")
        console.log("🛒 CartStore: items before clear:", get().items.length)

        // Force complete state reset with explicit empty array
        set(() => ({
          items: [],
          isOhneNestMode: false,
          appointmentDetails: null,
          orderDetails: null,
          isProcessingOrder: false,
          total: 0,
          itemCount: 0
        }))

        console.log("🛒 CartStore: items after clear:", get().items.length)

        // Force state persistence by triggering a new state update
        setTimeout(() => {
          const currentState = get()
          set(() => ({
            ...currentState,
            items: [], // Ensure items are definitely empty
            isOhneNestMode: false,
            total: 0,
            itemCount: 0
          }))
          console.log("🛒 CartStore: items after forced update:", get().items.length)
        }, 50)
      },

      // Set ohne Hoam mode
      setOhneNestMode: (isOhneNest: boolean) => {
        console.log("🏠 CartStore: Setting ohne Hoam mode:", isOhneNest)
        set({ isOhneNestMode: isOhneNest })
      },

      // Get ohne Hoam mode
      getIsOhneNestMode: () => {
        return get().isOhneNestMode
      },

      // Set appointment details
      setAppointmentDetails: (details: AppointmentDetails) => {
        console.log("🗓️ CartStore: Setting appointment details:", details)
        set({ appointmentDetails: details })
      },

      // Clear appointment details
      clearAppointmentDetails: () => {
        console.log("🗓️ CartStore: Clearing appointment details")
        set({ appointmentDetails: null })
      },

      // Check if appointment belongs to current session
      isAppointmentFromCurrentSession: (currentSessionId?: string | null) => {
        const state = get()
        if (!state.appointmentDetails) return false

        // If no sessionId stored with appointment, treat as old appointment (from previous session)
        if (!state.appointmentDetails.sessionId) return false

        // If no current sessionId provided, can't verify - treat as different session
        if (!currentSessionId) return false

        // Check if sessionIds match
        return state.appointmentDetails.sessionId === currentSessionId
      },

      // Get appointment summary
      getAppointmentSummary: (currentSessionId?: string | null) => {
        const state = get()
        if (!state.appointmentDetails) return null

        // Only return summary if appointment belongs to current session
        if (!get().isAppointmentFromCurrentSession(currentSessionId)) return null

        const date = new Date(state.appointmentDetails.date)
        const formattedDate = date.toLocaleDateString('de-DE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })

        return `${formattedDate}, ${state.appointmentDetails.time}`
      },

      // Get appointment summary in short format for price overview
      getAppointmentSummaryShort: (currentSessionId?: string | null) => {
        const state = get()
        if (!state.appointmentDetails) return null

        // Only return summary if appointment belongs to current session
        if (!get().isAppointmentFromCurrentSession(currentSessionId)) return null

        const date = new Date(state.appointmentDetails.date)
        const formattedDate = date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })

        return `${formattedDate}\n${state.appointmentDetails.time} Uhr`
      },

      // Calculate delivery date (6 months after appointment, skipping weekends/holidays)
      getDeliveryDate: (currentSessionId?: string | null) => {
        const state = get()
        if (!state.appointmentDetails) return null

        // Only return delivery date if appointment belongs to current session
        if (!get().isAppointmentFromCurrentSession(currentSessionId)) return null

        const appointmentDate = new Date(state.appointmentDetails.date)

        // Add 6 months
        const deliveryDate = new Date(appointmentDate)
        deliveryDate.setMonth(deliveryDate.getMonth() + 6)

        // Austrian holidays (simplified - major ones)
        const getAustrianHolidays = (year: number) => {
          const holidays = [
            new Date(year, 0, 1),   // New Year's Day
            new Date(year, 0, 6),   // Epiphany
            new Date(year, 4, 1),   // Labour Day
            new Date(year, 7, 15),  // Assumption of Mary
            new Date(year, 9, 26),  // National Day
            new Date(year, 10, 1),  // All Saints' Day
            new Date(year, 11, 8),  // Immaculate Conception
            new Date(year, 11, 25), // Christmas Day
            new Date(year, 11, 26), // St. Stephen's Day
          ]

          // Easter-based holidays (simplified calculation)
          const easter = new Date(year, 2, 21) // Approximate
          holidays.push(
            new Date(easter.getTime() + 1 * 24 * 60 * 60 * 1000), // Easter Monday
            new Date(easter.getTime() + 39 * 24 * 60 * 60 * 1000), // Ascension Day
            new Date(easter.getTime() + 50 * 24 * 60 * 60 * 1000), // Whit Monday
            new Date(easter.getTime() + 60 * 24 * 60 * 60 * 1000), // Corpus Christi
          )

          return holidays
        }

        const isWorkingDay = (date: Date) => {
          const dayOfWeek = date.getDay()
          // 0 = Sunday, 6 = Saturday
          if (dayOfWeek === 0 || dayOfWeek === 6) return false

          const holidays = getAustrianHolidays(date.getFullYear())
          return !holidays.some(holiday =>
            holiday.getDate() === date.getDate() &&
            holiday.getMonth() === date.getMonth() &&
            holiday.getFullYear() === date.getFullYear()
          )
        }

        // Skip to next working day if needed
        while (!isWorkingDay(deliveryDate)) {
          deliveryDate.setDate(deliveryDate.getDate() + 1)
        }

        return deliveryDate
      },

      // Get formatted delivery date
      getDeliveryDateFormatted: (currentSessionId?: string | null) => {
        const deliveryDate = get().getDeliveryDate(currentSessionId)
        if (!deliveryDate) return null

        return deliveryDate.toLocaleDateString('de-DE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },

      // Set order details
      setOrderDetails: (details: OrderDetails) => {
        set({ orderDetails: details })
      },

      // Process order
      processOrder: async () => {
        const state = get()
        if (!state.canProceedToCheckout()) return false

        set({ isProcessingOrder: true })

        try {
          // Create order in backend
          const orderData = {
            items: state.items,
            orderDetails: state.orderDetails,
            totalPrice: state.getCartTotal(),
            timestamp: Date.now()
          }

          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
          })

          const result = await response.json()

          if (result.success) {
            // Save each configuration as customer inquiry
            for (const item of state.items) {
              await fetch('/api/configurations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...item,
                  ...state.orderDetails?.customerInfo,
                  message: state.orderDetails?.notes || 'Bestellung aus Warenkorb'
                })
              })
            }

            // Clear cart after successful order
            set({ items: [], orderDetails: null })
            return true
          }

          return false
        } catch (error) {
          console.error('Failed to process order:', error)
          return false
        } finally {
          set({ isProcessingOrder: false })
        }
      },

      // Calculate total price
      _computeTotal: () => {
        const state = get()
        return state.items.reduce((total, item) => {
          // Configuration cart items have totalPrice
          if ('totalPrice' in item) {
            return total + item.totalPrice
          }

          // Regular cart items have price with quantity/squareMeters
          const itemPrice = item.price || 0
          const quantity = item.quantity || 1
          const squareMeters = item.squareMeters || 1

          // For items with square meters (like windows), multiply by square meters
          if (item.squareMeters) {
            return total + (itemPrice * squareMeters)
          }

          // For items with quantity, multiply by quantity
          return total + (itemPrice * quantity)
        }, 0)
      },

      // Get cart item count
      _computeCount: () => {
        const state = get()
        return state.items.reduce((total, item) => {
          // Configuration cart items count as 1
          if ('totalPrice' in item) {
            return total + 1
          }

          // Regular cart items count by quantity/squareMeters
          const quantity = item.quantity || 1
          const squareMeters = item.squareMeters || 1

          // For items with square meters, count square meters
          if (item.squareMeters) {
            return total + squareMeters
          }

          // For items with quantity, count quantity
          return total + quantity
        }, 0)
      },

      // Get cart summary
      getCartSummary: () => {
        const state = get()
        const total = state.getCartTotal()
        const count = state.getCartCount()

        return `${count} ${count === 1 ? 'Konfiguration' : 'Konfigurationen'} - ${new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR'
        }).format(total)}`
      },

      // Check if can proceed to checkout
      canProceedToCheckout: () => {
        const state = get()
        return state.items.length > 0 && state.orderDetails?.customerInfo.email != null
      },

      // Getters (reactive computed properties)
      getCartTotal: () => get()._computeTotal(),
      getCartCount: () => get()._computeCount(),

      // Private computation helpers
      _updateComputedValues: () => {
        set(_state => ({
          total: get()._computeTotal(),
          itemCount: get()._computeCount()
        }))
      }
    }),
    {
      name: 'cart-storage',
      // Skip persistence in test environment to prevent interference
      skipHydration: process.env.NODE_ENV === 'test',
      partialize: (state) => ({
        items: state.items,
        isOhneNestMode: state.isOhneNestMode,
        appointmentDetails: state.appointmentDetails,
        orderDetails: state.orderDetails
      })
    }
  )
) 