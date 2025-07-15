import type {
  CustomerJourney,
  JourneyStage,
  JourneyEvent,
  JourneyAnalytics,
  PathAnalysis,
  DropOffPoint,
  ConversionTrigger,
  OptimizationOpportunity,
  StageConversionRate,
  AnalyticsEvent,
  EventContext,
  TouchPoint
} from '../types';
import { SessionManager } from '../core/SessionManager';

export class JourneyMapper {
  private static instance: JourneyMapper;
  private journeys: Map<string, CustomerJourney> = new Map();
  private stageDefinitions: Map<JourneyStage, StageDefinition> = new Map();
  private readonly STORAGE_KEY = 'bs_analytics_journeys';
  private readonly MAX_JOURNEYS = 1000;

  private constructor() {
    this.initializeStageDefinitions();
    this.loadStoredJourneys();
  }

  public static getInstance(): JourneyMapper {
    if (!JourneyMapper.instance) {
      JourneyMapper.instance = new JourneyMapper();
    }
    return JourneyMapper.instance;
  }

  private initializeStageDefinitions(): void {
    this.stageDefinitions.set('awareness', {
      name: 'Awareness',
      description: 'Initial discovery and brand awareness',
      triggerEvents: ['page_view', 'search_interaction'],
      requiredEvents: 1,
      maxDuration: 1800000, // 30 minutes
      advancementEvents: ['product_view', 'content_engagement']
    });

    this.stageDefinitions.set('interest', {
      name: 'Interest',
      description: 'Showing interest in products/services',
      triggerEvents: ['product_view', 'content_engagement', 'filter_usage'],
      requiredEvents: 2,
      maxDuration: 3600000, // 1 hour
      advancementEvents: ['quiz_interaction', 'comparison_action', 'download_action']
    });

    this.stageDefinitions.set('consideration', {
      name: 'Consideration',
      description: 'Actively considering purchase',
      triggerEvents: ['quiz_interaction', 'comparison_action', 'download_action'],
      requiredEvents: 1,
      maxDuration: 7200000, // 2 hours
      advancementEvents: ['demo_request', 'quote_request', 'form_submission']
    });

    this.stageDefinitions.set('decision', {
      name: 'Decision',
      description: 'Ready to make purchase decision',
      triggerEvents: ['demo_request', 'quote_request', 'form_submission'],
      requiredEvents: 1,
      maxDuration: 86400000, // 24 hours
      advancementEvents: ['conversion_event']
    });

    this.stageDefinitions.set('customer', {
      name: 'Customer',
      description: 'Completed purchase/conversion',
      triggerEvents: ['conversion_event'],
      requiredEvents: 1,
      maxDuration: Infinity,
      advancementEvents: ['social_share', 'referral_action']
    });

    this.stageDefinitions.set('advocate', {
      name: 'Advocate',
      description: 'Active promoter and referrer',
      triggerEvents: ['social_share', 'referral_action'],
      requiredEvents: 2,
      maxDuration: Infinity,
      advancementEvents: []
    });
  }

