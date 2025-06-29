#!/bin/bash
# create-snapshot-from-droplet.sh - Create snapshot from existing droplet

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parameters
DROPLET_NAME=""
SNAPSHOT_NAME=""
FORCE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -y|--yes|--force)
            FORCE=true
            shift
            ;;
        *)
            if [ -z "$DROPLET_NAME" ]; then
                DROPLET_NAME="$1"
            elif [ -z "$SNAPSHOT_NAME" ]; then
                SNAPSHOT_NAME="$1"
            fi
            shift
            ;;
    esac
done

if [ -z "$DROPLET_NAME" ]; then
    echo -e "${RED}Usage: $0 <droplet-name> [snapshot-name] [--force]${NC}"
    echo
    echo -e "${YELLOW}Available droplets:${NC}"
    doctl compute droplet list | grep bs-display
    exit 1
fi

if [ -z "$SNAPSHOT_NAME" ]; then
    SNAPSHOT_NAME="bs-display-custom-$(date +%Y%m%d-%H%M)"
fi

echo -e "${BLUE}=== Creating Snapshot from Droplet ===${NC}"
echo

# Get droplet ID
DROPLET_ID=$(doctl compute droplet list | grep "$DROPLET_NAME" | awk '{print $1}' | head -1)

if [ -z "$DROPLET_ID" ]; then
    echo -e "${RED}Error: Droplet '$DROPLET_NAME' not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Droplet: $DROPLET_NAME (ID: $DROPLET_ID)${NC}"
echo -e "${YELLOW}Snapshot name: $SNAPSHOT_NAME${NC}"
echo

# Confirm action (unless --force is used)
if [ "$FORCE" = false ]; then
    read -p "Create snapshot? This will power off the droplet temporarily (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Snapshot creation cancelled${NC}"
        exit 0
    fi
else
    echo -e "${YELLOW}Force mode: Creating snapshot without confirmation${NC}"
fi

# Power off droplet
echo -e "${YELLOW}Powering off droplet...${NC}"
doctl compute droplet-action power-off "$DROPLET_ID" --wait

# Create snapshot
echo -e "${YELLOW}Creating snapshot...${NC}"
SNAPSHOT_ID=$(doctl compute droplet-action snapshot "$DROPLET_ID" \
    --snapshot-name "$SNAPSHOT_NAME" \
    --wait \
    --format ID | tail -n 1)

echo -e "${GREEN}✓ Snapshot created: $SNAPSHOT_NAME (ID: $SNAPSHOT_ID)${NC}"

# Power back on
echo -e "${YELLOW}Powering droplet back on...${NC}"
doctl compute droplet-action power-on "$DROPLET_ID" --wait

# Wait for SSH to be ready
echo -e "${YELLOW}Waiting for SSH to be ready...${NC}"
IP=$(doctl compute droplet get "$DROPLET_ID" --format PublicIPv4 | tail -n 1)
for i in {1..30}; do
    if ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 dev@$IP exit 2>/dev/null; then
        echo -e "${GREEN}✓ Droplet is back online${NC}"
        break
    fi
    echo -n "."
    sleep 5
done
echo

echo -e "${GREEN}=== Snapshot Creation Complete ===${NC}"
echo -e "Snapshot ID: ${BLUE}$SNAPSHOT_ID${NC}"
echo -e "Snapshot Name: ${BLUE}$SNAPSHOT_NAME${NC}"
echo -e "Droplet is back online at: ${BLUE}$IP${NC}"
echo

# Update latest snapshot reference if this is a base snapshot
if [[ "$SNAPSHOT_NAME" == *"base"* ]]; then
    echo "$SNAPSHOT_ID" > .latest-snapshot-id
    echo "$SNAPSHOT_NAME" > .latest-snapshot-name
    echo -e "${GREEN}✓ Updated as latest base snapshot${NC}"
fi

echo -e "${YELLOW}You can now deploy new environments from this snapshot using:${NC}"
echo -e "${BLUE}./spin-up.sh my-new-env${NC}"