# 🚀 Quick Setup: Ultra-Low-Cost Analytics

## 1-Minute Setup with CLI

```bash
# Run the automated setup script
bash scripts/setup-analytics-storage.sh
```

This script will:
- ✅ Install Vercel CLI (if needed)
- ✅ Create KV database
- ✅ Create Edge Config
- ✅ Set up environment variables
- ✅ Generate CRON_SECRET
- ✅ Test connections

## Manual Setup Steps

### 1. Create Storage (2 minutes)
```bash
vercel storage create kv          # Name: analytics-kv
vercel storage create edge-config # Name: analytics-config
```

### 2. Get Environment Variables (30 seconds)
```bash
vercel env pull .env.local
```

### 3. Add CRON_SECRET (30 seconds)
```bash
# Generate secret
echo "CRON_SECRET=$(openssl rand -base64 32)" >> .env.local

# Add to Vercel
vercel env add CRON_SECRET
```

### 4. Test Connection (1 minute)
```bash
node scripts/test-vercel-storage.js
```

## Deploy to Production

```bash
vercel --prod
```

## Verify Everything Works

1. **Test Page**: Visit `/admin/analytics-test`
2. **Dashboard**: Check `/admin/analytics`
3. **Cron Job**: Verify in Vercel Dashboard → Functions → Cron

## Cost: $0.03-0.05/month

- **3M events/month**
- **99.8% cost reduction**
- **FREE dashboard reads**

## Need Help?

- [Full Setup Guide](./vercel-kv-edge-config-setup.md)
- [Deployment Guide](./ultra-low-cost-analytics-deployment.md)
- [Troubleshooting](./troubleshooting.md)

---

**Pro Tip**: Use `vercel dev` instead of `npm run dev` to automatically load environment variables!