/**
 * Conversion Analysis - Admin Panel
 * 
 * Track conversion rates, funnel performance, and identify
 * opportunities to increase sales and revenue.
 */

import Link from 'next/link';

// Mock conversion data - replace with real analytics
const mockConversionData = {
  overallMetrics: {
    totalVisitors: 12456,
    configuratorStarts: 8934,
    completedConfigurations: 1247,
    inquiries: 89,
    conversions: 23,
    revenue: 4850000, // €4.85M
  },
  funnelSteps: [
    { step: 'Landing Page Visit', users: 12456, conversionRate: 100, dropOff: 0 },
    { step: 'Configurator Start', users: 8934, conversionRate: 71.7, dropOff: 28.3 },
    { step: 'Configuration Complete', users: 1247, conversionRate: 14.0, dropOff: 86.0 },
    { step: 'Contact Form', users: 89, conversionRate: 7.1, dropOff: 92.9 },
    { step: 'Purchase Intent', users: 23, conversionRate: 25.8, dropOff: 74.2 },
  ],
  conversionTrends: [
    { month: 'Oct', visitors: 9842, conversions: 18, rate: 0.18 },
    { month: 'Nov', visitors: 11234, conversions: 21, rate: 0.19 },
    { month: 'Dec', visitors: 12456, conversions: 23, rate: 0.18 },
    { month: 'Jan', visitors: 13567, conversions: 28, rate: 0.21 },
  ],
  revenueAnalysis: {
    averageDealValue: 210870,
    conversionsByPriceRange: [
      { range: '150k-200k', conversions: 12, revenue: 2160000 },
      { range: '200k-250k', conversions: 7, revenue: 1580000 },
      { range: '250k-300k', conversions: 3, revenue: 825000 },
      { range: '300k+', conversions: 1, revenue: 320000 },
    ],
    topPerformingConfigurations: [
      { config: 'Nest80 + Standard', conversions: 8, revenue: 1480000 },
      { config: 'Nest100 + Premium', conversions: 6, revenue: 1470000 },
      { config: 'Nest120 + Complete', conversions: 3, revenue: 960000 },
    ],
  },
  trafficSources: [
    { source: 'Organic Search', visitors: 4982, conversions: 12, rate: 0.24 },
    { source: 'Direct', visitors: 3456, conversions: 7, rate: 0.20 },
    { source: 'Social Media', visitors: 2134, conversions: 3, rate: 0.14 },
    { source: 'Referral', visitors: 1884, conversions: 1, rate: 0.05 },
  ],
  conversionFactors: {
    timeOnSite: { high: 23, medium: 45, low: 32 }, // percentage of conversions
    deviceType: { desktop: 67, mobile: 28, tablet: 5 },
    sessionTime: { morning: 15, afternoon: 45, evening: 35, night: 5 },
  },
};

