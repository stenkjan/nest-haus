# 🔧 Admin Usage Monitoring - Issues & Fixes

## 🐛 **Current Issues Identified**

### 1. Rate Limiting Shows 100% (❌ INACCURATE)

**Problem**: The system estimates usage based on active sessions instead of reading actual rate limit counters.

**Current Code** (`src/lib/monitoring/UsageMonitor.ts:118-136`):
```typescript
// ❌ ESTIMATION - Not actual usage
const activeSessions = await this.getActiveSessionCount();
const estimated = Math.min(activeSessions * 5, this.LIMITS.rateLimit.ipBased);
```

**Why It's Wrong**:
- Assumes 5 requests per session
- Doesn't read actual rate limit counters from SecurityMiddleware
- Shows 100% even when you're making minimal requests

**Impact**: You think you're hitting rate limits when you're not!

---

### 2. Redis Usage is Estimated (⚠️ INACCURATE)

**Current Code** (`src/lib/monitoring/UsageMonitor.ts:187-211`):
```typescript
// ❌ ESTIMATION - Not actual Redis commands
const estimatedCommands = activeSessions * 10;
```

**Why It's Wrong**:
- Doesn't track actual Redis commands
- No connection to Redis client to get real stats
- Upstash provides actual command counts via their API

**Impact**: You don't know if you're really approaching the 10k/day limit.

---

### 3. Storage Tracking is Hardcoded (⚠️ STATIC)

**Current Code** (`src/lib/monitoring/UsageMonitor.ts:256-266`):
```typescript
// ❌ HARDCODED - Never updates!
const estimatedGB = 0.05; // Always 50MB
```

**Why It's Wrong**:
- Doesn't check actual Vercel Blob storage usage
- Vercel provides storage stats via API
- Number never changes as you add images

**Impact**: Won't warn you when storage is actually filling up.

---

### 4. Database Storage is Rough Estimate (⚠️ APPROXIMATE)

**Current Code** (`src/lib/monitoring/UsageMonitor.ts:152-153`):
```typescript
// ❌ ROUGH ESTIMATE
const estimatedMB = totalRecords / 1000; // ~1KB per record
```

**Why It's Problematic**:
- PostgreSQL has actual size you can query
- Different record types have different sizes
- JSON fields (configurationData) can be large

**Impact**: Less critical but still inaccurate.

---

## ✅ **Proposed Fixes**

### Fix 1: Real Rate Limit Tracking

**Option A: Export Rate Limit Store (Recommended)**

Create a getter in SecurityMiddleware:

```typescript
// src/lib/security/SecurityMiddleware.ts

export class SecurityMiddleware {
  // ... existing code ...

  /**
   * Get current rate limit statistics
   * For usage monitoring dashboard
   */
  static getRateLimitStats(): {
    ipLimits: number;
    sessionLimits: number;
    totalActive: number;
  } {
    let ipCount = 0;
    let sessionCount = 0;
    const now = Date.now();

    // Count active IP limits
    for (const [_key, value] of rateLimitStore.entries()) {
      if (now <= value.resetTime) {
        ipCount += value.count;
      }
    }

    // Count active session limits
    for (const [_key, value] of sessionLimitStore.entries()) {
      if (now <= value.resetTime) {
        sessionCount += value.count;
      }
    }

    return {
      ipLimits: ipCount,
      sessionLimits: sessionCount,
      totalActive: ipCount + sessionCount,
    };
  }
}
```

**Then update UsageMonitor**:

```typescript
static async getRateLimitUsage(): Promise<RateLimitInfo> {
  const stats = SecurityMiddleware.getRateLimitStats();
  const now = Date.now();
  const resetTime = now + (15 * 60 * 1000);

  // Use actual IP limit count
  return {
    current: stats.ipLimits,
    limit: this.LIMITS.rateLimit.ipBased,
    resetTime,
    percentage: (stats.ipLimits / this.LIMITS.rateLimit.ipBased) * 100,
    window: "15 minutes",
  };
}
```

**Benefits**:
- ✅ Shows ACTUAL request counts
- ✅ Real-time accuracy
- ✅ No estimation needed

---

### Fix 2: Track Redis Commands Properly

**Option A: Use Redis INFO command**

```typescript
import redis from '@/lib/redis';

static async getRedisUsage(): Promise<RedisInfo> {
  try {
    // Upstash Redis supports INFO command for stats
    const info = await redis.info('stats');
    
    // Parse total_commands_processed from INFO output
    const commandMatch = info.match(/total_commands_processed:(\d+)/);
    const totalCommands = commandMatch ? parseInt(commandMatch[1]) : 0;
    
    // Get memory usage
    const memInfo = await redis.info('memory');
    const memMatch = memInfo.match(/used_memory_human:(\d+\.?\d*)M/);
    const memoryMB = memMatch ? parseFloat(memMatch[1]) : 0;

    return {
      commands: totalCommands,
      storage: memoryMB,
      limit: this.LIMITS.redis,
      percentage: (totalCommands / this.LIMITS.redis.commands) * 100,
    };
  } catch (error) {
    console.error('Failed to get Redis usage:', error);
    // Fallback to estimation
    return this.getRedisUsageEstimate();
  }
}
```

**Option B: Track Commands Manually**

Create a Redis wrapper that counts commands:

```typescript
// src/lib/redis/RedisMonitor.ts
class RedisMonitor {
  private static commandCount = 0;
  private static lastReset = Date.now();

  static incrementCommandCount() {
    this.commandCount++;
    
    // Reset daily
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    if (now - this.lastReset > dayMs) {
      this.commandCount = 0;
      this.lastReset = now;
    }
  }

  static getCommandCount(): number {
    return this.commandCount;
  }
}
```

