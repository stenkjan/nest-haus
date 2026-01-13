import type { Metadata } from "next";
import KonzeptcheckClient from "./KonzeptcheckClient";
import {
  generatePageMetadata,
  generateStructuredData,
  generatePageServiceSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the konzept-check page
export const metadata: Metadata = generatePageMetadata("konzept-check");

// Structured Data for the Konzept-Check page
const konzeptcheckSchema = generateStructuredData("konzept-check");

// Service Schema for design services
const designServiceSchema = generatePageServiceSchema({
  name: "®Hoam Konzept-Check und Planungsberatung",
  description:
    "Professionelle Konzept-Check- und Planungsberatung für modulare Häuser",
  serviceType: "Hauskonzept und Planungsberatung",
});

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("konzept-check");

// FAQ Schema for Konzept-Check page
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Was kostet der Konzept-Check?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Konzept-Check kostet €3.000 und beinhaltet eine rechtssichere Grundstücksanalyse, Bebauungsmöglichkeiten-Check und einen individuellen Entwurf. Fertigstellung in 4-6 Wochen.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist im Konzept-Check enthalten?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Konzept-Check beinhaltet eine umfassende Grundstücksanalyse, Prüfung der Bebauungsmöglichkeiten, einen individuellen Entwurf basierend auf Ihrer Konfiguration und eine rechtliche Beratung zur Umsetzbarkeit.",
      },
    },
    {
      "@type": "Question",
      name: "Wie lange dauert der Konzept-Check?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Fertigstellung des Konzept-Checks dauert in der Regel 4-6 Wochen ab Auftragserteilung. Sie erhalten einen detaillierten Zeitplan bei Bestellung.",
      },
    },
    {
      "@type": "Question",
      name: "Kann ich den Konzept-Check vor der Hausbuchung kaufen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, der Konzept-Check kann unabhängig von einer Hausbestellung erworben werden und hilft Ihnen, die Machbarkeit Ihres Bauvorhabens zu prüfen bevor Sie größere Investitionen tätigen.",
      },
    },
  ],
};

// Server Component - Can handle SEO, metadata, and structured data
export default function KonzeptCheckPage() {
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
          __html: JSON.stringify(konzeptcheckSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(designServiceSchema),
        }}
      />
      <KonzeptcheckClient />
    </>
  );
}
