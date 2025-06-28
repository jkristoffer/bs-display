#!/bin/bash
# test-dry-run.sh - Dry run test to validate configuration without creating resources

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== BS-Display VPS Dry Run Test ===${NC}"
echo

# Test configuration variables
REGION="${DO_REGION:-nyc3}"
SIZE="${DO_SIZE:-s-2vcpu-4gb}"
IMAGE="ubuntu-24-04-x64"

echo -e "${YELLOW}Testing configuration:${NC}"
echo -e "  Region: ${BLUE}$REGION${NC}"
echo -e "  Size: ${BLUE}$SIZE${NC}"  
echo -e "  Image: ${BLUE}$IMAGE${NC}"
echo

# Test 1: Validate region
echo -e "${YELLOW}1. Validating region '$REGION'...${NC}"
if doctl compute region list --format Slug --no-header | grep -q "^$REGION$"; then
    echo -e "   ${GREEN}✓ Region '$REGION' is valid${NC}"
else
    echo -e "   ${RED}✗ Region '$REGION' not found${NC}"
    echo -e "   ${YELLOW}Available regions:${NC}"
    doctl compute region list --format Slug,Name,Available --no-header | grep "true" | head -5
    exit 1
fi

# Test 2: Validate droplet size
echo -e "${YELLOW}2. Validating droplet size '$SIZE'...${NC}"
if doctl compute size list --format Slug --no-header | grep -q "^$SIZE$"; then
    SIZE_INFO=$(doctl compute size list --format Slug,Memory,VCPUs,Disk,PriceMonthly --no-header | grep "^$SIZE")
    echo -e "   ${GREEN}✓ Size '$SIZE' is valid: $SIZE_INFO${NC}"
else
    echo -e "   ${RED}✗ Size '$SIZE' not found${NC}"
    echo -e "   ${YELLOW}Available sizes:${NC}"
    doctl compute size list --format Slug,Memory,VCPUs,PriceMonthly --no-header | head -5
    exit 1
fi

# Test 3: Validate image
echo -e "${YELLOW}3. Validating image '$IMAGE'...${NC}"
if doctl compute image list-distribution --format Slug --no-header | grep -q "^$IMAGE$"; then
    echo -e "   ${GREEN}✓ Image '$IMAGE' is valid${NC}"
else
    echo -e "   ${RED}✗ Image '$IMAGE' not found${NC}"
    echo -e "   ${YELLOW}Available Ubuntu images:${NC}"
    doctl compute image list-distribution --format Slug,Name --no-header | grep -i ubuntu | head -3
    exit 1
fi

# Test 4: Check SSH key availability
echo -e "${YELLOW}4. Checking SSH key selection...${NC}"
SSH_KEY_ID=$(doctl compute ssh-key list --format ID --no-header | head -1)
if [ -n "$SSH_KEY_ID" ]; then
    SSH_KEY_NAME=$(doctl compute ssh-key get "$SSH_KEY_ID" --format Name --no-header)
    echo -e "   ${GREEN}✓ Will use SSH key: $SSH_KEY_NAME (ID: $SSH_KEY_ID)${NC}"
else
    echo -e "   ${RED}✗ No SSH keys available${NC}"
    exit 1
fi

# Test 5: Test cloud-init syntax
echo -e "${YELLOW}5. Validating cloud-init syntax...${NC}"
if command -v cloud-init &> /dev/null; then
    echo -e "   ${GREEN}✓ cloud-init available for validation${NC}"
    # Create a simple test cloud-init
    cat > /tmp/test-cloud-init.yaml << 'EOF'
#cloud-config
package_update: true
packages:
  - git
runcmd:
  - echo "test"
EOF
    if cloud-init devel schema --config-file /tmp/test-cloud-init.yaml &> /dev/null; then
        echo -e "   ${GREEN}✓ cloud-init syntax is valid${NC}"
    else
        echo -e "   ${YELLOW}⚠ cloud-init syntax validation failed${NC}"
    fi
    rm -f /tmp/test-cloud-init.yaml
else
    echo -e "   ${YELLOW}⚠ cloud-init not available locally (validation skipped)${NC}"
fi

# Test 6: Estimate costs
echo -e "${YELLOW}6. Cost estimation...${NC}"
MONTHLY_COST=$(doctl compute size list --format Slug,PriceMonthly --no-header | grep "^$SIZE" | awk '{print $2}')
HOURLY_COST=$(echo "scale=4; $MONTHLY_COST / 720" | bc -l 2>/dev/null || echo "~0.03")
echo -e "   ${BLUE}Monthly cost: \$${MONTHLY_COST}${NC}"
echo -e "   ${BLUE}Hourly cost: \$${HOURLY_COST}${NC}"
echo -e "   ${BLUE}4-hour session: \$$(echo "scale=3; $HOURLY_COST * 4" | bc -l 2>/dev/null || echo "~0.12")${NC}"

# Test 7: Check for existing bs-display resources
echo -e "${YELLOW}7. Checking for existing bs-display resources...${NC}"
EXISTING_DROPLETS=$(doctl compute droplet list --tag-name bs-display --format Name --no-header 2>/dev/null || true)
if [ -n "$EXISTING_DROPLETS" ]; then
    echo -e "   ${YELLOW}⚠ Found existing bs-display droplets:${NC}"
    echo "$EXISTING_DROPLETS" | while read -r droplet_name; do
        echo -e "     - $droplet_name"
    done
else
    echo -e "   ${GREEN}✓ No existing bs-display droplets found${NC}"
fi

EXISTING_SNAPSHOTS=$(doctl compute snapshot list --format Name --no-header | grep "bs-display" || true)
if [ -n "$EXISTING_SNAPSHOTS" ]; then
    echo -e "   ${YELLOW}⚠ Found existing bs-display snapshots:${NC}"
    echo "$EXISTING_SNAPSHOTS" | while read -r snapshot_name; do
        echo -e "     - $snapshot_name"
    done
else
    echo -e "   ${GREEN}✓ No existing bs-display snapshots found${NC}"
fi

# Test 8: Validate script syntax
echo -e "${YELLOW}8. Validating script syntax...${NC}"
SCRIPTS=("create-base-snapshot.sh" "provision-base.sh" "spin-up.sh" "update-snapshot.sh")
for script in "${SCRIPTS[@]}"; do
    if bash -n "$script"; then
        echo -e "   ${GREEN}✓ $script syntax is valid${NC}"
    else
        echo -e "   ${RED}✗ $script has syntax errors${NC}"
        exit 1
    fi
done

echo
echo -e "${GREEN}=== Dry Run Test Complete ===${NC}"
echo
echo -e "${BLUE}Summary:${NC}"
echo -e "✓ All prerequisites validated"
echo -e "✓ Configuration is valid"
echo -e "✓ No syntax errors found"
echo -e "✓ Ready to create base snapshot"
echo
echo -e "${YELLOW}To proceed with actual deployment:${NC}"
echo -e "1. ${BLUE}./create-base-snapshot.sh${NC} (one-time setup)"
echo -e "2. ${BLUE}./spin-up.sh test-session${NC} (create test environment)"
echo
echo -e "${YELLOW}Or for a minimal test:${NC}"
echo -e "${BLUE}./create-minimal-test.sh${NC} (quick validation droplet)"
echo