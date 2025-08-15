import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const correctPassword = process.env.SITE_PASSWORD;

        // If no password is configured, allow access
        if (!correctPassword) {
            return NextResponse.json({ success: true });
        }

        // Check if password matches
        if (password === correctPassword) {
            const response = NextResponse.json({ success: true });

            // Set authentication cookie
            response.cookies.set('nest-haus-auth', password, {
                httpOnly: false, // Allow client-side access for middleware
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400, // 24 hours
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ success: false }, { status: 401 });
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
