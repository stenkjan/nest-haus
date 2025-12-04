/**
 * Dynamic Price Schema Generation for SEO
 * Generates Schema.org structured data for product pricing
 */

import { Configuration } from "@/store/configuratorStore";
import { PriceCalculator as _PriceCalculator } from "@/app/konfigurator/core/PriceCalculator";
import { PriceUtils } from "@/app/konfigurator/core/PriceUtils";
import type { CartItem, ConfigurationCartItem } from "@/store/cartStore";

export interface PriceSchemaOptions {
    includeOffers?: boolean;
    includeVariants?: boolean;
    includePriceRange?: boolean;
}

/**
 * Generate product schema with current pricing
 */
export function generateProductPriceSchema(
    configuration?: Configuration,
    options: PriceSchemaOptions = {}
): object {
    const baseSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "NEST-Haus Modulares Bausystem",
        description: "Individuell konfigurierbare modulare Häuser für nachhaltiges Wohnen",
        brand: {
            "@type": "Brand",
            name: "NEST-Haus",
        },
        manufacturer: {
            "@type": "Organization",
            name: "NEST-Haus",
            url: "https://nest-haus.at",
        },
        category: "Modular Housing",
    };

    // Add pricing information if configuration is available
    if (configuration && configuration.nest) {
        const totalPrice = configuration.totalPrice || 0;
        const nestModel = configuration.nest.value;
        const geschossdeckeQuantity = configuration.geschossdecke?.quantity || 0;

        // Calculate price per m²
        const adjustedArea = PriceUtils.getAdjustedNutzflaeche(nestModel, geschossdeckeQuantity);
        const pricePerSqm = adjustedArea > 0 ? Math.round(totalPrice / adjustedArea) : 0;

        const offers: object = {
            "@type": "Offer",
            price: totalPrice.toString(),
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            seller: {
                "@type": "Organization",
                name: "NEST-Haus",
                url: "https://nest-haus.at",
            },
            additionalProperty: [
                {
                    "@type": "PropertyValue",
                    name: "Nutzfläche",
                    value: `${adjustedArea}m²`,
                },
                {
                    "@type": "PropertyValue",
                    name: "Preis pro m²",
                    value: `${pricePerSqm}€/m²`,
                },
                {
                    "@type": "PropertyValue",
                    name: "Nest Modell",
                    value: configuration.nest.name,
                },
            ],
        };

        if (options.includeVariants && configuration.gebaeudehuelle) {
            (offers as Record<string, unknown>).itemOffered = {
                "@type": "Product",
                name: `${configuration.nest.name} - ${configuration.gebaeudehuelle.name}`,
                model: nestModel,
                additionalProperty: [
                    {
                        "@type": "PropertyValue",
                        name: "Gebäudehülle",
                        value: configuration.gebaeudehuelle.name,
                    },
                    {
                        "@type": "PropertyValue",
                        name: "Innenverkleidung",
                        value: configuration.innenverkleidung?.name || "Standard",
                    },
                ],
            };
        }

        return {
            ...baseSchema,
            offers: options.includeOffers !== false ? offers : undefined,
        };
    }

    // Default price range for unconfigured products
    if (options.includePriceRange !== false) {
        return {
            ...baseSchema,
            offers: {
                "@type": "AggregateOffer",
                priceCurrency: "EUR",
                lowPrice: "213032",
                highPrice: "450000",
                availability: "https://schema.org/InStock",
                offerCount: "5",
                seller: {
                    "@type": "Organization",
                    name: "NEST-Haus",
                    url: "https://nest-haus.at",
                },
            },
        };
    }

    return baseSchema;
}

/**
 * Generate shopping cart schema with current items
 */
export function generateShoppingCartSchema(
    items: (CartItem | ConfigurationCartItem)[],
    totalPrice: number
): object {
    const cartItems = items.map((item, index) => {
        const price = "totalPrice" in item ? item.totalPrice : item.price;

        return {
            "@type": "Product",
            name: "totalPrice" in item && item.nest
                ? `${item.nest.name} Konfiguration`
                : "name" in item ? item.name : "NEST-Haus Konfiguration",
            offers: {
                "@type": "Offer",
                price: price.toString(),
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
            },
            position: index + 1,
        };
    });

    return {
        "@context": "https://schema.org",
        "@type": "ShoppingCart",
        name: "NEST-Haus Warenkorb",
        description: "Modulhaus Konfiguration Warenkorb",
        url: "https://nest-haus.at/warenkorb",
        totalPrice: totalPrice.toString(),
        priceCurrency: "EUR",
        numberOfItems: items.length,
        itemListElement: cartItems,
    };
}

/**
 * Generate configurator application schema
 */
export function generateConfiguratorSchema(currentPrice?: number): object {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "NEST-Haus Konfigurator",
        description: "Interaktiver Konfigurator für modulare Häuser",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web Browser",
        url: "https://nest-haus.at/konfigurator",
        offers: currentPrice ? {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
            description: "Kostenlose Nutzung des Konfigurators",
            availability: "https://schema.org/InStock",
        } : undefined,
        featureList: [
            "Modulare Hausplanung",
            "Echtzeit Preisberechnung",
            "3D Vorschau",
            "Materialauswahl",
            "Energieeffizienz Berechnung",
        ],
    };
}
