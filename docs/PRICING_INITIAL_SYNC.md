# Initial Pricing Sync Setup

After deploying to production, you need to perform an initial pricing sync to populate the database with pricing data from Google Sheets.

## Step 1: Trigger Initial Sync

Run this command to manually sync pricing data:

```bash
curl -X POST "https://nest-haus.vercel.app/api/admin/sync-pricing?password=YOUR_ADMIN_PASSWORD"
```

Replace `YOUR_ADMIN_PASSWORD` with your `ADMIN_PASSWORD` environment variable value.

## Step 2: Verify Sync

Check that the sync was successful:

```bash
curl "https://nest-haus.vercel.app/api/admin/sync-pricing?password=YOUR_ADMIN_PASSWORD"
```

Expected response:
```json
{
  "success": true,
  "hasData": true,
  "version": 1,
  "syncedAt": "2025-01-01T12:00:00.000Z"
}
```

## Troubleshooting

- **"Unauthorized"**: Check `ADMIN_PASSWORD` environment variable
- **"Pricing sync failed"**: Verify Google Sheets credentials
- **"Pricing data not available"**: Run the manual sync above

## Automated Sync

After initial setup, pricing data syncs automatically daily at 2:00 AM UTC.
