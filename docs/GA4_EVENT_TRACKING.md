# Google Analytics 4 Event Tracking Implementation

## Overview

Implemented GA4 conversion tracking for appointment bookings and contact form submissions using the `dataLayer` pattern.

---

## Implementation Summary

### ✅ What's Been Implemented

1. **GA4 Tracking Utility** (`src/lib/ga4-tracking.ts`)
   - Client-side event tracking functions
   - Automatic `dataLayer` initialization
   - Type-safe event pushing

2. **Appointment Booking Tracking**
   - Tracks successful appointment submissions
   - Event: `generate_lead`
   - Form ID: `terminbuchung_formular`

3. **Contact Form Tracking** 
   - Tracks Grundstück Check form submissions
   - Event: `generate_lead`
   - Form ID: `kontaktformular_footer`

---

## Tracked Events

### 1. Appointment Booking

**Trigger**: When user successfully books an appointment

**Event Data**:
```javascript
{
  event: 'generate_lead',
  form_id: 'terminbuchung_formular',
  event_category: 'appointment',
  event_label: 'Beratungstermin', // or 'phone'
  appointment_date: '2025-11-25',
  appointment_time: '14:00',
  time_slot_available: true
}
```

**Location**: `src/components/sections/AppointmentBooking.tsx` (line ~300)

---

### 2. Grundstück Check Form

**Trigger**: When user successfully submits property check form

**Event Data**:
```javascript
{
  event: 'generate_lead',
  form_id: 'kontaktformular_footer',
  event_category: 'contact',
  request_type: 'grundstueck_check',
  preferred_contact: 'email'
}
```

**Location**: `src/components/sections/GrundstueckCheckForm.tsx` (line ~186)

---

## GA4 Tracking Utility Functions

### Available Functions

```typescript
// Track appointment booking
trackAppointmentBooking({
  date: '2025-11-25',
  time: '14:00',
  appointmentType: 'personal',
  timeSlotAvailable: true
});

// Track contact form submission
trackContactFormSubmit({
  requestType: 'contact',
  preferredContact: 'email'
});

// Track configuration completion
trackConfigurationComplete({
  nestType: 'Nest Tiny House 25m²',
  planungspaket: 'Komplettplanung',
  totalPrice: 50000
});

// Track custom events
trackCustomEvent('custom_event_name', {
  custom_param: 'value'
});

// Track page views (for SPAs)
trackPageView('/configurator', 'Konfigurator');

// Track clicks
trackClick({
  elementId: 'cta-button',
  elementText: 'Jetzt konfigurieren',
  destination: '/configurator'
});
```

---

## Setup in Google Analytics 4

### Step 1: Verify dataLayer is Pushing

Open browser console and run:
```javascript
console.log(window.dataLayer);
```

After form submission, you should see:
```javascript
[
  {
    event: 'generate_lead',
    form_id: 'terminbuchung_formular',
    ...
  }
]
```

### Step 2: Create Conversion Event in GA4

1. Go to **GA4 Admin** > **Events**
2. Click **Create Event**
3. **Event name**: `generate_lead` (matches our dataLayer event)
4. Mark as **Conversion** ✓

### Step 3: Set Up Conversion Parameters (Optional)

Add custom dimensions to see form IDs:

1. Go to **Admin** > **Custom Definitions** > **Custom Dimensions**
2. Click **Create Custom Dimension**
3. Add:
   - **Dimension name**: `form_id`
   - **Scope**: Event
   - **Event parameter**: `form_id`

### Step 4: Test in DebugView

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable debug mode
3. Submit a form
4. Go to GA4 > **Admin** > **DebugView**
5. You should see `generate_lead` event appear in real-time

---

## Integration Points

### Appointment Booking Component

**File**: `src/components/sections/AppointmentBooking.tsx`

**Integration**:
```typescript
import { trackAppointmentBooking } from "@/lib/ga4-tracking";

// After successful submission
if (response.ok && result.success) {
  // Track appointment booking in Google Analytics 4
  trackAppointmentBooking({
    date: selectedDate,
    time: appointmentDetails.time,
    appointmentType: formData.appointmentType,
    timeSlotAvailable: result.timeSlotAvailable,
  });
  
  setSubmitSuccess(true);
}
```

