import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/sessions/get-journey
 * 
 * Fetches complete user journey data for a session
 * Returns session info + all interaction events
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing sessionId parameter" },
        { status: 400 }
      );
    }

    // Fetch session data
    const session = await prisma.userSession.findUnique({
      where: { sessionId },
      select: {
        sessionId: true,
        startTime: true,
        endTime: true,
        city: true,
        country: true,
        status: true,
        configurationData: true,
        lastActivity: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    // Fetch all interaction events for this session
    const interactions = await prisma.interactionEvent.findMany({
      where: { sessionId },
      select: {
        id: true,
        eventType: true,
        category: true,
        elementId: true,
        selectionValue: true,
        previousValue: true,
        timestamp: true,
        timeSpent: true,
        deviceType: true,
        additionalData: true,
      },
      orderBy: { timestamp: "asc" },
    });

    // Calculate total interactions
    const totalInteractions = interactions.length;

    // Extract device type from first interaction (if available)
    const deviceType = interactions[0]?.deviceType || undefined;

    return NextResponse.json({
      success: true,
      session: {
        ...session,
        totalInteractions,
        deviceType,
      },
      interactions,
    });
  } catch (error) {
    console.error("❌ Error fetching user journey:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

