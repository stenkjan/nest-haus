/**
 * PreviewPanel - Image Preview Component
 * 
 * Handles the sticky preview panel with image display and navigation.
 * Optimized for performance with simplified memoization and bottom-aligned image positioning.
 */

'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo, useTransition } from 'react'
import { HybridBlobImage } from '@/components/images'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { ImageManager } from '../core/ImageManager'
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
  const { 
    configuration, 
    hasPart2BeenActive, 
    hasPart3BeenActive, 
    shouldSwitchToView, 
    clearViewSwitchSignal 
  } = useConfiguratorStore()
  const [activeView, setActiveView] = useState<ViewType>('exterior')
  const [previewHeight, setPreviewHeight] = useState('clamp(20rem, 40vh, 35rem)')
  const [isIOSMobile, setIsIOSMobile] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()

  // Platform detection with proper SSR handling
  useEffect(() => {
    const checkPlatform = () => {
      setIsIOSMobile(isIOS() && window.innerWidth < 1024)
    }
    checkPlatform()
    window.addEventListener('resize', checkPlatform)
    return () => window.removeEventListener('resize', checkPlatform)
  }, [])

  // Calculate preview height for mobile - FIXED: Auto-height based on 16:9 aspect ratio
  useEffect(() => {
    if (!isMobile) return

    const calculatePreviewHeight = () => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      // Calculate height to maintain 16:9 aspect ratio at full width
      const aspectRatioHeight = (screenWidth / 16) * 9
      
      // For iOS, account for address bar and ensure reasonable bounds
      if (isIOSMobile) {
        // Allow aspect ratio height but cap at reasonable limits
        const maxHeight = Math.min(screenHeight * 0.5, 400)
        const optimalHeight = Math.min(aspectRatioHeight, maxHeight)
        setPreviewHeight(`${optimalHeight}px`)
      } else {
        // For other mobile devices - use aspect ratio height with bounds
        const maxHeight = Math.min(screenHeight * 0.6, 450)
        const optimalHeight = Math.min(aspectRatioHeight, maxHeight)
        setPreviewHeight(`${optimalHeight}px`)
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

  // SIMPLIFIED: Get current image path - removed over-optimization that caused constant re-renders
  const currentImagePath = useMemo(() => {
    return ImageManager.getPreviewImage(configuration, activeView)
  }, [configuration, activeView])

  // SIMPLIFIED: Get available views - removed over-optimization
  const availableViews = useMemo(() => {
    return ImageManager.getAvailableViews(configuration, hasPart2BeenActive, hasPart3BeenActive)
  }, [configuration, hasPart2BeenActive, hasPart3BeenActive])

  // Listen for view switching signals from the store
  useEffect(() => {
    if (shouldSwitchToView && shouldSwitchToView !== activeView) {
      startTransition(() => {
        setActiveView(shouldSwitchToView as ViewType);
        clearViewSwitchSignal();
      });
    }
  }, [shouldSwitchToView, activeView, clearViewSwitchSignal])

  // Reset to exterior view if current view becomes unavailable
  useEffect(() => {
    if (!availableViews.includes(activeView)) {
      startTransition(() => {
        setActiveView('exterior');
      });
    }
  }, [availableViews, activeView])

  // Navigation handlers
  const handlePrevView = useCallback(() => {
    startTransition(() => {
      const currentIndex = availableViews.indexOf(activeView)
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableViews.length - 1
      setActiveView(availableViews[prevIndex])
    })
  }, [availableViews, activeView])

  const handleNextView = useCallback(() => {
    startTransition(() => {
      const currentIndex = availableViews.indexOf(activeView)
      const nextIndex = currentIndex < availableViews.length - 1 ? currentIndex + 1 : 0
      setActiveView(availableViews[nextIndex])
    })
  }, [availableViews, activeView])

  // Preload images for the current configuration and view, non-blocking
  useEffect(() => {
    if (configuration) {
      startTransition(() => {
        ImageManager.preloadImages(configuration)
      })
    }
  }, [configuration, activeView])

  // View labels for display and accessibility
  const viewLabels = {
    exterior: 'Außenansicht',
    interior: 'Innenansicht', 
    pv: 'PV-Anlage',
    fenster: 'Fenster & Türen'
  }

  // UPDATED: Container style - full height and width for left panel
  const containerStyle = useMemo(() => {
    if (isMobile) {
      return {
        height: previewHeight,
        ...(isIOSMobile && {
          position: 'sticky' as const,
          top: '0px',
          zIndex: 30,
        })
      };
    }
    return {
      // Desktop: full height and width of left panel
      height: '100%',
      width: '100%'
    };
  }, [isMobile, previewHeight, isIOSMobile]);

  return (
    <div 
      ref={previewRef}
      className={`preview-panel flex flex-col relative ${className}`}
      style={containerStyle}
    >
      {/* Image Container - full width and height usage */}
      <div className="h-full w-full relative" style={{ backgroundColor: 'white' }}>
        {/* Image filling the entire container */}
        <div className="relative w-full h-full">
          <div className="relative w-full h-full">
            {/* Main image */}
            <HybridBlobImage
              path={currentImagePath}
              alt={`${viewLabels[activeView]} - ${configuration?.nest?.name || 'Nest Konfigurator'}`}
              fill
              className={`transition-opacity duration-300 ${
                isMobile ? 'object-cover' : 'object-cover'
              }`}
              
              // Simplified strategy - just use client-side for interactive configurator
              strategy="client"
              isInteractive={true}
              enableCache={true}
              
              // Standard image props
              sizes="(max-width: 1023px) 100vw, 70vw"
              quality={85}
              priority={activeView === 'exterior'}
            />
          </div>
        </div>
        
        {/* Navigation Arrows - Only show if multiple views available */}
        {availableViews.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-[clamp(0.75rem,2vw,1rem)] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Vorherige Ansicht`}
              onClick={handlePrevView}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              type="button"
              className="absolute right-[clamp(0.75rem,2vw,1rem)] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Nächste Ansicht`}
              onClick={handleNextView}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}


      </div>

      {/* REMOVED: Flex-1 spacer and excessive performance monitoring */}
    </div>
  )
} 