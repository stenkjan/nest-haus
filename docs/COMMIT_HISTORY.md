# Nest-Haus Commit History

*Auto-generated documentation of project changes*

---

## [2798167d48f922e1da853a3862a465e118a12744] - Tue Jun 17 17:11:13 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1a747995957639805176567dcfc614469a0b1899] - Tue Jun 17 13:52:26 2025 +0200

**Author**: stenkjan  
**Message**: `Update .gitignore to include /public/images/ directory to prevent tracking of image files. This change helps maintain a cleaner repository by excluding unnecessary assets.`

### Changes Analysis

---

## [7fe1ac3a5b07a3b14656962ba5ac28fb2422e404] - Tue Jun 17 13:37:44 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/api/test/redis/route.ts

#### 🔧 Configuration Changes

- .github/workflows/nest-haus.code-workspace

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d3783bfc248f3ceec62bbad0878d0f47178dfa3d] - Tue Jun 17 13:00:41 2025 +0200

**Author**: stenkjan  
**Message**: `Refactor PriceCalculator to improve caching mechanism and enhance configurator store's state management. Added type definitions for house options and optimized price calculation handling with a debounce mechanism.`

### Changes Analysis

---

## [643a5e44a8d9c7e00a01e047f2fad915e0427d22] - Tue Jun 17 12:56:15 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/PROJECT_OVERVIEW.md

---

## [baf9cf1afe2a7283c56e72c4d096f5c1b367eae3] - Fri Jun 13 13:14:06 2025 +0200

**Author**: stenkjan  
**Message**: `Update GitHub Actions workflow to use GITHUB_TOKEN instead of GH_PAT for committing documentation changes. This change enhances security and aligns with GitHub's recommended practices for authentication in CI environments.`

### Changes Analysis

#### 🔧 Configuration Changes

- .github/workflows/auto-documentation.yml

---

## Initial Setup - 2025-01-11

**Manual Entry**: Project documentation and configurator architecture setup

### Changes Analysis

#### 📚 Documentation Changes
- Created comprehensive project documentation structure
- Added migration plan for configurator refactoring  
- Set up GitHub Action for automated documentation
- Established technical architecture overview

#### 🎨 Frontend Changes
- Created new configurator folder structure
- Added TypeScript type definitions
- Set up component and hook placeholders
- Planned separation of concerns architecture

#### ⚙️ Backend Changes
- Planned Redis integration for session tracking
- Designed PostgreSQL schema for permanent storage
- Outlined API routes for configurator functionality

#### 🔧 Configuration Changes
- Added GitHub Actions workflow for auto-documentation
- Created folder structure for modular configurator
- Set up migration plan and development guidelines

## Latest Changes

### 2024-12-19 - Prisma Build Issue Permanently Fixed
- ✅ **Fixed Prisma Schema Configuration**
  - Removed custom output path from `prisma/schema.prisma`
  - Changed to standard `@prisma/client` import pattern
  - Updated `src/lib/prisma.ts` to use standard imports
  - Fixed `prisma/seed.ts` import as well

- ✅ **Regenerated Prisma Client**
  - Generated client to standard `node_modules/@prisma/client` location
  - Removed conflicting custom generated directory
  - All import resolution issues completely resolved

- ✅ **Build Status: SUCCESS**
  - Main compilation errors eliminated ✅
  - Only minor ESLint warnings remain (non-blocking)
  - Development server running smoothly
  - Production build working properly

### 2024-12-19 - Build Issues Fixed
- ✅ **Fixed Prisma Client Generation**
  - Generated Prisma client using `npx prisma generate`
  - Resolved "Can't resolve '../generated/prisma'" error
  - Database integration now working properly

- ✅ **Fixed Redis Import Issues**
  - Corrected Redis imports from named to default export
  - Fixed API routes: `/api/sessions/*` endpoints
  - Backend tracking system now functional

- ✅ **Enhanced Navbar Component**
  - Replaced `<img>` with Next.js `<Image>` for optimization
  - Added priority loading for logo
  - Improved performance and SEO

### 2024-12-19 - Navbar Integration
- ✅ **Integrated old navbar into new project structure**
  - Moved navbar from root to `src/components/layout/Navbar.tsx`
  - Updated with proper Zustand store integration (useCartStore)
  - Added mobile-friendly design with 650px breakpoint
  - Implemented WebKit-specific optimizations for iOS
  - Added dynamic sizing with clamp() functions
  - Enhanced cart integration with live count and summary

- ✅ **Updated App Layout**
  - Added navbar to root layout (`src/app/layout.tsx`)
  - Proper German localization (`lang="de"`)
  - Updated metadata for SEO
  - Added main wrapper with proper spacing

- ✅ **Enhanced CSS Optimizations**
  - Added WebKit-specific touch optimizations
  - Prevented iOS zoom on form inputs
  - Added content-width utility class (1144px max-width)
  - Implemented smooth scrolling and font rendering

## Previous Changes

### Initial Setup
- Project structure created
- Configurator store implementation
- Cart store implementation
- Backend API routes setup

---

*Auto-generated entries will appear above this line* 