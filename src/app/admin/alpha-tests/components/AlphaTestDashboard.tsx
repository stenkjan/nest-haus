"use client";

import React, { useState, useEffect } from "react";
// Using emoji icons instead of lucide-react to avoid dependency issues

interface TestSummary {
  totalTests: number;
  completedTests: number;
  abandonedTests: number;
  errorTests: number;
  completionRate: number;
  averageRating: number;
  averageDuration: number;
}

interface QuestionAnalysis {
  questionId: string;
  questionText: string;
  questionType: string;
  averageRating?: number;
  responseCount: number;
  responses: any[];
}

interface RecentTest {
  id: string;
  testId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  overallRating?: number;
  completionRate?: number;
  errorCount: number;
  duration?: number;
  deviceType: string;
}

interface TestAnalytics {
  summary: TestSummary;
  questionAnalysis: QuestionAnalysis[];
  deviceStats: Record<string, number>;
  errorAnalysis: {
    totalErrors: number;
    consoleErrors: number;
    interactionErrors: number;
  };
  recentTests: RecentTest[];
  timeRange: string;
  generatedAt: string;
}

export default function AlphaTestDashboard() {
  const [analytics, setAnalytics] = useState<TestAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/usability-tests?timeRange=${timeRange}`
      );
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch analytics");
      }
    } catch (err) {
      setError("Network error while fetching analytics");
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const viewTestDetails = async (testId: string) => {
    setSelectedTest(testId);
    // This would open a modal or navigate to detailed view
    console.log("Viewing test details for:", testId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <span className="text-red-600">⚠️</span>
          <span className="text-red-800 font-medium">
            Error loading analytics
          </span>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl text-gray-400 mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No test data available
        </h3>
        <p className="text-gray-600">No alpha tests have been completed yet.</p>
      </div>
    );
  }

  const { summary, questionAnalysis, deviceStats, errorAnalysis, recentTests } =
    analytics;

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {range === "7d"
                ? "Last 7 days"
                : range === "30d"
                  ? "Last 30 days"
                  : "Last 90 days"}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          Generated: {new Date(analytics.generatedAt).toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900">
                {summary.totalTests}
              </p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completion Rate
              </p>
              <p className="text-3xl font-bold text-green-600">
                {summary.completionRate}%
              </p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {summary.completedTests} of {summary.totalTests} completed
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Average Rating
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                {summary.averageRating}/10
              </p>
            </div>
            <span className="text-3xl">⭐</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-3xl font-bold text-purple-600">
                {summary.averageDuration}m
              </p>
            </div>
            <span className="text-3xl">⏱️</span>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Test Status Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="text-gray-700">Completed</span>
              </div>
              <span className="font-medium">{summary.completedTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">❌</span>
                <span className="text-gray-700">Abandoned</span>
              </div>
              <span className="font-medium">{summary.abandonedTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-gray-700">Errors</span>
              </div>
              <span className="font-medium">{summary.errorTests}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Device Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(deviceStats).map(([device, count]) => (
              <div key={device} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {device === "mobile" ? (
                    <span className="text-blue-600">📱</span>
                  ) : (
                    <span className="text-gray-600">💻</span>
                  )}
                  <span className="text-gray-700 capitalize">{device}</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Question Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questionAnalysis.map((question) => (
                <tr key={question.questionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div
                      className="max-w-xs truncate"
                      title={question.questionText}
                    >
                      {question.questionText}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {question.questionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {question.responseCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {question.averageRating ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span>{question.averageRating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Tests
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {test.testId.substring(0, 12)}...
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        test.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : test.status === "ABANDONED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {test.overallRating ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span>{test.overallRating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {test.duration
                      ? `${Math.round(test.duration / 1000 / 60)}m`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      {test.deviceType === "mobile" ? (
                        <span className="text-blue-600">📱</span>
                      ) : (
                        <span className="text-gray-600">💻</span>
                      )}
                      <span className="capitalize">{test.deviceType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(test.startedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => viewTestDetails(test.testId)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>👁️</span>
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Analysis */}
      {errorAnalysis.totalErrors > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Error Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {errorAnalysis.totalErrors}
              </div>
              <div className="text-sm text-red-700">Total Errors</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {errorAnalysis.consoleErrors}
              </div>
              <div className="text-sm text-orange-700">Console Errors</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {errorAnalysis.interactionErrors}
              </div>
              <div className="text-sm text-yellow-700">Interaction Errors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
