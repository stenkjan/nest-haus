# Initial Pricing Sync Setup

After deploying to production, you need to perform an initial pricing sync to populate the database with pricing data from Google Sheets.

## Step 1: Set Environment Variables

Ensure these are set in your Vercel environment variables:

```bash
PRICING_SPREADSHEET_ID=1EEQGTjszJC9tjJyYj7WUfGTp1mR2u4fE
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY=your-private-key-here
ADMIN_PASSWORD=your-secure-admin-password
```

## Step 2: Trigger Initial Sync

### Option A: Using cURL

```bash
curl -X POST "https://your-domain.vercel.app/api/admin/sync-pricing?password=YOUR_ADMIN_PASSWORD"
```

### Option B: Using Browser

Navigate to:
```
https://your-domain.vercel.app/api/admin/sync-pricing?password=YOUR_ADMIN_PASSWORD
```

And send a POST request (you can use browser dev tools or a REST client).

### Option C: Wait for Cron

The cron job runs daily at 2:00 AM UTC. If you can wait, it will sync automatically.

## Step 3: Verify Sync

Check sync status:

```bash
curl "https://your-domain.vercel.app/api/admin/sync-pricing?password=YOUR_ADMIN_PASSWORD"
```

Expected response:
```json
{
  "success": true,
  "hasData": true,
  "version": 1,
  "syncedAt": "2025-01-01T12:00:00.000Z",
  "syncedBy": "manual"
}
```

## Troubleshooting

### Error: "Unauthorized"
- Check that `ADMIN_PASSWORD` environment variable is set
- Ensure you're passing the correct password in the request

### Error: "Pricing sync failed"
- Verify `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_KEY` are correct
- Check that the service account has access to the spreadsheet
- Ensure `PRICING_SPREADSHEET_ID` is correct

### Error: "Pricing data not available"
- The initial sync hasn't completed yet
- Run the manual sync as described above
- Check Vercel logs for sync errors

## Automated Sync

After the initial sync, the system will automatically sync pricing data daily at 2:00 AM UTC via the Vercel cron job configured in `vercel.json`.

No manual intervention is required after the initial setup.
