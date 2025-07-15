import type { 
  AnalyticsEvent, 
  RealTimeMetric 
} from '../types';
import { SessionManager } from '../core/SessionManager';
import { EventProcessor } from '../core/EventProcessor';

export class MetricsCollector {
  private static instance: MetricsCollector;
  private metricsBuffer: Map<string, MetricBuffer> = new Map();
  private aggregationInterval: NodeJS.Timeout | null = null;
  private readonly BUFFER_SIZE = 100;
  private readonly AGGREGATION_INTERVAL = 10000; // 10 seconds
  private readonly METRIC_RETENTION_HOURS = 24;

  private constructor() {
    this.initializeBuffers();
    this.startAggregation();
  }

  public static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  private initializeBuffers(): void {
    const metricTypes = [
      'page_views',
      'unique_visitors',
      'session_duration',
      'bounce_rate',
      'conversion_rate',
      'engagement_score',
      'lead_score',
      'event_count',
      'error_rate',
      'load_time',
      'scroll_depth',
      'click_through_rate',
      'form_completion_rate',
      'product_views',
      'quiz_completions'
    ];

    metricTypes.forEach(type => {
      this.metricsBuffer.set(type, {
        type,
        values: [],
        timestamps: [],
        aggregated: {
          current: 0,
          change: 0,
          trend: 'stable',
          sparkline: []
        },
        lastAggregation: Date.now()
      });
    });
  }

  private startAggregation(): void {
    this.aggregationInterval = setInterval(() => {
      this.aggregateMetrics();
    }, this.AGGREGATION_INTERVAL);
  }

  public collectEvent(event: AnalyticsEvent): void {
    const processor = EventProcessor.getInstance();
    const processedEvent = processor.processEvent(event);
    
    // Collect metrics based on event type
    this.collectEventMetrics(processedEvent);
    
    // Update real-time counters
    this.updateEventCounters(event);
    
    // Store for historical analysis
    this.storeEventData(processedEvent);
  }

  private collectEventMetrics(event: any): void {
    const eventType = event.event_type;
    const timestamp = event.timestamp.getTime();

    // Page view metrics
    if (eventType === 'page_view') {
      this.addMetricValue('page_views', 1, timestamp);
      this.updateUniqueVisitors(event);
    }

    // Product view metrics
    if (eventType === 'product_view') {
      this.addMetricValue('product_views', 1, timestamp);
      this.collectProductMetrics(event);
    }

    // Quiz interaction metrics
    if (eventType === 'quiz_interaction') {
      this.collectQuizMetrics(event);
    }

    // Form submission metrics
    if (eventType === 'form_submission') {
      this.collectFormMetrics(event);
    }

    // Conversion metrics
    if (eventType === 'conversion_event') {
      this.collectConversionMetrics(event);
    }

    // Error metrics
    if (eventType === 'error_encounter') {
      this.addMetricValue('error_rate', 1, timestamp);
    }

    // Scroll metrics
    if (eventType === 'scroll_milestone') {
      this.collectScrollMetrics(event);
    }

    // Click metrics
    if (eventType === 'click_event') {
      this.collectClickMetrics(event);
    }

    // Update general metrics
    this.updateEngagementMetrics(event);
    this.updateLeadScoringMetrics(event);
  }

  private addMetricValue(metricType: string, value: number, timestamp: number): void {
    const buffer = this.metricsBuffer.get(metricType);
    if (!buffer) return;

    buffer.values.push(value);
    buffer.timestamps.push(timestamp);

    // Keep buffer size manageable
    if (buffer.values.length > this.BUFFER_SIZE) {
      buffer.values.shift();
      buffer.timestamps.shift();
    }
  }

  private updateUniqueVisitors(event: any): void {
    const sessionManager = SessionManager.getInstance();
    const visitorType = sessionManager.getVisitorType();
    
    if (visitorType === 'new') {
      this.addMetricValue('unique_visitors', 1, event.timestamp.getTime());
    }
  }

