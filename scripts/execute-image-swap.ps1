# Image Name Swap Execution Script for NEST-Haus
# PowerShell script to safely execute the image name swap operation
# 
# This script will:
# 1. Run verification first to ensure safety
# 2. Ask for confirmation before proceeding
# 3. Execute the swap with progress reporting
# 4. Handle any errors gracefully

param(
    [switch]$SkipVerification,
    [switch]$Force,
    [switch]$DryRun
)

Write-Host "🚀 NEST-Haus Image Name Swap Execution Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Error "❌ Node.js not found. Please install Node.js to continue."
    exit 1
}

# Check if required environment variables are set
$requiredEnvVars = @(
    "GOOGLE_DRIVE_MAIN_FOLDER_ID",
    "GOOGLE_DRIVE_MOBILE_FOLDER_ID", 
    "GOOGLE_SERVICE_ACCOUNT_KEY",
    "BLOB_READ_WRITE_TOKEN"
)

$missingVars = @()
foreach ($var in $requiredEnvVars) {
    if (-not $env:$var) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Error "❌ Missing required environment variables: $($missingVars -join ', ')"
    Write-Host "Please ensure these are set in your .env file" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ All required environment variables found" -ForegroundColor Green
Write-Host ""

# Step 1: Run verification (unless skipped)
if (-not $SkipVerification) {
    Write-Host "🔍 Running verification first..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        $verifyResult = node scripts/verify-image-swap.js
        if ($LASTEXITCODE -ne 0) {
            Write-Error "❌ Verification failed. Please check the output above."
            Write-Host "You can skip verification with -SkipVerification flag if needed" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host ""
        Write-Host "✅ Verification completed successfully" -ForegroundColor Green
        Write-Host ""
        
        # Check if verification report exists
        if (Test-Path "image-swap-verification-report.json") {
            $report = Get-Content "image-swap-verification-report.json" | ConvertFrom-Json
            
            Write-Host "📊 Verification Summary:" -ForegroundColor Cyan
            Write-Host "   • Target images found: $($report.summary.totalTargetImages)" -ForegroundColor White
            Write-Host "   • Valid swap pairs: $($report.summary.validPairs)" -ForegroundColor White
            Write-Host "   • Issues detected: $($report.issues.Count)" -ForegroundColor White
            Write-Host ""
            
            if ($report.issues.Count -gt 0) {
                Write-Host "⚠️ Issues detected during verification:" -ForegroundColor Yellow
                foreach ($issue in $report.issues) {
                    Write-Host "   • $issue" -ForegroundColor Yellow
                }
                Write-Host ""
                
                if (-not $Force) {
                    $continue = Read-Host "Continue despite issues? (y/N)"
                    if ($continue -ne "y" -and $continue -ne "Y") {
                        Write-Host "❌ Aborted by user" -ForegroundColor Red
                        exit 1
                    }
                }
            }
            
            if ($report.summary.validPairs -eq 0) {
                Write-Host "ℹ️ No valid swap pairs found. Nothing to do." -ForegroundColor Blue
                exit 0
            }
        }
        
    } catch {
        Write-Error "❌ Error during verification: $_"
        exit 1
    }
} else {
    Write-Host "⚠️ Skipping verification (not recommended)" -ForegroundColor Yellow
    Write-Host ""
}

# Step 2: Confirmation (unless forced or dry run)
if (-not $Force -and -not $DryRun) {
    Write-Host "🔄 About to execute image name swap operation" -ForegroundColor Yellow
    Write-Host "This will modify:" -ForegroundColor Yellow
    Write-Host "   • Google Drive file names" -ForegroundColor Yellow
    Write-Host "   • Vercel Blob storage" -ForegroundColor Yellow
    Write-Host "   • src/constants/images.ts file" -ForegroundColor Yellow
    Write-Host ""
    
    $confirm = Read-Host "Are you sure you want to proceed? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "❌ Aborted by user" -ForegroundColor Red
        exit 0
    }
    Write-Host ""
}

# Step 3: Execute the swap
if ($DryRun) {
    Write-Host "🧪 DRY RUN MODE: Would execute swap but no changes will be made" -ForegroundColor Magenta
} else {
    Write-Host "🔄 Executing image name swap..." -ForegroundColor Green
}

Write-Host ""

try {
    if ($DryRun) {
        # For dry run, just run verification again
        $result = node scripts/verify-image-swap.js
    } else {
        # Execute the actual swap
        $result = node scripts/image-name-swap.js
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Image swap operation completed successfully!" -ForegroundColor Green
        Write-Host ""
        
        if (-not $DryRun) {
            Write-Host "📋 Next steps:" -ForegroundColor Cyan
            Write-Host "   1. Verify the changes in your applications" -ForegroundColor White
            Write-Host "   2. Test image loading in the configurator" -ForegroundColor White
            Write-Host "   3. Check that all images display correctly" -ForegroundColor White
            Write-Host "   4. Consider running a sync to update any caches" -ForegroundColor White
            Write-Host ""
            
            # Offer to run a sync
            $runSync = Read-Host "Would you like to run a Google Drive sync now to update the system? (y/N)"
            if ($runSync -eq "y" -or $runSync -eq "Y") {
                Write-Host "🔄 Running Google Drive sync..." -ForegroundColor Yellow
                try {
                    # Use curl to call the sync API (works in PowerShell)
                    $syncResult = Invoke-RestMethod -Uri "http://localhost:3000/api/sync/google-drive?fullSync=true" -Method POST
                    Write-Host "✅ Sync completed successfully" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️ Sync failed or server not running. You can run it manually later." -ForegroundColor Yellow
                    Write-Host "   URL: http://localhost:3000/api/sync/google-drive?fullSync=true" -ForegroundColor White
                }
            }
        }
        
    } else {
        Write-Error "❌ Image swap operation failed. Check the output above for details."
        exit 1
    }
    
} catch {
    Write-Error "❌ Error during swap execution: $_"
    exit 1
}

Write-Host ""
Write-Host "✅ All done!" -ForegroundColor Green
