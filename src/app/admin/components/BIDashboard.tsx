"use client";

import { useState, useEffect } from "react";

interface BIMetrics {
  sessionsPerDay: Array<{ date: string; count: number }>;
  topLocations: Array<{ country: string; count: number }>;
  topPages: Array<{ page: string; count: number }>;
  mostSelectedConfig: { key: string; value: string; count: number };
}

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  Germany: "🇩🇪",
  Austria: "🇦🇹",
  Switzerland: "🇨🇭",
  DE: "🇩🇪",
  AT: "🇦🇹",
  CH: "🇨🇭",
  US: "🇺🇸",
  GB: "🇬🇧",
  FR: "🇫🇷",
  IT: "🇮🇹",
  ES: "🇪🇸",
};

const getFlag = (country: string): string => {
  return countryFlags[country] || "🌍";
};

// Simple mini sparkline component
function MiniSparkline({ data }: { data: number[] }) {
  if (data.length === 0) return <div className="h-8 bg-gray-100 rounded"></div>;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((value, index) => {
        const height = ((value - min) / range) * 100;
        return (
          <div
            key={index}
            className="flex-1 bg-blue-500 rounded-t transition-all"
            style={{ height: `${height}%`, minHeight: "2px" }}
            title={`Day ${index + 1}: ${value} sessions`}
          />
        );
      })}
    </div>
  );
}

export default function BIDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBIMetrics() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/bi-metrics");
        const data = await response.json();

        if (data.success) {
          setMetrics(data.data);
        } else {
          setError(data.error || "Failed to load BI metrics");
        }
      } catch (err) {
        setError("Network error: Could not fetch BI metrics");
        console.error("BI metrics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBIMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-800 font-medium">{error}</p>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Quick Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sessions per Day */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Sessions (Last 7 Days)
          </h3>
          <MiniSparkline data={metrics.sessionsPerDay.map((d) => d.count)} />
          <p className="text-xs text-gray-500 mt-2">
            Total: {metrics.sessionsPerDay.reduce((sum, d) => sum + d.count, 0)}
          </p>
        </div>

        {/* Top Locations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Top Locations
          </h3>
          {metrics.topLocations.length > 0 ? (
            <div className="space-y-2">
              {metrics.topLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getFlag(location.country)}</span>
                    <span className="text-sm text-gray-700">
                      {location.country}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {location.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No location data yet</p>
          )}
        </div>

        {/* Most Visited Pages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Most Visited Pages
          </h3>
          {metrics.topPages.length > 0 ? (
            <div className="space-y-2">
              {metrics.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate flex-1">
                    {page.page}
                  </span>
                  <span className="text-sm font-bold text-gray-900 ml-2">
                    {page.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No page data yet</p>
          )}
        </div>

        {/* Most Selected Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Top Configuration
          </h3>
          {metrics.mostSelectedConfig.count > 0 ? (
            <div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                {metrics.mostSelectedConfig.key}
              </p>
              <p className="text-xs text-gray-700 mb-2">
                {metrics.mostSelectedConfig.value}
              </p>
              <p className="text-xs text-gray-500">
                Selected {metrics.mostSelectedConfig.count} times
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No config data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

