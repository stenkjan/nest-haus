import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCartStore, type CartItem } from '../cartStore'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

describe('CartStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { getState } = useCartStore
    if (getState().clearCart) {
      act(() => {
        getState().clearCart()
      })
    }
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with empty cart', () => {
      const { result } = renderHook(() => useCartStore())
      
      expect(result.current.items).toEqual([])
      expect(result.current.total).toBe(0)
      expect(result.current.itemCount).toBe(0)
    })

    it('should have all required methods defined', () => {
      const { result } = renderHook(() => useCartStore())
      
      expect(typeof result.current.addItem).toBe('function')
      expect(typeof result.current.removeItem).toBe('function')
      expect(typeof result.current.updateQuantity).toBe('function')
      expect(typeof result.current.clearCart).toBe('function')
      expect(typeof result.current.getItemById).toBe('function')
    })
  })

  describe('Adding Items', () => {
    it('should add item to cart correctly', () => {
      const { result } = renderHook(() => useCartStore())
      
      const testItem = {
        id: 'nest80',
        name: 'NEST 80',
        price: 89000,
        category: 'nest',
        description: '80m² NEST House',
        quantity: 1
      }

      act(() => {
        result.current.addItem(testItem)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0]).toEqual(testItem)
      expect(result.current.total).toBe(89000)
      expect(result.current.itemCount).toBe(1)
    })

    it('should update quantity when adding existing item', () => {
      const { result } = renderHook(() => useCartStore())
      
      const testItem = {
        id: 'nest80',
        name: 'NEST 80',
        price: 89000,
        category: 'nest',
        description: '80m² NEST House',
        quantity: 1
      }

      act(() => {
        result.current.addItem(testItem)
        result.current.addItem(testItem)
      })

      expect(result.current.items).toHaveLength(1)
      const item = result.current.items[0]
      if ('quantity' in item) {
        expect(item.quantity).toBe(2)
      }
      expect(result.current.total).toBe(178000)
      expect(result.current.itemCount).toBe(2)
    })

    it('should handle multiple different items', () => {
      const { result } = renderHook(() => useCartStore())
      
      const items = [
        {
          id: 'nest80',
          name: 'NEST 80',
          price: 89000,
          category: 'nest',
          description: '80m² NEST House',
          quantity: 1
        },
        {
          id: 'pv-standard',
          name: 'PV Standard',
          price: 15000,
          category: 'pvanlage',
          description: 'Standard PV system',
          quantity: 1
        }
      ]

      act(() => {
        items.forEach(item => result.current.addItem(item))
      })

      expect(result.current.items).toHaveLength(2)
      expect(result.current.total).toBe(104000)
      expect(result.current.itemCount).toBe(2)
    })
  })

  describe('Removing Items', () => {
    it('should remove item from cart', () => {
      const { result } = renderHook(() => useCartStore())
      
      const testItem = {
        id: 'nest80',
        name: 'NEST 80',
        price: 89000,
        category: 'nest',
        description: '80m² NEST House',
        quantity: 1
      }

      act(() => {
        result.current.addItem(testItem)
        result.current.removeItem('nest80')
      })

      expect(result.current.items).toHaveLength(0)
      expect(result.current.total).toBe(0)
      expect(result.current.itemCount).toBe(0)
    })

    it('should handle removing non-existent item gracefully', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        result.current.removeItem('non-existent-id')
      })

      expect(result.current.items).toHaveLength(0)
      expect(result.current.total).toBe(0)
    })
  })

  describe('Quantity Updates', () => {
    it('should update item quantity correctly', () => {
      const { result } = renderHook(() => useCartStore())
      
      const testItem = {
        id: 'nest80',
        name: 'NEST 80',
        price: 89000,
        category: 'nest',
        description: '80m² NEST House',
        quantity: 1
      }

      act(() => {
        result.current.addItem(testItem)
        result.current.updateQuantity('nest80', 3)
      })

      const item = result.current.items[0]
      if ('quantity' in item) {
        expect(item.quantity).toBe(3)
      }
      expect(result.current.total).toBe(267000)
      expect(result.current.itemCount).toBe(3)
    })

    it('should remove item when quantity is set to 0', () => {
      const { result } = renderHook(() => useCartStore())
      
      const testItem = {
        id: 'nest80',
        name: 'NEST 80',
        price: 89000,
        category: 'nest',
        description: '80m² NEST House',
        quantity: 1
      }

      act(() => {
        result.current.addItem(testItem)
        result.current.updateQuantity('nest80', 0)
      })

      expect(result.current.items).toHaveLength(0)
      expect(result.current.total).toBe(0)
    })

    it('should handle negative quantities gracefully', () => {
      const { result } = renderHook(() => useCartStore())
      
      const testItem = {
        id: 'nest80',
        name: 'NEST 80',
        price: 89000,
        category: 'nest',
        description: '80m² NEST House',
        quantity: 1
      }

      act(() => {
        result.current.addItem(testItem)
        result.current.updateQuantity('nest80', -1)
      })

      // Should either remove item or set to minimum valid quantity
      expect(result.current.items).toHaveLength(0)
    })
  })

  describe('Cart Operations', () => {
    it('should clear cart completely', () => {
      const { result } = renderHook(() => useCartStore())
      
      const items = [
        {
          id: 'nest80',
          name: 'NEST 80',
          price: 89000,
          category: 'nest',
          description: '80m² NEST House',
          quantity: 1
        },
        {
          id: 'pv-standard',
          name: 'PV Standard',
          price: 15000,
          category: 'pvanlage',
          description: 'Standard PV system',
          quantity: 2
        }
      ]

      act(() => {
        items.forEach(item => result.current.addItem(item))
        result.current.clearCart()
      })

      expect(result.current.items).toHaveLength(0)
      expect(result.current.total).toBe(0)
      expect(result.current.itemCount).toBe(0)
    })

    it('should find item by ID correctly', () => {
      const { result } = renderHook(() => useCartStore())
      
      const testItem = {
        id: 'nest80',
        name: 'NEST 80',
        price: 89000,
        category: 'nest',
        description: '80m² NEST House',
        quantity: 1
      }

      act(() => {
        result.current.addItem(testItem)
      })

      const foundItem = result.current.getItemById('nest80')
      expect(foundItem).toEqual(testItem)

      const notFoundItem = result.current.getItemById('non-existent')
      expect(notFoundItem).toBeUndefined()
    })
  })

  describe('Price Calculations', () => {
    it('should calculate total correctly with multiple items', () => {
      const { result } = renderHook(() => useCartStore())
      
      const items = [
        {
          id: 'nest80',
          name: 'NEST 80',
          price: 89000,
          category: 'nest',
          description: '80m² NEST House',
          quantity: 1
        },
        {
          id: 'pv-standard',
          name: 'PV Standard',
          price: 15000,
          category: 'pvanlage',
          description: 'Standard PV system',
          quantity: 2
        },
        {
          id: 'fenster-standard',
          name: 'Standard Fenster',
          price: 500,
          category: 'fenster',
          description: 'Standard windows',
          quantity: 10
        }
      ]

      act(() => {
        items.forEach(item => result.current.addItem(item))
      })

      // 89000 + (15000 * 2) + (500 * 10) = 89000 + 30000 + 5000 = 124000
      expect(result.current.total).toBe(124000)
      expect(result.current.itemCount).toBe(13) // 1 + 2 + 10
    })

    it('should handle zero-price items correctly', () => {
      const { result } = renderHook(() => useCartStore())
      
      const freeItem = {
        id: 'free-item',
        name: 'Free Item',
        price: 0,
        category: 'material',
        description: 'Free material upgrade',
        quantity: 1
      }

      act(() => {
        result.current.addItem(freeItem)
      })

      expect(result.current.total).toBe(0)
      expect(result.current.itemCount).toBe(1)
    })
  })

  describe('Error Handling', () => {
    it('should handle malformed items gracefully', () => {
      const { result } = renderHook(() => useCartStore())
      
      const malformedItem = {
        id: '',
        name: '',
        price: -1, // Invalid negative price
        category: 'invalid-category' as const,
        description: '',
        quantity: -1
      }

      expect(() => {
        act(() => {
          result.current.addItem(malformedItem)
        })
      }).not.toThrow()

      // Should not add invalid items
      expect(result.current.items).toHaveLength(0)
    })

    it('should validate item data before adding', () => {
      const { result } = renderHook(() => useCartStore())
      
      const invalidItems = [
        // Test various invalid CartItem objects directly
        { id: '', name: 'Test', price: 100, category: 'test', description: 'Test', quantity: 1 }, // Empty ID
        { id: 'test', name: '', price: 100, category: 'test', description: 'Test', quantity: 1 }, // Empty name  
        { id: 'test', name: 'Test', price: -100, category: 'test', description: 'Test', quantity: 1 }, // Negative price
        { id: 'test', name: 'Test', price: 100, category: '', description: 'Test', quantity: 1 }, // Empty category
      ] as CartItem[]

      invalidItems.forEach(item => {
        const initialLength = result.current.items.length
        expect(() => {
          act(() => {
            result.current.addItem(item)
          })
        }).not.toThrow()
        
        // Should not add invalid items - length should remain the same
        expect(result.current.items).toHaveLength(initialLength)
      })

      // Should not add any invalid items
      expect(result.current.items).toHaveLength(0)
    })
  })

  describe('Performance', () => {
    it('should handle large numbers of items efficiently', () => {
      const { result } = renderHook(() => useCartStore())
      
      const startTime = performance.now()
      
      // Add many items
      for (let i = 0; i < 100; i++) {
        const item = {
          id: `item-${i}`,
          name: `Item ${i}`,
          price: 1000 + i,
          category: 'test',
          description: `Test item ${i}`,
          quantity: 1
        }
        
        act(() => {
          result.current.addItem(item)
        })
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.log(`⚡ Added 100 items in ${duration.toFixed(2)}ms`)
      
      expect(result.current.items).toHaveLength(100)
      expect(result.current.itemCount).toBe(100)
      expect(duration).toBeLessThan(1000) // Should complete within 1 second
    })

    it('should handle rapid state updates efficiently', () => {
      const { result } = renderHook(() => useCartStore())
      
      const testItem = {
        id: 'test-item',
        name: 'Test Item',
        price: 1000,
        category: 'test',
        description: 'Test item',
        quantity: 1
      }

      act(() => {
        result.current.addItem(testItem)
      })

      const startTime = performance.now()
      
      // Rapid quantity updates
      for (let i = 1; i <= 50; i++) {
        act(() => {
          result.current.updateQuantity('test-item', i)
        })
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.log(`⚡ 50 quantity updates in ${duration.toFixed(2)}ms`)
      
      const item = result.current.items[0]
      if ('quantity' in item) {
        expect(item.quantity).toBe(50)
      }
      expect(duration).toBeLessThan(500) // Should complete within 500ms
    })
  })

  describe('Persistence', () => {
    it('should attempt to save to localStorage', () => {
      const { result } = renderHook(() => useCartStore())
      
      const testItem = {
        id: 'nest80',
        name: 'NEST 80',
        price: 89000,
        category: 'nest',
        description: '80m² NEST House',
        quantity: 1
      }

      act(() => {
        result.current.addItem(testItem)
      })

      // Should attempt to save to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should handle localStorage errors gracefully', () => {
      const { result } = renderHook(() => useCartStore())
      
      // Mock localStorage to throw error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage quota exceeded')
      })
      
      const testItem = {
        id: 'nest80',
        name: 'NEST 80',
        price: 89000,
        category: 'nest',
        description: '80m² NEST House',
        quantity: 1
      }

      expect(() => {
        act(() => {
          result.current.addItem(testItem)
        })
      }).not.toThrow()

      // Item should still be added to memory
      expect(result.current.items).toHaveLength(1)
    })
  })
}) 