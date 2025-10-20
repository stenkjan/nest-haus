import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
// Alpha test components - enabled for usability testing
import AlphaTestProvider from "@/components/testing/AlphaTestProvider";
import AlphaSessionTracker from "@/components/testing/AlphaSessionTracker";
// Cookie components - enabled for GDPR compliance
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import CookieBanner from "@/components/CookieBanner";
import CookieSettingsHandler from "@/components/CookieSettingsHandler";
// Security components - content protection and DevTools detection
import SecurityProvider from "@/components/security/SecurityProvider";
// Analytics components - Web Vitals tracking
import WebVitals from "@/components/analytics/WebVitals";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEST-Haus | Modulare Häuser & Nachhaltiges Bauen in Deutschland",
  description:
    "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar. Jetzt kostenlos beraten lassen!",
  keywords:
    "modulhaus, fertighaus, nachhaltiges bauen, energieeffizient, Deutschland, hausbau konfigurator",
  authors: [{ name: "NEST-Haus" }],
  creator: "NEST-Haus",
  publisher: "NEST-Haus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nest-haus.com"),
  alternates: {
    canonical: "https://nest-haus.com",
  },
  openGraph: {
    title: "NEST-Haus | Modulare Häuser & Nachhaltiges Bauen",
    description:
      "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar.",
    url: "https://nest-haus.com",
    siteName: "NEST-Haus",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Modulare Häuser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEST-Haus | Modulare Häuser & Nachhaltiges Bauen",
    description:
      "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar.",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Enhanced Structured Data
import {
  generateLocalBusinessSchema,
  generateProductSchema,
  generateFAQSchema,
} from "@/lib/seo/generateMetadata";

const organizationSchema = generateLocalBusinessSchema();
const productSchema = generateProductSchema();
const faqSchema = generateFAQSchema();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Product Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-white min-h-screen flex flex-col`}
      >
        <CookieConsentProvider>
          <SecurityProvider
            enableDevToolsDetection={false} // Disabled to prevent false positives
            enableImageProtection={true}
            devToolsConfig={{
              threshold: 200, // Higher threshold to reduce false positives
              checkInterval: 2000, // Less frequent checks
              showWarning: false, // Don't show warnings
              blockAccess: false, // Don't block access
            }}
            imageProtectionConfig={{
              enableWatermark: true,
              watermarkText: "© NEST-Haus",
              protectionLevel: "standard",
            }}
          />
          <Navbar />
          <main className="flex-1">{children}</main>

          {/* Global Components */}
          <CookieBanner />
          <CookieSettingsHandler />
          <AlphaTestProvider />
          <AlphaSessionTracker />

          {/* Analytics & Performance Monitoring */}
          <WebVitals />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
