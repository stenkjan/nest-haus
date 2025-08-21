/**
 * Image Name Swap Verification Script
 *
 * SAFE MODE: Analyzes and reports what changes would be made
 * WITHOUT actually making any changes to Google Drive, Vercel Blob, or files
 *
 * Use this to verify the swap plan before executing the actual swap
 */

// Load environment variables
require("dotenv").config();

const { google } = require("googleapis");
const { list } = require("@vercel/blob");
const fs = require("fs/promises");

/**
 * VerificationResult structure:
 * {
 *   targetImages: {
 *     drive: Array of {id, name, number, hasSteirischemEiche, hasHolzNatur}
 *     blob: Array of {url, pathname, number, hasSteirischemEiche, hasHolzNatur}
 *     imagesConstants: Array of {key, value, number, hasSteirischemEiche, hasHolzNatur}
 *   },
 *   swapPairs: Array of {image1, image2, wouldSwapTo},
 *   issues: Array of strings,
 *   summary: {totalTargetImages, validPairs, orphanedImages, missingInBlob, missingInConstants}
 * }
 */

class ImageSwapVerifier {
  constructor() {
    this.mainFolderId = process.env.GOOGLE_DRIVE_MAIN_FOLDER_ID || "";
    this.mobileFolderId = process.env.GOOGLE_DRIVE_MOBILE_FOLDER_ID || "";

    if (!this.mainFolderId || !this.mobileFolderId) {
      throw new Error(
        "Missing Google Drive folder IDs in environment variables"
      );
    }
  }

