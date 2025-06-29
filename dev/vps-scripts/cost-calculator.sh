#!/bin/bash
# cost-calculator.sh - Calculate and display VPS costs

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Cost constants (per hour)
COST_S_1VCPU_1GB=0.007
COST_S_1VCPU_2GB=0.018
COST_S_2VCPU_2GB=0.024
COST_S_2VCPU_4GB=0.036
COST_S_4VCPU_8GB=0.071
COST_SNAPSHOT_PER_GB_MONTH=0.06

echo -e "${BLUE}${BOLD}=== BS-Display VPS Cost Calculator ===${NC}"
echo

# Function to get current resources
get_current_resources() {
    # Get active droplets
    ACTIVE_DROPLETS=$(doctl compute droplet list 2>/dev/null | grep "bs-display" || true)
    if [ -z "$ACTIVE_DROPLETS" ]; then
        DROPLET_COUNT=0
    else
        DROPLET_COUNT=$(echo "$ACTIVE_DROPLETS" | wc -l | tr -d ' ')
    fi
    
    # Get snapshots
    SNAPSHOTS=$(doctl compute snapshot list 2>/dev/null | grep "bs-display" || true)
    if [ -z "$SNAPSHOTS" ]; then
        SNAPSHOT_COUNT=0
    else
        SNAPSHOT_COUNT=$(echo "$SNAPSHOTS" | wc -l | tr -d ' ')
    fi
    
    # Calculate total snapshot size
    TOTAL_SNAPSHOT_SIZE=0
    if [ "$SNAPSHOT_COUNT" -gt 0 ] && [ -n "$SNAPSHOTS" ]; then
        while IFS= read -r line; do
            if [[ "$line" == *"bs-display"* ]] && [[ "$line" == *"GiB"* ]]; then
                SIZE=$(echo "$line" | awk '{print $(NF-1)}' | grep -o '[0-9.]*' | head -1)
                if [ -n "$SIZE" ]; then
                    TOTAL_SNAPSHOT_SIZE=$(echo "$TOTAL_SNAPSHOT_SIZE + $SIZE" | bc -l 2>/dev/null || echo "$TOTAL_SNAPSHOT_SIZE")
                fi
            fi
        done <<< "$SNAPSHOTS"
    fi
    
    # Ensure we have a valid number
    if [ -z "$TOTAL_SNAPSHOT_SIZE" ] || ! [[ "$TOTAL_SNAPSHOT_SIZE" =~ ^[0-9.]+$ ]]; then
        TOTAL_SNAPSHOT_SIZE=0
    fi
}

# Function to show current costs
show_current_costs() {
    echo -e "${CYAN}${BOLD}📊 CURRENT RESOURCES${NC}"
    echo -e "${CYAN}════════════════════${NC}"
    
    if [ "$DROPLET_COUNT" -eq 0 ]; then
        echo -e "🖥️  Active Droplets: ${GREEN}0 (No running costs!)${NC}"
    else
        echo -e "🖥️  Active Droplets: ${YELLOW}$DROPLET_COUNT${NC}"
        echo "$ACTIVE_DROPLETS" | while read -r line; do
            if [[ "$line" == *"bs-display"* ]]; then
                NAME=$(echo "$line" | awk '{print $2}')
                SIZE=$(echo "$line" | awk '{print $6,$7}')
                echo -e "   └─ ${BLUE}$NAME${NC} ($SIZE)"
            fi
        done
    fi
    
    echo -e "📸 Snapshots: ${BLUE}$SNAPSHOT_COUNT${NC} (~${TOTAL_SNAPSHOT_SIZE} GB)"
    if [ "$SNAPSHOT_COUNT" -gt 0 ]; then
        echo "$SNAPSHOTS" | while read -r line; do
            if [[ "$line" == *"bs-display"* ]]; then
                NAME=$(echo "$line" | awk '{print $2}')
                SIZE=$(echo "$line" | awk '{print $(NF-1), $NF}')
                echo -e "   └─ ${BLUE}$NAME${NC} ($SIZE)"
            fi
        done
    fi
    echo
}

