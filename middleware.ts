import { NextRequest, NextResponse } from 'next/server';

// Named export for Next.js middleware
export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Debug logging for troubleshooting
    console.log('[MIDDLEWARE] Processing:', pathname);
    console.log('[MIDDLEWARE] SITE_PASSWORD exists:', !!process.env.SITE_PASSWORD);
    console.log('[MIDDLEWARE] ADMIN_PASSWORD exists:', !!process.env.ADMIN_PASSWORD);
    console.log('[MIDDLEWARE] VERCEL_ENV:', process.env.VERCEL_ENV);
    console.log('[MIDDLEWARE] NODE_ENV:', process.env.NODE_ENV);

    // Check for admin routes first (both pages and API)
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        // Skip auth check for admin auth page itself and API routes
        if (pathname === '/admin/auth' || pathname.startsWith('/api/admin/auth')) {
            console.log('[MIDDLEWARE] Skipping admin auth check for:', pathname);
            return NextResponse.next();
        }

        const adminPassword = process.env.ADMIN_PASSWORD;

        // If no admin password is configured, deny access (security-first approach)
        if (!adminPassword) {
            console.warn('[MIDDLEWARE] ADMIN_PASSWORD not configured, denying admin access');
            const url = request.nextUrl.clone();
            url.pathname = '/access-denied';
            return NextResponse.redirect(url);
        }

        // Check if user has admin authentication
        const adminAuthCookie = request.cookies.get('nest-haus-admin-auth');
        console.log('[MIDDLEWARE] Admin auth cookie exists:', !!adminAuthCookie);

        // If authenticated, allow access
        if (adminAuthCookie?.value === adminPassword) {
            console.log('[MIDDLEWARE] Admin authenticated, allowing access');
            return NextResponse.next();
        }

        // For API routes, return 401 instead of redirect
        if (pathname.startsWith('/api/admin')) {
            console.log('[MIDDLEWARE] API admin route unauthorized, returning 401');
            return NextResponse.json(
                { error: 'Unauthorized - Admin authentication required' },
                { status: 401 }
            );
        }

        // For page routes, redirect to admin auth page
        console.log('[MIDDLEWARE] Redirecting to admin auth page');
        const url = request.nextUrl.clone();
        url.pathname = '/admin/auth';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Skip password check for non-admin API routes, static files, and auth page
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname === '/auth'
    ) {
        console.log('[MIDDLEWARE] Skipping protection for:', pathname);
        return NextResponse.next();
    }

    // Get environment variables with fallbacks
    const correctPassword = process.env.SITE_PASSWORD || process.env.NEXT_PUBLIC_SITE_PASSWORD;

    // If no password is set, allow access
    if (!correctPassword) {
        console.log('[MIDDLEWARE] No password configured, allowing access');
        return NextResponse.next();
    }

    console.log('[MIDDLEWARE] Password protection enabled');

    // Check if user has already authenticated
    const authCookie = request.cookies.get('nest-haus-auth');
    console.log('[MIDDLEWARE] Auth cookie exists:', !!authCookie);

    // If authenticated, allow access
    if (authCookie?.value === correctPassword) {
        console.log('[MIDDLEWARE] User authenticated, allowing access');
        return NextResponse.next();
    }

    // Redirect to password page
    console.log('[MIDDLEWARE] Redirecting to auth page');
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        // Match all paths including root
        '/',
        // Match all non-excluded paths
        '/((?!_next|favicon).*)',
    ],
};
