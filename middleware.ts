import { NextRequest, NextResponse } from 'next/server';

// Named export for Next.js middleware
export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Only protect admin routes - all other routes pass through freely
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

    // Allow all other routes (non-admin) to pass through
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Only match admin routes and admin API routes
        '/admin/:path*',
        '/api/admin/:path*',
    ],
};
