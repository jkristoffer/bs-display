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

// Helper to get client IP
export function getClientIP(request: Request): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

// CORS headers helper
export function getCORSHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}