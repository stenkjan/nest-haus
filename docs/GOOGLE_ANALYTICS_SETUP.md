# Google Analytics 4 Integration Setup Guide

## Overview

This guide will walk you through setting up Google Analytics 4 (GA4) integration with your Nest-Haus admin dashboard. Once configured, you'll have access to accurate geographic data, traffic sources, and comprehensive analytics directly in your admin panel.

## Prerequisites

- Google Analytics 4 property already set up and collecting data
- Access to Google Cloud Console
- Admin access to your GA4 property

## Step 1: Create Google Cloud Project & Enable API

### 1.1 Create or Select Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID for reference

### 1.2 Enable Google Analytics Data API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Analytics Data API"
3. Click **Enable**

## Step 2: Create Service Account

### 2.1 Create the Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Fill in:
   - **Service account name**: `nest-haus-analytics` (or your preferred name)
   - **Service account ID**: Will be auto-generated
   - **Description**: "Service account for Nest-Haus admin dashboard to access GA4 data"
4. Click **Create and Continue**
5. Skip the optional permissions step (click **Continue**)
6. Click **Done**

### 2.2 Create and Download Key

1. Find your newly created service account in the list
2. Click on it to open details
3. Go to the **Keys** tab
4. Click **Add Key** > **Create new key**
5. Select **JSON** format
6. Click **Create**
7. The JSON file will download automatically
8. **Rename it to**: `google-analytics-credentials.json`
9. **Move it to your project root** (same level as package.json)

### 2.3 Note the Service Account Email

The email will look like:
```
nest-haus-analytics@your-project-id.iam.gserviceaccount.com
```

You'll need this in the next step!

## Step 3: Grant GA4 Access to Service Account

### 3.1 Get Your GA4 Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon, bottom left)
3. Select your property
4. Go to **Property Settings**
5. Copy your **Property ID** (format: `123456789`)

### 3.2 Add Service Account to GA4

1. Still in **Admin** > **Property**, go to **Property Access Management**
2. Click the **+** button (top right)
3. Click **Add users**
4. Paste your service account email from Step 2.3
5. Set role to **Viewer** (this is sufficient for read-only access)
6. Uncheck "Notify new users by email" (service accounts don't need emails)
7. Click **Add**

## Step 4: Configure Environment Variables

### 4.1 For Local Development

Add to your `.env.local` file:

```env
# Google Analytics 4 Integration
GA4_PROPERTY_ID="123456789"  # Replace with your actual Property ID
GOOGLE_APPLICATION_CREDENTIALS="./google-analytics-credentials.json"
```

### 4.2 For Production (Vercel)

#### Option A: Upload Credentials File (Simpler but less secure)

1. In Vercel dashboard, go to your project
2. Go to **Settings** > **Environment Variables**
3. Add:
   ```
   Name: GA4_PROPERTY_ID
   Value: 123456789
   ```
4. Upload the credentials file to Vercel (not recommended for security reasons)

#### Option B: Base64 Encode Credentials (Recommended)

1. Convert your JSON file to base64:

   **On Windows (PowerShell)**:
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("google-analytics-credentials.json")) | clip
   ```

   **On Mac/Linux**:
   ```bash
   cat google-analytics-credentials.json | base64 | pbcopy
   ```

2. In Vercel dashboard, add environment variables:
   ```
   Name: GA4_PROPERTY_ID
   Value: 123456789

   Name: GOOGLE_ANALYTICS_CREDENTIALS_BASE64
   Value: [paste the base64 string]
   ```

3. Click **Save**

## Step 5: Verify Setup

### 5.1 Test API Endpoints Locally

Start your development server:
```bash
npm run dev
```

Test the overview endpoint:
```bash
curl http://localhost:3000/api/admin/google-analytics/overview | python -m json.tool
```

Expected response:
```json
{
  "success": true,
  "configured": true,
  "data": {
    "activeUsers": 1234,
    "sessions": 5678,
    "pageViews": 9012,
    ...
  }
}
```

### 5.2 Test Other Endpoints

```bash
# Geographic data
curl http://localhost:3000/api/admin/google-analytics/geo

# Real-time users
curl http://localhost:3000/api/admin/google-analytics/realtime

# Traffic sources
curl http://localhost:3000/api/admin/google-analytics/traffic-sources

# Top pages
curl http://localhost:3000/api/admin/google-analytics/pages
```

### 5.3 Check for Errors

If you get an error response:

```json
{
  "success": false,
  "configured": false,
  "error": "Google Analytics is not configured..."
}
```

**Troubleshooting:**
- Verify `GA4_PROPERTY_ID` is set correctly
- Verify credentials file exists and path is correct
- Check the service account has "Viewer" access in GA4
- Wait 5-10 minutes after adding service account to GA4 (permissions can take time to propagate)

## Step 6: Deploy to Production

### 6.1 Commit Changes (Exclude Credentials!)

```bash
# Verify credentials file is NOT staged
git status

# Should show: google-analytics-credentials.json (in .gitignore)

# Commit API routes and documentation
git add .
git commit -m "Add Google Analytics integration"
git push
```

### 6.2 Deploy to Vercel

Your changes will auto-deploy if you have Vercel connected to your repo.

### 6.3 Verify Production

After deployment:
```bash
curl https://your-domain.com/api/admin/google-analytics/overview
```

## Step 7: Access in Admin Dashboard

1. Navigate to `/admin/user-tracking`
2. You should now see:
   - Accurate geographic data with proper country/city names
   - Real Google Analytics metrics
   - Professional map visualization (coming in next phase)

## API Endpoints Reference

| Endpoint | Description | Query Params |
|----------|-------------|--------------|
| `/api/admin/google-analytics/overview` | Users, sessions, pageviews, bounce rate | `?range=7d\|30d\|90d` |
| `/api/admin/google-analytics/geo` | Countries and cities with session counts | `?range=7d\|30d\|90d` |
| `/api/admin/google-analytics/realtime` | Current active users | None |
| `/api/admin/google-analytics/traffic-sources` | Referrers and mediums | `?range=7d\|30d\|90d` |
| `/api/admin/google-analytics/pages` | Most visited pages | `?range=7d\|30d\|90d` |

## Security Best Practices

✅ **DO:**
- Store credentials file locally only (never commit to Git)
- Use base64 environment variable for Vercel
- Limit service account to "Viewer" role only
- Protect admin routes with authentication

❌ **DON'T:**
- Commit `google-analytics-credentials.json` to Git
- Give service account more permissions than needed
- Expose raw credentials in client-side code
- Share service account keys publicly

## Troubleshooting

### Error: "Property does not exist or you don't have permission"

**Solution**: Verify the service account email has been added to GA4 Property Access Management with at least "Viewer" role.

### Error: "GOOGLE_APPLICATION_CREDENTIALS not found"

**Solution**: Ensure the credentials file is in the project root and the path in `.env.local` is correct.

### Error: "Invalid credentials"

**Solution**: Re-download the JSON key from Google Cloud Console and replace the old file.

### No data returned (empty arrays)

**Solution**: 
- Check that your GA4 property is actively collecting data
- Try a longer date range (e.g., `?range=90d`)
- Verify you're using the correct Property ID

## Next Steps

- [ ] Complete GA dashboard UI component
- [ ] Integrate professional map library for geographic visualization
- [ ] Add caching to reduce API quota usage
- [ ] Set up monitoring for API errors

---

**Setup Complete!** 🎉

You now have Google Analytics integrated with your admin dashboard. The next phase will focus on building beautiful UI components to display this data.

