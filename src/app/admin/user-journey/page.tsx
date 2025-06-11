/**
 * User Journey Tracking - Admin Panel
 * 
 * Analyzes user paths through the configurator, identifies drop-off points,
 * and provides insights for optimizing the user experience.
 */

import Link from 'next/link';

// Mock data - replace with real database queries
const mockJourneyData = {
  totalSessions: 1247,
  completedJourneys: 89,
  averageSteps: 4.2,
  dropOffPoints: [
    { step: 'Nest Selection', users: 1247, dropOff: 0.08 },
    { step: 'Gebäudehülle', users: 1147, dropOff: 0.15 },
    { step: 'Innenverkleidung', users: 975, dropOff: 0.22 },
    { step: 'Fußboden', users: 760, dropOff: 0.31 },
    { step: 'PV-Anlage', users: 524, dropOff: 0.45 },
    { step: 'Fenster', users: 288, dropOff: 0.62 },
    { step: 'Planungspaket', users: 109, dropOff: 0.71 },
    { step: 'Jetzt Bauen', users: 89, dropOff: 0 },
  ],
  commonPaths: [
    { path: 'Nest80 → Holzlattung → Kiefer → Parkett → Complete', frequency: 34 },
    { path: 'Nest100 → Trapezblech → Eiche → Parkett → PV → Complete', frequency: 28 },
    { path: 'Nest80 → Holzlattung → Kiefer → Exit', frequency: 156 },
    { path: 'Nest120 → Holzlattung → Exit', frequency: 89 },
  ],
  timeSpentByStep: [
    { step: 'Nest Selection', avgTime: '1m 23s', medianTime: '45s' },
    { step: 'Gebäudehülle', avgTime: '2m 15s', medianTime: '1m 30s' },
    { step: 'Innenverkleidung', avgTime: '1m 45s', medianTime: '1m 10s' },
    { step: 'Fußboden', avgTime: '1m 20s', medianTime: '55s' },
    { step: 'PV-Anlage', avgTime: '3m 10s', medianTime: '2m 20s' },
    { step: 'Fenster', avgTime: '4m 30s', medianTime: '3m 45s' },
    { step: 'Planungspaket', avgTime: '2m 40s', medianTime: '2m 10s' },
  ]
};

function FunnelChart() {
  const maxUsers = Math.max(...mockJourneyData.dropOffPoints.map(d => d.users));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurator Funnel Analysis</h3>
      <div className="space-y-3">
        {mockJourneyData.dropOffPoints.map((point, index) => {
          const widthPercentage = (point.users / maxUsers) * 100;
          const isLast = index === mockJourneyData.dropOffPoints.length - 1;
          
          return (
            <div key={point.step} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{point.step}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{point.users} users</span>
                  {!isLast && (
                    <span className={`text-sm font-medium ${
                      point.dropOff > 0.3 ? 'text-red-600' : 
                      point.dropOff > 0.15 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {Math.round(point.dropOff * 100)}% drop-off
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className={`h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                    point.dropOff > 0.3 ? 'bg-red-500' : 
                    point.dropOff > 0.15 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${widthPercentage}%` }}
                >
                  {widthPercentage > 20 ? `${point.users}` : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{mockJourneyData.totalSessions}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{mockJourneyData.completedJourneys}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round((mockJourneyData.completedJourneys / mockJourneyData.totalSessions) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
        </div>
      </div>
    </div>
  );
}

function CommonPaths() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common User Paths</h3>
      <div className="space-y-3">
        {mockJourneyData.commonPaths.map((path, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{path.path}</div>
              <div className="text-xs text-gray-600 mt-1">
                {path.path.includes('Exit') ? 'Abandoned Journey' : 'Completed Journey'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">{path.frequency}</div>
              <div className="text-xs text-gray-600">users</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimeAnalysis() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Spent Analysis</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Configuration Step</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Average Time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Median Time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockJourneyData.timeSpentByStep.map((step, index) => {
              const avgTimeSeconds = parseInt(step.avgTime.split('m')[0]) * 60 + parseInt(step.avgTime.split('m')[1]);
              const isHighTime = avgTimeSeconds > 180; // More than 3 minutes
              
              return (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">{step.step}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{step.avgTime}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{step.medianTime}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isHighTime ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {isHighTime ? 'Needs Optimization' : 'Good'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UserJourneyPage() {
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
                <span className="text-gray-900">User Journey Tracking</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">User Journey Analysis</h1>
              <p className="text-gray-600">Track user paths and optimize the configurator experience</p>
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">🎯</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Steps Completed</p>
                <p className="text-2xl font-bold text-gray-900">{mockJourneyData.averageSteps}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">⏱️</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
                <p className="text-2xl font-bold text-gray-900">8m 42s</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">🚪</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Exit Point</p>
                <p className="text-2xl font-bold text-red-600">Fußboden</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">📱</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mobile Users</p>
                <p className="text-2xl font-bold text-gray-900">68%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FunnelChart />
          <CommonPaths />
        </div>

        <TimeAnalysis />

        {/* Recommendations */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Optimization Recommendations</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium text-red-900">High Drop-off at Fußboden (31%)</h4>
              <p className="text-sm text-red-700">Consider simplifying the floor selection or adding more guidance.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium text-yellow-900">Long Time on PV-Anlage (3m 10s)</h4>
              <p className="text-sm text-yellow-700">Users need more help understanding PV options. Consider adding a calculator or wizard.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-green-900">Strong Performance on Nest Selection</h4>
              <p className="text-sm text-green-700">Only 8% drop-off rate - this step works well as an entry point.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 