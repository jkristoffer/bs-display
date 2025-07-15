import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';
import LZString from 'lz-string';
import { ANALYTICS_CONFIG } from '@config/analytics-storage.config';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Read compressed data
    const compressed = await request.text();
    
    // Decompress
    const decompressed = LZString.decompress(compressed);
    if (!decompressed) {
      return new Response(JSON.stringify({ error: 'Invalid data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const payload = JSON.parse(decompressed);
    const { sessionId, timestamp, rawEvents, aggregates } = payload;
    
    // Process in parallel for performance
    const promises = [];
    
    // Store raw events with TTL (only high-value events)
    if (rawEvents && rawEvents.length > 0) {
      const key = `${ANALYTICS_CONFIG.kvKeys.rawEvents}${timestamp}`;
      promises.push(
        kv.setex(key, ANALYTICS_CONFIG.ttl.rawEvents, rawEvents)
      );
    }
    
    // Store pre-aggregated data
    if (aggregates && aggregates.length > 0) {
      for (const aggregate of aggregates) {
        const key = `${ANALYTICS_CONFIG.kvKeys.aggregates.fiveMin}${aggregate.key}`;
        
        // Merge with existing aggregate if it exists
        promises.push(
          mergeAggregate(key, aggregate, ANALYTICS_CONFIG.ttl.fiveMinAggregates)
        );
      }
    }
    
    // Update session activity
    promises.push(
      kv.setex(
        `session:${sessionId}`,
        3600, // 1 hour TTL
        { lastActivity: timestamp, eventCount: rawEvents?.length || 0 }
      )
    );
    
    // Execute all operations
    await Promise.all(promises);
    
    // Return minimal response for efficiency
    return new Response('ok', { status: 200 });
    
  } catch (error) {
    console.error('Analytics ingest error:', error);
    // Still return 200 to prevent client retries
    return new Response('error', { status: 200 });
  }
};

async function mergeAggregate(key: string, newData: any, ttl: number) {
  try {
    // Get existing aggregate
    const existing = await kv.get(key) as any;
    
    if (existing) {
      // Merge counts and data
      const merged = {
        count: existing.count + newData.count,
        data: mergeData(existing.data, newData.data),
        sampleRate: newData.sampleRate,
        lastUpdated: Date.now()
      };
      
      await kv.setex(key, ttl, merged);
    } else {
      // First aggregate for this key
      await kv.setex(key, ttl, {
        ...newData,
        lastUpdated: Date.now()
      });
    }
  } catch (error) {
    console.error('Merge aggregate error:', error);
    // Fallback: just set the new data
    await kv.setex(key, ttl, newData);
  }
}

function mergeData(existing: any, newData: any): any {
  const merged = { ...existing };
  
  for (const [key, value] of Object.entries(newData)) {
    if (typeof value === 'number') {
      merged[key] = (merged[key] || 0) + value;
    } else if (key === '_count') {
      merged[key] = (merged[key] || 0) + value;
    } else {
      merged[key] = value;
    }
  }
  
  return merged;
}