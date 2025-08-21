# Image Name Swap Scripts

This directory contains scripts to swap "steirische-eiche" and "holz-natur" in image names for images numbered 134-173 in the NEST-Haus project.

## 🎯 Purpose

Due to a naming inconsistency, images with "steirische-eiche" in their names need to be swapped with their corresponding "holz-natur" counterparts and vice versa. This affects:

- Google Drive file names
- Vercel Blob storage paths
- Constants in `src/constants/images.ts`

## 📁 Scripts Overview

### 1. `verify-image-swap.js` (SAFE - READ ONLY)
**Purpose:** Analyzes what changes would be made WITHOUT making any actual changes.

**Features:**
- Scans Google Drive, Vercel Blob, and images.ts for target images
- Identifies valid swap pairs
- Detects potential issues (orphaned images, missing files)
- Generates detailed verification report

**Usage:**
```bash
node scripts/verify-image-swap.js
```

**Output:** Creates `image-swap-verification-report.json` with detailed analysis.

### 2. `image-name-swap.js` (DESTRUCTIVE - MAKES CHANGES)
**Purpose:** Executes the actual swap operation across all systems.

**Features:**
- Swaps file names in Google Drive folders
- Updates Vercel Blob storage paths
- Updates constants in images.ts file
- Comprehensive error handling and rollback capabilities

**Usage:**
```bash
node scripts/image-name-swap.js
```

### 3. `execute-image-swap.ps1` (PowerShell Orchestrator)
**Purpose:** Safe PowerShell wrapper that orchestrates the entire process.

**Features:**
- Environment validation
- Automatic verification before execution
- User confirmation prompts
- Progress reporting
- Optional sync after completion

**Usage:**
```powershell
# Standard execution (recommended)
.\scripts\execute-image-swap.ps1

# Skip verification (not recommended)
.\scripts\execute-image-swap.ps1 -SkipVerification

# Force execution without prompts
.\scripts\execute-image-swap.ps1 -Force

# Dry run (verification only)
.\scripts\execute-image-swap.ps1 -DryRun
```

## 🔧 Prerequisites

### Environment Variables Required:
```bash
GOOGLE_DRIVE_MAIN_FOLDER_ID=13z0vc4hKuNmTtc0AQjUwnZs4_L210E-4
GOOGLE_DRIVE_MOBILE_FOLDER_ID=your_mobile_folder_id
GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_json
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### System Requirements:
- Node.js (for script execution)
- PowerShell (for orchestrator script)
- Internet access (for Google Drive and Vercel Blob APIs)

## 🚀 Recommended Execution Process

### Step 1: Verification (ALWAYS RUN FIRST)
```bash
node scripts/verify-image-swap.js
```

Review the generated `image-swap-verification-report.json` to understand:
- How many images will be affected
- Which pairs will be swapped
- Any potential issues

### Step 2: Execute Swap (PowerShell - Recommended)
```powershell
.\scripts\execute-image-swap.ps1
```

This will:
1. Run verification automatically
2. Show you the plan
3. Ask for confirmation
4. Execute the swap
5. Offer to run a sync afterward

### Step 3: Verify Results
After execution:
1. Check your configurator application
2. Verify images load correctly
3. Test that the swapped names are correct

## 🎯 Target Images

The scripts target images numbered **134-173** that contain either:
- `steirische-eiche` → will be swapped with corresponding `holz-natur` image
- `holz-natur` → will be swapped with corresponding `steirische-eiche` image

### Example Swap:
```
BEFORE:
143-NEST-Haus-Konfigurator-Modul-Fassade-Trapezblech-Schwarz-Steirische-Eiche-Kalkstein
145-NEST-Haus-Konfigurator-Modul-Fassadenplatten-Schwarz-Holz-Natur-Granit

AFTER:
143-NEST-Haus-Konfigurator-Modul-Fassade-Trapezblech-Schwarz-Holz-Natur-Kalkstein
145-NEST-Haus-Konfigurator-Modul-Fassadenplatten-Schwarz-Steirische-Eiche-Granit
```

## ⚠️ Safety Features

### Built-in Protections:
1. **Verification First:** Always analyze before changing
2. **Atomic Operations:** Either all changes succeed or none do
3. **Backup Creation:** Original names are preserved during process
4. **Rollback Capability:** Can revert changes if issues occur
5. **User Confirmation:** Multiple confirmation steps
6. **Error Handling:** Graceful failure with detailed error reporting

### What's Protected:
- Only targets specific number range (134-173)
- Only affects images with exact patterns
- Preserves all other files and structure
- Maintains image quality and metadata
- Keeps sync functionality intact

## 🔍 Troubleshooting

### Common Issues:

**"Missing environment variables"**
- Ensure all required env vars are set in `.env` file
- Check Google Service Account has proper permissions

**"No valid swap pairs found"**
- Verify images exist in the target range
- Check that both "steirische-eiche" and "holz-natur" variants exist

**"Verification failed"**
- Check internet connectivity
- Verify Google Drive and Vercel Blob access
- Ensure folder IDs are correct

**"Swap operation failed"**
- Check Google Drive permissions
- Verify Vercel Blob token has write access
- Ensure sufficient storage quota

### Recovery:
If something goes wrong:
1. The scripts include rollback mechanisms
2. Original `images.ts` is backed up before changes
3. Google Drive file history can be used for recovery
4. Vercel Blob maintains version history

## 📊 Expected Results

After successful execution:
- **Total Pairs:** ~20-30 image pairs swapped
- **Google Drive:** File names swapped in both main and mobile folders
- **Vercel Blob:** Storage paths updated with new names
- **Constants:** `src/constants/images.ts` updated with new paths
- **Functionality:** All configurator features continue working normally

## 📞 Support

If you encounter issues:
1. Check the verification report for specific problems
2. Review console output for error details
3. Ensure all prerequisites are met
4. Contact development team with error logs
