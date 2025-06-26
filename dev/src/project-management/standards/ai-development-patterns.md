# AI Development Patterns

## Overview

Practical guidelines for human-AI collaboration in development, focusing on current capabilities while maintaining structure for future enhancements.

## Human-AI Collaboration Model

### Human Responsibilities
- **Strategic Decisions**: Architecture choices, business logic, user experience decisions
- **Acceptance Criteria**: Define what "done" looks like
- **Final Verification**: Review implementation against requirements
- **Quality Gates**: Approve changes that affect core functionality

### AI Responsibilities  
- **Implementation**: Write code, create components, implement features
- **Documentation**: Generate inline docs, update README files
- **Debugging**: Identify and fix implementation issues
- **Testing**: Create tests when framework exists

## Agent Role Patterns

### Frontend Agent
- **Focus**: React/Astro components, SCSS styling, client-side functionality
- **Tools**: TypeScript, React, SCSS modules, Astro
- **Outputs**: Components, styles, client-side logic
- **Handoff**: Testing agent for verification, human for UX review

### Backend Agent
- **Focus**: Server-side logic, APIs, data processing
- **Tools**: Node.js, API frameworks, database tools
- **Outputs**: API endpoints, server logic, data transformations
- **Handoff**: Testing agent for verification, human for business logic review

### Data Agent
- **Focus**: JSON data management, schema validation, content processing
- **Tools**: JSON processing, schema validation, data transformation
- **Outputs**: Data files, schemas, migration scripts
- **Handoff**: Backend agent for integration, human for business rules

### Testing Agent (Future)
- **Focus**: Test creation, quality assurance, automated verification
- **Tools**: Jest, Playwright, testing utilities (when implemented)
- **Outputs**: Test suites, coverage reports, quality metrics
- **Handoff**: Human for acceptance verification

## Work Item Enhancement

### Simple Metadata Format
```markdown
#### WI-XXX: Feature Name

**Agent Type**: `frontend` | `backend` | `data` | `testing`  
**Complexity**: `simple` | `medium` | `complex`  
**Dependencies**: WI-001, WI-002 (if any)

**Acceptance Criteria**:
- [ ] Specific, testable requirement
- [ ] Another measurable outcome
- [ ] User-facing behavior description
```

### Complexity Guidelines
- **Simple**: Single component, minimal dependencies, 1-2 hours
- **Medium**: Multiple components, some integration, 2-6 hours  
- **Complex**: Multi-component feature, significant integration, 6+ hours

## Development Workflow

### 1. Task Planning
- Create todo list with `TodoWrite` tool
- Break complex features into smaller tasks
- Define clear acceptance criteria
- Identify dependencies

### 2. Implementation
- Mark todo as `in_progress` before starting
- Follow existing code patterns and conventions
- Use TypeScript for new code
- Import from path aliases (`@components/*`, `@utils/*`)

### 3. Verification
- Self-check against acceptance criteria
- Run linting and type checking
- Test functionality manually
- Mark todo as `completed` when done

### 4. Handoff
- Provide clear implementation summary
- Document any limitations or edge cases
- Flag items needing human review
- Update project documentation if needed

## Quality Gates

### Gate 1: Basic Functionality
- Code compiles without TypeScript errors
- Components render without crashes
- Basic functionality works as expected
- **Action if Failed**: Fix implementation issues

### Gate 2: Requirements Met  
- All acceptance criteria satisfied
- Edge cases handled appropriately
- Error states implemented
- **Action if Failed**: Refine implementation to meet requirements

### Gate 3: Integration Ready
- Works with existing codebase
- Follows established patterns
- No breaking changes to interfaces
- **Action if Failed**: Adjust for compatibility

### Gate 4: Human Review
- Business logic validation
- User experience approval
- Security considerations addressed
- **Action if Failed**: Incorporate human feedback

## Task Management Best Practices

### Todo List Usage
```typescript
// Always use TodoWrite for multi-step tasks
TodoWrite([
  { content: "Create component structure", status: "pending", priority: "high" },
  { content: "Implement core functionality", status: "pending", priority: "high" },
  { content: "Add error handling", status: "pending", priority: "medium" },
  { content: "Write documentation", status: "pending", priority: "low" }
]);
```

### Progress Tracking
- **One task in_progress** at a time
- **Mark completed immediately** after finishing
- **Update status** before moving to next task
- **Add new tasks** if scope expands during implementation

## Communication Patterns

### Clear Task Descriptions
```markdown
// Good: Specific and actionable
"Add hover zoom functionality to ProductImage component with 2x magnification"

// Poor: Vague and unclear  
"Make images better"
```

### Structured Acceptance Criteria
```markdown
- [ ] Image zooms to 2x scale on hover
- [ ] Zoom follows mouse cursor position
- [ ] Zoom resets when mouse leaves image area
- [ ] Works on both desktop and mobile devices
```

## Future Evolution

### When to Add Complexity
- **Multi-agent coordination**: When multiple developers work simultaneously
- **Automated testing**: When test framework is implemented
- **Advanced pipelines**: When CI/CD infrastructure is established

### Gradual Enhancement
- Start with current simple patterns
- Add automation only when manual processes break down
- Maintain backward compatibility with existing workflows
- Document changes and rationale

## Tool Integration

### Current Tools
- **TodoWrite/TodoRead**: Task management and progress tracking
- **Path Aliases**: Clean imports (`@components/*`, `@config/*`)
- **TypeScript**: Type safety and better AI assistance
- **SCSS Modules**: Component-scoped styling

### Future Tools (When Implemented)
- **Testing Framework**: Automated verification of acceptance criteria
- **CI/CD Pipeline**: Automated quality gates and deployment
- **Performance Monitoring**: Automated performance regression detection

---

**Philosophy**: Start simple, add complexity only when needed. Focus on practical patterns that improve development velocity while maintaining code quality.