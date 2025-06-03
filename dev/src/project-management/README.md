# BigShine Display Project Management

This directory contains files for tracking and managing development work on the BigShine Display project.

## Project Structure

- `features/` - Contains detailed feature implementation files
- `docs/` - Project documentation and guides

## How To Use These Files

### For Product Managers and Stakeholders

1. **Review Features**: Browse the `features/` directory to see what's being worked on and the current status
2. **Track Progress**: Each feature file contains a progress table showing completion status
3. **Suggest Updates**: Add comments or notes in the feature files to provide feedback

### For Developers

1. **Find Work**: Select an unassigned work item from any feature file
2. **Update Status**: When working on an item, update its status to "In Progress" and add yourself as assignee
3. **Record Notes**: Document any challenges, decisions, or important context in the Notes section
4. **Follow Dependencies**: Check if your work item depends on other items before starting

### For AI Assistants

When an AI assistant is asked to work on this project, they should:

1. **Locate the Feature**: Find the relevant feature file in the `features/` directory
2. **Update Status**: Mark the work item as "In Progress" at the start, and update to "Completed" or "Needs Review" when done
3. **Document Changes**: Always note what changes were made and which files were modified
4. **Follow Code Standards**: Adhere to the project's code style guide (see memory)
5. **Update the Progress Table**: Keep the progress table at the bottom of the feature file updated

## Status Indicators

All feature files use these standard status indicators:

- ⬜ Not Started - Work has not begun
- 🟡 In Progress - Currently being implemented
- ✅ Completed - Implementation finished and verified
- ❓ Needs Review - Implementation complete but requires review
- ⚠️ Blocked - Cannot proceed due to dependencies or issues

## Priority Levels

Work items are assigned one of these priority levels:

- **Critical** - Must be completed for basic functionality
- **High** - Important for core user experience
- **Medium** - Adds significant value but not critical path
- **Low** - Nice to have, can be deferred if needed

## Suggesting New Features

To suggest a new feature:

1. Create a new file in the `features/` directory following the existing format
2. Include clear objectives, acceptance criteria, and break down the work
3. Add the feature to the main tracking list in `features/index.md`

## Workflow Recommendations

For most efficient implementation, we recommend:

1. Start with core functionality work items
2. Implement in order of dependencies
3. Group related work items together when possible
4. Test each completed work item before marking as "Completed"
