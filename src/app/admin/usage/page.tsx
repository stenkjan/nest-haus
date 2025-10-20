/**
 * Admin Usage Monitoring Dashboard
 *
 * Real-time monitoring of service capacity limits:
 * - Rate limiting
 * - Database storage
 * - Redis commands
 * - Email service
 * - Blob storage
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
  };
  warnings: Array<{
    service: string;
    level: "warning" | "critical";
    percentage: number;
    message: string;
    recommendation: string;
  }>;
}

export default function UsagePage() {
  const [usage, setUsage] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/usage");
      const data = await response.json();

      if (data.success) {
        setUsage(data.data);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError(data.error || "Failed to load usage data");
      }
    } catch (err) {
      setError("Network error: Could not fetch usage data");
      console.error("Usage fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchUsage, 60000);
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

  const formatResetTime = (resetTime: number): string => {
    const diff = resetTime - Date.now();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (loading && !usage) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading usage data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Admin Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Service Usage Monitor
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time capacity monitoring for all services
              </p>
            </div>
            <button
              onClick={fetchUsage}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Refreshing..." : "Refresh Now"}
            </button>
          </div>
          {lastUpdate && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdate.toLocaleTimeString("de-AT")}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {usage && (
          <>
            {/* Warnings Section */}
            {usage.warnings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  ⚠️ Capacity Warnings
                </h2>
                <div className="space-y-4">
                  {usage.warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className={`border-l-4 p-4 rounded-lg ${
                        warning.level === "critical"
                          ? "bg-red-50 border-red-500"
                          : "bg-yellow-50 border-yellow-500"
                      }`}
                    >
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">
                          {warning.level === "critical" ? "🚨" : "⚠️"}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {warning.service} - {warning.percentage}%
                          </h3>
                          <p className="text-gray-700 mt-1">
                            {warning.message}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Recommendation:</strong>{" "}
                            {warning.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rate Limiting */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Rate Limiting
                  </h3>
                  <span className="text-2xl">
                    {getStatusEmoji(usage.rateLimit.percentage)}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usage</span>
                    <span
                      className={`font-semibold ${getStatusColor(usage.rateLimit.percentage)}`}
                    >
                      {usage.rateLimit.current} / {usage.rateLimit.limit}{" "}
                      requests
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${getProgressBarColor(usage.rateLimit.percentage)}`}
                      style={{
                        width: `${Math.min(usage.rateLimit.percentage, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Resets in: {formatResetTime(usage.rateLimit.resetTime)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    300 requests per 15 minutes per IP address
                  </p>
                </div>
              </div>

              {/* Database Storage */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Database Storage
                  </h3>
                  <span className="text-2xl">
                    {getStatusEmoji(usage.database.percentage)}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Storage</span>
                    <span
                      className={`font-semibold ${getStatusColor(usage.database.percentage)}`}
                    >
                      {usage.database.storage.toFixed(1)} MB / 512 MB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${getProgressBarColor(usage.database.percentage)}`}
                      style={{
                        width: `${Math.min(usage.database.percentage, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1 mt-2">
                    <p>
                      Records: {usage.database.records.total.toLocaleString()}
                    </p>
                    <p>
                      • Sessions:{" "}
                      {usage.database.records.sessions.toLocaleString()}
                    </p>
                    <p>
                      • Events:{" "}
                      {usage.database.records.selectionEvents.toLocaleString()}
                    </p>
                    <p>
                      • Interactions:{" "}
                      {usage.database.records.interactionEvents.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Redis Commands */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Redis Commands
                  </h3>
                  <span className="text-2xl">
                    {getStatusEmoji(usage.redis.percentage)}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Today&apos;s Usage</span>
                    <span
                      className={`font-semibold ${getStatusColor(usage.redis.percentage)}`}
                    >
                      {usage.redis.commands} / {usage.redis.limit.commands}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${getProgressBarColor(usage.redis.percentage)}`}
                      style={{
                        width: `${Math.min(usage.redis.percentage, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    10,000 commands per day (Upstash free tier)
                  </p>
                </div>
              </div>

              {/* Email Service */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Email Service
                  </h3>
                  <span className="text-2xl">
                    {getStatusEmoji(usage.email.percentage)}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">This Month</span>
                    <span
                      className={`font-semibold ${getStatusColor(usage.email.percentage)}`}
                    >
                      {usage.email.sent} / {usage.email.limit.monthly}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${getProgressBarColor(usage.email.percentage)}`}
                      style={{
                        width: `${Math.min(usage.email.percentage, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    3,000 emails per month (Resend free tier)
                  </p>
                </div>
              </div>

              {/* Blob Storage */}
              <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Blob Storage
                  </h3>
                  <span className="text-2xl">
                    {getStatusEmoji(usage.storage.percentage)}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Storage Used</span>
                    <span
                      className={`font-semibold ${getStatusColor(usage.storage.percentage)}`}
                    >
                      {usage.storage.used.toFixed(2)} GB / {usage.storage.limit}{" "}
                      GB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${getProgressBarColor(usage.storage.percentage)}`}
                      style={{
                        width: `${Math.min(usage.storage.percentage, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    100 GB total storage (Vercel Hobby plan)
                  </p>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                📖 Usage Monitoring Information
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>
                  • <strong>🟢 Green (0-70%)</strong>: Service operating
                  normally with healthy capacity
                </li>
                <li>
                  • <strong>🟡 Yellow (70-90%)</strong>: Warning - approaching
                  capacity, monitor closely
                </li>
                <li>
                  • <strong>🔴 Red (90-100%)</strong>: Critical - immediate
                  action required
                </li>
                <li>• Data refreshes automatically every 60 seconds</li>
                <li>
                  • Estimated values based on current database records and
                  activity
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
