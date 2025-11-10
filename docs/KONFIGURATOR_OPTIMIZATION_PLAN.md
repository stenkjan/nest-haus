# Konfigurator Optimization Plan
**Priority-Based Action Plan**  
**Date:** November 10, 2025

---

## Quick Wins (Implement Now - No Breaking Changes)

### 1. Add LRU Cache to PriceCalculator ⚡
**Impact:** Prevent memory leaks, improve performance  
**Effort:** Low (30 min)  
**Risk:** None

**Current Issue:**
```typescript
// PriceCalculator.ts - unbounded cache
private static cache = new Map<string, { result: number; timestamp: number }>()
```

**Solution:**
```typescript
// Implement LRU with max 100 entries
private static MAX_CACHE_SIZE = 100;
private static cacheKeys: string[] = []; // Track insertion order

private static getCachedResult(key: string, calculator: () => number): number {
  // ... existing cache check ...
  
  // On cache miss, add with LRU eviction
  if (this.cache.size >= this.MAX_CACHE_SIZE) {
    const oldestKey = this.cacheKeys.shift();
    if (oldestKey) this.cache.delete(oldestKey);
  }
  
  this.cache.set(key, { result, timestamp: now });
  this.cacheKeys.push(key);
}
```

---

### 2. Add Image Priority Hints ⚡
**Impact:** Improve LCP by 20-30%  
**Effort:** Low (15 min)  
**Risk:** None

**Implementation:**
```typescript
// In PreviewPanel or HybridBlobImage
<img
  src={imageSrc}
  alt="Konfigurator Preview"
  loading="eager"  // ✅ Add for above-fold images
  fetchPriority="high"  // ✅ Priority hint for main image
  decoding="async"
/>
```

---

### 3. Add Performance Logging ⚡
**Impact:** Enable monitoring and debugging  
**Effort:** Low (20 min)  
**Risk:** None

**Add to PriceCalculator:**
```typescript
// Log slow calculations in development
if (process.env.NODE_ENV === 'development' && duration > 50) {
  console.warn(`⚠️ Slow price calculation: ${duration}ms for ${cacheKey}`);
}

// Log cache statistics periodically
static getCacheStats() {
  return {
    size: this.cache.size,
    hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses),
    avgDuration: this.totalDuration / this.calculations
  };
}
```

---

### 4. Optimize API Response Caching ⚡
**Impact:** Reduce repeated database queries  
**Effort:** Low (10 min)  
**Risk:** None

**Current:**
```typescript
// src/app/api/pricing/data/route.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

**Optimization:**
Add cache headers for browser caching:
```typescript
return NextResponse.json(response, {
  headers: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    'CDN-Cache-Control': 'public, s-maxage=3600',
  },
});
```

---

### 5. Add Viewport Height Stability ⚡
**Impact:** Reduce CLS (Cumulative Layout Shift)  
**Effort:** Low (5 min)  
**Risk:** None

**Issue:** Mobile viewport changes on scroll
**Fix:** Already partially implemented, enhance:
```css
/* globals.css */
.configurator-shell {
  min-height: 100vh;
  min-height: 100dvh; /* ✅ Dynamic viewport height */
}
```

---

## Medium Priority (Implement This Week)

### 6. Create Performance Metrics API 📊
**Impact:** Enable monitoring and alerting  
**Effort:** Medium (2 hours)  
**Risk:** Low

**Create:** `src/app/api/admin/performance-metrics/route.ts`

```typescript
export async function GET() {
  const metrics = {
    pricing: {
      avgLoadTime: await getAvgPricingLoadTime(),
      cacheHitRate: await getPricingCacheHitRate(),
      lastSyncTime: await getLastSyncTime(),
    },
    calculations: {
      avgDuration: PriceCalculator.getCacheStats().avgDuration,
      cacheHitRate: PriceCalculator.getCacheStats().hitRate,
    },
    sessions: {
      activeCount: await getActiveSessionCount(),
      avgDuration: await getAvgSessionDuration(),
    },
    database: {
      queryPerformance: await getSlowQueries(),
      connectionPool: await getPoolStats(),
    }
  };
  
  return NextResponse.json(metrics);
}
```

---

### 7. Optimize Pricing Data Query 🗄️
**Impact:** Reduce API response from 1.4s to <500ms  
**Effort:** Medium (1-2 hours)  
**Risk:** Low

**Current Bottleneck:** Database query + JSON parsing

**Optimizations:**
1. **Add database index:**
```sql
CREATE INDEX idx_pricing_active ON pricing_data_snapshots(isActive, syncedAt DESC)
WHERE isActive = true;
```

2. **Use connection pooling:**
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  
  // ✅ Add connection pooling
  connection_limit = 10
  pool_timeout = 20
}
```

3. **Simplify query:**
```typescript
// pricing-db-service.ts
const snapshot = await prisma.pricingDataSnapshot.findFirst({
  where: { isActive: true },
  select: {
    pricingData: true,  // Only fetch data, not metadata
    version: true,
    syncedAt: true,
  },
  // ✅ Use take instead of findFirst for better performance
  take: 1,
});
```

---

### 8. Implement Client-Side Error Tracking 🐛
**Impact:** Better debugging and error recovery  
**Effort:** Medium (1 hour)  
**Risk:** None