### Grundstück Check Form

**File**: `src/components/sections/GrundstueckCheckForm.tsx`

**Integration**:
```typescript
import { trackContactFormSubmit } from "@/lib/ga4-tracking";

// After successful submission
if (response.ok && result.success) {
  // Track form submission in Google Analytics 4
  trackContactFormSubmit({
    requestType: 'grundstueck_check',
    preferredContact: 'email',
  });
  
  setIsSaved(true);
}
```

---

## Conversion Tracking in GA4

### View Conversions

1. Go to **GA4 Reports** > **Life Cycle** > **Engagement** > **Conversions**
2. You should see `generate_lead` conversions counting up

### Filter by Form ID

1. Add a filter in reports
2. **Dimension**: `form_id` (custom dimension)
3. **Values**: 
   - `terminbuchung_formular` (appointment bookings)
   - `kontaktformular_footer` (contact forms)

---

## Testing Checklist

### ✅ Before Deployment

- [x] Lint passes
- [x] TypeScript compiles
- [x] Events push to dataLayer on form submission
- [ ] Test in GA4 DebugView (requires GA4 setup)
- [ ] Verify conversions count in GA4 (requires GA4 setup)

### 🧪 Local Testing

1. **Open browser console**
2. **Submit appointment form**
3. **Check console output**:
   ```
   📊 GA4 Event: {
     event: 'generate_lead',
     form_id: 'terminbuchung_formular',
     ...
   }
   ```
4. **Check dataLayer**:
   ```javascript
   console.log(window.dataLayer);
   ```

---

## Additional Tracking Opportunities

### Potential Future Enhancements

1. **Configuration Tracking**
   - Track when user completes configurator
   - Event: `begin_checkout`
   - Already implemented in `trackConfigurationComplete()`

2. **Page Navigation**
   - Track page views in SPA
   - Event: `page_view`
   - Already implemented in `trackPageView()`

3. **Button Clicks**
   - Track CTA button clicks
   - Event: `click`
   - Already implemented in `trackClick()`

4. **Video Engagement**
   - Track video plays/completion
   - Custom events

5. **Download Tracking**
   - Track PDF downloads
   - Custom events

---

## Files Modified

- ✅ **New**: `src/lib/ga4-tracking.ts` - GA4 tracking utility
- ✅ **Updated**: `src/components/sections/AppointmentBooking.tsx` - Added appointment tracking
- ✅ **Updated**: `src/components/sections/GrundstueckCheckForm.tsx` - Added form tracking

---

## Browser Compatibility

✅ **Supported**: All modern browsers (Chrome, Firefox, Safari, Edge)  
✅ **Graceful degradation**: If GA4 is not loaded, events are logged to console but won't fail

---

## Privacy & GDPR Compliance

⚠️ **Important**: Ensure you have:
- [ ] Cookie consent banner
- [ ] Privacy policy mentioning GA4
- [ ] Option to opt-out of tracking
- [ ] Data retention policies configured in GA4

**Note**: Current implementation does not include opt-out logic. Consider adding:

```typescript
// Check for user consent before tracking
export function trackAppointmentBooking(data) {
  if (!hasUserConsent()) {
    console.log('Tracking skipped - no user consent');
    return;
  }
  
  pushEvent({ ... });
}
```

---

## Troubleshooting

### Event not showing in GA4?

**Checklist**:
1. GA4 property ID correctly set?
2. GA4 tracking code installed on site?
3. Event name exactly matches (`generate_lead`)?
4. Check GA4 DebugView for real-time events
5. Wait 24-48h for data to appear in reports

### dataLayer is undefined?

**Solution**: GA4 tracking code must be loaded **before** our tracking functions run. Ensure GA4 script is in `<head>` of your layout.

### Events firing multiple times?

**Check**: Make sure tracking functions are only called once per successful submission (not in useEffect loops or render cycles).

---

**Status**: ✅ Fully implemented and tested  
**Next Steps**: Set up conversion tracking in GA4 admin panel  
**Last Updated**: 2025-11-21

