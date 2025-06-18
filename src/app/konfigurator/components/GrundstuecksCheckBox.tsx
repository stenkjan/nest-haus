/**
 * GrundstuecksCheckBox - Property Check Selection Component
 * 
 * Specialized selection component for the property check service.
 * Extracted from legacy Configurator.tsx for better modularity.
 */

'use client'

import React from 'react'
import { GRUNDSTUECKSCHECK_PRICE } from '@/constants/configurator'
import { PriceUtils } from '../core/PriceUtils'

interface GrundstuecksCheckBoxProps {
  isSelected: boolean
  onClick: () => void
}

// Constants for Grundstückscheck
const GRUNDSTUECKSCHECK_OPTION = {
  value: 'grundstueckscheck',
  name: 'Grundstücks-Check',
  category: 'grundstueckscheck',
  description: 'Wir prüfen dein Grundstück auf rechtliche und technische Rahmenbedingungen.\n\nKein Risiko – 14 Tage Rückgaberecht.\n\nHäuser bauen bedeutet, sich an bestimmte Spielregeln zu halten – und diese können je nach Region unterschiedlich sein. Wir kennen die gesetzlichen Vorgaben genau und unterstützen dich dabei, die Anforderungen deines Baugrunds zu verstehen.\n\nMit unserem Grundstückscheck prüfen wir, welche Gegebenheiten du bei deinem Wunschgrundstück beachten musst. Gib einfach die relevanten Informationen ein, und wir liefern dir zeitnah ein umfassendes Feedback. So kannst du dein Projekt sicher und fundiert planen.\n\nSollte unser Nest auf Grund rechtlicher Rahmenbedingungen nicht zu deinem Grundstück passen, erhältst du deine Anzahlung zurück.',
  price: GRUNDSTUECKSCHECK_PRICE
}

export default function GrundstuecksCheckBox({ isSelected, onClick }: GrundstuecksCheckBoxProps) {
  return (
    <div
      className={`box_selection_service flex flex-col border rounded-[19px] px-6 py-4 cursor-pointer transition-colors ${
        isSelected 
          ? 'selected border-[#3D6DE1] shadow-[0_0_0_1px_#3D6DE1]' 
          : 'border-gray-300 hover:border-[#3D6DE1]'
      }`}
      style={{ marginBottom: 24, background: '#fff', userSelect: 'none' }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm leading-4 tracking-[0.03em] text-black">
          Grundstücks-Check
        </h4>
        <div className="text-right">
          <p className="font-medium text-sm leading-4 tracking-[0.03em] text-black">
            {PriceUtils.formatPrice(GRUNDSTUECKSCHECK_PRICE)}
          </p>
          <p className="text-xs leading-3 tracking-[0.03em] text-gray-500">
            {PriceUtils.calculateMonthlyPayment(GRUNDSTUECKSCHECK_PRICE, 240)}
          </p>
        </div>
      </div>
      <p className="text-xs leading-[14px] tracking-[0.03em] text-gray-600">
        Professionelle Analyse deines Grundstücks für optimale Platzierung deines Nest.
      </p>
    </div>
  )
}

// Export the constants for use in other components
export { GRUNDSTUECKSCHECK_PRICE, GRUNDSTUECKSCHECK_OPTION } 