"use client";

import { useEffect, useState } from "react";

interface BotAnalysisData {
  summary: {
    totalSessions: number;
    botSessions: number;
    realUserSessions: number;
    unknownSessions: number;
    botPercentage: number;
    realUserPercentage: number;
  };
  usaSessions: {
    total: number;
    bots: number;
    realUsers: number;
    unknown: number;
    botPercentage: number;
  };
  botTypes: Record<string, number>;
  ga4Comparison: {
    ga4ActiveUsers: number;
    adminTotalSessions: number;
    adminRealUserSessions: number;
    expectedAlignment: string;
    alignmentPercentage: number;
  };
}

export default function BotAnalysisWidget() {
  const [data, setData] = useState<BotAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/bot-analysis");

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch bot analysis:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          🤖 Bot Analysis
        </h3>
        <p className="text-red-600 text-sm">Failed to load bot analysis</p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  const alignmentQuality =
    data.ga4Comparison.alignmentPercentage > 90 && data.ga4Comparison.alignmentPercentage < 110
      ? "excellent"
      : data.ga4Comparison.alignmentPercentage > 80 && data.ga4Comparison.alignmentPercentage < 120
      ? "good"
      : "needs_attention";

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          🤖 Bot Detection & GA4 Alignment
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">✅ Real Users</div>
          <div className="text-3xl font-bold text-green-900">
            {data.summary.realUserSessions}
          </div>
          <div className="text-xs text-green-600 mt-1">
            {data.summary.realUserPercentage.toFixed(1)}% of total
          </div>
        </div>

        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">🤖 Bots Filtered</div>
          <div className="text-3xl font-bold text-red-900">
            {data.summary.botSessions}
          </div>
          <div className="text-xs text-red-600 mt-1">
            {data.summary.botPercentage.toFixed(1)}% of total
          </div>
        </div>

        <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-700 mb-1">❓ Unknown</div>
          <div className="text-3xl font-bold text-gray-900">
            {data.summary.unknownSessions}
          </div>
          <div className="text-xs text-gray-600 mt-1">Needs analysis</div>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Session Quality Distribution
          </span>
        </div>
        <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${data.summary.realUserPercentage}%` }}
          >
            {data.summary.realUserPercentage > 10 &&
              `${data.summary.realUserPercentage.toFixed(0)}%`}
          </div>
          <div
            className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${data.summary.botPercentage}%` }}
          >
            {data.summary.botPercentage > 10 &&
              `${data.summary.botPercentage.toFixed(0)}%`}
          </div>
        </div>
      </div>

      {/* USA Sessions Analysis */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-yellow-900 mb-3">
          🇺🇸 USA Sessions Breakdown
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-900">
              {data.usaSessions.total}
            </div>
            <div className="text-xs text-yellow-700">Total USA</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data.usaSessions.realUsers}
            </div>
            <div className="text-xs text-green-700">Real Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {data.usaSessions.bots}
            </div>
            <div className="text-xs text-red-700">
              Bots ({data.usaSessions.botPercentage.toFixed(0)}%)
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {data.usaSessions.unknown}
            </div>
            <div className="text-xs text-gray-700">Unknown</div>
          </div>
        </div>
      </div>

      {/* Bot Types */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Bot Types Detected
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          {Object.entries(data.botTypes).map(([type, count]) => (
            <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-600 capitalize">{type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GA4 Comparison */}
      <div
        className={`border rounded-lg p-4 ${
          alignmentQuality === "excellent"
            ? "border-green-200 bg-green-50"
            : alignmentQuality === "good"
            ? "border-blue-200 bg-blue-50"
            : "border-yellow-200 bg-yellow-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">
            {alignmentQuality === "excellent"
              ? "✅"
              : alignmentQuality === "good"
              ? "📊"
              : "⚠️"}
          </div>
          <div className="flex-1">
            <h4
              className={`text-sm font-semibold mb-2 ${
                alignmentQuality === "excellent"
                  ? "text-green-900"
                  : alignmentQuality === "good"
                  ? "text-blue-900"
                  : "text-yellow-900"
              }`}
            >
              GA4 Data Alignment
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-600">GA4 Active Users</div>
                <div className="text-2xl font-bold text-gray-900">
                  {data.ga4Comparison.ga4ActiveUsers}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Admin Real Users</div>
                <div className="text-2xl font-bold text-gray-900">
                  {data.ga4Comparison.adminRealUserSessions}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-700 mt-3">
              <strong>Alignment:</strong> {data.ga4Comparison.expectedAlignment}{" "}
              ({data.ga4Comparison.alignmentPercentage.toFixed(0)}% match)
            </p>
            {alignmentQuality === "needs_attention" && (
              <p className="text-xs text-yellow-800 mt-2">
                ⚠️ Significant gap detected. Consider running retroactive bot
                analysis or adjusting bot detection threshold.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

