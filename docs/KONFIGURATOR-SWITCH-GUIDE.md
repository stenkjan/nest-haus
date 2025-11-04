# NEST-Haus Konfigurator Migration Guide

**Version**: 1.0  
**Date**: November 3, 2025  
**Purpose**: Guide for switching from full konfigurator to simplified konfigurator2

---

## Overview

This guide provides step-by-step instructions for migrating from the current full-featured konfigurator (`/konfigurator`) to the simplified version (`/konfigurator2`).

The simplified konfigurator is designed for users who want to quickly get a preliminary design ("Vorentwurf") without configuring all details of their NEST house.

---

## Key Differences

### Full Konfigurator (`/konfigurator`)
- Complete configuration with all options
- Price calculations and display
- All categories: Gebäudehülle, Innenverkleidung, Fussboden, etc.
- "Dein Nest Überblick" panel
- Preview images with navigation arrows
- Full warenkorb with detailed configuration display
- Complete payment flow with multiple Teilzahlungen

### Simplified Konfigurator (`/konfigurator2`)
- Minimal configuration: Size and facade only
- No price display
- Only 2 categories: Nest (size) and Gebäudehülle (facade)
- No "Dein Nest Überblick" panel
- Static preview image (no navigation)
- Only "Direkt zum Vorentwurf" button
- Simplified warenkorb showing only Vorentwurf price (1.000 €)

---

## Migration Steps

### Phase 1: Preparation (1-2 days before migration)

1. **Backup Current Production**
   ```bash
   # Create a backup branch
   git checkout main
   git pull origin main
   git checkout -b backup-full-konfigurator-$(date +%Y%m%d)
   git push origin backup-full-konfigurator-$(date +%Y%m%d)
   ```

2. **Test Simplified Konfigurator**
   - Navigate to `/konfigurator2` on staging/development
   - Test all size options (NEST 75, 95, 115, 135, 155)
   - Test all facade options (Trapezblech, Holzlattung, Fassadenplatten Schwarz/Weiß)
   - Verify preview images update correctly
   - Test "Direkt zum Vorentwurf" button navigates to warenkorb
   - Verify warenkorb shows ohne nest mode correctly

3. **Verify URL Parameters**
   - Test `?mode=vorentwurf` activates ohne nest mode
   - Test ohne nest mode resets when returning from full konfigurator
   - Verify session persistence works correctly

---

### Phase 2: File Renaming (Execute in this order)

**CRITICAL**: Follow this exact sequence to avoid route conflicts.

1. **Rename Full Konfigurator to Backup**
   ```bash
   # Rename the full konfigurator directory
   mv src/app/konfigurator src/app/konfigurator-full
   ```

2. **Rename Simplified Konfigurator to Main**
   ```bash
   # Rename konfigurator2 to konfigurator
   mv src/app/konfigurator2 src/app/konfigurator
   ```

3. **Update Internal Imports** (if any direct imports exist)
   ```bash
   # Search for any hardcoded imports to old paths
   grep -r "from.*konfigurator2" src/
   # Manually update any found imports
   ```

4. **Update Authentication Redirects**
   - File: `src/app/konfigurator/page.tsx`
   - Ensure redirect URL is correct:
     ```typescript
     redirect("/auth?redirect=" + encodeURIComponent("/konfigurator"));
     ```

---

### Phase 3: Navigation and Link Updates

1. **Update Landing Page Links**
   - File: `src/app/page.tsx` or wherever main CTA buttons are
   - Change konfigurator links from `/konfigurator` to use new simplified version
   - Keep backup route `/konfigurator-full` accessible for power users (optional)

2. **Update Internal Navigation**
   - Check all `<Link href="/konfigurator">` references
   - Update footer links
   - Update navigation menu items

3. **Update Warenkorb "Jetzt konfigurieren" Buttons**
   - File: `src/app/warenkorb/components/CheckoutStepper.tsx`
   - Lines ~1684, ~2047 have links to `/konfigurator`
   - Decide if these should go to simplified or full version

---

### Phase 4: SEO and Metadata Updates

1. **Update Sitemap** (if applicable)
   ```xml
   <!-- Change from -->
   <url>
     <loc>https://nest-haus.at/konfigurator</loc>
   </url>
   
   <!-- To -->
   <url>
     <loc>https://nest-haus.at/konfigurator</loc>
     <changefreq>monthly</changefreq>
     <priority>0.9</priority>
   </url>
   <url>
     <loc>https://nest-haus.at/konfigurator-full</loc>
     <changefreq>monthly</changefreq>
     <priority>0.7</priority>
   </url>
   ```

2. **Update Metadata**
   - Simplified konfigurator should inherit existing metadata
   - Full konfigurator backup may need updated title/description

3. **Update Structured Data**
   - Verify `generateConfiguratorSchema()` works with simplified version
   - Update product schemas if needed

---

### Phase 5: Testing Checklist

#### Simplified Konfigurator (`/konfigurator`)
- [ ] All 5 size options selectable
- [ ] All 4 facade options selectable
- [ ] Preview image updates correctly
- [ ] No prices displayed anywhere
- [ ] "Direkt zum Vorentwurf" button works
- [ ] Navigates to `/warenkorb?mode=vorentwurf#übersicht`
- [ ] No "Neu konfigurieren" button visible
- [ ] No "Dein Nest Überblick" section

