/**
 * Admin Security Monitoring Dashboard
 *
 * Real-time security monitoring and threat detection:
 * - Threat level indicators
 * - Security event tracking
 * - Bot detection statistics
 * - Active alerts and responses
 *
 * Visual indicators: 🟢 Low | 🟡 Medium | 🟠 High | 🔴 Critical
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function SecurityMonitoringPage() {
  const [security, setSecurity] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchSecurity = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/security");
      const data = await response.json();

      if (data.success) {
        setSecurity(data.data);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError(data.error || "Failed to load security data");
      }
    } catch (err) {
      setError("Network error: Could not fetch security data");
      console.error("Security fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurity();
    // Auto-refresh every 30 seconds for security monitoring
    const interval = setInterval(fetchSecurity, 30000);
    return () => clearInterval(interval);
  }, []);

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

  if (loading && !security) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading security data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 mb-4 mt-6 inline-block"
          >
            ← Back to Admin Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🔒 Security Monitoring
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time threat detection and security event tracking
              </p>
            </div>
            <button
              onClick={fetchSecurity}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Refreshing..." : "Refresh Now"}
            </button>
          </div>
          {lastUpdate && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdate.toLocaleTimeString("de-AT")}{" "}
              (auto-refresh every 30s)
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {security && (
          <>
            {/* Threat Level Banner */}
            <div
              className={`border-l-4 p-6 rounded-lg mb-8 ${getThreatLevelBg(security.threatLevel)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">
                    {getThreatLevelEmoji(security.threatLevel)}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Threat Level:{" "}
                      <span
                        className={getThreatLevelColor(security.threatLevel)}
                      >
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

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <div className="mb-8">
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
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                🔒 Security Monitoring Information
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>
                  • <strong>Threat Levels</strong>: Low (🟢) | Medium (🟡) |
                  High (🟠) | Critical (🔴)
                </li>
                <li>
                  • <strong>Auto-Refresh</strong>: Dashboard updates every 30
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
          </>
        )}
      </div>
    </div>
  );
}
