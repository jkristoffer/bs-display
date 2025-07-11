# Vercel Hobby Plan Analytics Strategy

## Overview

This document outlines the analytics architecture designed for Vercel's Hobby plan limitations, combining daily cron jobs with lazy aggregation to provide real-time insights while staying within free tier constraints.

## Vercel Hobby Plan Constraints

### Cron Job Limitations
- **Frequency**: Limited to once per day maximum
- **Error**: `"Hobby accounts are limited to daily cron jobs. This cron expression (*/5 * * * *) would run more than once per day."`
- **Upgrade Required**: Pro plan needed for high-frequency cron jobs

### Our Solution
- **Daily Cron**: Runs at midnight UTC (`0 0 * * *`)
- **Lazy Aggregation**: Real-time processing when dashboard is accessed
- **Hybrid Approach**: Best of both worlds

## Architecture Components

### 1. Daily Cron Job (`/api/cron/aggregate-analytics`)

**Schedule**: `0 0 * * *` (Daily at midnight UTC)

**Purpose**:
- Cleanup old data (5-minute aggregates older than 1 hour)
- Generate daily summary reports
- Maintain Edge Config with latest dashboard data
- Backup critical analytics to KV storage

**Configuration**:
```json
{
  "crons": [
    {
      "path": "/api/cron/aggregate-analytics",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### 2. Lazy Aggregation System with Throttling

**Trigger**: Dashboard access detection
**Logic**: Process data only when needed, with built-in throttling to prevent excessive costs

```typescript
// Check if aggregation is needed (lazy aggregation with throttling)
const lastAggregation = await kv.get('analytics:last_aggregation_run') as number;
const now = Date.now();

// Throttle aggregation to maximum once per hour
if (lastAggregation && now - lastAggregation < 3600000) { // 1 hour
  console.log('Skipping aggregation - ran less than 1 hour ago');
  return new Response(JSON.stringify({ 
    skipped: true, 
    reason: 'throttled',
    nextRun: new Date(lastAggregation + 3600000).toISOString()
  }));
}

