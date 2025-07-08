import type {
  AnalyticsEvent,
  EventType,
  EventProperties,
  EventContext,
  SessionData,
  AnalyticsConfig,
  DeviceInfo,
  BrowserInfo,
  LocationInfo,
  JourneyStage,
  CustomerJourney,
  ConversionEvent,
  AttributionData,
  TouchPoint
} from '../types';

export class AnalyticsEngine {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private sessionData: SessionData | null = null;
  private userId: string | null = null;
  private isInitialized = false;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Initialize session
      await this.initializeSession();
      
      // Start periodic flush
      this.startPeriodicFlush();
      
      // Set up event listeners
      this.setupEventListeners();
      
      this.isInitialized = true;
      
      // Track page load
      this.trackPageView();
      
    } catch (error) {
      console.error('AnalyticsEngine initialization failed:', error);
    }
  }

  private async initializeSession(): Promise<void> {
    const sessionId = this.generateSessionId();
    const deviceInfo = this.getDeviceInfo();
    const browserInfo = this.getBrowserInfo();
    const locationInfo = await this.getLocationInfo();
    
    this.sessionData = {
      id: sessionId,
      start_time: new Date(),
      last_activity: new Date(),
      page_views: 0,
      pages_visited: [],
      events: [],
      interactions: [],
      referrer: document.referrer,
      utm_parameters: this.getUTMParameters(),
      device_info: deviceInfo,
      conversion_events: []
    };
    
    // Store session in localStorage for persistence
    localStorage.setItem('bs_analytics_session', JSON.stringify({
      id: sessionId,
      start_time: this.sessionData.start_time.toISOString(),
      user_id: this.userId
    }));
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/Mobile|Android|iPhone|iPad/.test(ua)) {
      deviceType = screenWidth < 768 ? 'mobile' : 'tablet';
    }
    
    return {
      type: deviceType,
      os: this.getOperatingSystem(ua),
      screen_resolution: `${screenWidth}x${screenHeight}`,
      viewport_size: `${viewportWidth}x${viewportHeight}`,
      device_memory: (navigator as any).deviceMemory,
      connection_type: (navigator as any).connection?.effectiveType
    };
  }

  private getBrowserInfo(): BrowserInfo {
    const ua = navigator.userAgent;
    const browserData = this.parseBrowserInfo(ua);
    
    return {
      name: browserData.name,
      version: browserData.version,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      user_agent: ua,
      cookies_enabled: navigator.cookieEnabled,
      javascript_enabled: true
    };
  }

  private async getLocationInfo(): Promise<LocationInfo> {
    try {
      // Use IP-based location service (privacy-friendly)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        country: data.country_name,
        region: data.region,
        city: data.city,
        timezone: data.timezone,
        ip_address: this.anonymizeIP(data.ip)
      };
    } catch {
      return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
  }

  private anonymizeIP(ip: string): string {
    // Remove last octet for privacy
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
    return 'anonymized';
  }

  private getUTMParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_term: params.get('utm_term') || undefined,
      utm_content: params.get('utm_content') || undefined
    };
  }

  private getOperatingSystem(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Macintosh')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private parseBrowserInfo(ua: string): { name: string; version: string } {
    const browsers = [
      { name: 'Chrome', regex: /Chrome\/(\d+)/ },
      { name: 'Firefox', regex: /Firefox\/(\d+)/ },
      { name: 'Safari', regex: /Safari\/(\d+)/ },
      { name: 'Edge', regex: /Edge\/(\d+)/ }
    ];
    
    for (const browser of browsers) {
      const match = ua.match(browser.regex);
      if (match) {
        return { name: browser.name, version: match[1] };
      }
    }
    
    return { name: 'Unknown', version: '0' };
  }

  private setupEventListeners(): void {
    // Page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_exit');
      } else {
        this.trackEvent('page_view');
      }
    });

    // Scroll tracking
    if (this.config.scroll_tracking_enabled) {
      this.setupScrollTracking();
    }

    // Click tracking
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackClickEvent(target, event);
    });

    // Form tracking
    this.setupFormTracking();

    // Beforeunload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  private setupScrollTracking(): void {
    let scrollTimer: NodeJS.Timeout;
    const scrollMilestones = [25, 50, 75, 90, 100];
    const reached = new Set<number>();

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        for (const milestone of scrollMilestones) {
          if (scrollPercent >= milestone && !reached.has(milestone)) {
            reached.add(milestone);
            this.trackEvent('scroll_milestone', {
              milestone_percent: milestone,
              scroll_depth: scrollPercent
            });
          }
        }
      }, 100);
    });
  }

  private setupFormTracking(): void {
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackFormSubmission(form);
    });

    document.addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;
      if (input.form) {
        this.trackFormInteraction(input);
      }
    });
  }

  private trackClickEvent(element: HTMLElement, event: MouseEvent): void {
    const elementData = this.getElementData(element);
    
    this.trackEvent('click_event', {
      element_id: elementData.id,
      element_class: elementData.className,
      element_text: elementData.textContent,
      x_position: event.clientX,
      y_position: event.clientY,
      page_url: window.location.href
    });
  }

  private trackFormSubmission(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const fields = Array.from(formData.keys());
    
    this.trackEvent('form_submission', {
      form_id: form.id,
      form_name: form.name,
      field_name: fields.join(','),
      page_url: window.location.href
    });
  }

  private trackFormInteraction(input: HTMLInputElement): void {
    this.trackEvent('form_interaction', {
      form_id: input.form?.id,
      field_name: input.name,
      interaction_type: input.type,
      page_url: window.location.href
    });
  }

  private getElementData(element: HTMLElement) {
    return {
      id: element.id,
      className: element.className,
      textContent: element.textContent?.trim().substring(0, 100) || '',
      tagName: element.tagName.toLowerCase()
    };
  }

  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flush_interval);
  }

  private createEventContext(): EventContext {
    return {
      device: this.sessionData!.device_info,
      browser: this.getBrowserInfo(),
      location: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      is_returning_visitor: this.isReturningVisitor(),
      session_count: this.getSessionCount(),
      previous_page: this.getPreviousPage(),
      referrer: document.referrer,
      customer_segment: this.getCustomerSegment(),
      lead_score: this.getLeadScore(),
      journey_stage: this.getJourneyStage()
    };
  }

  private isReturningVisitor(): boolean {
    return localStorage.getItem('bs_analytics_visitor') !== null;
  }

  private getSessionCount(): number {
    const count = parseInt(localStorage.getItem('bs_analytics_session_count') || '0');
    return count + 1;
  }

  private getPreviousPage(): string | undefined {
    return sessionStorage.getItem('bs_analytics_previous_page') || undefined;
  }

  private getCustomerSegment(): string | undefined {
    return localStorage.getItem('bs_analytics_segment') || undefined;
  }

  private getLeadScore(): number {
    return parseInt(localStorage.getItem('bs_analytics_lead_score') || '0');
  }

  private getJourneyStage(): JourneyStage {
    const stored = localStorage.getItem('bs_analytics_journey_stage');
    return (stored as JourneyStage) || 'awareness';
  }

  // Public API Methods
  public trackEvent(
    eventType: EventType,
    properties: EventProperties = {},
    revenueImpact?: number
  ): void {
    if (!this.isInitialized || !this.sessionData) return;

    const event: AnalyticsEvent = {
      event_id: this.generateEventId(),
      event_type: eventType,
      timestamp: new Date(),
      session_id: this.sessionData.id,
      user_id: this.userId,
      properties: {
        ...properties,
        page_url: window.location.href,
        page_title: document.title,
        page_path: window.location.pathname,
        referrer: document.referrer
      },
      context: this.createEventContext(),
      revenue_impact: revenueImpact,
      lead_score_impact: this.calculateLeadScoreImpact(eventType, properties),
      conversion_probability: this.calculateConversionProbability(eventType, properties)
    };

    this.eventQueue.push(event);
    this.sessionData.events.push(event);
    this.sessionData.last_activity = new Date();

    // Auto-flush if queue is full
    if (this.eventQueue.length >= this.config.max_queue_size) {
      this.flush();
    }
  }

  public trackPageView(): void {
    if (!this.sessionData) return;

    const pageVisit = {
      page: window.location.pathname,
      timestamp: new Date(),
      scroll_depth: 0,
      time_on_page: 0
    };

    this.sessionData.pages_visited.push(pageVisit);
    this.sessionData.page_views++;

    this.trackEvent('page_view', {
      page_url: window.location.href,
      page_title: document.title,
      page_path: window.location.pathname
    });

    // Store current page for next visit
    sessionStorage.setItem('bs_analytics_previous_page', window.location.pathname);
  }

  public trackProductView(productId: string, productData: any): void {
    this.trackEvent('product_view', {
      product_id: productId,
      product_category: productData.category,
      product_brand: productData.brand,
      product_price: productData.price,
      price_range: productData.priceRange
    });
  }

  public trackQuizInteraction(quizData: any): void {
    this.trackEvent('quiz_interaction', {
      interaction_type: quizData.type,
      quiz_step: quizData.step,
      quiz_answers: quizData.answers,
      quiz_score: quizData.score
    });
  }

  public trackConversion(type: string, value?: number): void {
    const conversionEvent: ConversionEvent = {
      type,
      value,
      timestamp: new Date(),
      attribution: this.getAttributionData()
    };

    this.sessionData?.conversion_events.push(conversionEvent);
    
    this.trackEvent('conversion_event', {
      conversion_type: type,
      conversion_value: value
    }, value);
  }

  public setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('bs_analytics_user_id', userId);
  }

  public updateLeadScore(points: number): void {
    const currentScore = this.getLeadScore();
    const newScore = currentScore + points;
    localStorage.setItem('bs_analytics_lead_score', newScore.toString());
  }

  public updateJourneyStage(stage: JourneyStage): void {
    localStorage.setItem('bs_analytics_journey_stage', stage);
  }

  private calculateLeadScoreImpact(eventType: EventType, properties: EventProperties): number {
    const scoreMap: Record<EventType, number> = {
      'page_view': 1,
      'product_view': 3,
      'quiz_interaction': 5,
      'form_submission': 10,
      'demo_request': 15,
      'quote_request': 20,
      'download_action': 7,
      'content_engagement': 2,
      'search_interaction': 2,
      'filter_usage': 3,
      'comparison_action': 5,
      'social_share': 4,
      'conversion_event': 25,
      'click_event': 1,
      'scroll_milestone': 1,
      'page_exit': 0,
      'error_encounter': -1
    };

    return scoreMap[eventType] || 0;
  }

  private calculateConversionProbability(eventType: EventType, properties: EventProperties): number {
    // Simplified conversion probability calculation
    const baseScore = this.getLeadScore();
    const eventWeight = this.calculateLeadScoreImpact(eventType, properties);
    
    // Normalize to 0-100 scale
    const totalScore = baseScore + eventWeight;
    return Math.min(100, Math.max(0, totalScore / 100 * 100));
  }

  private getAttributionData(): AttributionData {
    const firstTouch = this.getFirstTouchPoint();
    const lastTouch = this.getLastTouchPoint();
    
    return {
      first_touch: firstTouch,
      last_touch: lastTouch,
      multi_touch: [firstTouch, lastTouch],
      conversion_path: this.getConversionPath()
    };
  }

  private getFirstTouchPoint(): TouchPoint {
    return {
      source: this.sessionData?.utm_parameters.utm_source || 'direct',
      medium: this.sessionData?.utm_parameters.utm_medium || 'none',
      campaign: this.sessionData?.utm_parameters.utm_campaign,
      timestamp: this.sessionData?.start_time || new Date(),
      page: this.sessionData?.pages_visited[0]?.page || '/'
    };
  }

  private getLastTouchPoint(): TouchPoint {
    const lastPage = this.sessionData?.pages_visited.slice(-1)[0];
    return {
      source: this.sessionData?.utm_parameters.utm_source || 'direct',
      medium: this.sessionData?.utm_parameters.utm_medium || 'none',
      campaign: this.sessionData?.utm_parameters.utm_campaign,
      timestamp: lastPage?.timestamp || new Date(),
      page: lastPage?.page || '/'
    };
  }

  private getConversionPath(): string[] {
    return this.sessionData?.pages_visited.map(visit => visit.page) || [];
  }

  public async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Send to configured endpoints
      await this.sendToEndpoints(events);
      
      // Send to Google Analytics if configured
      if (this.config.google_analytics_id) {
        this.sendToGoogleAnalytics(events);
      }
      
      // Send to Mixpanel if configured
      if (this.config.mixpanel_token) {
        this.sendToMixpanel(events);
      }
      
    } catch (error) {
      console.error('Analytics flush failed:', error);
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
    }
  }

  private async sendToEndpoints(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.api_endpoint) return;

    const response = await fetch(this.config.api_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events,
        session: this.sessionData,
        user_id: this.userId
      })
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status}`);
    }
  }

  private sendToGoogleAnalytics(events: AnalyticsEvent[]): void {
    if (typeof gtag === 'undefined') return;

    events.forEach(event => {
      gtag('event', event.event_type, {
        event_id: event.event_id,
        session_id: event.session_id,
        custom_parameters: event.properties
      });
    });
  }

  private sendToMixpanel(events: AnalyticsEvent[]): void {
    if (typeof mixpanel === 'undefined') return;

    events.forEach(event => {
      mixpanel.track(event.event_type, {
        ...event.properties,
        session_id: event.session_id,
        user_id: event.user_id
      });
    });
  }

  public getSessionMetrics() {
    if (!this.sessionData) return null;

    const duration = Date.now() - this.sessionData.start_time.getTime();
    const engagementScore = this.calculateEngagementScore();
    
    return {
      duration,
      page_views: this.sessionData.page_views,
      engagement_score: engagementScore,
      conversion_events: this.sessionData.conversion_events.length,
      bounce_rate: this.sessionData.page_views === 1 ? 100 : 0,
      journey_progression: this.calculateJourneyProgression()
    };
  }

  private calculateEngagementScore(): number {
    if (!this.sessionData) return 0;

    const duration = Date.now() - this.sessionData.start_time.getTime();
    const durationScore = Math.min(duration / 300000, 1) * 30; // 5 minutes max
    const pageViewScore = Math.min(this.sessionData.page_views * 10, 30);
    const interactionScore = Math.min(this.sessionData.events.length * 2, 40);
    
    return Math.round(durationScore + pageViewScore + interactionScore);
  }

  private calculateJourneyProgression(): number {
    const stages: JourneyStage[] = ['awareness', 'interest', 'consideration', 'decision', 'customer', 'advocate'];
    const currentStage = this.getJourneyStage();
    const stageIndex = stages.indexOf(currentStage);
    
    return (stageIndex + 1) / stages.length * 100;
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flush();
    this.isInitialized = false;
  }
}