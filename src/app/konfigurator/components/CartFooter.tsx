'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { useCartStore } from '@/store/cartStore'
import { PriceUtils } from '../core/PriceUtils'

interface CartFooterProps {
  onReset?: () => void
}

export default function CartFooter({ onReset }: CartFooterProps) {
  const { currentPrice, resetConfiguration } = useConfiguratorStore()
  const { items } = useCartStore()
  const footerRef = useRef<HTMLDivElement>(null)

  // Set CSS variable for footer height (similar to navbar)
  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        const height = footerRef.current.offsetHeight
        document.documentElement.style.setProperty('--footer-height', height + 'px')
      }
    }

    updateFooterHeight()
    
    // Update on resize
    window.addEventListener('resize', updateFooterHeight)
    return () => window.removeEventListener('resize', updateFooterHeight)
  }, [])



  const handleReset = () => {
    resetConfiguration()
    if (onReset) {
      onReset()
    }
  }

  return (
    <div 
      ref={footerRef}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-[clamp(0.75rem,2vw,1rem)] z-50"
    >
      <div className="max-w-[1600px] mx-auto px-[clamp(0.75rem,2vw,1rem)] flex justify-between items-center">
        {/* Reset button */}
        <button
          className="bg-transparent border-none p-0 m-0 text-[#222] font-normal focus:outline-none cursor-pointer text-[clamp(0.75rem,1.2vw,1rem)] hover:text-[#3D6DE1] transition-colors touch-manipulation"
          style={{ minWidth: 0 }}
          onClick={handleReset}
          type="button"
        >
          Neu konfigurieren
        </button>
        
        <div className="flex items-center gap-[clamp(0.75rem,2vw,1.5rem)]">
          {/* Price and monthly rate */}
          <div className="text-right">
            <p className="font-semibold leading-tight text-[clamp(0.875rem,1.8vw,1.25rem)]">
              {PriceUtils.formatPrice(currentPrice)}
            </p>
            <p className="text-[clamp(0.625rem,1vw,0.75rem)] text-gray-500 leading-tight">
              oder {PriceUtils.calculateMonthlyPayment(currentPrice, 120)} für 120 Mo.
            </p>
          </div>
          
          {/* Cart button */}
          <Link
            href="/warenkorb"
            className={`bg-[#3D6DE1] text-white rounded-full font-medium text-[clamp(0.75rem,1.2vw,1rem)] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.5rem,1vw,0.75rem)] transition-all hover:bg-[#2855d6] min-h-[44px] flex items-center justify-center touch-manipulation ${
              currentPrice === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={e => currentPrice === 0 && e.preventDefault()}
          >
            Jetzt bauen
          </Link>
        </div>
      </div>
    </div>
  )
} 