function ConversionFunnel() {
  const maxUsers = Math.max(...mockConversionData.funnelSteps.map(s => s.users));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
      <div className="space-y-4">
        {mockConversionData.funnelSteps.map((step, index) => {
          const widthPercentage = (step.users / maxUsers) * 100;
          const isFirst = index === 0;
          
          return (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{step.step}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{step.users.toLocaleString()} users</span>
                  <span className="text-sm font-medium text-blue-600">
                    {step.conversionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div 
                    className={`h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      isFirst ? 'bg-blue-600' : 
                      step.conversionRate > 20 ? 'bg-green-500' :
                      step.conversionRate > 10 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${widthPercentage}%` }}
                  >
                    {widthPercentage > 15 ? `${step.users.toLocaleString()}` : ''}
                  </div>
                </div>
                
                {!isFirst && (
                  <div className="absolute right-0 -top-6 text-xs text-red-600 font-medium">
                    -{step.dropOff.toFixed(1)}% drop-off
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
              {mockConversionData.overallMetrics.configuratorStarts.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Started Configuration</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {mockConversionData.overallMetrics.conversions}
            </div>
            <div className="text-sm text-gray-600">Actual Sales</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {((mockConversionData.overallMetrics.conversions / mockConversionData.overallMetrics.totalVisitors) * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Overall Conversion</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueAnalysis() {
  const totalRevenue = mockConversionData.revenueAnalysis.conversionsByPriceRange.reduce(
    (sum, range) => sum + range.revenue, 0
  );
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analysis</h3>
      
      <div className="mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            €{(totalRevenue / 1000000).toFixed(2)}M
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg Deal: €{mockConversionData.revenueAnalysis.averageDealValue.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Revenue by Price Range</h4>
        {mockConversionData.revenueAnalysis.conversionsByPriceRange.map((range, index) => {
          const percentage = (range.revenue / totalRevenue) * 100;
          
          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{range.range}</span>
                <span className="text-gray-900">
                  €{(range.revenue / 1000000).toFixed(2)}M ({range.conversions} sales)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrafficSources() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion by Traffic Source</h3>
      <div className="space-y-4">
        {mockConversionData.trafficSources.map((source, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{source.source}</div>
              <div className="text-xs text-gray-600">
                {source.visitors.toLocaleString()} visitors • {source.conversions} conversions
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-semibold ${
                source.rate > 0.2 ? 'text-green-600' :
                source.rate > 0.15 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {(source.rate * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">conversion rate</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConversionTrends() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Trends</h3>
      <div className="space-y-4">
        {mockConversionData.conversionTrends.map((month, index) => (
          <div key={index} className="flex items-center">
            <div className="w-12 text-sm text-gray-600">{month.month}</div>
            <div className="flex-1 mx-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{month.visitors.toLocaleString()} visitors</span>
                <span>{month.conversions} conversions</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    month.rate > 0.2 ? 'bg-green-500' :
                    month.rate > 0.18 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(month.rate * 100) * 5}%` }} // Scale for visibility
                ></div>
              </div>
            </div>
            <div className="w-16 text-sm text-gray-900 text-right">
              {(month.rate * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConversionPage() {
  const overallConversionRate = (
    (mockConversionData.overallMetrics.conversions / mockConversionData.overallMetrics.totalVisitors) * 100
  ).toFixed(2);
  
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
                <span className="text-gray-900">Conversion Analysis</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">Conversion Analysis</h1>
              <p className="text-gray-600">Track conversion rates and revenue performance</p>
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">👥</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockConversionData.overallMetrics.totalVisitors.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">🎯</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">{overallConversionRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">💰</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  €{(mockConversionData.overallMetrics.revenue / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">📧</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lead Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {((mockConversionData.overallMetrics.inquiries / mockConversionData.overallMetrics.totalVisitors) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ConversionFunnel />
          <RevenueAnalysis />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TrafficSources />
          <ConversionTrends />
        </div>

        {/* Top Performing Configurations */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Configurations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockConversionData.revenueAnalysis.topPerformingConfigurations.map((config, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900 mb-2">{config.config}</div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{config.conversions} conversions</span>
                  <span className="text-sm font-semibold text-green-600">
                    €{(config.revenue / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Factors */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Factors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Time on Site</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">High (&gt;10min)</span>
                  <span className="font-medium">{mockConversionData.conversionFactors.timeOnSite.high}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Medium (5-10min)</span>
                  <span className="font-medium">{mockConversionData.conversionFactors.timeOnSite.medium}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Low (&lt;5min)</span>
                  <span className="font-medium">{mockConversionData.conversionFactors.timeOnSite.low}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Device Type</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Desktop</span>
                  <span className="font-medium">{mockConversionData.conversionFactors.deviceType.desktop}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mobile</span>
                  <span className="font-medium">{mockConversionData.conversionFactors.deviceType.mobile}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tablet</span>
                  <span className="font-medium">{mockConversionData.conversionFactors.deviceType.tablet}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Session Time</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Morning</span>
                  <span className="font-medium">{mockConversionData.conversionFactors.sessionTime.morning}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Afternoon</span>
                  <span className="font-medium">{mockConversionData.conversionFactors.sessionTime.afternoon}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Evening</span>
                  <span className="font-medium">{mockConversionData.conversionFactors.sessionTime.evening}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Recommendations */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Optimization Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-red-900">Major Drop-off at Configuration Complete</h4>
                <p className="text-sm text-red-700">
                  86% of users abandon after completing configuration. Consider adding incentives or simplifying the next step.
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-yellow-900">Mobile Conversion Rate Opportunity</h4>
                <p className="text-sm text-yellow-700">
                  Only 28% of conversions come from mobile. Optimize mobile experience for better conversion.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-green-900">Organic Search Performing Well</h4>
                <p className="text-sm text-green-700">
                  0.24% conversion rate from organic search - highest among all traffic sources.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-blue-900">Mid-Range Revenue Sweet Spot</h4>
                <p className="text-sm text-blue-700">
                  €200k-250k configurations generate significant revenue. Focus marketing on this segment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 