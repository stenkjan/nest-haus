import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Access Denied | Hoam-House",
  description: "Access to this page has been restricted for security reasons.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            Access to this page has been restricted for security reasons.
            Developer tools or suspicious activity has been detected.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="w-full inline-flex items-center justify-center rounded-full px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg bg-[#3D6CE1] border border-[#3D6CE1] text-white hover:bg-[#3D6CE1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CE1] shadow-sm transition-all duration-300"
          >
            Return to Homepage
          </Link>

          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact our support team.
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-sm font-semibold text-blue-900 mb-2">
            Why was I redirected here?
          </h2>
          <ul className="text-xs text-blue-800 space-y-1 text-left">
            <li>• Developer tools were detected</li>
            <li>• Suspicious browser behavior was identified</li>
            <li>• Content protection measures were triggered</li>
            <li>• Automated access was detected</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

