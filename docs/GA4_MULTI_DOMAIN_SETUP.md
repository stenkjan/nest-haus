# GA4 Multi-Domain Tracking Implementation

**Status:** ✅ Code changes complete - Manual GA4 configuration required  
**Date:** December 23, 2025  
**Current Domains:** nest-haus.at (primary) and da-hoam.at (alias)  
**Future Strategy:** da-hoam.at will become primary domain  
**Architecture:** Future-proof for unlimited domain additions

---

## 📋 What Was Implemented

### Code Changes (✅ Complete)

1. **Cross-Domain Tracking in GoogleAnalyticsProvider**
   - Added `linker` configuration to enable session continuity between domains
   - File: `src/components/analytics/GoogleAnalyticsProvider.tsx`
   - Lines: 137-139

2. **Hostname Tracking in All Events**
   - All GA4 events now automatically include `hostname` parameter
   - File: `src/lib/ga4-tracking.ts`
   - Lines: 20-22

3. **Environment Variable Documentation**
   - Updated `.env.local.example` with multi-domain setup notes
   - Clarified that both domains should use the SAME Measurement ID

---

## 🔧 Manual Steps Required

### 1. Google Analytics Dashboard Configuration (10-15 minutes)

#### Step 1.1: Configure Referral Exclusions

This prevents self-referrals when users navigate between your domains.

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon, bottom left)
3. Navigate to **Property Settings** > **Data Streams**
4. Click on your web data stream
5. Click **Configure tag settings** > **Show more**
6. Click **List unwanted referrals**
7. Add both domains:
   - `nest-haus.at`
   - `da-hoam.at`
8. Click **Save**

#### Step 1.2: Configure Cross-Domain Measurement

This ensures user sessions continue across domains.

1. Still in your data stream settings (from Step 1.1)
2. Click **Configure tag settings**
3. Click **Configure your domains**
4. Add both domains:
   - `nest-haus.at`
   - `da-hoam.at`
5. Click **Save**

#### Step 1.3: Create Custom Comparisons for Domain Filtering

This allows you to filter reports by domain.

1. Go to **Reports** > **Engagement** > **Pages and screens**
2. Click **Add comparison** button (top of report)
3. Create first comparison:
   - Dimension: `Hostname`
   - Match type: `contains`
   - Value: `nest-haus.at`
   - Click **Apply**
4. Click **Add comparison** again
5. Create second comparison:
   - Dimension: `Hostname`
   - Match type: `contains`
   - Value: `da-hoam.at`
   - Click **Apply**
6. Save these comparisons for future use

**Result:** You can now toggle between:
- All traffic (both domains)
- nest-haus.at only
- da-hoam.at only

### 2. Environment Variables Setup (2 minutes per deployment)

#### For nest-haus.at (Current Domain)
✅ Already configured - no changes needed

#### For da-hoam.at (New Domain)

**Vercel Deployment:**

1. Go to Vercel Dashboard > da-hoam.at project
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variable:
   - **Key:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** `G-XXXXXXXXXX` (SAME as nest-haus.at)
   - **Environments:** Production, Preview, Development
4. Click **Save**
5. Redeploy the project for changes to take effect

**Local Development (.env.local):**

```bash
# Add to .env.local for da-hoam.at local development
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Same as nest-haus.at
```

---

## ✅ Verification & Testing (5 minutes)

### Test nest-haus.at Tracking

1. Visit https://nest-haus.at in a browser
2. Open Google Analytics > **Reports** > **Realtime**
3. Confirm you see active users
4. Check event details - should show `hostname: "nest-haus.at"`

### Test da-hoam.at Tracking

1. Visit https://da-hoam.at in a browser
2. Open Google Analytics > **Reports** > **Realtime**
3. Confirm you see active users
4. Check event details - should show `hostname: "da-hoam.at"`

### Test Cross-Domain Tracking (Optional)

Only needed if you have links between the two domains:

1. Visit nest-haus.at
2. Note the GA4 `client_id` in browser DevTools > Application > Cookies > `_ga`
3. Click a link that navigates to da-hoam.at
4. Check if the URL contains `_gl` parameter (e.g., `?_gl=1*abc123...`)
5. Verify the `client_id` remains the same on da-hoam.at
6. In GA4 Realtime, confirm it shows as a single session across both domains

### Test Domain Filtering

