#!/bin/bash
# create-minimal-test.sh - Creates a minimal test droplet to validate basic functionality

set -e

# Configuration
DROPLET_NAME="bs-display-test-$(date +%Y%m%d-%H%M)"
REGION="${DO_REGION:-nyc3}"
SIZE="s-1vcpu-1gb"  # Smallest size for testing
IMAGE="ubuntu-24-04-x64"
TIMEOUT=300  # 5 minutes

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== BS-Display Minimal Test ===${NC}"
echo -e "${YELLOW}Creating minimal test droplet to validate setup...${NC}"
echo

# Check prerequisites
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}Error: doctl not found${NC}"
    exit 1
fi

if ! doctl auth list &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with DigitalOcean${NC}"
    exit 1
fi

# Get SSH key
SSH_KEY_ID=$(doctl compute ssh-key list --format ID --no-header | head -1)
if [ -z "$SSH_KEY_ID" ]; then
    echo -e "${RED}Error: No SSH keys found${NC}"
    exit 1
fi

echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Name: ${BLUE}$DROPLET_NAME${NC}"
echo -e "  Region: ${BLUE}$REGION${NC}"
echo -e "  Size: ${BLUE}$SIZE${NC}"
echo -e "  SSH Key: ${BLUE}$SSH_KEY_ID${NC}"
echo

# Minimal user-data for testing
USER_DATA=$(cat << 'EOF'
#!/bin/bash
# Minimal test setup
exec > >(tee -a /var/log/test-setup.log)
exec 2>&1

echo "=== Minimal Test Setup Started at $(date) ==="

# Update system
apt-get update
apt-get install -y nodejs npm git

# Test Node.js
node --version > /tmp/node-version.txt
npm --version > /tmp/npm-version.txt

# Test git
git --version > /tmp/git-version.txt

# Create test user
useradd -m -s /bin/bash testuser
echo "testuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Copy SSH keys
mkdir -p /home/testuser/.ssh
if [ -f /root/.ssh/authorized_keys ]; then
    cp /root/.ssh/authorized_keys /home/testuser/.ssh/
    chown -R testuser:testuser /home/testuser/.ssh
    chmod 700 /home/testuser/.ssh
    chmod 600 /home/testuser/.ssh/authorized_keys
fi

# Test network connectivity
ping -c 1 github.com > /tmp/github-ping.txt 2>&1 || echo "GitHub ping failed" > /tmp/github-ping.txt

# Signal completion
touch /tmp/test-complete
echo "=== Minimal Test Setup Completed at $(date) ==="
EOF
)

# Create droplet
echo -e "${YELLOW}Creating test droplet...${NC}"
DROPLET_ID=$(doctl compute droplet create "$DROPLET_NAME" \
    --image "$IMAGE" \
    --size "$SIZE" \
    --region "$REGION" \
    --ssh-keys "$SSH_KEY_ID" \
    --user-data "$USER_DATA" \
    --wait \
    --format ID \
    --no-header)

# Get IP
IP=$(doctl compute droplet get "$DROPLET_ID" --format PublicIPv4 --no-header)
echo -e "${GREEN}✓ Test droplet created at $IP${NC}"

# Wait for SSH
echo -e "${YELLOW}Waiting for SSH to be ready...${NC}"
SSH_READY=false
for i in $(seq 1 30); do
    if ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 root@$IP exit 2>/dev/null; then
        SSH_READY=true
        break
    fi
    echo -n "."
    sleep 5
done
echo

if [ "$SSH_READY" = false ]; then
    echo -e "${RED}✗ SSH connection failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ SSH connection successful${NC}"

# Wait for setup completion
echo -e "${YELLOW}Waiting for setup completion...${NC}"
SETUP_COMPLETE=false
for i in $(seq 1 60); do
    if ssh -o StrictHostKeyChecking=no root@$IP "test -f /tmp/test-complete" 2>/dev/null; then
        SETUP_COMPLETE=true
        break
    fi
    echo -n "."
    sleep 5
done
echo

if [ "$SETUP_COMPLETE" = false ]; then
    echo -e "${YELLOW}⚠ Setup may still be running. Checking status...${NC}"
