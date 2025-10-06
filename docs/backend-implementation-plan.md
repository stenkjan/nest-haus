# Backend Implementation Plan - NEST-Haus Configurator

## 🎯 Implementation Timeline (2-3 Weeks)

### **Week 1: Foundation & Infrastructure (Days 1-7)**

#### **Priority 1: Database Testing Infrastructure**

**Required Schema Updates:**
```sql
-- Enhanced session tracking with analytics
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR(50), -- 'mobile', 'tablet', 'desktop'
  browser_name VARCHAR(100),
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  total_interactions INTEGER DEFAULT 0,
  session_duration INTEGER, -- in seconds
  exit_page VARCHAR(255),
  conversion_status VARCHAR(50) DEFAULT 'ongoing', -- 'ongoing', 'abandoned', 'converted'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Detailed click tracking for analytics
CREATE TABLE interaction_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'click', 'hover', 'scroll', 'selection'
  category VARCHAR(100), -- 'nest', 'gebaeudehuelle', 'ausstattung'
  element_id VARCHAR(100),
  selection_value VARCHAR(100),
  previous_value VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW(),
  time_spent INTEGER, -- milliseconds
  device_type VARCHAR(50),
  viewport_width INTEGER,
  viewport_height INTEGER
);

-- Configuration snapshots for analytics
CREATE TABLE configuration_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES user_sessions(session_id),
  configuration_data JSONB NOT NULL,
  total_price INTEGER,
  completion_percentage DECIMAL(5,2),
  timestamp TIMESTAMP DEFAULT NOW(),
  trigger_event VARCHAR(100) -- 'auto_save', 'page_exit', 'order_attempt'
);

-- Aggregated analytics for admin dashboard
CREATE TABLE daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  metric_type VARCHAR(100) NOT NULL, -- 'page_views', 'selections', 'conversions'
  category VARCHAR(100),
  value_text VARCHAR(255),
  count INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  average_time DECIMAL(10,2),
  UNIQUE(date, metric_type, category, value_text)
);

-- Popular configurations for recommendations
CREATE TABLE popular_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_hash VARCHAR(255) UNIQUE NOT NULL,
  configuration_data JSONB NOT NULL,
  selection_count INTEGER DEFAULT 1,
  completion_count INTEGER DEFAULT 0,
  average_price INTEGER,
  last_selected TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Performance monitoring
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  metric_name VARCHAR(100) NOT NULL, -- 'api_response_time', 'image_load_time', 'price_calc_time'
  value DECIMAL(10,3),
  timestamp TIMESTAMP DEFAULT NOW(),
  additional_data JSONB
);

-- Create indexes for performance
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_start_time ON user_sessions(start_time);
CREATE INDEX idx_interaction_events_session_id ON interaction_events(session_id);
CREATE INDEX idx_interaction_events_timestamp ON interaction_events(timestamp);
CREATE INDEX idx_configuration_snapshots_session_id ON configuration_snapshots(session_id);
CREATE INDEX idx_daily_analytics_date ON daily_analytics(date);
CREATE INDEX idx_daily_analytics_metric_type ON daily_analytics(metric_type);
CREATE INDEX idx_popular_configurations_hash ON popular_configurations(configuration_hash);
CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(timestamp);
```

**Implementation Tasks:**
1. **Prisma Schema Update**: Add new models to `prisma/schema.prisma`
2. **Database Migration**: Create and run migration scripts
3. **Seed Data**: Create realistic test data for development
4. **Connection Testing**: Verify PostgreSQL + Redis connectivity

#### **Priority 2: Enhanced Session Tracking System**

