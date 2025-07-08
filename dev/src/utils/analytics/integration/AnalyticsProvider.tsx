import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { 
  AnalyticsConfig, 
  EventType, 
  EventProperties, 
  JourneyStage,
  RealTimeData,
  SessionMetrics
} from '../types';
import { initializeAnalytics, defaultAnalyticsConfig, PrivacyUtils } from '../index';

interface AnalyticsContextType {
  track: (eventType: EventType, properties?: EventProperties, revenueImpact?: number) => void;
  trackPageView: () => void;
  trackProductView: (productId: string, productData: any) => void;
  trackQuizInteraction: (quizData: any) => void;
  trackConversion: (type: string, value?: number) => void;
  setUserId: (userId: string) => void;
  updateLeadScore: (points: number) => void;
  updateJourneyStage: (stage: JourneyStage) => void;
  getSessionMetrics: () => SessionMetrics | null;
  getCurrentMetrics: () => RealTimeData;
  subscribe: (type: string, callback: (data: any) => void) => string;
  unsubscribe: (type: string, subscriberId: string) => void;
  isInitialized: boolean;
  hasConsent: boolean;
  grantConsent: () => void;
  revokeConsent: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: Partial<AnalyticsConfig>;
  autoTrackPageViews?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableErrorTracking?: boolean;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  config: userConfig = {},
  autoTrackPageViews = true,
  enablePerformanceMonitoring = true,
  enableErrorTracking = true
}) => {
  const [analyticsInstance, setAnalyticsInstance] = useState<ReturnType<typeof initializeAnalytics> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  const config = useMemo(() => ({
    ...defaultAnalyticsConfig,
    ...userConfig
  }), [userConfig]);

  // Initialize analytics when consent is granted
  useEffect(() => {
    const initializeIfConsented = () => {
      const consentGranted = PrivacyUtils.hasConsent();
      setHasConsent(consentGranted);

      if (consentGranted && !analyticsInstance) {
        try {
          const instance = initializeAnalytics(config);
          setAnalyticsInstance(instance);
          setIsInitialized(true);

          // Store instance globally for error tracking and performance monitoring
          if (typeof window !== 'undefined') {
            window.bs_analytics = instance;
          }

          console.log('Analytics initialized successfully');
        } catch (error) {
          console.error('Failed to initialize analytics:', error);
        }
      }
    };

    initializeIfConsented();

    // Listen for consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bs_analytics_consent') {
        initializeIfConsented();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [config, analyticsInstance]);

  // Auto-track page views
  useEffect(() => {
    if (!analyticsInstance || !autoTrackPageViews) return;

    // Track initial page view
    analyticsInstance.trackPageView();

    // Track route changes (for SPA)
    const handleRouteChange = () => {
      setTimeout(() => analyticsInstance.trackPageView(), 100);
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);

    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [analyticsInstance, autoTrackPageViews]);

  // Setup performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring || typeof window === 'undefined') return;

    const measurePageLoad = () => {
      if (!window.performance || !analyticsInstance) return;

      window.addEventListener('load', () => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;

        analyticsInstance.track('page_load', {
          load_time: loadTime,
          dns_time: timing.domainLookupEnd - timing.domainLookupStart,
          connect_time: timing.connectEnd - timing.connectStart,
          response_time: timing.responseEnd - timing.requestStart,
          dom_ready_time: timing.domContentLoadedEventEnd - timing.navigationStart
        });
      });
    };

    measurePageLoad();
  }, [analyticsInstance, enablePerformanceMonitoring]);

  // Setup error tracking
  useEffect(() => {
    if (!enableErrorTracking || typeof window === 'undefined' || !analyticsInstance) return;

    const handleError = (event: ErrorEvent) => {
      analyticsInstance.track('error_encounter', {
        error_type: 'javascript',
        error_message: event.message,
        error_file: event.filename,
        error_line: event.lineno,
        error_column: event.colno,
        stack: event.error?.stack
      });
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      analyticsInstance.track('error_encounter', {
        error_type: 'promise_rejection',
        error_message: event.reason?.message || 'Unknown promise rejection',
        stack: event.reason?.stack
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, [analyticsInstance, enableErrorTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (analyticsInstance) {
        analyticsInstance.destroy();
      }
    };
  }, [analyticsInstance]);

  // Context methods
  const track = useCallback((eventType: EventType, properties?: EventProperties, revenueImpact?: number) => {
    if (!analyticsInstance || !hasConsent) return;
    analyticsInstance.track(eventType, properties, revenueImpact);
  }, [analyticsInstance, hasConsent]);

  const trackPageView = useCallback(() => {
    if (!analyticsInstance || !hasConsent) return;
    analyticsInstance.trackPageView();
  }, [analyticsInstance, hasConsent]);

  const trackProductView = useCallback((productId: string, productData: any) => {
    if (!analyticsInstance || !hasConsent) return;
    analyticsInstance.trackProductView(productId, productData);
  }, [analyticsInstance, hasConsent]);

  const trackQuizInteraction = useCallback((quizData: any) => {
    if (!analyticsInstance || !hasConsent) return;
    analyticsInstance.trackQuizInteraction(quizData);
  }, [analyticsInstance, hasConsent]);

  const trackConversion = useCallback((type: string, value?: number) => {
    if (!analyticsInstance || !hasConsent) return;
    analyticsInstance.trackConversion(type, value);
  }, [analyticsInstance, hasConsent]);

  const setUserId = useCallback((userId: string) => {
    if (!analyticsInstance || !hasConsent) return;
    analyticsInstance.setUserId(userId);
  }, [analyticsInstance, hasConsent]);

  const updateLeadScore = useCallback((points: number) => {
    if (!analyticsInstance || !hasConsent) return;
    analyticsInstance.updateLeadScore(points);
  }, [analyticsInstance, hasConsent]);

  const updateJourneyStage = useCallback((stage: JourneyStage) => {
    if (!analyticsInstance || !hasConsent) return;
    analyticsInstance.updateJourneyStage(stage);
  }, [analyticsInstance, hasConsent]);

  const getSessionMetrics = useCallback(() => {
    if (!analyticsInstance || !hasConsent) return null;
    return analyticsInstance.getSessionMetrics();
  }, [analyticsInstance, hasConsent]);

  const getCurrentMetrics = useCallback(() => {
    if (!analyticsInstance || !hasConsent) return {};
    return analyticsInstance.getCurrentMetrics();
  }, [analyticsInstance, hasConsent]);

  const subscribe = useCallback((type: string, callback: (data: any) => void) => {
    if (!analyticsInstance || !hasConsent) return '';
    return analyticsInstance.subscribe(type, callback);
  }, [analyticsInstance, hasConsent]);

  const unsubscribe = useCallback((type: string, subscriberId: string) => {
    if (!analyticsInstance || !hasConsent) return;
    analyticsInstance.unsubscribe(type, subscriberId);
  }, [analyticsInstance, hasConsent]);

  const grantConsent = useCallback(() => {
    PrivacyUtils.grantConsent();
    setHasConsent(true);
  }, []);

  const revokeConsent = useCallback(() => {
    PrivacyUtils.revokeConsent();
    setHasConsent(false);
    if (analyticsInstance) {
      analyticsInstance.destroy();
      setAnalyticsInstance(null);
      setIsInitialized(false);
    }
  }, [analyticsInstance]);

  const contextValue = useMemo(() => ({
    track,
    trackPageView,
    trackProductView,
    trackQuizInteraction,
    trackConversion,
    setUserId,
    updateLeadScore,
    updateJourneyStage,
    getSessionMetrics,
    getCurrentMetrics,
    subscribe,
    unsubscribe,
    isInitialized,
    hasConsent,
    grantConsent,
    revokeConsent
  }), [
    track,
    trackPageView,
    trackProductView,
    trackQuizInteraction,
    trackConversion,
    setUserId,
    updateLeadScore,
    updateJourneyStage,
    getSessionMetrics,
    getCurrentMetrics,
    subscribe,
    unsubscribe,
    isInitialized,
    hasConsent,
    grantConsent,
    revokeConsent
  ]);

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Hook for using analytics
export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  
  return context;
};

// Higher-order component for tracking page views
export const withPageTracking = <P extends object>(
  Component: React.ComponentType<P>,
  eventProperties?: EventProperties
) => {
  const WrappedComponent = (props: P) => {
    const analytics = useAnalytics();
    
    useEffect(() => {
      if (analytics.hasConsent) {
        analytics.track('page_view', eventProperties);
      }
    }, [analytics]);
    
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `withPageTracking(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Component for tracking click events
interface TrackingLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventType?: EventType;
  eventProperties?: EventProperties;
  children: React.ReactNode;
}

export const TrackingLink: React.FC<TrackingLinkProps> = ({
  eventType = 'click_event',
  eventProperties = {},
  onClick,
  children,
  ...props
}) => {
  const analytics = useAnalytics();
  
  const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (analytics.hasConsent) {
      analytics.track(eventType, {
        ...eventProperties,
        element_id: props.id,
        element_class: props.className,
        href: props.href
      });
    }
    
    if (onClick) {
      onClick(event);
    }
  }, [analytics, eventType, eventProperties, onClick, props.id, props.className, props.href]);
  
  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
};

// Component for tracking button clicks
interface TrackingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  eventType?: EventType;
  eventProperties?: EventProperties;
  children: React.ReactNode;
}

export const TrackingButton: React.FC<TrackingButtonProps> = ({
  eventType = 'click_event',
  eventProperties = {},
  onClick,
  children,
  ...props
}) => {
  const analytics = useAnalytics();
  
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (analytics.hasConsent) {
      analytics.track(eventType, {
        ...eventProperties,
        element_id: props.id,
        element_class: props.className,
        button_type: props.type
      });
    }
    
    if (onClick) {
      onClick(event);
    }
  }, [analytics, eventType, eventProperties, onClick, props.id, props.className, props.type]);
  
  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
};

// Hook for tracking form submissions
export const useFormTracking = (formId: string) => {
  const analytics = useAnalytics();
  
  const trackFormStart = useCallback(() => {
    if (analytics.hasConsent) {
      analytics.track('form_interaction', {
        form_id: formId,
        interaction_type: 'start'
      });
    }
  }, [analytics, formId]);
  
  const trackFormSubmit = useCallback((formData?: any) => {
    if (analytics.hasConsent) {
      analytics.track('form_submission', {
        form_id: formId,
        form_data: formData
      });
    }
  }, [analytics, formId]);
  
  const trackFormError = useCallback((error: string) => {
    if (analytics.hasConsent) {
      analytics.track('error_encounter', {
        error_type: 'form_validation',
        form_id: formId,
        error_message: error
      });
    }
  }, [analytics, formId]);
  
  return {
    trackFormStart,
    trackFormSubmit,
    trackFormError
  };
};

// Hook for tracking product interactions
export const useProductTracking = () => {
  const analytics = useAnalytics();
  
  const trackProductView = useCallback((productId: string, productData: any) => {
    if (analytics.hasConsent) {
      analytics.trackProductView(productId, productData);
    }
  }, [analytics]);
  
  const trackProductInteraction = useCallback((productId: string, interactionType: string, properties?: EventProperties) => {
    if (analytics.hasConsent) {
      analytics.track('product_interaction', {
        product_id: productId,
        interaction_type: interactionType,
        ...properties
      });
    }
  }, [analytics]);
  
  return {
    trackProductView,
    trackProductInteraction
  };
};

export default AnalyticsProvider;