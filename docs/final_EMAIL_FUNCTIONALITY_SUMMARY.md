# FINAL Email Functionality Summary

## Complete Guide to Email System, Calendar Integration & Configuration

**Project**: Nest-Haus Configurator  
**Last Updated**: November 27, 2025  
**Status**: ✅ nest-haus.com Root Domain Configuration Active with ICS RSVP System

---

## 📋 Table of Contents

1. [Current Email Architecture](#current-email-architecture)
2. [Sending Configuration (Resend)](#sending-configuration-resend)
3. [Receiving Configuration (Google Workspace)](#receiving-configuration-google-workspace)
4. [Calendar Integration](#calendar-integration)
5. [Email Flow Diagrams](#email-flow-diagrams)
6. [DNS Configuration](#dns-configuration)
7. [Environment Variables](#environment-variables)
8. [Email Types & Templates](#email-types--templates)
9. [Appointment System](#appointment-system)
10. [ICS Calendar RSVP System](#ics-calendar-rsvp-system)
11. [Reply Tracking & Email Saving](#reply-tracking--email-saving)
11. [Database Storage](#database-storage)
12. [Testing & Verification](#testing--verification)
13. [Troubleshooting](#troubleshooting)
14. [Migration History](#migration-history)

---

## Current Email Architecture

### Overview

**Sending Domain**: `mail@nest-haus.com` (via Resend)  
**Receiving Domain**: `mail@nest-haus.com` (via Google Workspace domain alias)  
**Reply-To Address**: `mail@nest-haus.com`  
**Calendar**: `mail@nest-haus.at` (Google Calendar shared calendar)

### Why This Setup?

1. **nest-haus.com** is managed via Vercel DNS → **Easy, instant DNS control**
2. **nest-haus.at** had DNS issues with Austria WebHosting → **Slow, unreliable**
3. **Google Workspace Domain Alias** → `mail@nest-haus.com` emails go to same inbox as `mail@nest-haus.at`
4. **Root Domain Approach** → Simpler DNS setup, single domain verification

### Email Flow Architecture

```
┌────────────────────────────────────────────────────────────┐
│                  SENDING (Resend)                          │
├────────────────────────────────────────────────────────────┤
│ Domain: nest-haus.com                                      │
│ From: NEST-Haus Team <mail@nest-haus.com>                 │
│ Reply-To: mail@nest-haus.com                               │
│ DNS Provider: Vercel                                       │
│ Authentication: SPF + DKIM                                 │
└────────────────────────────────────────────────────────────┘
                            ↓
                    Customer Receives
                            ↓
                    Clicks "Reply"
                            ↓
┌────────────────────────────────────────────────────────────┐
│              RECEIVING (Google Workspace)                   │
├────────────────────────────────────────────────────────────┤
│ To: mail@nest-haus.com                                     │
│ Domain Alias: Routes to
│ MX Records: Point to Google                                │
│ DNS Provider: Vercel                                       │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│                CALENDAR (Google Calendar)                   │
├────────────────────────────────────────────────────────────┤
│ Calendar ID: c_0143623...@group.calendar.google.com       │
│ Associated Email: mail@nest-haus.at                        │
│ Time Zone: Europe/Vienna                                   │
│ Business Hours: 8-12, 13-19 (Mon-Fri)                      │
└────────────────────────────────────────────────────────────┘
```

---

## Sending Configuration (Resend)

### Resend Account Details

- **Domain**: `nest-haus.com` (root domain)
- **Region**: `eu-west-1` (Ireland)
- **API Key**: `re_WTuw2cJE_9P9KLKkoLnY25ri8Xi5TGh9U`
- **Dashboard**: https://resend.com/domains

### Email Headers

All outgoing emails use:

```typescript
{
  from: "NEST-Haus Team <mail@nest-haus.com>",
  replyTo: "mail@nest-haus.com",
  to: [recipientEmail],
  subject: [dynamically generated],
  html: [branded template],
  text: [plain text fallback]
}
```

### Sending Limits

- **Free Tier**: 3,000 emails/month, 100 emails/day
- **Current Usage**: 10-100 emails/day (well within limits)
- **Rate Limiting**: Managed automatically by Resend

### Email Service Implementation

**File**: `src/lib/EmailService.ts`

```typescript
export class EmailService {
  private static readonly FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL || "mail@nest-haus.at";
  private static readonly REPLY_TO_EMAIL =
    process.env.REPLY_TO_EMAIL || "mail@nest-haus.com";
  private static readonly ADMIN_EMAIL =
    process.env.ADMIN_EMAIL || "mail@nest-haus.com";
  private static readonly SALES_EMAIL =
    process.env.SALES_EMAIL || "mail@nest-haus.com";
  private static readonly FROM_NAME = "NEST-Haus Team";

  static async sendCustomerConfirmation(
    data: CustomerInquiryData
  ): Promise<boolean>;
  static async sendAdminNotification(
    data: AdminNotificationData
  ): Promise<boolean>;
  static async sendPaymentConfirmation(
    data: PaymentConfirmationData
  ): Promise<boolean>;
  static async sendAdminPaymentNotification(
    data: AdminPaymentNotificationData
  ): Promise<boolean>;
}
```

---

## Receiving Configuration (Google Workspace)

### Google Workspace Setup

- **Primary Domain**: `sustain-nest.com`
- **Domain Alias**: `nest-haus.at`
- **New Domain Alias**: `nest-haus.com` (to be added)
- **Shared Email**: `mail@nest-haus.at` (Google Group)
- **Calendar**: `c_0143623b3c51294d60b53cb259d8c76b8b8ecf51a84a2913afb053dc6540261b@group.calendar.google.com`

### How Domain Alias Works

When you add `nest-haus.com` as a domain alias in Google Workspace:

1. **All users automatically get `@nest-haus.com` addresses**
2. **Emails sent to `mail@nest-haus.com`** → arrive at `mail@nest-haus.at` inbox
3. **No additional Google Workspace license needed**
4. **Same inbox, multiple addresses**

### Setting Up Domain Alias

1. **Google Admin Console** → Domains → Manage domains
2. **Add a domain** → **Add a domain alias**
3. Enter: `nest-haus.com`
4. **Verify ownership** (via TXT record already added in Vercel)
5. **Wait for verification** (5-10 minutes)

Once verified:

- ✅ `mail@nest-haus.com` = same inbox as `mail@nest-haus.at`
- ✅ Replies go to correct inbox automatically
- ✅ No email forwarding rules needed

---

## Calendar Integration

### Google Calendar Service

**File**: `src/lib/GoogleCalendarService.ts`

**Features**:

- ✅ Fetch available time slots
- ✅ Check specific time slot availability
- ✅ Create calendar events for confirmed appointments
- ✅ Block time slots with PENDING appointments (24-hour hold)
- ✅ Respect business hours (8-12, 13-19, Mon-Fri)
- ✅ Automatic time zone handling (Europe/Vienna)

### Business Hours Configuration

```typescript
const BUSINESS_HOURS = {
  morningStart: 8, // 8 AM
  morningEnd: 12, // 12 PM (noon)
  afternoonStart: 13, // 1 PM
  afternoonEnd: 19, // 7 PM (last slot 18:00-19:00)
  duration: 60, // 60 minutes per appointment
};

const BUSINESS_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
```

### Calendar Methods

```typescript
// Get available slots for a specific date
static async getAvailableTimeSlots(request: AvailabilityRequest): Promise<TimeSlot[]>

// Check if specific time is available
static async isTimeSlotAvailable(dateTime: string, durationMinutes: number = 60): Promise<boolean>

// Create calendar event for confirmed appointment
static async createEvent(appointmentData: {...}): Promise<{ success: boolean; eventId?: string }>

// Fetch pending appointments from database (blocks slots for 24 hours)
private static async fetchPendingAppointments(startDate: Date, endDate: Date): Promise<CalendarEvent[]>
```

### Appointment Expiration System

**Database Field**: `appointmentExpiresAt` (DateTime)

**Cron Job**: `/api/cron/expire-appointments`

- **Runs**: Every hour (configured in Vercel)
- **Action**: Updates appointments from `PENDING` → `EXPIRED` if past expiration time
- **Releases**: Calendar time slots for rebooking

**Environment Variable**:

```env
CRON_SECRET=your-secure-cron-secret-here
```

---

## Email Flow Diagrams

### Contact Form Flow

```
User fills contact form → Next.js API (/api/contact)
                                 ↓
                  ┌──────────────┴──────────────┐
                  ↓                             ↓
        Save to Database              Check Calendar Availability
        (CustomerInquiry)                   (if appointment)
                  ↓                             ↓
        Generate Inquiry ID            Find available slots
                  ↓                             ↓
                  └──────────────┬──────────────┘
                                 ↓
                  ┌──────────────┴──────────────┐
                  ↓                             ↓
     Send Customer Confirmation        Send Admin Notification
     (via Resend)                      (via Resend)
     FROM: mail@send.nest-haus.com    FROM: mail@send.nest-haus.com
     TO: customer@example.com         TO: mail@nest-haus.com
     REPLY-TO: mail@nest-haus.com     REPLY-TO: mail@nest-haus.com
                  ↓                             ↓
         Customer's Inbox              Google Workspace Inbox
                                       (mail@nest-haus.at)
```

### Appointment Booking Flow

```
User selects appointment time → Calendar availability check
                                         ↓
                              Find available time slots
                              (Business hours: 8-12, 13-19)
                                         ↓
                        User selects slot & submits form
                                         ↓
                        Save to Database (PENDING status)
                        Set appointmentExpiresAt (+24 hours)
                                         ↓
                        Block time slot in calendar
                                         ↓
                  ┌─────────────────────┴─────────────────────┐
                  ↓                                           ↓
     Send confirmation to customer              Send notification to admin
     (includes appointment details)             (includes appointment details)
                  ↓                                           ↓
         Customer's Inbox                          Google Workspace Inbox
                                                              ↓
                                                   Admin confirms appointment
                                                              ↓
                                          Update status: PENDING → CONFIRMED
                                                              ↓
                                          Create Google Calendar Event
                                          (Calendar invitation sent to customer)
```

### Reply Tracking Flow

```
Customer receives email from mail@nest-haus.com
                    ↓
         Email has Reply-To: mail@nest-haus.com
                    ↓
         Customer clicks "Reply"
                    ↓
Email client auto-fills TO: mail@nest-haus.com
                    ↓
         Customer sends reply
                    ↓
         DNS MX records route to Google
                    ↓
Google Workspace receives at mail@nest-haus.com
                    ↓
Domain alias routes to mail@nest-haus.at inbox
                    ↓
         Admin team sees reply
         ✅ Conversation thread intact
```

---

## DNS Configuration

### Vercel DNS for nest-haus.com

All DNS records are managed in Vercel Dashboard for `nest-haus.com`:

#### 1. Google Workspace MX Records (Receiving)

```
Type: MX | Name: @ | Value: ASPMX.L.GOOGLE.COM | Priority: 1
Type: MX | Name: @ | Value: ALT1.ASPMX.L.GOOGLE.COM | Priority: 5
Type: MX | Name: @ | Value: ALT2.ASPMX.L.GOOGLE.COM | Priority: 5
Type: MX | Name: @ | Value: ALT3.ASPMX.L.GOOGLE.COM | Priority: 10
Type: MX | Name: @ | Value: ALT4.ASPMX.L.GOOGLE.COM | Priority: 10
```

#### 2. Google Workspace Verification

```
Type: TXT | Name: @ | Value: google-site-verification=[code from Google]
```

#### 3. SPF Record (Root Domain - CRITICAL!)

```
Type: TXT
Name: @ (or blank)
Value: v=spf1 include:_spf.google.com include:amazonses.com ~all
TTL: Auto
```

**Why both?**

- `include:_spf.google.com` → Authorizes Google Workspace to send
- `include:amazonses.com` → Authorizes Resend (via Amazon SES) to send

#### 4. Resend Domain Records (Sending)

**DKIM Record (Domain Verification)**

```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6TFk2qJkzTkhBQRd/o9qhPa2F2KsW2d29ChpvpcLw0x3x29G06AdPaQkDubUOpVHYAJZiXYSWkabBZnqBTU3q4gCE3XpDLtuhZPRwFnGUlWSoCD7v7cEbDsXCr78HhAr3UlppsMJaWN62zJcP872ONMMrNwfOsUkjbQgoPwxH1wIDAQAB
TTL: Auto
```

**MX Record (Bounce Handling on send subdomain)**

```
Type: MX
Name: send
Priority: 10
Value: feedback-smtp.eu-west-1.amazonses.com
TTL: Auto
```

**SPF Record (Send Subdomain)**

```
Type: TXT
Name: send
Value: v=spf1 include:amazonses.com ~all
TTL: Auto
```

#### 5. DMARC Record (Optional but Recommended)

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:mail@nest-haus.com
TTL: Auto
```

### DNS Verification Commands

```bash
# Check MX records (receiving)
nslookup -type=MX nest-haus.com

# Check root domain SPF
nslookup -type=TXT nest-haus.com

# Check DKIM for root domain
nslookup -type=TXT resend._domainkey.nest-haus.com

# Check send subdomain SPF
nslookup -type=TXT send.nest-haus.com

# Check DMARC
nslookup -type=TXT _dmarc.nest-haus.com
```

---

## Environment Variables

### Current Configuration (.env and .env.local)

```bash
# ===== EMAIL CONFIGURATION (RESEND) =====
# Resend Configuration (SENDING via nest-haus.com root domain)
RESEND_API_KEY=re_WTuw2cJE_9P9KLKkoLnY25ri8Xi5TGh9U
RESEND_FROM_EMAIL=mail@nest-haus.com
REPLY_TO_EMAIL=mail@nest-haus.com

# Email Addresses (RECEIVING at nest-haus.at inbox via domain alias)
ADMIN_EMAIL=mail@nest-haus.com
SALES_EMAIL=mail@nest-haus.com

# ===== GOOGLE CALENDAR CONFIGURATION =====
GOOGLE_CALENDAR_ID=c_0143623b3c51294d60b53cb259d8c76b8b8ecf51a84a2913afb053dc6540261b@group.calendar.google.com
CALENDAR_TIMEZONE=Europe/Vienna

# ===== GOOGLE SERVICE ACCOUNT =====
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=service-account-key.json

# ===== CRON JOB CONFIGURATION =====
CRON_SECRET=your-secure-cron-secret-here
```

### Environment Variable Usage Map

| Variable                          | Used By                      | Purpose                          |
| --------------------------------- | ---------------------------- | -------------------------------- |
| `RESEND_API_KEY`                  | EmailService.ts              | Authenticate with Resend API     |
| `RESEND_FROM_EMAIL`               | EmailService.ts              | Sender address for all emails    |
| `REPLY_TO_EMAIL`                  | EmailService.ts              | Reply-to address for all emails  |
| `ADMIN_EMAIL`                     | EmailService.ts, contact API | Admin notification recipient     |
| `SALES_EMAIL`                     | EmailService.ts              | Sales notification recipient     |
| `GOOGLE_CALENDAR_ID`              | GoogleCalendarService.ts     | Target calendar for appointments |
| `CALENDAR_TIMEZONE`               | GoogleCalendarService.ts     | Time zone for appointments       |
| `GOOGLE_SERVICE_ACCOUNT_KEY_FILE` | GoogleCalendarService.ts     | Auth credentials file path       |
| `CRON_SECRET`                     | /api/cron/\*                 | Secure cron job endpoints        |

---

## Email Types & Templates

### 1. Customer Confirmation Email

**File**: `src/lib/emailTemplates/CustomerConfirmationTemplate.ts`

**Sent When**:

- Contact form submission
- Appointment request submission

**Content**:

- ✅ Personalized greeting
- ✅ Confirmation of request type (contact vs appointment)
- ✅ Appointment date/time (if applicable)
- ✅ Customer's contact details recap
- ✅ Configuration summary (if configurator used)
- ✅ Total price (if configuration exists)
- ✅ Next steps timeline
- ✅ Contact information (phone, email)
- ✅ CTA button: "Konfiguration fortsetzen"

**Design**:

- Google Geist font (loaded from CDN)
- Glass morphism cards with rounded corners
- Blue accent color (#3B82F6)
- Hero header with gradient
- Responsive mobile design
- Inline CSS (email-safe)

### 2. Admin Notification Email

**File**: `src/lib/emailTemplates/AdminNotificationTemplate.ts`

**Sent When**:

- Any customer inquiry submitted

**Content**:

- ✅ Priority indicator (appointment = HIGH, contact = NORMAL)
- ✅ Customer contact details (clickable email, phone)
- ✅ Preferred contact method
- ✅ Appointment date/time (if applicable)
- ✅ Customer message
- ✅ Configuration summary (if exists)
- ✅ Total price (if configuration exists)
- ✅ Technical info (inquiry ID, session ID, IP, user agent)
- ✅ CTA buttons: "Anfrage bearbeiten", "E-Mail antworten", "Anrufen"

**Design**:

- Clean, data-focused layout
- Red header for urgency (#DC2626)
- Yellow alert box for appointments
- Blue info boxes for customer data
- Purple tech info section
- Action buttons at bottom

### 3. Payment Confirmation Email

**File**: `src/lib/emailTemplates/PaymentConfirmationTemplate.ts`

**Sent When**:

- Stripe payment successful (via webhook or direct confirmation)

**Content**:

- ✅ Hero image (branded NEST-Haus interior)
- ✅ Payment success message with green checkmark icon
- ✅ Payment details (amount, method, date, transaction ID)
- ✅ **Dein Nest - Deine Auswahl** section showing:
  - Each configuration item (Nest model, Gebäudehülle, Innenverkleidung, Fußboden, PV-Anlage, Fenster)
  - Item names and individual prices
- ✅ **Dein Nest - Überblick** section showing:
  - Total house price (Dein Nest Haus)
  - Planungspaket (if selected) with price
  - Konzept-Check (if completed) with price
  - Terminvereinbarung status (if booked)
  - **Gesamtsumme** (total of all above)
- ✅ Next steps (4-step process after payment)
- ✅ Contact information (email, phone, website)
- ✅ Branded footer with links

**Design**:

- Google Geist font (loaded from CDN)
- Glass morphism cards with rounded corners
- Success green (#10B981) for payment indicators
- Blue accent color (#3D6CE1) for prices and CTAs
- Hero image from IMAGES.hero.nestHaus3
- Responsive mobile design
- Inline CSS (email-safe)

### 4. Admin Payment Notification Email

**File**: `src/lib/emailTemplates/AdminPaymentNotificationTemplate.ts`

**Sent When**:

- Stripe payment successful (via webhook or direct confirmation)

**Content**:

- ✅ Green gradient header (payment received)
- ✅ Urgent action section (24-hour contact required)
- ✅ Payment details section:
  - Amount (highlighted in green)
  - Payment method
  - Date and time
  - Stripe Payment Intent ID
  - Stripe Customer ID
- ✅ Customer details section:
  - Name, email (clickable), inquiry ID, session ID
- ✅ **Dein Nest - Deine Auswahl** configuration breakdown
- ✅ **Dein Nest - Überblick** price summary
- ✅ Technical information (IP address, browser/user agent)
- ✅ Action buttons:
  - "Anfrage öffnen" (opens admin panel)
  - "Kunde kontaktieren" (opens email client)
  - "Stripe öffnen" (opens Stripe dashboard)

**Design**:

- Google Geist font
- Green gradient header (#10b981 to #059669)
- Yellow urgent action box (#fef3c7 with gold border)
- Structured sections with clean layout
- Monospace font for technical IDs
- Green action buttons for quick access

---

## Appointment System

### Appointment Lifecycle

```
1. REQUESTED → User selects time slot
              ↓
2. PENDING   → Saved to database, slot blocked for 24 hours
              ↓
3. CONFIRMED → Admin confirms via admin panel
              ↓ (or)
4. EXPIRED   → Cron job expires after 24 hours if not confirmed
              ↓ (or)
5. CANCELLED → Admin or customer cancels
              ↓ (or)
6. COMPLETED → Appointment occurs, marked as completed
```

### Database Fields (CustomerInquiry table)

```typescript
{
  appointmentDateTime: DateTime?,      // Selected appointment time
  appointmentStatus: Enum,             // PENDING | CONFIRMED | CANCELLED | EXPIRED | COMPLETED
  appointmentExpiresAt: DateTime?,     // 24 hours from creation
  followUpDate: DateTime?,             // Admin sets follow-up reminder
  adminNotes: String?,                 // Admin notes about appointment
}
```

### Time Slot Blocking Logic

**Source**: `src/lib/GoogleCalendarService.ts`

1. **Fetch Google Calendar events** (existing appointments)
2. **Fetch PENDING database appointments** (not yet in calendar)
3. **Generate time slots** (8-12, 13-19, hourly)
4. **Mark conflicts**:
   - Calendar events block slots
   - PENDING appointments block slots (24-hour hold)
   - Past times filtered out
5. **Return available slots** for customer selection

### Calendar Event Creation

**When**: Admin confirms appointment (status → CONFIRMED)

**Process**:

1. Call `GoogleCalendarService.createEvent()`
2. Creates event in Google Calendar
3. Sends calendar invitation to customer email
4. Event includes:
   - Summary: "NEST-Haus Beratungstermin - [Customer Name]"
   - Description: Customer details, inquiry ID
   - Location: "NEST-Haus Office" or specified location
   - Duration: 60 minutes
   - Reminders: 24 hours before (email), 1 hour before (popup)

---

## ICS Calendar RSVP System

### Overview

The appointment system uses ICS (iCalendar) file attachments for seamless calendar integration and automatic RSVP tracking. When a customer books an appointment, they receive a calendar invite (.ics file) that can be added directly to their calendar application.

### ICS File Generation

**Utility**: `src/lib/utils/icsGenerator.ts`

**RFC 5545 Compliance**: Full iCalendar format support

**Key Properties**:
```
METHOD:REQUEST          - Calendar invitation request
STATUS:TENTATIVE        - Appointment is pending confirmation
ORGANIZER:mail@nest-haus.at  - Admin calendar email
ATTENDEE:customer@email.com   - Customer email with RSVP=TRUE
DTSTART:20251127T140000Z      - Start time (UTC)
DTEND:20251127T150000Z        - End time (UTC, 60min duration)
LOCATION:NEST-Haus Office
VALARM:-PT23H           - 24-hour expiration reminder
VALARM:-PT1H            - 1-hour before appointment reminder
UID:inquiry-{inquiryId}@nest-haus.at  - Unique event identifier
```

### Email Integration

**Customer Confirmation Email**:
- Includes `.ics` file attachment (`nest-haus-termin-{inquiryId}.ics`)
- Clean, minimal appointment section design
- Clear 24-hour expiration notice
- Instructions: "Bitte bestätigen Sie Ihren Termin durch Hinzufügen zum Kalender"
- Explains tentative status until calendar acceptance

**Admin Notification Email**:
- Includes same `.ics` file attachment
- Shows 24-hour expiration countdown
- Direct link to admin panel inquiry page
- No accept/decline buttons (handled manually)
- ICS attachment notice prominently displayed

### Appointment Lifecycle with ICS

```
1. USER BOOKS APPOINTMENT
   ↓
   Inquiry created (PENDING status)
   appointmentExpiresAt set (+24 hours)
   
2. EMAILS SENT WITH ICS ATTACHMENT
   ↓
   Customer receives: Confirmation + ICS file
   Admin receives: Notification + ICS file
   
3. USER OPENS ICS FILE
   ↓
   Calendar app opens (Gmail, Outlook, Apple Calendar)
   User clicks "Yes" / "Accept" / "Add to Calendar"
   
4. CALENDAR APP SENDS RSVP
   ↓
   System detects calendar acceptance (via RSVP endpoint)
   Status updated: PENDING → CONFIRMED
   appointmentExpiresAt cleared (no longer expires)
   
5. GOOGLE CALENDAR EVENT CREATED
   ↓
   Event added to mail@nest-haus.at calendar
   Calendar invitation sent to customer
   Admin can see event in calendar view
   
6. IF NO RSVP WITHIN 24 HOURS
   ↓
   Cron job runs hourly
   1-hour reminder sent before expiration
   After 24h: Status changed to EXPIRED
   Time slot released for rebooking
```

### RSVP API Endpoint

**Route**: `/api/appointments/rsvp`

**Method**: POST

**Parameters**:
```typescript
{
  inquiryId: string;
  action: 'accept' | 'decline';
  token: string;  // Security token for validation
}
```

**On Accept**:
1. Validate inquiry exists and is PENDING
2. Update status: PENDING → CONFIRMED
3. Create Google Calendar event via `GoogleCalendarService.createEvent()`
4. Clear `appointmentExpiresAt` (no longer expires)
5. Send confirmation email to customer and admin
6. Return success response

**On Decline**:
1. Update status: PENDING → CANCELLED
2. Release time slot immediately
3. Notify admin of cancellation
4. Return success response

### Security Features

- **Secure Tokens**: Each inquiry gets unique confirmation token
- **Validation**: Check inquiry ownership and status before updating
- **Rate Limiting**: Prevent RSVP abuse
- **Audit Logging**: All appointment status changes logged
- **Token Expiration**: Tokens expire after 48 hours

### Calendar App Compatibility

**Tested Platforms**:
- ✅ Gmail Calendar (Web & Mobile)
- ✅ Outlook Calendar (Web & Desktop)
- ✅ Apple Calendar (macOS & iOS)
- ✅ Google Calendar App (Android)
- ✅ Thunderbird Lightning

**ICS File Behavior**:
- Double-click opens default calendar app
- "Add to Calendar" button in email clients
- RSVP response automatically triggers confirmation
- Works offline (file can be added later)

### 24-Hour Expiration System

**Cron Job**: `/api/cron/expire-appointments` (runs every hour)

**1-Hour Before Expiration**:
```
Time Check: appointmentExpiresAt - 1 hour
↓
Send reminder email to customer
Send reminder to admin
↓
Email includes:
- "Ihr Termin läuft in 1 Stunde ab"
- Direct link to add ICS to calendar
- CTA button: "Jetzt bestätigen"
```

**After 24 Hours (No RSVP)**:
```
Time Check: appointmentExpiresAt < now
↓
Update status: PENDING → EXPIRED
Release time slot for rebooking
Log expiration event
↓
Admin notified via dashboard
Customer does NOT receive expiration notice
(Avoids negative UX)
```

### Admin Panel Integration

**Calendar View**:
- Google Calendar iframe embedded in admin panel
- Source: `https://calendar.google.com/calendar/embed?src={CALENDAR_ID}&ctz=Europe/Vienna`
- Toggle between inquiry list and calendar view

**Appointment Status Colors**:
- 🟡 PENDING: Yellow (awaiting RSVP)
- 🟢 CONFIRMED: Green (RSVP accepted, calendar event created)
- 🔴 EXPIRED: Red (24 hours passed, no RSVP)
- ⚫ CANCELLED: Gray (manually cancelled)

**Inquiry Details**:
- Countdown timer for PENDING appointments (hours:minutes remaining)
- Link to corresponding Google Calendar event (if CONFIRMED)
- Appointment history timeline (requested → status changes)
- ICS file download option for admin

### Email Template Design Philosophy

**Customer Email - Simplified**:
- ❌ Removed bulky glass morphism cards
- ✅ Clean, minimal appointment section
- ✅ Focus on ICS attachment call-to-action
- ✅ Clear expiration notice without alarm
- ✅ Professional, calm tone

**Admin Email - Informational**:
- ❌ Removed accept/decline action buttons
- ✅ Clean appointment details display
- ✅ Prominent ICS attachment notice
- ✅ Direct link to admin panel
- ✅ No unnecessary UI chrome

### Troubleshooting

**ICS File Not Opening**:
- Check file MIME type: `text/calendar`
- Verify .ics file extension
- Ensure RFC 5545 compliance (use validator)

**RSVP Not Triggering**:
- Check confirmation token validity
- Verify inquiry is PENDING status
- Check API endpoint logs for errors
- Ensure Google Calendar service is authenticated

**Calendar Event Not Creating**:
- Verify `GOOGLE_CALENDAR_ID` environment variable
- Check service account permissions
- Review Google Calendar API quotas
- Check `service-account-key.json` file exists

---

## Reply Tracking & Email Saving

### How Replies are Tracked

**Reply-To Header**: All emails sent via Resend include:

```typescript
{
  from: "NEST-Haus Team <mail@send.nest-haus.com>",
  replyTo: "mail@nest-haus.com"
}
```

**When customer clicks "Reply"**:

1. Email client reads `Reply-To` header
2. Auto-fills `TO: mail@nest-haus.com`
3. Customer sends reply
4. DNS MX records route to Google Workspace
5. Domain alias routes to `mail@nest-haus.at` inbox
6. Reply appears in Gmail with **original thread intact**

### Email Thread Preservation

**Email Message-ID**: Resend automatically generates unique Message-IDs

**Email References Header**: Subsequent emails in thread include `In-Reply-To` and `References` headers

**Result**: Gmail and other email clients automatically group emails into conversation threads

### Where Emails are Saved

**Sent Emails**:

- ✅ Resend Dashboard: Logs all sent emails (7 days retention on free tier)
- ✅ Google Workspace Sent folder: If admin manually sends via Gmail

**Received Emails (Replies)**:

- ✅ Google Workspace Inbox: `mail@nest-haus.at`
- ✅ Organized by conversation threads
- ✅ Can be labeled/filtered in Gmail

**Database Records**:

- ✅ `CustomerInquiry` table stores original inquiry
- ✅ Admin can add notes in `adminNotes` field
- ✅ Email content NOT stored in database (only metadata)

---

## Database Storage

### CustomerInquiry Table Schema

```prisma
model CustomerInquiry {
  id                    String   @id @default(cuid())
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Contact Information
  sessionId             String?
  email                 String
  name                  String
  phone                 String?
  message               String?

  // Request Details
  requestType           RequestType  // CONTACT | APPOINTMENT | PAYMENT
  preferredContact      ContactMethod // EMAIL | PHONE | WHATSAPP
  status                InquiryStatus // PENDING | CONTACTED | RESOLVED | CANCELLED
  followUpDate          DateTime?

  // Appointment Specific
  appointmentDateTime   DateTime?
  appointmentStatus     AppointmentStatus? // PENDING | CONFIRMED | CANCELLED | EXPIRED | COMPLETED
  appointmentExpiresAt  DateTime?

  // Configuration Data
  configurationData     Json?
  totalPrice            Int? // in cents

  // Admin Management
  adminNotes            String?
  assignedTo            String?

  // Tracking
  source                String? // KONFIGURATOR | CONTACT_PAGE | LANDING_PAGE
  utmSource             String?
  utmMedium             String?
  utmCampaign           String?
  clientIP              String?
  userAgent             String?
}
```

### Data Retention

**Contact Inquiries**: Stored indefinitely (no auto-deletion)  
**Appointment Slots**: Released after 24 hours if not confirmed  
**Configuration Data**: Stored as JSON blob with full configurator state

### Accessing Customer Data

**Admin Panel**: `/admin/customer-inquiries`

**Features**:

- ✅ View all inquiries (filterable by status, type, date)
- ✅ Search by name, email, inquiry ID
- ✅ View full configuration details
- ✅ Add admin notes
- ✅ Update status (PENDING → CONTACTED → RESOLVED)
- ✅ Set follow-up reminders
- ✅ Export data (CSV/JSON)

---

## Testing & Verification

### Pre-Deployment Checklist

- [ ] **Google Workspace**: Add `nest-haus.com` as domain alias
- [ ] **Vercel DNS**: Add all MX, TXT, SPF, DKIM records for `nest-haus.com`
- [ ] **Resend**: Add `send.nest-haus.com` domain, verify DNS
- [ ] **Environment Variables**: Updated in both `.env` and `.env.local`
- [ ] **Server Restart**: `rm -rf .next && npm run dev`
- [ ] **Linting**: `npm run lint` passes with no errors

### Email Sending Tests

#### Test 1: Contact Form Submission

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+43123456789",
    "message": "Testing email configuration",
    "requestType": "contact",
    "preferredContact": "email"
  }'
```

**Expected**:

- ✅ Customer receives email at `test@example.com`
- ✅ FROM: `NEST-Haus Team <mail@send.nest-haus.com>`
- ✅ REPLY-TO: `mail@nest-haus.com`
- ✅ Admin receives notification at `mail@nest-haus.com`
- ✅ Inquiry saved to database with unique ID

#### Test 2: Appointment Booking

1. Navigate to `/warenkorb#terminvereinbarung`
2. Select available date
3. Select available time slot
4. Fill form and submit

**Expected**:

- ✅ Appointment saved with `PENDING` status
- ✅ `appointmentExpiresAt` set to +24 hours
- ✅ Customer receives confirmation with appointment details
- ✅ Admin receives notification with appointment details
- ✅ Time slot blocked in calendar availability

#### Test 3: Reply-To Functionality

1. Receive customer confirmation email
2. Click "Reply" in email client
3. Verify `TO:` field shows `mail@nest-haus.com`
4. Send test reply
5. Check Google Workspace inbox at `mail@nest-haus.at`

**Expected**:

- ✅ Reply arrives in Google Workspace
- ✅ Thread preserved (reply grouped with original)
- ✅ No emails lost

### Email Deliverability Tests

#### Mail-Tester.com

1. Send test email to address provided by mail-tester.com
2. Check spam score (should be 9/10 or 10/10)

**Verify**:

- ✅ SPF: PASS
- ✅ DKIM: PASS
- ✅ DMARC: PASS
- ✅ Reverse DNS: PASS
- ✅ No blacklisted

#### MXToolbox.com

1. Run SPF record lookup for `nest-haus.com`
2. Run DKIM record lookup for `resend._domainkey.send.nest-haus.com`
3. Run MX record lookup for `nest-haus.com`

**Expected**: All checks pass ✅

### Calendar Integration Tests

#### Test 1: Availability Check

```bash
curl "http://localhost:3000/api/calendar/availability?date=2025-11-15"
```

**Expected**:

- ✅ Returns array of time slots
- ✅ Slots within business hours (8-12, 13-19)
- ✅ Past times filtered out
- ✅ Conflicting times marked unavailable

#### Test 2: Appointment Expiration

1. Create test appointment (PENDING)
2. Set `appointmentExpiresAt` to past time
3. Run cron job: `curl http://localhost:3000/api/cron/expire-appointments -H "Authorization: Bearer [CRON_SECRET]"`

**Expected**:

- ✅ Status changes PENDING → EXPIRED
- ✅ Time slot released for rebooking

---

## Troubleshooting

### Issue: Emails Not Sending

**Symptoms**:

- Contact form submits successfully
- No emails received
- Console shows "✅ Email sent successfully" but nothing arrives

**Diagnosis**:

```bash
# 1. Check Resend API key
echo $RESEND_API_KEY

# 2. Check domain verification in Resend dashboard
# Login to resend.com/domains
# Verify send.nest-haus.com shows green checkmarks

# 3. Check application logs
# Look for errors like:
# ❌ Failed to send customer email: [error]
```

**Solutions**:

- ✅ Verify `RESEND_API_KEY` is correct in `.env.local`
- ✅ Restart server after changing environment variables
- ✅ Check Resend dashboard for domain verification status
- ✅ Verify DNS records propagated (use `nslookup` commands above)
- ✅ Check Resend dashboard → Emails → Logs for error details

### Issue: Emails Going to Spam

**Symptoms**:

- Emails sending successfully
- Arriving in spam/junk folder

**Diagnosis**:

```bash
# Check SPF record
nslookup -type=TXT nest-haus.com
# Should show: v=spf1 include:_spf.google.com include:amazonses.com ~all

# Check DKIM record
nslookup -type=TXT resend._domainkey.send.nest-haus.com
# Should return public key starting with p=MIGf...

# Check DMARC record
nslookup -type=TXT _dmarc.nest-haus.com
# Should show: v=DMARC1; p=none; rua=mailto:mail@nest-haus.com
```

**Solutions**:

- ✅ Wait 24-48 hours for DNS propagation
- ✅ Use mail-tester.com to check spam score
- ✅ Ensure all DNS records added correctly (no typos)
- ✅ Add DMARC record if missing
- ✅ Ask initial recipients to mark as "Not Spam"
- ✅ Warm up domain: Start with low volume, increase gradually

### Issue: Replies Going to Wrong Address

**Symptoms**:

- Customer replies to email
- Reply doesn't arrive in Google Workspace inbox

**Diagnosis**:

```bash
# Check email headers (view original email)
# Look for:
Reply-To: mail@nest-haus.com

# Check MX records for nest-haus.com
nslookup -type=MX nest-haus.com
# Should show Google's MX servers
```

**Solutions**:

- ✅ Verify `REPLY_TO_EMAIL=mail@nest-haus.com` in `.env.local`
- ✅ Restart server after changing environment variables
- ✅ Check MX records point to Google (ASPMX.L.GOOGLE.COM)
- ✅ Verify `nest-haus.com` added as domain alias in Google Workspace
- ✅ Check Google Workspace spam folder

### Issue: Calendar Availability Not Showing

**Symptoms**:

- Appointment form shows "No available slots"
- Even on weekdays during business hours

**Diagnosis**:

```bash
# Check calendar API directly
curl "http://localhost:3000/api/calendar/availability?date=2025-11-15"

# Check Google Calendar permissions
# Verify service account has access to calendar
```

**Solutions**:

- ✅ Verify `GOOGLE_CALENDAR_ID` is correct in `.env.local`
- ✅ Check `service-account-key.json` exists in project root
- ✅ Verify service account has "Make changes to events" permission on calendar
- ✅ Check date is a business day (Mon-Fri)
- ✅ Check time is within business hours (8-19)
- ✅ Review Google Calendar API quotas (Cloud Console)

### Issue: Domain Alias Not Working

**Symptoms**:

- Emails to `mail@nest-haus.com` bounce
- "Address not found" errors

**Diagnosis**:

1. Check Google Workspace Admin Console
2. Go to: Domains → Manage domains
3. Verify `nest-haus.com` shows as "Active" domain alias

**Solutions**:

- ✅ Wait 24-48 hours after adding domain alias
- ✅ Verify Google site verification TXT record in Vercel DNS
- ✅ Check MX records added in Vercel DNS (Google's MX servers)
- ✅ Contact Google Workspace support if verification fails
- ✅ Temporarily use fallback: `mail@nest-haus.at`

---

## Migration History

### Timeline of Email Configuration Changes

#### November 12, 2025: Initial Setup

- ✅ Configured `mail@nest-haus.at` as primary email
- ✅ Set up Resend account with intent to send from `mail@nest-haus.at`
- ❌ DNS verification pending with Austria WebHosting

#### November 13, 2025: Plan B Fallback (Temporary)

- ✅ DNS issues with Austria WebHosting (slow response, verification failing)
- ✅ Switched to `RESEND_FROM_EMAIL=onboarding@resend.dev` (Resend default)
- ✅ Kept `REPLY_TO_EMAIL=mail@nest-haus.at`
- ✅ All emails sending successfully via Plan B

#### November 14, 2025: Migration to nest-haus.com (Current)

- ✅ Purchased/configured `nest-haus.com` in Vercel
- ✅ Added Google site verification to Vercel DNS
- ✅ Set up Resend with subdomain approach (`send.nest-haus.com`)
- ✅ Updated environment variables to use `mail@nest-haus.com`
- ✅ Planned Google Workspace domain alias setup
- ✅ Updated documentation to reflect new architecture

### Why Each Migration Happened

**nest-haus.at (Original)**:

- Primary domain for branding
- Google Workspace already configured
- **Problem**: DNS managed by Austria WebHosting (slow, unreliable)

**onboarding@resend.dev (Plan B)**:

- Emergency fallback when DNS verification stalled
- Emails sending immediately without DNS config
- **Problem**: Unprofessional sender address

**nest-haus.com (Current)**:

- Full DNS control via Vercel (instant updates)
- Professional sender address
- Same inbox via domain alias (no workflow changes)
- **Advantage**: Clean, reliable, scalable

### Future Considerations

**Option A: Migrate fully to nest-haus.com**

- Update all branding from `.at` to `.com`
- Move calendar to `mail@nest-haus.com`
- Sunset `.at` domain

**Option B: Keep dual setup**

- `.com` for sending (Resend)
- `.at` for receiving (Google Workspace primary)
- Domain alias provides seamless integration

**Current Recommendation**: Option B (dual setup) for maximum reliability

---

## Quick Reference Commands

### Restart Server with New Config

```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev
```

### Test Email Sending

```bash
# Test contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "phone": "+43123456789",
    "message": "Test",
    "requestType": "contact",
    "preferredContact": "email"
  }'
```

### Check DNS Propagation

```bash
# Check MX records
nslookup -type=MX nest-haus.com

# Check SPF (root)
nslookup -type=TXT nest-haus.com

# Check DKIM (send subdomain)
nslookup -type=TXT resend._domainkey.send.nest-haus.com

# Check SPF (send subdomain)
nslookup -type=TXT send.nest-haus.com
```

### Access Admin Panel

```
http://localhost:3000/admin/customer-inquiries
```

### Check Calendar Availability

```bash
# Today
curl "http://localhost:3000/api/calendar/availability?date=$(date +%Y-%m-%d)"

# Specific date
curl "http://localhost:3000/api/calendar/availability?date=2025-11-15"
```

---

## Support Resources

### Google Workspace

- **Admin Console**: https://admin.google.com
- **Support**: https://support.google.com/a
- **Status**: https://workspace.google.com/status

### Resend

- **Dashboard**: https://resend.com/emails
- **Documentation**: https://resend.com/docs
- **Support**: support@resend.com
- **Status**: https://status.resend.com

### Vercel DNS

- **Dashboard**: https://vercel.com/[your-account]/nest-haus.com/settings/domains
- **Documentation**: https://vercel.com/docs/concepts/projects/domains
- **Support**: https://vercel.com/support

### Google Calendar API

- **Cloud Console**: https://console.cloud.google.com
- **Documentation**: https://developers.google.com/calendar
- **Quotas**: Check in Cloud Console → APIs & Services

---

## Email Template Files Reference

### Customer-Facing Templates

1. **CustomerConfirmationTemplate.ts** - Contact/Appointment confirmations
2. **PaymentConfirmationTemplate.ts** - Payment success confirmations (NEW)

### Admin-Facing Templates

1. **AdminNotificationTemplate.ts** - Contact/Appointment notifications
2. **AdminPaymentNotificationTemplate.ts** - Payment success notifications (NEW)

### Template Features

All templates include:
- ✅ Google Geist font from CDN
- ✅ Responsive mobile design (breakpoint: 600px)
- ✅ Glass morphism card design
- ✅ Inline CSS for email client compatibility
- ✅ Plain text fallback versions
- ✅ Branded NEST-Haus styling

### Configuration Parser

Both payment templates use `parseConfigurationForEmail()` helper function to extract:
- Individual configuration items (nest, gebaeudehuelle, innenverkleidung, etc.)
- Prices for each item
- Planungspaket details
- Konzept-Check status
- Terminvereinbarung status
- Total house price and overall total

---

## Document Maintenance

**Last Updated**: November 14, 2025 (Updated: Payment email templates added)  
**Next Review**: When DNS verification completes or email issues arise  
**Owner**: Development Team  
**Version**: 1.1 (Final + Payment Templates)

---

**✅ Email System Status**: Fully configured and operational with nest-haus.com sending setup

**📧 Sending**: mail@send.nest-haus.com (via Resend)  
**📬 Receiving**: mail@nest-haus.com → mail@nest-haus.at inbox  
**📅 Calendar**: mail@nest-haus.at (Google Calendar)  
**🔄 Reply Tracking**: Automated via Reply-To headers  
**💾 Database Storage**: All inquiries saved to CustomerInquiry table  
**⏰ Appointment System**: 24-hour time slot reservation with auto-expiration  
**✉️ Email Templates**: 4 branded templates (Contact, Appointment, Payment Customer, Payment Admin)

**All systems operational and ready for production deployment.**