**New API Routes Required:**
```typescript
// /api/sessions/create - Initialize user session
POST /api/sessions/create
{
  deviceInfo: {
    type: 'mobile' | 'tablet' | 'desktop',
    userAgent: string,
    viewport: { width: number, height: number }
  },
  referrer?: string,
  utm?: { source: string, medium: string, campaign: string }
}

// /api/sessions/track - Track user interactions
POST /api/sessions/track
{
  sessionId: string,
  event: {
    type: 'click' | 'hover' | 'selection' | 'scroll',
    category: string,
    elementId: string,
    value: string,
    previousValue?: string,
    timeSpent: number
  }
}

// /api/sessions/save-configuration - Save configuration snapshots
POST /api/sessions/save-configuration
{
  sessionId: string,
  configuration: ConfigurationData,
  trigger: 'auto_save' | 'page_exit' | 'order_attempt'
}

// /api/sessions/finalize - End session and calculate metrics
POST /api/sessions/finalize
{
  sessionId: string,
  exitPage: string,
  finalConfiguration?: ConfigurationData,
  conversionStatus: 'abandoned' | 'converted'
}
```

#### **Priority 3: Performance Monitoring Enhancement**

**Real-time Performance Tracking:**
- API response time monitoring
- Database query performance tracking
- Image loading performance metrics
- Price calculation performance
- Memory usage monitoring

### **Week 2: Analytics & Admin Panel (Days 8-14)**

#### **Priority 1: Admin Panel API Development**

**Analytics API Routes:**
```typescript
// /api/admin/analytics/overview - Dashboard overview
GET /api/admin/analytics/overview?timeRange=7d|30d|90d

// /api/admin/analytics/user-journey - User behavior analysis
GET /api/admin/analytics/user-journey?sessionId=xxx

// /api/admin/analytics/popular-configs - Most selected configurations
GET /api/admin/analytics/popular-configs?limit=10

// /api/admin/analytics/conversion-funnel - Conversion analysis
GET /api/admin/analytics/conversion-funnel?timeRange=30d

// /api/admin/analytics/performance - Performance metrics
GET /api/admin/analytics/performance?metric=api_response_time&timeRange=24h

// /api/admin/sync/google-drive - Manual sync trigger
POST /api/admin/sync/google-drive
```

#### **Priority 2: Real-time Analytics Processing**

**Background Jobs System:**
1. **Hourly Aggregation**: Process interaction events into daily_analytics
2. **Configuration Analysis**: Update popular_configurations table
3. **Performance Alerts**: Monitor and alert on performance degradation
4. **Data Cleanup**: Archive old session data

#### **Priority 3: User Journey Reconstruction**

**Session Replay System:**
- Reconstruct user interaction sequences
- Identify drop-off points in configurator
- Analyze decision patterns
- Generate conversion insights

### **Week 3: Integration & Optimization (Days 15-21)**

#### **Priority 1: Comprehensive Testing Infrastructure**

**Required Test Suites:**
```typescript
// Database integration tests
describe('Session Tracking', () => {
  test('should handle concurrent session creation')
  test('should properly aggregate interaction events')
  test('should handle session finalization race conditions')
})

// API endpoint tests
describe('Admin Analytics API', () => {
  test('should return accurate conversion metrics')
  test('should handle large data sets efficiently')
  test('should properly filter by time ranges')
})

// Performance tests
describe('Performance Monitoring', () => {
  test('should track API response times under load')
  test('should alert on performance degradation')
  test('should maintain <100ms price calculation times')
})
```

#### **Priority 2: Admin Dashboard Frontend**

**Dashboard Components:**
1. **Overview Dashboard**: Key metrics, conversion rates, user counts
2. **User Journey Viewer**: Individual session replay and analysis
3. **Configuration Analytics**: Popular selections, price distributions
4. **Performance Monitor**: Real-time system health metrics
5. **Data Export**: CSV/JSON export for external analysis

#### **Priority 3: Integration & Performance Optimization**

**System Integration:**
- Connect all tracking systems with configurator
- Implement non-blocking background data collection
- Optimize database queries for admin panel
- Set up automated performance alerts

## 🔧 Technical Implementation Details

### **Database Connection Strategy**
```typescript
// Enhanced Prisma client with connection pooling
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?connection_limit=20&pool_timeout=20"
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['warn', 'error']
})

// Redis connection with retry logic
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true
})
```

