/**
 * BI Metrics API - Quick Overview Stats for Admin Home
 * 
 * Provides aggregated metrics for the admin dashboard:
 * - Sessions per day (last 7 days)
 * - Top locations (top 3 countries)
 * - Most visited pages (top 3)
 * - Most selected configuration
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: NextRequest) {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Sessions per day (last 7 days)
    const sessions = await prisma.userSession.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const sessionsPerDay: { date: string; count: number }[] = [];
    const dayMap = new Map<string, number>();

    sessions.forEach((session) => {
      const dateKey = session.createdAt.toISOString().split("T")[0];
      dayMap.set(dateKey, (dayMap.get(dateKey) || 0) + 1);
    });

    // Fill in all 7 days, even if no sessions
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split("T")[0];
      sessionsPerDay.push({
        date: dateKey,
        count: dayMap.get(dateKey) || 0,
      });
    }

    // 2. Top locations (top 3 countries)
    // Note: Geographic data not yet populated - will be enabled after schema migration
    const topLocations: Array<{ country: string; count: number }> = [];

    // 3. Most visited pages (top 3)
    const interactions = await prisma.interactionEvent.findMany({
      where: {
        eventType: "page_visit",
      },
      select: {
        category: true,
      },
    });

    const pageMap = new Map<string, number>();
    interactions.forEach((interaction) => {
      pageMap.set(interaction.category, (pageMap.get(interaction.category) || 0) + 1);
    });

    const topPages = Array.from(pageMap.entries())
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // 4. Most selected configuration
    const selectionEvents = await prisma.selectionEvent.findMany({
      select: {
        category: true,
        selection: true,
      },
      take: 1000, // Limit to recent 1000 selections for performance
    });

    const configMap = new Map<string, number>();
    selectionEvents.forEach((event) => {
      const key = `${event.category}:${event.selection}`;
      configMap.set(key, (configMap.get(key) || 0) + 1);
    });

    const mostSelectedConfig = Array.from(configMap.entries())
      .map(([config, count]) => {
        const [key, value] = config.split(":");
        return { key, value, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 1)[0] || { key: "none", value: "none", count: 0 };

    return NextResponse.json({
      success: true,
      data: {
        sessionsPerDay,
        topLocations,
        topPages,
        mostSelectedConfig,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching BI metrics:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch BI metrics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

