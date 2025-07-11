# Phase 3: API Endpoints

## Overview

This phase implements the server-side API endpoints that aggregate and serve analytics data to the dashboard components. We'll create efficient endpoints that leverage the existing analytics infrastructure while adding caching and data processing capabilities.

## Goals

- ✅ Create analytics data aggregation endpoints
- ✅ Implement efficient data processing
- ✅ Add caching for expensive queries
- ✅ Support real-time data streaming
- ✅ Ensure API security and rate limiting

## Implementation Steps

### Step 1: Create Base API Utilities

Create `/src/utils/api/apiHelpers.ts`:

```typescript
import type { APIRoute } from 'astro';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export function createAPIResponse<T>(
  data?: T,
  error?: string
): APIResponse<T> {
  return {
    success: !error,
    data,
    error,
    timestamp: Date.now(),
  };
}

export function handleAPIError(error: unknown): Response {
  console.error('API Error:', error);
  
  const message = error instanceof Error ? error.message : 'Internal server error';
  
  return new Response(
    JSON.stringify(createAPIResponse(null, message)),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Cache implementation for expensive queries
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Rate limiting
export class RateLimiter {
  private requests = new Map<string, number[]>();
  private limit: number;
  private window: number;

  constructor(limit: number = 100, windowMinutes: number = 1) {
    this.limit = limit;
    this.window = windowMinutes * 60 * 1000;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(
      timestamp => now - timestamp < this.window
    );
    
    if (validRequests.length >= this.limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
}
```

### Step 2: Create Analytics Overview Endpoint

Create `/src/pages/api/analytics/overview.ts`:

```typescript
import type { APIRoute } from 'astro';
import { createAPIResponse, handleAPIError, APICache } from '@/utils/api/apiHelpers';
import { MetricsCollector } from '@/utils/analytics/metrics/MetricsCollector';

const cache = new APICache(5); // 5-minute cache

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '7d';
    const cacheKey = `overview-${period}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(createAPIResponse(cached)), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
    }
    
    // Mock data for now (replace with actual data source)
    const data = {
      summary: {
        totalVisitors: 15234,
        uniqueVisitors: 8921,
        pageViews: 45678,
        avgSessionDuration: 245, // seconds
        bounceRate: 42.3,
        conversionRate: 3.2,
      },
      trends: {
        visitors: generateTrendData('visitors', 7),
        pageViews: generateTrendData('pageViews', 7),
        conversions: generateTrendData('conversions', 7),
      },
      topPages: [
        { path: '/', views: 12345, avgTime: 45 },
        { path: '/products', views: 8765, avgTime: 120 },
        { path: '/products/smartboards', views: 5432, avgTime: 180 },
        { path: '/quiz', views: 3210, avgTime: 300 },
        { path: '/blog', views: 2345, avgTime: 90 },
      ],
      topProducts: [
        { name: 'Interactive Display 75"', views: 2345, conversions: 45 },
        { name: 'Smart Board Pro', views: 1876, conversions: 32 },
        { name: 'Touch Screen 65"', views: 1543, conversions: 28 },
        { name: 'Digital Whiteboard', views: 1234, conversions: 21 },
      ],
      devices: {
        desktop: 65,
        mobile: 30,
        tablet: 5,
      },
      referrers: [
        { source: 'Google', visits: 5432, percentage: 35.6 },
        { source: 'Direct', visits: 4321, percentage: 28.3 },
        { source: 'LinkedIn', visits: 2345, percentage: 15.4 },
        { source: 'Facebook', visits: 1876, percentage: 12.3 },
        { source: 'Other', visits: 1260, percentage: 8.4 },
      ],
    };
    
    // Cache the result
    cache.set(cacheKey, data);
    
    return new Response(JSON.stringify(createAPIResponse(data)), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300', // 5-minute browser cache
      },
    });
  } catch (error) {
    return handleAPIError(error);
  }
};

// Helper function to generate trend data
function generateTrendData(metric: string, days: number) {
  const data = [];
  const baseValue = metric === 'visitors' ? 500 : metric === 'pageViews' ? 1500 : 50;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(baseValue + Math.random() * baseValue * 0.5),
    });
  }
  
  return data;
}
```

### Step 3: Create Real-time Analytics Endpoint

Create `/src/pages/api/analytics/realtime.ts`:

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const stream = new ReadableStream({
    start(controller) {
      // Send initial data
      controller.enqueue(
        `data: ${JSON.stringify({
          type: 'initial',
          activeUsers: 42,
          timestamp: Date.now(),
        })}\n\n`
      );

      // Simulate real-time updates
      const interval = setInterval(() => {
        const data = {
          type: 'update',
          activeUsers: 40 + Math.floor(Math.random() * 10),
          recentEvents: generateRecentEvents(),
          timestamp: Date.now(),
        };

        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      }, 5000); // Update every 5 seconds

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers });
};

function generateRecentEvents() {
  const events = [
    { type: 'page_view', page: '/products', user: 'User123', time: 'now' },
    { type: 'product_view', product: 'Smart Board Pro', user: 'User456', time: '2s ago' },
    { type: 'quiz_start', user: 'User789', time: '5s ago' },
    { type: 'form_submit', form: 'contact', user: 'User321', time: '10s ago' },
  ];

  return events.slice(0, Math.floor(Math.random() * 4) + 1);
}
```

