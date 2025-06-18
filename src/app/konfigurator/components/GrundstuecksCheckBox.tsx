/**
 * GrundstuecksCheckBox - Property Check Selection Component
 * 
 * Specialized selection component for the property check service.
 * Extracted from legacy Configurator.tsx for better modularity.
 */

'use client'

import React from 'react'
import { PriceUtils } from '../core/PriceUtils'

interface GrundstuecksCheckBoxProps {
  isSelected: boolean
  onClick: () => void
  className?: string
}

// Constants for Grundstückscheck
const GRUNDSTUECKSCHECK_PRICE = 990 // Price in EUR
const GRUNDSTUECKSCHECK_OPTION = {
  value: 'grundstueckscheck',
  name: 'Grundstücks-Check',
  category: 'grundstueckscheck',
  description: 'Wir prüfen dein Grundstück auf rechtliche und technische Rahmenbedingungen.\n\nKein Risiko – 14 Tage Rückgaberecht.\n\nHäuser bauen bedeutet, sich an bestimmte Spielregeln zu halten – und diese können je nach Region unterschiedlich sein. Wir kennen die gesetzlichen Vorgaben genau und unterstützen dich dabei, die Anforderungen deines Baugrunds zu verstehen.\n\nMit unserem Grundstückscheck prüfen wir, welche Gegebenheiten du bei deinem Wunschgrundstück beachten musst. Gib einfach die relevanten Informationen ein, und wir liefern dir zeitnah ein umfassendes Feedback. So kannst du dein Projekt sicher und fundiert planen.\n\nSollte unser Nest auf Grund rechtlicher Rahmenbedingungen nicht zu deinem Grundstück passen, erhältst du deine Anzahlung zurück.',
  price: GRUNDSTUECKSCHECK_PRICE
}

export default function GrundstuecksCheckBox({ 
  isSelected, 
  onClick, 
  className = '' 
}: GrundstuecksCheckBoxProps) {
  return (
    <div
      className={`box_selection_service flex flex-col border rounded-[19px] px-6 py-4 cursor-pointer transition-colors ${
        isSelected 
          ? 'selected border-[#3D6DE1] shadow-[0_0_0_1px_#3D6DE1]' 
          : 'border-gray-300 hover:border-[#3D6DE1]'
      } ${className}`}
      style={{ marginBottom: 24, background: '#fff', userSelect: 'none' }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium text-[16px] tracking-[0.02em] leading-tight text-black">
            Grundstücks-Check
          </div>
          <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1">
            Wir prüfen dein Grundstück
          </div>
        </div>
        <div className="text-right">
          <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] mb-1">
            {PriceUtils.formatPrice(GRUNDSTUECKSCHECK_PRICE)}
          </div>
          <div className="font-normal text-[10px] tracking-[0.03em] leading-[12px] text-gray-600">
            <div>Kein Risiko</div>
            <div>14 Tage</div>
          </div>
        </div>
      </div>
      
      <div className="font-normal text-[12px] tracking-[0.03em] leading-[18px] text-gray-800 mt-2">
        Häuser bauen bedeutet, sich an bestimmte Spielregeln zu halten – und diese können je nach Region unterschiedlich sein.<br />
        Wir kennen die gesetzlichen Vorgaben genau und unterstützen dich dabei, die Anforderungen deines Baugrunds zu verstehen.<br />
        <br />
        Mit unserem Grundstückscheck prüfen wir, welche Gegebenheiten du bei deinem Wunschgrundstück beachten musst. Gib einfach die relevanten Informationen ein, und wir liefern dir zeitnah ein umfassendes Feedback. So kannst du dein Projekt sicher und fundiert planen.<br />
        <br />
        <span className="font-medium text-black">
          Sollte unser Nest auf Grund rechtlicher Rahmenbedingungen nicht zu deinem Grundstück passen, erhältst du deine Anzahlung zurück.
        </span>
      </div>
    </div>
  )
}

// Export the constants for use in other components
export { GRUNDSTUECKSCHECK_PRICE, GRUNDSTUECKSCHECK_OPTION } 