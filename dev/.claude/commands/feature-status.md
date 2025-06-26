---
description: Display status and progress of features and their work items
allowed-tools: [Read, Grep, Glob]
---

# Feature Status Report

This command displays the current status and progress of features, including work item completion statistics.

## Usage
```
/project:feature-status [feature-name] [format]
```

## Arguments
- **feature-name** (optional): Specific feature to report on. If omitted, shows all features
- **format** (optional): summary, detailed, table (default: summary)

## Implementation

### Step 1: Parse arguments and validate
```bash
FEATURE_NAME="$1"
FORMAT="${2:-summary}"

case "$FORMAT" in
  summary|detailed|table) ;;
  *) echo "❌ Error: Invalid format. Use: summary, detailed, table"; exit 1 ;;
esac
```

### Step 2: Gather feature data
If specific feature requested:
@src/project-management/features/$FEATURE_NAME.md

If all features:
@src/project-management/features/

### Step 3: Parse work items from feature files
For each feature file, extract:
- Feature name and metadata
- All work items (WI-XXX)
- Status of each work item
- Priority levels
- Agent assignments
- Dependencies

### Step 4: Calculate statistics
```bash
# For each feature:
TOTAL_ITEMS=0
COMPLETED_ITEMS=0
IN_PROGRESS_ITEMS=0
BLOCKED_ITEMS=0
PENDING_ITEMS=0

# Count work items by status
# Calculate completion percentage
# Identify bottlenecks and blockers
```

### Step 5: Generate report based on format

#### Summary Format
```bash
if [ "$FORMAT" = "summary" ]; then
  echo "📊 **Feature Status Summary**"
  echo "================================"
  
  for feature in features; do
    echo "🎯 $FEATURE_NAME"
    echo "   Progress: $COMPLETED/$TOTAL ($PERCENTAGE%)"
    echo "   Status: $STATUS"
    echo "   Priority: $PRIORITY"
    echo ""
  done
fi
```

#### Detailed Format
```bash
if [ "$FORMAT" = "detailed" ]; then
  echo "📊 **Detailed Feature Report**"
  echo "================================"
  
  for feature in features; do
    echo "🎯 **$FEATURE_NAME**"
    echo "📅 Last Updated: $LAST_UPDATED"
    echo "🎖️  Priority: $PRIORITY"
    echo "🤖 Primary Agent: $AGENT_TYPE"
    echo ""
    echo "📈 **Progress:**"
    echo "   ✅ Completed: $COMPLETED_ITEMS"
    echo "   🟡 In Progress: $IN_PROGRESS_ITEMS"
    echo "   ⬜ Pending: $PENDING_ITEMS"
    echo "   ⚠️  Blocked: $BLOCKED_ITEMS"
    echo "   📊 Overall: $PERCENTAGE% complete"
    echo ""
    
    if [ $BLOCKED_ITEMS -gt 0 ]; then
      echo "🚨 **Blocked Items:**"
      # List blocked work items with reasons
      echo ""
    fi
    
    echo "📋 **Recent Work Items:**"
    # Show last 3 work items with status
    echo ""
    echo "---"
    echo ""
  done
fi
```

#### Table Format
```bash
if [ "$FORMAT" = "table" ]; then
  echo "| Feature | Status | Progress | Priority | Agent | Blocked |"
  echo "|---------|--------|----------|----------|-------|---------|"
  
  for feature in features; do
    echo "| $FEATURE_NAME | $STATUS | $COMPLETED/$TOTAL ($PERCENTAGE%) | $PRIORITY | $AGENT | $BLOCKED_COUNT |"
  done
fi
```

### Step 6: Add actionable insights
```bash
echo ""
echo "🎯 **Next Actions:**"

# Identify highest priority pending items
# Suggest work item assignments
# Highlight dependency blockers
# Recommend focus areas

if [ $BLOCKED_ITEMS -gt 0 ]; then
  echo "⚠️  Address $BLOCKED_ITEMS blocked work items to unblock progress"
fi

if [ $HIGH_PRIORITY_PENDING -gt 0 ]; then
  echo "🔥 $HIGH_PRIORITY_PENDING high-priority items ready to start"
fi
```

### Step 7: Agent workload summary (if multiple features)
```bash
if [ -z "$FEATURE_NAME" ]; then
  echo ""
  echo "🤖 **Agent Workload:**"
  echo "   Frontend-UI: $FRONTEND_WORKLOAD work items"
  echo "   Backend-API: $BACKEND_WORKLOAD work items"
  echo "   Data-Pipeline: $DATA_WORKLOAD work items"
  echo "   Testing: $TESTING_WORKLOAD work items"
  echo "   Integration: $INTEGRATION_WORKLOAD work items"
fi
```

---

**Note:** This command provides actionable insights for project management and helps identify bottlenecks in the AI-first development workflow.