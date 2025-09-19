import type { Metadata } from "next";

// Base configuration for SEO
export const SEO_CONFIG = {
    baseUrl: "https://nest-haus.at",
    siteName: "NEST-Haus",
    defaultTitle: "NEST-Haus | Modulare Häuser & Nachhaltiges Bauen",
    defaultDescription: "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar.",
    defaultKeywords: "modulhaus, fertighaus, nachhaltiges bauen, energieeffizient, Österreich, hausbau konfigurator",
    locale: "de_DE",
    twitterHandle: "@nest-haus",
    organization: {
        name: "NEST-Haus",
        description: "Modulare Häuser und nachhaltiges Bauen",
        logo: "https://nest-haus.at/logo.png",
        contactPoint: {
            contactType: "customer service",
            availableLanguage: "German",
        },
        address: {
            addressCountry: "AT",
        },
    },
} as const;

// Page-specific SEO configurations
export const PAGE_SEO_CONFIG = {
    home: {
        title: "NEST-Haus | Modulare Häuser & Nachhaltiges Bauen in Österreich",
        description: "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar. Jetzt kostenlos beraten lassen!",
        keywords: "modulhaus, fertighaus, nachhaltiges bauen, energieeffizient, Österreich, hausbau konfigurator, modulare häuser, nachhaltig wohnen",
        priority: 1.0,
        changeFrequency: "weekly" as const,
        ogImage: "/images/nest-haus-hero.jpg",
        twitterImage: "/images/nest-haus-hero-twitter.jpg",
    },
    konfigurator: {
        title: "Haus Konfigurator | NEST-Haus Modulare Häuser",
        description: "Konfigurieren Sie Ihr Traumhaus mit unserem interaktiven Konfigurator. Nachhaltig, individuell, zukunftsorientiert. Jetzt starten!",
        keywords: "haus konfigurator, modulhaus planen, fertighaus konfigurator, hausbau planer, individuelles haus, modulhaus konfiguration",
        priority: 0.9,
        changeFrequency: "weekly" as const,
        ogImage: "/images/konfigurator-og.jpg",
        twitterImage: "/images/konfigurator-twitter.jpg",
    },
    entdecken: {
        title: "Entdecken Sie NEST-Haus | Innovation im modularen Bauen",
        description: "Erfahren Sie mehr über unsere innovativen modularen Bausysteme und nachhaltigen Lösungen. Technologie trifft auf Nachhaltigkeit.",
        keywords: "modulhaus entdecken, nachhaltiges bauen, innovation, modulare architektur, energieeffizient, umweltfreundlich",
        priority: 0.8,
        changeFrequency: "monthly" as const,
        ogImage: "/images/entdecken-og.jpg",
        twitterImage: "/images/entdecken-twitter.jpg",
    },
    warenkorb: {
        title: "Warenkorb | NEST-Haus Modulhaus Konfiguration",
        description: "Ihre modulare Hauskonfiguration im Warenkorb. Überprüfen Sie Ihre Auswahl und starten Sie den Bestellprozess.",
        keywords: "warenkorb, modulhaus bestellen, hausbau bestellung, konfiguration überprüfen, bestellprozess",
        priority: 0.7,
        changeFrequency: "weekly" as const,
        ogImage: "/images/warenkorb-og.jpg",
        twitterImage: "/images/warenkorb-twitter.jpg",
    },
    kontakt: {
        title: "Kontakt | NEST-Haus Beratung & Support",
        description: "Kontaktieren Sie unsere Experten für eine kostenlose Beratung zu Ihrem modularen Traumhaus. Wir helfen Ihnen gerne weiter.",
        keywords: "kontakt, beratung, support, modulhaus beratung, kostenlose beratung, experten kontakt",
        priority: 0.8,
        changeFrequency: "monthly" as const,
        ogImage: "/images/kontakt-og.jpg",
        twitterImage: "/images/kontakt-twitter.jpg",
    },
    warumWir: {
        title: "Warum Wir | NEST-Haus Vision & Mission",
        description: "Die Vision und Motivation hinter NEST-Haus modularen Bausystemen. Nachhaltigkeit, Innovation und Individualität.",
        keywords: "warum wir, vision, mission, nachhaltigkeit, innovation, individualität, modulhaus philosophie",
        priority: 0.6,
        changeFrequency: "monthly" as const,
        ogImage: "/images/warum-wir-og.jpg",
        twitterImage: "/images/warum-wir-twitter.jpg",
    },
    deinPart: {
        title: "Dein Part | Ihre Rolle beim NEST-Haus Bauprozess",
        description: "Deine Rolle und dein Beitrag beim NEST-Haus Bauprozess - von der Planung bis zur Realisierung. Gemeinsam zum Traumhaus.",
        keywords: "dein part, kundenrolle, bauprozess, planung, realisierung, mitgestaltung, kundenbeteiligung",
        priority: 0.5,
        changeFrequency: "monthly" as const,
        ogImage: "/images/dein-part-og.jpg",
        twitterImage: "/images/dein-part-twitter.jpg",
    },
    unserPart: {
        title: "Unser Part | NEST-Haus Service & Expertise",
        description: "Unser Service und unsere Expertise für Ihren modularen Hausbau. Professionelle Begleitung von der Idee bis zum Einzug.",
        keywords: "unser part, service, expertise, hausbau service, professionelle begleitung, modulhaus service",
        priority: 0.5,
        changeFrequency: "monthly" as const,
        ogImage: "/images/unser-part-og.jpg",
        twitterImage: "/images/unser-part-twitter.jpg",
    },
    showcase: {
        title: "Showcase | NEST-Haus Projekte & Referenzen",
        description: "Entdecken Sie unsere realisierten Projekte und Referenzen. Modulare Häuser, die inspiriert und begeistert.",
        keywords: "showcase, projekte, referenzen, realisierte häuser, modulhaus projekte, referenzprojekte",
        priority: 0.6,
        changeFrequency: "monthly" as const,
        ogImage: "/images/showcase-og.jpg",
        twitterImage: "/images/showcase-twitter.jpg",
    },
    datenschutz: {
        title: "Datenschutz | NEST-Haus Datenschutzerklärung",
        description: "Datenschutzerklärung von NEST-Haus. Informationen zum Umgang mit Ihren personenbezogenen Daten.",
        keywords: "datenschutz, datenschutzerklärung, privatsphäre, datenschutz bestimmungen",
        priority: 0.3,
        changeFrequency: "yearly" as const,
        ogImage: "/images/datenschutz-og.jpg",
        twitterImage: "/images/datenschutz-twitter.jpg",
    },
    impressum: {
        title: "Impressum | NEST-Haus Kontaktdaten & Rechtliches",
        description: "Impressum von NEST-Haus mit Kontaktdaten und rechtlichen Informationen.",
        keywords: "impressum, kontakt, rechtliches, unternehmensdaten, kontaktinformationen",
        priority: 0.3,
        changeFrequency: "yearly" as const,
        ogImage: "/images/impressum-og.jpg",
        twitterImage: "/images/impressum-twitter.jpg",
    },
    agb: {
        title: "AGB | NEST-Haus Allgemeine Geschäftsbedingungen",
        description: "Allgemeine Geschäftsbedingungen von NEST-Haus für modulare Hausbau-Services.",
        keywords: "agb, allgemeine geschäftsbedingungen, vertragsbedingungen, rechtliches",
        priority: 0.3,
        changeFrequency: "yearly" as const,
        ogImage: "/images/agb-og.jpg",
        twitterImage: "/images/agb-twitter.jpg",
    },
} as const;

