import type { APIRoute } from 'astro';
import { createAPIResponse, handleAPIError, APICache } from '@utils/api/apiHelpers';

const cache = new APICache(10); // 10-minute cache for product data

export const prerender = false;

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
    
    // Mock product data - in real implementation, this would come from your analytics database
    const mockProducts = [
      { id: '1', name: 'ViewSonic IFP7550-3', brand: 'ViewSonic', category: 'smartboards', price: 3499 },
      { id: '2', name: 'SMART Board MX Series', brand: 'SMART', category: 'smartboards', price: 2999 },
      { id: '3', name: 'Promethean ActivPanel 9', brand: 'Promethean', category: 'smartboards', price: 3299 },
      { id: '4', name: 'Newline Interactive Z Series', brand: 'Newline', category: 'smartboards', price: 2799 },
      { id: '5', name: 'BenQ Board Pro', brand: 'BenQ', category: 'smartboards', price: 2599 },
      { id: '6', name: 'Logitech Spotlight', brand: 'Logitech', category: 'accessories', price: 129 },
      { id: '7', name: 'IPEVO V4K Document Camera', brand: 'IPEVO', category: 'accessories', price: 99 },
      { id: '8', name: 'Smart Podium SP524', brand: 'SMART', category: 'lecterns', price: 4999 },
      { id: '9', name: 'AmpliVox Multimedia Lectern', brand: 'AmpliVox', category: 'lecterns', price: 2499 },
    ];
    
    // Filter by category/brand if specified
    let filteredProducts = mockProducts;
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (brand) {
      filteredProducts = filteredProducts.filter(p => p.brand === brand);
    }
    
    // Generate analytics data for products
    const productAnalytics = filteredProducts.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      metrics: {
        views: Math.floor(Math.random() * 5000) + 1000,
        uniqueViews: Math.floor(Math.random() * 3000) + 500,
        addToQuote: Math.floor(Math.random() * 200) + 20,
        conversions: Math.floor(Math.random() * 50) + 5,
        conversionRate: (Math.random() * 5 + 1).toFixed(2),
        avgTimeOnPage: Math.floor(Math.random() * 180) + 60,
        revenue: product.price * (Math.floor(Math.random() * 50) + 5),
      },
      trends: {
        views: generateDailyTrend(7),
        conversions: generateDailyTrend(7),
      },
    }));
    
    // Calculate category summary
    const categorySummary: Record<string, any> = {};
    mockProducts.forEach(product => {
      if (!categorySummary[product.category]) {
        categorySummary[product.category] = {
          category: product.category,
          totalProducts: 0,
          totalViews: 0,
          totalConversions: 0,
          totalRevenue: 0,
        };
      }
      categorySummary[product.category].totalProducts++;
      categorySummary[product.category].totalViews += Math.floor(Math.random() * 10000);
      categorySummary[product.category].totalConversions += Math.floor(Math.random() * 100);
      categorySummary[product.category].totalRevenue += product.price * Math.floor(Math.random() * 50);
    });
    
    const data = {
      products: productAnalytics,
      summary: {
        totalProducts: filteredProducts.length,
        totalViews: productAnalytics.reduce((sum, p) => sum + p.metrics.views, 0),
        totalConversions: productAnalytics.reduce((sum, p) => sum + p.metrics.conversions, 0),
        totalRevenue: productAnalytics.reduce((sum, p) => sum + p.metrics.revenue, 0),
        avgConversionRate: (
          productAnalytics.reduce((sum, p) => sum + parseFloat(p.metrics.conversionRate), 0) /
          productAnalytics.length
        ).toFixed(2),
      },
      categories: Object.values(categorySummary),
      topPerformers: productAnalytics
        .sort((a, b) => b.metrics.conversions - a.metrics.conversions)
        .slice(0, 5),
      brands: {
        ViewSonic: { products: 1, views: 12543, conversions: 234 },
        SMART: { products: 2, views: 10234, conversions: 189 },
        Promethean: { products: 1, views: 8932, conversions: 156 },
        Newline: { products: 1, views: 6234, conversions: 98 },
        BenQ: { products: 1, views: 5123, conversions: 87 },
      },
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
  let previousValue = Math.floor(Math.random() * 100) + 50;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some realistic variation
    const change = (Math.random() - 0.5) * 20;
    previousValue = Math.max(10, previousValue + change);
    
    trend.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(previousValue),
    });
  }
  return trend;
}