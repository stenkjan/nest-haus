'use client';

interface ClickAnalyticsProps {
  pageClicks: Array<{ path: string; title: string; count: number; percentage: number }>;
  mouseClicks: Array<{ elementId: string; category: string; count: number; percentage: number }>;
}

export default function ClickAnalytics({ pageClicks, mouseClicks }: ClickAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Page Clicks Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📄 Most Clicked Pages
        </h3>
        {pageClicks.length > 0 ? (
          <div className="space-y-3">
            {pageClicks.slice(0, 10).map((page, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{page.title}</div>
                    <div className="text-xs text-gray-500">{page.path}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-bold text-blue-600">{page.count}</div>
                    <div className="text-xs text-gray-500">{page.percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${page.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">
            No page click data available
          </div>
        )}
      </div>

      {/* Mouse Clicks Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🖱️ Most Clicked Elements
        </h3>
        {mouseClicks.length > 0 ? (
          <div className="space-y-3">
            {mouseClicks.slice(0, 15).map((click, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{click.elementId}</div>
                    <div className="text-xs text-gray-500">Category: {click.category}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-bold text-green-600">{click.count}</div>
                    <div className="text-xs text-gray-500">{click.percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${click.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">
            No mouse click data available
          </div>
        )}
      </div>
    </div>
  );
}

