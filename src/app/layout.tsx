import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import AlphaTestProvider from "@/components/testing/AlphaTestProvider";
import AlphaSessionTracker from "@/components/testing/AlphaSessionTracker";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import CookieBanner from "@/components/CookieBanner";
import CookieSettingsHandler from "@/components/CookieSettingsHandler";

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

// Structured Data for Organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NEST-Haus",
  description: "Modulare Häuser und nachhaltiges Bauen",
  url: "https://nest-haus.com",
  logo: "https://nest-haus.com/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "German",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "DE",
  },
  sameAs: [
    // Add your social media URLs here
    // "https://www.facebook.com/nest-haus",
    // "https://www.instagram.com/nest-haus",
    // "https://www.linkedin.com/company/nest-haus"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-white min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
