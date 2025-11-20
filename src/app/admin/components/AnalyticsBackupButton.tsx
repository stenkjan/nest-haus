'use client';

import React, { useState } from 'react';

interface BackupStats {
  url: string;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  metadata: {
    backupDate: string;
    recordCounts: {
      sessions: number;
      interactions: number;
      selections: number;
      metrics: number;
    };
  };
  timestamp: string;
}

/**
 * AnalyticsBackupButton - Admin utility to create analytics backups
 * 
 * Provides a button to backup all analytics data to Vercel Blob Storage.
 * Includes confirmation modal and displays backup statistics.
 */
export default function AnalyticsBackupButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<BackupStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBackup = async () => {
    setIsBackingUp(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/quick-actions/backup-analytics', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create backup');
      }

      setLastBackup(data.backup);
      setIsModalOpen(false);
      
    } catch (err) {
      console.error('Error creating backup:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600 font-medium">💾 Analytics Backup</span>
        </div>
        
        <p className="text-sm text-blue-700">
          Create a compressed backup of all analytics data and store it in Vercel Blob Storage.
        </p>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isBackingUp}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isBackingUp ? 'Creating Backup...' : 'Create Backup Now'}
          </button>
          
          {lastBackup && (
            <span className="text-sm text-blue-600">
              Last: {new Date(lastBackup.timestamp).toLocaleString()}
            </span>
          )}
        </div>

        {lastBackup && (
          <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2">
            <p className="font-semibold">✓ Backup created successfully:</p>
            <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
              <li>{lastBackup.metadata.recordCounts.sessions} user sessions</li>
              <li>{lastBackup.metadata.recordCounts.interactions} interaction events</li>
              <li>{lastBackup.metadata.recordCounts.selections} selection events</li>
              <li>{lastBackup.metadata.recordCounts.metrics} performance metrics</li>
              <li>File size: {lastBackup.fileSizeFormatted}</li>
            </ul>
            <div className="mt-2">
              <a
                href={lastBackup.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                📥 Download Backup ({lastBackup.fileName})
              </a>
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-700 bg-red-100 border border-red-300 rounded p-2">
            <p className="font-semibold">✗ Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="text-xs text-blue-600">
          <p className="font-semibold">ℹ️ Backups are stored in Vercel Blob Storage and kept indefinitely</p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">💾</span>
              <h3 className="text-xl font-bold text-gray-900">
                Create Analytics Backup
              </h3>
            </div>
            
            <div className="mb-6 space-y-3">
              <p className="text-gray-700">
                This will create a compressed backup of:
              </p>
              
              <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                <li>All user sessions</li>
                <li>All interaction events</li>
                <li>All selection events</li>
                <li>All performance metrics</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                <p className="text-sm font-semibold text-blue-800">
                  Backup Details
                </p>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>• Compressed with gzip (~80-90% size reduction)</li>
                  <li>• Stored in Vercel Blob Storage</li>
                  <li>• Includes restoration instructions</li>
                  <li>• Kept indefinitely (manual cleanup)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isBackingUp}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBackup}
                disabled={isBackingUp}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isBackingUp ? 'Creating...' : 'Create Backup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

