/**
 * Google Drive Sync Module
 * 
 * Easy-to-remove sync functionality for Google Drive to Vercel Blob
 * 
 * Usage:
 * - Automatic: Daily cron job via Vercel
 * - Manual: Admin panel or direct API call
 * - Testing: Development utilities
 */

export { GoogleDriveSync } from './GoogleDriveSync';
export { ImagesConstantsUpdater } from './ImagesConstantsUpdater';

export type {
  DriveImage,
  BlobImage,
  SyncResult
} from './GoogleDriveSync';

export type {
  ImageMapping
} from './ImagesConstantsUpdater';

/**
 * Manual sync trigger utility
 * Can be used from admin panel or development scripts
 */
export async function triggerManualSync(adminCredentials?: { username: string; password: string }) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const syncUrl = `${baseUrl}/api/sync/google-drive`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth header if credentials provided
    if (adminCredentials) {
      const { username, password } = adminCredentials;
      const credentials = Buffer.from(`${username}:${password}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    }

    console.log('🚀 Triggering manual Google Drive sync...');

    const response = await fetch(syncUrl, {
      method: 'POST',
      headers
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Sync failed: ${result.error || 'Unknown error'}`);
    }

    console.log('✅ Manual sync completed:', result);
    return result;

  } catch (error) {
    console.error('❌ Manual sync failed:', error);
    throw error;
  }
}

/**
 * Get sync status
 */
export async function getSyncStatus() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const statusUrl = `${baseUrl}/api/sync/google-drive`;

    const response = await fetch(statusUrl, { method: 'GET' });
    const status = await response.json();

    return status;
  } catch (error) {
    console.error('❌ Failed to get sync status:', error);
    throw error;
  }
}

/**
 * Development utility: Check if sync is properly configured
 */
export function validateSyncConfiguration(): {
  isValid: boolean;
  missing: string[];
  recommendations: string[]
} {
  const required = [
    'GOOGLE_DRIVE_MAIN_FOLDER_ID',
    'GOOGLE_DRIVE_MOBILE_FOLDER_ID',
    'BLOB_READ_WRITE_TOKEN',
    'ADMIN_PASSWORD'
  ];

  const missing = required.filter(env => !process.env[env]);

  const recommendations = [];

  if (missing.length > 0) {
    recommendations.push('Set missing environment variables in .env.local');
  }

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
    recommendations.push('Ensure service-account-key.json exists in project root');
  }

  return {
    isValid: missing.length === 0,
    missing,
    recommendations
  };
}

/**
 * Easy removal utility
 * Call this function to cleanly remove all sync functionality
 */
export async function removeSyncModule(): Promise<{
  removed: string[];
  instructions: string[];
}> {
  const filesToRemove = [
    'src/lib/sync/GoogleDriveSync.ts',
    'src/lib/sync/ImagesConstantsUpdater.ts',
    'src/lib/sync/index.ts',
    'src/app/api/sync/google-drive/route.ts'
  ];

  const instructions = [
    '1. Remove Google Drive sync files (listed in "removed" array)',
    '2. Remove "googleapis" from package.json dependencies',
    '3. Remove crons section from vercel.json',
    '4. Remove Google Drive environment variables from .env files',
    '5. Remove service-account-key.json file',
    '6. Update admin panel to remove sync UI components',
    '7. Run npm install to clean up dependencies'
  ];

  console.log('📋 To remove Google Drive sync module:');
  instructions.forEach(instruction => console.log(`   ${instruction}`));

  return {
    removed: filesToRemove,
    instructions
  };
} 