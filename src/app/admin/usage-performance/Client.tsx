/**
 * Usage & Performance Monitoring - Combined Dashboard
 *
 * Monitors service capacity limits AND system performance:
 * - NeonDB (storage, queries, active time)
 * - Vercel (serverless functions, bandwidth)
 * - Redis/Upstash (commands, memory)
 * - Resend (email sending)
 * - API response times
 * - User experience metrics
 *
 * Visual indicators: 🟢 <70% | 🟡 70-90% | 🔴 >90%
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ServiceStatus {
  rateLimit: {
    current: number;
    limit: number;
    percentage: number;
    resetTime: number;
    window?: string;
    isRealData?: boolean;
  };
  database: {
    records: {
      total: number;
      sessions: number;
      selectionEvents: number;
      interactionEvents: number;
      configurations: number;
    };
    storage: number;
    percentage: number;
  };
  redis: {
    commands: number;
    limit: { commands: number };
    percentage: number;
  };
  email: {
    sent: number;
    limit: { monthly: number };
    percentage: number;
  };
  storage: {
    used: number;
    limit: number;
    percentage: number;
    blobCount?: number;
    operations?: {
      simple: number;
      advanced: number;
    };
    isRealData?: boolean;
  };
  warnings: Array<{
    service: string;
    level: "warning" | "critical";
    percentage: number;
    message: string;
    recommendation: string;
  }>;
}

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

export default function UsagePerformancePage() {
  const [usage, setUsage] = useState<ServiceStatus | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'performance'>('overview');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [usageRes, perfRes] = await Promise.all([
        fetch("/api/admin/usage"),
        fetch("/api/admin/performance")
      ]);

      const usageData = await usageRes.json();
      const perfData = await perfRes.json();

      if (usageData.success) {
        setUsage(usageData.data);
      }
      if (perfData.success) {
        setPerformance(perfData.data);
      }

      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError("Network error: Could not fetch monitoring data");
      console.error("Monitoring fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (percentage: number): string => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusEmoji = (percentage: number): string => {
    if (percentage >= 90) return "🔴";
    if (percentage >= 70) return "🟡";
    return "🟢";
  };

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getHealthStatus = () => {
    if (!performance) return { emoji: "⚪", text: "Unknown", color: "text-gray-600" };
    
    const status = performance.systemHealth.status;
    if (status === "healthy") return { emoji: "🟢", text: "Healthy", color: "text-green-600" };
    if (status === "degraded") return { emoji: "🟡", text: "Degraded", color: "text-yellow-600" };
    return { emoji: "🔴", text: "Critical", color: "text-red-600" };
  };

  if (loading && !usage && !performance) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading monitoring data...</p>
          </div>
        </div>
      </div>
    );
  }

  const healthStatus = getHealthStatus();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-28">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href="/admin"
                  className="text-blue-600 hover:text-blue-800 text-2xl font-medium"
                  title="Back to Admin"
                >
                  ←
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                  Usage & Performance Monitoring
                </h1>
              </div>
              <p className="text-gray-600 ml-12">
                Real-time monitoring of service capacity & system performance
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-2xl font-bold ${healthStatus.color}`}>
                  {healthStatus.emoji} {healthStatus.text}
                </span>
              </div>
              {lastUpdate && (
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
              <button
                onClick={fetchData}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {loading ? "Refreshing..." : "Refresh Now"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`${
                activeTab === 'usage'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              💾 Service Usage
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              ⚡ Performance
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* NeonDB */}
              {usage && (
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">NeonDB</span>
                    <span className="text-2xl">{getStatusEmoji(usage.database.percentage)}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {usage.database.percentage.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500">{(usage.database.storage / 1024 / 1024).toFixed(0)} MB used</p>
                </div>
              )}

              {/* Redis */}
              {usage && (
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Redis</span>
                    <span className="text-2xl">{getStatusEmoji(usage.redis.percentage)}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {usage.redis.percentage.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500">{usage.redis.commands.toLocaleString()} commands</p>
                </div>
              )}

              {/* API Performance */}
              {performance && (
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">API Response</span>
                    <span className="text-2xl">
                      {performance.apiMetrics.avgResponseTime < 200 ? '🟢' : performance.apiMetrics.avgResponseTime < 500 ? '🟡' : '🔴'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {performance.apiMetrics.avgResponseTime.toFixed(0)}ms
                  </p>
                  <p className="text-xs text-gray-500">Average</p>
                </div>
              )}

              {/* Email Service */}
              {usage && (
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Resend</span>
                    <span className="text-2xl">{getStatusEmoji(usage.email.percentage)}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {usage.email.percentage.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500">{usage.email.sent} emails sent</p>
                </div>
              )}
            </div>

            {/* Warnings */}
            {usage && usage.warnings.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  ⚠️ Active Warnings ({usage.warnings.length})
                </h3>
                <div className="space-y-3">
                  {usage.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        warning.level === 'critical'
                          ? 'bg-red-50 border-red-500'
                          : 'bg-yellow-50 border-yellow-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`font-medium ${
                            warning.level === 'critical' ? 'text-red-900' : 'text-yellow-900'
                          }`}>
                            {warning.service} - {warning.percentage.toFixed(0)}%
                          </p>
                          <p className="text-sm text-gray-700 mt-1">{warning.message}</p>
                          <p className="text-xs text-gray-600 mt-2">
                            💡 {warning.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Usage Tab - Show detailed service usage */}
        {activeTab === 'usage' && usage && (
          <div className="space-y-6">
            {/* Service Cards - Detailed view */}
            {/* Add detailed usage monitoring components here */}
            <p className="text-gray-600">Detailed usage monitoring (to be implemented)</p>
          </div>
        )}

        {/* Performance Tab - Show performance metrics */}
        {activeTab === 'performance' && performance && (
          <div className="space-y-6">
            {/* Performance metrics - Detailed view */}
            <p className="text-gray-600">Detailed performance metrics (to be implemented)</p>
          </div>
        )}
      </div>
    </div>
  );
}

