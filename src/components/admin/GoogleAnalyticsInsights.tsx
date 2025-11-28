/**
 * Google Analytics 4 Insights Component
 * 
 * Displays GA4 demographics and geographic insights in admin dashboard
 * Complements custom analytics with user demographics and location data
 */

'use client'

import { useState, useEffect } from 'react'

interface DemographicsData {
  ageGroups: { label: string; percentage: number; count: number }[]
  gender: { label: string; percentage: number; count: number }[]
  interests: { category: string; percentage: number; count: number }[]
  totalUsers: number
}

interface GeographicData {
  countries: { country: string; countryCode: string; users: number; sessions: number }[]
  cities: { city: string; country: string; countryCode: string; sessions: number }[]
  totalCountries: number
  totalCities: number
}

interface GoogleAnalyticsInsightsProps {
  className?: string
}

export default function GoogleAnalyticsInsights({ className = '' }: GoogleAnalyticsInsightsProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demographics, setDemographics] = useState<DemographicsData | null>(null)
  const [geographic, setGeographic] = useState<GeographicData | null>(null)

  useEffect(() => {
    fetchGA4Data()
  }, [])

  const fetchGA4Data = async () => {
    try {
      setLoading(true)
      
      // Fetch both demographics and geographic data in parallel
      const [demographicsRes, geoRes] = await Promise.all([
        fetch('/api/admin/analytics/ga4-demographics'),
        fetch('/api/admin/google-analytics/geo?range=30d')
      ])
      
      // Handle demographics
      if (demographicsRes.ok) {
        const demographicsData = await demographicsRes.json()
        setDemographics(demographicsData.demographics)
      }
      
      // Handle geographic data
      if (geoRes.ok) {
        const geoData = await geoRes.json()
        if (geoData.success && geoData.data) {
          setGeographic(geoData.data)
        }
      }
      
      setError(null)
    } catch (err) {
      console.error('Error fetching GA4 data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Lädt Google Analytics Daten...</div>
        </div>
      </div>
    )
  }

  if (error || (!demographics && !geographic)) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📊 Google Analytics 4 Einblicke
          </h3>
          <p className="text-gray-600 mb-4">
            {error || 'Keine Daten verfügbar'}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Setup erforderlich:</strong>
            </p>
            <ol className="text-left text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Google Analytics 4 Property erstellen</li>
              <li>Measurement ID in .env.local eintragen</li>
              <li>Cookie-Banner: Analytics-Cookies akzeptieren</li>
              <li>24-48 Stunden warten für erste Daten</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Geographic Data */}
      {geographic && geographic.countries.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  🌍 Standorte der Besucher
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Geografische Verteilung aus Google Analytics (letzte 30 Tage)
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {geographic.totalCountries}
                </div>
                <div className="text-sm text-gray-600">Länder</div>
              </div>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            {/* Top Countries */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">🗺️</span>
                Top Länder
              </h4>
              <div className="space-y-3">
                {geographic.countries.slice(0, 10).map((country, index) => {
                  const maxSessions = geographic.countries[0]?.sessions || 1
                  const percentage = (country.sessions / maxSessions) * 100
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 flex items-center gap-2">
                          <span className="text-lg">{country.countryCode ? `🌐` : '📍'}</span>
                          {country.country}
                        </span>
                        <span className="font-medium text-gray-900">
                          {country.sessions} Sitzungen
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {country.users.toLocaleString('de-DE')} Nutzer
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top Cities */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">🏙️</span>
                Top Städte
              </h4>
              <div className="space-y-3">
                {geographic.cities.slice(0, 10).map((city, index) => {
                  const maxSessions = geographic.cities[0]?.sessions || 1
                  const percentage = (city.sessions / maxSessions) * 100
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {city.city}, {city.country}
                        </span>
                        <span className="font-medium text-gray-900">
                          {city.sessions}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Geographic Info Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-600">ℹ️</span>
              <p>
                <strong>Hinweis:</strong> Geografische Daten basieren auf IP-Adressen und werden 
                von Google Analytics automatisch anonymisiert. Zeigt die letzten 30 Tage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Demographics Data */}
      {demographics && (
      {/* Demographics Data */}
      {demographics && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  📊 Demografiedaten
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ergänzende Einblicke zu Alter, Geschlecht und Interessen
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {demographics.totalUsers.toLocaleString('de-DE')}
                </div>
                <div className="text-sm text-gray-600">Nutzer (GA4)</div>
              </div>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-3 gap-6">
            {/* Age Groups */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">👥</span>
                Altersgruppen
              </h4>
              <div className="space-y-3">
                {demographics.ageGroups.map((group, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{group.label}</span>
                      <span className="font-medium text-gray-900">{group.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${group.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {group.count.toLocaleString('de-DE')} Nutzer
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">⚥</span>
                Geschlecht
              </h4>
              <div className="space-y-3">
                {demographics.gender.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="font-medium text-gray-900">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.count.toLocaleString('de-DE')} Nutzer
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">💡</span>
                Top Interessen
              </h4>
              <div className="space-y-3">
                {demographics.interests.slice(0, 5).map((interest, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 truncate mr-2">
                        {interest.category}
                      </span>
                      <span className="font-medium text-gray-900 whitespace-nowrap">
                        {interest.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${interest.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {interest.count.toLocaleString('de-DE')} Nutzer
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demographics Info Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-600">ℹ️</span>
              <p>
                <strong>Hinweis:</strong> Diese Daten werden von Google Analytics inferiert und 
                ergänzen unsere eigenen detaillierten Nutzer-Tracking-Daten. Für vollständige 
                Sitzungsdetails siehe die Benutzer-Tracking-Tabelle unten.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

