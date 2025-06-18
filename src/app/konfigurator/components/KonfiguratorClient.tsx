'use client';

import React, { useRef } from 'react';
import ConfiguratorShell from './ConfiguratorShell';
import { ConfiguratorPanelProvider } from '@/contexts/ConfiguratorPanelContext';

// Client Component - Handles all interactive functionality
export default function KonfiguratorClient() {
  const rightPanelRef = useRef<HTMLDivElement>(null);
  
  return (
    <ConfiguratorPanelProvider value={rightPanelRef}>
      <ConfiguratorShell rightPanelRef={rightPanelRef} />
    </ConfiguratorPanelProvider>
  );
} 