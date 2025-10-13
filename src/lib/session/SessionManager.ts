/**
 * Server-Side Session Management
 * Handles session persistence and synchronization
 */

import { Configuration } from "@/store/configuratorStore";

export interface SessionData {
    sessionId: string;
    configuration: Configuration;
    currentPrice: number;
    timestamp: number;
}

export class SessionManager {
    /**
     * Sync session data to server (non-blocking)
     */
    static async syncSession(sessionData: SessionData): Promise<boolean> {
        try {
            const response = await fetch('/api/sessions/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData),
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.warn('Session sync failed:', error);
            return false;
        }
    }

    /**
     * Debounced session sync to prevent excessive API calls
     */
    private static syncTimeout: NodeJS.Timeout | null = null;

    static debouncedSync(sessionData: SessionData, delay: number = 2000): void {
        if (this.syncTimeout) {
            clearTimeout(this.syncTimeout);
        }

        this.syncTimeout = setTimeout(() => {
            this.syncSession(sessionData).catch(() => {
                // Silent failure - don't block user experience
            });
        }, delay);
    }

    /**
     * Get session data from server
     */
    static async getSession(sessionId: string): Promise<SessionData | null> {
        try {
            const response = await fetch(`/api/sessions/${sessionId}`);
            if (!response.ok) return null;

            const data = await response.json();
            return data.session || null;
        } catch (error) {
            console.warn('Session retrieval failed:', error);
            return null;
        }
    }

    /**
     * Validate session data structure
     */
    static validateSessionData(data: unknown): data is SessionData {
        return (
            data !== null &&
            typeof data === 'object' &&
            'sessionId' in data &&
            'configuration' in data &&
            'currentPrice' in data &&
            'timestamp' in data &&
            typeof (data as SessionData).sessionId === 'string' &&
            typeof (data as SessionData).configuration === 'object' &&
            typeof (data as SessionData).currentPrice === 'number' &&
            typeof (data as SessionData).timestamp === 'number'
        );
    }

    /**
     * Generate unique session ID
     */
    static generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
