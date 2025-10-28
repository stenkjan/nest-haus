/**
 * Admin Dashboard - Main Overview
 *
 * Provides high-level metrics and navigation to detailed analytics sections
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import ImageCacheManager from "@/components/images/ImageCacheManager";
import ClientDashboardMetrics from "./components/ClientDashboardMetrics";

// DashboardMetrics moved to ClientDashboardMetrics to prevent build-time API calls

export default async function AdminDashboard() {
  // Server-side authentication check
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-admin-auth");

    console.log("[ADMIN_SERVER] Password protection enabled");
    console.log("[ADMIN_SERVER] Auth cookie exists:", !!authCookie);

    if (!authCookie || authCookie.value !== adminPassword) {
      console.log("[ADMIN_SERVER] Redirecting to admin auth page");
      redirect("/admin/auth?redirect=" + encodeURIComponent("/admin"));
    }

    console.log("[ADMIN_SERVER] Admin authenticated, rendering dashboard");
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 pt-10 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nest-Haus Admin
              </h1>
              <p className="text-gray-600">
                Analytics & Configuration Management
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Metrics */}
        {/* Client-side metrics to prevent build-time API calls */}
        <ClientDashboardMetrics />

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/customer-inquiries"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Customer Inquiries
                </h3>
                <p className="text-gray-600 mt-2">
                  Manage customer contact form submissions, track inquiry
                  status, and handle customer communications.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • Real customer data
                  <br />
                  • Status tracking
                  <br />• Response management
                </div>
              </div>
              <div className="text-4xl">📬</div>
            </div>
          </Link>

          <Link
            href="/admin/user-tracking"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  User Tracking
                </h3>
                <p className="text-gray-600 mt-2">
                  Comprehensive analytics: conversion funnel, time metrics, and
                  popular configurations (cart-based tracking).
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • Conversion funnel
                  <br />
                  • Time analytics
                  <br />• Popular configurations
                </div>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </Link>

          <Link
            href="/admin/performance"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Performance Metrics
                </h3>
                <p className="text-gray-600 mt-2">
                  Monitor system performance, API response times, database
                  queries, and user experience metrics.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • API performance
                  <br />
                  • Database metrics
                  <br />• Page load times
                </div>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
          </Link>

          <Link
            href="/admin/conversion"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Conversion Analysis
                </h3>
                <p className="text-gray-600 mt-2">
                  Track conversion rates, funnel performance, and identify
                  opportunities to increase sales.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • Funnel analysis
                  <br />
                  • Conversion rates
                  <br />• Revenue tracking
                </div>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </Link>

          <Link
            href="/admin/alpha-tests"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Alpha Test Results
                </h3>
                <p className="text-gray-600 mt-2">
                  View usability test results, user feedback, and identify areas
                  for improvement in the user experience.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • User feedback analysis
                  <br />
                  • Usability metrics
                  <br />• Test completion rates
                </div>
              </div>
              <div className="text-4xl">🧪</div>
            </div>
          </Link>

          <Link
            href="/admin/pmg"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Project Management
                </h3>
                <p className="text-gray-600 mt-2">
                  Interactive dashboard for tracking launch preparation tasks,
                  team responsibilities, and project timeline.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • Gantt chart visualization
                  <br />
                  • Task management
                  <br />• Team collaboration
                </div>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </Link>

          <Link
            href="/admin/usage"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Usage Monitoring
                </h3>
                <p className="text-gray-600 mt-2">
                  Real-time monitoring of service capacity limits with visual
                  gauges and automatic alerts for all infrastructure components.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • Service capacity gauges
                  <br />
                  • Automatic alerts at 70%/90%
                  <br />• Real-time metrics
                </div>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </Link>

          <Link
            href="/admin/security"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Security Monitoring
                </h3>
                <p className="text-gray-600 mt-2">
                  Real-time threat detection, security event tracking, bot
                  detection, and behavioral analysis with live alerts.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • Threat level indicators
                  <br />
                  • Bot detection & blocking
                  <br />• Security event logs
                </div>
              </div>
              <div className="text-4xl">🔒</div>
            </div>
          </Link>
        </div>

        {/* System Management */}
        <div className="space-y-6">
          {/* Image Cache Manager */}
          <ImageCacheManager />

          {/* Developer Tools */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Developer Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/debug/session"
                className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    Session Debugger
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Inspect session tracking data
                  </div>
                </div>
                <div className="text-2xl">🔍</div>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Export Analytics Report
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                Sync Redis to PostgreSQL
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
