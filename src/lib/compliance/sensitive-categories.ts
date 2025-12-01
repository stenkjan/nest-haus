/**
 * Sensitive Categories Compliance Guard
 * 
 * This module ensures compliance with Google's sensitive categories restrictions.
 * 
 * According to Google Ads policies, you CANNOT use personalized advertising or
 * Google Signals if your site collects sensitive category data:
 * - Health/medical information
 * - Financial/payment information (beyond transaction processing)
 * - Religious/political affiliations
 * - Sexual orientation or gender identity
 * - Race or ethnicity
 * - Trade union membership
 * - Criminal history
 * 
 * NEST-Haus Compliance Status:
 * ✅ We ONLY collect: name, email, phone, address, property details
 * ✅ This is standard B2B contact information, NOT sensitive categories
 * ✅ Safe to use Google Signals and personalized advertising
 */

/**
 * List of data points we collect (for compliance documentation)
 */
export const COLLECTED_DATA_POINTS = {
  contact: ["name", "lastName", "email", "phone"],
  property: [
    "address",
    "addressLine2",
    "city",
    "state",
    "postalCode",
    "country",
    "propertyNumber",
    "cadastralCommunity",
  ],
  configuration: [
    "nestType",
    "modules",
    "gebaeudehuelle",
    "innenverkleidung",
    "fenster",
    "pvanlage",
    // ... other house configuration options
  ],
  preferences: [
    "preferredContact",
    "bestTimeToCall",
    "appointmentDate",
    "message",
  ],
} as const;

/**
 * Sensitive categories we explicitly DO NOT collect
 */
export const SENSITIVE_CATEGORIES_NOT_COLLECTED = [
  "health_information",
  "medical_history",
  "financial_records",
  "credit_information",
  "religious_beliefs",
  "political_affiliations",
  "sexual_orientation",
  "gender_identity",
  "racial_ethnic_origin",
  "trade_union_membership",
  "criminal_history",
  "genetic_data",
  "biometric_data",
] as const;

/**
 * Check if a field name might contain sensitive category data
 * Returns true if field should be excluded from Google Signals
 */
export function isSensitiveField(fieldName: string): boolean {
  const sensitiveKeywords = [
    "health",
    "medical",
    "financial",
    "religion",
    "political",
    "sexual",
    "race",
    "ethnic",
    "union",
    "criminal",
    "genetic",
    "biometric",
    "ssn",
    "credit",
    "bank",
    "diagnosis",
  ];

  const lowerField = fieldName.toLowerCase();
  return sensitiveKeywords.some((keyword) => lowerField.includes(keyword));
}

/**
 * Compliance declaration for Google Analytics settings
 */
export const GOOGLE_SIGNALS_COMPLIANCE = {
  collectsSensitiveCategories: false,
  dataTypes: "B2B contact information and house configuration preferences",
  legalBasis: "User consent via cookie banner",
  retentionPeriod: "14 months (GA4 default)",
  userRights:
    "Users can access and delete their data via Meine Aktivitäten (myactivity.google.com)",
} as const;

/**
 * Generate compliance statement for privacy policy
 */
export function getComplianceStatement(): string {
  return `
NEST-Haus verwendet Google Analytics mit aktivierten Google Signals zur Erfassung 
demografischer Daten und für Remarketing-Zwecke. Wir erfassen KEINE sensiblen 
Kategorien gemäß den Google Ads-Richtlinien, einschließlich:

- Gesundheits- oder Finanzinformationen
- Religiöse oder politische Überzeugungen
- Sexuelle Orientierung oder Geschlechtsidentität
- Ethnische Herkunft oder Rassenzugehörigkeit

Wir erfassen ausschließlich:
- Standard-Kontaktdaten (Name, E-Mail, Telefon, Adresse)
- Hausbau-Konfigurationsdaten (Modulwahl, Ausstattungsoptionen)
- Grundstücksinformationen (Adresse, Katasterangaben)

Nutzer können über "Meine Aktivitäten" (myactivity.google.com) auf diese Daten 
zugreifen und sie löschen.
  `.trim();
}

export default GOOGLE_SIGNALS_COMPLIANCE;

