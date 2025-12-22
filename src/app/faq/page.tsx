import FAQClient from "./FAQClient";
import { generatePageMetadata, SEO_CONFIG } from "@/lib/seo/generateMetadata";

// Use centralized SEO metadata configuration
export const metadata = generatePageMetadata("faq");

// Structured Data for FAQ Page
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "®Hoam Häufig gestellte Fragen",
  description: "Antworten auf häufig gestellte Fragen zu ®Hoam",
  url: `${SEO_CONFIG.baseUrl}/faq`,
};

// Server Component
export default function FAQPage() {
  return (
    <>
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

