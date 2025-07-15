import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';
import LZString from 'lz-string';
import { ANALYTICS_CONFIG } from '@config/analytics-storage.config';
import type { DashboardSummary } from '../../../types/analytics';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Track dashboard access for lazy aggregation
    await kv.set('analytics:last_dashboard_access', Date.now());
    
    // Parse query parameters
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '24h';
    const refresh = url.searchParams.get('refresh') === 'true';
    
    // Get dashboard data
    const data = await getDashboardData(period, refresh);
    
    // Return with cache headers for edge caching
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
      }
    });
    
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    
    // Return fallback data on error
    return new Response(JSON.stringify(getFallbackData()), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60'
      }
    });
  }
};

async function getDashboardData(period: string, refresh: boolean): Promise<DashboardSummary> {
  let summary: DashboardSummary | null = null;
  
  // Step 1: Try Edge Config first (FREE reads)
  if (!refresh) {
    try {
      // For now, read from KV with edge_config prefix (placeholder)
      const edgeData = await kv.get(`edge_config:${ANALYTICS_CONFIG.edgeConfig.dashboardSummary}`) as DashboardSummary;
      if (edgeData && Date.now() - edgeData.generated < 300000) { // 5 minutes
        console.log('Dashboard data from Edge Config (free read)');
        return edgeData;
      }
    } catch (error) {
      console.log('Edge Config read failed, falling back');
    }
  }
  
  // Step 2: Try compressed KV backup
  try {
    const compressed = await kv.get(ANALYTICS_CONFIG.kvKeys.backup) as string;
    if (compressed) {
      const decompressed = LZString.decompress(compressed);
      if (decompressed) {
        summary = JSON.parse(decompressed);
        if (summary && Date.now() - summary.generated < 600000) { // 10 minutes
          console.log('Dashboard data from KV backup');
          return summary;
        }
      }
    }
  } catch (error) {
    console.log('KV backup read failed');
  }
  
  // Step 3: Generate real-time data if needed
  if (!summary || refresh) {
    console.log('Generating real-time dashboard data');
    summary = await generateRealtimeData(period);
    
    // Cache the generated data
    await Promise.all([
      kv.set(`edge_config:${ANALYTICS_CONFIG.edgeConfig.dashboardSummary}`, summary),
      kv.setex(
        ANALYTICS_CONFIG.kvKeys.backup,
        ANALYTICS_CONFIG.ttl.dashboardCache,
        LZString.compress(JSON.stringify(summary))
      )
    ]);
  }
  
  return summary;
}

async function generateRealtimeData(period: string): Promise<DashboardSummary> {
  const now = Date.now();
  const startTime = getStartTime(period);
  
  // Collect hourly aggregates
  const hourlyKeys = await kv.keys(`${ANALYTICS_CONFIG.kvKeys.aggregates.hourly}*`);
  const relevantKeys = hourlyKeys.filter(key => {
    const timestamp = extractTimestamp(key);
    return timestamp && timestamp >= startTime;
  });
  
  // Get aggregated data
  const aggregates = await kv.mget(...relevantKeys);
  
  // Process and combine data
  const combined = processAggregates(aggregates);
  
  return {
    generated: now,
    period,
    overview: {
      totalVisitors: combined.uniqueSessions,
      pageViews: combined.pageViews,
      conversions: combined.conversions,
      avgSessionDuration: combined.avgSessionDuration
    },
    trends: {
      hourly: combined.hourlyTrend,
      daily: combined.dailyTrend
    },
    topContent: combined.topContent,
    sources: combined.sources
  };
}

