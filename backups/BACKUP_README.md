# Analytics Backup System - README

## Overview

This directory contains automated backups of the Hoam-House analytics database. Backups are created monthly and stored in Vercel Blob Storage as compressed `.json.gz` files.

## What's Included in Each Backup

Each backup file contains a complete snapshot of all analytics data:

### 1. **User Sessions** (`UserSession`)
- Session IDs and tracking identifiers
- IP addresses and user agents
- Geographic location data (country, city, coordinates)
- Traffic sources and referral information
- Visit counts and timestamps
- Session status and duration
- Configuration data (if available)

### 2. **Interaction Events** (`InteractionEvent`)
- Click tracking data
- Page navigation events
- Element interactions
- Timestamps and session associations
- Event categories and types

### 3. **Selection Events** (`SelectionEvent`)
- Configurator selections
- Option choices
- Category selections
- User preferences
- Timestamps

### 4. **Performance Metrics** (`PerformanceMetric`)
- Page load times
- API response times
- Resource loading metrics
- Performance snapshots

## Backup Schedule

- **Automated Backups**: 1st of every month at 2:00 AM UTC
- **Manual Backups**: Available via Admin Dashboard → Quick Actions → "Create Backup Now"

## File Format

Backups are stored as compressed JSON files with the following structure:

```
analytics-backup-YYYY-MM-DDTHH-mm-ss.json.gz
```

Example: `analytics-backup-2024-11-20T02-00-00.json.gz`

### Compression Details
- Format: gzip compression (`.json.gz`)
- Compression ratio: ~80-90% size reduction
- Can be decompressed with any standard tool (gunzip, 7-Zip, WinRAR, etc.)

### Internal Structure

```json
{
  "metadata": {
    "backupDate": "2024-11-20T02:00:00.000Z",
    "version": "1.0",
    "recordCounts": {
      "sessions": 1250,
      "interactions": 8420,
      "selections": 3150,
      "metrics": 950
    }
  },
  "sessions": [...],      // Array of UserSession records
  "interactions": [...],  // Array of InteractionEvent records
  "selections": [...],    // Array of SelectionEvent records
  "metrics": [...]        // Array of PerformanceMetric records
}
```

## How to Download Backups

### Option 1: Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project → Storage → Blob
3. Find backup files (filter by `analytics-backup-`)
4. Click to download

### Option 2: Direct URL
- Backups are accessible via public URLs provided when created
- URLs are displayed in the Admin Dashboard after manual backups
- Check monthly cron job logs for automated backup URLs

### Option 3: Admin Dashboard
- After creating a manual backup, a download link is provided
- Click "Download Backup" to get the file directly

## How to Restore a Backup

### Prerequisites
- Node.js and npm installed
- Access to the project repository
- Database access credentials (in `.env` files)

### Step-by-Step Restoration

1. **Download the backup file**
   ```bash
   # Place the backup file in your project directory
   # Example: ./analytics-backup-2024-11-20T02-00-00.json.gz
   ```

2. **Run the restoration script**
   ```bash
   npm run restore-backup -- ./path/to/backup.json.gz
   ```

3. **Confirm the restoration**
   - The script will show you what data will be restored
   - Type `yes` to confirm and proceed
   - Type `no` to cancel

4. **Wait for completion**
   - The script will decompress the backup
   - Clear existing data (with your confirmation)
   - Restore all records in the correct order
   - Display a summary of restored records

### Restoration Order

Data is restored in the following order to maintain referential integrity:

1. User Sessions (parent records)
2. Interaction Events (references sessions)
3. Selection Events (references sessions)
4. Performance Metrics (independent)

### Important Notes

⚠️ **Warning**: Restoration will **delete all existing analytics data** before restoring the backup. This action cannot be undone.

✅ **Best Practice**: Create a fresh backup before restoring an old one, so you can revert if needed.

## Manual vs Automated Backups

### Automated Backups (Monthly)
- Run automatically on the 1st of each month at 2:00 AM UTC
- No user intervention required
- Logged in Vercel cron job logs
- Stored in Vercel Blob Storage

### Manual Backups (On-Demand)
- Triggered via Admin Dashboard → Quick Actions
- Useful before major changes or data cleanup
- Provides immediate download link
- Also stored in Vercel Blob Storage

## Backup Retention Policy

- **Current Policy**: Backups are kept **indefinitely**
- **Storage**: Vercel Blob Storage (check your plan limits)
- **Manual Cleanup**: You can delete old backups via Vercel Dashboard if needed

### Recommended Cleanup Schedule
- Keep all monthly backups for at least 12 months
- Archive older backups to external storage if needed
- Delete backups older than 24 months (optional)

## Troubleshooting

### Backup Creation Fails
- Check Vercel Blob Storage quotas
- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check database connection
- Review logs in Vercel Dashboard

### Restoration Fails
- Ensure backup file is not corrupted (try decompressing manually)
- Verify database credentials are correct
- Check for sufficient disk space
- Ensure database schema matches backup version

### File Too Large
- Backups grow with data size
- Compression reduces size by ~80-90%
- Consider cleaning up old data periodically
- Monitor Vercel Blob Storage usage

## Manual Decompression

If you need to inspect a backup without restoring:

### Linux/Mac
```bash
gunzip -c analytics-backup-2024-11-20T02-00-00.json.gz > backup.json
```

### Windows (PowerShell)
```powershell
# Use 7-Zip or WinRAR
# Or use PowerShell:
[System.IO.Compression.GZipStream]::new(...)
```

### Node.js Script
```javascript
const fs = require('fs');
const zlib = require('zlib');

const input = fs.createReadStream('backup.json.gz');
const output = fs.createWriteStream('backup.json');
input.pipe(zlib.createGunzip()).pipe(output);
```

## Support

For issues or questions:
1. Check Vercel logs for cron job status
2. Review Admin Dashboard for manual backup results
3. Inspect backup file integrity
4. Contact system administrator

## Version History

- **v1.0** (November 2024): Initial backup system implementation
  - Monthly automated backups
  - Manual backup capability
  - Compressed storage in Vercel Blob
  - Restoration script included

