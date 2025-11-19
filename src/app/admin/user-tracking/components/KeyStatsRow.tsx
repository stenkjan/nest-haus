/**
 * Key Stats Row Component
 * 
 * Wix-style dashboard metrics:
 * - Site Sessions
 * - Unique Visitors
 * - Clicks to Contact (Appointment Requests)
 * - Konzeptcheck Payments
 */

'use client';

import { useEffect, useState } from 'react';

interface KeyStats {
  siteSessions: {
    total: number;
    trend: number;
  };
  uniqueVisitors: {
    total: number;
    trend: number;
  };
  appointmentRequests: {
    total: number;
    trend: number;
  };
  konzeptcheckPayments: {
    total: number;
    totalAmount: number;
    trend: number;
  };
}

export default function KeyStatsRow() {
  const [stats, setStats] = useState<KeyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeyStats();
  }, []);

  async function fetchKeyStats() {
    try {
      // Fetch conversions data (includes appointment and payment metrics)
      const conversionsResponse = await fetch('/api/admin/analytics/conversions');
      const conversionsData = await conversionsResponse.json();

      // Fetch timeline data (for session counts)
      const timelineResponse = await fetch('/api/admin/analytics/sessions-timeline');
      const timelineData = await timelineResponse.json();

      if (conversionsData.success && timelineData.success) {
        const sessionTotal = timelineData.data.comparison.currentTotal;
        const sessionChange = timelineData.data.comparison.percentChange;

        setStats({
          siteSessions: {
            total: sessionTotal,
            trend: sessionChange
          },
          uniqueVisitors: {
            total: sessionTotal, // For now, assuming 1 session = 1 visitor
            trend: sessionChange
          },
          appointmentRequests: {
            total: conversionsData.data.appointmentRequests.total,
            trend: 0 // Would need historical data for trend
          },
          konzeptcheckPayments: {
            total: conversionsData.data.konzeptcheckPayments.total,
            totalAmount: conversionsData.data.konzeptcheckPayments.totalAmount,
            trend: 0 // Would need historical data for trend
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch key stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Site Sessions */}
      <StatCard
        title="Site Sessions"
        value={stats.siteSessions.total}
        trend={stats.siteSessions.trend}
        icon="📊"
      />

      {/* Unique Visitors */}
      <StatCard
        title="Unique Visitors"
        value={stats.uniqueVisitors.total}
        trend={stats.uniqueVisitors.trend}
        icon="👥"
      />

      {/* Appointment Requests */}
      <StatCard
        title="Clicks to Contact"
        value={stats.appointmentRequests.total}
        trend={stats.appointmentRequests.trend}
        icon="📞"
        subtitle="Appointment Requests"
      />

      {/* Konzeptcheck Payments */}
      <StatCard
        title="Konzeptcheck Payments"
        value={stats.konzeptcheckPayments.total}
        trend={stats.konzeptcheckPayments.trend}
        icon="💰"
        subtitle={`€${(stats.konzeptcheckPayments.totalAmount / 100).toFixed(0)} total`}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  trend: number;
  icon: string;
  subtitle?: string;
}

function StatCard({ title, value, trend, icon, subtitle }: StatCardProps) {
  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600';
  const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        {trend !== 0 && (
          <div className={`flex items-center text-sm font-medium ${trendColor}`}>
            <span className="mr-1">{trendIcon}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

