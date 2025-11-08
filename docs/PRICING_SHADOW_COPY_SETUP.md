# Pricing Shadow Copy Setup

## Overview

The pricing system now uses a **shadow copy** stored in the database instead of live Google Sheets access. This ensures:

- ✅ No dependency on live Google Sheets API calls
- ✅ Better performance (database queries are faster)
- ✅ Reliability (works even if Google Sheets is temporarily unavailable)
- ✅ Version tracking (can see when prices were last synced)

## Architecture

```
┌─────────────────────┐
│  Google Sheets      │
│  (Source of Truth)  │
└──────────┬──────────┘
           │
           │ Daily Sync @ 2:00 AM
           ▼
┌─────────────────────┐
│  Database           │
│  (Shadow Copy)      │
│  PricingDataSnapshot│
└──────────┬──────────┘
           │
           │ Read on demand
           ▼
┌─────────────────────┐
│  Application        │
│  PriceCalculator    │
└─────────────────────┘
```

## Initial Setup

### 1. Run Database Migration

The `PricingDataSnapshot` model has been added to the schema. Ensure it's synced:

```bash
npx prisma db push
# or
npx prisma migrate deploy
```

### 2. Run Initial Sync

Before the app can use pricing data, you need to populate the database with an initial sync:

**Option A: Manual API Call**
```bash
curl -X POST http://localhost:3000/api/admin/sync-pricing \
  -H "x-admin-password: YOUR_ADMIN_PASSWORD"
```

**Option B: Admin Dashboard**
Navigate to admin panel and use the pricing sync button (if available).

**Option C: Direct Service Call** (for development)
```typescript
import { getPricingSheetService } from '@/services/pricing-sheet-service';
import { savePricingSnapshot } from '@/services/pricing-db-service';

const service = getPricingSheetService();
const data = await service.loadPricingData(true);
await savePricingSnapshot(data, 'manual');
```

### 3. Verify Sync

Check if pricing data is available:

```bash
curl http://localhost:3000/api/admin/sync-pricing?password=YOUR_ADMIN_PASSWORD
```

Should return:
```json
{
  "success": true,
  "hasData": true,
  "version": 1,
  "syncedAt": "2025-01-01T02:00:00.000Z",
  "syncedBy": "manual"
}
```

## Daily Sync (Automatic)

The system automatically syncs pricing data daily at **2:00 AM** via Vercel Cron:

- **Endpoint**: `/api/cron/sync-pricing-sheet`
- **Schedule**: `0 2 * * *` (2:00 AM UTC)
- **Authentication**: Uses `CRON_SECRET` environment variable

### Setting Up CRON_SECRET

Add to your `.env` files:

```bash
CRON_SECRET=your-secret-key-here
```

Vercel will automatically call this endpoint with the secret in the Authorization header.

## Manual Sync

Admins can trigger manual syncs:

**POST** `/api/admin/sync-pricing`
- **Headers**: `x-admin-password: YOUR_ADMIN_PASSWORD`
- **Response**: Sync status and duration

**GET** `/api/admin/sync-pricing?password=YOUR_ADMIN_PASSWORD`
- Returns current sync status and version info

## How It Works

1. **Daily Sync (2 AM)**:
   - Fetches fresh data from Google Sheets
   - Saves to database as new snapshot
   - Deactivates old snapshots
   - Only one active snapshot at a time

2. **Application Usage**:
   - `PriceCalculator` fetches from `/api/pricing/data`
   - API reads from database (shadow copy)
   - No direct Google Sheets access from application
   - 5-minute server-side cache for performance

3. **Error Handling**:
   - If database is empty, API returns 404
   - Application shows error message
   - Admin must run initial sync

## Database Schema

```prisma
model PricingDataSnapshot {
  id            String   @id @default(cuid())
  version       Int      @default(1)
  pricingData   Json     // Complete PricingData structure
  syncedAt      DateTime @default(now())
  syncedBy      String   @default("cron") // "cron" | "manual" | "api"
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
}
```

## Troubleshooting

### "No pricing data available in database"

**Solution**: Run initial sync:
```bash
curl -X POST http://localhost:3000/api/admin/sync-pricing \
  -H "x-admin-password: YOUR_ADMIN_PASSWORD"
```

### "Pricing sync failed"

**Check**:
1. Google Sheets credentials are configured
2. `PRICING_SPREADSHEET_ID` is correct
3. Service account has access to the spreadsheet
4. Sheet "Preistabelle Verkauf" exists

### Daily sync not running

**Check**:
1. `vercel.json` has correct cron configuration
2. `CRON_SECRET` is set in Vercel environment variables
3. Vercel Cron is enabled for your project

## Benefits

- **Performance**: Database queries are faster than Google Sheets API
- **Reliability**: Works even if Google Sheets is down
- **Versioning**: Track when prices were last updated
- **Audit Trail**: See sync history and changes
- **No Rate Limits**: No Google Sheets API quota concerns

