/**
 * Test Google Drive Sync Functionality
 *
 * This script tests the updated Google Drive sync with:
 * - 24-hour change detection
 * - Number-based image replacement
 * - Proper hash generation
 * - Images.ts constant updates
 */

const https = require("https");

// Configuration
const SYNC_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://your-app.vercel.app/api/sync/google-drive"
    : "http://localhost:3000/api/sync/google-drive";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function testSync() {
  console.log("🧪 Testing Google Drive Sync...");
  console.log(`📍 Endpoint: ${SYNC_ENDPOINT}`);

  try {
    // Create authorization header
    const credentials = Buffer.from(
      `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
    ).toString("base64");

    // Make the request
    const response = await fetch(SYNC_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Sync completed successfully!");
      console.log("📊 Results:");
      console.log(
        `   • Recent changes found: ${result.result.recentChangesFound || 0}`
      );
      console.log(`   • Files processed: ${result.result.processed || 0}`);
      console.log(`   • Files uploaded: ${result.result.uploaded || 0}`);
      console.log(`   • Files updated: ${result.result.updated || 0}`);
      console.log(`   • Old files replaced: ${result.result.deleted || 0}`);
      console.log(`   • Duration: ${result.result.duration || 0}ms`);
      console.log(
        `   • Images.ts updated: ${result.result.imagesUpdated ? "Yes" : "No"}`
      );
      console.log(
        `   • Triggered by: ${result.result.triggeredBy || "manual"}`
      );

      if (result.result.errors && result.result.errors.length > 0) {
        console.log("⚠️ Errors encountered:");
        result.result.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }

      // Test status endpoint
      console.log("\n🔍 Testing status endpoint...");
      const statusResponse = await fetch(SYNC_ENDPOINT, { method: "GET" });
      const status = await statusResponse.json();

      console.log(`📋 Sync Status: ${status.status}`);
      console.log("🔧 Configuration:");
      console.log(
        `   • Google Drive: ${status.configuration?.googleDriveConfigured ? "✅" : "❌"}`
      );
      console.log(
        `   • Blob Storage: ${status.configuration?.blobConfigured ? "✅" : "❌"}`
      );
      console.log(
        `   • Service Account: ${status.configuration?.serviceAccountConfigured ? "✅" : "❌"}`
      );
      console.log(
        `   • Cron Schedule: ${status.cronSchedule || "Not configured"}`
      );
    } else {
      console.error("❌ Sync failed:");
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${result.error || "Unknown error"}`);
      console.error(`   Details: ${result.details || "No details available"}`);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.error(
        "💡 Make sure the development server is running: npm run dev"
      );
    }
  }
}

// Export for programmatic use
module.exports = { testSync };

// Run if called directly
if (require.main === module) {
  testSync().catch(console.error);
}
