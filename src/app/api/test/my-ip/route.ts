import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to check your current IP address
 * Useful for configuring GA4 Internal Traffic filters
 * 
 * Usage: https://nest-haus.at/api/test/my-ip
 */
export async function GET(request: NextRequest) {
  // Get IP from various headers (Vercel provides these)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = request.ip;

  // Extract first IP from x-forwarded-for (user's real IP)
  const userIp = forwardedFor?.split(',')[0]?.trim() || realIp || ip || 'unknown';

  return NextResponse.json({
    ip: userIp,
    allHeaders: {
      'x-forwarded-for': forwardedFor,
      'x-real-ip': realIp,
      'request.ip': ip,
    },
    message: 'Use this IP in Google Analytics Internal Traffic filter',
  });
}
