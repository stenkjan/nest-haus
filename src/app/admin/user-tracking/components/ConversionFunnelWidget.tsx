/**
 * Conversion Funnel Component
 * 
 * Visual funnel showing step-by-step conversion rates
 * Integrated into user-tracking dashboard
 */

'use client';

import { useEffect, useState } from 'react';

interface FunnelStep {
  step: string;
  stepNumber: number;
  users: number;
  conversionRate: number;
  dropOff: number;
}

interface ConversionFunnelData {
  funnelSteps: FunnelStep[];
  metadata: {
    totalVisitors: number;
    totalConversions: number;
    overallConversionRate: number;
  };
}

export default function ConversionFunnelWidget() {
  const [data, setData] = useState<ConversionFunnelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunnelData();
  }, []);

  async function fetchFunnelData() {
    try {
      const response = await fetch('/api/admin/conversion');
      const result = await response.json();

      if (result.success && result.data) {
        setData({
          funnelSteps: result.data.funnelSteps,
          metadata: result.data.metadata
        });
      }
    } catch (error) {
      console.error('Failed to fetch funnel data:', error);
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

  if (!data || data.funnelSteps.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conversion Funnel
        </h3>
        <p className="text-gray-500">No funnel data available</p>
      </div>
    );
  }

  const maxUsers = Math.max(...data.funnelSteps.map((s) => s.users));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Conversion Funnel
          </h3>
          <p className="text-sm text-gray-500">
            User journey from visit to conversion
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {data.metadata.overallConversionRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">Overall Rate</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.funnelSteps.map((step, index) => {
          const width = (step.users / maxUsers) * 100;
          const isLast = index === data.funnelSteps.length - 1;

          return (
            <div key={step.stepNumber}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                    {step.stepNumber}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {step.step}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {step.users.toLocaleString()} users
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {step.conversionRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-12 overflow-hidden">
                  <div
                    className={`h-full ${
                      isLast ? 'bg-green-500' : 'bg-blue-500'
                    } rounded-full flex items-center justify-center text-white font-medium text-sm transition-all duration-500`}
                    style={{ width: `${width}%` }}
                  >
                    {width > 15 && `${width.toFixed(0)}%`}
                  </div>
                </div>
              </div>

              {!isLast && step.dropOff > 0 && (
                <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <span>↓ {step.dropOff.toFixed(1)}% drop-off</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {data.metadata.totalVisitors.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Total Visitors</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">
            {data.metadata.totalConversions.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Conversions</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">
            {data.metadata.overallConversionRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">Conversion Rate</p>
        </div>
      </div>
    </div>
  );
}

