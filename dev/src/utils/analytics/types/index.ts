// Core Analytics Types
export interface AnalyticsEvent {
  // Core Event Properties
  event_id: string;
  event_type: EventType;
  type: EventType;
  timestamp: Date;
  session_id: string;
  user_id?: string;
  
  // Event Data
  properties: EventProperties;
  context: EventContext;
  
  // Business Intelligence
  revenue_impact?: number;
  lead_score_impact?: number;
  conversion_probability?: number;
}

export type EventType = 
  | 'page_view'
  | 'product_view' 
  | 'quiz_interaction'
  | 'form_submission'
  | 'demo_request'
  | 'quote_request'
  | 'content_engagement'
  | 'search_interaction'
  | 'filter_usage'
  | 'comparison_action'
  | 'download_action'
  | 'social_share'
  | 'error_encounter'
  | 'conversion_event'
  | 'click_event'
  | 'scroll_milestone'
  | 'page_exit'
  | 'product_interaction'
  | 'form_interaction'
  | 'conversion'
  | 'quiz_event'
  | 'interaction'
  | 'custom'
  | 'network_status'
  | 'slow_resource'
  | 'page_load';

export interface EventProperties {
  // Product-specific
  product_id?: string;
  product_category?: string;
  product_brand?: string;
  product_price?: string;
  price_range?: string;
  
  // Content-specific
  content_type?: string;
  content_id?: string;
  content_title?: string;
  engagement_duration?: number;
  
  // Interaction-specific
  interaction_type?: string;
  element_id?: string;
  element_class?: string;
  element_text?: string;
  scroll_depth?: number;
  
  // Page-specific
  page_url?: string;
  page_title?: string;
  page_path?: string;
  referrer?: string;
  
  // Form-specific
  form_id?: string;
  form_name?: string;
  field_name?: string;
  form_step?: number;
  
  // Business-specific
  lead_source?: string;
  campaign_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ab_test_variant?: string;
  
  // Conversion-specific
  conversion_type?: string;
  conversion_value?: number;
  funnel_step?: string;
  
  // Technical
  viewing_duration?: number;
  mouse_trail?: MouseEvent[];
  time_to_milestone?: number;
  milestone_percent?: number;
  x_position?: number;
  y_position?: number;
  
  // Quiz-specific
  quiz_step?: number;
  
  // Additional properties for analytics processing
  product_value_tier?: string;
  page_category?: string;
  button_type?: string;
  href?: string;
  form_data?: any;
  error_type?: string;
  
  // Search-specific
  search_query?: string;
  search_results_count?: number;
  search_intent?: string;
  
  // Form-specific extended
  form_type?: string;
  
  // Filter-specific
  filters_applied?: any;
  filter_complexity?: string | number;
  
  // Engagement-specific
  engagement_level?: string;
  
  // Lead scoring
  priority_lead?: boolean;
  
  // Quiz extended
  quiz_progress?: number;
  
  // Time tracking
  time_spent_calculation?: number;
  
  // Error handling
  error_message?: string;
  
  // Additional event-specific properties
  high_intent_signal?: boolean;
  high_intent_action?: boolean;
  follow_up_urgency?: string;
  content_value?: string;
  commercial_signal?: boolean;
  evaluation_stage?: boolean;
  products_compared?: number;
  download_type?: string;
  platform?: string;
  content_shared?: string;
  advocacy_signal?: boolean;
  high_value_conversion?: boolean;
  
  // Processing enriched properties
  deep_engagement?: boolean;
  content_consumption?: string;
  scroll_engagement?: string;
  journey_stage?: string;
  behavioral_intent?: string;
  session_depth?: string;
  exit_intent?: boolean;
  session_value?: string;
  user_segment?: string;
  click_importance?: string;
  user_experience_degradation?: boolean;
  negative_experience?: boolean;
  session_end?: boolean;
  interaction_quality?: string;
  conversion_stage?: string;
  lead_magnet_interaction?: boolean;
  high_purchase_intent?: boolean;
  research_behavior?: boolean;
  sales_qualified?: boolean;
  requires_follow_up?: boolean;
  quiz_answers?: any;
  quiz_score?: number;
  
  // Error tracking
  stack?: string;
  error_file?: string;
  error_line?: number;
  
  // Performance tracking
  load_time?: number;
  resource_url?: string;
  resource_type?: string;
  duration?: number;
  dns_time?: number;
  connect_time?: number;
  response_time?: number;
  dom_ready_time?: number;
  size?: number;
  
  // Network status
  status?: string;
  
  // Error details
  error_column?: number;
}

