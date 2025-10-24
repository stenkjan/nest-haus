# Admin Password Protection Setup

## Overview

The admin dashboard at `/admin` is now protected with a separate password authentication system, independent from the main site password protection.

## Architecture

### Components Created

1. **Admin Auth Page**: `/admin/auth/page.tsx`
   - Password entry form for admin access
   - Similar to the main site auth page but specifically for admin routes

2. **Admin Auth Form**: `/admin/auth/AdminAuthForm.tsx`
   - Client-side component handling password submission
   - Sets the `nest-haus-admin-auth` cookie on successful authentication

3. **Admin Auth API**: `/api/admin/auth/route.ts`
   - Verifies the admin password against `ADMIN_PASSWORD` environment variable
   - Returns success/failure status and sets authentication cookie

4. **Middleware Update**: `middleware.ts`
   - Checks all `/admin/*` routes for admin authentication
   - Redirects unauthenticated users to `/admin/auth`
   - Maintains separate authentication from main site password

## How It Works

### Authentication Flow

1. **User visits `/admin`** (or any admin route)
2. **Middleware intercepts** the request
3. **Checks for `nest-haus-admin-auth` cookie**
4. If cookie is invalid/missing → **Redirect to `/admin/auth?redirect=/admin`**
5. User enters admin password
6. **API validates** password against `ADMIN_PASSWORD`
7. On success → **Set cookie** and **redirect to original destination**

### Security Features

- **Separate credentials**: Admin password is completely separate from site password
- **Security-first approach**: If `ADMIN_PASSWORD` is not set, admin access is denied
- **Cookie-based auth**: 24-hour session with secure, httpOnly, and sameSite flags
- **Path protection**: All `/admin/*` routes are protected automatically
- **Middleware-level security**: Protection happens before any page loads

## Environment Variables

You need to set the following environment variable:

### Development (.env.local)

```bash
# Admin Dashboard Password
ADMIN_PASSWORD=your-secure-admin-password-here
```

### Production (Vercel/Deployment)

Add the environment variable in your deployment platform:

**Vercel Dashboard**:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `ADMIN_PASSWORD` with your secure password
4. Make sure it's set for "Production", "Preview", and "Development" environments

## Usage

### Setting the Password

1. **Local Development**:

   ```bash
   # Add to .env.local
   echo "ADMIN_PASSWORD=MySecureAdminPass123!" >> .env.local
   ```

2. **Production**:
   - Set via Vercel dashboard or deployment platform
   - Use a strong, unique password different from `SITE_PASSWORD`

### Accessing the Admin Dashboard

1. Navigate to `/admin` in your browser
2. You'll be redirected to `/admin/auth?redirect=/admin`
3. Enter the admin password
4. On success, you'll be redirected to the admin dashboard
5. Authentication is valid for 24 hours

### Logging Out

To log out of the admin panel:

- Clear the `nest-haus-admin-auth` cookie from your browser
- Or use browser's "Clear cookies" function
- Or wait 24 hours for the cookie to expire

## Comparison with Main Site Password

| Feature              | Main Site (`SITE_PASSWORD`)        | Admin Dashboard (`ADMIN_PASSWORD`) |
| -------------------- | ---------------------------------- | ---------------------------------- |
| **Cookie Name**      | `nest-haus-auth`                   | `nest-haus-admin-auth`             |
| **Auth Page**        | `/auth`                            | `/admin/auth`                      |
| **API Endpoint**     | `/api/auth`                        | `/api/admin/auth`                  |
| **Protected Routes** | All routes except API, admin, auth | Only `/admin/*` routes             |
| **If Not Set**       | Site is accessible                 | Admin access is denied             |
| **Purpose**          | Beta site protection               | Admin dashboard security           |

## Testing

### Test Admin Protection

1. **Without password set**:

   ```bash
   # Remove ADMIN_PASSWORD from .env.local
   # Try to access /admin → Should redirect to /access-denied
   ```

2. **With password set**:

   ```bash
   # Set ADMIN_PASSWORD in .env.local
   # Try to access /admin → Should redirect to /admin/auth
   # Enter correct password → Should access admin dashboard
   # Enter wrong password → Should show error message
   ```

3. **With valid cookie**:
   ```bash
   # After successful login, refresh page
   # Should stay on admin dashboard without re-authentication
   ```

## Security Considerations

1. **Strong Passwords**: Use strong, unique passwords for `ADMIN_PASSWORD`
2. **Environment Security**: Never commit `.env.local` to version control
3. **HTTPS in Production**: Cookies are marked `secure` in production
4. **Session Duration**: 24-hour sessions minimize exposure window
5. **Independent Auth**: Admin and site passwords should be different

## Troubleshooting

### Issue: Can't access admin dashboard

**Check**:

1. Is `ADMIN_PASSWORD` set in your environment?
2. Are you using the correct password?
3. Check browser console for cookie errors
4. Check middleware logs: `[MIDDLEWARE] Admin authenticated`

### Issue: Cookie not being set

**Check**:

1. API response is successful (200 status)
2. Browser allows cookies (not in incognito with strict settings)
3. Cookie appears in browser DevTools → Application → Cookies

### Issue: Redirected to /access-denied

**Reason**: `ADMIN_PASSWORD` environment variable is not set

**Solution**: Add `ADMIN_PASSWORD` to your `.env.local` or deployment environment variables

## Code Examples

### Manual Cookie Setting (for testing)

```javascript
// In browser console, set admin auth cookie manually
document.cookie = "nest-haus-admin-auth=your-password; path=/; max-age=86400";
```

### Checking Authentication Status

```javascript
// In browser console, check if authenticated
const cookies = document.cookie.split(";").map((c) => c.trim());
const adminCookie = cookies.find((c) => c.startsWith("nest-haus-admin-auth="));
console.log("Admin authenticated:", !!adminCookie);
```

## Future Enhancements

Potential improvements for the admin authentication system:

1. **Role-based access**: Different admin levels (viewer, editor, super-admin)
2. **Session management**: Ability to view and revoke active sessions
3. **Audit logging**: Track admin logins and actions
4. **Two-factor authentication**: Add 2FA for enhanced security
5. **Password reset**: Secure password reset mechanism
6. **IP whitelisting**: Restrict admin access to specific IPs

## Related Files

- `/src/app/admin/auth/page.tsx` - Admin auth page component
- `/src/app/admin/auth/AdminAuthForm.tsx` - Auth form component
- `/src/app/api/admin/auth/route.ts` - Auth API endpoint
- `/middleware.ts` - Middleware with admin route protection
- `/src/app/access-denied/page.tsx` - Access denied page

## Support

For issues or questions about admin password protection:

1. Check middleware logs in the console
2. Verify environment variables are set correctly
3. Test with browser DevTools open to see cookie/redirect behavior
4. Review this documentation for configuration steps
