"use client";

import { useEffect, useState } from "react";

interface UserSessionData {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  totalInteractions: number;
  configurationData?: unknown;
  status: string;
  deviceType?: string;
  city?: string;
  country?: string;
}

interface InteractionEventData {
  id: string;
  eventType: string;
  category: string;
  elementId?: string;
  selectionValue?: string;
  timestamp: Date;
  timeSpent?: number;
}

interface UserJourneyProps {
  sessionId: string;
  inquiryId: string;
}

/**
 * User Journey Component
 *
 * Displays complete user journey from session start to inquiry creation
 * Shows all interactions, configuration changes, and timeline
 */
export function UserJourney({ sessionId, inquiryId }: UserJourneyProps) {
  const [sessionData, setSessionData] = useState<UserSessionData | null>(null);
  const [interactions, setInteractions] = useState<InteractionEventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    async function fetchSessionData() {
      try {
        setIsLoading(true);

        // Fetch session and interaction data
        const response = await fetch(
          `/api/sessions/get-journey?sessionId=${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch session data");
        }

        const data = await response.json();

        setSessionData(data.session);
        setInteractions(data.interactions || []);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to fetch user journey:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessionData();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
        ℹ️ Keine Session-Daten verfügbar (Anfrage ohne Konfigurator erstellt)
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
          <span>Lade Benutzerdaten...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4 text-sm text-red-600">
        ⚠️ Fehler beim Laden der Session-Daten: {error}
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
        ℹ️ Session nicht gefunden
      </div>
    );
  }

  const sessionDuration = sessionData.endTime
    ? Math.floor(
        (new Date(sessionData.endTime).getTime() -
          new Date(sessionData.startTime).getTime()) /
          (1000 * 60)
      )
    : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold text-gray-900">
            🔍 Benutzer-Journey
          </h4>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {sessionData.totalInteractions} Interaktionen
            </span>
            {sessionDuration > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {sessionDuration}min Session
              </span>
            )}
            {sessionData.status && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  sessionData.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {sessionData.status}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isExpanded ? "Ausblenden" : "Details anzeigen"}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Session Overview */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Session-ID:</span>
              <span className="ml-2 font-mono text-xs text-gray-900">
                {sessionId}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Start:</span>
              <span className="ml-2 text-gray-900">
                {new Date(sessionData.startTime).toLocaleString("de-DE")}
              </span>
            </div>
            {sessionData.deviceType && (
              <div>
                <span className="text-gray-500">Gerät:</span>
                <span className="ml-2 text-gray-900">
                  {sessionData.deviceType}
                </span>
              </div>
            )}
            {sessionData.city && (
              <div>
                <span className="text-gray-500">Standort:</span>
                <span className="ml-2 text-gray-900">
                  {sessionData.city}, {sessionData.country}
                </span>
              </div>
            )}
          </div>

          {/* Interactions Timeline */}
          {interactions.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                📊 Interaktionsverlauf ({interactions.length})
              </h5>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {interactions.slice(0, 20).map((interaction) => (
                  <div
                    key={interaction.id}
                    className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs"
                  >
                    <span className="text-gray-400 shrink-0">
                      {new Date(interaction.timestamp).toLocaleTimeString(
                        "de-DE",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {interaction.eventType}
                      </span>
                      <span className="text-gray-500 mx-1">→</span>
                      <span className="text-gray-700">
                        {interaction.category}
                      </span>
                      {interaction.elementId && (
                        <span className="text-gray-500 ml-1">
                          ({interaction.elementId})
                        </span>
                      )}
                      {interaction.selectionValue && (
                        <div className="text-blue-600 mt-0.5">
                          {interaction.selectionValue}
                        </div>
                      )}
                    </div>
                    {interaction.timeSpent && interaction.timeSpent > 0 && (
                      <span className="text-gray-400 text-xs shrink-0">
                        {Math.floor(Number(interaction.timeSpent) / 1000)}s
                      </span>
                    )}
                  </div>
                ))}
                {interactions.length > 20 && (
                  <p className="text-xs text-gray-500 text-center py-2">
                    ... und {interactions.length - 20} weitere Interaktionen
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Configuration Data Preview */}
          {sessionData.configurationData && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                🏠 Konfigurationsdaten
              </h5>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                {JSON.stringify(sessionData.configurationData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
