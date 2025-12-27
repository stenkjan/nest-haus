# Vercel Blob Storage - FUNCTION_INVOCATION_FAILED Troubleshooting Guide

## 🔴 The Error: FUNCTION_INVOCATION_FAILED

This error occurs when a Vercel serverless function fails during execution. For blob storage operations, this typically indicates one of several issues with how the function is configured or how it's accessing external resources.

---

## ✅ **1. THE FIX - What Was Changed**

### **Primary Issue: Missing Runtime Configuration**

Vercel serverless functions require explicit runtime configuration to work correctly with Node.js APIs like `@vercel/blob`. Without these exports, Vercel may:
- Use the wrong runtime (Edge Runtime instead of Node.js)
- Apply incorrect timeout limits
- Fail to load required Node.js modules

### **Changes Made:**

#### **Added to all blob API routes:**
```typescript
// Vercel serverless function configuration
export const runtime = 'nodejs';     // Use Node.js runtime (not Edge)
export const maxDuration = 30;       // 30 seconds max execution time
```

#### **Added environment variable validation:**
```typescript
if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN is not configured');
    return NextResponse.json({
        error: 'Blob storage not configured',
        details: 'BLOB_READ_WRITE_TOKEN environment variable is missing'
    }, { status: 503 });
}
```

#### **Files Modified:**
- ✅ `src/app/api/images/route.ts` 
- ✅ `src/app/api/files/route.ts`
- ✅ `src/app/api/images/batch/route.ts`

---

## 🧠 **2. ROOT CAUSE - Why This Happened**

### **What the Code Was Doing vs. What It Needed:**

**Before:**
- Functions were using `@vercel/blob` APIs without declaring the runtime
- Vercel defaulted to Edge Runtime for API routes
- Edge Runtime doesn't support all Node.js modules needed by `@vercel/blob`
- No validation for required environment variables
- Functions could timeout without proper duration limits

**What It Needed:**
- Explicit `runtime = 'nodejs'` declaration for Node.js APIs
- Proper `maxDuration` to prevent premature timeouts
- Environment variable validation to fail gracefully
- Clear error messages for debugging

### **Conditions That Trigger This Error:**

1. **Missing Runtime Declaration**
   - Vercel defaults to Edge Runtime for `/app/api` routes
   - Edge Runtime has limited Node.js support
   - `@vercel/blob` requires full Node.js runtime

2. **Environment Variable Not Set**
   - `BLOB_READ_WRITE_TOKEN` missing in Vercel dashboard
   - Token not synced from local `.env` to production
   - Token expired or invalid

3. **Function Timeout**
   - Default timeout (10s) too short for blob operations
   - Multiple extension checks causing cumulative delays
   - Network latency to blob storage

4. **Build/Deployment Issues**
   - Vercel function size limits exceeded
   - Cold start taking too long
   - Region mismatch between function and blob storage

### **The Misconception:**

Many developers assume Next.js API routes "just work" with external services. However, **Vercel's serverless environment requires explicit configuration** for:
- Runtime selection (Edge vs. Node.js)
- Execution duration limits
- Environment variable management
- Error handling strategies

---

## 📚 **3. CONCEPT EXPLANATION - Why This Error Exists**

### **Purpose of the Error:**

`FUNCTION_INVOCATION_FAILED` is Vercel's catch-all error for serverless function failures. It protects you from:
- **Infinite loops** consuming resources
- **Memory leaks** in long-running functions
- **Unhandled exceptions** breaking your app
- **Configuration mistakes** going unnoticed

### **The Correct Mental Model:**

Think of Vercel serverless functions as **isolated, ephemeral containers**:

```
┌─────────────────────────────────────┐
│  Request Arrives                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Cold Start (if needed)             │
│  - Load function code               │
│  - Initialize runtime environment   │
│  - Read environment variables       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Execute Function                   │
│  - Parse request                    │
│  - Access external services         │
│  - Process data                     │
│  - Return response                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Container Destroyed (eventually)   │
└─────────────────────────────────────┘
```

**Key Principles:**

1. **Stateless Execution**: Each invocation is independent
2. **Limited Lifetime**: Functions have max execution time
3. **Environment Isolation**: Explicit configuration required
4. **Resource Constraints**: CPU, memory, and time limits

### **How This Fits Into Next.js/Vercel Design:**

**Next.js 13+ App Router** introduced two runtime options:
- **Edge Runtime**: Ultra-fast, global, limited Node.js APIs
- **Node.js Runtime**: Full Node.js support, region-specific

**When to Use Each:**

| Feature | Edge Runtime | Node.js Runtime |
|---------|--------------|-----------------|
| Speed | ⚡ Fastest (< 50ms) | 🚀 Fast (50-200ms) |
| Node.js APIs | ❌ Limited | ✅ Full Support |
| File System | ❌ No | ✅ Yes |
| External SDKs | ⚠️ Some | ✅ Most |
| `@vercel/blob` | ❌ No | ✅ Yes |
| Crypto/Buffer | ❌ Limited | ✅ Full |

