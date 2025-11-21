import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
// Alpha test components - enabled for usability testing
import AlphaTestProvider from "@/components/testing/AlphaTestProvider";
import AlphaSessionTracker from "@/components/testing/AlphaSessionTracker";
// Session tracking components - for all user sessions
import SessionInteractionTracker from "@/components/tracking/SessionInteractionTracker";
// Cookie components - enabled for GDPR compliance
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import CookieBanner from "@/components/CookieBanner";
import CookieSettingsHandler from "@/components/CookieSettingsHandler";
// Security components - content protection and DevTools detection
import SecurityProvider from "@/components/security/SecurityProvider";
// Analytics components - Web Vitals tracking and Google Analytics
// TEMPORARILY DISABLED - troubleshooting module resolution
// import WebVitals from "@/components/analytics/WebVitals";
import GoogleAnalyticsProvider from "@/components/analytics/GoogleAnalyticsProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Get Google Analytics ID from environment
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export const metadata: Metadata = {
  title: "Nest-Haus | Weil nur du weißt, wie du wohnen willst",
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
  metadataBase: new URL("https://www.nest-haus.at"),
  alternates: {
    canonical: "https://www.nest-haus.at",
  },
  icons: {
    icon: [
      // favicon.ico is automatically served from src/app/favicon.ico by Next.js
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    // Note: Apple Touch Icon should be PNG format
    // TODO: Replace apple-icon.svg with apple-touch-icon.png (180x180px with opaque background)
    // apple: [
    //   { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    // ],
  },
  openGraph: {
    title: "Nest-Haus | Weil nur du weißt, wie du wohnen willst",
    description:
      "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar.",
    url: "https://www.nest-haus.at",
    siteName: "NEST-Haus",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "https://www.nest-haus.at/api/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.jpg",
        secureUrl:
          "https://www.nest-haus.at/api/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.jpg",
        width: 1200,
        height: 630,
        alt: "Nest-Haus | Weil nur du weißt, wie du wohnen willst",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nest-Haus | Weil nur du weißt, wie du wohnen willst",
    description:
      "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar.",
    images: [
      "https://www.nest-haus.at/api/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.jpg",
    ],
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
import {
  generateEnhancedOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo/GoogleSEOEnhanced";
import SEOVerification from "@/lib/seo/GoogleSEOEnhanced";
import { SpeedInsights } from "@vercel/speed-insights/next";

const organizationSchema = generateLocalBusinessSchema();
const enhancedOrgSchema = generateEnhancedOrganizationSchema();
const websiteSchema = generateWebSiteSchema();
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
        {/* SEO Verification Tags */}
        <SEOVerification />

        {/* Organization Schema (Original) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Enhanced Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(enhancedOrgSchema),
          }}
        />
        {/* WebSite Schema for Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
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
          <SessionInteractionTracker />

          {/* Analytics & Performance Monitoring */}
          <SpeedInsights />
          {GA_MEASUREMENT_ID && (
            <GoogleAnalyticsProvider gaId={GA_MEASUREMENT_ID} />
          )}
          {/* <WebVitals /> */}
        </CookieConsentProvider>
      </body>
    </html>
  );
}
