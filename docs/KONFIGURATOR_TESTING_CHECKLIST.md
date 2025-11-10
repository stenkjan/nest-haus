# Konfigurator Testing Checklist
**After Performance Optimizations**

Use this checklist to verify all optimizations are working correctly.

---

## 🔧 Quick Test (5 minutes)

### 1. Basic Functionality
- [ ] Load `/konfigurator` page
- [ ] Select Nest 80
- [ ] Change to Lärche gebäudehülle (should show +24,413€)
- [ ] Add PV modules (max should be 8 for Nest 80)
- [ ] Add to cart
- [ ] Check total price is correct

### 2. Cache Verification (Browser Console)
```javascript
// In browser console
PriceCalculator.getCacheStats()

// Should show:
// - hitRate increasing with usage
// - avgDuration < 50ms
// - size < 100 (bounded)
```

### 3. API Caching
```bash
# First request (uncached)
curl -s -w "Time: %{time_total}s\n" http://localhost:3000/api/pricing/data | grep "cached"
# Should show: "cached": false

# Second request (should be faster)
curl -s -w "Time: %{time_total}s\n" http://localhost:3000/api/pricing/data | grep "cached"
# Should show: "cached": true
```

---

## 📊 Performance Test (15 minutes)

### 1. Pricing Data Load
```javascript
// In browser console
const start = performance.now();
await fetch('/api/pricing/data');
const duration = performance.now() - start;
console.log('Load time:', duration, 'ms');

// Target: < 1500ms (will be <500ms after Redis)
// Cached: < 100ms
```

### 2. Price Calculation Speed
```javascript
// Open konfigurator
// Make 5-10 selections
// Check console for:
console.log(PriceCalculator.getCacheStats());

// Expected:
// - Hit rate > 50% after a few selections
// - avgDuration < 20ms
```

### 3. Memory Usage
```javascript
// Chrome DevTools → Performance → Memory
// 1. Start recording
// 2. Make 20+ selections in konfigurator
// 3. Stop recording
// 4. Check memory graph

// Expected:
// - No steady increase (no memory leak)
// - Cache stabilizes around 100 entries
```

---

## 🔍 Detailed Test (30 minutes)

### 1. Verify All Prices Match Sheet
| Item | Expected | Actual | Pass? |
|------|----------|--------|-------|
| Nest 80 base | ~189k€ | _____ | ☐ |
| Lärche | 24,413€ | _____ | ☐ |
| PV (1 module) | 3,934€ | _____ | ☐ |
| Geschossdecke | 4,115€ | _____ | ☐ |
| Planungspaket Plus | 9,600€ | _____ | ☐ |
| Planungspaket Pro | 12,700€ | _____ | ☐ |

### 2. Session Tracking
```bash
# Check database
psql $DATABASE_URL -c "
  SELECT sessionId, status, totalPrice 
  FROM user_sessions 
  ORDER BY startTime DESC 
  LIMIT 5;
"

# Verify:
# - New sessions created
# - Prices tracked correctly
# - Status updates (ACTIVE → IN_CART)
```

### 3. Analytics Verification
```bash
# Check analytics API
curl -s http://localhost:3000/api/admin/user-tracking | jq '.funnel'

# Verify:
# - totalSessions increasing
# - Funnel metrics calculating
# - Configuration analytics working
```

---

## 🚀 Load Test (Optional - 1 hour)

### 1. Concurrent Users
```bash
# Install artillery if not already installed
npm install -g artillery

# Create test script: artillery-test.yml
# Run 50 concurrent users for 5 minutes
artillery quick --count 50 --num 300 http://localhost:3000/konfigurator

# Check:
# - API response times stable
# - No memory leaks
# - Cache hit rate improving
```

