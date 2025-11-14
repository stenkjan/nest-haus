# Email DNS Setup: Plan A & Plan B

**Project**: Nest-Haus Configurator  
**Date**: November 14, 2025  
**Contact Email Goal**: `mail@nest-haus.at`

---

## Overview

This document provides two approaches for sending emails via Resend:

- **Plan A (Preferred)**: Send from `mail@nest-haus.at` with proper DNS verification
- **Plan B (Fallback)**: Send from Resend's default domain with Reply-To header

---

## Current Setup Context

### Google Workspace

- **Primary Domain**: `sustain-nest.com`
- **Alias Domain**: `nest-haus.at` (verified)
- **Shared Email**: `mail@nest-haus.at` (Google Group)
- **Calendar**: `c_0143623b3c51294d60b53cb259d8c76b8b8ecf51a84a2913afb053dc6540261b@group.calendar.google.com`
- **Purpose**: Receiving all incoming emails (contact forms, appointment requests, booking confirmations)

### Resend

- **Domain**: `nest-haus.at`
- **Region**: `eu-west-1`
- **Subdomain**: `bounce` (for bounce handling)
- **Purpose**: Sending all outgoing transactional emails

### DNS Provider

- **Provider**: Austria WebHosting
- **TXT Record Requirement**: Must include full subdomain format (e.g., `bounce.nest-haus.at`, not just `bounce`)

---

## Plan A: Proper Setup with mail@nest-haus.at (PREFERRED)

### Required DNS Records

#### 1. Domain Verification (DKIM)

```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5cL70eBBydVjxRd4aaOVU6rzlrduy2ikqAqxkWFbgsK0fodAiBk6/ZNJh6JSPjRqpB87wrNWKiA8fhhAce7SdhGx6aqgkCIA2df5mO0nAneYM1+q+hRoQkeMY8yDkObAdPDt0635s7PPykL9IJ6veRhmOLC5uIIm2GkKp5pzp8QIDAQAB
TTL: 3600
```

#### 2. SPF Record (Updated to include both Google and Amazon SES)

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com include:amazonses.com ~all
TTL: 3600
```

#### 3. DMARC Record

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:mail@nest-haus.at
TTL: 3600
```

#### 4. Bounce Subdomain - MX Record

```
Type: MX
Name: bounce
Value: feedback-smtp.eu-west-1.amazonses.com
TTL: 3600
Priority: 10
```

#### 5. Bounce Subdomain - TXT Record (SPF)

```
Type: TXT
Name: bounce.nest-haus.at
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
```

#### 6. Receiving MX Record (Google Workspace - already configured)

```
Type: MX
Name: @
Priority 1: ASPMX.L.GOOGLE.COM
Priority 5: ALT1.ASPMX.L.GOOGLE.COM
Priority 5: ALT2.ASPMX.L.GOOGLE.COM
Priority 10: ALT3.ASPMX.L.GOOGLE.COM
Priority 10: ALT4.ASPMX.L.GOOGLE.COM
```

### Environment Variables (.env and .env.local)

```bash
# Resend Configuration
RESEND_API_KEY=re_WTuw2cJE_9P9KLKkoLnY25ri8Xi5TGh9U
RESEND_FROM_EMAIL=mail@nest-haus.at

# Email Addresses
ADMIN_EMAIL=mail@nest-haus.at
SALES_EMAIL=mail@nest-haus.at
REPLY_TO_EMAIL=mail@nest-haus.at

# Google Calendar
GOOGLE_CALENDAR_ID=c_0143623b3c51294d60b53cb259d8c76b8b8ecf51a84a2913afb053dc6540261b@group.calendar.google.com
CALENDAR_TIMEZONE=Europe/Vienna

# Cron Secret (for appointment expiration)
CRON_SECRET=your-secret-here
```

### Email Service Configuration (src/lib/EmailService.ts)

```typescript
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "mail@nest-haus.at";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "mail@nest-haus.at";
const SALES_EMAIL = process.env.SALES_EMAIL || "mail@nest-haus.at";
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || "mail@nest-haus.at";

// All outgoing emails use FROM_EMAIL
// All replies go to REPLY_TO_EMAIL
```

### Verification Steps

1. **Wait for DNS Propagation** (24-72 hours, typically 1-4 hours)

   ```bash
   # Check DNS propagation
   nslookup -type=TXT resend._domainkey.nest-haus.at
   nslookup -type=TXT bounce.nest-haus.at
   nslookup -type=TXT nest-haus.at
   ```

2. **Check Resend Dashboard**
   - Domain Verification: ✅ Green checkmark
   - Sending (SPF): ✅ Green checkmark
   - Sending (MX bounce): ✅ Green checkmark
   - All should show "Verified" or "Active"

3. **Test Email Sending**

   ```bash
   # Test contact form
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "+43123456789",
       "message": "Test message",
       "requestType": "contact"
     }'
   ```

4. **Verify Email Headers**
   - Check that emails arrive from `mail@nest-haus.at`
   - Verify Reply-To header is set to `mail@nest-haus.at`
   - Check SPF, DKIM, DMARC pass in email headers

