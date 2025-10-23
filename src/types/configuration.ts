/**
 * Standardized Configuration Types
 * 
 * Provides a consistent interface for configuration data across all entry points:
 * - Contact form
 * - Checkout/cart
 * - Direct configurator
 * - Session tracking
 */

export type ConfigurationSource = 'contact_form' | 'checkout' | 'configurator' | 'session';

export interface StandardizedConfiguration {
    version: '1.0';
    source: ConfigurationSource;
    timestamp: number;
    sessionId: string;

    // Single configuration (from configurator or contact form)
    configuration?: {
        nest?: string;
        gebaeudehuelle?: string;
        innenverkleidung?: string;
        fussboden?: string;
        pvanlage?: string;
        fenster?: string;
        planungspaket?: string;
        bodenaufbau?: string;
        geschossdecke?: string;
        grundstueckscheck?: string;
        [key: string]: string | undefined; // Allow additional fields
    };

    // Multiple configurations (from cart/checkout)
    items?: Array<{
        id: string;
        configuration: Record<string, string>;
        totalPrice: number;
        priceBreakdown?: Record<string, number>;
    }>;

    // Metadata
    totalPrice: number;
    completionPercentage?: number;
    lastModified?: number;
}

/**
 * Standardize configuration data from various sources into a consistent format
 */
export function standardizeConfiguration(
    data: unknown,
    source: ConfigurationSource,
    sessionId: string
): StandardizedConfiguration {
    const timestamp = Date.now();

    // Handle null or undefined
    if (!data || typeof data !== 'object') {
        return {
            version: '1.0',
            source,
            timestamp,
            sessionId,
            totalPrice: 0,
            completionPercentage: 0,
        };
    }

    const rawData = data as Record<string, unknown>;

    // Extract items if they exist (cart/checkout format)
    if (Array.isArray(rawData.items)) {
        const items = rawData.items.map((item: unknown) => {
            if (typeof item === 'object' && item !== null) {
                const itemData = item as Record<string, unknown>;
                return {
                    id: String(itemData.id || Math.random().toString(36).substring(2)),
                    configuration: extractConfiguration(itemData.configuration || itemData),
                    totalPrice: Number(itemData.totalPrice || itemData.price || 0),
                    priceBreakdown: extractPriceBreakdown(itemData.priceBreakdown),
                };
            }
            return {
                id: Math.random().toString(36).substring(2),
                configuration: {},
                totalPrice: 0,
            };
        });

        const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

        return {
            version: '1.0',
            source,
            timestamp,
            sessionId,
            items,
            totalPrice,
            lastModified: Number(rawData.lastModified || timestamp),
        };
    }

    // Single configuration format
    const configuration = extractConfiguration(rawData);
    const totalPrice = Number(rawData.totalPrice || 0);
    const completionPercentage = calculateCompletionPercentage(configuration);

    return {
        version: '1.0',
        source,
        timestamp,
        sessionId,
        configuration,
        totalPrice,
        completionPercentage,
        lastModified: Number(rawData.lastModified || rawData.timestamp || timestamp),
    };
}

/**
 * Extract configuration object from various formats
 */
function extractConfiguration(data: unknown): Record<string, string> {
    if (!data || typeof data !== 'object') {
        return {};
    }

    const result: Record<string, string> = {};
    const rawData = data as Record<string, unknown>;

    // Known configurator fields
    const knownFields = [
        'nest',
        'nestType',
        'gebaeudehuelle',
        'innenverkleidung',
        'fussboden',
        'pvanlage',
        'fenster',
        'planungspaket',
        'bodenaufbau',
        'geschossdecke',
        'grundstueckscheck',
    ];

    // Extract known fields
    knownFields.forEach((field) => {
        const value = rawData[field];
        if (value && typeof value === 'string') {
            result[field] = value;
        }
    });

    // Also check for configuration sub-object
    if (rawData.configuration && typeof rawData.configuration === 'object') {
        const configObj = rawData.configuration as Record<string, unknown>;
        Object.entries(configObj).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
                result[key] = value;
            }
        });
    }

    return result;
}

/**
 * Extract price breakdown if available
 */
function extractPriceBreakdown(data: unknown): Record<string, number> | undefined {
    if (!data || typeof data !== 'object') {
        return undefined;
    }

    const result: Record<string, number> = {};
    const rawData = data as Record<string, unknown>;

    Object.entries(rawData).forEach(([key, value]) => {
        if (typeof value === 'number') {
            result[key] = value;
        } else if (typeof value === 'string') {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
                result[key] = parsed;
            }
        }
    });

    return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Calculate configuration completion percentage
 */
function calculateCompletionPercentage(configuration: Record<string, string>): number {
    const requiredFields = ['nest', 'gebaeudehuelle', 'innenverkleidung', 'fussboden'];
    const optionalFields = ['pvanlage', 'fenster', 'planungspaket'];

    const completedRequired = requiredFields.filter((field) => configuration[field]).length;
    const completedOptional = optionalFields.filter((field) => configuration[field]).length;

    const requiredWeight = 0.7; // 70% of completion is required fields
    const optionalWeight = 0.3; // 30% is optional fields

    const requiredPercentage = (completedRequired / requiredFields.length) * requiredWeight;
    const optionalPercentage = (completedOptional / optionalFields.length) * optionalWeight;

    return Math.round((requiredPercentage + optionalPercentage) * 100);
}

/**
 * Validate standardized configuration
 */
export function validateConfiguration(config: StandardizedConfiguration): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Version check
    if (config.version !== '1.0') {
        errors.push(`Unsupported version: ${config.version}`);
    }

    // Source check
    const validSources: ConfigurationSource[] = ['contact_form', 'checkout', 'configurator', 'session'];
    if (!validSources.includes(config.source)) {
        errors.push(`Invalid source: ${config.source}`);
    }

    // SessionId check
    if (!config.sessionId || typeof config.sessionId !== 'string') {
        errors.push('SessionId is required');
    }

    // Timestamp check
    if (!config.timestamp || typeof config.timestamp !== 'number') {
        errors.push('Timestamp is required');
    }

    // Price check
    if (typeof config.totalPrice !== 'number' || config.totalPrice < 0) {
        errors.push('Total price must be a non-negative number');
    }

    // Either configuration or items must be present
    if (!config.configuration && !config.items) {
        errors.push('Either configuration or items must be provided');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Helper to extract configuration from customer inquiry database record
 */
export function extractConfigurationFromInquiry(configurationData: unknown): StandardizedConfiguration | null {
    if (!configurationData || typeof configurationData !== 'object') {
        return null;
    }

    const data = configurationData as Record<string, unknown>;

    // If it's already standardized
    if (data.version === '1.0' && data.source && data.sessionId) {
        return data as StandardizedConfiguration;
    }

    // Try to standardize it
    return standardizeConfiguration(
        data,
        'session', // Default source for database records
        String(data.sessionId || 'unknown')
    );
}

