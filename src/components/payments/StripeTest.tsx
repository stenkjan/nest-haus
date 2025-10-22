"use client";

import React from "react";

export default function StripeTest() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Stripe Configuration Test</h3>
      <p>Publishable Key: {publishableKey ? "✅ Configured" : "❌ Missing"}</p>
      <p>
        Key starts with:{" "}
        {publishableKey ? publishableKey.substring(0, 20) + "..." : "N/A"}
      </p>
    </div>
  );
}
