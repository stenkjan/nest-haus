/**
 * Traffic Sources Widget Component
 * 
 * Horizontal bar chart showing traffic breakdown:
 * - Direct, Google, Social, Referrals, UTM
 * - With trend indicators
 */

'use client';

import { useEffect, useState } from 'react';

interface TrafficMetrics {
  count: number;
  percentage: number;
  change: number;
}

interface TrafficData {
  direct: TrafficMetrics;
  google: TrafficMetrics;
  bing: TrafficMetrics;
  social: {
    facebook: TrafficMetrics;
    instagram: TrafficMetrics;
    linkedin: TrafficMetrics;
    twitter: TrafficMetrics;
  };
  referrals: Array<{ domain: string; count: number; change: number }>;
  utm: TrafficMetrics;
  totalSessions: number;
}

export default function TrafficSourcesWidget() {
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchTrafficData();
  }, []);

  async function fetchTrafficData() {
    try {
      const response = await fetch('/api/admin/analytics/traffic-sources');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch traffic sources:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No traffic data available</p>
      </div>
    );
  }

  // Aggregate social media into one entry
  const socialTotal = Object.values(data.social).reduce((sum, s) => sum + s.count, 0);
  const socialPercentage = data.totalSessions > 0 
    ? Math.round((socialTotal / data.totalSessions) * 100)
    : 0;
  const socialChange = Math.round(
    Object.values(data.social).reduce((sum, s) => sum + s.change, 0) / 
    Object.values(data.social).length
  );

  const sources = [
    { 
      name: 'Direct', 
      ...data.direct, 
      color: 'bg-blue-600',
      icon: '🔗'
    },
    { 
      name: 'Google', 
      ...data.google, 
      color: 'bg-green-600',
      icon: '🔍'
    },
    { 
      name: 'Social Media', 
      count: socialTotal,
      percentage: socialPercentage,
      change: socialChange,
      color: 'bg-purple-600',
      icon: '📱'
    },
    { 
      name: 'Referrals', 
      count: data.referrals.reduce((sum, r) => sum + r.count, 0),
      percentage: data.referrals.reduce((sum, r) => sum + r.count, 0) / data.totalSessions * 100,
      change: 0,
      color: 'bg-orange-600',
      icon: '🔗'
    },
    { 
      name: 'UTM Campaigns', 
      ...data.utm, 
      color: 'bg-indigo-600',
      icon: '🎯'
    }
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Traffic Sources
          </h3>
          <p className="text-sm text-gray-500">
            Where visitors come from
          </p>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {data.totalSessions.toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        {sources.map((source) => (
          <div key={source.name}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span>{source.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {source.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {source.count.toLocaleString()} ({Math.round(source.percentage)}%)
                </span>
                {source.change !== 0 && (
                  <span 
                    className={`text-xs font-medium ${
                      source.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {source.change > 0 ? '↑' : '↓'} {Math.abs(source.change)}%
                  </span>
                )}
              </div>
            </div>
            
            {/* Horizontal bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${source.color} rounded-full transition-all duration-500`}
                style={{ width: `${source.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable referral details */}
      {data.referrals.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <span>Top Referral Domains</span>
            <span className="text-gray-400">{expanded ? '▲' : '▼'}</span>
          </button>
          
          {expanded && (
            <div className="mt-4 space-y-2">
              {data.referrals.slice(0, 5).map((referral) => (
                <div 
                  key={referral.domain}
                  className="flex items-center justify-between text-sm py-2 px-3 bg-gray-50 rounded"
                >
                  <span className="text-gray-700 truncate max-w-[200px]">
                    {referral.domain}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">
                      {referral.count} visits
                    </span>
                    {referral.change !== 0 && (
                      <span 
                        className={`text-xs font-medium ${
                          referral.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {referral.change > 0 ? '↑' : '↓'} {Math.abs(referral.change)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View full report link */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View Full Report →
        </button>
      </div>
    </div>
  );
}

