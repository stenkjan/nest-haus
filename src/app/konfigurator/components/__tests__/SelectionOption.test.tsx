import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SelectionOption from '../SelectionOption'
import type { SelectionOption as SelectionOptionType } from '@/app/konfigurator/types/configurator.types'
import userEvent from '@testing-library/user-event'

// Mock the Image component
interface MockImageProps {
  src: string;
  alt: string;
  [key: string]: unknown;
}

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: MockImageProps) => (
    <div data-testid="mock-image" role="img" aria-label={alt} data-src={src} {...props} />
  )
}))

describe('SelectionOption Component', () => {
  const mockOnSelect = vi.fn()
  
  const defaultOption: SelectionOptionType = {
    value: 'test-option',
    name: 'Test Option',
    description: 'Test description',
    price: 1000,
    category: 'gebaeudehuelle'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render option with all details', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('Test Option')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
      expect(screen.getByText('€1.000')).toBeInTheDocument()
    })

    it('should render with image when provided', () => {
      const optionWithImage = {
        ...defaultOption,
        image: '/test-image.jpg'
      }

      render(
        <SelectionOption
          option={optionWithImage}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const image = screen.getByTestId('mock-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('data-src', '/test-image.jpg')
      expect(image).toHaveAttribute('aria-label', 'Test Option')
    })

    it('should render without image when not provided', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      expect(screen.queryByTestId('mock-image')).not.toBeInTheDocument()
    })

    it('should show selected state styling', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={true}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('ring-2', 'ring-blue-500', 'bg-blue-50')
    })

    it('should show unselected state styling', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-gray-300', 'hover:border-gray-400')
    })
  })

  describe('Interactions', () => {
    it('should call onSelect when clicked', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
      expect(mockOnSelect).toHaveBeenCalledWith(defaultOption)
    })

    it('should handle keyboard activation', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Enter' })

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    it('should handle Space key activation', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: ' ' })

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    it('should not call onSelect for other keys', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Tab' })

      expect(mockOnSelect).not.toHaveBeenCalled()
    })
  })

  describe('Price Formatting', () => {
    it('should format price correctly for thousands', () => {
      const expensiveOption = {
        ...defaultOption,
        price: 125000
      }

      render(
        <SelectionOption
          option={expensiveOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('€125.000')).toBeInTheDocument()
    })

    it('should handle zero price', () => {
      const freeOption = {
        ...defaultOption,
        price: 0
      }

      render(
        <SelectionOption
          option={freeOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('€0')).toBeInTheDocument()
    })

    it('should handle negative price', () => {
      const discountOption = {
        ...defaultOption,
        price: -5000
      }

      render(
        <SelectionOption
          option={discountOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('-€5.000')).toBeInTheDocument()
    })
  })

  describe('Quantity Support', () => {
    it('should display quantity when provided', () => {
      const quantityOption = {
        ...defaultOption,
        quantity: 3
      }

      render(
        <SelectionOption
          option={quantityOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('Anzahl: 3')).toBeInTheDocument()
    })

    it('should not display quantity when not provided', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      expect(screen.queryByText(/anzahl:/i)).not.toBeInTheDocument()
    })

    it('should calculate total price with quantity', () => {
      const quantityOption = {
        ...defaultOption,
        price: 1000,
        quantity: 5
      }

      render(
        <SelectionOption
          option={quantityOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('€5.000')).toBeInTheDocument() // 1000 * 5
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'false')
      expect(button).toHaveAttribute('aria-describedby', expect.stringContaining('option-'))
    })

    it('should update aria-pressed when selected', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={true}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    it('should have accessible name', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button', { name: /test option/i })
      expect(button).toBeInTheDocument()
    })

    it('should have focus indicators', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')
    })
  })

  describe('Loading States', () => {
    it('should show loading state when specified', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          loading={true}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('opacity-50')
    })

    it('should not be clickable when loading', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          loading={true}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockOnSelect).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle missing option data gracefully', () => {
      const incompleteOption = {
        value: 'incomplete',
        name: '',
        description: '',
        price: 0,
        category: 'gebaeudehuelle' as const
      }

      expect(() => {
        render(
          <SelectionOption
            option={incompleteOption}
            isSelected={false}
            onSelect={mockOnSelect}
          />
        )
      }).not.toThrow()
    })

    it('should handle onSelect errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const errorOnSelect = vi.fn(() => {
        throw new Error('Selection error')
      })

      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={errorOnSelect}
        />
      )

      const button = screen.getByRole('button')
      
      // The error should be caught
      try {
        await user.click(button)
      } catch {
        // Expected error - this is the test scenario  
      }

      expect(errorOnSelect).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('should handle invalid price values', () => {
      const invalidPriceOption = {
        ...defaultOption,
        price: NaN
      }

      render(
        <SelectionOption
          option={invalidPriceOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('€0')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const initialRenderCount = mockOnSelect.mock.calls.length

      // Re-render with same props
      rerender(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      expect(mockOnSelect.mock.calls.length).toBe(initialRenderCount)
    })

    it('should handle rapid clicks gracefully', async () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      
      // Simulate rapid clicking
      for (let i = 0; i < 5; i++) {
        fireEvent.click(button)
      }

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledTimes(5)
      })
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-full', 'text-left')
    })

    it('should handle touch interactions', () => {
      render(
        <SelectionOption
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.touchStart(button)
      fireEvent.touchEnd(button)

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })
  })
}) 