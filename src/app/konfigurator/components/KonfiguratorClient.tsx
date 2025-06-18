'use client';

import React, { useRef, useEffect } from 'react';
import { useConfiguratorStore } from '@/store/configuratorStore';
import ConfiguratorShell from './ConfiguratorShell';
import { ConfiguratorPanelProvider } from '@/contexts/ConfiguratorPanelContext';

// Client Component - Handles all interactive functionality
export default function KonfiguratorClient() {
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const { initializeSession, sessionId, currentPrice, updateSelection, configuration } = useConfiguratorStore();

  // Ensure store is initialized immediately
  useEffect(() => {
    console.log('🚀 KonfiguratorClient: Component mounted');
    console.log('🚀 Current sessionId:', sessionId);
    console.log('🚀 Current price:', currentPrice);
    
    if (!sessionId) {
      console.log('🚀 No session found, initializing...');
      initializeSession();
    }
  }, [initializeSession, sessionId]);

  // Log price changes
  useEffect(() => {
    console.log('🚀 Price updated in client:', currentPrice);
  }, [currentPrice]);

  // Test function to verify price calculation
  const testPriceCalculation = () => {
    console.log('🧪 Testing price calculation...');
    
    // Test with basic configuration
    updateSelection({
      category: 'nest',
      value: 'nest80',
      name: 'Nest. 80',
      price: 155500,
      description: '80m² Nutzfläche'
    });
    
    setTimeout(() => {
      updateSelection({
        category: 'gebaeudehuelle',
        value: 'trapezblech',
        name: 'Trapezblech',
        price: 0,
        description: 'RAL 9005 - 3000 x 1142 mm'
      });
    }, 500);

    setTimeout(() => {
      updateSelection({
        category: 'innenverkleidung',
        value: 'kiefer',
        name: 'Kiefer',
        price: 0,
        description: 'PEFC - Zertifiziert - Sicht 1,5 cm'
      });
    }, 1000);

    setTimeout(() => {
      updateSelection({
        category: 'fussboden',
        value: 'parkett',
        name: 'Parkett Eiche',
        price: 0,
        description: 'Schwimmend verlegt'
      });
    }, 1500);
  };
  
  return (
    <ConfiguratorPanelProvider value={rightPanelRef}>
      {/* Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 z-50 bg-red-100 p-4 rounded-lg shadow-lg">
          <h3 className="font-bold">Debug Panel</h3>
          <p>Session: {sessionId ? '✅' : '❌'}</p>
          <p>Price: {currentPrice}€</p>
          <p>Config: {configuration ? '✅' : '❌'}</p>
          <button 
            onClick={testPriceCalculation}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Test Price Calc
          </button>
        </div>
      )}
      
      <ConfiguratorShell rightPanelRef={rightPanelRef} />
    </ConfiguratorPanelProvider>
  );
} 