### Step 4: Create Product Analytics Endpoint

Create `/src/pages/api/analytics/products.ts`:

```typescript
import type { APIRoute } from 'astro';
import { createAPIResponse, handleAPIError, APICache } from '@/utils/api/apiHelpers';
import productData from '@/data/models.all';

const cache = new APICache(10); // 10-minute cache for product data

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const brand = url.searchParams.get('brand');
    const period = url.searchParams.get('period') || '30d';
    
    const cacheKey = `products-${category}-${brand}-${period}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(createAPIResponse(cached)), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Get all products
    const allProducts = Object.values(productData).flat();
    
    // Filter by category/brand if specified
    let filteredProducts = allProducts;
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (brand) {
      filteredProducts = filteredProducts.filter(p => p.brand === brand);
    }
    
    // Generate analytics data for products
    const productAnalytics = filteredProducts.slice(0, 20).map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      metrics: {
        views: Math.floor(Math.random() * 5000) + 100,
        uniqueViews: Math.floor(Math.random() * 3000) + 50,
        addToQuote: Math.floor(Math.random() * 200) + 10,
        conversions: Math.floor(Math.random() * 50) + 1,
        conversionRate: (Math.random() * 10 + 1).toFixed(2),
        avgTimeOnPage: Math.floor(Math.random() * 300) + 30,
      },
      trends: {
        views: generateDailyTrend(7),
        conversions: generateDailyTrend(7),
      },
    }));
    
    // Calculate category summary
    const categorySummary = {};
    allProducts.forEach(product => {
      if (!categorySummary[product.category]) {
        categorySummary[product.category] = {
          totalProducts: 0,
          totalViews: 0,
          totalConversions: 0,
        };
      }
      categorySummary[product.category].totalProducts++;
      categorySummary[product.category].totalViews += Math.floor(Math.random() * 1000);
      categorySummary[product.category].totalConversions += Math.floor(Math.random() * 50);
    });
    
    const data = {
      products: productAnalytics,
      summary: {
        totalProducts: filteredProducts.length,
        totalViews: productAnalytics.reduce((sum, p) => sum + p.metrics.views, 0),
        totalConversions: productAnalytics.reduce((sum, p) => sum + p.metrics.conversions, 0),
        avgConversionRate: (
          productAnalytics.reduce((sum, p) => sum + parseFloat(p.metrics.conversionRate), 0) /
          productAnalytics.length
        ).toFixed(2),
      },
      categories: Object.entries(categorySummary).map(([name, data]) => ({
        name,
        ...data,
      })),
      topPerformers: productAnalytics
        .sort((a, b) => b.metrics.conversions - a.metrics.conversions)
        .slice(0, 5),
    };
    
    // Cache the result
    cache.set(cacheKey, data);
    
    return new Response(JSON.stringify(createAPIResponse(data)), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=600', // 10-minute browser cache
      },
    });
  } catch (error) {
    return handleAPIError(error);
  }
};

function generateDailyTrend(days: number) {
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100) + 20,
    });
  }
  return trend;
}
```

### Step 5: Create Customer Journey Endpoint

Create `/src/pages/api/analytics/journeys.ts`:

```typescript
import type { APIRoute } from 'astro';
import { createAPIResponse, handleAPIError } from '@/utils/api/apiHelpers';

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
        events: [
          { type: 'page_view', page: '/', timestamp: '2024-01-15T10:00:00Z' },
          { type: 'page_view', page: '/products', timestamp: '2024-01-15T10:02:00Z' },
          { type: 'product_view', product: 'Smart Board Pro', timestamp: '2024-01-15T10:05:00Z' },
          { type: 'quiz_start', timestamp: '2024-01-15T10:10:00Z' },
          { type: 'quiz_complete', result: 'Smart Board Pro', timestamp: '2024-01-15T10:15:00Z' },
          { type: 'form_view', form: 'quote', timestamp: '2024-01-15T10:20:00Z' },
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
          { name: 'Awareness', count: 10000, percentage: 100 },
          { name: 'Interest', count: 6000, percentage: 60 },
          { name: 'Consideration', count: 3000, percentage: 30 },
          { name: 'Decision', count: 900, percentage: 9 },
          { name: 'Customer', count: 300, percentage: 3 },
        ],
      },
      avgJourneyDuration: {
        overall: '3.5 days',
        byStage: {
          'awareness_to_interest': '2 hours',
          'interest_to_consideration': '1.5 days',
          'consideration_to_decision': '2 days',
          'decision_to_customer': '4 hours',
        },
      },
      topPaths: [
        {
          path: 'Home → Products → Quiz → Quote',
          count: 450,
          conversionRate: 12.5,
        },
        {
          path: 'Home → Products → Product Page → Quote',
          count: 380,
          conversionRate: 10.2,
        },
        {
          path: 'Blog → Products → Quiz → Quote',
          count: 220,
          conversionRate: 8.7,
        },
      ],
      dropOffPoints: [
        { page: '/products', dropOffRate: 35, reason: 'Page complexity' },
        { page: '/quiz', dropOffRate: 25, reason: 'Quiz length' },
        { page: '/contact', dropOffRate: 20, reason: 'Form fields' },
      ],
      leadScoring: {
        distribution: [
          { range: '0-25', count: 2500 },
          { range: '26-50', count: 3500 },
          { range: '51-75', count: 2800 },
          { range: '76-100', count: 1200 },
        ],
        avgScore: 52,
        highValueLeads: 1200,
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
```

### Step 6: Create Data Export Endpoint

Create `/src/pages/api/analytics/export.ts`:

```typescript
import type { APIRoute } from 'astro';
import { createAPIResponse, handleAPIError } from '@/utils/api/apiHelpers';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'json';
    const dataType = url.searchParams.get('type') || 'overview';
    const period = url.searchParams.get('period') || '7d';
    
    // Generate export data based on type
    const data = await generateExportData(dataType, period);
    
    switch (format) {
      case 'csv':
        return new Response(convertToCSV(data), {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="analytics-${dataType}-${period}.csv"`,
          },
        });
        
      case 'json':
      default:
        return new Response(JSON.stringify(data, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="analytics-${dataType}-${period}.json"`,
          },
        });
    }
  } catch (error) {
    return handleAPIError(error);
  }
};