---

### Fix 3: Real Blob Storage Tracking

**Vercel Blob API Integration**:

```typescript
import { list } from '@vercel/blob';

static async getStorageUsage(): Promise<StorageInfo> {
  try {
    // List all blobs to calculate total size
    const { blobs } = await list();
    
    // Sum up all blob sizes
    const totalBytes = blobs.reduce((sum, blob) => sum + blob.size, 0);
    const totalGB = totalBytes / (1024 * 1024 * 1024);

    return {
      used: Number(totalGB.toFixed(3)),
      limit: this.LIMITS.storage.total,
      percentage: (totalGB / this.LIMITS.storage.total) * 100,
      blobCount: blobs.length,
    };
  } catch (error) {
    console.error('Failed to get blob storage usage:', error);
    // Fallback to conservative estimate
    return {
      used: 1.0, // 1GB conservative estimate
      limit: this.LIMITS.storage.total,
      percentage: 1.0,
      blobCount: 0,
    };
  }
}
```

---

### Fix 4: Accurate Database Size

**PostgreSQL Query for Actual Size**:

```typescript
static async getDatabaseUsage(): Promise<DatabaseInfo> {
  try {
    // Get record counts (keep existing)
    const [sessionCount, eventCount, interactionCount] = await Promise.all([
      prisma.userSession.count(),
      prisma.selectionEvent.count(),
      prisma.interactionEvent.count(),
    ]);

    const totalRecords = sessionCount + eventCount + interactionCount;

    // Get actual database size from PostgreSQL
    const sizeResult = await prisma.$queryRaw<Array<{ size_mb: number }>>`
      SELECT 
        pg_size_pretty(pg_database_size(current_database())) as size_pretty,
        ROUND(pg_database_size(current_database()) / 1024.0 / 1024.0, 2) as size_mb
    `;

    const actualMB = sizeResult[0]?.size_mb || totalRecords / 1000;

    return {
      records: {
        sessions: sessionCount,
        selectionEvents: eventCount,
        interactionEvents: interactionCount,
        total: totalRecords,
      },
      storage: actualMB,
      connections: 5, // Estimated (hard to get actual without admin privileges)
      limit: this.LIMITS.database,
      percentage: (actualMB / this.LIMITS.database.storage) * 100,
    };
  } catch (error) {
    console.error('Failed to get database usage:', error);
    // Fallback to current estimation method
  }
}
```

---

## 🎯 **Recommended Implementation Priority**

### High Priority (Do Now):

1. ✅ **Fix Rate Limit Tracking** - Shows wrong data, confusing
2. ✅ **Fix Blob Storage Tracking** - Need to know real usage

### Medium Priority (Nice to Have):

3. ⚠️ **Fix Redis Tracking** - Estimation is reasonable for beta
4. ⚠️ **Fix Database Size** - Current estimate is acceptable

---

## 📊 **Better Metrics to Track**

Instead of focusing on services you can't control well, focus on **actionable metrics**:

### Option A: Keep Current Services

**Rate Limits** → Track actual request counts
**Database** → Track record growth rate (sessions/day)
**Blob Storage** → Track actual usage via Vercel API
**Redis** → Track via Upstash dashboard (manual check)
**Email** → Track inquiry count (good proxy)

### Option B: Simplify to Key Metrics ⭐ **RECOMMENDED**

**Database Records**:
- Total sessions
- Growth rate (sessions/day)
- Storage used (MB)

**Blob Storage**:
- Total size (GB)
- Number of blobs
- Percentage of limit

**API Health**:
- Average response time
- Error rate (last 24h)
- Active sessions now

**Email Quota**:
- Emails sent this month
- Percentage of limit

**Remove**:
- ❌ Rate limiting (too transient, resets every 15 min)
- ❌ Redis commands (hard to track accurately)

---

## 🚀 **Quick Win Implementation**

### Minimal Changes for Maximum Accuracy:

1. **Export rate limit getter** from SecurityMiddleware
2. **Use Vercel Blob API** for storage
3. **Keep database estimation** (good enough)
4. **Keep email tracking** (already accurate)
5. **Remove Redis tracking** (not actionable for you)

---

## 📝 **Implementation Plan**

### Step 1: SecurityMiddleware Enhancement

Add getter for rate limit stats (5 minutes)

### Step 2: Update UsageMonitor

- Use real rate limit data
- Integrate Vercel Blob API
- Remove or simplify Redis tracking

### Step 3: Update Dashboard UI

- Show "Real-time" vs "Estimated" indicators
- Add refresh button for manual updates
- Remove confusing metrics

### Step 4: Testing

- Verify rate limits show actual counts
- Test blob storage calculation
- Check database estimates are reasonable

---

## ✅ **Expected Results**

**Before**:
- Rate Limit: 300/300 (100%) ❌ Wrong!
- Redis: Estimated ⚠️
- Storage: 0.05 GB (static) ❌
- Database: ~accurate ✅

**After**:
- Rate Limit: 15/300 (5%) ✅ Real count!
- Storage: 1.2 GB (live) ✅ Actual!
- Database: Good estimate ✅
- Redis: Removed or dashboard link 👍

---

## 🎉 **Recommendation**

**Implement Option B (Simplified Metrics)** with:
1. Real rate limit tracking
2. Real blob storage tracking
3. Keep database record counts
4. Keep email tracking
5. Remove confusing Redis estimates

This gives you **actionable** metrics that are **accurate** and **easy to understand**.

Would you like me to implement these fixes?