### 2. Cache Stress Test
```javascript
// Generate 200 unique configurations
for (let i = 0; i < 200; i++) {
  const config = {
    nest: `nest${80 + (i % 5) * 20}`,
    gebaeudehuelle: ['trapezblech', 'holzlattung'][i % 2],
    // ... random selections
  };
  PriceCalculator.calculateTotalPrice(config);
}

// Check cache stats
console.log(PriceCalculator.getCacheStats());

// Expected:
// - Cache size caps at 100
// - No crashes
// - Hit rate stabilizes
```

---

## 🐛 Error Scenarios

### 1. Database Unavailable
```javascript
// Simulate by stopping database
// Konfigurator should:
// - Show error message
// - Offer reload button
// - Not crash
```

### 2. Pricing Data Missing
```bash
# Mark all pricing snapshots as inactive
psql $DATABASE_URL -c "
  UPDATE pricing_data_snapshots 
  SET isActive = false;
"

# Load konfigurator
# Expected:
# - Error message: "No pricing data available"
# - Graceful degradation
```

### 3. Network Timeout
```javascript
// Chrome DevTools → Network → Throttling
// Set to "Slow 3G"
// Load konfigurator

// Expected:
// - Loading state shows
// - Eventually loads or shows error
// - UI remains responsive
```

---

## ✅ Regression Test Checklist

### Functionality
- [ ] All Nest sizes selectable
- [ ] All gebäudehülle options work
- [ ] PV modules limited by Nest size
- [ ] Geschossdecke limited correctly
- [ ] Belichtungspaket + Fenster combinations work
- [ ] Planungspakete selectable
- [ ] Add to cart works
- [ ] Prices calculate correctly

### Performance
- [ ] Page loads in < 3s
- [ ] Pricing API < 2s (first load)
- [ ] Price calculations instant
- [ ] No console errors
- [ ] No memory leaks

### Tracking
- [ ] Sessions created
- [ ] Interactions tracked
- [ ] Prices tracked in sessions
- [ ] Analytics updated

---

## 🎯 Success Criteria

**All Tests Pass If:**
1. ✅ No errors in console
2. ✅ Cache hit rate > 50% after use
3. ✅ Memory usage stable
4. ✅ All prices match sheet
5. ✅ Session tracking works
6. ✅ Analytics functional

**Ready for Production If:**
1. All above criteria met
2. No regressions detected
3. Performance improved or stable
4. Documentation complete

---

## 📝 Report Template

```
# Test Results - [Date]

## Quick Test
- Basic functionality: [PASS/FAIL]
- Cache working: [PASS/FAIL]
- API caching: [PASS/FAIL]

## Performance
- Pricing API load: [XXX ms]
- Cache hit rate: [XX%]
- Memory usage: [Stable/Growing]

## Detailed Test
- Prices accurate: [X/7 pass]
- Session tracking: [PASS/FAIL]
- Analytics: [PASS/FAIL]

## Issues Found
1. [Description]
2. [Description]

## Overall Status: [PASS/FAIL]
```

---

## 💡 Tips

### Development
```javascript
// Enable verbose logging
localStorage.setItem('DEBUG', 'price-calculator');

// Check cache frequently
setInterval(() => {
  console.log(PriceCalculator.getCacheStats());
}, 5000);
```

### Debugging
```javascript
// If prices seem wrong:
console.log(PriceCalculator.getPricingData());

// If cache not working:
PriceCalculator.cache.clear();
PriceCalculator.cacheKeys = [];
```

### Performance Profiling
```javascript
// Chrome DevTools → Performance
// 1. Start recording
// 2. Make 10 selections
// 3. Stop recording
// 4. Look for:
//    - Long tasks (>50ms)
//    - Memory leaks
//    - Excessive renders
```

---

**Happy Testing!** 🎉

Questions? See:
- `docs/KONFIGURATOR_AUDIT_REPORT.md`
- `docs/KONFIGURATOR_OPTIMIZATION_PLAN.md`
- `docs/KONFIGURATOR_AUDIT_SUMMARY.md`

