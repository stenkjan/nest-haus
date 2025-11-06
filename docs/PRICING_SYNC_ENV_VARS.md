# Pricing Sync - Environment Variables

## Required Variables

```bash
# ===== GOOGLE SHEETS PRICING SYNC =====

# Your pricing spreadsheet ID (from URL)
PRICING_SPREADSHEET_ID="1A2B3C4D5E6F7G8H9"

# Google Service Account credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service@project-id.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Vercel Cron secret (for scheduled sync authentication)
CRON_SECRET="generate-a-random-string-here"

# ===== EXISTING VARIABLES (ALREADY SET) =====
# These should already exist in your .env.local:
# - ADMIN_PASSWORD (for manual sync authentication)
# - DATABASE_URL (Prisma connection)
# - RESEND_API_KEY (optional, for sync notifications)
# - ADMIN_EMAIL (optional, for notifications)
```

## Setup Instructions

### Development (.env.local)

1. Copy the variables above
2. Replace placeholder values
3. Add to `/workspace/.env.local`

### Production (Vercel)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable individually
3. Redeploy to activate

---

## Getting Service Account Credentials

### Option 1: Use Existing Key File (Development)

If you already have `service-account-key.json`:

```bash
# .env.local
GOOGLE_SERVICE_ACCOUNT_KEY_FILE="service-account-key.json"
```

### Option 2: Use Environment Variables (Production)

Extract from `service-account-key.json`:

```json
{
  "client_email": "your-service@project-id.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

Add to environment:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL="[client_email value]"
GOOGLE_SERVICE_ACCOUNT_KEY="[private_key value]"
```

**Important**: Keep the `\n` characters in the private key!

---

## Generating CRON_SECRET

```bash
# Generate random secret (bash)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or simple string
echo "my-super-secret-cron-key-$(date +%s)"
```

Use the output as your `CRON_SECRET` value.

---

## Verification

Test your configuration:

```bash
# 1. Check environment variables are loaded
curl http://localhost:3000/api/sync/pricing

# 2. Test sync (requires ADMIN_PASSWORD)
curl -X POST http://localhost:3000/api/sync/pricing \
  -H "Content-Type: application/json" \
  -d '{"adminPassword": "your-admin-password"}'
```

If successful, you'll see sync results with item counts.

---

## Troubleshooting

### "PRICING_SPREADSHEET_ID environment variable not set"
→ Add `PRICING_SPREADSHEET_ID` to `.env.local` or Vercel

### "Google Service Account credentials not configured"
→ Add both `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_KEY`

### "Failed to parse private key"
→ Ensure `GOOGLE_SERVICE_ACCOUNT_KEY` includes `\n` characters (not actual newlines)

### Cron job not running
→ Ensure `CRON_SECRET` is set in Vercel environment variables
