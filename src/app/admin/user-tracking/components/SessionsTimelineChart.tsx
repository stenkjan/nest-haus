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
  comparison: {
    previous: number[];
    percentChange: number;
    currentTotal: number;
    previousTotal: number;
  };
}

export default function SessionsTimelineChart() {
  const [data, setData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchTimelineData();
  }, []);

  async function fetchTimelineData() {
    try {
      const response = await fetch('/api/admin/analytics/sessions-timeline');
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

  const maxValue = Math.max(...data.sessions, ...data.comparison.previous);
  const chartHeight = 250;
  const chartWidth = 800;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Calculate points for current period
  const currentPoints = data.sessions.map((value, index) => {
    const x = padding.left + (index / (data.sessions.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - (value / maxValue) * graphHeight;
    return { x, y, value, date: data.dates[index] };
  });

  // Calculate points for previous period
  const previousPoints = data.comparison.previous.map((value, index) => {
    const x = padding.left + (index / (data.comparison.previous.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - (value / maxValue) * graphHeight;
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Sessions Over Time
          </h3>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>
        
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
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + graphHeight - ratio * graphHeight;
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
                  {Math.round(maxValue * ratio)}
                </text>
              </g>
            );
          })}

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
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === index ? 6 : 4}
                fill="#2563eb"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              
              {/* Tooltip on hover */}
              {hoveredIndex === index && (
                <g>
                  <rect
                    x={point.x - 40}
                    y={point.y - 50}
                    width="80"
                    height="40"
                    rx="4"
                    fill="rgba(0, 0, 0, 0.8)"
                  />
                  <text
                    x={point.x}
                    y={point.y - 32}
                    textAnchor="middle"
                    fontSize="11"
                    fill="white"
                    fontWeight="bold"
                  >
                    {point.value} sessions
                  </text>
                  <text
                    x={point.x}
                    y={point.y - 18}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#d1d5db"
                  >
                    {new Date(point.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* X-axis date labels (show every 5 days) */}
          {currentPoints.filter((_, i) => i % 5 === 0 || i === currentPoints.length - 1).map((point, index) => (
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
    </div>
  );
}

