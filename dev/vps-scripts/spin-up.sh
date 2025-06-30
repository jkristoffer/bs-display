#!/bin/bash
# spin-up.sh - Quick deployment script for development VPS

set -e

# Configuration
NAME="${1:-dev-$(date +%s)}"
REGION="${DO_REGION:-nyc3}"
SIZE="${DO_SIZE:-s-2vcpu-4gb}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== BS-Display Quick Deploy ===${NC}"
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

# Get latest snapshot
if [ -f .latest-snapshot-id ]; then
    SNAPSHOT_ID=$(cat .latest-snapshot-id)
    SNAPSHOT_NAME=$(cat .latest-snapshot-name 2>/dev/null || echo "unknown")
    echo -e "${YELLOW}Using snapshot: $SNAPSHOT_NAME${NC}"
else
    # Look for any bs-display snapshot (base, custom, etc.)
    SNAPSHOT_INFO=$(doctl compute snapshot list \
        --format ID,Name \
        --no-header | \
        grep "bs-display" | \
        sort -r -k2 | \
        head -1)
    
    if [ -z "$SNAPSHOT_INFO" ]; then
        echo -e "${RED}Error: No bs-display snapshots found. Run ./create-base-snapshot.sh first${NC}"
        exit 1
    fi
    
    SNAPSHOT_ID=$(echo "$SNAPSHOT_INFO" | awk '{print $1}')
    SNAPSHOT_NAME=$(echo "$SNAPSHOT_INFO" | awk '{print $2}')
    echo -e "${YELLOW}Found snapshot: $SNAPSHOT_NAME ($SNAPSHOT_ID)${NC}"
fi

# Get SSH key
SSH_KEY_ID=$(doctl compute ssh-key list --format ID --no-header | head -1)
if [ -z "$SSH_KEY_ID" ]; then
    echo -e "${RED}Error: No SSH keys found in DigitalOcean${NC}"
    exit 1
fi

# Cloud-init for quick setup
USER_DATA=$(cat << 'EOF'
#!/bin/bash
# Quick boot setup
sudo -u dev bash << 'DEVEOF'
cd /opt/bs-display/dev

# Pull latest code if possible
if ping -c 1 github.com &> /dev/null; then
    echo "Updating to latest code..."
    git pull origin main || true
    npm install || true
fi

# Create session indicator
echo "Session: $(hostname)" > ~/current-session.txt
echo "Started: $(date)" >> ~/current-session.txt

DEVEOF

# Update motd with current info
cat > /etc/motd << EOF
=====================================
✅ BS-Display Development Environment
=====================================
🏷️  Session: $(hostname)
📅 Started: $(date)
📁 Project: /opt/bs-display/dev
🚀 Start dev: ./start-dev.sh
🔄 Update: ./update-project.sh
🤖 Claude: claude --help
🔥 Auto-start: sudo systemctl start astro-dev
=====================================
echo "Quick setup complete at $(date)"
EOF
)

# Create the droplet
echo -e "${YELLOW}Creating droplet: $NAME${NC}"
echo -n "  "

DROPLET_ID=$(doctl compute droplet create "$NAME" \
    --image "$SNAPSHOT_ID" \
    --size "$SIZE" \
    --region "$REGION" \
    --ssh-keys "$SSH_KEY_ID" \
    --user-data "$USER_DATA" \
    --tag-names "bs-display,development" \
    --wait \
    --format ID \
    --no-header | tr -d '\n')

echo -e "${YELLOW}Debug: Droplet ID = '$DROPLET_ID'${NC}"

if [ -z "$DROPLET_ID" ] || [ "$DROPLET_ID" = "ID" ]; then
    echo -e "${RED}Error: Failed to get droplet ID${NC}"
    exit 1
fi

# Get IP
IP=$(doctl compute droplet get "$DROPLET_ID" --format PublicIPv4 --no-header | tr -d '\n')

echo -e "${YELLOW}Debug: IP = '$IP'${NC}"

echo -e "${GREEN}✓ Droplet created!${NC}"

# Wait for SSH to be ready
echo -e "${YELLOW}Waiting for SSH...${NC}"
echo -n "  "
while ! ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 dev@$IP exit 2>/dev/null; do
    echo -n "."
    sleep 3
done
echo

# Test the setup
echo -e "${YELLOW}Testing environment...${NC}"
if ssh -o StrictHostKeyChecking=no dev@$IP "cd /opt/bs-display/dev && npm --version" &>/dev/null; then
    echo -e "${GREEN}✓ Environment ready${NC}"
else
    echo -e "${YELLOW}⚠ Environment may need a moment to finish setup${NC}"
fi

echo
echo -e "${GREEN}=== Your development environment is ready! ===${NC}"
echo
echo -e "${BLUE}Connection Info:${NC}"
echo -e "  SSH: ${YELLOW}ssh dev@$IP${NC}"
echo -e "  Web: ${YELLOW}http://$IP:4321${NC} (after starting dev server)"
echo
echo -e "${BLUE}Quick Commands:${NC}"
echo -e "  Connect: ${YELLOW}ssh dev@$IP${NC}"
echo -e "  Start dev: ${YELLOW}ssh dev@$IP './start-dev.sh'${NC}"
echo -e "  One-liner: ${YELLOW}ssh dev@$IP -t './start-dev.sh'${NC}"
echo
echo -e "${BLUE}Management:${NC}"
echo -e "  Droplet ID: ${YELLOW}$DROPLET_ID${NC}"
echo -e "  Destroy: ${YELLOW}doctl compute droplet delete $NAME --force${NC}"
echo -e "  List all: ${YELLOW}doctl compute droplet list --tag-name bs-display${NC}"
echo

# Copy SSH command to clipboard if available
if command -v pbcopy &> /dev/null; then
    echo "ssh dev@$IP" | pbcopy
    echo -e "${GREEN}✓ SSH command copied to clipboard${NC}"
fi

# Save session info
cat > .last-session << EOF
NAME=$NAME
IP=$IP
DROPLET_ID=$DROPLET_ID
CREATED=$(date)
EOF

echo -e "${YELLOW}Session info saved to .last-session${NC}"