#!/bin/bash
# cleanup.sh - Clean up bs-display VPS resources

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== BS-Display VPS Cleanup Tool ===${NC}"
echo

# Check dependencies
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}Error: doctl not found${NC}"
    exit 1
fi

if ! doctl auth list &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with DigitalOcean${NC}"
    exit 1
fi

# Function to list resources
list_resources() {
    echo -e "${YELLOW}Current BS-Display resources:${NC}"
    echo
    
    # List droplets
    echo -e "${BLUE}Droplets:${NC}"
    DROPLETS=$(doctl compute droplet list | grep -E "(bs-display|ID)" || echo "No bs-display droplets found")
    echo "$DROPLETS"
    echo
    
    # List snapshots
    echo -e "${BLUE}Snapshots:${NC}"
    SNAPSHOTS=$(doctl compute snapshot list | grep -E "(bs-display|ID)" || echo "No bs-display snapshots found")
    echo "$SNAPSHOTS"
    echo
}

# Function to cleanup droplets
cleanup_droplets() {
    echo -e "${YELLOW}Cleaning up droplets...${NC}"
    
    DROPLET_IDS=$(doctl compute droplet list --format ID,Name | grep "bs-display" | awk '{print $1}' || true)
    
    if [ -z "$DROPLET_IDS" ]; then
        echo -e "${GREEN}✓ No bs-display droplets to clean up${NC}"
        return
    fi
    
    echo "Found droplets to delete:"
    doctl compute droplet list | grep "bs-display"
    echo
    
    if [ "$1" != "--force" ]; then
        read -p "Delete ALL bs-display droplets? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Skipping droplet cleanup${NC}"
            return
        fi
    fi
    
    echo "$DROPLET_IDS" | while read -r droplet_id; do
        if [ -n "$droplet_id" ]; then
            DROPLET_NAME=$(doctl compute droplet get "$droplet_id" --format Name | tail -n 1)
            echo -e "  Deleting droplet: ${YELLOW}$DROPLET_NAME${NC} (ID: $droplet_id)"
            doctl compute droplet delete "$droplet_id" --force
        fi
    done
    
    echo -e "${GREEN}✓ Droplets cleaned up${NC}"
}

# Function to cleanup old snapshots (keep latest N)
cleanup_old_snapshots() {
    local keep_count=${1:-3}
    echo -e "${YELLOW}Cleaning up old snapshots (keeping latest $keep_count)...${NC}"
    
    OLD_SNAPSHOTS=$(doctl compute snapshot list --format ID,Name --no-header | \
        grep "bs-display" | \
        sort -k2 -r | \
        tail -n +$((keep_count + 1)) | \
        awk '{print $1}' || true)
    
    if [ -z "$OLD_SNAPSHOTS" ]; then
        echo -e "${GREEN}✓ No old snapshots to clean up${NC}"
        return
    fi
    
    echo "Found old snapshots to delete:"
    echo "$OLD_SNAPSHOTS" | while read -r snapshot_id; do
        if [ -n "$snapshot_id" ]; then
            SNAPSHOT_NAME=$(doctl compute snapshot get "$snapshot_id" --format Name --no-header)
            echo "  - $SNAPSHOT_NAME (ID: $snapshot_id)"
        fi
    done
    echo
    
    if [ "$2" != "--force" ]; then
        read -p "Delete old snapshots? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Skipping snapshot cleanup${NC}"
            return
        fi
    fi
    
    echo "$OLD_SNAPSHOTS" | while read -r snapshot_id; do
        if [ -n "$snapshot_id" ]; then
            SNAPSHOT_NAME=$(doctl compute snapshot get "$snapshot_id" --format Name --no-header)
            echo -e "  Deleting snapshot: ${YELLOW}$SNAPSHOT_NAME${NC} (ID: $snapshot_id)"
            doctl compute snapshot delete "$snapshot_id" --force
        fi
    done
    
    echo -e "${GREEN}✓ Old snapshots cleaned up${NC}"
}

