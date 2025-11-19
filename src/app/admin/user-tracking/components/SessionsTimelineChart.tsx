/**
 * Sessions Timeline Chart Component
 * 
 * Line chart showing sessions over the last 30 days
 * With comparison overlay from previous period
 */

'use client';

import { useEffect, useState } from 'react';

interface TimelineData {
  dates: string[];
  sessions: number[];
  uniqueUsers: number[];
  comparison: {
    previous: number[];
    previousUniqueUsers: number[];
    percentChange: number;
    currentTotal: number;
    previousTotal: number;
    currentUniqueUsersTotal: number;
    previousUniqueUsersTotal: number;
  };
}

type Period = 'today' | '7d' | '30d' | 'all';

export default function SessionsTimelineChart() {
  const [data, setData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [period, setPeriod] = useState<Period>('30d');

  useEffect(() => {
    fetchTimelineData();
  }, [period]);

  async function fetchTimelineData() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics/sessions-timeline?period=${period}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch timeline data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No timeline data available</p>
      </div>
    );
  }

  // Calculate max value with 10% padding for better visualization
  const maxValue = Math.max(...data.sessions, ...data.comparison.previous);
  const maxValueWithPadding = Math.ceil(maxValue * 1.1);
  
  const chartHeight = 250;
  const chartWidth = 800;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Calculate points for current period
  const currentPoints = data.sessions.map((value, index) => {
    const x = padding.left + (index / Math.max(data.sessions.length - 1, 1)) * graphWidth;
    const y = padding.top + graphHeight - (value / maxValueWithPadding) * graphHeight;
    return { 
      x, 
      y, 
      value, 
      uniqueUsers: data.uniqueUsers[index],
      date: data.dates[index] 
    };
  });

  // Calculate points for previous period
  const previousPoints = data.comparison.previous.map((value, index) => {
    const x = padding.left + (index / Math.max(data.comparison.previous.length - 1, 1)) * graphWidth;
    const y = padding.top + graphHeight - (value / maxValueWithPadding) * graphHeight;
    return { x, y, value };
  });

  // Create SVG path for current period
  const currentPath = currentPoints.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Create SVG path for previous period (dashed)
  const previousPath = previousPoints.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const trendColor = data.comparison.percentChange > 0 
    ? 'text-green-600' 
    : data.comparison.percentChange < 0 
    ? 'text-red-600' 
    : 'text-gray-600';
  
  // Generate Y-axis grid lines (10 steps for clean display)
  const yAxisSteps = 10;
  const yAxisValues = Array.from({ length: yAxisSteps + 1 }, (_, i) => i / yAxisSteps);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Sessions Over Time
          </h3>
          <p className="text-sm text-gray-500">
            {period === 'today' ? 'Today' : period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : 'All time'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Period Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Period:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          {/* Stats Display */}
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {data.comparison.currentTotal.toLocaleString()}
            </p>
            <p className={`text-sm font-medium ${trendColor}`}>
              {data.comparison.percentChange > 0 ? '↑' : data.comparison.percentChange < 0 ? '↓' : '→'}
              {' '}{Math.abs(data.comparison.percentChange)}% vs previous period
            </p>
          </div>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-blue-600"></div>
          <span className="text-gray-600">Current Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 border-t-2 border-dashed border-gray-400"></div>
          <span className="text-gray-600">Previous Period</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative overflow-x-auto">
        <svg 
          width={chartWidth} 
          height={chartHeight}
          className="mx-auto"
        >
          {/* Y-axis grid lines and labels (10 steps) */}
          {yAxisValues.map((ratio) => {
            const y = padding.top + graphHeight - ratio * graphHeight;
            const value = Math.round(maxValueWithPadding * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#6b7280"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Y-axis label */}
          <text
            x={padding.left - 45}
            y={padding.top + graphHeight / 2}
            textAnchor="middle"
            fontSize="11"
            fill="#6b7280"
            transform={`rotate(-90, ${padding.left - 45}, ${padding.top + graphHeight / 2})`}
          >
            Sessions
          </text>

          {/* Previous period line (dashed) */}
          <path
            d={previousPath}
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Current period line */}
          <path
            d={currentPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive points */}
          {currentPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 6 : 4}
              fill="#2563eb"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}

          {/* X-axis date labels (show every N days depending on period length) */}
          {currentPoints.filter((_, i) => {
            const step = Math.max(1, Math.floor(currentPoints.length / 10));
            return i % step === 0 || i === currentPoints.length - 1;
          }).map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight - padding.bottom + 20}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {new Date(point.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </text>
          ))}
        </svg>
      </div>

      {/* Interactive Info Panel Below Chart */}
      <div className="bg-gray-50 rounded-lg p-4 mt-4 min-h-[80px]">
        {hoveredIndex !== null ? (
          <>
            <div className="text-lg font-bold text-gray-900 mb-2">
              {new Date(currentPoints[hoveredIndex].date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Unique Users:</span>
                <span className="ml-2 text-lg font-bold text-blue-600">{currentPoints[hoveredIndex].uniqueUsers}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Total Sessions:</span>
                <span className="ml-2 text-lg font-bold text-green-600">{currentPoints[hoveredIndex].value}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center py-4">Hover over chart to see details</div>
        )}
      </div>
    </div>
  );
}

