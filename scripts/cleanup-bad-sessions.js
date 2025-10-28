#!/usr/bin/env node

/**
 * Cleanup Script - Remove Bad Sessions
 *
 * Removes the two problematic sessions that are skewing time analytics:
 * - 20251021_user555
 * - 20251022_user602
 *
 * Usage:
 *   node scripts/cleanup-bad-sessions.js
 *
 * Or via curl:
 *   curl -X POST http://localhost:3000/api/admin/cleanup-sessions \
 *     -H "Content-Type: application/json" \
 *     -d '{"sessionIds":["20251021_user555","20251022_user602"]}'
 */

const BAD_SESSION_IDS = ["20251021_user555", "20251022_user602"];

async function cleanupSessions() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/admin/cleanup-sessions`;

  console.log("🗑️  Cleaning up bad sessions...");
  console.log("Sessions to delete:", BAD_SESSION_IDS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionIds: BAD_SESSION_IDS,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log("✅ Successfully deleted sessions");
      console.log(`   Deleted count: ${result.deletedCount}`);
      console.log(`   Session IDs: ${result.sessionIds.join(", ")}`);
    } else {
      console.error("❌ Failed to delete sessions");
      console.error("   Error:", result.error || "Unknown error");
      if (result.details) {
        console.error("   Details:", result.details);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Request failed:", error);
    console.error("\nMake sure the development server is running:");
    console.error("   npm run dev");
    process.exit(1);
  }
}

// Run cleanup
cleanupSessions();
