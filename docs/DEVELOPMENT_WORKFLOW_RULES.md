# Development Workflow Rules

## Mandatory Documentation Requirements

### **CRITICAL: Commit History Documentation**

**ALWAYS REQUIRED**: Every commit must be documented in `docs/COMMIT_HISTORY.md`

#### **Commit History Documentation Standards**

1. **Immediate Documentation**: Update `docs/COMMIT_HISTORY.md` immediately after every commit
2. **Format Requirements**:
   - Commit hash (full SHA)
   - Author name
   - Commit timestamp
   - Detailed commit message
   - Categorized changes analysis

3. **Change Categories**:
   - 🎨 **Frontend Changes**: React components, UI updates, styling
   - 🔧 **Backend Changes**: API routes, server logic, middleware
   - 🗄️ **Database Changes**: Schema updates, migrations, queries
   - 📚 **Documentation Changes**: README updates, docs additions
   - 🚀 **Performance Changes**: Optimizations, bundle improvements
   - 🔒 **Security Changes**: Authentication, authorization, protection
   - 🧪 **Testing Changes**: Test additions, test infrastructure
   - 📦 **Dependency Changes**: Package updates, new dependencies

4. **Required Documentation Template**:

```markdown
## [COMMIT_HASH] - DATE

**Author**: AUTHOR_NAME
**Message**: `COMMIT_MESSAGE`

### Changes Analysis

#### 🎨 Frontend Changes

- file/path/changed.tsx
- another/file.ts

#### 🔧 Backend Changes

- api/route/file.ts

#### 📚 Documentation Changes

- docs/file.md

---
```

### **Automation Requirements**

1. **GitHub Actions Integration**: ✅ **AUTOMATED** - The existing `.github/workflows/auto-documentation.yml` automatically updates `docs/COMMIT_HISTORY.md` on every push to main/develop branches
2. **Workflow Features**:
   - Automatically extracts commit hash, author, date, and message
   - Categorizes changes into Frontend, Backend, Configuration, and Documentation
   - Updates commit history with proper formatting and emojis
   - Commits documentation updates back to repository
3. **Manual Verification**: Developers should verify that the automated documentation accurately reflects their changes

### **Documentation Quality Standards**

1. **Completeness**: Every file change must be categorized and listed
2. **Accuracy**: Commit hashes and timestamps must be exact
3. **Consistency**: Use consistent formatting and emoji categories
4. **Searchability**: Include relevant keywords for easy searching

### **Enforcement Rules**

- **AUTOMATED COMPLIANCE**: The GitHub Actions workflow automatically handles commit history documentation
- **VERIFICATION REQUIRED**: Developers should verify that automated documentation is accurate and complete
- **MANUAL UPDATES**: If automated documentation misses important context, manually update `docs/COMMIT_HISTORY.md`
- **QUALITY REVIEW**: Periodically review commit history for completeness and accuracy
- **TEAM RESPONSIBILITY**: All team members must ensure the automated system is functioning correctly

## Additional Development Workflow Rules

### **Server Management**

- Check for existing running servers (localhost:3000) before starting new server
- Leverage Next.js hot reload instead of restarting unnecessarily
- Use background processes for development server starts

### **Code Quality**

- Run `npm run lint` before every commit
- Fix TypeScript errors immediately
- Use proper type definitions (never `any`)
- Follow established patterns and architecture

### **Testing Requirements**

- Maintain test coverage standards
- Run tests before major commits
- Update tests when changing functionality

### **Performance Monitoring**

- Track bundle size changes
- Monitor build times (target: <2 minutes)
- Optimize dependencies and remove unused packages

---

**This document is part of the always-applied project rules and must be followed without exception.**
