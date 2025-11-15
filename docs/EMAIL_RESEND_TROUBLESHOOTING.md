# Email Configuration Troubleshooting Guide - Resend + Vercel

## 🚨 Problem: Emails Not Sending

### Root Cause
When using Resend, the **FROM email address domain MUST match the domain you verified in Resend**.

### Common Mistakes

#### ❌ **Mistake 1: Subdomain Mismatch**
```bash
# If you added "nest-haus.com" in Resend Dashboard
RESEND_FROM_EMAIL=mail@send.nest-haus.com  # ❌ WRONG - subdomain doesn't match
```

#### ❌ **Mistake 2: Using send.yourdomain.com Without Proper DNS**
If you want to use `mail@send.nest-haus.com`, you MUST:
1. Add `send.nest-haus.com` (the full subdomain) to Resend
2. Add DNS records with the subdomain prefix `send` in Vercel

#### ✅ **Solution: Use Root Domain**
```bash
# If you added "nest-haus.com" in Resend Dashboard
RESEND_FROM_EMAIL=mail@nest-haus.com  # ✅ CORRECT
```

---

## 📋 Current Correct Configuration

### In Resend Dashboard
- **Domain Added**: `nest-haus.com` (root domain)
- **Status**: Verified ✅

### In `.env.local` and `.env`
```bash
# Resend Configuration (SENDING via nest-haus.com root domain)
RESEND_API_KEY=re_WTuw2cJE_9P9KLKkoLnY25ri8Xi5TGh9U
RESEND_FROM_EMAIL=mail@nest-haus.com
REPLY_TO_EMAIL=mail@nest-haus.com

# Email Addresses (RECEIVING at nest-haus.at inbox via domain alias)
ADMIN_EMAIL=mail@nest-haus.com
SALES_EMAIL=mail@nest-haus.com
```

### DNS Records in Vercel (for `nest-haus.com`)

#### DKIM Record (Domain Authentication)
- **Type**: TXT
- **Name**: `resend._domainkey`
- **Value**: `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6TFk2qJkzTkhBQRd/o9qhPa2F2KsW2d29ChpvpcLw0x3x29G06AdPaQkDubUOpVHYAJZiXYSWkabBZnqBTU3q4gCE3XpDLtuhZPRwFnGUlWSoCD7v7cEbDsXCr78HhAr3UlppsMJaWN62zJcP872ONMMrNwfOsUkjbQgoPwxH1wIDAQAB`

#### SPF Record (Sender Authorization)
- **Type**: TXT
- **Name**: `send`
- **Value**: `v=spf1 include:amazonses.com ~all`

#### MX Record (Bounce Handling)
- **Type**: MX
- **Name**: `send`
- **Value**: `feedback-smtp.eu-west-1.amazonses.com`
- **Priority**: 10

#### DMARC Record (Optional but Recommended)
- **Type**: TXT
- **Name**: `_dmarc`
- **Value**: `v=DMARC1; p=none;`

---

## 🔍 How to Check if Your Domain is Verified

### In Resend Dashboard
1. Go to https://resend.com/domains
2. Find `nest-haus.com`
3. Check for **green checkmarks** on all records:
   - ✅ DKIM (resend._domainkey)
   - ✅ SPF (send subdomain)
   - ✅ MX (send subdomain)

### In Vercel DNS Settings
1. Go to Vercel Dashboard → nest-haus.com → Settings → Domains
2. Check that all DNS records are present and correct

### Using Command Line
```bash
# Check DKIM record
nslookup -type=TXT resend._domainkey.nest-haus.com

# Check SPF record
nslookup -type=TXT send.nest-haus.com

# Check MX record
nslookup -type=MX send.nest-haus.com
```

### Using Online Tool
Visit: https://dns.email/nest-haus.com

---

## 🔄 After Making Changes - CRITICAL STEPS

### Step 1: Clear Next.js Cache
```bash
# Kill all node processes
taskkill //F //IM node.exe

# Delete cache
rm -rf .next
```

### Step 2: Restart Development Server
```bash
npm run dev
```

### Step 3: Wait for Server to Start
```bash
# Wait 15-20 seconds, then test
sleep 15 && curl http://localhost:3000
```

### Step 4: Test Email Sending
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "phone":"+43123456789",
    "message":"Testing email",
    "requestType":"contact",
    "preferredContact":"email"
  }'
```

---

## 📧 Email Flow Architecture

### Sending Path (Resend)
```
Your App → Resend API → mail@nest-haus.com → Recipient's Inbox
```

### Receiving Path (Google Workspace Alias)
```
mail@nest-haus.com → Google Workspace Alias → mail@nest-haus.at inbox
```

### Calendar Integration
- Still uses: `mail@nest-haus.at`
- Reason: Existing Google Calendar is tied to `.at` domain
- No changes needed

---

## 🐛 Debugging Checklist

### Email Not Sending?

1. **Check Environment Variables**
   ```bash
   # In Node.js
   console.log('FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
   console.log('API_KEY:', process.env.RESEND_API_KEY);
   ```

2. **Check Resend Dashboard**
   - Go to https://resend.com/emails
   - Look for failed sends
   - Check error messages

3. **Check Server Logs**
   ```bash
   # Look for these console logs in npm run dev output:
   # ✅ Customer email sent successfully: [email-id]
   # ❌ Failed to send customer email: [error]
   ```

4. **Verify Domain in Resend**
   - Domain must show "Verified" status
   - All DNS records must have green checkmarks

5. **Check API Key**
   - Ensure `RESEND_API_KEY` starts with `re_`
   - Test in Resend dashboard: Settings → API Keys

---

## 🎯 Key Takeaways

1. **FROM email domain must match Resend verified domain**
   - ✅ `mail@nest-haus.com` (if `nest-haus.com` is verified)
   - ❌ `mail@send.nest-haus.com` (if only `nest-haus.com` is verified)

2. **Always clear cache and restart after env changes**
   - Next.js caches environment variables
   - Hot reload does NOT pick up `.env` changes

3. **DNS propagation can take time**
   - Typically: 5-15 minutes
   - Maximum: 72 hours
   - Use DNS checker tools to verify

4. **Root domain vs Subdomain**
   - Root: Simpler, fewer DNS records
   - Subdomain: Better reputation isolation (recommended by Resend)
   - Both work if configured correctly

---

## 📞 Need Help?

1. Check Resend Dashboard for domain status
2. Check DNS propagation: https://dns.email/nest-haus.com
3. Review server logs for specific error messages
4. Contact Resend Support: https://resend.com/support

---

**Last Updated**: November 15, 2024
**Working Configuration**: `mail@nest-haus.com` with root domain `nest-haus.com` verified in Resend

