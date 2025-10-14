"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import Footer from "@/components/Footer";

export default function EntwurfClient() {
  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      {/* White background for navbar area */}
      <div
        className="fixed top-0 left-0 right-0 bg-white z-[90]"
        style={{ height: "var(--navbar-height, 3.5rem)" }}
      ></div>

      {/* Simple content structure */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="text-center">
          <h1 className="h1-secondary text-white mb-6">Entwurf</h1>
          <h3 className="h3-secondary text-nest-gray mb-12">
            Dein Hausentwurf beginnt hier.
          </h3>

          {/* Simple navigation buttons */}
          <div className="flex gap-4 justify-center">
            <Link href="/dein-part">
              <Button variant="primary" size="md">
                Zum nächsten Schritt
              </Button>
            </Link>
            <Link href="/konfigurator">
              <Button variant="landing-secondary" size="md">
                Jetzt konfigurieren
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
