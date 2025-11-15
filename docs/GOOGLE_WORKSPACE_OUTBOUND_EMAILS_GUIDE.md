# Google Workspace - Viewing Outbound Emails Guide

## 📧 How to See Outbound Emails in Google Workspace

### Current Setup
- **Google Group**: `mail@nest-haus.com`
- **Domain Alias**: `nest-haus.com` → routes to `nest-haus.at` inbox
- **Sending Method**: Via Resend (not directly through Google Workspace)

---

## ⚠️ Important Understanding

### What You Will See
✅ **INBOUND emails** (Replies from customers)
- When customers reply to `mail@nest-haus.com`, you'll see these in your Google Workspace inbox

### What You WON'T See Automatically
❌ **OUTBOUND emails** (Sent via Resend)
- Emails sent from your app via Resend API do NOT appear in Google Workspace "Sent" folder
- **Why?** Because Resend sends directly via their SMTP servers, not through Google

---

## 🎯 Solutions to Track Outbound Emails

### Option 1: Check Resend Dashboard (Recommended)

**Best for**: Seeing all sent emails, delivery status, and debugging

1. Go to https://resend.com/emails
2. Log in with your account
3. See all outgoing emails with:
   - ✅ Delivery status
   - 📧 Recipient email
   - 📅 Send time
   - 🔍 Full email content
   - 🐛 Error messages (if any)

**Advantages**:
- Real-time tracking
- Delivery confirmations
- Bounce notifications
- Click/open tracking (if enabled)

---

### Option 2: BCC All Outbound Emails to Your Inbox

**Best for**: Keeping a copy of all sent emails in your Gmail

#### Implementation Steps:

1. **Update EmailService.ts**:

```typescript
// In EmailService class, update all email sending methods:

static async sendCustomerConfirmation(data: CustomerInquiryData): Promise<boolean> {
  try {
    const result = await resend.emails.send({
      from: `${this.FROM_NAME} <${this.FROM_EMAIL}>`,
      replyTo: this.REPLY_TO_EMAIL,
      to: data.email,
      bcc: 'mail@nest-haus.at', // ← ADD THIS LINE
      subject,
      html,
      text,
    });
    // ...
  }
}
```

2. **Do this for all email methods**:
   - `sendCustomerConfirmation()`
   - `sendAdminNotification()`
   - `sendPaymentConfirmation()`
   - `sendAdminPaymentNotification()`

**Result**: Every outbound email will also appear in your `mail@nest-haus.at` inbox as a BCC copy.

---

### Option 3: Use Gmail "Send mail as" Feature

**Best for**: Sending emails directly from Gmail that appear in Sent folder

**Not applicable here** because:
- Your emails are sent automatically via API (not manually from Gmail)
- Would require SMTP integration, which defeats the purpose of using Resend

---

### Option 4: Set Up Email Forwarding/Archiving

**Best for**: Long-term email archiving

1. In Resend Dashboard, set up webhooks
2. Configure webhook to send to your server
3. Save email copies to database or forward to archive email

**Implementation**:
```typescript
// /api/webhooks/resend/route.ts
export async function POST(request: Request) {
  const webhook = await request.json();
  
  if (webhook.type === 'email.sent') {
    // Save to database or forward to archive
    await prisma.emailLog.create({
      data: {
        to: webhook.data.to,
        subject: webhook.data.subject,
        sentAt: new Date(webhook.data.created_at),
        status: 'sent',
      },
    });
  }
}
```

---

## 🔧 Setting Up Google Group Access

### To Access the Google Group Inbox:

1. **Go to Google Workspace Admin**:
   - https://admin.google.com

2. **Navigate to Groups**:
   - Apps → Google Workspace → Groups

3. **Find your group**:
   - Search for `mail@nest-haus.com`

4. **Add yourself as a member**:
   - Click on the group
   - Go to "Members"
   - Click "Add members"
   - Add your Gmail address
   - **Set role**: Manager or Member

5. **Set delivery preferences**:
   - Each member → Click "..." → "Delivery settings"
   - Choose: **"All email"** or **"Digest"**

6. **Access the inbox**:
   - Go to https://groups.google.com
   - Find `mail@nest-haus.com`
   - Click "Conversations"
   - You'll see incoming emails here

