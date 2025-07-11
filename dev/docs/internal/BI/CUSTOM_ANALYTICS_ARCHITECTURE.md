# Custom Analytics System Architecture

**Status**: Disabled (January 2025)  
**Reason**: Vercel Hobby plan limitations  
**Future**: Re-enable when upgrading to Vercel Pro plan  

---

## System Overview

The custom analytics system was designed as a comprehensive, real-time analytics solution for tracking user behavior, product interactions, and business metrics beyond standard GA4 capabilities.

### Key Features
- **Real-time event ingestion** with client-side batching
- **Multi-level aggregation** (5-minute → hourly → daily)
- **Product-specific tracking** (quiz interactions, buying journey)
- **Custom dashboards** with live metrics
- **Cost-optimized storage** using Redis with TTL

## Architecture Components

### 1. Data Collection Layer
```
Client-side → Batch Processing → Compression → API Ingestion
```

**Files**:
- `/src/utils/analytics/client/EventTracker.ts` - Client-side event collection
- `/src/utils/analytics/core/AnalyticsEngine.ts` - Event processing engine
- `/src/utils/analytics/core/SessionManager.ts` - Session tracking

**Features**:
- Automatic batching (max 50 events, 30s intervals)
- LZ-string compression for efficient transport
- Offline queueing with retry logic
- Privacy-compliant data collection

### 2. Storage Layer
```
Redis (Upstash) ← API Routes ← Edge Config (Dashboard Cache)
```

**Files**:
- `/src/pages/api/analytics/ingest.ts` - Event ingestion endpoint
- `/src/pages/api/analytics/dashboard.ts` - Dashboard data API
- `/src/pages/api/analytics/stream.ts` - Real-time streaming
- `/src/config/analytics-storage.config.ts` - Storage configuration

**Data Structure**:
```
analytics:raw:{timestamp}        - Raw events (1 hour TTL)
analytics:5min:{key}            - 5-minute aggregates (24 hour TTL)
analytics:hourly:{key}          - Hourly aggregates (7 day TTL)
analytics:daily:{key}           - Daily aggregates (30 day TTL)
```

### 3. Aggregation Pipeline
```
Raw Events → 5min Aggregates → Hourly Aggregates → Daily Aggregates
```

**Files**:
- `/src/pages/api/cron/aggregate-analytics.ts` - Cron-based aggregation
- `/src/utils/analytics/core/EventProcessor.ts` - Event processing logic

**Aggregation Strategy**:
- **5-minute cron**: Process recent events into time-based buckets
- **Lazy aggregation**: On-demand processing with hourly throttling
- **Data retention**: TTL-based cleanup to control storage costs

### 4. Dashboard Layer
```
React Dashboard ← API Routes ← Redis/Edge Config
```

**Files**:
- `/src/components/admin/dashboards/OverviewDashboard.tsx` - Main dashboard
- `/src/utils/analytics/realtime/DashboardEngine.ts` - Real-time updates
- `/src/utils/analytics/realtime/MetricsCollector.ts` - Metrics collection

**Dashboard Features**:
- Real-time visitor tracking
- Conversion funnel analysis
- Product interaction heatmaps
- Custom business KPIs

## Technical Implementation

### Client-Side Integration
```typescript
// Automatic initialization
import { AnalyticsEngine } from '@/utils/analytics/core/AnalyticsEngine';

// Event tracking
analytics.track('product_view', {
  productId: 'smart-board-pro',
  category: 'interactive-displays',
  price: 2999
});

// Quiz interactions
analytics.track('quiz_step_completed', {
  step: 3,
  totalSteps: 5,
  userChoices: ['classroom', 'large-space', 'interactive']
});
```

### Server-Side Processing
```typescript
// Event ingestion with compression
const compressed = await request.text();
const payload = JSON.parse(decompress(compressed));

// Parallel processing for performance
const promises = [
  storeRawEvents(payload.rawEvents),
  updateAggregates(payload.aggregates),
  updateSessionActivity(payload.sessionId)
];
await Promise.all(promises);
```

### Redis Operations
```typescript
// Aggregate merging with conflict resolution
const existing = await redis.get(key);
const merged = {
  count: existing.count + newData.count,
  data: mergeData(existing.data, newData.data),
  lastUpdated: Date.now()
};
await redis.setex(key, ttl, merged);
```

## Cost Optimization Features

### 1. Intelligent Sampling
```typescript
sampling: {
  pageViews: 0.1,      // 10% sampling
  interactions: 0.05,   // 5% sampling
  conversions: 1.0,     // 100% (always track)
  quizEvents: 1.0       // 100% (always track)
}
```

### 2. TTL-Based Cleanup
```typescript
ttl: {
  rawEvents: 3600,          // 1 hour
  fiveMinAggregates: 86400, // 1 day
  hourlyAggregates: 604800, // 7 days
  dailyAggregates: 2592000  // 30 days
}
```

