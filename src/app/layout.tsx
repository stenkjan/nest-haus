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
// Analytics components - Web Vitals tracking
// TEMPORARILY DISABLED - troubleshooting module resolution
// import WebVitals from "@/components/analytics/WebVitals";
// Google Analytics 4 with Consent Mode v2
import ConsentAwareGoogleAnalytics from "@/components/analytics/ConsentAwareGoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nest-Haus | Weil nur du weißt, wie du richtig wohnst",
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
  openGraph: {
    title: "Nest-Haus | Weil nur du weißt, wie du richtig wohnst",
    description:
      "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar.",
    url: "https://www.nest-haus.at",
    siteName: "NEST-Haus",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "https://www.nest-haus.at/api/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.jpg",
        secureUrl: "https://www.nest-haus.at/api/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.jpg",
        width: 1200,
        height: 630,
        alt: "Nest-Haus | Weil nur du weißt, wie du richtig wohnst",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nest-Haus | Weil nur du weißt, wie du richtig wohnst",
    description:
      "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar.",
    images: ["https://www.nest-haus.at/api/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.jpg"],
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
        {/* Google Analytics 4 with Consent Mode v2 - DSGVO compliant */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            {/* Consent Mode v2 initialization - BEFORE Google Tag */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  
                  // Set default consent (denied) for EWR/Austria
                  gtag('consent', 'default', {
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'analytics_storage': 'denied',
                    'functionality_storage': 'granted',
                    'personalization_storage': 'denied',
                    'security_storage': 'granted',
                    'wait_for_update': 500
                  });
                  
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
            {/* Google Tag script */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
          </>
        )}
        
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
          <SessionInteractionTracker />

          {/* Analytics & Performance Monitoring */}
          {/* <WebVitals /> */}
          
          {/* Google Analytics 4 with DSGVO Consent Mode v2 */}
          <ConsentAwareGoogleAnalytics />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
