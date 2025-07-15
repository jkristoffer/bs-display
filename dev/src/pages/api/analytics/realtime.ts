import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial data
      const initialData = {
        type: 'initial',
        activeUsers: Math.floor(30 + Math.random() * 20),
        timestamp: Date.now(),
      };
      
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`)
      );

      // Simulate real-time updates
      const interval = setInterval(() => {
        const data = {
          type: 'update',
          activeUsers: Math.floor(25 + Math.random() * 30),
          recentEvents: generateRecentEvents(),
          activeSessions: generateActiveSessions(),
          timestamp: Date.now(),
        };

        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Stream closed
          clearInterval(interval);
        }
      }, 3000); // Update every 3 seconds

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};

function generateRecentEvents() {
  const eventTypes = [
    { type: 'page_view', pages: ['/', '/products', '/quiz', '/blog'] },
    { type: 'product_view', products: ['Smart Board Pro', 'Interactive Display 75"', 'Touch Screen 65"'] },
    { type: 'quiz_start' },
    { type: 'quiz_complete' },
    { type: 'form_view', forms: ['contact', 'quote', 'demo'] },
    { type: 'form_submit', forms: ['contact', 'quote'] },
  ];

  const events = [];
  const numEvents = Math.floor(Math.random() * 4) + 2; // 2-5 events

  for (let i = 0; i < numEvents; i++) {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const event: any = {
      type: eventType.type,
      user: `User${Math.floor(Math.random() * 1000)}`,
      time: i === 0 ? 'now' : `${(i + 1) * 2}s ago`,
    };

    if (eventType.type === 'page_view' && 'pages' in eventType && eventType.pages) {
      event.page = eventType.pages[Math.floor(Math.random() * eventType.pages.length)];
    } else if (eventType.type === 'product_view' && 'products' in eventType && eventType.products) {
      event.product = eventType.products[Math.floor(Math.random() * eventType.products.length)];
    } else if ((eventType.type === 'form_view' || eventType.type === 'form_submit') && 'forms' in eventType && eventType.forms) {
      event.form = eventType.forms[Math.floor(Math.random() * eventType.forms.length)];
    }

    events.push(event);
  }

  return events;
}

function generateActiveSessions() {
  const pages = [
    '/products',
    '/quiz',
    '/products/smartboards',
    '/products/lecterns',
    '/',
    '/blog',
    '/contact',
  ];

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
  ];

  const numSessions = Math.floor(Math.random() * 5) + 3;
  const sessions = [];

  for (let i = 0; i < numSessions; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    sessions.push({
      sessionId: `session_${Math.random().toString(36).substring(2, 11)}`,
      page: pages[Math.floor(Math.random() * pages.length)],
      duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
      country: country.code,
      countryName: country.name,
      device: Math.random() > 0.6 ? 'desktop' : 'mobile',
    });
  }

  return sessions;
}