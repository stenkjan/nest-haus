/**
 * Popular Konfigurationen - Admin Panel
 * 
 * Displays the most popular house configurations, pricing trends,
 * and customer preferences to inform business decisions.
 */

import Link from 'next/link';

// Types for the component props
interface ConfigurationData {
  id: number;
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
}

interface SelectionStatItem {
  name: string;
  count: number;
  percentage: number;
}

// Mock data - replace with real database queries
const mockConfigurationData = {
  topConfigurations: [
    {
      id: 1,
      nestType: 'Nest80',
      gebaeudehuelle: 'Holzlattung',
      innenverkleidung: 'Kiefer',
      fussboden: 'Parkett',
      pvanlage: 'None',
      fenster: 'Standard',
      planungspaket: 'Basic',
      totalPrice: 185000,
      selectionCount: 234,
      conversionRate: 0.15,
      lastSelected: '2024-01-15',
    },
    {
      id: 2,
      nestType: 'Nest100',
      gebaeudehuelle: 'Trapezblech',
      innenverkleidung: 'Eiche',
      fussboden: 'Parkett',
      pvanlage: '10kWp',
      fenster: 'Premium',
      planungspaket: 'Comfort',
      totalPrice: 245000,
      selectionCount: 189,
      conversionRate: 0.22,
      lastSelected: '2024-01-14',
    },
    {
      id: 3,
      nestType: 'Nest80',
      gebaeudehuelle: 'Holzlattung',
      innenverkleidung: 'Kiefer',
      fussboden: 'Laminat',
      pvanlage: '5kWp',
      fenster: 'Standard',
      planungspaket: 'Basic',
      totalPrice: 165000,
      selectionCount: 156,
      conversionRate: 0.12,
      lastSelected: '2024-01-13',
    },
    {
      id: 4,
      nestType: 'Nest120',
      gebaeudehuelle: 'Trapezblech',
      innenverkleidung: 'Eiche',
      fussboden: 'Parkett',
      pvanlage: '15kWp',
      fenster: 'Premium',
      planungspaket: 'Premium',
      totalPrice: 320000,
      selectionCount: 98,
      conversionRate: 0.31,
      lastSelected: '2024-01-12',
    },
    {
      id: 5,
      nestType: 'Nest100',
      gebaeudehuelle: 'Holzlattung',
      innenverkleidung: 'Lärche',
      fussboden: 'Parkett',
      pvanlage: '10kWp',
      fenster: 'Standard',
      planungspaket: 'Comfort',
      totalPrice: 230000,
      selectionCount: 87,
      conversionRate: 0.18,
      lastSelected: '2024-01-11',
    },
  ],
  priceDistribution: [
    { range: '150k-200k', count: 523, percentage: 42 },
    { range: '200k-250k', count: 387, percentage: 31 },
    { range: '250k-300k', count: 201, percentage: 16 },
    { range: '300k+', count: 134, percentage: 11 },
  ],
  selectionStats: {
    nestTypes: [
      { name: 'Nest80', count: 456, percentage: 45 },
      { name: 'Nest100', count: 342, percentage: 34 },
      { name: 'Nest120', count: 213, percentage: 21 },
    ],
    gebaeudehuelle: [
      { name: 'Holzlattung', count: 567, percentage: 56 },
      { name: 'Trapezblech', count: 444, percentage: 44 },
    ],
    innenverkleidung: [
      { name: 'Kiefer', count: 456, percentage: 45 },
      { name: 'Eiche', count: 334, percentage: 33 },
      { name: 'Lärche', count: 221, percentage: 22 },
    ],
    fussboden: [
      { name: 'Parkett', count: 623, percentage: 62 },
      { name: 'Laminat', count: 388, percentage: 38 },
    ],
    pvanlage: [
      { name: 'None', count: 456, percentage: 45 },
      { name: '5kWp', count: 278, percentage: 28 },
      { name: '10kWp', count: 189, percentage: 19 },
      { name: '15kWp', count: 88, percentage: 8 },
    ],
  },
  trends: {
    weekly: [
      { week: 'KW 1', nest80: 45, nest100: 38, nest120: 17 },
      { week: 'KW 2', nest80: 43, nest100: 39, nest120: 18 },
      { week: 'KW 3', nest80: 47, nest100: 35, nest120: 18 },
      { week: 'KW 4', nest80: 44, nest100: 37, nest120: 19 },
    ],
  },
};

function ConfigurationCard({ config }: { config: ConfigurationData }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{config.nestType}</h3>
          <p className="text-sm text-gray-600">
            {config.selectionCount} selections • {Math.round(config.conversionRate * 100)}% conversion
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
            <span className="ml-2 text-xs text-gray-600">
              {Math.round(config.conversionRate * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceDistribution() {
  const maxCount = Math.max(...mockConfigurationData.priceDistribution.map(d => d.count));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Distribution</h3>
      <div className="space-y-4">
        {mockConfigurationData.priceDistribution.map((range, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{range.range}</span>
              <span className="text-sm text-gray-600">{range.count} configurations</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full flex items-center justify-center"
                style={{ width: `${(range.count / maxCount) * 100}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {(range.count / maxCount) * 100 > 30 ? `${range.percentage}%` : ''}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectionStats() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Popularity</h3>
      <div className="space-y-6">
        {Object.entries(mockConfigurationData.selectionStats).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="space-y-2">
              {(items as SelectionStatItem[]).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
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
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h3>
      <div className="space-y-4">
        {mockConfigurationData.trends.weekly.map((week, index) => (
          <div key={index} className="space-y-2">
            <div className="text-sm font-medium text-gray-700">{week.week}</div>
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
      </div>
      
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
              <nav className="flex text-sm text-gray-500 mb-2">
                <Link href="/admin" className="hover:text-gray-700">Admin</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Popular Konfigurationen</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">Popular Konfigurationen</h1>
              <p className="text-gray-600">Discover trending house configurations and customer preferences</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Export Data
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">🏆</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Most Popular</p>
                <p className="text-2xl font-bold text-gray-900">Nest80</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">💰</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900">€218k</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">🎯</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Conversion</p>
                <p className="text-2xl font-bold text-green-600">31%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">📈</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Configurations</p>
                <p className="text-2xl font-bold text-gray-900">1,245</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Configurations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 5 Configurations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockConfigurationData.topConfigurations.slice(0, 3).map((config) => (
              <ConfigurationCard key={config.id} config={config} />
            ))}
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <PriceDistribution />
          <SelectionStats />
          <TrendChart />
        </div>

        {/* Remaining Configurations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Popular Configurations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockConfigurationData.topConfigurations.slice(3).map((config) => (
              <ConfigurationCard key={config.id} config={config} />
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-green-900">Premium Configurations Converting Well</h4>
                <p className="text-sm text-green-700">
                  Nest120 with premium features shows 31% conversion rate despite higher price.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-blue-900">Parkett Flooring Dominates</h4>
                <p className="text-sm text-blue-700">
                  62% of customers choose Parkett over Laminat, indicating preference for premium materials.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-yellow-900">PV-Anlage Adoption Growing</h4>
                <p className="text-sm text-yellow-700">
                  55% now include solar panels, up from 40% last quarter.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-purple-900">Mid-Range Sweet Spot</h4>
                <p className="text-sm text-purple-700">
                  €200k-250k price range captures 31% of all configurations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 