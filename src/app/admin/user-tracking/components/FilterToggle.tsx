"use client";

interface FilterToggleProps {
  currentFilter: "all" | "real_users" | "bots";
  onFilterChange: (filter: "all" | "real_users" | "bots") => void;
  stats?: {
    all: number;
    realUsers: number;
    bots: number;
  };
}

export default function FilterToggle({
  currentFilter,
  onFilterChange,
  stats,
}: FilterToggleProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Session Filter
          </h3>
          <p className="text-xs text-gray-600">
            Filter sessions to match GA4 metrics or view all traffic
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Sessions
            {stats && (
              <span className="ml-2 text-xs opacity-75">({stats.all})</span>
            )}
          </button>

          <button
            onClick={() => onFilterChange("real_users")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentFilter === "real_users"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ✅ Real Users Only (GA4-aligned)
            {stats && (
              <span className="ml-2 text-xs opacity-75">({stats.realUsers})</span>
            )}
          </button>

          <button
            onClick={() => onFilterChange("bots")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentFilter === "bots"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🤖 Bots Only
            {stats && (
              <span className="ml-2 text-xs opacity-75">({stats.bots})</span>
            )}
          </button>
        </div>
      </div>

      {/* Info banner */}
      {currentFilter === "real_users" && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
          <p className="text-xs text-green-800">
            <strong>GA4-Aligned View:</strong> Showing only real users (bots
            filtered out). This matches Google Analytics 4 metrics for accurate
            comparison.
          </p>
        </div>
      )}

      {currentFilter === "bots" && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded p-3">
          <p className="text-xs text-red-800">
            <strong>Bot Traffic View:</strong> Showing only detected bots and
            scrapers. Useful for SEO analysis and security monitoring.
          </p>
        </div>
      )}

      {currentFilter === "all" && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-xs text-blue-800">
            <strong>All Traffic:</strong> Showing all sessions including bots.
            For accurate business metrics, switch to &quot;Real Users Only&quot;.
          </p>
        </div>
      )}
    </div>
  );
}