// Type definitions
export type PageKey = keyof typeof PAGE_SEO_CONFIG;
export type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface CustomMetadata {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    twitterImage?: string;
    canonical?: string;
    noIndex?: boolean;
}

// Main function to generate dynamic metadata
export function generatePageMetadata(
    pageKey: PageKey,
    customData?: CustomMetadata
): Metadata {
    const pageConfig = PAGE_SEO_CONFIG[pageKey];
    const baseConfig = SEO_CONFIG;

    // Use custom data or fallback to page config
    const title = customData?.title || pageConfig.title;
    const description = customData?.description || pageConfig.description;
    const keywords = customData?.keywords || pageConfig.keywords;
    const ogImage = customData?.ogImage || pageConfig.ogImage;
    const twitterImage = customData?.twitterImage || pageConfig.twitterImage;
    const canonical = customData?.canonical || `${baseConfig.baseUrl}/${pageKey === 'home' ? '' : pageKey}`;

    return {
        title,
        description,
        keywords,
        authors: [{ name: baseConfig.organization.name }],
        creator: baseConfig.organization.name,
        publisher: baseConfig.organization.name,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(baseConfig.baseUrl),
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: baseConfig.siteName,
            locale: baseConfig.locale,
            type: "website",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [twitterImage],
            creator: baseConfig.twitterHandle,
        },
        robots: {
            index: !customData?.noIndex,
            follow: true,
            googleBot: {
                index: !customData?.noIndex,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

// Helper function to generate sitemap data
export function generateSitemapData() {
    const baseUrl = SEO_CONFIG.baseUrl;
    const now = new Date();

    return Object.entries(PAGE_SEO_CONFIG).map(([key, config]) => ({
        url: key === 'home' ? baseUrl : `${baseUrl}/${key}`,
        lastModified: now,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
    }));
}

// Helper function to generate structured data
export function generateStructuredData(pageKey: PageKey, customData?: CustomMetadata) {
    const pageConfig = PAGE_SEO_CONFIG[pageKey];
    const baseConfig = SEO_CONFIG;

    const baseSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: pageConfig.title,
        description: pageConfig.description,
        url: `${baseConfig.baseUrl}/${pageKey === 'home' ? '' : pageKey}`,
        isPartOf: {
            "@type": "WebSite",
            name: baseConfig.siteName,
            url: baseConfig.baseUrl,
        },
        about: {
            "@type": "Organization",
            name: baseConfig.organization.name,
            description: baseConfig.organization.description,
        },
    };

    // Add page-specific structured data
    switch (pageKey) {
        case 'konfigurator':
            return {
                ...baseSchema,
                "@type": "SoftwareApplication",
                applicationCategory: "DesignApplication",
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "EUR",
                    availability: "https://schema.org/InStock",
                },
            };

        case 'warenkorb':
            return {
                ...baseSchema,
                "@type": "ShoppingCart",
                name: "NEST-Haus Warenkorb",
            };

        case 'kontakt':
            return {
                ...baseSchema,
                "@type": "ContactPage",
                mainEntity: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    availableLanguage: "German",
                },
            };

        default:
            return baseSchema;
    }
}
