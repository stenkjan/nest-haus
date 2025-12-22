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
import BIDashboard from "./components/BIDashboard";
import AnalyticsBackupButton from "./components/AnalyticsBackupButton";
import TrackingAuditButton from "./components/TrackingAuditButton";

// DashboardMetrics moved to ClientDashboardMetrics to prevent build-time API calls

export default async function AdminDashboard() {
  // Server-side authentication check
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("hoam-admin-auth");

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
                Hoam-House Admin
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

        {/* BI Metrics Dashboard - Quick Insights */}
        <BIDashboard />

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            href="/admin/usage-performance"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Usage & Performance
                </h3>
                <p className="text-gray-600 mt-2">
                  Combined monitoring of service capacity, system performance, and security with real-time metrics.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  • NeonDB, Redis, Resend tracking
                  <br />
                  • API performance & security
                  <br />• Threat detection & alerts
                </div>
              </div>
              <div className="text-4xl">📊</div>
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
            href="/admin/alpha-tests"
            className="bg-gray-100 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group opacity-60"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-500 group-hover:text-gray-700">
                  Alpha Test Results <span className="text-xs">(Deprecated)</span>
                </h3>
                <p className="text-gray-500 mt-2">
                  View usability test results, user feedback, and identify areas
                  for improvement in the user experience.
                </p>
                <div className="mt-4 text-sm text-gray-400">
                  • User feedback analysis
                  <br />
                  • Usability metrics
                  <br />• Test completion rates
                </div>
              </div>
              <div className="text-4xl opacity-50">🧪</div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ImageCacheManager />
            <AnalyticsBackupButton />
            <TrackingAuditButton />
          </div>
        </div>
      </div>
    </div>
  );
}
