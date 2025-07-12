import { runGA4Report } from './ga4Client';
import { GA4_METRICS, GA4_DIMENSIONS } from '@config/analytics.config';
import { transformGA4Response, mapGA4ToOverviewData, formatGA4DateRange } from './ga4Transformer';

export async function fetchGA4OverviewData(period: string = '7d') {
  try {
    const dateRange = formatGA4DateRange(period);
    
    // Fetch main metrics
    const metricsResponse = await runGA4Report({
      metrics: GA4_METRICS.overview,
      dateRanges: [dateRange]
    });
    
    // Fetch trends data
    const trendsResponse = await runGA4Report({
      metrics: ['totalUsers', 'screenPageViews', 'conversions'],
      dimensions: ['date'],
      dateRanges: [dateRange]
    });
    
    // Fetch top pages
    const pagesResponse = await runGA4Report({
      metrics: ['screenPageViews', 'averageSessionDuration', 'bounceRate'],
      dimensions: GA4_DIMENSIONS.pages,
      dateRanges: [dateRange],
      limit: 10
    });
    
    // Fetch device data
    const deviceResponse = await runGA4Report({
      metrics: ['totalUsers'],
      dimensions: ['deviceCategory'],
      dateRanges: [dateRange]
    });
    
    // Fetch referrer data
    const referrerResponse = await runGA4Report({
      metrics: ['sessions'],
      dimensions: ['sessionDefaultChannelGroup'],
      dateRanges: [dateRange]
    });
    
    return {
      summary: mapGA4ToOverviewData(metricsResponse),
      trends: formatTrendsData(trendsResponse),
      topPages: formatPagesData(pagesResponse),
      devices: formatDeviceData(deviceResponse),
      referrers: formatReferrerData(referrerResponse)
    };
  } catch (error) {
    console.error('GA4 Data Fetch Error:', error);
    throw error;
  }
}

function formatTrendsData(response: any) {
  const { rows } = transformGA4Response(response);
  
  return {
    visitors: rows.map(row => ({
      date: formatDate(row.date),
      value: parseInt(row.totalUsers || '0')
    })),
    pageViews: rows.map(row => ({
      date: formatDate(row.date),
      value: parseInt(row.screenPageViews || '0')
    })),
    conversions: rows.map(row => ({
      date: formatDate(row.date),
      value: parseInt(row.conversions || '0')
    }))
  };
}

function formatPagesData(response: any) {
  const { rows } = transformGA4Response(response);
  
  return rows.map(row => ({
    path: row.pagePath || '/',
    views: parseInt(row.screenPageViews || '0'),
    avgTime: Math.round(parseFloat(row.averageSessionDuration || '0')),
    bounceRate: parseFloat(((parseFloat(row.bounceRate || '0')) * 100).toFixed(1))
  }));
}

function formatDeviceData(response: any) {
  const { rows } = transformGA4Response(response);
  const deviceMap: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
  
  rows.forEach(row => {
    const device = row.deviceCategory?.toLowerCase() || 'desktop';
    deviceMap[device] = parseInt(row.totalUsers || '0');
  });
  
  const total = Object.values(deviceMap).reduce((sum, val) => sum + val, 0);
  
  // Return percentages
  if (total === 0) {
    return { desktop: 0, mobile: 0, tablet: 0 };
  }
  
  return {
    desktop: Math.round((deviceMap.desktop / total) * 100),
    mobile: Math.round((deviceMap.mobile / total) * 100),
    tablet: Math.round((deviceMap.tablet / total) * 100)
  };
}

function formatReferrerData(response: any) {
  const { rows } = transformGA4Response(response);
  const total = rows.reduce((sum, row) => sum + parseInt(row.sessions || '0'), 0);
  
  if (total === 0) {
    return [];
  }
  
  return rows.slice(0, 5).map(row => {
    const visits = parseInt(row.sessions || '0');
    return {
      source: row.sessionDefaultChannelGroup || 'Direct',
      visits,
      percentage: parseFloat(((visits / total) * 100).toFixed(1))
    };
  });
}

// Format date from YYYYMMDD to YYYY-MM-DD
function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
}