"use client";

import React, { useState, useEffect } from 'react';

interface ConfigurationStats {
  nestType: string;
  count: number;
  conversionCount: number;
  conversionRate: number;
  avgPrice: number;
  avgTimeSpent: number;
}

interface PriceRangeStats {
  range: string;
  count: number;
  conversionCount: number;
  conversionRate: number;
}

interface MaterialCombo {
  gebaeudehuelle: string;
  innenverkleidung: string;
  fussboden: string;
  count: number;
  conversionCount: number;
  conversionRate: number;
}

interface AnalyticsData {
  byNestType: ConfigurationStats[];
  byPriceRange: PriceRangeStats[];
  topMaterialCombos: MaterialCombo[];
  totalConfigurations: number;
  totalConversions: number;
  avgCompletionTime: number;
}

export default function ConfigurationAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics/configuration-success?timeRange=${timeRange}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading configuration analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Configuration Success Analysis</h1>
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Configuration Success Analysis</h1>
        <div className="text-gray-600">No data available</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configuration Success Analysis
        </h1>
        <p className="text-gray-600">
          Understand which configurations lead to conversions
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        {['7d', '30d', '90d'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last {range === '7d' ? '7' : range === '30d' ? '30' : '90'} Days
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Configurations</div>
          <div className="text-3xl font-bold text-gray-900">{data.totalConfigurations}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Conversions</div>
          <div className="text-3xl font-bold text-green-600">{data.totalConversions}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Avg. Completion Time</div>
          <div className="text-3xl font-bold text-blue-600">
            {Math.round(data.avgCompletionTime / 60)}m
          </div>
        </div>
      </div>

      {/* Performance by Nest Type */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance by Nest Type</h2>
        
        <div className="space-y-4">
          {data.byNestType.map(nest => (
            <div key={nest.nestType} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">{nest.nestType}</div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {nest.count} configs
                  </span>
                  <span className={`text-lg font-bold ${
                    nest.conversionRate > 5 ? 'text-green-600' : 
                    nest.conversionRate > 2 ? 'text-blue-600' : 
                    'text-gray-600'
                  }`}>
                    {nest.conversionRate}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Conversions: </span>
                  <span className="font-medium text-gray-900">{nest.conversionCount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Avg. Price: </span>
                  <span className="font-medium text-gray-900">
                    €{Math.round(nest.avgPrice).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Avg. Time: </span>
                  <span className="font-medium text-gray-900">
                    {Math.round(nest.avgTimeSpent / 60)}m
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    nest.conversionRate > 5 ? 'bg-green-500' : 
                    nest.conversionRate > 2 ? 'bg-blue-500' : 
                    'bg-gray-400'
                  }`}
                  style={{ width: `${Math.min((nest.conversionRate / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance by Price Range */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance by Price Range</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.byPriceRange.map(range => (
            <div key={range.range} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-gray-900">{range.range}</div>
                <div className="text-lg font-bold text-blue-600">
                  {range.conversionRate}%
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {range.count} configurations · {range.conversionCount} conversions
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Material Combinations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Converting Material Combinations</h2>
        
        <div className="space-y-3">
          {data.topMaterialCombos.slice(0, 5).map((combo, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="font-medium text-gray-900">
                    {combo.count} selections · {combo.conversionRate}% conversion
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 text-xs mb-1">Gebäudehülle</div>
                  <div className="font-medium text-gray-900 capitalize">
                    {combo.gebaeudehuelle.replace(/_/g, ' ')}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">Innenverkleidung</div>
                  <div className="font-medium text-gray-900 capitalize">
                    {combo.innenverkleidung.replace(/_/g, ' ')}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">Fußboden</div>
                  <div className="font-medium text-gray-900 capitalize">
                    {combo.fussboden.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
