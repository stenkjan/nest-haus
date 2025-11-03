# Admin Password - Quick Fix Guide

## Problem
❌ Admin login doesn't work on **nest-haus.com** or **nest-haus.at**

## Solution (5 minutes)

### 1. Go to Vercel Dashboard
🔗 https://vercel.com/dashboard → Select **nest-haus** project

### 2. Update Environment Variables
**Settings** → **Environment Variables**

Find or add:
- **Name**: `ADMIN_PASSWORD`
- **Value**: `2508DNH-d-w-i-d-z`
- **Environments**: ✅ Production, Preview, Development

Find or add:
- **Name**: `SITE_PASSWORD`  
- **Value**: `2508DNH-d-w-i-d-z`
- **Environments**: ✅ Production, Preview, Development

### 3. Redeploy
**Deployments** → Latest deployment → **⋯** → **Redeploy**

Wait 1-3 minutes for deployment to complete

### 4. Test
1. Clear browser cookies for nest-haus.com
2. Visit: https://nest-haus.com/admin
3. Enter: `2508DNH-d-w-i-d-z`
4. ✅ Should work!

---

## Why This Happened

`.env.local` is **only for local development** and is **never deployed**.

Production uses Vercel Dashboard environment variables.

---

## Full Documentation

See `docs/ADMIN_PASSWORD_PRODUCTION_FIX.md` for complete details.
