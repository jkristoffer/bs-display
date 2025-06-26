---
description: Update the status of a work item across all feature files
allowed-tools: [Read, Write, Edit, Grep, Glob]
---

# Update Work Item Status

This command finds and updates the status of a work item (WI-XXX) across all feature files.

## Usage
```
/project:update-status WI-XXX status [notes]
```

## Arguments
- **WI-XXX** (required): Work item ID in format WI-001, WI-042, etc.
- **status** (required): pending, in_progress, completed, blocked, needs_review
- **notes** (optional): Additional notes about the status change

## Implementation

### Step 1: Validate inputs
```bash
WORK_ITEM_ID="$1"
STATUS="$2"
NOTES="$3"
DATE=$(date +%Y-%m-%d)

if [ -z "$WORK_ITEM_ID" ] || [ -z "$STATUS" ]; then
  echo "❌ Error: Work item ID and status are required"
  echo "Usage: /project:update-status WI-XXX status [notes]"
  exit 1
fi

# Validate work item ID format
if ! echo "$WORK_ITEM_ID" | grep -q "^WI-[0-9]\{3\}$"; then
  echo "❌ Error: Invalid work item ID format. Use WI-XXX (e.g., WI-001)"
  exit 1
fi

# Validate status
case "$STATUS" in
  pending|in_progress|completed|blocked|needs_review) ;;
  *) echo "❌ Error: Invalid status. Use: pending, in_progress, completed, blocked, needs_review"; exit 1 ;;
esac
```

### Step 2: Find work item location
Search all feature files for the work item ID:

@src/project-management/features/

Use grep to find which file contains the work item:
```bash
FEATURE_FILE=$(grep -l "$WORK_ITEM_ID" src/project-management/features/*.md | head -1)

if [ -z "$FEATURE_FILE" ]; then
  echo "❌ Error: Work item $WORK_ITEM_ID not found in any feature file"
  exit 1
fi
```

### Step 3: Map status to icons and text
```bash
case "$STATUS" in
  pending) STATUS_DISPLAY="⬜ Not Started" ;;
  in_progress) STATUS_DISPLAY="🟡 In Progress" ;;
  completed) STATUS_DISPLAY="✅ Completed" ;;
  blocked) STATUS_DISPLAY="⚠️ Blocked" ;;
  needs_review) STATUS_DISPLAY="🔄 Needs Review" ;;
esac
```

### Step 4: Update work item status
Find the work item section and update:
- Status line: `- **Status**: $STATUS_DISPLAY`
- Add timestamp and notes if provided
- Update progress table if it exists

### Step 5: Check for dependency notifications
If status is "completed", check if other work items depend on this one and notify about unblocking.

### Step 6: Update feature progress
Recalculate feature completion percentage and update any progress indicators.

### Step 7: Success message
```bash
echo "✅ Updated $WORK_ITEM_ID status to: $STATUS_DISPLAY"
echo "📁 File: $FEATURE_FILE"
echo "📅 Updated: $DATE"
if [ -n "$NOTES" ]; then
  echo "📝 Notes: $NOTES"
fi

# Show feature progress
FEATURE_NAME=$(basename "$FEATURE_FILE" .md)
echo ""
echo "🎯 Feature Progress:"
# Calculate and display completion stats
```

---

**Note:** This command maintains consistency with the work item template format and automatically updates progress tracking for the feature.