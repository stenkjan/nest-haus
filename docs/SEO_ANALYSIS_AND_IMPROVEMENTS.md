# SEO Analysis & Improvement Recommendations for Hoam-House

**Generated:** December 8, 2025  
**Analyst:** Claude 4.5 Sonnet  
**Status:** Comprehensive Analysis Complete

---

## 📊 Executive Summary

Your SEO setup is **solid** with strong foundational elements in place. You have proper structured data, metadata management, and Google Analytics integration. However, there are **several high-impact improvements** you can make to achieve better Google rankings.

**Current SEO Score: 7.5/10**

### ✅ What You're Doing Well
- Comprehensive structured data (JSON-LD)
- Proper metadata system with centralized configuration
- GA4 integration with proper tracking
- Clean URL structure
- Mobile-responsive design
- Fast page load times (based on implementation)

### 🔴 Critical Issues to Fix
1. **Missing Google Search Console verification** (Blocks access to search data)
2. **Incomplete Open Graph images** (Some pages have invalid paths)
3. **Missing breadcrumb implementation** on most pages
4. **No actual FAQ content** matching FAQ schema
5. **Missing hreflang tags** (Important for Austrian market)
6. **No internal linking strategy**
7. **Missing alt text system** for images
8. **URL inconsistency** (nest-haus.at vs www.nest-haus.at)

---

## 🔍 Detailed Analysis by Category

### 1. Technical SEO (Current: 8/10)

#### ✅ Strengths
- **Robots.txt configured correctly** with proper disallows
- **Sitemap.xml dynamically generated** with proper change frequencies
- **Clean URL structure** (no query parameters except sessions)
- **HTTPS enforced** via metadataBase
- **Proper HTTP headers** (based on Next.js defaults)

#### 🔴 Issues Found

##### Issue 1.1: URL Inconsistency (HIGH PRIORITY)
**Problem:** Your site uses both `nest-haus.at` and `www.nest-haus.at` inconsistently:
- `generateMetadata.ts` uses `https://nest-haus.at` (line 5)
- `layout.tsx` uses `https://www.nest-haus.at` (line 44)
- `robots.ts` uses `https://www.nest-haus.at` (line 4)

**Impact:** 
- Duplicate content issues
- Split link equity between two domains
- Confusing for search engines

**Solution:**
```typescript
// CHOOSE ONE (recommend www version for trust signals):
const baseUrl = "https://www.nest-haus.at"

// Update in:
// 1. src/lib/seo/generateMetadata.ts (line 5)
// 2. Ensure all references use the same URL
// 3. Add 301 redirect from non-www to www (or vice versa) in Vercel config
```

##### Issue 1.2: Missing Canonical URLs on Some Pages
**Problem:** Not all pages explicitly set canonical URLs

**Impact:** Potential duplicate content if query parameters added

**Solution:** Ensure all pages use canonical URLs from `generatePageMetadata()`

##### Issue 1.3: Robots.txt Has Conflicting Rules
**Current robots.txt:**
```
Disallow: /api/
Allow: /api/images
```

**Problem:** `/api/images` should be allowed but needs proper indexing

**Solution:**
```
# More specific order (specific before general)
Allow: /api/images/
Disallow: /api/

# Add image-specific directives
User-agent: Googlebot-Image
Allow: /api/images/
Allow: /public/images/
```

---

### 2. On-Page SEO (Current: 6.5/10)

#### ✅ Strengths
- **Good title tag structure** with brand consistency
- **Descriptive meta descriptions** with proper length
- **Keywords in URLs** (e.g., `/konfigurator`, `/dein-nest`)
- **Semantic HTML structure** (based on Next.js implementation)

#### 🔴 Issues Found

##### Issue 2.1: Missing H1 Tags Verification
**Problem:** Unable to verify if each page has exactly ONE H1 tag

**Impact:** Search engines may not understand page hierarchy

**Action Required:** Audit all pages to ensure:
- Each page has exactly ONE `<h1>` tag
- H1 contains primary keyword
- Heading hierarchy flows logically (h1 → h2 → h3)