// Check if dashboard has been accessed recently (skip if no recent activity)
const lastAccess = await kv.get('analytics:last_dashboard_access') as number;
if (lastAccess && now - lastAccess > 86400000) { // 24 hours
  console.log('Skipping aggregation - dashboard not accessed recently');
  return new Response(JSON.stringify({ 
    skipped: true, 
    reason: 'no_recent_access',
    lastAccess: new Date(lastAccess).toISOString()
  }));
}
```

**Benefits**:
- **Cost Protection**: Maximum 1 aggregation per hour regardless of dashboard access frequency
- **Smart Processing**: Only aggregates when dashboard is actually being used
- **Resource Conservation**: Prevents excessive KV operations and function executions
- **Predictable Costs**: Limits aggregation to 24 times per day maximum (hourly)

### 3. Data Processing Strategy

#### Real-time Data Collection
- **Event Ingestion**: `/api/analytics/ingest` - Immediate event capture
- **Session Tracking**: Live user session management
- **5-minute Aggregates**: Temporary storage for recent data

#### Hourly Aggregation
- **Automatic**: Triggered by dashboard access
- **Efficient**: Batch processing of 5-minute aggregates
- **Smart**: Only processes when needed

#### Daily Aggregation
- **Scheduled**: Runs via daily cron job
- **Comprehensive**: Full data processing and cleanup
- **Persistent**: Stores in Edge Config for fast access

## Implementation Details

### Current Configuration

#### Cron Job Schedule
```json
{
  "path": "/api/cron/aggregate-analytics",
  "schedule": "0 0 * * *"
}
```

#### Function Timeouts
```json
{
  "src/pages/api/analytics/ingest.ts": {
    "maxDuration": 10
  },
  "src/pages/api/analytics/dashboard.ts": {
    "maxDuration": 10
  },
  "src/pages/api/cron/aggregate-analytics.ts": {
    "maxDuration": 30
  }
}
```

### Storage Strategy

#### Upstash Redis (KV Storage)
- **Real-time Events**: Immediate storage with TTL
- **5-minute Aggregates**: Temporary data with 1-hour TTL
- **Hourly Aggregates**: Intermediate processing with 24-hour TTL
- **Backup Data**: Compressed daily summaries

#### Edge Config
- **Dashboard Summary**: Fast global access
- **Configuration**: Analytics settings and metadata
- **Status**: Last aggregation run information

## Cost Control Strategy

### Aggregation Throttling
- **Maximum Frequency**: 1 aggregation per hour (24 per day max)
- **Trigger Protection**: Multiple dashboard visits within 1 hour don't trigger additional aggregations
- **Cost Predictability**: Known upper limit on processing costs

### KV Operation Limits
- **Daily Aggregation**: 1 scheduled run per day
- **Lazy Aggregation**: Maximum 24 additional runs per day
- **Total Maximum**: 25 aggregation runs per day
- **Typical Usage**: 2-5 runs per day in practice

### Example Cost Scenarios
- **Low Usage**: 1-2 aggregations per day (daily cron + occasional dashboard access)
- **Medium Usage**: 5-10 aggregations per day (regular dashboard monitoring)
- **High Usage**: 24 aggregations per day (hourly dashboard access - throttled)

## Benefits of This Approach

### 1. Cost Efficiency
- **Free Tier Compliant**: Works within Hobby plan limits
- **Minimal Operations**: Lazy processing with throttling reduces KV usage
- **Smart Scheduling**: Daily cron for maintenance only
- **Predictable Costs**: Hard limit on aggregation frequency

### 2. Performance
- **Real-time Feel**: Dashboard shows current data via lazy aggregation
- **Fast Access**: Edge Config provides global, cached data
- **Efficient Processing**: Batch operations when needed

### 3. Reliability
- **Backup Strategy**: Multiple storage layers
- **Failure Recovery**: Daily cron ensures data consistency
- **Monitoring**: Built-in status tracking

## Monitoring & Maintenance

### Key Metrics to Track
- **Dashboard Access Frequency**: Determines lazy aggregation triggers
- **Data Processing Time**: Ensures operations stay within limits
- **Storage Usage**: Monitor KV and Edge Config consumption
- **Error Rates**: Track failed aggregations

### Maintenance Tasks
- **Daily**: Automatic cleanup via cron job
- **Weekly**: Review storage usage and optimize
- **Monthly**: Analyze access patterns and adjust strategy

## Migration Path to Pro Plan

### When to Upgrade
- **High Traffic**: More than 1000 daily visitors
- **Real-time Needs**: Require sub-hourly analytics
- **Advanced Features**: Need complex aggregations

### Pro Plan Benefits
- **Frequent Cron Jobs**: Every 5 minutes or less
- **More KV Operations**: Higher rate limits
- **Advanced Analytics**: Complex real-time processing

### Migration Strategy
1. **Update Cron Schedule**: Change from daily to desired frequency
2. **Increase Processing**: Add real-time aggregation layers
3. **Enhance Dashboard**: Add live charts and real-time metrics
4. **Scale Storage**: Optimize for higher data volumes

## Troubleshooting

### Common Issues

#### Cron Job Errors
- **Problem**: `"Hobby accounts are limited to daily cron jobs"`
- **Solution**: Ensure schedule is `0 0 * * *` (daily only)
- **Verification**: Check `vercel.json` configuration

#### Missing Data
- **Problem**: Dashboard shows no data
- **Solution**: Trigger lazy aggregation by accessing dashboard
- **Check**: Verify `analytics:last_dashboard_access` timestamp

#### Performance Issues
- **Problem**: Slow dashboard loading
- **Solution**: Optimize aggregation batch sizes
- **Monitor**: Check function execution times

### Debug Commands
```bash
# Check current configuration
cat vercel.json

# Test storage connections
node scripts/test-vercel-storage.js

# Verify environment variables
vercel env ls

# Check deployment logs
vercel logs
```

## Conclusion

This hybrid approach provides a robust analytics solution that:
- Complies with Vercel Hobby plan limitations
- Delivers real-time insights when needed
- Maintains cost efficiency
- Scales easily to Pro plan when required

The combination of daily cron jobs with lazy aggregation ensures users get the analytics they need while staying within free tier constraints.