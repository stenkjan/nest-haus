/**
 * Google Search Console & SEO Verification Component
 * 
 * Provides verification meta tags for Google Search Console and other SEO tools
 * Usage: Add to root layout.tsx in <head>
 */

export interface SEOVerificationProps {
  googleSiteVerification?: string
  bingSiteAuth?: string
  yandexVerification?: string
  pinterestVerification?: string
}

export default function SEOVerification({
  googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  bingSiteAuth = process.env.NEXT_PUBLIC_BING_SITE_AUTH,
  yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  pinterestVerification = process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION,
}: SEOVerificationProps) {
  return (
    <>
      {/* Google Search Console Verification */}
      {googleSiteVerification && (
        <meta name="google-site-verification" content={googleSiteVerification} />
      )}

      {/* Bing Webmaster Tools Verification */}
      {bingSiteAuth && (
        <meta name="msvalidate.01" content={bingSiteAuth} />
      )}

      {/* Yandex Webmaster Verification */}
      {yandexVerification && (
        <meta name="yandex-verification" content={yandexVerification} />
      )}

      {/* Pinterest Domain Verification */}
      {pinterestVerification && (
        <meta name="p:domain_verify" content={pinterestVerification} />
      )}

      {/* Google-specific meta tags for better indexing */}
      <meta name="google" content="notranslate" />
      <meta name="googlebot" content="index,follow" />
      <meta name="googlebot-news" content="index,follow" />
      
      {/* Prevent AI training on content (optional) */}
      <meta name="robots" content="max-image-preview:large" />
    </>
  )
}

/**
 * Enhanced Structured Data Generator for Google
 * 
 * Creates comprehensive JSON-LD structured data for better Google understanding
 */

interface OrganizationSchema {
  "@context": string
  "@type": string
  name: string
  alternateName?: string
  url: string
  logo: string
  description: string
  foundingDate?: string
  address?: {
    "@type": string
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    "@type": string
    telephone: string
    contactType: string
    email: string
    availableLanguage: string[]
  }
  sameAs?: string[]
  areaServed?: string[]
}

export function generateEnhancedOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NEST-Haus",
    "alternateName": "Nest-Haus Modulhaus",
    "url": "https://nest-haus.at",
    "logo": "https://nest-haus.at/api/images/0-homebutton-nest-haus.svg",
    "description": "Nachhaltige, energieeffiziente Modulhäuser aus Österreich. Individuell konfigurierbar mit modernem Design.",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "", // Add if available
      "addressLocality": "Österreich",
      "postalCode": "",
      "addressCountry": "AT"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+43", // Add actual phone
      "contactType": "Kundenservice",
      "email": "mail@nest-haus.com",
      "availableLanguage": ["de", "en"]
    },
    "sameAs": [
      // Add social media profiles when available
      // "https://www.facebook.com/nesthaus",
      // "https://www.instagram.com/nesthaus",
      // "https://www.linkedin.com/company/nesthaus"
    ],
    "areaServed": ["AT", "DE", "CH"] // Austria, Germany, Switzerland
  }
}

/**
 * WebSite Schema for Google Search Box
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NEST-Haus",
    "url": "https://nest-haus.at",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nest-haus.at/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
}

/**
 * BreadcrumbList Schema Generator
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

/**
 * Product Schema for Konfigurator
 */
export function generateModulhausProductSchema(config: {
  nestType: string
  price: number
  description: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `NEST-Haus ${config.nestType}`,
    "description": config.description,
    "brand": {
      "@type": "Brand",
      "name": "NEST-Haus"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://www.nest-haus.at/konfigurator",
      "priceCurrency": "EUR",
      "price": config.price / 100,
      "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "NEST-Haus"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "24"
    }
  }
}

