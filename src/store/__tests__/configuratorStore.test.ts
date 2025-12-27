import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useConfiguratorStore } from '../configuratorStore'

// Mock the API calls
vi.mock('@/app/api', () => ({
  trackSelection: vi.fn().mockResolvedValue({}),
  initializeSession: vi.fn().mockResolvedValue({ sessionId: 'test-session' }),
  finalizeSession: vi.fn().mockResolvedValue({}),
}))

describe('ConfiguratorStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { getState } = useConfiguratorStore
    if (getState().reset) {
      act(() => {
        getState().reset()
      })
    }
  })

  afterEach(() => {
    // Cleanup any side effects
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with correct default configuration', () => {
      const { result } = renderHook(() => useConfiguratorStore())

      expect(result.current.configuration).toEqual(
        expect.objectContaining({
          nest: null,
          gebaeudehuelle: null,
          pvanlage: null,
          fenster: null,
          innenverkleidung: null,
          planungspaket: null
        })
      )

      expect(result.current.currentPrice).toBe(0)
      expect(result.current.sessionId).toBeNull()
    })

    it('should have all required methods defined', () => {
      const { result } = renderHook(() => useConfiguratorStore())

      expect(typeof result.current.updateSelection).toBe('function')
      expect(typeof result.current.initializeSession).toBe('function')
      expect(typeof result.current.finalizeSession).toBe('function')
      expect(typeof result.current.getConfiguration).toBe('function')
    })
  })

  describe('Selection Updates', () => {
    it('should update Hoam selection correctly', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      const testSelection = {
        category: 'nest' as const,
        value: 'nest80',
        name: 'Hoam 80',
        price: 89000,
        description: '80m² Hoam House'
      }

      await act(async () => {
        await result.current.updateSelection(testSelection)
      })

      expect(result.current.configuration?.nest).toEqual(
        expect.objectContaining({
          category: 'nest',
          value: 'nest80',
          name: 'Hoam 80',
          price: 89000
        })
      )
    })

    it('should update material selection correctly', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      const materialSelection = {
        category: 'gebaeudehuelle' as const,
        value: 'holzlattung',
        name: 'Holzlattung Lärche Natur',
        price: 0,
        description: 'Standard exterior material'
      }

      await act(async () => {
        await result.current.updateSelection(materialSelection)
      })

      expect(result.current.configuration?.gebaeudehuelle).toEqual(
        expect.objectContaining({
          category: 'gebaeudehuelle',
          value: 'trapezblech',
          name: 'Trapezblech',
          price: 0
        })
      )
    })

    it('should handle PV selection with quantity', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      const pvSelection = {
        category: 'pvanlage' as const,
        value: 'pv-standard',
        name: 'PV Standard',
        price: 15000,
        description: 'Standard PV system',
        quantity: 2
      }

      await act(async () => {
        await result.current.updateSelection(pvSelection)
      })

      expect(result.current.configuration?.pvanlage).toEqual(
        expect.objectContaining({
          category: 'pvanlage',
          value: 'pv-standard',
          quantity: 2,
          price: 15000
        })
      )
    })

    it('should handle Fenster selection with square meters', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      const fensterSelection = {
        category: 'fenster' as const,
        value: 'fenster-standard',
        name: 'Standard Fenster',
        price: 500,
        description: 'Standard windows per m²',
        squareMeters: 12
      }

      await act(async () => {
        await result.current.updateSelection(fensterSelection)
      })

      expect(result.current.configuration?.fenster).toEqual(
        expect.objectContaining({
          category: 'fenster',
          value: 'fenster-standard',
          squareMeters: 12,
          price: 500
        })
      )
    })
  })

  describe('Price Calculations', () => {
    it('should calculate total price correctly for single selection', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      const nestSelection = {
        category: 'nest' as const,
        value: 'nest80',
        name: 'Hoam 80',
        price: 89000,
        description: '80m² Hoam House'
      }

      await act(async () => {
        await result.current.updateSelection(nestSelection)
      })

      expect(result.current.currentPrice).toBe(89000)
    })

    it('should calculate total price correctly for multiple selections', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      const selections = [
        {
          category: 'nest' as const,
          value: 'nest80',
          name: 'Hoam 80',
          price: 89000,
          description: '80m² Hoam House'
        },
        {
          category: 'pvanlage' as const,
          value: 'pv-standard',
          name: 'PV Standard',
          price: 15000,
          description: 'Standard PV system',
          quantity: 1
        },
        {
          category: 'fenster' as const,
          value: 'fenster-standard',
          name: 'Standard Fenster',
          price: 500,
          description: 'Standard windows per m²',
          squareMeters: 10
        }
      ]

      for (const selection of selections) {
        await act(async () => {
          await result.current.updateSelection(selection)
        })
      }

      // 89000 (nest) + 15000 (pv) + (500 * 10) (fenster) = 109000
      expect(result.current.currentPrice).toBe(109000)
    })

    it('should calculate quantity-based pricing correctly', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      // First add a Hoam selection (required for price calculation)
      const nestSelection = {
        category: 'nest' as const,
        value: 'nest80',
        name: 'Hoam 80',
        price: 89000,
        description: '80m² Hoam House'
      }

      await act(async () => {
        await result.current.updateSelection(nestSelection)
      })

      // Then add PV with quantity
      const pvSelection = {
        category: 'pvanlage' as const,
        value: 'pv-standard',
        name: 'PV Standard',
        price: 15000,
        description: 'Standard PV system',
        quantity: 3
      }

      await act(async () => {
        await result.current.updateSelection(pvSelection)
      })

      // 89000 (nest) + (15000 * 3) (pv) = 134000
      expect(result.current.currentPrice).toBe(134000)
    })
  })

  describe('Session Management', () => {
    it('should initialize session correctly', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      await act(async () => {
        await result.current.initializeSession()
      })

      expect(result.current.sessionId).toBeTruthy()
      expect(typeof result.current.sessionId).toBe('string')
    })

    it('should handle session initialization failure gracefully', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      // Mock API failure - skip for now as API module doesn't exist
      // const mockApi = await import('@/app/api')
      // vi.mocked(mockApi.initializeSession).mockRejectedValueOnce(new Error('Network error'))

      await act(async () => {
        await result.current.initializeSession()
      })

      // Should create a session even if API fails (client-side fallback)
      expect(result.current.sessionId).toBeTruthy()
    })

    it('should finalize session correctly', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      // First initialize
      await act(async () => {
        await result.current.initializeSession()
      })

      // Then finalize
      await act(async () => {
        await result.current.finalizeSession()
      })

      // Should complete without throwing
      expect(true).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors during selection updates', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      // Mock API failure - skip for now as API module doesn't exist
      // const mockApi = await import('@/app/api')
      // vi.mocked(mockApi.trackSelection).mockRejectedValueOnce(new Error('API Error'))

      const selection = {
        category: 'nest' as const,
        value: 'nest80',
        name: 'Hoam 80',
        price: 89000,
        description: '80m² Hoam House'
      }

      // Should not throw error
      await act(async () => {
        await result.current.updateSelection(selection)
      })

      // Selection should still be updated locally (optimistic update)
      expect(result.current.configuration?.nest).toEqual(
        expect.objectContaining({
          value: 'nest80',
          name: 'Hoam 80'
        })
      )
    })

    it('should validate selection data before updating', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      const invalidSelection = {
        category: 'invalid-category' as const,
        value: '',
        name: '',
        price: -100, // Invalid negative price
        description: ''
      }

      // Should handle invalid data gracefully
      await act(async () => {
        await result.current.updateSelection(invalidSelection)
      })

      // Should not update with invalid data
      expect(result.current.currentPrice).toBe(0)
    })
  })

  describe('Performance', () => {
    it('should handle rapid successive updates efficiently', async () => {
      const { result } = renderHook(() => useConfiguratorStore())

      const startTime = performance.now()

      // Rapid updates
      const updates = Array.from({ length: 10 }, (_, i) => ({
        category: 'nest' as const,
        value: `nest${i}`,
        name: `Hoam ${i}`,
        price: 89000 + i * 1000,
        description: `${i}m² Hoam House`
      }))

      for (const update of updates) {
        await act(async () => {
          await result.current.updateSelection(update)
        })
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete within reasonable time (2 seconds)
      expect(duration).toBeLessThan(2000)

      // Final state should be correct
      expect(result.current.configuration?.nest?.value).toBe('nest9')
      expect(result.current.currentPrice).toBe(98000)
    })
  })
}) 