/**
 * Alpha Test Demo Page
 *
 * Demonstrates the usability testing system with the floating test button
 */

import React from "react";
import AlphaTestProvider from "@/components/testing/AlphaTestProvider";

export const metadata = {
  title: "Alpha Test Demo | NEST-Haus",
  description: "Demonstration of the alpha testing system",
};

export default function AlphaTestDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Alpha Test Demo
            </h1>
            <p className="text-gray-600 mt-2">
              This page demonstrates the usability testing system. The floating
              test button should appear in the bottom right corner.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How to Test the Alpha Testing System
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900">
                1. Automatic Activation
              </h3>
              <p className="text-gray-600 mt-1">
                The alpha test button appears automatically on this page. Look
                for the floating blue button with a test tube emoji (🧪) in the
                bottom right corner.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900">
                2. Manual Activation via URL
              </h3>
              <p className="text-gray-600 mt-1">
                You can also activate the test on any page by adding{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  ?alpha-test=true
                </code>{" "}
                to the URL.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Example:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  http://localhost:3000/?alpha-test=true
                </code>
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900">
                3. Test Flow
              </h3>
              <p className="text-gray-600 mt-1">
                The test guides users through different sections of the website
                with specific questions about usability, design, and
                functionality.
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Welcome and consent questions</li>
                <li>Landing page evaluation</li>
                <li>Configurator usability testing</li>
                <li>Contact page assessment</li>
                <li>Overall experience feedback</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900">
                4. Data Collection
              </h3>
              <p className="text-gray-600 mt-1">
                The system tracks comprehensive user behavior including:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Response times for each question</li>
                <li>Device and browser information</li>
                <li>User interactions and navigation patterns</li>
                <li>Console errors and technical issues</li>
                <li>Overall completion rates and ratings</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900">
                5. Admin Analytics
              </h3>
              <p className="text-gray-600 mt-1">
                View detailed test results and analytics at:
              </p>
              <a
                href="/admin/alpha-tests"
                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                View Alpha Test Dashboard
              </a>
            </div>
          </div>

          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              🚧 Current Status
            </h3>
            <p className="text-yellow-700">
              The usability test framework is fully implemented with floating
              popup interface, comprehensive question flow, and admin analytics
              dashboard. The database schema has been created for storing test
              results.
            </p>
            <p className="text-yellow-700 mt-2">
              <strong>Note:</strong> Database operations may require Prisma
              client regeneration due to Windows file locking issues. The UI
              components and test flow are fully functional.
            </p>
          </div>
        </div>
      </div>

      {/* Force enable alpha test on this page */}
      <AlphaTestProvider />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          // Force enable alpha test on this demo page
          if (typeof window !== 'undefined') {
            const url = new URL(window.location);
            if (!url.searchParams.has('alpha-test')) {
              url.searchParams.set('alpha-test', 'true');
              window.history.replaceState({}, '', url);
            }
          }
        `,
        }}
      />
    </div>
  );
}