---

## Plan B: Fallback with Resend Default Domain (FALLBACK)

### When to Use Plan B

- DNS verification fails repeatedly (>72 hours)
- DNS provider cannot accommodate subdomain format
- Urgent need to send emails immediately
- **Temporary solution only** - should migrate to Plan A when possible

### Changes Required

#### 1. Update Environment Variables

```bash
# .env and .env.local
# Use Resend's default verified domain
RESEND_FROM_EMAIL=onboarding@resend.dev
# OR if you have another verified domain
# RESEND_FROM_EMAIL=noreply@yourdomain.com

# Keep reply addresses as nest-haus
ADMIN_EMAIL=mail@nest-haus.at
SALES_EMAIL=mail@nest-haus.at
REPLY_TO_EMAIL=mail@nest-haus.at
```

#### 2. Update EmailService.ts

**Current Implementation** (already supports this):

```typescript
// src/lib/EmailService.ts
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "mail@nest-haus.at";
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || "mail@nest-haus.at";

export async function sendCustomerConfirmationEmail(
  customerEmail: string,
  data: EmailData
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL, // Will be onboarding@resend.dev in Plan B
    to: customerEmail,
    replyTo: REPLY_TO_EMAIL, // Still mail@nest-haus.at
    subject: "Ihre Anfrage bei Nest-Haus",
    html: generateCustomerConfirmationEmail(data),
  });
}
```

#### 3. Email Template Updates (Optional)

To make it clearer to users that replies go to your domain, you can emphasize the reply-to address in templates:

```typescript
// src/lib/emailTemplates/CustomerConfirmationTemplate.ts
// Add a prominent notice in the email body:

<p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
  <strong>Bitte antworten Sie direkt auf diese E-Mail.</strong><br>
  Ihre Antwort wird automatisch an mail@nest-haus.at weitergeleitet.
</p>
```

#### 4. No DNS Changes Required

- Keep existing Google Workspace DNS records (MX, SPF for Google)
- Remove or ignore failed Resend DNS records
- Resend will use their own verified domain for sending

### Trade-offs of Plan B

**Advantages:**

- ✅ Works immediately (no DNS wait)
- ✅ No DNS configuration complexity
- ✅ Replies still go to `mail@nest-haus.at`
- ✅ Email delivery rates unchanged
- ✅ All functionality preserved

**Disadvantages:**

- ❌ Sender shows `onboarding@resend.dev` instead of `mail@nest-haus.at`
- ❌ Less professional appearance
- ❌ Potential confusion for recipients
- ❌ DMARC alignment not perfect (SPF passes for resend.dev, not nest-haus.at)
- ❌ May trigger spam filters more easily

### Implementation Steps for Plan B

1. **Update Environment Variables**

   ```bash
   # In .env.local
   RESEND_FROM_EMAIL=onboarding@resend.dev
   REPLY_TO_EMAIL=mail@nest-haus.at
   ```

2. **Clear Next.js Cache and Restart**

   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Test Email Sending**
   - Send test contact form
   - Verify sender is `onboarding@resend.dev`
   - Verify reply-to is `mail@nest-haus.at`
   - Test replying to email (should go to your inbox)

4. **Monitor Email Delivery**
   - Check spam rates in Resend dashboard
   - Monitor delivery rates
   - Watch for customer confusion

5. **Plan Migration to Plan A**
   - Continue working with DNS provider
   - Once DNS is verified, switch back to Plan A
   - Update `RESEND_FROM_EMAIL` to `mail@nest-haus.at`

---

## Email Flow Diagrams

### Plan A Flow (Preferred)

```
User fills form → Next.js API → Resend API
                                    ↓
                          FROM: mail@nest-haus.at
                          REPLY-TO: mail@nest-haus.at
                                    ↓
                              Customer Inbox
                                    ↓
                          Customer clicks "Reply"
                                    ↓
                          Google Workspace receives
                                    ↓
                              mail@nest-haus.at
```

### Plan B Flow (Fallback)

```
User fills form → Next.js API → Resend API
                                    ↓
                          FROM: onboarding@resend.dev
                          REPLY-TO: mail@nest-haus.at
                                    ↓
                              Customer Inbox
                              (shows resend.dev)
                                    ↓
                          Customer clicks "Reply"
                                    ↓
                          Google Workspace receives
                                    ↓
                              mail@nest-haus.at
```

---

## Testing Checklist

### For Both Plans

- [ ] Contact form submission sends email
- [ ] Appointment booking sends confirmation
- [ ] Admin receives notification emails
- [ ] Reply-To header is set to `mail@nest-haus.at`
- [ ] Emails arrive in Google Workspace inbox
- [ ] Email templates render correctly (branded design)
- [ ] Calendar integration creates events
- [ ] 24-hour appointment expiration works
- [ ] Customer can reply to emails
- [ ] Replies arrive at `mail@nest-haus.at`

### Plan A Specific