**Your blob routes MUST use Node.js Runtime** because:
- They need Node.js Buffer APIs
- They access the file system conceptually
- They use `@vercel/blob` SDK (requires Node.js)

---

## 🚨 **4. WARNING SIGNS - Recognize This Pattern**

### **Code Smells That Indicate This Issue:**

#### **🔴 Missing Runtime Export:**
```typescript
// ❌ BAD - No runtime specified
import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) { ... }
```

```typescript
// ✅ GOOD - Runtime explicitly declared
export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET(request: NextRequest) { ... }
```

#### **🔴 No Environment Variable Validation:**
```typescript
// ❌ BAD - Assumes token exists
const { blobs } = await list({ prefix: path });
```

```typescript
// ✅ GOOD - Validates first
if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
}
const { blobs } = await list({ prefix: path });
```

#### **🔴 No Timeout Protection:**
```typescript
// ❌ BAD - Can hang indefinitely
const { blobs } = await list({ prefix: path });
```

```typescript
// ✅ GOOD - Has timeout
const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), 15000);
});
const { blobs } = await Promise.race([
    list({ prefix: path }),
    timeoutPromise
]);
```

### **Similar Mistakes in Related Scenarios:**

1. **Database Connections**
   - Missing connection string validation
   - No connection pooling limits
   - Not closing connections

2. **Third-Party APIs**
   - No API key validation
   - Missing retry logic
   - No circuit breaker pattern

3. **File Operations**
   - Not handling file not found errors
   - No file size limits
   - Missing MIME type validation

### **Red Flags in Vercel Logs:**

Look for these patterns in your Vercel function logs:
- `Error: Cannot find module 'fs'` → Using Edge Runtime incorrectly
- `Task timed out after 10.00 seconds` → Need `maxDuration` increase
- `undefined is not an object` → Missing environment variable
- `ECONNREFUSED` → Network/service unavailable
- `Memory limit exceeded` → Function doing too much work

---

## 🔄 **5. ALTERNATIVES - Different Approaches & Trade-offs**

### **Approach 1: Node.js Runtime (Current Solution)** ✅

**Configuration:**
```typescript
export const runtime = 'nodejs';
export const maxDuration = 30;
```

**Pros:**
- ✅ Full Node.js API support
- ✅ Works with all SDKs (`@vercel/blob`, `@prisma/client`, etc.)
- ✅ Can use file system, crypto, buffers
- ✅ Better for complex operations

**Cons:**
- ❌ Slower cold starts (~200-500ms)
- ❌ Region-specific (not globally distributed)
- ❌ Higher memory usage
- ❌ More expensive compute time

**Best For:**
- Blob storage operations
- Database queries (Prisma)
- File processing
- Complex business logic

---

### **Approach 2: Edge Runtime with Fetch API** ⚡

**Configuration:**
```typescript
export const runtime = 'edge';
```

**Implementation:**
```typescript
export async function GET(request: Request) {
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    
    // Use direct fetch to blob URL instead of SDK
    const blobUrl = `https://1mkowktdsbm6ra0z.public.blob.vercel-storage.com/images/${path}`;
    
    try {
        const response = await fetch(blobUrl);
        if (response.ok) {
            return Response.redirect(blobUrl, 302);
        }
    } catch (error) {
        // Fallback
    }
    
    return new Response('Not found', { status: 404 });
}
```

**Pros:**
- ✅ Ultra-fast execution (< 50ms)
- ✅ Globally distributed
- ✅ Lower costs
- ✅ Better for simple redirects

**Cons:**
- ❌ Can't use `@vercel/blob` SDK
- ❌ Must know blob URLs in advance
- ❌ Limited error handling
- ❌ No `list()` operation available

**Best For:**
- Simple redirects
- URL rewrites
- Lightweight middleware
- Geolocation routing

---

### **Approach 3: Hybrid - Precompute + Edge** 🎯

**Strategy:**
1. **Build Time**: Generate static mapping of all blob URLs
2. **Runtime**: Use Edge function to look up from static map

**Build-time script:**
```typescript
// scripts/generate-blob-map.ts
import { list } from '@vercel/blob';
import fs from 'fs';

async function generateBlobMap() {
    const { blobs } = await list();
    const map: Record<string, string> = {};
    
    blobs.forEach(blob => {
        const path = blob.pathname.replace('images/', '');
        map[path] = blob.url;
    });
    
    fs.writeFileSync('public/blob-map.json', JSON.stringify(map));
}

generateBlobMap();
```

**Edge Runtime:**
```typescript
import blobMap from '@/public/blob-map.json';

