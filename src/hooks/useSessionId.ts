/**
 * Session ID Hook
 * 
 * Provides consistent session ID management across the application
 * Generates and persists a session ID in localStorage
 */

import { useState, useEffect } from 'react';

const SESSION_STORAGE_KEY = 'nest-session-id';

/**
 * Generates a unique session ID
 */
function generateSessionId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Hook to get the current session ID
 * Generates one if it doesn't exist
 */
export function useSessionId(): string {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Check if session ID exists in localStorage
    let storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);

    // Generate new session ID if none exists
    if (!storedSessionId) {
      storedSessionId = generateSessionId();
      localStorage.setItem(SESSION_STORAGE_KEY, storedSessionId);
    }

    setSessionId(storedSessionId);
  }, []);

  return sessionId;
}

