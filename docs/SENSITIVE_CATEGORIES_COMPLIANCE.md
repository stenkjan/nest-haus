# Sensitive Categories Compliance Documentation

## Google Ads Sensitive Categories Policy

According to [Google's Advertising Features Policy](https://support.google.com/analytics/answer/2700409?hl=de), you **CANNOT** use Google Signals or personalized advertising if your website collects sensitive category data.

### Prohibited Sensitive Categories

Google prohibits the use of advertising features if you collect:

1. **Health/Medical Information**
   - Medical conditions, symptoms, diagnoses
   - Prescription information
   - Health insurance details
   - Medical procedures or treatments

2. **Financial Information** (beyond transaction processing)
   - Credit card numbers (full)
   - Bank account details
   - Credit scores
   - Loan applications
   - Income/salary information (detailed)

3. **Religious/Political Affiliations**
   - Religious beliefs or practices
   - Political party membership
   - Voting preferences
   - Donations to religious/political organizations

4. **Sexual Orientation & Gender Identity**
   - Sexual preferences
   - Gender identity
   - Dating preferences

5. **Race & Ethnicity**
   - Racial background
   - Ethnic origin

6. **Trade Union Membership**
   - Labor union affiliations

7. **Criminal History**
   - Criminal records
   - Legal proceedings

---

## NEST-Haus Compliance Status: ✅ COMPLIANT

### What We Collect

NEST-Haus collects **ONLY standard B2B contact information**:

#### Contact Information
- ✅ Name (first and last)
- ✅ Email address
- ✅ Phone number
- ✅ Address (street, city, postal code, country)

#### Property Information
- ✅ Property address
- ✅ Property/parcel number
- ✅ Cadastral community (Katastralgemeinde)

#### House Configuration Preferences
- ✅ House type (module count)
- ✅ Building envelope choice
- ✅ Interior finishing options
- ✅ Window selections
- ✅ Solar panel preferences
- ✅ Other construction options

#### Communication Preferences
- ✅ Preferred contact method
- ✅ Best time to call
- ✅ Appointment date/time
- ✅ General message/notes

### What We DO NOT Collect

- ❌ Health or medical information
- ❌ Financial records (beyond payment processing)
- ❌ Religious beliefs
- ❌ Political affiliations
- ❌ Sexual orientation
- ❌ Gender identity
- ❌ Race or ethnicity
- ❌ Trade union membership
- ❌ Criminal history

---

## Legal Basis

### Why This is NOT Sensitive

NEST-Haus is a **B2B house construction configurator**. The data we collect is:

1. **Standard business contact information** - Required for sales/consultation
2. **Property location data** - Required for construction feasibility checks
3. **Product preferences** - User's house configuration choices
4. **Appointment scheduling** - For consultation bookings

This is **equivalent to** data collected by:
- Real estate agencies (property address, contact info)
- Car configurators (preferences, contact for test drive)
- B2B lead generation forms

### Compliance Declaration

**We declare that:**

1. ✅ We do NOT collect sensitive category data as defined by Google
2. ✅ Our use of Google Signals is compliant with advertising policies
3. ✅ Users are informed about Google Signals activation via cookie banner
4. ✅ Users can opt-out of personalized advertising
5. ✅ Users can access and delete their data via [Meine Aktivitäten](https://myactivity.google.com)

---

## Implementation Safeguards

### Code-Level Protection

Created `src/lib/compliance/sensitive-categories.ts`:

- **`isSensitiveField()`** - Checks if a field name contains sensitive keywords
- **`SENSITIVE_CATEGORIES_NOT_COLLECTED`** - Explicit list of what we don't collect
- **`COLLECTED_DATA_POINTS`** - Explicit list of what we DO collect
- **`getComplianceStatement()`** - Generates German compliance text for privacy policy

### User-Facing Disclosure

Updated `CookieSettingsModal.tsx` to include:

> ✅ **Sensible Kategorien:** Wir erfassen KEINE sensiblen Kategorien gemäß Google-Richtlinien (keine Gesundheits-, Finanz-, religiösen oder politischen Daten). Wir erfassen nur Standard-Kontaktdaten und Hausbau-Konfigurationen.

---

## Privacy Policy Requirements

Your privacy policy (`/datenschutz`) must include:

### Required Disclosure (German)

```
**Google Analytics mit Google Signals**

Wir verwenden Google Analytics 4 mit aktivierten Google Signals zur Erfassung 
demografischer Daten (Alter, Geschlecht, Interessen) und für Remarketing-Zwecke.

**Erfasste Daten:**
- Standard-Kontaktdaten (Name, E-Mail, Telefon, Adresse)
- Hausbau-Konfigurationsdaten (Modulwahl, Ausstattungsoptionen)
- Grundstücksinformationen (Adresse, Katasterangaben)

**KEINE sensiblen Kategorien:**
Wir erfassen KEINE sensiblen Kategorien gemäß den Google Ads-Richtlinien, 
einschließlich:
- Gesundheits- oder Finanzinformationen
- Religiöse oder politische Überzeugungen
- Sexuelle Orientierung oder Geschlechtsidentität
- Ethnische Herkunft oder Rassenzugehörigkeit

**Ihre Rechte:**
Sie können über "Meine Aktivitäten" (myactivity.google.com) auf Ihre Daten 
zugreifen und diese löschen. Sie können personalisierte Werbung über die 
Cookie-Einstellungen oder das Google Analytics Browser-Add-on deaktivieren.

**Datenempfänger:**
Google LLC (USA), Google Ireland Limited (Irland)

**Drittlandübertragung:**
Daten werden in die USA übertragen, die möglicherweise nicht das gleiche 
Datenschutzniveau wie die EU bieten.

**Rechtsgrundlage:**
Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO, erteilt über unser 
Cookie-Banner.

**Speicherdauer:**
14 Monate (Google Analytics Standard)

**Widerruf:**
Sie können Ihre Einwilligung jederzeit über unsere Cookie-Einstellungen 
widerrufen.
```

---

## Checklist: Sensitive Categories Compliance ✅

- [x] **Data Audit Complete** - Verified no sensitive categories collected
- [x] **Code Safeguards Implemented** - `sensitive-categories.ts` module created
- [x] **Cookie Banner Disclosure** - Updated to mention no sensitive categories
- [x] **Cookie Settings Modal** - Green badge showing compliance
- [x] **Privacy Policy Template** - Complete German disclosure provided
- [x] **Google Signals Configuration** - Enabled only with user consent
- [x] **Opt-Out Mechanism** - Link to Google's browser add-on provided
- [x] **User Data Access** - Reference to Meine Aktivitäten provided

---

## Regular Compliance Review

**Schedule annual reviews** to ensure:

1. No new forms collect sensitive categories
2. Privacy policy remains up-to-date
3. Cookie consent flows remain compliant
4. Google Signals configuration unchanged

**Contact person:** Data Protection Officer / Website Administrator

**Last reviewed:** December 1, 2025

**Next review:** December 1, 2026

---

## If You Add Sensitive Data in the Future

**WARNING:** If you ever add forms that collect sensitive categories (e.g., health questionnaires, financial applications), you MUST:

1. ❌ **DISABLE Google Signals immediately** in GA4 Admin
2. ❌ **Remove `allow_google_signals: true`** from `GoogleAnalyticsProvider.tsx`
3. ❌ **Disable marketing cookies** in `CookieConsentContext.tsx`
4. ✅ **Update privacy policy** to reflect new data collection
5. ✅ **Consult legal counsel** for GDPR compliance

---

## Resources

- [Google Advertising Features Policy (DE)](https://support.google.com/analytics/answer/2700409?hl=de)
- [Google Ads Sensitive Categories](https://support.google.com/adspolicy/answer/143465)
- [GDPR Special Categories](https://gdpr-info.eu/art-9-gdpr/)
- [Meine Aktivitäten (User Data Access)](https://myactivity.google.com)
- [Google Analytics Opt-Out](https://tools.google.com/dlpage/gaoptout?hl=de)

