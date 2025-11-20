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
              
              {/* World Map - Realistic Continents using simplified Natural Earth data */}
              
              {/* North America */}
              <path
                d="M 140 80 Q 160 70 180 75 L 200 85 Q 210 95 215 110 L 220 130 L 225 145 Q 220 160 210 170 L 190 180 Q 170 185 150 180 L 130 170 Q 120 160 115 145 L 110 125 Q 115 105 125 95 L 140 80 Z M 90 115 Q 95 110 100 108 L 110 110 Q 115 115 113 122 L 108 130 Q 103 133 98 132 L 92 128 Q 88 123 90 115 Z M 160 150 L 175 155 Q 180 160 178 168 L 170 175 Q 165 178 158 176 L 152 170 Q 148 165 150 158 L 160 150 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Greenland */}
              <path
                d="M 290 50 Q 310 45 325 50 L 335 60 Q 340 70 338 80 L 330 95 Q 320 100 310 98 L 295 90 Q 285 80 285 68 L 290 50 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* South America */}
              <path
                d="M 210 235 L 225 240 Q 235 245 240 255 L 245 275 Q 248 295 247 310 L 245 335 Q 242 355 235 370 L 225 385 Q 215 395 205 398 L 190 395 Q 180 388 175 375 L 172 355 Q 170 335 172 315 L 177 290 Q 183 270 192 255 L 205 240 L 210 235 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Europe */}
              <path
                d="M 475 100 L 485 95 Q 495 93 505 95 L 520 100 Q 530 105 538 115 L 545 128 Q 548 138 546 147 L 540 158 Q 532 165 522 167 L 505 168 Q 490 165 480 158 L 470 148 Q 465 138 465 128 L 468 115 L 475 100 Z M 490 140 L 498 145 Q 502 150 500 156 L 494 160 Q 488 162 483 159 L 478 153 Q 476 148 478 143 L 490 140 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Africa */}
              <path
                d="M 490 175 L 505 180 Q 515 185 522 195 L 530 215 Q 535 235 537 255 L 538 280 Q 537 300 532 318 L 522 340 Q 510 355 495 362 L 475 365 Q 460 363 448 355 L 440 342 Q 435 325 435 305 L 438 280 Q 442 260 448 242 L 458 220 Q 468 200 478 188 L 490 175 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Asia */}
              <path
                d="M 550 85 Q 570 78 590 75 L 615 78 Q 640 83 665 92 L 690 105 Q 710 118 725 135 L 738 155 Q 748 172 752 188 L 753 205 Q 750 218 742 228 L 725 238 Q 705 243 685 242 L 660 238 Q 635 232 615 222 L 590 208 Q 570 193 558 175 L 548 155 Q 543 135 545 118 L 550 100 L 550 85 Z M 555 120 Q 560 125 565 128 L 575 135 Q 582 140 585 148 L 588 158 Q 588 168 583 175 L 573 182 Q 563 185 555 183 L 548 178 Q 543 172 542 163 L 543 150 Q 547 138 555 130 L 555 120 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Middle East / Arabian Peninsula */}
              <path
                d="M 540 180 L 555 185 Q 565 192 570 202 L 573 218 Q 572 230 566 240 L 556 248 Q 545 252 535 250 L 525 243 Q 518 233 517 220 L 520 205 Q 525 193 533 186 L 540 180 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* India */}
              <path
                d="M 600 210 L 615 215 Q 625 222 630 233 L 633 248 Q 632 263 625 275 L 613 285 Q 600 290 588 287 L 578 280 Q 572 270 572 257 L 575 242 Q 580 228 590 218 L 600 210 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Southeast Asia */}
              <path
                d="M 680 245 L 695 250 Q 705 257 710 268 L 712 282 Q 710 293 702 300 L 688 305 Q 675 305 665 298 L 658 288 Q 655 277 658 267 L 668 255 L 680 245 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Australia */}
              <path
                d="M 735 310 L 755 308 Q 775 310 792 317 L 808 328 Q 820 340 825 355 L 827 372 Q 823 385 813 393 L 795 398 Q 775 398 758 393 L 740 383 Q 728 370 725 355 L 726 338 Q 730 323 735 310 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* New Zealand */}
              <path
                d="M 860 380 L 870 382 Q 875 388 873 395 L 868 402 Q 862 405 856 403 L 852 398 Q 850 392 852 387 L 860 380 Z M 862 410 L 868 412 Q 872 417 870 423 L 865 428 Q 860 430 856 427 L 853 422 Q 852 417 854 413 L 862 410 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Japan */}
              <path
                d="M 810 145 L 820 148 Q 825 153 825 160 L 823 170 Q 818 176 811 177 L 804 174 Q 800 169 800 162 L 802 153 Q 806 148 810 145 Z M 815 180 L 822 183 Q 826 188 825 195 L 820 202 Q 815 205 809 203 L 805 198 Q 803 193 805 188 L 815 180 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* UK & Ireland */}
              <path
                d="M 455 108 L 462 110 Q 466 115 465 121 L 461 127 Q 456 130 451 128 L 447 123 Q 445 118 447 113 L 455 108 Z M 465 115 L 471 117 Q 475 121 474 127 L 470 132 Q 466 134 462 132 L 459 128 Q 458 124 460 120 L 465 115 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Scandinavia */}
              <path
                d="M 495 70 L 503 68 Q 510 70 515 77 L 518 88 Q 517 98 512 105 L 503 110 Q 495 111 489 107 L 485 99 Q 483 90 485 82 L 490 73 L 495 70 Z"
                fill="#10b981"
                opacity="0.7"
                stroke="#059669"
                strokeWidth="0.5"
              />
              
              {/* Madagascar */}
              <path
                d="M 565 320 L 572 322 Q 576 328 575 335 L 572 347 Q 568 353 562 354 L 557 351 Q 554 346 555 339 L 558 328 Q 561 323 565 320 Z"
                fill="#10b981"
                opacity="0.7"
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

