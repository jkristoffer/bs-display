import type { AnalyticsEvent, EventType, EventProperties } from '../types';

export class EventProcessor {
  private static instance: EventProcessor;
  private processors: Map<EventType, EventProcessorFunction> = new Map();

  private constructor() {
    this.setupDefaultProcessors();
  }

  public static getInstance(): EventProcessor {
    if (!EventProcessor.instance) {
      EventProcessor.instance = new EventProcessor();
    }
    return EventProcessor.instance;
  }

  private setupDefaultProcessors(): void {
    // Page view processor
    this.processors.set('page_view', (event) => {
      return this.processPageView(event);
    });

    // Product view processor
    this.processors.set('product_view', (event) => {
      return this.processProductView(event);
    });

    // Quiz interaction processor
    this.processors.set('quiz_interaction', (event) => {
      return this.processQuizInteraction(event);
    });

    // Form submission processor
    this.processors.set('form_submission', (event) => {
      return this.processFormSubmission(event);
    });

    // Demo request processor
    this.processors.set('demo_request', (event) => {
      return this.processDemoRequest(event);
    });

    // Quote request processor
    this.processors.set('quote_request', (event) => {
      return this.processQuoteRequest(event);
    });

    // Content engagement processor
    this.processors.set('content_engagement', (event) => {
      return this.processContentEngagement(event);
    });

    // Search interaction processor
    this.processors.set('search_interaction', (event) => {
      return this.processSearchInteraction(event);
    });

    // Filter usage processor
    this.processors.set('filter_usage', (event) => {
      return this.processFilterUsage(event);
    });

    // Comparison action processor
    this.processors.set('comparison_action', (event) => {
      return this.processComparisonAction(event);
    });

    // Download action processor
    this.processors.set('download_action', (event) => {
      return this.processDownloadAction(event);
    });

    // Social share processor
    this.processors.set('social_share', (event) => {
      return this.processSocialShare(event);
    });

    // Conversion event processor
    this.processors.set('conversion_event', (event) => {
      return this.processConversionEvent(event);
    });

    // Click event processor
    this.processors.set('click_event', (event) => {
      return this.processClickEvent(event);
    });

    // Scroll milestone processor
    this.processors.set('scroll_milestone', (event) => {
      return this.processScrollMilestone(event);
    });

    // Page exit processor
    this.processors.set('page_exit', (event) => {
      return this.processPageExit(event);
    });

    // Error encounter processor
    this.processors.set('error_encounter', (event) => {
      return this.processErrorEncounter(event);
    });
  }

  public processEvent(event: AnalyticsEvent): ProcessedEvent {
    const processor = this.processors.get(event.event_type);
    
    if (processor) {
      return processor(event);
    }
    
    // Default processing
    return this.processDefault(event);
  }