##### Issue 2.2: Keywords Not Optimized for Search Volume
**Current keywords in metadata:**
```typescript
"modulhaus, fertighaus, nachhaltiges bauen, energieeffizient, Österreich"
```

**Problem:** Missing high-volume Austrian-specific keywords

**Recommended additions:**
- "modulhaus österreich kaufen"
- "fertighaus preise österreich"
- "tiny house österreich"
- "container haus österreich"
- "modulhaus graz"
- "holzhaus bausatz österreich"
- "modulhaus kosten"

##### Issue 2.3: Meta Descriptions Could Be More Compelling
**Current (home page):**
> "Das erste Haus der Welt, welches sich an dein Leben anpasst..."

**Better (includes call-to-action):**
> "Dein modulares Traumhaus ab €213.000 ✓ Individuell konfigurierbar ✓ Nachhaltig & energieeffizient ✓ Jetzt kostenlos beraten lassen!"

**Why:** CTA-driven descriptions have 20-30% higher click-through rates

##### Issue 2.4: Missing Alt Text System for Images
**Problem:** No centralized alt text management visible in code

**Impact:** 
- Poor accessibility
- Missing image SEO opportunities
- Lost traffic from Google Image Search

**Solution:** Create image metadata system:
```typescript
// src/lib/seo/imageMetadata.ts
export const IMAGE_ALT_TEXT = {
  "7-NEST-Haus-Innenperspektive": "NEST-Haus Innenperspektive mit Kalkstein, Holz und großen Glasfronten",
  "6-NEST-Haus-4-Module": "NEST-Haus 4-Module Ansicht mit Holzlattung aus Lärche am Meer",
  // ... etc
} as const;
```

---

### 3. Structured Data (Current: 8/10)

#### ✅ Strengths
- **Comprehensive JSON-LD implementation**
- **Multiple schema types** (Organization, Product, WebSite, FAQ, LocalBusiness)
- **Proper nesting** and relationships
- **Dynamic price schemas** via `priceSchema.ts`

#### 🔴 Issues Found

##### Issue 3.1: FAQ Schema Without Actual FAQs (CRITICAL)
**Problem:** FAQ schema in `layout.tsx` (line 158) but FAQ questions are generic:

```typescript
{
  "name": "Was ist ein modulares Haus?",
  "acceptedAnswer": {
    "text": "Ein modulares Haus ist ein Gebäude..."
  }
}
```

**But on `/faq` page:** No matching content found in FAQ schema (line 8-14)

**Impact:** **Google penalty risk** - Schema markup doesn't match actual page content

**Solution:** 
1. Remove generic FAQ schema from `layout.tsx`
2. Add FAQ schema ONLY on `/faq` page
3. Ensure FAQ schema matches actual FAQ content on page

##### Issue 3.2: Missing Review/Rating Schema
**Current:** Product schema lacks reviews

**Opportunity:** Add customer reviews/testimonials with schema

```typescript
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "24",
  "bestRating": "5",
  "worstRating": "1"
},
"review": [
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Real Customer Name" },
    "datePublished": "2024-11-15",
    "reviewRating": { "@type": "Rating", "ratingValue": "5" },
    "reviewBody": "Actual customer review text here..."
  }
]
```

**Impact:** ⭐ Star ratings in search results = 30% higher CTR

##### Issue 3.3: Breadcrumb Schema Not Implemented
**Current:** `generateBreadcrumbSchema()` exists but only used on:
- `/dein-nest` (line 27)
- `/nest-system` (line 24)

**Missing on:**
- `/warenkorb`
- `/kontakt`
- `/konzept-check`
- `/faq`
- `/warum-wir`

**Impact:** Missing breadcrumb rich snippets in search results

**Solution:** Add breadcrumbs to all content pages:
```typescript
// In each page.tsx
const breadcrumbSchema = generateBreadcrumbSchema("page-key");

return (
  <>
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
    {/* page content */}
  </>
);
```

##### Issue 3.4: Product Schema Missing Important Fields
**Current product schema lacks:**
- `sku` (Stock Keeping Unit)
- `gtin` (Global Trade Item Number)
- `mpn` (Manufacturer Part Number)
- `image` URLs
- `review` objects