# Function to calculate current costs
calculate_current_costs() {
    # Estimate hourly cost (assuming s-2vcpu-4gb for active droplets)
    CURRENT_HOURLY=$(echo "$DROPLET_COUNT * $COST_S_2VCPU_4GB" | bc -l 2>/dev/null || echo "0")
    CURRENT_DAILY=$(echo "$CURRENT_HOURLY * 24" | bc -l 2>/dev/null || echo "0")
    CURRENT_MONTHLY_DROPLETS=$(echo "$CURRENT_HOURLY * 24 * 30" | bc -l 2>/dev/null || echo "0")
    
    # Snapshot storage cost
    SNAPSHOT_MONTHLY=$(echo "$TOTAL_SNAPSHOT_SIZE * $COST_SNAPSHOT_PER_GB_MONTH" | bc -l 2>/dev/null || echo "0")
    
    # Total monthly
    TOTAL_MONTHLY=$(echo "$CURRENT_MONTHLY_DROPLETS + $SNAPSHOT_MONTHLY" | bc -l 2>/dev/null || echo "0")
    
    echo -e "${YELLOW}${BOLD}💰 CURRENT COSTS${NC}"
    echo -e "${YELLOW}═══════════════${NC}"
    
    if [ "$DROPLET_COUNT" -eq 0 ]; then
        echo -e "⚡ Hourly: ${GREEN}\$0.00${NC} (No active droplets)"
        echo -e "📅 Daily: ${GREEN}\$0.00${NC}"
    else
        printf "⚡ Hourly: ${YELLOW}\$%.3f${NC}\n" "$CURRENT_HOURLY"
        printf "📅 Daily: ${YELLOW}\$%.2f${NC}\n" "$CURRENT_DAILY"
    fi
    
    printf "📸 Snapshots: ${BLUE}\$%.2f/month${NC}\n" "$SNAPSHOT_MONTHLY"
    printf "📊 ${BOLD}Total Monthly: \$%.2f${NC}\n" "$TOTAL_MONTHLY"
    echo
}

# Function to show usage scenarios
show_usage_scenarios() {
    echo -e "${GREEN}${BOLD}🎯 USAGE SCENARIOS${NC}"
    echo -e "${GREEN}═════════════════${NC}"
    
    scenarios=(
        "Quick test (30 min),0.5,$COST_S_2VCPU_4GB"
        "Short session (2 hours),2,$COST_S_2VCPU_4GB"
        "Dev session (4 hours),4,$COST_S_2VCPU_4GB"
        "Work day (8 hours),8,$COST_S_2VCPU_4GB"
        "Full day (12 hours),12,$COST_S_2VCPU_4GB"
    )
    
    printf "%-25s %-8s %-10s\n" "Scenario" "Hours" "Cost"
    echo "────────────────────────────────────────────"
    
    for scenario in "${scenarios[@]}"; do
        IFS=',' read -r name hours rate <<< "$scenario"
        cost=$(echo "$hours * $rate" | bc -l 2>/dev/null || echo "0")
        printf "%-25s %-8s ${GREEN}\$%.3f${NC}\n" "$name" "$hours" "$cost"
    done
    echo
}

# Function to show monthly estimates
show_monthly_estimates() {
    echo -e "${CYAN}${BOLD}📈 MONTHLY ESTIMATES${NC}"
    echo -e "${CYAN}═══════════════════${NC}"
    
    estimates=(
        "Light usage (5h/week),20"
        "Regular usage (10h/week),40"
        "Heavy usage (20h/week),80"
        "Part-time (25h/week),100"
        "Full-time (40h/week),160"
    )
    
    printf "%-25s %-12s %-12s\n" "Usage Pattern" "Monthly Cost" "+ Storage"
    echo "──────────────────────────────────────────────────────────"
    
    for estimate in "${estimates[@]}"; do
        IFS=',' read -r name hours <<< "$estimate"
        monthly_droplet=$(echo "$hours * $COST_S_2VCPU_4GB" | bc -l 2>/dev/null || echo "0")
        total_with_storage=$(echo "$monthly_droplet + $SNAPSHOT_MONTHLY" | bc -l 2>/dev/null || echo "0")
        printf "%-25s ${CYAN}\$%-11.2f${NC} ${BLUE}\$%.2f${NC}\n" "$name" "$monthly_droplet" "$total_with_storage"
    done
    echo
}

# Function to show droplet sizes
show_droplet_sizes() {
    echo -e "${BLUE}${BOLD}🖥️  DROPLET SIZE PRICING${NC}"
    echo -e "${BLUE}═══════════════════════${NC}"
    
    sizes=(
        "s-1vcpu-1gb,1 vCPU / 1GB RAM,$COST_S_1VCPU_1GB"
        "s-1vcpu-2gb,1 vCPU / 2GB RAM,$COST_S_1VCPU_2GB"
        "s-2vcpu-2gb,2 vCPU / 2GB RAM,$COST_S_2VCPU_2GB"
        "s-2vcpu-4gb,2 vCPU / 4GB RAM,$COST_S_2VCPU_4GB"
        "s-4vcpu-8gb,4 vCPU / 8GB RAM,$COST_S_4VCPU_8GB"
    )
    
    printf "%-15s %-20s %-10s %-12s\n" "Size" "Specs" "Hourly" "Monthly*"
    echo "──────────────────────────────────────────────────────────────"
    
    for size in "${sizes[@]}"; do
        IFS=',' read -r slug specs hourly <<< "$size"
        monthly=$(echo "$hourly * 24 * 30" | bc -l 2>/dev/null || echo "0")
        printf "%-15s %-20s ${YELLOW}\$%-9.3f${NC} ${RED}\$%.2f${NC}\n" "$slug" "$specs" "$hourly" "$monthly"
    done
    echo -e "${YELLOW}* If left running 24/7 (not recommended!)${NC}"
    echo
}

