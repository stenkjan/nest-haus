/**
 * Popular Konfigurationen - Admin Panel
 *
 * Displays the most popular house configurations, pricing trends,
 * and customer preferences to inform business decisions.
 *
 * UPDATED: Now using real database data via API integration
 */

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";

// Types for the component props - updated to match API response
interface ConfigurationData {
  id: string;
  nestType: string;
  gebaeudehuelle: string;
  innenverkleidung: string;
  fussboden: string;
  pvanlage: string;
  fenster: string;
  planungspaket: string;
  totalPrice: number;
  selectionCount: number;
  conversionRate: number;
  lastSelected: string;
  averagePrice: number;
}

interface SelectionStatItem {
  name: string;
  count: number;
  percentage: number;
}

interface PopularConfigurationData {
  topConfigurations: ConfigurationData[];
  priceDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  selectionStats: {
    nestTypes: SelectionStatItem[];
    gebaeudehuelle: SelectionStatItem[];
    innenverkleidung: SelectionStatItem[];
    fussboden: SelectionStatItem[];
    pvanlage: SelectionStatItem[];
  };
  trends: {
    weekly: Array<{
      week: string;
      nest80: number;
      nest100: number;
      nest120: number;
    }>;
  };
  metadata: {
    totalConfigurations: number;
    dataRange: {
      from: string;
      to: string;
    };
    lastUpdated: string;
  };
}

/**
 * Fetch real configuration data from API
 */
async function fetchConfigurationData(): Promise<PopularConfigurationData> {
  try {
    console.log("🔍 Fetching real configuration data...");

    const response = await fetch(
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/admin/popular-configurations`,
      {
        cache: "no-store", // Always get fresh data
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}: ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(`API error: ${result.error}`);
    }

    console.log("✅ Configuration data fetched successfully");
    return result.data;
  } catch (error) {
    console.error("❌ Failed to fetch configuration data:", error);

    // Fallback to empty data structure if API fails
    return {
      topConfigurations: [],
      priceDistribution: [],
      selectionStats: {
        nestTypes: [],
        gebaeudehuelle: [],
        innenverkleidung: [],
        fussboden: [],
        pvanlage: [],
      },
      trends: {
        weekly: [],
      },
      metadata: {
        totalConfigurations: 0,
        dataRange: {
          from: new Date().toISOString(),
          to: new Date().toISOString(),
        },
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}

function ConfigurationCard({ config }: { config: ConfigurationData }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {config.nestType}
          </h3>
          <p className="text-sm text-gray-600">
            {config.selectionCount} selections •{" "}
            {Math.round(config.conversionRate * 100)}% conversion
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            €{config.totalPrice.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Total Price</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Gebäudehülle:</span>
          <span className="font-medium">{config.gebaeudehuelle}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Innenverkleidung:</span>
          <span className="font-medium">{config.innenverkleidung}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fußboden:</span>
          <span className="font-medium">{config.fussboden}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">PV-Anlage:</span>
          <span className="font-medium">{config.pvanlage}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Planungspaket:</span>
          <span className="font-medium">{config.planungspaket}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Last selected: {new Date(config.lastSelected).toLocaleDateString()}
          </span>
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${config.conversionRate * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 ml-2">
              {Math.round(config.conversionRate * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceDistribution({
  data,
}: {
  data: Array<{ range: string; count: number; percentage: number }>;
}) {
  const maxCount = data.length > 0 ? Math.max(...data.map((d) => d.count)) : 1;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Price Distribution
      </h3>
      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((range, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {range.range}
                </span>
                <span className="text-sm text-gray-600">
                  {range.count} configurations
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full flex items-center justify-center"
                  style={{ width: `${(range.count / maxCount) * 100}%` }}
                >
                  <span className="text-xs text-white font-medium">
                    {(range.count / maxCount) * 100 > 30
                      ? `${range.percentage}%`
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No price data available yet</p>
      )}
    </div>
  );
}

function SelectionStats({
  data,
}: {
  data: PopularConfigurationData["selectionStats"];
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Component Popularity
      </h3>
      <div className="space-y-6">
        {Object.entries(data).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">
              {category.replace(/([A-Z])/g, " $1").trim()}
            </h4>
            {items.length > 0 ? (
              <div className="space-y-2">
                {items.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-8">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No data available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart({
  data,
}: {
  data: Array<{
    week: string;
    nest80: number;
    nest100: number;
    nest120: number;
  }>;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Weekly Trends
      </h3>
      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((week, index) => (
            <div key={index} className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                {week.week}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Nest80: {week.nest80}%</span>
                    <span>Nest100: {week.nest100}%</span>
                    <span>Nest120: {week.nest120}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 flex">
                    <div
                      className="bg-blue-500 h-3 rounded-l-full"
                      style={{ width: `${week.nest80}%` }}
                    ></div>
                    <div
                      className="bg-green-500 h-3"
                      style={{ width: `${week.nest100}%` }}
                    ></div>
                    <div
                      className="bg-purple-500 h-3 rounded-r-full"
                      style={{ width: `${week.nest120}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                <span>Nest80</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                <span>Nest100</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded mr-1"></div>
                <span>Nest120</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No trend data available yet</p>
      )}
    </div>
  );
}

