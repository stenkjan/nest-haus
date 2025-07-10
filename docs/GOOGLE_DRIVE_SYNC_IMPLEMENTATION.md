# Google Drive Sync Implementation Guide

## Overview

The Google Drive sync system has been enhanced to implement efficient daily synchronization with the following key features:

- **24-hour change detection**: Only syncs files modified in the last 24 hours
- **Number-based image replacement**: Removes old images by number and uploads new ones with proper hashes
- **Name change handling**: Updates images.ts when file names change
- **Vercel-style hash generation**: Generates proper 26-character hashes for uploaded files
- **Daily automated scheduling**: Runs once per day via Vercel cron

## Key Features Implemented

### ✅ 24-Hour Change Detection

- The sync now filters Google Drive files to only process those modified in the last 24 hours
- This prevents unnecessary processing of unchanged files
- Significantly improves performance for daily sync operations

### ✅ Number-Based Image Replacement

- When a file with an existing number is found in Google Drive:
  1. The old image in Vercel Blob is deleted by number
  2. The new image is uploaded with a proper hash
  3. Images.ts constants are updated with new paths

### ✅ Proper Hash Generation

- Generates Vercel-style 26-character alphanumeric hashes
- Ensures consistent naming: `images/123-title-name-hash26chars.jpg`
- Maintains compatibility with existing blob structure

### ✅ Images.ts Auto-Update

- Automatically updates `src/constants/images.ts` when file names change
- Preserves existing constants while adding new ones
- Updates existing constants when file names change

### ✅ Daily Scheduling

- Configured in `vercel.json` to run daily at 02:00 UTC
- Uses Vercel cron for reliable scheduling
- Can also be triggered manually via admin panel

## File Changes Made

### 1. Enhanced GoogleDriveSync.ts

```typescript
// NEW: 24-hour change detection
private async fetchDriveImages(folderId: string, isMobile: boolean): Promise<DriveImage[]>

// NEW: Change-based sync operations
private calculateChangeBasedSyncOperations(
  allDriveImages: DriveImage[],
  recentlyModified: DriveImage[],
  blobImages: BlobImage[]
): SyncOperations

// NEW: Hash generation for uploads
private async uploadImageToBlobWithHash(driveImg: DriveImage): Promise<void>
```

Key improvements:

- **Performance**: Only processes recently changed files
- **Safety**: Conservative approach to prevent data loss
- **Efficiency**: Minimizes API calls and processing time
- **Reliability**: Proper error handling and rollback mechanisms

### 2. Updated API Route

- Enhanced logging and result reporting
- Added `recentChangesFound` tracking
- Improved error handling for edge cases

### 3. Updated Test Script

- Tests both sync functionality and status endpoint
- Validates configuration and permissions
- Provides detailed output for debugging

## How It Works

### Daily Sync Process

1. **Initialization**
   - Authenticates with Google Drive using service account
   - Validates configuration and permissions

2. **Change Detection** (NEW)
   - Fetches all images from both Google Drive folders
   - Identifies files modified in the last 24 hours
   - If no recent changes, exits early for efficiency

3. **Sync Operations**
   - For each recently modified file:
     - If new number: Upload as new image
     - If existing number: Delete old → Upload new with hash
   - Generates proper Vercel-style hashes for all uploads

4. **Constants Update**
   - Updates `src/constants/images.ts` with new paths
   - Preserves existing constants
   - Updates changed file names

### File Naming Convention

**Google Drive Format:**

```
123-NEST-Haus-Konfigurator-Modul-Fassadenplatten-Weiss.jpg
164-NEST-Haus-Konfigurator-Modul-Fassadenplatten-Weiss-Steirische-Eiche-Parkett-Eiche.jpg
```

**Vercel Blob Format (with generated hash):**

```
images/123-NEST-Haus-Konfigurator-Modul-Fassadenplatten-Weiss-abcdef1234567890123456.jpg
images/164-NEST-Haus-Konfigurator-Modul-Fassadenplatten-Weiss-Steirische-Eiche-Parkett-Eiche-abcdef1234567890123456.jpg
```

**Images.ts Constants:**

```typescript
plattenweiss_eiche_parkett: "164-NEST-Haus-Konfigurator-Modul-Fassadenplatten-Weiss-Steirische-Eiche-Parkett-Eiche-abcdef1234567890123456";
```

## Usage

