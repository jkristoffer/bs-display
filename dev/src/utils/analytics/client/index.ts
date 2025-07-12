import { EventTracker } from './EventTracker';

// Singleton instance
const tracker = EventTracker.getInstance();

// Convenience methods for common events
export const Analytics = {
  pageView: (path?: string) => {
    tracker.track('page_view', {
      path: path || window.location.pathname,
      title: document.title
    });
  },
  
  interaction: (action: string, category: string, value?: any) => {
    tracker.track('interaction', {
      action,
      category,
      value,
      timestamp: Date.now()
    });
  },
  
  quizEvent: (event: 'start' | 'question' | 'complete', data: any) => {
    tracker.track('quiz_event', {
      quizEvent: event,
      ...data
    });
  },
  
  conversion: (type: string, value: number, metadata?: any) => {
    tracker.track('conversion', {
      conversionType: type,
      value,
      ...metadata
    });
  },
  
  custom: (eventName: string, data: any) => {
    tracker.track('custom', {
      eventName,
      ...data
    });
  }
};

// Auto-track page views
if (typeof window !== 'undefined') {
  // Initial page view
  Analytics.pageView();
  
  // Track route changes for SPAs
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    Analytics.pageView();
  };
  
  window.addEventListener('popstate', () => {
    Analytics.pageView();
  });
}