### **Session Management Pattern**
```typescript
// Upsert pattern for race condition handling
export async function trackUserInteraction(sessionId: string, event: InteractionEvent) {
  try {
    // Update session activity (non-blocking)
    await prisma.userSession.upsert({
      where: { sessionId },
      update: {
        totalInteractions: { increment: 1 },
        updatedAt: new Date()
      },
      create: {
        sessionId,
        totalInteractions: 1,
        // ... other required fields
      }
    })

    // Record interaction event
    await prisma.interactionEvent.create({
      data: {
        sessionId,
        ...event,
        timestamp: new Date()
      }
    })

    // Cache in Redis for real-time access
    await redis.lpush(`session:${sessionId}:events`, JSON.stringify(event))
    await redis.expire(`session:${sessionId}:events`, 3600) // 1 hour TTL

  } catch (error) {
    // Fail silently to not block user experience
    console.error('Session tracking error:', error)
  }
}
```

### **Performance Monitoring Integration**
```typescript
// Automatic performance tracking middleware
export function withPerformanceTracking(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const startTime = Date.now()
    
    try {
      await handler(req, res)
    } finally {
      const duration = Date.now() - startTime
      
      // Log slow requests
      if (duration > 1000) {
        console.warn(`Slow API call: ${req.url} took ${duration}ms`)
      }
      
      // Track in database (background task)
      trackPerformanceMetric({
        metricName: 'api_response_time',
        value: duration,
        additionalData: {
          url: req.url,
          method: req.method,
          statusCode: res.statusCode
        }
      }).catch(() => {}) // Fail silently
    }
  }
}
```

## 📊 Success Metrics & Monitoring

### **Week 1 Targets**
- ✅ Database schema deployed and tested
- ✅ Session tracking capturing >95% of user interactions
- ✅ Performance monitoring operational with <100ms overhead
- ✅ All API endpoints responding within SLA (<500ms)

### **Week 2 Targets**
- ✅ Admin panel API routes functional and tested
- ✅ Real-time analytics aggregation working
- ✅ User journey reconstruction accurate
- ✅ Configuration popularity tracking operational

### **Week 3 Targets**
- ✅ Full integration testing passed
- ✅ Admin dashboard frontend functional
- ✅ Performance optimization delivering <100ms price calculations
- ✅ System ready for production load testing

## 🚨 Risk Mitigation

### **High-Risk Areas**
1. **Database Performance**: Large analytics tables may slow down queries
   - **Mitigation**: Implement table partitioning and regular archiving
   
2. **Session Tracking Overhead**: Too much tracking may impact user experience
   - **Mitigation**: Async processing, fail-safe patterns, performance budgets
   
3. **Admin Panel Performance**: Large datasets may cause slow dashboard loading
   - **Mitigation**: Data pagination, caching strategies, background aggregation

### **Performance Safeguards**
- All tracking operations are non-blocking
- Database operations use upsert patterns for race condition handling
- Redis caching for frequently accessed data
- Automatic performance alerts for degradation

## 🔄 Deployment Strategy

### **Rolling Deployment Plan**
1. **Week 1**: Deploy database changes and basic tracking (low risk)
2. **Week 2**: Deploy admin API routes and analytics (medium risk)
3. **Week 3**: Deploy admin dashboard and full integration (higher risk)

### **Rollback Strategy**
- Database migrations are reversible
- Feature flags for new tracking systems
- Gradual rollout with monitoring at each stage
- Immediate rollback procedures for performance issues

---

This plan ensures robust backend infrastructure while maintaining the performance standards already established in the configurator system. 

## 📋 **CURRENT STATE ANALYSIS**

### **✅ Already Implemented:**
1. **Database Schema**: Complete user session tracking, selection events, daily analytics
2. **Redis Integration**: Session management with Upstash Redis
3. **Admin Panel Structure**: Basic dashboard with navigation cards
4. **Performance Monitoring**: Mock dashboard with metrics display
5. **Session Management**: Complete session lifecycle handling

### **🔧 Needs Enhancement:**
1. **Real Data Collection**: Current mock data needs replacement with live tracking
2. **Analytics Aggregation**: Background jobs for data processing
3. **Admin API Routes**: Complete implementation of analytics endpoints
4. **Testing Infrastructure**: No tests for database operations
5. **Performance Monitoring**: Real-time metrics collection

---

## 🎯 **SPECIFIC IMPLEMENTATION TASKS**

