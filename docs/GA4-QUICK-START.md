# Google Analytics 4 Quick Start Guide

## 🚀 Quick Setup (30 minutes)

This guide will get Google Analytics 4 running on your site in 30 minutes.

---

## Step 1: Create GA4 Property (10 minutes)

### 1.1 Go to Google Analytics

Visit: https://analytics.google.com

### 1.2 Create Property

```
1. Click "Admin" (bottom left gear icon)
2. In "Account" column: Select or create account
   - Account name: "Nest-Haus"
3. In "Property" column: Click "+ Create Property"
4. Fill in details:
   - Property name: "Nest-Haus Website"
   - Reporting time zone: "(GMT+01:00) Central European Time"
   - Currency: "Euro (EUR)"
5. Click "Next"
```

### 1.3 Business Details

```
Industry category: "Real Estate"
Business size: "Small (1-10 employees)"
How you plan to use Google Analytics:
  ✅ Measure customer engagement
  ✅ Analyze user behavior
  ✅ Optimize marketing ROI
  
Click "Create" → Accept Terms
```

### 1.4 Create Web Data Stream

```
1. You'll see "Set up your data stream"
2. Click "Web"
3. Fill in:
   - Website URL: https://www.nest-haus.at
   - Stream name: "Nest-Haus Production"
4. Enhanced measurement: Keep all toggles ON
5. Click "Create stream"
```

### 1.5 Copy Your Measurement ID

```
You'll see: "Measurement ID: G-XXXXXXXXXX"

Copy this ID - you'll need it next!
```

---

## Step 2: Add Measurement ID to Project (5 minutes)

### 2.1 Edit .env.local

```bash
# Open .env.local in your project root
# Find the line:
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Add your Measurement ID:
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**⚠️ Important:** Replace `G-XXXXXXXXXX` with your actual ID from Step 1.5

---

## Step 3: Enable Demographics (5 minutes)

### 3.1 Enable Google Signals

```
1. Still in GA4: Admin → Data Settings → Data Collection
2. Toggle ON: "Google signals data collection"
3. Review and accept terms
4. Click "Continue"
```

This enables demographics (age, gender, interests) reporting.

---

## Step 4: Deploy & Test (10 minutes)

### 4.1 Start Development Server

```bash
# If server is already running:
# Just save your .env.local file - it will hot reload

# If server is not running:
npm run dev

# Server will start on http://localhost:3000
```

### 4.2 Test on Your Site

```
1. Open: http://localhost:3000
2. Cookie banner should appear
3. Click "Akzeptieren" (Accept)
4. Open Browser DevTools (F12)
5. Go to Network tab
6. Filter by "google-analytics"
7. You should see requests to "google-analytics.com"
```

### 4.3 Check GA4 Real-Time Report

```
1. Go back to: https://analytics.google.com
2. Click "Reports" (left menu)
3. Click "Realtime" → "Overview"
4. Within 30 seconds, you should see:
   - 1 user active right now
   - Your page view
   - Your location
```

**✅ Success!** If you see yourself in real-time, GA4 is working!

---

## Step 5: Optional - Google Search Console (10 minutes)

### 5.1 Verify Domain

```
1. Go to: https://search.google.com/search-console
2. Click "Add property"
3. Enter URL: https://www.nest-haus.at
4. Choose "HTML tag" method
5. Copy the content value (everything between quotes)
   Example: <meta name="google-site-verification" content="ABC123xyz..." />
   Copy: ABC123xyz...
```

### 5.2 Add to .env.local

```bash
# Add this line to .env.local:
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=ABC123xyz...
```

### 5.3 Verify

```
1. Restart your dev server (or deploy to production)
2. Go back to Search Console
3. Click "Verify"
4. Should show: "Ownership verified"
```

### 5.4 Submit Sitemap

```
1. In Search Console, go to "Sitemaps"
2. Enter: sitemap.xml
3. Click "Submit"
4. Status should show: "Success"
```

---

## 🎯 What Happens Next?

### Within 24 Hours
- ✅ Page views tracked
- ✅ User counts
- ✅ Traffic sources
- ✅ Device breakdown

### Within 48-72 Hours
- ✅ **Demographics appear** (age groups)
- ✅ **Gender breakdown**
- ✅ **Interests data**

### Within 1 Week
- ✅ Reliable trend data
- ✅ Conversion tracking stable
- ✅ Search Console data populated

---

## 📊 Where to Find Your Data

### Custom Analytics (Your Primary Dashboard)
```
URL: https://www.nest-haus.at/admin/user-tracking
Login: Admin password

What you'll see:
- Individual user sessions
- Configuration tracking
- Cart conversions
- Payment tracking
- Click behavior
- Everything except demographics
```

### Google Analytics 4 (Demographics Only)
```
URL: https://analytics.google.com

Most Important Reports:
1. Realtime → Overview
   - Live user count
   - Active pages
   
2. Reports → User → Demographics
   - Age groups
   - Gender breakdown
   - (Available after 48-72 hours)
   
3. Reports → User → Tech → User attributes
   - Interests categories
   - Affinity segments
   
4. Reports → Acquisition → Traffic acquisition
   - Where users come from
   - Source/medium breakdown
```

### Google Search Console (SEO)
```
URL: https://search.google.com/search-console

Key Reports:
1. Performance
   - Search impressions
   - Click-through rate
   - Average position
   
2. Coverage
   - Indexed pages
   - Errors to fix
   
3. Core Web Vitals
   - Performance scores
   - Mobile usability
```

---

## ❓ Troubleshooting

### Problem: No data in GA4 Real-time

**Checklist:**
- [ ] Did you accept analytics cookies?
- [ ] Is your Measurement ID correct in .env.local?
- [ ] Did you restart the dev server after adding ID?
- [ ] Check DevTools Network tab for google-analytics.com requests
- [ ] Try incognito/private window (to avoid ad blockers)

### Problem: Demographics not showing

**Wait Time:**
- Demographics need 48-72 hours AND 50+ users
- If you have < 50 users, data won't show (privacy threshold)

**Check:**
- [ ] Google signals enabled? (Admin → Data Settings)
- [ ] Users accepted analytics cookies?

### Problem: Search Console verification failed

**Checklist:**
- [ ] Correct verification code in .env.local?
- [ ] Server restarted after adding code?
- [ ] Check page source: View → Page Source → Search for "google-site-verification"
- [ ] Wait 5 minutes and try again

---

## 🎉 You're Done!

### What You Now Have:

✅ **Complete analytics stack at €0/month:**
- Your custom analytics (real-time, detailed)
- Google Analytics 4 (demographics, marketing)
- Google Search Console (SEO monitoring)
- Vercel Speed Insights (performance)

✅ **GDPR compliant:**
- Cookie consent banner
- Proper disclosures
- User can opt-out anytime

✅ **Better than most enterprise solutions:**
- Your system tracks more than GA4
- You have 100% data ownership
- Unlimited data retention
- Real-time (not delayed)

---

## 📚 Next Steps

### Learn GA4
- Free course: https://analytics.google.com/analytics/academy/

### Optimize SEO
- Google Search Console Training: https://developers.google.com/search/docs

### Monitor Performance
- Check Vercel Speed Insights: https://vercel.com/docs/speed-insights

### Read Full Guide
- See: `docs/GOOGLE-ANALYTICS-SEO-COMPLETE-IMPLEMENTATION.md`

---

**Total Setup Time:** 30 minutes  
**Monthly Cost:** €0  
**Maintenance:** < 10 minutes/week  
**Value:** Enterprise-grade analytics stack

---

**🎯 Start with Step 1 above!**

