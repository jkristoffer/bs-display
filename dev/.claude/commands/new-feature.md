---
description: Create a new feature using AI-first template with automatic work item generation
allowed-tools: [Read, Write, Edit, Glob]
---

# Create New Feature

This command creates a new feature file using the AI-first template and automatically updates the feature index.

## Usage
```
/project:new-feature "Feature Name" [priority] [agent-type]
```

## Arguments
- **Feature Name** (required): Descriptive name for the new feature
- **priority** (optional): critical, high, medium, low (default: medium)
- **agent-type** (optional): frontend-ui, backend-api, data-pipeline, testing, integration

## Implementation

### Step 1: Generate feature file name and validate inputs
```bash
FEATURE_NAME="$1"
PRIORITY="${2:-medium}"
AGENT_TYPE="$3"
DATE=$(date +%Y-%m-%d)

if [ -z "$FEATURE_NAME" ]; then
  echo "❌ Error: Feature name is required"
  echo "Usage: /project:new-feature \"Feature Name\" [priority] [agent-type]"
  exit 1
fi

# Convert to kebab-case for filename
FILENAME=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
FILEPATH="src/project-management/features/${FILENAME}.md"

if [ -f "$FILEPATH" ]; then
  echo "❌ Error: Feature file already exists: $FILEPATH"
  exit 1
fi
```

### Step 2: Read feature template
@src/project-management/features/feature-template.md

### Step 3: Generate next work item ID
Find the highest existing WI-XXX ID across all feature files and increment by 1.

### Step 4: Create feature file with populated template
Replace template variables:
- `[Feature Name]` → "$FEATURE_NAME"
- `[Date]` → "$DATE"
- `[Priority]` → "$PRIORITY"
- Add AI-agent metadata if agent-type specified

### Step 5: Add initial work items based on feature type
Generate 2-3 starter work items appropriate for the assigned agent type:

**Frontend-UI Agent:**
- Component structure setup
- Styling implementation
- User interaction handling

**Backend-API Agent:**
- API endpoint definition
- Data model creation
- Business logic implementation

**Data-Pipeline Agent:**
- Data schema design
- Transformation logic
- Validation rules

### Step 6: Update features index
@src/project-management/features/index.md

Add new entry to "Current Features In Development" table.

### Step 7: Success message
```bash
echo "✅ Created feature: $FEATURE_NAME"
echo "📁 File: $FILEPATH"
echo "🎯 Priority: $PRIORITY"
if [ -n "$AGENT_TYPE" ]; then
  echo "🤖 Assigned Agent: $AGENT_TYPE"
fi
echo ""
echo "Next steps:"
echo "1. Review and customize work items in $FILEPATH"
echo "2. Use /project:update-status to track progress"
echo "3. Use /project:feature-status to check progress"
```

---

**Note:** This command follows the AI-first standards defined in `/src/project-management/standards/` and automatically generates machine-parseable work items for future AI agent coordination.