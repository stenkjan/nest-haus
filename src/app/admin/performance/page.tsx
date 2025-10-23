/**
 * Performance Metrics - Admin Panel
 *
 * Monitor system performance, API response times, database queries,
 * and user experience metrics.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PerformanceData {
  apiMetrics: {
    avgResponseTime: number;
    medianResponseTime: number;
    maxResponseTime: number;
    errorRate: number;
    requestsPerMinute: number;
    slowestEndpoints: Array<{
      endpoint: string;
      avgTime: number;
      count: number;
    }>;
  };
  databaseMetrics: {
    avgQueryTime: number;
    slowestQueries: Array<{
      query: string;
      avgTime: number;
      count: number;
    }>;
    totalQueries: number;
  };
  userExperience: {
    avgPageLoadTime: number;
    avgImageLoadTime: number;
    avgPriceCalcTime: number;
    totalMeasurements: number;
  };
  recentErrors: Array<{
    timestamp: string;
    error: string;
    endpoint: string;
    count: number;
  }>;
  systemHealth: {
    status: "healthy" | "degraded" | "critical";
    uptime: number;
    totalSessions: number;
    activeSessions: number;
  };
  metadata: {
    dataRange: {
      from: string;
      to: string;
    };
    lastUpdated: string;
    totalMetrics: number;
  };
}

function MetricCard({
  title,
  value,
  unit,
  status,
  change,
}: {
  title: string;
  value: number;
  unit: string;
  status: "good" | "warning" | "error";
  change?: string;
}) {
  const statusColors = {
    good: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  };

  const bgColors = {
    good: "bg-green-50",
    warning: "bg-yellow-50",
    error: "bg-red-50",
  };

  return (
    <div
      className={`${bgColors[status]} rounded-lg shadow p-6 border-l-4 border-${
        status === "good" ? "green" : status === "warning" ? "yellow" : "red"
      }-500`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${statusColors[status]}`}>
            {value}
            {unit}
          </p>
          {change && <p className="text-xs text-gray-500 mt-1">{change}</p>}
        </div>
        <div
          className={`w-3 h-3 rounded-full ${
            status === "good"
              ? "bg-green-500"
              : status === "warning"
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
        ></div>
      </div>
    </div>
  );
}

function ErrorsTable({ data }: { data: PerformanceData | null }) {
  if (!data || data.recentErrors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Errors
        </h3>
        <p className="text-gray-500">
          No recent errors - system running smoothly!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Errors
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Time
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Error
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Endpoint
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Count
              </th>
            </tr>
          </thead>
          <tbody>
            {data.recentErrors.map((error, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(error.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {error.error}
                </td>
                <td className="py-3 px-4 text-sm font-mono text-gray-600">
                  {error.endpoint}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {error.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemHealth({ data }: { data: PerformanceData | null }) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Health
        </h3>
        <p className="text-gray-500">Loading system health data...</p>
      </div>
    );
  }

  const { systemHealth } = data;
  const statusColor =
    systemHealth.status === "healthy"
      ? "text-green-600"
      : systemHealth.status === "degraded"
        ? "text-yellow-600"
        : "text-red-600";

  const statusBg =
    systemHealth.status === "healthy"
      ? "bg-green-100"
      : systemHealth.status === "degraded"
        ? "bg-yellow-100"
        : "bg-red-100";

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        System Health
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusBg} ${statusColor}`}
          >
            {systemHealth.status.toUpperCase()}
          </span>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Uptime</span>
            <span className="text-gray-900">{systemHealth.uptime}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${systemHealth.uptime}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Total Sessions</span>
            <span className="text-gray-900 font-semibold">
              {systemHealth.totalSessions}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Active Sessions</span>
            <span className="text-green-600 font-semibold">
              {systemHealth.activeSessions}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlowEndpoints({ data }: { data: PerformanceData | null }) {
  if (!data || data.apiMetrics.slowestEndpoints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Slowest Endpoints
        </h3>
        <p className="text-gray-500">No endpoint data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Slowest Endpoints
      </h3>
      <div className="space-y-3">
        {data.apiMetrics.slowestEndpoints.map((endpoint, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="text-sm font-mono text-gray-900">
                {endpoint.endpoint}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {endpoint.count} requests
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-lg font-semibold ${
                  endpoint.avgTime > 200
                    ? "text-red-600"
                    : endpoint.avgTime > 100
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {Math.round(endpoint.avgTime)}ms
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/performance");

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching performance data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex text-sm text-gray-500 mb-2">
                <Link href="/admin" className="hover:text-gray-700">
                  Admin
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Performance Metrics</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">
                Performance Metrics
              </h1>
              <p className="text-gray-600">
                Monitor system performance and user experience
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={fetchData}
                disabled={loading}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh Data"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {loading && !data ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading performance data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* API Performance Metrics */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                API Performance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Avg Response Time"
                  value={data?.apiMetrics.avgResponseTime || 0}
                  unit="ms"
                  status={
                    (data?.apiMetrics.avgResponseTime || 0) > 150
                      ? "warning"
                      : "good"
                  }
                />
                <MetricCard
                  title="Error Rate"
                  value={data?.apiMetrics.errorRate || 0}
                  unit="%"
                  status={
                    (data?.apiMetrics.errorRate || 0) > 1 ? "error" : "good"
                  }
                />
                <MetricCard
                  title="Requests/min"
                  value={data?.apiMetrics.requestsPerMinute || 0}
                  unit=""
                  status="good"
                />
                <MetricCard
                  title="Total Metrics"
                  value={data?.metadata.totalMetrics || 0}
                  unit=""
                  status="good"
                />
              </div>
            </div>

            {/* Database Performance */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Database Performance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Avg Query Time"
                  value={data?.databaseMetrics.avgQueryTime || 0}
                  unit="ms"
                  status={
                    (data?.databaseMetrics.avgQueryTime || 0) > 50
                      ? "warning"
                      : "good"
                  }
                />
                <MetricCard
                  title="Total Queries"
                  value={data?.databaseMetrics.totalQueries || 0}
                  unit=""
                  status="good"
                />
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Slowest Query
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {data?.databaseMetrics.slowestQueries[0]?.query.substring(
                          0,
                          30
                        ) || "N/A"}
                        ...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {data?.databaseMetrics.slowestQueries[0]?.avgTime || 0}
                        ms
                      </p>
                    </div>
                    <div className="text-2xl">🐌</div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Experience Metrics */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User Experience Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                  title="Page Load Time"
                  value={data?.userExperience.avgPageLoadTime || 0}
                  unit="ms"
                  status={
                    (data?.userExperience.avgPageLoadTime || 0) > 3000
                      ? "warning"
                      : "good"
                  }
                />
                <MetricCard
                  title="Image Load Time"
                  value={data?.userExperience.avgImageLoadTime || 0}
                  unit="ms"
                  status={
                    (data?.userExperience.avgImageLoadTime || 0) > 1000
                      ? "warning"
                      : "good"
                  }
                />
                <MetricCard
                  title="Price Calc Time"
                  value={data?.userExperience.avgPriceCalcTime || 0}
                  unit="ms"
                  status={
                    (data?.userExperience.avgPriceCalcTime || 0) > 100
                      ? "warning"
                      : "good"
                  }
                />
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <SlowEndpoints data={data} />
              <SystemHealth data={data} />
            </div>

            <ErrorsTable data={data} />

            {/* Performance Recommendations */}
            {data && (
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ⚡ Performance Recommendations
                </h3>
                <div className="space-y-4">
                  {data.apiMetrics.avgResponseTime > 150 && (
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-medium text-yellow-900">
                        Optimize API Response Time
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Average API response time is{" "}
                        {data.apiMetrics.avgResponseTime}
                        ms. Consider implementing caching or optimizing queries.
                      </p>
                    </div>
                  )}

                  {data.databaseMetrics.avgQueryTime > 50 && (
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-medium text-yellow-900">
                        Optimize Database Queries
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Database queries averaging{" "}
                        {data.databaseMetrics.avgQueryTime}
                        ms. Consider adding indexes or using cached aggregates.
                      </p>
                    </div>
                  )}

                  {data.recentErrors.length > 0 && (
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-medium text-red-900">
                        Recent Errors Detected
                      </h4>
                      <p className="text-sm text-red-700">
                        {data.recentErrors.length} errors in the last 24 hours.
                        Review the errors table above for details.
                      </p>
                    </div>
                  )}

                  {data.systemHealth.status === "healthy" &&
                    data.apiMetrics.avgResponseTime < 150 && (
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-medium text-green-900">
                          Excellent Performance
                        </h4>
                        <p className="text-sm text-green-700">
                          Your system is running smoothly with good response
                          times and stable health metrics.
                        </p>
                      </div>
                    )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
