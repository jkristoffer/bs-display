# Vercel KV and Edge Config Setup Guide

This guide covers setting up Vercel KV and Edge Config for the ultra-low-cost analytics system using both the Vercel CLI and dashboard.

## Prerequisites

- Vercel account (Pro plan recommended for production)
- Vercel CLI installed: `npm i -g vercel`
- Project linked to Vercel: `vercel link`

## Option 1: Using Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel@latest
```

### Step 2: Link Your Project
```bash
# In your project directory
vercel link
```

### Step 3: Create Vercel KV Database

```bash
# Create KV database
vercel storage create kv

# You'll be prompted:
# ? What should your Store be named? › analytics-kv
# ? Select a region › (choose closest to your users)
```

The CLI will automatically:
- Create the KV database
- Add environment variables to your project
- Show connection details

### Step 4: Create Edge Config

```bash
# Create Edge Config store
vercel storage create edge-config

# You'll be prompted:
# ? What should your Edge Config be named? › analytics-config
```

### Step 5: Link Storage to Project

```bash
# Link KV to current project
vercel env pull .env.local

# This downloads all environment variables including:
# - KV_URL
# - KV_REST_API_URL
# - KV_REST_API_TOKEN
# - KV_REST_API_READ_ONLY_TOKEN
# - EDGE_CONFIG
```

### Step 6: Add Custom Environment Variables

```bash
# Generate and add CRON_SECRET
vercel env add CRON_SECRET

# When prompted:
# ? What's the value of CRON_SECRET? › (enter a random string, e.g., generated with: openssl rand -base64 32)
# ? Add CRON_SECRET to which Environments? › Production, Preview, Development
```

## Option 2: Using Vercel Dashboard

### Step 1: Create KV Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Storage** tab
4. Click **Create Database**
5. Select **KV** (Redis-compatible)
6. Configure:
   - **Name**: `analytics-kv`
   - **Region**: Choose closest to your users
   - **Primary Region**: Same as above
7. Click **Create**

### Step 2: Create Edge Config

1. In the Storage tab, click **Create Database** again
2. Select **Edge Config**
3. Configure:
   - **Name**: `analytics-config`
4. Click **Create**

### Step 3: Connect to Project

1. For each storage (KV and Edge Config):
   - Click on the storage name
   - Go to **Projects** tab
   - Click **Connect Project**
   - Select your project
   - Choose environments: Production, Preview, Development
   - Click **Connect**

### Step 4: Add CRON_SECRET

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Click **Add Variable**
4. Add:
   - **Key**: `CRON_SECRET`
   - **Value**: Generate with `openssl rand -base64 32`
   - **Environment**: All environments
5. Click **Save**

## Verifying Setup

### Check Environment Variables

```bash
# List all environment variables
vercel env ls

# Should show:
# KV_URL                 (Encrypted)
# KV_REST_API_URL       (Encrypted)
# KV_REST_API_TOKEN     (Encrypted)
# KV_REST_API_READ_ONLY_TOKEN (Encrypted)
# EDGE_CONFIG           (Encrypted)
# CRON_SECRET          (Encrypted)
```

### Test KV Connection

```bash
# Create a test script
cat > test-kv.js << 'EOF'
const { kv } = require('@vercel/kv');

async function test() {
  try {
    await kv.set('test', 'Hello from KV!');
    const value = await kv.get('test');
    console.log('✅ KV working:', value);
    await kv.del('test');
  } catch (error) {
    console.error('❌ KV error:', error.message);
  }
}

test();
EOF

# Run with Vercel dev
vercel dev --exec "node test-kv.js"
```

### Test Edge Config

```bash
# Create a test script
cat > test-edge-config.js << 'EOF'
import { get } from '@vercel/edge-config';

async function test() {
  try {
    // First, add a test value via dashboard or API
    const value = await get('test');
    console.log('✅ Edge Config working:', value);
  } catch (error) {
    console.error('❌ Edge Config error:', error.message);
  }
}

