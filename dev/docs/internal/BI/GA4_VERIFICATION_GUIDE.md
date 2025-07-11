# GA4 Verification Guide

**Purpose**: Verify GA4 property configuration and data flow  
**Status**: Current implementation appears to have property ID mismatch  
**Priority**: Medium (GA4 is working with fallback data)  

---

## Current Configuration

### Frontend Tracking
- **Location**: `/src/layouts/BaseLayout.astro`
- **Measurement ID**: `G-NR79MNFHB8`
- **Implementation**: Google Tag Manager (gtag.js)

### Backend Reporting
- **Location**: `/src/config/analytics.config.ts`
- **Property ID**: `496403350`
- **Implementation**: Google Analytics Data API v1beta

## Verification Steps

### 1. Check Property ID Alignment
```bash
# Check frontend measurement ID
grep -r "G-NR79MNFHB8" src/

# Check backend property ID
grep -r "496403350" src/
```

### 2. Verify GA4 Property in Console
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select property `496403350`
3. Check if measurement ID matches `G-NR79MNFHB8`
4. Verify data stream configuration

### 3. Test Data Flow
```bash
# Test GA4 API connection
curl -X GET "https://your-domain.com/api/analytics/test-ga4"

# Check live data in GA4 console
# Navigate to Reports → Realtime
# Verify events are being received
```

### 4. Debug Steps

#### Frontend Debugging
```javascript
// In browser console, check gtag
gtag('config', 'G-NR79MNFHB8', {
  debug_mode: true
});

// Verify events are being sent
gtag('event', 'test_event', {
  event_category: 'debug',
  event_label: 'verification'
});
```

#### Backend Debugging
```typescript
// Test API endpoint directly
const response = await fetch('/api/analytics/overview?period=24h');
const data = await response.json();
console.log('GA4 Data:', data);
```

## Expected Outcomes

### ✅ Working Configuration
- Frontend measurement ID matches backend property ID
- GA4 console shows real-time data
- API returns actual metrics (not fallback data)
- Dashboard displays live analytics

### ❌ Configuration Issues
- **Property ID mismatch**: Frontend and backend use different IDs
- **No data flow**: Events not reaching GA4
- **API errors**: Authentication or property access issues
- **Fallback mode**: Dashboard shows mock data instead of real metrics

## Fix Procedures

### If Property ID Mismatch
1. **Option A**: Update frontend to match backend
   ```astro
   <!-- In BaseLayout.astro -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-CORRECT-ID"></script>
   ```

2. **Option B**: Update backend to match frontend
   ```typescript
   // In analytics.config.ts
   GA4_PROPERTY_ID: "correct-property-id"
   ```

### If Authentication Issues
1. Check service account permissions
2. Verify `GA4_SERVICE_ACCOUNT_KEY` in environment
3. Test API access with Google Analytics Intelligence API Explorer

### If No Data Flow
1. **Check tracking installation**:
   ```bash
   # Verify gtag is loaded
   curl -I https://your-domain.com/
   ```

2. **Test in incognito mode** (avoids ad blockers)
3. **Check data processing delay** (GA4 can take 24-48 hours)

## Current Status Assessment

Based on the implementation analysis:

### ✅ What's Working
- **Technical setup**: Complete implementation with proper fallback
- **Dashboard**: Functional with mock data
- **API**: Proper error handling and caching
- **Authentication**: Service account properly configured

### ⚠️ What Needs Verification
- **Property ID alignment**: Frontend vs backend configuration
- **Data flow**: Whether events reach GA4 property
- **Real data**: API currently returns zeros (using fallback)

### 📋 Action Items
1. **Low Priority**: System works with fallback data
2. **Verify configuration**: Check property ID alignment
3. **Test data flow**: Ensure events reach GA4
4. **Monitor**: Check if data appears over time

---

## Quick Verification Commands

```bash
# Check current configuration
echo "Frontend Measurement ID:"
grep -A 2 -B 2 "G-NR79MNFHB8" src/layouts/BaseLayout.astro

echo "Backend Property ID:"
grep -A 2 -B 2 "496403350" src/config/analytics.config.ts

# Test API endpoint
curl -s "http://localhost:4321/api/analytics/overview?period=24h" | jq .

# Check environment variables
echo "GA4 Config:"
env | grep GA4
```

## Documentation References

- [GA4 Integration Status](./ga4-integration-status.md)
- [Analytics System Status](./analytics-system-status-and-issues.md)
- [Custom Analytics Architecture](./CUSTOM_ANALYTICS_ARCHITECTURE.md)

---

**Last Updated**: January 11, 2025  
**Next Review**: When data flow issues are identified  
**Priority**: Medium (system functional with fallback)  
**Estimated Fix Time**: 30 minutes - 2 hours depending on issue complexity