/**
 * Test endpoint to check client IP detection
 * Used for debugging IP-based filtering
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract IP from various headers (Vercel forwards these)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  // Extract first IP from x-forwarded-for (user's real IP)
  const userIp = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

  return NextResponse.json({
    success: true,
    data: {
      clientIp: userIp,
      allHeaders: {
        'x-forwarded-for': forwardedFor,
        'x-real-ip': realIp,
        'user-agent': request.headers.get('user-agent'),
      }
    }
  });
}

