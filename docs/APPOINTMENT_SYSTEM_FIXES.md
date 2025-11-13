# Appointment Booking System - Fixes & Enhancements ✅

**Date**: November 13, 2025  
**Status**: ✅ Complete - Ready for Testing

---

## 🐛 Issues Fixed

### ✅ 1. **Same-Day Booking Prevention**

**Issue**: Users could book appointments for past hours on the same day

**Fix**: Updated `AppointmentBooking.tsx` calendar logic:

```typescript
// Block today and past dates - only allow booking from tomorrow onwards
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);
const isPast = date < tomorrow;
```

**Result**: Users can now only book appointments starting from **tomorrow onwards**, never today.

---

### ✅ 2. **Appointment Validation Error**

**Issue**: API returned "Ungültige Daten" (Invalid Data) error

**Fix**: Removed strict `.datetime()` validation from Zod schema:

```typescript
// Before: appointmentDateTime: z.string().datetime().optional().nullable()
// After:  appointmentDateTime: z.string().optional().nullable()
```

**Result**: Appointment submissions now work correctly.

---

### ✅ 3. **24-Hour Reservation System**

**Issue**: Multiple users could book the same time slot

**Fix**: Implemented PENDING status with 24h timeout:

#### Database Schema Changes:

```prisma
model CustomerInquiry {
  // New fields added:
  requestType           String?       // 'contact' or 'appointment'
  appointmentDateTime   DateTime?     // Requested appointment date/time
  appointmentStatus     AppointmentStatus @default(PENDING)
  appointmentConfirmedAt DateTime?    // When admin confirmed
  appointmentExpiresAt  DateTime?     // 24h timeout
  calendarEventId       String?       // Google Calendar event ID
}

enum AppointmentStatus {
  PENDING       // Awaiting admin confirmation (24h hold)
  CONFIRMED     // Admin confirmed via RSVP
  CANCELLED     // Admin or customer cancelled
  EXPIRED       // 24h timeout passed without confirmation
}
```

#### How It Works:

1. **User books appointment** → Status: `PENDING`
2. **Time slot blocked** for 24 hours (`appointmentExpiresAt`)
3. **Admin confirms** → Status: `CONFIRMED`, calendar event created
4. **Admin rejects** → Status: `CANCELLED`, slot released
5. **24h timeout** → Status: `EXPIRED`, slot released automatically

---

## 🎯 New Features Added

### 1. **PENDING Appointment Blocking**

**File**: `src/lib/GoogleCalendarService.ts`

Added `fetchPendingAppointments()` method that:

- Queries database for `PENDING` appointments
- Checks `appointmentExpiresAt` hasn't passed
- Marks corresponding time slots as unavailable

```typescript
// Also check for PENDING appointments in database that are blocking time slots
const pendingAppointments = await this.fetchPendingAppointments(
  dayStart,
  dayEnd
);

// Mark slots blocked by PENDING appointments (24h reservation)
for (const appointment of pendingAppointments) {
  // ... mark slots unavailable
}
```

---

### 2. **Admin Confirmation API**

**File**: `src/app/api/admin/appointments/[id]/route.ts`

**Endpoint**: `POST /api/admin/appointments/:id`

**Actions**:

- `confirm` - Confirms appointment, creates Google Calendar event
- `reject` - Cancels appointment, releases time slot

**Example Request**:

```bash
curl -X POST http://localhost:3000/api/admin/appointments/clq123abc \
  -H "Content-Type: application/json" \
  -d '{"action": "confirm"}'
```

**Response** (confirm):

```json
{
  "success": true,
  "message": "Termin bestätigt und Kalendereinladung gesendet",
  "calendarEventId": "abc123..."
}
```

---

### 3. **Automatic Expiration Cron Job**

**File**: `src/app/api/cron/expire-appointments/route.ts`

**Endpoint**: `GET /api/cron/expire-appointments`

**What It Does**:

- Runs every hour (configured in `vercel.json`)
- Finds all `PENDING` appointments past `appointmentExpiresAt`
- Updates status to `EXPIRED`
- Releases time slots for other users

**Vercel Configuration** (`vercel.json`):

```json
{
  "crons": [
    {
      "path": "/api/cron/expire-appointments",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Security**: Uses `CRON_SECRET` environment variable for authorization

**Manual Trigger** (for testing):

```bash
curl -H "Authorization: Bearer your-secure-cron-secret-here" \
  http://localhost:3000/api/cron/expire-appointments
```

---

## 📊 Appointment Flow Diagram

```
┌─────────────────────┐
│ User Books Appoint. │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│ Status: PENDING                 │
│ Expires: +24h                   │
│ Slot: BLOCKED for others        │
└──────────┬──────────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌───────┐     ┌────────┐
│CONFIRM│     │REJECT  │
└───┬───┘     └───┬────┘
    │             │
    ▼             ▼
┌─────────┐   ┌──────────┐
│CONFIRMED│   │CANCELLED │
│+ Calendar│  │Slot FREE │
└─────────┘   └──────────┘

After 24h timeout:
           │
           ▼
      ┌─────────┐
      │ EXPIRED │
      │Slot FREE│
      └─────────┘
