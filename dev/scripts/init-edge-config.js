#!/usr/bin/env node

/**
 * Initialize Edge Config with default analytics data
 * Run this after setting up Edge Config: node scripts/init-edge-config.js
 */

async function initEdgeConfig() {
  // Check if we're in development
  if (!process.env.EDGE_CONFIG) {
    console.error('❌ EDGE_CONFIG environment variable not set');
    console.log('Run: vercel env pull .env.local');
    process.exit(1);
  }

  try {
    // Note: Edge Config updates require using the Vercel API
    // This is a placeholder for the actual implementation
    console.log('⚠️  Edge Config initialization requires using Vercel API');
    console.log('');
    console.log('To initialize Edge Config:');
    console.log('1. Go to Vercel Dashboard → Storage → Your Edge Config');
    console.log('2. Click "Edit" and add these items:');
    console.log('');
    console.log('Key: dashboard_summary');
    console.log('Value:');
    console.log(JSON.stringify({
      generated: Date.now(),
      period: '24h',
      overview: {
        totalVisitors: 0,
        pageViews: 0,
        conversions: 0,
        avgSessionDuration: 0
      },
      trends: {
        hourly: [],
        daily: []
      },
      topContent: [],
      sources: []
    }, null, 2));
    console.log('');
    console.log('Key: aggregation_status');
    console.log('Value:');
    console.log(JSON.stringify({
      lastRun: 0,
      duration: 0,
      success: false
    }, null, 2));
    console.log('');
    console.log('Or use the Vercel API:');
    console.log('curl -X PATCH https://api.vercel.com/v1/edge-config/[config-id]/items \\');
    console.log('  -H "Authorization: Bearer [token]" \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"items": [{"key": "dashboard_summary", "value": {...}}]}\'');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initEdgeConfig();
}