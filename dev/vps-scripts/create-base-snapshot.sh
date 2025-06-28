#!/bin/bash
# create-base-snapshot.sh - Creates a base DigitalOcean snapshot with all dependencies

set -e

# Configuration
DROPLET_NAME="bs-display-base-$(date +%Y%m%d)"
SNAPSHOT_NAME="bs-display-base-$(date +%Y%m%d-%H%M)"
REGION="${DO_REGION:-nyc3}"
SIZE="s-2vcpu-4gb"  # Need more power for initial setup
IMAGE="ubuntu-24-04-x64"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== BS-Display Base Snapshot Creator ===${NC}"
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

# Get SSH key
SSH_KEY_ID=$(doctl compute ssh-key list --format ID --no-header | head -1)
if [ -z "$SSH_KEY_ID" ]; then
    echo -e "${RED}Error: No SSH keys found in DigitalOcean${NC}"
    exit 1
fi

echo -e "${YELLOW}Creating temporary droplet: $DROPLET_NAME${NC}"

# Create droplet
DROPLET_ID=$(doctl compute droplet create "$DROPLET_NAME" \
    --image "$IMAGE" \
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
while ! ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 root@$IP exit 2>/dev/null; do
    echo -n "."
    sleep 5
done
echo

# Run provisioning script
echo -e "${YELLOW}Provisioning base image...${NC}"
ssh -o StrictHostKeyChecking=no root@$IP 'bash -s' < provision-base.sh

# Check if provisioning succeeded
if ssh -o StrictHostKeyChecking=no root@$IP "test -f /tmp/provision-complete"; then
    echo -e "${GREEN}✓ Provisioning complete${NC}"
else
    echo -e "${RED}✗ Provisioning failed. Check droplet logs.${NC}"
    exit 1
fi

# Power off for snapshot
echo -e "${YELLOW}Powering off droplet...${NC}"
doctl compute droplet-action power-off "$DROPLET_ID" --wait

# Create snapshot
echo -e "${YELLOW}Creating snapshot: $SNAPSHOT_NAME${NC}"
SNAPSHOT_ID=$(doctl compute droplet-action snapshot "$DROPLET_ID" \
    --snapshot-name "$SNAPSHOT_NAME" \
    --wait \
    --format ID \
    --no-header)

echo -e "${GREEN}✓ Snapshot created: $SNAPSHOT_ID${NC}"

# Save snapshot ID for future use
echo "$SNAPSHOT_ID" > .latest-snapshot-id
echo "$SNAPSHOT_NAME" > .latest-snapshot-name

# Delete temporary droplet
echo -e "${YELLOW}Cleaning up temporary droplet...${NC}"
doctl compute droplet delete "$DROPLET_ID" --force

# Clean up old snapshots (keep last 3)
echo -e "${YELLOW}Cleaning up old snapshots...${NC}"
OLD_SNAPSHOTS=$(doctl compute snapshot list \
    --format ID,Name \
    --no-header | \
    grep "bs-display-base" | \
    sort -r -k2 | \
    tail -n +4 | \
    awk '{print $1}')

if [ -n "$OLD_SNAPSHOTS" ]; then
    echo "$OLD_SNAPSHOTS" | while read -r snapshot_id; do
        echo -e "  Deleting old snapshot: $snapshot_id"
        doctl compute snapshot delete "$snapshot_id" --force
    done
fi

echo
echo -e "${GREEN}=== Base snapshot created successfully! ===${NC}"
echo -e "Snapshot ID: ${BLUE}$SNAPSHOT_ID${NC}"
echo -e "Snapshot Name: ${BLUE}$SNAPSHOT_NAME${NC}"
echo
echo -e "You can now use ${YELLOW}./spin-up.sh${NC} to create development environments"
echo