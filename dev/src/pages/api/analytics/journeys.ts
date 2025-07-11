import type { APIRoute } from 'astro';
import { createAPIResponse, handleAPIError } from '@utils/api/apiHelpers';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const journeyId = url.searchParams.get('id');
    
    if (journeyId) {
      // Return specific journey details
      const journey = {
        id: journeyId,
        userId: `user_${journeyId}`,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        currentStage: 'consideration',
        leadScore: 75,
        totalPageViews: 23,
        totalDuration: '14m 32s',
        device: 'desktop',
        source: 'Google',
        events: [
          { 
            type: 'page_view', 
            page: '/', 
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 45
          },
          { 
            type: 'page_view', 
            page: '/products', 
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 120000).toISOString(),
            duration: 120
          },
          { 
            type: 'product_view', 
            product: 'ViewSonic IFP7550-3', 
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 300000).toISOString(),
            duration: 180
          },
          { 
            type: 'quiz_start', 
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 600000).toISOString() 
          },
          { 
            type: 'quiz_complete', 
            result: 'SMART Board MX Series', 
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 900000).toISOString() 
          },
          { 
            type: 'form_view', 
            form: 'quote', 
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 1200000).toISOString() 
          },
        ],
      };
      
      return new Response(JSON.stringify(createAPIResponse(journey)), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Return journey analytics summary
    const data = {
      funnel: {
        stages: [
          { name: 'Awareness', count: 10000, percentage: 100, avgDuration: '2m 15s' },
          { name: 'Interest', count: 6000, percentage: 60, avgDuration: '5m 42s' },
          { name: 'Consideration', count: 3000, percentage: 30, avgDuration: '12m 18s' },
          { name: 'Decision', count: 900, percentage: 9, avgDuration: '8m 35s' },
          { name: 'Customer', count: 300, percentage: 3, avgDuration: '4m 12s' },
        ],
      },
      avgJourneyDuration: {
        overall: '3.5 days',
        byStage: {
          'awareness_to_interest': '2.1 hours',
          'interest_to_consideration': '1.5 days',
          'consideration_to_decision': '2.2 days',
          'decision_to_customer': '4.5 hours',
        },
      },
      topPaths: [
        {
          path: 'Home → Products → Quiz → Quote',
          count: 450,
          conversionRate: 12.5,
          avgDuration: '18m 30s',
        },
        {
          path: 'Home → Products → Product Page → Quote',
          count: 380,
          conversionRate: 10.2,
          avgDuration: '15m 45s',
        },
        {
          path: 'Blog → Products → Quiz → Quote',
          count: 220,
          conversionRate: 8.7,
          avgDuration: '22m 15s',
        },
        {
          path: 'Direct → Quiz → Products → Quote',
          count: 180,
          conversionRate: 15.3,
          avgDuration: '12m 20s',
        },
      ],
      dropOffPoints: [
        { 
          page: '/products', 
          dropOffRate: 35, 
          reason: 'Page complexity',
          avgTimeBeforeDrop: '2m 15s',
          suggestions: ['Simplify product grid', 'Add quick filters']
        },
        { 
          page: '/quiz', 
          dropOffRate: 25, 
          reason: 'Quiz length',
          avgTimeBeforeDrop: '3m 45s',
          suggestions: ['Reduce questions', 'Add progress indicator']
        },
        { 
          page: '/contact', 
          dropOffRate: 20, 
          reason: 'Form fields',
          avgTimeBeforeDrop: '1m 30s',
          suggestions: ['Reduce required fields', 'Add autofill']
        },
      ],
      leadScoring: {
        distribution: [
          { range: '0-25', count: 2500, percentage: 25 },
          { range: '26-50', count: 3500, percentage: 35 },
          { range: '51-75', count: 2800, percentage: 28 },
          { range: '76-100', count: 1200, percentage: 12 },
        ],
        avgScore: 52,
        highValueLeads: 1200,
        scoringFactors: [
          { factor: 'Page views', weight: 25, avgContribution: 12 },
          { factor: 'Quiz completion', weight: 30, avgContribution: 18 },
          { factor: 'Product views', weight: 20, avgContribution: 10 },
          { factor: 'Time on site', weight: 15, avgContribution: 8 },
          { factor: 'Return visits', weight: 10, avgContribution: 4 },
        ],
      },
      conversionProbability: {
        byScore: [
          { scoreRange: '0-25', probability: 0.5 },
          { scoreRange: '26-50', probability: 2.1 },
          { scoreRange: '51-75', probability: 8.7 },
          { scoreRange: '76-100', probability: 23.4 },
        ],
        byStage: [
          { stage: 'Awareness', probability: 0.3 },
          { stage: 'Interest', probability: 1.5 },
          { stage: 'Consideration', probability: 5.2 },
          { stage: 'Decision', probability: 33.3 },
        ],
      },
    };
    
    return new Response(JSON.stringify(createAPIResponse(data)), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (error) {
    return handleAPIError(error);
  }
};