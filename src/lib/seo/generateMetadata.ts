import type { Metadata } from "next";

// Base configuration for SEO
export const SEO_CONFIG = {
    baseUrl: "https://nest-haus.at",
    siteName: "NEST-Haus",
    defaultTitle: "Weil nur du weißt, wie du richtig wohnst - Nest Haus",
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
        title: "Weil nur du weißt, wie du richtig wohnst - Nest Haus",
        description: "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar. Jetzt kostenlos beraten lassen!",
        keywords: "modulhaus, fertighaus, nachhaltiges bauen, energieeffizient, Österreich, hausbau konfigurator, modulare häuser, nachhaltig wohnen",
        priority: 1.0,
        changeFrequency: "weekly" as const,
        ogImage: "/images/7-NEST-Haus-Innenperspektive-Kalkstein-Holz-Verglasung-Stirnseite.jpg",
        twitterImage: "/images/7-NEST-Haus-Innenperspektive-Kalkstein-Holz-Verglasung-Stirnseite.jpg",
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
        ogImage: "/images/entwurf-og.jpg",
        twitterImage: "/images/entwurf-twitter.jpg",
    },
    "dein-nest": {
        title: "Dein Nest | NEST-Haus Design für dich gemacht",
        description: "Entdecke dein NEST-Haus: Design für dich gemacht. Modulare Häuser mit individueller Gestaltung und nachhaltiger Bauweise.",
        keywords: "dein nest, nest haus, modulhaus, design, individuell, nachhaltig, modulbau, österreich",
        priority: 0.8,
        changeFrequency: "monthly" as const,
        ogImage: "/images/dein-nest-og.jpg",
        twitterImage: "/images/dein-nest-twitter.jpg",
    },
    "nest-system": {
        title: "Nest System | NEST-Haus Dein modulares Bausystem",
        description: "Das NEST-System: Entdecke unser modulares Bausystem mit individueller Gestaltung, nachhaltigen Materialien und flexibler Architektur für dein Traumhaus.",
        keywords: "nest system, modulbau, bausystem, modulhaus system, nachhaltig bauen, flexible architektur, nest haus system",
        priority: 0.7,
        changeFrequency: "monthly" as const,
        ogImage: "/images/nest-system-og.jpg",
        twitterImage: "/images/nest-system-twitter.jpg",
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
                    // Use absolute URL for WhatsApp and other strict scrapers
                    url: ogImage.startsWith('http') ? ogImage : `${baseConfig.baseUrl}${ogImage}`,
                    // Add secureUrl to help strict scrapers like WhatsApp (must be HTTPS)
                    secureUrl: ogImage.startsWith('http') ? ogImage : `${baseConfig.baseUrl}${ogImage}`,
                    width: 1200,
                    height: 630,
                    alt: title,
                    type: 'image/jpeg',
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [twitterImage.startsWith('http') ? twitterImage : `${baseConfig.baseUrl}${twitterImage}`],
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

// Helper function to generate breadcrumb schema
export function generateBreadcrumbSchema(pageKey: PageKey, customPath?: string[]): object {
    const baseConfig = SEO_CONFIG;
    const breadcrumbItems: Array<{
        "@type": string;
        position: number;
        name: string;
        item: string;
    }> = [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: baseConfig.baseUrl,
            },
        ];

    if (customPath && customPath.length > 0) {
        customPath.forEach((pathName, index) => {
            breadcrumbItems.push({
                "@type": "ListItem",
                position: index + 2,
                name: pathName,
                item: `${baseConfig.baseUrl}/${pathName.toLowerCase().replace(/\s+/g, '-')}`,
            });
        });
    } else if (pageKey !== 'home') {
        const pageConfig = PAGE_SEO_CONFIG[pageKey];
        breadcrumbItems.push({
            "@type": "ListItem",
            position: 2,
            name: pageConfig.title.split('|')[0].trim(),
            item: `${baseConfig.baseUrl}/${pageKey}`,
        });
    }

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
    };
}

// Helper function to generate structured data
export function generateStructuredData(pageKey: PageKey, _customData?: CustomMetadata) {
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

        case 'entdecken':
            return {
                ...baseSchema,
                "@type": "AboutPage",
                mainEntity: {
                    "@type": "Organization",
                    name: baseConfig.organization.name,
                    description: baseConfig.organization.description,
                    url: baseConfig.baseUrl,
                    foundingDate: "2023",
                    industry: "Construction",
                    speciality: "Modular Housing",
                },
            };

        case 'showcase':
            return {
                ...baseSchema,
                "@type": "CollectionPage",
                mainEntity: {
                    "@type": "ItemList",
                    name: "NEST-Haus Showcase",
                    description: "Gallery of modular house designs and configurations",
                    numberOfItems: 8,
                },
            };

        default:
            return baseSchema;
    }
}

// Generate product schema for modular houses
export function generateProductSchema(): object {
    const baseConfig = SEO_CONFIG;

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "NEST-Haus Modulares Bausystem",
        description: "Nachhaltiges, energieeffizientes modulares Bausystem für individuelles Wohnen",
        brand: {
            "@type": "Brand",
            name: "NEST-Haus",
        },
        manufacturer: {
            "@type": "Organization",
            name: baseConfig.organization.name,
            url: baseConfig.baseUrl,
        },
        category: "Modular Housing",
        offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: baseConfig.organization.name,
            },
        },
        additionalProperty: [
            {
                "@type": "PropertyValue",
                name: "Energy Efficiency",
                value: "A+",
            },
            {
                "@type": "PropertyValue",
                name: "Construction Type",
                value: "Modular",
            },
            {
                "@type": "PropertyValue",
                name: "Sustainability",
                value: "Eco-Friendly",
            },
        ],
    };
}

// Generate FAQ schema for common questions
export function generateFAQSchema(): object {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "Was ist ein modulares Haus?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Ein modulares Haus ist ein Gebäude, das aus vorgefertigten Modulen zusammengesetzt wird. Diese Module werden in einer kontrollierten Umgebung hergestellt und dann vor Ort montiert.",
                },
            },
            {
                "@type": "Question",
                name: "Wie nachhaltig sind NEST-Häuser?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "NEST-Häuser sind hochgradig nachhaltig durch energieeffiziente Bauweise, umweltfreundliche Materialien und modulare Konstruktion, die Abfall minimiert.",
                },
            },
            {
                "@type": "Question",
                name: "Kann ich mein NEST-Haus konfigurieren?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Ja, mit unserem interaktiven Konfigurator können Sie Ihr NEST-Haus individuell nach Ihren Wünschen und Bedürfnissen gestalten.",
                },
            },
        ],
    };
}

// Generate local business schema
export function generateLocalBusinessSchema(): object {
    const baseConfig = SEO_CONFIG;

    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: baseConfig.organization.name,
        description: baseConfig.organization.description,
        url: baseConfig.baseUrl,
        address: {
            "@type": "PostalAddress",
            addressCountry: baseConfig.organization.address.addressCountry,
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: "German",
        },
        openingHours: "Mo-Fr 09:00-18:00",
        priceRange: "€€€",
        areaServed: {
            "@type": "Country",
            name: "Austria",
        },
    };
}
