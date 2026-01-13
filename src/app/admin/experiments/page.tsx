"use client";

import React, { useState, useEffect } from 'react';

interface ExperimentResult {
  experimentId: string;
  experimentName: string;
  variants: Array<{
    variantId: string;
    variantName: string;
    assignments: number;
    goals: number;
    conversionRate: number;
  }>;
  totalAssignments: number;
  totalGoals: number;
  overallRate: number;
}

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<ExperimentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchExperimentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  async function fetchExperimentData() {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/experiments/results?timeRange=${timeRange}`);
      const result = await response.json();

      if (result.success) {
        setExperiments(result.data);
      }
    } catch (error) {
      console.error('Error loading experiment data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">A/B Test Results</h1>
        <div className="text-gray-600">Loading experiment data...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">A/B Test Results</h1>
        <p className="text-gray-600">
          Monitor experiment performance and optimize for conversions
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

      {/* Experiments */}
      {experiments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-500 mb-2">No experiment data available yet</div>
          <div className="text-sm text-gray-400">
            Experiments will appear here once users start interacting with test variants
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {experiments.map(experiment => (
            <div
              key={experiment.experimentId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {experiment.experimentName}
                  </h2>
                  <div className="text-sm text-gray-600 mt-1">
                    {experiment.totalAssignments} users · {experiment.totalGoals} conversions ·{' '}
                    {experiment.overallRate}% rate
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {experiment.overallRate}%
                </div>
              </div>

              {/* Variant Comparison */}
              <div className="space-y-4">
                {experiment.variants.map((variant) => {
                  const isWinner =
                    variant.conversionRate ===
                    Math.max(...experiment.variants.map(v => v.conversionRate));

                  return (
                    <div
                      key={variant.variantId}
                      className={`border rounded-lg p-4 ${
                        isWinner ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {variant.variantName}
                            {isWinner && (
                              <span className="ml-2 text-green-600 text-sm">👑 Winner</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {variant.assignments} users · {variant.goals} conversions
                          </div>
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            isWinner ? 'text-green-600' : 'text-gray-600'
                          }`}
                        >
                          {variant.conversionRate}%
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            isWinner ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{
                            width: `${(variant.assignments / experiment.totalAssignments) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round((variant.assignments / experiment.totalAssignments) * 100)}%
                        of traffic
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Statistical Significance Indicator */}
              {experiment.totalAssignments >= 100 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {experiment.totalAssignments >= 100 ? (
                      <span className="text-green-600 font-medium">
                        ✓ Sufficient data for decision ({experiment.totalAssignments} users)
                      </span>
                    ) : (
                      <span className="text-orange-600 font-medium">
                        ⚠ Need more data ({experiment.totalAssignments}/100 users)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
