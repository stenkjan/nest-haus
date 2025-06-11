/**
 * Performance Metrics - Admin Panel
 * 
 * Monitor system performance, API response times, database queries,
 * and user experience metrics.
 */

import Link from 'next/link';

// Mock performance data - replace with real monitoring
const mockPerformanceData = {
  apiMetrics: {
    averageResponseTime: 145,
    slowestEndpoint: '/api/configurator/calculate',
    fastestEndpoint: '/api/health',
    errorRate: 0.2,
    requestsPerMinute: 23,
  },
  databaseMetrics: {
    avgQueryTime: 45,
    slowestQuery: 'UserSession aggregation',
    connectionPool: 85,
    cacheHitRate: 94.2,
  },
  userExperience: {
    pageLoadTime: 2.1,
    timeToInteractive: 3.2,
    cumulativeLayoutShift: 0.08,
    firstContentfulPaint: 1.4,
  },
  systemHealth: {
    memoryUsage: 68,
    cpuUsage: 42,
    diskUsage: 23,
    uptime: 99.8,
  },
  recentErrors: [
    {
      timestamp: '2024-01-15 14:23:45',
      error: 'Redis connection timeout',
      endpoint: '/api/session/track',
      status: 500,
      count: 3,
    },
    {
      timestamp: '2024-01-15 12:15:22',
      error: 'Database query timeout',
      endpoint: '/api/analytics/popular',
      status: 504,
      count: 1,
    },
    {
      timestamp: '2024-01-15 09:45:12',
      error: 'Rate limit exceeded',
      endpoint: '/api/configurator/calculate',
      status: 429,
      count: 12,
    },
  ],
  trends: {
    responseTime: [
      { hour: '00:00', time: 120 },
      { hour: '04:00', time: 95 },
      { hour: '08:00', time: 180 },
      { hour: '12:00', time: 165 },
      { hour: '16:00', time: 145 },
      { hour: '20:00', time: 134 },
    ],
    traffic: [
      { hour: '00:00', requests: 45 },
      { hour: '04:00', requests: 23 },
      { hour: '08:00', requests: 89 },
      { hour: '12:00', requests: 156 },
      { hour: '16:00', requests: 234 },
      { hour: '20:00', requests: 178 },
    ],
  },
};

