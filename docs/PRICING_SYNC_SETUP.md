# Pricing Sync Setup Guide

## Google Service Account Setup

### Step 1: Share Google Sheet with Service Account

1. Open your pricing Google Sheet in browser
2. Click **"Share"** button (top right)
3. Add your service account email:
   ```
   [your-service-account]@[project-id].iam.gserviceaccount.com
   ```
4. Set permission: **"Viewer"** (read-only)
5. Uncheck "Notify people"
6. Click "Done"

### Step 2: Get Spreadsheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9/edit
                                      ^^^^^^^^^^^^^^^^^^^
                                      This is your ID
```

### Step 3: Configure Environment Variables

Add these to `.env.local` (development) and Vercel (production):

```bash
# Google Sheets Pricing Sync
PRICING_SPREADSHEET_ID="1A2B3C4D5E6F7G8H9"

# Production: Use environment variables
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service@project-id.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Development: Can use key file instead
GOOGLE_SERVICE_ACCOUNT_KEY_FILE="service-account-key.json"

# Vercel Cron Authentication
CRON_SECRET="your-random-secret-string"
```

---

## Expected Sheet Structure

Your Google Spreadsheet should have multiple sheets (tabs), each for a configurator category:

### Sheet 1: "Nest_Groesse" (Base prices by size)

| A (Size) | B (Width m) | C (Height m) | D (Price €) |
|----------|-------------|--------------|-------------|
| Klein    | 2.5         | 2.5          | 15000       |
| Mittel   | 3.5         | 3.0          | 22000       |
| Groß     | 5.0         | 3.5          | 35000       |

### Sheet 2: "Gebaeudehuelle" (Material price modifiers)

| A (Size) | B (Material) | C (Modifier €) | D (Notes) |
|----------|--------------|----------------|-----------|
| Klein    | Holz         | 0              |           |
| Klein    | Aluminium    | 2000           |           |
| Mittel   | Holz         | 0              |           |
| Mittel   | Aluminium    | 3500           |           |

### Sheet 3: "Fenster" (Window options)

| A (Option)           | B (Description)      | C (Price €) |
|---------------------|----------------------|-------------|
| Standard Fenster    | Basic windows        | 5000        |
| Premium Fenster     | Triple glazed        | 8500        |

### Sheet 4: "Belichtung" (Lighting packages)

| A (Package)          | B (Description)      | C (Price €) |
|---------------------|----------------------|-------------|
| Basis Belichtung    | Standard lighting    | 3000        |
| Premium Belichtung  | Advanced lighting    | 6000        |

### Additional Sheets:
- **Innenverkleidung** (Interior cladding)
- **Fussboden** (Flooring)
- **PV_Anlage** (Solar panels)
- **Planungspaket** (Planning packages)

> **Note**: Sheet names must match exactly (case-sensitive)

---

## Sheet Mapping Configuration

The sync service is configured in `src/services/pricing-sync.ts`:

```typescript
const SHEET_MAPPINGS: SheetMapping[] = [
  {
    sheetName: 'Nest_Groesse',
    category: 'nest_groesse',
    columns: {
      size: 0,        // Column A
      width: 1,       // Column B
      height: 2,      // Column C
      basePrice: 3,   // Column D
    },
  },
  // ... more mappings
];
```

**To add new sheets or change columns**, edit this configuration.

---

## Testing the Sync

### 1. Manual Sync via API

```bash
# Test sync endpoint
curl -X POST http://localhost:3000/api/sync/pricing \
  -H "Content-Type: application/json" \
  -d '{"adminPassword": "your-admin-password"}'

# Expected response:
{
  "success": true,
  "itemsUpdated": 5,
  "itemsAdded": 15,
  "itemsRemoved": 0,
  "changes": [...],
  "duration": 2345,
  "timestamp": "2025-11-06T..."
}
```

### 2. Check Sync Status

```bash
curl http://localhost:3000/api/sync/pricing

# Response:
{
  "lastSync": "2025-11-06T12:00:00.000Z",
  "nextScheduledSync": "2025-11-07T02:00:00.000Z"
}
```

### 3. Query Pricing Data

```bash
# Direct database query (requires Prisma client)
npx prisma studio

