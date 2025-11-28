'use client'

import { useState, useEffect } from 'react'

interface TrafficSource {
  source: string
  medium: string
  sessions: number
  users: number
}

export default function InquiryAnalytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sources, setSources] = useState<TrafficSource[]>([])

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await fetch('/api/admin/google-analytics/traffic-sources?range=30d')
        const data = await res.json()
        
        if (res.ok && data.success) {
          if (data.data) {
            setSources(data.data)
          }
        } else {
          // Handle API errors
          if (data.error) {
            setError(data.error)
          } else {
            setError('Failed to load traffic sources')
          }
        }
      } catch (error) {
        console.error('Failed to fetch traffic sources:', error)
        setError('Connection error')
      } finally {
        setLoading(false)
      }
    }

    fetchSources()
  }, [])

  if (loading) return <div className="animate-pulse h-24 bg-gray-100 rounded-lg mb-6"></div>

  // If there's an error or no data, we might want to show a placeholder or just return null
  // For admin dashboards, it's often better to show "No Data" than nothing
  if (error) {
    // If it's a configuration error, show a hint (simplified version of GoogleAnalyticsInsights)
    if (error.includes('configured')) {
       return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <h3 className="font-medium text-blue-900">Google Analytics Setup Required</h3>
              <p className="text-sm text-blue-800 mt-1">
                To see traffic sources, please configure Google Analytics 4 credentials in your environment variables.
              </p>
            </div>
          </div>
        </div>
      )
    }
    return null // Hide on other errors to avoid clutter
  }

  if (sources.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🚦 Traffic Sources
        </h3>
        <p className="text-gray-500 text-sm">No traffic data recorded in the last 30 days.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🚦 Traffic Sources (Last 30 Days)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.slice(0, 6).map((source, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{source.source}</div>
              <div className="text-xs text-gray-500">{source.medium}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-600">{source.sessions}</div>
              <div className="text-xs text-gray-500">Sessions</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
