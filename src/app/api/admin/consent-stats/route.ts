import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/consent-stats
 *
 * Returns cookie consent statistics for admin dashboard
 */
export async function GET() {
  try {
    // Get total sessions
    const totalSessions = await prisma.userSession.count();

    // Get sessions with analytics consent = true
    const analyticsAccepted = await prisma.userSession.count({
      where: {
        analyticsConsent: true,
      },
    });

    // Get sessions with analytics consent = false (explicitly rejected)
    const analyticsRejected = await prisma.userSession.count({
      where: {
        analyticsConsent: false,
      },
    });

    // Sessions with no decision (null)
    const noDecisionYet = await prisma.userSession.count({
      where: {
        analyticsConsent: null,
      },
    });

    // Total with decision (accepted or rejected)
    const totalWithDecision = analyticsAccepted + analyticsRejected;

    // Calculate percentages
    const acceptanceRate =
      totalSessions > 0 ? (analyticsAccepted / totalSessions) * 100 : 0;
    const rejectionRate =
      totalSessions > 0 ? (analyticsRejected / totalSessions) * 100 : 0;
    const noDecisionRate =
      totalSessions > 0 ? (noDecisionYet / totalSessions) * 100 : 0;

    return NextResponse.json({
      totalSessions,
      totalWithDecision,
      analyticsAccepted,
      analyticsRejected,
      noDecisionYet,
      acceptanceRate,
      rejectionRate,
      noDecisionRate,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Failed to fetch consent stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

