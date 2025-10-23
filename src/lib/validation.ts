/**
 * Form Validation Utilities
 * Permissive validation patterns for better UX
 */

/**
 * Email validation (permissive but secure)
 * Accepts most valid email formats while rejecting obvious errors
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    return emailRegex.test(email.trim());
}

/**
 * Phone validation (permissive - Austrian + International)
 * Accepts various phone number formats with spaces, hyphens, parentheses
 */
export const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}[-\s\.]?[0-9]{0,9}$/;

export function validatePhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;
    const cleaned = phone.trim();
    if (cleaned.length < 6) return false; // Minimum reasonable length
    // Remove all non-digits except leading + to count actual digits
    const digitsOnly = cleaned.replace(/[^\d+]/g, '').replace(/\+/, '');
    if (digitsOnly.length < 6 || digitsOnly.length > 15) return false;
    return phoneRegex.test(cleaned);
}

/**
 * Address validation (permissive)
 * Accepts addresses with common punctuation
 */
export const addressRegex = /^[a-zA-Z0-9\säöüÄÖÜß,.\-]{3,}$/;

export function validateAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    const cleaned = address.trim();
    if (cleaned.length < 3) return false;
    return addressRegex.test(cleaned);
}

/**
 * Name validation (permissive)
 * Supports international names with umlauts and common punctuation
 */
export const nameRegex = /^[a-zA-ZäöüÄÖÜßàáâãäåæçèéêëìíîïñòóôõöøùúûüýÿ\s'\-]{2,}$/;

export function validateName(name: string): boolean {
    if (!name || typeof name !== 'string') return false;
    const cleaned = name.trim();
    if (cleaned.length < 2) return false;
    return nameRegex.test(cleaned);
}

/**
 * Sanitize input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize message content
 */
export function validateMessage(message: string, maxLength = 5000): boolean {
    if (!message || typeof message !== 'string') return false;
    const cleaned = message.trim();
    return cleaned.length > 0 && cleaned.length <= maxLength;
}

/**
 * Check for potential SQL injection patterns
 * This is a basic check - proper parameterized queries are the primary defense
 */
export function containsSQLInjection(input: string): boolean {
    if (!input || typeof input !== 'string') return false;

    const sqlPatterns = [
        /(\bOR\b|\bAND\b).*=.*=/i,
        /'.*OR.*'.*=/i,  // Catch patterns like ' OR '1'='1
        /UNION.*SELECT/i,
        /INSERT.*INTO/i,
        /DELETE.*FROM/i,
        /DROP.*TABLE/i,
        /';.*--/,
        /'.*OR.*1.*=.*1/i,  // Catch 1' OR 1=1--
        /\/\*.*\*\//,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Comprehensive form data validation
 */
export interface ContactFormData {
    email: string;
    name: string;
    phone?: string;
    message?: string;
    address?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export function validateContactForm(data: ContactFormData): ValidationResult {
    const errors: Record<string, string> = {};

    // Email validation (required)
    if (!data.email) {
        errors.email = 'E-Mail-Adresse ist erforderlich';
    } else if (!validateEmail(data.email)) {
        errors.email = 'Ungültige E-Mail-Adresse';
    } else if (containsSQLInjection(data.email)) {
        errors.email = 'Ungültige Zeichen in E-Mail-Adresse';
    }

    // Name validation (required)
    if (!data.name) {
        errors.name = 'Name ist erforderlich';
    } else if (!validateName(data.name)) {
        errors.name = 'Ungültiger Name (mindestens 2 Zeichen)';
    } else if (containsSQLInjection(data.name)) {
        errors.name = 'Ungültige Zeichen im Namen';
    }

    // Phone validation (optional)
    if (data.phone && data.phone.trim()) {
        if (!validatePhone(data.phone)) {
            errors.phone = 'Ungültige Telefonnummer';
        } else if (containsSQLInjection(data.phone)) {
            errors.phone = 'Ungültige Zeichen in Telefonnummer';
        }
    }

    // Message validation (optional)
    if (data.message && data.message.trim()) {
        if (!validateMessage(data.message)) {
            errors.message = 'Nachricht ist zu lang (maximal 5000 Zeichen)';
        } else if (containsSQLInjection(data.message)) {
            errors.message = 'Ungültige Zeichen in Nachricht';
        }
    }

    // Address validation (optional)
    if (data.address && data.address.trim()) {
        if (!validateAddress(data.address)) {
            errors.address = 'Ungültige Adresse (mindestens 3 Zeichen)';
        } else if (containsSQLInjection(data.address)) {
            errors.address = 'Ungültige Zeichen in Adresse';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

