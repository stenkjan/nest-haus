import type { Metadata } from "next";

// Base configuration for SEO
export const SEO_CONFIG = {
    baseUrl: "https://nest-haus.at",
    siteName: "®Hoam",
    defaultTitle: "®Hoam | Wohne wie du willst",
    defaultDescription: "Entdecken Sie ®Hoam modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar.",
    defaultKeywords: "modulhaus, fertighaus, nachhaltiges bauen, energieeffizient, Österreich, hausbau konfigurator",
    locale: "de_DE",
    twitterHandle: "@hoam",
    organization: {
        name: "®Hoam",
        description: "Weil nur du weißt, wie du richtig wohnst.",
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
        title: "®Hoam-Haus | Wohne wie du willst",
        description: "Das erste Haus der Welt, welches sich an dein Leben anpasst, nicht umgekehrt. Deine Atmosphäre, deine Vorstellungen. Weil nur du weißt, wie du richtig wohnst.",
        keywords: "modulhaus, fertighaus, nachhaltiges bauen, energieeffizient, Österreich, hausbau konfigurator, modulare häuser, nachhaltig wohnen",
        priority: 1.0,
        changeFrequency: "weekly" as const,
        ogImage: "/images/7-NEST-Haus-Innenperspektive-Kalkstein-Holz-Verglasung-Stirnseite-og.jpg",
        twitterImage: "/images/7-NEST-Haus-Innenperspektive-Kalkstein-Holz-Verglasung-Stirnseite-og.jpg",
    },
    konfigurator: {
        title: "Konfigurator | ®Hoam online konfigurieren & Preis berechnen",
        description: "®Hoam online konfigurieren: Interaktiver Konfigurator mit Echtzeit-Preisberechnung. Module wählen, Fassade gestalten, Ausstattung planen. Jetzt starten!",
        keywords: "haus konfigurator online, modulhaus konfigurieren, preis berechnen, interaktiver konfigurator, modulhaus planen, hoam konfigurator, hausbau planer österreich, echtzeit preise",
        priority: 0.9,
        changeFrequency: "weekly" as const,
        ogImage: "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
        twitterImage: "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
    },
    warenkorb: {
        title: "Warenkorb | Konzept-Check bestellen & Konfiguration einreichen",
        description: "®Hoam Konfiguration überprüfen und Konzept-Check bestellen. Planungspakete wählen, Termin vereinbaren, Bestellung abschließen. Jetzt starten!",
        keywords: "konzept-check bestellen, planungspaket wählen, konfiguration überprüfen, hoam warenkorb, bestellung abschließen, modulhaus bestellen, hausbau bestellung österreich",
        priority: 0.7,
        changeFrequency: "weekly" as const,
        ogImage: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
        twitterImage: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    },
    kontakt: {
        title: "Kontakt | Termin vereinbaren & Grundstücksanalyse anfragen",
        description: "Vereinbare jetzt deinen Termin bei Nest-Haus in Graz, Zösenberg 51. Kostenlose Erstberatung, Grundstücksanalyse Anfrage. Wir helfen gerne weiter.",
        keywords: "nest haus kontakt, termin vereinbaren, beratung graz, zösenberg 51 graz, grundstücksanalyse anfrage, modulhaus beratung österreich, nest haus termin",
        priority: 0.8,
        changeFrequency: "monthly" as const,
        ogImage: "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
        twitterImage: "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
    },
    warumWir: {
        title: "Warum Wir | Nest-Haus Team & Vision",
        description: "Die NEST Vision: Wo Effizienz auf Architektur trifft. Unser Team mit DI Markus Schmoltner vereint Innovation und jahrelange Erfahrung. Verlässlichkeit, auf die du bauen kannst.",
        keywords: "nest vision, nest haus team, markus schmoltner, verlässlichkeit, innovation erfahrung, warum nest haus, modulhaus philosophie, nest team österreich",
        priority: 0.6,
        changeFrequency: "monthly" as const,
        ogImage: "/images/335-nest-haus-team-markus-schmoltner.png",
        twitterImage: "/images/335-nest-haus-team-markus-schmoltner.png",
    },
    "hoam": {
        title: "®Hoam | Was ist ®Hoam?",
        description: "Hoam 80 ab €213.000, Hoam 120 ab €296.000, Hoam 160 ab €380.000. Individuell konfigurierbar, transportabel und erweiterbar. Modulares Traumhaus.",
        keywords: "hoam preise, hoam 80, hoam 120, hoam 160, modulhaus kosten, individuell konfigurierbar, transportabel, modulhaus österreich, haus erweitern",
        priority: 0.8,
        changeFrequency: "monthly" as const,
        ogImage: "/images/7-NEST-Haus-Innenperspektive-Kalkstein-Holz-Verglasung-Stirnseite.jpg",
        twitterImage: "/images/7-NEST-Haus-Innenperspektive-Kalkstein-Holz-Verglasung-Stirnseite.jpg",
    },
    "hoam-system": {
        title: "Hoam System | Modulares bauen",
        description: "Das NEST-System: Module bis 6m hoch, 8m breit, beliebig erweiterbar. Nachhaltige Materialien, individuelle Fenster & Türen, flexible Haustechnik. Modulbau neu gedacht.",
        keywords: "hoam system, modulares bausystem, 6 meter hoch, 8 meter breit, modulhaus materialien, fenster türen individuell, haustechnik, modulbau österreich, nachhaltige materialien",
        priority: 0.7,
        changeFrequency: "monthly" as const,
        ogImage: "/images/13-NEST-Haus-System-Hausbau-Modulbau-Serienproduktion-Modulbau-flexibel-Holzbau.png",
        twitterImage: "/images/13-NEST-Haus-System-Hausbau-Modulbau-Serienproduktion-Modulbau-flexibel-Holzbau.png",
    },
    "konzept-check": {
        title: "Konzept-Check | Grundstücksanalyse & Entwurf",
        description: "Konzept-Check für ®Hoam: Rechtssichere Grundstücksanalyse, Bebauungsmöglichkeiten, individueller Entwurf. Fertig in 4-6 Wochen. Jetzt bestellen.",
        keywords: "konzept-check, grundstücksanalyse, rechtssicher bauen, bebauungsmöglichkeiten, konzept-check 3000 euro, nest haus planung, grundstück check, bauvorhaben analyse",
        priority: 0.8,
        changeFrequency: "monthly" as const,
        ogImage: "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
        twitterImage: "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
    },
    showcase: {
        title: "Showcase | Nest-Haus Projekte & Referenzen",
        description: "Entdecken Sie unsere realisierten Projekte und Referenzen. Modulare Häuser, die inspiriert und begeistert.",
        keywords: "showcase, projekte, referenzen, realisierte häuser, modulhaus projekte, referenzprojekte",
        priority: 0.6,
        changeFrequency: "monthly" as const,
        ogImage: "/images/showcase-og.jpg",
        twitterImage: "/images/showcase-twitter.jpg",
    },
    datenschutz: {
        title: "Datenschutz | Nest-Haus Datenschutzerklärung",
        description: "Datenschutzerklärung von Nest-Haus. Informationen zum Umgang mit Ihren personenbezogenen Daten.",
        keywords: "datenschutz, datenschutzerklärung, privatsphäre, datenschutz bestimmungen",
        priority: 0.3,
        changeFrequency: "yearly" as const,
        ogImage: "/images/datenschutz-og.jpg",
        twitterImage: "/images/datenschutz-twitter.jpg",
    },
    impressum: {
        title: "Impressum | Nest-Haus Kontaktdaten & Rechtliches",
        description: "Impressum von Nest-Haus mit Kontaktdaten und rechtlichen Informationen.",
        keywords: "impressum, kontakt, rechtliches, unternehmensdaten, kontaktinformationen",
        priority: 0.3,
        changeFrequency: "yearly" as const,
        ogImage: "/images/impressum-og.jpg",
        twitterImage: "/images/impressum-twitter.jpg",
    },
    agb: {
        title: "AGB | Nest-Haus Allgemeine Geschäftsbedingungen",
        description: "Allgemeine Geschäftsbedingungen von Nest-Haus für modulare Hausbau-Services.",
        keywords: "agb, allgemeine geschäftsbedingungen, vertragsbedingungen, rechtliches",
        priority: 0.3,
        changeFrequency: "yearly" as const,
        ogImage: "/images/agb-og.jpg",
        twitterImage: "/images/agb-twitter.jpg",
    },
    faq: {
        title: "FAQ | Nest-Haus Fragen zu Kosten, Konzept-Check & Bauzeit",
        description: "Häufige Fragen zu Nest-Haus: Was kostet der Konzept-Check? Wie lange dauert der Bau? Unterschied zu Fertighaus & Tiny House? Alle Antworten hier.",
        keywords: "nest haus faq, häufige fragen modulhaus, konzept-check fragen, kosten nest haus, bauzeit dauer, nest haus vs fertighaus, nest haus vs tiny house, modulhaus fragen österreich",
        priority: 0.7,
        changeFrequency: "monthly" as const,
        ogImage: "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
        twitterImage: "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
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
                    // Add secureUrl to help strict scrapers like WhatsApp
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
                name: "Nest-Haus Warenkorb",
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

        case 'showcase':
            return {
                ...baseSchema,
                "@type": "CollectionPage",
                mainEntity: {
                    "@type": "ItemList",
                    name: "Nest-Haus Showcase",
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
        name: "Nest-Haus Modulares Bausystem",
        description: "Nachhaltiges, energieeffizientes modulares Bausystem für individuelles Wohnen",
        brand: {
            "@type": "Brand",
            name: "Nest-Haus",
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
                name: "Kann ich mein Nest-Haus konfigurieren?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Ja, mit unserem interaktiven Konfigurator können Sie Ihr Nest-Haus individuell nach Ihren Wünschen und Bedürfnissen gestalten.",
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

// Configuration interfaces for schema helpers
export interface ProductSchemaConfig {
    name: string;
    description: string;
    category?: string;
    lowPrice?: string;
    highPrice?: string;
    offerCount?: string;
}

export interface ServiceSchemaConfig {
    name: string;
    description: string;
    serviceType: string;
}

export interface AboutSchemaConfig {
    foundingDate?: string;
    mission?: string;
    values?: string[];
}

export interface VideoSchemaConfig {
    name: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
    embedUrl: string;
    uploadDate: string;
    duration: string;
}

// Helper: Generate Product Schema for pages like hoam, hoam-system
export function generatePageProductSchema(config: ProductSchemaConfig): object {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: config.name,
        description: config.description,
        brand: {
            "@type": "Brand",
            name: "Nest-Haus",
        },
        category: config.category || "Modulhäuser",
        ...(config.lowPrice && config.highPrice ? {
            offers: {
                "@type": "AggregateOffer",
                priceCurrency: "EUR",
                lowPrice: config.lowPrice,
                highPrice: config.highPrice,
                offerCount: config.offerCount || "3",
            },
        } : {}),
    };
}

// Helper: Generate Service Schema for pages like konzept-check, hoam-system
export function generatePageServiceSchema(config: ServiceSchemaConfig): object {
    const baseConfig = SEO_CONFIG;

    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: config.name,
        description: config.description,
        provider: {
            "@type": "Organization",
            name: baseConfig.organization.name,
        },
        serviceType: config.serviceType,
        areaServed: {
            "@type": "Country",
            name: "Austria",
        },
    };
}

// Helper: Generate AboutPage Schema for pages like warum-wir
export function generatePageAboutSchema(config: AboutSchemaConfig): object {
    const baseConfig = SEO_CONFIG;

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: baseConfig.organization.name,
        description: baseConfig.organization.description,
        ...(config.foundingDate ? { foundingDate: config.foundingDate } : {}),
        ...(config.mission ? { mission: config.mission } : {}),
        ...(config.values ? { values: config.values } : {}),
        areaServed: {
            "@type": "Country",
            name: "Austria",
        },
    };
}

// Helper: Generate Video Schema for pages with embedded videos
export function generatePageVideoSchema(config: VideoSchemaConfig): object {
    const baseConfig = SEO_CONFIG;

    return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: config.name,
        description: config.description,
        thumbnailUrl: config.thumbnailUrl,
        uploadDate: config.uploadDate,
        contentUrl: config.contentUrl,
        embedUrl: config.embedUrl,
        duration: config.duration,
        publisher: {
            "@type": "Organization",
            name: baseConfig.organization.name,
            logo: {
                "@type": "ImageObject",
                url: `${baseConfig.baseUrl}/images/nest-haus-logo.png`,
            },
        },
    };
}
