# Phase 1: Authentication Setup

## Overview

This phase implements a simple but secure authentication layer using Vercel Edge Middleware to protect the `/admin` routes where BI dashboards will reside. We'll use HTTP Basic Authentication for simplicity, which is sufficient for internal dashboards.

## Goals

- ✅ Protect all `/admin/*` routes from unauthorized access
- ✅ Implement using Vercel Edge Middleware
- ✅ Use environment variables for credentials
- ✅ Maintain zero impact on public site performance
- ✅ Provide clear authentication prompts

## Implementation Steps

### Step 1: Create Middleware File

Create `/middleware.ts` in the project root:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Only check auth for /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    
    // Check if auth header exists
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new Response('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
        },
      });
    }

    // Decode and verify credentials
    try {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = atob(base64Credentials);
      const [username, password] = credentials.split(':');
      
      const validUsername = process.env.ADMIN_USERNAME || 'admin';
      const validPassword = process.env.ADMIN_PASSWORD;
      
      if (!validPassword) {
        console.error('ADMIN_PASSWORD environment variable not set');
        return new Response('Server configuration error', { status: 500 });
      }
      
      if (username === validUsername && password === validPassword) {
        return NextResponse.next();
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
    
    // Invalid credentials
    return new Response('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
      },
    });
  }
  
  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/analytics/* (public analytics collection endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public/*)
     */
    '/((?!api/analytics|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

### Step 2: Update Environment Configuration

Add to `.env.example`:

```bash
# Admin Dashboard Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
```

### Step 3: Configure Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the following variables:
   - `ADMIN_USERNAME` = `admin` (or your preferred username)
   - `ADMIN_PASSWORD` = [generate a secure password]
3. Apply to all environments or specific ones as needed

### Step 4: Create Admin Route Structure

Create the admin directory structure:

```bash
mkdir -p src/pages/admin
```

Create `/src/pages/admin/index.astro`:

```astro
---
import AdminLayout from '@layouts/AdminLayout.astro';
---

<AdminLayout title="Dashboard">
  <div class="admin-dashboard">
    <h1>Business Intelligence Dashboard</h1>
    <p>Welcome to the admin dashboard. Analytics implementation coming soon.</p>
    
    <div class="quick-links">
      <a href="/admin/analytics/overview">Analytics Overview</a>
      <a href="/admin/analytics/realtime">Real-time Metrics</a>
      <a href="/admin/analytics/products">Product Analytics</a>
      <a href="/admin/analytics/journeys">Customer Journeys</a>
    </div>
  </div>
</AdminLayout>

<style>
  .admin-dashboard {
    padding: 2rem;
  }
  
  .quick-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .quick-links a {
    padding: 1rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    text-decoration: none;
    color: var(--color-text);
    transition: all 0.2s;
  }
  
  .quick-links a:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
  }
</style>
```

### Step 5: Test Authentication

1. **Local Testing**:
   ```bash
   # Set environment variables
   export ADMIN_USERNAME=admin
   export ADMIN_PASSWORD=test123
   
   # Run development server
   npm run dev
   
   # Visit http://localhost:4321/admin
   # Should prompt for username/password
   ```

2. **Test Invalid Credentials**:
   - Try wrong username/password
   - Verify 401 response
   - Check error handling

3. **Test Public Routes**:
   - Verify `/` and other public routes work without auth
   - Ensure no performance impact

### Step 6: Security Considerations

1. **Password Requirements**:
   - Minimum 16 characters
   - Mix of letters, numbers, symbols
   - Store in password manager
   - Rotate periodically

2. **HTTPS Only**:
   - Vercel enforces HTTPS by default
   - Never transmit credentials over HTTP

3. **Rate Limiting** (optional future enhancement):
   ```typescript
   // Add to middleware for brute force protection
   const attempts = new Map<string, number>();
   
   // Track failed attempts by IP
   if (invalidCredentials) {
     const ip = request.headers.get('x-forwarded-for') || 'unknown';
     const count = attempts.get(ip) || 0;
     attempts.set(ip, count + 1);
     
     if (count > 5) {
       return new Response('Too many attempts', { status: 429 });
     }
   }
   ```

## Validation Checklist

- [ ] Middleware file created and properly configured
- [ ] Environment variables set locally
- [ ] Environment variables configured in Vercel
- [ ] Admin routes return 401 without credentials
- [ ] Valid credentials allow access
- [ ] Public routes unaffected
- [ ] No console errors
- [ ] Authentication prompt appears in browser
- [ ] Works on both development and production

## Troubleshooting

### Common Issues

1. **"Server configuration error" message**
   - Ensure `ADMIN_PASSWORD` is set in environment variables
   - Check Vercel dashboard for proper configuration

2. **Authentication not working on Vercel**
   - Verify environment variables are set for the correct environment
   - Check middleware.ts is in the root directory
   - Ensure file is included in deployment

3. **All routes requiring authentication**
   - Check the matcher configuration in middleware
   - Verify the pathname check logic

4. **Authentication prompt not appearing**
   - Clear browser cache
   - Try incognito/private browsing
   - Check browser console for errors

## Next Steps

Once authentication is working:
1. Proceed to [Phase 2: Dashboard Infrastructure](./phase-2-infrastructure.md)
2. Create the AdminLayout component
3. Set up navigation structure
4. Begin dashboard implementation

## Additional Resources

- [Vercel Edge Middleware Documentation](https://vercel.com/docs/functions/edge-middleware)
- [HTTP Basic Authentication RFC](https://tools.ietf.org/html/rfc7617)
- [Environment Variables in Vercel](https://vercel.com/docs/environment-variables)