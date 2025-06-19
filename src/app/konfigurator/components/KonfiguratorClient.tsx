'use client';

import React, { useRef, useEffect } from 'react';
import { useConfiguratorStore } from '@/store/configuratorStore';
import ConfiguratorShell from './ConfiguratorShell';
import { ConfiguratorPanelProvider } from '@/contexts/ConfiguratorPanelContext';

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
  
  return (
    <ConfiguratorPanelProvider value={rightPanelRef}>
      <ConfiguratorShell rightPanelRef={rightPanelRef} />
    </ConfiguratorPanelProvider>
  );
} 