**Recommendation:**
```typescript
export function generateProductSchema(): object {
  return {
    // ... existing fields ...
    "image": [
      "https://www.nest-haus.at/images/7-NEST-Haus-Innenperspektive.jpg",
      "https://www.nest-haus.at/images/6-NEST-Haus-4-Module.jpg",
    ],
    "sku": "NEST-80-BASE",
    "brand": {
      "@type": "Brand",
      "name": "Hoam-House",
      "logo": "https://www.nest-haus.at/api/images/0-homebutton-nest-haus.svg"
    }
  };
}
```

---

### 4. Content SEO (Current: 6/10)

#### ✅ Strengths
- **Clear value propositions** in titles/descriptions
- **German language targeting** for Austrian market
- **Specific pricing information** mentioned

#### 🔴 Issues Found

##### Issue 4.1: No Internal Linking Strategy
**Problem:** No evidence of contextual internal links in content

**Impact:** 
- Poor link equity distribution
- Reduced crawl efficiency
- Lower page authority for important pages

**Solution:** Add internal links in content:
```typescript
// Example for landing page content:
<p>
  Entdecken Sie unseren <Link href="/konfigurator" className="text-blue-600 underline">
    interaktiven Konfigurator
  </Link> und konfigurieren Sie Ihr Traumhaus in wenigen Minuten.
</p>

<p>
  Mehr über unsere <Link href="/nest-system">Modulbauweise</Link> erfahren.
</p>
```

**Target internal links per page:** 3-5 contextual links

##### Issue 4.2: Missing Long-Form Content
**Problem:** No blog or resource center for SEO content

**Opportunity:** Create content for long-tail keywords:
- "Modulhaus Bauzeit" → Guide article
- "Modulhaus Genehmigung Österreich" → Legal guide
- "Modulhaus vs Fertighaus Vergleich" → Comparison article
- "Modulhaus Grundstück Anforderungen" → Requirements guide

**Impact:** Could capture 50-100 additional long-tail keywords

##### Issue 4.3: No Schema Markup for Service Areas
**Problem:** Missing geographic targeting in structured data

**Solution:** Add Service Area schema:
```typescript
export function generateServiceAreaSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Modulhaus Bau und Beratung",
    "provider": {
      "@type": "Organization",
      "name": "Hoam-House"
    },
    "areaServed": [
      { "@type": "State", "name": "Steiermark" },
      { "@type": "State", "name": "Wien" },
      { "@type": "State", "name": "Niederösterreich" },
      { "@type": "State", "name": "Oberösterreich" },
      { "@type": "Country", "name": "Österreich" }
    ],
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://www.nest-haus.at/konfigurator"
    }
  };
}
```

---

### 5. Mobile SEO (Current: 7/10)

#### ✅ Strengths
- **Responsive design** (Tailwind CSS)
- **Mobile viewport configured** correctly
- **Touch-friendly elements** (44px minimum based on design rules)

#### 🔴 Issues to Verify

