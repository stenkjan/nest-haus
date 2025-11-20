# Analytics IP Filtering System

## Overview

This system filters out specified IP addresses from analytics data, allowing you to exclude developer/testing sessions from appearing in the admin dashboard.

## How It Works

The filtering system uses environment variables to specify which IP addresses should be excluded from all analytics queries. When configured, sessions from these IPs will not appear in:

- Admin Dashboard metrics
- User Tracking data
- Sessions Timeline charts
- Geographic Location maps
- Traffic Sources analysis
- Conversion metrics
- BI metrics
- All user lists

## Setup Instructions

### Step 1: Find Your IP Address

You can find your current IP address by:

1. **Using a website**: Visit `https://whatismyipaddress.com/` or `https://www.whatsmyip.org/`
2. **Using terminal/command line**:
   - Windows: `curl ifconfig.me`
   - Mac/Linux: `curl ifconfig.me`

### Step 2: Configure Environment Variables

Edit your `.env.local` file and add one or both of these variables:

```bash
# Single development IP
DEV_IP="123.456.789.0"

# Or multiple excluded IPs (comma-separated)
EXCLUDED_IPS="123.456.789.0,98.765.432.1,192.168.1.100"
```

**Note**: You can use both variables together. All IPs from both variables will be excluded.

### Step 3: Restart Development Server

After updating `.env.local`, restart your development server:

```bash
# Kill the current server (Ctrl+C)
# Then restart
npm run dev
```

## Example Configurations

### Single Developer IP

```bash
DEV_IP="203.0.113.42"
```

### Multiple Team Member IPs

```bash
EXCLUDED_IPS="203.0.113.42,198.51.100.25,192.0.2.100"
```

### Development + Office IPs

```bash
DEV_IP="203.0.113.42"
EXCLUDED_IPS="198.51.100.25,192.0.2.100"
# All three IPs will be excluded
```

## Testing the Filter

### 1. Check Current IP

Visit the site and check the admin dashboard `/admin/user-tracking`. Note your session.

### 2. Add Your IP to Exclusion List

Add your IP to `.env.local` and restart the server.

### 3. Verify Filtering

1. Clear browser cache/cookies (to get a new session)
2. Visit the site again
3. Check the admin dashboard - your new session should NOT appear
4. Previous sessions with your IP will still show (they were already recorded)

### 4. Check Console Logs

When the server starts, look for logs like:

```
🔍 Analytics Filter: Excluding 2 IP(s): ['203.0.113.42', '198.51.100.25']
```

Or if no IPs are configured:

```
🔍 Analytics Filter: No IPs excluded (set EXCLUDED_IPS or DEV_IP in .env.local)
```

## Important Notes

### Existing Data

- The filter only applies to **queries**, not database records
- Sessions from excluded IPs that were recorded **before** you configured the filter will still exist in the database
- They just won't appear in the admin dashboard
- To remove old sessions, use the analytics reset script (ask for help if needed)

### Dynamic IPs

If your IP address changes (common with home internet):

1. Find your new IP address
2. Update `.env.local`
3. Restart the server

Consider using a VPN with a static IP for consistent filtering.

### Production Deployment

**Critical**: Update your production environment variables on Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `DEV_IP` or `EXCLUDED_IPS` with your production IPs
3. Redeploy the application

## Advanced Usage

### Programmatic Access

You can use the filtering utilities in your custom code:

```typescript
import { getExcludedIPs, shouldExcludeIP, getIPFilterClause } from '@/lib/analytics-filter';

// Get list of excluded IPs
const excludedIPs = getExcludedIPs();

// Check if a specific IP should be excluded
if (shouldExcludeIP('203.0.113.42')) {
  // Skip tracking
}

// Use in Prisma queries
const sessions = await prisma.userSession.findMany({
  where: {
    // Your other conditions
    ...getIPFilterClause() // Automatically filters excluded IPs
  }
});
```

### Debugging

To see which IPs are being filtered, call:

```typescript
import { logFilterStatus } from '@/lib/analytics-filter';

logFilterStatus(); // Logs to console
```

## Troubleshooting

### Filter Not Working

1. **Check environment variable spelling**: `DEV_IP` and `EXCLUDED_IPS` are case-sensitive
2. **Restart the server**: Changes to `.env.local` require a restart
3. **Check IP format**: IPs should be plain strings without spaces: `"1.2.3.4,5.6.7.8"`
4. **Verify your actual IP**: Use `curl ifconfig.me` to get your current public IP
5. **Check browser cache**: Clear cookies/storage to get a new session

### Still Seeing Your Sessions

1. **Old sessions**: Sessions recorded before filter was added will still appear
2. **Different IP**: Your IP may have changed (check current IP)
3. **Local vs Public IP**: Make sure you're using your **public IP**, not local (192.168.x.x)

### Production Issues

1. **Environment variables not set**: Check Vercel dashboard settings
2. **Deployment required**: After adding environment variables, redeploy the app
3. **Build cache**: Try clearing build cache in Vercel if changes don't apply

## Security Notes

- IP addresses in environment variables are **not exposed** to the client
- The filtering happens server-side in API routes
- No IP addresses are displayed in the frontend
- `.env.local` is excluded from git (never commit it)

## File Reference

The filtering system consists of these files:

- `src/lib/analytics-filter.ts` - Core filtering logic
- `.env.local` - Your local environment variables (not committed to git)
- `.env.local.example` - Template showing available variables
- All admin API routes (`src/app/api/admin/**/route.ts`) - Implement the filtering

---

**Last Updated**: November 2024

