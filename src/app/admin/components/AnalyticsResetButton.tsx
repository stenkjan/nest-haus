'use client';

import React, { useState } from 'react';

/**
 * AnalyticsResetButton - Admin utility to reset all analytics data
 * 
 * Provides a button to clear all session tracking, interaction events,
 * and Redis cache. Includes confirmation modal for safety.
 */
export default function AnalyticsResetButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [lastReset, setLastReset] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    sessions: number;
    interactions: number;
    selections: number;
    metrics: number;
    redisKeys: number;
  } | null>(null);

  const handleReset = async () => {
    setIsResetting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/quick-actions/reset-analytics', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset analytics data');
      }

      setStats(data.stats);
      setLastReset(new Date().toLocaleString());
      setIsModalOpen(false);

      // Reload page after 2 seconds to show updated dashboard
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      console.error('Error resetting analytics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-red-600 font-medium">🗑️ Analytics Data Reset</span>
        </div>
        
        <p className="text-sm text-red-700">
          Clear all analytics data to start fresh. Use when testing or after data cleanup.
        </p>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isResetting}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isResetting ? 'Resetting...' : 'Reset Analytics Data'}
          </button>
          
          {lastReset && (
            <span className="text-sm text-red-600">
              Last reset: {lastReset}
            </span>
          )}
        </div>

        {stats && (
          <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2">
            <p className="font-semibold">✓ Successfully deleted:</p>
            <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
              <li>{stats.sessions} user sessions</li>
              <li>{stats.interactions} interaction events</li>
              <li>{stats.selections} selection events</li>
              <li>{stats.metrics} performance metrics</li>
              <li>{stats.redisKeys} Redis keys</li>
            </ul>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-700 bg-red-100 border border-red-300 rounded p-2">
            <p className="font-semibold">✗ Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="text-xs text-red-600">
          <p className="font-semibold">⚠️ Warning: This action is permanent and cannot be undone</p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-xl font-bold text-gray-900">
                Warning: Permanent Data Deletion
              </h3>
            </div>
            
            <div className="mb-6 space-y-3">
              <p className="text-gray-700">
                This will permanently delete:
              </p>
              
              <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                <li>All user sessions</li>
                <li>All interaction events</li>
                <li>All selection events</li>
                <li>All performance metrics</li>
                <li>All Redis session and analytics keys</li>
              </ul>
              
              <div className="bg-red-50 border border-red-200 rounded p-3 mt-4">
                <p className="text-sm font-semibold text-red-800">
                  This action cannot be undone.
                </p>
                <p className="text-xs text-red-700 mt-1">
                  All analytics dashboards will show zero data until new sessions are tracked.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isResetting}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isResetting ? 'Deleting...' : 'Yes, Delete All Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

