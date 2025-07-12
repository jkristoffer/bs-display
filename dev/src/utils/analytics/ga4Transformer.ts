import type { google } from '@google-analytics/data/build/protos/protos';

type RunReportResponse = google.analytics.data.v1beta.IRunReportResponse;

export function transformGA4Response(response: RunReportResponse) {
  const headers = [
    ...(response.dimensionHeaders || []).map(h => h.name || ''),
    ...(response.metricHeaders || []).map(h => h.name || '')
  ];
  
  const rows = (response.rows || []).map(row => {
    const values = [
      ...(row.dimensionValues || []).map(v => v.value || ''),
      ...(row.metricValues || []).map(v => v.value || '')
    ];
    
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {} as Record<string, string>);
  });
  
  return { headers, rows };
}

export function calculateMetricTotals(rows: Array<Record<string, string>>, metricNames: string[]) {
  return metricNames.reduce((totals, metric) => {
    totals[metric] = rows.reduce((sum, row) => {
      const value = parseFloat(row[metric] || '0');
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    return totals;
  }, {} as Record<string, number>);
}

export function formatGA4DateRange(period: string): { startDate: string; endDate: string } {
  const endDate = 'today';
  let startDate = '7daysAgo';
  
  switch (period) {
    case '24h':
      startDate = 'yesterday';
      break;
    case '7d':
      startDate = '7daysAgo';
      break;
    case '30d':
      startDate = '30daysAgo';
      break;
    case '90d':
      startDate = '90daysAgo';
      break;
  }
  
  return { startDate, endDate };
}

export function mapGA4ToOverviewData(ga4Data: RunReportResponse) {
  // Transform GA4 response to match existing dashboard format
  const { rows } = transformGA4Response(ga4Data);
  
  // If no rows, return zeros
  if (!rows.length) {
    return {
      totalVisitors: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      conversionRate: 0
    };
  }
  
  const totals = calculateMetricTotals(rows, [
    'totalUsers', 
    'newUsers', 
    'screenPageViews',
    'averageSessionDuration',
    'bounceRate',
    'conversions'
  ]);
  
  return {
    totalVisitors: Math.round(totals.totalUsers || 0),
    uniqueVisitors: Math.round(totals.newUsers || 0),
    pageViews: Math.round(totals.screenPageViews || 0),
    avgSessionDuration: Math.round(totals.averageSessionDuration || 180),
    bounceRate: parseFloat(((totals.bounceRate || 0) * 100).toFixed(1)),
    conversionRate: parseFloat((totals.conversions || 0).toFixed(1))
  };
}