import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        // Environment variable checks
        const sitePassword = process.env.SITE_PASSWORD;
        const vercelEnv = process.env.VERCEL_ENV;
        const nodeEnv = process.env.NODE_ENV;
        
        // Cookie checks
        const cookieStore = cookies();
        const authCookie = cookieStore.get('nest-haus-auth');
        
        // Request info
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const origin = request.headers.get('origin') || 'unknown';
        
        const status = {
            timestamp: new Date().toISOString(),
            environment: {
                hasSitePassword: !!sitePassword,
                sitePasswordLength: sitePassword?.length || 0,
                vercelEnv,
                nodeEnv,
                isProduction: vercelEnv === 'production' || nodeEnv === 'production'
            },
            authentication: {
                hasAuthCookie: !!authCookie,
                authCookieValue: authCookie?.value || null,
                isAuthenticated: authCookie?.value === sitePassword,
                cookieName: 'nest-haus-auth'
            },
            request: {
                userAgent,
                origin,
                pathname: new URL(request.url).pathname
            },
            middleware: {
                shouldProtect: !!sitePassword,
                shouldRedirect: !!sitePassword && (!authCookie || authCookie.value !== sitePassword)
            }
        };
        
        console.log('[AUTH_STATUS_API] Status check:', JSON.stringify(status, null, 2));
        
        return NextResponse.json(status);
    } catch (error) {
        console.error('[AUTH_STATUS_API] Error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to check auth status',
                timestamp: new Date().toISOString()
            }, 
            { status: 500 }
        );
    }
}
