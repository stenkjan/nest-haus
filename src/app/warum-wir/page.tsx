import type { Metadata } from "next";
import WarumWirClient from "./WarumWirClient";

// Enhanced SEO metadata for the warum-wir page
export const metadata: Metadata = {
  title: "Warum Wir | NEST-Haus | Unser Antrieb & Unsere Vision",
  description:
    "Erfahren Sie, warum NEST-Haus modulare Häuser baut und was uns antreibt. Unsere Vision für nachhaltiges, individuelles und zukunftsorientiertes Bauen.",
  keywords:
    "warum nest haus, vision modulhaus, nachhaltig bauen motivation, unternehmen vision, modulare architektur philosophie",
  alternates: {
    canonical: "https://nest-haus.at/warum-wir",
  },
  openGraph: {
    title: "Warum Wir | NEST-Haus | Unser Antrieb & Unsere Vision",
    description:
      "Erfahren Sie, warum NEST-Haus modulare Häuser baut und was uns antreibt. Unsere Vision für nachhaltiges Bauen.",
    url: "https://nest-haus.at/warum-wir",
    images: [
      {
        url: "/images/warum-wir-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Team - Warum wir modulare Häuser bauen",
      },
    ],
    videos: [
      {
        url: "https://www.youtube.com/watch?v=Z05jRVentdc",
        width: 1920,
        height: 1080,
        type: "video/mp4",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Warum Wir | NEST-Haus | Unser Antrieb & Unsere Vision",
    description:
      "Erfahren Sie, warum NEST-Haus modulare Häuser baut und was uns antreibt. Unsere Vision für nachhaltiges Bauen.",
    images: ["/images/warum-wir-twitter.jpg"],
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

// Structured Data for the Warum Wir page
const warumWirSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Warum Wir - NEST-Haus",
  description:
    "Die Vision und Motivation hinter NEST-Haus modularen Bausystemen",
  url: "https://nest-haus.at/warum-wir",
  mainEntity: {
    "@type": "Organization",
    name: "NEST-Haus",
    description: "Modulare Häuser für nachhaltiges und individuelles Wohnen",
    foundingDate: "2020",
    mission:
      "Nachhaltiges, individuelles und zukunftsorientiertes Bauen für alle zugänglich machen",
  },
};

// Company Mission Schema
const missionSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NEST-Haus",
  description: "Modulare Häuser und nachhaltiges Bauen",
  mission:
    "Revolutionierung des Hausbaus durch modulare, nachhaltige und individuelle Lösungen",
  values: [
    "Nachhaltigkeit",
    "Innovation",
    "Individualität",
    "Qualität",
    "Transparenz",
  ],
  areaServed: {
    "@type": "Country",
    name: "Austria",
  },
};

// Video Schema for YouTube embed
const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Nest Haus Vision - Die ®Nest Vision",
  description:
    "Erfahren Sie mehr über die Vision von NEST-Haus: Modulare, nachhaltige Häuser, die mit Ihnen wachsen und sich bewegen. Ein Zuhause, das Freiraum schafft.",
  thumbnailUrl: "https://i.ytimg.com/vi/Z05jRVentdc/maxresdefault.jpg",
  uploadDate: "2024-01-01",
  contentUrl: "https://www.youtube.com/watch?v=Z05jRVentdc",
  embedUrl: "https://www.youtube.com/embed/Z05jRVentdc",
  duration: "PT2M30S", // Adjust based on actual video length
  publisher: {
    "@type": "Organization",
    name: "NEST-Haus",
    logo: {
      "@type": "ImageObject",
      url: "https://nest-haus.at/images/nest-haus-logo.png",
    },
  },
};

// Server Component - Can handle SEO, metadata, and structured data
export default function WarumWirPage() {
  return (
    <>
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
