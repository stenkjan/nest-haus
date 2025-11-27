"use client";

interface InteractionEventData {
  id: string;
  eventType: string;
  category: string;
  timestamp: Date;
}

interface SessionSummaryBadgeProps {
  sessionId: string | null;
  totalInteractions?: number;
  sessionDuration?: number; // in minutes
  status?: string;
  compact?: boolean;
}

/**
 * Session Summary Badge
 *
 * Compact display of session statistics for inquiry list
 * Shows interaction count, session duration, and status
 */
export function SessionSummaryBadge({
  sessionId,
  totalInteractions = 0,
  sessionDuration = 0,
  status,
  compact = false,
}: SessionSummaryBadgeProps) {
  if (!sessionId) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
        Keine Session
      </span>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1">
        {totalInteractions > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {totalInteractions} ⚡
          </span>
        )}
        {sessionDuration > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {sessionDuration}min
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {totalInteractions} Interaktionen
      </span>

      {sessionDuration > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {sessionDuration}min Session
        </span>
      )}

      {status && (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            status === "COMPLETED"
              ? "bg-green-100 text-green-800"
              : status === "IN_CART"
                ? "bg-yellow-100 text-yellow-800"
                : status === "ABANDONED"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      )}

      <span className="text-xs text-gray-400 font-mono">
        {sessionId.substring(0, 8)}...
      </span>
    </div>
  );
}

/**
 * Calculate session statistics from interaction data
 */
export function calculateSessionStats(interactions: InteractionEventData[]): {
  totalInteractions: number;
  sessionDuration: number;
  configurationChanges: number;
  conversions: number;
} {
  if (!interactions || interactions.length === 0) {
    return {
      totalInteractions: 0,
      sessionDuration: 0,
      configurationChanges: 0,
      conversions: 0,
    };
  }

  const totalInteractions = interactions.length;

  // Calculate duration from first to last interaction
  const timestamps = interactions
    .map((i) => new Date(i.timestamp).getTime())
    .filter((t) => !isNaN(t))
    .sort((a, b) => a - b);

  const sessionDuration =
    timestamps.length > 1
      ? Math.floor(
          (timestamps[timestamps.length - 1] - timestamps[0]) / (1000 * 60)
        )
      : 0;

  // Count configuration changes
  const configurationChanges = interactions.filter(
    (i) => i.category === "configuration" || i.eventType === "selection"
  ).length;

  // Count conversions
  const conversions = interactions.filter(
    (i) => i.category === "conversion" || i.eventType === "form_submit"
  ).length;

  return {
    totalInteractions,
    sessionDuration,
    configurationChanges,
    conversions,
  };
}
