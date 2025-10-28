# Environment Variable Setup for Production

## Issue

The user tracking page fails to load in production because the API fetch needs the full URL.

## Solution

Add environment variable in Vercel dashboard:

### Vercel Dashboard Steps

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

**Variable Name**: `NEXT_PUBLIC_SITE_URL`  
**Value**: `https://nest-haus.com` (or your actual production domain)  
**Environments**: Check all three:

- ✅ Production
- ✅ Preview
- ✅ Development

4. Click **Save**
5. **Redeploy** your application for the changes to take effect

### Alternative: Use VERCEL_URL (Already Available)

Vercel automatically provides `VERCEL_URL` environment variable, which the code now uses as a fallback. However, it doesn't include the protocol, so the code adds `https://` prefix.

The updated code checks in this order:

1. `NEXT_PUBLIC_SITE_URL` (recommended - your custom domain)
2. `VERCEL_URL` (automatic - Vercel's deployment URL)
3. `http://localhost:3000` (development fallback)

## For Local Development

If you want to test this locally, create a `.env.local` file:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Verification

After setting the environment variable and redeploying:

1. Visit `/admin/user-tracking` in production
2. Check browser console (F12) for logs:
   - Should see: `📡 Fetching from: https://nest-haus.com/api/admin/user-tracking`
   - Should see: `✅ User tracking data fetched successfully`
3. Page should load without "Failed to load tracking data" error

## Quick Test in Production

To verify the API works directly, visit:
`https://nest-haus.com/api/admin/user-tracking`

You should see JSON response with funnel metrics and configuration data.
