# GA4 Cookie Consent & Google Signals Implementation

## Summary

This implementation ensures **full GA4 compliance** with GDPR/EU cookie consent laws while enabling **Google Signals** for demographic data and remarketing features.

## What Was Implemented

### 1. **Google Consent Mode v2 Integration** ✅

Updated `CookieConsentContext.tsx` to:
- Send consent updates to `gtag` API when users accept/reject cookies
- Support all 6 consent parameters required by Google:
  - `analytics_storage` - Analytics cookies
  - `ad_storage` - Advertising cookies
  - `ad_user_data` - User data for ads
  - `ad_personalization` - Personalized advertising
  - `functionality_storage` - Functional cookies
  - `personalization_storage` - Personalization cookies

### 2. **GA4 with Google Signals Enabled** ✅

Updated `GoogleAnalyticsProvider.tsx` to:
- Enable `allow_google_signals: true` for demographic data collection
- Enable `allow_ad_personalization_signals` based on marketing consent
- Implement consent mode v2 with `wait_for_update: 500ms`
- Add IP anonymization (`anonymize_ip: true`)
- Configure secure cookies (`SameSite=None;Secure`)
- Set 2-year cookie expiration (Google's standard)

### 3. **Cookie Settings Modal** ✅

Created `CookieSettingsModal.tsx` with:
- Detailed explanations for each cookie category
- Toggle switches for analytics, functional, and marketing cookies
- **Legal compliance text** including:
  - Information about Google Signals
  - Data transfer to third countries (USA)
  - Google LLC/Ireland Limited as data processors
  - Link to opt-out via Google's browser add-on
  - Link to privacy policy
- GDPR-compliant language in German

### 4. **Updated Cookie Banner Text** ✅

Updated `CookieBanner.tsx` to:
- Mention Google Signals activation
- Clarify data transfer to third countries
- Reference demographic reports and remarketing

### 5. **Global Type Definitions** ✅

Created `src/types/gtag.d.ts` for:
- TypeScript support for `window.gtag`
- TypeScript support for `window.dataLayer`
- Prevents duplicate declaration conflicts

## How It Works

### Consent Flow

1. **User visits site** → Cookie banner appears
2. **User clicks "Akzeptieren" (Accept)** →
   - All cookies enabled
   - `gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', ... })`
   - Google Signals activated
3. **User clicks "Ablehnen" (Reject)** →
   - Only necessary cookies enabled
   - `gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ... })`
   - Google Signals deactivated
4. **User clicks "Cookie-Einstellungen" (Settings)** →
   - Modal opens with granular controls
   - User can toggle individual categories
   - Changes saved and consent updated via `gtag`

### Google Signals Activation

Google Signals is **automatically enabled** when:
- User accepts "Marketing-Cookies" in the cookie settings
- OR user clicks "Akzeptieren" (which accepts all cookies)

When enabled, Google Analytics collects:
- Demographics (age, gender)
- Interests
- Cross-device behavior
- Remarketing audiences

This data appears in GA4 under:
- **Reports → Demographics**
- **Reports → User Attributes**
- **Advertising → Audiences**

### Enabling Google Signals in GA4 Admin

**In addition to this code implementation**, you must enable Google Signals in your GA4 property:

1. Go to **GA4 Admin** → Property Settings
2. Click **Data Collection**
3. Enable **Google Signals data collection**
4. Accept the terms

## Compliance Checklist

- ✅ Consent mode v2 implemented (required for EEA/UK)
- ✅ Default consent set to "denied" until user accepts
- ✅ User can withdraw consent at any time
- ✅ Transparent information about data collection
- ✅ Information about data transfer to USA (third country)
- ✅ Information about Google LLC/Ireland Limited as processors
- ✅ Link to opt-out mechanism (Google's browser add-on)
- ✅ Cookie settings accessible at any time
- ✅ IP anonymization enabled
- ✅ Secure cookies (SameSite=None;Secure)
- ✅ **Sensitive categories compliance verified** (see `docs/SENSITIVE_CATEGORIES_COMPLIANCE.md`)
- ✅ **No sensitive category data collected** (health, financial, religious, political, sexual orientation, race)

## Files Changed/Created

### Modified Files
1. `src/contexts/CookieConsentContext.tsx` - Added gtag consent updates
2. `src/components/analytics/GoogleAnalyticsProvider.tsx` - Enabled Google Signals
3. `src/components/CookieBanner.tsx` - Updated text for Google Signals disclosure
4. `src/app/layout.tsx` - Added CookieSettingsModal component

### New Files
1. `src/components/CookieSettingsModal.tsx` - Full cookie settings UI
2. `src/types/gtag.d.ts` - TypeScript definitions for gtag/dataLayer

## Testing Instructions

### 1. Test Cookie Banner
```bash
# Clear localStorage to see banner again
localStorage.removeItem('nest-haus-cookie-consent')
localStorage.removeItem('nest-haus-cookie-preferences')
location.reload()
```

### 2. Test Consent Updates
```javascript
// Open DevTools → Console
// Accept cookies, then check:
window.gtag('consent', 'check')

// Should show all consents as 'granted'
```

### 3. Test Google Signals in GA4
1. Accept all cookies on the website
2. Navigate through pages
3. Wait 24-48 hours for data to process
4. Check GA4 → Reports → Demographics
5. Should see age, gender, interests data (if enough traffic)

### 4. Verify Consent Mode Events
```javascript
// Open DevTools → Network tab
// Filter for "analytics" or "gtag"
// Accept cookies
// Look for requests with:
// - gcs=G1* (all consents granted)
// Or gcs=G10 (analytics only)
```

## Environment Variables

Ensure you have set:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Additional Resources

- [Google's Advertising Features Policy](https://support.google.com/analytics/answer/2700409)
- [Consent Mode v2 Documentation](https://support.google.com/analytics/answer/9976101)
- [Google Signals Documentation](https://support.google.com/analytics/answer/7532985)

## Notes

- **Google Signals requires sufficient traffic** to display demographic data (minimum thresholds apply)
- **Cross-device tracking** only works for users signed into Google accounts
- **Remarketing audiences** can take 24-48 hours to populate
- **Data retention** in GA4 should be set to 14 months (max for free tier)

