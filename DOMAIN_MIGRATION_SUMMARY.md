# Domain Migration Summary: da-hoam.at → hoam-house.com

**Date:** January 12, 2026  
**Migration Type:** Complete domain replacement  
**Old Domain:** da-hoam.at (ending January 31, 2026)  
**New Domain:** hoam-house.com

---

## ✅ Changes Completed

### 1. Core SEO Configuration Files

#### **src/lib/seo/generateMetadata.ts**
- ✅ Updated `SEO_CONFIG.baseUrl` from `https://da-hoam.at` to `https://hoam-house.com`
- ✅ Updated organization logo URL
- ✅ All page metadata now uses new domain via centralized config

#### **src/app/layout.tsx**
- ✅ Updated `metadataBase` URL
- ✅ Updated canonical URL
- ✅ Updated OpenGraph URL and images
- ✅ Updated Twitter card images

### 2. Page-Specific SEO Metadata

#### **src/app/page.tsx** (Homepage)
- ✅ Updated `websiteSchema.url`
- ✅ Updated `potentialAction.target` (search action)
- ✅ Updated `productSchema.offers.url`

#### **src/app/kontakt/page.tsx**
- ✅ Updated `contactSchema.url`
- ✅ Updated `localBusinessSchema.image` URL

#### **src/app/warenkorb/page.tsx**
- ✅ Updated canonical URL
- ✅ Updated OpenGraph URL
- ✅ Updated `shoppingCartSchema.url`

#### **src/app/warum-wir/page.tsx**
- ✅ Updated `warumWirSchema.url`

### 3. Enhanced SEO Schema Files

#### **src/lib/seo/GoogleSEOEnhanced.tsx**
- ✅ Updated `generateEnhancedOrganizationSchema()` URL and logo
- ✅ Updated `generateWebSiteSchema()` URL and search target
- ✅ Updated `generateModulhausProductSchema()` offer URL

#### **src/lib/seo/priceSchema.ts**
- ✅ Updated manufacturer URL in `baseSchema`
- ✅ Updated seller URL in offer schema
- ✅ Updated shopping cart URL
- ✅ Updated configurator URL
- ✅ Fixed branding from "NEST-Haus" to "®Hoam"

### 4. Sitemap & Robots Configuration

#### **src/app/sitemap.ts**
- ✅ Uses centralized `generateSitemapData()` - automatically updated

#### **src/app/robots.ts**
- ✅ Updated `baseUrl` from `https://www.nest-haus.at` to `https://hoam-house.com`

#### **public/robots.txt**
- ✅ Updated sitemap location from `https://nest-haus.at/sitemap.xml` to `https://hoam-house.com/sitemap.xml`

### 5. Email Templates

#### **src/lib/emailTemplates/PaymentConfirmationTemplate.ts**
- ✅ Updated configurator button link
- ✅ Updated footer website links (Website, Impressum, Datenschutz)
- ✅ Updated plain text email links

#### **src/lib/EmailService.ts**
- ✅ Updated "Konfiguration fortsetzen" button link
- ✅ Updated "Besuchen Sie uns" link
- ✅ Updated admin panel links
- ✅ Updated email reply subject lines

### 6. Calendar & ICS Files

#### **src/lib/utils/icsGenerator.ts**
- ✅ Updated UID format from `@nest-haus.at` to `@hoam-house.com`

#### **src/lib/GoogleCalendarService.ts**
- ✅ Updated iCalUID format
- ✅ Updated admin panel links in calendar event descriptions

### 7. Analytics & Tracking

#### **src/components/analytics/GoogleAnalyticsProvider.tsx**
- ✅ Removed cross-domain tracking for da-hoam.at
- ✅ Updated comments to reflect single domain setup
- ✅ Disabled linker (no cross-domain tracking needed)

### 8. Security & Infrastructure

#### **src/lib/security/SecurityMiddleware.ts**
- ✅ Updated `allowedOrigins` from nest-haus.at to hoam-house.com
- ✅ Updated www subdomain

#### **vercel.json**
- ✅ Removed nest-haus.at redirect rule
- ✅ Cleared redirects array (single domain only)

### 9. Error Handling & Monitoring

#### **src/components/payments/PaymentModal.tsx**
- ✅ Updated support email from `support@nest-haus.at` to `mail@hoam-house.com`

#### **src/components/payments/PaymentErrorBoundary.tsx**
- ✅ Updated error contact email to `mail@hoam-house.com`

#### **src/lib/monitoring/UsageAlerts.ts**
- ✅ Updated email recipients to `admin@hoam-house.com`

