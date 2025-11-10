# Pricing Sync - Quick Reference

## 🚀 Quick Start

### 1. Share Google Sheet
```
1. Open Google Sheet
2. Share → Add service account email
3. Permission: Viewer (read-only)
```

### 2. Add Environment Variables
```bash
PRICING_SPREADSHEET_ID="[spreadsheet-id-from-url]"
GOOGLE_SERVICE_ACCOUNT_EMAIL="[email]"
GOOGLE_SERVICE_ACCOUNT_KEY="[private-key]"
CRON_SECRET="[random-string]"
```

### 3. Test Sync
```bash
curl -X POST http://localhost:3000/api/sync/pricing \
  -H "Content-Type: application/json" \
  -d '{"adminPassword": "your-password"}'
```

---

## 📊 Sheet Structure

**Required sheets (exact names):**
- `Nest_Groesse` → Base prices by size
- `Gebaeudehuelle` → Material modifiers
- `Fenster` → Window options
- `Belichtung` → Lighting packages
- `Innenverkleidung` → Interior cladding
- `Fussboden` → Flooring
- `PV_Anlage` → Solar panels
- `Planungspaket` → Planning packages

**Each sheet needs:**
- Row 1: Headers (skipped by sync)
- Row 2+: Data
- Prices in EUR (whole numbers)

---

## 🔧 API Endpoints

### Manual Sync (POST)
```
POST /api/sync/pricing
Body: { "adminPassword": "..." }

Response:
{
  "success": true,
  "itemsAdded": 15,
  "itemsUpdated": 5,
  "itemsUnchanged": 120,
  "duration": 2345
}
```

### Get Status (GET)
```
GET /api/sync/pricing

Response:
{
  "lastSync": "2025-11-06T12:00:00.000Z",
  "nextScheduledSync": "2025-11-07T02:00:00.000Z"
}
```

### Scheduled Sync (Cron)
```
GET /api/cron/sync-pricing
Headers: Authorization: Bearer [CRON_SECRET]

Runs automatically daily at 2:00 AM
```

---

## 💾 Database Tables

### `pricing_data`
```sql
SELECT category, item_key, base_price, version
FROM pricing_data
WHERE category = 'nest_groesse';
```

### `pricing_sync_logs`
```sql
SELECT synced_at, items_updated, status
FROM pricing_sync_logs
ORDER BY synced_at DESC
LIMIT 10;
```

---

## 🛠️ Usage in Code

```typescript
import { PricingSyncService } from '@/services/pricing-sync';

// Get pricing
const service = new PricingSyncService();
const price = await service.getPricing('nest_groesse', 'klein');

// Or query directly
const data = await prisma.pricingData.findUnique({
  where: {
    category_itemKey: {
      category: 'nest_groesse',
      itemKey: 'klein',
    },
  },
});
```

---

## 🎨 Admin Dashboard

Add to your admin page:

```typescript
import { PricingSyncPanel } from '@/components/admin/PricingSyncPanel';

export default function AdminPage() {
  return (
    <div>
      <PricingSyncPanel />
    </div>
  );
}
```

---

## ⚠️ Troubleshooting

| Error | Solution |
|-------|----------|
| "Spreadsheet not found" | Check `PRICING_SPREADSHEET_ID` |
| "Failed to fetch sheet X" | Verify sheet name (case-sensitive) |
| "Authentication failed" | Check service account credentials |
| "Invalid admin password" | Verify `ADMIN_PASSWORD` in env |
| Cron not running | Set `CRON_SECRET` in Vercel |

---

## 📈 Monitoring

**Check sync logs:**
```sql
SELECT * FROM pricing_sync_logs ORDER BY synced_at DESC;
```

**Verify pricing data:**
```bash
npx prisma studio
# Browse to pricing_data table
```

**Vercel logs:**
```
Dashboard → Project → Logs → Filter: "/api/cron/sync-pricing"
```

---

## 🔒 Security

✅ Service account: **read-only** access  
✅ Manual sync: requires **admin password**  
✅ Cron sync: requires **Vercel secret**  
✅ Prices in **cents** (no float errors)  
✅ Full **audit trail** in logs

---

## 📚 Full Documentation

- **Setup Guide**: `/docs/PRICING_SYNC_SETUP.md`
- **Environment Variables**: `/docs/PRICING_SYNC_ENV_VARS.md`
- **Service Implementation**: `/src/services/pricing-sync.ts`
- **API Routes**: `/src/app/api/sync/pricing/route.ts`
