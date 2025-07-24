/**
 * Enhanced Google Drive Sync Test Script
 *
 * This script tests the Google Drive sync with:
 * - Extended date range support (July 9-23 recovery)
 * - Full sync capability
 * - Better debugging for missed files
 * - Safety checks to prevent data loss
 *
 * Usage:
 * - node scripts/test-sync.js                    (standard 24h sync)
 * - node scripts/test-sync.js --days 15          (15-day lookback for July 9-23)
 * - node scripts/test-sync.js --full             (full sync of ALL images)
 * - node scripts/test-sync.js --config           (configuration check only)
 * - node scripts/test-sync.js --debug            (detailed debugging)
 */

const https = require("https");

// Configuration
const SYNC_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://your-app.vercel.app/api/sync/google-drive"
    : "http://localhost:3000/api/sync/google-drive";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "MAINJAJANest";

// Parse command line arguments
const args = process.argv.slice(2);
const configOnly = args.includes("--config");
const fullSync = args.includes("--full");
const debugMode = args.includes("--debug");
const daysIndex = args.indexOf("--days");
const days =
  daysIndex !== -1 && args[daysIndex + 1] ? parseInt(args[daysIndex + 1]) : 1;

async function testConfiguration() {
  console.log("🔧 Testing Google Drive Sync Configuration...");
  console.log(`📍 Endpoint: ${SYNC_ENDPOINT}`);

  try {
    const response = await fetch(SYNC_ENDPOINT, { method: "GET" });
    const status = await response.json();

    console.log("\n📋 Configuration Status:");
    console.log(
      `   • Overall Status: ${status.status === "ready" ? "✅ Ready" : "❌ Not Ready"}`
    );
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
    console.log(
      `   • Last Check: ${new Date(status.timestamp).toLocaleString()}`
    );

    if (status.status !== "ready") {
      console.log(
        "\n❌ Configuration issues detected. Please resolve before running sync."
      );
      return false;
    }

    console.log("\n✅ Configuration looks good!");
    return true;
  } catch (error) {
    console.error("❌ Configuration check failed:", error.message);
    return false;
  }
}

async function testSync() {
  console.log("🧪 Testing Google Drive Sync...");

  // Determine sync type
  if (fullSync) {
    console.log(
      "🚨 FULL SYNC MODE: Will process ALL images regardless of modification date"
    );
    console.log("⚠️  This is safe but will take longer and process more files");
  } else if (days > 1) {
    console.log(`📅 EXTENDED SYNC MODE: Looking back ${days} days`);
    console.log(
      `📅 This covers from ${new Date(Date.now() - days * 24 * 60 * 60 * 1000).toLocaleDateString()} to today`
    );
    if (days >= 15) {
      console.log("✅ This should catch the July 9-23 period you mentioned");
    }
  } else {
    console.log("📅 STANDARD SYNC MODE: 24-hour change detection");
  }

  try {
    // Create authorization header
    const credentials = Buffer.from(
      `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
    ).toString("base64");

    // Build URL with parameters
    let syncUrl = SYNC_ENDPOINT;
    const params = new URLSearchParams();

    if (fullSync) {
      params.append("fullSync", "true");
    } else if (days > 1) {
      params.append("days", days.toString());
    }

    if (params.toString()) {
      syncUrl += "?" + params.toString();
    }

    console.log(`📍 Request URL: ${syncUrl}`);
    console.log("🔄 Starting sync...\n");

    // Make the request
    const response = await fetch(syncUrl, {
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
      console.log(`   • Sync Type: ${result.result.syncType || "standard"}`);
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

      // Analyze results for July 9-23 recovery
      if (days >= 15 || fullSync) {
        console.log("\n🔍 July 9-23 Recovery Analysis:");
        if (result.result.recentChangesFound >= 3) {
          console.log(
            "✅ Good! Found multiple changes - likely includes images 17, 12, and 49"
          );
        } else if (result.result.recentChangesFound === 1) {
          console.log(
            "⚠️  Only found 1 change - this might be why images 17 and 12 were missed"
          );
          console.log(
            "💡 Try running with --full to ensure all images are processed"
          );
        } else {
          console.log(
            "❌ No recent changes found - this explains the missing updates"
          );
        }
      }

      if (result.result.errors && result.result.errors.length > 0) {
        console.log("\n⚠️ Errors encountered:");
        result.result.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }

      // Check why automatic sync might not be working
      if (debugMode) {
        console.log("\n🔍 Automatic Sync Diagnosis:");
        console.log(
          "   • Vercel cron jobs only work in PRODUCTION deployments"
        );
        console.log(
          "   • Local development (localhost:3000) does NOT trigger cron"
        );
        console.log(
          "   • Check Vercel dashboard > Functions > Cron for production logs"
        );
        console.log("   • Cron is configured for 2:00 AM UTC daily");
      }
    } else {
      console.error("❌ Sync failed:");
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${result.error || "Unknown error"}`);
      console.error(`   Details: ${result.details || "No details available"}`);

      if (result.details && result.details.includes("Safety check failed")) {
        console.log(
          "\n🛡️  Safety check prevented mass deletion - this is GOOD!"
        );
        console.log(
          "💡 The system protected your data from accidental bulk deletions"
        );
      }
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

async function main() {
  console.log("🚀 Enhanced Google Drive Sync Test\n");

  // Show usage if no valid args
  if (args.length === 0) {
    console.log("📖 Usage Options:");
    console.log(
      "   node scripts/test-sync.js                    (standard 24h sync)"
    );
    console.log(
      "   node scripts/test-sync.js --days 15          (15-day lookback for July 9-23)"
    );
    console.log(
      "   node scripts/test-sync.js --full             (full sync of ALL images)"
    );
    console.log(
      "   node scripts/test-sync.js --config           (configuration check only)"
    );
    console.log(
      "   node scripts/test-sync.js --debug            (detailed debugging)"
    );
    console.log("\n🎯 For your July 9-23 recovery, try:");
    console.log("   node scripts/test-sync.js --days 15");
    console.log("\n");
  }

  // Always check configuration first
  const configOk = await testConfiguration();

  if (!configOk) {
    console.log("\n❌ Stopping due to configuration issues");
    process.exit(1);
  }

  // If config-only requested, stop here
  if (configOnly) {
    console.log("\n✅ Configuration check complete");
    return;
  }

  // Confirmation for extended/full sync
  if (days > 7 || fullSync) {
    console.log("\n⚠️  EXTENDED SYNC REQUESTED");
    console.log("   This will process more images than usual");
    console.log("   Safety checks are in place to prevent data loss");
    console.log("   Continuing in 3 seconds...\n");
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  // Run the sync test
  await testSync();
}

// Export for programmatic use
module.exports = { testSync, testConfiguration };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
