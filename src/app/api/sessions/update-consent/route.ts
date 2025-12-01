import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * POST /api/sessions/update-consent
 *
 * Updates user session with cookie consent preferences
 * Non-blocking operation - doesn't interrupt user flow
 */

const updateConsentSchema = z.object({
  sessionId: z.string().min(1),
  analyticsConsent: z.boolean(),
  marketingConsent: z.boolean(),
  functionalConsent: z.boolean(),
  timestamp: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = updateConsentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { sessionId, analyticsConsent, marketingConsent, functionalConsent } =
      validation.data;

    // Determine overall consent (true if any non-necessary cookie accepted)
    const hasCookieConsent =
      analyticsConsent || marketingConsent || functionalConsent;

    // Update session with consent data using upsert to handle missing sessions
    await prisma.userSession.upsert({
      where: { sessionId },
      update: {
        hasCookieConsent,
        cookieConsentDate: new Date(),
        analyticsConsent,
        marketingConsent,
        functionalConsent,
        lastActivity: new Date(),
      },
      create: {
        sessionId,
        hasCookieConsent,
        cookieConsentDate: new Date(),
        analyticsConsent,
        marketingConsent,
        functionalConsent,
        ipAddress: "unknown",
        userAgent: "unknown",
        status: "ACTIVE",
      },
    });

    console.log(
      `✅ Cookie consent saved for session ${sessionId}: analytics=${analyticsConsent}, marketing=${marketingConsent}`
    );

    return NextResponse.json({
      success: true,
      sessionId,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("❌ Failed to update consent:", error);

    // Return success anyway to not block user experience
    return NextResponse.json(
      {
        success: true, // Don't block user flow
        error: "Consent tracking temporarily unavailable",
        timestamp: Date.now(),
      },
      { status: 200 }
    );
  }
}