  private collectProductMetrics(event: any): void {
    const properties = event.properties;
    const productData = event.processed_data?.product_insights;
    
    if (productData?.is_high_value) {
      this.addMetricValue('high_value_product_views', 1, event.timestamp.getTime());
    }

    // Track by category
    const category = properties.product_category;
    if (category) {
      this.addMetricValue(`product_views_${category}`, 1, event.timestamp.getTime());
    }

    // Track by brand
    const brand = properties.product_brand;
    if (brand) {
      this.addMetricValue(`product_views_${brand.toLowerCase()}`, 1, event.timestamp.getTime());
    }
  }

  private collectQuizMetrics(event: any): void {
    const quizData = event.processed_data?.quiz_insights;
    
    if (quizData?.progress_percentage >= 100) {
      this.addMetricValue('quiz_completions', 1, event.timestamp.getTime());
    }

    // Track by progress milestones
    const progress = quizData?.progress_percentage || 0;
    if (progress >= 25) {
      this.addMetricValue('quiz_25_percent', 1, event.timestamp.getTime());
    }
    if (progress >= 50) {
      this.addMetricValue('quiz_50_percent', 1, event.timestamp.getTime());
    }
    if (progress >= 75) {
      this.addMetricValue('quiz_75_percent', 1, event.timestamp.getTime());
    }
  }

  private collectFormMetrics(event: any): void {
    const formData = event.processed_data?.form_insights;
    
    if (formData?.is_lead_form) {
      this.addMetricValue('lead_form_submissions', 1, event.timestamp.getTime());
    }

    // Track completion rate
    this.addMetricValue('form_completion_rate', 1, event.timestamp.getTime());
    
    // Track by form type
    const formType = formData?.form_type;
    if (formType) {
      this.addMetricValue(`${formType}_form_submissions`, 1, event.timestamp.getTime());
    }
  }

  private collectConversionMetrics(event: any): void {
    const conversionData = event.processed_data?.conversion_insights;
    
    this.addMetricValue('conversion_rate', 1, event.timestamp.getTime());
    
    if (conversionData?.is_high_value) {
      this.addMetricValue('high_value_conversions', 1, event.timestamp.getTime());
    }

    // Track by conversion type
    const conversionType = conversionData?.conversion_type;
    if (conversionType) {
      this.addMetricValue(`${conversionType}_conversions`, 1, event.timestamp.getTime());
    }

    // Revenue tracking
    const value = event.properties.conversion_value;
    if (value) {
      this.addMetricValue('total_revenue', value, event.timestamp.getTime());
    }
  }

  private collectScrollMetrics(event: any): void {
    const scrollData = event.processed_data?.scroll_insights;
    const milestone = scrollData?.milestone || 0;
    
    this.addMetricValue('scroll_depth', milestone, event.timestamp.getTime());
    
    if (scrollData?.is_deep_scroll) {
      this.addMetricValue('deep_scroll_rate', 1, event.timestamp.getTime());
    }
  }

  private collectClickMetrics(event: any): void {
    const clickData = event.processed_data?.click_insights;
    
    if (clickData?.is_cta_click) {
      this.addMetricValue('cta_click_rate', 1, event.timestamp.getTime());
    }

    if (clickData?.importance === 'high') {
      this.addMetricValue('high_value_clicks', 1, event.timestamp.getTime());
    }
  }

  private updateEngagementMetrics(event: any): void {
    const sessionManager = SessionManager.getInstance();
    const sessionMetrics = sessionManager.getSessionMetrics();
    
    this.addMetricValue('engagement_score', sessionMetrics.engagement_score, event.timestamp.getTime());
    this.addMetricValue('session_duration', sessionMetrics.duration, event.timestamp.getTime());
    
    // Calculate bounce rate
    const bounceRate = sessionMetrics.bounce_rate;
    this.addMetricValue('bounce_rate', bounceRate, event.timestamp.getTime());
  }

  private updateLeadScoringMetrics(event: any): void {
    const leadScoreImpact = event.lead_score_impact || 0;
    const currentScore = parseInt(localStorage.getItem('bs_analytics_lead_score') || '0');
    
    this.addMetricValue('lead_score', currentScore + leadScoreImpact, event.timestamp.getTime());
    
    // Track conversion probability
    const conversionProbability = event.conversion_probability || 0;
    this.addMetricValue('conversion_probability', conversionProbability, event.timestamp.getTime());
  }

