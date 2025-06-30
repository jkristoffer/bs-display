#!/bin/bash
# manage.sh - Main management script for bs-display VPS operations

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}=== BS-Display VPS Manager ===${NC}"
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

# Function to show current status
show_status() {
    echo -e "${YELLOW}Current Resources:${NC}"
    echo
    
    # Active droplets
    echo -e "${BLUE}Active Droplets:${NC}"
    ACTIVE_DROPLETS=$(doctl compute droplet list | grep "bs-display" || echo "No active droplets")
    echo "$ACTIVE_DROPLETS"
    echo
    
    # Available snapshots
    echo -e "${BLUE}Available Snapshots:${NC}"
    SNAPSHOTS=$(doctl compute snapshot list | grep "bs-display" || echo "No snapshots found")
    echo "$SNAPSHOTS"
    echo
    
    # Session info
    if [ -f "$SCRIPT_DIR/.last-session" ]; then
        echo -e "${BLUE}Last Session:${NC}"
        cat "$SCRIPT_DIR/.last-session"
        echo
    fi
    
    # Cost estimation
    DROPLET_COUNT=$(doctl compute droplet list | grep -c "bs-display" || echo "0")
    if [ "$DROPLET_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}💰 Estimated hourly cost: \$$(echo "scale=3; $DROPLET_COUNT * 0.036" | bc -l 2>/dev/null || echo "~0.04")/hour${NC}"
        echo
    fi
}

# Function to show help
show_help() {
    echo -e "${BLUE}BS-Display VPS Manager${NC}"
    echo
    echo "Usage: $0 [command] [options]"
    echo
    echo -e "${YELLOW}Main Commands:${NC}"
    echo "  status          Show current resources and status"
    echo "  deploy [name]   Deploy new development environment"
    echo "  connect [name]  Show SSH command for droplet"
    echo "  list            List all active droplets"
    echo "  cleanup         Clean up resources"
    echo "  costs           Comprehensive cost analysis & calculator"
    echo
    echo -e "${YELLOW}Advanced Commands:${NC}"
    echo "  create-base     Create new base snapshot"
    echo "  update          Update base snapshot"
    echo "  test            Run system tests"
    echo
    echo -e "${YELLOW}Examples:${NC}"
    echo "  $0 deploy feature-branch    # Create new dev environment"
    echo "  $0 connect feature-branch   # Get SSH command"
    echo "  $0 costs                    # Analyze costs & plan usage"
    echo "  $0 cleanup                  # Interactive cleanup"
    echo "  $0 update                   # Update base snapshot"
    echo
}

# Function to deploy environment
deploy_environment() {
    local name="${1:-dev-$(date +%s)}"
    echo -e "${YELLOW}Deploying environment: $name${NC}"
    cd "$SCRIPT_DIR"
    ./spin-up.sh "$name"
}

# Function to connect to droplet
connect_to_droplet() {
    local name="$1"
    
    if [ -z "$name" ]; then
        echo -e "${YELLOW}Available droplets:${NC}"
        doctl compute droplet list | grep -E "(bs-display|ID)"
        echo
        read -p "Enter droplet name: " name
    fi
    
    if [ -z "$name" ]; then
        echo -e "${RED}No droplet name provided${NC}"
        return 1
    fi
    
    # Get IP address
    IP=$(doctl compute droplet list | grep "$name" | awk '{print $3}' | head -1)
    
    if [ -z "$IP" ]; then
        echo -e "${RED}Droplet '$name' not found${NC}"
        return 1
    fi
    
    echo -e "${GREEN}Droplet found: $name at $IP${NC}"
    echo
    echo -e "${BLUE}SSH Command:${NC}"
    echo -e "${YELLOW}ssh dev@$IP${NC}"
    echo
    echo -e "${BLUE}Start Development Server:${NC}"
    echo -e "${YELLOW}ssh dev@$IP -t './start-dev.sh'${NC}"
    echo
    echo -e "${BLUE}Development URL:${NC}"
    echo -e "${YELLOW}http://$IP:4321${NC} (after starting dev server)"
    echo
    
    # Copy to clipboard if available
    if command -v pbcopy &> /dev/null; then
        echo "ssh dev@$IP" | pbcopy
        echo -e "${GREEN}✓ SSH command copied to clipboard${NC}"
    fi
}

# Function to show costs
show_costs() {
    echo -e "${YELLOW}💰 Cost Analysis:${NC}"
    echo
    
    # Current active droplets
    DROPLET_COUNT=$(doctl compute droplet list | grep -c "bs-display" || echo "0")
    SNAPSHOT_COUNT=$(doctl compute snapshot list | grep -c "bs-display" || echo "0")
    
    echo -e "${BLUE}Current Resources:${NC}"
    echo "  Active Droplets: $DROPLET_COUNT"
    echo "  Snapshots: $SNAPSHOT_COUNT"
    echo
    
    echo -e "${BLUE}Hourly Costs:${NC}"
    echo "  s-2vcpu-4gb: \$0.036/hour"
    echo "  s-1vcpu-2gb: \$0.024/hour"
    echo "  Current total: \$$(echo "scale=3; $DROPLET_COUNT * 0.036" | bc -l 2>/dev/null || echo "~0.04")/hour"
    echo
    
    echo -e "${BLUE}Monthly Costs:${NC}"
    echo "  Snapshot storage (~3GB): ~\$0.18/month"
    echo "  If left running 24/7: \$$(echo "scale=2; $DROPLET_COUNT * 26" | bc -l 2>/dev/null || echo "~26")/month"
    echo
    
    echo -e "${BLUE}Typical Usage:${NC}"
    echo "  4-hour dev session: ~\$0.18"
    echo "  8-hour work day: ~\$0.36"
    echo "  Weekly usage (20h): ~\$0.90"
    echo
    
    if [ "$DROPLET_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}💡 Remember to destroy droplets when not in use!${NC}"
        echo -e "   Run: ${BLUE}./manage.sh cleanup${NC}"
    fi
}

# Parse command line arguments
case "${1:-help}" in
    "status"|"-s"|"--status")
        show_status
        ;;
    "deploy"|"-d"|"--deploy")
        deploy_environment "$2"
        ;;
    "connect"|"-c"|"--connect")
        connect_to_droplet "$2"
        ;;
    "list"|"-l"|"--list")
        echo -e "${YELLOW}Active BS-Display Droplets:${NC}"
        doctl compute droplet list | grep -E "(bs-display|ID)" || echo "No bs-display droplets found"
        ;;
    "cleanup"|"--cleanup")
        cd "$SCRIPT_DIR"
        ./cleanup.sh
        ;;
    "update"|"-u"|"--update")
        echo -e "${YELLOW}Updating base snapshot...${NC}"
        cd "$SCRIPT_DIR"
        ./update-snapshot.sh
        ;;
    "create-base"|"--create-base")
        echo -e "${YELLOW}Creating new base snapshot...${NC}"
        cd "$SCRIPT_DIR"
        ./create-base-snapshot.sh
        ;;
    "test"|"--test")
        echo -e "${YELLOW}Running system tests...${NC}"
        cd "$SCRIPT_DIR"
        ./test-prerequisites.sh
        ./test-dry-run.sh
        ;;
    "costs"|"--costs")
        cd "$SCRIPT_DIR"
        ./cost-calculator.sh all
        ;;
    "help"|"-h"|"--help"|*)
        show_help
        ;;
esac