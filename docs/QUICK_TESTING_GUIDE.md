# Quick Testing Guide - Admin Tracking System

## Test Now (5 Minutes)

### Step 1: Test Configurator Session

1. Open a new incognito browser window
2. Go to `http://localhost:3000/konfigurator`
3. Make these selections:
   - Select a Nest type (e.g., Nest 80)
   - Select Gebäudehülle (e.g., Holzlattung Lärche)
   - Select Innenverkleidung (e.g., Fichte)
   - Select Fussboden (e.g., Eiche Parkett)
4. Open browser DevTools → Console
5. Look for your sessionId (starts with `client_`)

### Step 2: Submit Contact Form

1. Click "Jetzt anfragen" or go to `/kontakt`
2. Fill out the form with your details
3. Submit the form
4. You should see a success message
5. Note: The session should now be marked as COMPLETED

### Step 3: Use Debug Tool

1. Go to `http://localhost:3000/admin/auth` (if not logged in)
2. Enter admin password: `MAINJAJANest`
3. Go to `http://localhost:3000/admin/debug/session`
4. Paste your sessionId from Step 1
5. Click "Debug Session"

### What You Should See:

✅ **Session Overview**: Status = COMPLETED  
✅ **Data Quality**: 4 green checkmarks  
✅ **Configuration Selections**: All your choices listed  
✅ **Selection Events**: Multiple events showing your selections  
✅ **Customer Inquiry**: Your contact form submission

### Step 4: Check Admin Dashboards

#### Popular Configurations

`http://localhost:3000/admin/popular-configurations`

- Should show your configuration in the list
- Selection stats should include your choices

#### User Journey

`http://localhost:3000/admin/user-journey`

- Funnel should show your progression
- Drop-off analysis should include your data

#### Customer Inquiries

`http://localhost:3000/admin/customer-inquiries`

- Should show your inquiry at the top
- Configuration data should be visible

## Expected Behavior

### Before Fix

- ❌ Popular Configurations: Empty or outdated data
- ❌ User Journey: No selection events tracked
- ❌ Customer Inquiries: No configuration data attached
- ❌ Session status: Stuck at ACTIVE

### After Fix

- ✅ Popular Configurations: Real-time user choices
- ✅ User Journey: Complete selection path tracked
- ✅ Customer Inquiries: Full configuration included
- ✅ Session status: COMPLETED when form submitted

## Troubleshooting

### If SelectionEvents are missing:

1. Check browser console for tracking errors
2. Verify `/api/sessions/sync` is being called
3. Check debug tool for warning messages

### If Session stays ACTIVE:

1. Verify you submitted the contact form
2. Check if sessionId matches in form and configurator
3. Look at server logs for errors

### If Configuration data is empty:

1. Verify you made selections in configurator
2. Check localStorage for `nest-configurator` state
3. Use debug tool to see raw configurationData

## Quick Verification Commands

```bash
# Check if server is running
netstat -an | findstr :3000

# Check recent logs (look for tracking messages)
# In your terminal running npm run dev

# Look for these messages:
# ✅ Updated UserSession XXX status to COMPLETED
# ✅ Created SelectionEvent for nest
# ✅ Created SelectionEvent for gebaeudehuelle
```

## Success Criteria

After completing the test flow:

1. Debug tool shows all green checkmarks ✅
2. Admin dashboards display your data ✅
3. No errors in browser or server console ✅
4. Session marked as COMPLETED ✅

---

**Ready to test?** Start with Step 1 above!