1. Go to **Reports** > **Engagement** > **Pages and screens**
2. Apply the "Hostname contains nest-haus.at" comparison
3. Verify you only see nest-haus.at pages
4. Switch to "Hostname contains da-hoam.at" comparison
5. Verify you only see da-hoam.at pages
6. Remove comparison to see all traffic from both domains

---

## 📊 How to Use Multi-Domain Tracking

### View Combined Analytics

By default, all reports show combined data from both domains.

**Example Use Cases:**
- Total website traffic across all properties
- Combined conversion rates
- Overall user demographics
- Aggregate ecommerce performance

### View Domain-Specific Analytics

Use the hostname dimension or custom comparisons.

**Method 1: Using Comparisons (Quick)**
1. Go to any report
2. Click **Add comparison**
3. Select `Hostname contains nest-haus.at` or `da-hoam.at`

**Method 2: Using Secondary Dimension (Detailed)**
1. Go to any report
2. Click **+** next to dimensions
3. Add `Hostname` as secondary dimension
4. Data will be broken down by domain in the table

**Method 3: Create Custom Report (Advanced)**
1. Go to **Library** > **Create new report**
2. Add `Hostname` as primary dimension
3. Add desired metrics (sessions, users, conversions, etc.)
4. Save for regular use

### Track Cross-Domain User Journeys

View user paths across both domains:

1. Go to **Reports** > **User acquisition** or **Traffic acquisition**
2. Add `Hostname` as secondary dimension
3. See which domain users start on and where they convert

**Example Insights:**
- Users who start on nest-haus.at and book appointment on da-hoam.at
- Cross-domain session durations
- Multi-domain conversion funnels

---

## 🔍 Important Considerations

### Data Retention
- **Historical data:** All existing nest-haus.at data remains unchanged
- **New data:** Starting from deployment, both domains will send data to the same property
- **Retroactive filtering:** Use the `hostname` dimension to filter historical vs. new data

### Privacy & Consent
- Cookie consent banner will appear on both domains
- Consent preferences are domain-specific (by design)
- Users must accept analytics cookies on each domain separately
- Cross-domain tracking only works for users who accept cookies on both domains

### Admin Dashboard Impact
- Your existing admin dashboard at `/admin/user-tracking` will show combined data
- To add domain filtering to admin widgets:
  - Update API routes to accept `hostname` filter parameter
  - Modify widgets to include hostname dropdown
  - Filter GA4 API queries by hostname dimension

### Performance Impact
- **Minimal:** The linker parameter adds ~100 bytes to cross-domain URLs
- **No impact** on page load times or Core Web Vitals
- **No additional** API calls or network requests

---

## 🚨 Troubleshooting

### Issue: da-hoam.at not tracking

