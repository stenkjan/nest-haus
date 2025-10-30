'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackingActions() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAction = async (action: 'remove' | 'reset') => {
    if (!confirm(getConfirmationMessage(action))) {
      return;
    }

    setIsLoading(action);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/user-tracking/actions?action=${action}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({
          type: 'success',
          text: result.message || `${action} completed successfully`
        });
        
        // Refresh the page after a short delay to show the message
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Action failed'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Failed to ${action}: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(null);
    }
  };

  const getConfirmationMessage = (action: string): string => {
    switch (action) {
      case 'remove':
        return 'Are you sure you want to REMOVE ALL configurations? This will permanently delete all sessions with configurations. This action cannot be undone!';
      case 'reset':
        return 'Are you sure you want to RESET all configurations? This will clear all configuration data but keep the sessions. This action cannot be undone!';
      default:
        return 'Are you sure?';
    }
  };

  return (
    <div className="space-y-3">
      {message && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleAction('remove')}
          disabled={isLoading !== null}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isLoading === 'remove' ? 'Removing...' : 'Remove All Configurations'}
        </button>

        <button
          onClick={() => handleAction('reset')}
          disabled={isLoading !== null}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isLoading === 'reset' ? 'Resetting...' : 'Reset All Configurations'}
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        ⚠️ <strong>Warning:</strong> These actions are permanent and cannot be undone. Use with caution.
      </div>
    </div>
  );
}

