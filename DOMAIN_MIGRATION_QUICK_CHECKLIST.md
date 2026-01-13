# Domain Migration Quick Checklist

## ✅ Completed (January 12, 2026)

### Source Code Updates
- [x] All SEO metadata updated to `hoam-house.com`
- [x] All email templates updated
- [x] All structured data schemas updated
- [x] Sitemap & robots.txt updated
- [x] Analytics tracking updated
- [x] Security middleware updated
- [x] Environment variable examples updated
- [x] Lint check passed (0 errors)
- [x] **Verified: 0 references to old domains in source code**

---

## 🚀 Post-Deployment Actions Required

### 1. Vercel Configuration (High Priority)
- [ ] Add `hoam-house.com` to Vercel project domains
- [ ] Add `www.hoam-house.com` to Vercel project domains  
- [ ] Set `hoam-house.com` as primary domain
- [ ] Verify SSL certificates are active
- [ ] Test deployment: `https://hoam-house.com`

### 2. Environment Variables (Critical)
Update in Vercel Dashboard → Project → Settings → Environment Variables:
- [ ] No changes needed (domain is hard-coded in source)
- [ ] Verify `ADMIN_EMAIL` = `admin@hoam-house.com`
- [ ] Update Stripe webhook URL if needed

### 3. Google Search Console (SEO Critical)
- [ ] Add new property: `hoam-house.com`
- [ ] Verify ownership (HTML tag method recommended)
- [ ] Submit sitemap: `https://hoam-house.com/sitemap.xml`
- [ ] Request indexing for homepage
- [ ] Request indexing for `/konfigurator`
- [ ] Monitor coverage report

### 4. Google Analytics 4
- [ ] Update property for new domain (if needed)
- [ ] Remove cross-domain tracking references
- [ ] Create new hostname filter: `hoam-house.com`
- [ ] Test event tracking on live site
- [ ] Monitor real-time reports

### 5. Stripe Configuration
- [ ] Update webhook URL to: `https://hoam-house.com/api/webhooks/stripe`
- [ ] Test webhook delivery
- [ ] Verify payment flow works
- [ ] Test with test card: `4242 4242 4242 4242`

### 6. DNS & Redirects (Recommended)
If you still control `da-hoam.at` until end of January:
- [ ] Set up 301 redirect: `da-hoam.at` → `hoam-house.com`
- [ ] Set up 301 redirect: `www.da-hoam.at` → `hoam-house.com`
- [ ] Monitor redirect logs

### 7. Marketing & Communication
- [ ] Update social media profiles (Instagram, Facebook, LinkedIn)
- [ ] Update Google My Business listing
- [ ] Update email signatures
- [ ] Update business cards
- [ ] Update marketing materials
- [ ] Notify partners/clients of domain change

### 8. Testing (Before Going Live)
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Canonical tags show `hoam-house.com`
- [ ] OpenGraph preview works (use Facebook Debugger)
- [ ] Twitter card preview works
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`
- [ ] Email confirmation links work
- [ ] Admin panel links work
- [ ] Calendar invites (.ics) have correct domain
- [ ] Payment flow completes successfully

---

## 📊 Migration Summary

**Old Domains:**
- ❌ `da-hoam.at` (ending January 31, 2026)
- ❌ `nest-haus.at` (deprecated)

**New Domain:**
- ✅ `hoam-house.com` (primary)
- ✅ `www.hoam-house.com` (www subdomain)

**Files Changed:** 20  
**Lint Status:** ✅ Pass (0 errors)  
**Old Domain References:** ✅ 0 found  

---

## 🆘 Rollback Plan (Emergency)

If major issues occur after deployment:

1. **Immediate Rollback:**
   ```bash
   # Revert to previous commit
   git revert HEAD
   git push origin main
   ```

2. **Vercel Rollback:**
   - Go to Vercel Dashboard → Deployments
   - Find previous stable deployment
   - Click "..." → Promote to Production

3. **DNS Rollback:**
   - Restore old domain as primary in Vercel
   - Remove new domain temporarily

---

## 📞 Support Contacts

**Email:** mail@hoam-house.com  
**Admin:** admin@hoam-house.com  
**Emergency:** [Your emergency contact]

---

## ✅ Sign-Off

- [ ] Code review completed
- [ ] Testing completed
- [ ] Backup created
- [ ] Stakeholders notified
- [ ] Ready for production deployment

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Verified By:** _______________

---

**Last Updated:** January 12, 2026  
**Migration ID:** DOMAIN-2026-01-12
