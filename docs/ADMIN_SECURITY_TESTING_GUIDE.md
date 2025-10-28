# Admin Security Testing Guide

## Testing Admin Authentication

This guide helps you verify that admin routes are properly secured.

## Prerequisites

- Dev server running on `http://localhost:3000`
- `ADMIN_PASSWORD` set to "MAINJAJANest" in `.env.local`
- Fresh browser session (incognito/private mode recommended)

## Test 1: Admin Page Protection

**Goal**: Verify that accessing admin pages without authentication redirects to login

### Steps:

1. **Clear browser cookies**:
   - Open DevTools (F12)
   - Go to: Application → Cookies → `http://localhost:3000`
   - Delete cookie: `nest-haus-admin-auth` (if it exists)

2. **Test unauthenticated access**:

   ```
   Navigate to: http://localhost:3000/admin
   ```

   **Expected Result**:
   - You should be **redirected** to: `/admin/auth?redirect=/admin`
   - You should see the admin login form

   **If you see the admin dashboard instead**: ❌ Security is NOT working

3. **Test authentication**:
   - Enter password: `MAINJAJANest`
   - Click "Continue"

   **Expected Result**:
   - Redirected to: `/admin` (the original destination)
   - Admin dashboard loads successfully
   - Cookie `nest-haus-admin-auth` is set (check DevTools)

4. **Test authenticated access**:

   ```
   Navigate to: http://localhost:3000/admin/pmg/milestones
   ```

   **Expected Result**:
   - Page loads directly (no redirect)
   - You can see and interact with milestones

## Test 2: Admin API Protection

**Goal**: Verify that API endpoints are protected

### Steps:

1. **Test without authentication** (in terminal):

   ```bash
   curl -s "http://localhost:3000/api/admin/pmg" | python -m json.tool
   ```

   **Expected Result**:

   ```json
   {
     "error": "Unauthorized - Admin authentication required"
   }
   ```

2. **Test with authentication**:

   ```bash
   # First, authenticate and save cookie
   curl -X POST -H "Content-Type: application/json" \
        -d '{"password":"MAINJAJANest"}' \
        -c /tmp/admin-cookie.txt \
        -s "http://localhost:3000/api/admin/auth"

   # Then access API with cookie
   curl -b /tmp/admin-cookie.txt \
        -s "http://localhost:3000/api/admin/pmg" | python -m json.tool
   ```

   **Expected Result**:

   ```json
   {
       "tasks": [...]
   }
   ```

## Test 3: No Hardcoded Credentials

**Goal**: Verify that credentials are not exposed in client code

### Steps:

1. **Open browser DevTools** (F12)
2. Navigate to: `http://localhost:3000/admin/pmg/milestones`
3. Go to **Network tab**
4. Click on any request to `/api/admin/pmg`
5. Check the **Request Headers**

**Expected Result**:

- **NO** `Authorization: Basic` header
- Only `Cookie: nest-haus-admin-auth=...` header
- No hardcoded credentials visible in the request

**If you see**: `Authorization: Basic YWRtaW46TUFJTkpBSkFOZXN0` ❌ Credentials are exposed!

## Test 4: Specific Route Testing

Test each admin route individually:

```bash
# Test admin dashboard
curl -s "http://localhost:3000/admin" -i | head -3

# Test PMG milestones
curl -s "http://localhost:3000/admin/pmg/milestones" -i | head -3

# Test alpha tests
curl -s "http://localhost:3000/admin/alpha-tests" -i | head -3

# Test user tracking
curl -s "http://localhost:3000/admin/user-tracking" -i | head -3
```

**Expected Result for ALL**:

- Without cookie: Should return **307 redirect** or load `/admin/auth` page
- With cookie: Should return **200 OK** with page content

## Troubleshooting

### Issue: Admin pages load without authentication

**Possible Causes**:

1. Browser has cached authentication cookie
   - **Fix**: Clear all cookies and test in incognito mode

2. Middleware is not running
   - **Fix**: Restart dev server after middleware changes
   - Run: `rm -rf .next && npm run dev`

3. Environment variable not set
   - **Fix**: Check `.env.local` has `ADMIN_PASSWORD="MAINJAJANest"`

### Issue: Getting 404 errors on admin pages

**Possible Cause**: Build cache issue

- **Fix**: Clear cache and restart:
  ```bash
  rm -rf .next
  npm run dev
  ```

### Issue: Middleware logs not showing

**Check**:

1. Look at terminal where `npm run dev` is running
2. You should see logs like:

   ```
   [MIDDLEWARE] Processing: /admin
   [MIDDLEWARE] ADMIN_PASSWORD exists: true
   [MIDDLEWARE] Admin auth cookie exists: false
   [MIDDLEWARE] Redirecting to admin auth page
   ```

3. If no logs appear: Middleware is not running at all

## Security Checklist

✅ `/admin` routes redirect to `/admin/auth` when not authenticated
✅ `/api/admin/*` routes return 401 when not authenticated  
✅ No `Authorization: Basic` headers in client requests
✅ No hardcoded credentials in client-side code  
✅ Cookie expires after 24 hours  
✅ Only `ADMIN_PASSWORD` environment variable required

## Expected Middleware Behavior

```
Request to: /admin/pmg/milestones
↓
Middleware checks cookie: nest-haus-admin-auth
↓
Cookie missing or invalid?
  YES → Redirect to /admin/auth?redirect=/admin/pmg/milestones
  NO → Allow access (NextResponse.next())
```

## Production Deployment

Before deploying to production:

1. Set `ADMIN_PASSWORD` in Vercel environment variables
2. Use a strong, unique password (NOT "MAINJAJANest")
3. Test authentication flow in production environment
4. Verify all admin routes are protected
5. Monitor for unauthorized access attempts