async function generateExportData(type: string, period: string) {
  // This would fetch real data from your analytics store
  // For now, returning mock data
  switch (type) {
    case 'products':
      return {
        exportDate: new Date().toISOString(),
        period,
        products: [
          { name: 'Smart Board Pro', views: 5432, conversions: 123 },
          { name: 'Interactive Display', views: 4321, conversions: 98 },
        ],
      };
      
    case 'visitors':
      return {
        exportDate: new Date().toISOString(),
        period,
        visitors: [
          { date: '2024-01-15', unique: 1234, total: 2345 },
          { date: '2024-01-16', unique: 1345, total: 2567 },
        ],
      };
      
    default:
      return {
        exportDate: new Date().toISOString(),
        period,
        summary: {
          totalVisitors: 15234,
          pageViews: 45678,
          conversions: 456,
        },
      };
  }
}

function convertToCSV(data: any): string {
  // Simple CSV conversion
  if (data.products) {
    const headers = 'Name,Views,Conversions\n';
    const rows = data.products
      .map((p: any) => `"${p.name}",${p.views},${p.conversions}`)
      .join('\n');
    return headers + rows;
  }
  
  // Add more CSV conversion logic as needed
  return JSON.stringify(data);
}
```

## API Documentation

### Endpoints Overview

| Endpoint | Method | Description | Cache |
|----------|--------|-------------|-------|
| `/api/analytics/overview` | GET | Dashboard summary metrics | 5 min |
| `/api/analytics/realtime` | GET (SSE) | Real-time visitor stream | None |
| `/api/analytics/products` | GET | Product performance data | 10 min |
| `/api/analytics/journeys` | GET | Customer journey analytics | 5 min |
| `/api/analytics/export` | GET | Export data in various formats | None |

### Query Parameters

**Common Parameters:**
- `period`: Time range (24h, 7d, 30d, 90d)
- `format`: Response format (json, csv)

**Product-specific:**
- `category`: Filter by product category
- `brand`: Filter by brand

**Export-specific:**
- `type`: Data type to export (overview, products, visitors)

## Security Considerations

1. **Authentication**: All endpoints are protected by middleware
2. **Rate Limiting**: Implement per-IP rate limits
3. **Input Validation**: Sanitize all query parameters
4. **CORS**: Restrict to same origin
5. **Data Privacy**: No PII in responses

## Performance Optimization

1. **Caching Strategy**:
   - Overview: 5-minute cache
   - Products: 10-minute cache
   - Journeys: 5-minute cache
   - Real-time: No cache

2. **Database Queries**:
   - Use indexes for common queries
   - Aggregate data in background jobs
   - Limit result sets

3. **Response Optimization**:
   - Gzip compression
   - Pagination for large datasets
   - Field selection

## Next Steps

With APIs ready:
1. Proceed to [Phase 4: Dashboard Pages](./phase-4-dashboard-pages.md)
2. Connect frontend components to APIs
3. Implement real-time updates
4. Add error handling and retry logic

## Testing the APIs

```bash
# Test overview endpoint
curl http://localhost:4321/api/analytics/overview?period=7d

# Test real-time stream
curl http://localhost:4321/api/analytics/realtime

# Test product analytics
curl http://localhost:4321/api/analytics/products?category=smartboards

# Test export
curl http://localhost:4321/api/analytics/export?format=csv&type=products
```