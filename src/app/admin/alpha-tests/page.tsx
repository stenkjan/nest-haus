/**
 * Alpha Test Results Dashboard
 *
 * Admin interface for viewing usability test results and analytics
 */

import React from "react";
import AlphaTestDashboard from "./components/AlphaTestDashboard";

export const metadata = {
  title: "Alpha Test Results | NEST-Haus Admin",
  description: "View and analyze alpha test results and user feedback",
};

export default function AlphaTestsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 pt-10 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <a
                  href="/admin"
                  className="text-blue-600 hover:text-blue-800 text-2xl font-medium"
                  title="Back to Admin"
                >
                  ←
                </a>
                <h1 className="text-3xl font-bold text-gray-900">
                  Alpha Test Results
                </h1>
              </div>
              <p className="text-gray-600 ml-12">
                Usability testing analytics and user feedback
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AlphaTestDashboard />
      </div>
    </div>
  );
}
