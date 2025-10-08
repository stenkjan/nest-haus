import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        hasSitePassword: !!process.env.SITE_PASSWORD,
        vercelEnv: process.env.VERCEL_ENV,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
}
