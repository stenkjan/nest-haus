"use client";

import { useEffect, useState } from "react";

interface ConsentStats {
  totalSessions: number;
  totalWithDecision: number;
  analyticsAccepted: number;
  analyticsRejected: number;
  noDecisionYet: number;
  acceptanceRate: number;
  rejectionRate: number;
  noDecisionRate: number;
}

export default function GA4ConsentWidget() {
  const [stats, setStats] = useState<ConsentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConsentStats() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/consent-stats");

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch consent stats:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchConsentStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchConsentStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          GA4 Cookie Consent Tracking
        </h3>
        <p className="text-red-600 text-sm">
          Failed to load consent statistics
        </p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          🍪 GA4 Cookie Consent Tracking
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total Sessions */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalSessions.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">All user sessions</div>
        </div>

        {/* Analytics Accepted */}
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">✅ Accepted</div>
          <div className="text-2xl font-bold text-green-900">
            {stats.analyticsAccepted.toLocaleString()}
          </div>
          <div className="text-xs text-green-600 mt-1">
            {stats.acceptanceRate.toFixed(1)}% of total
          </div>
        </div>

        {/* Analytics Rejected */}
        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">❌ Rejected</div>
          <div className="text-2xl font-bold text-red-900">
            {stats.analyticsRejected.toLocaleString()}
          </div>
          <div className="text-xs text-red-600 mt-1">
            {stats.rejectionRate.toFixed(1)}% of total
          </div>
        </div>

        {/* No Decision */}
        <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-700 mb-1">⏳ No Decision</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.noDecisionYet.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {stats.noDecisionRate.toFixed(1)}% of total
          </div>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Consent Distribution
          </span>
          <span className="text-xs text-gray-500">
            {stats.totalWithDecision.toLocaleString()} decisions made
          </span>
        </div>
        <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${stats.acceptanceRate}%` }}
          >
            {stats.acceptanceRate > 10 && `${stats.acceptanceRate.toFixed(0)}%`}
          </div>
          <div
            className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${stats.rejectionRate}%` }}
          >
            {stats.rejectionRate > 10 && `${stats.rejectionRate.toFixed(0)}%`}
          </div>
          <div
            className="bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium"
            style={{ width: `${stats.noDecisionRate}%` }}
          >
            {stats.noDecisionRate > 10 && `${stats.noDecisionRate.toFixed(0)}%`}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              GA4 Tracking vs Admin Tracking
            </h4>
            <p className="text-xs text-blue-800">
              <strong>Admin Tracking (Your PostgreSQL):</strong> Captures{" "}
              {stats.totalSessions.toLocaleString()} sessions (100% of users)
              <br />
              <strong>GA4 Full Tracking:</strong> Only captures{" "}
              {stats.analyticsAccepted.toLocaleString()} sessions (
              {stats.acceptanceRate.toFixed(1)}% who accepted)
              <br />
              <strong>GA4 Cookieless Pings:</strong> Captures anonymized data
              from {stats.analyticsRejected.toLocaleString()} sessions who
              rejected cookies
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      {stats.acceptanceRate < 50 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                Low Consent Rate
              </h4>
              <p className="text-xs text-yellow-800">
                Only {stats.acceptanceRate.toFixed(0)}% of users are accepting
                analytics cookies. Consider optimizing your cookie banner or
                providing clearer value proposition for data collection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