export interface EventContext {
  // Technical Context
  device: DeviceInfo;
  browser: BrowserInfo;
  location: LocationInfo;
  
  // User Context
  is_returning_visitor: boolean;
  session_count: number;
  previous_page?: string;
  referrer?: string;
  
  // Business Context
  customer_segment?: string;
  lead_score?: number;
  journey_stage?: JourneyStage;
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  screen_resolution: string;
  viewport_size: string;
  device_memory?: number;
  connection_type?: string;
}

export interface BrowserInfo {
  name: string;
  version: string;
  language: string;
  timezone: string;
  user_agent: string;
  cookies_enabled: boolean;
  javascript_enabled: boolean;
}

export interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  timezone: string;
  ip_address?: string; // Anonymized
}

export type JourneyStage = 'awareness' | 'interest' | 'consideration' | 'decision' | 'customer' | 'advocate';

export interface MouseEvent {
  x: number;
  y: number;
  timestamp: number;
  page: string;
}

export interface SessionData {
  id: string;
  start_time: Date;
  last_activity: Date;
  page_views: number;
  pages_visited: PageVisit[];
  events: AnalyticsEvent[];
  interactions: UserInteraction[];
  referrer: string;
  utm_parameters: UTMParameters;
  device_info: DeviceInfo;
  engagement_score?: number;
  conversion_events: ConversionEvent[];
}

export interface PageVisit {
  page: string;
  timestamp: Date;
  scroll_depth: number;
  time_on_page: number;
}

export interface UserInteraction {
  type: string;
  element: string;
  timestamp: Date;
  properties: object;
}

export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface ConversionEvent {
  type: string;
  value?: number;
  timestamp: Date;
  attribution: AttributionData;
}

export interface AttributionData {
  first_touch: TouchPoint;
  last_touch: TouchPoint;
  multi_touch: TouchPoint[];
  conversion_path: string[];
}

export interface TouchPoint {
  source: string;
  medium: string;
  campaign?: string;
  timestamp: Date;
  page: string;
}

// Configuration Types
export interface AnalyticsConfig {
  // Tracking Configuration
  google_analytics_id?: string;
  mixpanel_token?: string;
  
  // Real-time Configuration
  websocket_url?: string;
  api_endpoint?: string;
  
  // Behavioral Tracking
  heatmap_enabled: boolean;
  session_recording_enabled: boolean;
  scroll_tracking_enabled: boolean;
  
  // Privacy & Compliance
  cookie_consent_required: boolean;
  data_retention_days: number;
  anonymize_ip: boolean;
  
  // Performance Settings
  batch_size: number;
  flush_interval: number;
  max_queue_size: number;
}

// Real-time Types
export interface RealTimeData {
  [metric: string]: RealTimeMetric;
}

export interface RealTimeMetric {
  current: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  sparkline: number[];
}

// Customer Journey Types
export interface CustomerJourney {
  user_id: string;
  start_date: Date;
  last_activity: Date;
  current_stage: JourneyStage;
  events: JourneyEvent[];
  touchpoints: TouchPoint[];
  progression_score: number;
  conversion_probability: number;
  attribution_data: AttributionData;
}

export interface JourneyEvent {
  id: string;
  type: string;
  timestamp: Date;
  page: string;
  properties: object;
  context: EventContext;
  impact_score: number;
}

export interface JourneyAnalytics {
  common_paths: PathAnalysis[];
  drop_off_points: DropOffPoint[];
  conversion_triggers: ConversionTrigger[];
  optimization_opportunities: OptimizationOpportunity[];
  stage_conversion_rates: StageConversionRate[];
  average_journey_length: number;
}

export interface PathAnalysis {
  path: string[];
  frequency: number;
  conversion_rate: number;
  average_time: number;
}

export interface DropOffPoint {
  page: string;
  stage: JourneyStage;
  drop_off_rate: number;
  common_previous_pages: string[];
}

export interface ConversionTrigger {
  trigger_type: string;
  conversion_lift: number;
  frequency: number;
  recommended_optimization: string;
}

export interface OptimizationOpportunity {
  type: 'content' | 'navigation' | 'form' | 'product';
  page: string;
  potential_impact: number;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface StageConversionRate {
  from_stage: JourneyStage;
  to_stage: JourneyStage;
  conversion_rate: number;
  average_time: number;
}

// Utility Types
export type EventHandler = (event: AnalyticsEvent) => void;
export type SessionMetrics = {
  duration: number;
  page_views: number;
  engagement_score: number;
  conversion_events: number;
  bounce_rate: number;
  journey_progression: number;
};