else
    echo -e "${GREEN}✓ Setup completed${NC}"
fi

# Run tests
echo -e "${YELLOW}Running validation tests...${NC}"

# Test 1: Check versions
echo -e "${BLUE}Testing installed software versions...${NC}"
NODE_VERSION=$(ssh -o StrictHostKeyChecking=no root@$IP "cat /tmp/node-version.txt 2>/dev/null" || echo "Not found")
NPM_VERSION=$(ssh -o StrictHostKeyChecking=no root@$IP "cat /tmp/npm-version.txt 2>/dev/null" || echo "Not found")
GIT_VERSION=$(ssh -o StrictHostKeyChecking=no root@$IP "cat /tmp/git-version.txt 2>/dev/null" || echo "Not found")

echo -e "  Node.js: ${GREEN}$NODE_VERSION${NC}"
echo -e "  npm: ${GREEN}$NPM_VERSION${NC}"
echo -e "  Git: ${GREEN}$GIT_VERSION${NC}"

# Test 2: Check connectivity
echo -e "${BLUE}Testing network connectivity...${NC}"
GITHUB_TEST=$(ssh -o StrictHostKeyChecking=no root@$IP "cat /tmp/github-ping.txt 2>/dev/null" || echo "Test failed")
if echo "$GITHUB_TEST" | grep -q "1 packets transmitted, 1 received"; then
    echo -e "  GitHub: ${GREEN}✓ Reachable${NC}"
else
    echo -e "  GitHub: ${YELLOW}⚠ May have connectivity issues${NC}"
fi

# Test 3: Test user creation
echo -e "${BLUE}Testing user setup...${NC}"
if ssh -o StrictHostKeyChecking=no testuser@$IP "whoami" 2>/dev/null | grep -q "testuser"; then
    echo -e "  Test user: ${GREEN}✓ Created and accessible${NC}"
else
    echo -e "  Test user: ${YELLOW}⚠ Issues with user setup${NC}"
fi

# Test 4: Test sudo access
if ssh -o StrictHostKeyChecking=no testuser@$IP "sudo whoami" 2>/dev/null | grep -q "root"; then
    echo -e "  Sudo access: ${GREEN}✓ Working${NC}"
else
    echo -e "  Sudo access: ${YELLOW}⚠ Issues with sudo${NC}"
fi

# Show logs if there were issues
echo -e "${BLUE}Checking setup logs...${NC}"
SETUP_LOG=$(ssh -o StrictHostKeyChecking=no root@$IP "tail -10 /var/log/test-setup.log 2>/dev/null" || echo "No logs available")
if echo "$SETUP_LOG" | grep -q "Completed"; then
    echo -e "  Setup logs: ${GREEN}✓ Completed successfully${NC}"
else
    echo -e "  ${YELLOW}Recent log entries:${NC}"
    echo "$SETUP_LOG" | sed 's/^/    /'
fi

echo
echo -e "${GREEN}=== Test Results Summary ===${NC}"
echo -e "Droplet ID: ${BLUE}$DROPLET_ID${NC}"
echo -e "IP Address: ${BLUE}$IP${NC}"
echo -e "SSH (root): ${YELLOW}ssh root@$IP${NC}"
echo -e "SSH (user): ${YELLOW}ssh testuser@$IP${NC}"
echo

# Cleanup prompt
echo -e "${YELLOW}Test droplet is running and will incur charges.${NC}"
echo -e "${BLUE}To clean up:${NC} ${YELLOW}doctl compute droplet delete $DROPLET_NAME --force${NC}"
echo
read -p "Delete test droplet now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deleting test droplet...${NC}"
    doctl compute droplet delete "$DROPLET_ID" --force
    echo -e "${GREEN}✓ Test droplet deleted${NC}"
else
    echo -e "${YELLOW}Test droplet preserved. Remember to delete it manually.${NC}"
fi

echo
echo -e "${GREEN}✓ Minimal test completed successfully!${NC}"
echo -e "${BLUE}If all tests passed, you can proceed with:${NC}"
echo -e "  ${YELLOW}./create-base-snapshot.sh${NC}"