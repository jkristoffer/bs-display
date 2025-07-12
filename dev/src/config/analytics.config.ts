// Server-side only function to decode base64
function decodeServiceAccountKey() {
  if (typeof window !== 'undefined') {
    // Running in browser, return null
    return null;
  }
  
  const encodedKey = import.meta.env.GA4_SERVICE_ACCOUNT_KEY;
  if (!encodedKey) return null;
  
  try {
    // In Node.js context, we can use Buffer
    const decoded = Buffer.from(encodedKey, 'base64').toString();
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode service account key:', error);
    return null;
  }
}

export const GA4_CONFIG = {
  propertyId: import.meta.env.GA4_PROPERTY_ID,
  serviceAccountKey: decodeServiceAccountKey(),
  defaultDateRange: {
    startDate: '7daysAgo',
    endDate: 'today'
  },
  cacheTTL: 300000 // 5 minutes
};

export const GA4_METRICS = {
  overview: [
    'totalUsers',
    'newUsers',
    'sessions',
    'screenPageViews',
    'averageSessionDuration',
    'bounceRate',
    'conversions'
  ],
  realtime: [
    'activeUsers'
  ],
  products: [
    'itemsViewed',
    'itemsAddedToCart',
    'itemsPurchased',
    'itemRevenue'
  ]
};

export const GA4_DIMENSIONS = {
  common: [
    'date',
    'sessionDefaultChannelGroup',
    'deviceCategory'
  ],
  pages: [
    'pagePath',
    'pageTitle'
  ],
  products: [
    'itemName',
    'itemBrand',
    'itemCategory'
  ]
};