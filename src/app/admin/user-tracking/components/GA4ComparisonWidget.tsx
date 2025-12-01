"use client";

import { useEffect, useState } from "react";

interface GA4Metrics {
  activeUsers: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface AdminMetrics {
  activeUsers: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export default function GA4ComparisonWidget() {
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // GA4 metrics - you'll need to update these manually or via GA4 API
  const ga4Metrics: GA4Metrics = {
    activeUsers: 78,
    sessions: 0, // Update with real GA4 data
    bounceRate: 0, // Update with real GA4 data
    avgSessionDuration: 0, // Update with real GA4 data
  };

  useEffect(() => {
    async function fetchAdminMetrics() {
      try {
        setLoading(true);
        // Fetch bot analysis to get real user count
        const response = await fetch("/api/admin/bot-analysis");

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        setAdminMetrics({
          activeUsers: data.summary.realUserSessions,
          sessions: data.summary.realUserSessions,
          bounceRate: 0, // Calculate if needed
          avgSessionDuration: 0, // Calculate if needed
        });
      } catch (err) {
        console.error("Failed to fetch admin metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminMetrics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!adminMetrics) {
    return null;
  }

  const alignment = Math.abs(
    ((adminMetrics.activeUsers - ga4Metrics.activeUsers) /
      ga4Metrics.activeUsers) *
      100
  );

  const alignmentQuality =
    alignment < 10
      ? "excellent"
      : alignment < 20
      ? "good"
      : "needs_adjustment";

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 GA4 vs Admin Tracking Comparison
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Metric
              </th>
              <th className="text-right py-3 px-4 font-semibold text-blue-700">
                GA4
              </th>
              <th className="text-right py-3 px-4 font-semibold text-green-700">
                Admin (Real Users)
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-900">Active Users</td>
              <td className="py-3 px-4 text-right text-blue-900 font-bold">
                {ga4Metrics.activeUsers}
              </td>
              <td className="py-3 px-4 text-right text-green-900 font-bold">
                {adminMetrics.activeUsers}
              </td>
              <td className="py-3 px-4 text-right text-gray-600">
                {adminMetrics.activeUsers - ga4Metrics.activeUsers > 0 ? "+" : ""}
                {adminMetrics.activeUsers - ga4Metrics.activeUsers}
              </td>
            </tr>
            {/* Add more rows as data becomes available */}
          </tbody>
        </table>
      </div>

      {/* Alignment Status */}
      <div
        className={`mt-4 rounded-lg p-4 ${
          alignmentQuality === "excellent"
            ? "bg-green-50 border border-green-200"
            : alignmentQuality === "good"
            ? "bg-blue-50 border border-blue-200"
            : "bg-yellow-50 border border-yellow-200"
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
              className={`text-sm font-semibold mb-1 ${
                alignmentQuality === "excellent"
                  ? "text-green-900"
                  : alignmentQuality === "good"
                  ? "text-blue-900"
                  : "text-yellow-900"
              }`}
            >
              {alignmentQuality === "excellent"
                ? "Excellent Alignment"
                : alignmentQuality === "good"
                ? "Good Alignment"
                : "Alignment Needs Adjustment"}
            </h4>
            <p
              className={`text-xs ${
                alignmentQuality === "excellent"
                  ? "text-green-800"
                  : alignmentQuality === "good"
                  ? "text-blue-800"
                  : "text-yellow-800"
              }`}
            >
              {alignmentQuality === "excellent" && (
                <>
                  Admin tracking closely matches GA4 data (±{alignment.toFixed(1)}%).
                  Bot filtering is working correctly.
                </>
              )}
              {alignmentQuality === "good" && (
                <>
                  Admin tracking reasonably matches GA4 (±{alignment.toFixed(1)}%).
                  Minor discrepancies may be due to cookie consent rates or
                  timing differences.
                </>
              )}
              {alignmentQuality === "needs_adjustment" && (
                <>
                  Significant gap detected (±{alignment.toFixed(1)}%). Consider:
                  (1) Running retroactive bot analysis, (2) Adjusting bot
                  detection threshold, or (3) Checking GA4 configuration.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 flex justify-end">
        <a
          href="/admin/user-tracking?filter=real_users"
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          View Real Users Only →
        </a>
      </div>
    </div>
  );
}