### **Week 1: Foundation (Days 1-7)**

#### **Day 1-2: Database Enhancements**

**Task 1: Add Missing Tables to Prisma Schema**
```prisma
// Add to prisma/schema.prisma

model InteractionEvent {
  id              String   @id @default(cuid())
  sessionId       String
  eventType       String   // 'click', 'hover', 'scroll', 'selection'
  category        String   // 'nest', 'gebaeudehuelle', 'ausstattung'
  elementId       String?
  selectionValue  String?
  previousValue   String?
  timestamp       DateTime @default(now())
  timeSpent       Int?     // milliseconds
  deviceType      String?
  viewportWidth   Int?
  viewportHeight  Int?
  
  session         UserSession @relation(fields: [sessionId], references: [sessionId], onDelete: Cascade)
  
  @@map("interaction_events")
}

model ConfigurationSnapshot {
  id                    String   @id @default(cuid())
  sessionId             String
  configurationData     Json
  totalPrice            Int?
  completionPercentage  Float?
  timestamp             DateTime @default(now())
  triggerEvent          String   // 'auto_save', 'page_exit', 'order_attempt'
  
  session               UserSession @relation(fields: [sessionId], references: [sessionId], onDelete: Cascade)
  
  @@map("configuration_snapshots")
}

model PerformanceMetric {
  id              String   @id @default(cuid())
  sessionId       String?
  metricName      String   // 'api_response_time', 'image_load_time', 'price_calc_time'
  value           Float
  timestamp       DateTime @default(now())
  additionalData  Json?
  
  @@map("performance_metrics")
}
```

**Task 2: Create Database Migration Scripts**
```bash
# Generate and apply migrations
npx prisma migrate dev --name add-enhanced-tracking
npx prisma generate
```

**Task 3: Enhanced Redis Integration**
```typescript
// src/lib/redis-enhanced.ts
export class EnhancedSessionManager extends SessionManager {
  /**
   * Track detailed user interactions
   */
  static async trackInteraction(sessionId: string, interaction: {
    eventType: string;
    category: string;
    elementId?: string;
    selectionValue?: string;
    previousValue?: string;
    timeSpent?: number;
    deviceInfo?: { type: string; width: number; height: number; };
  }): Promise<void> {
    // Store in Redis for real-time access
    const interactionKey = `interaction:${sessionId}:${Date.now()}`;
    await redis.setex(interactionKey, 3600, interaction);
    
    // Queue for PostgreSQL persistence (background job)
    await redis.lpush('interaction_queue', JSON.stringify({
      sessionId,
      ...interaction,
      timestamp: new Date()
    }));
  }
  
  /**
   * Save configuration snapshots
   */
  static async saveConfigurationSnapshot(sessionId: string, config: any, trigger: string): Promise<void> {
    const snapshot = {
      sessionId,
      configurationData: config,
      totalPrice: config.pricing?.totalPrice,
      completionPercentage: this.calculateCompletionPercentage(config),
      triggerEvent: trigger,
      timestamp: new Date()
    };
    
    // Store in Redis
    await redis.setex(`config:${sessionId}:${Date.now()}`, 3600, snapshot);
    
    // Queue for database persistence
    await redis.lpush('config_queue', JSON.stringify(snapshot));
  }
}
```

#### **Day 3-4: Real-time Data Collection API Routes**

