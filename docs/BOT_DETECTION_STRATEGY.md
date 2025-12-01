# Bot Detection Strategy

## Overview

This document outlines the bot detection strategy implemented to align admin tracking with GA4 metrics and filter out non-human traffic.

## Problem Statement

**Initial Discrepancy:**
- GA4: 78 active users (since Nov 19, 2024)
- Admin: 462 sessions (since Nov 18, 2024)
- Gap: 384 sessions (83%) not appearing in GA4

**Root Cause:**
Admin tracking captured ALL requests including bots, scrapers, and automated health checks, while GA4 has built-in bot filtering.

## Solution Architecture

### 1. Bot Detection System

**Existing Components:**
- `BotDetector` class (`src/lib/security/BotDetector.ts`)
- `BehavioralAnalyzer` for pattern detection
- `BotDetection` database table for audit trail

**Detection Methods:**
1. **User-Agent Analysis**: Pattern matching against known bot signatures
   - Googlebot, Bingbot, Vercel health checks
   - Headless browsers (Puppeteer, Selenium)
   - Common scrapers (curl, wget, Python requests)

2. **IP Range Detection**: Known bot IP ranges
   - Google: 66.249.*, 64.233.*, etc.
   - Vercel: 76.76.*
   - AWS/cloud provider ranges

3. **Behavioral Heuristics**:
   - No interactions + short duration (<5s) = likely bot
   - Many visits with zero interactions = scraper
   - Rapid sequential requests = automated

### 2. Database Schema Updates

**Added to UserSession model:**
```prisma
isBot              Boolean?  // Detected as bot/scraper
botConfidence      Float?    // 0-1 confidence score
botDetectionMethod String?   // Detection method used
qualityScore       Float?    // 0-1 overall session quality
```

**Quality Score Calculation:**
- Base: 0.5 (neutral)
- Real user baseline: 0.7
- Bonuses: +0.1 for interactions, +0.1 for >30s duration, +0.1 for multiple pages
- Bot penalty: Reduced by confidence level

### 3. Real-Time Bot Detection

**Integration Point:** `src/app/api/sessions/track-interaction/route.ts`

On every session creation/update:
1. Extract User-Agent and IP address
2. Run through BotDetector
3. Calculate quality score
4. Store results in database
5. Create BotDetection audit record if flagged

**Non-Blocking:** Bot detection runs asynchronously and doesn't block user experience.

### 4. Filtered Views

**Three Filter Modes:**

1. **All Sessions** (`filter=all`)
   - Shows everything (bots + humans)
   - Useful for total traffic analysis

2. **Real Users Only** (`filter=real_users`)
   - GA4-aligned view
   - Filters: `isBot = false OR (isBot = null AND qualityScore >= 0.6)`
   - Expected to match GA4 metrics closely

3. **Bots Only** (`filter=bots`)
   - Shows only detected bots
   - Useful for SEO analysis and security monitoring

## API Endpoints

### 1. Bot Analysis
**Endpoint:** `GET /api/admin/bot-analysis`

Returns:
- Total sessions vs bot vs real user breakdown
- USA sessions analysis (since most were bots)
- Bot types detected (Googlebot, Bingbot, scrapers, etc.)
- Geographic distribution
- GA4 comparison metrics

### 2. Retroactive Analysis
**Endpoint:** `POST /api/admin/retroactive-bot-analysis`

One-time script to analyze existing sessions without bot detection:
- Fetches all sessions where `isBot = null`
- Re-runs bot detection
- Updates database
- Generates report

### 3. User Tracking with Filter
**Endpoint:** `GET /api/admin/user-tracking?filter=real_users`

Enhanced to accept filter parameter:
- Applies bot filter to all queries
- Returns filtered metrics
- Includes filter info in metadata

## Dashboard Components

### 1. BotAnalysisWidget
- Real-time bot vs human stats
- USA sessions breakdown
- Bot types pie chart
- GA4 alignment indicator

### 2. GA4ComparisonWidget
- Side-by-side comparison table
- Alignment quality indicator
- Action suggestions if misaligned

### 3. FilterToggle
- Three-button toggle: All / Real Users / Bots
- Shows count for each filter
- Contextual info banners

## Expected Results

**After Full Implementation:**
- Admin "Real Users" view: ~78-85 sessions (matches GA4)
- Bot filter efficiency: ~380-390 bots filtered (83%)
- USA sessions: Majority classified as Googlebot/Vercel
- Data alignment confidence: >90%

## Bot Confidence Thresholds

| Confidence | Classification | Action |
|------------|---------------|--------|
| 0.0 - 0.3  | Likely human | Include in "real users" |
| 0.3 - 0.6  | Uncertain | Include if qualityScore >= 0.6 |
| 0.6 - 0.8  | Likely bot | Exclude from "real users" |
| 0.8 - 1.0  | Definitely bot | Always exclude |

## Common Bot Patterns Detected

### USA Traffic (Primary Source of Bots)

1. **Googlebot (SEO Crawler)**
   - User-Agent: `Mozilla/5.0 (compatible; Googlebot/2.1; ...)`
   - IP Range: 66.249.*
   - Behavior: Rapid page crawling, no interactions
   - **Action:** Flag as bot, keep for SEO insights

2. **Vercel Health Checks**
   - User-Agent: Contains "vercel"
   - IP Range: 76.76.*
   - Behavior: Regular health pings
   - **Action:** Flag as bot, exclude from metrics

3. **Headless Browsers**
   - User-Agent: Contains "HeadlessChrome", "Puppeteer"
   - Behavior: Automated testing or scraping
   - **Action:** High confidence bot

4. **Generic Scrapers**
   - User-Agent: curl, wget, Python-requests, axios
   - Behavior: Single-page access, immediate exit
   - **Action:** Definite bot

## Testing & Validation

### Manual Testing
```bash
# Test with bot user-agent
curl -H "User-Agent: Googlebot/2.1" http://localhost:3000

# Should be flagged in database:
# isBot = true, confidence >= 0.95
```

### Validation Checklist
- [ ] Run retroactive analysis on existing sessions
- [ ] Compare filtered admin data with GA4 export
- [ ] Verify 10 random USA sessions manually
- [ ] Check for false positives (real users flagged as bots)
- [ ] Adjust threshold if alignment < 90%

## Maintenance

### Regular Tasks
1. **Weekly:** Review bot detection accuracy
2. **Monthly:** Update bot patterns (new scrapers, etc.)
3. **Quarterly:** Audit USA traffic for new bot sources

### Alerts
- Trigger alert if bot percentage > 90%
- Alert if GA4 alignment drops below 80%
- Monitor for sudden spike in unknown USA traffic

## Privacy & Compliance

- Bot detection data stored for analytics only
- No PII collected from bots
- Bot records can be purged after 90 days
- GDPR compliant (legitimate interest for security)

## Performance Impact

- Bot detection: ~5-10ms per session
- Non-blocking: Runs asynchronously
- Database impact: Minimal (indexed fields)
- Cache-friendly: Bot patterns cached in memory

## Future Enhancements

1. **Machine Learning:** Train model on behavioral patterns
2. **Fingerprinting:** Add browser fingerprint analysis
3. **Challenge Response:** CAPTCHA for uncertain cases
4. **Real-Time Alerts:** Notify on suspicious bot activity
5. **IP Reputation:** Integrate with threat intelligence feeds

---

**Last Updated:** December 1, 2024
**Status:** ✅ Implemented
**Alignment Goal:** Admin ≈ GA4 ±10%

