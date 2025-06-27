'use client';

/**
 * Google Drive Sync Admin Panel
 * 
 * Manual control and monitoring of Google Drive to Vercel Blob sync
 * - View sync status and configuration
 * - Trigger manual sync
 * - Monitor sync results
 * - Easy removal instructions
 */

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

interface SyncResult {
  success: boolean;
  result?: {
    processed: number;
    uploaded: number;
    updated: number;
    deleted: number;
    duration: number;
    imagesUpdated: boolean;
    errors: string[];
    triggeredBy: string;
  };
  error?: string;
  timestamp: string;
}

interface SyncStatus {
  status: string;
  configuration: {
    googleDriveConfigured: boolean;
    blobConfigured: boolean;
    serviceAccountConfigured: boolean;
  };
  endpoint: string;
  methods: string[];
  authentication: string;
  cronSchedule: string;
  timestamp: string;
}

export default function GoogleDriveSyncAdmin() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sync status on component mount
  useEffect(() => {
    loadSyncStatus();
  }, []);

  /**
   * Load current sync status and configuration
   */
  const loadSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync/google-drive');
      const status = await response.json();
      setSyncStatus(status);
      setError(null);
    } catch (err) {
      console.error('Failed to load sync status:', err);
      setError('Failed to load sync status');
    }
  };

  /**
   * Trigger manual sync
   */
  const triggerManualSync = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get admin credentials (in a real app, these would come from secure auth)
      const username = process.env.NEXT_PUBLIC_ADMIN_USERNAME || prompt('Admin Username:');
      const password = prompt('Admin Password:');

      if (!username || !password) {
        throw new Error('Admin credentials required');
      }

      const credentials = btoa(`${username}:${password}`);
      
      const response = await fetch('/api/sync/google-drive', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Sync failed');
      }

      setLastResult(result);
      await loadSyncStatus(); // Refresh status

    } catch (err) {
      console.error('Manual sync failed:', err);
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Show removal instructions
   */
  const showRemovalInstructions = () => {
    const instructions = [
      '1. Remove sync files:',
      '   - src/lib/sync/',
      '   - src/app/api/sync/google-drive/',
      '   - src/app/admin/sync/',
      '',
      '2. Remove from package.json:',
      '   - googleapis dependency',
      '',
      '3. Remove from vercel.json:',
      '   - crons section',
      '   - sync function configuration',
      '',
      '4. Remove environment variables:',
      '   - GOOGLE_DRIVE_MAIN_FOLDER_ID',
      '   - GOOGLE_DRIVE_MOBILE_FOLDER_ID',
      '   - Google service account files',
      '',
      '5. Run: npm install'
    ];

    alert(instructions.join('\n'));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Google Drive Sync Management</h1>
        <p className="text-gray-600 mt-2">
          Monitor and control Google Drive to Vercel Blob synchronization
        </p>
      </div>

      {/* Configuration Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="font-semibold mb-3">Configuration Status</h2>
        {syncStatus ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${syncStatus.status === 'ready' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="font-medium">Status: {syncStatus.status}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${syncStatus.configuration.googleDriveConfigured ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm">Google Drive</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${syncStatus.configuration.blobConfigured ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm">Vercel Blob</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${syncStatus.configuration.serviceAccountConfigured ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm">Service Account</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>Cron Schedule: {syncStatus.cronSchedule}</p>
              <p>Last Status Check: {new Date(syncStatus.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading configuration...</p>
        )}
      </div>

      {/* Manual Sync Control */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Manual Sync Control</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={triggerManualSync}
              disabled={isLoading || syncStatus?.status !== 'ready'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Syncing...' : 'Trigger Manual Sync'}
            </Button>
            <Button 
              onClick={loadSyncStatus}
              variant="outline"
            >
              Refresh Status
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              Error: {error}
            </div>
          )}
        </div>
      </div>

      {/* Last Sync Result */}
      {lastResult && (
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Last Sync Result</h2>
          {lastResult.success ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="font-medium text-green-700">Sync Successful</span>
              </div>
              
              {lastResult.result && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-600">Processed:</span>
                    <span className="font-medium ml-1">{lastResult.result.processed}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Uploaded:</span>
                    <span className="font-medium ml-1 text-green-600">{lastResult.result.uploaded}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium ml-1 text-blue-600">{lastResult.result.updated}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Deleted:</span>
                    <span className="font-medium ml-1 text-red-600">{lastResult.result.deleted}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium ml-1">{lastResult.result.duration}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Images.ts Updated:</span>
                    <span className="font-medium ml-1">{lastResult.result.imagesUpdated ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              )}

              {lastResult.result?.errors && lastResult.result.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-orange-700 mb-2">Warnings/Errors:</h4>
                  <ul className="text-sm text-orange-600 space-y-1">
                    {lastResult.result.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="font-medium text-red-700">Sync Failed</span>
              </div>
              <p className="text-red-600 text-sm">{lastResult.error}</p>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4">
            {new Date(lastResult.timestamp).toLocaleString()}
          </p>
        </div>
      )}

      {/* Management Actions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="font-semibold mb-3">Management</h2>
        <div className="space-y-3">
          <div>
            <Button 
              onClick={showRemovalInstructions}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Show Removal Instructions
            </Button>
            <p className="text-sm text-gray-600 mt-1">
              Get step-by-step instructions to cleanly remove the Google Drive sync module
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 