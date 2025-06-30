---
description: Architectural decisions and planning using project-wide context via RAG
allowed-tools: [bash]
---

# Architecture Assistant

Make informed architectural decisions using comprehensive project context. Gemini will analyze your requirements against existing patterns, data structures, and system architecture to recommend optimal implementations.

## Usage Examples
- `architect "How should I implement the new filter feature?"`
- `architect "Best approach for adding user authentication?"`
- `architect "Recommended pattern for blog post management?"`

This command provides:
- Integration strategies with existing systems
- Data flow recommendations
- Component architecture suggestions
- Performance considerations
- Scalability implications
- Consistency with established patterns

! /Users/kristoffersanio/git/bs-display/dev/rag/gemini_rag_clean.sh query --query "ARCHITECTURE ANALYSIS for BS Display project: $ARGUMENTS"