- [ ] Resend dashboard shows all DNS records verified
- [ ] SPF record includes both Google and Amazon SES
- [ ] DKIM passes in email headers
- [ ] SPF passes in email headers
- [ ] DMARC passes in email headers
- [ ] Sender shows `mail@nest-haus.at`

### Plan B Specific

- [ ] Emails send successfully from `onboarding@resend.dev`
- [ ] Customer understands how to reply
- [ ] No increase in spam complaints
- [ ] Delivery rates remain high (>95%)

---

## Troubleshooting

### Plan A Issues

**Issue**: DNS records not verifying after 24 hours

- **Solution**: Contact DNS provider to verify records were added correctly
- **Check**: Use `nslookup` to verify DNS propagation
- **Fallback**: Switch to Plan B temporarily

**Issue**: SPF "soft fail" in email headers

- **Solution**: Verify SPF record includes `include:amazonses.com`
- **Check**: Ensure no other SPF records conflict
- **Wait**: DNS propagation can take up to 72 hours

**Issue**: DKIM "neutral" or "fail"

- **Solution**: Verify DKIM record added exactly as provided by Resend
- **Check**: No extra spaces or line breaks in TXT value
- **Contact**: Resend support if issue persists

**Issue**: Bounce subdomain MX record fails

- **Solution**: Verify MX record value is `feedback-smtp.eu-west-1.amazonses.com` (not amazonaws.com)
- **Check**: Ensure bounce TXT record name is `bounce.nest-haus.at`

### Plan B Issues

**Issue**: High spam rates

- **Solution**: Add clear "Reply to this email" instructions in templates
- **Monitor**: Check Resend dashboard for bounce/spam rates
- **Escalate**: If >5% spam rate, contact Resend support

**Issue**: Customers confused about sender

- **Solution**: Add prominent "This email is from Nest-Haus" branding
- **Update**: Email templates to emphasize company branding
- **Consider**: Migrate to Plan A ASAP

---

## Migration Path: Plan B → Plan A

When DNS is finally verified and you want to switch from Plan B to Plan A:

1. **Verify DNS in Resend Dashboard**
   - All records show green checkmarks
   - Domain status is "Verified"

2. **Update Environment Variables**

   ```bash
   # Change in .env.local
   RESEND_FROM_EMAIL=mail@nest-haus.at
   ```

3. **Restart Server**

   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Test Sending**
   - Send test email
   - Verify sender is now `mail@nest-haus.at`
   - Check email headers for SPF/DKIM/DMARC pass

5. **Monitor for 24 Hours**
   - Check delivery rates
   - Monitor spam complaints
   - Verify no delivery issues

6. **Deploy to Production**
   ```bash
   # Update Vercel environment variables
   # Via Vercel dashboard or CLI
   vercel env add RESEND_FROM_EMAIL production
   # Enter: mail@nest-haus.at
   ```

---

## Current Status

**Date**: November 14, 2025

**DNS Records Sent to Provider**:

- ✅ DKIM (resend.\_domainkey)
- ✅ SPF (@ - updated to include both Google and Amazon SES)
- ✅ DMARC (\_dmarc)
- ✅ Bounce MX (bounce → feedback-smtp.eu-west-1.amazonses.com) - **CORRECTED by provider**
- 🔄 Bounce TXT (bounce.nest-haus.at → v=spf1 include:amazonses.com ~all) - **WAITING for provider to add**

**Resend Dashboard Status**:

- 🔄 Waiting for DNS propagation after provider updates bounce TXT record
- User initiated manual refresh before DNS update completed

**Next Steps**:

1. **Wait 1-4 hours** for DNS propagation after provider adds bounce TXT record
2. **Check Resend dashboard** for verification status
3. **If verification fails after 24 hours**: Activate Plan B
4. **If verification succeeds**: Continue with Plan A (no changes needed)

---

## Quick Reference: Environment Variables

### Plan A (Preferred)

```bash
RESEND_FROM_EMAIL=mail@nest-haus.at
ADMIN_EMAIL=mail@nest-haus.at
SALES_EMAIL=mail@nest-haus.at
REPLY_TO_EMAIL=mail@nest-haus.at
```

### Plan B (Fallback)

```bash
RESEND_FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=mail@nest-haus.at
SALES_EMAIL=mail@nest-haus.at
REPLY_TO_EMAIL=mail@nest-haus.at
```

---

## Contact Information

**Google Workspace**: `mail@nest-haus.at`  
**Resend Account**: Connected to `nest-haus.at` domain  
**DNS Provider**: Austria WebHosting (service@austriawebhosting.com)  
**Next.js App**: Hosted on Vercel

---

## Additional Resources

- [Resend DNS Configuration Guide](https://resend.com/docs/dashboard/domains/introduction)
- [Google Workspace MX Records](https://support.google.com/a/answer/174125)
- [SPF Record Syntax](https://www.rfc-editor.org/rfc/rfc7208.html)
- [DMARC Policy Guide](https://dmarc.org/overview/)

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025  
**Author**: AI Assistant (for Nest-Haus Project)

