import LZString from 'lz-string';
import type { AnalyticsEvent, EventContext } from '../types';
import { ANALYTICS_CONFIG } from '@config/analytics-storage.config';

export class EventTracker {
  private static instance: EventTracker;
  private eventQueue: AnalyticsEvent[] = [];
  private aggregates = new Map<string, any>();
  private flushTimer: number | null = null;
  private sessionId: string;
  private recentEventHashes = new Map<string, number>();
  
  private constructor() {
    this.sessionId = this.generateSessionId();
    if (typeof window !== 'undefined') {
      this.setupUnloadHandler();
    }
  }
  
  static getInstance(): EventTracker {
    if (!EventTracker.instance) {
      EventTracker.instance = new EventTracker();
    }
    return EventTracker.instance;
  }
  
  track(type: AnalyticsEvent['type'], data: Record<string, any>) {
    // High-value events always tracked
    if (type === 'conversion' || type === 'quiz_event') {
      this.addEvent(type, data, 1.0);
      return;
    }
    
    // Apply sampling for other events
    const sampleRate = ANALYTICS_CONFIG.sampling[type as keyof typeof ANALYTICS_CONFIG.sampling] || 0.1;
    if (Math.random() > sampleRate) return;
    
    // Deduplicate events
    const eventHash = this.hashEvent(type, data);
    const lastSeen = this.recentEventHashes.get(eventHash);
    if (lastSeen && Date.now() - lastSeen < 5000) return;
    
    this.recentEventHashes.set(eventHash, Date.now());
    this.addEvent(type, data, sampleRate);
  }
  
  private addEvent(type: AnalyticsEvent['type'], data: Record<string, any>, sampleRate: number) {
    // Pre-aggregate on client
    const aggregateKey = `${type}:${this.getAggregateWindow()}`;
    const existing = this.aggregates.get(aggregateKey) || { count: 0, data: {} };
    
    this.aggregates.set(aggregateKey, {
      count: existing.count + 1,
      data: this.mergeData(existing.data, data),
      sampleRate
    });
    
    // Also queue raw event if needed for detailed analysis
    if (type === 'conversion' || type === 'quiz_event') {
      this.eventQueue.push({
        event_id: this.generateEventId(),
        event_type: type,
        type,
        timestamp: new Date(),
        session_id: this.sessionId,
        user_id: undefined,
        properties: data,
        context: this.getBrowserContext()
      });
    }
    
    this.scheduleFlush();
  }
  
  private scheduleFlush() {
    // Flush if batch is full
    if (this.eventQueue.length >= ANALYTICS_CONFIG.batching.maxBatchSize) {
      this.flush();
      return;
    }
    
    // Schedule timed flush
    if (!this.flushTimer && typeof window !== 'undefined') {
      this.flushTimer = window.setTimeout(() => {
        this.flush();
      }, ANALYTICS_CONFIG.batching.flushIntervalMs);
    }
  }
  
  private flush() {
    if (this.eventQueue.length === 0 && this.aggregates.size === 0) return;
    if (typeof window === 'undefined') return;
    
    const payload = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      rawEvents: this.eventQueue,
      aggregates: Array.from(this.aggregates.entries()).map(([key, value]) => ({
        key,
        ...value
      }))
    };
    
    // Compress payload
    const compressed = LZString.compress(JSON.stringify(payload));
    
    // Use sendBeacon for reliability
    const sent = navigator.sendBeacon('/api/analytics/ingest', compressed);
    
    if (!sent) {
      // Fallback to fetch
      fetch('/api/analytics/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: compressed,
        keepalive: true
      }).catch(err => console.error('Analytics send failed:', err));
    }
    
    // Clear queues
    this.eventQueue = [];
    this.aggregates.clear();
    this.flushTimer = null;
    
    // Clean old dedup entries
    this.cleanOldHashes();
  }
  
  private setupUnloadHandler() {
    // Ensure data is sent when page unloads
    window.addEventListener('pagehide', () => this.flush());
    window.addEventListener('beforeunload', () => this.flush());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.flush();
    });
  }
  
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
  
  private generateEventId(): string {
    return `${this.sessionId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }
  
  private hashEvent(type: string, data: Record<string, any>): string {
    const key = `${type}:${JSON.stringify(data)}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }
  
  private getAggregateWindow(): string {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${Math.floor(now.getMinutes() / 5)}`;
  }
  
  private mergeData(existing: any, newData: any): any {
    // Simple merge for now, can be enhanced based on event type
    return { ...existing, ...newData, _count: (existing._count || 0) + 1 };
  }
  
  private cleanOldHashes() {
    const cutoff = Date.now() - 60000; // 1 minute
    for (const [hash, time] of this.recentEventHashes.entries()) {
      if (time < cutoff) {
        this.recentEventHashes.delete(hash);
      }
    }
  }

  private getBrowserContext(): EventContext {
    if (typeof window === 'undefined') {
      return {
        device: { 
          type: 'desktop' as const,
          os: 'server',
          screen_resolution: '0x0',
          viewport_size: '0x0'
        },
        browser: { 
          name: 'server',
          version: '1.0',
          language: 'en',
          timezone: 'UTC',
          user_agent: 'server',
          cookies_enabled: false,
          javascript_enabled: true
        },
        location: { 
          timezone: 'UTC' 
        },
        is_returning_visitor: false,
        session_count: 1,
        referrer: ''
      };
    }

    return {
      device: {
        type: 'desktop' as const, // Default, should be detected properly
        os: navigator.platform || 'unknown',
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      },
      browser: {
        name: 'unknown', // Default, should be detected properly
        version: 'unknown',
        language: navigator.language || 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        user_agent: navigator.userAgent || 'unknown',
        cookies_enabled: navigator.cookieEnabled || false,
        javascript_enabled: true
      },
      location: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      is_returning_visitor: false, // Default
      session_count: 1, // Default
      referrer: document.referrer || ''
    };
  }
}