### Automated Daily Sync

The sync runs automatically every day at 02:00 UTC via Vercel cron:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/sync/google-drive",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### Manual Sync Trigger

**Via Admin Panel:**

- Visit `/admin/sync`
- Click "Run Sync" button

**Via API (requires admin credentials):**

```bash
curl -X POST https://your-app.vercel.app/api/sync/google-drive \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)" \
  -H "Content-Type: application/json"
```

**Via Test Script:**

```bash
# Set environment variables in .env.local:
# ADMIN_USERNAME=your_admin_username
# ADMIN_PASSWORD=your_admin_password

node scripts/test-sync.js
```

## Configuration

### Required Environment Variables

```bash
# Google Drive Configuration
GOOGLE_DRIVE_MAIN_FOLDER_ID=your_main_folder_id
GOOGLE_DRIVE_MOBILE_FOLDER_ID=your_mobile_folder_id

# Vercel Blob Configuration
BLOB_READ_WRITE_TOKEN=your_blob_token

# Admin Authentication
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

### Required Files

- `service-account-key.json` in project root (Google Drive service account key)

## Safety Features

### Conservative Approach

- **Never deletes bulk content**: Only replaces images with matching numbers
- **24-hour scope**: Only processes recently changed files
- **Protected patterns**: Preserves critical images (animations, home button, etc.)
- **Error recovery**: Automatic rollback on failures

### Validation Checks

- **Configuration validation**: Ensures all required environment variables are set
- **Authentication testing**: Verifies Google Drive API access
- **File parsing**: Validates image naming conventions
- **Content preservation**: Never removes existing constants unless replaced

## Monitoring and Debugging

### Sync Status Endpoint

```bash
GET /api/sync/google-drive
```

Returns:

```json
{
  "status": "ready",
  "configuration": {
    "googleDriveConfigured": true,
    "blobConfigured": true,
    "serviceAccountConfigured": true
  },
  "cronSchedule": "Daily at 02:00 UTC"
}
```

### Sync Results

```json
{
  "success": true,
  "result": {
    "recentChangesFound": 3,
    "processed": 3,
    "uploaded": 1,
    "updated": 2,
    "deleted": 2,
    "duration": 1250,
    "imagesUpdated": true,
    "errors": []
  }
}
```

### Logging

The sync provides detailed console logging:

- 🕐 Change detection timestamps
- 🆕 Recently modified files
- 📤 New uploads with hashes
- 🔄 File replacements
- 📝 Constants updates
- ⚠️ Warnings and errors

## Performance Optimization

### Efficiency Improvements

- **Early exit**: Skips processing if no recent changes
- **Targeted operations**: Only processes modified files
- **Minimal API calls**: Reduces Google Drive API usage
- **Smart caching**: Leverages existing blob cache mechanisms

### Expected Performance

- **No changes**: ~100-500ms (early exit)
- **Few changes (1-5 files)**: ~2-10 seconds
- **Many changes (10+ files)**: ~30-120 seconds

## Error Handling

### Common Issues and Solutions

**Authentication Errors:**

```
Solution: Check service-account-key.json and environment variables
```

**Rate Limiting:**

```
Solution: Sync runs once daily to avoid rate limits
```

**File Parsing Errors:**

```
Solution: Ensure Google Drive files follow naming convention: NUMBER-TITLE.EXT
```

**Blob Upload Failures:**

```
Solution: Check BLOB_READ_WRITE_TOKEN and network connectivity
```

## Testing

### Test the Implementation

```bash
# Start development server
npm run dev

# Run test script
node scripts/test-sync.js
```

### Verify Results

1. Check console output for sync results
2. Verify `src/constants/images.ts` updates
3. Confirm new blob images have proper hashes
4. Test image loading in configurator

## Migration from Previous Version

### What Changed

- **Focus on efficiency**: Only processes recent changes instead of all files
- **Proper hash generation**: Consistent with Vercel's naming convention
- **Enhanced safety**: Better protection against accidental deletions
- **Improved logging**: More detailed output for debugging

### Backward Compatibility

- **Existing constants preserved**: No breaking changes to images.ts
- **Same API endpoints**: No changes to external interfaces
- **Same file structure**: Maintains existing blob organization

This implementation ensures reliable, efficient daily synchronization while providing the exact functionality requested: 24-hour change detection, number-based replacement, proper hash generation, and automatic constants updates.
