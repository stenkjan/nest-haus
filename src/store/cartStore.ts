import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Configuration } from './configuratorStore'

export interface CartItem extends Configuration {
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
  items: CartItem[]
  
  // Order state
  orderDetails: OrderDetails | null
  isProcessingOrder: boolean
  
  // Actions
  addConfigurationToCart: (config: Configuration) => void
  removeFromCart: (itemId: string) => void
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => void
  clearCart: () => void
  
  // Order actions
  setOrderDetails: (details: OrderDetails) => void
  processOrder: () => Promise<boolean>
  
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

      // Add configuration to cart
      addConfigurationToCart: (config: Configuration) => {
        const cartItem: CartItem = {
          ...config,
          id: `cart_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          addedAt: Date.now(),
          isFromConfigurator: true
        }

        set(state => ({
          items: [...state.items.filter(item => !item.isFromConfigurator), cartItem]
        }))
      },

      // Remove item from cart
      removeFromCart: (itemId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }))
      },

      // Update cart item
      updateCartItem: (itemId: string, updates: Partial<CartItem>) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        }))
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [], orderDetails: null })
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
      getCartTotal: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.totalPrice, 0)
      },

      // Get cart item count
      getCartCount: () => {
        const state = get()
        return state.items.length
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
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        orderDetails: state.orderDetails
      })
    }
  )
) 