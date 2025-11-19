/**
 * Geographic Location Map Component
 * 
 * Interactive world map showing visitor locations
 * With drill-down to city-level detail
 */

'use client';

import { useEffect, useState } from 'react';

interface GeoData {
  byCountry: Array<{
    code: string;
    name: string;
    count: number;
    percentage: number;
  }>;
  topCities: Array<{
    city: string;
    country: string;
    count: number;
    lat: number;
    lng: number;
  }>;
  totalSessions: number;
  countriesCount: number;
  citiesCount: number;
}

export default function GeoLocationMap() {
  const [data, setData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

  useEffect(() => {
    fetchGeoData();
  }, []);

  async function fetchGeoData() {
    try {
      const response = await fetch('/api/admin/analytics/geo-locations');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch geo data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!data || data.byCountry.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Locations
        </h3>
        <p className="text-gray-500">No geographic data available yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Location data will be collected as users visit your site
        </p>
      </div>
    );
  }

  const citiesForCountry = selectedCountry
    ? data.topCities.filter(city => city.country === selectedCountry)
    : [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            User Locations
          </h3>
          <p className="text-sm text-gray-500">
            {data.countriesCount} countries • {data.citiesCount} cities
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {/* Top Countries List */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Top Countries
            </h4>
            <div className="space-y-2">
              {data.byCountry.slice(0, 10).map((country) => (
                <div 
                  key={country.code}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => setSelectedCountry(
                    selectedCountry === country.code ? null : country.code
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getCountryFlag(country.code)}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {country.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {country.code}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {country.count.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {country.percentage}%
                      </p>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                    
                    <span className="text-gray-400">
                      {selectedCountry === country.code ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cities drill-down */}
          {selectedCountry && citiesForCountry.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Cities in {data.byCountry.find(c => c.code === selectedCountry)?.name}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {citiesForCountry.map((city, index) => (
                  <div 
                    key={`${city.city}-${index}`}
                    className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm"
                  >
                    <span className="text-gray-700">{city.city}</span>
                    <span className="font-medium text-gray-900">
                      {city.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Map View - Placeholder for now */
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">
            🗺️ Interactive Map View
          </p>
          <p className="text-sm text-gray-500 mb-6">
            World map visualization coming soon
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {data.byCountry.slice(0, 6).map((country) => (
              <div 
                key={country.code}
                className="bg-white rounded p-3 text-center shadow-sm"
              >
                <div className="text-3xl mb-1">
                  {getCountryFlag(country.code)}
                </div>
                <p className="text-xs font-medium text-gray-700">
                  {country.code}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {country.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {data.totalSessions.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Total Sessions</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {data.countriesCount}
          </p>
          <p className="text-xs text-gray-500">Countries</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {data.citiesCount}
          </p>
          <p className="text-xs text-gray-500">Cities</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Get emoji flag for country code
 */
function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    'DE': '🇩🇪',
    'AT': '🇦🇹',
    'CH': '🇨🇭',
    'FR': '🇫🇷',
    'IT': '🇮🇹',
    'NL': '🇳🇱',
    'BE': '🇧🇪',
    'PL': '🇵🇱',
    'CZ': '🇨🇿',
    'SK': '🇸🇰',
    'HU': '🇭🇺',
    'SI': '🇸🇮',
    'HR': '🇭🇷',
    'LU': '🇱🇺',
    'LI': '🇱🇮',
    'US': '🇺🇸',
    'GB': '🇬🇧',
    'ES': '🇪🇸',
    'PT': '🇵🇹',
    'DK': '🇩🇰',
    'SE': '🇸🇪',
    'NO': '🇳🇴',
    'FI': '🇫🇮',
    'IE': '🇮🇪'
  };

  return flags[code] || '🌍';
}

