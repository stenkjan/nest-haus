/**
 * Customer Inquiries Management - Admin Panel
 *
 * Displays all customer inquiries from the contact form with management capabilities.
 * Integrates with the existing contact API for real data.
 */

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { UserJourney } from "./UserJourney";
import { SessionSummaryBadge } from "./SessionSummaryBadge";
import InquiryAnalytics from "./components/InquiryAnalytics";

interface CustomerInquiry {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  message: string | null;
  sessionId: string | null;
  status:
    | "NEW"
    | "CONTACTED"
    | "IN_PROGRESS"
    | "QUOTED"
    | "CONVERTED"
    | "CLOSED";
  preferredContact: "EMAIL" | "PHONE" | "WHATSAPP";
  totalPrice: number | null;
  createdAt: string;
  updatedAt: string;
  followUpDate: string | null;
  adminNotes: string | null;
  assignedTo: string | null;
  // Appointment fields
  requestType: string | null;
  appointmentDateTime: string | null;
  appointmentStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED" | null;
  appointmentExpiresAt: string | null;
  confirmationToken: string | null;
}

interface InquiriesResponse {
  inquiries: CustomerInquiry[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Fetch customer inquiries from the existing contact API
 */
async function fetchCustomerInquiries(
  page: number = 1,
  status?: string
): Promise<InquiriesResponse> {
  try {
    console.log("🔍 Fetching customer inquiries...");

    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });

    if (status && status !== "ALL") {
      params.append("status", status);
    }

    // Build base URL - prioritize NEXT_PUBLIC_SITE_URL, fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/contact?${params}`;

    console.log(`📡 Fetching from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("✅ Customer inquiries fetched successfully");
    console.log(
      `📊 Fetched ${data.inquiries?.length || 0} inquiries (Total: ${data.pagination?.totalCount || 0})`
    );
    console.log("📋 Sample inquiry data:", data.inquiries?.[0]);
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch customer inquiries:", error);

    // Return empty data structure on error
    return {
      inquiries: [],
      pagination: {
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

function StatusBadge({ status }: { status: CustomerInquiry["status"] }) {
  const styles = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    QUOTED: "bg-orange-100 text-orange-800",
    CONVERTED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ContactMethodBadge({
  method,
}: {
  method: CustomerInquiry["preferredContact"];
}) {
  const icons = {
    EMAIL: "📧",
    PHONE: "📞",
    WHATSAPP: "💬",
  };

  return (
    <span className="inline-flex items-center text-sm text-gray-600">
      <span className="mr-1">{icons[method]}</span>
      {method}
    </span>
  );
}

function AppointmentStatusBadge({
  status,
}: {
  status: CustomerInquiry["appointmentStatus"];
}) {
  if (!status) return null;

  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
  };

  const icons = {
    PENDING: "⏳",
    CONFIRMED: "✅",
    CANCELLED: "❌",
    EXPIRED: "⌛",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      <span className="mr-1">{icons[status]}</span>
      {status}
    </span>
  );
}

function InquiryCard({ inquiry }: { inquiry: CustomerInquiry }) {
  const isUrgent =
    inquiry.status === "NEW" &&
    new Date(inquiry.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
  const isAppointment = inquiry.requestType === "appointment";

  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        isUrgent
          ? "border-l-4 border-red-500"
          : isAppointment
            ? "border-l-4 border-blue-500"
            : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {inquiry.name || "Anonymous"}
            {isUrgent && (
              <span className="ml-2 text-red-500 text-sm">🚨 New</span>
            )}
            {isAppointment && (
              <span className="ml-2 text-blue-600 text-sm">📅 Appointment</span>
            )}
          </h3>
          <p className="text-sm text-gray-600">{inquiry.email}</p>
          {inquiry.phone && (
            <p className="text-sm text-gray-600">{inquiry.phone}</p>
          )}
        </div>
        <div className="text-right space-y-1">
          <StatusBadge status={inquiry.status} />
          {inquiry.appointmentStatus && (
            <div>
              <AppointmentStatusBadge status={inquiry.appointmentStatus} />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {new Date(inquiry.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Appointment Details */}
      {isAppointment && inquiry.appointmentDateTime && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            📅 Appointment Request
          </h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>
              <strong>Requested Time:</strong>{" "}
              {new Date(inquiry.appointmentDateTime).toLocaleString("de-DE", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
            {inquiry.appointmentExpiresAt &&
              inquiry.appointmentStatus === "PENDING" && (
                <p className="text-xs text-blue-600">
                  ⏰ Hold expires:{" "}
                  {new Date(inquiry.appointmentExpiresAt).toLocaleString(
                    "de-DE"
                  )}
                </p>
              )}
          </div>
        </div>
      )}

      {/* Message */}
      {inquiry.message && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Message:</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {inquiry.message}
          </p>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Preferred Contact:</span>
          <div className="mt-1">
            <ContactMethodBadge method={inquiry.preferredContact} />
          </div>
        </div>
        {inquiry.totalPrice && (
          <div>
            <span className="text-gray-600">Configuration Price:</span>
            <p className="font-semibold text-green-600">
              €{inquiry.totalPrice.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Admin Notes */}
      {inquiry.adminNotes && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            Admin Notes:
          </h4>
          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
            {inquiry.adminNotes}
          </p>
        </div>
      )}

      {/* User Journey and Session Data */}
      {inquiry.sessionId && (
        <div className="mb-4">
          <UserJourney sessionId={inquiry.sessionId} inquiryId={inquiry.id} />
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">ID: {inquiry.id}</div>
          {inquiry.sessionId && (
            <SessionSummaryBadge sessionId={inquiry.sessionId} compact />
          )}
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
            View Details
          </button>
          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

function InquiriesSummary({ inquiries }: { inquiries: CustomerInquiry[] }) {
  const summary = inquiries.reduce(
    (acc, inquiry) => {
      acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalValue = inquiries
    .filter((i) => i.totalPrice)
    .reduce((sum, i) => sum + (i.totalPrice || 0), 0);

  const appointmentCount = inquiries.filter(
    (i) => i.requestType === "appointment"
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-blue-600">
          {appointmentCount}
        </div>
        <div className="text-sm text-gray-600">Appointments</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-blue-600">
          {summary.NEW || 0}
        </div>
        <div className="text-sm text-gray-600">New</div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-yellow-600">
          {summary.CONTACTED || 0}
        </div>
        <div className="text-sm text-gray-600">Contacted</div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-purple-600">
          {summary.IN_PROGRESS || 0}
        </div>
        <div className="text-sm text-gray-600">In Progress</div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-orange-600">
          {summary.QUOTED || 0}
        </div>
        <div className="text-sm text-gray-600">Quoted</div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-green-600">
          {summary.CONVERTED || 0}
        </div>
        <div className="text-sm text-gray-600">Converted</div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-gray-600">
          €{Math.round(totalValue / 1000)}k
        </div>
        <div className="text-sm text-gray-600">Total Value</div>
      </div>
    </div>
  );
}

/**
 * Real Data Dashboard Component
 */
async function InquiriesDashboard() {
  const inquiriesData = await fetchCustomerInquiries(1);

  return (
    <>
      {/* Data Summary */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-green-800">
              📬 Customer Inquiries
            </h3>
            <p className="text-xs text-green-600">
              {inquiriesData.pagination.totalCount} total inquiries from real
              customers
            </p>
          </div>
          <div className="text-xs text-green-600">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <InquiryAnalytics />
      <InquiriesSummary inquiries={inquiriesData.inquiries} />

      {/* Filter Controls */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <select className="border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="QUOTED">Quoted</option>
              <option value="CONVERTED">Converted</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select className="border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="ALL">All Types</option>
              <option value="CONTACT">Contacts Only</option>
              <option value="APPOINTMENT">Appointments Only</option>
            </select>

            <input
              type="text"
              placeholder="Search by name or email..."
              className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
              Filter
            </button>
          </div>

          <div className="flex space-x-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors">
              Export CSV
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4 mb-8">
        {inquiriesData.inquiries.length > 0 ? (
          inquiriesData.inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-800 font-medium">
              No customer inquiries available yet
            </p>
            <p className="text-yellow-600 text-sm mt-1">
              Inquiries will appear here when customers use the contact form
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {inquiriesData.pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <button
              className="px-3 py-2 border border-gray-300 rounded text-sm disabled:opacity-50"
              disabled={!inquiriesData.pagination.hasPrev}
            >
              Previous
            </button>

            <span className="px-3 py-2 text-sm text-gray-600">
              Page {inquiriesData.pagination.page} of{" "}
              {inquiriesData.pagination.totalPages}
            </span>

            <button
              className="px-3 py-2 border border-gray-300 rounded text-sm disabled:opacity-50"
              disabled={!inquiriesData.pagination.hasNext}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Loading Fallback Component
 */
function InquiriesLoadingFallback() {
  return (
    <>
      {/* Loading Summary */}
      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Loading Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Loading Cards */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default async function CustomerInquiriesPage() {
  // Server-side authentication check
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-admin-auth");

    if (!authCookie || authCookie.value !== adminPassword) {
      redirect(
        "/admin/auth?redirect=" +
          encodeURIComponent("/admin/customer-inquiries")
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href="/admin"
                  className="text-blue-600 hover:text-blue-800 text-2xl font-medium"
                  title="Back to Admin"
                >
                  ←
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                  Customer Inquiries
                </h1>
              </div>
              <p className="text-gray-600 ml-12">
                Manage customer contact form submissions and inquiries
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">📬 Real Data</div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                New Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<InquiriesLoadingFallback />}>
          <InquiriesDashboard />
        </Suspense>
      </div>
    </div>
  );
}