test();
EOF

# Run with Vercel dev
vercel dev --exec "node test-edge-config.js"
```

## CLI Commands Reference

### Storage Management
```bash
# List all storage
vercel storage ls

# Get storage details
vercel storage inspect <storage-name>

# Remove storage (careful!)
vercel storage rm <storage-name>
```

### Environment Variables
```bash
# List variables
vercel env ls

# Add variable
vercel env add <name>

# Remove variable
vercel env rm <name>

# Pull to local .env
vercel env pull .env.local
```

### KV Operations
```bash
# Connect to KV CLI
vercel storage connect analytics-kv

# This opens an interactive Redis CLI where you can run:
# SET key value
# GET key
# DEL key
# KEYS *
```

## Initializing Edge Config Data

Edge Config needs initial data for the analytics system:

```javascript
// init-edge-config.js
import { createClient } from '@vercel/edge-config';

const client = createClient(process.env.EDGE_CONFIG);

async function init() {
  try {
    await client.set({
      'dashboard_summary': {
        generated: Date.now(),
        period: '24h',
        overview: {
          totalVisitors: 0,
          pageViews: 0,
          conversions: 0,
          avgSessionDuration: 0
        },
        trends: {
          hourly: [],
          daily: []
        },
        topContent: [],
        sources: []
      },
      'aggregation_status': {
        lastRun: 0,
        success: false
      }
    });
    console.log('✅ Edge Config initialized');
  } catch (error) {
    console.error('❌ Init error:', error);
  }
}

init();
```

Run with: `node init-edge-config.js`

## Cost Considerations

### Vercel KV
- **Free tier**: 256 MB storage, 30k requests/month
- **Pro tier**: 1 GB storage, 100k requests/month included
- **Additional**: $0.10/GB storage, $1.00/100k requests

### Edge Config
- **Free tier**: 8 KB storage, unlimited reads
- **Pro tier**: 512 KB storage, unlimited reads
- **Reads are always FREE** - this is why we use it for dashboard data

### For Analytics System
- KV usage: ~700 MB storage, ~10k requests/month
- Edge Config usage: ~10 KB storage, unlimited reads
- **Monthly cost**: $0.03-0.05 (mostly from KV storage)

## Troubleshooting

### "KV connection failed"
```bash
# Ensure environment variables are set
vercel env pull .env.local
source .env.local

# Check KV URL format
echo $KV_URL  # Should be redis://...
```

### "Edge Config not found"
```bash
# Verify Edge Config token
echo $EDGE_CONFIG  # Should be https://edge-config.vercel.com/...

# Re-link storage
vercel storage link
```

### "Unauthorized" errors
```bash
# Re-generate tokens
vercel storage reconnect analytics-kv
```

### Local Development
```bash
# Use vercel dev instead of npm run dev
vercel dev

# This automatically loads environment variables
```

## Best Practices

1. **Use Read-Only Tokens**: For client-side or less secure operations
2. **Regional Deployment**: Place KV in same region as your functions
3. **Monitor Usage**: Check Vercel dashboard → Storage → Usage regularly
4. **Set Alerts**: Configure usage alerts in Vercel dashboard
5. **Backup Important Data**: KV is not meant for permanent storage

## Production Checklist

- [ ] KV database created and connected
- [ ] Edge Config created and connected
- [ ] All environment variables set
- [ ] CRON_SECRET is secure (32+ characters)
- [ ] Storage regions match function regions
- [ ] Usage alerts configured
- [ ] Test endpoints working
- [ ] Cron job verified in Vercel dashboard

## Next Steps

1. Deploy your application: `vercel --prod`
2. Verify cron job: Check Functions → Cron in dashboard
3. Test analytics: Visit `/admin/analytics-test`
4. Monitor KV usage: Storage → analytics-kv → Usage
5. Check logs: Functions → Logs for any errors

The system is now ready for production use!