##### Issue 5.1: Mobile-Specific Metadata
**Recommendation:** Add mobile-specific tags:
```typescript
// In layout.tsx <head>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Hoam-House" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

**Note:** Your `layout.tsx` (line 54) has TODO for apple-touch-icon.png

##### Issue 5.2: AMP Implementation
**Status:** Not implemented (likely not needed)

**Recommendation:** **Skip AMP** - Modern Next.js already fast enough, AMP complexity not worth it

---

### 6. Local SEO (Current: 5/10)

#### ✅ Strengths
- **LocalBusiness schema** implemented
- **Country targeting** (Austria) in structured data
- **German language** properly tagged

#### 🔴 Critical Issues

##### Issue 6.1: Missing Google My Business Integration
**Problem:** No Google My Business listing verification visible

**Impact:** Missing from:
- Google Maps results
- Local pack results
- "Near me" searches

**Action Required:**
1. Claim Google My Business listing
2. Add NAP (Name, Address, Phone) to schema
3. Add NAP to footer of website
4. Get reviews on GMB

##### Issue 6.2: Incomplete LocalBusiness Schema
**Current schema (generateMetadata.ts line 445-470) missing:**
- Street address
- Phone number
- Email
- Geographic coordinates
- Opening hours (has placeholder but not real hours)
- Price range

**Solution:**
```typescript
export function generateLocalBusinessSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hoam-House",
    "description": "Modulhäuser und nachhaltige Bausysteme in Graz",
    "url": "https://www.nest-haus.at",
    "telephone": "+43-XXX-XXXXXX", // Add real phone
    "email": "mail@nest-haus.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Zösenberg 51", // From kontakt page metadata
      "addressLocality": "Graz",
      "postalCode": "8010", // Add real postal code
      "addressRegion": "Steiermark",
      "addressCountry": "AT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "47.0708678", // Add real coordinates
      "longitude": "15.4382786"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "€€€",
    "areaServed": {
      "@type": "State",
      "name": "Steiermark"
    }
  };
}
```

##### Issue 6.3: No Schema for Kontakt Page Location
**Problem:** `/kontakt` page mentions "Zösenberg 51, Graz" but no Place schema

**Solution:** Add Place schema to kontakt page:
```typescript
const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  "name": "Hoam-House Büro Graz",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Zösenberg 51",
    "addressLocality": "Graz",
    "postalCode": "8010",
    "addressCountry": "AT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "47.0708678",
    "longitude": "15.4382786"
  }
};
```

---

### 7. Image SEO (Current: 5/10)

#### ✅ Strengths
- **Next.js Image optimization** in use
- **WebP format** served automatically
- **Lazy loading** implemented

#### 🔴 Critical Issues

##### Issue 7.1: Missing Alt Text on Most Images
**Problem:** No centralized alt text system found

**Impact:**
- Accessibility issues (WCAG failure)
- Missing Google Image Search traffic
- Lost context for search engines

**Solution:** Create alt text metadata:
```typescript
// src/lib/seo/imageMetadata.ts
export const IMAGE_METADATA = {
  "6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche": {
    alt: "Modulhaus Hoam-House mit 4 Modulen, Holzlattung aus Lärche, Meerblick in mediterraner Umgebung",
    title: "NEST-Haus 4-Module Design am Meer",
    caption: "Beispielkonfiguration eines 4-Modul Hauses mit natürlicher Holzfassade"
  },
  // ... all other images
} as const;

// Usage:
import { IMAGE_METADATA } from "@/lib/seo/imageMetadata";

<Image 
  src="/images/6-NEST-Haus-4-Module.jpg"
  alt={IMAGE_METADATA["6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche"].alt}
  // ...
