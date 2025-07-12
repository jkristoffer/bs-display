import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { GA4_CONFIG } from '@config/analytics.config';

let analyticsClient: BetaAnalyticsDataClient | null = null;

export function getGA4Client(): BetaAnalyticsDataClient {
  if (!analyticsClient && GA4_CONFIG.serviceAccountKey) {
    analyticsClient = new BetaAnalyticsDataClient({
      credentials: GA4_CONFIG.serviceAccountKey
    });
  }
  
  if (!analyticsClient) {
    throw new Error('GA4 client not initialized. Check service account configuration.');
  }
  
  return analyticsClient;
}

export async function runGA4Report({
  metrics,
  dimensions = [],
  dateRanges = [GA4_CONFIG.defaultDateRange],
  dimensionFilter = null,
  limit = 10
}: {
  metrics: string[];
  dimensions?: string[];
  dateRanges?: Array<{ startDate: string; endDate: string }>;
  dimensionFilter?: any;
  limit?: number;
}) {
  try {
    const client = getGA4Client();
    
    const [response] = await client.runReport({
      property: `properties/${GA4_CONFIG.propertyId}`,
      dateRanges,
      dimensions: dimensions.map(name => ({ name })),
      metrics: metrics.map(name => ({ name })),
      dimensionFilter,
      limit
    });
    
    return response;
  } catch (error: any) {
    console.error('GA4 Report Error:', error);
    throw new Error(`Failed to fetch GA4 data: ${error.message}`);
  }
}

export async function runGA4RealtimeReport({
  metrics,
  dimensions = []
}: {
  metrics: string[];
  dimensions?: string[];
}) {
  try {
    const client = getGA4Client();
    
    const [response] = await client.runRealtimeReport({
      property: `properties/${GA4_CONFIG.propertyId}`,
      dimensions: dimensions.map(name => ({ name })),
      metrics: metrics.map(name => ({ name }))
    });
    
    return response;
  } catch (error: any) {
    console.error('GA4 Realtime Report Error:', error);
    throw new Error(`Failed to fetch GA4 realtime data: ${error.message}`);
  }
}