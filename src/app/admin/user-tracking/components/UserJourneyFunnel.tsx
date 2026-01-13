"use client";

import React, { useState, useEffect } from 'react';

interface FunnelStep {
  name: string;
  count: number;
  percentage: number;
  dropOff: number;
  dropOffPercentage: number;
}

interface FunnelData {
  totalSessions: number;
  steps: FunnelStep[];
  conversionRate: number;
}

export default function UserJourneyFunnel() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchFunnelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  async function fetchFunnelData() {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/user-tracking?timeRange=${timeRange}`);
      const result = await response.json();

      if (result.success) {
        // Extract funnel data from existing analytics
        const funnelSteps: FunnelStep[] = [];
        const total = result.data.totalSessions || 0;

        // Step 1: Site Visit (all sessions)
        const step1Count = total;
        funnelSteps.push({
          name: 'Site Visit',
          count: step1Count,
          percentage: 100,
          dropOff: 0,
          dropOffPercentage: 0,
        });

        // Step 2: Konfigurator Opened
        const step2Count = result.data.funnelMetrics?.configuratorOpened || 0;
        const step2DropOff = step1Count - step2Count;
        funnelSteps.push({
          name: 'Konfigurator Opened',
          count: step2Count,
          percentage: Math.round((step2Count / total) * 100 * 10) / 10,
          dropOff: step2DropOff,
          dropOffPercentage: Math.round((step2DropOff / step1Count) * 100 * 10) / 10,
        });

        // Step 3: Configuration Created
        const step3Count = result.data.funnelMetrics?.configurationCreated || 0;
        const step3DropOff = step2Count - step3Count;
        funnelSteps.push({
          name: 'Configuration Created',
          count: step3Count,
          percentage: Math.round((step3Count / total) * 100 * 10) / 10,
          dropOff: step3DropOff,
          dropOffPercentage: step2Count > 0 ? Math.round((step3DropOff / step2Count) * 100 * 10) / 10 : 0,
        });

        // Step 4: Added to Cart
        const step4Count = result.data.funnelMetrics?.addedToCart || 0;
        const step4DropOff = step3Count - step4Count;
        funnelSteps.push({
          name: 'Added to Cart',
          count: step4Count,
          percentage: Math.round((step4Count / total) * 100 * 10) / 10,
          dropOff: step4DropOff,
          dropOffPercentage: step3Count > 0 ? Math.round((step4DropOff / step3Count) * 100 * 10) / 10 : 0,
        });

        // Step 5: Checkout Started
        const step5Count = result.data.funnelMetrics?.checkoutStarted || 0;
        const step5DropOff = step4Count - step5Count;
        funnelSteps.push({
          name: 'Checkout Started',
          count: step5Count,
          percentage: Math.round((step5Count / total) * 100 * 10) / 10,
          dropOff: step5DropOff,
          dropOffPercentage: step4Count > 0 ? Math.round((step5DropOff / step4Count) * 100 * 10) / 10 : 0,
        });

        // Step 6: Payment Completed
        const step6Count = result.data.conversions?.konzeptcheckPayments?.total || 0;
        const step6DropOff = step5Count - step6Count;
        funnelSteps.push({
          name: 'Payment Completed',
          count: step6Count,
          percentage: Math.round((step6Count / total) * 100 * 10) / 10,
          dropOff: step6DropOff,
          dropOffPercentage: step5Count > 0 ? Math.round((step6DropOff / step5Count) * 100 * 10) / 10 : 0,
        });

        setData({
          totalSessions: total,
          steps: funnelSteps,
          conversionRate: total > 0 ? Math.round((step6Count / total) * 100 * 10) / 10 : 0,
        });
      }
    } catch (error) {
      console.error('Error fetching funnel data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Journey Funnel</h3>
        <div className="text-gray-600">Loading funnel data...</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">User Journey Funnel</h3>
        
        {/* Time Range Selector */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {['7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range === '7d' ? '7D' : range === '30d' ? '30D' : '90D'}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Conversion Rate */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">Overall Conversion Rate</div>
            <div className="text-xs text-gray-600 mt-1">Site Visit → Payment</div>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {data.conversionRate}%
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-3">
        {data.steps.map((step, index) => {
          const isLast = index === data.steps.length - 1;
          const barWidth = (step.count / data.totalSessions) * 100;

          return (
            <div key={step.name}>
              {/* Step Bar */}
              <div className="flex items-center gap-4">
                <div className="w-40 shrink-0">
                  <div className="text-sm font-medium text-gray-900">{step.name}</div>
                  <div className="text-xs text-gray-500">{step.percentage}%</div>
                </div>

                <div className="flex-1">
                  <div className="relative">
                    <div className="w-full bg-gray-100 rounded-full h-8">
                      <div
                        className={`h-8 rounded-full flex items-center justify-between px-3 transition-all duration-500 ${
                          index === 0 ? 'bg-blue-600' :
                          index === data.steps.length - 1 ? 'bg-green-600' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${Math.max(barWidth, 5)}%` }}
                      >
                        <span className="text-white font-semibold text-sm">
                          {step.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drop-off indicator */}
              {!isLast && step.dropOff > 0 && (
                <div className="ml-40 mt-1 text-xs text-red-600">
                  ↓ {step.dropOff.toLocaleString()} users ({step.dropOffPercentage}%) dropped off
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-3">Key Insights:</div>
        <div className="space-y-2 text-sm text-gray-600">
          {data.steps[1] && data.steps[1].dropOffPercentage > 50 && (
            <div className="flex items-start gap-2">
              <span className="text-red-500">⚠</span>
              <span>
                High drop-off ({data.steps[1].dropOffPercentage}%) before opening configurator. 
                Consider improving landing page CTAs.
              </span>
            </div>
          )}
          
          {data.steps[3] && data.steps[3].dropOffPercentage > 30 && (
            <div className="flex items-start gap-2">
              <span className="text-orange-500">⚠</span>
              <span>
                {data.steps[3].dropOffPercentage}% drop-off from configuration to cart. 
                Simplify &quot;Add to Cart&quot; flow or add trust signals.
              </span>
            </div>
          )}

          {data.conversionRate > 3 && (
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>
                Excellent overall conversion rate ({data.conversionRate}%)! Industry average is 2-3%.
              </span>
            </div>
          )}

          {data.conversionRate < 1 && (
            <div className="flex items-start gap-2">
              <span className="text-red-500">⚠</span>
              <span>
                Low conversion rate ({data.conversionRate}%). Focus on CTA optimization and trust building.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
