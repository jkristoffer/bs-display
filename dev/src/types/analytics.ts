export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'interaction' | 'quiz_event' | 'conversion' | 'custom';
  timestamp: number;
  sessionId: string;
  data: Record<string, any>;
  metadata?: {
    url?: string;
    referrer?: string;
    userAgent?: string;
    samplingRate?: number;
  };
}

export interface AggregatedData {
  period: string;
  startTime: number;
  endTime: number;
  metrics: {
    totalEvents: number;
    uniqueSessions: number;
    eventsByType: Record<string, number>;
    // Custom metrics based on event type
    pageViews?: number;
    conversions?: number;
    quizCompletions?: number;
  };
  dimensions: {
    topPages?: Array<{ path: string; count: number }>;
    topReferrers?: Array<{ source: string; count: number }>;
    deviceTypes?: Record<string, number>;
  };
}

export interface DashboardSummary {
  generated: number;
  period: string;
  overview: {
    totalVisitors: number;
    pageViews: number;
    conversions: number;
    avgSessionDuration: number;
  };
  trends: {
    hourly: Array<{ time: string; value: number }>;
    daily: Array<{ date: string; value: number }>;
  };
  topContent: Array<{ path: string; views: number; engagement: number }>;
  sources: Array<{ name: string; visits: number; percentage: number }>;
}