### 3. Compression & Batching
- **LZ-string compression**: Reduces payload size by 60-80%
- **Batch processing**: Minimizes API calls
- **Edge caching**: 5-minute dashboard cache

## Current Status & Issues

### ✅ Completed Components
- **Client-side tracking**: Fully implemented with React integration
- **Event processing**: Complete analytics engine with session management
- **Storage configuration**: Redis setup with optimal TTL strategy
- **Dashboard framework**: React components with real-time capabilities

### ❌ Blocking Issues (Hobby Plan)
- **Cron frequency**: Limited to daily execution (needs 5-minute intervals)
- **Function limits**: Risk of exceeding serverless execution limits
- **Redis client**: Incomplete migration from `@vercel/kv` to `@upstash/redis`
- **Build configuration**: Analytics routes not compiling as serverless functions

### ⚠️ Technical Debt
- **Mixed imports**: Inconsistent `@vercel/kv` vs `@upstash/redis` usage
- **Missing client initialization**: Redis client not properly instantiated
- **No test coverage**: Analytics functionality lacks automated testing

## Migration Path to Vercel Pro

### Phase 1: Redis Client Migration (2-4 hours)
```typescript
// Before (broken)
import { kv } from '@vercel/kv';
await kv.setex(key, ttl, value);

// After (working)
import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();
await redis.setex(key, ttl, value);
```

### Phase 2: Cron Job Restoration
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/aggregate-analytics",
    "schedule": "*/5 * * * *"
  }],
  "functions": {
    "src/pages/api/analytics/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### Phase 3: Testing & Validation
1. **Unit tests**: Event processing, aggregation logic
2. **Integration tests**: End-to-end data pipeline
3. **Load testing**: Performance under realistic traffic
4. **Cost monitoring**: Track resource usage and costs

## Business Value Proposition

### Unique Insights (vs GA4)
- **Product quiz analytics**: User preference patterns, conversion paths
- **Buying journey tracking**: Step-by-step funnel analysis
- **Real-time behavior**: Live visitor interactions, heat maps
- **Custom KPIs**: Business-specific metrics and goals

### Cost Analysis
- **Vercel Pro**: $20/month (enables the system)
- **Upstash Redis**: ~$5-15/month (based on usage)
- **Development time**: ~8-12 hours (initial migration + testing)
- **Maintenance**: ~2-4 hours/month (monitoring, optimization)

### ROI Considerations
- **Enhanced conversion tracking**: Better understanding of user behavior
- **Product optimization**: Data-driven quiz and product improvements
- **Business intelligence**: Custom reports and analytics dashboards
- **Competitive advantage**: Insights beyond standard analytics platforms

## Lessons Learned

1. **Platform limitations**: Always design within hosting plan constraints
2. **Technology migrations**: Stay current with platform changes (KV → Redis)
3. **Complexity management**: Balance features with maintenance burden
4. **Cost awareness**: Monitor and control resource usage from day one
5. **Testing strategy**: Implement comprehensive testing from the start

## Future Enhancements (When Re-enabled)

### Short-term (Month 1)
- **A/B testing framework**: Built-in experimentation platform
- **Enhanced segmentation**: User cohort analysis
- **Performance monitoring**: Core web vitals tracking

### Medium-term (Month 2-3)
- **Predictive analytics**: Machine learning for user behavior prediction
- **Advanced attribution**: Multi-touch attribution modeling
- **Custom alerting**: Automated notifications for key metrics

### Long-term (Month 4+)
- **Data export**: Integration with business intelligence tools
- **Advanced visualization**: Custom chart types and dashboards
- **Multi-tenant support**: Analytics for multiple properties

---

## Decision Matrix

| Factor | GA4 | Custom Analytics | Recommendation |
|--------|-----|------------------|----------------|
| **Implementation** | ✅ Complete | ❌ Needs Pro plan | GA4 for now |
| **Cost** | ✅ Free | ⚠️ $20+/month | GA4 advantage |
| **Maintenance** | ✅ Zero | ⚠️ Ongoing | GA4 advantage |
| **Custom insights** | ❌ Limited | ✅ Unlimited | Custom advantage |
| **Real-time** | ❌ Limited | ✅ Full support | Custom advantage |
| **Business KPIs** | ❌ Generic | ✅ Tailored | Custom advantage |

**Current Decision**: Use GA4 as primary analytics solution, preserve custom system for future Pro plan consideration.

**Review Trigger**: When business requirements exceed GA4 capabilities or Vercel Pro plan becomes justified for other reasons.

---

**Last Updated**: January 11, 2025  
**Next Review**: Upon Vercel Pro plan upgrade or business requirement change  
**Maintainer**: Development Team  
**Status**: Documented and preserved for future implementation