### Viewing in Gmail:

**Method A: Via Google Groups Web Interface**
- Visit https://groups.google.com
- Not integrated into Gmail inbox

**Method B: Forward Group Emails to Personal Gmail**
1. In Google Groups settings
2. Go to "Email options"
3. Enable "Send me all group messages"
4. **Result**: Group emails forward to your personal Gmail

**Method C: Add as Delegated Account** (if using Google Workspace)
1. Go to Gmail Settings → Accounts
2. "Grant access to your account"
3. Add another admin/user
4. They can switch between accounts in Gmail

---

## 🧪 Testing Email Flow

### Test Outbound Email Sending:

```bash
# 1. Send test email via contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"your-personal-email@gmail.com",
    "phone":"+43123456789",
    "message":"Test outbound email",
    "requestType":"contact",
    "preferredContact":"email"
  }'

# 2. Check Resend Dashboard
# Go to: https://resend.com/emails
# Look for the test email

# 3. Check your personal inbox
# The email should arrive at your-personal-email@gmail.com
```

### Test Reply Functionality:

1. Receive email from your app at your personal Gmail
2. Click "Reply"
3. **Verify**: Reply-To header shows `mail@nest-haus.com`
4. Send reply
5. **Check**: Reply arrives in `mail@nest-haus.at` inbox (via domain alias)

---

## 📊 Recommended Setup

### For Your Use Case:

1. **Primary Method**: Use Resend Dashboard for monitoring
   - Real-time tracking
   - Delivery status
   - Full email history

2. **Secondary Method**: Add BCC to key emails
   - BCC admin payment notifications to `mail@nest-haus.at`
   - Keep copies of important emails in Gmail

3. **Google Group**: Keep for receiving replies
   - All customer replies go to `mail@nest-haus.com`
   - Routed to `mail@nest-haus.at` inbox via domain alias

---

## 🔍 Email Flow Summary

### Outgoing (Sent by Your App)
```
Your App
    ↓
Resend API
    ↓
Resend SMTP Servers
    ↓
Customer's Inbox

✅ Visible in: Resend Dashboard
❌ NOT visible in: Google Workspace Sent folder
✅ Visible in Gmail: Only if you add BCC
```

### Incoming (Replies from Customers)
```
Customer hits "Reply"
    ↓
Email sent to: mail@nest-haus.com
    ↓
DNS MX records route to Google
    ↓
Google Workspace receives
    ↓
Domain Alias routes to: mail@nest-haus.at
    ↓
Your Gmail Inbox

✅ Visible in: Gmail inbox at mail@nest-haus.at
```

---

## 🎯 Quick Action Items

### To See Outbound Emails Today:

1. ✅ **Check Resend Dashboard** https://resend.com/emails
2. ✅ **Add BCC to EmailService.ts** (see Option 2 above)
3. ✅ **Verify domain alias** is working in Google Workspace
4. ✅ **Test reply flow** with a test email

### To Access Google Group:

1. ✅ Go to https://groups.google.com
2. ✅ Find `mail@nest-haus.com` group
3. ✅ Check if you're a member
4. ✅ If not, use Google Workspace Admin to add yourself
5. ✅ Set email delivery to "All email"

---

## 🆘 Troubleshooting

### "I can't find the Google Group"
- **Solution**: Check Google Workspace Admin → Groups
- Make sure the group was created for the correct domain

### "I'm not receiving group emails in Gmail"
- **Solution**: 
  1. Check group membership
  2. Verify email delivery settings
  3. Check spam folder

### "Outbound emails not appearing anywhere"
- **Solution**: Check Resend Dashboard first
- If not there, check server logs for errors
- Verify `RESEND_FROM_EMAIL` matches verified domain

### "Want to reply from mail@nest-haus.com address"
- **Solution**: 
  1. Gmail Settings → Accounts → "Send mail as"
  2. Add `mail@nest-haus.com`
  3. Use Google Workspace SMTP settings
  4. **Note**: This is for manual replies, not automatic emails

---

**Last Updated**: November 15, 2025  
**Related Docs**: `EMAIL_RESEND_TROUBLESHOOTING.md`, `FINAL_EMAIL_FUNCTIONALITY_SUMMARY.md`

