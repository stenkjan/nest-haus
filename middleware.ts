import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Only apply password protection in production
    if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV !== 'production') {
        return NextResponse.next();
    }

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

    // If authenticated, allow access
    if (authCookie?.value === correctPassword) {
        return NextResponse.next();
    }

    // Check if this is a password submission
    if (request.method === 'POST' && request.nextUrl.pathname === '/auth') {
        // This will be handled by the auth API route
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
    ],
};
