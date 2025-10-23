/**
 * User Journey Tracking - Admin Panel
 *
 * Analyzes user paths through the configurator, identifies drop-off points,
 * and provides insights for optimizing the user experience.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface JourneyData {
  dropOffPoints: Array<{
    step: string;
    users: number;
    dropOffRate: number;
    avgTimeSpent: number;
  }>;
  commonPaths: Array<{
    path: string;
    frequency: number;
    conversionRate: number;
  }>;
  timeSpentByStep: Array<{
    step: string;
    avgTime: number;
    medianTime: number;
    minTime: number;
    maxTime: number;
  }>;
  funnelSteps: Array<{
    step: string;
    stepNumber: number;
    users: number;
    completionRate: number;
    dropOffCount: number;
  }>;
  metadata: {
    totalSessions: number;
    completedJourneys: number;
    averageSteps: number;
    averageCompletionTime: number;
  };
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
}

function FunnelChart({ data }: { data: JourneyData | null }) {
  if (!data || data.funnelSteps.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configurator Funnel Analysis
        </h3>
        <p className="text-gray-500">No funnel data available</p>
      </div>
    );
  }

  const maxUsers = Math.max(...data.funnelSteps.map((d) => d.users));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Configurator Funnel Analysis
      </h3>
      <div className="space-y-3">
        {data.funnelSteps.map((point, index) => {
          const widthPercentage = (point.users / maxUsers) * 100;
          const isLast = index === data.funnelSteps.length - 1;
          const dropOffRate =
            point.dropOffCount > 0
              ? point.dropOffCount / (point.users + point.dropOffCount)
              : 0;

          return (
            <div key={point.step} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {point.step}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {point.users} users
                  </span>
                  {!isLast && point.dropOffCount > 0 && (
                    <span
                      className={`text-sm font-medium ${
                        dropOffRate > 0.3
                          ? "text-red-600"
                          : dropOffRate > 0.15
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {Math.round(dropOffRate * 100)}% drop-off
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className={`h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                    dropOffRate > 0.3
                      ? "bg-red-500"
                      : dropOffRate > 0.15
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${widthPercentage}%` }}
                >
                  {widthPercentage > 20 ? `${point.users}` : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data.metadata.totalSessions}
          </div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.metadata.completedJourneys}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.metadata.totalSessions > 0
              ? Math.round(
                  (data.metadata.completedJourneys /
                    data.metadata.totalSessions) *
                    100
                )
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
        </div>
      </div>
    </div>
  );
}

function CommonPaths({ data }: { data: JourneyData | null }) {
  if (!data || data.commonPaths.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Most Common User Paths
        </h3>
        <p className="text-gray-500">No path data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Most Common User Paths
      </h3>
      <div className="space-y-3">
        {data.commonPaths.slice(0, 5).map((path, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {path.path}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Conversion Rate: {Math.round(path.conversionRate * 100)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">
                {path.frequency}
              </div>
              <div className="text-xs text-gray-600">users</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimeAnalysis({ data }: { data: JourneyData | null }) {
  if (!data || data.timeSpentByStep.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Time Spent Analysis
        </h3>
        <p className="text-gray-500">No time analysis data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Time Spent Analysis
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Configuration Step
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Average Time
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Median Time
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.timeSpentByStep.map((step, index) => {
              const isHighTime = step.avgTime > 180; // More than 3 minutes

              return (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {step.step}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatTime(step.avgTime)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatTime(step.medianTime)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isHighTime
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {isHighTime ? "Needs Optimization" : "Good"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UserJourneyPage() {
  const [data, setData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/user-journey");

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
      console.error("Error fetching user journey data:", err);
    } finally {
      setLoading(false);
    }
  };

  const findTopDropOffPoint = () => {
    if (!data || data.funnelSteps.length === 0) return "N/A";

    let maxDropOff = 0;
    let topStep = "N/A";

    data.funnelSteps.forEach((step) => {
      if (step.dropOffCount > maxDropOff) {
        maxDropOff = step.dropOffCount;
        topStep = step.step;
      }
    });

    return topStep;
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
                <span className="text-gray-900">User Journey Tracking</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">
                User Journey Analysis
              </h1>
              <p className="text-gray-600">
                Track user paths and optimize the configurator experience
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
              <p className="mt-4 text-gray-600">Loading journey data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl">🎯</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Avg Steps Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data?.metadata.averageSteps.toFixed(1) || "0"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl">⏱️</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Avg Completion Time
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data
                        ? formatTime(data.metadata.averageCompletionTime)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl">🚪</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Top Exit Point
                    </p>
                    <p className="text-lg font-bold text-red-600">
                      {findTopDropOffPoint()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl">📊</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Sessions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data?.metadata.totalSessions || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <FunnelChart data={data} />
              <CommonPaths data={data} />
            </div>

            <TimeAnalysis data={data} />

            {/* Recommendations */}
            {data && data.funnelSteps.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎯 Optimization Recommendations
                </h3>
                <div className="space-y-4">
                  {data.funnelSteps
                    .filter((step) => step.dropOffCount > 0)
                    .sort((a, b) => b.dropOffCount - a.dropOffCount)
                    .slice(0, 3)
                    .map((step, index) => {
                      const dropOffRate =
                        step.dropOffCount / (step.users + step.dropOffCount);
                      const severity =
                        dropOffRate > 0.3
                          ? "red"
                          : dropOffRate > 0.15
                            ? "yellow"
                            : "green";

                      return (
                        <div
                          key={index}
                          className={`border-l-4 border-${severity}-500 pl-4`}
                        >
                          <h4 className={`font-medium text-${severity}-900`}>
                            {Math.round(dropOffRate * 100)}% drop-off at{" "}
                            {step.step}
                          </h4>
                          <p className={`text-sm text-${severity}-700`}>
                            {step.dropOffCount} users dropped off at this step.
                            Consider improving guidance or simplifying options.
                          </p>
                        </div>
                      );
                    })}

                  {data.metadata.completedJourneys > 0 && (
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-green-900">
                        Strong Completion Rate
                      </h4>
                      <p className="text-sm text-green-700">
                        {Math.round(
                          (data.metadata.completedJourneys /
                            data.metadata.totalSessions) *
                            100
                        )}
                        % of users complete the journey. Keep up the good work!
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
