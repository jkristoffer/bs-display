import type { APIRoute } from 'astro';
import { createAPIResponse, handleAPIError } from '@utils/api/apiHelpers';

export const prerender = false;

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
  const exportDate = new Date().toISOString();
  
  switch (type) {
    case 'products':
      return {
        exportDate,
        period,
        type: 'Product Analytics Export',
        data: {
          summary: {
            totalProducts: 45,
            totalViews: 125430,
            totalConversions: 2341,
            avgConversionRate: 1.87,
          },
          products: [
            { 
              name: 'ViewSonic IFP7550-3', 
              brand: 'ViewSonic',
              category: 'smartboards',
              views: 5432, 
              uniqueViews: 3210,
              conversions: 123,
              conversionRate: 2.26,
              revenue: 429777,
            },
            { 
              name: 'SMART Board MX Series', 
              brand: 'SMART',
              category: 'smartboards',
              views: 4321, 
              uniqueViews: 2543,
              conversions: 98,
              conversionRate: 2.27,
              revenue: 293902,
            },
            { 
              name: 'Promethean ActivPanel 9', 
              brand: 'Promethean',
              category: 'smartboards',
              views: 3210, 
              uniqueViews: 1987,
              conversions: 76,
              conversionRate: 2.37,
              revenue: 250724,
            },
          ],
        },
      };
      
    case 'visitors':
      return {
        exportDate,
        period,
        type: 'Visitor Analytics Export',
        data: {
          summary: {
            totalVisitors: 15234,
            uniqueVisitors: 8921,
            avgSessionDuration: 245,
            bounceRate: 42.3,
          },
          dailyStats: generateDailyVisitorStats(period),
        },
      };
      
    case 'journeys':
      return {
        exportDate,
        period,
        type: 'Customer Journey Export',
        data: {
          funnelConversion: {
            awareness: 10000,
            interest: 6000,
            consideration: 3000,
            decision: 900,
            customer: 300,
          },
          topPaths: [
            { path: 'Home → Products → Quiz → Quote', count: 450, conversionRate: 12.5 },
            { path: 'Home → Products → Product Page → Quote', count: 380, conversionRate: 10.2 },
          ],
          avgJourneyDuration: '3.5 days',
        },
      };
      
    default:
      return {
        exportDate,
        period,
        type: 'Overview Analytics Export',
        data: {
          summary: {
            totalVisitors: 15234,
            pageViews: 45678,
            conversions: 456,
            conversionRate: 2.99,
            avgSessionDuration: 245,
            bounceRate: 42.3,
          },
          topPages: [
            { page: '/', views: 12345, avgTime: 45 },
            { page: '/products', views: 8765, avgTime: 120 },
            { page: '/quiz', views: 3210, avgTime: 300 },
          ],
          devices: {
            desktop: 65,
            mobile: 30,
            tablet: 5,
          },
        },
      };
  }
}

function generateDailyVisitorStats(period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const stats = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    stats.push({
      date: date.toISOString().split('T')[0],
      visitors: Math.floor(Math.random() * 500) + 300,
      uniqueVisitors: Math.floor(Math.random() * 300) + 200,
      pageViews: Math.floor(Math.random() * 1500) + 1000,
      avgSessionDuration: Math.floor(Math.random() * 120) + 180,
      bounceRate: (Math.random() * 20 + 35).toFixed(1),
    });
  }
  
  return stats;
}

function convertToCSV(data: any): string {
  // Simple CSV conversion for export data
  const lines = ['Analytics Export'];
  lines.push(`Export Date: ${data.exportDate}`);
  lines.push(`Period: ${data.period}`);
  lines.push(`Type: ${data.type}`);
  lines.push('');
  
  if (data.data.summary) {
    lines.push('Summary');
    Object.entries(data.data.summary).forEach(([key, value]) => {
      lines.push(`${key},${value}`);
    });
    lines.push('');
  }
  
  if (data.data.products) {
    lines.push('Product,Brand,Category,Views,Unique Views,Conversions,Conversion Rate,Revenue');
    data.data.products.forEach((p: any) => {
      lines.push(`"${p.name}","${p.brand}","${p.category}",${p.views},${p.uniqueViews},${p.conversions},${p.conversionRate}%,$${p.revenue}`);
    });
  }
  
  if (data.data.dailyStats) {
    lines.push('Date,Visitors,Unique Visitors,Page Views,Avg Session Duration,Bounce Rate');
    data.data.dailyStats.forEach((s: any) => {
      lines.push(`${s.date},${s.visitors},${s.uniqueVisitors},${s.pageViews},${s.avgSessionDuration}s,${s.bounceRate}%`);
    });
  }
  
  if (data.data.topPages) {
    lines.push('Page,Views,Avg Time');
    data.data.topPages.forEach((p: any) => {
      lines.push(`"${p.page}",${p.views},${p.avgTime}s`);
    });
  }
  
  return lines.join('\n');
}