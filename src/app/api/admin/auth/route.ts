import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const correctPassword = process.env.ADMIN_PASSWORD;

        // If no admin password is configured, deny access (security-first approach)
        if (!correctPassword) {
            console.error('[Admin Auth] ADMIN_PASSWORD not configured');
            return NextResponse.json({ success: false, error: 'Admin access not configured' }, { status: 401 });
        }

        // Check if password matches
        if (password === correctPassword) {
            const response = NextResponse.json({ success: true });

            // Set authentication cookie
            response.cookies.set('nest-haus-admin-auth', password, {
                httpOnly: false, // Allow client-side access for middleware
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400, // 24 hours
                path: '/',
            });

            console.log('[Admin Auth] Successful authentication');
            return response;
        }

        console.warn('[Admin Auth] Failed authentication attempt');
        return NextResponse.json({ success: false }, { status: 401 });
    } catch (error) {
        console.error('[Admin Auth] Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

