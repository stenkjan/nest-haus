# Configurator Migration Plan

## 🎯 Migration Overview

**Current State**: Single 2432-line `Configurator.tsx` component with complex state management  
**Target State**: Modular architecture with separated concerns and clean state management  
**Migration Type**: Incremental refactor (not rewrite) to minimize risk  

---

## 📊 Current Architecture Analysis

### **Problems in Legacy Code**
1. **Monolithic Component**: Single file handling UI, state, business logic, and tracking
2. **Complex State Dependencies**: Multiple useEffect hooks with potential circular dependencies
3. **Mixed Concerns**: Price calculation, image management, tracking all in one place
4. **Performance Issues**: Unnecessary re-renders, inefficient scroll handling
5. **Mobile/Desktop Coupling**: Complex responsive logic mixed with business logic
6. **Testing Difficulties**: Hard to unit test individual functions

### **What Works Well (Keep)**
- ✅ Price calculation logic (extract and preserve)
- ✅ Selection validation rules
- ✅ Image preview system concept
- ✅ Mobile optimization patterns
- ✅ User interaction tracking approach

---

## 🗺️ Migration Strategy

### **Phase 1: Extract Business Logic (Week 1)**
**Goal**: Separate pure functions from React components

#### **Step 1.1: Extract Price Calculator**
```typescript
// BEFORE (in Configurator.tsx)
const calculateCombinationPrice = (nest, gebaeude, innen, fussboden) => {
  // 50+ lines of complex logic
}

// AFTER (new file: src/configurator/core/PriceCalculator.ts)
export class PriceCalculator {
  static calculateBasePrice(nestType: string): number
  static calculateCombinationPrice(selections: ConfigurationSelections): number
  static calculateTotalPrice(configuration: Configuration): number
}
```

#### **Step 1.2: Extract Interaction Tracking**
```typescript
// BEFORE (mixed in Configurator.tsx)
useEffect(() => {
  // tracking logic mixed with UI logic
}, [selections])

// AFTER (new file: src/configurator/core/InteractionTracker.ts)
export class InteractionTracker {
  static trackSelection(event: SelectionEvent): void
  static trackPageExit(configuration: Configuration): void
  static saveSession(sessionData: UserSession): Promise<void>
}
```

#### **Step 1.3: Extract Image Management**
```typescript
// BEFORE (complex preview logic in component)
const getPreviewImagePath = (selections, viewIndex) => {
  // complex switch statements and conditionals
}

// AFTER (new file: src/configurator/core/ImageManager.ts)
export class ImageManager {
  static getPreviewImage(selections: Selections, view: ViewType): string
  static preloadImages(configuration: Configuration): Promise<void>
  static getAvailableViews(selections: Selections): ViewType[]
}
```

**Deliverables**:
- [ ] `PriceCalculator.ts` with unit tests
- [ ] `InteractionTracker.ts` with Redis integration
- [ ] `ImageManager.ts` with caching logic
- [ ] Types definitions moved to separate files

---

### **Phase 2: Create New Component Structure (Week 2)**
**Goal**: Build new components alongside legacy (gradual replacement)

#### **Step 2.1: Create Shell Components**
```typescript
// New main container
src/configurator/components/ConfiguratorShell.tsx
├── PreviewPanel.tsx          // Image display + navigation
├── SelectionPanel.tsx        // All house option categories  
└── SummaryPanel.tsx          // Price summary + checkout
```

#### **Step 2.2: Extract Selection Logic**
```typescript
// Reusable selection components
src/configurator/components/
├── SelectionBox.tsx          // Individual option (cleaned up)
├── QuantitySelector.tsx      // PV modules, fenster m² 
├── PackageSelector.tsx       // Planning packages
└── InfoBox.tsx              // Info dialogs
```

#### **Step 2.3: Create Custom Hooks**
```typescript
// Clean state management
src/configurator/hooks/
├── useConfiguratorState.ts   // Main configuration state
├── usePriceCalculation.ts    // Price updates with debouncing
├── useInteractionTracking.ts // User behavior tracking
└── useImagePreview.ts        // Preview image management
```

**Deliverables**:
- [ ] New component structure created
- [ ] Legacy components gradually replaced
- [ ] Custom hooks with proper dependency management
- [ ] Mobile/desktop layouts separated

---

### **Phase 3: Database Integration (Week 3)**
**Goal**: Implement Redis session tracking and PostgreSQL persistence

#### **Step 3.1: Redis Session Setup**
```typescript
// Session management
src/configurator/core/SessionManager.ts
├── createSession()           // New user session
├── updateSession()           // Track selections
├── saveSessionSnapshot()     // Periodic backups
└── finalizeSession()         // Page exit handling
```

#### **Step 3.2: PostgreSQL Integration**
```sql
-- New database tables
CREATE TABLE user_sessions (
  session_id UUID PRIMARY KEY,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP,
  last_activity TIMESTAMP,
  configuration_data JSONB,
  status session_status
);

CREATE TABLE selection_events (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES user_sessions(session_id),
  timestamp TIMESTAMP,
  category VARCHAR,
  selection VARCHAR,
  previous_selection VARCHAR,
  time_spent_ms INTEGER
);
```

