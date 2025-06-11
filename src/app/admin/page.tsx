/**
 * Admin Dashboard - Main Overview
 * 
 * Provides high-level metrics and navigation to detailed analytics sections
 */

import Link from 'next/link';
import { Suspense } from 'react';
import { SessionManager } from '@/lib/redis';

// Placeholder components for metrics cards
function MetricCard({ title, value, change, icon }: {
  title: string;
  value: string | number;
  change?: string;
  icon?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} vs last period
            </p>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  );
}

async function DashboardMetrics() {
  // This would fetch real analytics data
  const analytics = await SessionManager.getSessionAnalytics('day');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Active Sessions"
        value={analytics.activeSessions || 0}
        change="+12%"
        icon="👥"
      />
      <MetricCard
        title="Total Sessions Today"
        value={analytics.totalSessions || 0}
        change="+8%"
        icon="📊"
      />
      <MetricCard
        title="Avg Session Duration"
        value={`${Math.round((analytics.averageSessionDuration || 0) / 1000 / 60)}m`}
        change="+5%"
        icon="⏱️"
      />
      <MetricCard
        title="Conversion Rate"
        value="3.2%"
        change="+0.8%"
        icon="💰"
      />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nest-Haus Admin</h1>
              <p className="text-gray-600">Analytics & Configuration Management</p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Metrics */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        }>
          <DashboardMetrics />
        </Suspense>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/user-journey" 
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  User Journey Tracking
                </h3>
                <p className="text-gray-600 mt-2">
                  Analyze user paths through the configurator, identify drop-off points, 
                  and optimize the user experience.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • Session flow analysis<br/>
                  • Click heatmaps<br/>
                  • Abandonment points
                </div>
              </div>
              <div className="text-4xl">🛤️</div>
            </div>
          </Link>

          <Link href="/admin/popular-configurations" 
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Popular Konfigurationen
                </h3>
                <p className="text-gray-600 mt-2">
                  Discover the most popular house configurations, pricing trends, 
                  and customer preferences.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • Top configurations<br/>
                  • Price distribution<br/>
                  • Selection patterns
                </div>
              </div>
              <div className="text-4xl">🏠</div>
            </div>
          </Link>

          <Link href="/admin/performance" 
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Performance Metrics
                </h3>
                <p className="text-gray-600 mt-2">
                  Monitor system performance, API response times, database queries, 
                  and user experience metrics.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • API performance<br/>
                  • Database metrics<br/>
                  • Page load times
                </div>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
          </Link>

          <Link href="/admin/conversion" 
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Conversion Analysis
                </h3>
                <p className="text-gray-600 mt-2">
                  Track conversion rates, funnel performance, and identify 
                  opportunities to increase sales.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • Funnel analysis<br/>
                  • Conversion rates<br/>
                  • Revenue tracking
                </div>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Export Analytics Report
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              Sync Redis to PostgreSQL
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 