  private updateEventCounters(event: AnalyticsEvent): void {
    const eventType = event.event_type;
    this.addMetricValue('event_count', 1, event.timestamp.getTime());
    this.addMetricValue(`${eventType}_count`, 1, event.timestamp.getTime());
  }

  private storeEventData(event: any): void {
    try {
      const storageKey = `bs_analytics_events_${this.getDateKey()}`;
      const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const eventSummary = {
        type: event.event_type,
        timestamp: event.timestamp,
        properties: event.properties,
        processed_data: event.processed_data,
        lead_score_impact: event.lead_score_impact,
        conversion_probability: event.conversion_probability
      };
      
      existingData.push(eventSummary);
      
      // Keep only last 1000 events per day
      if (existingData.length > 1000) {
        existingData.shift();
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingData));
      
      // Clean old data
      this.cleanOldData();
      
    } catch (error) {
      console.error('Failed to store event data:', error);
    }
  }

  private getDateKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  private cleanOldData(): void {
    try {
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - this.METRIC_RETENTION_HOURS);
      const cutoffKey = cutoffDate.toISOString().split('T')[0];
      
      // Remove old localStorage entries
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith('bs_analytics_events_') && key < `bs_analytics_events_${cutoffKey}`) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Failed to clean old data:', error);
    }
  }

  private aggregateMetrics(): void {
    this.metricsBuffer.forEach((buffer, metricType) => {
      if (buffer.values.length === 0) return;

      const now = Date.now();
      const timeWindow = now - this.AGGREGATION_INTERVAL;
      
      // Filter values within the time window
      const recentValues = buffer.values.filter((_, index) => 
        buffer.timestamps[index] >= timeWindow
      );

      if (recentValues.length === 0) return;

      // Calculate aggregated value
      const current = this.calculateAggregatedValue(metricType, recentValues);
      const previous = buffer.aggregated.current;
      const change = this.calculateChange(previous, current);
      const trend = this.determineTrend(change);

      // Update sparkline
      const sparkline = [...buffer.aggregated.sparkline.slice(-19), current];

      // Update aggregated metrics
      buffer.aggregated = {
        current,
        change,
        trend,
        sparkline
      };

      buffer.lastAggregation = now;
    });
  }

  private calculateAggregatedValue(metricType: string, values: number[]): number {
    switch (metricType) {
      case 'page_views':
      case 'unique_visitors':
      case 'product_views':
      case 'quiz_completions':
      case 'event_count':
      case 'conversion_rate':
        return values.reduce((sum, val) => sum + val, 0);
      
      case 'session_duration':
      case 'engagement_score':
      case 'scroll_depth':
      case 'lead_score':
      case 'conversion_probability':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      
      case 'bounce_rate':
      case 'error_rate':
        return (values.reduce((sum, val) => sum + val, 0) / values.length) * 100;
      
      default:
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }
  }

  private calculateChange(previous: number, current: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  private determineTrend(change: number): 'up' | 'down' | 'stable' {
    if (Math.abs(change) < 5) return 'stable';
    return change > 0 ? 'up' : 'down';
  }

  // Public API
  public getMetric(metricType: string): RealTimeMetric | null {
    const buffer = this.metricsBuffer.get(metricType);
    return buffer ? buffer.aggregated : null;
  }

  public getAllMetrics(): Map<string, RealTimeMetric> {
    const metrics = new Map<string, RealTimeMetric>();
    
    this.metricsBuffer.forEach((buffer, metricType) => {
      metrics.set(metricType, buffer.aggregated);
    });
    
    return metrics;
  }

  public getCustomMetrics(): CustomMetrics {
    const sessionManager = SessionManager.getInstance();
    const currentSession = sessionManager.getCurrentSession();
    
    if (!currentSession) {
      return {
        active_sessions: 0,
        average_session_duration: 0,
        total_events_today: 0,
        conversion_funnel: [],
        top_pages: [],
        lead_distribution: []
      };
    }

    return {
      active_sessions: 1, // Simplified for single-user context
      average_session_duration: sessionManager.getAverageSessionDuration(),
      total_events_today: this.getTotalEventsToday(),
      conversion_funnel: this.getConversionFunnelData(),
      top_pages: this.getTopPagesData(),
      lead_distribution: this.getLeadDistributionData()
    };
  }

  private getTotalEventsToday(): number {
    try {
      const todayKey = this.getDateKey();
      const storageKey = `bs_analytics_events_${todayKey}`;
      const events = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return events.length;
    } catch {
      return 0;
    }
  }

  private getConversionFunnelData(): FunnelStage[] {
    const stages = [
      { name: 'Awareness', events: ['page_view'] },
      { name: 'Interest', events: ['product_view', 'content_engagement'] },
      { name: 'Consideration', events: ['quiz_interaction', 'comparison_action'] },
      { name: 'Decision', events: ['demo_request', 'quote_request'] },
      { name: 'Conversion', events: ['conversion_event'] }
    ];

    return stages.map(stage => {
      const count = this.countEventsForStage(stage.events);
      return {
        name: stage.name,
        count,
        conversion_rate: this.calculateStageConversionRate(stage.name, count)
      };
    });
  }

  private countEventsForStage(eventTypes: string[]): number {
    try {
      const todayKey = this.getDateKey();
      const storageKey = `bs_analytics_events_${todayKey}`;
      const events = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      return events.filter((event: any) => 
        eventTypes.includes(event.type)
      ).length;
    } catch {
      return 0;
    }
  }

  private calculateStageConversionRate(_stageName: string, count: number): number {
    // Simplified conversion rate calculation
    const totalEvents = this.getTotalEventsToday();
    return totalEvents > 0 ? (count / totalEvents) * 100 : 0;
  }

  private getTopPagesData(): TopPage[] {
    try {
      const todayKey = this.getDateKey();
      const storageKey = `bs_analytics_events_${todayKey}`;
      const events = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const pageViews = events
        .filter((event: any) => event.type === 'page_view')
        .reduce((acc: any, event: any) => {
          const page = event.properties.page_path || '/';
          acc[page] = (acc[page] || 0) + 1;
          return acc;
        }, {});

      return Object.entries(pageViews)
        .map(([page, views]) => ({ page, views: views as number }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
    } catch {
      return [];
    }
  }

  private getLeadDistributionData(): LeadDistribution[] {
    const stages = ['awareness', 'interest', 'consideration', 'decision', 'customer'];
    const currentStage = localStorage.getItem('bs_analytics_journey_stage') || 'awareness';
    
    return stages.map(stage => ({
      stage,
      count: stage === currentStage ? 1 : 0,
      percentage: stage === currentStage ? 100 : 0
    }));
  }

  public exportMetrics(format: 'json' | 'csv'): string {
    const metrics = this.getAllMetrics();
    const data: any = {};
    
    metrics.forEach((metric, key) => {
      data[key] = metric;
    });

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else {
      // CSV format
      const headers = ['Metric', 'Current', 'Change', 'Trend'];
      const rows = [headers];
      
      metrics.forEach((metric, key) => {
        rows.push([
          key,
          metric.current.toString(),
          metric.change.toString(),
          metric.trend
        ]);
      });
      
      return rows.map(row => row.join(',')).join('\n');
    }
  }

  public clearMetrics(): void {
    this.metricsBuffer.forEach(buffer => {
      buffer.values = [];
      buffer.timestamps = [];
      buffer.aggregated = {
        current: 0,
        change: 0,
        trend: 'stable',
        sparkline: []
      };
    });
  }

  public destroy(): void {
    if (this.aggregationInterval) {
      clearInterval(this.aggregationInterval);
    }
    
    this.metricsBuffer.clear();
  }
}

// Types
interface MetricBuffer {
  type: string;
  values: number[];
  timestamps: number[];
  aggregated: RealTimeMetric;
  lastAggregation: number;
}

interface CustomMetrics {
  active_sessions: number;
  average_session_duration: number;
  total_events_today: number;
  conversion_funnel: FunnelStage[];
  top_pages: TopPage[];
  lead_distribution: LeadDistribution[];
}

interface FunnelStage {
  name: string;
  count: number;
  conversion_rate: number;
}

interface TopPage {
  page: string;
  views: number;
}

interface LeadDistribution {
  stage: string;
  count: number;
  percentage: number;
}

export type { MetricBuffer, CustomMetrics, FunnelStage, TopPage, LeadDistribution };