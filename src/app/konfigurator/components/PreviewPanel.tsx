/**
 * PreviewPanel - Image Preview Component
 * 
 * Handles the sticky preview panel with image display and navigation.
 * Optimized for SSR compatibility, responsive design, and robust image loading.
 */

'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { HybridBlobImage } from '@/components/images'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { ImageManager } from '../core/ImageManager'
import PerformanceMonitor from '../core/PerformanceMonitor'
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
  // Track component renders for performance monitoring
  useEffect(() => {
    PerformanceMonitor.trackPreviewPanelRender();
  });

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
  const [imageLoading, setImageLoading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // Performance monitoring: Start auto-logging on mount
  useEffect(() => {
    PerformanceMonitor.startAutoLogging();
    return () => {
      PerformanceMonitor.stopAutoLogging();
    };
  }, []);

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

  // Configuration is used directly in memoization for better dependency tracking

  // FIXED: Get current image path using ImageManager - properly memoized to prevent unnecessary calls
  const currentImagePath = useMemo(() => {
    if (!configuration) return ImageManager.getPreviewImage(null, activeView);
    return ImageManager.getPreviewImage(configuration, activeView);
  }, [configuration, activeView])

  // FIXED: Get available views - properly memoized
  const availableViews = useMemo(() => {
    return ImageManager.getAvailableViews(configuration, hasPart2BeenActive, hasPart3BeenActive)
  }, [configuration, hasPart2BeenActive, hasPart3BeenActive])

  // Listen for view switching signals from the store
  useEffect(() => {
    if (shouldSwitchToView && shouldSwitchToView !== activeView) {
      setActiveView(shouldSwitchToView as ViewType);
      clearViewSwitchSignal(); // Clear the signal after handling it
    }
  }, [shouldSwitchToView, activeView, clearViewSwitchSignal])

  // Reset to exterior view if current view becomes unavailable
  useEffect(() => {
    if (!availableViews.includes(activeView)) {
      setActiveView('exterior');
    }
  }, [availableViews, activeView])

  // Navigation handlers with bounds checking - memoized to prevent re-renders
  const handlePrevView = useCallback(() => {
    const currentIndex = availableViews.indexOf(activeView)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableViews.length - 1
    setActiveView(availableViews[prevIndex])
  }, [availableViews, activeView])

  const handleNextView = useCallback(() => {
    const currentIndex = availableViews.indexOf(activeView)
    const nextIndex = currentIndex < availableViews.length - 1 ? currentIndex + 1 : 0
    setActiveView(availableViews[nextIndex])
  }, [availableViews, activeView])

  // Image loading handlers - memoized to prevent re-renders
  const handleImageLoadComplete = useCallback(() => {
    setImageLoading(false)
  }, [])

  const handleImageError = useCallback(() => {
    console.warn('PreviewPanel: Image load error', { currentImagePath })
    handleImageLoadComplete()
  }, [currentImagePath, handleImageLoadComplete])

  // View labels for display and accessibility
  const viewLabels = useMemo(() => ({
    exterior: 'Außenansicht',
    interior: 'Innenansicht', 
    pv: 'PV-Anlage',
    fenster: 'Fenster & Türen'
  }), []);

  // Container style - memoized to prevent unnecessary recalculations
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
      // Desktop: use full container height with CSS Grid/Flexbox, accounting for navbar and footer
      height: '100%',
      width: '100%',
      maxHeight: 'calc(100vh - var(--navbar-height, 3.5rem) - var(--footer-height, 5rem))'
    };
  }, [isMobile, previewHeight, isIOSMobile]);

  // Navigation button props - memoized for performance
  const prevButtonProps = useMemo(() => {
    const currentIndex = availableViews.indexOf(activeView);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableViews.length - 1;
    const prevView = availableViews[prevIndex];
    
    return {
      'aria-label': `Vorherige Ansicht: ${viewLabels[prevView] || 'Unbekannt'}`,
      onClick: handlePrevView
    };
  }, [availableViews, activeView, viewLabels, handlePrevView]);

  const nextButtonProps = useMemo(() => {
    const currentIndex = availableViews.indexOf(activeView);
    const nextIndex = currentIndex < availableViews.length - 1 ? currentIndex + 1 : 0;
    const nextView = availableViews[nextIndex];
    
    return {
      'aria-label': `Nächste Ansicht: ${viewLabels[nextView] || 'Unbekannt'}`,
      onClick: handleNextView
    };
  }, [availableViews, activeView, viewLabels, handleNextView]);

  // Performance monitoring: Log current image path changes in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🖼️ PreviewPanel: Current image path changed to: ${currentImagePath}`);
      
      // Show compact performance report every few image changes
      const pathChangeCount = performance.now() % 1000;
      if (pathChangeCount < 50) { // Roughly every 20 changes
        console.debug(PerformanceMonitor.getCompactReport());
      }
    }
  }, [currentImagePath]);

  return (
    <div 
      ref={previewRef}
      className={`preview-panel bg-gray-50 flex flex-col relative ${className}`}
      style={containerStyle}
    >
      {/* Image Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Loading indicator */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Image container with consistent aspect ratio */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          {/* Loading spinner */}
          {imageLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Main image - FIXED: Optimized for performance */}
          <HybridBlobImage
            path={currentImagePath}
            alt={`${viewLabels[activeView]} - ${configuration?.nest?.name || 'Nest Konfigurator'}`}
            fill
            className="object-cover transition-opacity duration-300"
            
            // Hybrid strategy configuration
            strategy="client" // Use client-side for interactive configurator
            isInteractive={true}
            enableCache={true}
            enableMobileDetection={false}
            showLoadingSpinner={false} // We handle loading state ourselves
            
            // Standard image props - accurate sizes for actual rendered dimensions  
            sizes="(max-width: 1023px) 100vw, 70vw"
            quality={85}
            priority={activeView === 'exterior'}
            onLoad={handleImageLoadComplete}
            onError={handleImageError}
          />
        </div>
        
        {/* Navigation Arrows - Only show if multiple views available */}
        {availableViews.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-[clamp(0.75rem,2vw,1rem)] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...prevButtonProps}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              type="button"
              className="absolute right-[clamp(0.75rem,2vw,1rem)] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-[clamp(0.75rem,1.5vw,1rem)] shadow-lg transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...nextButtonProps}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* View Indicator - Show current view and available views */}
      {availableViews.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          <span className="font-medium">{viewLabels[activeView]}</span>
          <span className="ml-2 opacity-70">({availableViews.indexOf(activeView) + 1}/{availableViews.length})</span>
        </div>
      )}

      {/* Mobile-specific touch hint for first-time users */}
      {isMobile && availableViews.length > 1 && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-xs opacity-80">
          Wischen für mehr Ansichten
        </div>
      )}

      {/* Development performance indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono opacity-70">
          {PerformanceMonitor.getCompactReport()}
        </div>
      )}
    </div>
  )
} 