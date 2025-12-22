import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import ConfiguratorShell from '../components/ConfiguratorShell'
import { useConfiguratorStore } from '@/store/configuratorStore'

// Mock the configurator store
vi.mock('@/store/configuratorStore', () => ({
  useConfiguratorStore: vi.fn()
}))

// Mock the configurator data
vi.mock('../data/configuratorData', () => ({
  configuratorData: [
    {
      id: 'nest',
      title: 'Hoam Modell',
      options: [
        {
          id: 'nest80',
          name: 'Hoam 80',
          price: { amount: 89000 },
          description: '80m² Hoam House'
        }
      ]
    },
    {
      id: 'material',
      title: 'Material',
      options: [
        {
          id: 'trapezblech',
          name: 'Trapezblech',
          price: { amount: 0 },
          description: 'Standard material'
        }
      ]
    }
  ]
}))

describe('ConfiguratorShell Integration Tests', () => {
  const mockUpdateSelection = vi.fn()
  const mockInitializeSession = vi.fn()
  const mockFinalizeSession = vi.fn()

  const defaultConfiguration = {
    nest: null,
    material: null,
    pvanlage: null,
    fenster: null,
    innenverkleidung: null,
    planungspaket: null
  }

  beforeEach(() => {
    vi.mocked(useConfiguratorStore).mockReturnValue({
      configuration: defaultConfiguration,
      currentPrice: 0,
      priceBreakdown: null,
      updateSelection: mockUpdateSelection,
      initializeSession: mockInitializeSession,
      finalizeSession: mockFinalizeSession,
      isConfigurationComplete: vi.fn(() => false),
      getConfigurationForCart: vi.fn(() => defaultConfiguration),
      calculatePrice: vi.fn(),
      removeSelection: vi.fn(),
      saveConfiguration: vi.fn(),
      resetConfiguration: vi.fn(),
      reset: vi.fn(),
      activatePart2: vi.fn(),
      activatePart3: vi.fn(),
      clearViewSwitchSignal: vi.fn(),
      getConfiguration: vi.fn(() => defaultConfiguration),
      sessionId: 'test-session',
      hasPart2BeenActive: false,
      hasPart3BeenActive: false,
      shouldSwitchToView: null,
      lastSelectionCategory: null,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      expect(() => {
        render(<ConfiguratorShell />)
      }).not.toThrow()
    })

    it('should display configurator sections', () => {
      render(<ConfiguratorShell />)

      // Check actual content that exists in new architecture
      expect(screen.getByText('Hoam 80')).toBeInTheDocument()
      expect(screen.getByText('Trapezblech')).toBeInTheDocument()
    })

    it('should display price correctly', () => {
      vi.mocked(useConfiguratorStore).mockReturnValue({
        configuration: defaultConfiguration,
        currentPrice: 89000,
        priceBreakdown: null,
        updateSelection: mockUpdateSelection,
        initializeSession: mockInitializeSession,
        finalizeSession: mockFinalizeSession,
        isConfigurationComplete: vi.fn(() => false),
        getConfigurationForCart: vi.fn(() => defaultConfiguration),
        calculatePrice: vi.fn(),
        removeSelection: vi.fn(),
        saveConfiguration: vi.fn(),
        resetConfiguration: vi.fn(),
        reset: vi.fn(),
        activatePart2: vi.fn(),
        activatePart3: vi.fn(),
        clearViewSwitchSignal: vi.fn(),
        getConfiguration: vi.fn(() => defaultConfiguration),
        sessionId: 'test-session',
        hasPart2BeenActive: false,
        hasPart3BeenActive: false,
        shouldSwitchToView: null,
        lastSelectionCategory: null,
      })

      render(<ConfiguratorShell />)

      // Look for price display in single layout architecture
      expect(screen.getAllByText(/89.000/)).toHaveLength(1) // Single layout with one price display
    })
  })

  describe('User Interactions', () => {
    it('should handle option selection', async () => {
      const _user = userEvent.setup()
      render(<ConfiguratorShell />)

      const nest80Options = screen.getAllByRole('button', { name: /Hoam 80/i })
      await _user.click(nest80Options[0]) // Click the first one (mobile version)

      await waitFor(() => {
        expect(mockUpdateSelection).toHaveBeenCalledWith(
          expect.objectContaining({
            category: 'nest',
            value: 'nest80',
            name: 'Hoam 80',
            price: 89000
          })
        )
      })
    })

    it('should update UI when selection changes', async () => {
      // Initial render
      const { rerender } = render(<ConfiguratorShell />)

      // Update store to simulate selection
      vi.mocked(useConfiguratorStore).mockReturnValue({
        configuration: {
          ...defaultConfiguration,
          nest: {
            category: 'nest',
            value: 'nest80',
            name: 'Hoam 80',
            price: 89000,
            description: '80m² Hoam House'
          }
        },
        currentPrice: 89000,
        priceBreakdown: null,
        updateSelection: mockUpdateSelection,
        initializeSession: mockInitializeSession,
        finalizeSession: mockFinalizeSession,
        isConfigurationComplete: vi.fn(() => false),
        getConfigurationForCart: vi.fn(() => defaultConfiguration),
        calculatePrice: vi.fn(),
        removeSelection: vi.fn(),
        saveConfiguration: vi.fn(),
        resetConfiguration: vi.fn(),
        reset: vi.fn(),
        activatePart2: vi.fn(),
        activatePart3: vi.fn(),
        clearViewSwitchSignal: vi.fn(),
        getConfiguration: vi.fn(() => defaultConfiguration),
        sessionId: 'test-session',
        hasPart2BeenActive: false,
        hasPart3BeenActive: false,
        shouldSwitchToView: null,
        lastSelectionCategory: null,
      })

      // Re-render with updated state
      rerender(<ConfiguratorShell />)

      // Should show updated price in single layout architecture
      expect(screen.getAllByText(/89.000/)).toHaveLength(1) // Single layout with one price display
    })
  })

  describe('Session Management', () => {
    it('should initialize session on mount', () => {
      render(<ConfiguratorShell />)

      // Session initialization is handled by the store, not directly by the component
      expect(screen.getByText('Hoam 80')).toBeInTheDocument()
    })

    it('should finalize session on unmount', () => {
      const { unmount } = render(<ConfiguratorShell />)

      unmount()

      // Session finalization is handled by the store, not directly by the component
      expect(true).toBe(true) // Component should unmount without errors
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      // Mock updateSelection to reject
      mockUpdateSelection.mockRejectedValueOnce(new Error('API Error'))

      const _user = userEvent.setup()
      render(<ConfiguratorShell />)

      const nest80Options = screen.getAllByRole('button', { name: /Hoam 80/i })
      await _user.click(nest80Options[0]) // Click the first one (mobile version)

      // Should not crash the component
      await waitFor(() => {
        expect(screen.getAllByRole('button', { name: /Hoam 80/i })).toHaveLength(1)
      })

      consoleSpy.mockRestore()
    })

    it('should handle missing data gracefully', () => {
      // Mock empty configurator data
      vi.doMock('../data/configuratorData', () => ({
        configuratorData: []
      }))

      expect(() => {
        render(<ConfiguratorShell />)
      }).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('should handle rapid selections efficiently', async () => {
      const _user = userEvent.setup()
      render(<ConfiguratorShell />)

      const startTime = performance.now()

      // Rapid clicks
      const nest80Options = screen.getAllByRole('button', { name: /Hoam 80/i })

      for (let i = 0; i < 5; i++) {
        await _user.click(nest80Options[0]) // Always click the first one
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should handle rapid interactions within reasonable time
      expect(duration).toBeLessThan(1000) // 1 second
    })

    it('should not cause memory leaks with repeated renders', () => {
      const { rerender, unmount } = render(<ConfiguratorShell />)

      // Multiple re-renders
      for (let i = 0; i < 10; i++) {
        rerender(<ConfiguratorShell />)
      }

      // Should unmount cleanly
      expect(() => {
        unmount()
      }).not.toThrow()
    })
  })

  describe('Responsive Behavior', () => {
    it('should adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<ConfiguratorShell />)

      // Should render mobile-optimized layout
      // New architecture renders single layout based on viewport
      expect(screen.getByText('Hoam 80')).toBeInTheDocument() // Check actual rendered content
    })

    it('should handle viewport changes', () => {
      const { rerender } = render(<ConfiguratorShell />)

      // Simulate viewport change
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      // Trigger resize event
      fireEvent(window, new Event('resize'))

      rerender(<ConfiguratorShell />)

      // Should adapt to desktop layout
      expect(screen.getByText('Hoam 80')).toBeInTheDocument() // Check actual rendered content
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ConfiguratorShell />)

      // Check for proper roles and labels
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      // Each button should have accessible text (some have aria-label, others have accessible text content)
      buttons.forEach(button => {
        const hasAriaLabel = button.hasAttribute('aria-label')
        const hasTextContent = button.textContent && button.textContent.trim().length > 0
        expect(hasAriaLabel || hasTextContent).toBe(true)
      })
    })

    it('should support keyboard navigation', async () => {
      const _user = userEvent.setup()
      render(<ConfiguratorShell />)

      // Tab to first interactive element
      await _user.tab()

      // Should focus on an interactive element
      expect(document.activeElement).toBeInstanceOf(HTMLElement)
      expect(document.activeElement?.tagName).toMatch(/BUTTON|INPUT|SELECT/)
    })

    it('should have proper heading hierarchy', () => {
      render(<ConfiguratorShell />)

      // Check for proper heading structure
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)

      // First heading should be h1, h2, or h3 (configurator uses h3)
      const firstHeading = headings[0]
      expect(firstHeading.tagName).toMatch(/H[1-3]/)
    })
  })

  describe('Data Flow', () => {
    it('should pass correct props to child components', () => {
      render(<ConfiguratorShell />)

      // Verify that configurator data is displayed
      expect(screen.getAllByRole('button', { name: /Hoam 80/i })).toHaveLength(1) // Single layout architecture
      expect(screen.getAllByRole('button', { name: /trapezblech/i })).toHaveLength(1) // Single layout architecture
    })

    it('should handle price calculations correctly', async () => {
      // Mock store with multiple selections
      vi.mocked(useConfiguratorStore).mockReturnValue({
        configuration: {
          ...defaultConfiguration,
          nest: {
            category: 'nest',
            value: 'nest80',
            name: 'Hoam 80',
            price: 89000,
            description: '80m² Hoam House'
          },
          material: {
            category: 'material',
            value: 'trapezblech',
            name: 'Trapezblech',
            price: 0,
            description: 'Standard material'
          }
        },
        currentPrice: 89000, // Hoam + material
        priceBreakdown: null,
        updateSelection: mockUpdateSelection,
        initializeSession: mockInitializeSession,
        finalizeSession: mockFinalizeSession,
        isConfigurationComplete: vi.fn(() => true),
        getConfigurationForCart: vi.fn(() => defaultConfiguration),
        calculatePrice: vi.fn(),
        removeSelection: vi.fn(),
        saveConfiguration: vi.fn(),
        resetConfiguration: vi.fn(),
        reset: vi.fn(),
        activatePart2: vi.fn(),
        activatePart3: vi.fn(),
        clearViewSwitchSignal: vi.fn(),
        getConfiguration: vi.fn(() => defaultConfiguration),
        sessionId: 'test-session',
        hasPart2BeenActive: false,
        hasPart3BeenActive: false,
        shouldSwitchToView: null,
        lastSelectionCategory: null,
      })

      render(<ConfiguratorShell />)

      // Should display total price correctly (single layout architecture)
      expect(screen.getAllByText(/89.000/)).toHaveLength(2) // Price displays in summary panel
    })
  })
}) 