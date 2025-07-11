# BI Dashboard Troubleshooting Guide

## Common Issues and Solutions

### Authentication Issues

#### Problem: Can't access admin dashboard
**Symptoms**: Getting 401 Unauthorized error

**Solutions**:
1. Check environment variables are set:
   ```bash
   echo $ADMIN_USERNAME
   echo $ADMIN_PASSWORD
   ```

2. Verify middleware.ts is in the root directory:
   ```bash
   ls -la middleware.ts
   ```

3. Clear browser cache and cookies

4. Try incognito/private browsing mode

5. Check Vercel deployment logs for errors

#### Problem: Authentication works locally but not on Vercel
**Solutions**:
1. Ensure environment variables are set in Vercel dashboard
2. Check that middleware.ts is included in deployment
3. Verify environment variable names match exactly
4. Check for case sensitivity issues

### API Issues

#### Problem: API endpoints return 404
**Symptoms**: `/api/analytics/*` routes not found

**Solutions**:
1. Ensure API files have correct export:
   ```typescript
   export const GET: APIRoute = async ({ request }) => {
     // handler code
   };
   ```

2. Check file naming matches route:
   - `/api/analytics/overview` → `src/pages/api/analytics/overview.ts`

3. Verify SSR is enabled for API routes:
   ```typescript
   export const prerender = false;
   ```

#### Problem: CORS errors when calling APIs
**Solutions**:
1. Add CORS headers to API responses:
   ```typescript
   headers: {
     'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
   }
   ```

2. Use same-origin requests when possible

### Chart/Visualization Issues

#### Problem: Charts not rendering
**Solutions**:
1. Check if Recharts is installed:
   ```bash
   npm list recharts
   ```

2. Verify ResponsiveContainer has explicit height:
   ```tsx
   <ResponsiveContainer width="100%" height={300}>
   ```

3. Check for data format issues in console

4. Ensure parent container has dimensions

#### Problem: Charts rendering incorrectly on mobile
**Solutions**:
1. Use responsive breakpoints
2. Reduce data points for mobile
3. Consider alternative visualizations
4. Test with device emulation

### Performance Issues

#### Problem: Dashboard loads slowly
**Solutions**:
1. Check API response times in Network tab
2. Implement caching:
   ```typescript
   const cache = new APICache(5); // 5-minute cache
   ```

3. Lazy load heavy components:
   ```typescript
   const Chart = lazy(() => import('./Chart'));
   ```

4. Use pagination for large datasets

#### Problem: Memory leaks with real-time updates
**Solutions**:
1. Clean up EventSource on unmount:
   ```typescript
   useEffect(() => {
     const eventSource = new EventSource('/api/realtime');
     
     return () => {
       eventSource.close();
     };
   }, []);
   ```

2. Limit historical data points
3. Use React.memo for chart components

### Data Issues

#### Problem: No data showing in dashboards
**Solutions**:
1. Check if analytics engine is collecting data
2. Verify API endpoints are returning data
3. Check browser console for errors
4. Ensure date ranges are correct
5. Verify mock data is being generated

#### Problem: Incorrect metrics displayed
**Solutions**:
1. Verify calculation logic in API endpoints
2. Check timezone handling
3. Ensure data aggregation is correct
4. Validate data types and formats

### Deployment Issues

#### Problem: Build fails with middleware
**Solutions**:
1. Ensure middleware uses correct imports:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   ```

2. Check for syntax errors in middleware.ts

3. Verify all dependencies are installed

#### Problem: Environment variables not working
**Solutions**:
1. Use correct prefix for client-side vars: `PUBLIC_`
2. Restart dev server after adding env vars
3. Check `.env.example` for required variables
4. Verify Vercel env var configuration

### Browser Compatibility

#### Problem: Dashboard not working in Safari
**Solutions**:
1. Check for Safari-specific CSS issues
2. Ensure modern JavaScript features are transpiled
3. Test EventSource compatibility
4. Use polyfills if necessary

#### Problem: IE11 compatibility needed
**Solutions**:
1. Add necessary polyfills
2. Use CSS fallbacks
3. Consider showing unsupported browser message
4. Test with BrowserStack

## Debugging Tools

### Enable Debug Mode
Add to `.env`:
```bash
DEBUG_MODE=true
API_LOGGING=verbose
```

### Performance Profiling
```typescript
// Add to dashboard components
useEffect(() => {
  performance.mark('dashboard-start');
  
  return () => {
    performance.mark('dashboard-end');
    performance.measure('dashboard-load', 'dashboard-start', 'dashboard-end');
    
    const measure = performance.getEntriesByName('dashboard-load')[0];
    console.log('Dashboard load time:', measure.duration);
  };
}, []);
```

### API Response Logging
```typescript
// Add to API utilities
export async function fetchWithLogging(url: string) {
  const start = Date.now();
  
  try {
    const response = await fetch(url);
    const duration = Date.now() - start;
    
    console.log(`API call to ${url} took ${duration}ms`);
    
    return response;
  } catch (error) {
    console.error(`API call to ${url} failed:`, error);
    throw error;
  }
}
```

## Getting Help

If issues persist:

1. **Check Logs**:
   - Browser console
   - Vercel function logs
   - Build output

2. **Verify Setup**:
   - All dependencies installed
   - Environment variables set
   - File structure correct

3. **Test Incrementally**:
   - Start with basic setup
   - Add features one by one
   - Identify breaking point

4. **Common Commands**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Test build locally
   npm run build
   
   # Check TypeScript errors
   npm run typecheck
   
   # Run in production mode locally
   npm run preview
   ```

## Prevention Tips

1. **Regular Testing**: Test each phase before moving to next
2. **Version Control**: Commit working states frequently
3. **Documentation**: Keep notes on custom configurations
4. **Monitoring**: Set up error tracking early
5. **Incremental Changes**: Make small, testable changes

Remember: Most issues are related to environment configuration, missing dependencies, or typos in file paths. Always check these first!