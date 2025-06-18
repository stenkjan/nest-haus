/**
 * PreviewPanel - Image Preview Component
 * 
 * Handles the sticky preview panel with image display and navigation.
 * Optimized for SSR compatibility and responsive design.
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useConfiguratorStore } from '@/store/configuratorStore'
import type { ViewType } from '../types/configurator.types'

interface PreviewPanelProps {
  isMobile?: boolean
  className?: string
}

// Utility function to detect iOS (robust for iPadOS 13+)
function isIOS() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Macintosh') && typeof document !== 'undefined' && 'ontouchend' in document)
  )
}

export default function PreviewPanel({ isMobile = false, className = '' }: PreviewPanelProps) {
  const { configuration } = useConfiguratorStore()
  const [activeView, setActiveView] = useState<ViewType>('exterior')
  const [previewHeight, setPreviewHeight] = useState('clamp(20rem, 40vh, 35rem)')
  const [isIOSMobile, setIsIOSMobile] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // Platform detection with proper SSR handling
  useEffect(() => {
    const checkPlatform = () => {
      setIsIOSMobile(isIOS() && window.innerWidth < 1024)
    }
    checkPlatform()
    window.addEventListener('resize', checkPlatform)
    return () => window.removeEventListener('resize', checkPlatform)
  }, [])

  // Calculate preview height for mobile - optimized for iOS with fluid design
  useEffect(() => {
    if (!isMobile) return

    const calculatePreviewHeight = () => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      // For iOS, account for address bar and use viewport height with clamp
      if (isIOSMobile) {
        const optimalHeight = `clamp(18rem, ${Math.min(screenHeight * 0.4, 280)}px, 35rem)`
        setPreviewHeight(optimalHeight)
      } else {
        // For other mobile devices - use responsive units
        setPreviewHeight('clamp(16rem, 35vw, 35rem)')
      }
    }

    calculatePreviewHeight()
    const resizeHandler = () => requestAnimationFrame(calculatePreviewHeight)
    window.addEventListener('resize', resizeHandler)
    window.addEventListener('orientationchange', resizeHandler)
    
    return () => {
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('orientationchange', resizeHandler)
    }
  }, [isMobile, isIOSMobile])

  // Get current image path based on selections
  const getImagePath = () => {
    if (!configuration) return '/images/configurator/default.jpg'
    
    // Build image path based on current selections and view
    const nest = configuration.nest?.value || 'nest80'
    const gebaeude = configuration.gebaeudehuelle?.value || 'trapezblech'
    
    // Map view types to image suffixes
    const viewSuffix = {
      exterior: 'exterior',
      interior: 'interior', 
      pv: 'pv',
      fenster: 'fenster'
    }[activeView] || 'exterior'
    
    return `/images/configurator/${nest}_${gebaeude}_${viewSuffix}.jpg`
  }

  // Get available views based on current selections
  const getAvailableViews = (): ViewType[] => {
    const views: ViewType[] = ['exterior']
    
    if (configuration?.innenverkleidung) {
      views.push('interior')
    }
    
    if (configuration?.pvanlage) {
      views.push('pv')
    }
    
    if (configuration?.fenster) {
      views.push('fenster')
    }
    
    return views
  }

  const availableViews = getAvailableViews()

  // Navigation handlers
  const handlePrevView = () => {
    const currentIndex = availableViews.indexOf(activeView)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableViews.length - 1
    setActiveView(availableViews[prevIndex])
  }

  const handleNextView = () => {
    const currentIndex = availableViews.indexOf(activeView)
    const nextIndex = currentIndex < availableViews.length - 1 ? currentIndex + 1 : 0
    setActiveView(availableViews[nextIndex])
  }

  // View labels for display
  const viewLabels = {
    exterior: 'Außenansicht',
    interior: 'Innenansicht',
    pv: 'PV-Anlage',
    fenster: 'Fenster & Türen'
  }

  const containerStyle = isMobile ? {
    height: previewHeight,
    ...(isIOSMobile && {
      position: 'sticky' as const,
      top: '0px',
      zIndex: 30,
    })
  } : {
    // Desktop: use full container height with CSS Grid/Flexbox, accounting for navbar and footer
    height: '100%',
    width: '100%',
    maxHeight: 'calc(100vh - var(--navbar-height, 3.5rem) - var(--footer-height, 5rem))'
  }

  return (
    <div 
      ref={previewRef}
      className={`preview-panel bg-gray-50 flex flex-col relative ${className}`}
      style={containerStyle}
    >
      {/* Image Container */}
      <div className="flex-1 relative overflow-hidden">
        <Image
          src={getImagePath()}
          alt={`${viewLabels[activeView]} - ${configuration?.nest?.name || 'Nest'}`}
          fill
          className="object-cover"
          priority
          sizes={isMobile ? "100vw" : "70vw"}
          quality={85}
        />
        
        {/* Navigation Arrows - Responsive sizing and touch targets */}
        {availableViews.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevView}
              className="absolute left-[clamp(0.75rem,2vw,1rem)] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] touch-manipulation"
              aria-label="Vorherige Ansicht"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              type="button"
              onClick={handleNextView}
              className="absolute right-[clamp(0.75rem,2vw,1rem)] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] touch-manipulation"
              aria-label="Nächste Ansicht"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* View Label - Responsive positioning and typography */}
        <div className="absolute bottom-[clamp(1rem,3vh,1.5rem)] left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1vh,0.75rem)] rounded-full text-[clamp(0.875rem,1.4vw,1rem)] font-medium backdrop-blur-sm">
          {viewLabels[activeView]}
        </div>
      </div>

      {/* Empty space where pagination indicators were - keeping for future use */}
      <div className="h-[clamp(2rem,4vh,3rem)] bg-gray-50"></div>
    </div>
  )
} 