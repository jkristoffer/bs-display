import type { 
  RealTimeData, 
  RealTimeMetric, 
  AnalyticsEvent, 
  SessionMetrics,
  CustomerJourney 
} from '../types';
import { EventProcessor } from '../core/EventProcessor';
import { SessionManager } from '../core/SessionManager';

export class DashboardEngine {
  private static instance: DashboardEngine;
  private websocket: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private metricsCache: Map<string, RealTimeMetric> = new Map();
  private subscribers: Map<string, DashboardSubscriber[]> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private isConnected = false;
  private connectionRetryCount = 0;
  private readonly MAX_RETRY_ATTEMPTS = 5;
  private readonly RETRY_DELAY = 2000;

  private constructor() {
    this.initializeConnection();
    this.setupUpdateInterval();
  }

  public static getInstance(): DashboardEngine {
    if (!DashboardEngine.instance) {
      DashboardEngine.instance = new DashboardEngine();
    }
    return DashboardEngine.instance;
  }

  private async initializeConnection(): Promise<void> {
    try {
      // Try WebSocket first, fallback to Server-Sent Events
      await this.setupWebSocket();
    } catch (error) {
      console.warn('WebSocket failed, falling back to Server-Sent Events:', error);
      this.setupServerSentEvents();
    }
  }

