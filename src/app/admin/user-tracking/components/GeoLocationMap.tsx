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
        /* Map View - Interactive SVG World Map */
        <div className="relative">
          {/* SVG World Map */}
          <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-4 overflow-hidden">
            <svg 
              viewBox="0 0 1000 500" 
              className="w-full h-auto"
              style={{ minHeight: '400px' }}
            >
              {/* Simple world map outline */}
              <defs>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>
              </defs>
              
              {/* Ocean background */}
              <rect width="1000" height="500" fill="url(#oceanGradient)" />
              
              {/* Grid lines for reference */}
              {[...Array(10)].map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 100}
                  y1="0"
                  x2={i * 100}
                  y2="500"
                  stroke="#cbd5e1"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
              {[...Array(5)].map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={i * 100}
                  x2="1000"
                  y2={i * 100}
                  stroke="#cbd5e1"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
              
              {/* World Map - Equirectangular Projection with Realistic Continents */}
              
              {/* North America - Recognizable shape with Canada, USA, Mexico */}
              <path
                d="M 120 60 L 140 55 L 165 60 L 185 70 L 195 85 L 200 100 L 205 120 L 210 140 L 215 155 L 218 170 L 220 185 L 218 200 L 210 215 L 195 225 L 180 230 L 165 232 L 155 228 L 148 220 L 145 210 L 143 195 L 140 180 L 135 170 L 125 165 L 115 160 L 105 150 L 98 135 L 95 120 L 95 105 L 98 90 L 105 75 L 112 65 L 120 60 Z M 80 90 Q 85 85 95 85 L 105 88 Q 110 95 108 105 L 100 115 Q 92 118 85 115 L 80 108 Q 77 100 80 90 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Greenland - Large northern island */}
              <path
                d="M 280 35 L 300 30 L 320 32 L 335 40 L 345 52 L 348 68 L 345 82 L 335 92 L 320 98 L 305 100 L 290 97 L 278 88 L 272 75 L 270 60 L 273 45 L 280 35 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* South America - Distinctive triangular shape */}
              <path
                d="M 220 220 L 235 218 L 248 220 L 258 228 L 265 240 L 270 255 L 273 275 L 275 295 L 275 315 L 273 335 L 268 355 L 260 372 L 248 385 L 235 393 L 220 398 L 208 398 L 198 393 L 190 385 L 185 372 L 182 355 L 180 335 L 180 315 L 182 295 L 186 275 L 192 255 L 200 238 L 210 225 L 220 220 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Europe - Including Scandinavia and Mediterranean */}
              <path
                d="M 460 85 L 475 82 L 488 85 L 500 92 L 510 102 L 518 115 L 524 128 L 528 142 L 528 155 L 524 165 L 515 172 L 502 176 L 488 178 L 475 177 L 463 173 L 453 165 L 448 155 L 445 143 L 445 130 L 448 117 L 452 105 L 458 93 L 460 85 Z M 485 65 L 495 60 L 505 62 L 512 70 L 515 82 L 512 92 L 505 98 L 495 100 L 485 97 L 478 88 L 475 78 L 478 70 L 485 65 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Africa - Distinctive shape with bulge and southern taper */}
              <path
                d="M 475 165 L 495 168 L 512 175 L 525 188 L 535 205 L 542 225 L 546 245 L 548 268 L 548 290 L 546 312 L 540 335 L 530 355 L 515 370 L 495 380 L 475 383 L 458 380 L 443 372 L 432 360 L 425 345 L 422 328 L 420 310 L 420 290 L 422 270 L 427 248 L 435 228 L 445 210 L 457 192 L 468 178 L 475 165 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Asia - Massive landmass from Urals to Pacific */}
              <path
                d="M 530 75 L 555 70 L 580 68 L 608 70 L 638 75 L 668 85 L 695 98 L 718 115 L 735 135 L 748 158 L 755 180 L 758 202 L 755 220 L 745 235 L 728 245 L 708 250 L 685 252 L 660 250 L 635 245 L 612 235 L 590 222 L 572 205 L 558 185 L 548 162 L 543 138 L 542 115 L 545 95 L 530 75 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Middle East / Arabian Peninsula */}
              <path
                d="M 530 165 L 548 170 L 562 180 L 570 195 L 572 212 L 568 228 L 558 240 L 545 246 L 532 245 L 522 238 L 517 225 L 517 210 L 522 195 L 528 180 L 530 165 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* India - Triangular subcontinent */}
              <path
                d="M 590 195 L 608 200 L 622 210 L 630 225 L 633 242 L 632 260 L 625 278 L 612 290 L 595 295 L 580 293 L 570 283 L 565 268 L 565 250 L 570 232 L 578 215 L 587 203 L 590 195 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Southeast Asia - Peninsula and islands */}
              <path
                d="M 665 230 L 682 235 L 695 245 L 702 260 L 705 278 L 702 292 L 692 302 L 678 307 L 663 307 L 652 300 L 647 288 L 647 273 L 652 258 L 660 243 L 665 230 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Australia - Distinctive horizontal oval shape */}
              <path
                d="M 720 295 L 745 292 L 770 295 L 792 305 L 810 320 L 820 338 L 823 358 L 818 375 L 805 387 L 785 393 L 762 395 L 740 392 L 722 383 L 710 368 L 705 350 L 705 332 L 710 315 L 718 302 L 720 295 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* New Zealand - Two elongated islands */}
              <path
                d="M 850 365 L 863 368 Q 870 375 868 385 L 860 395 Q 852 398 845 395 L 840 387 Q 838 378 842 370 L 850 365 Z M 852 405 L 862 408 Q 868 415 866 425 L 858 433 Q 851 436 845 432 L 841 425 Q 840 417 844 410 L 852 405 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Japan - Curved archipelago */}
              <path
                d="M 800 135 L 812 140 Q 818 148 817 158 L 812 170 Q 805 175 797 172 L 792 164 Q 790 155 793 147 L 800 135 Z M 808 178 L 818 182 Q 823 190 821 200 L 815 210 Q 808 214 801 210 L 797 202 Q 796 193 800 185 L 808 178 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* UK & Ireland */}
              <path
                d="M 445 95 L 455 98 Q 460 105 458 113 L 452 120 Q 446 122 440 119 L 437 112 Q 436 105 440 99 L 445 95 Z M 458 100 L 466 103 Q 470 109 468 117 L 463 123 Q 458 125 453 122 L 450 116 Q 449 110 452 105 L 458 100 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Madagascar */}
              <path
                d="M 555 305 L 565 308 Q 570 316 568 326 L 564 342 Q 558 350 550 351 L 545 346 Q 542 338 544 328 L 548 315 Q 552 308 555 305 Z"
                fill="#10b981"
                opacity="0.6"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Location markers */}
              {data.topCities.map((city, index) => {
                // Convert lat/lng to SVG coordinates (rough approximation)
                // Longitude: -180 to 180 → 0 to 1000
                // Latitude: 90 to -90 → 0 to 500
                const x = ((city.lng + 180) / 360) * 1000;
                const y = ((90 - city.lat) / 180) * 500;
                
                // Scale marker size based on count
                const maxCount = Math.max(...data.topCities.map(c => c.count));
                const minRadius = 4;
                const maxRadius = 20;
                const radius = minRadius + (city.count / maxCount) * (maxRadius - minRadius);
                
                return (
                  <g key={`${city.city}-${index}`}>
                    {/* Glow effect */}
                    <circle
                      cx={x}
                      cy={y}
                      r={radius + 4}
                      fill="#ef4444"
                      opacity="0.2"
                    />
                    {/* Main marker */}
                    <circle
                      cx={x}
                      cy={y}
                      r={radius}
                      fill="#dc2626"
                      stroke="#fff"
                      strokeWidth="2"
                      opacity="0.8"
                      className="cursor-pointer hover:opacity-100 transition-opacity"
                    >
                      <title>{city.city}, {city.country}: {city.count} sessions</title>
                    </circle>
                    {/* City label for larger markers */}
                    {city.count > maxCount * 0.3 && (
                      <text
                        x={x}
                        y={y - radius - 5}
                        fontSize="10"
                        fill="#1f2937"
                        fontWeight="600"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {city.city}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-gray-600">User Locations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full opacity-50"></div>
              <span className="text-gray-500">Fewer Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-600 rounded-full opacity-80"></div>
              <span className="text-gray-500">More Sessions</span>
            </div>
          </div>
          
          {/* Interactive City List Below Map */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.topCities.slice(0, 12).map((city, index) => (
              <div 
                key={`${city.city}-${index}`}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {city.city}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getCountryFlag(city.country)} {city.country}
                    </p>
                  </div>
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    {city.count}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°
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

