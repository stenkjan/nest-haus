#!/usr/bin/env node

/**
 * Cache Cleaning Script for Hoam-House
 * 
 * Fixes webpack module resolution errors that occur after installing new dependencies.
 * Based on project rules: "CRITICAL: Webpack Module Resolution Error Prevention"
 * 
 * Error Pattern: TypeError: Cannot read properties of undefined (reading 'call')
 * 
 * This script implements the MANDATORY FIX WORKFLOW:
 * 1. Kill all node processes
 * 2. Delete webpack cache (.next directory)
 * 3. Optionally restart dev server
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🧹 Hoam-House Cache Cleaner');
console.log('==========================');

// Check if we're on Windows (project uses Windows environment)
const isWindows = os.platform() === 'win32';

/**
 * Kill all Node.js processes
 */
function killNodeProcesses() {
  console.log('🔄 Step 1: Killing all Node.js processes...');

  try {
    if (isWindows) {
      // Windows: Use taskkill command
      execSync('taskkill /F /IM node.exe', { stdio: 'pipe' });
      console.log('✅ Node.js processes terminated (Windows)');
    } else {
      // Unix/Linux/macOS: Use pkill command
      execSync('pkill -f node', { stdio: 'pipe' });
      console.log('✅ Node.js processes terminated (Unix)');
    }
  } catch (error) {
    // It's normal for this to fail if no Node processes are running
    console.log('ℹ️  No Node.js processes found to terminate');
  }
}

/**
 * Delete webpack cache directories
 */
function deleteWebpackCache() {
  console.log('🗑️  Step 2: Deleting webpack cache (.next directory)...');

  const nextDir = path.join(process.cwd(), '.next');

  try {
    if (fs.existsSync(nextDir)) {
      // Use cross-platform removal
      if (isWindows) {
        execSync(`rmdir /s /q "${nextDir}"`, { stdio: 'pipe' });
      } else {
        execSync(`rm -rf "${nextDir}"`, { stdio: 'pipe' });
      }
      console.log('✅ .next directory deleted');
    } else {
      console.log('ℹ️  .next directory not found (already clean)');
    }
  } catch (error) {
    console.error('❌ Error deleting .next directory:', error.message);
    process.exit(1);
  }
}

/**
 * Delete additional cache directories
 */
function deleteAdditionalCaches() {
  console.log('🗑️  Step 3: Cleaning additional caches...');

  const cacheDirs = [
    path.join(process.cwd(), 'node_modules', '.cache'),
    path.join(process.cwd(), '.turbo'),
    path.join(os.homedir(), '.npm', '_cacache'),
  ];

  cacheDirs.forEach(cacheDir => {
    try {
      if (fs.existsSync(cacheDir)) {
        if (isWindows) {
          execSync(`rmdir /s /q "${cacheDir}"`, { stdio: 'pipe' });
        } else {
          execSync(`rm -rf "${cacheDir}"`, { stdio: 'pipe' });
        }
        console.log(`✅ Deleted: ${path.basename(cacheDir)}`);
      }
    } catch (error) {
      console.log(`ℹ️  Could not delete ${path.basename(cacheDir)} (may not exist)`);
    }
  });
}

/**
 * Check if development server should be restarted
 */
function checkAndRestartDev() {
  const args = process.argv.slice(2);
  const shouldRestart = args.includes('--restart') || args.includes('-r');

  if (shouldRestart) {
    console.log('🚀 Step 4: Restarting development server...');

    // Check if server is already running on port 3000
    try {
      if (isWindows) {
        const result = execSync('netstat -an | findstr :3000', { encoding: 'utf8', stdio: 'pipe' });
        if (result.trim()) {
          console.log('ℹ️  Port 3000 was in use, should be free now after process termination');
        }
      } else {
        const result = execSync('lsof -ti:3000', { encoding: 'utf8', stdio: 'pipe' });
        if (result.trim()) {
          console.log('ℹ️  Port 3000 was in use, should be free now after process termination');
        }
      }
    } catch (error) {
      // Port not in use, which is good
    }

    // Start development server
    console.log('🔄 Starting npm run dev...');
    const devProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      detached: false
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Terminating development server...');
      devProcess.kill('SIGINT');
      process.exit(0);
    });

  } else {
    console.log('ℹ️  Development server not restarted (use --restart or -r to auto-restart)');
    console.log('💡 To start manually: npm run dev');
  }
}

/**
 * Display usage information
 */
function showUsage() {
  console.log(`
Usage: node scripts/clean-cache.js [options]

Options:
  --restart, -r    Restart development server after cleaning
  --help, -h       Show this help message

Examples:
  node scripts/clean-cache.js              # Clean cache only
  node scripts/clean-cache.js --restart    # Clean cache and restart dev server
  npm run cache:fix                        # Using npm script (clean only)
  npm run cache:fix:restart                # Using npm script (clean + restart)

This script fixes webpack module resolution errors by:
1. Terminating all Node.js processes
2. Deleting .next webpack cache directory
3. Cleaning additional cache directories
4. Optionally restarting the development server
`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }

  console.log('🎯 Fixing webpack module resolution errors...\n');

  killNodeProcesses();
  deleteWebpackCache();
  deleteAdditionalCaches();

  console.log('\n✨ Cache cleaning completed successfully!');
  console.log('🔧 This should resolve webpack module resolution errors.');

  checkAndRestartDev();

  if (!args.includes('--restart') && !args.includes('-r')) {
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Test your application');
    console.log('   3. If errors persist, check for missing dependencies');
  }
}

// Run the script
main();
