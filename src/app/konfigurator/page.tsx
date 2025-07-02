import type { Metadata } from 'next';
import KonfiguratorClient from './components/KonfiguratorClient';

// Enhanced SEO metadata for the configurator page
export const metadata: Metadata = {
  title: 'Haus Konfigurator | 3D Planung für Ihr Modulhaus | NEST-Haus',
  description: 'Planen Sie Ihr Traumhaus mit unserem 3D-Konfigurator. Verschiedene Module, Materialien und Ausstattungen. Sofort Preis kalkulieren!',
  keywords: 'hausbau konfigurator, modulhaus planen, 3d hausplaner, fertighaus konfigurator, hausplaner online',
  alternates: {
    canonical: 'https://nest-haus.com/konfigurator',
  },
  openGraph: {
    title: 'NEST-Haus Konfigurator | Ihr Traumhaus in 3D planen',
    description: 'Gestalten Sie Ihr individuelles Modulhaus mit unserem interaktiven 3D-Konfigurator. Sofortige Preiskalkulation inklusive.',
    url: 'https://nest-haus.com/konfigurator',
    images: [
      {
        url: '/images/konfigurator-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'NEST-Haus 3D Konfigurator Vorschau',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEST-Haus Konfigurator | Ihr Traumhaus in 3D planen',
    description: 'Gestalten Sie Ihr individuelles Modulhaus mit unserem interaktiven 3D-Konfigurator.',
    images: ['/images/konfigurator-twitter.jpg'],
  },
};

// Structured Data for the Configurator Service
const configuratorSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "NEST-Haus Konfigurator",
  "description": "Interaktiver 3D-Konfigurator für modulare Häuser",
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