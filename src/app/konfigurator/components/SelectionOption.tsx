'use client'

import { PriceUtils } from '../core/PriceUtils'

interface SelectionOptionProps {
  id: string
  name: string
  description: string
  price?: {
    type: 'base' | 'upgrade' | 'included'
    amount?: number
    monthly?: number
  }
  isSelected?: boolean
  onClick: (id: string) => void
  onUnselect?: (id: string) => void
  canUnselect?: boolean
  disabled?: boolean
  className?: string
}

export default function SelectionOption({ 
  id, 
  name, 
  description, 
  price, 
  isSelected = false, 
  onClick,
  onUnselect,
  canUnselect = false,
  disabled = false,
  className = ''
}: SelectionOptionProps) {
  const renderPrice = () => {
    if (!price) return null
    
    if (price.type === 'included') {
      return (
        <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed">
          <span>inklusive.</span>
        </p>
      )
    }
    
    if (price.type === 'base') {
      const formattedPrice = price.amount ? PriceUtils.formatPrice(price.amount) : '0 €'
      const monthlyPayment = price.amount ? PriceUtils.calculateMonthlyPayment(price.amount) : '0 €'
      
      return (
        <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed">
          Ab {formattedPrice}<br />
          oder {monthlyPayment}<br />
          für 240 Mo.
        </p>
      )
    }
    
    if (price.type === 'upgrade') {
      const formattedPrice = price.amount ? PriceUtils.formatPrice(price.amount) : '0 €'
      const monthlyPayment = price.amount ? PriceUtils.calculateMonthlyPayment(price.amount) : '0 €'
      
      return (
        <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed">
          Aufpreis von<br />
          {formattedPrice} oder {monthlyPayment}<br />
          für 240 Mo.
        </p>
      )
    }
    
    // Default fallback
    return null
  }

  const handleClick = () => {
    if (!disabled) {
      onClick(id)
    }
  }

  const handleUnselect = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the main click
    if (onUnselect && canUnselect) {
      onUnselect(id)
    }
  }

  return (
    <div
      className={`box_selection flex justify-between items-center min-h-[6rem] lg:min-h-[5.5rem] border rounded-[1.2rem] px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] cursor-pointer transition-all duration-200 min-w-0 min-h-[44px] relative ${
        isSelected
          ? 'selected border-[#3D6DE1] shadow-[0_0_0_1px_#3D6DE1] bg-blue-50/50'
          : disabled 
            ? 'border-gray-200 opacity-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-[#3D6DE1] hover:shadow-sm'
      } ${className}`}
      onClick={handleClick}
    >
      {/* Unselect button for selected items that can be unselected */}
      {isSelected && canUnselect && onUnselect && (
        <button
          onClick={handleUnselect}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 z-10 min-w-[24px] min-h-[24px]"
          aria-label={`${name} entfernen`}
          title={`${name} entfernen`}
        >
          ×
        </button>
      )}
      
      <div className="box_selection_name flex-1 min-w-0 pr-4">
        <p className="font-medium text-[clamp(1rem,1.8vw,1.125rem)] tracking-wide leading-tight mb-[0.5em] text-black">
          {name}
        </p>
        <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed text-gray-700">
          {description}
        </p>
      </div>
      <div className="box_selection_price text-right whitespace-nowrap text-black flex-shrink-0">
        {renderPrice()}
      </div>
    </div>
  )
} 