```

---

## 🧪 Testing Checklist

### ✅ Same-Day Booking Prevention

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to appointment booking
http://localhost:3000/warenkorb#terminvereinbarung

# 3. Test calendar:
- [ ] Today's date is grayed out (not clickable)
- [ ] Tomorrow and future dates are selectable
- [ ] Weekends (Sat/Sun) are grayed out
```

### ✅ PENDING Slot Blocking

```bash
# 1. Book an appointment for tomorrow at 10:00
# 2. Open appointment booking again (different browser/incognito)
# 3. Select same date
# Expected: 10:00 slot is NOT available
```

### ✅ Admin Confirmation

```bash
# 1. Book an appointment
# 2. Check admin panel
http://localhost:3000/admin/customer-inquiries

# 3. Find the appointment, copy its ID
# 4. Confirm via API:
curl -X POST http://localhost:3000/api/admin/appointments/YOUR_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"action": "confirm"}'

# 5. Check Google Calendar - event should appear
# 6. Re-check appointment booking - slot should still be blocked (CONFIRMED)
```

### ✅ 24h Expiration

```bash
# Option A: Wait 24 hours (not practical)

# Option B: Manually test expiration
# 1. Book appointment
# 2. Manually update database:
npx prisma studio
# Navigate to CustomerInquiry
# Find appointment, set appointmentExpiresAt to past date

# 3. Trigger cron manually:
curl -H "Authorization: Bearer your-secure-cron-secret-here" \
  http://localhost:3000/api/cron/expire-appointments

# 4. Check response - should show 1 expired
# 5. Re-check appointment booking - slot should be available again
```

---

## 📝 Files Modified

1. ✅ `src/components/sections/AppointmentBooking.tsx` - Same-day prevention
2. ✅ `src/app/api/contact/route.ts` - Appointment data saving, validation fix
3. ✅ `src/lib/GoogleCalendarService.ts` - PENDING appointment blocking
4. ✅ `prisma/schema.prisma` - New appointment fields & status enum
5. ✅ `.env` & `.env.local` - Added `CRON_SECRET`

---

## 📁 Files Created

1. ✅ `src/app/api/admin/appointments/[id]/route.ts` - Confirm/reject endpoint
2. ✅ `src/app/api/cron/expire-appointments/route.ts` - Auto-expiration cron
3. ✅ `vercel.json` - Cron job configuration

---

## ⚙️ Environment Variables

Add to `.env` and Vercel dashboard:

```env
# Google Calendar
GOOGLE_CALENDAR_ID=c_0143623b3c51294d60b53cb259d8c76b8b8ecf51a84a2913afb053dc6540261b@group.calendar.google.com
CALENDAR_TIMEZONE=Europe/Vienna

# Cron Job Security
CRON_SECRET=your-secure-cron-secret-here  # Generate with: openssl rand -base64 32
```

---

## 🚀 Deployment Steps

### 1. **Generate Cron Secret**

```bash
openssl rand -base64 32
```

### 2. **Update Vercel Environment Variables**

```bash
# In Vercel Dashboard:
# Settings → Environment Variables → Add:
CRON_SECRET=<generated-secret>
```

### 3. **Deploy**

```bash
git add .
git commit -m "feat: appointment booking fixes - same-day prevention, PENDING system, 24h expiration"
git push origin main
```

### 4. **Verify Cron Job**

After deployment, check Vercel Dashboard → Cron Jobs tab:

- Should show: `/api/cron/expire-appointments` running hourly

---

## 🎯 How It Works (User Perspective)

1. **User visits appointment page** → Sees available slots (tomorrow onwards)
2. **User selects date/time** → Slot is reserved for 24 hours (`PENDING`)
3. **Other users** → See this slot as unavailable
4. **Admin receives email** → "Neue Terminanfrage"
5. **Admin confirms** (within 24h) → Slot permanently blocked, calendar invite sent
6. **OR: Admin rejects** → Slot immediately available again
7. **OR: 24h passes** → Slot automatically expires and becomes available

---

## 📧 Admin Actions Needed

To confirm/reject appointments, admin can either:

**Option A: Via API** (recommended for automation):

```bash
# Confirm
curl -X POST https://nest-haus.at/api/admin/appointments/INQUIRY_ID \
  -H "Content-Type: application/json" \
  -d '{"action": "confirm"}'

# Reject
curl -X POST https://nest-haus.at/api/admin/appointments/INQUIRY_ID \
  -H "Content-Type: application/json" \
  -d '{"action": "reject"}'
```

**Option B: Via Admin Panel UI** (TODO - future enhancement):

- Add "Confirm" / "Reject" buttons to admin panel
- These would call the API endpoint above

---

## 🔮 Future Enhancements (Optional)

1. **Admin Panel UI** - Add confirm/reject buttons
2. **Customer Notification** - Send confirmation email with calendar invite
3. **Alternative Times** - Suggest 3 alternative slots on rejection
4. **SMS Notifications** - Remind admin before 24h expires
5. **Calendar Sync** - Two-way sync with Google Calendar

---

**Status**: ✅ All issues fixed, system ready for production testing!

🎉 Users can now safely book appointments without conflicts!