export const runtime = 'edge';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    
    const blobUrl = blobMap[path];
    if (blobUrl) {
        return Response.redirect(blobUrl, 302);
    }
    
    return new Response('Not found', { status: 404 });
}
```

**Pros:**
- ✅ Best of both worlds
- ✅ Fast Edge runtime
- ✅ Accurate blob URLs
- ✅ No SDK needed at runtime

**Cons:**
- ❌ Requires rebuild when blobs change
- ❌ More complex deployment
- ❌ Static map can get large
- ❌ Cache invalidation challenges

**Best For:**
- Infrequently changing blob storage
- High-traffic applications
- Cost optimization
- Predictable content

---

### **Approach 4: Direct Blob URLs (No API Route)** 🎪

**Skip the API route entirely:**
```typescript
// In your component
<Image 
    src="https://1mkowktdsbm6ra0z.public.blob.vercel-storage.com/images/hero.jpg"
    alt="Hero"
    width={1200}
    height={800}
/>
```

**Pros:**
- ✅ Fastest possible (no serverless function)
- ✅ CDN cached automatically
- ✅ No function invocation costs
- ✅ Simplest implementation

**Cons:**
- ❌ Exposes blob URLs in client code
- ❌ No fallback/placeholder logic
- ❌ Can't handle dynamic extensions
- ❌ Security implications (direct access)

**Best For:**
- Public assets
- Static content
- Low-security images
- Maximum performance

---

## 📊 **Comparison Matrix**

| Approach | Speed | Cost | Flexibility | Security | Complexity |
|----------|-------|------|-------------|----------|------------|
| **Node.js Runtime** | 🟡 Good | 🟡 Medium | 🟢 High | 🟢 High | 🟡 Medium |
| **Edge Runtime** | 🟢 Excellent | 🟢 Low | 🟡 Medium | 🟢 High | 🟢 Low |
| **Hybrid** | 🟢 Excellent | 🟢 Low | 🟡 Medium | 🟢 High | 🔴 High |
| **Direct URLs** | 🟢 Excellent | 🟢 Minimal | 🔴 Low | 🟡 Medium | 🟢 Low |

---

## 🛠️ **Verification Checklist**

After applying the fix, verify everything works:

### **Local Development:**
```bash
# 1. Check environment variables
cat .env.local | grep BLOB_READ_WRITE_TOKEN

# 2. Test API route
curl "http://localhost:3000/api/images?path=hero"

# 3. Check logs for errors
# Look in terminal for any ❌ error messages
```

### **Vercel Dashboard:**
```
1. Go to: Project → Settings → Environment Variables
2. Verify: BLOB_READ_WRITE_TOKEN is set for Production
3. Check: Value matches your local .env.local
4. Ensure: Variable is enabled for all environments
```

### **Production Deployment:**
```
1. Deploy to Vercel
2. Go to: Deployments → [Latest] → Functions
3. Click on: /api/images
4. Verify: 
   - Runtime shows "nodejs"
   - Duration shows "30s max"
   - No cold start errors
5. Test: https://your-domain.vercel.app/api/images?path=hero
```

---

## 🐛 **Debugging Tips**

### **If still failing after fix:**

1. **Check Vercel Logs:**
   ```
   Vercel Dashboard → [Project] → Logs → Functions
   ```
   Look for the actual error message (not just FUNCTION_INVOCATION_FAILED)

2. **Test Token Validity:**
   ```bash
   curl -H "Authorization: Bearer $BLOB_READ_WRITE_TOKEN" \
        https://blob.vercel-storage.com/
   ```

3. **Verify Runtime in Build Log:**
   ```
   Look for: "Creating Serverless Function for /api/images"
   Should show: runtime: nodejs, maxDuration: 30s
   ```

4. **Check Function Size:**
   ```
   Vercel limits: 50MB uncompressed
   Check: Deployment → Functions → [route] → Size
   ```

5. **Test Locally First:**
   ```bash
   # Verify it works locally
   npm run build
   npm run start
   curl "http://localhost:3000/api/images?path=test"
   ```

---

## 📖 **Additional Resources**

- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel Edge vs Node.js Runtime](https://vercel.com/docs/functions/edge-functions/edge-runtime)
- [Vercel Blob Storage Docs](https://vercel.com/docs/storage/vercel-blob)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Function Configuration](https://vercel.com/docs/functions/serverless-functions/runtimes)

---

## ✅ **Summary**

**The Fix:**
- Added `export const runtime = 'nodejs'` to all blob API routes
- Added `export const maxDuration = 30` for timeout protection
- Added environment variable validation for graceful failures

**The Lesson:**
- Vercel serverless functions need explicit runtime configuration
- Node.js runtime required for `@vercel/blob` SDK
- Always validate environment variables before using them
- Implement timeouts for all external service calls

**The Prevention:**
- Always declare `runtime` and `maxDuration` for API routes
- Add env var validation at the start of each function
- Use timeouts for all async operations
- Test locally AND in Vercel before deploying




















