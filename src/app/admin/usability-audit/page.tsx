"use client";

import React, { useState, useEffect } from 'react';

interface UsabilityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  issue: string;
  impact: string;
  recommendation: string;
  dataPoint?: string;
}

interface AuditData {
  issues: UsabilityIssue[];
  summary: {
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
  };
  metrics: {
    bounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
    formAbandonmentRate: number;
  };
  generatedAt: string;
}

export default function UsabilityAuditPage() {
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditData();
  }, []);

  async function fetchAuditData() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/usability-audit');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading usability audit:', error);
    } finally {
      setLoading(false);
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Usability Audit</h1>
        <div className="text-gray-600">Analyzing campaign data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Usability Audit</h1>
        <div className="text-gray-600">No audit data available</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Usability Audit & Recommendations
        </h1>
        <p className="text-gray-600">
          Data-driven insights from your social media campaign
        </p>
        <div className="text-sm text-gray-500 mt-2">
          Last updated: {new Date(data.generatedAt).toLocaleString('de-DE')}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-xs font-medium text-gray-600 mb-1">Critical</div>
          <div className="text-2xl font-bold text-red-600">{data.summary.criticalIssues}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-xs font-medium text-gray-600 mb-1">High Priority</div>
          <div className="text-2xl font-bold text-orange-600">{data.summary.highIssues}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-xs font-medium text-gray-600 mb-1">Medium</div>
          <div className="text-2xl font-bold text-yellow-600">{data.summary.mediumIssues}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-xs font-medium text-gray-600 mb-1">Low</div>
          <div className="text-2xl font-bold text-blue-600">{data.summary.lowIssues}</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Performance Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Bounce Rate</div>
            <div className={`text-2xl font-bold ${data.metrics.bounceRate > 60 ? 'text-red-600' : 'text-green-600'}`}>
              {data.metrics.bounceRate}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Avg. Session</div>
            <div className={`text-2xl font-bold ${data.metrics.avgSessionDuration < 120 ? 'text-red-600' : 'text-green-600'}`}>
              {Math.round(data.metrics.avgSessionDuration / 60)}m
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
            <div className={`text-2xl font-bold ${data.metrics.conversionRate < 2 ? 'text-red-600' : 'text-green-600'}`}>
              {data.metrics.conversionRate}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Form Abandonment</div>
            <div className={`text-2xl font-bold ${data.metrics.formAbandonmentRate > 50 ? 'text-red-600' : 'text-green-600'}`}>
              {data.metrics.formAbandonmentRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {data.issues.map((issue, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 ${getSeverityColor(issue.severity)}`}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl shrink-0">{getSeverityIcon(issue.severity)}</div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    {issue.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.severity.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{issue.issue}</h3>
                
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Impact:</div>
                  <div className="text-sm text-gray-600">{issue.impact}</div>
                </div>

                {issue.dataPoint && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Data:</div>
                    <div className="text-sm text-gray-600 font-mono bg-gray-50 rounded px-2 py-1 inline-block">
                      {issue.dataPoint}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-green-700 mb-1">✓ Recommendation:</div>
                  <div className="text-sm text-gray-700">{issue.recommendation}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Plan */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recommended Action Plan</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-600">1.</span>
            <span>Fix all CRITICAL issues immediately (blocks conversions)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-orange-600">2.</span>
            <span>Address HIGH priority issues this week (significant impact)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-yellow-600">3.</span>
            <span>Schedule MEDIUM issues for next sprint (optimization)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-600">4.</span>
            <span>Plan LOW priority improvements for future iterations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
