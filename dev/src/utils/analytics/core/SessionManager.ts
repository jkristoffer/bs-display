import type { SessionData, SessionMetrics, UserInteraction, PageVisit } from '../types';

export class SessionManager {
  private static instance: SessionManager;
  private currentSession: SessionData | null = null;
  private sessionTimeout: NodeJS.Timeout | null = null;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly STORAGE_KEY = 'bs_analytics_session';

  private constructor() {
    this.initializeSession();
    this.setupSessionMonitoring();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private initializeSession(): void {
    const storedSession = this.getStoredSession();
    
    if (storedSession && this.isSessionValid(storedSession)) {
      this.currentSession = this.restoreSession(storedSession);
    } else {
      this.currentSession = this.createNewSession();
    }
    
    this.saveSession();
    this.resetSessionTimeout();
  }

  private getStoredSession(): any {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private isSessionValid(storedSession: any): boolean {
    if (!storedSession.id || !storedSession.start_time) return false;
    
    const sessionAge = Date.now() - new Date(storedSession.start_time).getTime();
    return sessionAge < this.SESSION_TIMEOUT;
  }

  private restoreSession(storedSession: any): SessionData {
    return {
      id: storedSession.id,
      start_time: new Date(storedSession.start_time),
      last_activity: new Date(),
      page_views: storedSession.page_views || 0,
      pages_visited: storedSession.pages_visited || [],
      events: [], // Don't restore events to avoid memory issues
      interactions: [], // Don't restore interactions
      referrer: storedSession.referrer || '',
      utm_parameters: storedSession.utm_parameters || {},
      device_info: storedSession.device_info || this.getDeviceInfo(),
      engagement_score: storedSession.engagement_score,
      conversion_events: storedSession.conversion_events || []
    };
  }

  private createNewSession(): SessionData {
    const sessionId = this.generateSessionId();
    const deviceInfo = this.getDeviceInfo();
    
    return {
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
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo() {
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

  private getOperatingSystem(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Macintosh')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
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

  private setupSessionMonitoring(): void {
    // Monitor user activity
    const activityEvents = ['click', 'scroll', 'mousemove', 'keypress'];
    
    activityEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.updateActivity();
      }, { passive: true });
    });

    // Monitor page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden();
      } else {
        this.handlePageVisible();
      }
    });

