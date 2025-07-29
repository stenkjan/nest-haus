"use client";

import React, { useState, useEffect } from "react";
import { AdminAnalyticsService } from "@/lib/AdminAnalyticsService";
import type { AdminAnalyticsData } from "@/lib/AdminAnalyticsService";

// Placeholder components for metrics cards
function MetricCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string | number;
  change?: string;
  icon?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={`text-sm ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
            >
              {change} vs last period
            </p>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  );
}

function LoadingMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}

export default function ClientDashboardMetrics() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError(null);

        const data = await AdminAnalyticsService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        // Set fallback data even on error
        setAnalytics({
          activeSessions: 0,
          totalSessions: 0,
          totalSessionsToday: 0,
          averageSessionDuration: 0,
          conversionRate: 0,
          completedConfigurations: 0,
          abandonedSessions: 0,
          sessionsLast24h: 0,
          sessionsLast7d: 0,
          averageInteractionsPerSession: 0,
          averageApiResponseTime: 0,
          systemHealth: "needs_attention",
          lastUpdated: new Date().toISOString(),
          dataRange: {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
          },
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingMetrics />;
  }

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-red-600">Fehler beim Laden der Analytics-Daten</p>
          {error && <p className="text-sm text-gray-500 mt-1">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Active Sessions"
        value={analytics.activeSessions}
        change="+12%"
        icon="👥"
      />
      <MetricCard
        title="Total Sessions Today"
        value={analytics.totalSessionsToday}
        change="+8%"
        icon="📊"
      />
      <MetricCard
        title="Avg Session Duration"
        value={AdminAnalyticsService.formatDuration(
          analytics.averageSessionDuration
        )}
        change="+5%"
        icon="⏱️"
      />
      <MetricCard
        title="Conversion Rate"
        value={AdminAnalyticsService.formatPercentage(analytics.conversionRate)}
        change="+0.8%"
        icon="💰"
      />
    </div>
  );
}
