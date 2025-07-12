import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';
import { ANALYTICS_CONFIG } from '@config/analytics-storage.config';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // Create SSE response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
      );
      
      // Poll for updates
      const intervalId = setInterval(async () => {
        try {
          const update = await getRealtimeUpdate();
          if (update) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(update)}\n\n`)
            );
          }
        } catch (error) {
          console.error('Stream update error:', error);
        }
      }, 5000); // Update every 5 seconds
      
      // Clean up on disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Disable Nginx buffering
    }
  });
};

async function getRealtimeUpdate() {
  try {
    // Get latest 5-minute aggregates
    const now = Date.now();
    const fiveMinWindow = Math.floor(now / 300000) * 300000;
    const key = `${ANALYTICS_CONFIG.kvKeys.aggregates.fiveMin}${fiveMinWindow}`;
    
    const aggregate = await kv.get(key);
    if (!aggregate) return null;
    
    const data = aggregate as any;
    
    return {
      type: 'update',
      timestamp: now,
      metrics: {
        recentEvents: data.count || 0,
        eventType: data.key?.split(':')[0] || 'unknown'
      }
    };
    
  } catch (error) {
    console.error('Failed to get realtime update:', error);
    return null;
  }
}