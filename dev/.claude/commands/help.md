---
description: Display help for project management slash commands
---

# Project Management Commands Help

This shows all available project management slash commands for the AI-first workflow.

## Available Commands

### 🆕 Feature Creation
```
/project:new-feature "Feature Name" [priority] [agent-type]
```
**Purpose:** Create a new feature with AI-first template and auto-generated work items  
**Example:** `/project:new-feature "User Authentication" high frontend-ui`

---

### 📝 Status Updates  
```
/project:update-status WI-XXX status [notes]
```
**Purpose:** Update work item status and track progress  
**Example:** `/project:update-status WI-050 completed "Implemented with validation"`

**Valid Statuses:**
- `pending` - ⬜ Not Started
- `in_progress` - 🟡 In Progress  
- `completed` - ✅ Completed
- `blocked` - ⚠️ Blocked
- `needs_review` - 🔄 Needs Review

---

### 📊 Progress Tracking
```
/project:feature-status [feature-name] [format]
```
**Purpose:** View feature progress and work item statistics  
**Example:** `/project:feature-status quiz-enhancement detailed`

**Formats:**
- `summary` - Quick overview (default)
- `detailed` - Full progress report
- `table` - Tabular format

---

## Quick Workflow Examples

### Starting a New Feature
```bash
# 1. Create feature
/project:new-feature "Real-time Notifications" high backend-api

# 2. Check initial status  
/project:feature-status real-time-notifications

# 3. Start first work item
/project:update-status WI-055 in_progress "Beginning API design"
```

### Tracking Progress
```bash
# Complete a work item
/project:update-status WI-055 completed "API endpoints implemented"

# Check overall progress
/project:feature-status

# Get detailed view of specific feature
/project:feature-status real-time-notifications detailed
```

---

## AI-First Features

These commands are designed for the AI-agent workflow:

✅ **Machine-parseable work items** - Compatible with future AI agent coordination  
✅ **Agent type assignments** - Ready for specialized AI agents  
✅ **Automated progress tracking** - Reduces manual project management overhead  
✅ **Standards compliance** - Follows `/src/project-management/standards/` patterns  

---

## File Structure

Commands operate on:
- **Features:** `src/project-management/features/`
- **Standards:** `src/project-management/standards/`  
- **Templates:** Uses existing feature and work item templates

---

## Getting Help

- `/project:help` - Show this help
- Check `src/project-management/standards/` for detailed patterns
- See `CLAUDE.md` for project overview

**Need more commands?** The system is designed to be extended with additional slash commands as your workflow evolves.