#!/bin/bash

# Setup script for Vercel KV and Edge Config
# Run: bash scripts/setup-analytics-storage.sh

set -e

echo "🚀 Vercel Analytics Storage Setup"
echo "================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel@latest
fi

# Check if project is linked
if [ ! -f ".vercel/project.json" ]; then
    echo "📎 Linking project to Vercel..."
    vercel link
fi

echo ""
echo "📦 Creating storage resources..."
echo ""

# Create Upstash Redis database
echo "1️⃣ Creating Upstash Redis database..."
echo "   Vercel KV has been replaced with Upstash Redis"
echo "   Please create manually in Vercel Dashboard:"
echo "   1. Visit https://vercel.com/juan-kristoffers-projects/bsdisplay"
echo "   2. Go to Storage tab"
echo "   3. Create Upstash Redis Database named 'analytics-redis'"
echo "   4. Create Edge Config named 'analytics-config'"
echo ""

echo ""
echo "2️⃣ Checking if storage resources exist..."
echo "   Checking environment variables after creation..."

echo ""
echo "3️⃣ Pulling environment variables..."
vercel env pull .env.local

echo ""
echo "4️⃣ Setting up CRON_SECRET..."
if ! grep -q "CRON_SECRET" .env.local 2>/dev/null; then
    CRON_SECRET=$(openssl rand -base64 32)
    echo "   Generated secret: $CRON_SECRET"
    echo ""
    echo "   Adding to Vercel..."
    echo "$CRON_SECRET" | vercel env add CRON_SECRET production
    echo "$CRON_SECRET" | vercel env add CRON_SECRET preview
    echo "$CRON_SECRET" | vercel env add CRON_SECRET development
    echo "CRON_SECRET=$CRON_SECRET" >> .env.local
else
    echo "   ✅ CRON_SECRET already exists"
fi

echo ""
echo "5️⃣ Verifying setup..."
node scripts/test-vercel-storage.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Initialize Edge Config data (see docs)"
echo "3. Test analytics at /admin/analytics-test"
echo ""
echo "📚 Documentation: docs/internal/BI/vercel-kv-edge-config-setup.md"