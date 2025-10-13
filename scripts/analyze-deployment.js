#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Deployment Size Analyzer
 * Analyzes what files are being deployed and their sizes
 */

function analyzeDeploymentSize() {
  console.log("📊 Analyzing deployment size...\n");

  const rootDir = process.cwd();
  const excludePatterns = [
    /node_modules/,
    /\.git/,
    /\.next\/cache/,
    /\.vercel/,
    /coverage/,
    /\.DS_Store/,
    /\.log$/,
  ];

  function shouldExclude(filePath) {
    return excludePatterns.some((pattern) => pattern.test(filePath));
  }

  function getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch {
      return 0;
    }
  }

  function analyzeDirectory(dirPath, basePath = "") {
    const results = [];

    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        const relativePath = path.join(basePath, item.name);

        if (shouldExclude(relativePath)) continue;

        if (item.isDirectory()) {
          const subResults = analyzeDirectory(fullPath, relativePath);
          results.push(...subResults);
        } else {
          const size = getFileSize(fullPath);
          if (size > 0) {
            results.push({
              path: relativePath,
              size: size,
              type: path.extname(item.name) || "no-ext",
            });
          }
        }
      }
    } catch (error) {
      console.log(`⚠️  Cannot read directory: ${dirPath}`);
    }

    return results;
  }

  const files = analyzeDirectory(rootDir);

  // Sort by size (largest first)
  files.sort((a, b) => b.size - a.size);

  // Calculate totals by type
  const typeStats = {};
  let totalSize = 0;

  files.forEach((file) => {
    totalSize += file.size;
    if (!typeStats[file.type]) {
      typeStats[file.type] = { count: 0, size: 0 };
    }
    typeStats[file.type].count++;
    typeStats[file.type].size += file.size;
  });

  // Show largest files
  console.log("🔍 Largest files in deployment:");
  files.slice(0, 15).forEach((file) => {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    console.log(`  ${sizeMB.padStart(8)}MB  ${file.path}`);
  });

  // Show stats by file type
  console.log("\n📈 Size by file type:");
  Object.entries(typeStats)
    .sort(([, a], [, b]) => b.size - a.size)
    .slice(0, 10)
    .forEach(([ext, stats]) => {
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`  ${sizeMB.padStart(8)}MB  ${ext} (${stats.count} files)`);
    });

  console.log(
    `\n📦 Total deployment size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`
  );

  // Recommendations
  const largeDirs = ["docs", "preiskalkulation", "scripts", "src/test"];
  console.log("\n💡 Optimization recommendations:");

  largeDirs.forEach((dir) => {
    const dirFiles = files.filter((f) => f.path.startsWith(dir));
    if (dirFiles.length > 0) {
      const dirSize = dirFiles.reduce((sum, f) => sum + f.size, 0);
      const sizeMB = (dirSize / 1024 / 1024).toFixed(2);
      console.log(
        `  • ${dir}/: ${sizeMB}MB - consider excluding from deployment`
      );
    }
  });

  // Check for large individual files
  const largeFiles = files.filter((f) => f.size > 5 * 1024 * 1024); // > 5MB
  if (largeFiles.length > 0) {
    console.log("\n⚠️  Large files detected (>5MB):");
    largeFiles.forEach((file) => {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      console.log(`  • ${file.path}: ${sizeMB}MB`);
    });
  }
}

// Main execution
analyzeDeploymentSize();
