'use client';

import React, { useState } from 'react';

/**
 * ImageCacheManager - Admin utility to manage image caches
 * 
 * Provides buttons to clear cached image URLs when images are re-uploaded
 * to blob storage with new hashes.
 */
export default function ImageCacheManager() {
  const [isClearing, setIsClearing] = useState(false);
  const [lastCleared, setLastCleared] = useState<string | null>(null);

  const clearImageCache = async () => {
    setIsClearing(true);
    
    try {
      // Clear memory cache
      if (typeof window !== 'undefined' && (window as any).clearImageCache) {
        (window as any).clearImageCache();
      } else {
        // Fallback: clear session storage manually
        const keys = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith('nest_img_')) {
            keys.push(key);
          }
        }
        
        keys.forEach(key => sessionStorage.removeItem(key));
        console.log(`🗑️ Cleared ${keys.length} cached image URLs from session storage`);
      }
      
      setLastCleared(new Date().toLocaleTimeString());
      
      // Force page refresh to reload images
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error clearing image cache:', error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <span className="text-yellow-600 font-medium">🖼️ Image Cache Manager</span>
      </div>
      
      <p className="text-sm text-yellow-700">
        Use this when images have been re-uploaded to blob storage and aren't showing the latest versions.
      </p>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={clearImageCache}
          disabled={isClearing}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isClearing ? 'Clearing...' : 'Clear Image Cache'}
        </button>
        
        {lastCleared && (
          <span className="text-sm text-yellow-600">
            Last cleared: {lastCleared}
          </span>
        )}
      </div>
      
      <div className="text-xs text-yellow-600">
        <p>This will:</p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Clear memory cache (current session)</li>
          <li>Clear session storage cache (1-hour TTL)</li>
          <li>Force page refresh to reload images</li>
        </ul>
      </div>
    </div>
  );
} 