**Task 1: Enhanced Session API**
```typescript
// src/app/api/sessions/track-interaction/route.ts
import { EnhancedSessionManager } from '@/lib/redis-enhanced';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, interaction } = await request.json();
    
    // Validate required fields
    if (!sessionId || !interaction.eventType || !interaction.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Track interaction (non-blocking)
    await EnhancedSessionManager.trackInteraction(sessionId, interaction);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Interaction tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// src/app/api/sessions/save-config/route.ts
export async function POST(request: NextRequest) {
  try {
    const { sessionId, configuration, trigger } = await request.json();
    
    await EnhancedSessionManager.saveConfigurationSnapshot(
      sessionId, 
      configuration, 
      trigger || 'auto_save'
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Configuration save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Task 2: Performance Tracking API**
```typescript
// src/app/api/performance/track/route.ts
export async function POST(request: NextRequest) {
  try {
    const metrics = await request.json();
    
    // Store performance metrics in Redis
    await redis.lpush('performance_queue', JSON.stringify({
      ...metrics,
      timestamp: new Date()
    }));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Performance tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

#### **Day 5-7: Background Job System**

**Task 1: Redis to PostgreSQL Sync Jobs**
```typescript
// src/lib/background-jobs.ts
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';

export class BackgroundJobs {
  /**
   * Process interaction events from Redis queue to PostgreSQL
   */
  static async processInteractionQueue(): Promise<void> {
    try {
      const batchSize = 100;
      const interactions = await redis.lrange('interaction_queue', 0, batchSize - 1);
      
      if (interactions.length === 0) return;
      
      // Parse and validate interactions
      const validInteractions = interactions
        .map(item => {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      
      // Batch insert to PostgreSQL
      await prisma.interactionEvent.createMany({
        data: validInteractions,
        skipDuplicates: true
      });
      
      // Remove processed items from queue
      await redis.ltrim('interaction_queue', batchSize, -1);
      
      console.log(`Processed ${validInteractions.length} interaction events`);
    } catch (error) {
      console.error('Interaction queue processing error:', error);
    }
  }
  
  /**
   * Process configuration snapshots
   */
  static async processConfigurationQueue(): Promise<void> {
    try {
      const configs = await redis.lrange('config_queue', 0, 50);
      
      if (configs.length === 0) return;
      
      const validConfigs = configs
        .map(item => {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      
      await prisma.configurationSnapshot.createMany({
        data: validConfigs,
        skipDuplicates: true
      });
      
      await redis.ltrim('config_queue', configs.length, -1);
      
      console.log(`Processed ${validConfigs.length} configuration snapshots`);
    } catch (error) {
      console.error('Configuration queue processing error:', error);
    }
  }
  
  /**
   * Aggregate daily analytics
   */
  static async aggregateDailyAnalytics(): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get session statistics for today
      const sessionStats = await prisma.userSession.aggregate({
        where: {
          startTime: {
            gte: today
          }
        },
        _count: {
          id: true
        },
        _avg: {
          sessionDuration: true
        }
      });
      
      // Get conversion statistics
      const conversionStats = await prisma.userSession.groupBy({
        by: ['status'],
        where: {
          startTime: {
            gte: today
          }
        },
        _count: {
          status: true
        }
      });
      
      // Update or create daily analytics
      await prisma.dailyAnalytics.upsert({
        where: { date: today },
        update: {
          totalSessions: sessionStats._count.id,
          averageSessionDuration: sessionStats._avg.sessionDuration || 0,
          // Add conversion calculations
        },
        create: {
          date: today,
          totalSessions: sessionStats._count.id,
          averageSessionDuration: sessionStats._avg.sessionDuration || 0,
          // Add other metrics
        }
      });
      
    } catch (error) {
      console.error('Daily analytics aggregation error:', error);
    }
  }
}

// Scheduled job runner (can be called via API or cron)
export async function runBackgroundJobs(): Promise<void> {
  await Promise.all([
    BackgroundJobs.processInteractionQueue(),
    BackgroundJobs.processConfigurationQueue(),
    BackgroundJobs.aggregateDailyAnalytics()
  ]);
}
```

### **Week 2: Analytics & Admin Panel (Days 8-14)**

#### **Day 8-10: Admin Analytics API Implementation**

**Task 1: Complete Admin API Routes**
```typescript
// src/app/api/admin/analytics/overview/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    
    const days = timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get session statistics
    const sessionStats = await prisma.userSession.aggregate({
      where: {
        startTime: { gte: startDate }
      },
      _count: { id: true },
      _avg: { sessionDuration: true }
    });
    
    // Get popular configurations
    const popularConfigs = await prisma.popularConfiguration.findMany({
      where: {
        lastSelected: { gte: startDate }
      },
      orderBy: { selectionCount: 'desc' },
      take: 10
    });
    
    // Get conversion funnel data
    const conversionData = await prisma.userSession.groupBy({
      by: ['status'],
      where: {
        startTime: { gte: startDate }
      },
      _count: { status: true }
    });
    
    return NextResponse.json({
      overview: {
        totalSessions: sessionStats._count.id,
        averageSessionDuration: sessionStats._avg.sessionDuration,
        // Add more metrics
      },
      popularConfigurations: popularConfigs,
      conversionFunnel: conversionData,
      timeRange: `${days} days`
    });
    
  } catch (error) {
    console.error('Overview analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// src/app/api/admin/analytics/user-journey/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }
    
    // Get session details
    const session = await prisma.userSession.findUnique({
      where: { sessionId },
      include: {
        selectionEvents: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    // Get interaction events
    const interactions = await prisma.interactionEvent.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' }
    });
    
    // Get configuration snapshots
    const snapshots = await prisma.configurationSnapshot.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' }
    });
    
    return NextResponse.json({
      session,
      interactions,
      snapshots,
      timeline: this.buildUserTimeline(session, interactions, snapshots)
    });
    
  } catch (error) {
    console.error('User journey error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

#### **Day 11-12: Real-time Performance Monitoring**

**Task 1: Performance Metrics Collection**
```typescript
// src/lib/performance-tracker.ts
export class PerformanceTracker {
  /**
   * Track API response times automatically
   */
  static withPerformanceTracking(handler: any) {
    return async (req: NextRequest, res: NextResponse) => {
      const startTime = Date.now();
      const path = new URL(req.url).pathname;
      
      try {
        const result = await handler(req, res);
        
        const duration = Date.now() - startTime;
        
        // Track performance metric
        await this.trackMetric({
          metricName: 'api_response_time',
          value: duration,
          additionalData: {
            path,
            method: req.method,
            statusCode: res.status || 200
          }
        });
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        
        await this.trackMetric({
          metricName: 'api_error',
          value: duration,
          additionalData: {
            path,
            method: req.method,
            error: error.message
          }
        });
        
        throw error;
      }
    };
  }
  
  /**
   * Track performance metric
   */
  static async trackMetric(metric: {
    metricName: string;
    value: number;
    sessionId?: string;
    additionalData?: any;
  }): Promise<void> {
    // Store in Redis for real-time access
    await redis.lpush('performance_queue', JSON.stringify({
      ...metric,
      timestamp: new Date()
    }));
    
    // Also store critical metrics immediately in PostgreSQL
    if (metric.value > 1000 || metric.metricName.includes('error')) {
      await prisma.performanceMetric.create({
        data: {
          metricName: metric.metricName,
          value: metric.value,
          sessionId: metric.sessionId,
          additionalData: metric.additionalData,
          timestamp: new Date()
        }
      });
    }
  }
}
```

#### **Day 13-14: Admin Dashboard Enhancement**

**Task 1: Enhanced Dashboard Components**
```typescript
// src/app/admin/components/RealTimeMetrics.tsx
'use client';

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/analytics/real-time');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch real-time metrics:', error);
      }
    };
    
    // Fetch immediately and then every 30 seconds
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        title="Active Sessions"
        value={metrics?.activeSessions || 0}
        icon="👥"
        status={metrics?.activeSessions > 10 ? 'good' : 'warning'}
      />
      <MetricCard
        title="Avg Response Time"
        value={`${metrics?.avgResponseTime || 0}ms`}
        icon="⚡"
        status={metrics?.avgResponseTime < 200 ? 'good' : 'warning'}
      />
      <MetricCard
        title="Error Rate"
        value={`${metrics?.errorRate || 0}%`}
        icon="🚨"
        status={metrics?.errorRate < 1 ? 'good' : 'error'}
      />
      <MetricCard
        title="Cache Hit Rate"
        value={`${metrics?.cacheHitRate || 0}%`}
        icon="💾"
        status={metrics?.cacheHitRate > 80 ? 'good' : 'warning'}
      />
    </div>
  );
}
```

### **Week 3: Integration & Testing (Days 15-21)**

#### **Day 15-17: Comprehensive Testing**

**Task 1: Database Integration Tests**
```typescript
// src/test/integration/session-tracking.test.ts
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { EnhancedSessionManager } from '@/lib/redis-enhanced';

