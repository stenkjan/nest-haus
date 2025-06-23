'use client'

import Image from 'next/image'

interface Selection {
  value: string
  name: string
  description?: string
  price: number
  category: string
  image?: string
  quantity?: number
  squareMeters?: number
}

interface SelectionOptionProps {
  option: Selection
  isSelected?: boolean
  onSelect: (option: Selection) => void
  disabled?: boolean
  className?: string
  loading?: boolean
}

export default function SelectionOption({ 
  option, 
  isSelected = false, 
  onSelect,
  disabled = false,
  loading = false,
  className = ''
}: SelectionOptionProps) {
  const formatPrice = (price: number) => {
    // Handle invalid or missing price values
    if (typeof price !== 'number' || isNaN(price)) return '€0'
    if (price === 0) return '€0'
    if (price < 0) return `-€${Math.abs(price).toLocaleString('de-DE')}`
    return `€${price.toLocaleString('de-DE')}`
  }



  const handleClick = () => {
    if (!disabled && !loading) {
      onSelect(option)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!disabled && !loading && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onSelect(option)
    }
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!disabled && !loading) {
      event.preventDefault()
      onSelect(option)
    }
  }

  const getDisplayPrice = () => {
    if (option.quantity && option.quantity > 1) {
      return option.price * option.quantity
    }
    if (option.squareMeters && option.squareMeters > 1) {
      return option.price * option.squareMeters
    }
    return option.price
  }

  return (
    <button
      type="button"
      className={`box_selection flex justify-between items-center min-h-[6rem] lg:min-h-[5.5rem] border rounded-[1.2rem] px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] cursor-pointer transition-all duration-200 min-w-0 min-h-[44px] w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isSelected
          ? 'selected ring-2 ring-blue-500 bg-blue-50 border-blue-500'
          : disabled || loading
            ? 'border-gray-200 opacity-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400'
      } ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onTouchEnd={handleTouchEnd}
      disabled={disabled || loading}
      aria-pressed={isSelected}
      aria-describedby={`option-${option.value}-description`}
      aria-label={option.name}
    >
      <div className="box_selection_name flex-1 min-w-0 pr-4">
        {option.image && (
          <div className="mb-3">
            <Image
              src={option.image}
              alt={option.name}
              width={100}
              height={60}
              className="rounded object-cover"
              data-testid="mock-image"
            />
          </div>
        )}
        <p className="font-medium text-[clamp(1rem,1.8vw,1.125rem)] tracking-wide leading-tight mb-[0.5em] text-black">
          {option.name}
          {option.quantity && option.quantity > 1 && (
            <span className="ml-2 text-sm text-gray-600">Anzahl: {option.quantity}</span>
          )}
        </p>
        <p id={`option-${option.value}-description`} className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed text-gray-700">
          {option.description}
        </p>
      </div>
      <div className="box_selection_price text-right whitespace-nowrap text-black flex-shrink-0">
        {formatPrice(getDisplayPrice())}
      </div>
    </button>
  )
} 