  private processPageView(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const isHomePage = properties.page_path === '/';
    const isProductPage = properties.page_path?.startsWith('/products/');
    const isQuizPage = properties.page_path === '/quiz';
    
    return {
      ...event,
      processed_data: {
        page_category: this.categorizePageType(properties.page_path || ''),
        is_home_page: isHomePage,
        is_product_page: isProductPage,
        is_quiz_page: isQuizPage,
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 1,
          multiplier: isProductPage ? 2 : 1,
          total_score: isProductPage ? 2 : 1
        }
      },
      enriched_properties: {
        ...properties,
        page_category: this.categorizePageType(properties.page_path || ''),
        time_spent_calculation: this.calculateTimeSpent(event)
      }
    };
  }

  private processProductView(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const productCategory = properties.product_category;
    const priceRange = this.categorizePriceRange(properties.product_price);
    
    return {
      ...event,
      processed_data: {
        product_insights: {
          category: productCategory,
          price_range: priceRange,
          brand: properties.product_brand,
          is_high_value: priceRange === 'premium'
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 5,
          multiplier: priceRange === 'premium' ? 2 : 1,
          total_score: priceRange === 'premium' ? 10 : 5
        }
      },
      enriched_properties: {
        ...properties,
        price_range: priceRange,
        product_value_tier: this.getProductValueTier(properties.product_price)
      }
    };
  }

  private processQuizInteraction(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const quizProgress = this.calculateQuizProgress(properties.quiz_step);
    
    return {
      ...event,
      processed_data: {
        quiz_insights: {
          progress_percentage: quizProgress,
          interaction_type: properties.interaction_type,
          engagement_level: this.calculateQuizEngagement(properties)
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 8,
          multiplier: quizProgress > 50 ? 1.5 : 1,
          total_score: quizProgress > 50 ? 12 : 8
        }
      },
      enriched_properties: {
        ...properties,
        quiz_progress: quizProgress,
        high_intent_signal: quizProgress > 75
      }
    };
  }

  private processFormSubmission(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const formType = this.categorizeFormType(properties.form_id || '');
    
    return {
      ...event,
      processed_data: {
        form_insights: {
          form_type: formType,
          is_lead_form: ['contact', 'demo', 'quote'].includes(formType),
          completion_indicator: true
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 15,
          multiplier: formType === 'quote' ? 2 : 1,
          total_score: formType === 'quote' ? 30 : 15
        }
      },
      enriched_properties: {
        ...properties,
        form_type: formType,
        high_intent_action: true
      }
    };
  }

  private processDemoRequest(event: AnalyticsEvent): ProcessedEvent {
    return {
      ...event,
      processed_data: {
        demo_insights: {
          is_high_intent: true,
          conversion_likelihood: 85,
          immediate_follow_up_required: true
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 25,
          multiplier: 1.5,
          total_score: 38
        }
      },
      enriched_properties: {
        ...event.properties,
        priority_lead: true,
        follow_up_urgency: 'high'
      }
    };
  }

  private processQuoteRequest(event: AnalyticsEvent): ProcessedEvent {
    return {
      ...event,
      processed_data: {
        quote_insights: {
          is_high_intent: true,
          conversion_likelihood: 90,
          immediate_follow_up_required: true,
          sales_qualified_lead: true
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 30,
          multiplier: 2,
          total_score: 60
        }
      },
      enriched_properties: {
        ...event.properties,
        priority_lead: true,
        follow_up_urgency: 'immediate',
        sales_qualified: true
      }
    };
  }

  private processContentEngagement(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const engagementDuration = properties.engagement_duration || 0;
    const engagementLevel = this.calculateContentEngagement(engagementDuration);
    
    return {
      ...event,
      processed_data: {
        content_insights: {
          engagement_level: engagementLevel,
          content_type: properties.content_type,
          time_spent: engagementDuration,
          is_deep_engagement: engagementDuration > 120000 // 2 minutes
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 3,
          multiplier: engagementLevel === 'high' ? 2 : 1,
          total_score: engagementLevel === 'high' ? 6 : 3
        }
      },
      enriched_properties: {
        ...properties,
        engagement_level: engagementLevel,
        content_value: this.assessContentValue(properties.content_type)
      }
    };
  }

  private processSearchInteraction(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const searchIntent = this.analyzeSearchIntent(properties.search_query);
    
    return {
      ...event,
      processed_data: {
        search_insights: {
          intent: searchIntent,
          has_commercial_intent: searchIntent === 'commercial',
          search_depth: properties.search_results_count || 0
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 4,
          multiplier: searchIntent === 'commercial' ? 2 : 1,
          total_score: searchIntent === 'commercial' ? 8 : 4
        }
      },
      enriched_properties: {
        ...properties,
        search_intent: searchIntent,
        commercial_signal: searchIntent === 'commercial'
      }
    };
  }

  private processFilterUsage(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const filterComplexity = this.calculateFilterComplexity(properties.filters_applied);
    
    return {
      ...event,
      processed_data: {
        filter_insights: {
          complexity: filterComplexity,
          is_detailed_search: filterComplexity > 2,
          intent_level: filterComplexity > 2 ? 'high' : 'medium'
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 5,
          multiplier: filterComplexity > 2 ? 1.5 : 1,
          total_score: filterComplexity > 2 ? 8 : 5
        }
      },
      enriched_properties: {
        ...properties,
        filter_complexity: filterComplexity,
        research_behavior: true
      }
    };
  }

  private processComparisonAction(event: AnalyticsEvent): ProcessedEvent {
    return {
      ...event,
      processed_data: {
        comparison_insights: {
          is_evaluation_stage: true,
          decision_making_signal: true,
          products_compared: event.properties.products_compared || 2
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 12,
          multiplier: 1.5,
          total_score: 18
        }
      },
      enriched_properties: {
        ...event.properties,
        evaluation_stage: true,
        high_purchase_intent: true
      }
    };
  }

  private processDownloadAction(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const downloadType = this.categorizeDownloadType(properties.download_type);
    
    return {
      ...event,
      processed_data: {
        download_insights: {
          download_type: downloadType,
          is_lead_magnet: ['spec_sheet', 'brochure', 'guide'].includes(downloadType),
          content_value: this.assessDownloadValue(downloadType)
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 10,
          multiplier: downloadType === 'spec_sheet' ? 1.5 : 1,
          total_score: downloadType === 'spec_sheet' ? 15 : 10
        }
      },
      enriched_properties: {
        ...properties,
        download_type: downloadType,
        lead_magnet_interaction: true
      }
    };
  }

  private processSocialShare(event: AnalyticsEvent): ProcessedEvent {
    return {
      ...event,
      processed_data: {
        social_insights: {
          platform: event.properties.platform,
          content_shared: event.properties.content_shared,
          viral_potential: true
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 6,
          multiplier: 1,
          total_score: 6
        }
      },
      enriched_properties: {
        ...event.properties,
        advocacy_signal: true
      }
    };
  }

  private processConversionEvent(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const conversionValue = properties.conversion_value || 0;
    
    return {
      ...event,
      processed_data: {
        conversion_insights: {
          conversion_type: properties.conversion_type,
          value: conversionValue,
          is_high_value: conversionValue > 1000,
          conversion_stage: this.determineConversionStage(properties.conversion_type)
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 50,
          multiplier: conversionValue > 1000 ? 2 : 1,
          total_score: conversionValue > 1000 ? 100 : 50
        }
      },
      enriched_properties: {
        ...properties,
        high_value_conversion: conversionValue > 1000,
        conversion_stage: this.determineConversionStage(properties.conversion_type)
      }
    };
  }

  private processClickEvent(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const clickImportance = this.assessClickImportance(properties.element_id, properties.element_class);
    
    return {
      ...event,
      processed_data: {
        click_insights: {
          importance: clickImportance,
          is_cta_click: this.isCTAClick(properties.element_id, properties.element_class),
          element_type: this.categorizeClickedElement(properties.element_id, properties.element_class)
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: clickImportance === 'high' ? 3 : 1,
          multiplier: 1,
          total_score: clickImportance === 'high' ? 3 : 1
        }
      },
      enriched_properties: {
        ...properties,
        click_importance: clickImportance,
        interaction_quality: this.assessInteractionQuality(properties)
      }
    };
  }

  private processScrollMilestone(event: AnalyticsEvent): ProcessedEvent {
    const properties = event.properties;
    const milestonePercent = properties.milestone_percent || 0;
    
    return {
      ...event,
      processed_data: {
        scroll_insights: {
          milestone: milestonePercent,
          is_deep_scroll: milestonePercent >= 75,
          engagement_level: this.calculateScrollEngagement(milestonePercent)
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: milestonePercent >= 75 ? 2 : 1,
          multiplier: 1,
          total_score: milestonePercent >= 75 ? 2 : 1
        }
      },
      enriched_properties: {
        ...properties,
        deep_engagement: milestonePercent >= 75,
        content_consumption: this.calculateContentConsumption(milestonePercent)
      }
    };
  }

  private processPageExit(event: AnalyticsEvent): ProcessedEvent {
    return {
      ...event,
      processed_data: {
        exit_insights: {
          exit_type: 'natural',
          session_completion: true,
          engagement_summary: this.summarizeEngagement(event)
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 0,
          multiplier: 1,
          total_score: 0
        }
      },
      enriched_properties: {
        ...event.properties,
        session_end: true
      }
    };
  }

  private processErrorEncounter(event: AnalyticsEvent): ProcessedEvent {
    return {
      ...event,
      processed_data: {
        error_insights: {
          error_type: event.properties.error_type,
          impact_level: this.assessErrorImpact(event.properties.error_type),
          user_experience_degradation: true
        },
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: -2,
          multiplier: 1,
          total_score: -2
        }
      },
      enriched_properties: {
        ...event.properties,
        negative_experience: true,
        requires_follow_up: true
      }
    };
  }

  private processDefault(event: AnalyticsEvent): ProcessedEvent {
    return {
      ...event,
      processed_data: {
        default_processing: true,
        engagement_indicators: this.getEngagementIndicators(event),
        lead_scoring: {
          base_score: 1,
          multiplier: 1,
          total_score: 1
        }
      },
      enriched_properties: event.properties
    };
  }

  // Helper methods
  private categorizePageType(path: string): string {
    if (path === '/') return 'home';
    if (path.startsWith('/products/')) return 'product';
    if (path === '/quiz') return 'quiz';
    if (path.startsWith('/blog/')) return 'blog';
    if (path === '/contact') return 'contact';
    if (path === '/demo') return 'demo';
    return 'other';
  }

  private categorizePriceRange(price?: string): string {
    if (!price) return 'unknown';
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    
    if (numericPrice < 1000) return 'budget';
    if (numericPrice < 5000) return 'mid-range';
    return 'premium';
  }

  private getProductValueTier(price?: string): string {
    const range = this.categorizePriceRange(price);
    const tierMap: Record<string, string> = {
      'budget': 'entry',
      'mid-range': 'professional',
      'premium': 'enterprise'
    };
    return tierMap[range] || 'unknown';
  }

  private calculateQuizProgress(step?: any): number {
    if (typeof step !== 'number') return 0;
    return Math.min(100, (step / 10) * 100); // Assuming 10 total steps
  }

  private calculateQuizEngagement(properties: EventProperties): string {
    const progress = this.calculateQuizProgress(properties.quiz_step);
    if (progress > 75) return 'high';
    if (progress > 25) return 'medium';
    return 'low';
  }

  private categorizeFormType(formId: string): string {
    if (formId.includes('contact')) return 'contact';
    if (formId.includes('demo')) return 'demo';
    if (formId.includes('quote')) return 'quote';
    if (formId.includes('newsletter')) return 'newsletter';
    return 'other';
  }

  private calculateContentEngagement(duration: number): string {
    if (duration > 180000) return 'high'; // 3 minutes
    if (duration > 60000) return 'medium'; // 1 minute
    return 'low';
  }

  private assessContentValue(contentType?: string): string {
    if (!contentType) return 'unknown';
    
    const highValueTypes = ['whitepaper', 'guide', 'case_study'];
    const mediumValueTypes = ['blog', 'video', 'infographic'];
    
    if (highValueTypes.includes(contentType)) return 'high';
    if (mediumValueTypes.includes(contentType)) return 'medium';
    return 'low';
  }

  private analyzeSearchIntent(query?: string): string {
    if (!query) return 'unknown';
    
    const commercialKeywords = ['price', 'buy', 'cost', 'purchase', 'order'];
    const informationalKeywords = ['how', 'what', 'guide', 'tutorial'];
    
    const lowerQuery = query.toLowerCase();
    
    if (commercialKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return 'commercial';
    }
    
    if (informationalKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return 'informational';
    }
    
    return 'navigational';
  }

  private calculateFilterComplexity(filters?: any): number {
    if (!filters) return 0;
    
    if (typeof filters === 'string') {
      return filters.split(',').length;
    }
    
    if (Array.isArray(filters)) {
      return filters.length;
    }
    
    if (typeof filters === 'object') {
      return Object.keys(filters).length;
    }
    
    return 0;
  }

  private categorizeDownloadType(downloadType?: string): string {
    if (!downloadType) return 'unknown';
    
    const lowerType = downloadType.toLowerCase();
    
    if (lowerType.includes('spec') || lowerType.includes('datasheet')) return 'spec_sheet';
    if (lowerType.includes('brochure') || lowerType.includes('catalog')) return 'brochure';
    if (lowerType.includes('guide') || lowerType.includes('manual')) return 'guide';
    if (lowerType.includes('whitepaper') || lowerType.includes('report')) return 'whitepaper';
    
    return 'other';
  }

  private assessDownloadValue(downloadType: string): string {
    const highValueTypes = ['spec_sheet', 'whitepaper', 'guide'];
    const mediumValueTypes = ['brochure', 'catalog'];
    
    if (highValueTypes.includes(downloadType)) return 'high';
    if (mediumValueTypes.includes(downloadType)) return 'medium';
    return 'low';
  }

  private determineConversionStage(conversionType?: string): string {
    if (!conversionType) return 'unknown';
    
    const lowerType = conversionType.toLowerCase();
    
    if (lowerType.includes('purchase') || lowerType.includes('order')) return 'purchase';
    if (lowerType.includes('demo') || lowerType.includes('trial')) return 'trial';
    if (lowerType.includes('quote') || lowerType.includes('inquiry')) return 'inquiry';
    if (lowerType.includes('signup') || lowerType.includes('register')) return 'signup';
    
    return 'other';
  }

  private assessClickImportance(elementId?: string, elementClass?: string): string {
    const element = `${elementId || ''} ${elementClass || ''}`.toLowerCase();
    
    if (element.includes('cta') || element.includes('button-primary')) return 'high';
    if (element.includes('nav') || element.includes('menu')) return 'medium';
    return 'low';
  }

  private isCTAClick(elementId?: string, elementClass?: string): boolean {
    const element = `${elementId || ''} ${elementClass || ''}`.toLowerCase();
    return element.includes('cta') || element.includes('button-primary') || element.includes('get-quote');
  }

  private categorizeClickedElement(elementId?: string, elementClass?: string): string {
    const element = `${elementId || ''} ${elementClass || ''}`.toLowerCase();
    
    if (element.includes('button')) return 'button';
    if (element.includes('link')) return 'link';
    if (element.includes('nav')) return 'navigation';
    if (element.includes('form')) return 'form';
    return 'other';
  }

  private assessInteractionQuality(properties: EventProperties): string {
    const x = properties.x_position || 0;
    const y = properties.y_position || 0;
    
    // Simple quality assessment based on click position
    if (x > 0 && y > 0) return 'intentional';
    return 'unknown';
  }

  private calculateScrollEngagement(milestonePercent: number): string {
    if (milestonePercent >= 90) return 'high';
    if (milestonePercent >= 50) return 'medium';
    return 'low';
  }

  private calculateContentConsumption(milestonePercent: number): string {
    if (milestonePercent >= 90) return 'complete';
    if (milestonePercent >= 50) return 'partial';
    return 'minimal';
  }

  private summarizeEngagement(_event: AnalyticsEvent): string {
    // Simple engagement summary
    return 'session_completed';
  }

  private assessErrorImpact(errorType?: string): string {
    if (!errorType) return 'unknown';
    
    const lowerError = errorType.toLowerCase();
    
    if (lowerError.includes('404') || lowerError.includes('not found')) return 'high';
    if (lowerError.includes('timeout') || lowerError.includes('slow')) return 'medium';
    return 'low';
  }

  private getEngagementIndicators(event: AnalyticsEvent): any {
    return {
      timestamp: event.timestamp,
      session_id: event.session_id,
      user_id: event.user_id,
      page_context: event.properties.page_path
    };
  }

  private calculateTimeSpent(_event: AnalyticsEvent): number {
    // Placeholder for time calculation
    return 0;
  }

  // Public API for custom processors
  public registerProcessor(eventType: EventType, processor: EventProcessorFunction): void {
    this.processors.set(eventType, processor);
  }

  public getProcessors(): Map<EventType, EventProcessorFunction> {
    return new Map(this.processors);
  }
}

// Types
type EventProcessorFunction = (event: AnalyticsEvent) => ProcessedEvent;

interface ProcessedEvent extends AnalyticsEvent {
  processed_data: any;
  enriched_properties: EventProperties;
}

export type { ProcessedEvent, EventProcessorFunction };