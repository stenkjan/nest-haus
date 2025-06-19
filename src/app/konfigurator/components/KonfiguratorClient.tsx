'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useConfiguratorStore } from '@/store/configuratorStore';
import ConfiguratorShell from './ConfiguratorShell';
import ImagePreloader from '@/components/images/ImagePreloader';
import { ConfiguratorPanelProvider } from '@/contexts/ConfiguratorPanelContext';
import { IMAGES } from '@/constants/images';

// Client Component - Handles all interactive functionality
export default function KonfiguratorClient() {
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const { initializeSession, sessionId } = useConfiguratorStore();

  // Ensure store is initialized immediately
  useEffect(() => {
    if (!sessionId) {
      initializeSession();
    }
  }, [initializeSession, sessionId]);

  // Preload commonly used configurator images
  const preloadPaths = useMemo(() => [
    IMAGES.configurations.nest75_holzlattung,
    IMAGES.configurations.nest95_holzlattung,
    IMAGES.configurations.nest115_holzlattung,
    IMAGES.configurations.nest75_trapezblech,
    IMAGES.configurations.nest95_trapezblech,
    IMAGES.configurations.trapezblech_holznatur_kalkstein,
    IMAGES.configurations.plattenschwarz_holznatur_granit,
    IMAGES.configurations.plattenweiss_holznatur_granit,
    IMAGES.configurations.holzlattung_interior,
    // Add more based on user journey analytics
  ], []);
  
  return (
    <ConfiguratorPanelProvider value={rightPanelRef}>
      <ImagePreloader paths={preloadPaths} priority={true} />
      <ConfiguratorShell rightPanelRef={rightPanelRef} />
    </ConfiguratorPanelProvider>
  );
} 