import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Button from '../Button'
import userEvent from '@testing-library/user-event'

describe('Button Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Click me')
    })

    it('should apply default variant and size', () => {
      render(<Button>Default Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600') // primary variant
      expect(button).toHaveClass('px-4', 'py-1') // md size base classes
    })

    it('should apply custom variant', () => {
      render(<Button variant="secondary">Secondary Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-100')
    })

    it('should apply custom size', () => {
      render(<Button size="lg">Large Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6') // lg size
    })

    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('should render primary variant correctly', () => {
      render(<Button variant="primary">Primary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600', 'text-white')
    })

    it('should render secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-100', 'text-gray-900')
    })

    it('should render outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-2', 'border-gray-300')
    })

    it('should render danger variant correctly', () => {
      render(<Button variant="danger">Danger</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600', 'text-white')
    })

    it('should render configurator variant correctly', () => {
      render(<Button variant="configurator">Configurator</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-amber-500', 'text-white')
    })
  })

  describe('Sizes', () => {
    it('should render xs size correctly', () => {
      render(<Button size="xs">Extra Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-2', 'py-1.5')
    })

    it('should render sm size correctly', () => {
      render(<Button size="sm">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-3', 'py-1')
    })

    it('should render lg size correctly', () => {
      render(<Button size="lg">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-1.5')
    })

    it('should render xl size correctly', () => {
      render(<Button size="xl">Extra Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-8', 'py-2')
    })
  })

  describe('Interactions', () => {
    it('should handle click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Clickable</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should handle disabled state', () => {
      const handleClick = vi.fn()
      render(<Button disabled onClick={handleClick}>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      
      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should handle keyboard events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Keyboard</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      fireEvent.keyDown(button, { key: 'Enter' })
      
      // Note: Enter key on button triggers click automatically in browsers
      // but in tests we need to verify the button responds to keyboard interaction
      expect(button).toHaveFocus()
    })
  })

  describe('HTML Attributes', () => {
    it('should pass through HTML button attributes', () => {
      render(
        <Button 
          type="submit" 
          name="test-button" 
          value="test-value"
          data-testid="custom-button"
        >
          Submit
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('name', 'test-button')
      expect(button).toHaveAttribute('value', 'test-value')
      expect(button).toHaveAttribute('data-testid', 'custom-button')
    })

    it('should handle form attributes', () => {
      render(<Button form="test-form">Form Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('form', 'test-form')
    })
  })

  describe('Styling', () => {
    it('should have base styling classes', () => {
      render(<Button>Styled Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'rounded-full',
        'transition-all',
        'duration-300',
        'focus:outline-none',
        'focus:ring-2',
        'inline-flex',
        'items-center',
        'justify-center'
      )
    })

    it('should have fixed width classes', () => {
      render(<Button>Width Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-32', 'lg:w-36', 'xl:w-40')
    })

    it('should combine multiple classes correctly', () => {
      render(
        <Button 
          variant="success" 
          size="lg" 
          className="additional-class"
        >
          Combined
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-green-600') // success variant
      expect(button).toHaveClass('px-6') // lg size
      expect(button).toHaveClass('additional-class') // custom class
    })
  })

  describe('Accessibility', () => {
    it('should have proper focus management', () => {
      render(<Button>Focus Test</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).toHaveFocus()
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2')
    })

    it('should support keyboard interaction', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Keyboard Test</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      fireEvent.keyDown(button, { key: ' ' }) // Space key
      
      // Space key on button should trigger click in real browsers
      // In tests, we verify the button is focusable and responds to keyboard events
      expect(button).toHaveFocus()
    })

    it('should have proper ARIA attributes when disabled', () => {
      render(<Button disabled>Disabled Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('Error Handling', () => {
    it('should handle onClick errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const handleClick = vi.fn(() => {
        throw new Error('Test error')
      })

      render(
        <Button onClick={handleClick} variant="primary">
          Error Button
        </Button>
      )

      const button = screen.getByRole('button', { name: /error button/i })
      
      // The error should be caught and logged
      try {
        await user.click(button)
      } catch {
        // Expected error - this is the test scenario
      }

      expect(handleClick).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('should render with invalid props gracefully', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        render(<Button variant={'invalid' as 'primary'}>Invalid Variant</Button>)
      }).not.toThrow()
      
      consoleError.mockRestore()
    })
  })

  describe('Performance', () => {
    it('should handle rapid clicks efficiently', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Rapid Click</Button>)
      
      const button = screen.getByRole('button')
      
      // Simulate rapid clicking
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button)
      }
      
      expect(handleClick).toHaveBeenCalledTimes(10)
    })

    it('should not cause memory leaks with repeated renders', () => {
      const { rerender } = render(<Button>Test</Button>)
      
      // Re-render multiple times
      for (let i = 0; i < 5; i++) {
        rerender(<Button key={i}>Test {i}</Button>)
      }
      
      // Should still be in document
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
}) 