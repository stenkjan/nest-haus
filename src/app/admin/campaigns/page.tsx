"use client";

import React, { useState, useEffect } from 'react';

interface SourcePerformance {
  category: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
  sources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
}

interface CampaignData {
  timeRange: string;
  totalSessions: number;
  totalConversions: number;
  overallConversionRate: number;
  performanceBySource: SourcePerformance[];
  generatedAt: string;
}

export default function CampaignsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/campaigns/performance?timeRange=${timeRange}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load campaign data');
      }
    } catch (err) {
      setError('Network error loading campaign data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Campaign Performance</h1>
        <div className="text-gray-600">Loading campaign data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Campaign Performance</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Campaign Performance</h1>
        <div className="text-gray-600">No data available</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Social Media Campaign Performance
        </h1>
        <p className="text-gray-600">
          Track ROI from Facebook, Instagram, and other traffic sources
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        {['7d', '30d', '90d'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last {range === '7d' ? '7' : range === '30d' ? '30' : '90'} Days
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Sessions</div>
          <div className="text-3xl font-bold text-gray-900">{data.totalSessions.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-2">All traffic sources</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Conversions</div>
          <div className="text-3xl font-bold text-green-600">{data.totalConversions.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-2">Contact + Konzept-Check</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</div>
          <div className="text-3xl font-bold text-blue-600">{data.overallConversionRate}%</div>
          <div className="text-xs text-gray-500 mt-2">Overall performance</div>
        </div>
      </div>

      {/* Performance by Source */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance by Traffic Source</h2>

        <div className="space-y-6">
          {data.performanceBySource.map(source => (
            <div key={source.category} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              {/* Source Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{source.category}</h3>
                  <div className="text-sm text-gray-600">
                    {source.sessions} sessions · {source.conversions} conversions
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    source.conversionRate >= data.overallConversionRate 
                      ? 'text-green-600' 
                      : 'text-orange-600'
                  }`}>
                    {source.conversionRate}%
                  </div>
                  <div className="text-xs text-gray-500">conversion rate</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(source.sessions / data.totalSessions) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((source.sessions / data.totalSessions) * 100)}% of total traffic
                </div>
              </div>

              {/* Detailed Sources */}
              {source.sources.length > 0 && (
                <div className="space-y-2">
                  {source.sources.map(detail => (
                    <div key={detail.source} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-gray-700 font-medium capitalize">{detail.source}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{detail.count} sessions</span>
                        <span className="text-gray-500">{detail.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* UTM Campaign Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Campaign Details (UTM Tracking)</h2>
        
        <div className="text-sm text-gray-600 mb-4">
          {data.performanceBySource.some(s => s.category === 'Paid Social') ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="font-medium text-green-800 mb-1">✓ UTM Tracking Active</div>
              <div className="text-green-700">
                Your campaigns are properly tagged with UTM parameters. Performance data is available above.
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="font-medium text-yellow-800 mb-1">⚠ UTM Tracking Not Detected</div>
              <div className="text-yellow-700 mb-2">
                Add UTM parameters to your Facebook/Instagram ads for detailed tracking:
              </div>
              <code className="block bg-yellow-100 p-2 rounded text-xs text-yellow-900 font-mono">
                ?utm_source=facebook&utm_medium=paid-social&utm_campaign=launch
              </code>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-4">
          Last updated: {new Date(data.generatedAt).toLocaleString('de-DE')}
        </div>
      </div>
    </div>
  );
}
