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
  name: "®Hoam Kontakt",
  description:
    "Kontaktieren Sie ®Hoam für eine kostenlose Beratung zu modularen Häusern",
  url: "https://hoam-house.com/kontakt",
};

// Local Business Schema for Contact Information
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "®Hoam",
  image: "https://hoam-house.com/images/nest-haus-buero.jpg",
  email: "hello@nest.at",
  telephone: "+43 664 3949605",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Zösenberg 51",
    addressLocality: "Weinitzen",
    postalCode: "8045",
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
    name: "®Hoam",
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

// FAQ Schema for Kontakt page
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wo kann ich ®Hoam besichtigen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sie können uns in Weinitzen, Zösenberg 51, 8045 besuchen. Vereinbaren Sie einen Termin für eine persönliche Beratung. Öffnungszeiten: Mo-Fr 08:00-18:00.",
      },
    },
    {
      "@type": "Question",
      name: "Wie kann ich einen Beratungstermin vereinbaren?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sie können einen Termin direkt über unsere Website buchen, per E-Mail an hello@nest.at oder telefonisch unter +43 664 3949605. Wir bieten persönliche Beratung vor Ort oder Online-Beratung an.",
      },
    },
    {
      "@type": "Question",
      name: "Ist die Beratung kostenlos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, die Erstberatung ist kostenlos. Wir besprechen Ihre Wünsche, Möglichkeiten und den weiteren Ablauf ohne jegliche Verpflichtung.",
      },
    },
    {
      "@type": "Question",
      name: "Bieten Sie auch Grundstücksanalysen an?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, wir bieten umfassende Grundstücksanalysen im Rahmen unseres Konzept-Checks an. Diese beinhaltet die Prüfung der Bebauungsmöglichkeiten, rechtliche Rahmenbedingungen und einen individuellen Entwurf.",
      },
    },
  ],
};

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
          __html: JSON.stringify(faqSchema),
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
