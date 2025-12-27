# GA4 Multi-Domain Setup - Quick Checklist

**⏱️ Total Time:** ~20 minutes  
**Status:** Code changes complete ✅ | Manual setup required ⚠️  
**Current Domains:** nest-haus.at (primary) | da-hoam.at (alias)  
**Future-Proof:** Ready for additional domains | Migration to da-hoam.at as primary

---

## ✅ Code Changes (COMPLETE)

All code changes have been implemented and tested:

- ✅ Cross-domain linker added to GoogleAnalyticsProvider
- ✅ Hostname parameter added to all GA4 events
- ✅ Environment variable documentation updated
- ✅ No linting errors

**Files Modified:**
- `src/components/analytics/GoogleAnalyticsProvider.tsx`
- `src/lib/ga4-tracking.ts`
- `.env.local.example`

**Documentation Created:**
- `docs/GA4_MULTI_DOMAIN_SETUP.md` (detailed guide)
- `GA4_SETUP_CHECKLIST.md` (this file)

---

## ⚠️ Manual Steps Required

### Step 1: Google Analytics Dashboard (~10 minutes)

Login to [Google Analytics](https://analytics.google.com/)

#### 1.1 Referral Exclusions
1. Admin → Data Streams → [Your Stream]
2. Configure tag settings → Show more → List unwanted referrals
3. Add: `nest-haus.at`
4. Add: `da-hoam.at`
5. Save

#### 1.2 Cross-Domain Measurement
1. Same location: Configure tag settings
2. Configure your domains
3. Add: `nest-haus.at`
4. Add: `da-hoam.at`
5. Save

#### 1.3 Domain Filtering Setup
1. Reports → Any report
2. Add comparison → Hostname contains `nest-haus.at`
3. Add comparison → Hostname contains `da-hoam.at`
4. Save comparisons

---

### Step 2: Environment Variables (~5 minutes)

#### For da-hoam.at Deployment (Vercel)
1. Vercel Dashboard → da-hoam.at project
2. Settings → Environment Variables
3. Add new:
   - **Key:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** `G-XXXXXXXXXX` (same ID as nest-haus.at)
   - **Environments:** All (Production, Preview, Development)
4. Save
5. **Redeploy** the project

#### For Local Development (if needed)
Add to `.env.local`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

### Step 3: Testing & Verification (~5 minutes)

#### Test nest-haus.at
1. Visit https://nest-haus.at
2. GA4 → Realtime
3. ✅ Verify events show `hostname: "nest-haus.at"`

#### Test da-hoam.at
1. Visit https://da-hoam.at
2. GA4 → Realtime
3. ✅ Verify events show `hostname: "da-hoam.at"`

#### Test Domain Filtering
1. Reports → Pages and screens
2. Apply hostname filter
3. ✅ Verify data separates by domain

---

## 🎯 Quick Reference

### What This Setup Does

✅ **Tracks both domains** in a single GA4 property  
✅ **Maintains session continuity** when users navigate between domains  
✅ **Allows filtering** to view each domain separately  
✅ **Preserves historical data** from nest-haus.at  
✅ **Enables combined analytics** across all properties

### Key Points

- Both domains use the **SAME** Measurement ID (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- Historical data from nest-haus.at is **preserved**
- Use `hostname` dimension to **filter** by domain in reports
- Cross-domain tracking requires users to **accept cookies** on both sites

---

## 🚨 Common Issues

### "da-hoam.at not tracking"
→ Check: Environment variable set in Vercel?  
→ Fix: Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` and redeploy

### "Can't filter by domain"
→ Check: Events showing hostname parameter?  
→ Fix: Wait 24-48 hours or check DebugView

### "Sessions breaking across domains"
→ Check: Referral exclusions added?  
→ Fix: Complete Step 1.1 above

---

## 📚 Full Documentation

For detailed information, see:
- `docs/GA4_MULTI_DOMAIN_SETUP.md` - Complete implementation guide
- `docs/final_GOOGLE-ANALYTICS-SEO-COMPLETE-IMPLEMENTATION.md` - Original GA4 setup

---

## ✅ Final Checklist

**Before deploying to da-hoam.at:**
- [ ] GA4 referral exclusions configured
- [ ] GA4 cross-domain measurement enabled
- [ ] Domain filtering comparisons created
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in Vercel
- [ ] da-hoam.at redeployed

**After deployment:**
- [ ] nest-haus.at tracking verified
- [ ] da-hoam.at tracking verified
- [ ] Domain filtering tested
- [ ] Realtime events show correct hostname

---

**Questions?** Check `docs/GA4_MULTI_DOMAIN_SETUP.md` for troubleshooting.

---

## 🔮 Future Domain Planning

### Current Architecture
- ✅ Single Vercel project serves all domains
- ✅ Same GA4 Measurement ID for all
- ✅ Cross-domain session continuity
- ✅ Hostname parameter tracks domain separation

### Adding Future Domains (e.g., da-hoam.de, da-hoam.ch)

**Quick Steps:**
1. Add domain in Vercel project settings (2 min)
2. Update linker domains in `GoogleAnalyticsProvider.tsx` (1 min)
3. Add to GA4 referral exclusions (2 min)
4. Add to GA4 cross-domain measurement (2 min)
5. Deploy and verify (5 min)

**Total:** ~15 minutes per new domain

### Domain Migration Readiness

**When switching primary from nest-haus.at → da-hoam.at:**
- All tracking continues seamlessly
- Historical data preserved
- Filter by hostname to compare performance
- No code changes needed
- Gradual user migration supported

**Architecture supports:**
- Unlimited domains
- Easy domain additions/removals
- Brand evolution and rebranding
- Regional market expansion
- Zero downtime migrations

---

**Last Updated:** December 23, 2025  
**Version:** 1.1.0 - Multi-Domain Architecture Edition

