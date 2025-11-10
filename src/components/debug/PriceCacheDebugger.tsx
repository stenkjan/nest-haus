/**
 * Price Cache Debugger Component
 * 
 * Shows cache status and allows manual cache clearing
 * Only visible in development mode or with debug flag
 */

'use client';

import { useState, useEffect } from 'react';
import { PriceCalculator } from '@/app/konfigurator/core/PriceCalculator';

interface CacheInfo {
  hasPricingData: boolean;
  cacheAge: number | null;
  cacheVersion: number;
  sessionStorageCached: boolean;
}

export function PriceCacheDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Only show in development or if debug flag is set
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const hasDebugFlag = typeof window !== 'undefined' && 
      (window.location.search.includes('debug=true') || 
       window.location.search.includes('debug-prices=true'));
    
    setIsVisible(isDev || hasDebugFlag);
  }, []);

  const updateCacheInfo = () => {
    const info = PriceCalculator.getCacheStats();
    setCacheInfo(info);
  };

  useEffect(() => {
    if (isVisible) {
      updateCacheInfo();
      const interval = setInterval(updateCacheInfo, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isVisible]);

  const handleClearCache = () => {
    if (confirm('Clear all pricing caches? This will force a reload of pricing data.')) {
      PriceCalculator.clearAllCaches();
      updateCacheInfo();
      alert('Cache cleared! Refresh the page to load fresh pricing data.');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    PriceCalculator.clearAllCaches();
    
    try {
      await PriceCalculator.initializePricingData();
      updateCacheInfo();
      alert('Pricing data refreshed successfully!');
    } catch (error) {
      alert(`Failed to refresh pricing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isVisible || !cacheInfo) return null;

  const cacheAgeMinutes = cacheInfo.cacheAge ? Math.round(cacheInfo.cacheAge / 1000 / 60) : 0;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #444', paddingBottom: '5px' }}>
        🔧 Price Cache Debug
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#888' }}>Memory Cache:</span>{' '}
          <span style={{ color: cacheInfo.hasPricingData ? '#4ade80' : '#f87171' }}>
            {cacheInfo.hasPricingData ? '✓ Loaded' : '✗ Empty'}
          </span>
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#888' }}>Session Storage:</span>{' '}
          <span style={{ color: cacheInfo.sessionStorageCached ? '#4ade80' : '#f87171' }}>
            {cacheInfo.sessionStorageCached ? '✓ Cached' : '✗ Empty'}
          </span>
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#888' }}>Cache Age:</span>{' '}
          <span style={{ color: cacheAgeMinutes > 3 ? '#fb923c' : '#4ade80' }}>
            {cacheAgeMinutes > 0 ? `${cacheAgeMinutes}m` : 'N/A'}
          </span>
        </div>
        
        <div>
          <span style={{ color: '#888' }}>Cache Version:</span>{' '}
          <span>{cacheInfo.cacheVersion}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
        <button
          onClick={handleClearCache}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '500',
          }}
        >
          Clear Cache
        </button>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            fontWeight: '500',
            opacity: isRefreshing ? 0.6 : 1,
          }}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      <div style={{ marginTop: '10px', fontSize: '10px', color: '#888', borderTop: '1px solid #444', paddingTop: '5px' }}>
        Add ?debug=true to URL to show this panel
      </div>
    </div>
  );
}
