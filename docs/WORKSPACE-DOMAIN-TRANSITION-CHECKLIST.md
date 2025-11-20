# Google Workspace Domain Transition Checklist
## From sustain-nest.com to nest-haus.at

**Date:** 2025-11-20  
**Status:** Primary domain changed, need to finalize

---

## ✅ Step 1: COMPLETED - Primary Domain Changed

```
✅ nest-haus.at is now PRIMARY domain
✅ sustain-nest.com demoted to SECONDARY domain
```

---

## ⚠️ Step 2: CHECK USER EMAIL ADDRESSES (CRITICAL!)

### Before converting sustain-nest.com to alias, you MUST verify user emails!

**Go to Google Workspace Admin Console:**
```
admin.google.com
→ Users
→ Check EACH user's primary email address
```

### What to look for:

**Scenario A: Users already migrated to @nest-haus.at ✅**
```
Example:
User: John Doe
Primary email: john@nest-haus.at
Email aliases: john@sustain-nest.com

✅ SAFE to convert sustain-nest.com to alias
```

**Scenario B: Users still on @sustain-nest.com ⚠️**
```
Example:
User: John Doe
Primary email: john@sustain-nest.com
Email aliases: (none or john@nest-haus.at)

❌ NOT SAFE to convert to alias yet!
❌ Need to migrate users first!
```

---

## 📋 How to Check (2 minutes)

```bash
# Method 1: In Admin Console
1. Go to: admin.google.com
2. Click: Users
3. Look at each user's email address
4. Check format: user@???

# Method 2: Quick test
1. Send test email to: yourname@sustain-nest.com
2. Check where it delivers
   - If it goes to nest-haus.at inbox → Migrated ✅
   - If it goes to sustain-nest.com inbox → Not migrated ⚠️
```

---

## 🔄 SCENARIO A: Users Already on @nest-haus.at

**If all users show: user@nest-haus.at**

✅ **SAFE to convert sustain-nest.com to ALIAS**

### Steps to convert (10 minutes):

```bash
# Step 1: Go to Admin Console
admin.google.com → Domains

# Step 2: Remove sustain-nest.com as secondary domain
→ Click sustain-nest.com
→ Remove domain
⚠️ WARNING: This will stop email delivery temporarily!

# Step 3: Wait 5-10 minutes
☕ Take a short break

# Step 4: Re-add as alias domain
→ Domains → Add a domain
→ Domain name: sustain-nest.com
→ Domain type: ⦿ Alias domain (important!)
→ Complete verification

# Step 5: Test email forwarding
→ Send test email to: test@sustain-nest.com
→ Should deliver to: test@nest-haus.at ✅
```

### What this achieves:

```
Before (Secondary):
john@sustain-nest.com → Independent inbox
john@nest-haus.at → Independent inbox
(Two separate email addresses)

After (Alias):
john@sustain-nest.com → Automatically forwards to → john@nest-haus.at
(One inbox, two addresses that both work)
```

---

## ⚠️ SCENARIO B: Users Still on @sustain-nest.com

**If users show: user@sustain-nest.com**

❌ **NOT SAFE to convert to alias yet!**

You need to migrate user email addresses first!

### Why this matters:

If you convert sustain-nest.com to alias while users are still @sustain-nest.com:
- ❌ Users may lose access to their accounts
- ❌ Emails may not deliver properly  
- ❌ Login issues
- ❌ Mobile apps will break

### Steps to migrate users FIRST (1-2 hours):

```bash
# For EACH user, do this:

1. Go to Admin Console → Users
2. Click on user (e.g., "John Doe")
3. Click "User information"
4. Check current email: john@sustain-nest.com

5. Click "Add alternate email"
   → Add: john@nest-haus.at
   → Save

6. Make nest-haus.at the primary:
   → Click the (⋮) menu next to john@nest-haus.at
   → Select "Make primary"
   → Confirm

7. Verify:
   Primary email: john@nest-haus.at ✅
   Email aliases: john@sustain-nest.com ✅

8. Repeat for ALL users
```

### After ALL users are migrated to @nest-haus.at:

**THEN you can safely convert sustain-nest.com to alias (see Scenario A steps above)**

---

## 🎯 Recommended Approach: Keep as Secondary (For Now)

### Why keeping sustain-nest.com as SECONDARY is actually SAFER:

**Advantages of Secondary Domain (vs Alias):**

✅ **Flexibility:**
- Can still create new users on either domain
- Users can have different passwords for each domain
- More control over email routing

✅ **Safety:**
- If something goes wrong, users can still login
- No risk of email delivery issues
- Can gradually migrate at your own pace

✅ **Transition Period:**
- Give yourself 1-2 weeks to test everything
- Make sure all services are working
- Update all external integrations
- Communicate with team

✅ **No Downside:**
- Secondary domains don't cost extra
- Google allows up to 20 secondary domains
- Takes up 1 slot (you have 19 more)
- Works exactly like you want it to

### What "Secondary Domain" means in practice:

```
Current Setup:
Primary: nest-haus.at
Secondary: sustain-nest.com

Email behavior:
john@nest-haus.at → Works ✅
john@sustain-nest.com → Works ✅

Both deliver to the same inbox if properly configured!
```

---

## 🚀 My Recommended Action Plan

### **Option A: Keep as Secondary for 2-4 Weeks (SAFEST)**

**Why:**
- ✅ Zero risk of email delivery issues
- ✅ Time to update all services
- ✅ Time to notify external contacts
- ✅ Can test everything thoroughly
- ✅ Easy to convert to alias later

**Timeline:**
```
Week 1-2: Transition period
- Update all external services to use @nest-haus.at
- Notify contacts of new email addresses
- Update email signatures
- Test all integrations

Week 3-4: Monitoring
- Verify all emails going to @nest-haus.at
- Check for any remaining @sustain-nest.com usage
- Ensure no delivery issues

Week 4+: Convert to alias (if desired)
- Follow "Scenario A" steps above
- Convert sustain-nest.com to alias domain
```

### **Option B: Convert to Alias Now (IF users already on @nest-haus.at)**

**Only do this if:**
1. ✅ You verified ALL users are on @nest-haus.at
2. ✅ No services are using @sustain-nest.com logins
3. ✅ You're comfortable with immediate change

**Follow "Scenario A" steps in this document**

---

## 📊 Quick Decision Matrix

| Situation | Your Status | Action |
|-----------|-------------|--------|
| All users on @nest-haus.at | Check first! | If yes → Can convert to alias |
| Some users on @sustain-nest.com | Check first! | If yes → Migrate users first |
| Not sure | **Most likely** | Check users NOW |
| Want safest approach | Any status | Keep as secondary for 2-4 weeks |

---

## ⚡ What To Do RIGHT NOW (Next 5 Minutes)

### Step 1: Check your users (2 minutes)

```bash
1. Go to: admin.google.com
2. Click: Users
3. Look at the email addresses shown
4. Are they @nest-haus.at or @sustain-nest.com?
```

### Step 2: Based on what you see:

**If ALL users show @nest-haus.at:**
```
✅ Great! Users were automatically migrated
→ Option: Convert sustain-nest.com to alias (see Scenario A)
→ OR: Keep as secondary for safety (recommended for 2-4 weeks)
```

**If ANY users show @sustain-nest.com:**
```
⚠️ Users NOT migrated yet!
→ REQUIRED: Migrate user email addresses first (see Scenario B)
→ Takes 1-2 hours depending on number of users
→ THEN you can convert to alias
```

---

## 🛡️ Safety Checklist

Before converting sustain-nest.com to alias, verify:

```
□ All users have @nest-haus.at as primary email
□ Email signatures updated to @nest-haus.at
□ External services updated (CRM, tools, etc.)
□ Mobile apps reconfigured with new email
□ Calendar invites working properly
□ Shared drives accessible
□ Third-party OAuth apps reconnected
□ API credentials updated
□ Team notified of change
□ External contacts notified
□ Test emails sent and delivered
```

---

## 📞 What Happens to Emails?

### Current Setup (sustain-nest.com as SECONDARY):

```
Email to: john@nest-haus.at
Delivers to: john@nest-haus.at inbox ✅

Email to: john@sustain-nest.com
Delivers to: john@sustain-nest.com inbox ✅

(Two separate inboxes if user has both)
OR
(Same inbox if user only has @nest-haus.at)
```

### After Converting to ALIAS:

```
Email to: john@nest-haus.at
Delivers to: john@nest-haus.at inbox ✅

Email to: john@sustain-nest.com
Automatically forwards to: john@nest-haus.at inbox ✅

(Only one inbox, both addresses work)
```

---

## 🎯 Final Recommendation

### **Keep sustain-nest.com as SECONDARY for now**

**Reasons:**
1. ✅ Safer during transition period
2. ✅ More flexibility if you need to change something
3. ✅ No risk of email delivery issues
4. ✅ Can convert to alias anytime (takes 10 minutes)
5. ✅ No downside to keeping it as secondary

**Convert to alias later when:**
- You've verified everything works perfectly
- All external services updated
- Team comfortable with new emails
- 2-4 weeks have passed with no issues

---

## 📚 Google Documentation

- Manage domains: https://support.google.com/a/answer/182080
- Rename user accounts: https://support.google.com/a/answer/33386
- Domain aliases: https://support.google.com/a/answer/33786

---

## ✅ Summary

**Current Status:**
- ✅ nest-haus.at = PRIMARY domain (correct!)
- ✅ sustain-nest.com = SECONDARY domain (safe!)

**Recommended Next Steps:**
1. Check if your users are on @nest-haus.at or @sustain-nest.com
2. If on @sustain-nest.com → Migrate them to @nest-haus.at
3. Keep as secondary for 2-4 weeks for safety
4. Convert to alias later if desired (optional)

**Key Point:**
There's **no rush** to convert sustain-nest.com to alias. Secondary domain works fine and is actually safer during transition!

---

**Tell me what you see when you check your users, and I'll give you the exact next steps!**