/>
```

##### Issue 7.2: Open Graph Images Use /images/ Path
**Problem:** OG images in `generateMetadata.ts` use relative paths:
```typescript
ogImage: "/images/7-NEST-Haus-Innenperspektive-Kalkstein-Holz-Verglasung-Stirnseite-og.jpg"
```

**But in `layout.tsx` they use full URLs with `/api/images/`:**
```typescript
url: "https://www.nest-haus.at/api/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.jpg"
```

**Impact:** Inconsistent image serving, potential 404s on social shares

**Solution:** Standardize to full URLs:
```typescript
// In generateMetadata.ts
export function generatePageMetadata(pageKey: PageKey, customData?: CustomMetadata): Metadata {
  // ...
  const ogImageUrl = customData?.ogImage 
    ? `${baseConfig.baseUrl}${customData.ogImage}`
    : `${baseConfig.baseUrl}${pageConfig.ogImage}`;
  
  return {
    // ...
    openGraph: {
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          // ...
        }
      ]
    }
  };
}
```

##### Issue 7.3: No Image Sitemap
**Problem:** Only page sitemap exists, no image sitemap

**Opportunity:** Create image sitemap for Google Image Search

**Solution:**
```typescript
// src/app/image-sitemap.xml/route.ts
export async function GET() {
  const images = [
    {
      loc: "https://www.nest-haus.at/images/6-NEST-Haus-4-Module.jpg",
      title: "NEST-Haus 4-Module Design",
      caption: "Modulhaus mit 4 Modulen und Holzfassade"
    },
    // ... all images
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${images.map(img => `
        <url>
          <loc>https://www.nest-haus.at</loc>
          <image:image>
            <image:loc>${img.loc}</image:loc>
            <image:title>${img.title}</image:title>
            <image:caption>${img.caption}</image:caption>
          </image:image>
        </url>
      `).join("")}
    </urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" }
  });
}
```

---

### 8. International SEO (Current: 4/10)

#### 🔴 Critical Issues

##### Issue 8.1: Missing hreflang Tags
**Problem:** No hreflang tags despite serving German market

**Impact:** 
- Unclear targeting for search engines
- May show to German/Swiss users incorrectly
- Lost opportunities in DACH region

**Solution:** Add hreflang tags:
```typescript
// In generatePageMetadata():
alternates: {
  canonical,
  languages: {
    "de-AT": `${baseConfig.baseUrl}/${pageKey === 'home' ? '' : pageKey}`,
    // Future expansion:
    // "de-DE": `https://nest-haus.de/${pageKey}`,
    // "de-CH": `https://nest-haus.ch/${pageKey}`,
  }
}
```

##### Issue 8.2: No x-default hreflang
**Problem:** No fallback language specified

**Solution:**
```typescript
languages: {
  "x-default": `${baseConfig.baseUrl}/${pageKey === 'home' ? '' : pageKey}`,
  "de-AT": `${baseConfig.baseUrl}/${pageKey === 'home' ? '' : pageKey}`,
}
```

---

### 9. Search Console & Analytics (Current: 7/10)

#### ✅ Strengths
- **GA4 fully implemented** with consent management
- **Comprehensive event tracking** (purchase, leads, etc.)
- **Data API integration** ready
- **Cookie consent** GDPR-compliant

#### 🔴 Critical Issues

##### Issue 9.1: Google Search Console Not Verified (CRITICAL)
**Problem:** Environment variable `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` not set

**Impact:**
- **Cannot see search queries**
- **Cannot see click-through rates**
- **Cannot see indexing issues**
- **Cannot submit sitemaps manually**
- **Cannot see backlinks**

**Solution:**
1. Go to https://search.google.com/search-console
2. Add property for `https://www.nest-haus.at`
3. Choose "HTML tag" verification
4. Copy verification code
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123xyz...
   ```
6. Deploy to production
7. Click "Verify" in Search Console

**PRIORITY: HIGH - Do this immediately**

##### Issue 9.2: Events Not Marked as Conversions
**Problem:** Per GA4 doc (line 436-443), events need to be marked as conversions in GA4 UI

**Action Required:**
1. Log into GA4
2. Go to Configure → Events
3. Mark as conversion:
   - `purchase` (revenue)
   - `generate_lead` (appointments)
   - `begin_checkout` (payment intent)
   - `config_complete` (high intent)

##### Issue 9.3: Custom Dimensions Not Created
**Problem:** Custom dimensions for house_model, price_range, etc. not set up in GA4

**Impact:** Cannot segment by configuration type in reports

**Action Required:** Follow steps in GA4 doc (lines 449-487)

---

### 10. Performance SEO (Current: 8/10)

#### ✅ Strengths
- **Next.js App Router** for optimal performance
- **Vercel Speed Insights** integrated
- **Image optimization** via Next/Image
- **Code splitting** automatic

#### 🟡 Recommendations

##### Recommendation 10.1: Add Performance Budget Enforcement
**Current:** No automated performance checks

**Solution:** Add Lighthouse CI to build process:
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://www.nest-haus.at
            https://www.nest-haus.at/konfigurator
            https://www.nest-haus.at/dein-nest
          uploadArtifacts: true
          temporaryPublicStorage: true
```

##### Recommendation 10.2: Implement Critical CSS
**Current:** All CSS loaded upfront

**Potential:** Extract critical above-the-fold CSS for faster FCP

---

## 🚀 Prioritized Action Plan

### 🔴 **Phase 1: Critical Fixes (Week 1) - Do These First**

#### 1.1 Google Search Console Verification (30 minutes)
```bash
# 1. Go to https://search.google.com/search-console
# 2. Get verification code
# 3. Add to .env.local and production
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_code_here
```
**Impact:** 🔥🔥🔥🔥🔥 Unlocks all search performance data

