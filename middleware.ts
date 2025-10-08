import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    // Debug logging for troubleshooting
    console.log('[MIDDLEWARE] Processing:', pathname);
    console.log('[MIDDLEWARE] SITE_PASSWORD exists:', !!process.env.SITE_PASSWORD);
    console.log('[MIDDLEWARE] VERCEL_ENV:', process.env.VERCEL_ENV);
    console.log('[MIDDLEWARE] NODE_ENV:', process.env.NODE_ENV);

    // Skip password check for API routes, static files, and auth page
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
        '/((?!api|_next|favicon).*)',
    ],
};
