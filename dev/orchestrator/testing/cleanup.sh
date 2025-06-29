#!/bin/bash
# AI Task Compiler Template Test Cleanup Script
# 
# Cleans up test outputs based on results and configuration

# Configuration
KEEP_RESULTS=true
KEEP_SUCCESSFUL_OUTPUTS=false
ARCHIVE_FAILED_TESTS=true
ARCHIVE_DIR="archives"
FAILED_TESTS_DIR="failed-tests"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 AI Task Compiler Test Cleanup${NC}"
echo "=================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
if ! command_exists jq; then
    echo -e "${RED}❌ Error: jq is required but not installed.${NC}"
    echo "Install with: brew install jq (Mac) or apt-get install jq (Linux)"
    exit 1
fi

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Create necessary directories
mkdir -p "$ARCHIVE_DIR"
mkdir -p "$FAILED_TESTS_DIR"

# Archive test results if configured
if [ "$KEEP_RESULTS" = true ]; then
    timestamp=$(date +%Y%m%d_%H%M%S)
    archive_path="$ARCHIVE_DIR/results_$timestamp"
    mkdir -p "$archive_path"
    
    if [ -d "results" ] && [ "$(ls -A results)" ]; then
        cp -r results/* "$archive_path/"
        echo -e "${GREEN}✅ Results archived to: $archive_path${NC}"
    else
        echo -e "${YELLOW}⚠️  No results to archive${NC}"
    fi
fi

# Process test runs
echo -e "\n${BLUE}Processing test runs...${NC}"
processed=0
kept=0
removed=0
archived=0

for test_dir in test-runs/*; do
    if [ -d "$test_dir" ]; then
        test_name=$(basename "$test_dir")
        # Extract test ID from directory name (format: test-001-feature-react-component)
        test_id=$(echo "$test_name" | cut -d'-' -f1,2)
        result_file="results/${test_id}-results.json"
        
        if [ -f "$result_file" ]; then
            # Get test score
            score=$(jq -r '.scores.total_score // 0' "$result_file" 2>/dev/null)
            status=$(jq -r '.status // "unknown"' "$result_file" 2>/dev/null)
            
            # Round score to integer for comparison
            score_int=$(printf "%.0f" "$score" 2>/dev/null || echo "0")
            
            echo -n "  - $test_name (score: $score_int/100) ... "
            
            if [ "$status" = "passed" ] || [ "$score_int" -ge 90 ]; then
                # Successful test
                if [ "$KEEP_SUCCESSFUL_OUTPUTS" = true ]; then
                    echo -e "${GREEN}kept (successful)${NC}"
                    ((kept++))
                else
                    rm -rf "$test_dir"
                    echo -e "${YELLOW}removed (successful)${NC}"
                    ((removed++))
                fi
            else
                # Failed test
                if [ "$ARCHIVE_FAILED_TESTS" = true ]; then
                    mv "$test_dir" "$FAILED_TESTS_DIR/"
                    echo -e "${RED}archived (failed)${NC}"
                    ((archived++))
                else
                    rm -rf "$test_dir"
                    echo -e "${RED}removed (failed)${NC}"
                    ((removed++))
                fi
            fi
            ((processed++))
        else
            echo -e "${YELLOW}⚠️  $test_name - no result file found${NC}"
        fi
    fi
done

# Clean temporary files
echo -e "\n${BLUE}Cleaning temporary files...${NC}"
find . -name "*.tmp" -delete 2>/dev/null
find . -name ".DS_Store" -delete 2>/dev/null
find . -name "*.pyc" -delete 2>/dev/null
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null

# Generate cleanup summary
echo -e "\n${BLUE}📊 Cleanup Summary${NC}"
echo "=================="
echo "Tests processed: $processed"
echo -e "Tests kept: ${GREEN}$kept${NC}"
echo -e "Tests removed: ${YELLOW}$removed${NC}"
echo -e "Tests archived: ${RED}$archived${NC}"

# Check disk usage
echo -e "\n${BLUE}💾 Disk Usage${NC}"
echo "============="
if [ -d "test-runs" ]; then
    echo -n "Test runs: "
    du -sh test-runs 2>/dev/null || echo "0"
fi
if [ -d "$FAILED_TESTS_DIR" ] && [ "$(ls -A $FAILED_TESTS_DIR)" ]; then
    echo -n "Failed tests: "
    du -sh "$FAILED_TESTS_DIR" 2>/dev/null
fi
if [ -d "$ARCHIVE_DIR" ] && [ "$(ls -A $ARCHIVE_DIR)" ]; then
    echo -n "Archives: "
    du -sh "$ARCHIVE_DIR" 2>/dev/null
fi

# Optional: Generate recommendations based on cleanup
if [ "$archived" -gt 0 ] && [ -f "results/summary.json" ]; then
    echo -e "\n${BLUE}💡 Recommendations${NC}"
    echo "=================="
    
    # Check which templates had failures
    failed_templates=$(find "$FAILED_TESTS_DIR" -maxdepth 1 -type d -name "*" | \
        grep -oE "(react-component|api-endpoint|utility|data-integration|add-types)" | \
        sort | uniq -c | sort -rn)
    
    if [ -n "$failed_templates" ]; then
        echo "Templates with most failures:"
        echo "$failed_templates" | while read count template; do
            echo "  - $template: $count failures"
        done
        echo ""
        echo "Consider reviewing and updating these templates."
    fi
fi

# Final cleanup actions
echo -e "\n${BLUE}Final cleanup actions...${NC}"

# Remove empty directories
find . -type d -empty -delete 2>/dev/null

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << EOF
# Test outputs
test-runs/
failed-tests/
archives/
*.tmp
*.pyc
__pycache__/
.DS_Store

# Keep results directory but ignore contents
results/*
!results/.gitkeep
EOF
    echo -e "${GREEN}✅ Created .gitignore${NC}"
fi

# Create results/.gitkeep to preserve directory
touch results/.gitkeep

echo -e "\n${GREEN}✅ Cleanup complete!${NC}"

# Exit with appropriate code
if [ "$archived" -gt 0 ]; then
    exit 1  # Indicate failures for CI/CD
else
    exit 0
fi