import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Skip password check for API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Check if user has already authenticated
    const authCookie = request.cookies.get('nest-haus-auth');
    const correctPassword = process.env.SITE_PASSWORD;

    // If no password is set, allow access
    if (!correctPassword) {
        return NextResponse.next();
    }

    // Only apply password protection when SITE_PASSWORD is set
    const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

    // If password is set, apply protection regardless of environment (for testing)
    // But you can uncomment the next lines to restrict to production only
    // if (!isProduction) {
    //     return NextResponse.next();
    // }

    // If authenticated, allow access
    if (authCookie?.value === correctPassword) {
        return NextResponse.next();
    }

    // Skip redirect if already on auth page
    if (request.nextUrl.pathname === '/auth') {
        return NextResponse.next();
    }

    // Redirect to password page
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - auth (password page)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
        '/', // Explicitly include the root path
    ],
};