# Function for interactive cleanup
interactive_cleanup() {
    while true; do
        echo -e "${BLUE}Choose cleanup option:${NC}"
        echo "1. List all resources"
        echo "2. Delete specific droplet"
        echo "3. Delete all droplets"
        echo "4. Clean up old snapshots (keep latest 3)"
        echo "5. Keep only most recent snapshot"
        echo "6. Emergency cleanup (delete everything)"
        echo "7. Exit"
        echo
        read -p "Enter choice (1-7): " choice
        
        case $choice in
            1)
                list_resources
                ;;
            2)
                echo -e "${YELLOW}Available droplets:${NC}"
                doctl compute droplet list | grep -E "(bs-display|ID)"
                echo
                read -p "Enter droplet ID to delete: " droplet_id
                if [ -n "$droplet_id" ]; then
                    doctl compute droplet delete "$droplet_id" --force
                    echo -e "${GREEN}✓ Droplet deleted${NC}"
                fi
                ;;
            3)
                cleanup_droplets
                ;;
            4)
                cleanup_old_snapshots 3
                ;;
            5)
                echo -e "${YELLOW}⚠ This will keep only the most recent snapshot and delete all others!${NC}"
                cleanup_old_snapshots 1
                ;;
            6)
                echo -e "${RED}⚠ Emergency cleanup will delete ALL bs-display resources!${NC}"
                read -p "Are you sure? Type 'yes' to confirm: " confirm
                if [ "$confirm" = "yes" ]; then
                    cleanup_droplets --force
                    cleanup_old_snapshots 0 --force
                    echo -e "${GREEN}✓ Emergency cleanup complete${NC}"
                fi
                ;;
            7)
                echo -e "${GREEN}Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid choice${NC}"
                ;;
        esac
        echo
    done
}

# Parse command line arguments
case "${1:-interactive}" in
    "list"|"-l"|"--list")
        list_resources
        ;;
    "droplets"|"-d"|"--droplets")
        cleanup_droplets "$2"
        ;;
    "snapshots"|"-s"|"--snapshots")
        cleanup_old_snapshots "${2:-3}" "$3"
        ;;
    "snapshots-keep-latest"|"--snapshots-keep-latest")
        echo -e "${YELLOW}Keeping only the most recent snapshot...${NC}"
        cleanup_old_snapshots 1 "$2"
        ;;
    "all"|"--all")
        echo -e "${YELLOW}Cleaning up all bs-display resources...${NC}"
        cleanup_droplets "$2"
        cleanup_old_snapshots 2 "$2"
        ;;
    "emergency"|"--emergency")
        echo -e "${RED}⚠ Emergency cleanup - deleting ALL bs-display resources!${NC}"
        if [ "$2" = "--force" ]; then
            cleanup_droplets --force
            cleanup_old_snapshots 0 --force
        else
            read -p "Are you sure? Type 'yes' to confirm: " confirm
            if [ "$confirm" = "yes" ]; then
                cleanup_droplets --force
                cleanup_old_snapshots 0 --force
            fi
        fi
        ;;
    "help"|"-h"|"--help")
        echo -e "${BLUE}BS-Display VPS Cleanup Tool${NC}"
        echo
        echo "Usage: $0 [command] [options]"
        echo
        echo "Commands:"
        echo "  list                    List all bs-display resources"
        echo "  droplets [--force]      Delete all bs-display droplets"
        echo "  snapshots [N] [--force] Clean old snapshots (keep latest N, default 3)"
        echo "  snapshots-keep-latest [--force] Keep only the most recent snapshot"
        echo "  all [--force]           Clean droplets + old snapshots"
        echo "  emergency [--force]     Delete everything (dangerous!)"
        echo "  help                    Show this help"
        echo
        echo "Examples:"
        echo "  $0                      Interactive mode"
        echo "  $0 list                 List resources"
        echo "  $0 droplets             Delete all droplets (with confirmation)"
        echo "  $0 droplets --force     Delete all droplets (no confirmation)"
        echo "  $0 snapshots 5          Keep latest 5 snapshots"
        echo "  $0 snapshots-keep-latest Keep only the most recent snapshot"
        echo "  $0 emergency --force    Nuclear option (delete everything)"
        echo
        ;;
    "interactive"|*)
        interactive_cleanup
        ;;
esac