  private loadStoredJourneys(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const journeysData = JSON.parse(stored);
        journeysData.forEach((journeyData: any) => {
          this.journeys.set(journeyData.user_id, this.deserializeJourney(journeyData));
        });
      }
    } catch (error) {
      console.error('Failed to load stored journeys:', error);
    }
  }

  private deserializeJourney(data: any): CustomerJourney {
    return {
      user_id: data.user_id,
      start_date: new Date(data.start_date),
      last_activity: new Date(data.last_activity),
      current_stage: data.current_stage,
      events: data.events.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp)
      })),
      touchpoints: data.touchpoints.map((tp: any) => ({
        ...tp,
        timestamp: new Date(tp.timestamp)
      })),
      progression_score: data.progression_score,
      conversion_probability: data.conversion_probability,
      attribution_data: data.attribution_data
    };
  }

  private saveJourneys(): void {
    try {
      const journeysArray = Array.from(this.journeys.values());
      // Keep only most recent journeys to manage storage
      const recentJourneys = journeysArray
        .sort((a, b) => b.last_activity.getTime() - a.last_activity.getTime())
        .slice(0, this.MAX_JOURNEYS);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentJourneys));
    } catch (error) {
      console.error('Failed to save journeys:', error);
    }
  }

  public recordEvent(event: AnalyticsEvent): void {
    const userId = this.getUserId(event);
    const journey = this.getOrCreateJourney(userId, event);
    
    // Add event to journey
    const journeyEvent: JourneyEvent = {
      id: event.event_id,
      type: event.event_type,
      timestamp: event.timestamp,
      page: event.properties.page_path || '/',
      properties: event.properties,
      context: event.context,
      impact_score: this.calculateEventImpact(event)
    };

    journey.events.push(journeyEvent);
    journey.last_activity = event.timestamp;

    // Update touchpoints
    this.updateTouchpoints(journey, event);

    // Update stage progression
    this.updateStageProgression(journey, event);

    // Recalculate metrics
    this.recalculateJourneyMetrics(journey);

    // Save changes
    this.saveJourneys();
  }

  private getUserId(event: AnalyticsEvent): string {
    if (event.user_id) return event.user_id;
    
    // Fallback to session ID for anonymous users
    const sessionManager = SessionManager.getInstance();
    const sessionId = sessionManager.getSessionId();
    return sessionId || `anonymous_${Date.now()}`;
  }

  private getOrCreateJourney(userId: string, event: AnalyticsEvent): CustomerJourney {
    let journey = this.journeys.get(userId);
    
    if (!journey) {
      journey = {
        user_id: userId,
        start_date: event.timestamp,
        last_activity: event.timestamp,
        current_stage: 'awareness',
        events: [],
        touchpoints: [],
        progression_score: 0,
        conversion_probability: 0,
        attribution_data: {
          first_touch: this.createTouchPoint(event, 'first'),
          last_touch: this.createTouchPoint(event, 'last'),
          multi_touch: [],
          conversion_path: []
        }
      };
      
      this.journeys.set(userId, journey);
    }
    
    return journey;
  }

  private createTouchPoint(event: AnalyticsEvent, _type: 'first' | 'last'): TouchPoint {
    return {
      source: event.properties.utm_source || 'direct',
      medium: event.properties.utm_medium || 'none',
      campaign: event.properties.utm_campaign,
      timestamp: event.timestamp,
      page: event.properties.page_path || '/'
    };
  }

  private updateTouchpoints(journey: CustomerJourney, event: AnalyticsEvent): void {
    const touchpoint = this.createTouchPoint(event, 'last');
    
    // Update last touch
    journey.attribution_data.last_touch = touchpoint;
    
    // Add to multi-touch array (keep last 10)
    journey.touchpoints.push(touchpoint);
    if (journey.touchpoints.length > 10) {
      journey.touchpoints.shift();
    }
    
    journey.attribution_data.multi_touch = [...journey.touchpoints];
    
    // Update conversion path
    const currentPage = event.properties.page_path || '/';
    if (!journey.attribution_data.conversion_path.includes(currentPage)) {
      journey.attribution_data.conversion_path.push(currentPage);
    }
  }

  private updateStageProgression(journey: CustomerJourney, event: AnalyticsEvent): void {
    const currentStage = journey.current_stage;
    const stageDefinition = this.stageDefinitions.get(currentStage);
    
    if (!stageDefinition) return;

    // Check if event triggers stage advancement
    if (stageDefinition.advancementEvents.includes(event.event_type)) {
      const nextStage = this.getNextStage(currentStage);
      if (nextStage) {
        journey.current_stage = nextStage;
        
        // Update localStorage for quick access
        localStorage.setItem('bs_analytics_journey_stage', nextStage);
        
        // Track stage advancement event
        this.trackStageAdvancement(journey, currentStage, nextStage);
      }
    }
  }

  private getNextStage(currentStage: JourneyStage): JourneyStage | null {
    const stages: JourneyStage[] = ['awareness', 'interest', 'consideration', 'decision', 'customer', 'advocate'];
    const currentIndex = stages.indexOf(currentStage);
    
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      return stages[currentIndex + 1];
    }
    
    return null;
  }

  private trackStageAdvancement(journey: CustomerJourney, fromStage: JourneyStage, toStage: JourneyStage): void {
    const advancementEvent: JourneyEvent = {
      id: `stage_advancement_${Date.now()}`,
      type: 'stage_advancement',
      timestamp: new Date(),
      page: journey.attribution_data.conversion_path.slice(-1)[0] || '/',
      properties: {
        from_stage: fromStage,
        to_stage: toStage,
        advancement_trigger: 'automatic'
      },
      context: {} as EventContext,
      impact_score: this.calculateStageAdvancementImpact(fromStage, toStage)
    };
    
    journey.events.push(advancementEvent);
  }

  private calculateStageAdvancementImpact(fromStage: JourneyStage, toStage: JourneyStage): number {
    const stageValues = {
      'awareness': 10,
      'interest': 20,
      'consideration': 40,
      'decision': 70,
      'customer': 100,
      'advocate': 120
    };
    
    return stageValues[toStage] - stageValues[fromStage];
  }

  private recalculateJourneyMetrics(journey: CustomerJourney): void {
    // Calculate progression score
    journey.progression_score = this.calculateProgressionScore(journey);
    
    // Calculate conversion probability
    journey.conversion_probability = this.calculateConversionProbability(journey);
  }

  private calculateProgressionScore(journey: CustomerJourney): number {
    const stages: JourneyStage[] = ['awareness', 'interest', 'consideration', 'decision', 'customer', 'advocate'];
    const stageIndex = stages.indexOf(journey.current_stage);
    const baseScore = (stageIndex + 1) / stages.length * 100;
    
    // Adjust based on engagement
    const engagementMultiplier = this.calculateEngagementMultiplier(journey);
    
    return Math.min(100, Math.round(baseScore * engagementMultiplier));
  }

  private calculateEngagementMultiplier(journey: CustomerJourney): number {
    const eventCount = journey.events.length;
    const touchpointCount = journey.touchpoints.length;
    const journeyDuration = Date.now() - journey.start_date.getTime();
    
    // Base multiplier
    let multiplier = 1.0;
    
    // Engagement based on event count
    if (eventCount > 20) multiplier += 0.3;
    else if (eventCount > 10) multiplier += 0.2;
    else if (eventCount > 5) multiplier += 0.1;
    
    // Engagement based on touchpoint diversity
    if (touchpointCount > 3) multiplier += 0.2;
    else if (touchpointCount > 1) multiplier += 0.1;
    
    // Time-based engagement
    const daysActive = journeyDuration / (1000 * 60 * 60 * 24);
    if (daysActive > 7) multiplier += 0.1;
    else if (daysActive > 1) multiplier += 0.05;
    
    return multiplier;
  }

  private calculateConversionProbability(journey: CustomerJourney): number {
    const stages: JourneyStage[] = ['awareness', 'interest', 'consideration', 'decision', 'customer', 'advocate'];
    const stageIndex = stages.indexOf(journey.current_stage);
    
    // Base probability based on stage
    const baseProbabilities = [5, 15, 35, 70, 100, 100];
    let probability = baseProbabilities[stageIndex] || 0;
    
    // Adjust based on journey characteristics
    const highIntentEvents = journey.events.filter(event => 
      ['demo_request', 'quote_request', 'comparison_action', 'quiz_interaction'].includes(event.type)
    ).length;
    
    if (highIntentEvents > 0) {
      probability += Math.min(20, highIntentEvents * 5);
    }
    
    // Adjust based on engagement
    const engagementBonus = this.calculateEngagementMultiplier(journey) - 1;
    probability += engagementBonus * 15;
    
    // Adjust based on recency
    const daysSinceLastActivity = (Date.now() - journey.last_activity.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastActivity > 7) {
      probability *= 0.7; // Decay for inactive users
    } else if (daysSinceLastActivity > 3) {
      probability *= 0.9;
    }
    
    return Math.min(100, Math.max(0, Math.round(probability)));
  }

  private calculateEventImpact(event: AnalyticsEvent): number {
    const eventImpacts = {
      'page_view': 1,
      'product_view': 3,
      'quiz_interaction': 5,
      'form_submission': 8,
      'demo_request': 12,
      'quote_request': 15,
      'conversion_event': 20,
      'content_engagement': 2,
      'search_interaction': 2,
      'filter_usage': 3,
      'comparison_action': 6,
      'download_action': 4,
      'social_share': 7,
      'click_event': 1,
      'scroll_milestone': 1,
      'page_exit': 0,
      'error_encounter': -1,
      'product_interaction': 4,
      'form_interaction': 3,
      'conversion': 20,
      'quiz_event': 5,
      'interaction': 2,
      'custom': 1,
      'network_status': 0,
      'slow_resource': -1,
      'page_load': 1
    };
    
    return eventImpacts[event.event_type] || 1;
  }

  // Public API
  public getJourney(userId: string): CustomerJourney | null {
    return this.journeys.get(userId) || null;
  }

  public getCurrentUserJourney(): CustomerJourney | null {
    const sessionManager = SessionManager.getInstance();
    const sessionId = sessionManager.getSessionId();
    
    if (!sessionId) return null;
    
    // Try to find by user ID first
    const userId = localStorage.getItem('bs_analytics_user_id');
    if (userId && this.journeys.has(userId)) {
      return this.journeys.get(userId)!;
    }
    
    // Fallback to session ID
    return this.journeys.get(sessionId) || null;
  }

  public getAllJourneys(): CustomerJourney[] {
    return Array.from(this.journeys.values());
  }

  public getJourneyAnalytics(): JourneyAnalytics {
    const journeys = this.getAllJourneys();
    
    return {
      common_paths: this.analyzeCommonPaths(journeys),
      drop_off_points: this.analyzeDropOffPoints(journeys),
      conversion_triggers: this.analyzeConversionTriggers(journeys),
      optimization_opportunities: this.identifyOptimizationOpportunities(journeys),
      stage_conversion_rates: this.calculateStageConversionRates(journeys),
      average_journey_length: this.calculateAverageJourneyLength(journeys)
    };
  }

  private analyzeCommonPaths(journeys: CustomerJourney[]): PathAnalysis[] {
    const pathCounts = new Map<string, PathData>();
    
    journeys.forEach(journey => {
      const path = journey.attribution_data.conversion_path.join(' -> ');
      const existing = pathCounts.get(path) || {
        path: journey.attribution_data.conversion_path,
        count: 0,
        conversions: 0,
        totalTime: 0
      };
      
      existing.count++;
      if (journey.current_stage === 'customer' || journey.current_stage === 'advocate') {
        existing.conversions++;
      }
      
      const journeyTime = journey.last_activity.getTime() - journey.start_date.getTime();
      existing.totalTime += journeyTime;
      
      pathCounts.set(path, existing);
    });
    
    return Array.from(pathCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(data => ({
        path: data.path,
        frequency: data.count,
        conversion_rate: data.count > 0 ? (data.conversions / data.count) * 100 : 0,
        average_time: data.count > 0 ? data.totalTime / data.count : 0
      }));
  }

  private analyzeDropOffPoints(journeys: CustomerJourney[]): DropOffPoint[] {
    const dropOffs = new Map<string, DropOffData>();
    
    journeys.forEach(journey => {
      const lastPage = journey.attribution_data.conversion_path.slice(-1)[0] || '/';
      const stage = journey.current_stage;
      
      // Only consider as drop-off if journey hasn't progressed to customer/advocate
      if (stage !== 'customer' && stage !== 'advocate') {
        const key = `${lastPage}_${stage}`;
        const existing = dropOffs.get(key) || {
          page: lastPage,
          stage,
          dropOffCount: 0,
          totalVisits: 0,
          previousPages: new Set<string>()
        };
        
        existing.dropOffCount++;
        existing.totalVisits++;
        
        // Track previous page
        const previousPage = journey.attribution_data.conversion_path.slice(-2, -1)[0];
        if (previousPage) {
          existing.previousPages.add(previousPage);
        }
        
        dropOffs.set(key, existing);
      }
    });
    
    return Array.from(dropOffs.values())
      .sort((a, b) => b.dropOffCount - a.dropOffCount)
      .slice(0, 10)
      .map(data => ({
        page: data.page,
        stage: data.stage as JourneyStage,
        drop_off_rate: (data.dropOffCount / data.totalVisits) * 100,
        common_previous_pages: Array.from(data.previousPages).slice(0, 5)
      }));
  }

  private analyzeConversionTriggers(journeys: CustomerJourney[]): ConversionTrigger[] {
    const triggers = new Map<string, TriggerData>();
    
    journeys
      .filter(journey => journey.current_stage === 'customer' || journey.current_stage === 'advocate')
      .forEach(journey => {
        // Find the event that triggered conversion
        const conversionEvent = journey.events.find(event => event.type === 'conversion_event');
        const triggerEvent = journey.events[journey.events.indexOf(conversionEvent!) - 1];
        
        if (triggerEvent) {
          const existing = triggers.get(triggerEvent.type) || {
            type: triggerEvent.type,
            conversions: 0,
            totalOccurrences: 0
          };
          
          existing.conversions++;
          triggers.set(triggerEvent.type, existing);
        }
      });
    
    // Count total occurrences of each event type
    journeys.forEach(journey => {
      journey.events.forEach(event => {
        const existing = triggers.get(event.type);
        if (existing) {
          existing.totalOccurrences++;
        }
      });
    });
    
    return Array.from(triggers.values())
      .filter(data => data.totalOccurrences > 0)
      .sort((a, b) => (b.conversions / b.totalOccurrences) - (a.conversions / a.totalOccurrences))
      .slice(0, 10)
      .map(data => ({
        trigger_type: data.type,
        conversion_lift: (data.conversions / data.totalOccurrences) * 100,
        frequency: data.totalOccurrences,
        recommended_optimization: this.getOptimizationRecommendation(data.type)
      }));
  }

  private getOptimizationRecommendation(eventType: string): string {
    const recommendations: Record<string, string> = {
      'product_view': 'Optimize product pages with clearer CTAs and detailed specifications',
      'quiz_interaction': 'Improve quiz flow and add personalized recommendations',
      'demo_request': 'Streamline demo booking process and follow-up communications',
      'quote_request': 'Simplify quote request form and provide instant estimates',
      'comparison_action': 'Enhance comparison tools with detailed feature matrices',
      'download_action': 'Create more valuable downloadable content and lead magnets',
      'content_engagement': 'Develop more engaging content that drives action',
      'form_submission': 'Optimize form design and reduce form abandonment'
    };
    
    return recommendations[eventType] || 'Analyze user behavior for this event type';
  }

  private identifyOptimizationOpportunities(journeys: CustomerJourney[]): OptimizationOpportunity[] {
    // This is a simplified implementation - could be much more sophisticated
    const opportunities: OptimizationOpportunity[] = [];
    
    const dropOffs = this.analyzeDropOffPoints(journeys);
    dropOffs.slice(0, 5).forEach(dropOff => {
      opportunities.push({
        type: 'navigation',
        page: dropOff.page,
        potential_impact: dropOff.drop_off_rate,
        recommendation: `Reduce drop-off on ${dropOff.page} by improving ${dropOff.stage} stage experience`,
        priority: dropOff.drop_off_rate > 50 ? 'high' : dropOff.drop_off_rate > 25 ? 'medium' : 'low'
      });
    });
    
    return opportunities;
  }

  private calculateStageConversionRates(journeys: CustomerJourney[]): StageConversionRate[] {
    const stages: JourneyStage[] = ['awareness', 'interest', 'consideration', 'decision', 'customer'];
    const stageData = new Map<string, StageData>();
    
    // Initialize stage data
    for (let i = 0; i < stages.length - 1; i++) {
      const fromStage = stages[i];
      const toStage = stages[i + 1];
      const key = `${fromStage}_${toStage}`;
      
      stageData.set(key, {
        fromStage,
        toStage,
        fromCount: 0,
        toCount: 0,
        totalTime: 0,
        conversions: 0
      });
    }
    
    // Count journeys in each stage
    journeys.forEach(journey => {
      const currentStageIndex = stages.indexOf(journey.current_stage);
      
      // Count all stages this journey has passed through
      for (let i = 0; i <= currentStageIndex && i < stages.length - 1; i++) {
        const fromStage = stages[i];
        const toStage = stages[i + 1];
        const key = `${fromStage}_${toStage}`;
        const data = stageData.get(key)!;
        
        data.fromCount++;
        
        if (i < currentStageIndex) {
          data.toCount++;
          data.conversions++;
        }
      }
    });
    
    return Array.from(stageData.values()).map(data => ({
      from_stage: data.fromStage,
      to_stage: data.toStage,
      conversion_rate: data.fromCount > 0 ? (data.toCount / data.fromCount) * 100 : 0,
      average_time: data.conversions > 0 ? data.totalTime / data.conversions : 0
    }));
  }

  private calculateAverageJourneyLength(journeys: CustomerJourney[]): number {
    if (journeys.length === 0) return 0;
    
    const totalEvents = journeys.reduce((sum, journey) => sum + journey.events.length, 0);
    return totalEvents / journeys.length;
  }

  public clearJourneys(): void {
    this.journeys.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }

  public exportJourneys(format: 'json' | 'csv'): string {
    const journeys = this.getAllJourneys();
    
    if (format === 'json') {
      return JSON.stringify(journeys, null, 2);
    } else {
      // CSV format
      const headers = [
        'User ID', 'Start Date', 'Last Activity', 'Current Stage', 
        'Events Count', 'Progression Score', 'Conversion Probability'
      ];
      
      const rows = [headers];
      
      journeys.forEach(journey => {
        rows.push([
          journey.user_id,
          journey.start_date.toISOString(),
          journey.last_activity.toISOString(),
          journey.current_stage,
          journey.events.length.toString(),
          journey.progression_score.toString(),
          journey.conversion_probability.toString()
        ]);
      });
      
      return rows.map(row => row.join(',')).join('\n');
    }
  }
}

// Helper types
interface StageDefinition {
  name: string;
  description: string;
  triggerEvents: string[];
  requiredEvents: number;
  maxDuration: number;
  advancementEvents: string[];
}

interface PathData {
  path: string[];
  count: number;
  conversions: number;
  totalTime: number;
}

interface DropOffData {
  page: string;
  stage: JourneyStage;
  dropOffCount: number;
  totalVisits: number;
  previousPages: Set<string>;
}

interface TriggerData {
  type: string;
  conversions: number;
  totalOccurrences: number;
}

interface StageData {
  fromStage: JourneyStage;
  toStage: JourneyStage;
  fromCount: number;
  toCount: number;
  totalTime: number;
  conversions: number;
}

export type { StageDefinition };