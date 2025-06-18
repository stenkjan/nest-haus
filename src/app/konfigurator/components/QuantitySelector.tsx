/**
 * QuantitySelector - Reusable Quantity Selection Component
 * 
 * Handles quantity selection for PV modules and Fenster square meters.
 * Extracted from legacy Configurator.tsx for better reusability.
 */

'use client'

interface QuantitySelectorProps {
  label: string
  value: number
  max: number
  unitPrice: number
  unit?: string
  onChange: (value: number) => void
  className?: string
}

export default function QuantitySelector({ 
  label, 
  value, 
  max,
  unitPrice,
  unit = 'Stück',
  onChange,
  className = ''
}: QuantitySelectorProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleDecrease = () => {
    if (value > 0) {
      onChange(value - 1)
    }
  }

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const totalPrice = value * unitPrice

  return (
    <div className={`mt-[clamp(1rem,2vh,1.5rem)] px-[clamp(1rem,2vw,1.5rem)] ${className}`}>
      <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 mb-[0.5em]">
        {label}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={value <= 0}
            className="bg-gray-200 hover:bg-gray-300 rounded-l min-w-[2.75rem] min-h-[2.75rem] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[1.25rem] h-[1.25rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <span className="bg-gray-100 px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] min-w-[3rem] text-center font-medium text-black text-[clamp(0.875rem,1.4vw,1rem)]">
            {value}
          </span>
          
          <button
            type="button"
            onClick={handleIncrease}
            disabled={value >= max}
            className="bg-gray-200 hover:bg-gray-300 rounded-r min-w-[2.75rem] min-h-[2.75rem] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[1.25rem] h-[1.25rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <div className="ml-[clamp(1rem,2vw,1.5rem)] text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed text-gray-700">
          {formatPrice(totalPrice)}
          {unit !== 'Stück' && ` / ${unit}`}
        </div>
      </div>
    </div>
  )
} 