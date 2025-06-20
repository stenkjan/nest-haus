'use client';

import React, { useRef, useEffect } from 'react';
import { useConfiguratorStore } from '@/store/configuratorStore';
import ConfiguratorShell from './ConfiguratorShell';
import { ConfiguratorPanelProvider } from '@/contexts/ConfiguratorPanelContext';

// Client Component - Handles all interactive functionality
export default function KonfiguratorClient() {
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const { initializeSession, sessionId, configuration, resetConfiguration } = useConfiguratorStore();

  // Ensure store is initialized immediately with debug logging
  useEffect(() => {
    if (!sessionId || !configuration) {
      // Force initialization if missing
      if (process.env.NODE_ENV === 'development') {
        resetConfiguration();
      } else {
        initializeSession();
      }
      return;
    }
  }, [sessionId, configuration, initializeSession, resetConfiguration]);

  // Verify configuration is available after initialization
  useEffect(() => {
    if (sessionId && configuration) {
      // Configuration is ready
    }
  }, [sessionId, configuration]);

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
    <ConfiguratorPanelProvider value={rightPanelRef}>
      <ConfiguratorShell rightPanelRef={rightPanelRef} />
    </ConfiguratorPanelProvider>
  );
} 