describe('Session Tracking Integration', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.interactionEvent.deleteMany();
    await prisma.userSession.deleteMany();
  });
  
  test('should handle concurrent session creation', async () => {
    const promises = Array.from({ length: 10 }, (_, i) => 
      EnhancedSessionManager.createSession({
        ipAddress: `192.168.1.${i}`,
        userAgent: 'test-agent'
      })
    );
    
    const sessionIds = await Promise.all(promises);
    expect(sessionIds).toHaveLength(10);
    expect(new Set(sessionIds)).toHaveLength(10); // All unique
  });
  
  test('should properly aggregate interaction events', async () => {
    const sessionId = await EnhancedSessionManager.createSession({
      ipAddress: '192.168.1.1',
      userAgent: 'test-agent'
    });
    
    // Track multiple interactions
    await Promise.all([
      EnhancedSessionManager.trackInteraction(sessionId, {
        eventType: 'click',
        category: 'nest',
        selectionValue: 'nest80'
      }),
      EnhancedSessionManager.trackInteraction(sessionId, {
        eventType: 'click',
        category: 'gebaeudehuelle',
        selectionValue: 'holzlattung'
      })
    ]);
    
    // Process background jobs
    await BackgroundJobs.processInteractionQueue();
    
    // Verify data in database
    const interactions = await prisma.interactionEvent.findMany({
      where: { sessionId }
    });
    
    expect(interactions).toHaveLength(2);
    expect(interactions[0].category).toBe('nest');
    expect(interactions[1].category).toBe('gebaeudehuelle');
  });
});
```

#### **Day 18-19: Performance Testing**

**Task 1: Load Testing for Analytics**
```typescript
// src/test/performance/analytics-load.test.ts
describe('Analytics Performance', () => {
  test('should handle 1000 concurrent requests', async () => {
    const startTime = Date.now();
    
    const promises = Array.from({ length: 1000 }, () =>
      fetch('/api/admin/analytics/overview?timeRange=7d')
    );
    
    const responses = await Promise.all(promises);
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    expect(responses.every(r => r.ok)).toBe(true);
  });
  
  test('should maintain <200ms response time for real-time metrics', async () => {
    const startTime = Date.now();
    
    const response = await fetch('/api/admin/analytics/real-time');
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(200);
    expect(response.ok).toBe(true);
  });
});
```

#### **Day 20-21: Final Integration & Deployment**

**Task 1: Production Deployment Script**
```bash
#!/bin/bash
# deploy-backend.sh

