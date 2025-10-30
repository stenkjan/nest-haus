'use client';

import { useState } from 'react';

interface SelectionData {
  value: string;
  name: string;
  count: number;
  percentageOfCategory: number;
  percentageOfTotal: number;
  quantity?: number;
}

interface QuantityAnalytics {
  geschossdecke: {
    totalWithOption: number;
    averageQuantity: number;
    quantityDistribution: Array<{ quantity: number; count: number }>;
  };
  pvanlage: {
    totalWithOption: number;
    averageQuantity: number;
    quantityDistribution: Array<{ quantity: number; count: number }>;
  };
}

interface ConfigurationSelectionAnalyticsProps {
  analytics: {
    [category: string]: SelectionData[];
  };
  quantityAnalytics: QuantityAnalytics;
  totalConfigurations: number;
}

// Category order matching configurator
const CATEGORY_ORDER = [
  'nest',
  'gebaeudehuelle',
  'innenverkleidung',
  'fussboden',
  'belichtungspaket',
  'fenster',
  'pvanlage',
  'stirnseite',
  'planungspaket',
  'bodenaufbau',
  'geschossdecke',
  'kamindurchzug',
  'fussbodenheizung',
  'fundament'
];

// Category display names
const CATEGORY_NAMES: Record<string, string> = {
  nest: 'Nest',
  gebaeudehuelle: 'Gebäudehülle',
  innenverkleidung: 'Innenverkleidung',
  fussboden: 'Bodenbelag',
  belichtungspaket: 'Belichtungspaket',
  fenster: 'Fenster & Türen',
  pvanlage: 'PV-Anlage',
  stirnseite: 'Stirnseite',
  planungspaket: 'Planungspaket',
  bodenaufbau: 'Bodenaufbau',
  geschossdecke: 'Geschossdecke',
  kamindurchzug: 'Kamin-Durchzug',
  fussbodenheizung: 'Fußbodenheizung',
  fundament: 'Fundament'
};

// Optional categories (show how often they've been added)
const OPTIONAL_CATEGORIES = ['geschossdecke', 'pvanlage', 'kamindurchzug', 'stirnseite', 'fussbodenheizung', 'fundament'];

export default function ConfigurationSelectionAnalytics({
  analytics,
  quantityAnalytics,
  totalConfigurations
}: ConfigurationSelectionAnalyticsProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const renderCategoryBox = (category: string) => {
    const selections = analytics[category] || [];
    const mostSelected = selections[0];
    const isExpanded = expandedCategory === category;
    const isOptional = OPTIONAL_CATEGORIES.includes(category);
    const hasQuantity = category === 'geschossdecke' || category === 'pvanlage';

    if (!mostSelected && !isOptional) return null;

    // For optional categories, calculate how many have been selected
    const totalWithCategory = isOptional
      ? selections.reduce((sum, s) => sum + s.count, 0)
      : totalConfigurations;

    const categoryPercentage = isOptional
      ? (totalWithCategory / totalConfigurations) * 100
      : 100;

    return (
      <div key={category} className="bg-white rounded-lg shadow p-6">
        <div
          className="cursor-pointer"
          onClick={() => toggleCategory(category)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {CATEGORY_NAMES[category] || category}
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-xl">
              {isExpanded ? '▼' : '▶'}
            </button>
          </div>

          {mostSelected ? (
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {mostSelected.name}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Selected {mostSelected.count} times ({mostSelected.percentageOfCategory.toFixed(1)}% of category)
              </div>
              {isOptional && (
                <div className="text-xs text-gray-500 mb-2">
                  {totalWithCategory} of {totalConfigurations} configurations ({categoryPercentage.toFixed(1)}%)
                </div>
              )}
            </div>
          ) : (
            <div>
              {isOptional && totalWithCategory === 0 && (
                <div className="text-sm text-gray-600">
                  Not selected in any configuration
                </div>
              )}
            </div>
          )}
          
          {/* Quantity info for geschossdecke and pvanlage */}
          {hasQuantity && quantityAnalytics[category as 'geschossdecke' | 'pvanlage'] && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                <div className="font-medium">Quantity Statistics:</div>
                <div className="mt-1 text-xs text-gray-600">
                  Average: {quantityAnalytics[category as 'geschossdecke' | 'pvanlage'].averageQuantity.toFixed(1)} units
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Total with option: {quantityAnalytics[category as 'geschossdecke' | 'pvanlage'].totalWithOption} configurations
                </div>
              </div>
            </div>
          )}
        </div>

        {isExpanded && selections.length > 0 && (
          <div className="mt-6 space-y-3 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3">All Options:</h4>
            <div className="space-y-2">
              {selections.map((selection, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{selection.name}</div>
                    {selection.quantity !== undefined && (
                      <div className="text-xs text-gray-500 mt-1">
                        Avg. Quantity: {selection.quantity.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-bold text-blue-600">{selection.count}</div>
                    <div className="text-xs text-gray-500">
                      {selection.percentageOfCategory.toFixed(1)}% of category
                    </div>
                    <div className="text-xs text-gray-500">
                      {selection.percentageOfTotal.toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quantity distribution for geschossdecke and pvanlage */}
            {hasQuantity && 
             quantityAnalytics[category as 'geschossdecke' | 'pvanlage']?.quantityDistribution &&
             quantityAnalytics[category as 'geschossdecke' | 'pvanlage'].quantityDistribution.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-800 mb-3 text-sm">Quantity Distribution:</h5>
                <div className="space-y-2">
                  {quantityAnalytics[category as 'geschossdecke' | 'pvanlage'].quantityDistribution.map((dist, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <div className="text-sm text-gray-700">{dist.quantity} units</div>
                      <div className="text-sm font-bold text-blue-600">{dist.count} configurations</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Configuration Selection Analytics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORY_ORDER.map(category => renderCategoryBox(category))}
      </div>
    </div>
  );
}

