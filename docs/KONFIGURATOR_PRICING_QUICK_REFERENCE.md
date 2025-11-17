# Konfigurator Pricing - Quick Reference Guide

**Last Updated:** November 14, 2025  
**Full Documentation:** See `KONFIGURATOR_PRICING_OVERHAUL_SUMMARY.md`

---

## 🚀 Quick Start

### **Update Prices**
1. Edit Google Sheet "Preistabelle_Verkauf" (ID: `10FYz4vTgdN-L4k87PYn-59-myGQel20svyJpYliRM38`)
2. Run sync: `POST /api/admin/sync-pricing?password=PASSWORD`
3. Wait 5 minutes for cache to expire OR clear: `sessionStorage.removeItem("nest-haus-pricing-data")`

### **Mark Price as "Auf Anfrage"**
1. In Google Sheet, change price cell to: `-`
2. Run sync
3. UI displays: `-` with "Auf Anfrage" subtitle

---

## 📊 Pricing System Architecture

```
Google Sheets (Source) 
  ↓ Daily sync at 2:00 AM UTC
Database (Shadow Copy)
  ↓ /api/pricing/data
SessionStorage Cache (5 min)
  ↓
PriceCalculator (Client-side)
  ↓
UI Components
```

---

## 💰 Price Calculation Model

### **Formula**
```
Total = Nest base + Gebäudehülle relative + Innenverkleidung relative 
        + Bodenbelag relative + Other options
```

### **Relative Pricing Categories**
- **Gebäudehülle**: Baseline = Trapezblech (0€)
- **Innenverkleidung**: Baseline = ohne_innenverkleidung (0€)
- **Bodenbelag**: Baseline = ohne_belag (0€)
- **Bodenaufbau**: Baseline = ohne_heizung (0€)
- **Planungspaket**: Baseline = Basis (0€)

### **Special Cases**
- **Geschossdecke**: Base price × quantity (D7 in sheet)
- **PV-Anlage**: Cumulative pricing by quantity (F29-N44)
- **Belichtungspaket**: Combined with Fenster material (F70-N78)

---

## 🔑 Google Sheet Structure

| Category | Rows | Columns | Notes |
|----------|------|---------|-------|
| **Nest Sizes** | 11-12 | F-N | Prices + m² areas |
| **Geschossdecke** | 7 | D7=price, F-N=max qty | Base price × quantity |
| **Gebäudehülle** | 17-20 | F-N | 4 options × 5 sizes |
| **Innenverkleidung** | 23-26 | F-N | 4 options × 5 sizes |
| **PV-Anlage** | 29-44 | F-N | 16 qty levels × 5 sizes |
| **Bodenbelag** | 50-53 | F-N | 4 options × 5 sizes |
| **Bodenaufbau** | 60-62 | F-N | 3 options × 5 sizes |
| **Belichtungspaket** | 70-78 | F-N | 9 combinations (total prices) |
| **Optionen** | 80-83 | D + F-N | Kaminschacht + Fundament |
| **Planungspakete** | 88-90 | F-N | Basis/Plus/Pro (same all sizes) |

**Column Mapping**: F=nest80, H=nest100, J=nest120, L=nest140, N=nest160

---

## 🎯 Key Rules

### **CRITICAL**
1. **Keys must match** across Google Sheet → pricing-sheet-service.ts → configuratorData.ts
2. **Always use PriceCalculator methods** - Never hardcode formulas
3. **Include geschossdeckeQuantity** in all m² calculations
4. **Preserve -1 values** - Don't convert to 0 until final display
5. **Run `npm run lint`** before committing

### **Thousands Format**
- Sheet values < 1000 are multiplied by 1000
- Example: 188.619 → 188,619€ | 4.115 → 4,115€
- No Math.round() - preserves exact decimals

### **Dash Prices ("-")**
- Parsed as -1 (sentinel value)
- Treated as 0€ in math operations
- Displays as "-" with "Auf Anfrage" subtitle
- If ANY item is -1, total becomes -1
- Relative pricing: -1 normalized to 0 for calculations

---

## 🛠️ Common Tasks

### **Add New Option**
1. Add row in Google Sheet with prices for all 5 nest sizes
2. Add mapping in `pricing-sheet-service.ts` (if name differs)
3. Add option in `configuratorData.ts` with matching ID
4. Add images to `/public/images/[category]/`
5. Run sync

### **Debug Price Mismatch**
```typescript
// Browser Console
PriceCalculator.getPricingData(); // Check data loaded
PriceCalculator.getCacheStats(); // Check cache performance
const config = useConfiguratorStore.getState().configuration;
PriceCalculator.calculateTotalPrice(config); // Test calculation
```

### **Verify Sync**
```bash
# Check pricing data API
curl "https://nest-haus.vercel.app/api/pricing/data" | jq '.version, .syncedAt'

# Check specific category
curl "https://nest-haus.vercel.app/api/pricing/data" | jq '.data.geschossdecke'
```

---

## 📐 m² Calculations

### **Formula**
```
Adjusted Area = Nest base area + (Geschossdecke qty × 6.5m²)
Price per m² = Item price / Adjusted Area
```

### **Base Areas**
- Nest 80: 75m² | Nest 100: 95m² | Nest 120: 115m²
- Nest 140: 135m² | Nest 160: 155m²

### **Categories Showing m² Price**
✅ Nest, Geschossdecke, Gebäudehülle, Innenverkleidung, Bodenbelag, Bodenaufbau, Fundament, Planungspakete

---

## 🔄 Session & Cart Flow

```
Konfigurator
  ↓ PriceCalculator.calculateTotalPrice()
  ↓ Save to Database (POST /api/user-session)
Warenkorb
  ↓ Load from Database (GET /api/user-session)
  ↓ Recalculate with same PriceCalculator methods
  ↓ Display with fresh prices
```

**Critical**: Warenkorb recalculates prices to catch Google Sheet updates since cart add.

---

## 🚨 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Price shows "inkludiert" instead of amount | Key mismatch between layers | Check mapping in pricing-sheet-service.ts |
| m² price incorrect | Missing geschossdecke in calculation | Use `PriceUtils.getAdjustedNutzflaeche(nest, qty)` |
| Prices don't match konfigurator/warenkorb | Different calculation methods | Always use PriceCalculator methods |
| Total shows wrong amount | Missing component in sum | Check all items added to total |
| "-" price breaks relative pricing | Not normalizing -1 to 0 | Use `normalized = price === -1 ? 0 : price` |

---

## 📚 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/pricing/data` | GET | Fetch current pricing |
| `/api/admin/sync-pricing?password=X` | POST | Manual sync |
| `/api/cron/sync-pricing-sheet` | GET | Auto sync (2 AM UTC) |
| `/api/user-session` | POST/GET | Save/load configuration |

---

## ✅ Pre-Commit Checklist

```bash
# 1. Lint
npm run lint # Must show: ✔ No ESLint warnings or errors

# 2. Build
npm run build # Must complete without TypeScript errors

# 3. Test pricing
curl "http://localhost:3000/api/pricing/data" | jq '.data.nest.nest80.price'
# Expected: 188619 (or -1 if marked as "-")

# 4. Browser test
# - Select options
# - Verify prices in summary
# - Add to cart
# - Check warenkorb displays correctly
```

---

## 📞 Support

**Issues?** See full documentation: `docs/KONFIGURATOR_PRICING_OVERHAUL_SUMMARY.md`  
**Questions?** Refer to code comments in core files

---

**Status**: ✅ Production Ready  
**Features**: Dynamic pricing + Relative pricing + Dash pricing + Full cart integration





