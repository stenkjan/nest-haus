import type { Metadata } from "next";
import WarumWirClient from "./WarumWirClient";
import {
  generatePageMetadata,
  generatePageAboutSchema,
  generatePageVideoSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the warum-wir page
export const metadata: Metadata = generatePageMetadata("warumWir");

// Structured Data for the Warum Wir page
const warumWirSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Warum Wir - ®Hoam",
  description:
    "Die Vision und Motivation hinter ®Hoam modularen Bausystemen",
  url: "https://da-hoam.at/warum-wir",
  mainEntity: {
    "@type": "Organization",
    name: "®Hoam",
    description: "Modulare Häuser für nachhaltiges und individuelles Wohnen",
    foundingDate: "2020",
    mission:
      "Nachhaltiges, individuelles und zukunftsorientiertes Bauen für alle zugänglich machen",
  },
};

// Company Mission Schema
const missionSchema = generatePageAboutSchema({
  foundingDate: "2020",
  mission:
    "Revolutionierung des Hausbaus durch modulare, nachhaltige und individuelle Lösungen",
  values: [
    "Nachhaltigkeit",
    "Innovation",
    "Individualität",
    "Qualität",
    "Transparenz",
  ],
});

// Video Schema for YouTube embed
const videoSchema = generatePageVideoSchema({
  name: "®Hoam Vision - ®Hoam Vision",
  description:
    "Erfahren Sie mehr über die Vision von ®Hoam: Modulare, nachhaltige Häuser, die mit Ihnen wachsen und sich bewegen. Ein Zuhause, das Freiraum schafft.",
  thumbnailUrl: "https://i.ytimg.com/vi/Z05jRVentdc/maxresdefault.jpg",
  uploadDate: "2024-01-01",
  contentUrl: "https://www.youtube.com/watch?v=Z05jRVentdc",
  embedUrl: "https://www.youtube.com/embed/Z05jRVentdc",
  duration: "PT2M30S",
});

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("warumWir");

// Server Component - Can handle SEO, metadata, and structured data
export default function WarumWirPage() {
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
          __html: JSON.stringify(warumWirSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(missionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoSchema),
        }}
      />
      <WarumWirClient />
    </>
  );
}
