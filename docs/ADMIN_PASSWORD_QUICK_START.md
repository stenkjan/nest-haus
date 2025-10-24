# Admin Password Protection - Quick Setup Guide

## ✅ Implementation Complete

The admin dashboard (`/admin`) is now protected with password authentication, separate from the main site password.

## 🚀 Quick Start

### 1. Environment Variable

The `ADMIN_PASSWORD` is already configured in your `.env` file:

```bash
ADMIN_PASSWORD="MAINJAJANest"
```

### 2. Access the Admin Dashboard

1. Navigate to: `http://localhost:3000/admin`
2. You'll be redirected to: `/admin/auth?redirect=/admin`
3. Enter the admin password: `MAINJAJANest`
4. You'll be authenticated and redirected to the admin dashboard

### 3. Authentication Details

- **Cookie Name**: `nest-haus-admin-auth`
- **Session Duration**: 24 hours
- **Protected Routes**: All `/admin/*` routes
- **Auth Page**: `/admin/auth`
- **API Endpoint**: `/api/admin/auth`

## 🔐 Security Features

1. **Separate Authentication**: Admin password is independent from site password (`SITE_PASSWORD`)
2. **Middleware Protection**: All admin routes are protected at the middleware level
3. **Security-First**: If `ADMIN_PASSWORD` is not set, admin access is denied (redirects to `/access-denied`)
4. **Secure Cookies**: HttpOnly (partially), Secure (production), SameSite=Strict
5. **24-hour Sessions**: Automatic expiration after 24 hours

## 📁 Files Created/Modified

### New Files

- `/src/app/admin/auth/page.tsx` - Admin auth page
- `/src/app/admin/auth/AdminAuthForm.tsx` - Auth form component
- `/src/app/api/admin/auth/route.ts` - Auth API endpoint
- `/docs/ADMIN_PASSWORD_SETUP.md` - Comprehensive documentation

### Modified Files

- `/middleware.ts` - Added admin route protection logic

## 🧪 Testing

### Test the Protection

```bash
# 1. Clear browser cookies
# 2. Navigate to: http://localhost:3000/admin
# 3. Should redirect to: /admin/auth?redirect=/admin
# 4. Enter password: MAINJAJANest
# 5. Should redirect to: /admin dashboard
```

### Test Invalid Password

```bash
# 1. Go to /admin/auth
# 2. Enter wrong password
# 3. Should show: "Incorrect admin password" error
```

### Test Session Persistence

```bash
# 1. Login to admin
# 2. Refresh the page
# 3. Should stay authenticated (no redirect to /admin/auth)
```

## 🔄 Differences from Main Site Auth

| Feature          | Main Site               | Admin Dashboard        |
| ---------------- | ----------------------- | ---------------------- |
| **Password Var** | `SITE_PASSWORD`         | `ADMIN_PASSWORD`       |
| **Cookie**       | `nest-haus-auth`        | `nest-haus-admin-auth` |
| **Auth Page**    | `/auth`                 | `/admin/auth`          |
| **API**          | `/api/auth`             | `/api/admin/auth`      |
| **Protects**     | All routes              | Only `/admin/*` routes |
| **Default**      | Allow access if not set | Deny access if not set |

## 🛠️ Middleware Logic Flow

```
User visits /admin
    ↓
Middleware intercepts request
    ↓
Checks: Is path /admin/auth or /api/admin/auth?
    ↓ No
Checks: Is ADMIN_PASSWORD set?
    ↓ No → Redirect to /access-denied
    ↓ Yes
Checks: Cookie nest-haus-admin-auth exists and matches?
    ↓ No → Redirect to /admin/auth?redirect=/admin
    ↓ Yes
Allow access to admin dashboard ✅
```

## 📝 Notes

1. The admin password is already configured and ready to use
2. You can change the password by updating `ADMIN_PASSWORD` in `.env` (locally) or Vercel environment variables (production)
3. For production, ensure you set `ADMIN_PASSWORD` in your Vercel project settings
4. The password should be different from `SITE_PASSWORD` for better security
5. Sessions expire after 24 hours and users need to re-authenticate

## 🔗 Related Documentation

- Full setup guide: `/docs/ADMIN_PASSWORD_SETUP.md`
- Middleware documentation: See comments in `/middleware.ts`

## ✨ Ready to Use!

Your admin dashboard is now protected and ready to use. Simply navigate to `/admin` and enter the password when prompted.
