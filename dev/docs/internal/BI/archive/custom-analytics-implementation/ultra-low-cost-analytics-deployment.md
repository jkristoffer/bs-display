# Ultra-Low-Cost Analytics Deployment Guide

This guide explains how to deploy the ultra-low-cost analytics system that reduces Vercel KV costs by 99.8% (from ~$24/month to $0.03-0.05/month).

## Architecture Overview

The system uses a hybrid storage approach:
- **Vercel KV**: Write-only storage for event ingestion and aggregation
- **Vercel Edge Config**: Read-only storage for dashboard data (FREE reads)
- **Client-side optimization**: Batching, compression, and pre-aggregation

## Setup Steps

### 1. Create Vercel KV Database

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → KV
3. Name it (e.g., "analytics-kv")
4. Copy the environment variables

### 2. Create Vercel Edge Config

1. In Vercel dashboard, go to Storage → Create Database → Edge Config
2. Name it (e.g., "analytics-config")
3. Copy the EDGE_CONFIG environment variable

### 3. Set Environment Variables

Add these to your Vercel project settings:

```bash
# Vercel KV (from step 1)
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...

# Vercel Edge Config (from step 2)
EDGE_CONFIG=https://edge-config.vercel.com/...

# Cron Job Security (generate a random string)
CRON_SECRET=your-random-secret-here
```

### 4. Configure Cron Job

The `vercel.json` file already includes the cron configuration:

```json
{
  "crons": [
    {
      "path": "/api/cron/aggregate-analytics",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This runs every 5 minutes to aggregate data.

### 5. Verify Deployment

After deployment:

1. Visit `/admin/analytics-test` to test event tracking
2. Check `/api/analytics/dashboard` returns data
3. Monitor Vercel KV usage in dashboard

## Cost Breakdown

With 3M events/month:

### Storage Costs
- Raw events (1hr TTL): ~600 MB/month
- 5-min aggregates (1day TTL): ~75 MB/month
- Hourly aggregates (7day TTL): ~20 MB/month
- Daily aggregates (30day TTL): ~5 MB/month
- **Total**: ~700 MB = **$0.02/month**

### Request Costs
- Writes: ~10,000/month (batched) = $0.01
- Reads: FREE (via Edge Config)
- **Total**: **$0.01/month**

### Total Monthly Cost: $0.03-0.05

## Monitoring

### KV Usage
- Monitor in Vercel Dashboard → Storage → Your KV Database
- Check "Usage" tab for storage and requests

### Analytics Health
- Dashboard API: `/api/analytics/dashboard`
- Aggregation status: Check Edge Config for `aggregation_status`
- Event ingestion: Monitor `/api/analytics/ingest` logs

## Optimization Tips

1. **Adjust Sampling Rates** in `analytics-storage.config.ts`:
   ```typescript
   sampling: {
     pageViews: 0.1,  // Reduce to 0.05 for 50% less data
     conversions: 1.0  // Keep at 1.0 for accuracy
   }
   ```

2. **Increase Batch Sizes**:
   ```typescript
   batching: {
     maxBatchSize: 100,  // Increase from 50
     flushIntervalMs: 60000  // Increase from 30s
   }
   ```

3. **Reduce TTLs** for faster cleanup:
   ```typescript
   ttl: {
     rawEvents: 1800,  // 30 minutes instead of 1 hour
     fiveMinAggregates: 43200  // 12 hours instead of 24
   }
   ```

## Troubleshooting

### No Data in Dashboard
1. Check if events are being sent: Browser DevTools → Network → ingest
2. Verify cron job is running: Vercel Dashboard → Functions → Cron logs
3. Check KV connection: Test with `/api/analytics/dashboard?refresh=true`

### High Costs
1. Check sampling rates are applied correctly
2. Verify TTLs are working (old data should expire)
3. Monitor unique event types (reduce if too many)

### Cron Job Failures
1. Verify CRON_SECRET is set correctly
2. Check function timeout (30s should be enough)
3. Monitor memory usage in function logs

## Migration from GA4

To migrate from pure GA4 to this system:

1. Keep GA4 integration active (for comparison)
2. Deploy this system in parallel
3. Compare metrics for 1-2 weeks
4. Gradually shift dashboards to new system
5. Keep GA4 as backup/validation

## Security Considerations

1. **CRON_SECRET**: Use a strong random string
2. **Read-only tokens**: Use KV_REST_API_READ_ONLY_TOKEN where possible
3. **Rate limiting**: Implemented via batching and sampling
4. **Data privacy**: No PII stored, only aggregated metrics