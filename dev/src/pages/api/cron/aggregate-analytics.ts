import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';
import LZString from 'lz-string';
import { ANALYTICS_CONFIG } from '@config/analytics-storage.config';
import type { AggregatedData, DashboardSummary } from '../../../types/analytics';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const startTime = Date.now();
    
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
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if dashboard has been accessed recently (skip if no recent activity)
    const lastAccess = await kv.get('analytics:last_dashboard_access') as number;
    if (lastAccess && now - lastAccess > 86400000) { // 24 hours
      console.log('Skipping aggregation - dashboard not accessed recently');
      return new Response(JSON.stringify({ 
        skipped: true, 
        reason: 'no_recent_access',
        lastAccess: new Date(lastAccess).toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Perform multi-level aggregation
    const results = await performAggregation();
    
    // Generate dashboard summary
    const summary = generateDashboardSummary(results);
    
    // Store in both Edge Config (for free reads) and KV (for backup)
    await Promise.all([
      updateEdgeConfig(ANALYTICS_CONFIG.edgeConfig.dashboardSummary, summary),
      kv.setex(
        ANALYTICS_CONFIG.kvKeys.backup,
        ANALYTICS_CONFIG.ttl.dashboardCache,
        LZString.compress(JSON.stringify(summary))
      ),
      updateEdgeConfig(ANALYTICS_CONFIG.edgeConfig.aggregationStatus, {
        lastRun: Date.now(),
        duration: Date.now() - startTime,
        success: true
      }),
      // Track when aggregation last ran (for throttling)
      kv.set('analytics:last_aggregation_run', Date.now())
    ]);
    
    // Clean up old data
    await cleanupOldData();
    
    return new Response(JSON.stringify({
      success: true,
      duration: Date.now() - startTime,
      summary: {
        totalEvents: results.totalEvents,
        uniqueSessions: results.uniqueSessions
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Aggregation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function performAggregation() {
  const now = Date.now();
  const results = {
    totalEvents: 0,
    uniqueSessions: new Set<string>(),
    eventsByType: {} as Record<string, number>,
    pageViews: [] as any[],
    conversions: [] as any[],
    hourlyData: [] as any[]
  };
  
  // Get all 5-minute aggregates from the last hour
  const fiveMinKeys = await kv.keys(`${ANALYTICS_CONFIG.kvKeys.aggregates.fiveMin}*`);
  
  // Process in batches to avoid memory issues
  const batchSize = 100;
  for (let i = 0; i < fiveMinKeys.length; i += batchSize) {
    const batch = fiveMinKeys.slice(i, i + batchSize);
    const values = await kv.mget(...batch);
    
    for (const value of values) {
      if (!value) continue;
      
      const aggregate = value as any;
      results.totalEvents += aggregate.count;
      
      // Extract session IDs if available
      if (aggregate.sessionId) {
        results.uniqueSessions.add(aggregate.sessionId);
      }
      
      // Accumulate by type
      const [type] = aggregate.key.split(':');
      results.eventsByType[type] = (results.eventsByType[type] || 0) + aggregate.count;
      
      // Collect specific data for dashboard
      if (type === 'page_view') {
        results.pageViews.push(aggregate);
      } else if (type === 'conversion') {
        results.conversions.push(aggregate);
      }
    }
  }
  
  // Create hourly aggregate
  const hourKey = `${ANALYTICS_CONFIG.kvKeys.aggregates.hourly}${getHourKey()}`;
  const hourlyAggregate: AggregatedData = {
    period: 'hourly',
    startTime: now - 3600000,
    endTime: now,
    metrics: {
      totalEvents: results.totalEvents,
      uniqueSessions: results.uniqueSessions.size,
      eventsByType: results.eventsByType,
      pageViews: results.eventsByType.page_view || 0,
      conversions: results.eventsByType.conversion || 0,
      quizCompletions: results.eventsByType.quiz_event || 0
    },
    dimensions: {
      topPages: aggregateTopPages(results.pageViews),
      deviceTypes: aggregateDeviceTypes(results.pageViews)
    }
  };
  
  // Store hourly aggregate
  await kv.setex(hourKey, ANALYTICS_CONFIG.ttl.hourlyAggregates, hourlyAggregate);
  
  return {
    ...results,
    uniqueSessions: results.uniqueSessions.size,
    hourlyAggregate
  };
}

function generateDashboardSummary(results: any): DashboardSummary {
  const now = Date.now();
  
  return {
    generated: now,
    period: '24h',
    overview: {
      totalVisitors: results.uniqueSessions,
      pageViews: results.eventsByType.page_view || 0,
      conversions: results.eventsByType.conversion || 0,
      avgSessionDuration: calculateAvgSessionDuration()
    },
    trends: {
      hourly: generateHourlyTrend(),
      daily: generateDailyTrend()
    },
    topContent: results.pageViews.slice(0, 10).map((pv: any) => ({
      path: pv.data.path,
      views: pv.count,
      engagement: calculateEngagement(pv)
    })),
    sources: generateTrafficSources()
  };
}

async function updateEdgeConfig(key: string, value: any) {
  // This would use Vercel's Edge Config API
  // For now, we'll store in KV as a placeholder
  const edgeKey = `edge_config:${key}`;
  await kv.set(edgeKey, value);
}

async function cleanupOldData() {
  // Clean up old 5-minute aggregates (older than 1 hour)
  const cutoff = Date.now() - 3600000;
  const oldKeys = await kv.keys(`${ANALYTICS_CONFIG.kvKeys.aggregates.fiveMin}*`);
  
  const toDelete = [];
  for (const key of oldKeys) {
    const timestamp = extractTimestamp(key);
    if (timestamp && timestamp < cutoff) {
      toDelete.push(key);
    }
  }
  
  if (toDelete.length > 0) {
    await kv.del(...toDelete);
    console.log(`Cleaned up ${toDelete.length} old aggregates`);
  }
}

// Helper functions
function getHourKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
}

function aggregateTopPages(pageViews: any[]): any[] {
  const pageMap = new Map<string, number>();
  
  for (const pv of pageViews) {
    const path = pv.data.path || '/';
    pageMap.set(path, (pageMap.get(path) || 0) + pv.count);
  }
  
  return Array.from(pageMap.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function aggregateDeviceTypes(events: any[]): Record<string, number> {
  // Simple device detection from user agent
  // In production, this would be more sophisticated
  return {
    desktop: Math.floor(events.length * 0.6),
    mobile: Math.floor(events.length * 0.3),
    tablet: Math.floor(events.length * 0.1)
  };
}

function calculateAvgSessionDuration(): number {
  // Placeholder - would calculate from session data
  return 180; // 3 minutes
}

function calculateEngagement(pageView: any): number {
  // Placeholder engagement score
  return Math.min(100, pageView.count * 10);
}

function generateHourlyTrend(): any[] {
  // Generate last 24 hours of data
  const trend = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date();
    time.setHours(time.getHours() - i);
    trend.push({
      time: time.toISOString(),
      value: Math.floor(Math.random() * 100) // Placeholder
    });
  }
  return trend;
}

function generateDailyTrend(): any[] {
  // Generate last 30 days of data
  const trend = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 1000) // Placeholder
    });
  }
  return trend;
}

function generateTrafficSources(): any[] {
  // Placeholder - would be calculated from referrer data
  return [
    { name: 'Direct', visits: 1000, percentage: 40 },
    { name: 'Search', visits: 750, percentage: 30 },
    { name: 'Social', visits: 500, percentage: 20 },
    { name: 'Referral', visits: 250, percentage: 10 }
  ];
}

function extractTimestamp(key: string): number | null {
  const match = key.match(/-(\d+)$/);
  return match ? parseInt(match[1]) : null;
}