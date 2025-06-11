# Configurator Architecture

## 🎯 Overview

This directory contains the **new modular configurator architecture** that will replace the legacy 2432-line `Configurator.tsx` component. The new structure separates concerns, improves performance, and enables better tracking of user interactions.

## 📁 Structure

```
src/configurator/
├── 📄 README.md                 # This file
├── 📁 core/                     # Business logic (no React)
│   ├── PriceCalculator.ts       # Price calculation logic
│   ├── InteractionTracker.ts    # User behavior tracking
│   └── ImageManager.ts          # Preview image handling
├── 📁 components/               # React UI components
│   ├── ConfiguratorShell.tsx    # Main container
│   ├── PreviewPanel.tsx         # Image preview + navigation
│   ├── SelectionPanel.tsx       # House option selections
│   └── SummaryPanel.tsx         # Price summary + checkout
├── 📁 hooks/                    # Custom React hooks
│   ├── useConfiguratorState.ts  # Main state management
│   ├── useInteractionTracking.ts # User tracking
│   └── usePriceCalculation.ts   # Price updates
├── 📁 types/                    # TypeScript definitions
│   ├── configurator.types.ts    # Core types
│   └── tracking.types.ts        # Analytics types
├── 📁 constants/                # Configuration data
│   ├── house-options.ts         # Available configurations
│   └── pricing.ts               # Price calculation rules
└── 📁 mobile/                   # Mobile-specific optimizations
    └── (future mobile enhancements)
```

## 🚀 Migration Status

### ✅ Completed
- [x] Project documentation structure
- [x] GitHub Action for auto-documentation
- [x] Basic folder structure created
- [x] TypeScript type definitions
- [x] Core class placeholders
- [x] Component structure placeholders

### 🔄 In Progress
- [ ] Extract business logic from legacy component
- [ ] Create new React components
- [ ] Implement custom hooks
- [ ] Redis + PostgreSQL integration

### 📋 Todo
- [ ] Performance optimizations
- [ ] Mobile-specific enhancements
- [ ] Testing infrastructure
- [ ] Admin dashboard for analytics

## 🎛️ Key Improvements

### **Separation of Concerns**
- **Core Logic**: Pure TypeScript classes for business logic
- **UI Components**: Clean React components focused on presentation
- **State Management**: Custom hooks with linear data flow
- **Tracking**: Dedicated analytics system with Redis + PostgreSQL

### **Performance Enhancements**
- **Optimistic Updates**: Immediate UI feedback, async server sync
- **Image Preloading**: Smart caching based on user behavior
- **Batched Tracking**: Reduce API calls with event batching
- **Mobile Optimizations**: Touch-friendly interactions, efficient scrolling

### **User Experience**
- **Linear State Flow**: No recursive loops or complex dependencies
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Real-time Tracking**: Capture every interaction for analysis
- **Session Persistence**: Save configurations even if user leaves

## 📊 Database Strategy

### **Redis (Session Data)**
```typescript
// Real-time user interactions
interface UserSession {
  sessionId: string;
  clickHistory: ClickEvent[];
  currentConfiguration: Configuration;
  // ... expires after 24 hours
}
```

### **PostgreSQL (Permanent Data)**
```sql
-- Final configurations and analytics
CREATE TABLE user_sessions (
  session_id UUID PRIMARY KEY,
  configuration_data JSONB,
  status session_status,
  created_at TIMESTAMP
);

CREATE TABLE selection_events (
  session_id UUID,
  category VARCHAR,
  selection VARCHAR,
  timestamp TIMESTAMP,
  time_spent_ms INTEGER
);
```

## 🔧 Development Guidelines

### **Adding New Features**
1. **Business Logic**: Add to appropriate class in `/core`
2. **UI Components**: Create in `/components` with proper TypeScript
3. **State Management**: Use existing hooks or create new ones in `/hooks`
4. **Types**: Update `/types` files for new interfaces

### **Testing Strategy**
- **Unit Tests**: For core business logic classes
- **Component Tests**: For React components
- **Integration Tests**: For hook interactions
- **E2E Tests**: For complete user workflows

### **Performance Monitoring**
- Track bundle size changes
- Monitor render frequency
- Measure time to interactive
- Analyze user interaction patterns

## 📈 Analytics & Tracking

### **User Behavior Metrics**
- Selection click frequency per category
- Time spent on each configuration step
- Abandonment points in the funnel
- Popular house configuration combinations

### **Technical Metrics**
- Component render performance
- Image loading times
- API response times
- Memory usage patterns

### **Business Intelligence**
- Conversion rate tracking
- Revenue attribution by traffic source
- Geographic distribution of users
- A/B testing results

## 🚨 Migration Warnings

### **Breaking Changes**
- Legacy `Configurator.tsx` will be replaced
- State management hooks will change
- Component props may be updated
- API endpoints will be restructured

### **Compatibility**
- Maintain price calculation accuracy
- Preserve existing user experience
- Keep mobile optimization levels
- Ensure tracking data continuity

## 🔄 Usage Examples

### **Basic Usage**
```tsx
import ConfiguratorShell from './configurator/components/ConfiguratorShell';

function ConfiguratorPage() {
  return (
    <ConfiguratorShell 
      initialModel="nest80"
      onSelectionChange={(selections) => console.log(selections)}
      onPriceChange={(price) => console.log(price)}
    />
  );
}
```

### **With Custom Tracking**
```tsx
import { useInteractionTracking } from './configurator/hooks/useInteractionTracking';

function TrackedConfigurator() {
  const { trackSelection } = useInteractionTracking();
  
  return (
    <ConfiguratorShell 
      onSelectionChange={(selection) => {
        trackSelection(selection);
        // Additional logic...
      }}
    />
  );
}
```

---

## 📞 Support

For questions about the new architecture or migration process, please refer to:
- **Documentation**: `/docs/migration/CONFIGURATOR_MIGRATION_PLAN.md`
- **Project Overview**: `/docs/PROJECT_OVERVIEW.md`
- **Commit History**: `/docs/COMMIT_HISTORY.md`

*Migration in progress - ETA: 4 weeks* 