**Check:**
1. Is `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in Vercel environment variables?
2. Did you redeploy after adding the environment variable?
3. Check browser console for GA4 script loading messages
4. Verify cookie consent is accepted (required for full tracking)

**Solution:**
```bash
# Verify environment variable is set
# In Vercel: Settings > Environment Variables
# Look for NEXT_PUBLIC_GA_MEASUREMENT_ID
```

### Issue: Cross-domain tracking not working

**Check:**
1. Are both domains added to referral exclusions?
2. Are both domains configured in cross-domain measurement?
3. Do links between domains use full URLs (not relative paths)?
4. Is `linker` parameter present in URL when crossing domains?

**Solution:**
- Verify GA4 dashboard configuration (Steps 1.1 and 1.2)
- Check browser DevTools > Network tab for `_gl` parameter in URLs

### Issue: Sessions breaking across domains

**Symptoms:**
- Different `client_id` on each domain
- Double-counting users in reports
- Broken conversion funnels

**Solution:**
1. Verify linker parameter is in code (already implemented)
2. Ensure both domains are in referral exclusions list
3. Check that cookies are not being blocked by browser
4. Test in incognito mode to avoid cookie conflicts

### Issue: Can't filter by domain in reports

**Check:**
1. Is `hostname` showing in event parameters?
2. Check Realtime reports > Event details

**Solution:**
- Code is already implemented to send hostname
- Wait 24-48 hours for custom parameters to populate in reports
- Use GA4 DebugView for immediate verification

---

## 🔄 Domain Migration & Future Planning

### Current Domain Strategy

**Phase 1: Current Setup (Dec 2025)**
```
Primary: nest-haus.at
Alias:   da-hoam.at
Status:  Both active, same content, unified tracking
```

**Phase 2: Future Migration (TBD)**
```
Primary: da-hoam.at (new main brand)
Legacy:  nest-haus.at (gradual redirect)
Status:  Seamless transition, all data preserved
```

### Adding Future Domains

The architecture is built to easily accommodate additional domains:

**Potential Future Domains:**
- da-hoam.de (Germany market)
- da-hoam.ch (Switzerland market)
- Any other regional or brand domains

**To Add a New Domain:**

1. **Vercel Setup (2 minutes)**
   - Add domain in Vercel project settings
   - Configure DNS
   - Domain automatically inherits all environment variables
   - No code changes needed ✓

2. **Update Cross-Domain Tracking (5 minutes)**
   ```typescript
   // src/components/analytics/GoogleAnalyticsProvider.tsx
   linker: {
     domains: ['nest-haus.at', 'da-hoam.at', 'new-domain.at']
   }
   ```

3. **Update GA4 Configuration (5 minutes)**
   - Add to referral exclusions
   - Add to cross-domain measurement
   - Create comparison filter for new domain

4. **Deploy & Verify**
   ```bash
   git commit -m "Add new-domain.at to tracking"
   git push
   ```

**Total Time:** ~15 minutes per new domain

### Domain Migration Best Practices

When transitioning from nest-haus.at → da-hoam.at:

**Before Migration:**
- ✅ Ensure both domains tracked in GA4
- ✅ Set up comparisons for each domain
- ✅ Monitor traffic distribution
- ✅ Identify baseline metrics

**During Migration:**
- Update external links gradually
- Implement 301 redirects strategically
- Monitor GA4 hostname dimension for shift
- Track conversion rates on both domains

**After Migration:**
- Keep nest-haus.at as permanent redirect
- Historical data preserved in GA4
- Filter reports by date range and hostname
- Use data for future rebranding decisions

### Benefits of Current Multi-Domain Setup

✅ **No Data Loss**
- All historical data from nest-haus.at preserved
- Seamless migration to da-hoam.at when ready
- Combined analytics show full picture

✅ **Flexible Timing**
- Migrate when business is ready
- No rush, no pressure
- Test new domain performance first

✅ **Risk Mitigation**
- Both domains work simultaneously
- Rollback capability if needed
- User experience uninterrupted

✅ **Future Expansion Ready**
- Add regional domains easily
- Scale to multiple markets
- Unified analytics across all properties

---

## 📚 Additional Resources

### GA4 Cross-Domain Tracking Documentation
- [Official Google Guide](https://support.google.com/analytics/answer/10071811)
- [Cross-Domain Measurement](https://developers.google.com/analytics/devguides/collection/ga4/cross-domain)

### Testing Tools
- **GA4 DebugView:** Real-time event debugging
- **Google Tag Assistant:** Chrome extension for verifying GA4 setup
- **Browser DevTools:** Check cookies, network requests, console logs

### Custom Dimensions
To create a custom dimension for hostname (optional):
1. Go to **Admin** > **Custom definitions**
2. Click **Create custom dimension**
3. Dimension name: `Domain`
4. Scope: `Event`
5. Event parameter: `hostname`
6. Click **Save**

Wait 24-48 hours for data to populate.

---

## ✅ Completion Checklist

**Google Analytics Configuration:**
- [ ] Referral exclusions added for both domains
- [ ] Cross-domain measurement configured
- [ ] Custom comparisons created for domain filtering

**Environment Variables:**
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in nest-haus.at deployment ✅ (already exists)
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in da-hoam.at deployment
- [ ] Both deployments redeployed after environment variable changes

**Testing:**
- [ ] nest-haus.at tracking verified in GA4 Realtime
- [ ] da-hoam.at tracking verified in GA4 Realtime
- [ ] Hostname parameter visible in event details
- [ ] Domain filtering working in reports
- [ ] Cross-domain tracking verified (if applicable)

**Optional Enhancements:**
- [ ] Custom dimension created for hostname
- [ ] Admin dashboard updated with domain filtering
- [ ] Custom reports created for domain comparison
- [ ] Conversion goals marked in GA4

---

## 📞 Support

If you encounter issues:

1. Check browser console for error messages
2. Verify GA4 DebugView shows events with hostname parameter
3. Ensure cookie consent is accepted on both domains
4. Review Google Analytics configuration steps above

**Files Modified:**
- `src/components/analytics/GoogleAnalyticsProvider.tsx`
- `src/lib/ga4-tracking.ts`
- `.env.local.example`

**Generated:** December 23, 2025