**Add error boundary:**
```typescript
// src/components/ErrorBoundary.tsx
export class KonfiguratorErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to analytics
    fetch('/api/errors/log', {
      method: 'POST',
      body: JSON.stringify({ error: error.message, stack: errorInfo }),
    });
    
    // Show user-friendly message
    this.setState({ hasError: true });
  }
}
```

---

## High Impact (Implement This Month)

### 9. Redis Caching Layer 🚀
**Impact:** Reduce pricing API response to <100ms  
**Effort:** High (4-6 hours)  
**Risk:** Medium (requires Redis setup)

**Architecture:**
```
Browser → Next.js API → Redis Cache → PostgreSQL
                ↓ (cache miss)
         PostgreSQL → Redis → Browser
```

**Implementation:**
```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export async function getPricingWithCache() {
  // Try Redis first
  const cached = await redis.get('pricing:active');
  if (cached) return cached;
  
  // Fallback to DB
  const data = await getPricingDataFromDb();
  
  // Cache for 1 hour
  await redis.set('pricing:active', data, { ex: 3600 });
  
  return data;
}
```

---

### 10. Improve Cart Reach Rate 📈
**Impact:** Increase inquiries by 2-3x  
**Effort:** High (1 week)  
**Risk:** Low (A/B test first)

**Current:** 3.87% cart reach  
**Target:** 10%+

**Strategies:**

1. **Add Progress Indicator:**
```typescript
// Show how far they are
<ProgressBar 
  steps={['Nest', 'Hülle', 'Innen', 'Extras']}
  current={currentStep}
  completion={75}  // ✅ Motivates completion
/>
```

2. **Quick-Check Mode:**
```typescript
// Minimal configuration flow
- Nest size
- Budget range
- Style preference
→ Generate starter configuration
→ Invite to refine
```

3. **Exit Intent Popup:**
```typescript
// When user tries to leave
"Noch 3 Schritte bis zu Ihrem Preis!"
- Save configuration
- Get price estimate
- Schedule callback
```

4. **Price Preview Earlier:**
```typescript
// Show estimated price after Nest selection
"Ihr Nest startet bei ~189.000€"
// Builds commitment, reduces abandonment
```

---

## Database Optimizations

### 11. Add Critical Indices 🗄️
**Impact:** Faster queries across all features  
**Effort:** Low (30 min)  
**Risk:** Low

```sql
-- User sessions (for tracking queries)
CREATE INDEX idx_user_sessions_status_time 
ON user_sessions(status, startTime DESC);

CREATE INDEX idx_user_sessions_config 
ON user_sessions USING gin(configurationData)
WHERE configurationData IS NOT NULL;

-- Interaction events (for analytics)
CREATE INDEX idx_interaction_events_session 
ON interaction_events(sessionId, eventType, timestamp DESC);

-- Pricing snapshots (already optimized)
-- ✅ Existing index sufficient
```

---

## Testing & Monitoring

### 12. Add Automated Performance Tests 🧪
**Impact:** Catch regressions early  
**Effort:** Medium (3 hours)  
**Risk:** None

```typescript
// test/performance/pricing-performance.test.ts
describe('Pricing Performance', () => {
  it('loads pricing data in < 500ms', async () => {
    const start = Date.now();
    await fetch('/api/pricing/data');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500);
  });
  
  it('calculates prices in < 100ms', () => {
    const start = performance.now();
    PriceCalculator.calculateTotalPrice(testConfig);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });
});
```

---

## Implementation Timeline

### Week 1 (Quick Wins)
- ✅ Add LRU cache to PriceCalculator
- ✅ Add image priority hints
- ✅ Add performance logging
- ✅ Optimize API caching headers
- ✅ Fix viewport height

**Expected Impact:** 15-20% performance improvement

### Week 2 (Medium Priority)
- Create performance metrics API
- Optimize pricing data query
- Add database indices
- Implement error tracking

**Expected Impact:** 60-70% API response improvement

### Week 3-4 (High Impact)
- Setup Redis caching
- Implement cart reach improvements
- Add automated tests

**Expected Impact:** 2-3x more conversions

---

## Success Metrics

### Performance
- Pricing API: 1.4s → <500ms (✅ 64% improvement)
- Price calculations: <100ms (✅ target)
- LCP: <2.5s (✅ target)

### Business
- Cart reach: 3.87% → 10%+ (✅ 2.5x improvement)
- Inquiries: 12/month → 30+/month (✅ 2.5x improvement)

### Technical
- Cache hit rate: 0% → 80%+ (✅ massive improvement)
- Memory usage: Unbounded → <100MB (✅ stable)

---

## Risk Mitigation

### For Each Change:
1. ✅ Test locally first
2. ✅ Deploy to staging
3. ✅ Monitor for 24h
4. ✅ Gradual rollout (10% → 50% → 100%)
5. ✅ Rollback plan ready

### Monitoring Checklist:
- [ ] API response times
- [ ] Error rates
- [ ] Memory usage
- [ ] Cache hit rates
- [ ] Conversion funnel

---

## Conclusion

**Immediate Actions (Today):**
1. Implement LRU cache
2. Add image priority hints
3. Add performance logging

**This Week:**
1. Create performance metrics API
2. Optimize database queries
3. Add indices

**This Month:**
1. Setup Redis caching
2. Implement cart improvements
3. Add automated tests

**Expected Results:**
- 60-70% faster load times
- 2-3x more inquiries
- Better monitoring and debugging

**Next Review:** After Week 1 implementation

