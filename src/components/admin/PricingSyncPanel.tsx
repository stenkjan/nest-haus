/**
 * Pricing Sync Admin Component
 * 
 * Add this to your admin dashboard to trigger manual syncs
 */

'use client';

import { useState } from 'react';

interface SyncResult {
  success: boolean;
  itemsUpdated: number;
  itemsUnchanged: number;
  itemsAdded: number;
  itemsRemoved: number;
  errors: string[];
  duration: number;
  timestamp: string;
  changes?: Array<{
    category: string;
    itemKey: string;
    action: 'added' | 'updated' | 'removed';
    oldPrice?: number;
    newPrice?: number;
  }>;
}

interface SyncStatus {
  lastSync: string | null;
  nextScheduledSync: string;
}

export function PricingSyncPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch sync status on mount
  useState(() => {
    fetchStatus();
  });

  async function fetchStatus() {
    try {
      const res = await fetch('/api/sync/pricing');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch sync status:', err);
    }
  }

  async function handleSync() {
    const adminPassword = prompt('Enter admin password to sync pricing:');
    if (!adminPassword) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/sync/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      setResult(data);
      await fetchStatus(); // Refresh status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Pricing Sync Control
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Sync pricing data from Google Sheets to database
        </p>
      </div>

      {/* Sync Status */}
      {status && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Sync Status</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Last Sync:</span>
              <span className="font-medium">
                {status.lastSync
                  ? new Date(status.lastSync).toLocaleString('de-AT')
                  : 'Never'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Next Scheduled:</span>
              <span className="font-medium">
                {new Date(status.nextScheduledSync).toLocaleString('de-AT')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Manual Sync Button */}
      <div>
        <button
          onClick={handleSync}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Syncing...
            </span>
          ) : (
            '🔄 Sync Pricing Now'
          )}
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Fetches latest pricing from Google Sheets and updates database
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-1">Error</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Result */}
      {result && result.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-3">
            ✅ Sync Completed Successfully
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-3 rounded">
              <div className="text-2xl font-bold text-green-600">
                {result.itemsAdded}
              </div>
              <div className="text-xs text-gray-600">Added</div>
            </div>
            <div className="bg-white p-3 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {result.itemsUpdated}
              </div>
              <div className="text-xs text-gray-600">Updated</div>
            </div>
            <div className="bg-white p-3 rounded">
              <div className="text-2xl font-bold text-gray-600">
                {result.itemsUnchanged}
              </div>
              <div className="text-xs text-gray-600">Unchanged</div>
            </div>
            <div className="bg-white p-3 rounded">
              <div className="text-2xl font-bold text-orange-600">
                {result.itemsRemoved}
              </div>
              <div className="text-xs text-gray-600">Removed</div>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <div>Duration: {result.duration}ms</div>
            <div>
              Timestamp: {new Date(result.timestamp).toLocaleString('de-AT')}
            </div>
          </div>

          {/* Changes Details */}
          {result.changes && result.changes.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold text-sm text-gray-900 hover:text-gray-700">
                View Changes ({result.changes.length})
              </summary>
              <div className="mt-2 max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-2 py-1 text-left">Category</th>
                      <th className="px-2 py-1 text-left">Item</th>
                      <th className="px-2 py-1 text-left">Action</th>
                      <th className="px-2 py-1 text-right">Old Price</th>
                      <th className="px-2 py-1 text-right">New Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.changes.map((change, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-2 py-1">{change.category}</td>
                        <td className="px-2 py-1">{change.itemKey}</td>
                        <td className="px-2 py-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              change.action === 'added'
                                ? 'bg-green-100 text-green-800'
                                : change.action === 'updated'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {change.action}
                          </span>
                        </td>
                        <td className="px-2 py-1 text-right">
                          {change.oldPrice
                            ? `€${(change.oldPrice / 100).toFixed(2)}`
                            : '—'}
                        </td>
                        <td className="px-2 py-1 text-right">
                          {change.newPrice
                            ? `€${(change.newPrice / 100).toFixed(2)}`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      )}

      {/* Failed Result */}
      {result && !result.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-2">❌ Sync Failed</h3>
          {result.errors.length > 0 && (
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {result.errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ About Pricing Sync</h4>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Syncs from Google Sheets (read-only)</li>
          <li>Automatic sync runs daily at 2:00 AM</li>
          <li>Only changed items are updated</li>
          <li>All changes are logged in database</li>
          <li>Prices stored in cents (no floating point errors)</li>
        </ul>
      </div>
    </div>
  );
}
