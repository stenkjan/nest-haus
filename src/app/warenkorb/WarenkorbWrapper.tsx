"use client";

import dynamic from "next/dynamic";

// Dynamically import WarenkorbClient with SSR disabled
// This component uses extensive browser APIs (window.location, window.history, etc.)
const WarenkorbClient = dynamic(() => import("./WarenkorbClient"), {
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center" style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}>
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3D6CE1] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Laden...
          </span>
        </div>
        <p className="mt-4 text-gray-600">Warenkorb wird geladen...</p>
      </div>
    </div>
  ),
  ssr: false, // Required: Component uses window.location, window.history, URLSearchParams
});

export default function WarenkorbWrapper() {
  return <WarenkorbClient />;
}