#### 1.2 Fix URL Inconsistency (15 minutes)
```typescript
// Update src/lib/seo/generateMetadata.ts line 5
baseUrl: "https://www.nest-haus.at",  // Add www

// Add to vercel.json for redirects
{
  "redirects": [
    {
      "source": "https://nest-haus.at/:path*",
      "destination": "https://www.nest-haus.at/:path*",
      "permanent": true
    }
  ]
}
```
**Impact:** 🔥🔥🔥🔥 Consolidates link equity

#### 1.3 Fix FAQ Schema Mismatch (1 hour)
```typescript
// Remove generic FAQ from layout.tsx (line 158)
// Add real FAQ schema ONLY to /faq page with actual content
```
**Impact:** 🔥🔥🔥 Avoids Google penalty

#### 1.4 Add Missing Breadcrumb Schemas (2 hours)
Add breadcrumb schema to all missing pages:
- `/warenkorb/page.tsx`
- `/kontakt/page.tsx`
- `/konzept-check/page.tsx`
- `/faq/page.tsx`
- `/warum-wir/page.tsx`

```typescript
const breadcrumbSchema = generateBreadcrumbSchema("page-key");
```
**Impact:** 🔥🔥🔥 Breadcrumb rich snippets in search

---

### 🟡 **Phase 2: High-Impact Improvements (Week 2-3)**

#### 2.1 Complete LocalBusiness Schema (1 hour)
Add real NAP (Name, Address, Phone) data to schema
```typescript
// Update generateLocalBusinessSchema()
"telephone": "+43-XXX-XXXXXX",
"address": {
  "streetAddress": "Zösenberg 51",
  "addressLocality": "Graz",
  "postalCode": "8010",
  // ...
}
```
**Impact:** 🔥🔥🔥 Local search visibility

#### 2.2 Create Image Alt Text System (3 hours)
```typescript
// Create src/lib/seo/imageMetadata.ts
// Add descriptive alt text for all images
// Update all <Image> components to use metadata
```
**Impact:** 🔥🔥🔥 Accessibility + Image SEO

#### 2.3 Optimize Meta Descriptions (2 hours)
Update all meta descriptions to be more compelling:
- Add CTAs ("Jetzt beraten lassen!")
- Include prices where relevant
- Add USPs (✓ checkmarks)
- Keep under 155 characters

**Impact:** 🔥🔥 20-30% higher CTR

#### 2.4 Add Internal Linking (4 hours)
Add 3-5 contextual internal links per page:
- Link "Konfigurator" mentions to `/konfigurator`
- Link "Konzept-Check" mentions to `/konzept-check`
- Link pricing mentions to `/dein-nest`
- Add "Verwandte Seiten" sections

**Impact:** 🔥🔥 Better crawling & link equity

#### 2.5 Add hreflang Tags (30 minutes)
```typescript
// In generatePageMetadata()
alternates: {
  canonical,
  languages: {
    "x-default": canonical,
    "de-AT": canonical,
  }
}
```
**Impact:** 🔥🔥 Better DACH targeting

---

### 🟢 **Phase 3: Content & Expansion (Week 4-6)**

#### 3.1 Create Long-Form Content (Ongoing)
Write SEO articles for long-tail keywords:
- "Modulhaus Bauzeit Österreich" (800 words)
- "Modulhaus Genehmigung Österreich" (1200 words)
- "Modulhaus vs Fertighaus" (1500 words)
- "Modulhaus Grundstück Anforderungen" (1000 words)

**Impact:** 🔥🔥 50-100 additional keywords

#### 3.2 Add Customer Reviews Schema (2 hours)
Collect real customer reviews and add to Product schema
```typescript
"review": [
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Real Name" },
    "reviewRating": { "@type": "Rating", "ratingValue": "5" },
    "reviewBody": "Real review text..."
  }
]
```
**Impact:** 🔥🔥 Star ratings in search = 30% higher CTR

#### 3.3 Create Image Sitemap (1 hour)
Generate image sitemap for Google Image Search

**Impact:** 🔥 Better image search visibility

