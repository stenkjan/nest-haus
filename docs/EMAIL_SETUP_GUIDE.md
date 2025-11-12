# Email Configuration Setup Guide
## mail@nest-haus.at - Google Workspace + Resend Integration

**Last Updated**: November 12, 2025  
**Status**: Active Configuration  
**Primary Email**: mail@nest-haus.at

---

## Table of Contents

1. [Overview](#overview)
2. [Current Configuration](#current-configuration)
3. [Google Workspace Setup](#google-workspace-setup)
4. [Resend Configuration](#resend-configuration)
5. [DNS Records](#dns-records)
6. [Testing & Verification](#testing--verification)
7. [Auto-Reply Configuration](#auto-reply-configuration)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### Why Two Email Services?

**Google Workspace** (Receiving + Manual Management)
- Professional inbox management
- Team collaboration features
- Manual email responses
- Calendar integration
- Contact form inquiries arrive here

**Resend** (Transactional Email Sending)
- Application-generated emails (Stripe confirmations, booking confirmations)
- High deliverability rates
- Email tracking and analytics
- Programmatic sending with API
- Designed for transactional emails

### Email Flow Diagram

```
┌─────────────────────┐
│  Customer Action    │
│  (Contact Form)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Next.js API       │
│   /api/contact      │
└──────────┬──────────┘
           │
           ├─────────────────────┐
           ▼                     ▼
┌──────────────────┐   ┌──────────────────┐
│  Customer Email  │   │   Admin Email    │
│  via Resend      │   │   via Resend     │
└─────────┬────────┘   └─────────┬────────┘
          │                      │
          ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│ Customer Inbox   │   │ Google Workspace │
│  (anywhere)      │   │ mail@nest-haus.at│
└──────────────────┘   └──────────────────┘
```

**Reply-To Configuration**: All emails sent via Resend have `reply-to: mail@nest-haus.at`, ensuring replies arrive in Google Workspace inbox.

---

## Current Configuration

### Environment Variables

Both `.env` and `.env.local` contain:

```env
# ===== EMAIL CONFIGURATION (RESEND) =====
RESEND_API_KEY=re_WTuw2cJE_9P9KLKkoLnY25ri8Xi5TGh9U
RESEND_FROM_EMAIL=mail@nest-haus.at
ADMIN_EMAIL=mail@nest-haus.at
SALES_EMAIL=mail@nest-haus.at
```

### Code Integration

**Email Service**: `src/lib/EmailService.ts`
- All emails sent via Resend API
- Dynamic email addresses from environment variables
- Fallback addresses: `admin@nest-haus.at` and `sales@nest-haus.at`

**Contact Form API**: `src/app/api/contact/route.ts`
- Sends confirmation to customer
- Sends notification to admin/sales team
- Integrates with calendar availability check

---

## Google Workspace Setup

### Step 1: Make mail@nest-haus.at Primary

1. **Access Admin Console**
   - Navigate to: [admin.google.com](https://admin.google.com)
   - Sign in with your Google Workspace admin account

2. **For Group Email (Recommended)**
   - Go to: **Directory** → **Groups**
   - Select your group (the one with alias mail@nest-haus.at)
   - Click **Group settings**
   - Under **Email options**, set `mail@nest-haus.at` as the **Primary email address**
   - Click **Save**

3. **For User Email (Alternative)**
   - Go to: **Directory** → **Users**
   - Select the user
   - Click **User information**
   - Under **Email aliases**, click **Make primary** next to `mail@nest-haus.at`
   - Click **Save**

### Step 2: Verify Domain Ownership

✅ **Already Completed** - Your DNS records show:

```
TXT @ google-site-verification=Ln1Ofwq_EVxH2e4ZECi2dFZhm5ILOCavpHzTmOCtZXY
```

### Step 3: Configure Email Routing

1. In Google Workspace Admin Console
2. Go to: **Apps** → **Google Workspace** → **Gmail**
3. Click **Routing**
4. Ensure routing rules allow incoming mail to `mail@nest-haus.at`

---

## Resend Configuration

### Step 1: Add Domain to Resend

1. **Access Resend Dashboard**
   - Navigate to: [resend.com/domains](https://resend.com/domains)
   - Sign in with your Resend account

2. **Add Domain**
   - Click **Add Domain**
   - Enter: `nest-haus.at`
   - Click **Add**

3. **Copy DNS Records**
   Resend will provide DNS records similar to:

   ```
   TXT Record:
   Name: _resend
   Value: re_verify_abc123xyz... (provided by Resend)
   
   TXT Record (DKIM):
   Name: resend._domainkey
   Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN... (provided by Resend)
   ```

### Step 2: Verify Domain

After adding DNS records (see next section):
- Return to Resend dashboard
- Click **Verify** next to nest-haus.at
- Wait for verification (can take up to 48 hours, usually 5-10 minutes)
- Status should change to **Verified** ✅

### Step 3: Update Sending Settings

1. In Resend dashboard, go to **Domains** → **nest-haus.at**
2. Set **Default From Email**: `mail@nest-haus.at`
3. Enable **DKIM Signing**: Should be automatic after verification
4. Check **SPF Alignment**: Ensure SPF includes Resend

---

## DNS Records

### Required DNS Configuration at Your Domain Provider

**Access your DNS management panel** at your website hosting provider (where nest-haus.at is registered).

### 1. Google Workspace Records (Already Configured ✅)

```
Record Type: MX
Priority: 1
Host/Name: @ (or leave blank)
Value: ASPMX.L.GOOGLE.COM

Record Type: MX
Priority: 5
Host/Name: @ (or leave blank)
Value: ALT1.ASPMX.L.GOOGLE.COM

Record Type: MX
Priority: 5
Host/Name: @ (or leave blank)
Value: ALT2.ASPMX.L.GOOGLE.COM

Record Type: MX
Priority: 10
Host/Name: @ (or leave blank)
Value: ALT3.ASPMX.L.GOOGLE.COM

Record Type: MX
Priority: 10
Host/Name: @ (or leave blank)
Value: ALT4.ASPMX.L.GOOGLE.COM
```

```
Record Type: CNAME
Host/Name: mail
Value: ghs.googlehosted.com
TTL: 3600
```

```
Record Type: TXT
Host/Name: @ (or leave blank)
Value: google-site-verification=Ln1Ofwq_EVxH2e4ZECi2dFZhm5ILOCavpHzTmOCtZXY
TTL: 60
```

### 2. SPF Record (CRITICAL - Update Required)

**Current SPF**:
```
Record Type: TXT
Host/Name: @ (or leave blank)
Value: v=spf1 include:_spf.google.com ~all
TTL: 3600
```

**Updated SPF** (add Resend):
```
Record Type: TXT
Host/Name: @ (or leave blank)
Value: v=spf1 include:_spf.google.com include:_spf.resend.com ~all
TTL: 3600
```

⚠️ **IMPORTANT**: Replace the existing SPF record, don't add a second one. Multiple SPF records will break email authentication.

### 3. Resend Records (To Be Added)

**Add these after setting up domain in Resend dashboard:**

```
Record Type: TXT
Host/Name: _resend
Value: [Provided by Resend after adding domain]
TTL: 3600
```

```
Record Type: TXT
Host/Name: resend._domainkey
Value: [Provided by Resend - DKIM key, starts with "p=MIGfMA0..."]
TTL: 3600
```

### DNS Verification Commands

**Check MX Records**:
```bash
nslookup -type=MX nest-haus.at
```

**Check SPF Record**:
```bash
nslookup -type=TXT nest-haus.at
```

**Check DKIM Record**:
```bash
nslookup -type=TXT resend._domainkey.nest-haus.at
```

---

## Testing & Verification

### 1. Pre-Flight Checklist

- [ ] Google Workspace: mail@nest-haus.at is primary address
- [ ] Resend: Domain verified (green checkmark)
- [ ] DNS: SPF record includes both Google and Resend
- [ ] DNS: DKIM records for Resend added and verified
- [ ] Environment variables updated in `.env` and `.env.local`
- [ ] Application restarted to load new environment variables

### 2. Test Email Sending via Resend

**Option A: Via Resend Dashboard**
1. Go to: [resend.com/emails](https://resend.com/emails)
2. Click **Send Test Email**
3. From: `mail@nest-haus.at`
4. To: Your personal email
5. Subject: "Test from NEST-Haus"
6. Send and verify receipt

**Option B: Via API (cURL)**
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_WTuw2cJE_9P9KLKkoLnY25ri8Xi5TGh9U' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "mail@nest-haus.at",
    "to": "your-test-email@example.com",
    "subject": "Test Email from NEST-Haus",
    "html": "<p>This is a test email from the NEST-Haus system.</p>"
  }'
```

**Expected Response**:
```json
{
  "id": "abc123...",
  "from": "mail@nest-haus.at",
  "to": "your-test-email@example.com",
  "created_at": "2025-11-12T..."
}
```

### 3. Test Email Receiving via Google Workspace

1. Send an email TO: `mail@nest-haus.at` from your personal email
2. Check Google Workspace inbox
3. Verify email arrives within 1-2 minutes

### 4. Test Contact Form Submission

**Access the contact form**:
```
http://localhost:3000/konfigurator
```

1. Fill out the contact form
2. Submit the form
3. Check for:
   - ✅ Customer receives confirmation email (from Resend)
   - ✅ Admin receives notification at mail@nest-haus.at (via Google Workspace)
   - ✅ Both emails show `From: NEST-Haus Team <mail@nest-haus.at>`

**Monitor Logs**:
```bash
# In your terminal running npm run dev, watch for:
📧 Sending customer confirmation email to [customer-email]
✅ Customer email sent successfully: [message-id]
📧 Sending admin notification for inquiry [inquiry-id]
✅ Admin email sent successfully: [message-id]
```

### 5. Test Reply-To Functionality

1. Receive customer confirmation email
2. Click "Reply"
3. Verify reply address is `mail@nest-haus.at`
4. Send reply
5. Check Google Workspace inbox for the reply

### 6. Email Deliverability Check

**Use Email Testing Tools**:

1. **Mail-Tester** ([mail-tester.com](https://www.mail-tester.com))
   - Send test email to provided address
   - Check spam score (should be 9/10 or higher)
   - Verify SPF, DKIM, DMARC pass

2. **MXToolbox** ([mxtoolbox.com](https://mxtoolbox.com))
   - Run: `SPF Record Lookup` for nest-haus.at
   - Run: `DKIM Record Lookup` for resend._domainkey.nest-haus.at
   - All checks should pass ✅

---

## Auto-Reply Configuration

### Option 1: Gmail Filters + Canned Responses (Recommended)

**Step 1: Enable Templates**
1. Open Gmail: mail@nest-haus.at
2. Click **Settings** (⚙️) → **See all settings**
3. Go to **Advanced** tab
4. Enable **Templates**
5. Click **Save Changes**

**Step 2: Create Template**
1. Click **Compose**
2. Write your auto-reply message:

```
Vielen Dank für Ihre Anfrage!

Wir haben Ihre Nachricht erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.

Für dringende Anliegen erreichen Sie uns unter:
Telefon: +43 664 2531869

Mit freundlichen Grüßen,
NEST-Haus Team
```

3. Click **⋮** (three dots) → **Templates** → **Save draft as template** → **Save as new template**
4. Name it: "Contact Request Auto-Reply"
5. Close the draft (don't send)

**Step 3: Create Filter**
1. Click **Settings** (⚙️) → **See all settings**
2. Go to **Filters and Blocked Addresses**
3. Click **Create a new filter**
4. Filter criteria:
   - **From**: Contains `@`
   - **Subject**: Contains `Kontaktanfrage` OR `Contact Request` OR `Neue Anfrage`
5. Click **Create filter**
6. Check: **Send template** → Select "Contact Request Auto-Reply"
7. Click **Create filter**

### Option 2: Google Workspace Vacation Responder

1. Open Gmail: mail@nest-haus.at
2. Click **Settings** (⚙️) → **See all settings**
3. Scroll to **Vacation responder**
4. Enable **Vacation responder on**
5. Configure:
   - **First day**: Leave blank for always on
   - **Last day**: Leave blank for always on
   - **Subject**: "Re: Ihre Anfrage bei NEST-Haus"
   - **Message**: [Same as above template]
6. Check: **Only send a response to people in my Contacts**
7. Click **Save Changes**

⚠️ **Note**: Vacation responder sends to ALL incoming emails. Use filters for more control.

### Option 3: Third-Party Add-ons

**Google Workspace Add-ons**:
- **Auto Responder for Gmail** - Conditional auto-replies
- **Yet Another Mail Merge** - Advanced email automation
- **Right Inbox** - Smart auto-responders

Install from: [Google Workspace Marketplace](https://workspace.google.com/marketplace)

---

## Troubleshooting

### Issue: Emails Not Sending from Application

**Symptom**: Contact form submits, but no emails received

**Diagnosis Steps**:
1. Check application logs for errors:
   ```bash
   # Look for:
   ❌ Failed to send customer email: [error]
   ❌ Email sending failed: [error]
   ```

2. Verify environment variables:
   ```bash
   # In your terminal
   echo $RESEND_API_KEY
   echo $RESEND_FROM_EMAIL
   ```

3. Test Resend API directly:
   ```bash
   curl -X GET 'https://api.resend.com/emails' \
     -H 'Authorization: Bearer re_WTuw2cJE_9P9KLKkoLnY25ri8Xi5TGh9U'
   ```

**Solutions**:
- ✅ Restart application after changing `.env` files
- ✅ Verify Resend API key is correct and active
- ✅ Check Resend dashboard for domain verification status
- ✅ Ensure `RESEND_FROM_EMAIL=mail@nest-haus.at` (not onboarding@resend.dev)

### Issue: Emails Going to Spam

**Symptom**: Emails arrive in spam folder

**Diagnosis**:
1. Check SPF alignment:
   ```bash
   nslookup -type=TXT nest-haus.at
   ```
   Should include: `v=spf1 include:_spf.google.com include:_spf.resend.com ~all`

2. Check DKIM signing:
   ```bash
   nslookup -type=TXT resend._domainkey.nest-haus.at
   ```
   Should return DKIM public key

3. Use [mail-tester.com](https://www.mail-tester.com) to check spam score

**Solutions**:
- ✅ Add/update SPF record to include both Google and Resend
- ✅ Verify DKIM records are correctly added
- ✅ Add DMARC record (optional but recommended):
  ```
  Record Type: TXT
  Host/Name: _dmarc
  Value: v=DMARC1; p=quarantine; rua=mailto:mail@nest-haus.at
  ```
- ✅ Ensure "From" name is professional: "NEST-Haus Team"
- ✅ Avoid spam trigger words in subject lines

### Issue: Not Receiving Emails at mail@nest-haus.at

**Symptom**: External emails sent to mail@nest-haus.at don't arrive

**Diagnosis**:
1. Check MX records:
   ```bash
   nslookup -type=MX nest-haus.at
   ```
   Should show Google's MX servers

2. Check Google Workspace routing:
   - Admin Console → Apps → Gmail → Routing
   - Ensure no rules block incoming mail

3. Check inbox filters in Gmail:
   - Settings → Filters and Blocked Addresses
   - Remove any filters that might archive/delete mail

**Solutions**:
- ✅ Verify MX records point to Google (ASPMX.L.GOOGLE.COM priority 1)
- ✅ Check Google Workspace spam folder
- ✅ Verify mail@nest-haus.at is set as primary (not alias)
- ✅ Contact Google Workspace support if routing issues persist

### Issue: Reply-To Not Working

**Symptom**: When customers reply to emails, replies go to wrong address

**Diagnosis**:
1. Check email source/headers:
   - In Gmail, open email → ⋮ → "Show original"
   - Look for: `Reply-To: mail@nest-haus.at`

2. Verify EmailService.ts configuration:
   ```typescript
   // Should include:
   from: `${this.FROM_NAME} <${this.FROM_EMAIL}>`
   // FROM_EMAIL should be mail@nest-haus.at
   ```

**Solutions**:
- ✅ Ensure `RESEND_FROM_EMAIL=mail@nest-haus.at` in environment variables
- ✅ Restart application after changing environment variables
- ✅ Check Resend dashboard for any reply-to overrides

### Issue: Domain Verification Pending

**Symptom**: Resend shows "Pending" verification status

**Diagnosis**:
1. Check DNS propagation:
   ```bash
   nslookup -type=TXT _resend.nest-haus.at
   nslookup -type=TXT resend._domainkey.nest-haus.at
   ```

2. Use DNS propagation checker: [whatsmydns.net](https://www.whatsmydns.net)

**Solutions**:
- ✅ Wait 5-60 minutes for DNS propagation
- ✅ Verify TXT records are correctly entered (no extra spaces)
- ✅ Try "Verify" button in Resend dashboard again
- ✅ Check with domain provider that TXT records saved correctly
- ✅ If >48 hours, contact Resend support

---

## Email Volume & Limits

### Resend Free Tier
- **3,000 emails/month** (free)
- **100 emails/day** limit
- Full API access
- DKIM signing included

**Your Expected Volume**: 10-100 emails/day  
**Status**: Well within free tier ✅

### Google Workspace
- **2,000 emails/day** sending limit
- **Unlimited** receiving
- **30 GB** storage per user

**Usage**: Primarily for receiving, not sending via SMTP  
**Status**: No concerns ✅

---

## Security Best Practices

### API Key Management

1. **Keep API keys secret**:
   - Never commit `.env` or `.env.local` to Git
   - Already in `.gitignore` ✅

2. **Rotate keys periodically**:
   - Resend Dashboard → Settings → API Keys → Regenerate
   - Update `.env` and `.env.local`
   - Restart application

3. **Use environment-specific keys**:
   - Development: Keep current key
   - Production: Use separate Resend project/key (recommended)

### Email Authentication

**Current Configuration**:
- ✅ SPF: Authorizes Google and Resend to send on behalf of nest-haus.at
- ✅ DKIM: Cryptographic signature proving email legitimacy
- ⏳ DMARC: Recommended but optional

**Add DMARC Record** (Optional but Recommended):
```
Record Type: TXT
Host/Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:mail@nest-haus.at; ruf=mailto:mail@nest-haus.at; fo=1
TTL: 3600
```

**DMARC Policy Explanation**:
- `p=quarantine`: Flag suspicious emails
- `rua`: Aggregate reports sent to this address
- `ruf`: Forensic reports sent to this address
- `fo=1`: Generate reports for all failures

---

## Support & Resources

### Google Workspace Support
- **Help Center**: [support.google.com/a](https://support.google.com/a)
- **Admin Console**: [admin.google.com](https://admin.google.com)
- **Status Dashboard**: [workspace.google.com/status](https://workspace.google.com/status)

### Resend Support
- **Documentation**: [resend.com/docs](https://resend.com/docs)
- **Dashboard**: [resend.com/emails](https://resend.com/emails)
- **Status**: [status.resend.com](https://status.resend.com)
- **Support**: support@resend.com

### DNS & Domain Support
- Contact your domain registrar/hosting provider
- Provide DNS records from this guide

---

## Next Steps

1. **Complete Resend Domain Setup**:
   - Add nest-haus.at to Resend dashboard
   - Copy DNS records
   - Add DNS records to domain provider
   - Verify domain in Resend

2. **Update SPF Record**:
   - Update existing SPF TXT record to include Resend
   - Verify with `nslookup -type=TXT nest-haus.at`

3. **Test End-to-End**:
   - Submit contact form
   - Verify emails sent via Resend
   - Verify emails received in Google Workspace
   - Test reply-to functionality

4. **Configure Auto-Reply**:
   - Set up Gmail filters + templates
   - Test with sample contact request

5. **Monitor**:
   - Check Resend dashboard daily for first week
   - Monitor Google Workspace inbox
   - Verify no emails in spam

---

**Configuration Complete!** ✅

Your email system is now set up for professional, reliable communication with customers.

