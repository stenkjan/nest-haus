#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Cache Optimization Script
 * Reduces build cache size and improves build performance
 */

const cacheDir = path.join(process.cwd(), ".next", "cache");
const maxCacheSize = 200 * 1024 * 1024; // 200MB limit

function getDirectorySize(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += fs.statSync(filePath).size;
    }
  }
  return totalSize;
}

function cleanOldCache() {
  if (!fs.existsSync(cacheDir)) return;

  const currentSize = getDirectorySize(cacheDir);
  console.log(
    `📊 Current cache size: ${(currentSize / 1024 / 1024).toFixed(2)}MB`
  );

  if (currentSize > maxCacheSize) {
    console.log("🧹 Cache exceeds 200MB limit, cleaning...");

    // Remove webpack cache (can be rebuilt quickly)
    const webpackCache = path.join(cacheDir, "webpack");
    if (fs.existsSync(webpackCache)) {
      fs.rmSync(webpackCache, { recursive: true, force: true });
      console.log("✅ Removed webpack cache");
    }

    // Remove old image cache
    const imageCache = path.join(cacheDir, "images");
    if (fs.existsSync(imageCache)) {
      const imageCacheSize = getDirectorySize(imageCache);
      if (imageCacheSize > 50 * 1024 * 1024) {
        // 50MB
        fs.rmSync(imageCache, { recursive: true, force: true });
        console.log("✅ Removed large image cache");
      }
    }

    const newSize = getDirectorySize(cacheDir);
    console.log(`✨ New cache size: ${(newSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(
      `💾 Saved: ${((currentSize - newSize) / 1024 / 1024).toFixed(2)}MB`
    );
  } else {
    console.log("✅ Cache size is within limits");
  }
}

function optimizeNodeModules() {
  console.log("🔍 Checking for unused dependencies...");

  // Check for large packages that might not be needed
  const nodeModulesPath = path.join(process.cwd(), "node_modules");
  const largePackages = ["@google-cloud", "aws-sdk", "mongodb", "mysql2", "pg"];

  largePackages.forEach((pkg) => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`⚠️  Found large package: ${pkg} (consider if needed)`);
    }
  });
}

// Main execution
console.log("🚀 Starting cache optimization...");
cleanOldCache();
optimizeNodeModules();
console.log("✨ Cache optimization complete!");
