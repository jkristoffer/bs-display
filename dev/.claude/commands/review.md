---
description: Code review against project standards and patterns using RAG
allowed-tools: [bash]
---

# Code Review Assistant

Perform comprehensive code reviews using project-wide context. Gemini will analyze your code against existing patterns, functional programming standards, and project conventions defined in CLAUDE.md.

## Usage Examples
- `review "ProductCard component for functional programming standards"`
- `review "Quiz component TypeScript interfaces"`
- `review "SCSS modules in FilterUI component"`

This command provides:
- Consistency checking against existing patterns
- Functional programming compliance analysis
- TypeScript best practices validation
- Component architecture recommendations
- Integration suggestions with existing systems

! python3 /Users/kristoffersanio/git/bs-display/dev/rag/gemini_rag_cli.py query --query "CODE REVIEW for BS Display project: $ARGUMENTS"