# Work Item Template

## Work Item Format

All work items should follow this standard format for consistency and AI-friendly parsing.

### Work Item Structure

```markdown
#### WI-[###]: [Descriptive Work Item Name]

- **Status**: [Status Icon] [Status Text]
- **Priority**: [Critical/High/Medium/Low]
- **Assignee**: [Name or "Unassigned"]
- **Files to Modify**:
  - [File path 1]
  - [File path 2]
- **Implementation Details**:
```

[Brief description of what this work item involves - 1-2 sentences]

Steps:

1. [Specific implementation step]
2. [Specific implementation step]
3. [Specific implementation step]
4. [Specific implementation step]

```
- **Acceptance Criteria**:
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]
- [ ] [Testable criterion 3]
- **Dependencies**: [Work item IDs or "None"]
- **Notes**: [Additional context, gotchas, or considerations]
```

## Field Guidelines

### Work Item ID

- **Format**: `WI-###` (WI- prefix + 3-digit number)
- **Sequence**: Sequential numbering within project
- **Example**: `WI-001`, `WI-045`, `WI-123`

### Status Icons & Text

- ⬜ **Not Started** - Initial state
- 🟡 **In Progress** - Currently being worked on
- ✅ **Completed** - Implementation finished and verified
- ⚠️ **Blocked** - Cannot proceed due to dependencies
- 🔄 **Needs Review** - Ready for code review
- ❌ **Cancelled** - Work item no longer needed

### Priority Levels

- **Critical**: Blockers, production issues, security vulnerabilities
- **High**: Important features, significant improvements
- **Medium**: Standard features, minor improvements
- **Low**: Nice-to-have features, optimizations

### Files to Modify

- List specific file paths that will be changed
- Use project-relative paths: `src/components/quiz/Quiz.tsx`
- Include new files that will be created
- Helps AI understand scope and impact

### Implementation Details

- **Description**: Brief summary of what needs to be done
- **Steps**: Specific, actionable implementation steps
- **Code blocks**: Include for complex technical details
- Keep steps focused and testable

### Acceptance Criteria

- **Testable conditions**: Each criterion should be verifiable
- **User-focused**: Written from user perspective when possible
- **Specific**: Avoid vague terms like "should work well"
- **Checkbox format**: Enables progress tracking

### Dependencies

- **Work Item IDs**: Reference other work items that must complete first
- **External Dependencies**: Third-party integrations, design assets, etc.
- **"None"**: Explicitly state when no dependencies exist

## Example Work Item

```markdown
#### WI-042: Add Product Image Zoom Functionality

- **Status**: ⬜ Not Started
- **Priority**: Medium
- **Assignee**: Unassigned
- **Files to Modify**:
  - `src/components/products/ProductImage/ProductImage.tsx`
  - `src/components/products/ProductImage/ProductImage.module.scss`
  - `src/components/products/ProductImage/ImageZoom.tsx` (new)
- **Implementation Details**:
```

Add hover-to-zoom functionality for product images in the product detail view.

Steps:

1. Create ImageZoom component with magnification on hover
2. Add zoom controls (zoom in/out buttons)
3. Implement touch support for mobile devices
4. Add loading states for high-resolution images
5. Update ProductImage to integrate ImageZoom component

```
- **Acceptance Criteria**:
- [ ] Product images zoom to 2x magnification on hover
- [ ] Zoom follows mouse cursor position
- [ ] Zoom controls work on mobile touch devices
- [ ] High-resolution images load progressively
- [ ] Zoom functionality works across all product pages
- **Dependencies**: None
- **Notes**: Consider performance impact of loading high-res images. May need lazy loading strategy.
```

## Quality Guidelines

### Good Work Items

- **Specific scope**: Clear boundaries on what's included/excluded
- **Testable outcomes**: Acceptance criteria can be verified
- **Right-sized**: Can be completed in 1-3 days of focused work
- **Clear dependencies**: Explicitly states what must be done first

### Avoid These Patterns

- **Vague descriptions**: "Improve the UI" → "Add hover states to navigation buttons"
- **Too large**: "Rewrite the entire quiz system" → Break into smaller work items
- **Untestable criteria**: "Should look good" → "Matches provided design mockup"
- **Missing dependencies**: Not noting that API changes are required first

## Integration with Project Management

### Feature Files

- Work items belong to feature files in `/src/project-management/features/`
- Group related work items under functional areas
- Include implementation progress table

### Status Tracking

- Update status icons as work progresses
- Use commit messages that reference work item IDs
- Link work items in pull request descriptions

### AI Assistance

- Clear work item format helps AI understand requirements
- Implementation steps guide AI through complex tasks
- Acceptance criteria provide verification checklist

---

**Usage**: Copy the work item template when creating new work items. Adapt the example patterns to your specific feature requirements.
