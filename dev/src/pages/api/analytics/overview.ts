import type { APIRoute } from 'astro';
import { createAPIResponse, handleAPIError, APICache } from '@utils/api/apiHelpers';

const cache = new APICache(5); // 5-minute cache

export const prerender = false; // This is an API route, not static

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
    
    // Generate mock data with some randomness for realism
    const baseVisitors = 15000;
    const randomFactor = () => 0.8 + Math.random() * 0.4; // 80% to 120%
    
    const data = {
      summary: {
        totalVisitors: Math.floor(baseVisitors * randomFactor()),
        uniqueVisitors: Math.floor(baseVisitors * 0.6 * randomFactor()),
        pageViews: Math.floor(baseVisitors * 3 * randomFactor()),
        avgSessionDuration: Math.floor(180 + Math.random() * 120), // 3-5 minutes
        bounceRate: parseFloat((35 + Math.random() * 20).toFixed(1)),
        conversionRate: parseFloat((2 + Math.random() * 3).toFixed(1)),
      },
      trends: {
        visitors: generateTrendData('visitors', 7),
        pageViews: generateTrendData('pageViews', 7),
        conversions: generateTrendData('conversions', 7),
      },
      topPages: [
        { path: '/', views: Math.floor(12000 + Math.random() * 2000), avgTime: 45, bounceRate: 35.2 },
        { path: '/products', views: Math.floor(8000 + Math.random() * 1000), avgTime: 120, bounceRate: 42.1 },
        { path: '/products/smartboards', views: Math.floor(5000 + Math.random() * 1000), avgTime: 180, bounceRate: 28.5 },
        { path: '/quiz', views: Math.floor(3000 + Math.random() * 500), avgTime: 300, bounceRate: 15.3 },
        { path: '/blog', views: Math.floor(2000 + Math.random() * 500), avgTime: 90, bounceRate: 55.7 },
      ],
      topProducts: [
        { name: 'ViewSonic IFP7550-3', views: Math.floor(2000 + Math.random() * 500), conversions: Math.floor(40 + Math.random() * 10) },
        { name: 'SMART Board MX', views: Math.floor(1800 + Math.random() * 300), conversions: Math.floor(30 + Math.random() * 10) },
        { name: 'Promethean ActivPanel', views: Math.floor(1500 + Math.random() * 300), conversions: Math.floor(25 + Math.random() * 10) },
        { name: 'Newline Interactive', views: Math.floor(1200 + Math.random() * 300), conversions: Math.floor(20 + Math.random() * 10) },
      ],
      devices: {
        desktop: 65,
        mobile: 30,
        tablet: 5,
      },
      referrers: [
        { source: 'Google', visits: Math.floor(5000 + Math.random() * 1000), percentage: 35.6 },
        { source: 'Direct', visits: Math.floor(4000 + Math.random() * 500), percentage: 28.3 },
        { source: 'LinkedIn', visits: Math.floor(2000 + Math.random() * 500), percentage: 15.4 },
        { source: 'Facebook', visits: Math.floor(1500 + Math.random() * 500), percentage: 12.3 },
        { source: 'Other', visits: Math.floor(1000 + Math.random() * 300), percentage: 8.4 },
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
    
    // Add some realistic variation
    const dayOfWeek = date.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;
    const randomVariation = 0.8 + Math.random() * 0.4; // 80% to 120%
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(baseValue * weekendFactor * randomVariation),
    });
  }
  
  return data;
}