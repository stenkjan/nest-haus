/**
 * User Tracking - Admin Panel
 *
 * Displays comprehensive user analytics including funnel metrics,
 * configuration trends, time analytics, and conversion data.
 * ONLY tracks configurations that reached cart (IN_CART, COMPLETED, CONVERTED).
 */

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import AllConfigurations from "./components/AllConfigurations";
import ClickAnalytics from "./components/ClickAnalytics";
import ConfigurationSelectionAnalytics from "./components/ConfigurationSelectionAnalytics";

// Types matching the API response
interface UserTrackingData {
  funnel: {
    totalSessions: number;
    reachedCart: number;
    completedInquiry: number;
    converted: number;
    cartRate: number;
    inquiryRate: number;
    conversionRate: number;
  };
  topConfigurations: Array<{
    id: string;
    nestType: string;
    gebaeudehuelle: string;
    innenverkleidung: string;
    fussboden: string;
    pvanlage: string;
    fenster: string;
    planungspaket: string;
    totalPrice: number;
    cartCount: number;
    inquiryCount: number;
    conversionCount: number;
    lastSelected: string;
  }>;
  priceDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  selectionStats: {
    nestTypes: Array<{ name: string; count: number; percentage: number }>;
    gebaeudehuelle: Array<{ name: string; count: number; percentage: number }>;
    innenverkleidung: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  clickAnalytics: {
    pageClicks: Array<{ path: string; title: string; count: number; percentage: number }>;
    mouseClicks: Array<{ elementId: string; category: string; count: number; percentage: number }>;
  };
  configurationAnalytics: {
    [category: string]: Array<{
      value: string;
      name: string;
      count: number;
      percentageOfCategory: number;
      percentageOfTotal: number;
      quantity?: number;
    }>;
  };
  quantityAnalytics: {
    geschossdecke: {
      totalWithOption: number;
      averageQuantity: number;
      quantityDistribution: Array<{ quantity: number; count: number }>;
    };
    pvanlage: {
      totalWithOption: number;
      averageQuantity: number;
      quantityDistribution: Array<{ quantity: number; count: number }>;
    };
  };
  timeMetrics: {
    avgTimeToCart: number;
    avgTimeToInquiry: number;
    avgSessionDuration: number;
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
 * Fetch user tracking data from API
 */
async function fetchUserTrackingData(): Promise<UserTrackingData | null> {
  try {
    console.log("🔍 Fetching user tracking data...");

    // Build correct URL for both local and production
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    const url = `${baseUrl}/api/admin/user-tracking`;
    console.log("📡 Fetching from:", url);

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`❌ API returned ${response.status}`);
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ User tracking data fetched successfully");
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch user tracking data:", error);
    return null;
  }
}

/**
 * Funnel Visualization Component
 */
function FunnelMetrics({ funnel }: { funnel: UserTrackingData["funnel"] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Conversion Funnel
      </h3>

      <div className="space-y-6">
        {/* Stage 1: Total Sessions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Total Sessions
            </span>
            <span className="text-lg font-bold text-gray-900">
              {funnel.totalSessions}
            </span>
          </div>
          <div className="w-full bg-blue-500 h-10 rounded flex items-center justify-center text-white font-medium">
            100%
          </div>
        </div>

        {/* Stage 2: Reached Cart */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Added to Cart
            </span>
            <span className="text-lg font-bold text-gray-900">
              {funnel.reachedCart}
            </span>
          </div>
          <div
            className="bg-green-500 h-10 rounded flex items-center justify-center text-white font-medium"
            style={{ width: `${funnel.cartRate}%` }}
          >
            {funnel.cartRate.toFixed(1)}%
          </div>
        </div>

        {/* Stage 3: Completed Inquiry */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Completed Inquiry
            </span>
            <span className="text-lg font-bold text-gray-900">
              {funnel.completedInquiry}
            </span>
          </div>
          <div
            className="bg-yellow-500 h-10 rounded flex items-center justify-center text-white font-medium"
            style={{ width: `${funnel.inquiryRate}%` }}
          >
            {funnel.inquiryRate.toFixed(1)}%
          </div>
        </div>

        {/* Stage 4: Converted */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Payment Completed
            </span>
            <span className="text-lg font-bold text-gray-900">
              {funnel.converted}
            </span>
          </div>
          <div
            className="bg-purple-500 h-10 rounded flex items-center justify-center text-white font-medium"
            style={{ width: `${funnel.conversionRate}%` }}
          >
            {funnel.conversionRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {funnel.cartRate.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600">Cart Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {funnel.inquiryRate.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600">Inquiry Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {funnel.conversionRate.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600">Conversion Rate</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Time Metrics Component
 */
function TimeMetrics({
  timeMetrics,
}: {
  timeMetrics: UserTrackingData["timeMetrics"];
}) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Time Analytics
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg. Time to Cart</span>
          <span className="text-lg font-bold text-blue-600">
            {formatTime(timeMetrics.avgTimeToCart)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg. Time to Inquiry</span>
          <span className="text-lg font-bold text-green-600">
            {formatTime(timeMetrics.avgTimeToInquiry)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg. Session Duration</span>
          <span className="text-lg font-bold text-purple-600">
            {formatTime(timeMetrics.avgSessionDuration)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Price Distribution Component
 */
function PriceDistribution({
  data,
}: {
  data: UserTrackingData["priceDistribution"];
}) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Price Distribution
      </h3>
      <div className="space-y-3">
        {data.map((range, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                {range.range}
              </span>
              <span className="text-sm text-gray-600">{range.count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${(range.count / maxCount) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Selection Stats Component
 */
function SelectionStats({
  data,
}: {
  data: UserTrackingData["selectionStats"];
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Popular Selections
      </h3>
      <div className="space-y-4">
        {Object.entries(data).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">
              {category.replace(/([A-Z])/g, " $1").trim()}
            </h4>
            <div className="space-y-2">
              {items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-xs text-gray-600">
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Main Dashboard Component
 */
async function UserTrackingDashboard() {
  const data = await fetchUserTrackingData();

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-medium">Failed to load tracking data</p>
        <p className="text-red-600 text-sm mt-1">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Summary Banner */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-green-800">
              ✅ Clean Data: Cart-Only Tracking
            </h3>
            <p className="text-xs text-green-600">
              Only showing {data.metadata.totalConfigurations} configurations
              that reached cart (IN_CART, COMPLETED, CONVERTED)
            </p>
          </div>
          <div className="text-xs text-green-600">
            Updated: {new Date(data.metadata.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">📊</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Sessions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data.funnel.totalSessions}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">🛒</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reached Cart</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.funnel.reachedCart}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">📧</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inquiries</p>
              <p className="text-2xl font-bold text-green-600">
                {data.funnel.completedInquiry}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">💰</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversions</p>
              <p className="text-2xl font-bold text-purple-600">
                {data.funnel.converted}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Funnel & Time Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <FunnelMetrics funnel={data.funnel} />
        <TimeMetrics timeMetrics={data.timeMetrics} />
      </div>

      {/* Click Analytics Section */}
      {data.clickAnalytics && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Click Analytics
          </h2>
          <ClickAnalytics
            pageClicks={data.clickAnalytics?.pageClicks || []}
            mouseClicks={data.clickAnalytics?.mouseClicks || []}
          />
        </div>
      )}

      {/* Configuration Selection Analytics */}
      {data.configurationAnalytics && data.quantityAnalytics && (
        <div className="mb-8">
          <ConfigurationSelectionAnalytics
            analytics={data.configurationAnalytics || {}}
            quantityAnalytics={data.quantityAnalytics || {
              geschossdecke: { totalWithOption: 0, averageQuantity: 0, quantityDistribution: [] },
              pvanlage: { totalWithOption: 0, averageQuantity: 0, quantityDistribution: [] }
            }}
            totalConfigurations={data.metadata.totalConfigurations || 0}
          />
        </div>
      )}

      {/* Price & Selection Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PriceDistribution data={data.priceDistribution} />
        <SelectionStats data={data.selectionStats} />
      </div>

      {/* All Configurations Section */}
      <AllConfigurations />
    </>
  );
}

/**
 * Loading Fallback
 */
function LoadingFallback() {
  return (
    <div className="space-y-8">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Main Page Component
 */
export default async function UserTrackingPage() {
  // Server-side authentication check
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-admin-auth");

    if (!authCookie || authCookie.value !== adminPassword) {
      redirect(
        "/admin/auth?redirect=" + encodeURIComponent("/admin/user-tracking")
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
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
                  User Tracking
                </h1>
              </div>
              <p className="text-gray-600 ml-12">
                Comprehensive analytics: funnel, time metrics, and configuration
                trends
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">🔴 Live Data</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingFallback />}>
          <UserTrackingDashboard />
        </Suspense>
      </div>
    </div>
  );
}