#### **Step 3.3: API Routes for Tracking**
```typescript
// New API endpoints
src/app/api/configurator/
├── session/route.ts          // Session CRUD operations
├── track/route.ts            // Selection tracking
└── analytics/route.ts        // Admin dashboard data
```

**Deliverables**:
- [ ] Redis integration for real-time tracking
- [ ] PostgreSQL schema for persistent storage  
- [ ] API routes for session management
- [ ] Background job for session cleanup

---

### **Phase 4: Performance Optimization (Week 4)**
**Goal**: Optimize performance and user experience

#### **Step 4.1: Optimistic Updates**
```typescript
// Reduce API calls with optimistic UI updates
src/configurator/hooks/useOptimisticUpdates.ts
├── updateSelectionLocally()   // Immediate UI update
├── batchTrackingEvents()      // Batch multiple events
└── syncWithServer()           // Background synchronization
```

#### **Step 4.2: Image Optimization**
```typescript
// Improved image handling
src/configurator/core/ImageOptimizer.ts
├── preloadCriticalImages()    // Load next likely images
├── lazyLoadNonCritical()      // Progressive loading
└── optimizeForViewport()      // Responsive image sizes
```

#### **Step 4.3: Mobile Performance**
```typescript
// Mobile-specific optimizations
src/configurator/mobile/
├── MobileGestureHandler.ts    // Touch interactions
├── MobileLayoutOptimizer.ts   // Viewport handling
└── MobileImageCache.ts        // Efficient image caching
```

**Deliverables**:
- [ ] Optimistic UI updates implemented
- [ ] Image loading optimized
- [ ] Mobile performance improved
- [ ] Memory usage minimized

---

## 🔄 Migration Execution Plan

### **Week 1: Foundation**
```bash
# Day 1-2: Setup new folder structure
mkdir -p src/configurator/{core,components,hooks,types,constants}

# Day 3-4: Extract PriceCalculator
# Move calculation logic to separate file
# Add unit tests for price calculations

# Day 5: Extract InteractionTracker
# Create tracking system foundation
```

### **Week 2: Components**
```bash
# Day 1-2: Create ConfiguratorShell
# New main container component

# Day 3-4: Extract PreviewPanel & SelectionPanel  
# Separate UI concerns

# Day 5: Create custom hooks
# Clean state management
```

### **Week 3: Database**
```bash
# Day 1-2: Setup Redis integration
# Session tracking foundation

# Day 3-4: PostgreSQL schema migration
# Create new tables for tracking

# Day 5: API routes implementation
# Backend for configurator data
```

### **Week 4: Polish**
```bash
# Day 1-2: Performance optimization
# Implement optimistic updates

# Day 3-4: Mobile improvements
# Enhanced mobile experience

# Day 5: Testing & documentation
# Ensure everything works correctly
```

---

## 📋 Migration Checklist

### **Pre-Migration**
- [ ] Create feature branch for migration
- [ ] Backup current configurator component
- [ ] Setup testing environment
- [ ] Document current behavior for comparison

### **During Migration**
- [ ] Maintain backward compatibility during transition
- [ ] Test each phase thoroughly before proceeding
- [ ] Monitor performance metrics
- [ ] Gather user feedback on changes

### **Post-Migration**
- [ ] Remove legacy code after new version is stable
- [ ] Update documentation
- [ ] Create admin dashboard for analytics
- [ ] Monitor error rates and performance

---

## ⚠️ Risk Management

### **High Risk Areas**
1. **Price Calculation Changes**: Could affect customer orders
   - **Mitigation**: Extensive unit testing, price validation
   
2. **Mobile Layout Regressions**: Could hurt user experience  
   - **Mitigation**: Progressive enhancement, fallback mechanisms
   
3. **State Management Bugs**: Could cause data loss
   - **Mitigation**: Optimistic updates with server sync

### **Rollback Plan**
1. Keep legacy component available as fallback
2. Feature flag to switch between old/new versions
3. Monitoring alerts for increased error rates
4. Quick rollback procedure documented

---

## 📈 Success Metrics

### **Technical Improvements**
- [ ] Reduce bundle size by 30%+
- [ ] Improve page load time by 20%+
- [ ] Reduce memory usage on mobile
- [ ] Increase test coverage to 80%+

### **User Experience**
- [ ] Maintain or improve conversion rates
- [ ] Reduce bounce rate on configurator
- [ ] Improve mobile usability scores
- [ ] Increase time spent configuring

### **Developer Experience**
- [ ] Reduce time to add new features
- [ ] Easier debugging and maintenance
- [ ] Better code organization
- [ ] Improved documentation

---

*Migration planned for: 4 weeks*  
*Risk level: Medium*  
*Team size: 2 developers* 