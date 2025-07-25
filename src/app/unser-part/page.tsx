import type { Metadata } from "next";
import UnserPartClient from "./UnserPartClient";

// Enhanced SEO metadata for the unser-part page
export const metadata: Metadata = {
  title: "Unser Part | NEST-Haus | Unsere Rolle beim Hausbau",
  description:
    "Entdecke unsere Rolle beim NEST-Haus Bauprozess. Von der Beratung bis zur Realisierung - unser Beitrag für dein Traumhaus.",
  keywords:
    "unser part, nest haus leistungen, modulhaus expertise, baubegleitung, hausbau service, nest haus team, professioneller hausbau",
  alternates: {
    canonical: "https://nest-haus.com/unser-part",
  },
  openGraph: {
    title: "Unser Part | NEST-Haus | Unsere Rolle beim Hausbau",
    description:
      "Entdecke unsere Rolle beim NEST-Haus Bauprozess. Von der Beratung bis zur Realisierung.",
    url: "https://nest-haus.com/unser-part",
    images: [
      {
        url: "/images/unser-part-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Unser Part - Unsere Expertise beim Hausbau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unser Part | NEST-Haus | Unsere Rolle beim Hausbau",
    description:
      "Entdecke unsere Rolle beim NEST-Haus Bauprozess. Von der Beratung bis zur Realisierung.",
    images: ["/images/unser-part-twitter.jpg"],
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

// Structured Data for the Unser Part page
const unserPartSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Unser Part - NEST-Haus",
  description:
    "Unsere Rolle und unser Beitrag beim NEST-Haus Bauprozess - von der Beratung bis zur Realisierung",
  url: "https://nest-haus.com/unser-part",
  mainEntity: {
    "@type": "Service",
    name: "NEST-Haus Baubegleitung und Expertise",
    description:
      "Professionelle Begleitung und Expertise im gesamten Planungs- und Bauprozess",
    provider: {
      "@type": "Organization",
      name: "NEST-Haus",
    },
  },
};

// Service Schema for company expertise
const companyServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "NEST-Haus Expertise und Baubegleitung",
  description:
    "Professionelle Expertise und Begleitung beim Bau modularer Häuser",
  provider: {
    "@type": "Organization",
    name: "NEST-Haus",
  },
  serviceType: "Bauplanung und Projektmanagement",
  areaServed: {
    "@type": "Country",
    name: "Austria",
  },
};

// Server Component - Can handle SEO, metadata, and structured data
export default function UnserPartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(unserPartSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(companyServiceSchema),
        }}
      />
      <UnserPartClient />
    </>
  );
}