# Function to show cost optimization tips
show_optimization_tips() {
    echo -e "${GREEN}${BOLD}💡 COST OPTIMIZATION TIPS${NC}"
    echo -e "${GREEN}═════════════════════════${NC}"
    echo -e "✅ ${GREEN}Always destroy droplets when done${NC} (saves 99% of costs)"
    echo -e "✅ ${BLUE}Use snapshots for preservation${NC} (only \$0.06/GB/month)"
    echo -e "✅ ${YELLOW}Start with smaller sizes${NC} (s-1vcpu-2gb for light work)"
    echo -e "✅ ${CYAN}Batch your development sessions${NC} (avoid frequent spin-up/down)"
    echo -e "✅ ${GREEN}Monitor costs with this script${NC} (run regularly)"
    echo
    echo -e "${YELLOW}🎯 Ideal pattern: Deploy → Work → Snapshot → Destroy${NC}"
    echo
}

# Function for interactive calculator
interactive_calculator() {
    echo -e "${BOLD}🧮 INTERACTIVE COST CALCULATOR${NC}"
    echo -e "${BOLD}═══════════════════════════════${NC}"
    
    echo "How many hours will you use VPS this month?"
    read -p "Hours per month: " hours
    
    echo
    echo "Select droplet size:"
    echo "1) s-1vcpu-2gb (\$0.018/hour) - Light development"
    echo "2) s-2vcpu-4gb (\$0.036/hour) - Regular development (recommended)"
    echo "3) s-4vcpu-8gb (\$0.071/hour) - Heavy development"
    read -p "Choice (1-3): " size_choice
    
    case $size_choice in
        1) rate=$COST_S_1VCPU_2GB; size_name="s-1vcpu-2gb" ;;
        2) rate=$COST_S_2VCPU_4GB; size_name="s-2vcpu-4gb" ;;
        3) rate=$COST_S_4VCPU_8GB; size_name="s-4vcpu-8gb" ;;
        *) rate=$COST_S_2VCPU_4GB; size_name="s-2vcpu-4gb" ;;
    esac
    
    droplet_cost=$(echo "$hours * $rate" | bc -l 2>/dev/null || echo "0")
    total_cost=$(echo "$droplet_cost + $SNAPSHOT_MONTHLY" | bc -l 2>/dev/null || echo "0")
    
    echo
    echo -e "${CYAN}📊 YOUR CUSTOM ESTIMATE:${NC}"
    echo "──────────────────────────"
    printf "Droplet size: ${BLUE}%s${NC}\n" "$size_name"
    printf "Usage: ${YELLOW}%s hours/month${NC}\n" "$hours"
    printf "Droplet cost: ${GREEN}\$%.2f${NC}\n" "$droplet_cost"
    printf "Snapshot storage: ${BLUE}\$%.2f${NC}\n" "$SNAPSHOT_MONTHLY"
    printf "${BOLD}Total monthly: \$%.2f${NC}\n" "$total_cost"
    echo
}

# Main function
main() {
    # Check if doctl is available
    if ! command -v doctl &> /dev/null; then
        echo -e "${RED}Error: doctl not found. Please install and authenticate first.${NC}"
        exit 1
    fi
    
    # Get current resources
    get_current_resources
    
    # Parse command line arguments
    case "${1:-summary}" in
        "current"|"-c"|"--current")
            show_current_costs
            calculate_current_costs
            ;;
        "scenarios"|"-s"|"--scenarios")
            show_usage_scenarios
            ;;
        "monthly"|"-m"|"--monthly")
            show_monthly_estimates
            ;;
        "sizes"|"--sizes")
            show_droplet_sizes
            ;;
        "tips"|"--tips")
            show_optimization_tips
            ;;
        "calc"|"--calculator")
            interactive_calculator
            ;;
        "all"|"--all")
            show_current_costs
            calculate_current_costs
            show_usage_scenarios
            show_monthly_estimates
            show_droplet_sizes
            show_optimization_tips
            ;;
        "help"|"-h"|"--help")
            echo -e "${BLUE}BS-Display VPS Cost Calculator${NC}"
            echo
            echo "Usage: $0 [command]"
            echo
            echo "Commands:"
            echo "  current       Show current resource costs"
            echo "  scenarios     Show cost scenarios for different usage"
            echo "  monthly       Show monthly cost estimates"
            echo "  sizes         Show droplet size pricing"
            echo "  tips          Show cost optimization tips"
            echo "  calc          Interactive cost calculator"
            echo "  all           Show all information"
            echo "  help          Show this help"
            echo
            echo "Examples:"
            echo "  $0            Quick summary (default)"
            echo "  $0 current    Current costs only"
            echo "  $0 calc       Interactive calculator"
            echo "  $0 all        Complete cost analysis"
            ;;
        *)
            # Default: show summary
            show_current_costs
            calculate_current_costs
            echo -e "${BOLD}Run with 'all' for complete analysis or 'calc' for interactive calculator${NC}"
            echo -e "${BLUE}Usage: $0 [current|scenarios|monthly|sizes|tips|calc|all|help]${NC}"
            ;;
    esac
}

# Run main function
main "$@"