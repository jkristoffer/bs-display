#!/bin/bash
# update-snapshot.sh - Updates the base snapshot with latest code and dependencies

set -e

# Configuration
REGION="${DO_REGION:-nyc3}"
SIZE="s-2vcpu-4gb"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== BS-Display Snapshot Updater ===${NC}"
echo

# Check dependencies
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}Error: doctl not found. Install with: brew install doctl${NC}"
    exit 1
fi

if ! doctl auth list &> /dev/null; then
    echo -e "${RED}Error: Not authenticated. Run: doctl auth init${NC}"
    exit 1
fi

# Always auto-detect the most recent snapshot
echo -e "${YELLOW}Auto-detecting most recent bs-display snapshot...${NC}"

# Get all bs-display snapshots with creation date and sort by most recent
SNAPSHOT_INFO=$(doctl compute snapshot list \
    --format ID,Name,Created \
    --no-header | \
    grep "bs-display" | \
    sort -k3 -r | \
    head -1)

if [ -z "$SNAPSHOT_INFO" ]; then
    echo -e "${RED}Error: No bs-display snapshots found. Run ./create-base-snapshot.sh first${NC}"
    exit 1
fi

SNAPSHOT_ID=$(echo "$SNAPSHOT_INFO" | awk '{print $1}')
SNAPSHOT_NAME=$(echo "$SNAPSHOT_INFO" | awk '{print $2}')
SNAPSHOT_DATE=$(echo "$SNAPSHOT_INFO" | awk '{print $3}')

echo -e "${GREEN}✓ Using most recent snapshot:${NC}"
echo -e "  Name: ${BLUE}$SNAPSHOT_NAME${NC}"
echo -e "  ID: ${BLUE}$SNAPSHOT_ID${NC}"
echo -e "  Created: ${BLUE}$SNAPSHOT_DATE${NC}"

# Update tracking files
echo "$SNAPSHOT_ID" > .latest-snapshot-id
echo "$SNAPSHOT_NAME" > .latest-snapshot-name

# Get SSH key
SSH_KEY_ID=$(doctl compute ssh-key list --format ID --no-header | head -1)

# Create temporary droplet name
TEMP_NAME="bs-display-update-$(date +%Y%m%d-%H%M)"
NEW_SNAPSHOT_NAME="bs-display-base-$(date +%Y%m%d-%H%M)"

echo -e "${YELLOW}Creating temporary droplet: $TEMP_NAME${NC}"

# Create droplet from existing snapshot
DROPLET_ID=$(doctl compute droplet create "$TEMP_NAME" \
    --image "$SNAPSHOT_ID" \
    --size "$SIZE" \
    --region "$REGION" \
    --ssh-keys "$SSH_KEY_ID" \
    --wait \
    --format ID \
    --no-header)

# Get IP
IP=$(doctl compute droplet get "$DROPLET_ID" --format PublicIPv4 --no-header)
echo -e "${GREEN}✓ Droplet created at $IP${NC}"

# Wait for SSH
echo -e "${YELLOW}Waiting for SSH to be ready...${NC}"
while ! ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 dev@$IP exit 2>/dev/null; do
    echo -n "."
    sleep 5
done
echo

# Update the system and project
echo -e "${YELLOW}Updating system and project...${NC}"
ssh -o StrictHostKeyChecking=no dev@$IP << 'EOF'
# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Update project
cd /opt/bs-display/dev
echo "Pulling latest code..."
git pull origin main

echo "Updating dependencies..."
npm install

echo "Testing build..."
npm run build

echo "Cleaning up..."
npm cache clean --force
sudo apt-get clean
sudo rm -rf /var/lib/apt/lists/*

echo "Update complete!"
EOF

# Verify update was successful
echo -e "${YELLOW}Verifying update...${NC}"
if ssh -o StrictHostKeyChecking=no dev@$IP "cd /opt/bs-display/dev && npm run check" &>/dev/null; then
    echo -e "${GREEN}✓ Update verification successful${NC}"
else
    echo -e "${YELLOW}⚠ Verification had warnings, but continuing...${NC}"
fi

# Power off for snapshot
echo -e "${YELLOW}Powering off droplet...${NC}"
doctl compute droplet-action power-off "$DROPLET_ID" --wait

# Create new snapshot
echo -e "${YELLOW}Creating updated snapshot: $NEW_SNAPSHOT_NAME${NC}"
NEW_SNAPSHOT_ID=$(doctl compute droplet-action snapshot "$DROPLET_ID" \
    --snapshot-name "$NEW_SNAPSHOT_NAME" \
    --wait \
    --format ID \
    --no-header)

echo -e "${GREEN}✓ New snapshot created: $NEW_SNAPSHOT_ID${NC}"

# Update the latest snapshot references
echo "$NEW_SNAPSHOT_ID" > .latest-snapshot-id
echo "$NEW_SNAPSHOT_NAME" > .latest-snapshot-name

# Clean up temporary droplet
echo -e "${YELLOW}Cleaning up temporary droplet...${NC}"
doctl compute droplet delete "$DROPLET_ID" --force

# Clean up old snapshots (keep last 3)
echo -e "${YELLOW}Cleaning up old snapshots...${NC}"
OLD_SNAPSHOTS=$(doctl compute snapshot list \
    --format ID,Name \
    --no-header | \
    grep "bs-display" | \
    sort -r -k2 | \
    tail -n +4 | \
    awk '{print $1}')

if [ -n "$OLD_SNAPSHOTS" ]; then
    echo "$OLD_SNAPSHOTS" | while read -r snapshot_id; do
        echo -e "  Deleting old snapshot: $snapshot_id"
        doctl compute snapshot delete "$snapshot_id" --force
    done
    echo -e "${GREEN}✓ Old snapshots cleaned up${NC}"
else
    echo -e "${YELLOW}No old snapshots to clean up${NC}"
fi

echo
echo -e "${GREEN}=== Snapshot update completed successfully! ===${NC}"
echo -e "New Snapshot ID: ${BLUE}$NEW_SNAPSHOT_ID${NC}"
echo -e "New Snapshot Name: ${BLUE}$NEW_SNAPSHOT_NAME${NC}"
echo
echo -e "You can now use ${YELLOW}./spin-up.sh${NC} to create environments with the updated snapshot"
echo