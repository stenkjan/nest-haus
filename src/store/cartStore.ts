import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Configuration } from './configuratorStore'

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

export interface ConfigurationCartItem extends Configuration {
  id: string
  addedAt: number
  isFromConfigurator: boolean
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

        set(state => {
          const newItems = [...state.items.filter(item => !('sessionId' in item) || !item.isFromConfigurator), cartItem]
          return { 
            items: newItems
          }
        })
        // Update computed values after state change
        get()._updateComputedValues()
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
        set({ items: [], orderDetails: null })
        get()._updateComputedValues()
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
        orderDetails: state.orderDetails
      })
    }
  )
) 