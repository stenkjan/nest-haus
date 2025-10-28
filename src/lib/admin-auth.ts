import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Validates admin authentication using cookie-based auth
 * This matches the middleware authentication approach
 * 
 * @returns true if authenticated, false otherwise
 */
export async function validateAdminAuth(request: NextRequest): Promise<boolean> {
    const adminPassword = process.env.ADMIN_PASSWORD;

    // If no admin password is configured, deny access
    if (!adminPassword) {
        console.warn('[Admin Auth] ADMIN_PASSWORD not configured');
        return false;
    }

    // Check for admin authentication cookie
    const adminAuthCookie = request.cookies.get('nest-haus-admin-auth');

    if (!adminAuthCookie) {
        console.warn('[Admin Auth] No auth cookie present');
        return false;
    }

    // Validate cookie value matches admin password
    const isValid = adminAuthCookie.value === adminPassword;

    if (!isValid) {
        console.warn('[Admin Auth] Invalid auth cookie value');
    }

    return isValid;
}

/**
 * Helper function to validate admin auth in route handlers
 * Returns an error response if authentication fails
 * 
 * Usage:
 * ```ts
 * const authError = await requireAdminAuth(request);
 * if (authError) return authError;
 * ```
 */
export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
    const isAuthenticated = await validateAdminAuth(request);

    if (!isAuthenticated) {
        return NextResponse.json(
            { error: 'Unauthorized - Admin authentication required' },
            { status: 401 }
        );
    }

    return null;
}

/**
 * Validates admin authentication using cookies() from next/headers
 * This is for use in Server Components and Route Handlers that don't have NextRequest
 * 
 * @returns true if authenticated, false otherwise
 */
export async function validateAdminAuthFromCookies(): Promise<boolean> {
    const adminPassword = process.env.ADMIN_PASSWORD;

    // If no admin password is configured, deny access
    if (!adminPassword) {
        console.warn('[Admin Auth] ADMIN_PASSWORD not configured');
        return false;
    }

    const cookieStore = await cookies();
    const adminAuthCookie = cookieStore.get('nest-haus-admin-auth');

    if (!adminAuthCookie) {
        console.warn('[Admin Auth] No auth cookie present');
        return false;
    }

    // Validate cookie value matches admin password
    const isValid = adminAuthCookie.value === adminPassword;

    if (!isValid) {
        console.warn('[Admin Auth] Invalid auth cookie value');
    }

    return isValid;
}

