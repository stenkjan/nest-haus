# Cache Cleaning Scripts for Nest-Haus

## Overview

These scripts fix the common webpack module resolution error that occurs after installing new dependencies:

```
TypeError: Cannot read properties of undefined (reading 'call')
```

## Available Scripts

### 1. Node.js Script (Recommended)
```bash
# Clean cache only
npm run cache:fix
# or
node scripts/clean-cache.js

# Clean cache and restart dev server
npm run cache:fix:restart
# or
node scripts/clean-cache.js --restart
```

### 2. Windows Batch Script
```cmd
scripts\clean-cache.bat
```

### 3. Manual Commands
```bash
# Kill Node processes (Windows)
taskkill /F /IM node.exe

# Delete webpack cache
rm -rf .next

# Restart dev server
npm run dev
```

## When to Use

Use these scripts when you encounter:

1. **Webpack module resolution errors** after `npm install`
2. **Build failures** with undefined module references
3. **Hot reload issues** after adding new dependencies
4. **TypeScript compilation errors** that seem cache-related

## Script Features

### Node.js Script (`clean-cache.js`)
- ✅ Cross-platform (Windows/Unix)
- ✅ Comprehensive cache cleaning
- ✅ Optional dev server restart
- ✅ Detailed progress reporting
- ✅ Error handling and recovery

### Windows Batch Script (`clean-cache.bat`)
- ✅ Native Windows batch file
- ✅ Simple double-click execution
- ✅ Visual progress feedback
- ✅ Pause at end for review

## Workflow Integration

### After Installing Dependencies
```bash
npm install some-package
npm run cache:fix:restart
```

### Before Important Builds
```bash
npm run cache:fix
npm run build
```

### Development Troubleshooting
```bash
# If hot reload stops working
npm run cache:fix:restart

# If TypeScript errors seem stale
npm run cache:fix
npm run typecheck
```

## What Gets Cleaned

1. **`.next/`** - Next.js build cache and webpack cache
2. **`node_modules/.cache/`** - Node modules cache
3. **`.turbo/`** - Turborepo cache (if present)
4. **`~/.npm/_cacache`** - Global npm cache (partial)

## Troubleshooting

### Script Doesn't Run
- Ensure you're in the project root directory
- Check that Node.js is installed and accessible
- Verify script permissions (Unix: `chmod +x scripts/clean-cache.js`)

### Cache Issues Persist
1. Try manual cache clearing: `rm -rf .next node_modules/.cache`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check for TypeScript configuration issues
4. Verify all imports are correctly spelled and exported

### Development Server Won't Start
- Check if port 3000 is still in use: `netstat -an | findstr :3000`
- Try a different port: `npm run dev -- --port 3001`
- Restart your terminal/IDE

## Project Rules Compliance

This script implements the **MANDATORY FIX WORKFLOW** from the project rules:

1. ✅ Kill all node processes
2. ✅ Delete webpack cache (.next directory)  
3. ✅ Restart dev server (optional)

Following the principle: *"Never assume hot reload will pick up new package installations. Always clear .next cache and restart after adding dependencies."*
