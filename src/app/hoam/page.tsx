import type { Metadata } from "next";
import HoamClient from "./HoamClient";
import {
  generatePageMetadata,
  generateStructuredData,
  generatePageProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the hoam page
export const metadata: Metadata = generatePageMetadata("hoam");

// Structured Data for the Hoam page
const hoamSchema = generateStructuredData("hoam");

// Product Schema for modular houses
const productSchema = generatePageProductSchema({
  name: "®Hoam Modulhäuser",
  description:
    "Modulare Häuser mit individueller Gestaltung, nachhaltiger Bauweise und flexibler Architektur",
  category: "Modulhäuser",
  lowPrice: "177000",
  highPrice: "313000",
  offerCount: "3",
});

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("hoam");

// FAQ Schema for Hoam page
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Was kostet ein ®Hoam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "®Hoam Häuser beginnen bei €213.000 für das Hoam 80 (80m²), €296.000 für das Hoam 120 (120m²), bis €380.000 für das Hoam 160 (160m²). Individuelle Konfigurationen beeinflussen den Endpreis.",
      },
    },
    {
      "@type": "Question",
      name: "Sind ®Hoam Häuser transportabel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, ®Hoam Häuser sind vollständig transportabel. Jedes Modul kann demontiert, transportiert und an einem neuen Standort wieder aufgebaut werden. Dies ermöglicht Flexibilität bei Umzügen oder Grundstücksänderungen.",
      },
    },
    {
      "@type": "Question",
      name: "Kann ich mein ®Hoam später erweitern?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, ®Hoam Häuser sind modular erweiterbar. Sie können später weitere Module hinzufügen oder die Konfiguration anpassen, ohne das gesamte Haus neu bauen zu müssen.",
      },
    },
    {
      "@type": "Question",
      name: "Wie energieeffizient ist ein ®Hoam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "®Hoam Häuser erreichen Energieeffizienzklasse A++ mit einem Heizwärmebedarf von nur 23,21 kWh/(m²a) und CO₂-Emissionen von 2,30 kg/(m²a). Die Bauweise mit hochwertiger Dämmung und modernen Materialien garantiert niedrige Energiekosten.",
      },
    },
  ],
};

// Server Component - Can handle SEO, metadata, and structured data
export default function HoamPage() {
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
          __html: JSON.stringify(hoamSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <HoamClient />
    </>
  );
}