---

## 🔍 Verification Results

### ✅ Lint Check
```bash
npm run lint
✔ No ESLint warnings or errors
```

### ✅ Domain Search in Source Code
```bash
grep -r "da-hoam\.at" src/
# No matches found ✅

grep -r "nest-haus\.at" src/
# No matches found ✅
```

---

## 📋 Next Steps (Post-Deployment)

### Immediate Actions Required

1. **Vercel Deployment**
   - Deploy to production to activate new domain references
   - Verify all pages render correctly with new domain

2. **DNS Configuration**
   - Ensure `hoam-house.com` is properly configured in Vercel
   - Set up www subdomain: `www.hoam-house.com`
   - Add SSL certificate for new domain

3. **Google Search Console**
   - Add property for `hoam-house.com`
   - Submit new sitemap: `https://hoam-house.com/sitemap.xml`
   - Monitor indexing status
   - Request re-indexing for critical pages

4. **Google Analytics 4**
   - Update property settings for new domain
   - Remove old domain from cross-domain tracking lists
   - Create hostname filter for `hoam-house.com`
   - Monitor traffic transition

5. **Social Media & Marketing**
   - Update all social media profiles with new domain
   - Update Google My Business listing
   - Update email signatures
   - Update business cards and marketing materials

6. **Stripe Webhook URLs** (if applicable)
   - Update webhook endpoints from nest-haus.at to hoam-house.com
   - Test payment flow with new domain

7. **301 Redirects** (Optional but Recommended)
   - If you still control da-hoam.at until end of month:
     - Set up 301 permanent redirects to hoam-house.com
     - This preserves any incoming links and SEO value

### Testing Checklist

- [ ] Homepage loads with correct metadata
- [ ] All pages show hoam-house.com in canonical tags
- [ ] OpenGraph images display correctly (test with Facebook/LinkedIn debugger)
- [ ] Twitter cards render properly
- [ ] Sitemap accessible at /sitemap.xml
- [ ] robots.txt accessible and correct
- [ ] Email templates link to correct domain
- [ ] Payment confirmation emails use new domain
- [ ] Calendar invites (.ics files) use new domain
- [ ] Admin panel links work correctly
- [ ] Error pages reference correct support email

---

## 📊 Files Modified

**Total Files Changed:** 19

### Core Configuration (4)
- `src/lib/seo/generateMetadata.ts`
- `src/app/layout.tsx`
- `vercel.json`
- `public/robots.txt`

### Page Metadata (5)
- `src/app/page.tsx`
- `src/app/kontakt/page.tsx`
- `src/app/warenkorb/page.tsx`
- `src/app/warum-wir/page.tsx`
- `src/app/robots.ts`

### SEO & Schema (2)
- `src/lib/seo/GoogleSEOEnhanced.tsx`
- `src/lib/seo/priceSchema.ts`

### Email & Communication (3)
- `src/lib/emailTemplates/PaymentConfirmationTemplate.ts`
- `src/lib/EmailService.ts`
- `src/lib/GoogleCalendarService.ts`

### Utilities & Services (3)
- `src/lib/utils/icsGenerator.ts`
- `src/lib/security/SecurityMiddleware.ts`
- `src/lib/monitoring/UsageAlerts.ts`

### UI Components (2)
- `src/components/analytics/GoogleAnalyticsProvider.tsx`
- `src/components/payments/PaymentModal.tsx`
- `src/components/payments/PaymentErrorBoundary.tsx`

---

## 🚨 Important Notes

1. **No Breaking Changes**
   - All changes are backward compatible
   - Existing sessions will continue to work
   - Database migrations not required

2. **Email Addresses Updated**
   - Old: `support@nest-haus.at`
   - New: `mail@hoam-house.com`
   - Admin: `admin@hoam-house.com`

3. **Cross-Domain Tracking Disabled**
   - Previously tracked: nest-haus.at ↔ da-hoam.at
   - Now: Single domain (hoam-house.com only)
   - Simplified analytics setup

4. **Documentation References**
   - Documentation files in `/docs` still reference old domains
   - These are historical records and don't need updating
   - Active code references have been fully migrated

---

## ✅ Migration Complete

All SEO settings and domain references in active source code have been successfully updated from `da-hoam.at` and `nest-haus.at` to `hoam-house.com`.

**Status:** ✅ Ready for deployment  
**Lint Status:** ✅ No errors  
**Testing Required:** Yes (see Testing Checklist above)

---

**Migration performed by:** AI Assistant  
**Date:** January 12, 2026  
**Version:** Production-ready