  async verify() {
    const result = {
      targetImages: { drive: [], blob: [], imagesConstants: [] },
      swapPairs: [],
      issues: [],
      summary: {
        totalTargetImages: 0,
        validPairs: 0,
        orphanedImages: 0,
        missingInBlob: 0,
        missingInConstants: 0,
      },
    };

    try {
      console.log("🔍 VERIFICATION MODE: Analyzing image swap requirements...");
      console.log(
        '📋 Target: Images 134-173 with "steirische-eiche" or "holz-natur"'
      );

      // Initialize Google Drive
      await this.initializeGoogleAuth();

      // Step 1: Analyze Google Drive images
      console.log("\n📁 Analyzing Google Drive images...");
      result.targetImages.drive = await this.analyzeGoogleDriveImages();

      // Step 2: Analyze Vercel Blob images
      console.log("💾 Analyzing Vercel Blob images...");
      result.targetImages.blob = await this.analyzeBlobImages();

      // Step 3: Analyze images.ts constants
      console.log("📄 Analyzing images.ts constants...");
      result.targetImages.imagesConstants = await this.analyzeImagesConstants();

      // Step 4: Create swap pairs and validate
      console.log("\n🔗 Creating swap pairs...");
      result.swapPairs = this.createSwapPairs(result.targetImages.drive);

      // Step 5: Validate consistency across systems
      console.log("✅ Validating consistency...");
      this.validateConsistency(result);

      // Step 6: Generate summary
      this.generateSummary(result);

      return result;
    } catch (error) {
      console.error("❌ Verification failed:", error);
      result.issues.push(
        `Verification error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      return result;
    }
  }

  async initializeGoogleAuth() {
    try {
      let serviceAccountKey;

      if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
        const keyFile = await fs.readFile(
          process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
          "utf8"
        );
        serviceAccountKey = JSON.parse(keyFile);
      } else {
        throw new Error("No Google service account credentials found");
      }

      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccountKey,
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      this.drive = google.drive({ version: "v3", auth });
      console.log("✅ Google Drive authentication initialized");
    } catch (error) {
      throw new Error(
        `Google Drive auth failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async analyzeGoogleDriveImages() {
    const images = [];

    const folderIds = [this.mainFolderId, this.mobileFolderId];

    for (const folderId of folderIds) {
      try {
        const response = await this.drive.files.list({
          q: `'${folderId}' in parents and trashed=false`,
          fields: "files(id, name)",
          pageSize: 1000,
        });

        if (response.data.files) {
          for (const file of response.data.files) {
            if (!file.name || !file.id) continue;

            const numberMatch = file.name.match(/^(\d+)-/);
            if (numberMatch) {
              const number = parseInt(numberMatch[1], 10);
              const nameLower = file.name.toLowerCase();

              if (number >= 134 && number <= 173) {
                const hasSteirischemEiche =
                  nameLower.includes("steirische-eiche");
                const hasHolzNatur = nameLower.includes("holz-natur");

                if (hasSteirischemEiche || hasHolzNatur) {
                  images.push({
                    id: file.id,
                    name: file.name,
                    number,
                    hasSteirischemEiche,
                    hasHolzNatur,
                  });
                  console.log(
                    `🎯 Found: ${file.name} (${hasSteirischemEiche ? "steirische-eiche" : "holz-natur"})`
                  );
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error scanning folder ${folderId}:`, error);
      }
    }

    return images.sort((a, b) => a.number - b.number);
  }

  async analyzeBlobImages() {
    try {
      const { blobs } = await list();
      const images = [];

      for (const blob of blobs) {
        const numberMatch = blob.pathname.match(/(\d+)-/);
        if (numberMatch) {
          const number = parseInt(numberMatch[1], 10);
          const pathnameLower = blob.pathname.toLowerCase();

          if (number >= 134 && number <= 173) {
            const hasSteirischemEiche =
              pathnameLower.includes("steirische-eiche");
            const hasHolzNatur = pathnameLower.includes("holz-natur");

            if (hasSteirischemEiche || hasHolzNatur) {
              images.push({
                url: blob.url,
                pathname: blob.pathname,
                number,
                hasSteirischemEiche,
                hasHolzNatur,
              });
              console.log(`🎯 Found blob: ${blob.pathname}`);
            }
          }
        }
      }

      return images.sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error("❌ Error analyzing blob images:", error);
      return [];
    }
  }

  async analyzeImagesConstants() {
    try {
      const imagesFilePath = `${process.cwd()}/src/constants/images.ts`;
      const content = await fs.readFile(imagesFilePath, "utf8");

      const constants = [];

      // Find all string assignments in the configurations section
      const configMatch = content.match(/configurations:\s*{([\s\S]*?)}/);
      if (configMatch) {
        const configContent = configMatch[1];
        const assignments = configContent.match(
          /(\w+):\s*['"`]([^'"`]+)['"`]/g
        );

        if (assignments) {
          for (const assignment of assignments) {
            const match = assignment.match(/(\w+):\s*['"`]([^'"`]+)['"`]/);
            if (match) {
              const [, key, value] = match;
              const numberMatch = value.match(/^(\d+)-/);

              if (numberMatch) {
                const number = parseInt(numberMatch[1], 10);
                const valueLower = value.toLowerCase();

                if (number >= 134 && number <= 173) {
                  const hasSteirischemEiche =
                    valueLower.includes("steirische-eiche");
                  const hasHolzNatur = valueLower.includes("holz-natur");

                  if (hasSteirischemEiche || hasHolzNatur) {
                    constants.push({
                      key,
                      value,
                      number,
                      hasSteirischemEiche,
                      hasHolzNatur,
                    });
                    console.log(`🎯 Found constant: ${key} = ${value}`);
                  }
                }
              }
            }
          }
        }
      }

      return constants.sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error("❌ Error analyzing images constants:", error);
      return [];
    }
  }

  createSwapPairs(driveImages) {
    const pairs = [];
    const processed = new Set();

    for (const image of driveImages) {
      if (processed.has(image.number)) continue;

      // Extract the base pattern (everything except the wood type)
      const basePattern = this.extractBasePattern(image.name);
      if (!basePattern) continue;

      // Find the matching pair with opposite wood type and same base pattern
      const matchingImage = driveImages.find(
        (img) =>
          !processed.has(img.number) &&
          img.number !== image.number &&
          img.hasSteirischemEiche !== image.hasSteirischemEiche && // Opposite wood type
          this.extractBasePattern(img.name) === basePattern // Same base configuration
      );

      if (matchingImage) {
        pairs.push({
          image1: {
            number: image.number,
            name: image.name,
            type: image.hasSteirischemEiche ? "steirische-eiche" : "holz-natur",
          },
          image2: {
            number: matchingImage.number,
            name: matchingImage.name,
            type: matchingImage.hasSteirischemEiche
              ? "steirische-eiche"
              : "holz-natur",
          },
          wouldSwapTo: {
            image1NewName: this.swapWoodType(image.name),
            image2NewName: this.swapWoodType(matchingImage.name),
          },
        });

        processed.add(image.number);
        processed.add(matchingImage.number);

        console.log(
          `🔗 Pair ${image.number} (${image.hasSteirischemEiche ? "SE" : "HN"}) ↔ ${matchingImage.number} (${matchingImage.hasSteirischemEiche ? "SE" : "HN"})`
        );
      }
    }

    return pairs;
  }

  // Extract base pattern by removing wood type and number
  extractBasePattern(name) {
    // Remove file extension first
    const baseName = name.replace(/\.[^.]+$/, "");

    // Remove the wood type part to get the base configuration
    return baseName
      .replace(/\d+-/, "") // Remove number prefix
      .replace(/steirische-eiche/gi, "WOOD_TYPE")
      .replace(/holz-natur/gi, "WOOD_TYPE");
  }

  // Swap the wood type in the name
  swapWoodType(name) {
    if (name.toLowerCase().includes("steirische-eiche")) {
      return name.replace(/steirische-eiche/gi, "holz-natur");
    } else if (name.toLowerCase().includes("holz-natur")) {
      return name.replace(/holz-natur/gi, "steirische-eiche");
    }
    return name;
  }

  normalizeForComparison(name) {
    return name
      .toLowerCase()
      .replace(/steirische-eiche/g, "PATTERN")
      .replace(/holz-natur/g, "PATTERN");
  }

  validateConsistency(result) {
    // Check for orphaned images (no pairs)
    const pairedNumbers = new Set();
    result.swapPairs.forEach((pair) => {
      pairedNumbers.add(pair.image1.number);
      pairedNumbers.add(pair.image2.number);
    });

    const orphanedDrive = result.targetImages.drive.filter(
      (img) => !pairedNumbers.has(img.number)
    );
    result.summary.orphanedImages = orphanedDrive.length;

    orphanedDrive.forEach((img) => {
      result.issues.push(
        `Orphaned image in Drive: ${img.name} (no matching pair found)`
      );
    });

    // Check missing in blob
    const driveNumbers = new Set(
      result.targetImages.drive.map((img) => img.number)
    );
    const blobNumbers = new Set(
      result.targetImages.blob.map((img) => img.number)
    );
    const constantNumbers = new Set(
      result.targetImages.imagesConstants.map((img) => img.number)
    );

    driveNumbers.forEach((num) => {
      if (!blobNumbers.has(num)) {
        result.summary.missingInBlob++;
        result.issues.push(
          `Image ${num} exists in Drive but missing in Vercel Blob`
        );
      }
      if (!constantNumbers.has(num)) {
        result.summary.missingInConstants++;
        result.issues.push(
          `Image ${num} exists in Drive but missing in images.ts constants`
        );
      }
    });
  }

  generateSummary(result) {
    result.summary.totalTargetImages = result.targetImages.drive.length;
    result.summary.validPairs = result.swapPairs.length;

    console.log("\n📊 VERIFICATION SUMMARY:");
    console.log(
      `   • Total target images found: ${result.summary.totalTargetImages}`
    );
    console.log(`   • Valid swap pairs: ${result.summary.validPairs}`);
    console.log(`   • Orphaned images: ${result.summary.orphanedImages}`);
    console.log(`   • Missing in Blob: ${result.summary.missingInBlob}`);
    console.log(
      `   • Missing in Constants: ${result.summary.missingInConstants}`
    );
    console.log(`   • Issues found: ${result.issues.length}`);

    if (result.swapPairs.length > 0) {
      console.log("\n🔄 SWAP PLAN:");
      result.swapPairs.forEach((pair, index) => {
        console.log(
          `   ${index + 1}. ${pair.image1.number} (${pair.image1.type}) ↔ ${pair.image2.number} (${pair.image2.type})`
        );
        console.log(
          `      → ${pair.image1.number} will become: ${pair.wouldSwapTo.image1NewName}`
        );
        console.log(
          `      → ${pair.image2.number} will become: ${pair.wouldSwapTo.image2NewName}`
        );
      });
    }

    if (result.issues.length > 0) {
      console.log("\n⚠️ ISSUES DETECTED:");
      result.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    }
  }
}

// Export for use as module or direct execution
module.exports = { ImageSwapVerifier };

// Direct execution when run as script
if (require.main === module) {
  const verifier = new ImageSwapVerifier();
  verifier
    .verify()
    .then((result) => {
      console.log("\n✅ Verification completed!");

      if (result.issues.length === 0 && result.swapPairs.length > 0) {
        console.log("🎉 All checks passed! Ready to execute swap.");
      } else if (result.swapPairs.length === 0) {
        console.log("ℹ️ No valid swap pairs found.");
      } else {
        console.log("⚠️ Issues detected. Please review before executing swap.");
      }

      // Write detailed results to file
      fs.writeFile(
        "image-swap-verification-report.json",
        JSON.stringify(result, null, 2)
      )
        .then(() =>
          console.log(
            "📄 Detailed report saved to: image-swap-verification-report.json"
          )
        )
        .catch((err) => console.error("Failed to save report:", err));

      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Verification failed:", error);
      process.exit(1);
    });
}
