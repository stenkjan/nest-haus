@echo off
REM Cache Cleaning Script for Hoam-House (Windows Batch Version)
REM Fixes webpack module resolution errors after installing new dependencies

echo 🧹 Hoam-House Cache Cleaner (Windows)
echo ====================================

echo 🔄 Step 1: Killing all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Node.js processes terminated
) else (
    echo ℹ️  No Node.js processes found to terminate
)

echo 🗑️  Step 2: Deleting webpack cache (.next directory)...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✅ .next directory deleted
) else (
    echo ℹ️  .next directory not found (already clean)
)

echo 🗑️  Step 3: Cleaning additional caches...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo ✅ Deleted: node_modules\.cache
)

if exist ".turbo" (
    rmdir /s /q ".turbo"
    echo ✅ Deleted: .turbo
)

echo.
echo ✨ Cache cleaning completed successfully!
echo 🔧 This should resolve webpack module resolution errors.
echo.
echo 📋 Next steps:
echo    1. Run: npm run dev
echo    2. Test your application
echo    3. If errors persist, check for missing dependencies
echo.
pause
