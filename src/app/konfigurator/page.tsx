import { Metadata } from 'next';
import KonfiguratorClient from './components/KonfiguratorClient';

// ✅ SEO OPTIMIZATION: Comprehensive metadata for configurator
export const metadata: Metadata = {
  title: 'Hausfinder Konfigurator | NEST Haus - Modulares Traumhaus konfigurieren',
  description: 'Konfigurieren Sie Ihr individuelles NEST Haus mit unserem interaktiven 3D-Konfigurator. Modulare Häuser von 80m² bis 160m² mit verschiedenen Fassaden, Innenausstattung und Photovoltaik-Optionen.',
  keywords: 'NEST Haus Konfigurator, modulare Häuser, Hausbau Konfigurator, nachhaltiges Bauen, Fertighaus, Holzhaus, Photovoltaik, Österreich',
  openGraph: {
    title: 'NEST Haus Konfigurator - Ihr modulares Traumhaus',
    description: 'Gestalten Sie Ihr NEST Haus nach Ihren Wünschen. Von 80m² bis 160m² mit individueller Ausstattung.',
    type: 'website',
    url: 'https://nest-haus.com/konfigurator',
    images: [
      {
        url: '/api/images?path=104-NEST-Haus-Konfigurator-75-Holzfassade-Ansicht',
        width: 1200,
        height: 675,
        alt: 'NEST Haus Konfigurator - Modulares Haus konfigurieren'
      }
    ],
    siteName: 'NEST Haus'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEST Haus Konfigurator - Modulares Traumhaus',
    description: 'Konfigurieren Sie Ihr individuelles NEST Haus mit unserem interaktiven Konfigurator.',
    images: ['/api/images?path=104-NEST-Haus-Konfigurator-75-Holzfassade-Ansicht']
  },
  alternates: {
    canonical: 'https://nest-haus.com/konfigurator'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

// ✅ STRUCTURED DATA: JSON-LD for enhanced SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "NEST Haus Konfigurator",
  "description": "Interaktiver Konfigurator für modulare NEST Häuser",
  "url": "https://nest-haus.com/konfigurator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": "155500",
    "highPrice": "289900",
    "description": "NEST Haus modulare Häuser von 80m² bis 160m²"
  },
  "provider": {
    "@type": "Organization",
    "name": "NEST Haus",
    "url": "https://nest-haus.com"
  }
};

// Server Component - Optimized for SEO and initial loading
export default function KonfiguratorPage() {
  return (
    <>
      {/* ✅ SEO: Structured Data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* ✅ PERFORMANCE: Client component handles all interactions */}
      <KonfiguratorClient />
    </>
  );
} 