#### 3.4 Claim Google My Business (1 hour)
Set up and verify GMB listing for local SEO

**Impact:** 🔥🔥 Local pack visibility

---

## 📈 Expected Results Timeline

### After Phase 1 (Week 1):
- ✅ Search Console data starts flowing
- ✅ Breadcrumbs appear in search results
- ✅ No more URL inconsistency issues
- ✅ Rich snippets start appearing

### After Phase 2 (Week 3):
- ✅ Improved click-through rates (10-20% increase)
- ✅ Better local search visibility
- ✅ Image search traffic increases
- ✅ Improved accessibility score

### After Phase 3 (Week 6):
- ✅ Ranking for 50-100 additional keywords
- ✅ Star ratings in search results
- ✅ Higher domain authority
- ✅ Increased organic traffic (20-40%)

### Long-term (3-6 months):
- ✅ First-page rankings for target keywords
- ✅ Increased brand visibility
- ✅ Higher conversion rates
- ✅ Stronger local presence

---

## 🎯 Quick Wins (Can Do Today)

### 1. Fix robots.txt Image Rules (5 minutes)
```
# More specific order
User-agent: Googlebot-Image
Allow: /api/images/
Allow: /images/

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
```

### 2. Add Missing Meta Tags (10 minutes)
```typescript
// In layout.tsx <head>
<meta name="apple-mobile-web-app-title" content="Hoam-House" />
<meta name="application-name" content="Hoam-House" />
<meta name="theme-color" content="#ffffff" />
```

### 3. Update OG Image Paths (15 minutes)
Ensure all OG images use full URLs consistently

### 4. Add Structured Data Testing (10 minutes)
Test all pages with:
https://search.google.com/test/rich-results

---

## 📚 Resources & Tools

### Testing Tools
- **Rich Results Test:** https://search.google.com/test/rich-results
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly
- **Structured Data Testing:** https://validator.schema.org/

### SEO Tools (Free)
- **Google Search Console:** https://search.google.com/search-console
- **Google Analytics 4:** https://analytics.google.com
- **Bing Webmaster Tools:** https://www.bing.com/webmasters
- **Screaming Frog:** https://www.screamingfrog.co.uk/ (free for 500 URLs)

### Austrian SEO Resources
- **Google Trends Austria:** https://trends.google.at/
- **SEO-Keywords.at:** Keyword research for Austrian market
- **WKO SEO Guide:** Austrian business SEO best practices

---

## 🏆 Success Metrics to Track

### Track in Google Search Console:
- ✅ Total clicks (target: +20% monthly)
- ✅ Average CTR (target: >3%)
- ✅ Average position (target: <15)
- ✅ Indexed pages (target: 100%)

### Track in Google Analytics:
- ✅ Organic traffic (target: +30% quarterly)
- ✅ Bounce rate (target: <50%)
- ✅ Pages per session (target: >3)
- ✅ Conversion rate (target: >2%)

### Track in Search Results:
- ✅ Rich snippets appearing (breadcrumbs, FAQs)
- ✅ Star ratings showing
- ✅ Local pack visibility
- ✅ Image carousel appearances

---

## 💡 Final Recommendations

### Top 3 Priorities:
1. **Google Search Console verification** (30 min) → Unlocks all search data
2. **Fix URL consistency** (15 min) → Consolidates SEO power
3. **Add breadcrumb schemas** (2 hours) → Rich snippets in search

### Top 3 Quick Wins:
1. **Optimize meta descriptions** with CTAs → 20% higher CTR
2. **Add alt text to images** → Accessibility + image SEO
3. **Fix FAQ schema** → Avoid Google penalty

### Long-term Strategy:
1. **Create SEO content hub** → Capture long-tail keywords
2. **Build local presence** → GMB + local links
3. **Get customer reviews** → Social proof + star ratings

---

## 📞 Questions & Support

If you need clarification on any recommendations:
1. Check the linked line numbers in your codebase
2. Test changes on staging first
3. Monitor Search Console for any issues
4. Roll out changes incrementally

**Good luck with your SEO improvements! 🚀**

---

**Generated:** December 8, 2025  
**Next Review:** March 2026  
**Document Version:** 1.0
