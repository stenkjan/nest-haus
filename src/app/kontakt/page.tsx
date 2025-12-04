import type { Metadata } from "next";
import KontaktClient from "./KontaktClient";
import {
  generatePageMetadata,
  generateBreadcrumbSchema,
} from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the contact page
export const metadata: Metadata = generatePageMetadata("kontakt");

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
  telephone: "+43 664 3949605",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Zösenberg 51",
    addressLocality: "Weinitzen",
    postalCode: "8044",
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

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("kontakt");

// Server Component - Can handle SEO, metadata, and structured data
export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
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
