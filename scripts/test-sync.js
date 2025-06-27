#!/usr/bin/env node

/**
 * Google Drive Sync Test Script
 * 
 * Development utility to test Google Drive sync functionality
 * Run with: node scripts/test-sync.js
 */

const fs = require('fs');
const path = require('path');

// Manually load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...valueParts] = trimmed.split('=');
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          process.env[key.trim()] = value.trim();
        }
      });
    }
  } catch (error) {
    console.warn('⚠️ Could not load .env.local file:', error.message);
  }
}

// Load environment variables
loadEnvFile();

async function validateConfiguration() {
  console.log('📋 Validating configuration...');
  
  const required = [
    'GOOGLE_DRIVE_MAIN_FOLDER_ID',
    'GOOGLE_DRIVE_MOBILE_FOLDER_ID', 
    'BLOB_READ_WRITE_TOKEN',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD'
  ];

  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.error('❌ Configuration validation failed:');
    console.error('Missing environment variables:', missing);
    console.error('Recommendations:');
    console.error('   • Set missing environment variables in .env.local');
    console.error('   • Ensure service-account-key.json exists in project root');
    return false;
  }
  
  console.log('✅ Configuration valid');
  return true;
}

async function testSyncAPI() {
  console.log('📋 Testing sync API...');
  
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  try {
    // Test status endpoint first
    console.log('   🔍 Checking sync status...');
    const statusResponse = await fetch(`${baseUrl}/api/sync/google-drive`);
    const status = await statusResponse.json();
    
    console.log('   📊 Sync status:', status.status);
    console.log('   📊 Configuration valid:', status.configuration);
    
    if (status.status !== 'ready') {
      console.warn('⚠️ Sync service not ready, but continuing with test...');
    }
    
    // Prepare auth headers
    const credentials = Buffer.from(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).toString('base64');
    const headers = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    };
    
    // Test sync endpoint
    console.log('   🚀 Running sync test...');
    const syncResponse = await fetch(`${baseUrl}/api/sync/google-drive`, {
      method: 'POST',
      headers
    });
    
    const result = await syncResponse.json();
    
    if (!syncResponse.ok) {
      throw new Error(`Sync failed: ${result.error || 'Unknown error'}`);
    }
    
    // Display results
    console.log('\n📊 Sync Results:');
    console.log(`   Processed: ${result.result.processed} images`);
    console.log(`   Uploaded: ${result.result.uploaded} images`);
    console.log(`   Updated: ${result.result.updated} images`);
    console.log(`   Deleted: ${result.result.deleted} images`);
    console.log(`   Duration: ${result.result.duration}ms`);
    console.log(`   Images.ts Updated: ${result.result.imagesUpdated ? 'Yes' : 'No'}`);
    console.log(`   Triggered by: ${result.result.triggeredBy}`);
    
    if (result.result.errors && result.result.errors.length > 0) {
      console.log('\n⚠️ Errors/Warnings:');
      result.result.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    throw error;
  }
}

async function runSyncTest() {
  console.log('🧪 Google Drive Sync Test Starting...\n');

  try {
    // Step 1: Validate configuration
    const configValid = await validateConfiguration();
    if (!configValid) {
      process.exit(1);
    }
    
    console.log('');
    
    // Step 2: Test sync API
    const result = await testSyncAPI();
    
    console.log('\n✅ Test completed successfully!');
    
    return result;

  } catch (error) {
    console.error('\n❌ Sync test failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Google Drive Sync Test Script

Usage: node scripts/test-sync.js [options]

Options:
  --help, -h    Show this help message
  --config      Only validate configuration (don't run sync)

Environment Variables Required:
  GOOGLE_DRIVE_MAIN_FOLDER_ID
  GOOGLE_DRIVE_MOBILE_FOLDER_ID
  BLOB_READ_WRITE_TOKEN
  ADMIN_USERNAME
  ADMIN_PASSWORD

Files Required:
  service-account-key.json (in project root)
  `);
  process.exit(0);
}

if (args.includes('--config')) {
  console.log('🔧 Configuration Check Only\n');
  validateConfiguration().then(isValid => {
    if (isValid) {
      console.log('\n✅ All configuration checks passed!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
  return;
}

// Run the test
runSyncTest().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
}); 