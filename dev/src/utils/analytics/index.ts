// Core Analytics System
export { AnalyticsEngine } from './core/AnalyticsEngine';
export { SessionManager } from './core/SessionManager';
export { EventProcessor } from './core/EventProcessor';

// Real-time Dashboard
export { DashboardEngine } from './realtime/DashboardEngine';
export { MetricsCollector } from './realtime/MetricsCollector';

// Types
export type {
  AnalyticsEvent,
  EventType,
  EventProperties,
  EventContext,
  SessionData,
  SessionMetrics,
  AnalyticsConfig,
  RealTimeData,
  RealTimeMetric,
  CustomerJourney,
  JourneyStage,
  ConversionEvent,
  AttributionData,
  TouchPoint,
  DeviceInfo,
  BrowserInfo,
  LocationInfo,
  EventHandler
} from './types';

import type { AnalyticsConfig, EventType, EventProperties, JourneyStage } from './types';
import { AnalyticsEngine } from './core/AnalyticsEngine';
import { DashboardEngine } from './realtime/DashboardEngine';
import { MetricsCollector } from './realtime/MetricsCollector';

// Convenience initialization function
export const initializeAnalytics = (config: AnalyticsConfig) => {
  const analyticsEngine = new AnalyticsEngine(config);
  const dashboardEngine = DashboardEngine.getInstance();
  const metricsCollector = MetricsCollector.getInstance();
  
  return {
    analytics: analyticsEngine,
    dashboard: dashboardEngine,
    metrics: metricsCollector,
    
    // Convenience methods
    track: (eventType: EventType, properties?: EventProperties, revenueImpact?: number) => {
      analyticsEngine.trackEvent(eventType, properties, revenueImpact);
    },
    
    trackPageView: () => {
      analyticsEngine.trackPageView();
    },
    
    trackProductView: (productId: string, productData: any) => {
      analyticsEngine.trackProductView(productId, productData);
    },
    
    trackQuizInteraction: (quizData: any) => {
      analyticsEngine.trackQuizInteraction(quizData);
    },
    
    trackConversion: (type: string, value?: number) => {
      analyticsEngine.trackConversion(type, value);
    },
    
    setUserId: (userId: string) => {
      analyticsEngine.setUserId(userId);
    },
    
    updateLeadScore: (points: number) => {
      analyticsEngine.updateLeadScore(points);
    },
    
    updateJourneyStage: (stage: JourneyStage) => {
      analyticsEngine.updateJourneyStage(stage);
    },
    
    getSessionMetrics: () => {
      return analyticsEngine.getSessionMetrics();
    },
    
    getCurrentMetrics: () => {
      return dashboardEngine.getCurrentMetrics();
    },
    
    subscribe: (type: string, callback: (data: any) => void) => {
      return dashboardEngine.subscribe(type, callback);
    },
    
    unsubscribe: (type: string, subscriberId: string) => {
      dashboardEngine.unsubscribe(type, subscriberId);
    },
    
    exportData: (format: 'csv' | 'json' | 'xlsx', dateRange: { start: string; end: string }) => {
      return dashboardEngine.exportData(format, dateRange);
    },
    
    destroy: () => {
      analyticsEngine.destroy();
      dashboardEngine.destroy();
      metricsCollector.destroy();
    }
  };
};

// Default configuration
export const defaultAnalyticsConfig: AnalyticsConfig = {
  heatmap_enabled: true,
  session_recording_enabled: false,
  scroll_tracking_enabled: true,
  cookie_consent_required: true,
  data_retention_days: 30,
  anonymize_ip: true,
  batch_size: 20,
  flush_interval: 10000,
  max_queue_size: 100
};

// Browser detection utility
export const isBrowserSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return !!(
    window.localStorage &&
    window.sessionStorage &&
    typeof window.fetch === 'function' &&
    window.URL &&
    window.MutationObserver
  );
};

// Privacy compliance utilities
export const PrivacyUtils = {
  hasConsent: (): boolean => {
    return localStorage.getItem('bs_analytics_consent') === 'granted';
  },
  
  grantConsent: (): void => {
    localStorage.setItem('bs_analytics_consent', 'granted');
    localStorage.setItem('bs_analytics_consent_date', new Date().toISOString());
  },
  
  revokeConsent: (): void => {
    localStorage.setItem('bs_analytics_consent', 'denied');
    // Clear existing analytics data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('bs_analytics_')) {
        localStorage.removeItem(key);
      }
    });
  },
  
  getConsentDate: (): Date | null => {
    const dateStr = localStorage.getItem('bs_analytics_consent_date');
    return dateStr ? new Date(dateStr) : null;
  }
};

// Performance monitoring
export const PerformanceMonitor = {
  measurePageLoad: (): void => {
    if (typeof window === 'undefined' || !window.performance) return;
    
    window.addEventListener('load', () => {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      
      // Track page load time
      const analytics = window.bs_analytics;
      if (analytics) {
        analytics.track('page_load', {
          load_time: loadTime,
          dns_time: timing.domainLookupEnd - timing.domainLookupStart,
          connect_time: timing.connectEnd - timing.connectStart,
          response_time: timing.responseEnd - timing.requestStart,
          dom_ready_time: timing.domContentLoadedEventEnd - timing.navigationStart
        });
      }
    });
  },
  
  measureResourceLoading: (): void => {
    if (typeof window === 'undefined' || !window.performance) return;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          const analytics = window.bs_analytics;
          if (analytics && resourceEntry.duration > 1000) { // Only track slow resources
            analytics.track('slow_resource', {
              resource_url: resourceEntry.name,
              duration: resourceEntry.duration,
              size: resourceEntry.transferSize,
              resource_type: resourceEntry.initiatorType
            });
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

// Error tracking
export const ErrorTracker = {
  initialize: (): void => {
    if (typeof window === 'undefined') return;
    
    // JavaScript errors
    window.addEventListener('error', (event) => {
      const analytics = window.bs_analytics;
      if (analytics) {
        analytics.track('error_encounter', {
          error_type: 'javascript',
          error_message: event.message,
          error_file: event.filename,
          error_line: event.lineno,
          error_column: event.colno,
          stack: event.error?.stack
        });
      }
    });
    
    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const analytics = window.bs_analytics;
      if (analytics) {
        analytics.track('error_encounter', {
          error_type: 'promise_rejection',
          error_message: event.reason?.message || 'Unknown promise rejection',
          stack: event.reason?.stack
        });
      }
    });
    
    // Network errors
    window.addEventListener('online', () => {
      const analytics = window.bs_analytics;
      if (analytics) {
        analytics.track('network_status', {
          status: 'online'
        });
      }
    });
    
    window.addEventListener('offline', () => {
      const analytics = window.bs_analytics;
      if (analytics) {
        analytics.track('network_status', {
          status: 'offline'
        });
      }
    });
  }
};

// Global type augmentation for window object
declare global {
  interface Window {
    bs_analytics?: ReturnType<typeof initializeAnalytics>;
  }
}

export default {
  initializeAnalytics,
  defaultAnalyticsConfig,
  isBrowserSupported,
  PrivacyUtils,
  PerformanceMonitor,
  ErrorTracker
};