# Or via API (you'll need to create this endpoint)
curl http://localhost:3000/api/pricing/nest_groesse/klein
```

---

## Scheduled Sync (Production)

The sync runs automatically every day at **2:00 AM** via Vercel Cron.

### Configure Vercel Cron Secret

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `CRON_SECRET` = `[generate-random-string]`
3. Deploy to activate cron job

### Monitor Cron Jobs

- **Vercel Dashboard** → Project → Logs → Filter by `/api/cron/sync-pricing`
- **Database** → Check `pricing_sync_logs` table

```sql
SELECT * FROM pricing_sync_logs ORDER BY synced_at DESC LIMIT 10;
```

---

## Sync Logic Flow

```
┌─────────────────────┐
│  Google Sheets      │
│  (Your Pricing)     │
└──────────┬──────────┘
           │
           │ 1. Fetch all sheets
           ▼
┌─────────────────────┐
│  PricingSyncService │
│  Parse & validate   │
└──────────┬──────────┘
           │
           │ 2. Compare with DB
           ▼
┌─────────────────────┐
│  Database           │
│  - Add new items    │
│  - Update changes   │
│  - Mark removed     │
└──────────┬──────────┘
           │
           │ 3. Log results
           ▼
┌─────────────────────┐
│  PricingSyncLog     │
│  Audit trail        │
└─────────────────────┘
```

### Change Detection

The sync compares:
- **basePrice**: Primary price value
- **priceModifier**: Additional +/- amount
- **metadata**: Dimensions, descriptions, etc.

Only changed items are updated (efficient upsert).

---

## Usage in Konfigurator

```typescript
import { PricingSyncService } from '@/services/pricing-sync';

// Get pricing for specific item
const syncService = new PricingSyncService();
const price = await syncService.getPricing('nest_groesse', 'klein');

// Or query database directly
const pricingData = await prisma.pricingData.findUnique({
  where: {
    category_itemKey: {
      category: 'nest_groesse',
      itemKey: 'klein',
    },
  },
});
```

---

## Troubleshooting

### Error: "Spreadsheet not found"
- Check `PRICING_SPREADSHEET_ID` is correct
- Verify service account has "Viewer" permission

### Error: "Failed to fetch sheet X"
- Check sheet name matches exactly (case-sensitive)
- Verify sheet exists in spreadsheet

### Error: "No pricing data found"
- Check sheets have data (not just headers)
- Verify column mappings match your sheet structure

### Error: "Authentication failed"
- Check service account credentials are valid
- Verify `GOOGLE_SERVICE_ACCOUNT_KEY` has proper line breaks (`\n`)

### Sync returns 0 updates
- Data hasn't changed since last sync (normal)
- Check `pricing_sync_logs` for details

---

## Admin Dashboard Integration

Add sync trigger button to admin dashboard:

```typescript
// src/app/admin/components/PricingSyncButton.tsx
'use client';

export function PricingSyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSync() {
    setLoading(true);
    const res = await fetch('/api/sync/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminPassword: prompt('Enter admin password:'),
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div>
      <button onClick={handleSync} disabled={loading}>
        {loading ? 'Syncing...' : 'Sync Pricing Now'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

---

## Next Steps

1. ✅ **Share Google Sheet** with service account
2. ✅ **Configure environment variables**
3. ✅ **Test manual sync** with cURL
4. ✅ **Verify data in database**
5. ⏰ **Deploy to production** (cron activates automatically)
6. 📊 **Monitor sync logs** in database
7. 🎨 **Add admin UI** for manual triggers

---

## Security Notes

- ✅ Service account has **read-only** access
- ✅ API requires **admin password** authentication
- ✅ Cron endpoint requires **Vercel secret**
- ✅ All pricing stored in **EUR cents** (avoid floating point)
- ✅ Audit trail in `pricing_sync_logs`

---

For questions or issues, check:
- Service logs: `/api/sync/pricing` endpoint
- Database logs: `pricing_sync_logs` table
- Vercel logs: Cron job execution history
