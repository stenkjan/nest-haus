/**
 * SummaryPanel - Configuration Summary Component
 * 
 * Shows the complete configuration overview with pricing breakdown.
 * Extracted from legacy Configurator.tsx and integrated with Zustand store.
 */

'use client'

import React from 'react'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { useCartStore } from '@/store/cartStore'
import { PriceUtils } from '../core/PriceUtils'
import InfoBox from './InfoBox'

interface SummaryPanelProps {
  onInfoClick?: (infoKey: string) => void
  className?: string
}

export default function SummaryPanel({ onInfoClick, className = '' }: SummaryPanelProps) {
  const { 
    configuration, 
    currentPrice, 
    priceBreakdown, 
    isConfigurationComplete,
    getConfigurationForCart 
  } = useConfiguratorStore()
  
  const { addConfigurationToCart } = useCartStore()

  const handleAddToCart = () => {
    if (isConfigurationComplete()) {
      const config = getConfigurationForCart()
      if (config) {
        addConfigurationToCart(config)
        // Could add router.push('/warenkorb') here if needed
      }
    }
  }

  if (!configuration) {
    return (
      <div className={`summary-panel p-6 ${className}`}>
        <p className="text-gray-500">Konfiguration wird geladen...</p>
      </div>
    )
  }

  // Helper function to get short description for packages
  const getPaketShortText = (paketValue: string) => {
    const paketDescriptions: Record<string, string> = {
      'basis': 'Grundlegende Planungsleistungen',
      'komfort': 'Erweiterte Planungsleistungen',
      'premium': 'Vollumfängliche Planungsleistungen'
    }
    return paketDescriptions[paketValue] || 'Planungsleistungen'
  }

  // Helper function to get display name for fenster
  const getFensterDisplayName = (selection: { name: string; squareMeters?: number }, forSummary: boolean = false) => {
    if (!selection) return ''
    
    if (forSummary && selection.squareMeters) {
      return `${selection.name} (${selection.squareMeters}m²)`
    }
    
    return selection.name
  }

  return (
    <div className={`summary-panel ${className}`}>
      <div className="mt-12">
        <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
          <span className="text-black">Dein Nest.</span> <span className="text-[#999999]">Überblick</span>
        </h3>
        
        <div className="border border-gray-300 rounded-[19px] px-6 py-4">
          <div className="space-y-4">
            {/* Base Configuration */}
            {configuration.nest && configuration.gebaeudehuelle && configuration.innenverkleidung && configuration.fussboden && (
              <div className="flex justify-between items-start border-b border-gray-100 pb-3 gap-8">
                <div>
                  <div className="font-medium text-[16px] tracking-[0.02em] leading-[20px] whitespace-pre-line text-black">
                    {configuration.nest.name} Basiskonfiguration
                  </div>
                  <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-700 mt-1 max-w-[66%]">
                    {configuration.gebaeudehuelle.name}, {configuration.innenverkleidung.name}, {configuration.fussboden.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1 text-black">Startpreis</div>
                  <div className="text-black">{PriceUtils.formatPrice(priceBreakdown?.basePrice || 0)}</div>
                </div>
              </div>
            )}
            
            {/* Additional Options */}
            {Object.entries(configuration).map(([key, selection]) => {
              if (!selection || key === 'sessionId' || key === 'totalPrice' || key === 'timestamp' || 
                  key === 'nest' || key === 'gebaeudehuelle' || key === 'innenverkleidung' || key === 'fussboden') {
                return null
              }
              
              // Special handling for paket
              if (key === 'planungspaket' && selection.value) {
                return (
                  <div key={key} className="flex justify-between items-start border-b border-gray-100 pb-3 gap-8">
                    <div>
                      <div className="font-medium text-[16px] tracking-[0.02em] leading-[20px] whitespace-pre-line">
                        {selection.name}
                      </div>
                      <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1 max-w-full whitespace-pre-line">
                        {getPaketShortText(selection.value)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-1 text-black">Aufpreis</div>
                      {PriceUtils.formatPrice(selection.price || 0)}
                    </div>
                  </div>
                )
              }
              
              // Handle other selections
              if (selection.value) {
                return (
                  <div key={key} className="flex justify-between items-start border-b border-gray-100 pb-3 gap-8">
                    <div>
                      <div className="font-medium text-[16px] tracking-[0.02em] leading-[20px] whitespace-pre-line">
                        {key === 'fenster' ? getFensterDisplayName(selection, true) : selection.name}
                        {key === 'pvanlage' && selection.quantity && selection.quantity > 1 && ` (${selection.quantity}x)`}
                      </div>
                      {selection.description && (
                        <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1 max-w-[66%]">
                          {selection.description}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="mb-1 text-black">Aufpreis</div>
                      {key === 'pvanlage' 
                        ? PriceUtils.formatPrice((selection.quantity || 1) * (selection.price || 0))
                        : key === 'fenster'
                          ? PriceUtils.formatPrice((selection.squareMeters || 1) * (selection.price || 0))
                          : PriceUtils.formatPrice(selection.price || 0)
                      }
                    </div>
                  </div>
                )
              }
              
              return null
            })}
          </div>

          {/* Total Price */}
          <div className="mt-6 text-right">
            <h3 className="text-xl font-medium tracking-[-0.015em]">
              <span className="text-black">Gesamtpreis:</span> 
              <span className="font-medium"> {PriceUtils.formatPrice(currentPrice)}</span>
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              oder {PriceUtils.calculateMonthlyPayment(currentPrice)} monatlich für 240 Monate
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6">
          <InfoBox
            title="Noch Fragen offen?"
            description="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch."
            onClick={() => onInfoClick?.('beratung')}
          />
        </div>

        {/* Add to Cart Button */}
        <div className="mt-6">
          <button
            onClick={handleAddToCart}
            disabled={!isConfigurationComplete()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-[19px] transition-colors"
          >
            {isConfigurationComplete() 
              ? `In den Warenkorb - ${PriceUtils.formatPrice(currentPrice)}`
              : 'Konfiguration vervollständigen'
            }
          </button>
        </div>
      </div>
    </div>
  )
} 