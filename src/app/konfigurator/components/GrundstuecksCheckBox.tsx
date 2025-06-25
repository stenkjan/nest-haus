/**
 * GrundstuecksCheckBox - Property Check Selection Component
 * 
 * Special checkbox component for Grundstücks-Check selection
 * with integrated pricing and monthly payment calculation.
 */

'use client'

import React from 'react'
import { GRUNDSTUECKSCHECK_PRICE } from '@/constants/configurator'
import { PriceUtils } from '../core/PriceUtils'

interface GrundstuecksCheckBoxProps {
  isSelected: boolean
  onClick: () => void
  onUnselect?: () => void
}

// Constants for Grundstückscheck
const GRUNDSTUECKSCHECK_OPTION = {
  value: 'grundstueckscheck',
  name: 'Grundstücks-Check',
  category: 'grundstueckscheck',
  description: 'Prüfung der rechtlichen und baulichen Voraussetzungen deines Grundstücks',
  price: GRUNDSTUECKSCHECK_PRICE
}

export default function GrundstuecksCheckBox({ isSelected, onClick, onUnselect: _onUnselect }: GrundstuecksCheckBoxProps) {
  return (
    <div
      className={`box_selection flex justify-between items-center min-h-[6rem] lg:min-h-[5.5rem] border rounded-[1.2rem] px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] cursor-pointer transition-all duration-200 min-w-0 min-h-[44px] ${
        isSelected
          ? 'selected border-[#3D6DE1] shadow-[0_0_0_1px_#3D6DE1] bg-blue-50/50'
          : 'border-gray-300 hover:border-[#3D6DE1] hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <div className="box_selection_name flex-1 min-w-0 pr-4">
        <p className="font-medium text-[clamp(1rem,1.8vw,1.125rem)] tracking-wide leading-tight mb-[0.5em] text-black">
          {GRUNDSTUECKSCHECK_OPTION.name}
        </p>
        <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed text-gray-700">
          {GRUNDSTUECKSCHECK_OPTION.description}
        </p>
      </div>
      <div className="box_selection_price text-right whitespace-nowrap text-black flex-shrink-0">
        <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed">
          Aufpreis von<br />
          {PriceUtils.formatPrice(GRUNDSTUECKSCHECK_PRICE)} oder {PriceUtils.calculateMonthlyPayment(GRUNDSTUECKSCHECK_PRICE, 240)}<br />
          für 240 Mo.
        </p>
      </div>
    </div>
  )
}

// Export the constants for use in other components
export { GRUNDSTUECKSCHECK_PRICE, GRUNDSTUECKSCHECK_OPTION } 