    // Monitor beforeunload
    window.addEventListener('beforeunload', () => {
      this.handlePageUnload();
    });
  }

  private updateActivity(): void {
    if (!this.currentSession) return;
    
    this.currentSession.last_activity = new Date();
    this.resetSessionTimeout();
    this.saveSession();
  }

  private resetSessionTimeout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    
    this.sessionTimeout = setTimeout(() => {
      this.expireSession();
    }, this.SESSION_TIMEOUT);
  }

  private expireSession(): void {
    if (this.currentSession) {
      this.saveSessionHistory();
      this.currentSession = this.createNewSession();
      this.saveSession();
    }
  }

  private handlePageHidden(): void {
    if (this.currentSession) {
      this.currentSession.last_activity = new Date();
      this.saveSession();
    }
  }

  private handlePageVisible(): void {
    this.updateActivity();
  }

  private handlePageUnload(): void {
    if (this.currentSession) {
      this.currentSession.last_activity = new Date();
      this.saveSession();
      this.saveSessionHistory();
    }
  }

  private saveSession(): void {
    if (!this.currentSession) return;
    
    try {
      const sessionData = {
        id: this.currentSession.id,
        start_time: this.currentSession.start_time.toISOString(),
        last_activity: this.currentSession.last_activity.toISOString(),
        page_views: this.currentSession.page_views,
        pages_visited: this.currentSession.pages_visited,
        referrer: this.currentSession.referrer,
        utm_parameters: this.currentSession.utm_parameters,
        device_info: this.currentSession.device_info,
        engagement_score: this.currentSession.engagement_score,
        conversion_events: this.currentSession.conversion_events
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  private saveSessionHistory(): void {
    if (!this.currentSession) return;
    
    try {
      const historyKey = `${this.STORAGE_KEY}_history`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      // Keep only last 10 sessions
      const sessionSummary = {
        id: this.currentSession.id,
        start_time: this.currentSession.start_time.toISOString(),
        duration: Date.now() - this.currentSession.start_time.getTime(),
        page_views: this.currentSession.page_views,
        engagement_score: this.getEngagementScore(),
        conversion_events: this.currentSession.conversion_events.length
      };
      
      history.push(sessionSummary);
      if (history.length > 10) {
        history.shift();
      }
      
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save session history:', error);
    }
  }

  // Public API
  public getCurrentSession(): SessionData | null {
    return this.currentSession;
  }

  public getSessionId(): string | null {
    return this.currentSession?.id || null;
  }

  public recordPageVisit(page: string): void {
    if (!this.currentSession) return;
    
    const pageVisit: PageVisit = {
      page,
      timestamp: new Date(),
      scroll_depth: 0,
      time_on_page: 0
    };
    
    // Update previous page's time_on_page
    const previousVisit = this.currentSession.pages_visited.slice(-1)[0];
    if (previousVisit) {
      previousVisit.time_on_page = Date.now() - previousVisit.timestamp.getTime();
    }
    
    this.currentSession.pages_visited.push(pageVisit);
    this.currentSession.page_views++;
    this.updateActivity();
  }

  public recordInteraction(interaction: UserInteraction): void {
    if (!this.currentSession) return;
    
    this.currentSession.interactions.push(interaction);
    this.updateActivity();
  }

  public updateScrollDepth(depth: number): void {
    if (!this.currentSession) return;
    
    const currentPage = this.currentSession.pages_visited.slice(-1)[0];
    if (currentPage) {
      currentPage.scroll_depth = Math.max(currentPage.scroll_depth, depth);
      this.updateActivity();
    }
  }

  public getSessionMetrics(): SessionMetrics {
    if (!this.currentSession) {
      return {
        duration: 0,
        page_views: 0,
        engagement_score: 0,
        conversion_events: 0,
        bounce_rate: 100,
        journey_progression: 0
      };
    }
    
    const duration = Date.now() - this.currentSession.start_time.getTime();
    const engagementScore = this.getEngagementScore();
    
    return {
      duration,
      page_views: this.currentSession.page_views,
      engagement_score: engagementScore,
      conversion_events: this.currentSession.conversion_events.length,
      bounce_rate: this.currentSession.page_views === 1 ? 100 : 0,
      journey_progression: this.calculateJourneyProgression()
    };
  }

  private getEngagementScore(): number {
    if (!this.currentSession) return 0;
    
    const duration = Date.now() - this.currentSession.start_time.getTime();
    const durationScore = Math.min(duration / 300000, 1) * 30; // 5 minutes max = 30 points
    const pageViewScore = Math.min(this.currentSession.page_views * 10, 30); // 10 points per page, max 30
    const interactionScore = Math.min(this.currentSession.interactions.length * 2, 40); // 2 points per interaction, max 40
    
    return Math.round(durationScore + pageViewScore + interactionScore);
  }

  private calculateJourneyProgression(): number {
    const stages = ['awareness', 'interest', 'consideration', 'decision', 'customer', 'advocate'];
    const currentStage = localStorage.getItem('bs_analytics_journey_stage') || 'awareness';
    const stageIndex = stages.indexOf(currentStage);
    
    return (stageIndex + 1) / stages.length * 100;
  }

  public getSessionHistory(): any[] {
    try {
      const historyKey = `${this.STORAGE_KEY}_history`;
      return JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch {
      return [];
    }
  }

  public isNewSession(): boolean {
    if (!this.currentSession) return true;
    
    const sessionAge = Date.now() - this.currentSession.start_time.getTime();
    return sessionAge < 60000; // Less than 1 minute old
  }

  public getVisitorType(): 'new' | 'returning' {
    return localStorage.getItem('bs_analytics_visitor') ? 'returning' : 'new';
  }

  public markAsReturningVisitor(): void {
    localStorage.setItem('bs_analytics_visitor', 'true');
  }

  public getTotalSessions(): number {
    const history = this.getSessionHistory();
    return history.length + (this.currentSession ? 1 : 0);
  }

  public getAverageSessionDuration(): number {
    const history = this.getSessionHistory();
    if (history.length === 0) return 0;
    
    const totalDuration = history.reduce((sum, session) => sum + session.duration, 0);
    return totalDuration / history.length;
  }

  public clearSessionData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(`${this.STORAGE_KEY}_history`);
    localStorage.removeItem('bs_analytics_visitor');
    this.currentSession = null;
    
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
  }
}