# Google Drive to Vercel Blob Sync System

A clean, efficient daily synchronization system that syncs images from Google Drive folders to Vercel Blob storage and automatically updates your `images.ts` constants.

## Features

- ✅ **Smart Duplicate Handling**: Number-based priority with Google Drive title taking precedence
- ✅ **Automatic Constants Update**: Auto-updates `src/constants/images.ts` with new paths
- ✅ **Daily Scheduled Sync**: Runs automatically via Vercel cron
- ✅ **Manual Trigger**: Admin panel control for on-demand syncing
- ✅ **Efficient Operations**: Minimal API calls, batch processing
- ✅ **Easy Removal**: Clean deconstruction when no longer needed
- ✅ **Error Handling**: Graceful failure with detailed logging

## Architecture

```
Google Drive Folders → Google Drive API → Vercel Blob Storage → images.ts Update
     ↓                      ↓                    ↓                    ↓
Main Folder            Smart Sync           Blob Management      Constants Update
Mobile Folder          Deduplication        (Upload/Update)      (Auto-generated)
```

## Setup Guide

### 1. Environment Variables

Add these to your `.env` and `.env.local` files:

```bash
# Google Drive Configuration
GOOGLE_DRIVE_MAIN_FOLDER_ID=your_main_folder_id
GOOGLE_DRIVE_MOBILE_FOLDER_ID=your_mobile_folder_id

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_blob_token

# Admin Authentication (for manual sync)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Service Account (file-based)
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=service-account-key.json
```

### 2. Google Service Account

Ensure your `service-account-key.json` file is in the project root with the correct Google Drive API permissions.

### 3. Deployment

The system automatically configures via `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/sync/google-drive",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Cron Schedule**: Daily at 2:00 AM UTC

## Usage

### Automatic Sync (Recommended)

The system runs automatically every day at 2 AM UTC. No intervention required.

### Manual Sync

#### Via Admin Panel
1. Navigate to `/admin/sync`
2. Check configuration status
3. Click "Trigger Manual Sync"
4. Enter admin credentials
5. Monitor results

#### Via API
```bash
curl -X POST https://your-domain.com/api/sync/google-drive \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)" \
  -H "Content-Type: application/json"
```

#### Via Development Script
```bash
# Full sync test
node scripts/test-sync.js

# Configuration check only
node scripts/test-sync.js --config
```

## How It Works

### 1. Image Naming Convention

Google Drive images must follow this format:
```
{number} - {title}.{extension}
```

Examples:
- `100 - NEST-Haus-Konfigurator-75-Fassadenplatten-Schwarz-Ansicht.jpg`
- `001 - homebutton-nest-haus.svg`

### 2. Sync Logic

1. **Fetch**: Get images from both Google Drive folders
2. **Compare**: Compare with existing Vercel Blob images by number
3. **Smart Update**: If same number exists with different title:
   - Google Drive title takes priority
   - Delete old blob, upload new one
4. **Upload New**: Add images that don't exist in blob storage
5. **Clean Up**: Remove blob images that no longer exist in Drive
6. **Update Constants**: Automatically update `images.ts` with new paths

### 3. Duplicate Handling Priority

```
Google Drive: "123 - New Title.jpg"
Vercel Blob:  "123 - Old Title.jpg"
Result:       "123 - New Title.jpg" (Drive wins)
```

### 4. Constants Mapping

The system intelligently maps image numbers and titles to constant keys:

```typescript
// Number 100 with title "NEST-Haus-Konfigurator-75-Fassadenplatten-Schwarz"
// Becomes:
nest75_plattenschwarz: '100-NEST-Haus-Konfigurator-75-Fassadenplatten-Schwarz'
```

## Configuration Categories

### Hero Images (1-8)
Landing page images automatically mapped to `IMAGES.hero.*`

### Function Images (12-39)
Process/function images mapped to `IMAGES.function.*`

### Configuration Images (100-199)
Configurator images with smart material/size detection mapped to `IMAGES.configurations.*`

### Team Images (998-999)
About/team images mapped to `IMAGES.aboutus.*`

## Monitoring & Status

### Status Endpoint
```
GET /api/sync/google-drive
```

Returns configuration status and health check.

### Admin Panel
- Real-time configuration validation
- Last sync results
- Manual trigger capability
- Removal instructions

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Check service account key file exists
   - Verify Google Drive API permissions
   - Ensure folder IDs are correct

2. **Blob Upload Errors**
   - Verify `BLOB_READ_WRITE_TOKEN` is valid
   - Check Vercel Blob quotas
   - Ensure file sizes are within limits

3. **Constants Update Failures**
   - Check `images.ts` file permissions
   - Verify file structure matches expected format
   - Review error logs for syntax issues

### Debug Mode

Enable detailed logging by setting:
```bash
NODE_ENV=development
```

## Performance Considerations

### Efficient Design
- **Batch Operations**: Processes all images in optimized batches
- **Smart Caching**: Avoids redundant API calls
- **Parallel Processing**: Uploads/updates run concurrently where possible
- **Minimal Network**: Only processes images that actually changed

### Rate Limits
- Google Drive API: 1000 requests per 100 seconds per user
- Vercel Blob: No specific limits (usage-based billing)

### Execution Time
- Function timeout: 5 minutes (300 seconds)
- Typical execution: 30-60 seconds for ~100 images
- Progress logging throughout process

## Easy Removal Guide

When you no longer need the sync functionality:

### 1. Automatic Removal Helper
```javascript
import { removeSyncModule } from '@/lib/sync';

await removeSyncModule(); // Shows removal instructions
```

### 2. Manual Removal Steps

1. **Delete Files**:
   ```bash
   rm -rf src/lib/sync/
   rm -rf src/app/api/sync/google-drive/
   rm -rf src/app/admin/sync/
   rm scripts/test-sync.js
   ```

2. **Update package.json**:
   ```bash
   npm uninstall googleapis
   ```

3. **Update vercel.json**:
   Remove the `crons` section

4. **Clean Environment**:
   Remove Google Drive related environment variables

5. **Remove Service Account**:
   ```bash
   rm service-account-key.json
   ```

## Security Notes

- Service account key should be kept secure and not committed to version control
- Admin credentials are required for manual sync triggers
- Vercel Blob token should be kept private
- All sensitive data is handled server-side only

## API Reference

### POST /api/sync/google-drive
Triggers manual sync.

**Authentication**: Basic Auth (admin credentials)
**Response**: Sync result with detailed statistics

### GET /api/sync/google-drive
Gets sync status and configuration.

**Authentication**: None required
**Response**: Configuration health check

## Development

### Local Testing
```bash
# Check configuration
node scripts/test-sync.js --config

# Run full sync test
node scripts/test-sync.js

# Test via admin panel
npm run dev
# Navigate to http://localhost:3000/admin/sync
```

### Adding New Image Categories

To add support for new image number ranges:

1. Update `ImagesConstantsUpdater.inferCategory()`
2. Update `ImagesConstantsUpdater.generateConstantKey()`
3. Add new category to `images.ts` structure

## Support

For issues or questions:
1. Check the admin panel status first
2. Review server logs for detailed error messages
3. Use the test script for local debugging
4. Verify all environment variables are set correctly

## Version History

- **v1.0.0**: Initial release with full sync functionality
- Smart duplicate handling
- Automatic constants updates
- Daily cron scheduling
- Admin panel interface
- Easy removal system 