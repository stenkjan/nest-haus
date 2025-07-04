import type { Metadata } from 'next';
import KonfiguratorClient from './components/KonfiguratorClient';

// Enhanced SEO metadata for the configurator page
export const metadata: Metadata = {
  title: 'Haus Konfigurator | Planung für Ihr Modulhaus | NEST-Haus',
  description: 'Planen Sie Ihr Traumhaus mit unserem Konfigurator. Verschiedene Module, Materialien und Ausstattungen. Sofort Preis kalkulieren!',
  keywords: 'hausbau konfigurator, modulhaus planen,  Hausplaner, fertighaus konfigurator, hausplaner online',
  alternates: {
    canonical: 'https://nest-haus.com/konfigurator',
  },
  openGraph: {
    title: 'NEST-Haus Konfigurator | Ihr Traumhaus planen',
    description: 'Gestalten Sie Ihr individuelles Modulhaus mit unserem interaktiven Konfigurator. Sofortige Preiskalkulation inklusive.',
    url: 'https://nest-haus.com/konfigurator',
    images: [
      {
        url: '/images/konfigurator-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'NEST-Haus Konfigurator Vorschau',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEST-Haus Konfigurator | Ihr Traumhaus planen',
    description: 'Gestalten Sie Ihr individuelles Modulhaus mit unserem interaktiven Konfigurator.',
    images: ['/images/konfigurator-twitter.jpg'],
  },
};

// Structured Data for the Configurator Service
const configuratorSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "NEST-Haus Konfigurator",
  "description": "Interaktiver Konfigurator für modulare Häuser",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "description": "Kostenloser Hausbau-Konfigurator"
  },
  "creator": {
    "@type": "Organization",
    "name": "NEST-Haus"
  }
};

// Server Component - Can handle initial data fetching, SEO, etc.
export default function KonfiguratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(configuratorSchema),
        }}
      />
      <KonfiguratorClient />
    </>
  );
} 