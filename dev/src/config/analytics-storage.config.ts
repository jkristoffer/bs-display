export const ANALYTICS_CONFIG = {
  // Batching settings
  batching: {
    maxBatchSize: 50,
    flushIntervalMs: 30000, // 30 seconds
    maxRetries: 3
  },
  
  // Storage TTLs
  ttl: {
    rawEvents: 3600, // 1 hour in seconds
    fiveMinAggregates: 86400, // 1 day
    hourlyAggregates: 604800, // 7 days
    dailyAggregates: 2592000, // 30 days
    dashboardCache: 300 // 5 minutes
  },
  
  // Sampling rates
  sampling: {
    pageViews: 0.1, // 10% sampling
    interactions: 0.05, // 5% sampling
    conversions: 1.0, // 100% (always track)
    quizEvents: 1.0 // 100% (always track)
  },
  
  // Edge Config keys
  edgeConfig: {
    dashboardSummary: 'analytics_dashboard_summary',
    realtimeMetrics: 'analytics_realtime',
    aggregationStatus: 'analytics_last_aggregation'
  },
  
  // KV keys
  kvKeys: {
    rawEvents: 'analytics:raw:',
    aggregates: {
      fiveMin: 'analytics:5min:',
      hourly: 'analytics:hourly:',
      daily: 'analytics:daily:'
    },
    backup: 'analytics:backup:dashboard'
  }
};