  private async setupWebSocket(): Promise<void> {
    const wsUrl = this.getWebSocketUrl();
    if (!wsUrl) {
      throw new Error('WebSocket URL not configured');
    }

    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      console.log('Dashboard WebSocket connected');
      this.isConnected = true;
      this.connectionRetryCount = 0;
      this.notifyConnectionChange(true);
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleRealtimeUpdate(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.websocket.onclose = () => {
      console.log('Dashboard WebSocket disconnected');
      this.isConnected = false;
      this.notifyConnectionChange(false);
      this.attemptReconnection();
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
      this.notifyConnectionChange(false);
    };
  }

  private setupServerSentEvents(): void {
    const sseUrl = this.getServerSentEventsUrl();
    if (!sseUrl) {
      console.warn('Server-Sent Events URL not configured');
      return;
    }

    this.eventSource = new EventSource(sseUrl);

    this.eventSource.onopen = () => {
      console.log('Dashboard SSE connected');
      this.isConnected = true;
      this.connectionRetryCount = 0;
      this.notifyConnectionChange(true);
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleRealtimeUpdate(data);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    this.eventSource.onerror = () => {
      console.error('SSE connection error');
      this.isConnected = false;
      this.notifyConnectionChange(false);
      this.attemptReconnection();
    };
  }

  private getWebSocketUrl(): string | null {
    if (typeof window === 'undefined') return null;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/api/analytics/realtime`;
  }

  private getServerSentEventsUrl(): string | null {
    if (typeof window === 'undefined') return null;
    
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}/api/analytics/stream`;
  }

  private attemptReconnection(): void {
    if (this.connectionRetryCount >= this.MAX_RETRY_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.connectionRetryCount++;
    
    setTimeout(() => {
      console.log(`Attempting reconnection ${this.connectionRetryCount}/${this.MAX_RETRY_ATTEMPTS}`);
      this.initializeConnection();
    }, this.RETRY_DELAY * this.connectionRetryCount);
  }

  private setupUpdateInterval(): void {
    // Update metrics every 5 seconds
    this.updateInterval = setInterval(() => {
      this.updateLocalMetrics();
    }, 5000);
  }

  private updateLocalMetrics(): void {
    const sessionManager = SessionManager.getInstance();
    const currentSession = sessionManager.getCurrentSession();
    
    if (!currentSession) return;

    const sessionMetrics = sessionManager.getSessionMetrics();
    const realTimeMetrics = this.calculateRealTimeMetrics(sessionMetrics);
    
    // Update metrics cache
    Object.entries(realTimeMetrics).forEach(([key, metric]) => {
      this.metricsCache.set(key, metric);
    });

    // Notify subscribers
    this.notifySubscribers('session_metrics', realTimeMetrics);
  }

  private calculateRealTimeMetrics(sessionMetrics: SessionMetrics): RealTimeData {
    const previousMetrics = this.metricsCache.get('session_metrics');
    
    return {
      active_users: this.createMetric(1, 0, 'stable'),
      page_views: this.createMetric(
        sessionMetrics.page_views, 
        this.calculateChange(previousMetrics?.current || 0, sessionMetrics.page_views)
      ),
      session_duration: this.createMetric(
        Math.round(sessionMetrics.duration / 1000), 
        0, 
        'stable'
      ),
      engagement_score: this.createMetric(
        sessionMetrics.engagement_score,
        this.calculateChange(previousMetrics?.current || 0, sessionMetrics.engagement_score)
      ),
      conversion_events: this.createMetric(
        sessionMetrics.conversion_events,
        this.calculateChange(previousMetrics?.current || 0, sessionMetrics.conversion_events)
      ),
      bounce_rate: this.createMetric(
        sessionMetrics.bounce_rate,
        0,
        'stable'
      ),
      journey_progression: this.createMetric(
        sessionMetrics.journey_progression,
        this.calculateChange(previousMetrics?.current || 0, sessionMetrics.journey_progression)
      )
    };
  }

  private createMetric(current: number, change: number, trend?: 'up' | 'down' | 'stable'): RealTimeMetric {
    if (!trend) {
      if (change > 0) trend = 'up';
      else if (change < 0) trend = 'down';
      else trend = 'stable';
    }

    // Update sparkline data
    const existingMetric = this.metricsCache.get('current_metric');
    const sparkline = existingMetric ? 
      [...existingMetric.sparkline.slice(-19), current] : 
      [current];

    return {
      current,
      change,
      trend,
      sparkline
    };
  }

  private calculateChange(previous: number, current: number): number {
    if (previous === 0) return current;
    return ((current - previous) / previous) * 100;
  }

  private handleRealtimeUpdate(data: any): void {
    const updateType = data.type;
    const metrics = data.metrics || data.data;
    
    if (!metrics) return;

    // Update cache
    Object.entries(metrics).forEach(([key, value]) => {
      this.metricsCache.set(key, value as RealTimeMetric);
    });

    // Notify subscribers
    this.notifySubscribers(updateType, metrics);
  }

  private notifySubscribers(type: string, data: any): void {
    const subscribers = this.subscribers.get(type) || [];
    subscribers.forEach(subscriber => {
      try {
        subscriber.callback(data);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  private notifyConnectionChange(connected: boolean): void {
    this.notifySubscribers('connection_status', { connected });
  }

  // Public API
  public subscribe(type: string, callback: (data: any) => void): string {
    const subscriberId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, []);
    }
    
    this.subscribers.get(type)!.push({
      id: subscriberId,
      callback
    });
    
    return subscriberId;
  }

  public unsubscribe(type: string, subscriberId: string): void {
    const subscribers = this.subscribers.get(type);
    if (!subscribers) return;
    
    const index = subscribers.findIndex(sub => sub.id === subscriberId);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  }

  public getCurrentMetrics(): RealTimeData {
    const metrics: RealTimeData = {};
    
    this.metricsCache.forEach((metric, key) => {
      metrics[key] = metric;
    });
    
    return metrics;
  }

  public getMetric(key: string): RealTimeMetric | null {
    return this.metricsCache.get(key) || null;
  }

  public isConnected(): boolean {
    return this.isConnected;
  }

  public async sendEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.isConnected) {
      console.warn('Dashboard not connected, queuing event');
      // Could implement local queuing here
      return;
    }

    const message = {
      type: 'analytics_event',
      event: event,
      timestamp: new Date().toISOString()
    };

    try {
      if (this.websocket?.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify(message));
      } else {
        // Fallback to HTTP POST
        await this.sendEventHTTP(event);
      }
    } catch (error) {
      console.error('Failed to send event to dashboard:', error);
    }
  }

  private async sendEventHTTP(event: AnalyticsEvent): Promise<void> {
    const response = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  public async getHistoricalData(
    metric: string, 
    timeRange: string = '24h'
  ): Promise<HistoricalData[]> {
    try {
      const response = await fetch(
        `/api/analytics/historical?metric=${metric}&range=${timeRange}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
      return [];
    }
  }

  public async getTopPages(limit: number = 10): Promise<PageAnalytics[]> {
    try {
      const response = await fetch(`/api/analytics/top-pages?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch top pages:', error);
      return [];
    }
  }

  public async getConversionFunnel(): Promise<FunnelData[]> {
    try {
      const response = await fetch('/api/analytics/conversion-funnel');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch conversion funnel:', error);
      return [];
    }
  }

  public async getLeadScoringData(): Promise<LeadScoringData[]> {
    try {
      const response = await fetch('/api/analytics/lead-scoring');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch lead scoring data:', error);
      return [];
    }
  }

  public async getCustomerJourneys(limit: number = 20): Promise<CustomerJourney[]> {
    try {
      const response = await fetch(`/api/analytics/customer-journeys?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch customer journeys:', error);
      return [];
    }
  }

  public async exportData(
    format: 'csv' | 'json' | 'xlsx',
    dateRange: { start: string; end: string }
  ): Promise<Blob> {
    const response = await fetch('/api/analytics/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        format,
        date_range: dateRange
      })
    });

    if (!response.ok) {
      throw new Error(`Export failed! status: ${response.status}`);
    }

    return await response.blob();
  }

  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    if (this.websocket) {
      this.websocket.close();
    }
    
    if (this.eventSource) {
      this.eventSource.close();
    }
    
    this.subscribers.clear();
    this.metricsCache.clear();
  }
}

// Types
interface DashboardSubscriber {
  id: string;
  callback: (data: any) => void;
}

interface HistoricalData {
  timestamp: string;
  value: number;
}

interface PageAnalytics {
  page: string;
  views: number;
  unique_visitors: number;
  avg_time_on_page: number;
  bounce_rate: number;
  conversion_rate: number;
}

interface FunnelData {
  stage: string;
  users: number;
  conversion_rate: number;
  drop_off_rate: number;
}

interface LeadScoringData {
  user_id: string;
  score: number;
  stage: string;
  last_activity: string;
  conversion_probability: number;
}

export type { 
  DashboardSubscriber, 
  HistoricalData, 
  PageAnalytics, 
  FunnelData, 
  LeadScoringData 
};