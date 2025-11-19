/**
 * Konzeptcheck Dashboard Component
 * 
 * Tracks Entwurf/Konzeptcheck conversions and revenue
 * Shows configuration breakdown for Konzeptcheck orders
 */

'use client';

import { useEffect, useState } from 'react';

interface KonzeptcheckData {
  totalRevenue: number;
  totalCount: number;
  withConfiguration: number;
  withoutConfiguration: number;
  topConfigurations: Array<{
    nestType: string;
    gebaeudehuelle: string;
    innenverkleidung: string;
    count: number;
  }>;
}

export default function KonzeptcheckDashboard() {
  const [data, setData] = useState<KonzeptcheckData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKonzeptcheckData();
  }, []);

  async function fetchKonzeptcheckData() {
    try {
      const response = await fetch('/api/admin/conversion');
      const result = await response.json();

      if (result.success && result.data?.entwurfKonzeptcheck) {
        setData(result.data.entwurfKonzeptcheck);
      }
    } catch (error) {
      console.error('Failed to fetch Konzeptcheck data:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number): string => {
    return `€${(amount / 100).toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Konzeptcheck Dashboard
        </h3>
        <p className="text-gray-500">No Konzeptcheck data available</p>
      </div>
    );
  }

  const withConfigPct = data.totalCount > 0
    ? (data.withConfiguration / data.totalCount) * 100
    : 0;
  const withoutConfigPct = data.totalCount > 0
    ? (data.withoutConfiguration / data.totalCount) * 100
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        💰 Konzeptcheck Dashboard
      </h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-800 mb-1">
            Total Revenue
          </p>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(data.totalRevenue)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-1">
            Total Orders
          </p>
          <p className="text-2xl font-bold text-blue-900">
            {data.totalCount}
          </p>
        </div>
      </div>

      {/* Configuration Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Configuration Breakdown
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Mit Konfiguration</span>
              <span className="text-sm font-semibold text-gray-900">
                {data.withConfiguration} ({withConfigPct.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${withConfigPct}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Ohne Konfiguration</span>
              <span className="text-sm font-semibold text-gray-900">
                {data.withoutConfiguration} ({withoutConfigPct.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${withoutConfigPct}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Configurations */}
      {data.topConfigurations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Top Configurations (mit Konfiguration)
          </h4>
          <div className="space-y-2">
            {data.topConfigurations.slice(0, 5).map((config, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {config.nestType}
                  </p>
                  <p className="text-xs text-gray-600">
                    {config.gebaeudehuelle} • {config.innenverkleidung}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {config.count}x
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Average Order Value */}
      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500 mb-1">Average Order Value</p>
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(data.totalCount > 0 ? data.totalRevenue / data.totalCount : 0)}
        </p>
      </div>
    </div>
  );
}

