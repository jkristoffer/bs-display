#!/bin/bash
# test-prerequisites.sh - Verify all prerequisites before running main scripts

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== BS-Display VPS Prerequisites Test ===${NC}"
echo

# Test 1: Check doctl installation
echo -e "${YELLOW}1. Checking doctl installation...${NC}"
if command -v doctl &> /dev/null; then
    DOCTL_VERSION=$(doctl version | head -1)
    echo -e "   ${GREEN}✓ doctl found: $DOCTL_VERSION${NC}"
else
    echo -e "   ${RED}✗ doctl not found${NC}"
    echo -e "   ${YELLOW}Install with: brew install doctl${NC}"
    exit 1
fi

# Test 2: Check doctl authentication
echo -e "${YELLOW}2. Checking doctl authentication...${NC}"
if doctl auth list &> /dev/null; then
    CURRENT_CONTEXT=$(doctl auth list 2>/dev/null | awk 'NR>1 && NF>0 {print $1; exit}' || echo "authenticated")
    echo -e "   ${GREEN}✓ Authenticated as: $CURRENT_CONTEXT${NC}"
else
    echo -e "   ${RED}✗ Not authenticated${NC}"
    echo -e "   ${YELLOW}Run: doctl auth init${NC}"
    exit 1
fi

# Test 3: Check API connectivity
echo -e "${YELLOW}3. Testing DigitalOcean API connectivity...${NC}"
if doctl account get &> /dev/null; then
    ACCOUNT_EMAIL=$(doctl account get 2>/dev/null | awk 'NR>1 && NF>1 {print $2; exit}' || echo "verified")
    echo -e "   ${GREEN}✓ API connection successful: $ACCOUNT_EMAIL${NC}"
else
    echo -e "   ${RED}✗ API connection failed${NC}"
    echo -e "   ${YELLOW}Check your API token and network connection${NC}"
    exit 1
fi

# Test 4: Check SSH keys
echo -e "${YELLOW}4. Checking SSH keys...${NC}"
SSH_KEYS=$(doctl compute ssh-key list 2>/dev/null | awk 'NR>1 && NF>1 {print $1, $2}')
if [ -n "$SSH_KEYS" ]; then
    SSH_KEY_COUNT=$(echo "$SSH_KEYS" | wc -l | tr -d ' ')
    echo -e "   ${GREEN}✓ Found $SSH_KEY_COUNT SSH key(s):${NC}"
    echo "$SSH_KEYS" | while read -r key_info; do
        echo -e "     - $key_info"
    done
else
    echo -e "   ${YELLOW}⚠ No SSH keys found in DigitalOcean${NC}"
    echo -e "   ${YELLOW}Checking local SSH keys...${NC}"
    
    if [ -f ~/.ssh/id_rsa.pub ]; then
        echo -e "   ${GREEN}✓ Found local RSA key: ~/.ssh/id_rsa.pub${NC}"
        echo -e "   ${YELLOW}You can add it with:${NC}"
        echo -e "   ${BLUE}doctl compute ssh-key create my-key --public-key-file ~/.ssh/id_rsa.pub${NC}"
    elif [ -f ~/.ssh/id_ed25519.pub ]; then
        echo -e "   ${GREEN}✓ Found local Ed25519 key: ~/.ssh/id_ed25519.pub${NC}"
        echo -e "   ${YELLOW}You can add it with:${NC}"
        echo -e "   ${BLUE}doctl compute ssh-key create my-key --public-key-file ~/.ssh/id_ed25519.pub${NC}"
    else
        echo -e "   ${YELLOW}No local SSH keys found. Generate with:${NC}"
        echo -e "   ${BLUE}ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519${NC}"
        exit 1
    fi
fi

# Test 5: Check available regions
echo -e "${YELLOW}5. Checking available regions...${NC}"
REGIONS=$(doctl compute region list 2>/dev/null | awk 'NR>1 && $3=="true" {print $1, $2; count++} count>=3 {exit}')
echo -e "   ${GREEN}✓ Available regions (showing first 3):${NC}"
echo "$REGIONS" | while read -r region_info; do
    echo -e "     - $region_info"
done

# Test 6: Check available sizes
echo -e "${YELLOW}6. Checking available droplet sizes...${NC}"
SIZES=$(doctl compute size list 2>/dev/null | awk 'NR>1 && $1 ~ /(s-1vcpu|s-2vcpu|s-4vcpu)/ {print $1, $2"MB", $3"vcpu", $4"GB"; count++} count>=3 {exit}')
echo -e "   ${GREEN}✓ Recommended sizes:${NC}"
echo "$SIZES" | while read -r size_info; do
    echo -e "     - $size_info"
done

# Test 7: Check GitHub connectivity
echo -e "${YELLOW}7. Testing GitHub connectivity...${NC}"
if ping -c 1 github.com &> /dev/null; then
    echo -e "   ${GREEN}✓ GitHub is reachable${NC}"
else
    echo -e "   ${YELLOW}⚠ GitHub ping failed (may be firewall/network)${NC}"
fi

# Test 8: Verify repository exists
echo -e "${YELLOW}8. Checking repository accessibility...${NC}"
if curl -s --head https://github.com/kristoffersanio/bs-display | head -1 | grep -q "200 OK"; then
    echo -e "   ${GREEN}✓ Repository is accessible${NC}"
else
    echo -e "   ${YELLOW}⚠ Repository check failed (may be private or doesn't exist)${NC}"
    echo -e "   ${YELLOW}Make sure the repository URL in provision-base.sh is correct${NC}"
fi

echo
echo -e "${GREEN}=== Prerequisites Test Complete ===${NC}"
echo
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. ${YELLOW}Run a dry-run test: ./test-dry-run.sh${NC}"
echo -e "2. ${YELLOW}Create base snapshot: ./create-base-snapshot.sh${NC}"
echo -e "3. ${YELLOW}Quick deploy: ./spin-up.sh test-session${NC}"
echo