import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import KontaktClient from "./KontaktClient";

// Enhanced SEO metadata for the contact page
export const metadata: Metadata = {
  title: "Kontakt | NEST-Haus | Beratung & Terminvereinbarung",
  description:
    "Vereinbaren Sie einen kostenlosen Beratungstermin mit NEST-Haus. Professionelle Beratung für Ihr modulares Traumhaus. Jetzt Termin buchen!",
  keywords:
    "nest haus kontakt, beratungstermin, modulhaus beratung, hausbau beratung, kostenlose beratung, termin vereinbaren",
  alternates: {
    canonical: "https://nest-haus.at/kontakt",
  },
  openGraph: {
    title: "NEST-Haus Kontakt | Kostenlose Beratung",
    description:
      "Vereinbaren Sie einen kostenlosen Beratungstermin mit NEST-Haus. Professionelle Beratung für Ihr modulares Traumhaus.",
    url: "https://nest-haus.at/kontakt",
    images: [
      {
        url: "/images/kontakt-beratung.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Beratungstermin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEST-Haus Kontakt | Kostenlose Beratung",
    description:
      "Vereinbaren Sie einen kostenlosen Beratungstermin mit NEST-Haus.",
    images: ["/images/kontakt-twitter.jpg"],
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

// Structured Data for Contact Page
const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "NEST-Haus Kontakt",
  description:
    "Kontaktieren Sie NEST-Haus für eine kostenlose Beratung zu modularen Häusern",
  url: "https://nest-haus.at/kontakt",
};

// Local Business Schema for Contact Information
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "NEST-Haus",
  image: "https://nest-haus.at/images/nest-haus-buero.jpg",
  email: "hello@nest.at",
  telephone: "0043 664 5403399",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Karmeliterplatz 8",
    addressLocality: "Graz",
    postalCode: "8010",
    addressCountry: "AT",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 47.0707,
    longitude: 15.4395,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  priceRange: "€€€",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
};

// Service Schema for Consultation
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Kostenlose Hausbau Beratung",
  description:
    "Professionelle Beratung für modulare Häuser und nachhaltiges Bauen",
  provider: {
    "@type": "Organization",
    name: "NEST-Haus",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "Kostenlose Erstberatung",
  },
  areaServed: {
    "@type": "Country",
    name: "Austria",
  },
};

// Server Component - Can handle SEO, metadata, and structured data
export default async function ContactPage() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    if (!authCookie || authCookie.value !== correctPassword) {
      redirect("/auth?redirect=" + encodeURIComponent("/kontakt"));
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <KontaktClient />
    </>
  );
}
