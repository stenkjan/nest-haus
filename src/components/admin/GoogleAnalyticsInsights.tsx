/**
 * Google Analytics 4 Insights Component
 * 
 * Displays GA4 demographics and marketing insights in admin dashboard
 * Complements custom analytics with user demographics data
 */

'use client'

import { useState, useEffect } from 'react'

interface DemographicsData {
  ageGroups: { label: string; percentage: number; count: number }[]
  gender: { label: string; percentage: number; count: number }[]
  interests: { category: string; percentage: number; count: number }[]
  totalUsers: number
}

interface GoogleAnalyticsInsightsProps {
  className?: string
}

export default function GoogleAnalyticsInsights({ className = '' }: GoogleAnalyticsInsightsProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demographics, setDemographics] = useState<DemographicsData | null>(null)

  useEffect(() => {
    fetchGA4Demographics()
  }, [])

  const fetchGA4Demographics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/analytics/ga4-demographics')
      
      if (!response.ok) {
        throw new Error('Failed to fetch GA4 demographics')
      }

      const data = await response.json()
      setDemographics(data.demographics)
      setError(null)
    } catch (err) {
      console.error('Error fetching GA4 demographics:', err)
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

  if (error || !demographics) {
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
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📊 Google Analytics 4 Demografiedaten
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

      {/* Info Footer */}
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
  )
}

