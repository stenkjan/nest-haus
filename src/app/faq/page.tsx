import FAQClient from "./FAQClient";
import { generatePageMetadata, SEO_CONFIG, generateBreadcrumbSchema } from "@/lib/seo/generateMetadata";

// Use centralized SEO metadata configuration
export const metadata = generatePageMetadata("faq");

// Structured Data for FAQ Page
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "NEST-Haus Häufig gestellte Fragen",
  description: "Antworten auf häufig gestellte Fragen zu NEST-Haus",
  url: `${SEO_CONFIG.baseUrl}/faq`,
};

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("faq");

// Server Component
export default function FAQPage() {
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
      <FAQClient />
    </>
  );
}

