#!/usr/bin/env node

/**
 * Test Vercel KV and Edge Config connections
 * Run: node scripts/test-vercel-storage.js
 */

import { config } from 'dotenv';
import { Redis } from '@upstash/redis';
import { get } from '@vercel/edge-config';

// Load environment variables
config({ path: '.env.local' });

async function testRedis() {
  console.log('🧪 Testing Upstash Redis...');
  
  try {
    // Initialize Redis client
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    
    // Test write
    const testKey = `test:${Date.now()}`;
    const testValue = { message: 'Hello from Redis!', timestamp: Date.now() };
    
    await redis.set(testKey, JSON.stringify(testValue), { ex: 60 }); // Expire in 60 seconds
    console.log('✅ Redis Write successful');
    
    // Test read
    const retrieved = await redis.get(testKey);
    console.log('✅ Redis Read successful:', retrieved);
    
    // Test delete
    await redis.del(testKey);
    console.log('✅ Redis Delete successful');
    
    // Test analytics-specific operations
    const analyticsKey = 'analytics:test:5min:' + Date.now();
    await redis.setex(analyticsKey, 300, JSON.stringify({ count: 1, type: 'test' }));
    console.log('✅ Analytics-style write successful');
    
    // List keys
    const keys = await redis.keys('analytics:test:*');
    console.log('✅ Found', keys.length, 'test keys');
    
    // Cleanup
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log('✅ Cleanup successful');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Redis Error:', error.message);
    console.log('Make sure Redis environment variables are set:');
    console.log('- KV_REST_API_URL');
    console.log('- KV_REST_API_TOKEN');
    return false;
  }
}

async function testEdgeConfig() {
  console.log('\n🧪 Testing Vercel Edge Config...');
  
  try {
    // Try to read a value
    const dashboardSummary = await get('dashboard_summary');
    
    if (dashboardSummary) {
      console.log('✅ Edge Config read successful');
      console.log('📊 Dashboard data found:', {
        generated: new Date(dashboardSummary.generated).toISOString(),
        hasData: !!dashboardSummary.overview
      });
    } else {
      console.log('⚠️  Edge Config connected but no data found');
      console.log('Run initialization to add default data');
    }
    
    // Test reading non-existent key
    const missing = await get('non_existent_key');
    console.log('✅ Handled missing key correctly:', missing === undefined);
    
    return true;
  } catch (error) {
    console.error('❌ Edge Config Error:', error.message);
    console.log('Make sure EDGE_CONFIG environment variable is set');
    return false;
  }
}

async function testAll() {
  console.log('🚀 Vercel Storage Connection Test\n');
  
  // Check environment
  const hasRedis = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  const hasEdgeConfig = !!process.env.EDGE_CONFIG;
  
  console.log('📋 Environment Check:');
  console.log(`- Upstash Redis: ${hasRedis ? '✅' : '❌'}`);
  console.log(`- Edge Config: ${hasEdgeConfig ? '✅' : '❌'}`);
  
  if (!hasRedis && !hasEdgeConfig) {
    console.log('\n❌ No storage configuration found!');
    console.log('Run: vercel env pull .env.local');
    console.log('Then: source .env.local');
    process.exit(1);
  }
  
  // Run tests
  const redisSuccess = hasRedis ? await testRedis() : false;
  const edgeConfigSuccess = hasEdgeConfig ? await testEdgeConfig() : false;
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`- Upstash Redis: ${redisSuccess ? '✅ Working' : '❌ Failed'}`);
  console.log(`- Edge Config: ${edgeConfigSuccess ? '✅ Working' : '❌ Failed'}`);
  
  if (redisSuccess && edgeConfigSuccess) {
    console.log('\n✨ All storage systems are working correctly!');
    console.log('Your analytics system is ready to use.');
  } else {
    console.log('\n⚠️  Some storage systems need attention.');
    console.log('Check the error messages above for details.');
    process.exit(1);
  }
}

// Run tests
testAll().catch(console.error);