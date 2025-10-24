"use client";

import { useState } from "react";
import Link from "next/link";

interface DebugData {
  sessionId: string;
  found: boolean;
  timestamp: string;
  session?: {
    status: string;
    startTime: string;
    endTime?: string;
    totalPrice?: number;
    duration: string;
  };
  configuration?: {
    hasData: boolean;
    keys: string[];
    totalPrice?: number;
    selections: Array<{
      category: string;
      value: string;
      price?: number;
    }>;
  };
  selectionEvents?: {
    count: number;
    events: Array<{
      category: string;
      selection: string;
      timestamp: string;
      totalPrice?: number;
    }>;
  };
  customerInquiry?: {
    id: string;
    email: string;
    name?: string;
    status: string;
    paymentStatus: string;
    totalPrice?: number;
  } | null;
  analysis?: {
    hasUserSession: boolean;
    hasConfigurationData: boolean;
    hasSelectionEvents: boolean;
    hasCustomerInquiry: boolean;
    isCompleted: boolean;
    dataQuality: {
      configurationKeys: number;
      selectionEvents: number;
      interactionEvents: number;
      missingData: string[];
    };
  };
  error?: string;
}

export default function SessionDebugPage() {
  const [sessionId, setSessionId] = useState("");
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId.trim()) {
      setError("Please enter a session ID");
      return;
    }

    setLoading(true);
    setError("");
    setDebugData(null);

    try {
      const response = await fetch(
        `/api/admin/debug/session/${encodeURIComponent(sessionId.trim())}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch session data");
        return;
      }

      setDebugData(data);
    } catch (err) {
      setError(
        "Network error: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Session Debugger</h1>
          <p className="text-gray-600 mt-2">
            Inspect session data to troubleshoot tracking issues
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter session ID (e.g., client_1234567890_abc123)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Debug Session"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Debug Data Display */}
        {debugData && (
          <div className="space-y-6">
            {/* Session Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Session Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      debugData.session?.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {debugData.session?.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Duration:</span>{" "}
                  {debugData.session?.duration}
                </div>
                <div>
                  <span className="font-medium">Total Price:</span>{" "}
                  {debugData.session?.totalPrice
                    ? `€${(debugData.session.totalPrice / 100).toLocaleString()}`
                    : "N/A"}
                </div>
                <div>
                  <span className="font-medium">Start Time:</span>{" "}
                  {debugData.session?.startTime
                    ? new Date(debugData.session.startTime).toLocaleString()
                    : "N/A"}
                </div>
              </div>
            </div>

            {/* Data Quality Analysis */}
            {debugData.analysis && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Data Quality Analysis
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        debugData.analysis.hasConfigurationData
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {debugData.analysis.hasConfigurationData ? "✓" : "✗"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Configuration Data
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        debugData.analysis.hasSelectionEvents
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {debugData.analysis.hasSelectionEvents ? "✓" : "✗"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Selection Events
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        debugData.analysis.hasCustomerInquiry
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {debugData.analysis.hasCustomerInquiry ? "✓" : "○"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Customer Inquiry
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        debugData.analysis.isCompleted
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {debugData.analysis.isCompleted ? "✓" : "○"}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>

                {debugData.analysis.dataQuality.missingData.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Missing Data:
                    </h3>
                    <ul className="list-disc list-inside text-yellow-700">
                      {debugData.analysis.dataQuality.missingData.map(
                        (item, idx) => (
                          <li key={idx}>{item}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Configuration Data */}
            {debugData.configuration && debugData.configuration.hasData && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Configuration Selections
                </h2>
                <div className="space-y-2">
                  {debugData.configuration.selections.map((selection, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium">
                          {selection.category}:
                        </span>{" "}
                        {selection.value}
                      </div>
                      {selection.price !== null &&
                        selection.price !== undefined && (
                          <span className="text-gray-600">
                            €{(selection.price / 100).toLocaleString()}
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Events */}
            {debugData.selectionEvents &&
              debugData.selectionEvents.count > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Selection Events ({debugData.selectionEvents.count})
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Timestamp
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Selection
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Total Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {debugData.selectionEvents.events.map((event, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {event.category}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {event.selection}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {event.totalPrice
                                ? `€${(event.totalPrice / 100).toLocaleString()}`
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Customer Inquiry */}
            {debugData.customerInquiry && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Customer Inquiry</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {debugData.customerInquiry.email}
                  </div>
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {debugData.customerInquiry.name || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                      {debugData.customerInquiry.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Payment Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        debugData.customerInquiry.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {debugData.customerInquiry.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
