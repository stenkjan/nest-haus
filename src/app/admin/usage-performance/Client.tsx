/**
 * Usage & Performance Monitoring - Combined Dashboard
 *
 * Monitors service capacity limits, system performance, AND security:
 * - NeonDB (storage, queries, active time)
 * - Vercel (serverless functions, bandwidth)
 * - Redis/Upstash (commands, memory)
 * - Resend (email sending)
 * - API response times
 * - User experience metrics
 * - Security monitoring (threat detection, bot prevention)
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

interface SecurityEvent {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: number;
  description: string;
  resolved: boolean;
}

interface SecurityAlert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: number;
  type: string;
}

interface SecurityData {
  threatLevel: string;
  metrics: {
    totalEvents: number;
    activeSessions: number;
    averageRiskScore: number;
    botDetectionRate: number;
    averageResponseTime: number;
    eventsBySeverity: Record<string, number>;
  };
  statistics: {
    eventsLast24h: number;
    botDetectionsLast24h: number;
    criticalEventsLast1h: number;
    averageResponseTime: number;
  };
  recentEvents: SecurityEvent[];
  activeAlerts: SecurityAlert[];
}

export default function UsagePerformancePage() {
  const [usage, setUsage] = useState<ServiceStatus | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [security, setSecurity] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'performance' | 'security'>('overview');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [usageRes, perfRes, securityRes] = await Promise.all([
        fetch("/api/admin/usage"),
        fetch("/api/admin/performance"),
        fetch("/api/admin/security")
      ]);

      const usageData = await usageRes.json();
      const perfData = await perfRes.json();
      const securityData = await securityRes.json();

      if (usageData.success) {
        setUsage(usageData.data);
      }
      if (perfData.success) {
        setPerformance(perfData.data);
      }
      if (securityData.success) {
        setSecurity(securityData.data);
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

  const getThreatLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  const getThreatLevelBg = (level: string): string => {
    switch (level.toLowerCase()) {
      case "critical":
        return "bg-red-100 border-red-500";
      case "high":
        return "bg-orange-100 border-orange-500";
      case "medium":
        return "bg-yellow-100 border-yellow-500";
      default:
        return "bg-green-100 border-green-500";
    }
  };

  const getThreatLevelEmoji = (level: string): string => {
    switch (level.toLowerCase()) {
      case "critical":
        return "🔴";
      case "high":
        return "🟠";
      case "medium":
        return "🟡";
      default:
        return "🟢";
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "text-red-700 bg-red-100";
      case "high":
        return "text-orange-700 bg-orange-100";
      case "medium":
        return "text-yellow-700 bg-yellow-100";
      default:
        return "text-green-700 bg-green-100";
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("de-AT", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      bot_detection: "🤖 Bot Detection",
      behavioral_anomaly: "⚠️ Behavioral Anomaly",
      rate_limit_exceeded: "🚫 Rate Limit",
      malicious_request: "⚠️ Malicious Request",
      csrf_violation: "🛡️ CSRF Violation",
      input_validation_failed: "❌ Validation Failed",
    };
    return labels[type] || type;
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
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              🔒 Security
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

            {/* Security Status Banner */}
            {security && (
              <div className={`border-l-4 p-6 rounded-lg ${getThreatLevelBg(security.threatLevel)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">
                      {getThreatLevelEmoji(security.threatLevel)}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Security Threat Level:{" "}
                        <span className={getThreatLevelColor(security.threatLevel)}>
                          {security.threatLevel.toUpperCase()}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-700 mt-1">
                        {security.statistics.eventsLast24h} events (24h) | {security.statistics.botDetectionsLast24h} bot detections | {security.statistics.criticalEventsLast1h} critical events (1h)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('security')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}

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

        {/* Security Tab - Show security monitoring */}
        {activeTab === 'security' && security && (
          <div className="space-y-6">
            {/* Threat Level Banner */}
            <div className={`border-l-4 p-6 rounded-lg ${getThreatLevelBg(security.threatLevel)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">
                    {getThreatLevelEmoji(security.threatLevel)}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Threat Level:{" "}
                      <span className={getThreatLevelColor(security.threatLevel)}>
                        {security.threatLevel.toUpperCase()}
                      </span>
                    </h2>
                    <p className="text-gray-700 mt-1">
                      {security.threatLevel === "low" &&
                        "All systems secure. No immediate threats detected."}
                      {security.threatLevel === "medium" &&
                        "Monitoring unusual activity. Review recent events."}
                      {security.threatLevel === "high" &&
                        "Elevated threat level detected. Action recommended."}
                      {security.threatLevel === "critical" &&
                        "Critical security event! Immediate action required."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Security Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Events */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Events (24h)</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {security.statistics.eventsLast24h}
                    </p>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  All security events tracked
                </p>
              </div>

              {/* Bot Detections */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Bot Detections (24h)
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {security.statistics.botDetectionsLast24h}
                    </p>
                  </div>
                  <div className="text-4xl">🤖</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Automated traffic detected
                </p>
              </div>

              {/* Critical Events */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Critical (1h)</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">
                      {security.statistics.criticalEventsLast1h}
                    </p>
                  </div>
                  <div className="text-4xl">🚨</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  High-priority threats
                </p>
              </div>

              {/* Response Time */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Response</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {security.statistics.averageResponseTime.toFixed(0)}
                      <span className="text-base">ms</span>
                    </p>
                  </div>
                  <div className="text-4xl">⚡</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Security system speed
                </p>
              </div>
            </div>

            {/* Active Alerts */}
            {security.activeAlerts.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  🚨 Active Alerts
                </h2>
                <div className="space-y-3">
                  {security.activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(alert.severity)}`}
                            >
                              {alert.severity.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatTimestamp(alert.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-900 mt-2 font-medium">
                            {alert.message}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Type: {alert.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Security Events */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Security Events
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {security.recentEvents.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-4xl mb-2">✅</p>
                    <p>No security events recorded</p>
                    <p className="text-sm mt-1">System is operating normally</p>
                  </div>
                ) : (
                  security.recentEvents.map((event) => (
                    <div key={event.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(event.severity)}`}
                            >
                              {event.severity.toUpperCase()}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {getEventTypeLabel(event.type)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatTimestamp(event.timestamp)}
                            </span>
                            {event.resolved && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                RESOLVED
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Information Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                🔒 Security Monitoring Information
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>
                  • <strong>Threat Levels</strong>: Low (🟢) | Medium (🟡) |
                  High (🟠) | Critical (🔴)
                </li>
                <li>
                  • <strong>Auto-Refresh</strong>: Dashboard updates every 60
                  seconds
                </li>
                <li>
                  • <strong>Bot Detection</strong>: Automated traffic analysis
                  and blocking
                </li>
                <li>
                  • <strong>Rate Limiting</strong>: 300 requests per 15 minutes
                  per IP
                </li>
                <li>
                  • <strong>Event Retention</strong>: Security events stored for
                  30 days
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