function processAggregates(aggregates: any[]): any {
  const result = {
    uniqueSessions: 0,
    pageViews: 0,
    conversions: 0,
    avgSessionDuration: 180,
    hourlyTrend: [] as any[],
    dailyTrend: [] as any[],
    topContent: [] as any[],
    sources: [] as any[]
  };
  
  const sessionSet = new Set<string>();
  const pageMap = new Map<string, number>();
  const hourlyMap = new Map<string, number>();
  
  for (const agg of aggregates) {
    if (!agg) continue;
    
    const data = agg as any;
    
    // Accumulate metrics
    result.pageViews += data.metrics?.pageViews || 0;
    result.conversions += data.metrics?.conversions || 0;
    
    // Track unique sessions
    if (data.metrics?.uniqueSessions) {
      sessionSet.add(data.period);
    }
    
    // Accumulate page views
    if (data.dimensions?.topPages) {
      for (const page of data.dimensions.topPages) {
        pageMap.set(page.path, (pageMap.get(page.path) || 0) + page.count);
      }
    }
    
    // Build hourly trend
    const hour = new Date(data.startTime).toISOString();
    hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + data.metrics.totalEvents);
  }
  
  result.uniqueSessions = sessionSet.size || estimateUniqueSessions(result.pageViews);
  
  // Format top content
  result.topContent = Array.from(pageMap.entries())
    .map(([path, views]) => ({
      path,
      views,
      engagement: Math.min(100, views * 10)
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  // Format hourly trend
  result.hourlyTrend = Array.from(hourlyMap.entries())
    .map(([time, value]) => ({ time, value }))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  
  // Generate daily trend from hourly data
  result.dailyTrend = generateDailyFromHourly(result.hourlyTrend);
  
  // Estimate traffic sources
  result.sources = estimateTrafficSources(result.pageViews);
  
  return result;
}

function getFallbackData(): DashboardSummary {
  const now = Date.now();
  
  return {
    generated: now,
    period: '24h',
    overview: {
      totalVisitors: 0,
      pageViews: 0,
      conversions: 0,
      avgSessionDuration: 0
    },
    trends: {
      hourly: generateEmptyHourlyTrend(),
      daily: generateEmptyDailyTrend()
    },
    topContent: [],
    sources: [
      { name: 'Direct', visits: 0, percentage: 0 },
      { name: 'Search', visits: 0, percentage: 0 },
      { name: 'Social', visits: 0, percentage: 0 },
      { name: 'Referral', visits: 0, percentage: 0 }
    ]
  };
}

// Helper functions
function getStartTime(period: string): number {
  const now = Date.now();
  switch (period) {
    case '1h': return now - 3600000;
    case '24h': return now - 86400000;
    case '7d': return now - 604800000;
    case '30d': return now - 2592000000;
    default: return now - 86400000;
  }
}

function extractTimestamp(key: string): number | null {
  const parts = key.split('-');
  if (parts.length >= 5) {
    const [year, month, day, hour] = parts.slice(-4);
    const date = new Date(
      parseInt(year),
      parseInt(month),
      parseInt(day),
      parseInt(hour)
    );
    return date.getTime();
  }
  return null;
}

function estimateUniqueSessions(pageViews: number): number {
  // Rough estimate: 2.5 page views per session on average
  return Math.floor(pageViews / 2.5);
}

function generateDailyFromHourly(hourlyTrend: any[]): any[] {
  const dailyMap = new Map<string, number>();
  
  for (const hour of hourlyTrend) {
    const date = new Date(hour.time).toISOString().split('T')[0];
    dailyMap.set(date, (dailyMap.get(date) || 0) + hour.value);
  }
  
  return Array.from(dailyMap.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function estimateTrafficSources(totalVisits: number): any[] {
  return [
    { name: 'Direct', visits: Math.floor(totalVisits * 0.4), percentage: 40 },
    { name: 'Search', visits: Math.floor(totalVisits * 0.3), percentage: 30 },
    { name: 'Social', visits: Math.floor(totalVisits * 0.2), percentage: 20 },
    { name: 'Referral', visits: Math.floor(totalVisits * 0.1), percentage: 10 }
  ];
}

function generateEmptyHourlyTrend(): any[] {
  const trend = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date();
    time.setHours(time.getHours() - i);
    trend.push({ time: time.toISOString(), value: 0 });
  }
  return trend;
}

function generateEmptyDailyTrend(): any[] {
  const trend = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({ date: date.toISOString().split('T')[0], value: 0 });
  }
  return trend;
}