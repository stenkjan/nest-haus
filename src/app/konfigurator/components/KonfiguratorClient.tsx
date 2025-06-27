'use client';

import React, { useRef, useEffect } from 'react';
import { useConfiguratorStore } from '@/store/configuratorStore';
import ConfiguratorShell from './ConfiguratorShell';
import { ConfiguratorPanelProvider } from '@/contexts/ConfiguratorPanelContext';

// Client Component - Handles all interactive functionality
export default function KonfiguratorClient() {
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const { initializeSession, sessionId, configuration, resetConfiguration } = useConfiguratorStore();

  // Ensure store is initialized immediately
  useEffect(() => {
    if (!sessionId || !configuration) {
      // Force initialization if missing
      if (process.env.NODE_ENV === 'development') {
        resetConfiguration();
      } else {
        initializeSession();
      }
    }
  }, [sessionId, configuration, initializeSession, resetConfiguration]);

  // Verify configuration is available after initialization
  useEffect(() => {
    if (sessionId && configuration) {
      // Configuration is ready
    }
  }, [sessionId, configuration]);

  // Development performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Add global performance monitoring helper
      (window as unknown as { showPriceStats?: () => void }).showPriceStats = async () => {
        const { PriceCalculator } = await import('../core/PriceCalculator');
        PriceCalculator.logPerformanceStats();
      };

      // Enhanced logging system for debug session export
      const performanceLogs: Array<{
        timestamp: string;
        type: 'performance' | 'price' | 'cache' | 'error';
        message: string;
        data?: unknown;
      }> = [];

      // Capture price calculation events
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        const message = args.join(' ');
        if (message.includes('💰') || message.includes('Price') || message.includes('Cache')) {
          performanceLogs.push({
            timestamp: new Date().toISOString(),
            type: message.includes('💰') ? 'price' : message.includes('Cache') ? 'cache' : 'performance',
            message,
            data: args.length > 1 ? args.slice(1) : undefined
          });
        }
        originalConsoleLog.apply(console, args);
      };

      // Add export function to window
      (window as unknown as { exportDebugSession?: () => void }).exportDebugSession = () => {
        const sessionData = {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          sessionId: sessionId || 'unknown',
          configuration: configuration,
          performanceLogs,
          cacheInfo: null as unknown
        };

        // Get current cache info
        import('../core/PriceCalculator').then(({ PriceCalculator }) => {
          sessionData.cacheInfo = PriceCalculator.getPriceCacheInfo();
          
          const dataStr = JSON.stringify(sessionData, null, 2);
          const blob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `nest-haus-debug-session-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          console.log('🔍 Debug session exported!', {
            logs: performanceLogs.length,
            configuration: !!configuration,
            cacheInfo: sessionData.cacheInfo
          });
        });
      };

      // Log performance stats periodically in development
      const interval = setInterval(async () => {
        const { PriceCalculator } = await import('../core/PriceCalculator');
        const info = PriceCalculator.getPriceCacheInfo();
        if (info.size > 0) {
          console.log(`💰 Performance Check: ${info.size} cached calculations`);
        }
      }, 30000); // Every 30 seconds

      return () => {
        clearInterval(interval);
        console.log = originalConsoleLog;
        delete (window as unknown as { showPriceStats?: () => void }).showPriceStats;
        delete (window as unknown as { exportDebugSession?: () => void }).exportDebugSession;
      };
    }
    
    // Return undefined for production environments where no cleanup is needed
    return undefined;
  }, [sessionId, configuration]); // Added dependencies for better logging context

  // Intelligent image preloading based on current configuration (disabled temporarily to fix warnings)
  // useEffect(() => {
  //   if (configuration && typeof window !== 'undefined') {
  //     // Preload images for current configuration (non-blocking)
  //     ImageManager.preloadImages(configuration).catch(() => {
  //       // Silently fail - preloading is optimization only
  //       console.debug('⚡ Image preloading completed/failed - continuing normally');
  //     });
  //   }
  // }, [configuration]);

  // Initial image preloading for common configurations (disabled temporarily to fix warnings)
  // useEffect(() => {
  //   if (typeof window === 'undefined') return;

  //   const preloadInitialImages = async () => {
  //     try {
  //       // Create minimal configuration objects for common starting configurations
  //       const commonConfigs = [
  //         {
  //           sessionId: 'preload',
  //           nest: { category: 'nest', value: 'nest80', name: 'Nest 80', price: 0 },
  //           gebaeudehuelle: { category: 'gebaeudehuelle', value: 'holzlattung', name: 'Holzlattung', price: 0 },
  //           totalPrice: 0,
  //           timestamp: Date.now()
  //         },
  //         {
  //           sessionId: 'preload', 
  //           nest: { category: 'nest', value: 'nest100', name: 'Nest 100', price: 0 },
  //           gebaeudehuelle: { category: 'gebaeudehuelle', value: 'trapezblech', name: 'Trapezblech', price: 0 },
  //           totalPrice: 0,
  //           timestamp: Date.now()
  //         },
  //         {
  //           sessionId: 'preload',
  //           nest: { category: 'nest', value: 'nest120', name: 'Nest 120', price: 0 },
  //           gebaeudehuelle: { category: 'gebaeudehuelle', value: 'fassadenplatten_schwarz', name: 'Fassadenplatten Schwarz', price: 0 },
  //           totalPrice: 0,
  //           timestamp: Date.now()
  //         }
  //       ];

  //       // Preload in sequence with small delays to avoid overwhelming the system
  //       for (const config of commonConfigs) {
  //         await ImageManager.preloadImages(config);
  //         await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between preloads
  //       }
        
  //       console.debug('🚀 Initial image preloading completed');
  //     } catch (error) {
  //       // Silently fail - preloading is optimization only
  //       console.debug('⚡ Initial image preloading failed - continuing normally');
  //     }
  //   };

  //   // Start preloading after a brief delay to not interfere with initial render
  //   const timeoutId = setTimeout(preloadInitialImages, 500);
    
  //   return () => clearTimeout(timeoutId);
  // }, []); // Only run once on mount
  
  return (
    <div className="bg-white">
      <ConfiguratorPanelProvider value={rightPanelRef}>
        <ConfiguratorShell rightPanelRef={rightPanelRef} />
      </ConfiguratorPanelProvider>
    </div>
  );
} 