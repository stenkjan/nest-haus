/**
 * Conversion Analysis - Admin Panel
 *
 * Track conversion rates, funnel performance, and identify
 * opportunities to increase sales and revenue.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ConversionsData {
  funnelSteps: Array<{
    step: string;
    stepNumber: number;
    users: number;
    conversionRate: number;
    dropOff: number;
  }>;
  revenue: {
    total: number;
    byPriceRange: Array<{
      range: string;
      amount: number;
      count: number;
      percentage: number;
    }>;
    byConfiguration: Array<{
      configuration: string;
      revenue: number;
      count: number;
    }>;
  };
  trafficSources: Array<{
    source: string;
    visitors: number;
    conversions: number;
    rate: number;
    revenue: number;
  }>;
  trends: {
    weekly: Array<{
      week: string;
      visitors: number;
      conversions: number;
      revenue: number;
      conversionRate: number;
    }>;
    monthly: Array<{
      month: string;
      visitors: number;
      conversions: number;
      revenue: number;
      conversionRate: number;
    }>;
  };
  metadata: {
    totalVisitors: number;
    totalConversions: number;
    overallConversionRate: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
}

function formatCurrency(amount: number): string {
  return `€${(amount / 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function ConversionFunnel({ data }: { data: ConversionsData | null }) {
  if (!data || data.funnelSteps.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conversion Funnel
        </h3>
        <p className="text-gray-500">No funnel data available</p>
      </div>
    );
  }

  const maxUsers = Math.max(...data.funnelSteps.map((s) => s.users));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Conversion Funnel
      </h3>
      <div className="space-y-4">
        {data.funnelSteps.map((step, index) => {
          const widthPercentage = (step.users / maxUsers) * 100;
          const isFirst = index === 0;

          return (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {step.step}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {step.users.toLocaleString()} users
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {step.conversionRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div
                    className={`h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      isFirst
                        ? "bg-blue-600"
                        : step.conversionRate > 20
                          ? "bg-green-500"
                          : step.conversionRate > 10
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                    style={{ width: `${widthPercentage}%` }}
                  >
                    {widthPercentage > 15 ? `${step.users.toLocaleString()}` : ""}
                  </div>
                </div>

                {!isFirst && step.dropOff > 0 && (
                  <div className="absolute right-0 -top-6 text-xs text-red-600 font-medium">
                    -{step.dropOff} users dropped
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {data.metadata.totalVisitors.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Visitors</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data.metadata.totalConversions}
            </div>
            <div className="text-sm text-gray-600">Conversions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {data.metadata.overallConversionRate.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Overall Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueAnalysis({ data }: { data: ConversionsData | null }) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Analysis
        </h3>
        <p className="text-gray-500">Loading revenue data...</p>
      </div>
    );
  }

  const totalRevenue = data.revenue.total;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Revenue Analysis
      </h3>

      <div className="mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg Order: {formatCurrency(data.metadata.averageOrderValue)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">
          Revenue by Price Range
        </h4>
        {data.revenue.byPriceRange.map((range, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{range.range}</span>
              <span className="text-gray-900">
                {formatCurrency(range.amount)} ({range.count} sales)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${range.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrafficSources({ data }: { data: ConversionsData | null }) {
  if (!data || data.trafficSources.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conversion by Traffic Source
        </h3>
        <p className="text-gray-500">No traffic source data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Conversion by Traffic Source
      </h3>
      <div className="space-y-4">
        {data.trafficSources.slice(0, 5).map((source, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {source.source}
              </div>
              <div className="text-xs text-gray-600">
                {source.visitors.toLocaleString()} visitors •{" "}
                {source.conversions} conversions
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-lg font-semibold ${
                  source.rate > 2
                    ? "text-green-600"
                    : source.rate > 1
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {source.rate.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-600">conversion rate</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConversionTrends({ data }: { data: ConversionsData | null }) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conversion Trends
        </h3>
        <p className="text-gray-500">Loading trends data...</p>
      </div>
    );
  }

  // Use monthly trends if available, fallback to weekly
  const trends = data.trends.monthly.length > 0 
    ? data.trends.monthly 
    : data.trends.weekly;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Conversion Trends {data.trends.monthly.length > 0 ? "(Monthly)" : "(Weekly)"}
      </h3>
      <div className="space-y-4">
        {trends.map((period, index) => {
          const label = 'month' in period ? period.month : period.week;
          return (
            <div key={index} className="flex items-center">
              <div className="w-16 text-sm text-gray-600">{label}</div>
              <div className="flex-1 mx-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{period.visitors.toLocaleString()} visitors</span>
                  <span>{period.conversions} conversions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      period.conversionRate > 2
                        ? "bg-green-500"
                        : period.conversionRate > 1
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(period.conversionRate * 20, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-20 text-sm text-gray-900 text-right">
                {period.conversionRate.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ConversionPage() {
  const [data, setData] = useState<ConversionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/conversions");

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
      console.error("Error fetching conversions data:", err);
    } finally {
      setLoading(false);
    }
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
                <span className="text-gray-900">Conversion Analysis</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">
                Conversion Analysis
              </h1>
              <p className="text-gray-600">
                Track conversion rates and revenue performance
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
              <p className="mt-4 text-gray-600">Loading conversion data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl">👥</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Visitors
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data?.metadata.totalVisitors.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl">🎯</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Conversion Rate
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {data?.metadata.overallConversionRate.toFixed(2) || 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl">💰</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {data
                        ? formatCurrency(data.metadata.totalRevenue)
                        : "€0.00"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl">📈</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Avg Order Value
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {data
                        ? formatCurrency(data.metadata.averageOrderValue)
                        : "€0.00"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ConversionFunnel data={data} />
              <RevenueAnalysis data={data} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <TrafficSources data={data} />
              <ConversionTrends data={data} />
            </div>

            {/* Top Performing Configurations */}
            {data && data.revenue.byConfiguration.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Performing Configurations
                </h3>
                <div className="space-y-3">
                  {data.revenue.byConfiguration.slice(0, 5).map((config, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {config.configuration}
                        </div>
                        <div className="text-xs text-gray-600">
                          {config.count} conversions
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(config.revenue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversion Recommendations */}
            {data && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  💡 Conversion Optimization Recommendations
                </h3>
                <div className="space-y-4">
                  {data.metadata.overallConversionRate < 1 && (
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-medium text-red-900">
                        Low Conversion Rate
                      </h4>
                      <p className="text-sm text-red-700">
                        Overall conversion rate is {data.metadata.overallConversionRate.toFixed(2)}%.
                        Consider improving the user journey and removing friction points.
                      </p>
                    </div>
                  )}

                  {data.trafficSources.length > 0 && (
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-blue-900">
                        Focus on High-Converting Traffic
                      </h4>
                      <p className="text-sm text-blue-700">
                        Your best traffic source is "{data.trafficSources[0].source}" 
                        with {data.trafficSources[0].rate.toFixed(2)}% conversion rate.
                        Consider increasing investment in this channel.
                      </p>
                    </div>
                  )}

                  {data.metadata.totalConversions > 0 && (
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-green-900">
                        Revenue Performance
                      </h4>
                      <p className="text-sm text-green-700">
                        You've generated {formatCurrency(data.metadata.totalRevenue)} from{" "}
                        {data.metadata.totalConversions} conversions. Average order value
                        is {formatCurrency(data.metadata.averageOrderValue)}.
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