echo "🚀 Deploying NEST-Haus Backend Updates..."

# 1. Database migrations
echo "📊 Running database migrations..."
npx prisma migrate deploy

# 2. Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# 3. Seed initial data
echo "🌱 Seeding database..."
npx prisma db seed

# 4. Test Redis connection
echo "📡 Testing Redis connection..."
npm run test:redis

# 5. Test database connection
echo "🗄️ Testing database connection..."
npm run test:db

# 6. Build application
echo "🏗️ Building application..."
npm run build

# 7. Run integration tests
echo "🧪 Running integration tests..."
npm run test:integration

echo "✅ Backend deployment complete!"
```

**Task 2: Monitoring Setup**
```typescript
// src/lib/monitoring.ts
export class ProductionMonitoring {
  /**
   * Set up automatic alerts for performance issues
   */
  static setupAlerts(): void {
    // Monitor API response times
    setInterval(async () => {
      const avgResponseTime = await this.getAverageResponseTime();
      if (avgResponseTime > 1000) {
        await this.sendAlert('High response time detected', {
          metric: 'avg_response_time',
          value: avgResponseTime,
          threshold: 1000
        });
      }
    }, 60000); // Check every minute
    
    // Monitor error rates
    setInterval(async () => {
      const errorRate = await this.getErrorRate();
      if (errorRate > 5) {
        await this.sendAlert('High error rate detected', {
          metric: 'error_rate',
          value: errorRate,
          threshold: 5
        });
      }
    }, 300000); // Check every 5 minutes
  }
}
```

---

This plan ensures robust backend infrastructure while maintaining the performance standards already established in the configurator system. 