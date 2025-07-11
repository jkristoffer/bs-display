import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
  // Only check auth for /admin routes
  if (pathname.startsWith('/admin')) {
    const authHeader = context.request.headers.get('authorization');
    
    // Check if auth header exists
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new Response('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Dashboard", charset="UTF-8"',
          'Content-Type': 'text/plain',
        },
      });
    }

    // Decode and verify credentials
    try {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = atob(base64Credentials);
      const [username, password] = credentials.split(':');
      
      const validUsername = import.meta.env.ADMIN_USERNAME || 'admin';
      const validPassword = import.meta.env.ADMIN_PASSWORD;
      
      // Debug logging
      console.log('Auth attempt - Username:', username);
      console.log('Valid username:', validUsername);
      console.log('Valid password exists:', !!validPassword);
      console.log('Environment variables:', {
        ADMIN_USERNAME: import.meta.env.ADMIN_USERNAME,
        ADMIN_PASSWORD: import.meta.env.ADMIN_PASSWORD ? '[REDACTED]' : 'NOT_SET'
      });
      
      if (!validPassword) {
        console.error('ADMIN_PASSWORD environment variable not set');
        return new Response('Server configuration error', { 
          status: 500,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }
      
      if (username === validUsername && password === validPassword) {
        return next();
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
    
    // Invalid credentials
    return new Response('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Dashboard", charset="UTF-8"',
        'Content-Type': 'text/plain',
      },
    });
  }
  
  // Allow all other routes
  return next();
});