function MetricCard({ title, value, unit, status, change }: {
  title: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
  change?: string;
}) {
  const statusColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  const bgColors = {
    good: 'bg-green-50',
    warning: 'bg-yellow-50',
    error: 'bg-red-50',
  };

  return (
    <div className={`${bgColors[status]} rounded-lg shadow p-6 border-l-4 border-${status === 'good' ? 'green' : status === 'warning' ? 'yellow' : 'red'}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${statusColors[status]}`}>
            {value}{unit}
          </p>
          {change && (
            <p className="text-xs text-gray-500 mt-1">{change}</p>
          )}
        </div>
        <div className={`w-3 h-3 rounded-full ${
          status === 'good' ? 'bg-green-500' : 
          status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
      </div>
    </div>
  );
}

function PerformanceChart() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trends (24h)</h3>
      <div className="space-y-4">
        {mockPerformanceData.trends.responseTime.map((point, index) => (
          <div key={index} className="flex items-center">
            <div className="w-12 text-xs text-gray-600">{point.hour}</div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    point.time > 150 ? 'bg-red-500' : 
                    point.time > 100 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((point.time / 200) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="w-16 text-xs text-gray-900 text-right">{point.time}ms</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>🟢 Good (&lt;100ms)</span>
          <span>🟡 Warning (100-150ms)</span>
          <span>🔴 Poor (&gt;150ms)</span>
        </div>
      </div>
    </div>
  );
}

function ErrorsTable() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Errors</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Error</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Endpoint</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Count</th>
            </tr>
          </thead>
          <tbody>
            {mockPerformanceData.recentErrors.map((error, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(error.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">{error.error}</td>
                <td className="py-3 px-4 text-sm font-mono text-gray-600">
                  {error.endpoint}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    error.status >= 500 ? 'bg-red-100 text-red-800' :
                    error.status >= 400 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {error.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">{error.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemHealth() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Memory Usage</span>
            <span className="text-gray-900">{mockPerformanceData.systemHealth.memoryUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                mockPerformanceData.systemHealth.memoryUsage > 80 ? 'bg-red-500' :
                mockPerformanceData.systemHealth.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${mockPerformanceData.systemHealth.memoryUsage}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">CPU Usage</span>
            <span className="text-gray-900">{mockPerformanceData.systemHealth.cpuUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                mockPerformanceData.systemHealth.cpuUsage > 80 ? 'bg-red-500' :
                mockPerformanceData.systemHealth.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${mockPerformanceData.systemHealth.cpuUsage}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Disk Usage</span>
            <span className="text-gray-900">{mockPerformanceData.systemHealth.diskUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${mockPerformanceData.systemHealth.diskUsage}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Uptime</span>
            <span className="text-sm font-semibold text-green-600">
              {mockPerformanceData.systemHealth.uptime}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex text-sm text-gray-500 mb-2">
                <Link href="/admin" className="hover:text-gray-700">Admin</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Performance Metrics</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">Performance Metrics</h1>
              <p className="text-gray-600">Monitor system performance and user experience</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Export Report
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Performance Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Avg Response Time"
              value={mockPerformanceData.apiMetrics.averageResponseTime}
              unit="ms"
              status={mockPerformanceData.apiMetrics.averageResponseTime > 150 ? 'warning' : 'good'}
              change="-12ms from yesterday"
            />
            <MetricCard
              title="Error Rate"
              value={mockPerformanceData.apiMetrics.errorRate}
              unit="%"
              status={mockPerformanceData.apiMetrics.errorRate > 1 ? 'error' : 'good'}
              change="+0.1% from yesterday"
            />
            <MetricCard
              title="Requests/min"
              value={mockPerformanceData.apiMetrics.requestsPerMinute}
              unit=""
              status="good"
              change="+5 from yesterday"
            />
            <MetricCard
              title="Cache Hit Rate"
              value={mockPerformanceData.databaseMetrics.cacheHitRate}
              unit="%"
              status={mockPerformanceData.databaseMetrics.cacheHitRate > 90 ? 'good' : 'warning'}
              change="+2.1% from yesterday"
            />
          </div>
        </div>

        {/* Database Performance */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Avg Query Time"
              value={mockPerformanceData.databaseMetrics.avgQueryTime}
              unit="ms"
              status={mockPerformanceData.databaseMetrics.avgQueryTime > 50 ? 'warning' : 'good'}
              change="-5ms from yesterday"
            />
            <MetricCard
              title="Connection Pool"
              value={mockPerformanceData.databaseMetrics.connectionPool}
              unit="%"
              status={mockPerformanceData.databaseMetrics.connectionPool > 90 ? 'warning' : 'good'}
              change="Normal usage"
            />
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Slowest Query</p>
                  <p className="text-lg font-bold text-gray-900">
                    {mockPerformanceData.databaseMetrics.slowestQuery}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Needs optimization</p>
                </div>
                <div className="text-2xl">🐌</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Experience Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Experience (Core Web Vitals)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Page Load Time"
              value={mockPerformanceData.userExperience.pageLoadTime}
              unit="s"
              status={mockPerformanceData.userExperience.pageLoadTime > 3 ? 'warning' : 'good'}
              change="-0.3s from yesterday"
            />
            <MetricCard
              title="Time to Interactive"
              value={mockPerformanceData.userExperience.timeToInteractive}
              unit="s"
              status={mockPerformanceData.userExperience.timeToInteractive > 4 ? 'warning' : 'good'}
              change="+0.1s from yesterday"
            />
            <MetricCard
              title="First Contentful Paint"
              value={mockPerformanceData.userExperience.firstContentfulPaint}
              unit="s"
              status={mockPerformanceData.userExperience.firstContentfulPaint > 2 ? 'warning' : 'good'}
              change="-0.2s from yesterday"
            />
            <MetricCard
              title="Layout Shift"
              value={mockPerformanceData.userExperience.cumulativeLayoutShift}
              unit=""
              status={mockPerformanceData.userExperience.cumulativeLayoutShift > 0.1 ? 'warning' : 'good'}
              change="No change"
            />
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PerformanceChart />
          <SystemHealth />
        </div>

        <ErrorsTable />

        {/* Performance Recommendations */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Performance Recommendations</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium text-yellow-900">Optimize Database Queries</h4>
              <p className="text-sm text-yellow-700">
                UserSession aggregation query is taking {mockPerformanceData.databaseMetrics.avgQueryTime}ms. 
                Consider adding indexes or using cached aggregates.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-blue-900">Implement Redis Caching</h4>
              <p className="text-sm text-blue-700">
                Cache frequently accessed configuration data to reduce database load.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-green-900">Good Core Web Vitals</h4>
              <p className="text-sm text-green-700">
                Your page performance metrics are within acceptable ranges for user experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 