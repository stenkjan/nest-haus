/**
 * Geographic Location Map Component
 * 
 * Interactive world map showing visitor locations using react-svg-worldmap
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import WorldMap from "react-svg-worldmap";

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
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  // Prepare data for react-svg-worldmap
  const mapData = data.byCountry.map(country => ({
    country: country.code.toLowerCase(), // Library expects lowercase country codes
    value: country.count
  }));

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
        /* Map View - Using react-svg-worldmap with location dots */
        <div className="relative">
          {/* World Map Container - Centered with max width */}
          <div className="bg-gradient-to-b from-sky-50 to-sky-100 rounded-lg p-8">
            <div className="w-full mx-auto relative" style={{ maxWidth: '1200px' }}>
              {/* World Map SVG */}
              <div className="relative" ref={mapContainerRef}>
                <WorldMap
                  color="#10b981"
                  title=""
                  value-suffix=" sessions"
                  size="responsive"
                  data={mapData}
                  richInteraction
                  tooltipBgColor="#1f2937"
                  tooltipTextColor="#ffffff"
                  styleFunction={(context) => {
                    const opacityLevel = context.countryValue 
                      ? 0.2 + (0.7 * (context.countryValue - context.minValue) / (context.maxValue - context.minValue))
                      : 0.15;
                    
                    return {
                      fill: context.color,
                      fillOpacity: opacityLevel,
                      stroke: "#059669",
                      strokeWidth: 0.5,
                      strokeOpacity: 0.6,
                      cursor: "pointer",
                    };
                  }}
                />
                
                {/* Location Dots Overlay - Matches react-svg-worldmap coordinate system */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 1104 513"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ top: 0, left: 0 }}
                >
                  {/* Apply the same transform as react-svg-worldmap applies to its <g> element */}
                  <g transform="translate(0, 0) scale(0.7125) translate(0, 240)">
                    {data.topCities.map((city, index) => {
                      // Map coordinates using the original viewBox dimensions (before transform)
                      // react-svg-worldmap uses 960x500 internally, then scales and translates it
                      
                      // X: Longitude mapping (-180° to +180° → 0 to 960)
                      const x = ((city.lng + 180) / 360) * 960;
                      
                      // Y: Mercator projection for latitude
                      const toRadians = (deg: number) => (deg * Math.PI) / 180;
                      const latRad = toRadians(Math.max(-85, Math.min(85, city.lat)));
                      
                      // Mercator Y calculation
                      const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
                      
                      // Map to 0-500 range (react-svg-worldmap's internal height)
                      const y = (1 - (mercatorY / Math.PI + 1) / 2) * 500;
                      
                      // Scale dot size based on session count
                      const maxCount = Math.max(...data.topCities.map(c => c.count));
                      const minRadius = 4;
                      const maxRadius = 18;
                      const radius = minRadius + (city.count / maxCount) * (maxRadius - minRadius);
                      
                      // Only show labels for top 3 cities
                      const showLabel = index < 3;
                      
                      return (
                        <g 
                          key={`${city.city}-${index}`}
                          className="pointer-events-auto cursor-pointer hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedCountry(city.country)}
                        >
                          {/* Glow effect */}
                          <circle
                            cx={x}
                            cy={y}
                            r={radius + 4}
                            fill="#ef4444"
                            opacity="0.2"
                            className="animate-pulse"
                          />
                          {/* Outer ring */}
                          <circle
                            cx={x}
                            cy={y}
                            r={radius + 1}
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="1.5"
                            opacity="0.5"
                          />
                          {/* Main dot */}
                          <circle
                            cx={x}
                            cy={y}
                            r={radius}
                            fill="#dc2626"
                            stroke="#ffffff"
                            strokeWidth="2"
                            opacity="0.9"
                          >
                            <title>{city.city}, {city.country}: {city.count} sessions</title>
                          </circle>
                          {/* City label for top cities */}
                          {showLabel && (
                            <text
                              x={x}
                              y={y - radius - 10}
                              fontSize="12"
                              fontWeight="600"
                              fill="#1f2937"
                              textAnchor="middle"
                              className="pointer-events-none select-none"
                              style={{ 
                                textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white'
                              }}
                            >
                              {city.city}
                            </text>
                          )}
                          {/* Session count badge for larger dots */}
                          {radius > 10 && (
                            <text
                              x={x}
                              y={y + 1}
                              fontSize="10"
                              fontWeight="700"
                              fill="#ffffff"
                              textAnchor="middle"
                              className="pointer-events-none select-none"
                            >
                              {city.count}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full opacity-70"></div>
                  <span className="text-gray-600">Few Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded-full opacity-90"></div>
                  <span className="text-gray-600">Many Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 opacity-50 rounded"></div>
                  <span className="text-gray-600">Country Activity</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interactive City Details Cards */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">
                Top Cities by Sessions
              </h4>
              <span className="text-xs text-gray-500">
                Click on map dots for details
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {data.topCities.slice(0, 12).map((city, index) => {
                const isSelected = selectedCountry === city.country;
                const maxCount = Math.max(...data.topCities.map(c => c.count));
                const isTopCity = index < 3;
                
                return (
                  <div 
                    key={`${city.city}-${index}`}
                    className={`
                      relative bg-white border-2 rounded-lg p-3 
                      transition-all cursor-pointer
                      ${isSelected 
                        ? 'border-red-500 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }
                      ${isTopCity ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
                    `}
                    onClick={() => setSelectedCountry(
                      selectedCountry === city.country ? null : city.country
                    )}
                  >
                    {isTopCity && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 shadow">
                        {index + 1}
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {city.city}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {getCountryFlag(city.country)} {city.country}
                        </p>
                      </div>
                      <div className="ml-2 flex flex-col items-end">
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                          {city.count}
                        </span>
                        {/* Visual indicator of relative size */}
                        <div className="mt-1 flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-2 rounded-sm ${
                                i < Math.ceil((city.count / maxCount) * 5)
                                  ? 'bg-red-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Selected Country Details */}
          {selectedCountry && citiesForCountry.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  {getCountryFlag(selectedCountry)} All Cities in {data.byCountry.find(c => c.code === selectedCountry)?.name}
                </h4>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  ✕ Close
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {citiesForCountry.map((city, index) => (
                  <div 
                    key={`${city.city}-${index}`}
                    className="flex items-center justify-between p-2 bg-white rounded text-sm border border-blue-200"
                  >
                    <span className="text-gray-700 font-medium">{city.city}</span>
                    <span className="text-blue-700 font-bold">
                      {city.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