/**
 * Real Data Dashboard Component
 */
async function ConfigurationDataDashboard() {
  const configData = await fetchConfigurationData();

  // Calculate quick stats from real data
  const topConfiguration = configData.topConfigurations[0];
  const avgPrice =
    configData.topConfigurations.length > 0
      ? Math.round(
          configData.topConfigurations.reduce(
            (sum, config) => sum + config.totalPrice,
            0
          ) / configData.topConfigurations.length
        )
      : 0;
  const bestConversion =
    configData.topConfigurations.length > 0
      ? Math.max(...configData.topConfigurations.map((c) => c.conversionRate))
      : 0;

  return (
    <>
      {/* Real Data Summary */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              🔴 Live Data Summary
            </h3>
            <p className="text-xs text-blue-600">
              {configData.metadata.totalConfigurations} total configurations
              analyzed from real customer data
            </p>
          </div>
          <div className="text-xs text-blue-600">
            Updated:{" "}
            {new Date(configData.metadata.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Quick Stats - Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">🏆</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Most Popular</p>
              <p className="text-2xl font-bold text-gray-900">
                {topConfiguration?.nestType || "No Data"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">💰</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900">
                {avgPrice > 0 ? `€${Math.round(avgPrice / 1000)}k` : "No Data"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">🎯</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Best Conversion
              </p>
              <p className="text-2xl font-bold text-green-600">
                {bestConversion > 0
                  ? `${Math.round(bestConversion * 100)}%`
                  : "No Data"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">📈</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Configurations
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {configData.metadata.totalConfigurations.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Configurations Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Top Configured Houses
        </h2>
        {configData.topConfigurations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {configData.topConfigurations.slice(0, 6).map((config) => (
              <ConfigurationCard key={config.id} config={config} />
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">
              No configuration data available yet
            </p>
            <p className="text-yellow-600 text-sm mt-1">
              Data will appear here as customers use the configurator
            </p>
          </div>
        )}
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <PriceDistribution data={configData.priceDistribution} />
        <SelectionStats data={configData.selectionStats} />
        <TrendChart data={configData.trends.weekly} />
      </div>

      {/* Additional Configurations */}
      {configData.topConfigurations.length > 6 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Popular Configurations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {configData.topConfigurations.slice(6).map((config) => (
              <ConfigurationCard key={config.id} config={config} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Loading Fallback Component
 */
function ConfigurationDataFallback() {
  return (
    <>
      {/* Loading State */}
      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Top Configurations Grid - Loading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Top Configured Houses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard - Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function PopularConfigurationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
              >
                ← Back to Admin
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Popular Konfigurationen
              </h1>
              <p className="text-gray-600">
                Real-time analysis of customer preferences and configuration
                trends
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">🔴 Live Data</div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<ConfigurationDataFallback />}>
          <ConfigurationDataDashboard />
        </Suspense>
      </div>
    </div>
  );
}