#### Warenkorb Ohne Nest Mode
- [ ] Overview shows "—" for "Dein Nest Haus"
- [ ] Overview shows "1.000 €" for "Check & Vorentwurf"
- [ ] Overview shows "—" for "Planungspaket"
- [ ] "Dein Nest Deine Konfiguration" box hidden
- [ ] "Dein Nest Ein Einblick in die Zukunft" box hidden
- [ ] Planungspakete section still visible and functional
- [ ] Abschluss step shows centered "Heute zu bezahlen" box with 1.000 €
- [ ] Disclaimer text visible: "Solltest du..."
- [ ] "Jetzt bezahlen" button hidden
- [ ] "Vorheriger Schritt" and "Zur Kassa" buttons visible

#### Full Konfigurator (`/konfigurator-full`) - Backward Compatibility
- [ ] All existing features still work
- [ ] Prices calculate correctly
- [ ] All selection categories available
- [ ] Preview image navigation with arrows works
- [ ] "Dein Nest Überblick" panel displays
- [ ] "Neu Konfigurieren" button works
- [ ] "In den Warenkorb" deactivates ohne nest mode
- [ ] Warenkorb displays full configuration details
- [ ] Payment flow works with all Teilzahlungen
- [ ] Stripe integration functional

#### State Management & Routing
- [ ] Mode persists across page reloads
- [ ] URL params sync with store state
- [ ] Session storage updates correctly
- [ ] Database session saves ohneNest flag
- [ ] Navigating from `/konfigurator-full` → `/warenkorb` resets ohne nest mode
- [ ] Navigating from `/konfigurator` → `/warenkorb` maintains ohne nest mode

---

### Phase 6: Deployment

1. **Create Migration PR**
   ```bash
   git checkout -b migration/simplified-konfigurator
   git add .
   git commit -m "feat: Switch to simplified konfigurator as default

   - Rename full konfigurator to /konfigurator-full
   - Rename konfigurator2 to /konfigurator (simplified)
   - Update all internal links and navigation
   - Update SEO metadata
   - Maintain backward compatibility for full konfigurator"
   
   git push origin migration/simplified-konfigurator
   ```

2. **Deploy to Staging First**
   - Test all scenarios on staging
   - Verify no broken links
   - Check analytics tracking still works
   - Test payment flow end-to-end

3. **Deploy to Production**
   - Schedule deployment during low-traffic period
   - Monitor error logs
   - Check Core Web Vitals
   - Verify all critical paths work

---

## Rollback Instructions

If issues arise, rollback immediately:

```bash
# Quick rollback: Swap directories back
mv src/app/konfigurator src/app/konfigurator-simplified-backup
mv src/app/konfigurator-full src/app/konfigurator

# Then redeploy
git add .
git commit -m "rollback: Revert to full konfigurator"
git push origin main
```

For Vercel deployment:
1. Go to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"

---

## Post-Migration Monitoring

### Week 1: Daily Checks
- Monitor error rates in Vercel logs
- Check conversion rate for "Direkt zum Vorentwurf"
- Verify payment success rate remains stable
- Monitor user feedback/support tickets

### Week 2-4: Weekly Checks
- Analyze user behavior (simplified vs full konfigurator usage)
- Compare bounce rates
- Check SEO rankings
- Review session duration and engagement

---

## Feature Comparison Table

| Feature | Full Konfigurator | Simplified Konfigurator |
|---------|------------------|------------------------|
| Route | `/konfigurator-full` | `/konfigurator` |
| Size Selection | ✅ 5 options | ✅ 5 options |
| Facade Selection | ✅ 4 options | ✅ 4 options |
| Interior Options | ✅ Complete | ❌ None |
| Floor Options | ✅ Complete | ❌ None |
| Lighting Packages | ✅ 3 levels | ❌ None |
| PV Modules | ✅ Configurable | ❌ None |
| Additional Options | ✅ 8+ categories | ❌ None |
| Price Display | ✅ Full breakdown | ❌ Hidden |
| Preview Navigation | ✅ Arrows | ❌ Static |
| Summary Panel | ✅ "Dein Nest Überblick" | ❌ Hidden |
| Cart Button | "In den Warenkorb" | "Direkt zum Vorentwurf" |
| Reset Button | ✅ "Neu konfigurieren" | ❌ Hidden |
| Warenkorb Mode | Full configuration | Ohne nest (Vorentwurf) |
| Payment Amount | Variable | Fixed 1.000 € |

---

## Technical Notes

### Session Management
- Ohne nest mode flag stored in both URL params and database
- Flag persists in `cartStore` via Zustand
- Cleared when user navigates from full konfigurator

### Image Loading
- Simplified konfigurator uses index 1 images (lines 228-251 in `images.ts`)
- Same image paths as full konfigurator
- No additional Google Drive sync required

### Price Calculations
- Full konfigurator: Client-side calculation via `PriceCalculator`
- Simplified konfigurator: Fixed 1.000 € for Vorentwurf
- No impact on existing price calculation logic

---

## Support & Troubleshooting

### Common Issues

**Issue**: Users can't find full konfigurator  
**Solution**: Add link in simplified konfigurator: "Erweiterte Konfiguration" → `/konfigurator-full`

**Issue**: Ohne nest mode not resetting  
**Solution**: Check `CartFooter.tsx` - ensure `setOhneNestMode(false)` is called

**Issue**: Wrong images loading  
**Solution**: Verify image paths in `SimplifiedPreviewPanel.tsx` use `images.configurator.exterior.index1`

**Issue**: Payment modal showing wrong amount  
**Solution**: Check `CheckoutStepper.tsx` - ensure 1.000 € is used in ohne nest mode

---

## Contact

For questions or issues during migration:
- Technical Lead: [Contact]
- DevOps: [Contact]
- Product Owner: [Contact]

---

## Changelog

- **v1.0** (2025-11-03): Initial migration guide created



